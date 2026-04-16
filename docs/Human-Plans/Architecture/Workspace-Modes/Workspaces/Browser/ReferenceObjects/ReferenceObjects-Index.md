# Reference Objects

## Doc Header

### Doc History
18. 2026-04-15 20:21: Marked `ReferenceObjects-2.2` complete in the dedicated Browser reorganization ladder after grouped imported-reference drag-state, grouped preview stability, and grouped post-drop selection landed, and tightened the index so `ReferenceObjects-2.3` now reads as the direct next implementation handoff
17. 2026-04-15 17:12: Tightened `ReferenceObjects-2.3` into implementation-ready shape in the dedicated Browser reorganization doc so the final grouped Browser move delivery now reads as a direct thin batching pass over the shared move seam after `2.2` stabilizes grouped drag-state and preview truth
16. 2026-04-15 16:58: Marked `ReferenceObjects-2.1` complete after the grouped Browser drag research pass confirmed that grouped selection already exists, drag state and preview are still strictly single-row, and the shared imported-reference move seam is reusable, so `ReferenceObjects-2.2` now reads as the next direct Browser stability handoff
15. 2026-04-15 14:10: Split the queued grouped Browser reorganization work out of `ReferenceObjects-1` and into a new `ReferenceObjects-2 - Browser Reorganization` phase doc so the needed Browser research and stability ladder has its own home before the final grouped drag/drop delivery
14. 2026-04-15 14:06: Added `ReferenceObjects-1.4 - Multi-Select Browser Reorganization` as the next queued `ReferenceObjects-1` follow-on, grounding it in the already-shipped shared owner-move seam so grouped Browser drag/drop organization for reference objects reads as a narrow exposure pass instead of a fresh drag contract rewrite
13. 2026-04-15 13:26: Tightened `ReferenceObjects-1.3.1`, `1.3.2`, and `1.3.3` into implementation-prep shape so the visibility-command ladder now reads as three immediate handoff slices with locked build reads instead of only queued concepts
12. 2026-04-15 13:18: Broke the queued visibility work into a smaller `ReferenceObjects-1.3` ladder so the next command-surface work now reads as `3.1` selected-target hide entry, `3.2` root hide flow, and `3.3` `Unhide All` recovery through `Alt+H` plus root console command entry
11. 2026-04-15 13:34: Tightened the queued `ReferenceObjects-1.2 - Multi-Select Delete Parity` read into implementation-prep shape by locking it as the next direct handoff after single-select delete and summarizing that grouped delete should stay one shared eligibility-and-batching layer across console, keyboard, and Browser right-click
10. 2026-04-15 13:27: Expanded the queued `ReferenceObjects-1.3 - Console Hide Command Parity` read so it now explicitly supports both hide entry styles: root `Hide` followed by object picking, or single/multi-select first followed by `H` plus commit or `Shift+H` into the same hide flow
9. 2026-04-15 13:20: Tightened the queued `ReferenceObjects-1.3 - Console Hide Command Parity` read so it now explicitly means a root-level console `Hide` command flow, with `Shift+H` as the keyboard entry and an object-selection-then-commit sequence before the chosen reference objects are hidden
8. 2026-04-15 13:12: Added `ReferenceObjects-1.3 - Console Hide Command Parity` as the next queued follow-on after grouped delete so the reference-object ladder now explicitly calls out console visibility-command parity as the next open command-surface gap after delete work
7. 2026-04-15 13:06: Tightened the queued `ReferenceObjects-1.2 - Multi-Select Delete Parity` read so it explicitly includes Browser right-click delete exposure for deletable reference-object multi-selects alongside console and keyboard, keeping the next grouped-delete slice aligned across all three user entry points
6. 2026-04-15 12:25: Renamed `ReferenceObjects-1.1` from the rougher `Console And Keyboard Delete Sync` wording to `Single-Select Delete Parity`, and added `ReferenceObjects-1.2 - Multi-Select Delete Parity` as the next planned cut so the `Phase 1` ladder now reads as a cleaner single-select-then-multi-select delete sequence
5. 2026-04-15 12:45: Renamed the first future phase from `Cleanup And Polish` to `Phase 1` and tightened the index read so `ReferenceObjects-1` now behaves like an implementation-prep umbrella, with `Console And Keyboard Delete Sync` locked as the first concrete delivery instead of only a broad cleanup label
4. 2026-04-15 12:31: Expanded the first `ReferenceObjects-1` slice so it now covers both console delete sync and keyboard `Delete` support for viewport-selected reference objects, grounding the added scope in the existing workspace-selection object target path plus the current `inputRouting.ts` gap where `Delete` is still sketch-draw-only
3. 2026-04-15 12:24: Reframed the first `ReferenceObjects-1` implementation slice from Browser-side delete exposure to a `Console Delete Sync` pass after confirming Browser already has imported-reference remove actions, so the next real gap is exposing that delete path properly in the console when a reference object becomes the active selected target
2. 2026-04-15 12:15: Tightened the opening `ReferenceObjects-1` read so its first implementation slice is now explicitly `Delete Reference Object`, grounding the subfamily in the live Browser imported-reference removal seam instead of leaving the first pass as only general cleanup wording
1. 2026-04-15 12:08: Created this dedicated Browser `ReferenceObjects` subfamily index with `Future/` and `Shipped/` homes, and added the first `ReferenceObjects-1 - Cleanup And Polish` phase so reference-object-specific Browser cleanup can live in one canonical place instead of staying scattered across broader Browser docs

### Purpose

This file is the umbrella planning index for Browser `ReferenceObjects`.

Use it to answer:
- what Browser reference-object planning should own
- which reference-object rough-edge cleanup belongs here instead of in the broader Browser umbrella
- where future and shipped reference-object phase docs should live
- how reference-object polish should stay aligned with the converged Browser tree and shared owner model

