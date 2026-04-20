# Console Gen1 Index

## Doc Header

### Doc History
8. 2026-04-19 23:07:45: Accepted `Console-1 / Phase 5` and closed `Console-1` / `Console-Gen1` after catalog expansion proof, optional Dashboard runtime coverage, and the five-phase HLG/CLG ladder satisfied all Generation 1 goals without requiring a follow-up phase.
7. 2026-04-19 22:59:25: Accepted `Console-1 / Phase 4` coverage after Workspace Modes target identity carried slotted and detached host states through one shared model, then advanced the routing read to make `Console-1 / Phase 5` the next worker-ready surface catalog expansion proof and generation closeout slice.
6. 2026-04-19 22:49:29: Accepted `Console-1 / Phase 3` coverage after runtime Workspace Modes actions were guarded by shared eligibility before owner-backed execution, then advanced the routing read to make `Console-1 / Phase 4` the next worker-ready unified host-state identity slice.
5. 2026-04-19 22:27:10: Accepted `Console-1 / Phase 2` coverage after chosen-viewport Workspace Modes menus were rewired to shared eligibility, then advanced the routing read to make `Console-1 / Phase 3` the next worker-ready runtime guard and diagnostics slice.
4. 2026-04-19 22:18:15: Accepted `Console-1 / Phase 1` coverage after the shared workspace action eligibility read model landed with focused tests and build proof, then advanced the routing read to make `Console-1 / Phase 2` the next worker-ready slice.
3. 2026-04-19 22:04:46: Expanded the Console Generation 1 routing read so `Console-1` explicitly carries the five implementation phases needed to complete the intake HLG/CLG instead of implying one large phase can finish the whole generation.
2. 2026-04-19 21:35:37: Reformatted the Console Generation 1 index against the current Architecture Setup guide rails, adding the normal Doc Body, Vision, Wishlist Organization, and top-level `Console-1` family-phase routing sections while preserving the Console Workspace Modes HLG/CLG.
1. 2026-04-19 21:29:35: Created the Console Generation 1 index to route Console Workspace Modes surface parity into catalog-driven action eligibility, shared shell action ownership, and one implementation-ready `Console-1` family phase.

### Purpose

This file is the active `Generation 1` planning index for the `Console` workspace family under `Workspace Modes`.

Use it to answer:
- how the `Console` `Generation 1` vision becomes family phases
- which `Generation 1` HLG are preserved from `Console-Vision.md`
- which `Console-N` family phase should be prepped or implemented next
- how Console stays an adapter over shared workspace, shell, graph, and viewer owner seams

Do not use it for:
- broad Console north-star ownership that belongs in `Console-Vision.md`
- later Console generations after a dedicated `Console-GenN-Index.md` exists
- implementation-phase specs that belong in standalone `Future/` Family Phase Docs
- workspace surface lifecycle truth
- shell UI implementation details
- command-language redesign outside the routed family phases

### Family Structure

Use this folder like this:
- `Console-Vision.md`
  - broad Console direction and generation-level HLG
- `Console-Index.md`
  - older Console architecture/history bridge and phase index
- `Console-Gen1-Index.md`
  - active Generation 1 planning index
  - current HLG, CLG, wishlist organization, and family-phase routing surface
  - summary and boundary home for `Console-1`
- `Future/`
  - standalone implementation-ready `Console` Family Phase Docs
- `Shipped/`
  - shipped records for completed Console cuts

## Doc Body

### Short Version

Console Generation 1 should turn the existing `Root > Workspace Modes` branch into a catalog-driven workspace control surface.

The work should keep the shipped Console vocabulary while replacing brittle Console-specific surface/action allowlists with shared workspace catalog, support, and shell action-eligibility reads. Console should expose every workspace surface the shared slot UI can control, respect primary/non-primary rules, keep slotted/floating/detached/popout as one workspace model, and give unsupported actions either shared hidden-state behavior or clear owner-backed diagnostics.

### Current Planning Read

This file owns the active Generation 1 family-phase routing.

Current legal family-phase ladder:
- `Console-1` - workspace modes catalog-driven surface actions
  - `[x] Console-1 / Phase 1` - shared workspace action eligibility read model
  - `[x] Console-1 / Phase 2` - catalog-driven Workspace Modes menus
  - `[x] Console-1 / Phase 3` - owner-backed runtime action execution and diagnostics
  - `[x] Console-1 / Phase 4` - unified surface identity across host states
  - `[x] Console-1 / Phase 5` - surface catalog expansion proof and generation closeout

Important planning rule:
- use this index to choose and bound the next `Console-N` family phase
- use the standalone Future doc for worker-ready implementation phases/specs
- do not start runtime implementation from this index alone

## Vision

`Console-Vision.md` remains the broad north-star for the Console family.

This Generation Index Doc owns the current `Generation 1` family-phase routing read.

The healthy Generation 1 read is:
- the existing `Root > Workspace Modes` branch stays recognizable to users
- Console reads canonical workspace surface catalog/support data instead of maintaining surface allowlists
- Console and shell UI share one eligibility model for workspace actions
- primary and non-primary surface rules are explicit, tested, and consistent
- slotted, floating, detached, and popped-out host states remain one workspace model
- unsupported actions are hidden by shared eligibility or produce clear diagnostics from the owning seam

Boundary rules:
- if the question is broad Console purpose, use `Console-Vision.md`
- if the question is current Generation 1 family-phase order, use this index
- if the question is exact implementation steps, use the standalone `Future/` family phase doc

## Wishlist Organization

### High Level Goals

The canonical HLG live in `Console-Vision.md` under `## Human Level Goals`.
This index repeats the Generation 1 HLG so family phases can show precise coverage.

