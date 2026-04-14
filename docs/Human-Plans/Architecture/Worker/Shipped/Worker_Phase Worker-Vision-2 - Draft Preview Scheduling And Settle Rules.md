# Worker Phase Worker-Vision-2 - Draft Preview Scheduling And Settle Rules

## Doc Header

### Doc History
11. 2026-04-09 21:06: Marked `Worker-Vision-2 Phase 5 - Draft Scheduling Hardening And Family Handoff` shipped after the delayed placeholder release handoff stopped double-reporting `released` plus `replaced`, repeated release edges became safe one-shot no-ops, runtime-inspector scheduling cleanup converged on one current truth per graph, and accepted draft plus authoritative state stayed stable through scheduling-only churn so the family can now hand forward honestly into later settle-owner and authoritative scheduling work
10. 2026-04-09 18:00: Tightened `Worker-Vision-2 Phase 5 - Draft Scheduling Hardening And Family Handoff` into an implementation-ready closeout slice by grounding it in the now-shipped delayed placeholder state, release-trigger dispatch, and runtime-inspector scheduling truth seams, then locking the remaining work around duplicate-event prevention, stale placeholder cleanup, accepted-state preservation, and the final honest handoff into the later authoritative scheduling lane
9. 2026-04-09 17:58: Marked `Worker-Vision-2 Phase 4 - Draft Delay And Suppression Runtime Truth` shipped after app-owned draft scheduling events started bridging through `bootstrapBuildWiring.ts` into explicit runtime-inspector delayed/replaced/suppressed state, so delayed and suppressed preview truth is now shared runtime fact instead of inferred silence and the planning-surface handoff moves forward to `Phase 5 - Draft Scheduling Hardening And Family Handoff`
8. 2026-04-09 17:49: Tightened `Worker-Vision-2 Phase 4 - Draft Delay And Suppression Runtime Truth` into an implementation-ready slice by grounding it in the shipped delayed-placeholder and release-trigger code paths, the live `bootstrapBuildWiring.ts` runtime hook bridge, and the current `runtimeInspectorTaskStore.ts` queue/archive state family so the next implementation now locks one app/runtime-published truth path for delayed, released, replaced, and suppressed draft without faking worker lifecycle
7. 2026-04-09 17:46: Marked `Worker-Vision-2 Phase 3 - Release And Settle Trigger Flow` shipped after delayed `release` draft placeholders started dispatching through the live `endBrowserBuildInteraction(...)` seam into the normal dispatcher plus `stageGraphBuildRequest(...)` path, while `settle` remained an honest later trigger lane, so the planning-surface handoff now moves forward to `Phase 4 - Draft Delay And Suppression Runtime Truth`
6. 2026-04-09 17:40: Tightened `Worker-Vision-2 Phase 3 - Release And Settle Trigger Flow` into an implementation-ready slice by grounding it in the shipped app-owned delayed placeholder seam, the live `beginBrowserBuildInteraction(...) / endBrowserBuildInteraction(...)` release owner, and the existing normal `requestGraphDocumentBuild(...) -> buildDispatcher -> stageGraphBuildRequest(...)` dispatch path so the next implementation now locks one first real release-triggered delayed-draft handoff while keeping settle support narrow and honest until a concrete settle owner exists
5. 2026-04-09 17:38: Marked `Worker-Vision-2 Phase 1 - Draft Policy Contract And Request-Time Ownership` and `Worker-Vision-2 Phase 2 - Delayed Latest-Intent Placeholder State` shipped after the explicit `draftPolicy` execution-intent seam and the app-owned delayed latest-intent placeholder path both landed in code, so the planning-surface handoff now moves forward to `Phase 3 - Release And Settle Trigger Flow`
4. 2026-04-09 17:31: Tightened `Worker-Vision-2 Phase 2 - Delayed Latest-Intent Placeholder State` into an implementation-ready slice by grounding it in the shipped `draftPolicy` contract from `Phase 1`, the live `useAppStore.ts -> requestGraphDocumentBuild(...)` immediate-dispatch seam, and the current `useSpaghettiStore.ts -> stageGraphBuildRequest(...)` meaning so the next implementation now locks one non-dispatch delayed placeholder owner, replacement rules, and accepted-state protection boundaries before release-or-settle trigger mechanics widen later
3. 2026-04-09 12:10: Split `Worker-Vision-2` into explicit internal `Phase 1` through `Phase 5` sections so the draft-policy lane now breaks cleanly into request-time policy contract, delayed latest-intent placeholder state, release-and-settle trigger flow, runtime narration, and close-out hardening instead of still reading like one larger single-pass implementation block
2. 2026-04-09 12:10: Tightened `Worker-Vision-2` into an implementation-ready planning surface by grounding it in the live `useAppStore.ts -> resolveGraphBuildExecutionIntent(...) -> BuildDispatcher` request seam, the current viewport-mode and browser-policy split, and the shipped runtime-inspector queue/archive surfaces, then locking one first explicit draft-policy direction around `live / release / settle / suppressed` without prematurely splitting this lane into child subphases yet
1. 2026-04-09 12:10: Created this standalone future Worker phase doc so the next Worker Vision follow-on now has an implementation-ready planning surface for draft live-versus-settle scheduling, preview suppression reasoning, and the first explicit runtime truth around why draft did or did not run instead of leaving that lane only as a short section inside `Worker-Vision.md`

### Purpose

This doc defines the second implementation-ready phase under `Worker Vision`.

Use it to answer:
- how ParaHook should schedule draft preview work after latest-intent supersession is already real
- when draft should run live versus wait for release or short settle
- how draft suppression should become visible runtime truth
- what proof is needed before draft policy can claim to be intentional instead of accidental

### Why This Phase Exists

Today ParaHook already has:
- explicit same-graph request supersession
- cooperative worker checkpoints
- explicit superseded runtime truth

That is enough to stop obsolete work earlier.

It is not enough to make draft scheduling intentional.

Current reality:
- build requests still run when dispatched
- the runtime does not yet distinguish:
  - draft that ran live because it was cheap enough
  - draft that should wait for release
  - draft intentionally delayed for a short settle window
  - draft intentionally suppressed

This phase exists to close that policy gap without widening into authoritative scheduling or export reuse.

The goal is:
- keep latest-intent correctness and supersession behavior intact
- add one honest first draft scheduling model
- expose why draft did or did not run through explicit runtime truth

### Scope

This phase covers:
- draft preview `live` versus `on release` versus short-settle runtime policy
- request-time policy evaluation for draft preview builds
- explicit runtime truth for draft waiting, draft suppressed, and draft settled execution
- proof that latest-intent and accepted-result correctness remain intact while draft policy widens

This phase does not cover:
- authoritative scheduling and final acceptance policy
- export reuse
- Browser hierarchy redesign
- a broad worker-pool or priority-queue architecture

## Doc Body

## [ ] Worker-Vision-2 - Draft Preview Scheduling And Settle Rules

