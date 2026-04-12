# Cleanup Phase Cleanup-3 - Shared Boundary And Worker Contract Repair

## Doc Header

### Doc History
1. 2026-04-12 13:42: Created this standalone `Cleanup 3` future phase doc to give the worker/app shared-boundary repair lane one explicit planning surface under the Cleanup family

### Purpose

This doc defines the third cleanup phase for the `Cleanup` family.

Use it to answer:
- what the shared-boundary problem currently is
- how worker-facing contract truth should be repaired
- what the likely sequencing is for making the boundary real

Do not use it for:
- speculative protocol redesign beyond the cleanup need
- implementation detail for unrelated worker features
- replacing `Worker/` feature planning docs

### Relationship To Other Docs

- `../Cleanup-Index.md`
  - family scan surface

- `../Cleanup-Vision.md`
  - boundary-repair lane framing

- `../Canonical-Ownership-Targets.md`
  - worker-facing contracts ownership target

- `../../Worker/Worker-Vision.md`
  - worker scheduling and runtime direction

## Doc Body

## [ ] Cleanup 3 - Shared Boundary And Worker Contract Repair

### Header

Purpose:
- create one honest shared boundary for worker-facing contracts so worker code stops depending on app implementation folders as if they were shared protocol

Owns:
- the shared worker/app protocol boundary decision
- moving worker-facing contract truth into an explicit shared surface
- reducing direct worker imports from app internals

Does not own:
- worker runtime scheduling redesign
- graph/runtime ownership decisions beyond the boundary itself
- broad reorganization of every app type

### Why This Phase Exists

The cleanup docs already show one repeated problem:
- lint and docs imply a cleaner worker boundary than the code currently has

That means the architecture direction is already visible.
The implementation is simply behind it.

This phase exists to make the shared boundary real enough that:
- worker files stop reaching inward
- app internals stop masquerading as shared protocol
- later cleanup phases can rely on a stable contract seam

### Scope

This phase covers:
- worker/app shared contract placement
- rerouting imports to the chosen shared surface
- clarifying boundary ownership for types both worker and app use

This phase does not cover:
- every worker behavior detail
- final protocol ergonomics for future features
- broad source-folder cleanup outside the boundary seam

### Current Read

Current problem shape:
- worker-facing types are still partly spread across shared types, app spaghetti contracts, and worker-local imports
- the codebase already wants a cleaner shared seam, but not all files honor it yet

### Locked Direction

- if app and worker both need the type, it should live in an explicit shared boundary
- worker files should not import arbitrary app implementation internals
- shared boundary repair should be narrower than a giant worker rewrite

### Phase Ladder

## [ ] Phase 1 - Lock The Shared Boundary Home

Purpose:
- decide the real home for worker-facing shared contracts

Likely target:
- `src/shared/`
- or `src/app/protocol.ts` only if that remains the chosen boundary name and stays truly boundary-shaped

## [ ] Phase 2 - Audit Current Contract Drift

Purpose:
- list which worker-facing types and imports are currently living in the wrong place

Expected output:
- shared-boundary candidates
- app-internal imports that need rerouting
- any bridge types that can remain temporary during migration

## [ ] Phase 3 - Move The Shared Contract Truth

Purpose:
- create or tighten the shared boundary and move the true shared contracts there

Focus:
- keep the shared surface explicit and small
- avoid dragging feature implementation detail into the shared layer

## [ ] Phase 4 - Repoint Worker And App Imports

Purpose:
- stop reaching into implementation folders from worker-facing code

Done shape:
- worker and app both depend on the shared contract surface
- the old inward imports no longer define the de facto protocol

### Acceptance Checks

- worker-facing contracts have one explicit home
- worker files no longer depend on arbitrary app internals for shared protocol
- boundary rules in docs and code stop contradicting each other

### Likely Related Files

- `src/shared/`
- `src/app/protocol.ts`
- `src/app/buildDispatcher.ts`
- `src/app/spaghetti/contracts/`
- `src/worker/`
- `docs/Human-Plans/Architecture/Worker/Worker-Vision.md`

### Success Read

This phase succeeds when:
- the worker/app contract seam is obvious from the folder layout
- docs, lint, and code tell the same story about what is shared
- later worker or graph cleanup no longer has to fight boundary ambiguity first
