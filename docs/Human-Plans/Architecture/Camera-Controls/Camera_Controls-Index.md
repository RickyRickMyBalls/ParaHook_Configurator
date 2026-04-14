# Camera Controls Index

## Doc Header

### Doc History
28. 2026-04-14: Added the standalone future phase doc for `[Camera-6.3] Fly Camera Polish Backlog`, turning the first post-`6.2` fly polish follow-on into an implementation-ready plan focused on `speed boost`, a `speed control slider`, and the `Ctrl`/`Shift` remap needed to free boost cleanly
27. 2026-04-14: Cleaned up `[Camera-6.2] Hold-To-Fly Runtime And Input Ownership` after implementation and marked the first fly runtime cut complete in the family index so the shipped state matches the current docs and code
26. 2026-04-14: Added the first fly-camera polish backlog to `[Camera-6] Hold-To-Fly First-Person Camera Navigation`, prioritizing `speed boost` and a `speed control slider` first and recording the recommended control remap of `Ctrl` = descend so `Shift` can become boost cleanly
25. 2026-04-14: Re-did `[Camera-6.1] Fly Navigation Research And Seam Audit` against the current workspace/viewer architecture, replacing the older single-viewport read with an active-viewer-viewport seam audit and tightening the follow-on expectations around console capture, per-viewport ownership, and missing release seams like `keyup`, `blur`, and viewport-local `contextmenu`
24. 2026-04-06 21:02: Added the new standalone future phase doc for `[Camera-6.2] Hold-To-Fly Runtime And Input Ownership`, and tightened the fly-navigation family so the next runtime cut now has its own implementation-ready planning surface grounded in the finished `Camera-6.1` seam audit
23. 2026-04-06 20:52: Marked `[Camera-6.1] Fly Navigation Research And Seam Audit` complete after locking the live viewer pointer seam, shared keyboard-routing seam, console auto-capture dependency, camera-controller helper direction, and viewport-local `contextmenu` suppression seam, and advanced the fly-navigation family so `[Camera-6.2] Hold-To-Fly Runtime And Input Ownership` is now the next open runtime cut
22. 2026-04-06 20:33: Broke the new fly-navigation work into a small `Camera-6.*` ladder, added the standalone future phase doc for `[Camera-6.1] Fly Navigation Research And Seam Audit`, and recast `Camera-6` as the umbrella fly-navigation family phase so implementation can start from one concrete seam read before keyboard, camera-motion, and context-menu changes land
21. 2026-04-06 20:20: Added the new standalone future phase doc for `[Camera-6] Hold-To-Fly First-Person Camera Navigation`, so the camera-controls family now has an implementation-ready planning surface for temporary RMB-held fly navigation with WASD vertical movement, console input blocking, and viewport context-menu suppression on fly release
20. 2026-03-27 19:44: Renamed the live camera-controls phase ladder from `5.0H-*` to `Camera-*`, moved the standalone phase docs to matching `Camera-1` through `Camera-5.1` filenames, and kept the older `5.0H-*` labels only in historical log entries so the family can start phasing out the mixed numbering system cleanly
19. 2026-03-27 17:50: Added the new standalone future phase doc for `[5.0H-5.1] Viewer Object Window Selection`, so the camera-controls family now gives 3D viewer marquee selection its own implementation-ready planning surface under `Future/` instead of leaving it implied under the broader shared input-owner follow-on
18. 2026-03-22 22:32: Marked `[5.0H-4] Camera Console Commands` complete after shipping the first root/scoped `Zoom` family plus console `Pan` / `Orbit`, moved the standalone phase record into `Shipped/`, and advanced the camera-controls family so only the later shared input-owner model remains open
17. 2026-03-22 21:47: Added the new standalone future phase doc for `[5.0H-4] Camera Console Commands`, so the next open camera-controls cut now has its own implementation-ready planning surface under `Future/` after the shipped sketch block, viewport baseline, and canvas/model coexistence work
16. 2026-03-22 21:40: Marked `[5.0H-3] Spaghetti Canvas And Model Viewport Coexistence` complete after shipping the first explicit canvas/model coexistence cut, moved the standalone phase record into `Shipped/`, and advanced the family so camera console commands plus the later shared input-owner model are now the remaining open follow-ons
15. 2026-03-22 21:26: Corrected the planned `[5.0H-3]` coexistence rule so it now clearly treats the model viewport baseline as `wheel zoom`, `MMB` pan, `Ctrl + MMB` orbit, and `MMB` double-click fit, with the canvas simply adding `Shift` to forward those same model gestures while hovered
14. 2026-03-22 21:24: Replaced the planned `[5.0H-3]` canvas/model pass-through set with a cleaner `+Shift` rule, so while hovering the canvas the model viewport now reuses its normal camera gestures plus `Shift`: `Shift + wheel` for zoom, `Shift + MMB` for pan, and `Shift + Ctrl + MMB` for orbit
13. 2026-03-22 21:19: Corrected the planned `[5.0H-3]` canvas/model pass-through direction so model orbit is now the simpler normal `Ctrl + MMB` gesture while `Shift + wheel` stays the canvas-to-model zoom pass-through, removing the earlier split `Ctrl + MMB` pan plus `Ctrl + Shift + MMB` orbit idea
12. 2026-03-22 21:11: Added the new standalone future phase doc for `[5.0H-3] Spaghetti Canvas And Model Viewport Coexistence`, so the next camera-controls cut now has its own implementation-ready planning surface under `Future/` with the updated explicit pass-through direction using `Shift + wheel` for model zoom instead of the older riskier `Ctrl + wheel` idea
11. 2026-03-22 20:52: Marked `[5.0H-2] Fusion-Style Model Viewport Camera Baseline` complete after shipping the first Fusion-style model-viewport gesture remap, moved the standalone phase record into `Shipped/`, and advanced the camera-controls family so the next open work is now the graph-canvas coexistence, console-camera, and shared-input-owner follow-on set
10. 2026-03-22 20:42: Added the new standalone future phase doc for `[5.0H-2] Fusion-Style Model Viewport Camera Baseline`, so the next camera-controls cut now has its own implementation-ready planning surface under `Future/` instead of living only as a checklist block in the umbrella index
9. 2026-03-22 20:27: Marked `[5.0H-1] Sketch Draw Camera Blocking` complete after shipping the first sketch-camera ownership block, moved the standalone phase record into `Shipped/`, and kept the remaining camera-controls family open for the broader viewport-baseline, canvas coexistence, console-command, and shared input-owner follow-ons
8. 2026-03-22 14:56: Added the new standalone future phase doc for `[5.0H-1] Sketch Draw Camera Blocking`, so the first camera-controls cut now has its own implementation-ready planning surface under `Future/` instead of living only as a checklist line inside the umbrella index
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
  - `Camera_Controls_Phase Camera-5.1 - Viewer Object Window Selection.md`
  - `Camera_Controls_Phase Camera-6 - Hold-To-Fly First-Person Camera Navigation.md`
  - `Camera_Controls_Phase Camera-6.1 - Fly Navigation Research And Seam Audit.md`
  - `Camera_Controls_Phase Camera-6.2 - Hold-To-Fly Runtime And Input Ownership.md`
  - `Camera_Controls_Phase Camera-6.3 - Fly Camera Polish Backlog.md`
