# Worker Phase 5.3A-1 - Worker Audit And Legacy Startup Inventory

## Doc Header

### Doc History
3. 2026-03-22 18:04: Converted this phase from a future audit spec into the shipped audit record by tracing the live worker contract, startup auto-build path, Browser and Console build-truth consumers, and the remaining foothook-era fallback seams that `[5.3A-2]` must replace
2. 2026-03-22 17:57: Tightened this future phase into a more implementation-ready audit spec by locking the concrete deliverables, file-owner questions, verification commands, handoff artifact shape for `[5.3A-2]`, and definition-of-done criteria so the first worker phase can be executed as a disciplined read/inventory pass instead of only a broad audit idea
1. 2026-03-22 14:57: Created this standalone future phase doc for `[5.3A-1]`, translating the first worker cleanup cut into an implementation-ready audit around the live worker lanes, startup auto-build path, legacy fallback assumptions, and the current Browser/Console build-truth leaks that need to be mapped before the graph-native contract work starts

### Purpose

This doc records the completed audit for `[5.3A-1]`.

Use it to answer:
- what the live worker/build lanes actually are today
- where startup still injects legacy foothook assumptions
- where Browser and Console still read transitional worker/build truth
- what `[5.3A-2]` must preserve versus retire when the graph-native contract work starts

### Scope

This phase covered:
- the shared worker/build contract and lane vocabulary
- worker entry, pipeline, model generation, and legacy parts derivation
- app-to-worker translation, dispatcher publishing, startup wiring, and app-store defaults
- Browser and Console consumption of worker/build truth

This phase did not change:
- runtime behavior
- worker contract shapes
- store shapes
- Browser or Console UI behavior

## Doc Body

## [x] - `[5.3A-1]` - `Worker Audit And Legacy Startup Inventory`

### Current Lane Inventory

#### `build`

Status:
- live
- canonical current lane
- still fed through a transitional request shape

Current owner files:
- `src/shared/buildTypes.ts`
- `src/worker/worker.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/app/buildDispatcher.ts`
- `src/app/store/useAppStore.ts`

What it does today:
- accepts `BuildRequest` with:
  - `projectFileId`
  - `graphDocumentId`
  - `buildRequestId`
  - `payload: BoxParams`
  - optional `changedParamIds`
  - optional `heelKickInstances`
  - optional `toeHookInstances`
- emits `build_progress` with:
  - routing identity
  - `phase`
  - `partKey`
  - `state`
  - optional `progress01`
  - optional `ms`
  - optional `message`
- emits `build_result` with:
  - routing identity
  - `parts: PartArtifact[]`
  - optional `changedParamIds`

Audit read:
- this is the only lane that already carries the routing identity shape worth preserving
- the lane is graph-routed at the dispatcher/app level, but the payload is still legacy-shaped
- the worker still computes build units from a legacy-first part model even when graph-derived data is present

#### `assemble`

Status:
- live
- transitional compatibility lane
- not graph-native

Current owner files:
- `src/shared/buildTypes.ts`
- `src/worker/worker.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/app/buildDispatcher.ts`

What it does today:
- accepts `AssembleRequest` with only `seq` and `payload: BoxParams`
- returns `assemble_result` with one assembled box summary
- uses:
  - `LEGACY_RUNTIME_PROJECT_FILE_ID`
  - `LEGACY_RUNTIME_GRAPH_DOCUMENT_ID`
  - `partKey: 'assembled'`
- is also mirrored in dispatcher-side cache-hit narration

Audit read:
- `assemble` is a real live lane, but it is still explicitly coupled to the older legacy runtime ids and `assembled` vocabulary
- it should be treated as transitional until `[5.3A-3]` decides whether it survives as an honest graph-native lane or is removed

#### `export`

Status:
- typed
- planned
- not live

Current owner files:
- `src/shared/buildTypes.ts`
- `src/worker/worker.ts`

Audit read:
- `export` appears in shared types and worker-error validation only
- there is no active worker entry handling or app runtime calling path for it
- `[5.3A-3]` should treat this as planned vocabulary, not a real shipped lane

#### Current request/result contract read

Keep:
- `projectFileId`
- `graphDocumentId`
- `buildRequestId`
- explicit per-message typing
- progress states:
  - `queued`
  - `cache_hit`
  - `building`
  - `done`
  - `error`
- dispatcher stale-drop behavior keyed by routing identity plus request sequence

Retire:
- `payload: BoxParams` as the real build contract
- `PART_ORDER = ['baseplate', 'heelKick', 'toeHook', 'assembled']`
- implicit fallback instance normalization as architectural truth
- the assumption that build units are inherently foothook-family parts

### Startup Legacy Inventory

#### Boot trigger

Live boot path:
1. `src/main.tsx`
2. `bootstrapBuildWiring()`
3. `useAppStore.getState().requestSpaghettiBuild()`
4. `requestGraphDocumentBuild(activeGraphDocumentId)`
5. `buildRequestFromBuildInputs(...)`
6. `buildDispatcher.requestBuild(...)`

