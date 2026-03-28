# Camera Controls Phase Camera-4 - Camera Console Commands

## Doc Header

### Doc History
5. 2026-03-27 19:44: Renamed this live phase record from `5.0H-4` to `Camera-4` so the camera-controls family can start using the simpler `Camera-*` phase names while preserving the earlier `5.0H-*` numbering in historical doc-log entries
4. 2026-03-22 22:32: Marked `[5.0H-4]` complete after shipping the first root/scoped camera console family, moving this phase record into `Shipped/`, and tightening the record so `Zoom Object` only claims the current selected part/reference seam while unsupported paths like `Zoom Window` stay explicitly honest
3. 2026-03-22 22:00: Tightened this phase into a more implementation-ready spec by locking `Zoom` as a reusable scoped root-sibling family, grounding `Zoom Object` on existing browser/app selection truth instead of a new viewport-pick feature, and naming the concrete console/viewer seams plus first verification targets
2. 2026-03-22 21:52: Added the scoped `Zoom` reuse rule so root `Zoom` stays a sibling of `Graph` with model-viewport defaults, while `Graph > Zoom` now defaults to `Canvas` first and still exposes `Model Viewport` as the secondary branch for deeper reuse inside graph and later sketch scopes
1. 2026-03-22 21:47: Created this standalone future phase doc for `[5.0H-4]`, translating the next camera-controls cut into an implementation-ready plan around AutoCAD-style camera console commands after the shipped sketch-camera block, model-viewport baseline, and graph-canvas coexistence work

### Purpose

This doc defines the fourth implementation cut under the camera-controls family.

Use it to answer:
- what `[Camera-4]` should add to the console
- which camera commands belong in the first safe command set
- how those commands should target the active view surface
- which files are the right seams for the first implementation

### Why This Phase Exists

The shipped `[Camera-1]` through `[Camera-3]` work made camera behavior predictable from pointer input:
- `Sketch Draw` now owns plain viewport `LMB`
- the model viewport has a stable baseline
- the `Spaghetti` canvas has an explicit coexistence rule with the model viewport

The next missing piece is command access.

Right now camera control is still mostly mouse-only. This phase exists to add the first explicit console surface for view control so users can:
- zoom to all content
- zoom to visible extents
- return to the previous framed view
- zoom to a window
- zoom to selected objects
- trigger pan/orbit from the command system instead of only from pointer gestures

This phase also needs to lock how `Zoom` reappears in deeper scopes:
- at root, `Zoom` should be a top-level sibling of `Graph`
- inside `Graph`, `Zoom` should default to canvas commands first
- later inside `SP` and `SD`, `Zoom` should still be reusable with model-viewport defaults

### Scope

This phase covers:
- first AutoCAD-style camera/view console commands
- the first `ZOOM` / `Z` grammar family
- `PAN` and `ORBIT` as console-triggered view commands
- first active-surface targeting rules for camera commands
- the first view-history seam needed for `Zoom Previous`

This phase does not cover:
- graph-canvas/model-viewport coexistence gesture routing
- broader shared input-owner arbitration
- keybinding customization UI
- saved named views
- rich camera-mode HUDs or overlays

## Doc Body

## [x] - `[Camera-4]` - `Camera Console Commands`

### Header

Purpose:
- add the first honest camera/view command layer without widening into generic shared-input arbitration or custom hotkey UI

Owns:
- `ZOOM` / `Z` console grammar
- first zoom sub-options
- `PAN` and `ORBIT` camera commands
- active-surface targeting for camera commands
- the minimum view-history seam needed for `Zoom Previous`

Keeps for later phases:
- deeper shared input arbitration under `[Camera-5]`
- named views and richer camera-state management
- broader graph-canvas command parity if later needed

### Target Result

- the console can drive first-pass camera actions instead of relying only on mouse gestures
- users can type short AutoCAD-style zoom commands like `z > e` and `z > o`
- `Zoom Previous` has one real view-history seam instead of being fake or unsupported
- `Pan` and `Orbit` can be triggered from the console against the active model-view surface
- graph-canvas and model-viewport targeting stays explicit instead of pretending they are the same camera surface
- unsupported first-cut paths stay explicit instead of silently pretending they work:
  - `Zoom Window`
  - `Graph > Zoom > Canvas > Previous`