### Header

Purpose:
- make draft preview scheduling intentional and explainable instead of assuming every preview request should run immediately

Owns:
- draft `live` versus `on release` versus short-settle policy
- runtime truth for why draft did or did not run
- latest-intent-safe preview suppression and settle replacement

Does not own:
- authoritative scheduling and final acceptance rules
- export-facing reuse
- broad Browser runtime UX redesign

### Current Constraints

This phase starts from the shipped groundwork in:
- `docs/Human-Plans/Architecture/Worker/Worker-Vision.md`
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase Worker-Vision-1 - Request Supersession And Cooperative Early Abort.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Future/Model-Viewport_Phase Model-Viewport-1 - Geometry Execution Reset, Preview Policy, And Authoritative Build Path.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Future/Model-Viewport_Phase Model-Viewport-1.2 - Draft Preview Execution And Viewport Swap Rules.md`

Locked starting constraints:
- same-graph latest-intent supersession is already explicit and shipped
- cooperative worker abort checkpoints already exist
- explicit superseded runtime truth already exists
- accepted result safety still relies on dispatcher stale-drop and app acceptance checks
- draft scheduling should not claim that preview is permanently cheap

Current live seams this phase should read against:
- `src/app/store/useAppStore.ts`
- `src/app/buildDispatcher.ts`
- `src/app/bootstrapBuildWiring.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/store/runtimeInspectorTaskStore.ts`
- `src/app/store/runtimeInspectorVm.ts`
- current build-request issuance seams that decide execution intent

Important current-reality rule:
- this phase should not pretend authoritative scheduling is already solved
- the first honest target is draft policy only

Current code-backed read:
- `src/app/store/useAppStore.ts`
  - already owns `resolveGraphBuildExecutionIntent(...)`
  - already separates:
    - viewport-driven geometry target selection
    - Browser/build-path update timing through `updatePolicy`
  - is the strongest current owner seam for request-time draft policy selection
- `src/shared/buildTypes.ts`
  - already exposes `BuildExecutionIntent` with:
    - `buildMode`
    - `quality`
    - `updatePolicy`
    - `outputIntent`
    - `geometryTarget`
  - does not yet have one explicit field for draft scheduling reason such as `live / release / settle / suppressed`
- `src/app/buildDispatcher.ts`
  - already owns transport, stale-drop, latest-request tracking, and runtime hook fan-out
  - should not become the hidden owner of user-facing draft policy decisions
- `src/app/bootstrapBuildWiring.ts`
  - already owns runtime hook translation into build stats, console narration, and runtime-inspector queue/archive truth
- `src/app/store/runtimeInspectorTaskStore.ts`
  - already has:
    - `queued`
    - `active`
    - `done`
    - `reused`
    - `superseded`
    - `error`
  - does not yet have one explicit runtime fact for delayed or suppressed draft policy
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Future/Model-Viewport_Phase Model-Viewport-1.2 - Draft Preview Execution And Viewport Swap Rules.md`
  - already locked `Auto / Draft / Final` as the viewport-owned result-mode family
  - means `Worker-Vision-2` should treat viewport mode as an input to draft policy, not as a second place to define that mode family again

Important current limitation:
- the current request path still dispatches immediately once `requestGraphDocumentBuild(...)` is called
- `updatePolicy` already means broad build-trigger timing such as:
  - `auto`
  - `defer_until_release`
  - `manual`
- that existing field is not yet specific enough to explain why a draft request was:
  - run live
  - delayed for settle
  - intentionally suppressed
- this phase should therefore add one honest draft-policy seam instead of overloading old timing words until they become ambiguous

### Locked Direction

#### 1. Draft policy must become explicit before it becomes smarter

The first scheduling cut should prefer explicit readable policy over hidden heuristics.

Recommended first policy vocabulary:
- `live`
- `release`
- `settle`
- `suppressed`

Important rule:
- do not introduce a large scoring model yet
- the first win is naming the policy honestly and routing requests through it consistently

Recommended first contract direction:
- keep `geometryTarget` as the answer to:
  - `draft_preview` versus `authoritative`
- keep `updatePolicy` as the broader build-trigger timing family already used by Browser/build-path policy
- add one separate explicit draft-policy read, likely attached to request-time build intent, for:
  - `live`
  - `release`
  - `settle`
  - `suppressed`

Important rule:
- do not overload `updatePolicy = manual` or `defer_until_release` to mean every kind of draft suppression or settle delay
- this phase should keep build-trigger policy and draft-preview scheduling readable as separate truths

#### 2. Latest-intent supersession remains the underlying safety model

Draft scheduling does not replace `Worker-Vision-1`.

The runtime should still assume:
- newer same-graph intent supersedes older intent
- waiting draft work may be replaced before it runs
- stale accepted results are still rejected at the boundary if they survive too long

Important rule:
- draft settle behavior should co-operate with supersession instead of fighting it

Recommended first runtime ownership:
- delayed draft should remain one latest-intent placeholder per graph target, not a growing queue
- if a newer same-graph request arrives before delayed draft releases to run:
  - replace the delayed placeholder
  - do not run the older delayed draft later

Important rule:
- this phase should prefer single-slot latest-intent replacement over introducing a true multi-request scheduler queue

#### 3. Suppressed or delayed draft must be visible runtime truth

The runtime should be able to explain:
- draft ran live
- draft is waiting for release
- draft is waiting for settle
- draft was suppressed

Important rule:
- do not make `Viewport Runtime Inspector` or Browser infer this from missing activity alone
- this phase should add real shared runtime facts

Recommended first shared runtime facts:
- draft policy selected
- delayed draft pending
- delayed draft released
- delayed draft replaced before run
- draft suppressed

Recommended first visible owner:
- `src/app/store/runtimeInspectorTaskStore.ts`
  - because it already owns queue/archive runtime narration

Important rule:
- the first shared win is naming delayed/suppressed draft in runtime truth
- this phase should not widen into a large Browser status language pass yet

#### 4. Keep accepted result ownership separate from preview scheduling narration

Draft scheduling truth explains runtime behavior.

It does not redefine accepted truth.

Important rule:
- accepted build bundles and accepted impact remain owned by existing acceptance rules
- draft scheduling state is additive runtime narration, not replacement accepted state

Conservative rule:
- a delayed or suppressed draft request may affect runtime narration
- it must not clear or replace accepted draft or accepted authoritative state by itself

### Runtime Truth Direction

This phase should add the first explicit distinction between:
- draft scheduled live
- draft waiting for release
- draft waiting for settle
- draft suppressed

Recommended first shared runtime facts:
- request policy evaluated
- draft delayed
- draft delay reason:
  - `release`
  - `settle`
  - `suppressed`
- delayed draft replaced by newer latest intent
- delayed draft released to execution

Important rule:
- do not invent a full future scheduler protocol yet
- the first visible win is an honest runtime explanation of draft timing

