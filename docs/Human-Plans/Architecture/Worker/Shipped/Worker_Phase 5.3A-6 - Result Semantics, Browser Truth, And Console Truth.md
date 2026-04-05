# Worker Phase 5.3A-6 - Result Semantics, Browser Truth, And Console Truth

## Doc Header

### Doc History
3. 2026-03-25 20:13: Marked this phase shipped after implementation, moved the standalone record from `Worker/Future/` into `Worker/Shipped/`, and kept the phase contract aligned with the landed code where `BuildResult.bundle` replaces flat top-level `parts`, accepted graph runtime state now stores canonical bundle truth with explicit rebuilt/retained/evicted entry status, Browser output shaping reads typed result-entry semantics, and Console adds deterministic bundle-summary narration
2. 2026-03-25 19:37: Tightened this future phase doc against the live `buildTypes`, app acceptance, spaghetti runtime, Browser row shaping, and worker transcript seams so `[5.3A-6]` now reads as an implementation-ready execution spec with a concrete bundle-wrapper direction, explicit entry fields, migration targets, sequencing rules, and exact verification files instead of only a semantic direction note
1. 2026-03-25 19:37: Created this standalone future phase doc for `[5.3A-6]`, turning the next worker semantic-strengthening cut into an implementation-ready planning surface that locks the `BuildResultBundle` direction, explicit rebuilt/retained/evicted truth, result-class coexistence, Browser aggregate-versus-atomic honesty, and Console-as-narrator ownership on top of the shipped `[5.3A-5]` runtime cleanup

### Purpose

This doc defines the sixth worker phase under `[5.3A]`.

Use it to answer:
- what should replace coarse top-level `PartArtifact[]` result truth
- how retained, rebuilt, and evicted output should be represented explicitly
- how transient, draft, and final result classes should coexist without semantic drift
- what Browser rows are allowed to claim about parent rebuild state
- how Console should narrate shared result truth without becoming the owner of semantics

### Why This Phase Exists

`[5.3A-5]` already removed the broad legacy runtime/startup fallback layer:
- empty graph startup now stays quiet
- graph-native build stats seed from active request identity
- targeted accepted outputs already preserve unaffected siblings
- surviving foothook-specific runtime behavior lives behind one explicit compatibility adapter seam

That groundwork removed the worst runtime ambiguity.

But the current result truth is still too coarse:
- `BuildResult` still returns top-level `parts: PartArtifact[]`
- accepted graph runtime state still stores flat accepted output arrays
- Browser and Console still have to read richer meaning from app-side merge behavior plus output-surface shaping

This phase exists to make result truth explicit enough that:
- Browser can present separate-build ownership honestly
- Console can narrate runtime truth honestly
- later `Build Path` history/scrub work can move across accepted result snapshots without guessing what changed

### Scope

This phase covers:
- the canonical accepted-result payload shape
- explicit rebuilt/retained/evicted entry semantics
- transient/draft/final coexistence rules
- Browser aggregate-versus-atomic status truth
- Console narration ownership over shared semantic facts

This phase does not cover:
- the dispatcher boundary
- empty-startup/runtime fallback deletion
- the final deletion of the compatibility adapter
- a full `Build Path` history UI
- broader Browser panel cleanup unrelated to build/result truth

## Doc Body

## [x] - `[5.3A-6]` - `Result Semantics, Browser Truth, And Console Truth`

### Header

Purpose:
- strengthen result semantics so Browser and Console can present honest runtime/build truth without reconstructing it from flat artifact arrays and merge side effects

Owns:
- the canonical accepted-result wrapper
- explicit rebuilt/retained/evicted entry truth
- transient/draft/final coexistence semantics
- Browser parent aggregate-state honesty
- Console-as-narrator ownership

Does not own:
- worker startup cleanup
- compatibility-adapter deletion
- a full history/scrubber UI
- Browser panel structure refactors

### Current Constraints

This phase starts from:
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-1 - Worker Audit And Legacy Startup Inventory.md`
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-2 - Graph-Native Worker Contract And Separate-Build Identity.md`
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-3 - Worker Lane Definition And Execution-Intent Model.md`
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-4 - Dispatcher Boundary Cleanup.md`
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-5 - Legacy Runtime And Startup Fallback Removal.md`

Locked constraints from earlier phases:
- the canonical live worker lane is still `build`
- `assemble` remains compatibility-only and should not become the permanent answer to accepted result semantics
- `executionIntent` already owns preview-versus-final naming
- `[5.3A-5]` already locked:
  - silence-on-empty startup
  - request-driven build-stats identity
  - preservation of unaffected siblings
  - one explicit compatibility adapter seam

Locked decisions for this phase:
- canonical result payload:
  - adopt a `BuildResultBundle` wrapper instead of treating top-level `PartArtifact[]` as enough
- explicit retention:
  - accepted result truth must classify output entries as `rebuilt`, `retained`, or `evicted`
- result-class coexistence:
  - use a result-class semantic layer such as `transient`, `draft`, and `final`
  - do not overload the existing word `lane`
- Browser honesty:
  - parent rows are aggregate by default and may only claim `rebuilt` when their own atomic unit ran
- Console ownership:
  - Console is the narrator over shared semantic facts, not the owner of those facts

Current seams this phase defines against:
- `src/shared/buildTypes.ts`
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/outputSurface.ts`
- `src/app/panels/selectBrowserGraphRows.ts`
- `src/app/bootstrapBuildWiring.ts`
- `src/app/console/useConsoleStore.ts`