### Current Seam Read

- `src/app/console/ConsoleDock.tsx` already owns staged command grammar and scoped command dispatch, so it is the first seam for exposing `z`, `pan`, and `orbit`
- `src/app/console/useConsoleStore.ts` already owns transcript and command-session state, so it is the likely seam for any narrow camera-command prompt/help additions
- `src/app/viewerBridge.ts` already exposes viewer-facing helpers like `frameAll()`, `frameSelected()`, and the newer zoom/pan/orbit forwarding seams, so it is the natural bridge for the first console camera actions
- `src/viewer/Viewer.ts` already owns concrete view actions like `frameAll()`, `frameSelected()`, and `frameReference()`, so it is the right home for:
  - `Zoom Extents`
  - `Zoom Object`
  - view-history capture for `Zoom Previous`
  - later window-zoom execution if this phase includes it
- `src/app/components/ViewerHost.tsx` already pushes `selectedPartKey` into the viewer, so the current browser/app selection seam is sufficient for a first `Zoom Object` cut without inventing general rendered-object picking in the same phase
- the shipped `[Camera-3]` work already clarified that the model viewport and graph canvas are separate surfaces, so console camera commands should target the active 3D view surface instead of pretending all visible surfaces are interchangeable
- current code truth does not yet show a general `click rendered 3D object in the viewport -> select it` feature, so this phase should not depend on a new viewport-pick selection system

### Questions / Decisions

#### [x] - `q0` Where should `Zoom` live in the command tree, and can it be reused in deeper scopes?

##### Suggestion
- root `Zoom` should live as a sibling of `Graph`, not inside it
- root `Zoom` defaults to model-viewport camera commands
- `Zoom` should be reusable in deeper scopes instead of being root-only
- inside `Graph`, the default branch order should be:
  - `Zoom > Canvas`
  - `Zoom > Model Viewport`
- that means in `Graph` scope the short form:
  - `zoom > a`
  - should mean `Canvas > All`
- later scoped reuse should follow:
  - root `Zoom` = model viewport default
  - `Graph > Zoom` = canvas default
  - `SP > Zoom` = model viewport default
  - `SD > Zoom` = model viewport default
- prefer one reusable `Zoom` family with scope-specific default targets instead of inventing separate unrelated verbs like `CanvasZoom` and `ModelZoom`

#### [x] - `q1` What is the first `ZOOM` grammar set?

##### Suggestion
- ship:
  - `z > a` = `Zoom All`
  - `z > e` = `Zoom Extents`
  - `z > p` = `Zoom Previous`
  - `z > w` = `Zoom Window`
  - `z > o` = `Zoom Object`
- support `zoom` as the long form and `z` as the short alias
- keep the first grammar narrow and command-line friendly instead of inventing a different ParaHook-only camera syntax

#### [x] - `q2` What should `Zoom All` versus `Zoom Extents` mean in ParaHook?

##### Suggestion
- `Zoom Extents`:
  - frame the actual visible/authored model content
  - route the first cut to the same content envelope that `Viewer.frameAll()` already uses
- `Zoom All`:
  - frame the broader working scene envelope
  - if there is no meaningful separate working envelope yet, allow `All` to alias to `Extents` in the first cut and record that simplification explicitly

#### [x] - `q3` What should `Zoom Object` support in the first cut?

##### Suggestion
- support current selection truth only in the shipped first cut:
  - preselection, then `z > o`
- first eligible targets should be the same concrete objects the viewer already knows how to frame:
  - selected part/body
  - selected reference object
- ground the first cut on the current browser/app selection seam:
  - `selectedPartKey`
  - selected reference id / highlighted reference row state if already available
- do not block this phase on a new `click rendered 3D object in the viewport` selection feature
- defer command-first then select until a later explicit selection/pick follow-on exists
- if no eligible object is selected, the command should fail honestly with transcript/help feedback instead of silently doing nothing
- do not widen this phase into arbitrary graph-canvas row framing or generic browser-row camera targeting

#### [x] - `q4` Should `PAN` and `ORBIT` be modal commands or immediate actions?

##### Suggestion
- keep the first cut simple:
  - `pan` arms a console-visible pan state against the model viewport
  - `orbit` arms a console-visible orbit state against the model viewport
