# LEG - Phase Plan

## Doc Header
### Fold Hack 3
#### Fold Hack 4
##### Doc History
3. 2026-03-08 00:00: Folded the concrete removal direction from `docs/Human-Plans/roadmap/LEAVING-legacy.md` into this reusable legacy phase plan so the no-legacy target, subsystem removal lanes, and practical order now live here too
2. 2026-03-08 00:00: Rebuilt this file into the settled reusable phase-plan format, collapsing the earlier top-level removal stages into one reusable `LEG - Phase 1` with `1A` through `1F` sub-phases
1. 2026-03-08 00:00: Created this planning file as the starting execution plan for identifying, classifying, and removing legacy features and compatibility seams from the app in a controlled way

##### Purpose

This file is the working plan for legacy-feature removal.

Use it for:
- identifying what is actually legacy in the current codebase
- separating real compatibility seams from still-needed product behavior
- deciding removal order and risk level
- tracking the path from still-present legacy to removed

Do not use this file for:
- canonical phase-family history
- long-form changelog history
- rewriting the architecture rules themselves

##### What `LEG` Means

`LEG` is the working cleanup/removal prefix for legacy seams that are still present in the codebase.

It is used when the main work is about:
- identifying compatibility layers that are no longer desired
- separating old proof/demo paths from canonical product paths
- planning removal order for legacy features and aliases
- tracking the movement from `[L]` legacy-to-remove to `[R]` removed

##### Format And Depth

Use this file as the reusable planning/checklist home for legacy-removal work.

This file follows the same fold-friendly structure used by the active family phase-plan docs:
- one main phase at `##`
- `Overview` and `CheckList` at `###`
- overview-side `Fold Hack 4`
- deeper sub-phase detail at `#####`

##### Fold Mode Guide

Quick fold guide for this file:
- `Ctrl+2` : List mode
- `Ctrl+3` : Human summary
- `Ctrl+4` : Checklist

## [~] - LEG - Phase 1 - `Legacy Removal Planning And Inventory`

Human Summary: This is the reusable legacy-removal planning phase. It exists to identify what is actually legacy, classify it correctly, define the safe replacement path, and move cleanup from vague suspicion into staged verified removal work.

### Phase 1 Overview
#### Fold Hack 4

##### Phase Notes

This file is meant to be reused.

Instead of creating a separate top-level phase for each early planning step, this phase keeps the legacy-removal workflow under one stable reusable `LEG - Phase 1` structure.

The main goal is not "delete old-looking code fast."

The goal is:
- correctly identify what is actually legacy
- prove what still matters
- remove what no longer belongs
- avoid breaking current working flows while cleanup happens

##### Phase Summary

Main intended outcomes:
- build a real inventory of legacy candidates instead of guessing
- separate compatibility seams from still-needed product behavior
- define the final no-legacy target clearly enough that removal has a destination
- define the canonical replacement path before removal
- plan low-risk to high-risk removal waves
- keep verification attached to each removal so cleanup does not silently break graph/build/viewer behavior
- maintain a live `[L]` to `[R]` tracker for removal progress
- keep legacy cleanup aligned with the future product story:
  - `Spaghetti` as canonical authoring truth
  - `Jake` as the simplified editing surface
  - graph-native worker/build contracts
  - one intentional current product path instead of dual old/new execution paths

##### Phase Sub-Phases

###### Phase 1A

Build the legacy inventory.

This sub-phase identifies what is actually legacy in `/src` and in the current docs markers instead of assuming every old-looking seam should be deleted.

The inventory should be grouped by real subsystem, not just by random file age.

###### Phase 1B

Classify each legacy candidate.

This sub-phase separates compatibility aliases, fallback paths, proof paths, deprecated user-facing surfaces, duplicate ownership seams, and naming debt so removals can be discussed precisely.

###### Phase 1C

Define the canonical replacement path.

This sub-phase makes sure each removable seam has a clear answer to:
- what replaces it
- whether the replacement already exists
- whether removal is safe now or must wait

This is also where the project should lock the real no-legacy target:
- `Spaghetti` is the only canonical product truth
- `Jake` is the simplified editing layer over drivers
- the worker consumes graph-native compiled build data
- legacy box-style editing is gone

###### Phase 1D

Plan removal waves.

This sub-phase groups legacy cleanup into low-risk through high-risk waves so removal can happen in controlled batches instead of one dangerous sweep.

The practical later waves should cover:
- legacy model-truth duplication
- legacy build-request patching
- fallback part-generation paths
- old node/port compatibility layers
- legacy app mode and panel assumptions
- old viewer/workbench carryovers that are no longer intentional
- old experiments that should become archive-only

###### Phase 1E

Define verification rules.

This sub-phase ensures that graph parsing, compile compatibility, worker payload behavior, preview identity, and visible UI behavior remain checked during removal.

###### Phase 1F

Keep a live removal tracker.

This sub-phase preserves a visible inventory of:
- `[L]` legacy features still present and intended for removal
- `[R]` removed features/seams already cleaned out

### Phase 1 CheckList

