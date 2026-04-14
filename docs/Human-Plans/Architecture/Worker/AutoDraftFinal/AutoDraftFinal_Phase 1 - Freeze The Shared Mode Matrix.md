# AutoDraftFinal Phase 1 - Freeze The Shared Mode Matrix

## Doc Header

### Doc History
2. 2026-04-13 21:52: Marked `Phase 1 - Freeze The Shared Mode Matrix` complete after locking `previewBrep` to active `live` interaction in `selectViewportResultState.ts`, updating the stale churn-era selector expectations, adding the release/manual no-green proofs, and verifying both the selector and `ViewerHost` proof surfaces so later phases can treat the visible matrix as frozen instead of rediscovering it through bugs
1. 2026-04-13 21:51: Prepped `Phase 1 - Freeze The Shared Mode Matrix` for implementation by grounding the phase in the live selector, mode-behavior, and viewport proof seams, making the current `previewBrep` leakage and stale churn expectations explicit, and tightening the file targets, implementation order, verification bar, and stop rule so the first `AutoDraftFinal` implementation pass freezes the visible contract before selector-recipe or host-simplification work starts

### Purpose

This phase turns the `AutoDraftFinal` vision into one explicit implementation matrix the code can depend on.

It exists so later implementation work stops arguing with unstated mode meaning.

### Owns

- locking the nine-state visible behavior matrix for:
  - `Auto / Live`
  - `Auto / On Release`
  - `Auto / Manual`
  - `Draft / Live`
  - `Draft / On Release`
  - `Draft / Manual`
  - `Final / Live`
  - `Final / On Release`
  - `Final / Manual`
- making `previewMesh`, `previewBrep`, and `lastLoaded` usage explicit instead of implied
- updating selector expectations so they prove the frozen matrix instead of the older churn contract

### Does Not Own

- selector-owned layer recipe creation
- committed baseline ownership cleanup
- `ViewerHost.tsx` simplification
- broad worker scheduling redesign

## Doc Body

### Goal

- freeze one explicit visible-result matrix before more implementation work lands

### Expected File Targets

- `docs/Human-Plans/Architecture/Worker/AutoDraftFinal/AutoDraftFinal-Vision.md`
- `docs/Human-Plans/Architecture/Worker/AutoDraftFinal/AutoDraftFinal-Index.md`
- `docs/Human-Plans/Architecture/Worker/AutoDraftFinal/AutoDraftFinal_Phase 1 - Freeze The Shared Mode Matrix.md`
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `src/app/components/ViewerHost.test.tsx`

### Current Live Read For This Phase

- `src/app/spaghetti/selectors/selectViewportResultState.ts`
  - already owns most product truth:
    - result priority
    - mode preference
    - `live` versus `release` versus `manual` suppression
    - `lastLoaded`, `previewMesh`, and `previewBrep` presentation-state selection
  - currently allows `previewBrep` after interaction whenever a preview-ready authoritative result exists and the requested mode is not `draft`
  - that means current code still lets:
    - `Auto / On Release`
    - `Auto / Manual`
    - `Final / On Release`
    - `Final / Manual`
    show a green-stage comparison state even though the new vision says green is `live`-only
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
  - already contains strong coverage for:
    - `Auto / Live` `previewMesh`
    - `Auto / Live` `previewBrep`
    - `release` drag suppression
    - settled `draft` returning to `lastLoaded`
  - still has stale churn-era expectations in:
    - `exposes retained final base eligibility in auto mode during parameter churn without promoting it as current final`
    - `uses retained draft mesh preview as the strict draft base during parameter churn`
  - those expectations still assume overlay-style churn where the current selector now returns `lastLoaded` visible truth
- `src/app/workspace/workspaceViewportResultMode.ts`
  - currently only exposes broad mode flags:
    - `allowsDraftDisplay`
    - `allowsFinalDisplay`
    - `allowsFinalReplacement`
  - it does not encode the full nine-state visual matrix by itself
  - this phase should keep it as a coarse mode helper unless the frozen matrix proves a small extension is required
- `src/app/components/ViewerHost.test.tsx`
  - already proves several read-through states
  - should stay a downstream proof surface in this phase, not the primary place where mode meaning is invented

### Matrix To Freeze In This Phase

#### 1. Shared rule

- `previewBrep` is `live`-only
- `on release` and `manual` families may show:
  - committed blue
  - yellow draft if needed
  - final blue when ready
- they must not use a separate green comparison stage

#### 2. `Auto / Live`

- idle:
  - settled accepted draft may read as `lastLoaded`
  - settled accepted final may read as ordinary base
