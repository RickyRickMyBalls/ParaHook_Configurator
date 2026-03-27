# Transform Phase Transform-4.4 - Console And Toolbar Adapter Cleanup

## Doc Header

### Doc History
2. 2026-03-26 23:55: Marked this phase shipped after the shared reference-transform adapter helpers and the remaining shell-polish fixes landed in code, moved the standalone phase record into `Shipped/`, and aligned the doc with the delivered `referenceTransformConsole.ts` seam plus the later handle-sync, escape, axis-input, and root-submit cleanup
1. 2026-03-26 22:10: Created this standalone `Transform 4.4` future phase doc to capture the remaining cleanup work after the shared draft/session and grouped-history passes, focusing specifically on reducing transform-specific duplication between Console and the transform toolbar so `ConsoleDock` stops acting as the hidden owner of prompt, breadcrumb, and submit policy

### Purpose

This phase cleans up the transform adapter layer after the core reference transform shell, draft sync, and grouped-history work are already in place.

Use it to answer:
- what transform-specific logic should move out of `ConsoleDock`
- how Console and toolbar should share one transform presentation model instead of formatting their own paths independently
- how handle-to-prompt, submit, cancel, and return-to-root behavior should be centralized
- how to reduce the number of transform-specific one-off patches needed for future cleanup

## Doc Body

## [x] Transform 4.4 - Console And Toolbar Adapter Cleanup

### Summary

`Transform 4.4` is the adapter cleanup pass after:
- `Transform 4.2`
  - shared store-owned reference draft/session truth
- `Transform 4.3`
  - grouped reference transform history presentation

By this point, the transform feature works, but the remaining adapter layer is still too ConsoleDock-heavy.

Before this phase:
- store/session ownership is mostly clean
- viewer callback seams are mostly clean
- Console and toolbar still duplicate transform path, prompt, and highlight logic in ways that make small behavior changes feel harder than they should

This phase keeps the shipped behavior while simplifying the architecture:
- `ConsoleDock` becomes a thinner dispatcher
- shared transform helpers own prompt creation, breadcrumb formatting, and entry/shell transition rules
- toolbar and Console both adapt into the same transform presentation model

### Shipped Result

The shipped `Transform 4.4` cut landed the intended adapter cleanup and polish:
- shared reference-transform breadcrumb, status-path, assist, prefill, and handle-resolution helpers now live in `src/app/console/referenceTransformConsole.ts`
- `ConsoleDock` now consumes that shared helper seam instead of owning all transform prompt and breadcrumb formatting inline
- `ReferenceTransformToolbar` now reuses the same shared transform presentation logic for status-path and handle-driven highlight alignment
- the remaining shell-polish fixes landed around handle-to-prompt sync, live-drag escape/cancel, relative-versus-absolute axis entry, and direct root scalar submit for `Rotate` and `Scale`

### Owns

- cleanup of transform-specific Console adapter code
- cleanup of transform-specific toolbar presentation code
- shared reference-transform helper extraction for breadcrumbs, prompts, and transition rules
- reduction of duplicate transform formatting and highlight logic across Console and toolbar
- locking one clean transform-shell adapter path before later transform phases widen further

### Does Not Own

- replacing the store-owned reference transform session model from `Transform 4.2`
- grouped-history storage/presentation decisions already locked in `Transform 4.3`
- new viewport history visuals
- traversal / preview / restore
- widening transform ownership to new target kinds in the same pass unless explicitly restated later

### Problem Read

The remaining difficulty is not mainly in the store or viewer.

The harder part is the transform adapter layer:
- `ConsoleDock` currently owns too much transform-specific orchestration
- Console builds transform breadcrumbs, prompts, submit behavior, and handle-sync behavior in one file
- toolbar also formats transform path/highlight state independently
- staged transform root choices live separately from live entry prompt rules

That means small behavior changes often touch:
- staged root choices
- live assist descriptor
- axis/plane prompt creation
- commit/cancel path
- handle-sync effects
- toolbar highlight logic

The result works, but it is more fragile than it should be.

### Locked Direction

#### 1. Keep the store/session model and clean up the adapter layer around it

Recommendation:
- keep the `Transform 4.2` reference session model as the runtime truth
- do not reopen the store model in this cleanup unless a narrow follow-on fix is required

Direction:
- `useAppStore` remains the owner of:
  - active reference transform shell
  - active entry state
  - active handle state
  - committed history
- `Transform 4.4` focuses on the Console/toolbar adapter layer instead of moving runtime ownership again

#### 2. Extract shared reference-transform Console helpers out of `ConsoleDock`

Recommendation:
- move transform-specific breadcrumb, prompt, and transition helpers into a dedicated module

Suggested module responsibilities:
- build transform root prompt/descriptor
- build live entry prompt/descriptor
- build axis prompt
- build plane prompt
- map active handle -> prompt/session behavior
- resolve `Enter`
- resolve `Esc`
- resolve post-commit return target

Direction:
- `ConsoleDock` should call those helpers
- `ConsoleDock` should stop being the only place that knows all transform prompt rules

#### 3. Use one shared transform presentation model for Console and toolbar