- [x] `Console-Gen1-HLG-1. Users can control every workspace surface from Console with the same action model exposed by the shared slot UI.`
- [x] `Console-Gen1-HLG-2. Console Workspace Modes should read canonical catalog/support data instead of maintaining surface allowlists.`
- [x] `Console-Gen1-HLG-3. Primary and non-primary workspace rules should be explicit, tested, and consistent between Console and shell UI.`
- [x] `Console-Gen1-HLG-4. Slotted, floating, detached, and popped-out surfaces should remain one workspace model, not separate Console concepts.`
- [x] `Console-Gen1-HLG-5. Unsupported actions should either be hidden by shared eligibility rules or produce clear diagnostics.`
- [x] `Console-Gen1-HLG-6. The planning should begin at the Console vision/generation level and work down into index/phase docs instead of jumping directly into one implementation phase.`

### Codex Level Goals

These CLG translate the Generation 1 HLG into implementation-sized routing goals.

- [x] `Console-Gen1-CLG-1. Route Console Workspace Modes surface and action visibility through shared workspace catalog/support and eligibility helpers.`
- [x] `Console-Gen1-CLG-2. Replace console-local action allowlists for Split, Viewport Type, Float, Pop Out or browser-open, and Close with shared owner-backed eligibility.`
- [x] `Console-Gen1-CLG-3. Keep primary and non-primary protections consistent between Console menus, Console execution guards, and shell UI affordances.`
- [x] `Console-Gen1-CLG-4. Preserve one workspace surface identity model across slotted, floating, detached, and popout states instead of branching Console behavior by host mode.`
- [x] `Console-Gen1-CLG-5. Add focused regression coverage so new workspace catalog entries and optional surfaces do not require hand-added Console allowlist patches.`
- [x] `Console-Gen1-CLG-6. Preserve the existing Root > Workspace Modes branch and shipped action vocabulary while replacing the brittle eligibility and runtime owner seams beneath it.`

### `Console-1`

- [x] Create a shared workspace action eligibility read model.
- [x] Derive Console Workspace Modes menus from shared eligibility.
- [x] Repoint runtime action execution to shared owner-backed helpers.
- [x] Keep surface identity truthful across slotted/floating/detached/popout host states.
- [x] Add catalog expansion proof for optional/future surfaces.
- [x] `Console-Gen1-HLG-1`
- [x] `Console-Gen1-HLG-2`
- [x] `Console-Gen1-HLG-3`
- [x] `Console-Gen1-HLG-4`
- [x] `Console-Gen1-HLG-5`
- [x] `Console-Gen1-HLG-6`
- [x] `Console-Gen1-CLG-1`
- [x] `Console-Gen1-CLG-2`
- [x] `Console-Gen1-CLG-3`
- [x] `Console-Gen1-CLG-4`
- [x] `Console-Gen1-CLG-5`
- [x] `Console-Gen1-CLG-6`

## [x] `Console-1` - `Workspace Modes Catalog-Driven Surface Actions`

### Family Phase Summary

`Console-1` should make the existing Console Workspace Modes branch read workspace surface/action availability from shared workspace truth and execute through shared owner seams.

The phase should preserve the visible branch and shipped command vocabulary while changing the underlying action visibility and runtime execution model so Console is no longer a parallel workspace-surface concept.

### HLG / CLG Coverage

- [x] `Console-Gen1-HLG-1`
- [x] `Console-Gen1-HLG-2`
- [x] `Console-Gen1-HLG-3`
- [x] `Console-Gen1-HLG-4`
- [x] `Console-Gen1-HLG-5`
- [x] `Console-Gen1-HLG-6`
- [x] `Console-Gen1-CLG-1`
- [x] `Console-Gen1-CLG-2`
- [x] `Console-Gen1-CLG-3`
- [x] `Console-Gen1-CLG-4`
- [x] `Console-Gen1-CLG-5`
- [x] `Console-Gen1-CLG-6`

### Owns

- shared action eligibility read model for Console Workspace Modes
- catalog-driven chosen-viewport action menu visibility
- owner-backed runtime action execution and diagnostics
- primary/non-primary parity between Console and shell UI
- slotted/floating/detached/popout targeting parity where the shared workspace model already supports it
- focused tests for the Console Workspace Modes branch and shared eligibility helpers

### Does Not Own

- redesigning the whole Console grammar
- creating a global command registry
- changing visible shell UI controls
- inventing new workspace modes
- making Console the lifecycle owner of workspace surfaces
- broad `ConsoleDock` decomposition beyond the existing `Console 11` cleanup lane

### Planning Read

- `Console-1 / Phase 1` is accepted as complete at the implementation-slice level.
- `Console-1 / Phase 2` is accepted as complete at the implementation-slice level.
- `Console-1 / Phase 3` is accepted as complete at the implementation-slice level, with unrelated broad `ConsoleDock.test.tsx` failures recorded outside the Phase 3 acceptance gate.
- `Console-1 / Phase 4` is accepted as complete at the implementation-slice level, with the same unrelated broad `ConsoleDock.test.tsx` caveat carried as residual suite risk.
- `Console-1 / Phase 5` is accepted as complete at the implementation-slice level, with the same unrelated broad `ConsoleDock.test.tsx` caveat carried as residual suite risk.
- `Console-1` is complete.
- `Console-Gen1` HLG/CLG are complete.
- No follow-up phase is required for the Console Workspace Modes surface parity generation.

### Family Phase Doc

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Console/Future/Console-1 - Workspace Modes Catalog-Driven Surface Actions.md`

## Deferred

- full Console command-language redesign
- user-customizable aliases
- AutoCAD alias import or compatibility review
- macro or scripting behavior
- new workspace surface families not already registered in the workspace catalog
- visible shell UI control redesign
