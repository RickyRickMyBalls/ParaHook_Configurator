# `Import-4 Phase 0.2` - `Shared Source Load And Child Derivation For Split Imports`

## Doc Header

### Doc History
7. 2026-04-16: Implemented `Import-4 / Phase 0.2.3 - Focused Performance Proof And Narrow Cleanup` by tightening the direct split performance proof around one shared source load across multiple derived siblings, tightening the viewer-host proof that grouped split rows do not fall back into repeated `ensureReferenceLoaded(...)` calls after handoff is available, and trimming the duplicated direct split group-id read in `ViewerHost.tsx` without widening the optimization lane
6. 2026-04-16: Prepped `Import-4 / Phase 0.2.3 - Focused Performance Proof And Narrow Cleanup` for implementation by grounding the final performance pass in the new direct split sibling-group contract, the viewer-local shared-source handoff path, and the focused viewer plus viewer-host proof seams so the optimization can be locked end to end without widening into generic caching or broader import-session work
5. 2026-04-16: Implemented `Import-4 / Phase 0.2.2 - Split-Child Derivation Handoff` by adding one dedicated direct split sibling handoff path in the viewer, wiring `ViewerHost.tsx` to derive unloaded grouped split children from one already-loaded source sibling instead of sending each child back through repeated `.glb` asset parse work, and proving the optimized behavior in focused viewer plus viewer-host tests
4. 2026-04-16: Prepped `Import-4 / Phase 0.2.2 - Split-Child Derivation Handoff` for implementation by grounding the next performance cut in the new `directPartSourceGroupId` sibling contract, the existing exploded-child handoff seam in `ViewerHost.tsx`, and the viewer's clone-and-isolate helpers so direct split `.glb` siblings can load once and derive many children without widening into generic asset caching
3. 2026-04-16: Implemented `Import-4 / Phase 0.2.1 - Shared Source Load Ownership For Direct Split Children` by adding one explicit `directPartSourceGroupId` runtime field for accepted direct split `.glb` siblings, wiring `commitStagedImportDraft()` so children from the same committed split file share one deterministic group id, and tightening staged store proof so the later handoff phase can reuse runtime truth instead of guessing sibling ownership from `assetPath`
2. 2026-04-16: Prepped `Import-4 / Phase 0.2.1 - Shared Source Load Ownership For Direct Split Children` for implementation by grounding the first performance cut in the direct part-backed child runtime shape, the current accepted split-child commit seam, and the viewer host plus viewer load owners so one explicit sibling-group identifier can land before the later derive-many-children handoff work begins
1. 2026-04-16: Created this standalone future execution doc for `Import-4 / Phase 0.2`, giving the now-working but still-slow staged `Multiple Objects In 1 Component` path its own dedicated performance lane centered on loading one shared source object once and deriving many child rows from that shared source instead of reparsing the same `.glb` per child

### Purpose

This doc defines the dedicated performance lane for staged split-import child loading after the `Phase 0.1` correctness repair.

Use it to answer:
- why the repaired `Multiple Objects In 1 Component` path still feels slow on larger `.glb` imports
- how ParaHook should achieve `load once, derive many children` for direct split-import rows
- what implementation cuts should stay separate from the earlier correctness repair lane
- what should stay out of scope while improving split-import load performance

### Why This Phase Exists

`Import-4 / Phase 0.1` repairs the broken staged split-import correctness path:
- direct part-backed child contract
- staged commit wiring
- truthful per-child rows under one parent component

But after the correctness fix, the staged split-import path is still performance-heavy.

The current read is:
- `src/app/components/ViewerHost.tsx`
  - still loads accepted visible imported references sequentially through `await viewer.ensureReferenceLoaded(item)`
  - does not yet provide a sibling-handoff optimization for direct split-import child rows
- `src/viewer/Viewer.ts`
  - now supports direct part-backed child loads
  - currently still loads the full shared asset per child, then isolates the requested mesh branch
  - already has a stronger existing `load once, derive many children` pattern for exploded rows via `handoffExplodedReferenceChildren(...)`
- `src/viewer/referenceAssetLoader.ts`
  - still creates a fresh loader and parses the full asset each time a split child loads
  - has no shared parsed-asset cache or split-group load owner today
- `src/viewer/referenceStructureInspection.ts`
  - already performs a full pre-add asset load for staged structure inspection
  - confirms that the same file may be parsed once before commit and then again once per accepted split child after commit

So the next honest gap is no longer correctness.

