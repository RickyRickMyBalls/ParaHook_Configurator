# `Model-Viewport-2` - `Primary Viewport Workspace Reassignment`

## Doc Header

### Doc History
13. 2026-04-18 10:45:51: Marked `Model-Viewport-2 / Phase 5 - Full Primary Workspace Reassignment Coverage` shipped after the repo retired the remaining primary-slot target limits in `workspaceShellTypes.ts`, widened the existing primary-slot store seam plus titlebar type submenu proof in `useWorkspaceStore.test.ts` and `ViewportFrame.test.tsx` to cover `console`, `spaghettiEditor`, `notepad`, and `dashboard`, and kept `Home Page` ownership plus startup and zero-viewer policy outside this phase
12. 2026-04-18 10:41:18: Tightened `Model-Viewport-2 / Phase 5 - Full Primary Workspace Reassignment Coverage` into an implementation-ready widening pass by grounding it in the live primary-slot allowlist still limited in `workspaceShellTypes.ts`, the shipped titlebar type-submenu seam in `ViewportFrame.tsx`, and the current `useWorkspaceStore.test.ts` plus `ViewportFrame.test.tsx` proof where the remaining primary-slot targets are still blocked, while explicitly locking the remaining in-scope surfaces to `console`, `spaghettiEditor`, `notepad`, and `dashboard` and keeping `Home Page` ownership, startup policy, and prior restore honesty out of this phase
11. 2026-04-18 10:38:12: Marked `Model-Viewport-2 / Phase 4 - Restore And Zero-Viewer Honesty` shipped after the repo added one shared active-surface resolver in `workspaceShellTypes.ts`, taught `useWorkspaceStore.ts` to re-resolve active workspace ownership across both slotted and detached surviving model viewers when the current viewer stops being a viewer, normalized persisted layouts in `workspacePersistence.ts` so stale active-viewer ids now restore to a real remaining model viewer or the honest current primary-slot surface when zero viewers remain, and added focused `useWorkspaceStore.test.ts` proof for detached-viewer handoff plus zero-viewer restore without reviving a hidden protected viewer id
10. 2026-04-18 10:38:12: Tightened `Model-Viewport-2 / Phase 4 - Restore And Zero-Viewer Honesty` into an implementation-ready restore pass by grounding it in the shared active-viewer fallback drift still present across `useWorkspaceStore.ts` plus `workspacePersistence.ts`, explicitly narrowing the fix to truthful active-surface re-resolution and restore normalization instead of widening into primary-slot close rules or `Home Page` ownership, and locking `useWorkspaceStore.test.ts` as the focused proof surface for detached-viewer handoff plus zero-viewer restore honesty
9. 2026-04-18 10:20:49: Added `Model-Viewport-2 / Phase 5 - Full Primary Workspace Reassignment Coverage` as the next follow-up after the existing restore and zero-viewer honesty pass so the remaining primary-slot workspace-target widening has its own explicit later phase instead of being folded into `Phase 4`
8. 2026-04-18 10:14:29: Marked `Model-Viewport-2 / Phase 3 - Primary Catalog Switch Action` shipped after the shared primary-slot supported-surface allowlist in `workspaceShellTypes.ts` widened to include `catalog`, the existing primary-slot store seam began accepting that supported target, and focused `useWorkspaceStore.test.ts` plus `ViewportFrame.test.tsx` proof now cover the primary-slot `Catalog` submenu action while keeping the remaining unsupported primary targets disabled
7. 2026-04-18 10:11:43: Tightened `Model-Viewport-2 / Phase 3 - Primary Catalog Switch Action` into an implementation-ready next slice by grounding it in the live primary-slot supported-surface allowlist in `workspaceShellTypes.ts`, the shipped titlebar type-submenu owner in `ViewportFrame.tsx`, and the existing `ViewportFrame.test.tsx` plus `useWorkspaceStore.test.ts` proof where primary-slot `Catalog` is still intentionally blocked, while explicitly keeping all other unsupported primary targets disabled and deferring persistence plus zero-viewer handoff to later `Phase 4`
6. 2026-04-18 10:04:42: Added `Model-Viewport-2 / Phase 3 - Primary Catalog Switch Action` as a dedicated follow-up after the shipped Browser-first submenu unlock so `Catalog` support gets its own explicit user-facing widening step before persistence and zero-viewer honesty work, and moved the old restore and zero-viewer closeout from `Phase 3` to `Phase 4`
5. 2026-04-18 09:58:07: Marked `Model-Viewport-2 / Phase 2 - Main Viewport Switch Action` shipped after `ViewportFrame.tsx` stopped blanket-disabling every non-model type-submenu choice for the primary slot, allowing the existing titlebar viewport-type submenu to switch the main slot to supported `Browser` while keeping unsupported primary targets disabled, and added focused `ViewportFrame.test.tsx` proof plus a rerun of the shared `useWorkspaceStore.test.ts` contract coverage
4. 2026-04-18 09:51:59: Tightened `Model-Viewport-2 / Phase 2 - Main Viewport Switch Action` into an implementation-ready first UI slice by grounding it in the live primary-slot type-submenu disable rule in `ViewportFrame.tsx`, the already-shipped shared primary-slot reassignment contract in `useWorkspaceStore.ts` plus `useAppShellViewportActions.ts`, and the nearby `ViewportFrame.test.tsx` menu proof, while explicitly narrowing the first user-facing target to primary-slot `Browser` only and deferring wider target support plus persistence and zero-viewer handoff to later phases
3. 2026-04-18 09:30:19: Marked `Model-Viewport-2 / Phase 1 - Primary Slot Reassignment Contract` shipped after the repo added one explicit primary-slot supported-surface allowlist in `workspaceShellTypes.ts`, enforced that rule through the shared `setViewportSlotSurfaceKind(...)` seam in `useWorkspaceStore.ts`, relaxed the app-shell reassignment guard in `useAppShellViewportActions.ts` to honor the new contract, and added focused `useWorkspaceStore.test.ts` proof that startup still begins with a primary `modelViewer`, the primary slot can switch to supported `browser`, unsupported primary targets stay blocked, and surviving model viewers take back `activeViewerViewportId`
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

