# Worker Phase Worker-Vision-1 - Request Supersession And Cooperative Early Abort

## Doc Header

### Doc History
5. 2026-04-09 11:45: Tightened `Worker-Vision-1 Phase 3 - Superseded Runtime Truth And Hardening` around the newly shipped worker-local supersession path, the live `bootstrapBuildWiring.ts` plus `runtimeInspectorTaskStore.ts` queue/archive seam, the current accepted-build-impact runtime surface, and the focused worker-plus-bootstrap-plus-runtime proof bar needed before implementation starts
4. 2026-04-09 11:41: Marked `Worker-Vision-1 Phase 2 - Worker Cooperative Abort Checkpoints` shipped in this planning surface after the worker-local latest-request ledger plus checkpointed `buildPipeline(...)` supersession exit landed in code with focused worker and pipeline proof, so the family handoff now moves forward to `Phase 3 - Superseded Runtime Truth And Hardening`
3. 2026-04-09 11:35: Marked `Worker-Vision-1 Phase 1 - Supersession Identity And Dispatcher Contract` shipped in this planning surface after the matching `docs/CHANGELOG.md` entry landed, then tightened `Worker-Vision-1 Phase 2 - Worker Cooperative Abort Checkpoints` around the live `worker.ts` plus `buildPipeline.ts` seams, the first realistic supersession-check boundaries, the narrow worker-local latest-request ledger direction, and the focused dispatcher/pipeline/bootstrap proof bar needed before implementation starts
2. 2026-04-09 11:30: Split this `Worker-Vision-1` future doc into explicit internal `Phase 1`, `Phase 2`, and `Phase 3` sections so the latest-intent lane now breaks cleanly into dispatcher supersession identity, worker cooperative-abort checkpoints, and superseded-runtime-truth hardening instead of still reading like one larger single-pass implementation block
1. 2026-04-09 11:25: Created this standalone future Worker phase doc so the first Worker Vision follow-on now has an implementation-ready planning surface for request supersession, cooperative early-abort checks, and the first explicit runtime truth around superseded work instead of leaving that lane only as a short section inside `Worker-Vision.md`

### Purpose

This doc defines the first implementation-ready phase under `Worker Vision`.

Use it to answer:
- how ParaHook should make latest-intent scheduling real inside the worker path
- where supersession truth should live
- what kind of cooperative early-abort checks should be added first
- what correctness and verification bar should hold while the runtime is becoming more efficient

### Why This Phase Exists

Today ParaHook already has:
- request sequencing
- stale progress/result drop
- accepted-result protection at the app boundary

That is enough for correctness.

It is not enough for efficiency.

Current reality:
- newer drag-driven requests can supersede older requests
- stale results are ignored later
- but obsolete in-flight work may still spend meaningful time in the worker before the app rejects the old answer

This phase exists to close that efficiency gap without reopening the shipped worker boundary cleanup.

The goal is:
- keep the same correctness guardrails
- add explicit latest-intent checks inside the worker execution path
- stop paying full cost for work that is already known to be obsolete

### Scope

This phase covers:
- request supersession identity for the worker runtime
- first cooperative early-abort checkpoints
- dispatcher-to-worker latest-request communication needed to support those checks
- explicit runtime truth for superseded-versus-accepted work
- verification that correctness still remains protected by stale-drop and accepted-result checks

This phase does not cover:
- draft scheduling policy
- authoritative scheduling policy
- Browser or viewport UX redesign
- export reuse
- broad new worker-lane design

## Doc Body

## [ ] Worker-Vision-1 - Request Supersession And Cooperative Early Abort

### Header

Purpose:
- make latest-intent execution real inside the worker path instead of relying only on app-side stale-result rejection after obsolete work already finished

Owns:
- graph-target supersession identity
- worker-visible latest-request checks
- first cooperative early-abort checkpoints
- explicit superseded runtime truth

Does not own:
- draft `live` versus `on release` scheduling rules
- authoritative settle rules
- Browser build-policy redesign
- export-facing reuse

### Current Constraints

