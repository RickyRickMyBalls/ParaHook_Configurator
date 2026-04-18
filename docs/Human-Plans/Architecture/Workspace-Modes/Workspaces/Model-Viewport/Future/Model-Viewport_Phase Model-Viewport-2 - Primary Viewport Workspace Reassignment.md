# `Model-Viewport-2` - `Primary Viewport Workspace Reassignment`

## Doc Header

### Doc History
2. 2026-04-17 22:14:50: Tightened `Model-Viewport-2 / Phase 1 - Primary Slot Reassignment Contract` into an implementation-ready first slice by grounding it in the live primary-slot reassignment guards across `useAppShellViewportActions.ts`, the default-primary-slot startup owner in `workspaceShellTypes.ts`, the current shared slot-surface store seam in `useWorkspaceStore.ts`, and the existing workspace-store proof surface, while explicitly deferring user-facing switch actions, persistence, and zero-viewer landing to later phases
1. 2026-04-17 21:40:14: Created this dedicated `Model-Viewport-2` future doc so the later workspace-facing follow-on now has one real planning home for letting the user change the current main `Model Viewport` slot to another supported workspace surface without forcing the old protected-primary-viewer rule to survive as hidden shell truth

### Purpose

Use this doc as the dedicated planning and execution surface for the later `Model-Viewport-2` workspace reassignment lane.

The goal here is:
- let the user change the current main `Model Viewport` into another supported workspace surface
- retire the protected-primary-viewer rule honestly instead of hiding it behind shell no-op guards
- keep that reassignment downstream from the shared workspace model rather than turning `Model Viewport` into a second shell owner
- preserve truthful return, restore, and zero-viewer behavior when the primary slot no longer has to stay a model viewer forever

### Scope

This phase family covers:
- retiring the current protected-main-viewport assumption
- allowing the primary viewport slot to switch from `modelViewer` to another supported workspace surface
- wiring the user-facing action path for that reassignment
- keeping persistence and zero-viewer return behavior honest after that switch becomes possible

This phase family does not cover:
- redoing the geometry execution and export ladder in `Model-Viewport-1.3`
- making `Model Viewport` the owner of `Home Page`, `Browser`, or other workspace-surface semantics
- inventing a separate router or app-mode system outside the workspace model
- the full broader workspace-family rewrite that may later follow from zero-viewer support

## Doc Body

### Summary

`Model-Viewport-2` should be the dedicated later follow-on for primary-slot workspace reassignment under the broader `Model Viewport` family.

Current baseline:
- the repo still protects one main `Model Viewport` as a shell anchor
- the current primary-slot close and reassignment guards still keep that slot from changing to another workspace surface
- `Home Page` now has an emerging vision as the honest first surface and honest zero-viewer landing state
- the current next honest `Model Viewport` implementation handoff still remains in `Model-Viewport-1.3`

What `Model-Viewport-2` needs to establish later:
- one explicit shared rule that the primary slot may stop being a `Model Viewport`
- one truthful user-facing action path for changing that main slot to another supported workspace surface
- one honest persistence and restore read so saved layouts can reopen without secretly forcing the old primary-viewer anchor back in
- one honest zero-viewer return path so the app can land on `Home Page` or another valid workspace surface without cheating

Locked recommendation:
- keep this lane clearly later than the current `1.3` geometry/export handoff
- treat this as a workspace-hosting follow-on, not a geometry phase
- let the user switch the main `Model Viewport` slot to another supported workspace surface through the shared workspace reassignment path
- keep `Model Viewport` responsible only for its own slot-reassignment boundary and not for owning `Home Page`, `Browser`, or broader workspace-shell truth
- keep the zero-viewer landing behavior explicit and compatible with the `Home Page` vision instead of reviving a hidden protected-viewer fallback

### Current Code-Backed Read

The strongest owner seams for this phase family right now are:

- `src/app/workspace/workspaceShellTypes.ts`
  - still seeds the default primary slot as one `modelViewer`
  - is where the current protected-main-viewer shape begins in the workspace defaults
- `src/app/workspace/useWorkspaceStore.ts`
  - still treats the initial root slot as one primary viewer anchor
  - still makes root-slot removal impossible while the slot has no parent split
  - is where later zero-viewer and primary-slot surface reassignment rules will need to become explicit
- `src/app/hosts/useAppShellViewportActions.ts`
  - still blocks close or surface-kind reassignment behavior for the default primary viewport slot
  - is the current user-facing action seam for any future "change main viewport to another workspace" behavior
