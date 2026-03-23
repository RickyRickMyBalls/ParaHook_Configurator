# Three Viewier

## Doc Header

### Doc History
1. 2026-03-22 23:28: Created this planning doc under `View-Toolbar` to capture the full practical settings surface available to the current ParaHook Three.js viewer stack, separating already-shipped controls, runtime seams that already exist but are not yet exposed, and broader future settings the current `PerspectiveCamera` + `OrbitControls` + `WebGLRenderer` + helper-overlay architecture could support later

### Purpose

This file is the broad settings inventory for the ParaHook Three.js viewer.

Use it to answer:
- what viewer settings already exist in `/20`
- what the runtime already supports but the toolbar does not expose yet
- what settings this viewer architecture could support later without changing the core product direction
- which settings belong in `View Toolbar`
- which settings should also be reachable from `Console`

### How To Use This File

- use `Current Live Settings` to see what the current shipped viewer already exposes
- use `Runtime Seams Already Present` to see what the code can already do but the toolbar does not yet surface
- use `Possible Settings Inventory` as the larger design menu for future `View Toolbar` growth
- use `Suggested Priority` to decide what should return first

### Scope Note

This doc is about the viewer settings surface for the current ParaHook Three.js stack.

It is mainly grounded in the current runtime pieces:
- `Viewer.ts`
- `CameraController.ts`
- `AxisGizmo.ts`
- `viewSettingsTypes.ts`
- `ViewToolbar.tsx`

It is not trying to catalog every conceivable Three.js option in the abstract.
It is a practical planning list for settings this viewer architecture can realistically own.

## Doc Body

### Short Version

The current viewer already has a first settings surface for:
- camera presets
- grid on/off
- axes on/off
- shadows on/off
- wireframe on/off
- tone mapping
- exposure
- environment preset
- axis overlay on/off
- light editing
- material presets

But the viewer stack could support far more.

The biggest missing settings families are:
- real projection mode
- richer camera framing and lens settings
- richer grid settings
- background and environment settings
- orientation-gizmo tuning
- camera-feel tuning
- render and display quality controls
- selection and highlight styling

### Current Viewer Stack

Current main pieces:

- `PerspectiveCamera`
- `OrbitControls`
- `WebGLRenderer`
- scene background color switching
- grid line helpers
- `AxesHelper`
- overlay `AxisGizmo`
- configurable scene lights
- configurable material presets
- sketch and viewer overlays

Current architectural implication:
- most future settings should be modeled as viewer-owned state, then surfaced through both `View Toolbar` and `Console`

### Current Live Settings

These are already visible or persisted in the current `/20` viewer flow.

#### [x] Camera / View Basics

- camera preset:
  - `Iso`
  - `Top`
  - `Front`
  - `Left`
  - `Right`
- `Frame`
- `Frame All`
- orbit enabled

#### [x] View Display Basics

- grid visible
- axes visible
- shadows enabled
- wireframe enabled
- axis overlay enabled
- tone mapping
- exposure
- environment preset:
  - `none`
  - `studio`

#### [x] Lighting

- light add/remove
- light enable/disable
- light type:
  - `Directional`
  - `Point`
  - `Spot`
  - `Hemisphere`
  - `Ambient`
- light name
- light color
- light intensity
- light position when supported
- light target when supported
- light distance/decay when supported
- spot angle
- spot penumbra
- shadow casting
- shadow bias
- shadow map size

#### [x] Materials

- material preset add/remove
- preset name
- color
- metalness
- roughness
- emissive color
- emissive intensity
- opacity
- transparent flag
- per-part material assignment

#### [x] Transform Gizmo

- gizmo enabled
- gizmo mode:
  - `Move`
  - `Rotate`
  - `Scale`
- gizmo space:
  - `Local`
  - `World`
- translate snap
- rotate snap
- scale snap

### Runtime Seams Already Present

These are real runtime seams that exist in the current code or very near adjacent code, even if the current toolbar does not expose them fully yet.

#### [~] Camera Framing / Navigation

- `framePrevious`
- `frameExtents`
- `frameReference`
- `frameGeometrySketch`
- direct snap-to-direction
- temporary pan drag
- temporary orbit drag
- console-owned camera mode:
  - `pan`
  - `orbit`
- camera transition animation duration seam

#### [~] Camera Feel