Recommended first message direction:
- keep worker transport widening narrow
- prefer app/runtime publication for:
  - draft delayed
  - draft suppressed
  - delayed draft released
- reserve worker-originated runtime messages for events that only the worker can truly own during execution

Important rule:
- delayed-before-run draft is primarily app/runtime coordination truth, not worker execution truth

### Implementation Target

`Worker-Vision-2` should make one architecture shift real:

- draft preview requests no longer all behave as immediate execution by default
- one explicit runtime policy decides whether draft runs live, waits for release, waits for settle, or is suppressed
- delayed draft work still participates in latest-intent replacement cleanly
- shared runtime reads can explain why preview did or did not run

The minimum meaningful behavior change should be:
- a preview interaction can choose a non-live draft path intentionally, and later surfaces can explain that decision without guessing

The first honest target should be:
1. viewport mode and Browser/build-path context are read in `src/app/store/useAppStore.ts`
2. one explicit draft-policy decision is made there
3. if the answer is `live`, the request dispatches immediately through the current worker path
4. if the answer is `release` or `settle`, one delayed latest-intent placeholder is tracked for that graph target until release or settle
5. if the answer is `suppressed`, runtime truth records that outcome without dispatching fake work
6. any later release-to-run request still flows through the existing dispatcher, worker, supersession, and acceptance safety model

### First Boundaries

Keep inside this phase:
- draft policy vocabulary
- one request-time draft scheduling decision seam
- one delayed latest-intent placeholder model per graph target
- runtime truth for delayed or suppressed draft
- proof that delayed draft and superseded draft do not corrupt accepted truth

Keep outside this phase:
- authoritative settle and final scheduling policy
- export reuse
- broad queue redesign
- Browser content hierarchy changes

### Suggested Ownership Split

#### App Owns

- selecting preview mode or command context that influences draft policy
- passing the chosen scheduling hint into the runtime
- accepting or rejecting returned draft results through existing boundaries

Recommended first concrete owner:
- `src/app/store/useAppStore.ts`
  - because it already resolves `BuildExecutionIntent`
  - already knows:
    - viewport result mode
    - Browser/build-path timing
    - explicit user-trigger context

#### Dispatcher Or Runtime Coordinator Owns

- evaluating the first explicit draft policy
- tracking draft requests waiting for release or settle
- replacing delayed draft work when newer latest intent wins

Recommended first concrete split:
- `useAppStore.ts`
  - chooses draft policy
- `BuildDispatcher`
  - remains transport and worker-runtime boundary
- runtime-inspector/bootstrap seams
  - narrate delayed/suppressed/released draft truth

Important rule:
- do not push high-level draft-policy selection down into `BuildDispatcher`
- that would make the transport layer a hidden product-policy owner

#### Worker Owns

- executing draft work once released to run
- preserving latest-intent abort behavior during execution
- reporting progress and superseded exit honestly once a delayed request actually runs

#### Runtime Read Surfaces Own

- presenting shared scheduling facts without inventing policy
- explaining why draft is delayed, released, or suppressed

### Verification Bar

This phase is only done if it proves both:
- draft policy became intentional and visible
- latest-intent correctness stayed honest

Required proof:
- a draft request can be marked `live`, `release`, `settle`, or `suppressed` through one explicit policy seam
- delayed draft work can be replaced cleanly by newer same-graph latest intent before it runs
- released draft work still obeys the shipped supersession and acceptance protections
- runtime reads can explain why draft did or did not run without inferring from silence

Required focused proof surfaces:
- `src/app/store/useAppStore.test.ts`
  - prove request-time draft policy selection uses the intended viewport-mode and Browser/build-path inputs
  - prove delayed draft replacement stays latest-intent-only per graph target
- `src/app/buildDispatcher.test.ts`
  - only if one narrow runtime hook or request-intent contract widens
  - keep stale-drop and accepted-result protections intact after the draft-policy cut
- `src/app/bootstrapBuildWiring.test.ts`
  - prove delayed/suppressed draft runtime truth maps into queue/archive narration honestly
  - prove delayed draft release does not surface as fake failure or fake done truth
- runtime-inspector store or VM tests
  - only if the new delayed/suppressed draft states need standalone shaping or visible copy rules

Important rule:
- prefer focused proof around the request-owner seam in `useAppStore.ts`
- this phase is not complete if only the runtime-inspector copy changes while request dispatch behavior remains accidental

Recommended implementation-grade scenarios:
- `cheap preview stays live`
- `settle-delayed preview is replaced by newer same-graph input before release`
- `release-delayed preview runs once after interaction release`
- `suppressed preview does not produce fake failure or fake done truth`
- `delayed preview narration does not mutate accepted final state`

### Expected File Targets

Primary implementation files:
- `src/app/store/useAppStore.ts`
- `src/app/buildDispatcher.ts`
- `src/app/bootstrapBuildWiring.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`

Likely supporting files:
- `src/shared/buildTypes.ts`
  - only if explicit draft-policy or draft-delay runtime messages need typed shared shapes
- `src/app/store/runtimeInspectorTaskStore.ts`
  - only if draft waiting or suppressed truth needs archive/queue treatment beyond current superseded handling
- `src/app/store/runtimeInspectorVm.ts`
  - only if shared runtime reads need compact policy explanation for the first visible surface
- `src/app/workspace/workspaceViewportResultMode.ts`
  - only if the current viewport-mode helpers need one narrow behavior read that the draft-policy decision can reuse without duplicating mode logic
- model-viewport-facing request issuance seams
  - only if current execution-intent selection must widen to carry one first draft-policy hint or release/settle trigger

Important rule:
- keep the first pass inside draft policy and runtime truth
- do not widen into final scheduling or export semantics

### Implementation Spec

Recommended reading order:
1. `docs/Human-Plans/Architecture/Worker/Worker-Vision.md`
2. `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Future/Model-Viewport_Phase Model-Viewport-1.2 - Draft Preview Execution And Viewport Swap Rules.md`
3. `src/app/store/useAppStore.ts`
4. `src/shared/buildTypes.ts`
5. `src/app/buildDispatcher.ts`
6. `src/app/bootstrapBuildWiring.ts`
7. runtime-inspector queue/archive reads that currently narrate build lifecycle

Recommended execution order:
1. lock one explicit request-time draft-policy read in `useAppStore.ts`
2. keep `BuildExecutionIntent` readable by separating:
   - geometry target
   - broad update timing
   - first draft scheduling reason
3. add one delayed latest-intent placeholder path for `release` and `settle`
4. publish delayed, released, replaced, and suppressed draft truth through the existing runtime narration seam
5. prove that released draft still flows through the shipped worker supersession and acceptance protections without new correctness regressions

Recommended first-shape guardrails:
- one delayed draft placeholder per graph target, not a real queue
- one settle window owner, likely app/runtime-side, not worker-side polling
- no fake worker request should be emitted merely to narrate `suppressed`
- if delayed draft is released later, it should generate a normal build request with explicit latest request identity instead of mutating the worker path invisibly