The next honest gap is:
- the repaired split-import path still reparses the same `.glb` too many times instead of using one shared source load and deriving many visible child rows from that shared source

## Doc Body

## [x] `Import-4 Phase 0.2` - `Shared Source Load And Child Derivation For Split Imports`

### Summary

#### Purpose:
- make accepted split-import child rows load faster by replacing repeated full-asset parse work with a shared-source derivation path

#### Target result:
- accepted split-import child rows still appear as independent Browser rows under one parent component
- one shared source object is loaded once per accepted split-import group
- visible split child rows are derived from that shared source instead of reparsing the same `.glb` for every child
- the older exploded handoff path remains explicit and separate unless a later cleanup lane deliberately unifies internals
- the `1 Object` path remains unchanged

#### Scope statement:
- this lane means performance improvement for accepted direct split-import child loads
- this lane does not mean generalized reference-asset caching across the whole app, background import jobs, or a redesign of all imported-reference loading

### Locked Direction

- prefer explicit `load once, derive many children` ownership over generic parallelization first
- treat direct split-import siblings as a real group:
  - one shared source load
  - many derived visible child rows
- prefer reusing the viewer's existing child-derivation pattern where possible:
  - clone
  - isolate mesh branch
  - attach as independent reference row
- keep the direct split-import path distinct from exploded child semantics even if the implementation reuses similar clone-and-isolate helpers
- do not widen into:
  - generic app-wide asset cache policy
  - import-session progress UI
  - staged import preview redesign
  - unrelated loader cleanup for formats outside the split-import hot path

### Non-Goals

This lane should not expand into:
- changing the shipped `1 Object` import path
- changing the staged review or preview Browser behavior
- generalized reference-load batching for every imported reference type
- full import-session concurrency tuning before duplicate full-asset loads are removed
- hidden Browser rows or new user-facing source rows unless a later subphase explicitly opens that design

### Internal Phase Ladder

The cleanest performance ladder is:

1. `Import-4 Phase 0.2.1 - Shared Source Load Ownership For Direct Split Children`
2. `Import-4 Phase 0.2.2 - Split-Child Derivation Handoff`
3. `Import-4 Phase 0.2.3 - Focused Performance Proof And Narrow Cleanup`

Reason:
- first define the one explicit owner for the shared source load so the optimization is not spread across ad hoc caches
- then wire the actual derive-many-children handoff path from that shared source
- finally lock the optimized behavior in proof and clean only the residue directly caused by the old repeated-load path

## [x] `Import-4` - `Phase 0.2.1 - Shared Source Load Ownership For Direct Split Children`

### Purpose

- give direct split-import child rows one explicit shared source-load owner

### Goal

- make the viewer recognize groups of direct split-import children that should reuse one loaded source object

### Locked Direction

- keep this phase ownership-focused:
  - define the grouping seam
  - define the shared source owner seam
  - do not yet wire the final child handoff behavior
- prefer a viewer-owned grouping seam over a broad loader-global cache as the first step
- keep the first pass `.glb`-focused:
  - the repeated full-asset parse problem is currently clearest on accepted split `.glb` children
  - do not generalize the grouping contract across all file types unless a later phase explicitly widens it
- prefer explicit sibling-group truth over implicit grouping by heuristics alone:
  - do not make the viewer guess only from `assetPath`
  - use runtime data that tells the viewer which direct split children belong to one accepted source group

### Expected Implementation Shape

- extend the direct split-import runtime contract with enough grouping truth to identify children that share one source load
- keep the grouping truth explicit and deterministic in runtime data
- avoid turning the generic asset loader into the first long-term owner of split-group performance policy

### Implementation-Prep Read

- `src/app/references/referenceManifest.ts`
  - `ReferenceLoadableItem` already carries:
    - `directPartSourceKind`
    - `sourcePartKey`
    - `sourceMeshIndex`
  - but it does not yet expose any sibling-group or shared-source identifier for direct split children
- `src/app/store/useAppStore.ts`
  - `ImportedReferenceRecord` is the narrowest runtime owner for accepted imported-reference provenance fields
  - `commitStagedImportDraft()` now commits direct split children correctly for `Phase 0.1.3`
  - but those committed children currently only carry:
    - shared `assetPath`
    - direct child marker
    - per-child part provenance
  - there is still no explicit grouping field that says which children should share one source load
- `src/app/components/ViewerHost.tsx`
  - already owns the reference-load orchestration and the exploded child handoff trigger
  - is the strongest seam that will eventually need to recognize direct split-import sibling groups
  - `Phase 0.2.1` should prepare that seam by making the grouping truth available, not by wiring the handoff yet