Live code alignment for this phase:
- `src/shared/buildTypes.ts` still defines:
  - `BuildResult` with top-level `parts: PartArtifact[]`
- `src/app/store/useAppStore.ts` still accepts:
  - coarse `BuildResult`
  - top-level `acceptBuildResult(result)` routing that forwards only `result.parts`
- `src/app/spaghetti/store/useSpaghettiStore.ts` still stores:
  - `acceptedBuildOutputs`
  - `acceptedPreviewBuildOutputs`
  - app-owned merge behavior without one explicit accepted-result bundle wrapper
- `src/app/spaghetti/outputSurface.ts` still derives Browser-facing published rows from flat accepted artifact arrays rather than from typed rebuilt/retained/evicted result entries
- `src/app/panels/selectBrowserGraphRows.ts` still builds Browser output-row meta from:
  - `acceptedArtifactKey`
  - `publishedAtBuildSeq`
  - unresolved-versus-resolved state
  - not from typed rebuild/retention/result-class semantics
- `src/app/bootstrapBuildWiring.ts` and `src/app/console/consolePublishers.test.ts` still narrate coarse worker lifecycle lines such as:
  - `Build started (...)`
  - `${partKey}: ${state}`
  - `Build complete (...)`
  - not typed rebuilt/retained/evicted summary truth

### Implementation Target

`[5.3A-6]` should make one semantic shift real:

- accepted build truth stops being "a flat artifact array plus app-side guesses"
- accepted build truth becomes one explicit versioned result bundle with:
  - stable output identity
  - result classification
  - preview/draft/final class
  - rebuilt/retained/evicted status

This phase should materially remove:
- the need for Browser to infer ownership from flat `partKeyStr` arrays
- the need for Console to invent semantic categories in transcript wording
- the ambiguity between "child rebuilt" and "parent rebuilt"
- the ambiguity between transient preview and accepted final output

### BuildResultBundle

The canonical result surface should become a wrapper.

Preferred direction:
- `BuildResultBundle` or equivalent canonical accepted-result object
- top-level request/session identity carried explicitly:
  - `buildRequestId`
  - `graphDocumentId`
  - `seq`
- result entries keyed by build-unit/result-entry identity, not by `Node ID` alone

Hard rule:
- `Node ID` may remain useful metadata
- it should not be the primary ownership key for accepted result truth

Recommended bundle content:
- request/session identity
- execution-intent snapshot
- result class:
  - `transient`
  - `draft`
  - `final`
- typed result entries
- optional summary counts for narration/reporting

Recommended first wire shape:
- keep the outer `BuildResult` message envelope and routing identity already used by the dispatcher/app boundary:
  - `type`
  - `lane`
  - `seq`
  - `projectFileId`
  - `graphDocumentId`
  - `buildRequestId`
- replace the coarse top-level `parts` payload with one explicit bundle field, for example:
  - `bundle: BuildResultBundle`

Recommended first bundle shape:
- `bundleId` or equivalent snapshot identity
- `resultClass`
- `executionIntent`
- `summary`
- `entries`

Recommended summary shape:
- `rebuiltCount`
- `retainedCount`
- `evictedCount`
- optional counts by result-entry kind if Browser/Console need them

Recommended entry content:
- `buildUnitId`
- `outputEntryId` or equivalent stable result-entry identity
- `sourceNodeId` as metadata, not primary ownership
- `status`
- `resultClass`
- geometry/artifact payload:
  - `PartArtifact[]` may remain the geometry leaf payload

Recommended first status vocabulary:
- `rebuilt`
- `retained`
- `evicted`

Recommended first entry kinds:
- published output entry
- later parent/aggregate rows should remain derived Browser truth unless a later phase proves they need first-class result entries too

### Explicit Retention Semantics

This phase should publish retained output explicitly.

The accepted-result truth should not force downstream surfaces to infer:
- "this did not disappear, so I guess it was retained"