### Discipline Rules

- do not redesign `Worker-Vision-1` supersession again in this slice
- do not let draft scheduling mutate accepted final truth directly
- do not widen into authoritative settle policy
- do not claim preview is always cheap enough to stay live
- do not let Browser or `Viewport Runtime Inspector` invent their own scheduling facts
- do not bury first-pass draft scheduling inside `BuildDispatcher` if `useAppStore.ts` already has the real request-owner context
- do not overload `manual` or `defer_until_release` until it becomes unclear whether the runtime is describing build-trigger timing or draft-preview timing

### Definition Of Done

- draft preview scheduling is no longer accidental all-live behavior
- one explicit runtime policy explains when draft runs now versus later
- delayed draft work still respects latest-intent supersession
- later Browser and `Viewport Runtime Inspector` work can read honest draft-timing truth from shared runtime facts

### Internal Phase Ladder

This doc is now split into five internal implementation slices so Codex can execute them one at a time without widening into the whole draft-policy lane at once.

## [x] Worker-Vision-2 Phase 1 - Draft Policy Contract And Request-Time Ownership

### Purpose

Lock the first explicit draft-policy contract and request-time owner seam so the repo can choose `live / release / settle / suppressed` intentionally before any delayed placeholder or runtime narration behavior widens.

### Owns

- first explicit draft-policy vocabulary
- request-time owner seam in `src/app/store/useAppStore.ts`
- clean separation between:
  - geometry target
  - broad build-trigger timing
  - draft scheduling reason

### Does Not Own

- delayed placeholder tracking
- release or settle trigger mechanics
- runtime-inspector narration widening

### Implementation Target

After this slice:
- the app has one explicit way to decide draft policy at request time
- that decision is made where viewport mode and Browser/build-path timing are already visible
- `BuildExecutionIntent` and adjacent request-time contract surfaces remain readable instead of overloading old timing words

### First Proof

- `useAppStore.ts` can choose `live`, `release`, `settle`, or `suppressed` through one explicit policy seam
- viewport-mode input and Browser/build-path timing input stay distinct
- no delayed runtime behavior is claimed yet unless the repo actually uses the new policy answer

### Expected File Targets

Primary implementation files:
- `src/app/store/useAppStore.ts`
- `src/shared/buildTypes.ts`

Likely supporting files:
- `src/app/store/useAppStore.test.ts`
- `src/app/workspace/workspaceViewportResultMode.ts`
  - only if the current viewport-mode helpers need one narrow shared read for draft-policy selection

### Verification Bar

Required focused proof:
- explicit request-time draft-policy selection exists and is testable
- `geometryTarget`, `updatePolicy`, and draft scheduling reason do not collapse back into one ambiguous field
- existing request dispatch behavior remains unchanged until a later phase adopts delayed execution

Current status:
- shipped in code
- handoff moved forward to `Phase 2 - Delayed Latest-Intent Placeholder State`

## [x] Worker-Vision-2 Phase 2 - Delayed Latest-Intent Placeholder State

### Purpose

Add the first delayed latest-intent placeholder model per graph target so `release` and `settle` draft policy can hold work without dispatching immediately, while still staying latest-intent-only instead of becoming a real queue.

### Owns

- one delayed placeholder per graph target
- replacement of delayed draft by newer same-graph latest intent
- conservative no-worker-dispatch behavior for delayed requests

### Does Not Own

- final release trigger logic
- visible runtime narration beyond narrow state cleanup needs
- authoritative scheduling policy

### Implementation Target

After this slice:
- a request-time policy can choose not to dispatch draft immediately
- the runtime keeps one delayed latest-intent placeholder for that graph target
- newer same-graph requests replace the delayed placeholder instead of stacking multiple waiting requests

### Current Strongest Read

The live owner seams now read like this:
- `src/app/store/useAppStore.ts`
  - already owns request-time build compilation and `resolveGraphBuildExecutionIntent(...)`
  - still dispatches immediately once `requestGraphDocumentBuild(...)` reaches `buildDispatcher.requestGraphBuild(...)`
  - is therefore still the strongest owner for deciding whether draft should dispatch now or become delayed placeholder state
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - already owns graph-runtime compile-build truth and accepted build ownership
  - `stageGraphBuildRequest(...)` currently means:
    - a real build request id was created
    - a real build sequence was issued
    - worker-facing in-flight build state exists now
  - should therefore not be reused for delayed placeholder state unless this phase explicitly widens that meaning
- `src/app/buildDispatcher.ts`
  - remains transport and worker boundary
  - should not become the hidden owner of delayed placeholder scheduling policy

Important current limitation:
- after `Phase 1`, the repo can express `draftPolicy = release | settle | suppressed`
- but `requestGraphDocumentBuild(...)` still issues a worker request immediately
- so `Phase 2` must create one real pre-dispatch holding model instead of treating the new policy field as descriptive-only forever

### Locked Direction

#### 1. Delayed placeholder state should exist before release or settle triggers do

This slice should create one latest-intent holding seam first.

The first honest target is:
- request-time policy decides draft should not dispatch now
- the app stores one delayed placeholder for that graph target
- no worker message is posted yet
- no fake in-flight build seq or build request id is minted yet

Important rule:
- delayed placeholder state is pre-dispatch truth, not disguised worker truth

#### 2. Placeholder ownership should stay separate from accepted and in-flight compile-build truth

Recommended first ownership:
- `useAppStore.ts`
  - owns:
    - delayed placeholder creation
    - delayed placeholder replacement
    - delayed placeholder removal when superseded or later released in a future phase
- `useSpaghettiStore.ts`
  - may expose one narrow graph-runtime read only if the placeholder must survive alongside graph-local runtime state
  - should not treat delayed placeholder as:
    - `inFlightBuildRequestId`
    - `inFlightBuildSeq`
    - `latestIssuedBuildSeq`
    - accepted build ownership

Important rule:
- `stageGraphBuildRequest(...)` should remain reserved for real worker-dispatched requests in this slice
- if the delayed placeholder needs graph-local visibility, add a separate graph-runtime field rather than widening existing in-flight meanings until they become ambiguous

#### 3. One graph target gets one delayed latest intent

The delayed model should stay intentionally small:
- one placeholder per graph document target
- no per-part queue
- no accumulating delayed stack

Replacement rules:
- if graph `A` already has a delayed draft placeholder and a newer delayed draft request for graph `A` arrives:
  - replace the existing placeholder
  - keep only the newest request-time truth
- if graph `B` receives a delayed draft request:
  - it should not replace graph `A`
- if a real in-flight worker request already exists for a graph:
  - this phase still may stage a newer delayed placeholder for later release
  - but it must not rewrite the existing in-flight request identity

Important rule:
- latest-intent placeholder replacement must be isolated by graph routing target, not global

#### 4. This slice should not fake worker lifecycle or accepted-state churn