Audit read:
- startup auto-build is real and unconditional once the app boots
- the graph-routing identity is current-era
- the payload translation beneath that routing is still transitional

#### Boot-time fallback defaults

Confirmed owners:
- `src/app/bootstrapBuildWiring.ts`
- `src/app/store/useAppStore.ts`
- `src/shared/buildTypes.ts`

Confirmed fallback behavior:
- `bootstrapBuildWiring.ts` injects fallback instances when graph-specific pending state is absent:
  - `heelKickInstances: [1]`
  - `toeHookInstances: [1]`
- `useAppStore.ts` initial state still owns:
  - `heelKickInstances: [1]`
  - `toeHookInstances: [1]`
  - default part visibility for:
    - `baseplate`
    - `heelKick#1`
    - `toeHook#1`
- `normalizeInstances()` in `buildTypes.ts` also falls back to `[1]` when an instance family is missing or empty

Audit read:
- the app is graph-routed, but its startup defaults still assume one legacy foothook family is always present
- this is the clearest source-level reason the first boot transcript can still talk like the pre-Spaghetti product

#### Legacy build-stats ordering and narration

Confirmed owners:
- `src/shared/buildStatsKeys.ts`
- `src/app/buildDispatcher.ts`
- `src/worker/pipeline/buildPipeline.ts`

Confirmed behavior:
- `LEGACY_BUILD_STATS_PART_ORDER` is still:
  - `baseplate`
  - `heelKick#1`
  - `toeHook#1`
  - `assembled`
- dispatcher falls back to that ordering when no graph-specific part keys are provided
- dispatcher also falls back to legacy routing identity when no explicit routing identity is supplied
- dispatcher publishes transcript entries directly:
  - `Build started (...)`
  - `${partKey}: ${state}`
  - `Build complete (...)`
  - `Assemble started`
  - `Assemble complete`
  - `Assembled cache hit`

Audit read:
- the current transcript is not legacy only, but its default ordering and special `assembled` path are still legacy-shaped
- Console is currently reporting exactly what the dispatcher tells it, which makes the dispatcher one of the real owners of current worker-story wording

#### Legacy part derivation

Confirmed owners:
- `src/worker/pipeline/partsSpec.ts`
- `src/worker/buildModel.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.ts`

Confirmed behavior:
- `partsSpec.ts` still derives canonical build keys from:
  - `baseplate`
  - `heelKick#n`
  - `toeHook#n`
  - `assembled`
- `buildModel.ts` still begins with `deriveLegacyParts(payload, instances)` and only then layers feature-stack output on top
- `buildInputsToRequest.ts` still translates graph-native build inputs into a legacy patch surface:
  - `sp_baseplate_*`
  - `sp_toeHook1_*`
  - `sp_heelKick1_*`
  - `sp_featureStackIR`

Audit read:
- the worker is not graph-native internally yet
- it is graph-routed outside, legacy-first inside

#### Startup transcript confirmation

Confirmed source path:
- `src/main.tsx` bootstraps the first build
- `src/app/bootstrapBuildWiring.ts` immediately requests it
- `src/app/buildDispatcher.ts` emits the startup worker transcript lines

Observed behavior matched by this audit:
- startup emits worker lifecycle transcript lines
- the existing live app transcript reported during planning showed:
  - `Build started (graph-document-1)`
  - `Requested graph build for graph-document-1`
  - `baseplate: queued/building/done`
  - `heelKick#1: queued/building/done`
  - `toeHook#1: queued/building/done`
  - `assembled: queued/building/done`

Audit read:
- that transcript matches the current audited source ownership
- this phase did not rerun a full browser-mounted boot transcript harness, but the source path and targeted tests confirm the audited ownership of the transcript pieces

### Browser / Console Build-Truth Leak Map

#### Browser

Primary owner files:
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/selectBrowserGraphRows.ts`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/store/useAppStore.ts`

Current read model:
- graph-document rows read build truth from `graphRuntimeByDocumentId[graphDocumentId].compileBuild`
- graph-document state is coarse:
  - `building` if `inFlightBuildSeq !== null`
  - `done` if `latestAcceptedGraphRevision === currentGraphRevision`
  - otherwise `rebuild`
- content rows read build truth from project-content ownership plus graph runtime aggregate state
- the `Needs Rebuild` section in graph rows is produced by filtering project object rows, not by reading worker-unit progress/results directly

Current leak / distortion:
- Browser does not yet read honest worker build units
- Browser mostly reads graph revision state plus project-content aggregate rows
- this is salvageable for graph-level dirty/build status, but not sufficient for the later separate-build truth the worker family wants
- parent content rows can reflect aggregate owner-graph state, but not yet explicit child build-unit identity

What is salvageable:
- graph-document routing identity
- project-content ownership rows
- the distinction between graph rows and content rows
- the `Needs Rebuild` section as a UI landing zone for later separate-build truth