- active:
  - `previewMesh` allowed
  - `previewBrep` allowed
- post-release:
  - newest available result remains visible
  - final blue may replace draft when authoritative promotion completes

#### 3. `Draft / Live`

- idle:
  - accepted draft settles as `lastLoaded`
- active:
  - `previewMesh` allowed
  - `previewBrep` not allowed
- post-release:
  - settled result remains draft-visible truth

#### 4. `Final / Live`

- idle:
  - accepted final settles as ordinary base
- active:
  - `previewMesh` not allowed as the visible winning state
  - `previewBrep` may appear only if a distinct preview-ready authoritative result exists
- post-release:
  - final remains the winning result

#### 5. `Auto / On Release`

- idle:
  - same settled truth as `Auto / Live`
- active drag:
  - no `previewMesh`
  - no `previewBrep`
- post-release:
  - yellow draft may appear if it is the newest available result
  - final blue replaces it when ready

#### 6. `Draft / On Release`

- idle:
  - accepted draft settles as `lastLoaded`
- active drag:
  - no `previewMesh`
  - no `previewBrep`
- post-release:
  - draft-visible truth may appear
  - no green stage

#### 7. `Final / On Release`

- idle:
  - accepted final settles as ordinary base
- active drag:
  - no `previewMesh`
  - no `previewBrep`
- post-release:
  - temporary yellow draft may appear if needed
  - final blue replaces it
  - no green stage

#### 8. `Manual`

- before explicit `Build`:
  - no visible transition begins on release
- after explicit `Build`:
  - each manual mode mirrors its corresponding `on release` visual story
  - therefore:
    - no green `previewBrep` in `Auto / Manual`
    - no green `previewBrep` in `Final / Manual`

### First Proof Set

- one selector proof for each of these contract edges:
  - `Auto / Live` active interaction may expose `previewMesh`
  - `Auto / Live` active interaction may expose `previewBrep`
  - `Auto / On Release` active interaction suppresses both preview states
  - `Auto / On Release` post-release does not expose `previewBrep`
  - `Final / On Release` post-release does not expose `previewBrep`
  - `Auto / Manual` stays visually unchanged before explicit `Build`
  - `Final / Manual` does not expose `previewBrep` after explicit build starts
- one focused host read-through proof only if selector-visible state ids change enough that a host expectation must move with them

### Implementation Target

- the selector and its tests stop carrying ambiguous mixed-era behavior
- the codebase has one explicit answer for when each presentation state is legal
- later phases can treat the matrix as fixed instead of rediscovering it through bugs

### Verification Bar

- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
  - stale churn expectations are replaced by matrix-aligned expectations
  - missing on-release and manual no-green proofs are added
- `src/app/components/ViewerHost.test.tsx`
  - any selector-visible state changes that alter read-through expectations are covered
- targeted vitest runs:
  - `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
  - `src/app/components/ViewerHost.test.tsx` only if the selector-visible contract change requires it

### Implementation Order

1. Lock the phase doc and index language so the nine-state matrix is explicit and no longer implied.
2. Update the stale selector expectations in `src/app/spaghetti/selectors/selectViewportResultState.test.ts` so they assert the frozen matrix instead of older churn-era overlay assumptions.
3. Add the missing selector proofs for:
   - `Auto / On Release` no green stage after release
   - `Final / On Release` no green stage after release
   - `Manual` no visible change before explicit build
4. Narrow `src/app/spaghetti/selectors/selectViewportResultState.ts` only as much as needed so the frozen matrix is true in selector output.
5. Re-run focused selector tests, then touch `ViewerHost.test.tsx` only if the selector-visible contract shift changes expected read-through state.

### Important Rule

- this phase should freeze meaning, not redesign seams
- prefer changing selector expectations and the smallest selector logic needed to make the matrix true
- do not widen into layer-recipe ownership or `ViewerHost.tsx` cleanup yet

### Stop Rule

- stop once the nine-state matrix is explicit and enforced at the selector contract level
- stop before introducing a new layer-recipe type, baseline owner, or host simplification pass

## Status

- `[x] complete`

### Landed Result

- `previewBrep` is now emitted only during active `live` interaction
- `release` and `manual` selector outputs no longer surface green-stage comparison state after release or explicit build
- the stale churn-era selector expectations were rewritten to the settled `lastLoaded` contract
- the phase now has explicit selector proofs for:
  - `Auto / On Release` no green stage after release
  - `Final / On Release` no green stage after release
  - `Manual` unchanged before explicit build
  - `Final / Manual` no green stage after explicit build starts

### Verification

- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `src/app/components/ViewerHost.test.tsx`