Because delayed placeholder state is pre-dispatch:
- it should not emit worker progress
- it should not emit worker error
- it should not clear accepted draft or authoritative results
- it should not mark compile-build in-flight state as active

Conservative rule:
- accepted and in-flight runtime truth should remain exactly as they were before the delayed placeholder was staged
- this slice only adds one future-work holder, not a new accepted or active execution outcome

### First Proof

- `release` and `settle` draft policies can withhold immediate dispatch
- only one delayed latest-intent placeholder exists per graph target
- a newer same-graph placeholder replaces the older one cleanly before worker execution begins
- accepted draft or authoritative state remains untouched while placeholder-only work is waiting

### Expected File Targets

Primary implementation files:
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/shared/buildTypes.ts`
  - only if one explicit delayed-placeholder snapshot shape needs a shared typed contract

Likely supporting files:
- `src/app/store/useAppStore.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
  - only if placeholder tracking becomes explicit graph-runtime state there
- `src/app/buildDispatcher.test.ts`
  - only if proof needs to show delayed requests do not reach dispatcher transport at all in this slice

### Verification Bar

Required focused proof:
- delayed draft is latest-intent-only, not a growing queue
- placeholder replacement is isolated per graph target
- accepted draft or authoritative state is not cleared just because a delayed placeholder was staged
- delayed placeholder staging does not call `buildDispatcher.requestGraphBuild(...)`
- `stageGraphBuildRequest(...)` still only tracks real dispatched work in this slice

Current status:
- shipped in code
- handoff moved forward to `Phase 3 - Release And Settle Trigger Flow`

### Implementation Spec

Recommended reading order:
1. `src/app/store/useAppStore.ts`
2. `src/app/spaghetti/store/useSpaghettiStore.ts`
3. `src/app/store/useAppStore.test.ts`
4. `src/app/spaghetti/store/useSpaghettiStore.test.ts`
5. `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker-Vision-2 - Draft Preview Scheduling And Settle Rules.md`

Recommended execution order:
1. identify the point in `requestGraphDocumentBuild(...)` after compile/build-input derivation but before dispatcher issuance where `draftPolicy` can stop immediate dispatch
2. add one delayed-placeholder state seam keyed by graph document id
3. stage `release` and `settle` requests into that placeholder seam instead of issuing worker requests immediately
4. keep `suppressed` behavior out of this slice unless the implementation needs small cleanup for shared placeholder typing
5. add focused proof that delayed placeholder replacement is same-graph only and does not mutate in-flight or accepted build ownership

Recommended first placeholder payload:
- graph document id
- current project file id
- compiled request/build-input-derived data needed for later real dispatch
- execution intent
- graph revision snapshot
- changed param ids
- target and affected build-unit ids
- preview stats part keys
- one latest-intent timestamp or replacement-stable identity only if needed for tests

Important rule:
- do not mint a worker build request id or sequence number until a later phase actually releases the delayed request into normal dispatch

Recommended implementation-grade scenarios:
- `release draft request stages one delayed placeholder and does not dispatch`
- `settle draft request stages one delayed placeholder and does not dispatch`
- `newer delayed request replaces older delayed placeholder for the same graph`
- `delayed placeholder for graph A does not replace graph B`
- `accepted build bundle stays visible while delayed placeholder waits`

## [x] Worker-Vision-2 Phase 3 - Release And Settle Trigger Flow

### Purpose

Turn the delayed placeholder model into real execution behavior by defining when `release` and `settle` draft work is allowed to dispatch, while preserving the latest-intent replacement rule from the earlier slices.

### Owns

- release-triggered draft dispatch
- settle-triggered draft dispatch
- replacement-safe dispatch of the current delayed placeholder into the existing worker path

### Does Not Own

- rich runtime narration surface
- authoritative settle policy
- export or Browser hierarchy work

### Implementation Target

After this slice:
- `release` draft can dispatch once the relevant interaction release path occurs
- `settle` draft can dispatch once the first real settle condition is met
- released delayed draft enters the same normal request path as any other build and still benefits from shipped supersession and stale-drop safety

### Current Strongest Read

The live code now provides these strongest seams:
- `src/app/store/useAppStore.ts`
  - already owns:
    - delayed placeholder staging in `delayedDraftBuildByGraphDocumentId`
    - request-time build compilation
    - normal dispatch through `requestGraphDocumentBuild(...)`
  - already has one release-adjacent owner seam in:
    - `beginBrowserBuildInteraction(...)`
    - `endBrowserBuildInteraction(...)`
  - is therefore the strongest current owner for the first delayed-placeholder release path
- `src/app/buildDispatcher.ts`
  - already owns normal request transport, latest-request tracking, stale-drop, and runtime hook fan-out
  - should remain unchanged as the transport boundary once delayed work is actually released
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - already treats `stageGraphBuildRequest(...)` as the moment real in-flight build identity begins
  - should continue to see delayed work only after the placeholder is truly released into normal dispatch

Important current limitation:
- `release` already has a concrete owner seam through interaction end
- `settle` is part of the policy vocabulary but does not yet have one dedicated timer or settle-owner seam in code
- this slice should therefore be explicit about what is implementation-ready now:
  - release-triggered delayed draft dispatch is the first required shipped path
  - settle-triggered dispatch may stay as a narrow contract-preserving hook or a small non-default path unless this slice also introduces one real settle owner

### Locked Direction

#### 1. Released delayed draft should re-enter the normal dispatch path, not invent a second worker path

When delayed work is finally allowed to run:
- it should mint a normal build request id
- it should mint a normal dispatcher sequence
- it should call the same dispatcher transport used by immediate requests
- it should stage graph-runtime in-flight state through the same `stageGraphBuildRequest(...)` seam used by other real requests

Important rule:
- do not mutate worker state or compile-build state indirectly from the delayed placeholder
- release should convert the placeholder into one normal request, not a hidden side-channel

#### 2. Release ownership should land first on the existing interaction-release seam

The first honest release trigger is:
- a graph enters delayed `release` draft state during interaction
- `endBrowserBuildInteraction(graphDocumentId)` runs
- the current delayed placeholder for that graph, if still present and still `draftPolicy = release`, dispatches once

Important rule:
- only the current latest placeholder for that graph should dispatch
- older replaced placeholders must stay dead and never dispatch later

#### 3. Settle support should stay honest and narrow until a true settle owner exists

This slice should not pretend the repo already has a robust settle scheduler.

Recommended first implementation boundary:
- required:
  - release-triggered dispatch for delayed `release` placeholders
- optional narrow extension:
  - one small app-owned settle trigger helper if implementation wants to route `settle` placeholders into the same release function later
- not required in this slice:
  - a broad timer service
  - worker-side polling
  - Browser/runtime narration for delayed versus settled versus released outcomes

Important rule:
- if no concrete settle owner is added, the doc and code should say so honestly rather than implying settle is already fully implemented