Current internal status:
- `Phase 1 - Primary Slot Reassignment Contract`
  - shipped
- `Phase 2 - Main Viewport Switch Action`
  - shipped
- `Phase 3 - Primary Catalog Switch Action`
  - shipped
- `Phase 4 - Restore And Zero-Viewer Honesty`
  - shipped
- `Phase 5 - Full Primary Workspace Reassignment Coverage`
  - shipped

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

- [x] Retire the current protected-primary-viewer reassignment guard so the main slot can truthfully stop being a `modelViewer`.
- [x] Keep the startup default intact so the app may still boot with a primary `modelViewer` even though that slot is no longer permanently locked after startup.
- [x] Prove the primary slot can switch through the shared slot-surface contract to one supported non-`modelViewer` workspace surface without widening into menu actions, persistence, or zero-viewer landing.

### `Model-Viewport-2 Phase 2`

- [x] Add one user-facing action path for switching the main `Model Viewport` slot to another supported workspace surface.
- [x] Keep the first supported target narrow and explicit by enabling primary-slot `Browser` through the existing viewport type submenu before any wider target list is attempted.
- [x] `HLG 1. The user should be able to change the main Model Viewport to a different workspace.`

### `Model-Viewport-2 Phase 3`

- [x] Expand the primary-slot switch action so the existing titlebar type submenu can also switch the main slot to `Catalog`.
- [x] Keep the widening explicit and narrow by unlocking primary-slot `Catalog` only after the shipped `Browser` baseline, without silently opening every remaining primary target.
- [x] Add focused proof that the primary-slot `Catalog` action is enabled and dispatches through the same shared reassignment path.

### `Model-Viewport-2 Phase 4`

- [x] Keep layout persistence, restore, and zero-viewer landing behavior honest after the primary slot may stop being a `Model Viewport`.
- [x] Ensure the new behavior remains compatible with the planned `Home Page` landing surface instead of restoring a hidden protected-viewer fallback.

### `Model-Viewport-2 Phase 5`

- [x] Retire the remaining primary-slot workspace-target limits so the main slot may switch to every supported workspace surface through the shared reassignment path.
- [x] Keep the widening explicit by proving the remaining supported workspace targets no longer need a special primary-slot allowlist exception path.
- [x] Leave any `Home Page` ownership and startup-policy semantics with the `Home Page` family even if that surface later becomes a valid primary-slot target.


## [x] `Model-Viewport-2` - `Phase 1 - Primary Slot Reassignment Contract`

### Phase 1 Summary

Lock the shared contract that the current main `Model Viewport` slot may change into another supported workspace surface.

Current status:
- shipped

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

## [x] `Model-Viewport-2` - `Phase 2 - Main Viewport Switch Action`

### Phase 2 Summary

Expose one user-facing action that lets the user switch the current main `Model Viewport` slot to another supported workspace surface.

Current status:
- shipped

### Phase 2 Implementation Spec