### Family Structure

Use this folder like this:

- `ReferenceObjects-Index.md`
  - umbrella `ReferenceObjects` direction
  - live seam read
  - subfamily summary
- `Future/`
  - standalone implementation-ready `ReferenceObjects` phase docs
- `Shipped/`
  - shipped `ReferenceObjects` phase records

### Why This Doc Exists

The main Browser family already owns the larger hierarchy, owner-routing, drag, and container-truth resets.

That broader work now leaves a smaller class of follow-ons:
- Browser-local cleanup for source and imported reference-backed object rows
- lighter presentation and readability polish
- narrow action or interaction cleanup that should not reopen Browser-wide structure decisions

Those passes deserve their own planning home so they stay:
- easy to find
- narrow in scope
- honest about still depending on the shipped Browser convergence work

## Doc Body

### Short Version

Use this subfamily when the work is mainly about how Browser reference-object rows feel and read after the bigger Browser tree and owner-model resets already landed.

This subfamily should own:
- reference-object row cleanup
- readability and presentation polish
- small Browser-local interaction and action cleanup around reference-object rows

It should not own:
- a new Browser hierarchy reset
- new owner identity models
- transform-backend convergence
- larger reference catalog redesign

## [ ] `ReferenceObjects-1` - `Phase 1`

### Summary

The first `ReferenceObjects` phase should be the implementation-prep umbrella for the first narrow reference-object follow-ons.

Its first implementation slice should be:
- sync delete exposure across console and keyboard when a reference object is selected

This umbrella now has a dedicated future-phase home:
- `Future/ReferenceObjects_Phase ReferenceObjects-1 - Phase 1.md`

Current status:
- no dedicated `ReferenceObjects` phase has shipped yet
- `ReferenceObjects-1` is the next implementation-ready slice
- the first concrete cut inside `ReferenceObjects-1` is `Single-Select Delete Parity`
- the next queued cut after that is `Multi-Select Delete Parity` across console, keyboard, and Browser right-click, and it is now prepped as the direct implementation handoff
- the queued follow-on after delete parity is the `ReferenceObjects-1.3` visibility-command ladder
- `ReferenceObjects-1.3.1` is selected-target hide entry through `H` plus commit or `Shift+H`, and it is now prepped for implementation
- `ReferenceObjects-1.3.2` is root `Hide` plus object-pick flow, and it is now prepped for implementation
- `ReferenceObjects-1.3.3` is `Unhide All` recovery through `Alt+H` plus root console command entry, and it is now prepped for implementation
- the next Browser organization work now lives in `ReferenceObjects-2 - Browser Reorganization`
- `ReferenceObjects-2.1` is the grouped drag seam research cut
- `ReferenceObjects-2.2` is the Browser drag/drop stability cut
- `ReferenceObjects-2.3` is the final grouped Browser reorganization delivery
- later cleanup and presentation polish should stay behind that first delete-sync cut instead of diluting the implementation start

### Questions

- should the first pass stay Browser-local and avoid reopening the larger Browser-9 through Browser-11 structure work?
- should the first cut sync the console-selected reference-object session to the Browser remove capability before any later visual polish follow-ons?
- should that first console-sync pass reuse the existing Browser/store remove seam instead of inventing a second delete path?
- should the same first cut also let a viewport-selected reference object delete through the keyboard `Delete` key so Browser, console, and direct selection all stay aligned?
- should `ReferenceObjects-1` stay named as a neutral `Phase 1` umbrella so later `1.x` slices can stay implementation-ordered instead of overfitting the phase name to one early cleanup theme?

### Spec

- keep this index as the umbrella summary only
- use the dedicated `ReferenceObjects-1` future doc for execution-ready detail
- use the dedicated `ReferenceObjects-2` future doc for the grouped Browser reorganization ladder
- keep `ReferenceObjects-1` framed as an implementation-prep umbrella instead of another broad Browser architecture reset
- treat `Single-Select Delete Parity` as the first concrete implementation slice inside `ReferenceObjects-1`
- treat `Multi-Select Delete Parity` as the next delete follow-on once single-select parity is stable, keep that slice aligned across console, keyboard, and Browser right-click entry points, and keep it as one shared grouped-delete eligibility plus batching layer over the existing single-delete authority
- treat `ReferenceObjects-1.3` as the next command-surface umbrella after delete parity
- treat `ReferenceObjects-1.3.1` as the first visibility cut so selected-target hide entry lands before root flow
- treat `ReferenceObjects-1.3.2` as the root hide flow follow-on
- treat `ReferenceObjects-1.3.3` as the recovery slice for `Unhide All` through `Alt+H` plus root command entry
- keep all three visibility cuts routed through the same shared reference visibility authority so the command ladder stays coherent

## [ ] `ReferenceObjects-2` - `Browser Reorganization`

### Summary

The second `ReferenceObjects` phase should own the larger Browser grouped reorganization work.

This phase now has its own dedicated future-phase home:
- `Future/ReferenceObjects_Phase ReferenceObjects-2 - Browser Reorganization.md`

Current status:
- `ReferenceObjects-2` is the Browser organization umbrella after `ReferenceObjects-1`
- `ReferenceObjects-2.1` is the completed grouped drag seam research cut
- `ReferenceObjects-2.2` is now the completed Browser drag/drop stability cut
- `ReferenceObjects-2.3` is now the direct implementation-ready final grouped Browser reorganization delivery

### Spec

- keep grouped Browser reorganization out of `ReferenceObjects-1`
- use `ReferenceObjects-2` for the research, stability, and final delivery ladder
- keep the final grouped move behavior reusing the shared owner-move seam for imported-reference reparenting