- `Shipped/`
  - later shipped records for completed camera-controls cuts if the family grows enough to justify them
  - `Camera_Controls_Phase Camera-1 - Sketch Draw Camera Blocking.md`
  - `Camera_Controls_Phase Camera-2 - Fusion-Style Model Viewport Camera Baseline.md`
  - `Camera_Controls_Phase Camera-3 - Spaghetti Canvas And Model Viewport Coexistence.md`
  - `Camera_Controls_Phase Camera-4 - Camera Console Commands.md`

Current phase ladder:
- `[Camera-1] Sketch Draw Camera Blocking`
- `[Camera-2] Fusion-Style Model Viewport Camera Baseline`
- `[Camera-3] Spaghetti Canvas And Model Viewport Coexistence`
- `[Camera-4] Camera Console Commands`
- `[Camera-5] Shared View Input Owner Model`
- `[Camera-5.1] Viewer Object Window Selection`
- `[Camera-6] Hold-To-Fly First-Person Camera Navigation`
- `[Camera-6.1] Fly Navigation Research And Seam Audit`
- `[Camera-6.2] Hold-To-Fly Runtime And Input Ownership`
- `[Camera-6.3] Fly Camera Polish Backlog`

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
- `Ctrl + MMB`
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
- `Ctrl + MMB Down + Drag`
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
- `MMB` now pans the canvas from anywhere over the canvas
- expanded view now has an explicit `Shift`-modified model pass-through set

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
  - `Shift + Scroll`
    - forward zoom to the model viewport instead of the canvas
  - `Shift + MMB Down + Drag`
    - forward pan to the model viewport
  - `Shift + Ctrl + MMB Down + Drag`
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
   - `Ctrl + MMB` drag = orbit
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
  - `Ctrl + MMB` drag = orbit
  - `MMB` double-click = zoom fit