Hard rule:
- every relevant result entry in the accepted bundle should be classifiable as:
  - rebuilt
  - retained
  - evicted

Ownership clarification:
- worker/runtime may still be the direct owner of "rebuilt in this request"
- app acceptance/merge may still determine the final retained/evicted classification
- the accepted bundle should publish the resolved truth after that merge so Browser and Console can rely on it directly

Recommended first cut:
- the worker may emit rebuilt entries only
- app acceptance may finalize:
  - rebuilt
  - retained
  - evicted
- the accepted bundle stored in graph runtime should publish the post-merge resolved statuses

### Result-Class Coexistence

This phase should allow multiple result classes to coexist semantically.

Preferred semantic layer:
- `transient`
- `draft`
- `final`

Do not use:
- `lane`

Reason:
- the worker already has lane semantics from earlier phases
- overloading the term would blur worker execution lanes with result classes

Replacement precedence should be explicit by result-entry identity:
- `final` evicts `draft` and `transient`
- `draft` evicts older `draft` and `transient`
- `transient` never evicts `final`

Recommended implementation constraint:
- do not require Browser published-content shaping to show every class at once on day one
- first implementation may keep Browser published rows bound to authoritative `final` accepted truth while the runtime model still stores `draft` and `transient` explicitly for later consumers

Practical effect:
- fast viewer/interaction feedback can coexist with background worker work
- accepted final truth remains authoritative
- Browser and Console do not need to guess which visible output is authoritative

### Browser Truth

`[5.3A-6]` should give Browser enough typed truth to distinguish:
- child rebuilt
- sibling retained
- child evicted
- parent aggregate state
- true parent-owned rebuild

Hard rule:
- parent rows are aggregate by default
- parent rows may only claim `rebuilt` when the parent atomic unit itself ran

Allowed aggregate parent states may include:
- child building
- partial updated
- mixed freshness
- all clean

This phase should not force Browser to invent fake parent semantics from:
- flat arrays
- timing
- console transcript wording

Recommended Browser read model after this phase:
- Browser output rows read typed result-entry status plus result-class where relevant
- parent graph/component/assembly rows remain derived view-models built from that typed child truth
- Browser should not scrape transcript text to infer build meaning

### Console Truth

Console should become a narrator over shared result semantics.

Shared model owns:
- rebuild classification
- retained/evicted truth
- transient/draft/final class
- request/session identity

Console owns:
- transcript phrasing
- grouping
- summary wording
- user-readable sequencing of the same semantic facts

Hard rule:
- if a runtime concept matters enough to appear repeatedly in Console narration, it probably belongs in the shared result semantics first
- Console should not invent categories Browser and other surfaces do not share

Recommended first narration pattern:
- build lifecycle start/finish lines may remain
- completion narration should be allowed to summarize explicit bundle truth, for example:
  - rebuilt count
  - retained count
  - evicted count
  - result class when relevant
- Console should not derive "kept 4 siblings" unless the accepted bundle actually exposes retained-count truth

### Migration Strategy

`[5.3A-6]` should be implemented as a bounded migration, not as one giant Browser/Console rewrite.

Recommended order:

1. shared types
- add `BuildResultBundle`
- add result-entry type(s)
- add:
  - `resultClass`
  - `status`
  - summary types
- keep the existing `BuildResult` routing envelope and upgrade its payload shape

2. worker/app boundary
- update worker result emission to populate the new bundle payload
- update dispatcher validation to accept the new `BuildResult` shape
- keep stale-drop/routing behavior unchanged

3. app acceptance
- update `useAppStore.acceptBuildResult(...)` to forward bundle truth instead of only `parts`
- update spaghetti runtime acceptance to store bundle(s) instead of only flat accepted arrays

4. spaghetti runtime
- replace or wrap:
  - `acceptedBuildOutputs`
  - `acceptedPreviewBuildOutputs`
- keep a graph-runtime result surface that is explicit about:
  - class
  - status
  - output-entry identity

5. Browser shaping
- update `outputSurface.ts` and Browser selectors to read typed result entries
- keep parent aggregate rows derived from typed child truth

6. Console narration
- update worker/build transcript publishing so completion summaries can read shared bundle facts instead of guessing them
- keep lifecycle transcript wording shallow and deterministic

### Build Path Foundation

This phase should create versioned accepted-result truth.

That means:
- each accepted build should correspond to one explicit accepted result bundle
- each bundle should carry stable request/session identity
- each bundle should classify what rebuilt, what stayed, and what was evicted

That is the real foundation for later `Build Path` work:
- a scrubber can move across accepted bundle revisions
- Browser layers/filters can operate over typed result entries
- history/snapshot tooling does not need to infer change meaning from flat arrays and side effects