Current read:
- `Model-Viewport-2 / Phase 1` already shipped the shared primary-slot reassignment contract for supported `browser`
- the missing piece now is the first user-facing path
- `src/app/workspace/ViewportFrame.tsx`
  - still disables every non-`modelViewer` type-submenu entry whenever `isPrimary` is true
  - is the narrowest live UI seam blocking the user from reaching the shipped primary-slot contract
- `src/app/hosts/useAppShellViewportActions.ts`
  - already owns the context-menu surface-kind change action
  - now already honors the shipped primary-slot supported-surface contract
- `src/app/workspace/ViewportFrame.test.tsx`
  - already proves the type submenu opens and currently proves primary-slot `catalog` stays disabled
  - is the healthiest first UI verification surface for Phase 2

Must lock:
- one clear switch action for the main slot through the existing viewport titlebar type submenu
- the first user-facing supported target is `Browser` only
- unsupported primary targets such as `catalog`, `console`, `spaghettiEditor`, `notepad`, and `dashboard` should stay disabled in this phase
- no second router mode, launcher overlay, or special one-off shell surface picker
- this phase should not widen into persistence/restore or zero-viewer `Home Page` handoff

Likely files:
- `src/app/workspace/ViewportFrame.tsx`
- `src/app/hosts/useAppShellViewportActions.ts`
- `src/app/workspace/ViewportFrame.test.tsx`

Definition of done:
- the user has one explicit action path for changing the current main `Model Viewport` slot to `Browser`
- that action stays inside the existing viewport titlebar type submenu and the shared workspace model
- primary-slot `Browser` is enabled and functioning there
- unsupported primary targets still stay visibly disabled instead of silently no-oping
- no broader target list, persistence work, or zero-viewer handoff is silently absorbed here

## [x] `Model-Viewport-2` - `Phase 3 - Primary Catalog Switch Action`

### Phase 3 Summary

Add the next explicit primary-slot workspace target so the user may switch the main `Model Viewport` slot to `Catalog` through the same existing titlebar type submenu.

Current status:
- shipped

### Phase 3 Implementation Spec

Current read:
- `Model-Viewport-2 / Phase 2` already shipped the first user-facing primary-slot switch action for `Browser`
- the next requested widening is `Catalog`
- `src/app/workspace/workspaceShellTypes.ts`
  - still owns the explicit primary-slot supported-surface allowlist
  - currently still limits the primary slot to `modelViewer` and `browser`
  - is the first shared seam that must widen before the UI can truthfully support primary-slot `Catalog`
- `src/app/workspace/ViewportFrame.tsx`
  - now enables primary-slot `Browser` through the existing type submenu
  - is still the narrowest live UI seam for exposing the next supported target
- `src/app/workspace/ViewportFrame.test.tsx`
  - already proves the primary-slot submenu enables `Browser` and keeps `Catalog` disabled
  - is the healthiest first proof surface for flipping that next target intentionally instead of widening the whole menu
- `src/app/workspace/useWorkspaceStore.test.ts`
  - already proves supported primary-slot reassignment through the shared store seam and still treats unsupported primary `catalog` reassignment as blocked
  - is the healthiest shared-contract proof surface for widening the allowlist honestly instead of making the UI lie

Must lock:
- primary-slot `Catalog` becomes one explicit supported target through the same existing titlebar type submenu
- the widening stays narrow and intentional:
  - `Catalog` is added
  - unsupported primary targets such as `console`, `spaghettiEditor`, `notepad`, and `dashboard` remain disabled in this phase
- no new launcher, router mode, or one-off primary-slot picker
- this phase should not widen into persistence/restore or zero-viewer `Home Page` handoff

Likely files:
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/ViewportFrame.tsx`
- `src/app/workspace/useWorkspaceStore.test.ts`
- `src/app/workspace/ViewportFrame.test.tsx`

Definition of done:
- the user has one explicit action path for changing the current main `Model Viewport` slot to `Catalog`
- that action stays inside the existing viewport titlebar type submenu and the shared workspace model
- primary-slot `Catalog` is enabled and functioning there
- focused proof shows the shared primary-slot allowlist now accepts `Catalog`
- unsupported primary targets still stay visibly disabled instead of silently no-oping
- no persistence work or zero-viewer handoff is silently absorbed here

## [x] `Model-Viewport-2` - `Phase 4 - Restore And Zero-Viewer Honesty`

### Phase 4 Summary

Keep persistence, restore, and zero-viewer landing behavior honest once the primary slot no longer has to remain a `Model Viewport`.

Current status:
- shipped

### Phase 4 Implementation Spec

Current read:
- the workspace persistence layer already stores surface kinds and layout state, but stale active-viewer ids could still drift back to the old primary-viewer host identity during restore
- the shared store seams for changing slotted and detached surface kinds could still fall back to `primaryViewportId` even when another real model viewer survived elsewhere
- the broader `Home Page` family now wants a truthful zero-viewer landing state, so zero-viewer fallback should resolve to the current primary slot surface instead of a hidden protected viewer id

Must lock:
- saved layouts may restore with a non-`modelViewer` main slot when that is what the user last chose
- when another model viewer survives in either a slotted or detached surface, active workspace ownership should re-resolve to that real viewer instead of snapping back to the old primary-viewer host id
- zero open `Model Viewport` surfaces remain valid
- the zero-viewer landing path can return to `Home Page` or another valid workspace surface honestly by resolving to the current primary slot surface instead of reviving a hidden protected viewer id

Likely files:
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspacePersistence.ts`
- `src/app/workspace/useWorkspaceStore.test.ts`