- `Sketch Draw` is the first system that should force this cleanup, not a one-off exception


## Phases

### [x] `[Camera-1]` - `Sketch Draw Camera Blocking`

CheckList:
- [x] stop plain camera orbit/pan from stealing `LMB` click or drag inside idle `Sketch Draw`
- [x] stop plain camera orbit/pan from stealing `LMB` click or drag while a sketch draw tool is active
- [x] make idle `Sketch Draw` reliably own:
  - click selection
  - window selection
  - crossing selection
- [x] keep non-conflicting camera navigation available through intentional alternate gestures during sketch work
- [x] verify `DS-3` selection and delete can be tested end to end without orbit interference

### [x] `[Camera-2]` - `Fusion-Style Model Viewport Camera Baseline`

CheckList:
- [x] change model viewport wheel behavior to consistent mouse-point zoom
- [x] change model viewport `MMB` drag to pan
- [x] change model viewport `Ctrl + MMB` drag to orbit
- [x] add `MMB` double-click zoom-fit behavior
- [x] define the first zoom-fit target rule:
  - visible model content
  - selected object
  - or active target
- [x] verify the new gesture map does not break current authoring interactions

### [x] `[Camera-3]` - `Spaghetti Canvas And Model Viewport Coexistence`

CheckList:
- [x] preserve graph-canvas pointer-centered wheel zoom
- [x] preserve graph-canvas pan behavior on the canvas surface
- [x] preserve plain `LMB` graph editing ownership on nodes, wires, and empty-canvas interactions
- [x] explicitly prevent model-camera gestures from stealing default canvas navigation/edit input
- [x] add the explicit `Shift`-modified pass-through bridge:
  - [x] `Shift + wheel` forwards zoom to the model viewport
  - [x] `Shift + MMB` drag forwards pan to the model viewport
  - [x] `Shift + Ctrl + MMB` drag forwards orbit to the model viewport
- [x] verify the active surface stays obvious and predictable while both surfaces are visible

### [x] `[Camera-4]` - `Camera Console Commands`

CheckList:
- [x] add a root `ZOOM` / `Z` console command family as a sibling of `Graph`
- [x] add first model-viewport zoom sub-options:
  - [x] `A` = `All`
  - [x] `E` = `Extents`
  - [x] `P` = `Previous`
  - [x] `W` = `Window`
  - [x] `O` = `Object`
- [x] reuse `Zoom` under `Graph` with `Canvas` first and `Model Viewport` second
- [x] add `PAN` console command
- [x] add `ORBIT` console command
- [x] support first-cut `Zoom Object` from existing selected part/reference truth
- [x] keep unsupported paths explicit:
  - [x] `Zoom Window` returns honest not-implemented feedback
  - [x] `Graph > Zoom > Canvas > Previous` returns honest not-implemented feedback
- [x] bind camera console commands to the intended target surface without confusing the graph canvas with the 3D model camera

### [ ] `[Camera-5]` - `Shared View Input Owner Model`

CheckList:
- [ ] introduce one resolved viewport input owner model or equivalent arbitration seam
- [ ] make tool interaction, gizmos, widgets, selection, and camera all resolve through that same ownership order
- [ ] route future view-toolbar camera actions through the same ownership model
- [ ] route future gizmo drag sessions through the same ownership model
- [ ] add enough debug visibility to diagnose which system currently owns the pointer
- [ ] remove remaining one-off exceptions once the shared owner path is stable

