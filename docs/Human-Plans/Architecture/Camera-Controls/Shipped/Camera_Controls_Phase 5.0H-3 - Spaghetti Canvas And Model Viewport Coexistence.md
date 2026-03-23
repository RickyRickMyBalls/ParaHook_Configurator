# Camera Controls Phase 5.0H-3 - Spaghetti Canvas And Model Viewport Coexistence

## Doc Header

### Doc History
5. 2026-03-22 21:26: Corrected the coexistence rule so the model viewport baseline is now explicitly `wheel zoom`, `MMB` pan, `Ctrl + MMB` orbit, and `MMB` double-click zoom fit, with the canvas simply adding `Shift` to forward those same model gestures while hovered
4. 2026-03-22 21:24: Replaced the mixed canvas/model pass-through proposal with a cleaner `+Shift` rule, so while hovering the canvas the model viewport now reuses its normal camera gestures plus `Shift`: `Shift + wheel` for model zoom, `Shift + MMB` for model pan, and `Shift + Ctrl + MMB` for model orbit
3. 2026-03-22 21:19: Corrected the planned canvas-to-model pass-through set so model orbit is now the simpler normal `Ctrl + MMB` gesture instead of the earlier split `Ctrl + MMB` pan plus `Ctrl + Shift + MMB` orbit proposal
2. 2026-03-22 21:15: Tightened this phase into a more implementation-ready spec by grounding it in the current graph-canvas runtime: `SpaghettiCanvas.tsx` already owns plain wheel zoom and empty-background `LMB` pan, the only existing model pass-through is the expanded-view `Ctrl + MMB` temporary orbit bridge, and the next cut must likely add new narrow viewer-bridge seams for canvas-to-viewer zoom and pan rather than pretending those paths already exist
1. 2026-03-22 21:11: Created this standalone future phase doc for `[5.0H-3]`, translating the next camera-controls cut into an implementation-ready planning surface around graph-canvas ownership, explicit model-viewport pass-through gestures, and keeping the canvas and viewer usable side by side without input ambiguity

### Purpose

This doc defines the third implementation cut under the camera-controls family.

Use it to answer:
- how the `Spaghetti Editor` canvas and model viewport should coexist
- which gestures stay owned by the canvas by default
- which gestures explicitly pass through to the model viewport
- how to keep this cut narrow enough to land before camera console commands and the later shared input-owner model

### Why This Phase Exists

The shipped `[5.0H-1]` and `[5.0H-2]` cuts proved two things:
- authoring surfaces need reliable `LMB` ownership
- the model viewport now has a stable Fusion-style camera baseline

The next problem is that the graph canvas and model viewport can both be visible and both want navigation input.

This phase exists to lock one clear coexistence rule:
- the graph canvas owns its normal input by default
- model-viewport pass-through must be explicit
- the user should never have to guess which surface currently owns the pointer

### Scope

This phase covers:
- default input ownership for the `Spaghetti Editor` canvas
- canvas-local wheel zoom and pan preservation
- explicit model-viewport pass-through while hovering the canvas
- the first pass-through zoom, pan, and orbit modifier gestures

This phase does not cover:
- changing the model viewport baseline from `[5.0H-2]`
- camera console commands
- gizmo/shared input-owner arbitration
- final customizable keybinding UI

## Doc Body

## [ ] - `[5.0H-3]` - `Spaghetti Canvas And Model Viewport Coexistence`

### Header

Purpose:
- make the graph canvas and model viewport coexist cleanly when both are visible, without making the user guess which surface owns the pointer

Owns:
- canvas-local wheel zoom
- canvas-local pan
- graph-edit `LMB` ownership on the canvas
- explicit model-viewport pass-through gestures while hovering the canvas

Keeps for later phases:
- camera console commands under `[5.0H-4]`
- shared gizmo/input-owner cleanup under `[5.0H-5]`

### Target Result

- the `Spaghetti Editor` canvas remains a real 2D graph-navigation surface
- plain canvas wheel zoom still zooms the canvas
- plain canvas pan still pans the canvas
- model-viewport pass-through exists only through explicit modifier gestures
- the active surface stays obvious instead of feeling like a hidden camera-mode switch

### Current Seam Read

- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx` already owns the graph-canvas pointer and wheel behavior, so it is the primary seam for coexistence work
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx` currently already does two important things:
  - plain wheel always zooms the canvas
  - empty-background `LMB` drag pans the canvas
- `src/app/viewerBridge.ts` currently exposes only the temporary viewer-orbit bridge helpers, and `SpaghettiCanvas.tsx` currently uses that bridge only for expanded-view `Ctrl + MMB` orbit
- there is no existing canvas-to-viewer zoom or pan bridge yet, so this phase must likely add those seams explicitly instead of assuming they already exist
- `src/viewer/Viewer.ts` and `src/viewer/scene/CameraController.ts` already own the shipped `[5.0H-2]` model viewport baseline, so any new canvas pass-through should forward into those existing viewer-side behaviors rather than creating a second camera implementation
- the shipped `[5.0H-2]` work already stabilized the model viewport baseline as:
  - wheel zoom
  - `MMB` pan
  - `Ctrl + MMB` orbit
  - `MMB` double-click zoom fit