- `src/viewer/Viewer.ts`
  - already supports direct part-backed child loads
  - already supports exploded child handoff
  - does not yet have a direct split-import sibling-group concept
- `src/app/store/useAppStore.test.ts`
  - already has committed staged split-import proof
  - is the strongest place to lock the new sibling-group identifier once the runtime shape is extended

### First Pass Decisions

- keep `Phase 0.2.1` contract-only:
  - no performance handoff yet
  - no new viewer host orchestration yet
  - no Browser UI changes
- prefer one explicit shared-source group identifier over a broad hidden cache key policy
- make the grouping contract deterministic and easy to carry through the viewer:
  - every direct split child in one accepted split-import group should share the same group id
  - flat imports and `1 Object` rows should keep the field `null`
- keep the explode path separate:
  - exploded children should not silently start sharing this new direct split-import group field
- keep the first implementation grounded in accepted runtime state rather than staged preview-only state

### Exact First Code Cut

1. Extend the direct split-import runtime shape in the narrowest owner seam with one explicit shared-source group identifier for accepted split `.glb` children.
2. Update `commitStagedImportDraft()` in `src/app/store/useAppStore.ts` so all committed children that come from the same staged split-import file share that one group identifier.
3. Keep flat accepted rows and `1 Object` acceptance emitting no group identifier.
4. Thread the new group identifier through the Browser-facing reference item shape so viewer host and viewer owners can read it later without additional store guessing.
5. Tighten the existing staged split-import commit proof in `src/app/store/useAppStore.test.ts` so it explicitly asserts:
   - split siblings share one group identifier
   - flat accepted rows still keep the field `null`
   - the direct child marker and per-child part provenance still remain truthful

### Likely Files

- `src/app/references/referenceManifest.ts`
- `src/app/store/useAppStore.ts`
- `src/app/store/useAppStore.test.ts`

### No-Widening Rule

- do not implement the actual derive-many-children handoff in this phase
- do not add generic asset caching to `referenceAssetLoader.ts`
- do not change `ViewerHost.tsx` load sequencing yet
- do not change `Viewer.ts` to start deriving direct split children from a shared source yet
- do not widen this into non-`.glb` file-type grouping policy

### Implementation Risks

- choosing a grouping field that is too implicit, forcing later code to still guess ownership from `assetPath`
- making the grouping id unstable across one accepted sibling set
- accidentally assigning the group field to flat imports or exploded children
- putting the grouping logic in the viewer first instead of the runtime contract owner, which would recreate hidden policy
- widening this phase into the actual optimization instead of keeping it as the explicit ownership cut

### Checklist

- [x] add one explicit shared-source group identifier for accepted direct split `.glb` children
- [x] emit the same group identifier across siblings from one committed split-import file
- [x] keep flat and `1 Object` accepted rows on `null`
- [x] thread the new field into the Browser-facing runtime item shape
- [x] tighten staged commit proof for the new grouping contract

### Verification Shape

Minimum verification for this phase should cover:

1. committed direct split siblings now carry one shared source-group identifier
2. siblings from the same committed split file share the same identifier
3. flat accepted rows still keep the field `null`
4. direct child marker, part provenance, parent ownership, and ordering remain unchanged
5. no viewer handoff or loader behavior changes land in this phase

### Done Shape

- the runtime has one explicit way to identify direct split-import siblings that should share one source load
- the next phase can derive child rows from that shared source without guessing across unrelated references
- the later handoff phase can key directly off runtime truth instead of inferring sibling groups from `assetPath` alone

### Implemented Result

- `ReferenceLoadableItem`, `ImportedReferenceRecord`, and the Browser-facing runtime reference item shape now expose one explicit `directPartSourceGroupId` field
- accepted direct split `.glb` siblings now share one deterministic `directPartSourceGroupId` emitted by `commitStagedImportDraft()`
- flat accepted rows and `1 Object` acceptance still emit `directPartSourceGroupId: null`
- the existing staged split-import store proof now locks:
  - shared sibling group id for direct split `.glb` children
  - unchanged direct child marker and per-child provenance
  - unchanged flat accepted-row null behavior

## [x] `Import-4` - `Phase 0.2.2 - Split-Child Derivation Handoff`

### Purpose

- replace repeated full-asset child loads with one shared source load plus child derivation

### Goal

- when one direct split-import sibling group loads, the viewer should load the source object once and derive the child rows from it

### Locked Direction