The current `CameraController` already has real values for:

- damping enabled
- damping factor
- rotate speed
- zoom speed
- pan speed
- left-button orbit enable
- mouse-button bindings

Those are currently code-owned defaults, but they are natural future settings.

#### [~] Camera Frustum

The current viewer already changes:

- `near`
- `far`
- `fov`
- `aspect`

This means user-facing control over lens/frustum behavior is feasible.

#### [~] Background / Environment

The current viewer already owns:

- plain background color
- the current `studio` versus default background swap

This means richer background and environment controls are straightforward follow-ons.

### Core Rule For Future Growth

Every setting added here should be classified one of three ways:

- `always visible`
  - important daily controls like projection, fit, grid, and background
- `advanced view settings`
  - controls users may tune sometimes, like clipping, damping, helper size, or render quality
- `developer / experiment settings`
  - controls that are real but should not clutter the normal `View Toolbar`

And:

- major settings should have both toolbar and console access
- low-level tuning can remain in advanced sections if needed

### Possible Settings Inventory

This is the full practical planning list for the current viewer architecture.

#### [ ] Projection

- projection mode:
  - `Perspective`
  - `Orthographic`
- perspective preset / `ParaSelect`
- perspective `FOV`
- orthographic zoom scale
- per-mode reset behavior
- remember last perspective lens settings
- remember last orthographic scale settings

#### [ ] Camera Framing

- `Frame`
- `Frame All`
- `Frame Extents`
- `Frame Previous`
- `Frame Selected`
- `Frame Reference`
- `Reset`
- fit padding / fit margin
- default startup view
- view transition duration
- view transition easing mode

#### [ ] Standard Views

- `Top`
- `Bottom`
- `Front`
- `Back`
- `Left`
- `Right`
- `Iso`
- custom saved views
- named view slots

#### [ ] Camera Feel / Navigation

- orbit enabled
- pan enabled
- zoom enabled
- left mouse orbit policy
- middle mouse pan policy
- right mouse action policy
- wheel zoom speed
- pan speed
- orbit speed
- damping enabled
- damping factor
- zoom toward cursor on/off
- invert wheel direction
- invert orbit X
- invert orbit Y
- camera mode families if wanted later:
  - `Orbit`
  - `Trackball`
  - `Arcball`
- inertia amount
- decay amount
- roll `+90`
- roll `-90`
- spin on/off
- spin speed
- zoom-stops-inertia on/off

#### [ ] Camera Frustum / Clipping

- near clip distance
- far clip distance
- auto clip range on/off
- clip padding around framed content
- camera target / pivot mode:
  - selection center
  - world origin
  - last framed object

#### [ ] Background

- background mode:
  - `Dark`
  - `Light`
  - `Studio`
  - `Gradient`
  - `Custom Color`
- background color
- background gradient top color
- background gradient bottom color
- background brightness
- background alpha if transparent export/view is ever wanted

#### [ ] Environment / Scene Modes

- environment preset list
- environment intensity
- environment rotation
- environment blur / roughness influence
- optional scene modes if they still fit the product:
  - `Stars`
  - `Nebula`
  - `Swarm`
- scene-specific parameter groups if those special modes return

#### [ ] Grid

- grid visible
- grid master opacity
- infinite versus bounded grid
- grid extent / size
- grid center mode:
  - `Origin`
  - `Model`
  - later active-workplane center if needed
- grid `Z` offset
- workplane-aligned grid handoff
- snap-to-grid on/off
- grid unit display
- origin marker at grid center

#### [ ] Grid Layers

- `+ Add Grid Lines`
- remove grid-line layer
- enable/disable per layer
- rename per layer if you want friendly names later
- ordered fallback ids like:
  - `gridlines_1`
  - `gridlines_2`
  - `gridlines_3`
- per-layer spacing
- per-layer opacity
- per-layer thickness if you later use a line system that supports it
- per-layer color
- per-layer axis-specific colors
- reorder layers if render/read priority matters
- duplicate layer
- save/load layer presets

#### [ ] Axes / Helpers

- axes helper visible
- axes helper size
- axes helper colors
- origin marker visible
- origin marker size
- origin marker color
- world-axis labels visible
- helper opacity

#### [ ] Orientation Gizmo

- orientation gizmo visible
- gizmo viewport size
- gizmo placement:
  - top right
  - top left
  - bottom right
  - bottom left