#### 4. Placeholder cleanup should happen only at the actual handoff boundary

When delayed work dispatches:
- remove that graph’s placeholder from `delayedDraftBuildByGraphDocumentId`
- then issue the real request

When delayed work does not dispatch:
- keep the placeholder intact

Important rule:
- do not clear placeholders early just because interaction state changed elsewhere
- do not clear accepted build state when placeholder cleanup occurs

#### 5. Release-triggered dispatch must preserve graph-target isolation and current correctness protections

This slice should preserve:
- same-graph latest-intent replacement before release
- per-graph isolation between delayed placeholders
- existing dispatcher stale-drop behavior once released work becomes a real request
- existing worker cooperative supersession once released work is active

Important rule:
- release logic must only dispatch the targeted graph’s current placeholder
- it must not flush every delayed placeholder globally

### First Proof

- release-delayed draft runs once after release instead of during every intermediate interaction step
- settle-delayed draft can be replaced by newer same-graph intent before the settle-triggered dispatch occurs
- once dispatched, delayed draft still uses the existing dispatcher and worker safety model
- released delayed draft becomes real compile-build in-flight state only after dispatch, not while still delayed
- releasing one graph does not dispatch other graphs’ delayed placeholders

### Expected File Targets

Primary implementation files:
- `src/app/store/useAppStore.ts`

Likely supporting files:
- interaction-release or settle-owner seams that currently call `requestGraphDocumentBuild(...)`
- `src/app/store/useAppStore.test.ts`
- `src/app/buildDispatcher.test.ts`
  - only if one narrow dispatch or request-shape path widens in the process
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
  - only if proof needs to show the released placeholder now appears as normal in-flight compile-build truth and not before

### Verification Bar

Required focused proof:
- a delayed `release` placeholder dispatches once from `endBrowserBuildInteraction(...)`
- released delayed work leaves the placeholder map and enters normal dispatcher plus `stageGraphBuildRequest(...)` flow
- release and settle triggers dispatch only the current delayed latest-intent placeholder
- older delayed placeholders never run after they were replaced
- released delayed draft still flows through the same worker/dispatcher acceptance boundary as normal builds
- unreleased delayed placeholders remain untouched for other graph targets

Current status:
- shipped in code for the first required release-trigger path
- `settle` remains a later trigger lane until a concrete settle owner lands
- handoff moved forward to `Phase 4 - Draft Delay And Suppression Runtime Truth`

### Implementation Spec

Recommended reading order:
1. `src/app/store/useAppStore.ts`
2. `src/app/store/useAppStore.test.ts`
3. `src/app/buildDispatcher.ts`
4. `src/app/spaghetti/store/useSpaghettiStore.ts`
5. `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker-Vision-2 - Draft Preview Scheduling And Settle Rules.md`

Recommended execution order:
1. extract one small helper in `useAppStore.ts` that turns a delayed placeholder into one normal dispatch
2. wire `endBrowserBuildInteraction(graphDocumentId)` to release the current delayed `release` placeholder for that graph after interaction state clears
3. clear only the placeholder that is actually being released
4. keep `settle` behavior narrow:
   - either leave it staged for a later slice
   - or route it through one explicit helper only if a real settle owner is added in the same change set
5. add focused tests proving release dispatch is one-shot, graph-local, and uses the normal worker path

Recommended first helper behavior:
- accept `graphDocumentId`
- read the current placeholder from `delayedDraftBuildByGraphDocumentId`
- bail if missing
- bail if placeholder policy does not match the trigger
- clear the placeholder
- mint a normal build request id
- call `buildDispatcher.requestGraphBuild(...)`
- call `useSpaghettiStore.getState().stageGraphBuildRequest(...)` with the real request identity

Important rule:
- do not recompile during release if the delayed placeholder already contains the compiled request payload needed for dispatch
- this slice should release the stored latest intent, not silently replace it with a fresh implicit compile unless the user made a newer request already

Recommended implementation-grade scenarios:
- `release placeholder dispatches once when interaction ends`
- `release placeholder for graph A does not dispatch graph B`
- `replaced release placeholder never dispatches after endInteraction`
- `released delayed draft now creates real in-flight build identity`
- `settle placeholder remains honestly non-running unless a real settle trigger is added`

## [x] Worker-Vision-2 Phase 4 - Draft Delay And Suppression Runtime Truth

### Purpose

Make delayed and suppressed draft behavior visible as shared runtime truth so the runtime-inspector lane can explain why draft did or did not run instead of leaving that meaning implicit.

### Owns

- explicit runtime truth for:
  - delayed draft
  - released draft
  - replaced delayed draft
  - suppressed draft
- first queue/archive or task-state narration for delayed/suppressed preview behavior
- narrow console/runtime narration if needed to keep lifecycle truth honest

### Does Not Own

- large Browser UI changes
- broad scheduling dashboard redesign
- authoritative runtime narration

### Implementation Target

After this slice:
- runtime surfaces can explain delayed or suppressed draft explicitly
- delayed-before-run draft is no longer invisible absence
- suppressed draft is not misclassified as `done`, `error`, or `superseded`

### Current Strongest Read

The live code now provides these strongest seams:
- `src/app/store/useAppStore.ts`
  - already owns:
    - delayed placeholder staging
    - delayed placeholder replacement
    - first release-triggered delayed draft dispatch
  - does not yet publish any shared runtime truth when draft is:
    - delayed
    - released
    - replaced before run
    - suppressed
- `src/app/bootstrapBuildWiring.ts`
  - already translates real dispatcher/worker lifecycle into:
    - build stats
    - console narration
    - `runtimeInspectorTaskStore`
  - is the strongest current bridge for widening shared runtime truth without teaching the worker about pre-dispatch app-owned scheduling events
- `src/app/store/runtimeInspectorTaskStore.ts`
  - already owns one queue/archive family with:
    - `queued`
    - `active`
    - `done`
    - `reused`
    - `superseded`
    - `error`
  - does not yet have explicit state for delayed or suppressed draft
- `src/app/store/runtimeInspectorVm.ts`
  - already shapes queue/archive cards for the existing task states
  - should stay downstream from shared store truth instead of inventing delayed/suppressed meaning locally

Important current limitation:
- delayed and suppressed draft are still invisible unless the user infers them from silence or from app behavior
- `buildDispatcher` runtime hooks only cover real worker lifecycle today
- so `Phase 4` must add one app/runtime publication path for pre-dispatch and non-worker scheduling truth instead of waiting for worker-originated events that can never exist for suppressed or not-yet-run draft

### Locked Direction

#### 1. Delayed and suppressed draft should publish shared runtime truth from the app/runtime side

Recommended first ownership split:
- `useAppStore.ts`
  - publishes scheduling facts when draft is staged, replaced, released, or suppressed
- `bootstrapBuildWiring.ts`
  - receives those facts and translates them into shared runtime-inspector store updates and narrow console narration if needed