- prefer a handoff pattern modeled after the existing exploded child flow
- reuse clone-and-isolate helpers where possible
- keep direct split-import children as normal visible Browser rows after handoff
- keep this phase handoff-focused:
  - use the new sibling-group id from `0.2.1`
  - load one source object once
  - derive many children from that source
  - do not widen into generic asset cache ownership
- keep the first pass `.glb`-focused and direct-split-specific
- keep the explode path explicit and separate even if helper internals are shared

### Expected Implementation Shape

- update the viewer and viewer host so direct split-import sibling groups can:
  - load one shared source object
  - derive isolated child objects for each sibling
  - mark each sibling as loaded without reparsing the same `.glb`
- keep exploded handoff explicit and separate even if helper internals are shared

### Implementation-Prep Read

- `src/app/components/ViewerHost.tsx`
  - already has one pre-load handoff effect for exploded children:
    - it finds unloaded exploded children whose loaded wrapper was just removed from the Browser item set
    - it calls `viewer.handoffExplodedReferenceChildren(...)`
    - it marks handed-off children as loaded without calling `ensureReferenceLoaded(...)`
  - this is the strongest orchestration seam to mirror for direct split siblings
  - `Phase 0.2.2` should likely add a parallel direct-split handoff effect rather than widen the generic sequential load loop first
- `src/viewer/Viewer.ts`
  - already exposes:
    - `handoffExplodedReferenceChildren(...)`
    - `createExplodedReferenceHandoffObject(...)`
    - clone-and-isolate helpers
  - already supports direct part-backed child loads, but still loads each child asset independently
  - this is the strongest seam for adding a direct split sibling handoff API that:
    - loads or reuses one shared source object
    - derives isolated child rows from that shared source
- `src/app/store/useAppStore.ts`
  - now emits:
    - `directPartSourceKind: 'split-import-child'`
    - `directPartSourceGroupId`
    - truthful `sourcePartKey`
    - truthful `sourceMeshIndex`
  - gives this phase the runtime truth needed to find siblings without guessing from `assetPath` alone
- `src/app/components/ViewerHost.test.tsx`
  - already has exploded handoff proof nearby
  - is the strongest seam for proving that direct split siblings can be marked loaded through handoff without repeated `ensureReferenceLoaded(...)` calls
- `src/viewer/Viewer.test.ts`
  - already proves exploded handoff behavior and direct child-load correctness
  - is the strongest seam for adding one focused proof that the new direct split handoff derives children from one loaded source object

### First Pass Decisions

- prefer a dedicated direct split handoff path over trying to overload the exploded handoff API
- keep the shared-source owner viewer-local in this phase:
  - do not add a global parsed-asset cache to `referenceAssetLoader.ts`
  - do not invent a hidden Browser row as a visible source owner
- preserve current Browser row semantics:
  - each child remains its own visible reference row
  - each child still has empty stored part descriptors after derivation, matching the current single-child direct load outcome
- keep the sequential generic load loop in place for non-optimized cases
- let the new handoff path short-circuit the slow per-child `ensureReferenceLoaded(...)` path only when:
  - the rows are direct split siblings
  - they share one `directPartSourceGroupId`
  - the viewer can derive them from one loaded source object

### Exact First Code Cut

1. Add a dedicated direct split sibling handoff API in `src/viewer/Viewer.ts`, parallel to the exploded handoff seam, that accepts a sibling group and derives child objects from one shared loaded source.
2. Reuse the existing clone-and-isolate helpers where possible so the direct split handoff does not duplicate mesh-derivation logic.
3. Update `src/app/components/ViewerHost.tsx` to detect unloaded visible direct split siblings that share one `directPartSourceGroupId`, trigger one handoff attempt, and mark handed-off siblings as loaded without falling through to repeated `ensureReferenceLoaded(...)` calls.
4. Keep the slower per-child load path as a fallback when handoff cannot run.
5. Add focused proof in:
   - `src/viewer/Viewer.test.ts` for deriving multiple direct split children from one shared source object
   - `src/app/components/ViewerHost.test.tsx` for the viewer-host orchestration that marks handed-off siblings loaded without repeated child asset loads

### Likely Files

- `src/viewer/Viewer.ts`
- `src/viewer/Viewer.test.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`

### No-Widening Rule

- do not add generic loader-global caching in `referenceAssetLoader.ts`
- do not redesign the imported-reference runtime contract again
- do not parallelize the generic reference load loop for unrelated reference rows in this phase
- do not change Browser UI, dialog copy, or staged preview behavior
- do not unify exploded and direct split handoff into one generalized abstraction unless the shared helper boundary is obviously narrow and local

