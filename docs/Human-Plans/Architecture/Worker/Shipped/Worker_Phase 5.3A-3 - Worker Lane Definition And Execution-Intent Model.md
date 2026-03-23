# Worker Phase 5.3A-3 - Worker Lane Definition And Execution-Intent Model

## Doc Header

### Doc History
3. 2026-03-22 19:40: Cleaned up the shipped `[5.3A-3]` record so it no longer reads like `[5.3A-2]` was already implemented first, explicitly reframing this phase as early lane-and-intent groundwork that landed after the shipped audit but before the still-pending request/build-unit replacement phase
2. 2026-03-22 19:15: Shipped `[5.3A-3]` by adding explicit `lane` and `executionIntent` truth to the live build contract, wiring the default final/full/auto build intent through the dispatcher and worker runtime, preserving `assemble` as a compatibility path only, and validating the new seam with focused shared/dispatcher/pipeline/console/store tests plus a full production build
1. 2026-03-22 19:05: Created this standalone future phase doc for `[5.3A-3]`, turning the lane-definition and execution-intent follow-up into an implementation-ready planning surface that locks the permanent worker-lane direction, removes `assemble` ambiguity, and defines the first explicit preview-versus-final execution-intent model for later dispatcher and runtime cleanup

### Purpose

This doc defines the third worker phase under `[5.3A]`.

Use it to answer:
- what the permanent worker lane set should be
- whether `assemble` survives as a real lane
- whether preview is a lane or an execution-intent mode
- what minimum execution-intent controls the worker contract should support next
- what later phases should implement instead of deciding again

### Why This Phase Exists

`[5.3A-1]` shipped first and proved that the worker is:
- graph-routed outside
- legacy-shaped inside

This phase landed early, before the request/build-unit replacement work now planned in `[5.3A-2]`.

At the time this phase landed, one major ambiguity still needed to be removed immediately:
- what kinds of worker jobs are real lanes
- what kinds of worker behavior are only intent/mode inside the `build` lane

If that stayed open, later phases would drift on:
- whether `assemble` is still architectural truth
- whether preview should get its own worker protocol
- whether `export` is a real worker lane or a later consumer
- how `Browser` and `Console` should narrate lane-level versus unit-level work

So this phase exists to lock the lane-and-intent model early, while leaving the still-pending `[5.3A-2]` work to replace the legacy request seam and land graph-native `buildUnitId` truth underneath that scaffold.

### Scope

This phase covers:
- the permanent worker lane direction
- the first explicit `executionIntent` model
- the keep-versus-retire decision for `assemble`
- the minimum Browser/Console interpretation rules for lane truth
- the handoff for `[5.3A-4]`, `[5.3A-5]`, and `[5.3A-6]`

This phase does not cover:
- dispatcher code cleanup
- legacy runtime deletion
- final result-schema expansion
- Browser UX redesign
- final export implementation

## Doc Body

## [x] - `[5.3A-3]` - `Worker Lane Definition And Execution-Intent Model`

### Header

Purpose:
- lock the real worker lane model so later cleanup phases can implement against one stable direction

Owns:
- permanent lane direction
- `assemble` keep-versus-retire decision
- preview-versus-final intent model
- minimum execution-cost controls

Does not own:
- dispatcher refactor
- legacy runtime deletion
- final result-shape redesign
- Browser/Console UI polish

### Current Constraints

