# AutoDraftFinal Phase 5 - Full Nine-State Proof Matrix And Residue Removal

## Doc Header

### Doc History
2. 2026-04-13 22:58: Completed `Phase 5 - Full Nine-State Proof Matrix And Residue Removal` by adding one explicit nine-state selector matrix to `selectViewportResultState.test.ts`, adding a matching host-side layer-mapping matrix to `ViewerHost.test.tsx`, aligning the matrix expectations to the real settled retained-base contracts for `auto`, `draft`, and `final`, and keeping residue removal conservative so the older high-signal branch-local and preview-readiness tests remain in place instead of deleting useful edge-case proofs
1. 2026-04-13 22:46: Prepped `Phase 5 - Full Nine-State Proof Matrix And Residue Removal` for implementation by grounding the final slice in the post-Phase-4 state: selector-owned recipe meaning, explicit committed-baseline ownership, and a thinner `ViewerHost.tsx` are all in place, but the proof surface is still clustered around a handful of live corners rather than one explicit nine-state matrix, so the last phase now has one implementation-ready home for matrix hardening plus deletion of any leftover residue revealed by that proof pass

### Purpose

This phase hardens the full `AutoDraftFinal` system and removes whatever residue is left after the proof matrix is complete.

It exists so we stop reopening the viewport seam one corner at a time and instead prove the whole mode and timing system together.

### Owns

- the full nine-state proof matrix across:
  - `Auto`
  - `Draft`
  - `Final`
  - `Live`
  - `On Release`
  - `Manual`
- final cleanup of leftover residue revealed by that proof matrix
- tightening the test surface so the family can act like a stable system instead of a chain of local fixes

### Does Not Own

- new product behavior
- new selector or host architecture phases
- worker invalidation or dependency redesign outside the current viewport contract
- unrelated viewer-engine work

## Doc Body

### Goal

- prove the complete mode and timing system end to end, then remove any last residue that the matrix shows is no longer needed

### Expected File Targets

- `docs/Human-Plans/Architecture/Worker/AutoDraftFinal/AutoDraftFinal-Index.md`
- `docs/Human-Plans/Architecture/Worker/AutoDraftFinal/AutoDraftFinal_Phase 5 - Full Nine-State Proof Matrix And Residue Removal.md`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `src/app/components/ViewerHost.test.tsx`
- any tiny helper or viewer files only if the matrix exposes truly dead residue

### Current Live Read For This Phase

- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
  - already covers several important seams:
    - settled `lastLoaded` states
    - branch-local draft live interaction
    - branch-local `previewBrep` live interaction
    - release/manual no-green behavior for final
  - but it is still organized as targeted corner cases, not one explicit nine-state matrix
- `src/app/components/ViewerHost.test.tsx`
  - already covers:
    - retained final stability
    - settled draft read-through
    - `previewBrep` overlay
    - branch-local interaction
    - presentational recipe mapping
  - but it still lacks one clearly grouped matrix proving the family by mode and timing combination
- code residue risk after Phase 4
  - the big architectural seams are now in good shape
  - the remaining likely residue is smaller:
    - duplicate or low-signal tests proving older corner names instead of matrix intent
    - tiny adaptation helpers or compatibility branches that the matrix may show are no longer needed

### Required Nine-State Matrix

The final proof matrix should cover all of these:

1. `Auto / Live`
2. `Auto / On Release`
3. `Auto / Manual`
4. `Draft / Live`
5. `Draft / On Release`
6. `Draft / Manual`
7. `Final / Live`
8. `Final / On Release`
9. `Final / Manual`

And for each state family, prove the relevant moments:
- idle
- active drag when applicable
- release without explicit build when applicable
- explicit build start when applicable
- settled winner promotion
- unchanged sibling stability for branch-local cases where relevant

### Matrix Expectations To Lock

#### Live family

- `Auto / Live`
  - can show `previewMesh`
  - can show `previewBrep`
  - settles to newest visible truth and then final blue when available
- `Draft / Live`
  - can show `previewMesh`
  - does not use green `previewBrep`
  - settles on draft
