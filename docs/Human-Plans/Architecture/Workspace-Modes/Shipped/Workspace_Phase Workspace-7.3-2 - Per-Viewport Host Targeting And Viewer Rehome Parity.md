# Workspace Phase Workspace-7.3-2 - Per-Viewport Host Targeting And Viewer Rehome Parity

## Doc Header

### Doc History
3. 2026-03-31 16:20: Checked off `Workspace 7.3-2` after the shipped multi-viewport host-targeting and viewer-rehome parity work, so the second `7.3` subphase record now reads as landed history and is ready to move into `Workspace-Modes/Shipped/`
2. 2026-03-31 15:01: Tightened this native `Workspace 7.3-2` future subphase doc into an implementation-ready follow-on by grounding it in the live detached-surface, `hostViewportId`, and workspace-persistence seams, locking the exact first-cut boundary around viewer detach and redock parity plus explicit host targeting, and adding a concrete execution checklist and verification matrix for the active post-`7.3-1` lane
1. 2026-03-31 14:23: Added this native `Workspace 7.3-2` future subphase doc to stage the second `7.3` cut around explicit cross-viewport floating-host targeting, viewer restore and redock parity, and the first deletion pass for remaining one-protected-viewer assumptions after the structural `7.3-1` widening proof

### Purpose

Use this subphase to make multiple model viewports behave correctly across host modes now that `7.3-1` proved they can coexist honestly in the slot tree.

The goal is to land the first real host-targeting parity cut:
- let a non-primary `Model Viewport` leave the slot tree without being blocked by singleton rules
- preserve one explicit `hostViewportId` for viewer detach, rehome, redock, and restore
- stop falling back to the primary viewer when a second viewer should stay the truth-bearing host

### Scope

This subphase covers:
- enabling detached `modelViewer` surfaces under the workspace host model
- making viewer detach, redock, and restore target one explicit host viewport
- deleting the first remaining protected-viewer shortcuts that collapse viewer host targeting back to the primary viewport
- widening persistence and restore enough that multi-viewport host targeting survives layout round-trips honestly
- proving that rehome and restore behavior stays deterministic when more than one live `Model Viewport` exists

This subphase does not cover:
- the structural second-viewer runtime proof that already shipped in `Workspace 7.3-1`
- final migration-adapter deletion that still belongs to `Workspace 7.4`
- broad Browser, Console, or Spaghetti cleanup that does not directly block honest viewer host targeting
- later viewport preset or copy-library features

## Doc Body

### Summary

`Workspace 7.3-2` is the host-targeting and viewer-rehome parity cut for the now-live multi-viewport runtime.

It should deliver:
- one honest detach and redock path for non-primary `Model Viewport` surfaces
- one explicit `hostViewportId` rule that survives more than one viewer
- one first restore and persistence pass that stops rewriting multi-viewport truth back to the primary viewer

Practical read:
- `7.3-1` proved "two slotted viewers can exist"
- `7.3-2` must prove "a viewer can leave, target, and return to the correct viewport host"

### Locked Direction

`Workspace 7.3-2` should be:
- a viewer host-targeting cleanup phase
- a detach, redock, and restore parity phase
- a first protected-viewer-assumption retirement phase

`Workspace 7.3-2` should not be:
- the first structural second-viewer proof
- a broad non-viewer polish lane
- the final `7.4` convergence cleanup pass

### Locked Implementation Boundary

`Workspace 7.3-2` must land the smallest honest host-mode widening that makes multi-viewport viewer targeting deterministic.

That means this phase should:
- allow a non-primary `modelViewer` slot surface to detach into the workspace detached-surface model
- preserve the detached viewer's `hostViewportId` explicitly instead of silently rewriting it to `primaryViewportId`
- redock that viewer relative to the intended host viewport when that host still exists
- define the fallback rule for when the stored host viewport no longer exists
- keep persistence and restore aligned with the same host-targeting truth

