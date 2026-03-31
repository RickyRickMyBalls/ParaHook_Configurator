# Workspace Phase Workspace-7.3 - Multiple Model Viewports And Per-Viewport Runtime Parity

## Doc Header

### Doc History
4. 2026-03-31 16:20: Closed out this shipped `Workspace 7.3` umbrella record after the landed `7.3-2` host-targeting parity work, so the full multi-viewport runtime family now reads as complete and ready to move into `Workspace-Modes/Shipped/`
3. 2026-03-31 14:49: Marked `Workspace 7.3-1` as the shipped first `7.3` subphase, moved its record into `Workspace-Modes/Shipped/`, and advanced this umbrella phase so `Workspace 7.3-2` is now the active next execution surface for host-targeting and viewer-rehome parity
2. 2026-03-31 14:23: Broke `Workspace 7.3` into staged `7.3-1` and `7.3-2` subphase docs so the multiple-model-viewport widening now reads as structural second-viewer runtime proof first and cross-viewport host-targeting parity second
1. 2026-03-31 14:18: Added this native `Workspace 7.3` future phase doc to turn the already-locked umbrella scope into one dedicated planning surface for real multiple `Model Viewport` slots, per-viewport runtime targeting, and the first deletion pass for remaining one-protected-viewer assumptions after the Browser-first `7.2` cleanup ladder

### Purpose

Use this phase to widen the slot model into honest multiple `Model Viewport` support.

The goal is to stop treating the viewer runtime as one protected special case once the slot system, Browser cleanup, and first duplicated non-viewer surfaces are already proven.

### Scope

This phase covers:
- real multiple `Model Viewport` surfaces under the slot model
- fully widened per-viewport camera and view state
- explicit floating-host targeting across multiple model viewports
- stronger parity for re-docking and cross-viewport floating behavior
- the first deletion pass for remaining one-protected-viewer assumptions where the slot model already replaces them

This phase does not cover:
- later viewport preset or copy-library features
- final host cleanup and migration-adapter deletion that still belong to `Workspace 7.4`
- broad Browser, Console, or Spaghetti polish that does not directly block multiple model viewports
- separate independent scene worlds with separate model truth

## Doc Body

### Summary

`Workspace 7.3` is the viewer-runtime widening phase that should follow the Browser-first `7.2` cleanup ladder.

It should deliver:
- more than one honest `Model Viewport` slot
- one clearer per-viewport ownership model for camera, view state, and floating-host affinity
- fewer remaining "one protected viewer" assumptions inside workspace layout, host transitions, and restore behavior

Practical read:
- `Workspace 7.1` proved the slot shell
- `Workspace 7.2` proved duplicated non-viewer surfaces plus a lot of Browser-first host and drag cleanup
- `Workspace 7.3` is where the heaviest remaining widening happens: true multiple model viewports

### Locked Direction

`Workspace 7.3` should be:
- a multiple-model-viewport widening phase
- a per-viewport runtime ownership phase
- a floating-host targeting parity phase
- a first protected-viewer-assumption retirement phase

`Workspace 7.3` should not be:
- a generic Browser cleanup bucket
- a catch-all Console or Spaghetti polish phase
- a final migration-adapter deletion pass
- a separate-scene-world architecture reset

### Progress Checklist

Current progress read:
- the scope is already locked in the umbrella `Workspace 7` doc
- the dedicated native `Workspace 7.3` planning surface now exists
- `7.3-1` is now shipped as the structural runtime-widening proof
- `7.3-2` is now shipped as the host-targeting and viewer-rehome parity follow-on
- `Workspace 7.3` is now complete

- [x] Ship `Workspace 7.3-1 - Second Model Viewport Runtime And Slot Truth`
- [x] Ship `Workspace 7.3-2 - Per-Viewport Host Targeting And Viewer Rehome Parity`
- [x] Re-run the focused workspace multi-viewer parity bundle and mark `7.3` complete

Current active execution surface:
- none inside `Workspace 7.3`; this family is shipped and ready to live under `Workspace-Modes/Shipped/`