Definition of done:
- persistence and restore remain truthful after the main slot may stop being a `Model Viewport`
- slotted and detached viewer transitions both re-resolve active workspace ownership to real surviving model viewers when they still exist
- zero-viewer landing behavior no longer depends on reviving a hidden protected primary viewer id
- the later `Home Page` direction stays compatible without moving ownership into this family

## [x] `Model-Viewport-2` - `Phase 5 - Full Primary Workspace Reassignment Coverage`

### Phase 5 Summary

Retire the remaining primary-slot target limits so the user may switch the main slot to any supported workspace surface through the normal shared workspace path.

Current status:
- shipped

### Phase 5 Implementation Spec

Current read:
- `Model-Viewport-2 / Phase 1` through `Phase 4` together establish the honest baseline:
  - the primary slot may stop being a `modelViewer`
  - the user can already switch that slot to `Browser` and `Catalog`
  - restore and zero-viewer behavior have their own closeout lane
- the remaining limitation after that baseline is the explicit primary-slot target allowlist
- `src/app/workspace/workspaceShellTypes.ts`
  - currently remains the owner of the primary-slot supported-surface allowlist
  - currently still limits the primary slot to `modelViewer`, `browser`, and `catalog`
  - is the live seam where the special-case target restriction can now be retired or widened honestly
- `src/app/workspace/ViewportFrame.tsx`
  - already routes the primary-slot type submenu through the shared supported-surface contract
  - is already the live user-facing action path for the shipped primary-slot `Browser` and `Catalog` targets
  - should not need a second special menu path when the remaining targets are opened
- `src/app/workspace/useWorkspaceStore.test.ts`
  - already proves the primary slot can switch to supported `browser` and `catalog`
  - still proves unsupported primary `console` stays blocked through the shared slot-surface seam
- `src/app/workspace/ViewportFrame.test.tsx`
  - already proves primary-slot `Browser` and `Catalog` are enabled in the titlebar type submenu
  - is the healthiest first UI proof surface for flipping the remaining targets intentionally instead of widening the whole lane without checks
- the remaining non-open primary-slot surfaces likely include:
  - `console`
  - `spaghettiEditor`
  - `notepad`
  - `dashboard`
- `Home Page`
  - stays explicitly out of this phase even if it later becomes a valid primary-slot target
  - its startup and landing semantics still belong to the `Home Page` family rather than this widening pass

Must lock:
- the primary slot may switch to every currently supported non-`Home Page` workspace surface through the same shared reassignment path
- the special primary-slot target allowlist is retired or widened to include the remaining shipped workspace targets instead of staying an arbitrary short list
- the viewport titlebar type submenu stays the user-facing action path for this phase
- the remaining targets opened here are:
  - `console`
  - `spaghettiEditor`
  - `notepad`
  - `dashboard`
- this phase should not re-open startup preference, restore honesty, zero-viewer landing, or `Home Page` launch policy

Likely files:
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/ViewportFrame.tsx`
- `src/app/workspace/useWorkspaceStore.test.ts`
- `src/app/workspace/ViewportFrame.test.tsx`
- adjacent workspace-surface proof surfaces only if one of the newly opened targets reveals a real slot-hosting gap

Definition of done:
- the primary slot is no longer artificially limited to only `modelViewer`, `browser`, and `catalog`
- the user may switch the main slot to `console`, `spaghettiEditor`, `notepad`, and `dashboard` through the same shared workspace path and existing titlebar submenu
- focused store and viewport-menu proof cover those newly opened primary-slot workspace targets
- `Home Page` ownership, startup semantics, and zero-viewer landing still stay with the `Home Page` family and the already-shipped `Phase 4` honesty lane
