# Camera Controls Index

## Doc Header

### Doc History
7. 2026-03-22 12:32: Reworked this moved file into the `Camera-Controls` family index, aligned the phase section to the new `[5.0H]` roadmap family, and made the folder-root doc read as the canonical umbrella surface instead of the older single-file note path
6. 2026-03-22 12:16: Added a phased rollout section at the bottom of the camera-controls architecture note, breaking the overall camera/input cleanup into the smallest safe implementation sequence across viewport ownership, Fusion-style model gestures, graph-canvas coexistence, console view commands, and the later shared owner model for gizmos and view tools
5. 2026-03-22 12:16: Added the first AutoCAD-style camera-console suggestions, so the architecture note now recommends a `ZOOM` / `Z` console family with sub-options like `All`, `Extents`, `Previous`, `Window`, and `Object`, plus simple `PAN` and `ORBIT` view commands
4. 2026-03-22 12:16: Added the cross-surface pass-through suggestion for combined graph-plus-model work, so the camera-controls note now recommends that the `Spaghetti Editor` canvas own its normal zoom/pan/edit input by default while `Ctrl` acts as the explicit modifier for forwarding zoom/pan/orbit gestures to the model viewport
3. 2026-03-22 11:53: Added the `Spaghetti Editor` canvas rule so graph-canvas navigation is now explicitly separated from model-view camera navigation, preserving pointer-centered canvas zoom and canvas pan while preventing model camera controls from stealing input when the user is working inside the node canvas
2. 2026-03-22 11:53: Locked the preferred baseline gesture map toward Fusion-style navigation, so scroll now reads as mouse-point zoom, `MMB` drag reads as pan, `Shift + MMB` drag reads as orbit, and `MMB` double-click reads as zoom-fit while plain `LMB` remains reserved for authoring interactions
1. 2026-03-22 11:53: Created this architecture doc to define camera-control ownership and input-priority rules across orbit navigation, sketch/entity selection, gizmo interactions, and the view toolbar, after `Sketch Draw` box selection exposed that the current plain-click viewport path is still too camera-first

### Purpose

This doc defines the architecture direction for camera controls and viewport input ownership.

This file is the umbrella index for the `Camera-Controls` family.

Use it to answer:
- when camera navigation should own viewport pointer input
- when tools like `Sketch Draw` should own viewport pointer input instead
- how gizmos, view-toolbar actions, and camera gestures should coexist
- what the fallback priority order should be when multiple systems want the same pointer event
- how to stop orbit camera from stealing left-click and drag interactions that belong to authoring tools
- how the camera-controls family maps into the roadmap

### Family Structure

Use this folder like this:

- `Camera_Controls-Index.md`
  - umbrella architecture direction
  - roadmap-family summary
  - current phase checklist index
- `Future/`
  - later standalone camera-controls execution docs if the family needs them
- `Shipped/`
  - later shipped records for completed camera-controls cuts if the family grows enough to justify them

Current roadmap home:
- `[5.0H] Camera Controls And View Input Ownership`
- `[5.0H-1] Sketch Draw Camera Blocking`
- `[5.0H-2] Fusion-Style Model Viewport Camera Baseline`
- `[5.0H-3] Spaghetti Canvas And Model Viewport Coexistence`
- `[5.0H-4] Camera Console Commands`
- `[5.0H-5] Shared View Input Owner Model`

### Why This Doc Exists

ParaHook now has multiple viewport behaviors competing for the same pointer input:
- orbit camera navigation
- sketch drawing
- sketch entity selection
- future move/edit gizmos
- view-toolbar camera shortcuts

That was tolerable when the model viewer was mostly camera-first, but it becomes a real blocker once the user needs CAD-like viewport authoring.

The immediate proof is `Sketch Draw`:
- idle `Sketch Draw` should allow click selection
- idle `Sketch Draw` should allow box selection
- draw tools should own left click while active

But right now orbit behavior still grabs too much of the plain viewport interaction path, which makes the shipped `DS-3` selection work hard to test correctly.

This doc exists to define one clear ownership order before more viewport interactions grow ad hoc.

### Scope

This doc covers:
- viewport pointer ownership
- camera navigation gesture rules
- the relationship between camera controls and sketch/entity tools
- the relationship between camera controls and future gizmos
- the relationship between camera controls and view-toolbar camera actions
- the recommended fallback priority order