That also means this phase should not:
- widen into general `7.4` adapter deletion
- promise totally separate scene worlds
- absorb unrelated Browser or editor host cleanup just because the store code is nearby

### Progress Checklist

Current progress read:
- `7.3-1` is now shipped as the slot-truth and per-viewport-state proof
- the landed `7.3-2` work closed the remaining viewer detach, redock, restore, and persistence parity gap
- the detached-surface path, explicit `hostViewportId`, and multi-viewport persistence rules now read honestly enough for this family to count as shipped

- [x] Allow detached `modelViewer` surfaces under the workspace detached-surface path
- [x] Make viewer `hostViewportId` survive detach, redock, restore, and slot-kind changes without collapsing back to `primaryViewportId`
- [x] Define one honest fallback rule when a detached viewer's stored host viewport no longer exists
- [x] Preserve multi-viewport host targeting across workspace persistence and restore
- [x] Delete the first protected-viewer shortcuts that now conflict with honest multi-viewport behavior
- [x] Re-run the focused workspace viewer detach, redock, restore, and persistence parity bundle

Current active execution surface:
- none; `Workspace 7.3-2` is shipped and ready to move into `Workspace-Modes/Shipped/`

### Locked Outcome

At the end of `7.3-2`:
- a viewer can detach from a non-primary slot without hitting a model-viewer-specific block
- detached viewer surfaces carry one explicit `hostViewportId`
- redocking resolves against the intended host viewport when possible instead of drifting to the primary viewport by default
- restore and persistence no longer erase multi-viewport host targeting or local view state back to one protected viewer
- the remaining protected-viewer residue is smaller and clearer for `7.4`

### Current Code Read

Current landed seams:
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/workspacePersistence.ts`
- `src/app/workspace/ViewportWorkspaceHost.tsx`
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`

Landed behavior:
- `src/app/workspace/useWorkspaceStore.ts` now allows `modelViewer` to enter the detached-surface host model, preserves explicit viewer `hostViewportId`, and uses one visible host-exists or host-missing fallback path
- `src/app/workspace/workspaceShellTypes.ts` now widens the detached-surface contract so viewer host targeting is typed honestly
- `src/app/workspace/workspacePersistence.ts` now preserves real per-viewport local view state plus detached viewer host affinity across serialization and hydration
- `src/app/AppShell.tsx` now gives detached viewers the same honest host-mode path as the other workspace surfaces while keeping primary-only attachments like `PrimaryViewportLeftDock` primary-only

Important read:
- this is no longer a question of whether multiple viewers exist
- this is the first cut where viewer host modes have to obey the same explicit target truth the rest of the workspace already started to learn

### Locked Questions / Decisions

#### [x] Workspace 7.3-2 - Question 1 - What exact behavior proves this phase landed?

##### Locked Answer
- a user can detach a non-primary slotted `Model Viewport`
- that detached viewer keeps one explicit `hostViewportId`
- redocking returns it relative to the intended host viewport instead of defaulting to the primary slot when the host still exists
- if the old host is gone, the fallback rule is deterministic and visible rather than an implicit primary-only shortcut

##### Why
- that is the smallest real proof that multi-viewport host targeting is honest, not just slotted rendering

#### [x] Workspace 7.3-2 - Question 2 - What should happen when the stored host viewport no longer exists at redock or restore time?

##### Locked Answer
- keep the detached viewer alive while detached
- treat the stored `hostViewportId` as restore affinity first, not as a hard live dependency
- if redock or restore truly needs a live slot target and the old host no longer exists, fall back deterministically to the current primary model viewport and update the stored host affinity at that moment

##### Why
- this keeps runtime behavior stable without preserving an impossible target forever
- it also avoids surprise jumps while the viewer is still detached and running

#### [x] Workspace 7.3-2 - Question 3 - What concrete protected-viewer shortcut should this phase delete first?