- reuse the existing viewer camera seams instead of adding a second unrelated camera mode system
- do not invent a persistent deep camera-mode subsystem yet; keep it narrow and practical

#### [x] - `q5` What surface should camera console commands target?

##### Suggestion
- target the active model viewport surface only
- do not let camera commands silently act on the graph canvas
- if the graph canvas is the currently focused UI region, camera console commands should still route to the 3D model-view camera unless a later graph-specific view-command family is introduced

#### [x] - `q6` Does this phase need view-history support?

##### Suggestion
- yes, but only the minimum seam for `Zoom Previous`
- keep a small bounded camera-pose history in `Viewer`
- push history entries when framing/zoom actions actually change the camera
- do not widen into a full saved-views or timeline system

### Implementation Spec

Recommended file changes:
- edit `src/app/console/ConsoleDock.tsx`
- edit `src/app/console/useConsoleStore.ts`
- edit `src/app/viewerBridge.ts`
- edit `src/viewer/Viewer.ts`
- likely edit `src/app/inputRouting.ts` only if root-level `Zoom` / `Pan` / `Orbit` command capture needs one small routing clarification
- likely edit tests in:
  - `src/app/console/ConsoleDock.test.tsx`
  - `src/app/components/ViewerHost.test.tsx`
- optional if a viewer-side camera history helper or selection helper deserves isolation:
  - add or edit a narrow viewer test near `src/viewer/Viewer.ts`
- optional only if a shared command grammar helper already owns the relevant camera/session branching:
  - edit a nearby console command parser/helper file instead of overloading `ConsoleDock.tsx`

Implementation steps:
1. add the first `zoom` / `z` staged grammar branch in the console
   - root `Zoom` is a sibling of `Graph`
   - `Graph > Zoom` reuses the same family with canvas-first defaults
2. add the first zoom sub-option handlers:
   - `a`
   - `e`
   - `p`
   - `w`
   - `o`
3. route `Zoom Extents` through the current viewer framing seam
4. decide and record the first `Zoom All` implementation:
   - alias to `Extents` if there is still no meaningful separate working envelope
5. add one narrow view-history seam in `Viewer` for `Zoom Previous`
6. add first `Zoom Object` handling against the current selected/framed viewer targets
   - use existing browser/app selection truth
   - do not add viewport-pick selection in this phase
   - fail honestly if there is no eligible selected object
6. add `pan` and `orbit` console commands that arm the viewer camera behavior without inventing a second camera subsystem
7. keep graph-canvas behavior separate and explicit

Required behavior-preservation rules:
- do not rewrite the shipped pointer-gesture baseline from `[Camera-1]` through `[Camera-3]`
- do not widen into shared gizmo/input-owner arbitration
- do not invent graph-canvas camera semantics inside this phase
- do not add a brand-new general 3D viewport object-selection system in this phase
- do not require new UI chrome if transcript/status output is sufficient for the first cut

Expected result after this phase:
- the console can drive first-pass camera control in the model viewport
- the command tree has one clear reusable `Zoom` family with scope-sensitive defaults
- `Zoom Previous` has one real implementation seam
- `Zoom Object` works against the first current browser/app selected object targets
- mouse gesture camera behavior remains unchanged
- `[Camera-5]` can focus on shared input ownership instead of still filling in basic camera commands

Verification:
- run:
  - `src/app/console/ConsoleDock.test.tsx`
  - `src/app/components/ViewerHost.test.tsx`
  - any viewer camera-history or selection test touched by the implementation
- manually smoke-check:
  - `z > e`
  - `z > a`
  - `z > p`
  - `z > o`
  - `pan`
  - `orbit`
  - root `zoom` defaults to model viewport commands
  - `Graph > Zoom` defaults to canvas commands
- run a production build if the repo is otherwise buildable, and record unrelated pre-existing failures separately instead of widening this phase

Definition of done:
- the console exposes the first camera command family
- `ZOOM` / `Z` supports the initial sub-options
- `PAN` and `ORBIT` exist as real commands
- the commands target the intended model-view surface
- `Zoom Object` works from the existing selection foundation without requiring a new viewport-pick feature
- the phase lands without silently absorbing `[Camera-5]`