### Implementation Risks

- accidentally keying the handoff only from `assetPath`, which would weaken the explicit sibling-group contract added in `0.2.1`
- deriving child rows from one source object but still allowing the generic sequential loop to re-load them immediately afterward
- overloading exploded semantics instead of keeping direct split handoff explicit
- adding too much hidden viewer state to manage one shared source object
- widening this performance phase into a broader caching system without proof it is needed

### Checklist

- [x] add a dedicated direct split sibling handoff seam in the viewer
- [x] update viewer host orchestration to use one shared-source handoff for grouped direct split siblings
- [x] keep per-child repeated full-asset parse work out of the optimized handoff path
- [x] preserve existing fallback behavior when the handoff path cannot run
- [x] add focused viewer and viewer-host proof for the optimized handoff behavior

### Verification Shape

Minimum verification for this phase should cover:

1. one direct split sibling group can derive multiple child rows from one loaded source object
2. the optimized handoff path does not require one full `.glb` asset parse per child
3. handed-off child rows still become loaded visible Browser rows
4. direct split child rows still keep empty stored part-descriptor lists after derivation
5. exploded handoff behavior remains unchanged

### Done Shape

- accepted direct split-import children no longer trigger one full `.glb` parse per child
- the user-visible Browser result stays unchanged while the load path gets faster
- the later proof-and-cleanup phase can measure and lock the new handoff behavior against the old repeated-load default

### Implemented Result

- `Viewer.ts` now keeps one viewer-local shared source object per `directPartSourceGroupId` and exposes a dedicated `handoffDirectPartBackedReferenceChildren(...)` API for deriving grouped split children from that shared source
- direct split child derivation now reuses the existing clone-and-isolate machinery instead of reparsing the same `.glb` once per child
- `ViewerHost.tsx` now:
  - detects grouped direct split siblings through `directPartSourceGroupId`
  - hands unloaded siblings off from one already-loaded source sibling
  - marks handed-off siblings loaded with empty part-descriptor rows
  - avoids sending multiple siblings from the same group through the slow sequential load path in the same pass
- focused proof now covers:
  - viewer-local derive-many-children behavior from one loaded source group
  - viewer-host orchestration that keeps unloaded split siblings off repeated `ensureReferenceLoaded(...)` calls once one group source is already loaded

## [x] `Import-4` - `Phase 0.2.3 - Focused Performance Proof And Narrow Cleanup`

### Purpose

- prove the optimization and clean only the residue directly caused by the old repeated-load path

### Goal

- leave the optimized split-import path covered and stable without widening the import family

### Locked Direction

- prefer focused proof around source-load reuse and child derivation behavior
- keep cleanup local to the direct split-import performance seam
- do not widen into generic reference-loading refactors unless a narrow retirement is already clearly unlocked
- keep this phase proof-and-cleanup-only:
  - no new runtime contract fields
  - no new viewer handoff branches
  - no Browser UI changes
- prefer removing only residue directly caused by the old repeated-load path
- keep the first pass `.glb`-focused and direct-split-specific

### Expected Implementation Shape

- add focused proof that one accepted split-import group reuses one source asset load
- add proof that derived child rows still remain truthful and independent Browser rows
- remove only the obsolete split-import repeated-load residue left by earlier phases

### Implementation-Prep Read

- `src/viewer/Viewer.test.ts`
  - now already proves:
    - direct split child load correctness
    - direct split handoff from one loaded group source
  - this is the strongest seam for adding one more explicit performance-oriented proof that shared-source derivation does not trigger repeated asset loads across siblings
- `src/app/components/ViewerHost.test.tsx`
  - now already proves the direct split host handoff path can mark unloaded grouped siblings as loaded without repeated child loads
  - gives this phase the strongest seam for tightening the end-to-end host-level behavior without needing a broad integration harness
- `src/viewer/Viewer.ts`
  - now contains:
    - direct split group source maps
    - direct split sibling handoff API
    - registration and unregister helpers
  - this is the strongest cleanup seam if any local duplication or retired branch residue is now clearly removable
- `src/app/components/ViewerHost.tsx`
  - now has:
    - one exploded handoff effect
    - one direct split handoff effect
    - guarded sequential load behavior for grouped split siblings
  - this is the strongest cleanup seam if a tiny simplification is now unlocked without altering behavior
- `src/app/store/useAppStore.test.ts`
  - already locks the committed direct split group-id contract
  - should likely stay unchanged in this phase unless one additional regression is clearly missing