- `src/app/workspace/workspacePersistence.ts`
  - already persists layout and surface-kind state
  - is the seam that will need to stay honest once the primary slot can reopen as something other than `modelViewer`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Home-Page/Home-Page-Vision.md`
  - already says `Home Page` should be able to act as the honest landing surface when zero `Model Viewport` surfaces are open
  - is the cross-family boundary that keeps this phase from absorbing `Home Page` ownership
- `docs/Vision.md`
- `docs/Human-Plans/roadmap/Vision-roadmap.md`
  - already require one hybrid workspace model instead of separate app modes or hidden shell copies

## Wishlist Organization

### High Level Goals

- [ ] `HLG 1. The user should be able to change the main Model Viewport to a different workspace.`

### `Model-Viewport-2 Phase 1`

- [ ] Retire the current protected-primary-viewer reassignment guard so the main slot can truthfully stop being a `modelViewer`.
- [ ] Keep the startup default intact so the app may still boot with a primary `modelViewer` even though that slot is no longer permanently locked after startup.
- [ ] Prove the primary slot can switch through the shared slot-surface contract to one supported non-`modelViewer` workspace surface without widening into menu actions, persistence, or zero-viewer landing.

### `Model-Viewport-2 Phase 2`

- [ ] Add one user-facing action path for switching the main `Model Viewport` slot to another supported workspace surface.
- [ ] Keep the supported-target list explicit so this phase only opens allowed workspace surfaces rather than inventing a free-form shell mode.
- [ ] `HLG 1. The user should be able to change the main Model Viewport to a different workspace.`

### `Model-Viewport-2 Phase 3`

- [ ] Keep layout persistence, restore, and zero-viewer landing behavior honest after the primary slot may stop being a `Model Viewport`.
- [ ] Ensure the new behavior remains compatible with the planned `Home Page` landing surface instead of restoring a hidden protected-viewer fallback.


## [ ] `Model-Viewport-2` - `Phase 1 - Primary Slot Reassignment Contract`

### Phase 1 Summary

Lock the shared contract that the current main `Model Viewport` slot may change into another supported workspace surface.

### Phase 1 Implementation Spec

Current read:
- the current primary-slot lock is not one owner; it is enforced as a small stack of assumptions
- `src/app/workspace/workspaceShellTypes.ts`
  - still seeds the default primary slot as `modelViewer`
  - should stay the startup default in this phase rather than being widened into startup-behavior changes
- `src/app/hosts/useAppShellViewportActions.ts`
  - still hard-blocks primary-slot close and surface-kind reassignment through explicit `defaultPrimaryViewportSlotId` guards
  - is the narrowest live seam proving the primary slot is treated as permanently protected today
- `src/app/workspace/useWorkspaceStore.ts`
  - already exposes the shared `setViewportSlotSurfaceKind(...)` store seam used by non-primary slots
  - should become the honest shared contract owner for primary-slot reassignment rather than leaving that behavior blocked only by app-shell special cases
- `src/app/workspace/useWorkspaceStore.test.ts`
  - already owns focused slot-switching proof for non-primary slots
  - is the healthiest first verification surface for proving the primary slot can switch without yet adding user-facing menus

Must lock:
- startup may still begin with the default primary `modelViewer`
- after startup, the primary slot may resolve to one explicit supported non-`modelViewer` workspace surface kind through the shared slot-surface reassignment contract
- the slot should keep its primary slot identity while its surface kind changes
- this phase should not yet widen into user-facing switch menus, persistence/restore, or `Home Page` zero-viewer handoff
- this phase should not require root-slot removal; changing the primary slot's surface kind is the narrow contract target

Likely files:
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/hosts/useAppShellViewportActions.ts`
- `src/app/workspace/useWorkspaceStore.test.ts`

Definition of done:
- the repo has one explicit shared contract allowing the main slot to stop being a `modelViewer` after startup
- the old primary-slot reassignment guard is retired or replaced with a more honest supported-surface rule
- focused proof shows the primary slot can switch from `modelViewer` to one supported non-primary surface kind through the shared slot-surface seam
- focused proof also shows the app still boots with the default primary `modelViewer`
- no broader `Home Page` ownership, persistence work, or user-facing action menu is silently absorbed here

## [ ] `Model-Viewport-2` - `Phase 2 - Main Viewport Switch Action`

### Phase 2 Summary

Expose one user-facing action that lets the user switch the current main `Model Viewport` slot to another supported workspace surface.

### Phase 2 Implementation Spec

Current read:
- the app-shell already owns viewport close, float, and surface-kind change actions
- the missing piece is a truthful supported path for the protected main slot

Must lock:
- one clear switch action for the main slot
- one explicit supported-target list such as `Home Page`, `Browser`, or another approved workspace surface
- no second router mode or special one-off shell surface launcher

Likely files:
- `src/app/hosts/useAppShellViewportActions.ts`
- workspace menus or surface-picking seams nearby
- focused workspace-host tests

Definition of done:
- the user has one explicit action path for changing the current main `Model Viewport` slot to another supported workspace surface
- the action stays inside the shared workspace model
- unsupported targets still fail honestly instead of silently no-oping

## [ ] `Model-Viewport-2` - `Phase 3 - Restore And Zero-Viewer Honesty`

### Phase 3 Summary

Keep persistence, restore, and zero-viewer landing behavior honest once the primary slot no longer has to remain a `Model Viewport`.

### Phase 3 Implementation Spec

Current read:
- the workspace persistence layer already stores surface kinds and layout state
- the broader `Home Page` family now wants a truthful zero-viewer landing state
- this phase is where those restored assumptions stop snapping back to a forced model viewer anchor

Must lock:
- saved layouts may restore with a non-`modelViewer` main slot when that is what the user last chose
- zero open `Model Viewport` surfaces remain valid
- the zero-viewer landing path can return to `Home Page` or another valid workspace surface honestly

Likely files:
- `src/app/workspace/workspacePersistence.ts`
- workspace startup/restore bridge seams
- focused restore and zero-viewer tests

Definition of done:
- persistence and restore remain truthful after the main slot may stop being a `Model Viewport`
- zero-viewer landing behavior no longer depends on reviving a hidden protected primary viewer
- the later `Home Page` direction stays compatible without moving ownership into this family