- `runtimeInspectorTaskStore.ts`
  - stores the resulting queue/archive truth

Important rule:
- do not route delayed or suppressed draft through fake worker progress or fake worker result messages
- these facts are app/runtime-owned because the worker never ran them

#### 2. The runtime-inspector store should gain explicit delayed/suppressed state instead of overloading existing meanings

Recommended first state direction:
- add one or more explicit task/archive states for:
  - delayed
  - suppressed
  - released
  - replaced-before-run

Conservative rule:
- do not overload:
  - `done`
  - `reused`
  - `superseded`
  - `error`
- if a new state family is added, VM shaping and card tone mapping should follow that new explicit truth rather than remapping it back into an older misleading label

#### 3. Delayed queue truth and archive truth should stay honest about before-run versus after-release lifecycle

The first shared win should distinguish:
- delayed and waiting
- replaced before run
- released to real execution
- suppressed without execution

Recommended first lifecycle shape:
- delayed draft can appear in active queue as waiting runtime truth
- replaced-before-run and suppressed can archive as terminal scheduling outcomes
- released can archive or transition cleanly out of delayed state once the real worker-backed request starts

Important rule:
- do not leave stale delayed queue entries behind once released work becomes a real worker request
- do not double-count one delayed request as both active delayed and active worker execution at the same time

#### 4. Release-triggered runtime truth should cooperate with the already-shipped worker lifecycle

Once delayed work is released:
- the app/runtime scheduling truth should clear or transition the delayed waiting entry
- the normal worker-backed `beginBuild` / progress lifecycle should take over

Important rule:
- Phase 4 should narrate the handoff, not replace the existing worker lifecycle path
- released delayed draft should still look like one real worker request after handoff, not two unrelated builds

#### 5. Suppressed draft should be explicit non-work, not fake failure

When draft policy resolves to `suppressed`:
- the runtime should record that draft was intentionally suppressed
- no worker request should be emitted
- no worker error should be emitted

Important rule:
- suppressed draft is a truthful scheduling outcome, not an error and not a success result
- the first visible runtime truth should say that plainly

### First Proof

- runtime-inspector or nearby shared runtime state can name delayed and suppressed draft truth explicitly
- delayed draft replacement before run is narrated honestly
- suppressed draft does not emit fake worker progress or fake worker completion
- released delayed draft does not leave stale delayed queue truth behind once real worker execution starts
- delayed/suppressed scheduling truth stays graph-target-local instead of leaking across graphs

### Expected File Targets

Primary implementation files:
- `src/app/bootstrapBuildWiring.ts`
- `src/app/store/runtimeInspectorTaskStore.ts`
- `src/app/store/runtimeInspectorVm.ts`

Likely supporting files:
- `src/shared/buildTypes.ts`
  - only if new app/runtime-side lifecycle messages or typed state values are needed
- `src/app/store/useAppStore.ts`
  - if app-owned draft scheduling events need one publication seam
- `src/app/bootstrapBuildWiring.test.ts`
- runtime-inspector store or VM tests

### Verification Bar

Required focused proof:
- delayed draft and suppressed draft become explicit runtime truth
- the new truth does not overload `done`, `error`, `reused`, or `superseded`
- active queue and archive behavior stay consistent when delayed draft is released or replaced

Current status:
- shipped in code
- delayed, replaced-before-run, and suppressed draft are now explicit runtime-inspector truth
- release handoff now clears delayed queue truth before worker-backed lifecycle takes over
- handoff moved forward to `Phase 5 - Draft Scheduling Hardening And Family Handoff`

### Implementation Spec

Recommended reading order:
1. `src/app/store/useAppStore.ts`
2. `src/app/bootstrapBuildWiring.ts`
3. `src/app/store/runtimeInspectorTaskStore.ts`
4. `src/app/store/runtimeInspectorVm.ts`
5. `src/app/bootstrapBuildWiring.test.ts`
6. runtime-inspector store or VM tests

Recommended execution order:
1. add one narrow app/runtime event publication seam for draft scheduling outcomes in `useAppStore.ts`
2. wire that seam into `bootstrapBuildWiring.ts` so delayed, released, replaced, and suppressed facts can reach shared runtime stores
3. widen `runtimeInspectorTaskStore.ts` with explicit delayed/suppressed lifecycle state instead of overloading current task states
4. update `runtimeInspectorVm.ts` card shaping/tone mapping to reflect the new explicit states
5. add focused tests proving released delayed draft hands off cleanly to worker-backed lifecycle and suppressed draft remains non-worker truth

Recommended first event vocabulary:
- `draft_delayed`
- `draft_released`
- `draft_replaced`
- `draft_suppressed`

Important rule:
- these names are direction, not a mandate, but the contract should distinguish all four outcomes explicitly
- the event payload should at minimum carry:
  - graph document id
  - build policy reason
  - enough identity to deduplicate or replace existing delayed runtime entries cleanly

Recommended implementation-grade scenarios:
- `release draft stages delayed queue truth before worker start`
- `replaced delayed draft archives as replaced-before-run instead of disappearing`
- `released delayed draft clears delayed waiting truth when worker-backed build starts`
- `suppressed draft records explicit runtime truth without fake worker lifecycle`
- `delayed runtime truth for graph A does not disturb graph B`

## [x] Worker-Vision-2 Phase 5 - Draft Scheduling Hardening And Family Handoff

### Purpose

Close the first draft-policy lane by hardening the interaction between request-time policy, delayed placeholder state, release/settle dispatch, and runtime truth, then hand the family forward into authoritative scheduling.

### Owns

- repeated latest-intent replacement hardening
- duplicate-dispatch prevention for delayed draft
- accepted-state preservation proof across delayed, suppressed, released, and superseded draft paths
- final handoff notes for `Worker-Vision-3`

### Does Not Own

- authoritative scheduling itself
- export reuse
- broad Browser or viewport UX redesign beyond what is needed to keep runtime truth honest

### Implementation Target

After this slice:
- the first draft-policy lane behaves consistently under repeated edits
- delayed draft does not double-run or linger forever
- accepted draft and accepted authoritative state remain stable when draft policy widens
- the family can hand forward into final/authoritative scheduling from an honest base

### Current Strongest Read

The live code now provides these strongest seams:
- `src/app/store/useAppStore.ts`
  - already owns:
    - draft policy selection
    - delayed placeholder staging and replacement
    - release-triggered delayed dispatch
    - draft scheduling runtime event publication
  - is therefore the strongest owner for remaining duplicate-dispatch and stale-placeholder hardening
- `src/app/bootstrapBuildWiring.ts`
  - already bridges app-owned draft scheduling events into the shared runtime-inspector store
  - is the strongest owner for making sure delayed/replaced/released/suppressed runtime truth stays deduplicated and does not linger incorrectly