### First Pass Decisions

- prefer tightening existing focused proof over adding broad new UI-driven integration tests
- keep cleanup small and obvious:
  - delete only residue that is directly superseded by the new handoff path
  - do not refactor for style alone
- preserve all existing split-import runtime contracts from `0.2.1` and `0.2.2`
- preserve exploded handoff behavior exactly
- if a cleanup idea requires explaining a broader architecture change, defer it instead of forcing it into this phase

### Exact First Code Cut

1. Tighten `src/viewer/Viewer.test.ts` so the direct split shared-source proof explicitly asserts the shared asset is loaded once across the source child plus derived siblings.
2. Tighten `src/app/components/ViewerHost.test.tsx` so the host-level proof explicitly asserts grouped split siblings do not fall back into repeated `ensureReferenceLoaded(...)` calls after handoff becomes available.
3. Inspect `src/viewer/Viewer.ts` and `src/app/components/ViewerHost.tsx` for one-pass cleanup opportunities directly caused by the old repeated-load path, such as:
   - redundant group checks
   - tiny helper duplication
   - dead or now-unnecessary local branches
4. Remove only the cleanup residue that is clearly retired by the shipped handoff behavior and keep all remaining behavior unchanged.

### Likely Files

- `src/viewer/Viewer.test.ts`
- `src/app/components/ViewerHost.test.tsx`
- `src/viewer/Viewer.ts`
- `src/app/components/ViewerHost.tsx`

### No-Widening Rule

- do not add generic parsed-asset caching in `referenceAssetLoader.ts`
- do not redesign the direct split group contract again
- do not parallelize unrelated reference loads
- do not change staged import UI or Browser copy
- do not widen this cleanup pass into general viewer architecture cleanup beyond what the direct split handoff clearly retires

### Implementation Risks

- writing proof that restates internal implementation details instead of the performance-relevant behavior
- broadening cleanup beyond the small residue directly replaced by the direct split handoff path
- accidentally weakening the fallback path for cases where handoff cannot run
- accidentally changing exploded behavior while trying to simplify shared helper code
- spending the phase on speculative cache work instead of locking the optimization already landed

### Checklist

- [x] tighten focused viewer proof around one-load-many-children direct split behavior
- [x] tighten focused viewer-host proof around handoff preventing repeated child loads
- [x] remove only narrow residue directly retired by the new handoff path
- [x] keep fallback and exploded behavior unchanged
- [x] leave broader caching or loader architecture work out of scope

### Verification Shape

Minimum verification for this phase should cover:

1. one direct split sibling group still loads the shared asset only once
2. derived child rows remain truthful and independent Browser rows
3. grouped split siblings do not re-enter repeated `ensureReferenceLoaded(...)` calls after handoff is available
4. exploded handoff behavior remains unchanged
5. no user-facing staged import behavior regresses while cleanup lands

### Done Shape

- the optimized direct split-import path is covered in focused proof
- the old repeated per-child full-asset load path is no longer the hidden default
- the remaining code around the direct split handoff is smaller or clearer without widening the architecture

### Implemented Result

- `src/viewer/Viewer.test.ts` now explicitly proves that one accepted direct split group can derive multiple sibling rows from one loaded source while keeping the shared `.glb` load count at one parse across the source child plus derived siblings
- `src/app/components/ViewerHost.test.tsx` now explicitly proves that once handoff is available for one loaded split source sibling, multiple unloaded grouped siblings are handed off together and do not fall back into repeated `ensureReferenceLoaded(...)` calls
- `src/app/components/ViewerHost.tsx` now uses one small `getDirectSplitSourceGroupId(...)` helper so the direct split group-id branch no longer lives in duplicate across the handoff effect and the guarded sequential load loop
- exploded handoff behavior, direct split fallback behavior, and the shipped Browser row semantics remain unchanged

### Verification

Minimum proof for `Import-4 Phase 0.2`:

1. accepted direct split-import sibling groups share one source load owner
2. one shared source object can derive many visible child rows
3. child rows still honor truthful `sourcePartKey` and `sourceMeshIndex`
4. exploded child flow remains explicit and intact
5. the `1 Object` path still behaves exactly as before

### Exit Criteria

`Import-4 Phase 0.2` is ready to implement when:
- the shared source load owner is explicit
- the derive-many-children handoff path is broken into narrow enough cuts for Codex to implement safely
- the optimization can be proven without widening into a generalized asset-loading rewrite