- the current architecture direction says the hovered surface should own its normal input by default, so this phase should preserve that rule instead of weakening it with hidden shared ownership
- `Ctrl + wheel` is intentionally not the preferred zoom pass-through because it collides too easily with browser/app zoom expectations

### Questions / Decisions

#### [x] - `q1` What should the canvas own by default while hovered?

##### Suggestion
- the canvas owns its normal input by default
- plain wheel = canvas zoom
- plain `MMB` drag = canvas pan
- plain `LMB` = graph editing, selection, and wiring
- the model viewport should not steal any of those default canvas interactions

#### [x] - `q2` What should the first explicit model-viewport pass-through gestures be while hovering the canvas?

##### Suggestion
- `Shift + wheel` = model viewport zoom
- `Shift + MMB` drag = model viewport pan
- `Shift + Ctrl + MMB` drag = model viewport orbit
- keep these explicit enough that they read as intentional pass-through, not ambiguous shared ownership
- keep the pass-through rule simple:
  - the canvas adds `Shift` to the normal model-viewport gesture set

#### [x] - `q3` Should this phase change the graph-canvas baseline itself?

##### Suggestion
- no
- preserve the current canvas baseline and only add explicit pass-through gestures
- if the canvas baseline needs cleanup later, do that in a separate canvas-focused pass instead of widening this camera phase

#### [x] - `q4` How visible should the active-surface state be in the first cut?

##### Suggestion
- keep the first cut subtle
- do not add heavy new UI chrome yet
- rely on explicit modifiers and preserved default ownership first
- if debugging still feels ambiguous later, add a lightweight status/debug hint in `[5.0H-5]`

### Implementation Spec

Recommended file changes:
- edit `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- edit `src/app/viewerBridge.ts`
- edit `src/viewer/Viewer.ts`
- edit `src/viewer/scene/CameraController.ts` only if the new canvas pass-through needs one narrow helper that does not already exist
- edit relevant graph-canvas tests if they exist
- optional only if behavior verification exposes gaps:
  - edit `src/app/components/ViewerHost.test.tsx`
- no CSS changes planned for the first cut

Implementation steps:
1. audit the current canvas wheel, drag, and temporary viewer pass-through behavior in `SpaghettiCanvas.tsx`
2. preserve the existing default hovered-canvas ownership path:
   - plain wheel = canvas zoom
   - plain `LMB` empty-background drag = canvas pan
   - plain `LMB` on content = graph editing/selecting/wiring
3. add one narrow canvas-to-viewer zoom seam and route `Shift + wheel` to model-viewport zoom while the pointer is over the canvas
4. add one narrow canvas-to-viewer pan seam and route `Shift + MMB` drag to model-viewport pan while the pointer is over the canvas
5. move or normalize the existing expanded-view temporary orbit path onto `Shift + Ctrl + MMB` so the canvas pass-through set reads as "normal model gesture plus Shift"
6. keep plain graph-edit `LMB` ownership unchanged
7. do not alter the model viewport baseline itself beyond forwarding into the already-shipped viewer behaviors

Required behavior-preservation rules:
- do not break normal canvas wheel zoom
- do not break normal canvas pan
- do not break graph selection/wiring/dragging on plain `LMB`
- do not reintroduce hidden camera ownership over the canvas
- do not keep the older mixed `Ctrl`-first pass-through set active in parallel once the new `+Shift` rule lands
- do not widen into camera console commands or the shared input-owner model

Expected result after this phase:
- the graph canvas still feels like its own surface
- the model viewport remains reachable from the canvas through explicit pass-through gestures
- cross-surface interaction no longer depends on guesswork
- later camera-console and shared-owner work can build on a more stable surface-ownership rule

Verification:
- run focused tests covering the canvas pointer/wheel path if available
- run focused tests covering any new viewer-bridge pass-through helpers if added
- manually smoke-check:
  - plain wheel over canvas = canvas zoom
  - plain `MMB` drag over canvas = canvas pan
  - plain `LMB` over canvas still edits/selects graph content
  - `Shift + wheel` over canvas = model viewport zoom
  - `Shift + MMB` drag over canvas = model viewport pan
  - `Shift + Ctrl + MMB` drag over canvas = model viewport orbit
  - model viewport baseline from `[5.0H-2]` still works when hovering the viewport itself
- run a production build if the repo is otherwise buildable, and record unrelated pre-existing failures separately instead of widening this phase

Definition of done:
- the canvas keeps its normal default ownership
- model-viewport pass-through from the canvas is explicit and working
- the user no longer has to guess which surface owns the pointer
- the cut lands without silently absorbing `[5.0H-4]` or `[5.0H-5]`