### Locked Outcome

At the end of `Workspace 7.3`:
- more than one `Model Viewport` can exist honestly under the slot tree
- duplicated model viewports share model truth but own their own camera and local viewport state
- floating and popout viewers can target the correct viewport host explicitly instead of leaning on one protected-viewer shortcut
- the workspace system depends less on viewer-only exceptions and more on the same slot and host rules already proven for the other surfaces

### Current Code Read

Current likely seams:
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/ViewportWorkspaceHost.tsx`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/workspace/ViewportFrame.tsx`
- `src/app/AppShell.tsx`

Current blocking residue:
- the slot tree can already host non-viewer surfaces honestly, but the live code still treats the viewer runtime more specially than Browser, Console, or Spaghetti
- floating-host and restore rules already widened a lot for non-viewer surfaces, but multiple viewer targeting still needs the same explicitness
- some Browser-first `7.2` cleanup proved the slot and host model, but that did not yet widen the actual viewer runtime the same way

Important read:
- this is not mainly a Browser task anymore
- this is where workspace ownership and viewer runtime ownership finally have to line up

### First Implementation Cut

`Workspace 7.3` should land in the smallest safe sequence:

1. `7.3-1` shipped as the second honest `Model Viewport` and per-viewport state proof
2. `7.3-2` is the active cross-viewport host-targeting and restore-parity follow-on
3. only after that, decide whether later Browser / Console / Spaghetti cleanup should happen inside `7.3` residue or after it

Recommended staging read:
- the phase is now explicitly staged
- `7.3-1` now counts as the landed structural multiple-viewer runtime widening cut
- `7.3-2` now owns the active host-targeting parity and first protected-viewer cleanup pass

### Likely Files

- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/ViewportWorkspaceHost.tsx`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/workspace/ViewportFrame.tsx`
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/workspace/workspacePersistence.ts`

### Questions / Decisions

#### [x] Workspace 7.3 - Question 1 - What is the exact job of this phase?

##### Locked Answer
- widen the honest slot model into true multiple `Model Viewport` runtime support
- make per-viewport camera, host targeting, and restore behavior explicit enough that the viewer is no longer a mostly protected singleton behind a slot-shaped shell

##### Why
- the umbrella `Workspace 7` ladder already locked `7.3` as the multiple-model-viewport widening cut
- that is the heaviest remaining part after `7.1` and the Browser-first `7.2` cleanup family

#### [x] Workspace 7.3 - Question 2 - What should stay shared versus local for duplicated model viewports?

##### Locked Answer
- duplicated model viewports should share model and scene truth
- duplicated model viewports should own their own camera, view settings, and viewport-local chrome state

##### Why
- that matches the already-locked umbrella direction for `Workspace 7`
- users need multiple views of the same scene, not accidental separate worlds

#### [x] Workspace 7.3 - Question 3 - What should this phase delete first?

##### Locked Answer
- the first one-protected-viewer assumptions that still hard-code viewer routing where the slot tree and explicit host targeting now provide the same truth more honestly

##### Why
- `7.3` should not widen the runtime and preserve every old exception forever
- the point of this phase is not only to add another viewport, but to reduce the reasons the viewer still behaves as a special shell

#### [x] Workspace 7.3 - Question 4 - What should stay out of scope so this phase does not turn into `7.4` early?

##### Locked Answer
- final migration-adapter deletion
- later viewport preset or copy-library features
- broad non-blocking Browser, Console, and Spaghetti polish

##### Why
- those are real follow-ons, but they are not the core runtime-widening job
- `7.3` should stay focused on the viewer-runtime step the umbrella ladder already locked

### Verification Shape

Focused verification should cover:
- creating more than one live `Model Viewport` slot
- keeping shared model truth while camera and view state diverge locally
- floating one viewport and restoring it over the intended host viewport
- re-docking viewer surfaces without falling back to one protected-viewer assumption
- persistence and restore across a workspace that now contains more than one model viewport