- gizmo line opacity
- gizmo sphere size
- gizmo text size
- gizmo text visibility
- gizmo click targets / snap enable
- gizmo corner/isometric snaps
- gizmo padding from viewport edge

#### [ ] Lighting

- light collection visibility/state
- add/remove/reorder lights
- light enable/disable
- light naming
- light grouping if needed later
- light color
- light intensity
- light position
- light target
- point/spot distance
- point/spot decay
- spot angle
- spot penumbra
- hemisphere sky/ground colors
- cast shadow
- shadow bias
- shadow normal bias
- shadow map size
- shadow softness / shadow algorithm choice if widened later

#### [ ] Materials / Shading

- shading mode:
  - `Shaded`
  - `Wireframe`
  - later `X-Ray`
  - later `Clay`
- selected material preset
- preset color
- metalness
- roughness
- emissive color
- emissive intensity
- opacity
- transparency
- per-part assignment
- edge overlay if added later
- hidden-edge rendering if added later

#### [ ] Selection / Highlight

- selected object tint color
- selected object emissive color
- selected object highlight intensity
- hovered object tint color
- hovered object highlight opacity
- reference-lock highlight style
- sketch hovered/selected line colors
- sketch profile colors
- selection-window colors

#### [ ] Sketch Overlay / Authoring Helpers

- sketch grid visibility
- sketch grid opacity
- sketch crosshair size
- snap symbol size
- snap symbol type
- start-point visibility
- polyline point visibility
- selection-window line thickness or opacity
- ghost plane scale
- sketch origin gizmo size

#### [ ] Render / Quality

- antialiasing on/off
- render pixel ratio / render scale
- tone mapping mode
- exposure
- color space choice if widened later
- shadow map enabled
- shadow map quality
- shadow type
- render resolution presets for screenshots
- screenshot transparent background
- screenshot supersampling

#### [ ] Performance / Debug

- FPS readout
- helper bounds display
- draw-call / triangle stats display
- auto quality limit based on device
- force low-quality mode
- pause expensive background scenes
- culling / helper debug toggles if needed later

#### [ ] Input / Interaction

- command versus pointer priority policy
- double-click action
- middle-click double-click action
- keyboard shortcut aliases for view commands
- mouse-button remapping
- modifier remapping for orbit/pan
- console ownership over active camera mode

#### [ ] Persistence / Presets

- save current view settings preset
- restore saved view settings preset
- per-workspace view preset
- per-document view preset
- reset to project defaults
- reset one settings section only

### Suggested Priority

If this expands from the current toolbar in the safest order, the strongest sequence is:

1. projection mode
2. `FOV` and orthographic zoom
3. reset / rear / bottom / back / fuller standard views
4. richer background controls
5. real grid section with grid-line layers
6. orientation-gizmo tuning
7. camera feel tuning
8. render-quality and selection-style tuning

Reason:
- the first six change the viewer experience the most without turning the toolbar into a debug dump

### Console Alignment Rule

The following settings families should be reachable from `Console` as well as the visible toolbar:

- projection
- view jumps
- fit/reset/framing
- `FOV`
- orthographic zoom
- background mode
- grid visibility
- grid layer add/remove/tune
- helper/gizmo visibility
- major camera-feel toggles if they remain user-facing

### Open Questions

#### [ ] `q1` Which settings are core user-facing controls versus advanced tuning only?

#### Suggestion

Keep the first visible toolbar focused on:
- projection
- framing
- grid
- background
- helpers

Push deeper light/material/render tuning into collapsible advanced sections unless the user is actively editing those families.

#### [ ] `q2` Should material and lighting stay inside the same `View` toolbar long-term?

#### Suggestion

They can remain here for now, but they may eventually deserve a more explicit `Render` or `Look` surface if the toolbar gets too broad.

#### [ ] `q3` How much legacy camera-feel complexity should return?

#### Suggestion

Bring back only the controls that improve day-to-day authoring clarity first.
Do not revive every legacy motion toggle automatically just because Three.js can support it.

### Done Means

This doc is doing its job when:

- ParaHook has one broad inventory of viewer settings possibilities
- the current shipped settings are clearly separated from future ones
- `View Toolbar` planning can choose from a stable menu instead of rediscovering options every time
- `Console` alignment for those settings is explicit