This phase starts from:
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-1 - Worker Audit And Legacy Startup Inventory.md`

Locked constraints from earlier phases:
- `build` is the only canonical current live lane
- `assemble` is live but transitional and legacy-coupled
- `export` is typed/planned but not live
- routing identity survives
- the worker should support user-controlled execution cost later
- the graph-first app must stop booting into fake legacy foothook rows
- the legacy `payload: BoxParams` seam is still live and still needs replacement in the later `[5.3A-2]` request/build-unit phase

Important sequencing note:
- this shipped phase landed before `[5.3A-2]` was implemented
- it should be read as lane-and-intent groundwork, not as proof that the graph-native request/build-unit contract was already live

Code seams this phase defines against:
- `src/shared/buildTypes.ts`
- `src/app/buildDispatcher.ts`
- `src/app/spaghetti/integration/buildInputsToRequest.ts`
- `src/worker/worker.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/app/console/useConsoleStore.ts`
- `src/app/panels/selectBrowserGraphRows.ts`
- `src/app/panels/selectBrowserTreeRows.ts`

### Permanent Lane Direction

This phase locks the permanent worker direction as:

1. `build`
- canonical worker execution lane
- owns graph-native build execution
- owns unit-specific progress/result/error reporting
- supports both preview-oriented and final-oriented work through `executionIntent`

2. `export`
- valid future worker lane
- not required for the graph-native cutover
- should consume accepted build artifacts or graph-native compiled data explicitly
- should not block cleanup of the build lane

Locked non-lane decisions:
- preview is not its own permanent worker lane
- final is not its own permanent worker lane
- `assemble` is not a permanent worker lane

Blunt rule:
- ParaHook should converge on one canonical `build` lane with explicit intent, not multiple overlapping build-like lanes that only exist because legacy runtime vocabulary survived too long

### Assemble Decision

This phase locks the `assemble` direction as:
- transitional-only
- not a permanent worker lane

If assembly-like behavior survives, it should survive as one of:
- a build result classification
- a build-unit grouping concept
- a downstream presentation term in `Browser`

It should not survive as:
- a separate canonical worker lane
- startup transcript truth
- the architectural reason the app still carries legacy foothook-family narration

Deletion direction:
- later phases may keep `assemble` message handling temporarily for compatibility
- later phases should remove it as a lane once graph-native build intent and result semantics are live

### Execution-Intent Model

This phase locks `executionIntent` as part of the canonical `build` request family.

The minimum stable `executionIntent` families are:

1. `buildMode`
- `preview`
- `final`

2. `quality`
- `draft`
- `full`

3. `updatePolicy`
- `auto`
- `defer_until_release`
- `manual`

4. `outputIntent`
- whether the request is trying to produce:
  - transient preview output
  - authoritative final output

Important rule:
- preview-versus-final is explicit request truth
- it must not remain an accidental side effect of UI timing or legacy runtime branches

Important cost rule:
- `draft` does not silently mean `wrong`
- `draft` means cheaper, intentionally lower-cost behavior for interaction
- `full` means authoritative or higher-cost behavior when requested

### Fast Preview Direction

This phase locks the fast-preview direction as:
- not a separate permanent lane
- not silent replacement for exact final worker truth
- an execution-intent-driven runtime path under the `build` lane

Allowed future implementations:
- worker-side simplified geometry for preview
- viewer-side approximate preview geometry
- both, if they stay explicitly named and semantically separate

Hard rule:
- approximate preview output must never pretend to be accepted final output

### Lane-Level Progress And Result Rules

This phase locks the minimum lane-versus-unit interpretation rules.

#### Build lane

The `build` lane may emit:
- lane-level lifecycle messages
- unit-specific progress/result/error messages

But canonical truth remains:
- the lane is the transport/execution category
- `buildUnitId` is the thing that actually rebuilt when unit-specific

#### Export lane

If `export` becomes real later, it should:
- have its own lane-level lifecycle
- preserve routing identity
- avoid reusing build-progress wording for non-build jobs

#### Browser rule

`Browser` should treat:
- lane identity as runtime category
- `buildUnitId` as rebuild truth

That means:
- a `build` lane event can mark an output-entry row stale/building/done
- parent rows may summarize that activity
- parent rows are not rebuild owners by default

#### Console rule

`Console` should be able to narrate:
- lane-level events such as request start/finish
- unit-specific events such as `queued / cache_hit / building / done / error`

That means:
- the console may say which lane is active
- but it must not reduce unit-specific rebuild truth to only a coarse lane transcript

### Compatibility Boundary

This phase locks the lane/model keep-versus-retire boundary.

#### Keep

Keep as architectural truth:
- one canonical `build` lane
- explicit `executionIntent`
- routing identity
- `buildUnitId` as the first canonical rebuild unit
- typed worker message families

#### Transitional Only

Treat these as transitional-only after this phase:
- `assemble` as a lane
- legacy startup `assembled` transcript narration
- preview/final behavior hidden in ad hoc runtime branches
- legacy part-family names as lane or mode truth
- coarse runtime wording that cannot distinguish lane identity from unit identity

### Later-Phase Handoff

#### `[5.3A-4]` must implement

- dispatcher cleanup should build on this shipped lane-and-intent scaffold plus the later `[5.3A-2]` request/build-unit replacement
- dispatcher handling around one canonical `build` lane plus optional future `export`
- explicit lane-aware validation and transport
- no new dispatcher-owned semantic drift around preview/final behavior

#### `[5.3A-5]` must delete

- legacy runtime deletion should happen only after `[5.3A-2]` has replaced the canonical request/build-unit seam
- `assemble` as a legacy startup/runtime lane
- old startup transcript dependence on foothook-family lane narration
- legacy runtime branches that encode preview/final behavior without explicit `executionIntent`

#### `[5.3A-6]` must strengthen

- result-semantics work should assume the later `[5.3A-2]` phase has already landed graph-native request/build-unit identity
- result semantics for:
  - preview versus final
  - retained unaffected siblings
  - parent aggregate state versus true parent rebuild
- Browser/Console presentation strong enough to reflect lane truth without flattening build-unit truth

### Implementation Spec

Recommended reading order:
1. shipped `5.3A-1` audit record
2. this shipped `5.3A-3` record as the early lane-and-intent scaffold
3. the still-pending `5.3A-2` request/build-unit phase doc
4. `src/shared/buildTypes.ts`
5. `src/app/buildDispatcher.ts`
6. `src/worker/worker.ts`
7. `src/worker/pipeline/buildPipeline.ts`
8. `src/app/console/useConsoleStore.ts`
9. `src/app/panels/selectBrowserGraphRows.ts`
10. `src/app/panels/selectBrowserTreeRows.ts`

Required written outputs from this phase:
1. `Current Constraints`
2. `Permanent Lane Direction`
3. `Assemble Decision`
4. `Execution-Intent Model`
5. `Fast Preview Direction`
6. `Lane-Level Progress And Result Rules`
7. `Compatibility Boundary`
8. `Later-Phase Handoff`

Suggested execution steps:
1. restate the earlier-phase constraints that remove lane ambiguity
2. lock the permanent lane direction
3. decide `assemble` explicitly instead of leaving it transitional forever
4. define the first explicit `executionIntent` family
5. define how fast preview fits without becoming fake final truth
6. write the later-phase handoff so dispatcher cleanup and runtime deletion can execute without re-deciding lane semantics

Suggested verification:
- confirm the doc stays aligned with:
  - `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-1 - Worker Audit And Legacy Startup Inventory.md`
  - the actual shipped `5.3A-3` code state
- confirm the doc no longer implies that `[5.3A-2]` was already implemented before this shipped phase
- confirm the doc leaves no open decision about:
  - permanent lane direction
  - whether `assemble` survives as a lane
  - whether preview is a lane or intent
  - the minimum `executionIntent` control families

Suggested verification commands:
- `rg -n "assemble|BuildProgress|BuildResult|BuildRequest|export" src/shared src/app src/worker`
- `rg -n "preview|final|draft|manual|defer" src/shared src/app src/worker`
- `rg -n "queued|cache_hit|building|done|error" src/app src/worker`

Discipline rules:
- do not widen into dispatcher implementation in this phase
- do not delete legacy runtime code in this phase
- do not turn preview into a hidden synonym for final
- do not leave `assemble` as permanent by accident through vague wording

Definition of done:
- the doc locks one permanent worker-lane direction
- the doc is explicit that preview is intent, not lane
- the doc is explicit that `assemble` is transitional-only, not permanent
- the minimum `executionIntent` family is clear enough for later code implementation
- later dispatcher, runtime-deletion, and result-semantics phases can proceed without inventing lane semantics again