##### Locked Answer
- the assumption that `modelViewer` cannot enter the detached-surface host model and therefore never needs the same explicit `hostViewportId` and redock rules as other surfaces

##### Why
- as long as that type and store rule survives, multiple-viewer host parity is still partly fake

#### [x] Workspace 7.3-2 - Question 4 - What should stay explicitly out of scope so this phase does not turn into `7.4` early?

##### Locked Answer
- broad adapter deletion across unrelated Browser and editor seams
- later viewport presets or viewport-copy features
- non-blocking polish that does not affect viewer detach, redock, restore, or persistence truth

##### Why
- `7.3-2` is still a focused viewer parity cut, not the whole convergence cleanup

### Implementation Checklist

#### Store And Types

- [x] Widen `WorkspaceDetachedSlotSurfaceState` so `modelViewer` can enter the detached-surface model honestly
- [x] Define one canonical detached-viewer record shape that preserves `surfaceInstanceId`, `hostMode`, `hostViewportId`, `lastSlotId`, and preferred re-dock side
- [x] Stop resetting viewer host targeting back to `state.primaryViewportId` in slot-kind changes that should preserve an explicit host affinity
- [x] Keep `activeViewerViewportId` and any per-viewport chrome lookup aligned with detached and restored viewer identity

#### Detach And Redock Behavior

- [x] Allow a non-primary `Model Viewport` slot to detach into `floating` or later-approved detached host mode without tripping the current `modelViewer` guard
- [x] Reuse the existing detached-surface redock path where it is still honest instead of inventing a viewer-only parallel loop
- [x] Replace silent primary-slot fallback with an explicit "host exists / host missing" decision path
- [x] Keep primary-slot-only attachments like `PrimaryViewportLeftDock` primary-only even when other viewers detach and rehome around them

#### Persistence And Restore

- [x] Persist `viewportChromeById` without wiping the actual per-viewport local view state back to defaults
- [x] Keep detached viewer `hostViewportId` truthful across serialization and hydration
- [x] Ensure restore can rebuild a workspace with more than one viewer without silently rewriting viewer targeting to the primary viewport
- [x] Stop before deeper migration cleanup that belongs to `7.4`

#### Verification

- [x] Add or update tests that prove a non-primary `modelViewer` can detach without being blocked
- [x] Add or update tests that prove detached viewer redock targets the intended host viewport when that host still exists
- [x] Add or update tests that prove the fallback rule is deterministic when the stored host viewport is gone
- [x] Add or update tests that prove persisted multi-viewport layout plus local viewport state restore honestly

### First Implementation Cut

`Workspace 7.3-2` should land in this order:

1. widen the detached-surface type and store seams so `modelViewer` can enter the host-mode model
2. make redock and restore resolve one explicit `hostViewportId` first and only use the primary viewport as a last-resort fallback
3. repair persistence so per-viewport local view state and detached host targeting survive serialization
4. verify detach, rehome, restore, and persistence under more than one live `Model Viewport`
5. stop before broader adapter retirement

### Acceptance Shape

This phase is ready to mark shipped when:
- a non-primary slotted `Model Viewport` can detach honestly
- detached viewer host targeting is explicit and stable
- redock and restore do not silently collapse back to the primary viewport when the intended host still exists
- the fallback behavior for a missing host viewport is deterministic and documented
- persistence preserves multi-viewport host targeting and local viewport state honestly enough for the widened runtime

### Likely Files

- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/workspacePersistence.ts`
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/workspace/useWorkspaceStore.test.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/viewerBridge.ts`

### Verification Shape

Focused verification should cover:
- creating two live `Model Viewport` slots
- detaching the non-primary viewer
- preserving one explicit `hostViewportId` on that detached viewer
- redocking to the intended host viewport while that host still exists
- resolving predictably when the stored host viewport disappears before restore
- persisting and restoring a workspace that contains more than one viewer plus detached or rehomed viewer state
