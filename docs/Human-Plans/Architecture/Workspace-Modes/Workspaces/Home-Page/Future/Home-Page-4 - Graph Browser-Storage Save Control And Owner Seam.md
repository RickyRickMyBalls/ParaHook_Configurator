# [x] `Home-Page-4` - `Graph Browser-Storage Save Control And Owner Seam`

## Doc Header

### Doc History
2. 2026-04-19 18:21:08: Closed `Home-Page-4 / Phase 1` after the dedicated graph browser-storage persistence owner, graph-store bridge, recent working-set snapshot, Home Page remember/forget control, focused tests, and `npm run build` passed.
1. 2026-04-19 18:01:15: Created the standalone `Home-Page-4` Family Phase Doc so the remaining graph browser-storage HLG and CLG now route into a dedicated owner-seam phase with a recent working-set snapshot instead of a vague deferral.

### Purpose

This file is the implementation-planning surface for `Home-Page-4` in Home Page Generation 1.

Use it to:
- translate the preserved graph browser-storage HLG and CLG into Codex-sized implementation phases
- keep graph storage ownership separate from graph file IO and Home Page UI ownership
- prepare a Worker handoff for the dedicated persistence module and visibility/control surface

## Doc Body

### Why This Phase Exists

`Home-Page-4` exists because the Home Page goal for graph browser-storage is real, but the storage owner is not Home Page itself.

The Explorer read made the boundary clear:
- `src/app/spaghetti/store/useSpaghettiStore.ts` owns graph state and actions, not browser-storage ownership
- `src/app/io/graphDocumentPersistence.ts` is file IO, not browser persistence
- the browser-storage bucket should be a recent working-set snapshot, at minimum `graphDocumentsById`, `graphDocumentOrder`, and `activeGraphDocumentId`
- `Home Page` should expose the remember/forget policy and truthful visibility, not absorb graph truth

That means the first honest implementation cut is a dedicated graph browser-storage owner seam.

### Phase Boundary Rules

This family phase stays inside graph browser-storage ownership and Home Page visibility.

It does not own:
- graph file IO semantics
- all-time graph archive storage
- recent-items ownership
- Browser/project ownership
- full docs or changelog ownership
- unrelated storage cleanup

The first phase should prove the new owner seam before any wider Home Page storage story grows around it.

## Vision

`Home-Page-4` should make graph browser-storage honest.

The user should be able to tell whether the current graph working set is remembered in browser storage and should be able to turn that behavior on or off without Home Page pretending to own graph truth.

## Wishlist Organization

### High Level Goals

- [x] `Home-Page-Gen1-HLG-5. The user should be able to save what they have in their graphs in browser storage and turn that setting on or off.`

### Codex Level Goals

- [x] `Home-Page-Gen1-CLG-6. Add explicit user controls for graph persistence in browser storage without hiding graph truth inside Home Page.`

### `Home-Page-4 / Phase 1`

- [x] Introduce the dedicated graph browser-storage persistence module.
- [x] Delegate persistence from `useSpaghettiStore.ts` to the new module.
- [x] Persist the recent working-set snapshot shape for graph workspace state.
- [x] Expose the Home Page remember/forget control and truthful visibility for graph browser-storage.
- [x] Add focused tests for the new persistence seam and the Home Page read.
- [x] `npm run build`

## [x] `Home-Page-4 / Phase 1` - `Introduce Dedicated Graph Browser-Storage Owner Seam And Snapshot`

### Phase 1 Summary

This is the first implementation-ready slice for the graph browser-storage goal.

The phase should create the new owner seam, keep graph truth in the graph system, and let Home Page explain the policy without pretending it owns the storage data itself.

### Phase 1 Implementation Spec

#### Purpose

Introduce a dedicated graph browser-storage persistence owner seam whose bucket models the current recent working set of graph state.

#### Owns

- a dedicated browser-storage persistence module for graph workspace state
- the recent working-set snapshot payload
- the bridge from `useSpaghettiStore.ts` into the persistence module
- the Home Page row or control that exposes remember/forget policy for graph browser-storage
- focused tests for the persistence seam and the Home Page read

#### Does Not Own

- graph file IO
- graph document authoring semantics
- Browser/project ownership
- recent-items persistence
- all-time graph archives
- docs browsing or release-note ownership

#### Current Live Read

- `src/app/spaghetti/store/useSpaghettiStore.ts` owns graph state and actions today
- `src/app/io/graphDocumentPersistence.ts` is file IO and should stay separate from browser persistence
- the Explorer read identified a new dedicated graph browser-storage persistence module as the right owner seam
- the browser-storage bucket should be a recent working-set snapshot, at minimum `graphDocumentsById`, `graphDocumentOrder`, and `activeGraphDocumentId`

#### First Pass Decisions

1. Keep storage ownership in the dedicated graph persistence module, not in `useSpaghettiStore.ts`.
2. Keep graph document file IO separate from browser storage persistence.
3. Model the bucket as a recent working set rather than a single graph or full archive.
4. Keep Home Page focused on exposing policy and truth, not on owning graph semantics.
5. Add the smallest focused tests that prove the new seam and the Home Page read.

#### Likely Files

- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/io/graphDocumentPersistence.ts`
- a new dedicated graph browser-storage persistence module
- `src/app/workspace/HomePageSurface.tsx`
- `src/app/workspace/homePageStorageTransparency.ts`
- focused persistence and Home Page tests

#### No-Widening Rule

- do not move graph truth into Home Page
- do not fold file IO into browser persistence ownership
- do not widen into recent-items work
- do not widen into Browser/project ownership
- do not add unrelated storage cleanup or docs browsing

#### Verification Shape

- focused persistence-seam tests for the new graph browser-storage owner
- focused Home Page tests for the remember/forget visibility
- `npm run build`

#### Done Shape

- graph browser-storage has a dedicated owner seam
- the bucket models the recent graph working set
- Home Page can explain and control the policy without absorbing graph truth
- the implementation stays separate from graph file IO