- [ ] 1. `LEG - Phase 1A - Build The Legacy Inventory`
  - [ ] define the final no-legacy target in one sentence before major removals begin
  - [ ] scan `/src` for explicit legacy markers:
    - `legacy`
    - compatibility
    - alias
    - fallback
    - proof/demo paths
  - [ ] scan the phase-plan files for existing `[L]` markers already identified during docs cleanup
  - [ ] create one grouped inventory of legacy candidates by subsystem:
    - app shell / mode switching
    - spaghetti schema / store compatibility
    - compiler compatibility
    - feature-stack compatibility
    - part-system proof paths
    - viewer / preview identity seams
    - worker/runtime compatibility
    - old experiments / archive-only systems
  - [ ] capture the current best target explicitly:
    - `Spaghetti` is the canonical authoring model
    - `Jake` is the simplified editing layer over drivers
    - the worker consumes graph-derived build data
    - legacy box-style editing is gone

- [ ] 2. `LEG - Phase 1B - Classify Each Legacy Candidate`
  - [ ] mark each candidate as one of:
      - compatibility alias
      - fallback path
      - proof path
      - deprecated user-facing mode
      - duplicate ownership seam
      - naming debt
  - [ ] give each candidate a removal status:
      - keep for now
      - replace first
      - safe to remove
  - [ ] give each candidate a risk level:
      - low
      - medium
      - high
  - [ ] identify which legacy candidates are really:
    - product-truth duplication
    - migration-era adapters
    - legacy UI surfaces
    - viewer/workbench carryovers worth keeping and modernizing
    - archive-only experiments

- [ ] 3. `LEG - Phase 1C - Define The Canonical Replacement Path`
  - [ ] for each removable legacy item, write what the canonical replacement already is
  - [ ] for each item that has no replacement yet, decide whether to:
    - keep it temporarily
    - build the replacement first
    - defer removal
  - [ ] avoid removing any seam that still protects current graph, build, or viewer behavior without a replacement
  - [ ] define the graph-native worker request target so `Spaghetti` compile output stops acting like a patch over legacy params
  - [ ] define the intended current product truth so app-level state orchestrates and graph/driver state owns product definition
  - [ ] define the intended part/runtime target so the real product builds through one durable compiled/runtime path

- [ ] 4. `LEG - Phase 1D - Plan Removal Waves`
  - [ ] Wave 1: low-risk naming and alias cleanup
  - [ ] Wave 2: compatibility wrappers and fallback paths
  - [ ] Wave 3: proof/demo paths and duplicate product surfaces
  - [ ] Wave 4: larger mode/system removals that affect app behavior
  - [ ] define verification requirements for each wave before code edits begin
  - [ ] include explicit wave candidates for:
    - legacy model-truth replacement with graph truth
    - worker request de-legacy work
    - part-generation fallback retirement
    - node and port compatibility cleanup
    - legacy app mode / panel removal
    - viewer/workbench carryover cleanup
    - old experimental-system keep vs archive decisions
    - docs/changelog language cleanup after code transition

- [ ] 5. `LEG - Phase 1E - Define Verification Rules`
  - [ ] list the expected behavior that must still work for each planned removal
  - [ ] list the tests to run for each planned removal wave
  - [ ] list the UI/manual checks to perform for each planned removal wave
  - [ ] do not remove a legacy seam if it still protects:
    - graph parsing
    - compile compatibility
    - worker payload compatibility
    - preview/render identity correctness
  - [ ] use the `R` marker only after a legacy item is actually removed
  - [ ] do not delete first and hope the architecture emerges later
  - [ ] replace first, prove parity, then delete

- [ ] 6. `LEG - Phase 1F - Keep A Live Removal Tracker`
  - [ ] add and maintain a concrete legacy inventory in this file or a linked support doc
  - [ ] use `[L]` for legacy features still present and intended for removal
  - [ ] use `[R]` once removal is complete
  - [ ] keep major removals tied back to the subsystem or phase-family they affect
  - [ ] keep docs cleanup in scope too once the code transition is real:
    - architecture wording
    - roadmap wording
    - changelog wording
    - historical migration notes moved to archive/history surfaces

##### Phase Plan

Best initial legacy-candidate buckets to inspect:
- app-level dual truth and legacy editing assumptions:
  - `inputMode: 'legacy' | 'spaghetti'`
  - box-param ownership in the app store
  - legacy-only UI that edits old param truth directly
- legacy build-request patching where graph compile output is still adapted into older request shapes
- fallback or duplicate part-generation paths where the real product is not yet owned by one durable compiled/runtime flow
- legacy compatibility aliases in the Spaghetti feature-stack helpers
- legacy port-id alias handling in graph/store/compiler flows
- proof-path nodes like `CubeProof`
- old `Option-B` naming that may no longer describe a real branch
- preserved singleton-key special cases once canonical multi-part identity is stable
- legacy input mode and legacy-only UI surfaces if they are no longer part of the intended product path
- old viewer/workbench carryovers that may be either:
  - worth keeping and modernizing
  - or only old experiments with no current role
- old experimental systems that need a status:
  - keep
  - redesign later
  - archive and remove

Recommended practical order:
1. define the final no-legacy target
2. strengthen graph-native product truth and remove dual truth
3. move worker requests and part generation toward graph-native paths
4. remove legacy app mode and old direct-param assumptions
5. remove compatibility aliases and fallback systems
6. decide viewer/workbench keep-vs-delete boundaries
7. clean docs and changelog language after the code transition
8. do the final delete pass

Next useful step:
- build the first actual legacy inventory from `/src`