Recommendation:
- Console and toolbar should derive transform labels/path/highlight meaning from shared helpers/selectors instead of formatting them independently

Direction:
- path labels like:
  - `Select > References > Premade Foothooks > Large > Transform > Move`
  - `... > Transform > Move > Move X`
  should be generated from shared logic
- toolbar section/highlight state should also derive from that same model where possible

This reduces the current drift risk where Console and toolbar can both be "correct" but not identically correct.

#### 4. Centralize handle-sync behavior

Recommendation:
- keep store-owned `activeHandle`
- centralize the mapping from:
  - `axis`
  - `plane`
  - `center`
  - `free-rotate`
  into Console prompt state and toolbar emphasis

Direction:
- handle changes should not require separate policy in multiple places
- one shared transform adapter helper should decide:
  - whether Console stays at mode root
  - whether Console opens an axis prompt
  - whether Console opens a plane prompt
  - what toolbar row/section highlights

#### 5. Centralize entry submit and cancel policy

Recommendation:
- move reference transform submit/cancel policy into shared helpers so `Move`, `Rotate`, and `Scale` all follow one explicit rule set

Direction:
- root vec3/scalar entry
- axis float entry
- plane vec entry
- live gizmo drag
- `Esc`
- `CommitTransform`

should all flow through one small set of transform-specific transition helpers rather than scattered inline branches

#### 6. Keep staged root hierarchy separate from live entry prompt depth, but unify the formatting seam

Recommendation:
- keep `stagedNavigation.ts` responsible for root hierarchy choices like:
  - `Transform`
  - `Move`
  - `Rotate`
  - `Scale`
  - `CommitTransform`
- keep live entry prompt depth in the transform adapter layer
- use one shared formatting seam so the user sees one honest tree

Direction:
- staged root is still the correct owner of shell/root hierarchy
- live entry prompts should not each hand-roll their own breadcrumb style

### Implementation Direction

#### Shared Transform Adapter Module

Suggested new targets:
- `src/app/console/referenceTransformConsole.ts`
- optional smaller helper split if needed

Expected responsibilities:
- `buildReferenceTransformRootDescriptor(...)`
- `buildReferenceTransformEntryDescriptor(...)`
- `buildReferenceTransformAxisPrompt(...)`
- `buildReferenceTransformPlanePrompt(...)`
- `resolveReferenceTransformHandlePrompt(...)`
- `resolveReferenceTransformSubmit(...)`
- `resolveReferenceTransformEscape(...)`

Goal:
- move transform-specific policy out of `ConsoleDock`

#### Console

Primary target:
- `src/app/console/ConsoleDock.tsx`

Expected changes:
- keep wiring and dispatch here
- remove duplicated transform policy branches where the new helper module can own them
- reduce direct transform-specific formatting helpers in this file

Success condition:
- `ConsoleDock` becomes a caller of transform helpers instead of the hidden transform controller

#### Toolbar

Primary target:
- `src/app/components/ReferenceTransformToolbar.tsx`

Expected changes:
- reuse shared transform path/highlight helpers where possible
- reduce independent transform-path formatting
- keep grouped history render behavior intact from `Transform 4.3`

Success condition:
- toolbar still renders the same transform shell/history behavior, but with less duplicated transform semantics

#### Staged Navigation

Primary target:
- `src/app/console/stagedNavigation.ts`

Expected changes:
- keep root-choice ownership here
- avoid moving live prompt policy into staged-navigation
- narrow any remaining transform-root special casing to only the staged shell level

### Public Interfaces / Types

Expected additions:
- shared reference-transform Console/presentation helper exports
- possible small shared transform presentation types for:
  - entry depth
  - active axis / plane state
  - root vs entry prompt rendering

Expected constraints:
- do not redesign viewer callbacks in this phase
- do not redesign the store session shape in this phase

### Test Plan

Required verification:

- Console formatting:
  - root and entry breadcrumbs still render the full transform tree consistently
  - `Move`, `Rotate`, and `Scale` use the same prompt/return rules

- handle sync:
  - gizmo axis/plane/center/free-rotate behavior still drives Console and toolbar correctly

- submit/cancel:
  - root submit, axis submit, plane submit, and `Esc` still return to the correct transform-shell level
  - `CommitTransform` still exits the shell and returns to the selected target scope

- toolbar alignment:
  - toolbar highlight still matches prompt-driven and handle-driven state
  - grouped history from `Transform 4.3` remains unchanged

- regression:
  - reference transform shell behavior from `Transform 3` remains unchanged
  - reference draft/session sync from `Transform 4.2` remains unchanged

Suggested verification targets:
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/console/stagedNavigation.test.ts`
- `src/app/components/ReferenceTransformToolbar.test.tsx`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/store/useAppStore.test.ts`
- `tsc --noEmit`

### Assumptions And Defaults

- `Transform 4.4` is a cleanup phase, not a feature-redirection phase
- reference-first behavior stays the active scope for this cleanup
- the shared store-owned session from `Transform 4.2` remains the source of truth
- grouped-history behavior from `Transform 4.3` remains the active history shape
- the main goal is to reduce duplication and make future transform cleanup cheaper and safer