This phase starts from the shipped worker groundwork in:
- `docs/Human-Plans/Architecture/Worker/Worker.md`
- `docs/Human-Plans/Architecture/Worker/Worker-Vision.md`
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-2 - Graph-Native Worker Contract And Separate-Build Identity.md`
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-3 - Worker Lane Definition And Execution-Intent Model.md`
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase 5.3A-4 - Dispatcher Boundary Cleanup.md`

Locked starting constraints:
- request routing identity is already explicit:
  - `projectFileId`
  - `graphDocumentId`
  - `buildRequestId`
- dispatcher sequencing and stale-drop already exist
- app acceptance already rejects stale or superseded results
- the worker currently executes the request it was given without a true cancellation path
- correctness must remain protected even if early-abort checks fail or are missed

Current live seams this phase should read against:
- `src/app/buildDispatcher.ts`
- `src/worker/worker.ts`
- `src/worker/pipeline/buildPipeline.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/bootstrapBuildWiring.ts`
- current worker and dispatcher tests around stale results and build acceptance

Important current-reality rule:
- this phase should not pretend the worker already has preemptive cancellation
- the first honest target is cooperative early abort, not a full OS-style interrupt model

### Locked Direction

#### 1. Latest Request Wins Per Runtime Target

The runtime should treat newer requests as superseding older requests for the same graph/runtime target.

First honest target identity:
- `graphDocumentId`

If later runtime targeting widens, this rule can become more specific.
Do not widen that target model in this phase.

#### 2. Supersession Should Be Visible Inside The Worker Path

The worker path should gain a way to ask:
- "am I still the newest relevant request for this graph target?"

That check must be possible:
- before expensive work starts
- between meaningful expensive phases
- before publishing a final result

Important rule:
- do not only check at the very end
- that would preserve correctness but miss most of the efficiency gain

#### 3. Cooperative Abort, Not Silent Corruption

When the runtime detects that a request is superseded:
- stop the obsolete path cleanly
- do not publish a normal accepted result for that obsolete request
- keep the runtime able to explain that the work was superseded

Important rule:
- cooperative abort must not corrupt worker caches, accepted-runtime state, or authoritative-handle ownership

#### 4. App-Side Stale Drop Remains The Safety Net

This phase does not replace:
- dispatcher stale-drop
- app-side accepted-result identity checks

Those protections remain the correctness backstop.

This phase adds:
- earlier worker/runtime exit
- less wasted work
- clearer superseded runtime truth

### Runtime Truth Direction

This phase should add the first explicit distinction between:
- accepted work
- active work
- superseded work

Recommended first shared runtime facts:
- request started
- request superseded
- request completed
- request failed

Important rule:
- do not invent a huge scheduling state model yet
- the first visible win is simply making superseded work explicit instead of invisible implementation residue

### Implementation Target

`Worker-Vision-1` should make one architecture shift real:

- the dispatcher and worker still preserve current correctness protections
- the worker pipeline gains cooperative latest-request checks
- obsolete work can stop before finishing full execution
- the runtime can report superseded work honestly

The minimum meaningful behavior change should be:
- if request `B` supersedes older request `A` for the same graph while `A` is still running, `A` should stop at the next meaningful checkpoint instead of finishing the whole pipeline when that stop is possible

### First Boundaries

Keep inside this phase:
- graph-target supersession tracking
- first cooperative abort checkpoints
- minimal runtime truth for superseded work
- proof that accepted-result correctness remains unchanged

Keep outside this phase:
- deciding when draft should run live versus on release
- deciding when authoritative should settle versus run immediately
- redesigning Browser or `Viewport Runtime Inspector` UI
- export reuse

### Suggested Runtime Checkpoints

The first checkpoints should be placed at meaningful boundaries that already exist in the runtime.

Recommended first candidates:
- before expensive build pipeline execution starts
- after compile/request setup but before per-part heavy execution begins
- between repeated expensive unit or part execution loops
- before final result publication back to the app

Important rule:
- prefer a few meaningful checkpoints over many tiny noisy checks
- keep the first pass simple enough to reason about and test

### Suggested Ownership Split

#### Dispatcher Owns

- latest requested identity per graph target
- publishing enough runtime metadata for the worker path to know whether a request is obsolete
- preserving existing stale-drop protections

#### Worker Pipeline Owns

- cooperative latest-request checks during execution
- clean early return when the request is obsolete
- preserving cache/resource correctness when aborting

#### App Runtime Owns

- accepting only current results
- presenting superseded-versus-accepted truth
- preserving accepted runtime state when obsolete work aborts

### Verification Bar

This phase is only done if it proves both:
- efficiency improved
- correctness stayed honest

Required proof:
- a newer request can supersede an older in-flight request for the same graph target
- the older request stops at a worker-visible checkpoint instead of always finishing the entire pipeline
- stale-result rejection still protects correctness even if an obsolete request reaches the boundary
- accepted runtime state remains on the newest accepted request only
- superseded work can be surfaced as explicit runtime truth instead of invisible disappearance

### Internal Phase Ladder

This doc is now split into three internal implementation slices so Codex can execute them one at a time without widening into the whole lane at once.

## [x] Worker-Vision-1 Phase 1 - Supersession Identity And Dispatcher Contract

### Purpose

Lock the first explicit supersession identity and dispatcher-facing contract for latest request tracking by `graphDocumentId` without changing worker execution behavior yet.

### Owns

- first explicit latest-request identity per `graphDocumentId`
- dispatcher/runtime contract for exposing that latest-request read to the worker path
- preserving existing stale-drop and acceptance behavior while the new contract lands

### Does Not Own

- cooperative abort inside the worker pipeline
- superseded runtime narration
- draft or authoritative scheduling policy

### Implementation Target

After this slice:
- the runtime has one explicit way to ask which request is currently the newest for a graph target
- that read is stable enough that later worker checkpoints can depend on it
- no behavior should yet claim early abort unless the worker actually uses the new contract

### First Proof

- latest-request identity for `graphDocumentId` is tracked explicitly and readably
- dispatcher and app-side stale-drop behavior remain unchanged
- the new contract is narrow enough that later worker-side checkpoint adoption does not require redesigning it again

### Shipped Read

This slice is now shipped through:
- `docs/CHANGELOG.md`
  - `[1144] - WK - Phase Worker-Vision-1 Phase 1 - Supersession Identity And Dispatcher Contract`

Current landed truth:
- `src/app/buildDispatcher.ts` now exposes `getLatestBuildRequestSnapshot(...)`
- latest-request identity remains isolated per `projectFileId + graphDocumentId`
- worker execution behavior is still unchanged, which keeps the next real implementation cut clearly scoped to `Phase 2`

## [x] Worker-Vision-1 Phase 2 - Worker Cooperative Abort Checkpoints

### Purpose

Use the new latest-request contract inside the worker path so obsolete requests can stop at meaningful checkpoints instead of always running to completion.

### Owns

- first cooperative latest-request checks inside the worker pipeline
- clean obsolete-request exit behavior
- safe resource and cache handling on superseded exit

### Does Not Own

- broad scheduling-state publication
- Browser or `Viewport Runtime Inspector` presentation widening
- draft versus authoritative cadence policy

### Implementation Target

After this slice:
- a superseded in-flight request can stop at a meaningful checkpoint
- obsolete work no longer has to finish the full pipeline before the app rejects it
- correctness still remains guarded by the existing acceptance boundary

### First Proof

- request `B` can supersede request `A` for the same graph while `A` is running
- `A` stops at a worker-visible checkpoint instead of always finishing
- `B` can still complete normally and be accepted

### Current Live Read

Current code reality after `Phase 1`:
- `src/app/buildDispatcher.ts`
  - owns the canonical per-target latest-request snapshot
  - still posts normal `build` messages only
- `src/worker/worker.ts`
  - validates incoming `build` requests
  - immediately calls `buildPipeline(...)`
  - currently has no worker-local supersession ledger
- `src/worker/pipeline/buildPipeline.ts`
  - runs `buildModelResult(...)` before the per-part loop
  - emits progress during the per-part loop
  - currently has no abort callback or supersession check seam
- `src/app/bootstrapBuildWiring.ts`
  - currently understands `started`, `progress`, `settled`, and `error`
  - should not be widened into a broad new scheduler-read model in this phase

Important current limitation:
- the heaviest current cost may already begin inside `buildModelResult(...)`
- this phase should therefore claim the first honest checkpointed abort path, not a fantasy of zero wasted work for every superseded request

### Locked Implementation Direction

#### 1. Phase 2 should use a worker-local latest-request ledger, not cross-thread polling

The worker cannot depend on calling `buildDispatcher.getLatestBuildRequestSnapshot(...)` directly from inside the worker thread.

Recommended first real shape:
- `BuildDispatcher` keeps its app-side snapshot as the canonical transport-side truth
- `src/worker/worker.ts` maintains one worker-local latest-request ledger keyed by:
  - `projectFileId`
  - `graphDocumentId`
- every incoming build request updates that worker-local ledger before pipeline execution begins
- the pipeline receives a narrow `isSuperseded(...)` or `throwIfSuperseded(...)` callback instead of learning about dispatcher internals

Important rule:
- do not mirror the whole dispatcher into the worker
- pass only the smallest latest-request read needed for cooperative abort checks

#### 2. The first checkpoints should be few, explicit, and already aligned to real pipeline boundaries

Lock the first `Phase 2` checkpoints to boundaries that already exist today:
- in `src/worker/worker.ts`, immediately before entering `buildPipeline(...)`
- in `src/worker/pipeline/buildPipeline.ts`, before `buildModelResult(...)`
- in `src/worker/pipeline/buildPipeline.ts`, after `buildModelResult(...)` resolves and before the per-part loop begins
- in `src/worker/pipeline/buildPipeline.ts`, at the start of each per-part iteration before more progress/work is emitted for that part
- in `src/worker/pipeline/buildPipeline.ts`, before final `emitArtifacts(...)` result publication

Important rule:
- do not widen this phase into checkpoints inside every lower helper unless the first boundary set proves insufficient
- if `buildModelResult(...)` itself remains one large uninterruptible await, document that honestly and stop at the next real checkpoint afterward

#### 3. Superseded exit must not publish normal success or normal failure

When a checkpoint detects that request `A` is no longer the latest request for its graph target:
- do not emit a normal `BuildResult`
- do not emit a normal `worker_error`
- stop work through one narrow superseded-exit path that the outer worker code can recognize distinctly from failure

Recommended first shape:
- use one dedicated worker-local abort sentinel such as a typed error or result token for `superseded`
- catch only that sentinel at the worker boundary
- keep ordinary thrown errors mapped to the existing `worker_error` path

Important rule:
- `Phase 2` may add the narrow control-flow distinction needed to avoid stuck active work
- `Phase 2` should not yet widen that into a broad shared runtime publication model; that narration belongs to `Phase 3`

#### 4. Cache and authoritative-handle correctness must stay conservative on aborted exit

The first cooperative-abort pass should preserve this simple safety rule:
- do not publish partial accepted results from superseded work
- do not let superseded exit invent new retained/rebuilt semantics
- do not release accepted authoritative handles that belong to newer accepted state

First honest target:
- if supersession is detected before final result publication, the obsolete request exits without producing a normal build result
- any cache writes performed before the checkpoint remain acceptable only if they are request-agnostic deterministic caches already used by the pipeline

Important rule:
- if a cache write or resource ownership path is not obviously safe on superseded exit, keep it on the conservative side in this phase rather than widening into speculative reuse logic

### Concrete Implementation Target

After this slice:
- the worker owns one narrow latest-request ledger per graph target
- `buildPipeline(...)` can ask whether the current request is still latest at a few meaningful boundaries
- a superseded request exits through a distinct non-success non-error path
- newer accepted requests still flow through the existing stale-drop and acceptance boundary unchanged

The minimum meaningful success case is:
1. request `A` starts for graph `G`
2. request `B` arrives later for the same graph `G`
3. the worker-local ledger now says `B` is latest for `G`
4. request `A` reaches the next checkpoint and exits early
5. request `B` continues normally and can still be accepted

### Expected File Targets

Primary implementation files:
- `src/worker/worker.ts`
- `src/worker/pipeline/buildPipeline.ts`

Likely supporting files:
- `src/shared/buildTypes.ts`
  - only if one narrow typed superseded-exit signal or helper type is needed at the worker boundary
- `src/app/buildDispatcher.ts`
  - only if the current public snapshot/read shape needs a very small follow-up tweak for parity or testing
- `src/app/bootstrapBuildWiring.ts`
  - only if the worker needs one narrow non-error cleanup hook to avoid leaving superseded active entries stuck in queue state

Important rule:
- do not widen this slice into `Browser`, `Viewport Runtime Inspector`, or shared runtime-read redesign
- if `bootstrapBuildWiring.ts` changes at all, keep it on cleanup-only handling rather than narration

### Verification Bar

Required focused proof surfaces:
- `src/worker/pipeline/buildPipeline.test.ts`
  - prove a superseded request exits at a checkpoint before normal result publication
  - prove the newer request for the same graph can still complete normally
  - prove cross-graph requests do not supersede each other
- `src/app/buildDispatcher.test.ts`
  - keep latest-request snapshot proof intact after the worker checkpoint cut
  - keep stale same-graph rejection behavior unchanged as the correctness backstop
- `src/app/bootstrapBuildWiring.test.ts`
  - only if a narrow superseded cleanup signal reaches app runtime hooks
  - prove superseded exit does not surface as `Failed` and does not leave stale active entries stuck

Recommended implementation-grade scenarios:
- `same graph, newer request supersedes older request before per-part loop`
- `same graph, newer request supersedes older request during multi-part loop`
- `different graph request does not supersede active work for another graph`
- `older request that misses early checkpoints still cannot replace the newer accepted result`

### Discipline Rules

- do not claim preemptive cancellation
- do not redesign draft versus authoritative scheduling in this slice
- do not classify superseded exit as an error just to reuse the existing failure path
- do not widen the runtime-inspector/archive language yet beyond whatever narrow cleanup hook is truly required
- do not weaken dispatcher stale-drop or app-side accepted-result identity checks after worker checkpoints land

### Shipped Read

This slice is now shipped through:
- `docs/CHANGELOG.md`
  - `[1145] - WK - Phase Worker-Vision-1 Phase 2 - Worker Cooperative Abort Checkpoints`

Current landed truth:
- `src/worker/worker.ts` now keeps one worker-local latest-request ledger per `projectFileId + graphDocumentId`
- `src/worker/pipeline/buildPipeline.ts` now performs checkpointed supersession checks before heavy execution, between meaningful loop boundaries, and before final result publication
- superseded same-graph requests now exit quietly instead of publishing normal success or normal failure
- focused worker and pipeline tests now prove same-graph supersession and cross-graph isolation while dispatcher/bootstrap regressions stay green

## [x] Worker-Vision-1 Phase 3 - Superseded Runtime Truth And Hardening

### Purpose

Make superseded work visible as shared runtime truth and harden the lane with verification around correctness and cleanup.

### Owns

- first explicit superseded runtime reporting
- hardening around accepted-state preservation
- verification around safe worker/resource behavior on superseded exit

### Does Not Own

- full later scheduling model for draft versus authoritative
- export reuse
- deeper Browser content-hierarchy semantics

### Implementation Target

After this slice:
- the runtime can distinguish active, superseded, completed, and failed work cleanly enough for later shared read surfaces
- later Browser and `Viewport Runtime Inspector` work can build on one real superseded fact instead of reconstructing it indirectly

### First Proof

- superseded work no longer disappears as invisible implementation residue
- accepted runtime state remains on the newest accepted request only
- tests prove that superseded exit does not weaken correctness or resource cleanup

### Current Live Read

Current code reality after `Phase 2`:
- `src/worker/worker.ts`
  - now keeps one worker-local latest-request ledger per `projectFileId + graphDocumentId`
  - quietly swallows `BuildSupersededError` instead of publishing normal success or normal failure
- `src/worker/pipeline/buildPipeline.ts`
  - now throws `BuildSupersededError` at checkpoint boundaries when the request is no longer latest
  - still has no outward runtime publication for superseded exit
- `src/app/bootstrapBuildWiring.ts`
  - currently reacts only to:
    - request started
    - progress
    - settled result
    - worker error
  - has no dedicated non-error superseded hook
- `src/app/store/runtimeInspectorTaskStore.ts`
  - currently distinguishes:
    - `queued`
    - `active`
    - `done`
    - `reused`
    - `error`
  - has no `superseded` state yet
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - already preserves accepted build truth and accepted impact truth
  - still clears in-flight request state only through accepted result or failure cleanup

Important current limitation:
- the shipped `Phase 2` behavior is efficient but intentionally quiet
- without `Phase 3`, the runtime cannot tell the difference between:
  - a request that never started meaningful work
  - a request that is still active
  - a request that was superseded and exited safely

### Locked Implementation Direction

#### 1. Add one explicit superseded runtime event instead of overloading error or done

`Phase 3` should introduce one narrow shared runtime fact for superseded exit.

Recommended first shape:
- add a dedicated runtime hook path from the dispatcher for superseded build exit
- keep it distinct from:
  - `onBuildResultSettled`
  - `onWorkerError`
- let the app/runtime stores read one explicit `superseded` fact instead of inferring it from missing result traffic

Important rule:
- do not classify superseded work as `error`
- do not classify superseded work as `done`
- the first shared win is naming the truth honestly

#### 2. Publish superseded truth through the existing queue/archive seam first

The first visible shared runtime owner for superseded work should be:
- `src/app/store/runtimeInspectorTaskStore.ts`

Recommended first pass:
- add `superseded` as a first-class archive/result state beside:
  - `done`
  - `reused`
  - `error`
- keep active queue semantics unchanged
- archive superseded work quietly once the worker confirms it exited

Important rule:
- do not widen this slice into new Browser UI or a large new worker dashboard
- let `Viewport Runtime Inspector` and later shared reads build on one honest archive fact

#### 3. Preserve accepted-state truth as the stable winner

`Phase 3` must preserve this hierarchy:
- accepted result remains the only accepted geometry/runtime truth
- superseded exit is runtime narration about obsolete work
- superseded exit must not mutate accepted output state as if a new result landed

First honest target:
- newer accepted request `B` stays the winner
- superseded request `A` can still be remembered as superseded runtime history
- `useSpaghettiStore` should not lose accepted bundle or accepted impact truth because an older request exited quietly later

Important rule:
- the new superseded runtime fact is additive narration, not replacement accepted truth

#### 4. Hardening should cover cleanup and stuck-active prevention

`Phase 3` should explicitly prove that a superseded exit:
- clears any stale active placeholder that would otherwise linger forever
- archives one honest superseded row when that runtime read exists
- does not produce duplicate archive rows for the same identity
- does not release authoritative handles belonging to newer accepted state

Important rule:
- if a cleanup behavior already happens implicitly through replacement build start, keep it
- `Phase 3` should only add the missing explicit superseded narration and the focused hardening around it

### Concrete Implementation Target

After this slice:
- the worker/dispatcher/app runtime can publish one explicit superseded-build fact
- `runtimeInspectorTaskStore` can archive superseded work distinctly from error and done
- accepted runtime state still belongs only to the newest accepted request
- later `Viewport Runtime Inspector` and Browser-adjacent runtime reads can build on one real shared superseded fact instead of absence

The minimum meaningful success case is:
1. request `A` starts for graph `G`
2. request `B` supersedes `A`
3. worker checkpoints stop `A`
4. app runtime receives one explicit superseded event for `A`
5. `A` leaves active runtime state and becomes archived superseded truth
6. accepted state still belongs only to `B` if and when `B` is accepted

### Expected File Targets

Primary implementation files:
- `src/app/buildDispatcher.ts`
- `src/app/bootstrapBuildWiring.ts`
- `src/app/store/runtimeInspectorTaskStore.ts`

Likely supporting files:
- `src/worker/worker.ts`
  - only if the worker-to-dispatcher transport needs one narrow outbound superseded message
- `src/shared/buildTypes.ts`
  - only if the new superseded runtime event needs a typed shared message shape
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - only if one narrow cleanup or in-flight hardening adjustment is required when superseded truth becomes explicit
- `src/app/store/runtimeInspectorVm.ts`
  - only if the combined VM needs to map the new archived `superseded` tone into the existing runtime-inspector read model
- `src/app/components/TitleStatusBar.tsx`
  - only if the current archive presentation needs one small visible state treatment for superseded rows

Important rule:
- keep the first `Phase 3` pass inside runtime truth and hardening
- do not widen into broader queue editing, scheduler policy, or Browser content semantics

### Verification Bar

Required focused proof surfaces:
- `src/worker/worker.test.ts`
  - keep same-graph supersession and cross-graph isolation proof intact after runtime publication widens
- `src/app/buildDispatcher.test.ts`
  - prove explicit superseded runtime events do not weaken stale-drop or accepted-result protections
- `src/app/bootstrapBuildWiring.test.ts`
  - prove superseded work leaves active queue state cleanly
  - prove superseded work archives as `superseded`, not `error`
  - prove newer accepted build truth still replaces older active/archive context correctly
- `src/app/store/runtimeInspectorTaskStore.ts`
  - add focused store proof if the new `superseded` archive state needs standalone tests
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
  - only if a hardening adjustment is needed to preserve accepted-state truth during explicit superseded cleanup

Recommended implementation-grade scenarios:
- `same graph superseded request archives as superseded and clears active placeholder`
- `same graph accepted newer request still owns accepted state after older request is archived as superseded`
- `cross-graph work never archives as superseded because of activity on another graph`
- `superseded runtime narration never appears as failed diagnostics`
- `repeated superseded cleanup for the same identity does not duplicate archive truth`

### Discipline Rules

- do not redesign the worker checkpoint system again in this slice
- do not overload superseded truth onto `error`, `done`, or `reused`
- do not let explicit superseded narration mutate accepted bundle or accepted impact truth
- do not widen into draft-versus-authoritative settle policy
- do not add Browser or wider viewport UX redesign beyond the minimal runtime-inspector/archive treatment truly needed to surface the new fact

### Implementation Spec

Recommended reading order:
1. `docs/Human-Plans/Architecture/Worker/Worker-Vision.md`
2. `src/app/buildDispatcher.ts`
3. `src/worker/worker.ts`
4. `src/worker/pipeline/buildPipeline.ts`
5. `src/app/spaghetti/store/useSpaghettiStore.ts`
6. runtime-inspector and build-wiring reads that currently narrate build lifecycle

Required written outputs from this phase:
1. `Current Constraints`
2. `Locked Direction`
3. `Runtime Truth Direction`
4. `Implementation Target`
5. `Suggested Runtime Checkpoints`
6. `Suggested Ownership Split`
7. `Verification Bar`

Suggested execution steps:
1. implement `Phase 1`:
   - define one explicit latest-request read available to the worker path for `graphDocumentId`
2. implement `Phase 2`:
   - add a narrow cooperative-abort mechanism that the worker pipeline can call at a few meaningful checkpoints
   - make superseded requests exit cleanly without pretending they completed normally
3. implement `Phase 3`:
   - preserve dispatcher stale-drop and app-side accepted-result checks as the safety net
   - expose the first explicit superseded runtime truth through the existing runtime-reporting path

Suggested verification:
- `Phase 1`
  - prove latest-request identity is explicit and stable without changing worker execution behavior yet
- `Phase 2`
  - prove the second request for the same graph supersedes the first while the first is still running
  - prove the first request exits early at a checkpoint when superseded
  - prove the newest request can still complete and be accepted normally
- `Phase 3`
  - prove no obsolete accepted result replaces the newer accepted state
  - prove any worker-owned resource cleanup still behaves safely on superseded exit
  - prove superseded work becomes explicit runtime truth instead of invisible disappearance

Suggested verification commands:
- `rg -n "stale|supersed|latestRequestedSeq|latestResolvedSeq|buildRequestId" src/app src/worker`
- `rg -n "buildPipeline|requestGraphBuild|acceptGraphBuildResult" src/app src/worker`

Discipline rules:
- do not widen into draft-policy design
- do not widen into authoritative settle policy
- do not weaken existing stale-drop or accepted-result safety checks
- do not claim full cancellation if the runtime only supports cooperative early abort

Definition of done:
- latest-intent supersession exists as more than app-side stale-result rejection
- obsolete work can stop early at meaningful worker checkpoints
- correctness still remains guarded by the existing acceptance boundary
- the runtime can explain superseded work honestly enough that later Browser and `Viewport Runtime Inspector` reads have one real shared fact to build on