This doc does not cover:
- final camera feel tuning
- exact smoothing / damping values
- final keybinding customization UI
- all future modeling tools in detail

## Doc Body

### Short Version

Camera controls should be the fallback viewport behavior, not the default winner for every plain click.

Recommended rule:
- explicit tool interaction wins first
- explicit gizmo interaction wins next
- explicit view-toolbar interaction wins next
- camera navigation only wins when no higher-priority viewport interaction owns the event

Critical first correction:
- plain `LMB` inside `Sketch Draw` should belong to sketch interaction, not orbit camera

So:
- `Sketch Draw` active tool:
  - plain `LMB` owns draw placement
- `Sketch Draw` idle:
  - plain `LMB` owns entity click selection and box selection
- camera orbit should move to:
  - `MMB`
  - or `Alt + LMB`
  - or another clearly intentional navigation gesture

### Core Problem

The current viewer behavior still reads too much like:
- viewport pointer input belongs to the camera
- tools borrow it opportunistically

But CAD-style authoring needs the reverse:
- viewport pointer input belongs to the active authoring interaction
- camera navigation is what happens when no authoring interaction is claiming the event

That inversion matters because:
- `Sketch Draw` needs click and drag
- later move/edit gizmos need click and drag
- entity selection needs click and drag
- box selection needs uninterrupted drag ownership

If camera orbit remains the default plain-drag owner, every new authoring tool will keep fighting the same underlying problem.

### Recommended Ownership Model

Use one viewport input-priority stack.

Suggested order:

1. `Modal Tool Interaction`
   - active sketch draw point placement
   - active sketch selection window drag
   - active transform / move / rotate gizmo drag
   - any other active tool-owned drag session
2. `Direct Viewport Control Widgets`
   - gizmo handles
   - in-viewport toolbar controls
   - explicit camera cube / axis widget clicks
3. `Session Idle Tool Selection`
   - idle `Sketch Draw` entity click selection
   - idle `Sketch Draw` box selection
   - later idle edit-tool hit testing
4. `Camera Navigation`
   - orbit
   - pan
   - zoom
5. `Passive Hover`
   - hover highlights
   - status readout

Important rule:
- camera navigation should only begin if levels `1` through `3` do not claim the interaction

### Camera Gesture Direction

Recommended baseline:

- `LMB`
  - reserved for authoring/selecting when a viewport tool/session is active
- `MMB`
  - pan while held
- `Shift + MMB`
  - orbit while held
- `Wheel`
  - zoom
  - scroll up = zoom in
  - scroll down = zoom out
  - zoom should bias toward where the mouse is pointing
- `MMB` double-click
  - zoom fit / fit to visible content

Reason:
- plain `LMB` is the most valuable authoring input
- Fusion-style navigation is a stronger fit here because it keeps authoring click/drag clean while preserving fast camera movement

### Baseline Gesture Table

Use this as the default working map:

- `Scroll Up`
  - zoom in toward the mouse position
- `Scroll Down`
  - zoom out from the mouse position
- `MMB Down + Drag`
  - pan
- `Shift + MMB Down + Drag`
  - orbit
- `MMB Double Click`
  - zoom fit

Important rule:
- these camera gestures should still lose to higher-priority explicit widget ownership when the pointer starts on a gizmo handle, view widget, or another direct viewport control

### Sketch Draw Rules

When `geometrySketchSession.mode === 'draw'`:

- active draw tool:
  - plain `LMB` belongs to the active sketch tool
  - camera orbit must not start from that same press/drag path
- idle draw:
  - plain `LMB` click belongs to entity selection
  - plain `LMB` drag belongs to `Window` / `Crossing` selection
  - camera orbit must not start from that same press/drag path

Recommended simple rule:
- while `Sketch Draw` is open, camera orbit should require a non-conflicting navigation gesture

That is the minimum change needed to make viewport-first sketch authoring feel honest.

### Gizmo Rules

Future gizmo interactions should follow the same ownership model.

When a gizmo handle is hovered and pressed:
- the gizmo owns the pointer stream
- camera orbit must not steal that drag

When a gizmo session is active:
- camera controls should be suspended for that pointer interaction
- hover/highlight may continue for non-owning systems only after release

This means gizmos should not be treated like a special exception later.
They should plug into the same shared viewport ownership stack.

### View Toolbar Rules

The `View` toolbar should be treated as an explicit camera-command surface, not as a rival plain-drag owner.