Hard caution:
- not every transient viewer gesture preview should automatically become history truth
- accepted bundle revisions should remain the stable history surface unless a later phase explicitly widens history capture rules

### Later-Phase Handoff

#### `[5.3A-7]` should delete the remaining compatibility glue after these semantics exist

- once result semantics are explicit, the final graph-native worker cutover can remove coarse compatibility layers without leaving Browser/Console dependent on legacy shape reconstruction

#### Later `Build Path` work should consume accepted result bundles, not flat artifact arrays

- later history/scrub/layer tools should treat the accepted bundle as the unit of snapshot truth

### Implementation Spec

Recommended reading order:
1. shipped `5.3A-2` request/build-unit record
2. shipped `5.3A-3` lane-and-intent record
3. shipped `5.3A-5` runtime cleanup record
4. `src/shared/buildTypes.ts`
5. `src/app/store/useAppStore.ts`
6. `src/app/spaghetti/store/useSpaghettiStore.ts`
7. `src/app/spaghetti/outputSurface.ts`
8. `src/app/panels/selectBrowserGraphRows.ts`
9. `src/app/bootstrapBuildWiring.ts`
10. `src/app/console/useConsoleStore.ts`

Required written outputs from this phase:
1. `Current Constraints`
2. `Implementation Target`
3. `BuildResultBundle`
4. `Explicit Retention Semantics`
5. `Result-Class Coexistence`
6. `Browser Truth`
7. `Console Truth`
8. `Build Path Foundation`
9. `Later-Phase Handoff`

Suggested execution steps:
1. add the canonical accepted-result wrapper in `src/shared/buildTypes.ts`
2. upgrade worker result emission and dispatcher validation to the new bundle payload
3. define stable result-entry identity under build-unit-first ownership
4. publish rebuilt/retained/evicted entry semantics in the accepted bundle
5. define transient/draft/final result-class coexistence and replacement precedence
6. update app acceptance/store state to hold result bundles instead of only flat accepted artifact arrays
7. update `outputSurface.ts` plus Browser selectors to read typed result entries and aggregate parent truth honestly
8. update Console publishing/narration to summarize shared result semantics instead of inventing them

Suggested verification:
- confirm `BuildResult` is no longer only `parts: PartArtifact[]` at the top level
- confirm accepted graph runtime state stores an explicit result bundle or equivalent wrapper
- confirm Browser row shaping can distinguish:
  - rebuilt child
  - retained sibling
  - parent aggregate state
  - true parent rebuild
- confirm Console can narrate rebuilt/retained/evicted truth without introducing new semantic categories
- confirm result-class precedence prevents transient/draft/final conflicts for the same result entry
- confirm the accepted bundle is stable enough to act as later `Build Path` snapshot truth

Recommended verification files:
- `src/app/buildDispatcher.test.ts`
- `src/app/store/useAppStore.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/spaghetti/outputSurface.test.ts`
- `src/app/panels/selectBrowserGraphRows.test.ts`
- `src/app/console/consolePublishers.test.ts`
- `src/app/bootstrapBuildWiring.test.ts`

Recommended verification scenarios:
- a targeted rebuild marks changed entries as `rebuilt` and untouched siblings as `retained`
- an output removed by a targeted change is marked `evicted`
- Browser output rows and parent rows present rebuilt-versus-aggregate truth correctly
- Console completion narration can summarize rebuilt/retained/evicted counts from bundle truth
- `draft`/`final` precedence for the same result-entry identity remains deterministic

Suggested verification commands:
- `rg -n "type: 'build_result'|parts: PartArtifact\\[]|acceptedBuildOutputs|acceptedPreviewBuildOutputs" src/shared src/app src/worker`
- `rg -n "outputSurface|publishedAtBuildSeq|selectBrowserGraphRows|acceptBuildResult" src/app`
- `rg -n "Console|appendConsoleEntry|Build complete|cache_hit|retained|evicted" src/app`

Discipline rules:
- do not overload the word `lane` for result-class semantics
- do not let `Node ID` become the primary accepted-result ownership key
- do not make Browser or Console infer retention from absence if the accepted bundle can say it directly
- do not let Console invent semantic categories that the shared model does not own
- do not store every transient gesture preview as though it were accepted history truth

Definition of done:
- the canonical accepted-result payload is a `BuildResultBundle` or equivalent explicit wrapper
- accepted result entries carry stable build-unit-first identity
- rebuilt/retained/evicted truth is explicit
- transient/draft/final coexistence semantics are explicit and precedence-ordered
- Browser parent rows can distinguish aggregate status from true atomic rebuild
- Console narrates shared facts without becoming the owner of semantics
- the accepted result surface is strong enough to serve as the later `Build Path` snapshot foundation