What is misleading today:
- graph/document/content rows can only say `rebuild/building/done`, not which build unit actually changed
- Browser is still downstream of transitional graph-runtime state instead of authoritative worker-unit result semantics

#### Console

Primary owner files:
- `src/app/buildDispatcher.ts`
- `src/app/console/useConsoleStore.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/consolePublishers.test.ts`

Current read model:
- dispatcher publishes worker lifecycle transcript lines directly through `appendConsoleEntry(...)`
- `ConsoleDock.tsx` mainly renders and filters the transcript; it is not deriving worker truth itself
- `ConsoleDock.tsx` separately owns root/session prompts like:
  - `Root > Choose next [Graph, Radio]`

Current leak / distortion:
- Console truth for worker/build events is currently dispatcher-authored transcript text, not a separate structured worker story
- that is why legacy fallback part keys and `assembled` wording show up so directly in the transcript
- the console layer is mostly honest about current transport events, but the event vocabulary is still shaped by the old worker model

What is salvageable:
- transcript layering
- routing identity in build start/complete lines
- the existing per-event `Worker` layer and severity model

What is misleading today:
- `${partKey}: ${state}` is too thin for later child-vs-parent rebuild truth
- `assembled` is still narrated like a first-class unit even though it is a transitional compatibility path
- Console can only reflect the worker contract it receives, and that contract is still legacy-first

### 5.3A-2 Handoff

#### Transitional seams to retire

`[5.3A-2]` should treat these as explicit retirement candidates:
- `payload: BoxParams` as the real build request shape
- `PART_ORDER`
- `LEGACY_RUNTIME_PROJECT_FILE_ID`
- `LEGACY_RUNTIME_GRAPH_DOCUMENT_ID`
- `LEGACY_BUILD_STATS_PART_ORDER`
- default `[1]` instance fallback as architectural truth
- graph-to-legacy `sp_*` patch translation in `buildInputsToRequest.ts`
- legacy-first part derivation in `deriveLegacyParts(...)`

#### Routing and progress semantics likely worth preserving

`[5.3A-2]` should preserve:
- `projectFileId`
- `graphDocumentId`
- `buildRequestId`
- typed build/progress/result/error messages
- stale-drop by request sequencing per routing ledger
- the existing progress-state vocabulary unless a stronger replacement is justified:
  - `queued`
  - `cache_hit`
  - `building`
  - `done`
  - `error`

#### Browser follow-through for the next phase

`[5.3A-2]` should define worker identity strongly enough that Browser can later show:
- which build unit actually rebuilt
- which sibling units were retained
- which parent rows are only aggregate status containers

Browser should keep:
- graph rows
- content rows
- `Needs Rebuild` as the first obvious later landing zone

Browser should stop depending only on:
- graph revision equality
- coarse owner-graph aggregate rebuild flags

#### Console follow-through for the next phase

`[5.3A-2]` should define worker identity strongly enough that Console can later show:
- per-unit or per-lane runtime truth
- cache hits versus real work
- child activity without pretending a parent rebuild happened

Console should keep:
- transcript layering
- routing-aware build start and completion entries

Console should stop depending on:
- legacy default part keys
- thin `${partKey}: ${state}` narration as the only worker-progress story
- `assembled` as implied first-class startup truth

#### Open blockers for `5.3A-2`

The next phase still has to decide:
- what the first honest graph-native build unit is
- whether that unit is:
  - per graph output entry
  - per published object
  - per resolved part/output slot
  - some other graph-native execution unit
- whether `assemble` survives as:
  - a real graph-native lane
  - a build mode
  - or dead compatibility residue to remove later
- whether `export` becomes real or stays only planned vocabulary

### Verification

#### Static audit proof

Read and confirmed against source:
- `src/shared/buildTypes.ts`
- `src/shared/buildStatsKeys.ts`
- `src/worker/worker.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/worker/buildModel.ts`
- `src/worker/pipeline/partsSpec.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
- `src/app/buildDispatcher.ts`
- `src/app/bootstrapBuildWiring.ts`
- `src/app/store/useAppStore.ts`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/selectBrowserGraphRows.ts`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/useConsoleStore.ts`

#### Run-check proof

Executed:
- `cmd /c npm.cmd test -- src/app/buildDispatcher.test.ts src/app/store/useAppStore.test.ts src/app/console/consolePublishers.test.ts src/app/panels/selectBrowserGraphRows.test.ts src/app/panels/selectBrowserTreeRows.test.ts`

Result:
- `5` test files passed
- `36` tests passed

What that run-check confirms:
- dispatcher build-stats fallback behavior is still live
- app-store request routing is graph-aware but still transitional under the hood
- console worker lifecycle publishing is dispatcher-owned
- Browser graph/content row shaping is still based on graph runtime and project-content aggregate state rather than honest worker build-unit semantics

### Completion Read

`[5.3A-1]` is complete.

This phase delivered:
- one current lane inventory
- one startup legacy inventory
- one Browser / Console build-truth leak map
- one concrete handoff for `[5.3A-2]`

No runtime behavior changed in this phase.