Good toolbar ownership:
- `Align View`
- standard view jumps
- fit / focus / zoom extents
- camera mode toggles if they exist later

Bad toolbar ownership:
- silently changing the plain `LMB` meaning without obvious mode feedback

Recommendation:
- use the toolbar for explicit camera commands
- use the viewport gesture system for continuous camera navigation
- do not let toolbar presence weaken tool-owned pointer behavior

### Camera Console Suggestions

ParaHook should also expose a small camera/view console surface instead of relying only on mouse gestures.

Recommended first direction:
- use an AutoCAD-style `ZOOM` family
- keep the first tokens short and command-line friendly
- let mouse gestures and console commands both control the same view system

Suggested first commands:

- `z > a`
  - `Zoom All`
- `z > e`
  - `Zoom Extents`
- `z > p`
  - `Zoom Previous`
- `z > w`
  - `Zoom Window`
- `z > o`
  - `Zoom Object`
  - should support:
    - preselect object, then run the command
    - or run the command, then select object
- `pan`
  - enter or trigger pan behavior
- `orbit`
  - enter or trigger orbit behavior

Recommended aliases:
- `zoom`
  - full command
- `z`
  - short alias
- `pan`
- `orbit`

Important rule:
- console camera commands should target the active view surface
- if the model viewport is the active camera surface, these commands should act there
- if the graph canvas is active, graph-canvas zoom/pan commands should stay distinct rather than pretending the graph canvas is the same thing as 3D camera orbit

Good first scope:
- ship:
  - `z > a`
  - `z > e`
  - `z > p`
  - `z > w`
  - `z > o`
  - `pan`
  - `orbit`
- leave deeper view-state history and saved named views for later

### Spaghetti Editor Canvas Rules

The `Spaghetti Editor` canvas is not the same thing as the model-view camera surface.

Important distinction:
- the graph canvas is a 2D editing surface
- the model viewer is the 3D camera surface

So when the user is actively working in the graph canvas:
- graph-canvas navigation should win
- model-view camera controls should not steal that same input path

Recommended canvas behavior:

- `Scroll`
  - zoom the graph canvas toward the mouse position
- `MMB Down + Drag`
  - pan the graph canvas
- plain `LMB`
  - keep graph editing ownership:
    - node selection
    - box selection
    - drag/move
    - wiring interactions

Critical rule:
- while the pointer is over the active graph canvas, the model-view camera should not start orbit/pan/zoom from those same gestures

Current code truth:
- the graph canvas already behaves like a separate zoom/pan surface more than a model camera surface
- wheel zoom is already pointer-centered in the canvas
- empty-background drag already pans the canvas
- there is also an expanded-view temporary viewer-orbit path today

Recommended direction:
- keep the canvas as its own navigation surface
- do not make the graph canvas inherit model-camera gestures by default
- if a temporary handoff to the model viewer is kept in expanded view, it should stay explicit and clearly secondary to canvas ownership

Preferred consistency rule:
- graph canvas uses graph-navigation gestures
- model viewer uses camera-navigation gestures
- the user should not have to guess which surface owns the pointer

### Optional Cross-Surface Bridge

If ParaHook wants to let the user work in the graph canvas and still quickly affect the model viewport without moving the pointer off the canvas, use one explicit pass-through modifier.

Recommended bridge:

- while hovering the active graph canvas:
  - normal input stays canvas-local
  - `Ctrl + Scroll`
    - forward zoom to the model viewport instead of the canvas
  - `Ctrl + MMB Down + Drag`
    - forward pan to the model viewport
  - `Ctrl + Shift + MMB Down + Drag`
    - forward orbit to the model viewport

Why this is cleaner:
- the canvas still clearly owns input by default
- the model viewport still remains reachable without pointer travel
- the user gets one explicit modifier that means:
  - "talk to the model viewport through the canvas"

Important rule:
- do not make plain `MMB` on the canvas control the model viewport by default
- that would weaken canvas ownership and make the active surface feel ambiguous again

### State Model Recommendation

Longer term, the viewer should expose one resolved viewport input owner, something like:

- `none`
- `camera`
- `sketch-draw-tool`
- `sketch-draw-selection`
- `gizmo`
- `view-widget`

The important point is not the exact enum.
The important point is that the viewer resolves one owner before drag behavior begins.

That would let ParaHook:
- gate camera start cleanly
- debug ownership conflicts faster
- make future tool growth less fragile

### First Cleanup Direction

Near-term cleanup recommendation:

1. stop plain orbit from winning inside `Sketch Draw`
2. make `Sketch Draw` own plain `LMB` click/drag while its session is active
3. move camera navigation onto the Fusion-like baseline:
   - `MMB` drag = pan
   - `Shift + MMB` drag = orbit
   - wheel = mouse-point zoom
   - `MMB` double-click = zoom fit
4. keep view-toolbar camera commands explicit and separate
5. reuse the same ownership rules when gizmo editing lands

### Still Needed Decisions

- should `zoom fit` frame all visible authored content, only the active graph/model target, or the selected object when one exists
- should camera navigation be partially disabled only in `Sketch Draw`, or in any active authoring surface
- should there be a visible camera-mode indicator when alternate navigation modes are active
- should the resolved viewport input owner be surfaced in debug UI

### Current Recommendation

Use this as the working direction:

- camera controls are fallback navigation controls
- authoring tools and gizmos are primary viewport owners
- plain `LMB` belongs to active authoring sessions
- use a Fusion-like navigation baseline:
  - scroll = mouse-point zoom
  - `MMB` drag = pan
  - `Shift + MMB` drag = orbit
  - `MMB` double-click = zoom fit
- `Sketch Draw` is the first system that should force this cleanup, not a one-off exception


## Phases

### [ ] `[5.0H-1]` - `Sketch Draw Camera Blocking`

CheckList:
- [ ] stop plain camera orbit/pan from stealing `LMB` click or drag inside idle `Sketch Draw`
- [ ] stop plain camera orbit/pan from stealing `LMB` click or drag while a sketch draw tool is active
- [ ] make idle `Sketch Draw` reliably own:
  - click selection
  - window selection
  - crossing selection
- [ ] keep non-conflicting camera navigation available through intentional alternate gestures during sketch work
- [ ] verify `DS-3` selection and delete can be tested end to end without orbit interference

### [ ] `[5.0H-2]` - `Fusion-Style Model Viewport Camera Baseline`

CheckList:
- [ ] change model viewport wheel behavior to consistent mouse-point zoom
- [ ] change model viewport `MMB` drag to pan
- [ ] change model viewport `Shift + MMB` drag to orbit
- [ ] add `MMB` double-click zoom-fit behavior
- [ ] define the first zoom-fit target rule:
  - visible model content
  - selected object
  - or active target
- [ ] verify the new gesture map does not break current authoring interactions

### [ ] `[5.0H-3]` - `Spaghetti Canvas And Model Viewport Coexistence`

CheckList:
- [ ] preserve graph-canvas pointer-centered wheel zoom
- [ ] preserve graph-canvas pan behavior on the canvas surface
- [ ] preserve plain `LMB` graph editing ownership on nodes, wires, and empty-canvas interactions
- [ ] explicitly prevent model-camera gestures from stealing default canvas navigation/edit input
- [ ] add the optional `Ctrl` pass-through bridge:
  - [ ] `Ctrl + Scroll` forwards zoom to the model viewport
  - [ ] `Ctrl + MMB` drag forwards pan to the model viewport
  - [ ] `Ctrl + Shift + MMB` drag forwards orbit to the model viewport
- [ ] verify the active surface stays obvious and predictable while both surfaces are visible

### [ ] `[5.0H-4]` - `Camera Console Commands`

CheckList:
- [ ] add a `ZOOM` / `Z` console command family
- [ ] add first zoom sub-options:
  - [ ] `A` = `All`
  - [ ] `E` = `Extents`
  - [ ] `P` = `Previous`
  - [ ] `W` = `Window`
  - [ ] `O` = `Object`
- [ ] add `PAN` console command
- [ ] add `ORBIT` console command
- [ ] support `Zoom Object` with:
  - [ ] preselection flow
  - [ ] command-first then select flow
- [ ] bind console camera commands to the active view surface without confusing the graph canvas with the 3D model camera

### [ ] `[5.0H-5]` - `Shared View Input Owner Model`

CheckList:
- [ ] introduce one resolved viewport input owner model or equivalent arbitration seam
- [ ] make tool interaction, gizmos, widgets, selection, and camera all resolve through that same ownership order
- [ ] route future view-toolbar camera actions through the same ownership model
- [ ] route future gizmo drag sessions through the same ownership model
- [ ] add enough debug visibility to diagnose which system currently owns the pointer
- [ ] remove remaining one-off exceptions once the shared owner path is stable
