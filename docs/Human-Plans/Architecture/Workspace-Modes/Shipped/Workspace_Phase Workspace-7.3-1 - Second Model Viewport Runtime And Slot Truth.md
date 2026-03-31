# Workspace Phase Workspace-7.3-1 - Second Model Viewport Runtime And Slot Truth

## Doc Header

### Doc History
4. 2026-03-31 14:58: Marked the shipped `Workspace 7.3-1` execution, implementation, and verification checklists complete so the moved record now reads honestly as a landed subphase instead of an open future lane
3. 2026-03-31 14:49: Moved this native `Workspace 7.3-1` phase record from `Future/` into `Shipped/` after the second-model-viewport runtime cut landed, keeping the implementation-ready execution spec as the shipped reference for the first `7.3` subphase
2. 2026-03-31 14:35: Tightened this native `Workspace 7.3-1` future subphase doc into an implementation-ready multiple-viewer spec by grounding it in the live slot and viewer runtime seams, locking the exact first-cut boundary, and adding a concrete execution checklist plus verification matrix for a second honest `Model Viewport`
1. 2026-03-31 14:23: Added this native `Workspace 7.3-1` future subphase doc to stage the first `7.3` implementation cut around proving a second honest `Model Viewport` slot, widening viewer runtime identity, and making per-viewport camera and local view state real before the later host-targeting parity follow-on

### Purpose

This shipped subphase proved that the workspace slot tree can host more than one honest `Model Viewport` at once.

The landed structural runtime widening was:
- one second model viewport
- one explicit per-viewport viewer identity
- one local camera and view-state seam per viewport

before the later cross-viewport floating and restore parity work in `Workspace 7.3-2`.

### Scope

This shipped subphase covered:
- adding a second honest `Model Viewport` slot under the live slot tree
- widening viewer identity enough that more than one model viewport can exist at once
- making per-viewport camera and local view state explicit
- keeping shared model truth while allowing viewer-local divergence in camera and view settings
- proving that the slot renderer and viewport chrome can mount more than one model viewport without collapsing back to one protected viewer

This shipped subphase intentionally did not cover:
- full floating, popout, restore, and redock parity across multiple model viewports
- the broader host-targeting cleanup that belongs to `Workspace 7.3-2`
- later cleanup and migration-adapter deletion that still belong to `Workspace 7.4`
- broad non-blocking Browser, Console, or Spaghetti polish

## Doc Body

### Summary

`Workspace 7.3-1` is the shipped structural multiple-model-viewport cut.

It should deliver:
- one second honest `Model Viewport`
- one slot-tree path that can host more than one live viewer surface
- one real per-viewport camera and local view-state seam

Practical read:
- this is the "can we really have two model viewports?" proof
- do not widen into host-targeting cleanup yet
- the first win is replacing the current "primary slot gets the real viewer, every other viewer slot gets a placeholder" rule with honest slot-driven viewer mounting

### Locked Direction

`Workspace 7.3-1` should be:
- a structural runtime widening cut
- a second-model-viewport proof
- a per-viewport viewer-state phase

`Workspace 7.3-1` should not be:
- a Browser-first cleanup phase
- a broad host-mode parity phase
- a final viewer cleanup pass

### Locked Implementation Boundary

`Workspace 7.3-1` must land the smallest honest viewer-runtime widening that makes two slotted `Model Viewport` surfaces real at the same time.

That means this phase should:
- allow one non-primary slot to switch to `modelViewer` and render a real viewer surface
- keep both model viewports tied to the same underlying model and scene truth
- give each viewport its own stable viewer identity and viewport-local state seam
- keep the current "no floating or popout `modelViewer`" rule for now
- stop before cross-viewport rehome, restore, and persistence cleanup that belong to `7.3-2`

That also means this phase should not:
- redesign detached viewer behavior
- solve full multi-viewport persistence and restore parity
- broaden into Browser or Console cleanup unless that code directly blocks honest multi-viewer slot rendering

### Progress Checklist

Current progress read:
- the native `7.3` umbrella now exists
- this first staged subphase now reads as the landed structural multiple-viewer proof

- [x] Replace the non-primary `modelViewer` placeholder path with real slot-driven viewer mounting
- [x] Allow one second honest `Model Viewport` slot under the workspace slot tree
- [x] Widen viewer identity so more than one model viewport can exist at once without collapsing everything back to `primaryViewportId`
- [x] Make per-viewport camera and local view state explicit
- [x] Keep shared model truth while view-local camera state diverges correctly
- [x] Prove viewport chrome and slot rendering can host both viewer surfaces without falling back to one protected singleton
- [x] Leave viewer detach / popout / restore parity explicitly for `Workspace 7.3-2`

Current active execution surface:
- shipped; follow-on work now continues in `Workspace 7.3-2`

### Locked Outcome

At the end of `7.3-1`:
- two live `Model Viewport` slots can exist honestly
- each viewer has its own camera and local viewport state
- both viewers still reflect the same model truth
- the slot tree no longer depends on one protected-viewer assumption just to render more than one model viewport
- the user can change a non-primary slot to `Model Viewport` and see a real second viewer instead of the current `Workspace 7.3` placeholder message

### Current Code Read

Current likely seams:
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/ViewportWorkspaceHost.tsx`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/AppShell.tsx`