- `src/app/store/runtimeInspectorTaskStore.ts`
  - already holds explicit delayed/replaced/suppressed runtime truth
  - may still need lifecycle hardening so repeated scheduling churn does not leave duplicate queue/archive entries behind
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - still owns accepted build state and real in-flight compile-build truth
  - remains the acceptance boundary that must stay stable while draft scheduling widens

Current status:
- shipped in code
- release-triggered delayed draft handoff no longer double-reports `released` plus `replaced`
- repeated release edges now become safe no-ops after the stored placeholder has already dispatched
- runtime-inspector scheduling cleanup now clears stale per-graph scheduling archive truth when a newer delayed, released, or suppressed outcome becomes the only honest story
- accepted build bundle plus accepted draft and authoritative geometry remain stable through scheduling-only churn

### Locked Direction

#### 1. Close the lane around repeated latest-intent churn, not around new scheduling features

This slice should harden what already exists.

The focus should be:
- repeated same-graph delayed replacement
- delayed release after multiple prior replacements
- suppressed-after-delayed cleanup
- repeated release edges that should not double-dispatch

Important rule:
- do not reopen basic `live / release / settle / suppressed` contract questions here
- do not widen into new authoritative scheduling behavior

#### 2. Duplicate-dispatch prevention should be explicit

Recommended first hardening target:
- one delayed placeholder should dispatch at most once
- one release edge should not emit duplicate real requests for the same stored intent
- if the placeholder is already gone, release should become a safe no-op

Important rule:
- prefer explicit guard rails over relying on lucky event ordering
- this slice should make one-shot release behavior easy to prove in tests

#### 3. Placeholder cleanup and runtime-truth cleanup should converge on the same terminal truth

When a delayed placeholder is:
- replaced
- released
- suppressed
- invalidated by newer direct live/final work

the runtime should converge on one clear answer:
- no stale delayed placeholder remains
- no stale delayed active-queue card remains
- archive truth reflects only the last truthful scheduling outcome

Important rule:
- do not let app state and runtime-inspector state drift into contradictory stories

#### 4. Accepted-state preservation remains the last correctness bar

This slice should prove:
- delayed/released/suppressed scheduling churn does not clear accepted draft state by itself
- delayed/released/suppressed scheduling churn does not clear accepted authoritative state by itself
- released delayed draft still cannot overwrite newer accepted truth incorrectly because the existing dispatcher/store acceptance boundaries remain intact

Important rule:
- if a cleanup path touches `useSpaghettiStore.ts`, it must stay narrowly about preserving accepted/in-flight truth while stale scheduling artifacts clear

#### 5. The family handoff should stay honest about settle and authoritative follow-on work

By the end of this slice, `Worker-Vision-2` should close with:
- draft scheduling contract shipped
- delayed placeholder model shipped
- release-trigger path shipped
- delayed/suppressed runtime truth shipped
- remaining forward work explicitly handed to later lanes:
  - settle-owner completion if still incomplete
  - authoritative/final scheduling policy

Important rule:
- do not mark `settle` as fully solved if the repo still lacks one real settle owner
- the handoff note should preserve that honesty

### First Proof

- repeated same-graph draft interactions do not leave stale delayed placeholders behind
- delayed draft is never dispatched twice for one identity
- delayed/suppressed draft narration does not corrupt accepted build ownership
- the Worker family can move forward to authoritative scheduling without reopening draft-policy basics
- repeated delayed replacement does not duplicate queue or archive runtime truth
- suppressed-after-delayed cleanup leaves one truthful terminal scheduling state

### Expected File Targets

Primary implementation files:
- `src/app/store/useAppStore.ts`
- `src/app/bootstrapBuildWiring.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`

Likely supporting files:
- `src/app/store/useAppStore.test.ts`
- `src/app/bootstrapBuildWiring.test.ts`
- `src/app/buildDispatcher.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
  - only if close-out hardening touches accepted runtime cleanup directly

### Verification Bar

Required focused proof:
- repeated release edges do not double-dispatch the same delayed placeholder
- replacing delayed draft repeatedly leaves only one active delayed runtime entry and one truthful archive trail
- suppressing a graph after delayed draft cleanup removes stale waiting truth and archives only the correct terminal scheduling outcome
- accepted build bundles remain stable through repeated delayed/released/suppressed scheduling churn
- the family handoff notes describe `settle` and authoritative follow-on work honestly

Current status:
- shipped in focused store and runtime tests
- repeated release edges proved one-shot in `src/app/store/useAppStore.test.ts`
- suppressed-after-delayed cleanup and per-graph scheduling-truth convergence proved in `src/app/bootstrapBuildWiring.test.ts`
- accepted draft plus authoritative geometry preservation through scheduling-only churn proved in `src/app/store/useAppStore.test.ts`

### Implementation Spec

Recommended reading order:
1. `src/app/store/useAppStore.ts`
2. `src/app/store/useAppStore.test.ts`
3. `src/app/bootstrapBuildWiring.ts`
4. `src/app/bootstrapBuildWiring.test.ts`
5. `src/app/store/runtimeInspectorTaskStore.ts`
6. `src/app/spaghetti/store/useSpaghettiStore.ts`
7. `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker-Vision-2 - Draft Preview Scheduling And Settle Rules.md`

Recommended execution order:
1. identify any remaining duplicate-release or stale-placeholder edge paths in `useAppStore.ts`
2. harden runtime scheduling-event publication so repeated churn does not duplicate delayed/replaced/released archive truth
3. only if needed, add one narrow cleanup seam between scheduling cleanup and runtime-inspector state cleanup
4. verify accepted draft/authoritative state does not move during scheduling-only churn
5. update this phase doc to close `Worker-Vision-2` and hand forward into the next family lane honestly

Recommended implementation-grade scenarios:
- `release-delayed preview replaces older delayed placeholder before release`
- `repeated endInteraction does not dispatch twice`
- `suppressed preview after delayed wait removes stale waiting truth`
- `released delayed preview still cannot replace newer accepted state incorrectly`
- `repeated delayed replacement does not duplicate queue or archive truth`

### Verification Bar

Required implementation-grade scenarios:
- `cheap preview stays live`
- `release-delayed preview replaces older delayed placeholder before release`
- `settle-delayed preview replaces older delayed placeholder before settle dispatch`
- `suppressed preview records runtime truth without fake worker lifecycle`
- `released delayed preview still cannot replace newer accepted state incorrectly`
- `repeated delayed replacement does not duplicate queue or archive truth`

### Family Handoff

`Worker-Vision-2` is now closed for the first honest draft-policy lane:
- request-time draft policy is explicit
- delayed latest-intent placeholder ownership is explicit
- release-triggered delayed dispatch is explicit
- delayed, replaced, released, and suppressed runtime truth is explicit
- repeated scheduling churn is hardened enough that later work does not need to reopen draft-policy basics

Forward work remains outside this family:
- `settle` still does not have one real owner-trigger path and should remain explicitly partial until later code makes that owner real
- authoritative/final scheduling policy still belongs to the later Worker family lane rather than being implied complete here