- `Final / Live`
  - can show `previewBrep`
  - does not leak yellow draft overlay when selector-visible overlay truth is absent

#### On Release family

- drag stays calm
- no live yellow churn during drag
- no green `previewBrep` stage
- post-release winner is:
  - `Auto`: yellow draft if needed, then blue final
  - `Draft`: yellow draft and stay there
  - `Final`: yellow draft if needed, then blue final

#### Manual family

- before `Build`, the viewport stays visually unchanged
- after `Build`, behavior mirrors the corresponding `On Release` family
- no green `previewBrep` stage outside `Live`

### Residue Removal Target

Only after the proof matrix is complete:

- remove any low-value or duplicate test cases that are now fully subsumed by matrix coverage
- remove any tiny compatibility branches or helper residue that the matrix proves is dead
- keep only high-signal proofs that explain the system by matrix state or critical edge case

### First Proof Graph

- one shared sketch feeds two parallel `Extrude` nodes
- both extrudes publish into `Output Preview`
- one branch rebuilds while the sibling is retained
- this graph should remain the primary changed-versus-unchanged proof shape for:
  - live branch-local preview
  - release/manual calm behavior
  - unchanged sibling stability

### First Proof Set

- selector matrix proofs
  - all nine combinations prove the expected visible result and recipe shape
- host matrix proofs
  - representative read-through proofs across all nine combinations verify the selector-owned recipe reaches the viewer correctly
- residue pass
  - after matrix proofs are green, remove any older tests or tiny helpers that no longer add signal

### Implementation Target

- `selectViewportResultState.test.ts`
  - reorganize or extend the suite so the nine-state matrix is explicit and easy to scan
- `ViewerHost.test.tsx`
  - add read-through coverage for the remaining missing mode and timing states
- code cleanup
  - only delete residue once the matrix proves the replacement contract fully

### Verification Bar

- targeted vitest runs:
  - `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
  - `src/app/components/ViewerHost.test.tsx`
- the family should be able to point to one explicit matrix proving the contract, not a loose set of historical edge tests

### Landed Result

- `selectViewportResultState.test.ts`
  - now contains one explicit nine-state selector matrix covering:
    - `Auto / Live`
    - `Auto / On Release`
    - `Auto / Manual`
    - `Draft / Live`
    - `Draft / On Release`
    - `Draft / Manual`
    - `Final / Live`
    - `Final / On Release`
    - `Final / Manual`
  - locks the selector-visible winner, preview-state kind, and layer-recipe shape for one representative moment in each state family
  - now encodes the real settled retained-base distinctions instead of flattening everything into one generic final-state expectation
- `ViewerHost.test.tsx`
  - now contains one matching nine-state host matrix focused on the post-Phase-4 seam:
    - recipe-to-viewer layer mapping
    - base-layer style mapping
    - overlay-style mapping
    - `previewBrep` overlay opacity
  - keeps the host proof thin and presentational instead of reintroducing a larger integration seam
- residue removal
  - no runtime code deletion was required
  - older high-signal branch-local and preview-readiness tests were intentionally kept because they still explain critical edge cases that the compact matrix does not replace by itself

### Verification Result

- `npm test -- src/app/spaghetti/selectors/selectViewportResultState.test.ts`
  - pass
- `npm test -- src/app/components/ViewerHost.test.tsx`
  - pass

### Implementation Order

1. Write the explicit nine-state matrix as test intent before deleting anything.
2. Add missing selector proofs for uncovered combinations or moments.
3. Add missing host read-through proofs for uncovered combinations or moments.
4. Re-run the focused suites and confirm the matrix is stable.
5. Remove only the residue that the matrix clearly supersedes.
6. Re-run the focused suites again and stop.

### Important Rule

- this phase is primarily proof and cleanup, not redesign
- do not invent new behavior while writing the matrix
- if the matrix exposes a real contradiction, fix it narrowly and keep the scope tied to proof hardening

### Stop Rule

- stop once the family has one explicit nine-state proof matrix and any clearly superseded residue has been removed
- stop before widening into unrelated worker or viewer architecture work