### [ ] `[Camera-5.1]` - `Viewer Object Window Selection`

CheckList:
- [ ] add one standalone future phase doc for viewer object marquee selection:
  - [ ] `Future/Camera_Controls_Phase Camera-5.1 - Viewer Object Window Selection.md`
- [ ] let empty-space model-viewport drag begin a visible object-selection window when no higher-priority owner claims the pointer
- [ ] support left-to-right `Window` selection with full-containment capture
- [ ] support right-to-left `Crossing` selection with intersection capture
- [ ] keep gizmo/widget hits and camera gestures from stealing an active marquee drag after selection owns the pointer
- [ ] push the final captured objects into shared app selection truth instead of a viewer-local selection cache

### [ ] `[Camera-6]` - `Hold-To-Fly First-Person Camera Navigation`

CheckList:
- [ ] add one standalone future umbrella doc for fly navigation:
  - [ ] `Future/Camera_Controls_Phase Camera-6 - Hold-To-Fly First-Person Camera Navigation.md`
- [ ] break fly navigation into narrow subphases before implementation widens across viewer, keyboard, and console seams
- [ ] use `[Camera-6.1]` to lock the first seam audit and implementation read
- [ ] follow with one later implementation cut for temporary `RMB`-held fly navigation once the seam audit is concrete

### [x] `[Camera-6.1]` - `Fly Navigation Research And Seam Audit`

CheckList:
- [x] add one standalone future phase doc for the fly-navigation seam audit:
  - [x] `Future/Camera_Controls_Phase Camera-6.1 - Fly Navigation Research And Seam Audit.md`
- [x] re-audit the current active-viewer-viewport, pointer, keyboard, and camera-controller seams that would own fly mode
- [x] identify how fly mode should suppress console typing without weakening the broader input-routing model
- [x] identify how viewport-local `contextmenu` suppression should attach to the same `RMB` fly interaction
- [x] identify which release seams still need to be added explicitly for fly teardown:
  - [x] `keyup`
  - [x] `blur`
  - [x] viewport-local `contextmenu`
- [x] decide whether the first implementation cut should remain non-pointer-lock and perspective-only
- [x] record the recommended narrow follow-on implementation slice after the seam audit

### [x] `[Camera-6.2]` - `Hold-To-Fly Runtime And Input Ownership`

CheckList:
- [x] add one standalone future phase doc for the first fly runtime cut:
  - [x] `Future/Camera_Controls_Phase Camera-6.2 - Hold-To-Fly Runtime And Input Ownership.md`
- [x] let held `RMB` arm a temporary fly session in the active viewer viewport when no higher-priority viewer owner already claims the interaction
- [x] route mouse look plus:
  - [x] `W` / `A` / `S` / `D` for planar movement
  - [x] `Space` and `Shift` for vertical movement
- [x] add one explicit keyboard-routing owner so console auto-capture stands down while fly mode is active
- [x] keep existing viewer shortcuts like gizmo `W` / `E` / `R` / `Q` dormant while fly mode owns the keyboard
- [x] add viewport-local `contextmenu` suppression for the same fly interaction
- [x] stop fly movement immediately on `RMB` release and restore the normal camera/input ownership path cleanly

### [ ] `[Camera-6.3]` - `Fly Camera Polish Backlog`

CheckList:
- [x] add one standalone future phase doc for fly-camera polish:
  - [x] `Future/Camera_Controls_Phase Camera-6.3 - Fly Camera Polish Backlog.md`
- [ ] add `speed boost` while fly mode is active
- [ ] add a `speed control slider` for base fly speed
- [ ] remap fly descend from `Shift` to `Ctrl` so `Shift` can become boost
- [ ] decide the first boost multiplier behavior:
  - [ ] fixed multiplier
  - [ ] or slider/tunable multiplier later
- [ ] verify the updated fly key map still exits cleanly and does not regress browser or app shortcut behavior
- [ ] leave deeper polish for later:
  - [ ] mouse-look sensitivity slider
  - [ ] optional pointer lock
  - [ ] saved fly settings