Current structural residue:
- the slot tree already widened for non-viewer surfaces, but the viewer runtime still reads more like one protected runtime hidden behind a slot shell
- `src/app/AppShell.tsx` only mounts `ViewportWorkspaceHost` when the slot is both `modelViewer` and the primary slot; every other `modelViewer` path falls through to `ViewportSurfaceRegistry`
- `src/app/workspace/ViewportSurfaceRegistry.tsx` still renders a `Workspace 7.3` placeholder for non-primary `modelViewer`, so the second viewer is not real yet
- `src/app/workspace/ViewportWorkspaceHost.tsx` always mounts `<ViewerHost />` with no explicit per-viewport viewer identity passed through the viewer stack yet
- `src/app/workspace/useWorkspaceStore.ts` still seeds new slots with `hostViewportId: state.primaryViewportId` and still resets `hostViewportId` back to `state.primaryViewportId` during some slot-kind changes, which shows that viewer ownership is not fully widened yet
- `workspaceShellTypes.ts` already has the beginnings of multi-viewport identity because non-primary `modelViewer` slots get generated ids like `model-viewer-${slotId}`, but the rendering path and runtime state have not caught up yet
- per-viewport camera and local view settings still need a clearer ownership seam before multi-viewport host targeting can be trustworthy

### Locked Questions / Decisions

#### [x] Workspace 7.3-1 - Question 1 - What exact behavior proves this phase landed?

##### Locked Answer
- a user can split the workspace, change the new slot to `Model Viewport`, and both slots render live model viewers at the same time
- camera or local view changes in one viewport do not overwrite the other viewport's local camera/view state
- model truth remains shared between both viewers

##### Why
- that is the smallest real proof that the viewer runtime is no longer a protected singleton behind the slot shell

#### [x] Workspace 7.3-1 - Question 2 - What should stay explicitly out of scope even if the code is nearby?

##### Locked Answer
- floating, popout, restore, and redock parity for `modelViewer`
- cross-viewport host targeting cleanup
- persistence upgrades that need multi-viewer restore guarantees

##### Why
- those are real `7.3` concerns, but they belong to `7.3-2`
- pulling them into `7.3-1` would make the first proof cut much riskier and harder to verify

#### [x] Workspace 7.3-1 - Question 3 - What state should be shared versus local in this first cut?

##### Locked Answer
- shared: model / scene truth
- local per viewport: camera state, viewport-local view settings, viewport chrome state, and any viewer-local presentation controls that should not force the other viewport to match

##### Why
- the point of the phase is multiple views of the same world, not accidental separate worlds or accidental shared camera coupling

#### [x] Workspace 7.3-1 - Question 4 - What code smell should this phase delete first?

##### Locked Answer
- the assumption that only the primary slot gets the real viewer host

##### Why
- as long as that rule exists, every other widening claim is still partly fake

### Implementation Checklist

#### Store And Types

- [x] Confirm one canonical viewer identity type and usage path for every slotted `modelViewer`
- [x] Stop defaulting new viewer-slot ownership back to the primary viewport when that would erase a second viewer's identity
- [x] Keep `viewportChromeById` honest for each live viewer id
- [x] Decide whether any new per-viewport local state belongs in `useWorkspaceStore` first or in a viewer-local runtime store keyed by `viewportId`

#### Rendering And Slot Mounting

- [x] Update `AppShell` so any slot whose `surfaceKind` is `modelViewer` can mount a real `ViewportWorkspaceHost`, not only the primary slot
- [x] Keep primary-slot-only attachments like `PrimaryViewportLeftDock` scoped to the primary slot instead of leaking them to every viewer slot
- [x] Replace the current non-primary `modelViewer` placeholder path in `ViewportSurfaceRegistry` with the real viewer rendering path or route all `modelViewer` slots around that placeholder entirely
- [x] Ensure viewer activation and surface focus plumbing can distinguish one viewer slot from another cleanly enough for this first cut

#### Viewer Runtime Widening

- [x] Audit `ViewerHost`, overlay, toolbar, and related viewer state reads so they can target one explicit `viewportId`
- [x] Make camera and local view state resolve by viewport identity instead of one implicit protected viewer runtime
- [x] Keep shared scene/model reads common so both viewers stay on the same model truth
- [x] Avoid widening host-targeting rules that are only needed once floating and restore parity start in `7.3-2`

#### Verification

- [x] Add or update tests that prove two live slotted model viewers can exist at once
- [x] Add or update tests that prove switching a non-primary slot to `modelViewer` mounts a real viewer instead of the placeholder
- [x] Add or update tests that prove local camera or view settings diverge without forking model truth

### First Implementation Cut

`Workspace 7.3-1` should land in this order:

1. remove the fake second-viewer path by letting non-primary `modelViewer` slots render a real `ViewportWorkspaceHost`
2. widen the viewer runtime so that mounted viewer hosts can resolve a stable per-viewport identity
3. move camera and local view settings onto that per-viewport seam
4. verify two live slotted viewers work at once
5. stop before any detach, rehome, popout, or restore cleanup

### Acceptance Shape

This phase is ready to mark shipped when:
- the workspace can show two honest slotted `Model Viewport` surfaces at once
- both viewers read the same shared model truth
- camera and local view settings can diverge per viewport
- the runtime no longer relies on "primary slot only" to decide whether a viewer is real
- no new `modelViewer` floating or popout promises were introduced early

### Likely Files

- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/ViewportWorkspaceHost.tsx`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/workspace/ViewportFrame.tsx`
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ViewToolbar.tsx`

### Verification Shape

Focused verification should cover:
- creating a second `Model Viewport` slot
- changing a non-primary slot to `modelViewer` and getting a real live viewer instead of the current placeholder
- showing two live slotted viewers at once
- keeping shared model truth between them
- diverging camera and view state locally per viewport
- keeping primary-slot-only chrome such as the left dock attached only to the primary viewer slot
- confirming `modelViewer` still does not detach, pop out, or promise restore parity during this subphase
