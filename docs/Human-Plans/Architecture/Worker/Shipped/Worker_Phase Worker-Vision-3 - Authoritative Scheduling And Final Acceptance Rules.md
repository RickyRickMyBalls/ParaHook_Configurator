# Worker Phase Worker-Vision-3 - Authoritative Scheduling And Final Acceptance Rules

## Doc Header

### Doc History
23. 2026-04-10 15:40: Added `Worker-Vision-3 Phase 10 - UI-Only Graph Revision Versus Geometry Build Revision Split` as the next standalone follow-on after Phase 9 so the Worker family now explicitly records the need to keep persisted graph layout truth such as node position while preventing those UI-only graph edits from riding the same revision/build-trigger lane that currently wakes geometry compile and worker scheduling
22. 2026-04-10 11:44: Added `Worker-Vision-3 Phase 9 - Held Authoritative Preview Presentation` as the next standalone follow-on after the shipped Phase 8 ladder so the Worker family now explicitly records the planned `50% -> 75% -> 100%` presentation refinement for authoritative-ready-held preview without widening Browser build policy into separate mesh-versus-final controls
21. 2026-04-10 09:34: Reworked the standalone `Worker-Vision-3 Phase 8` follow-on so the split ladder now starts with `Phase 8.1 - Draft Worker Versus Authoritative Worker Split`, then continues through `8.2` selector/store relevance gating, `8.3` layered `Auto` presentation, and `8.4` strict `Draft` plus `Final` hardening after code review confirmed the live repo still uses one shared worker that serializes draft and authoritative follow-through inside the same execution seam
20. 2026-04-10 09:26: Added the standalone follow-on `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker-Vision-3 Phase 8 - Viewport Result Layering And Relevance Presentation.md` so `Worker-Vision-3 Phase 8` can now execute as explicit `8.1`, `8.2`, and `8.3` slices for selector/store relevance gating, layered `Auto` presentation, and strict `Draft` plus `Final` hardening instead of remaining one larger mixed implementation pass
19. 2026-04-10 09:21: Reworked `Worker-Vision-3 Phase 8` into an implementation-ready shared viewport-result presentation slice after review of the post-Phase-7 behavior clarified the next needed honesty rule is not `Auto`-only ghosting: `Auto / Draft / Final` now need explicit display contracts around solid retained authoritative truth, translucent live draft overlay, strict current-revision relevance checks before any final swap, and the rule that only `Auto` mixes lanes while `Draft` stays pure and `Final` stays strict
18. 2026-04-10 09:03: Added an implementation-prep bug read for `Worker-Vision-3 Phase 7 - Auto Draft Visibility And Final Swap Cleanup` after code review of the live `Auto` path showed the remaining regression is not just request-time bias: draft acceptance can advance the shared accepted revision while preserving older authoritative geometry, which then lets `Auto` keep showing stale B-rep/final truth and skip the newer authoritative follow-through because freshness is still checked by non-null authoritative presence instead of authoritative-lane revision truth
17. 2026-04-10 08:42: Tightened `Worker-Vision-3 Phase 7 - Auto Draft Visibility And Final Swap Cleanup` into a more implementation-ready spec by naming the remaining critical ambiguity in the live app seam: `Auto` currently resolves to one request-time geometry target, but the intended behavior needs responsive draft follow-through plus background authoritative pursuit for the same graph revision, so this phase now explicitly locks the companion-request direction, latest-intent expectations, and proof bar around that mixed-lane behavior
16. 2026-04-10 08:40: Added `Worker-Vision-3 Phase 8 - Auto Stale Final Ghost Transparency` after review of the post-Phase-6 and planned-Phase-7 `Auto` behavior clarified one further viewer honesty need: when a previously accepted final result becomes old against the current graph revision, `Auto` should be able to keep that older final visible as a clearly stale translucent ghost while live draft remains responsive and the newer authoritative result is still pending
15. 2026-04-10 08:36: Marked `Worker-Vision-3 Phase 6 - Display Preference Versus Build Policy Cleanup` shipped after Browser timing became the sole owner of automatic draft-versus-authoritative follow-through in `useAppStore.ts`, viewport mode switches into `Final` or `Auto` began requesting needed authoritative work through that app-owned seam without rewriting policy, Browser `off` remained true worker suppression, stale final geometry stopped surviving disconnected-current revisions, and the family handoff now moves forward to `Phase 7 - Auto Draft Visibility And Final Swap Cleanup`
14. 2026-04-10 08:14: Tightened `Worker-Vision-3 Phase 6 - Display Preference Versus Build Policy Cleanup` so Browser policy now reads explicitly as `live / release / manual / off`, with `off` clarified as a real worker execution-suppression gate for scoped objects and graphs rather than a mere visibility toggle, while `Final` remains an honest final-only display preference that cannot silently wake suppressed work
13. 2026-04-10 07:47: Tightened `Worker-Vision-3 Phase 6 - Display Preference Versus Build Policy Cleanup` into an implementation-ready next slice by grounding it in the live `useAppStore.ts` Browser-policy and request-dispatch seams, the current `useWorkspaceStore.ts` viewport-mode setter that does not itself request builds, the `selectViewportResultState.ts` final-only read contract, and the observed regression read that manual simple-extrude build still works while automatic final convergence remains gated by policy ownership rather than lost kernel capability
12. 2026-04-10 07:30: Added `Worker-Vision-3 Phase 6 - Display Preference Versus Build Policy Cleanup` after review of the live viewport and Browser behavior showed one remaining ownership mismatch: Browser `live / release / off` is still acting like a global build gate while viewport `Auto / Draft / Final` still influences execution too directly, so this new cleanup slice now explicitly separates build timing from display preference and locks the authoritative auto-build follow-through needed for `Final` to stay honest without redefining manual build escape hatches
11. 2026-04-10 07:11: Marked `Worker-Vision-3 Phase 5 - Hardening And Family Handoff` shipped after ordinary viewport-facing authoritative scheduling in `useAppStore.ts` adopted `release` as the default policy instead of `settle`, repeated same-interaction authoritative churn was hardened so release dispatch converges on the latest surviving graph revision rather than queueing intermediate final jobs, and this `Worker-Vision-3` ladder now closes on one honest release-first authoritative base
10. 2026-04-10 06:58: Marked `Worker-Vision-3 Phase 4 - Accepted Draft Versus Authoritative Promotion Rules` shipped after the accepted-state promotion rules became explicit inside `useSpaghettiStore.ts`, authoritative-only acceptance stopped clearing newer draft truth, draft-only acceptance preserved prior accepted authoritative truth, and stale authoritative arrivals were hardened so they cannot roll accepted state backward, then tightened `Phase 5 - Hardening And Family Handoff` around release-first authoritative latest-intent replacement under repeated churn
9. 2026-04-10 06:46: Reworked this Worker-Vision-3 planning surface after review clarified that Browser `live / release / off` policy belongs to the draft-preview lane only, normal viewport-facing authoritative/final work should default to `release` rather than `settle`, and `explicit` should remain the narrow manual/export trigger path before later hardening continues
8. 2026-04-09 23:27: Marked `Worker-Vision-3 Phase 3 - Release, Settle, And Explicit Authoritative Trigger Flow` shipped after explicit/manual authoritative requests began crossing from waiting into real worker dispatch through one shared app-owned seam, release-triggered authoritative waiting work began dispatching once at interaction end, and the family handoff now moves forward to `Phase 4 - Accepted Draft Versus Authoritative Promotion Rules`
7. 2026-04-09 23:27: Tightened `Worker-Vision-3 Phase 4 - Accepted Draft Versus Authoritative Promotion Rules` into an implementation-ready next slice by grounding it in the now-shipped authoritative waiting plus trigger-flow seams in `useAppStore.ts`, the existing authoritative-versus-draft accepted result storage already owned by `useSpaghettiStore.ts`, the current stale-drop and acceptance boundary inside `acceptGraphBuildResult(...)`, and one narrow direction where authoritative promotion becomes explicit without redefining scheduling ownership
6. 2026-04-09 23:20: Marked `Worker-Vision-3 Phase 2 - Authoritative Waiting State And Latest-Intent Replacement` shipped after `useAppStore.ts` gained the graph-local `delayedAuthoritativeBuildByGraphDocumentId` latest-intent seam, non-live authoritative requests began staging honest pre-dispatch waiting state instead of dispatching worker work immediately, export preparation learned to report pending authoritative waiting without fake build ids, and the family handoff now moves forward to `Phase 3 - Release, Settle, And Explicit Authoritative Trigger Flow`
5. 2026-04-09 23:20: Tightened `Worker-Vision-3 Phase 3 - Release, Settle, And Explicit Authoritative Trigger Flow` into an implementation-ready next slice by grounding it in the now-shipped authoritative waiting placeholder seam in `useAppStore.ts`, the existing real-dispatch boundary in `buildDispatcher.requestGraphBuild(...)` plus `useSpaghettiStore.ts -> stageGraphBuildRequest(...)`, the current export preparation caller pressure, and one narrow direction where waiting authoritative latest intent can release or dispatch honestly without yet redefining accepted-state promotion rules
4. 2026-04-09 23:08: Tightened `Worker-Vision-3 Phase 2 - Authoritative Waiting State And Latest-Intent Replacement` into an implementation-ready next slice by grounding it in the now-shipped `authoritativePolicy` request-time seam, the current absence of any authoritative delayed-placeholder owner in `useAppStore.ts`, the existing `inFlightExecutionIntent` plus accepted draft/authoritative state already preserved in `useSpaghettiStore.ts`, and one narrow direction where non-live authoritative work gains a graph-local latest-intent waiting model without yet adding trigger flow or promotion behavior
3. 2026-04-09 22:45: Marked `Worker-Vision-3 Phase 1 - Authoritative Policy Contract And Request-Time Ownership` shipped after the shared build intent adopted explicit `authoritativePolicy` timing vocabulary, `useAppStore.ts` began resolving authoritative request-time policy separately from draft policy, export preparation started routing authoritative requests through that same contract, and the family handoff now moves forward to `Phase 2 - Authoritative Waiting State And Latest-Intent Replacement`
2. 2026-04-09 22:38: Tightened `Worker-Vision-3 Phase 1 - Authoritative Policy Contract And Request-Time Ownership` into an implementation-ready next slice by grounding it in the live `useAppStore.ts -> resolveGraphBuildExecutionIntent(...)` seam, the current `geometryTarget = authoritative` export-preparation path, the existing accepted draft plus authoritative graph-runtime state in `useSpaghettiStore.ts`, and one first narrow direction where authoritative timing policy becomes explicit at request time without yet adding delayed authoritative waiting or promotion behavior
1. 2026-04-09 21:10: Created this standalone future Worker phase doc so the next Worker Vision follow-on now has an implementation-ready planning surface for conservative authoritative scheduling, draft-versus-authoritative acceptance truth, and the first explicit handoff from the now-shipped draft-policy lane into later final-result ownership

### Purpose

This doc defines the third implementation-ready phase under `Worker Vision`.

Use it to answer:
- how ParaHook should schedule authoritative work after draft scheduling is already explicit
- when authoritative work should run on release or only on explicit request, and whether a later settle lane should exist at all
- how draft and authoritative accepted truth should coexist without contradictory ownership
- what proof is needed before viewport `Final` can read as an honest preference instead of a misleading promise

### Why This Phase Exists

Today ParaHook already has:
- explicit same-graph latest-intent supersession
- explicit draft preview scheduling policy
- explicit delayed, replaced, released, and suppressed draft runtime truth
- retained accepted draft and authoritative geometry seams in graph runtime state

That is enough to make draft behavior intentional.

It is not enough to make authoritative behavior intentional.

Current reality:
- authoritative-capable retained geometry state exists
- viewport `Final` direction exists
- request-time execution intent can already distinguish draft versus authoritative geometry targets
- the repo still lacks one explicit conservative scheduling policy for when authoritative work should actually run
- accepted draft versus accepted authoritative replacement rules are still more implied by local seams than locked as one Worker-family policy

This phase exists to close that authoritative-policy gap without widening yet into export reuse or a broad runtime-publication redesign.

The goal is:
- keep the now-shipped draft-policy lane intact
- make authoritative scheduling explicit and conservative
- lock one honest acceptance model between accepted draft truth and accepted authoritative truth

### Scope

This phase covers:
- authoritative `release` versus explicit/manual policy, with `settle` treated only as a possible later lane if a real owner emerges
- request-time authoritative scheduling selection
- accepted-state promotion and replacement rules between draft and authoritative result classes
- proof that authoritative scheduling does not corrupt latest-intent safety or accepted-state stability

This phase does not cover:
- export reuse
- broad Browser or viewport-runtime UI redesign
- a general worker-pool or priority-queue scheduler
- full shared runtime publication for every later read surface

## Doc Body

## [ ] Worker-Vision-3 - Authoritative Scheduling And Final Acceptance Rules

### Header

Purpose:
- make authoritative scheduling intentional, conservative, and explainable instead of behaving like a costlier copy of the draft path

Owns:
- authoritative `live` versus `release` versus `settle` versus explicit/manual policy
- accepted draft-versus-authoritative promotion rules
- first explicit truth for when authoritative work should wait even while draft remains responsive

Does not own:
- export-facing reuse
- broad Browser or viewport-runtime UX redesign
- a general scheduler queue architecture

### Current Constraints

This phase starts from the shipped groundwork in:
- `docs/Human-Plans/Architecture/Worker/Worker-Vision.md`
- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker-Vision-2 - Draft Preview Scheduling And Settle Rules.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Future/Model-Viewport_Phase Model-Viewport-1 - Geometry Execution Reset, Preview Policy, And Authoritative Build Path.md`

Locked starting constraints:
- same-graph latest-intent supersession is already explicit and shipped
- draft scheduling policy is already explicit and shipped
- delayed draft runtime truth is already explicit and shipped
- retained accepted draft and authoritative geometry seams already exist in graph runtime state
- this phase should not pretend export reuse is already solved

Current live seams this phase should read against:
- `src/app/store/useAppStore.ts`
- `src/app/buildDispatcher.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/shared/buildTypes.ts`
- `src/shared/geometryResult.ts`
- `src/app/store/runtimeInspectorTaskStore.ts`
- current viewport-mode and Browser/build-policy seams that influence execution intent

Current code-backed read:
- `src/app/store/useAppStore.ts`
  - already resolves build execution intent at request time
  - already stages delayed draft placeholders and release-trigger dispatch
  - is the strongest current owner seam for authoritative scheduling selection too
- `src/shared/buildTypes.ts`
  - already carries explicit build intent fields including geometry target and draft policy
  - may still need one clearer authoritative scheduling read if final timing words would otherwise stay implicit
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - already preserves accepted build bundle, accepted draft geometry result, and accepted authoritative geometry result
  - is the strongest current acceptance boundary and should stay the owner of accepted-state truth
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Future/Model-Viewport_Phase Model-Viewport-1 - Geometry Execution Reset, Preview Policy, And Authoritative Build Path.md`
  - already locks the long-range viewport direction around explicit draft-versus-authoritative result classes and `Auto / Draft / Final` result preference
  - means `Worker-Vision-3` should treat viewport `Final` as an input to authoritative scheduling policy, not as a second place to redefine viewport behavior

Important current-reality rule:
- this phase should not make authoritative work default to live execution just because draft policy is now explicit
- Browser `live / release / off` should stay draft-preview-only policy
- the first honest authoritative target is `release` by default for normal viewport-facing final work, with `explicit` reserved for manual/export callers

### Locked Direction

#### 1. Authoritative scheduling must become explicit before it becomes smarter

The first authoritative cut should prefer explicit readable policy over hidden heuristics.

Recommended first policy vocabulary:
- `release`
- `explicit`

Optional later allowance:
- `settle`
  - only if one real settle owner is later named and proven useful without weakening the clearer release-first default

Important rule:
- do not let viewport `Final` silently mean `authoritative always runs live`
- do not let Browser `live / release / off` widen into hidden authoritative timing policy
- the first win is naming the timing honestly and routing authoritative requests through it consistently

#### 2. Draft responsiveness and authoritative conservatism should coexist, not compete

The runtime should allow:
- draft preview to remain responsive when that is the current best user-facing result
- authoritative work to dispatch on release by default for viewport-facing final truth without chasing every intermediate edit value live

Important rule:
- this phase should not force draft and authoritative work into the same timing lane
- draft may stay responsive under Browser preview policy while authoritative follows its own release-first lane

#### 3. Latest-intent supersession remains the safety model for authoritative work too

Authoritative scheduling does not replace `Worker-Vision-1` or `Worker-Vision-2`.

The runtime should still assume:
- newer same-graph intent supersedes older intent
- waiting authoritative work may be replaced before it runs
- stale authoritative results are still rejected at the boundary if they arrive too late

Recommended first ownership:
- authoritative waiting work should stay latest-intent-only per graph target
- this phase should still prefer single-slot replacement over a true multi-request queue

#### 4. Accepted draft and accepted authoritative truth must stay separate and explicit

This phase should lock one honest shared rule:
- accepted draft truth may remain visible while authoritative work is still waiting or in flight
- accepted authoritative truth should replace accepted draft only when a newer valid authoritative result is actually accepted
- scheduling-only churn must not clear accepted draft or accepted authoritative state by itself

Important rule:
- waiting or suppressed authoritative work is scheduling narration, not accepted-result mutation
- accepted-state changes should still happen only at the existing result-acceptance boundary

#### 5. Viewport `Final` should read as a truthful preference, not as a promise that every drag step ran final work

Recommended first interpretation:
- viewport `Final` means the runtime should prefer authoritative truth when it is available
- it does not require the system to run a full authoritative rebuild for every intermediate edit value

Important rule:
- this phase should preserve honesty about pending or waiting authoritative work instead of overselling immediate final execution

### Runtime Truth Direction

This phase should add the first explicit distinction between:
- authoritative request scheduled to wait
- authoritative request released to execution
- authoritative request replaced before run
- accepted draft still visible while authoritative is pending
- accepted authoritative promoted over draft

Recommended first shared runtime facts:
- authoritative policy evaluated
- authoritative delayed
- authoritative delay reason:
  - `release`
  - `explicit`
- later optional:
  - `settle`
- delayed authoritative replaced by newer latest intent
- authoritative accepted over prior draft

Important rule:
- do not widen into a full runtime-publication redesign yet
- this phase only needs enough truth to make authoritative timing and promotion honest

### Implementation Target

`Worker-Vision-3` should make one architecture shift real:

- authoritative work no longer behaves like an implicit more-expensive draft request
- one explicit runtime policy decides whether authoritative waits for release or waits for explicit/manual request
- accepted draft and accepted authoritative state remain separately preserved until authoritative promotion is truly earned
- viewport `Final` can read as a truthful preference because waiting authoritative work is now intentional instead of accidental

The minimum meaningful behavior change should be:
- a final-authoritative interaction can choose a non-live authoritative path intentionally, preserve the currently accepted draft truth while authoritative waits for release, and still reserve `explicit` for manual/export callers

### First Boundaries

Keep inside this phase:
- authoritative policy vocabulary
- one request-time authoritative scheduling decision seam
- one latest-intent waiting model for authoritative work if needed
- accepted draft-versus-authoritative promotion rules
- proof that authoritative scheduling churn does not corrupt accepted truth

Keep outside this phase:
- export reuse and export ownership
- broad Browser/runtime-inspector redesign
- general scheduler queues or worker-pool priorities

### Suggested Ownership Split

#### App Owns

- viewport mode or command context that influences authoritative policy
- passing the chosen authoritative scheduling hint into the runtime
- final acceptance of worker results through the existing acceptance boundary
- keeping Browser preview policy scoped to the draft lane instead of treating it as the hidden owner of authoritative timing

Recommended first concrete owner:
- `src/app/store/useAppStore.ts`

#### Dispatcher Or Runtime Coordinator Owns

- transport and worker-runtime handoff for real authoritative execution
- narrow release-or-explicit dispatch of any delayed authoritative latest intent

Important rule:
- do not push high-level authoritative policy selection down into `BuildDispatcher`
- that would make the transport layer a hidden product-policy owner

#### Store Acceptance Boundary Owns

- accepted draft state
- accepted authoritative state
- replacement and stale-drop rules when authoritative finally lands

Recommended first concrete owner:
- `src/app/spaghetti/store/useSpaghettiStore.ts`

#### Runtime Read Surfaces Own

- presenting whether authoritative is pending, running, or accepted
- explaining draft-versus-authoritative truth without inventing policy

### Verification Bar

This phase is only done if it proves both:
- authoritative scheduling became intentional and visible
- accepted draft-versus-authoritative truth stayed honest

Required focused proof:
- authoritative requests can be marked through one explicit policy seam such as `release` or `explicit`
- continuous edits do not launch full authoritative work for every intermediate value by default
- accepted draft state remains stable while authoritative work is only waiting or being replaced before run
- accepted authoritative state promotes only when a newer valid authoritative result is truly accepted
- viewport `Final` can be described honestly without claiming every drag step ran authoritative work

Required focused proof surfaces:
- `src/app/store/useAppStore.test.ts`
  - prove request-time authoritative policy selection uses the intended viewport-mode and Browser/build-policy inputs
  - prove repeated authoritative latest-intent replacement stays single-slot and graph-local
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
  - prove accepted draft and accepted authoritative state remain stable through scheduling-only churn
  - prove accepted authoritative promotion does not clear newer accepted truth incorrectly
- `src/app/buildDispatcher.test.ts`
  - only if one narrow authoritative request-intent or stale-drop seam widens
- runtime-inspector or nearby runtime tests
  - only if authoritative waiting or promotion truth becomes visible there in this same slice

### Expected File Targets

Primary implementation files:
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/shared/buildTypes.ts`

Likely supporting files:
- `src/app/store/useAppStore.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/buildDispatcher.test.ts`
- `src/app/bootstrapBuildWiring.ts`
  - only if a narrow authoritative scheduling runtime publication seam is needed

## [x] Worker-Vision-3 Phase 1 - Authoritative Policy Contract And Request-Time Ownership

### Purpose

Lock one explicit authoritative scheduling policy seam at request time so final/authoritative work no longer inherits timing accidentally from draft behavior.

### Owns

- authoritative timing vocabulary
- request-time authoritative policy selection
- the first explicit input read from viewport `Final` and related Browser/build-policy context

### Does Not Own

- delayed authoritative placeholder mechanics
- authoritative acceptance or promotion logic
- broad runtime publication

### Implementation Target

After this slice:
- authoritative scheduling reason is explicit at request time
- `useAppStore.ts` owns the first authoritative policy selection seam
- draft timing and authoritative timing stay readable as separate truths

### Current Strongest Read

The live code now provides these strongest seams:
- `src/app/store/useAppStore.ts`
  - already owns:
    - `resolveGraphBuildExecutionIntent(...)`
    - `resolveGraphBuildDraftPolicy(...)`
    - request-time `geometryTarget` selection between `draft_preview` and `authoritative`
  - is therefore the strongest current owner for adding one explicit authoritative timing read beside the shipped draft-policy seam
- `src/app/store/useAppStore.ts -> prepareGraphDocumentExport(...)`
  - already requests authoritative work through `requestGraphDocumentBuild(graphDocumentId, { geometryTargetOverride: 'authoritative' })`
  - is the clearest current proof that authoritative-targeted requests already exist, but their timing policy is still implicit rather than named
- `src/shared/buildTypes.ts`
  - already carries explicit build intent fields such as:
    - `geometryTarget`
    - `draftPolicy`
    - `updatePolicy`
  - does not yet expose one parallel explicit authoritative timing field or equivalent authoritative-policy read
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - already preserves:
    - `acceptedDraftGeometryResult`
    - `acceptedAuthoritativeGeometryResult`
    - `inFlightExecutionIntent`
  - means accepted draft-versus-authoritative state already exists and should not be re-owned by this first contract slice

Important current limitation:
- authoritative requests can already be issued, but the runtime still lacks one explicit request-time answer for whether authoritative should:
  - run now
  - wait for release
  - wait for settle
  - wait for explicit/manual trigger
- that means viewport `Final`, export preparation, and later final-oriented commands still risk inheriting timing implicitly from local call paths rather than from one shared authoritative policy seam

### Locked Direction

#### 1. Phase 1 should only lock the authoritative policy contract, not authoritative waiting behavior

This slice should stop at naming and selecting policy.

Important rule:
- do not add delayed authoritative placeholders yet
- do not add release-trigger or settle-trigger dispatch behavior yet
- those later mechanics belong to `Phase 2` and `Phase 3`

#### 2. Authoritative timing must stay separate from draft timing

Recommended first contract direction:
- keep `geometryTarget` as the answer to:
  - `draft_preview` versus `authoritative`
- keep shipped `draftPolicy` focused on draft timing only
- add one separate explicit authoritative-policy read for authoritative timing, likely attached to request-time build intent

Recommended first authoritative policy vocabulary:
- `release`
- `settle`
- `explicit`

Conservative rule:
- do not add `live` as the default first authoritative policy
- only later widen toward `live` if one concrete cheap authoritative path proves that safe and honest

#### 3. Viewport `Final` should influence authoritative policy without becoming the policy owner

Recommended first interpretation:
- viewport `Final` is an input that can prefer authoritative execution
- `useAppStore.ts` remains the owner that translates that preference into explicit authoritative timing policy

Important rule:
- do not redefine viewport behavior here
- this slice should only lock the worker-side request-time contract that reads viewport/build-policy context honestly

#### 4. Export preparation is a contract pressure-test, not the policy owner

Current export preparation already proves there is at least one authoritative caller.

Important rule:
- use `prepareGraphDocumentExport(...)` as proof that authoritative request-time policy must be explicit
- do not let export preparation become the hidden owner of authoritative timing semantics
- this slice should keep export-specific waiting or gating logic out of scope

### First Proof

- one explicit request-time authoritative policy seam exists
- authoritative-targeted requests no longer rely on hidden local timing assumptions
- viewport/build-policy context can influence authoritative timing through one shared `useAppStore.ts` seam
- current accepted draft and accepted authoritative state remain untouched by this contract-only slice

### Expected File Targets

Primary implementation files:
- `src/app/store/useAppStore.ts`
- `src/shared/buildTypes.ts`

Likely supporting files:
- `src/app/store/useAppStore.test.ts`
- `src/shared/buildTypes.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - only if a type-read or nearby selector needs a narrow contract alignment and not for scheduling behavior

### Verification Bar

Required focused proof:
- request-time execution intent can express authoritative timing explicitly
- authoritative policy selection uses intended viewport/build-policy inputs without overloading draft policy
- `geometryTarget = authoritative` callers such as export preparation route through the new shared authoritative policy seam
- accepted draft and accepted authoritative state remain unchanged by policy-only request-time selection

### Implementation Spec

Recommended reading order:
1. `src/app/store/useAppStore.ts`
2. `src/shared/buildTypes.ts`
3. `src/app/store/useAppStore.test.ts`
4. `src/shared/buildTypes.test.ts`
5. `src/app/spaghetti/store/useSpaghettiStore.ts`
6. `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Future/Model-Viewport_Phase Model-Viewport-1 - Geometry Execution Reset, Preview Policy, And Authoritative Build Path.md`

Recommended execution order:
1. identify the current authoritative-targeted request seams in `useAppStore.ts`
2. add one explicit authoritative timing policy contract beside the shipped draft-policy seam
3. route authoritative request-time selection through that new policy seam without adding waiting mechanics yet
4. keep export preparation and viewport `Final` as inputs to the new seam, not as separate owners
5. add focused tests proving authoritative policy selection and non-mutation of accepted state

Recommended implementation-grade scenarios:
- `authoritative-targeted request resolves explicit authoritative policy at request time`
- `viewport Final influences authoritative policy without changing geometryTarget ownership`
- `export preparation authoritative request uses shared authoritative policy seam`
- `authoritative policy selection does not mutate accepted draft or accepted authoritative state`

Current status:
- shipped in code
- shared build intent now carries explicit `authoritativePolicy` timing truth
- `useAppStore.ts` now resolves authoritative request-time policy separately from shipped draft policy
- authoritative-targeted export requests now use that same shared policy seam instead of inheriting timing implicitly
- accepted draft plus accepted authoritative state remain untouched by this contract-only slice

## [x] Worker-Vision-3 Phase 2 - Authoritative Waiting State And Latest-Intent Replacement

### Purpose

Add one honest latest-intent waiting model for non-live authoritative work so final scheduling can wait without pretending that waiting authoritative work already entered normal execution.

### Owns

- authoritative waiting placeholder ownership
- same-graph replacement-before-run rules
- one graph-local non-queue authoritative waiting model

### Does Not Own

- broad queue architecture
- authoritative promotion to accepted truth

### Implementation Target

After this slice:
- non-live authoritative work can wait intentionally
- newer same-graph authoritative intent replaces older waiting authoritative intent before run
- waiting authoritative work does not masquerade as real in-flight execution

### Current Strongest Read

The live code now provides these strongest seams:
- `src/app/store/useAppStore.ts`
  - already owns:
    - request-time `authoritativePolicy` selection
    - the shipped draft delayed-placeholder map `delayedDraftBuildByGraphDocumentId`
    - normal real dispatch through `requestGraphDocumentBuild(...)`
  - does not yet own any parallel waiting placeholder model for authoritative work
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - already preserves:
    - `inFlightExecutionIntent`
    - `acceptedDraftGeometryResult`
    - `acceptedAuthoritativeGeometryResult`
  - means there is already one honest distinction between real in-flight work and accepted result truth that authoritative waiting should not corrupt
- `src/app/store/useAppStore.ts -> prepareGraphDocumentExport(...)`
  - already proves one authoritative caller exists that may need non-live waiting later
  - should remain only a caller of shared authoritative scheduling, not the owner of waiting-state mechanics

Important current limitation:
- request-time authoritative policy is now explicit, but non-live authoritative requests still have only two practical outcomes:
  - dispatch immediately as normal real work
  - stay implicit in the caller until a later explicit trigger exists
- there is no single app-owned latest-intent placeholder owner for authoritative waiting yet
- that means Phase 1 made authoritative timing honest, but Phase 2 still has to make non-live authoritative waiting real

### Locked Direction

#### 1. Phase 2 should add waiting state only, not trigger flow

This slice should stop at storing and replacing waiting authoritative latest intent.

Important rule:
- do not add release-trigger dispatch behavior yet
- do not add settle-trigger dispatch behavior yet
- do not add explicit/manual trigger flow yet
- those mechanics belong to `Phase 3`

#### 2. Authoritative waiting should mirror the latest-intent safety model already used for delayed draft

Recommended first ownership:
- one graph-local authoritative waiting placeholder per graph target
- newer same-graph authoritative latest intent replaces older waiting authoritative latest intent before run
- waiting authoritative work should never grow into a queue in this slice

Important rule:
- prefer single-slot replacement over multi-request scheduling
- keep authoritative waiting graph-local and latest-intent-only

#### 3. Waiting authoritative work must remain clearly pre-dispatch truth

Recommended first boundary:
- waiting authoritative placeholders live in app-owned scheduling state
- real in-flight worker execution still starts only after later trigger flow dispatch
- `useSpaghettiStore.ts -> stageGraphBuildRequest(...)` remains reserved for actual dispatched work

Important rule:
- do not mint fake build request ids or fake build seq values for waiting authoritative placeholders
- do not let waiting authoritative state masquerade as worker-backed in-flight work

#### 4. Accepted draft and accepted authoritative state must remain untouched by waiting-only churn

This slice should preserve:
- accepted draft truth while authoritative latest intent is only waiting
- accepted authoritative truth while newer authoritative latest intent is only waiting
- existing in-flight execution truth when no new real dispatch happened yet

Important rule:
- waiting authoritative replacement is scheduling state only
- this slice should not move accepted-state ownership at all

### First Proof

- non-live authoritative requests can be staged as one explicit waiting latest-intent placeholder
- newer same-graph authoritative requests replace older waiting authoritative placeholders before run
- waiting authoritative state remains distinct from real in-flight execution
- accepted draft and accepted authoritative state remain unchanged while authoritative latest intent only waits

### Expected File Targets

Primary implementation files:
- `src/app/store/useAppStore.ts`

Likely supporting files:
- `src/app/store/useAppStore.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - only if one narrow nearby type/read alignment is needed and not for behavior ownership
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
  - only if close-out proof needs a direct accepted-state stability assertion here rather than through app-store tests

### Verification Bar

Required focused proof:
- authoritative requests with non-live policy can wait without real dispatch
- repeated same-graph authoritative waiting requests replace rather than queue
- waiting authoritative state stays graph-local
- accepted draft and accepted authoritative state do not move during waiting-only churn
- real in-flight execution state remains null or unchanged until later trigger flow exists

### Implementation Spec

Recommended reading order:
1. `src/app/store/useAppStore.ts`
2. `src/app/store/useAppStore.test.ts`
3. `src/app/spaghetti/store/useSpaghettiStore.ts`
4. `src/app/spaghetti/store/useSpaghettiStore.test.ts`
5. `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker-Vision-2 - Draft Preview Scheduling And Settle Rules.md`

Recommended execution order:
1. identify the current non-live authoritative request call paths that still dispatch immediately
2. add one app-owned authoritative waiting placeholder seam in `useAppStore.ts`
3. replace same-graph waiting authoritative latest intent instead of queuing it
4. keep accepted and in-flight state untouched while waiting remains pre-dispatch truth
5. add focused tests proving waiting, replacement, and accepted-state stability

Recommended implementation-grade scenarios:
- `authoritative release policy stages waiting latest intent without dispatch`
- `repeated same-graph authoritative waiting requests replace instead of queue`
- `waiting authoritative intent does not mutate accepted draft or accepted authoritative state`
- later optional:
  - `authoritative settle policy stays absent until one real owner exists`

Current status:
- shipped in code
- `useAppStore.ts` now owns `delayedAuthoritativeBuildByGraphDocumentId` as the graph-local latest-intent waiting seam for non-live authoritative work
- authoritative `release`, `settle`, and `explicit` request paths now stage honest pre-dispatch waiting state instead of issuing worker work immediately
- accepted draft plus accepted authoritative state remain untouched while authoritative latest intent only waits
- export preparation can now report pending authoritative waiting without inventing fake build request ids or build seq values
- planning-direction correction after review:
  - normal viewport-facing authoritative/final work should now converge on `release` as the default
  - Browser `live / release / off` remains draft-preview-only policy
  - `explicit` remains the narrow manual/export path
  - `settle` is no longer the preferred default follow-on for ordinary final viewport work

## [x] Worker-Vision-3 Phase 3 - Release, Settle, And Explicit Authoritative Trigger Flow

### Purpose

Define the first honest triggers that move waiting authoritative latest intent into real execution.

### Owns

- release-triggered authoritative dispatch if selected by policy
- explicit/manual authoritative dispatch path
- documenting `settle` only as an optional later lane if one real owner is ever added

### Does Not Own

- accepted authoritative promotion rules
- export handoff

### Implementation Target

After this slice:
- waiting authoritative work can release into the normal dispatcher path intentionally
- explicit/manual final requests have one real trigger owner
- any remaining settle language stays explicitly partial if the repo still lacks a concrete settle owner

### Current Strongest Read

The live code now provides these strongest seams:
- `src/app/store/useAppStore.ts`
  - already owns:
    - request-time `authoritativePolicy` selection
    - the shipped authoritative waiting map `delayedAuthoritativeBuildByGraphDocumentId`
    - the existing draft release-trigger handoff pattern through `endBrowserBuildInteraction(...)`
    - normal real dispatch through `buildDispatcher.requestGraphBuild(...)`
  - is therefore the strongest current owner for the first authoritative trigger flow too
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - already owns:
    - `stageGraphBuildRequest(...)`
    - real compile-build in-flight truth
    - accepted draft and accepted authoritative result seams
  - means Phase 3 should promote waiting authoritative work into this existing real-dispatch boundary instead of creating a parallel in-flight owner
- `src/app/store/useAppStore.ts -> prepareGraphDocumentExport(...)`
  - already proves one explicit/manual authoritative caller now exists
  - now reports pending authoritative waiting honestly
  - should become a caller of shared explicit authoritative trigger flow rather than a second dispatch owner

Important current limitation:
- non-live authoritative latest intent can now wait honestly, but there is still no real trigger that moves that waiting state into worker execution
- `release`, `settle`, and `explicit` currently all stop at waiting state
- export preparation can now report pending authoritative waiting, but it still cannot promote that waiting work into a real build without the trigger flow this phase owns

### Locked Direction

#### 1. Phase 3 should turn waiting authoritative latest intent into real work only through explicit triggers

This slice should add trigger owners, not a broader scheduling redesign.

Important rule:
- do not widen into accepted-state promotion rules yet
- do not widen into export reuse or authoritative result publication redesign
- keep the trigger flow narrow and routed into the existing real dispatcher boundary

#### 2. Release-triggered authoritative dispatch should reuse the same graph-local latest-intent waiting owner

Recommended first direction:
- if authoritative latest intent is waiting with `authoritativePolicy = release`
- and the owning graph reaches the existing release trigger owner
- then that latest waiting intent should dispatch once through the normal build path

Important rule:
- release should dispatch only the latest waiting authoritative intent for that graph
- dispatching one graph must not flush another graph's waiting authoritative placeholder

#### 3. Explicit/manual authoritative dispatch needs one honest trigger owner now

Recommended first direction:
- explicit/manual authoritative callers should be able to stage waiting intent and then move it into real execution through one shared trigger seam owned by `useAppStore.ts`
- the first explicit trigger may be immediate within the same command path if that path stays honest about crossing from waiting state into real dispatch

Important rule:
- do not let export preparation or another caller mint its own custom dispatch path
- Phase 3 should centralize explicit authoritative trigger ownership rather than scattering it across callers

#### 4. Settle should stay explicit about its partialness if there is still no concrete settle owner

Recommended first direction:
- only keep or add settle-triggered authoritative dispatch if one real settle owner can be named and implemented in a later slice
- otherwise keep normal viewport-facing authoritative work on `release` and reserve `explicit` for manual/export triggers

Important rule:
- it is acceptable for the family to close `release` plus `explicit` while leaving `settle` absent or explicitly deferred until a trustworthy settle boundary exists

#### 5. Real dispatch must clear waiting state before worker-backed in-flight truth begins

Recommended first boundary:
- once waiting authoritative work truly dispatches
- its waiting placeholder should be cleared from app-owned scheduling state
- then the normal `buildDispatcher.requestGraphBuild(...)` plus `useSpaghettiStore.ts -> stageGraphBuildRequest(...)` path should own the rest

Important rule:
- do not leave delayed authoritative placeholder state active alongside the same real in-flight request
- one authoritative request should not read as both waiting and in-flight at once

### First Proof

- release-triggered authoritative waiting work can dispatch once into the normal worker path
- explicit/manual authoritative waiting work can dispatch through one shared trigger seam
- graph-local waiting placeholders clear when real authoritative dispatch begins
- dispatching one graph does not flush or dispatch other graphs' waiting authoritative latest intent
- real in-flight execution state appears only after trigger flow dispatch, not while work is merely waiting
- accepted draft and accepted authoritative state remain governed by later acceptance rules rather than trigger flow itself

### Expected File Targets

Primary implementation files:
- `src/app/store/useAppStore.ts`

Likely supporting files:
- `src/app/store/useAppStore.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - only if one narrow stage-or-read alignment is needed and not for ownership transfer
- `src/app/buildDispatcher.test.ts`
  - only if one request-shape seam or stale-drop read widens during dispatch hardening

### Verification Bar

Required focused proof:
- release-authoritative placeholders dispatch once when their trigger fires
- explicit/manual authoritative callers can move waiting latest intent into real worker dispatch through one shared seam
- dispatched authoritative work clears the matching waiting placeholder before real in-flight state appears
- graph-local trigger flow does not dispatch or clear another graph's waiting authoritative latest intent
- accepted draft and accepted authoritative state do not mutate at trigger time alone
- settle remains either honestly implemented with one real owner or explicitly still waiting if that owner is not present in this slice

### Implementation Spec

Recommended reading order:
1. `src/app/store/useAppStore.ts`
2. `src/app/store/useAppStore.test.ts`
3. `src/app/spaghetti/store/useSpaghettiStore.ts`
4. `src/app/buildDispatcher.ts`
5. `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker-Vision-2 - Draft Preview Scheduling And Settle Rules.md`

Recommended execution order:
1. identify the current release-edge and explicit/manual authoritative caller paths that can now see waiting placeholders
2. add one shared authoritative trigger seam in `useAppStore.ts` that dispatches the current graph's waiting latest intent into the normal build path
3. wire release-trigger dispatch for authoritative waiting work through the existing graph-local release owner when policy is `release`
4. wire explicit/manual authoritative callers through that same shared trigger seam instead of inventing custom dispatch logic
5. keep settle honest by either implementing one concrete owner in-slice or leaving it explicitly waiting
6. add focused tests proving trigger flow, graph-local isolation, waiting-state clearing, and non-mutation of accepted state

Recommended implementation-grade scenarios:
- `release authoritative placeholder dispatches once on release trigger`
- `explicit authoritative waiting request dispatches through one shared trigger seam`
- `dispatch clears waiting authoritative placeholder before in-flight state begins`
- `releasing one graph does not dispatch another graph's waiting authoritative intent`
- `normal viewport authoritative work prefers release rather than settle by default`

Current status:
- shipped in code
- explicit/manual authoritative requests now cross into real worker dispatch through one shared app-owned trigger seam instead of remaining indefinitely in waiting state
- `release` authoritative waiting work now dispatches once when interaction release fires, and the matching waiting placeholder clears before real in-flight execution begins
- graph-local trigger flow now preserves per-graph latest-intent isolation instead of flushing other graphs' waiting authoritative placeholders
- planning-direction correction after review:
  - ordinary viewport-facing authoritative/final work should now standardize on this shipped `release` trigger path
  - `explicit` remains the manual/export exception path
  - `settle` should not be the default next hardening target for ordinary viewport final work

## [x] Worker-Vision-3 Phase 4 - Accepted Draft Versus Authoritative Promotion Rules

### Purpose

Lock the first explicit accepted-state rules for when authoritative truth replaces draft truth and when draft should remain visible while final work is still pending.

### Owns

- accepted draft preservation while authoritative is pending
- accepted authoritative promotion over prior draft
- stale authoritative rejection without corrupting newer accepted truth

### Does Not Own

- broad runtime-inspector redesign
- export-facing reuse

### Implementation Target

After this slice:
- accepted draft and accepted authoritative state remain separate and honest
- authoritative promotion only occurs at true result acceptance time
- scheduling-only churn does not clear accepted result state by itself

### Current Strongest Read

The live code now provides these strongest seams:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - already owns:
    - `acceptedDraftGeometryResult`
    - `acceptedAuthoritativeGeometryResult`
    - `acceptGraphBuildResult(...)`
    - the stale-drop and accepted-build boundary around `inFlightBuildSeq`, `inFlightBuildRequestId`, and `latestAcceptedBuildSeq`
  - is therefore the strongest current owner for authoritative promotion rules
- `src/app/store/useAppStore.ts`
  - already owns:
    - request-time authoritative policy selection
    - authoritative waiting placeholders
    - release and explicit trigger flow into real dispatch
  - should remain a caller and scheduling owner, not the accepted-state mutation owner
- `src/shared/geometryResult.ts`
  - already distinguishes draft versus authoritative geometry result classes
  - remains the shared contract layer for result-class truth that the acceptance boundary must honor

Important current limitation:
- accepted draft and accepted authoritative result seams already exist, but the promotion rule is still mostly implicit inside the current result-acceptance path
- Phase 3 can now dispatch authoritative work honestly, but Phase 4 still has to lock when authoritative truth should replace prior draft truth and what should happen when authoritative payloads are absent, stale, or partial

### Locked Direction

#### 1. Accepted-state promotion must stay inside the existing result-acceptance boundary

This slice should make promotion rules explicit where results are actually accepted.

Important rule:
- do not move accepted-state ownership into `useAppStore.ts`
- do not let waiting, release, or explicit trigger flow mutate accepted draft or accepted authoritative truth directly

#### 2. Accepted draft truth should remain visible until a newer valid authoritative result is truly accepted

Recommended first rule:
- if draft has already been accepted for the current or newer intent
- and authoritative work is still pending, waiting, superseded, or stale-dropped
- accepted draft should remain available as the current honest draft truth

Important rule:
- absence of newly accepted authoritative payload must not clear accepted draft truth by itself

#### 3. Accepted authoritative truth should replace only the authoritative lane it truly updates

Recommended first rule:
- when a newer valid authoritative result is accepted
- `acceptedAuthoritativeGeometryResult` should update to that newer accepted result
- `acceptedDraftGeometryResult` should update only if the same accepted build also provides newer draft truth

Important rule:
- authoritative promotion should not erase newer accepted draft truth incorrectly just because an authoritative-only payload arrived
- draft-only acceptance should not clear accepted authoritative truth either

#### 4. Stale or superseded authoritative arrivals must not corrupt newer accepted truth

Recommended first rule:
- if an authoritative result arrives after a newer accepted build or no longer matches the real in-flight request identity
- it should be rejected at the existing acceptance boundary
- any authoritative resources attached to that stale result should still follow the current cleanup path

Important rule:
- stale authoritative rejection is an acceptance-boundary decision, not a scheduling decision
- later stale authoritative arrivals must not roll accepted draft or accepted authoritative truth backward

#### 5. Result-class honesty must stay explicit even when one accepted build carries both draft and authoritative payloads

Recommended first rule:
- if the accepted build includes both draft and authoritative geometry payloads
- each accepted lane should still update according to its own payload and result-class meaning
- the code should read as an explicit dual-lane acceptance rule instead of a hidden side effect

Important rule:
- do not collapse accepted draft and accepted authoritative into one shared geometry slot
- Phase 4 should make the two-lane acceptance model more explicit, not less

### First Proof

- accepted draft remains stable while authoritative work is merely waiting, in flight, superseded, or stale-dropped
- a newer valid authoritative acceptance updates `acceptedAuthoritativeGeometryResult` without incorrectly clearing newer draft truth
- draft-only acceptance does not clear accepted authoritative truth
- stale authoritative arrivals do not roll accepted truth backward
- accepted-state mutation still happens only inside the existing acceptance boundary

### Expected File Targets

Primary implementation files:
- `src/app/spaghetti/store/useSpaghettiStore.ts`

Likely supporting files:
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/store/useAppStore.test.ts`
  - only if one focused cross-store proof is clearer there than in spaghetti-store tests
- `src/shared/geometryResult.ts`
  - only if one narrow helper or type-read clarification is needed

### Verification Bar

Required focused proof:
- accepted draft remains intact when authoritative scheduling or trigger churn happens without a newer accepted authoritative payload
- authoritative acceptance promotes only when the incoming result is valid and newer
- draft-only acceptance preserves previously accepted authoritative truth
- stale authoritative acceptance attempts do not clear or overwrite newer accepted draft or authoritative truth
- authoritative resource cleanup still occurs correctly for stale or replaced authoritative payloads if that path is exercised in this slice

### Implementation Spec

Recommended reading order:
1. `src/app/spaghetti/store/useSpaghettiStore.ts`
2. `src/app/spaghetti/store/useSpaghettiStore.test.ts`
3. `src/app/store/useAppStore.test.ts`
4. `src/shared/geometryResult.ts`
5. `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Future/Model-Viewport_Phase Model-Viewport-1 - Geometry Execution Reset, Preview Policy, And Authoritative Build Path.md`

Recommended execution order:
1. identify the current accepted draft plus accepted authoritative update rules inside `acceptGraphBuildResult(...)`
2. make the promotion rules explicit around draft-only, authoritative-only, and dual-payload accepted results
3. harden stale authoritative rejection so later arrivals cannot corrupt newer accepted truth
4. keep all accepted-state mutation inside `useSpaghettiStore.ts` instead of leaking it into scheduling owners
5. add focused tests proving promotion, preservation, and stale-drop safety

Recommended implementation-grade scenarios:
- `accepted draft stays visible while authoritative waits or stale-drops`
- `valid newer authoritative result promotes without clearing newer draft incorrectly`
- `draft-only acceptance preserves accepted authoritative truth`
- `stale authoritative result does not roll accepted truth backward`

Current status:
- shipped in code
- `useSpaghettiStore.ts` now owns one explicit accepted-lane promotion helper inside `acceptGraphBuildResult(...)` so draft-only, authoritative-only, and dual-payload acceptance all read as separate lane updates instead of hidden side effects
- accepted draft truth now remains intact when a newer accepted build only carries authoritative geometry, and accepted authoritative truth now remains intact when a newer accepted build only carries draft geometry
- stale authoritative arrivals now reject cleanly at the acceptance boundary, release any incoming stale authoritative handles, and cannot roll accepted draft or authoritative truth backward

## [x] Worker-Vision-3 Phase 5 - Hardening And Family Handoff

### Purpose

Close the first authoritative scheduling lane by hardening repeated churn, accepted-state preservation, and the honest handoff into later runtime-publication and export-reuse families.

### Owns

- repeated authoritative replacement hardening around the corrected release-first authoritative default
- accepted-state preservation proof under authoritative scheduling churn
- release-first authoritative latest-intent replacement under repeated edit churn
- final family handoff notes

### Does Not Own

- shared runtime publication as a whole family
- export reuse itself

### Implementation Target

After this slice:
- authoritative scheduling can survive repeated edit churn without reopening the basic contract
- accepted draft and accepted authoritative truth stay stable under repeated waits, releases, and replacements
- later Worker families can move into broader runtime publication and export reuse from an honest release-first authoritative base

### Current Strongest Read

The live code now provides these strongest seams:
- `src/app/store/useAppStore.ts`
  - already owns:
    - request-time authoritative policy selection
    - graph-local waiting authoritative latest intent in `delayedAuthoritativeBuildByGraphDocumentId`
    - release-trigger dispatch for authoritative waiting work through `endBrowserBuildInteraction(...)`
  - is therefore the strongest current owner for repeated authoritative replacement hardening too
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - already owns:
    - accepted draft and accepted authoritative truth
    - stale-drop acceptance checks
    - in-flight authoritative identity
  - means Phase 5 should harden churn without moving accepted-state ownership away from the acceptance boundary
- `src/app/store/useAppStore.test.ts`
  - already proves:
    - graph-local authoritative waiting replacement
    - release-trigger dispatch
    - accepted-state stability while authoritative work only waits
  - is the strongest current proof surface for the remaining repeated-churn behavior

Important current limitation:
- the planning direction is now corrected to release-first authoritative scheduling, but the final hardening slice still needs to lock repeated release-edge churn as one latest-intent-only authoritative lane
- the family should now explicitly prove the user-facing pattern where intermediate final values such as `20` and `10` are superseded before run so the system converges on the latest released value such as `50`

### Locked Direction

#### 1. Phase 5 should harden one release-first authoritative latest-intent lane, not a queue

Recommended first rule:
- repeated same-graph authoritative intent during edit churn should collapse to one latest waiting authoritative placeholder until the next release trigger dispatches it
- the runtime should try to produce final truth automatically for the latest released value, not complete every superseded intermediate final request

Important rule:
- do not widen into a multi-request authoritative queue
- do not let older waiting authoritative work survive beside newer same-graph intent

#### 2. Release-triggered authoritative dispatch must stay convergent under repeated value churn

Recommended first rule:
- when user edits values like `5 -> 20 -> 10 -> 50`
- the authoritative lane may stage `20`, replace it with `10`, and replace that with `50`
- the next release-triggered authoritative dispatch should target only the latest surviving same-graph intent

Important rule:
- if `20` never truly dispatches before `10` supersedes it, `20` should not later run just because it once existed as waiting intent
- if an older authoritative request is already in flight, later stale arrival handling must still prevent it from overwriting the newer accepted result

#### 3. Accepted truth must stay stable while authoritative latest intent is repeatedly replaced before run

Recommended first rule:
- repeated authoritative waiting replacement should not clear accepted draft truth
- repeated authoritative waiting replacement should not clear accepted authoritative truth
- only true accepted results should mutate accepted lanes

Important rule:
- scheduling churn is still narration and coordination, not accepted-state mutation

#### 4. Phase 5 should sharpen the family handoff around the corrected release-first model

Recommended first direction:
- the closeout proof should describe authoritative/final as:
  - release-first for ordinary viewport-facing work
  - explicit for manual/export work
  - latest-intent-only under repeated churn

Important rule:
- do not leave stale settle-default language behind in the family handoff once this hardening slice is complete

### First Proof

- repeated same-graph authoritative waiting requests replace rather than queue under release-first policy
- release dispatch after churn targets only the latest surviving authoritative intent for that graph
- superseded intermediate authoritative requests do not later overwrite newer accepted truth even if they finish late
- accepted draft and accepted authoritative truth stay unchanged while authoritative latest intent is only being replaced before run
- the family handoff can describe final/B-rep behavior honestly as release-first plus latest-intent-only

### Expected File Targets

Primary implementation files:
- `src/app/store/useAppStore.ts`
- `src/app/store/useAppStore.test.ts`

Likely supporting files:
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
  - if one focused stale-arrival or accepted-state-preservation proof is clearer there
- `src/app/bootstrapBuildWiring.test.ts`
  - only if one runtime-truth hardening proof widens there during closeout

### Verification Bar

Required focused proof:
- repeated authoritative replacements across one graph remain single-slot and latest-intent-only
- release-trigger dispatch after repeated churn runs only the latest surviving authoritative intent
- older authoritative arrivals still stale-drop safely after newer accepted truth lands
- accepted draft and accepted authoritative truth remain stable until true result acceptance
- family closeout wording and proof no longer imply that every intermediate final value is entitled to finish

### Current status

- shipped in code
- `useAppStore.ts` now defaults ordinary viewport-facing authoritative scheduling to `release` instead of `settle`, while keeping explicit/manual authoritative requests on the narrow `explicit` path
- repeated same-interaction authoritative churn now converges on the latest surviving graph revision at release time instead of queueing superseded intermediate final jobs
- `useAppStore.test.ts` now proves the release-first default across the existing request seams and covers the `5 -> 20 -> 10 -> 50` style latest-intent convergence behavior that closes this `Worker-Vision-3` ladder on one honest release-first authoritative base

### Implementation Spec

Recommended reading order:
1. `src/app/store/useAppStore.ts`
2. `src/app/store/useAppStore.test.ts`
3. `src/app/spaghetti/store/useSpaghettiStore.ts`
4. `src/app/spaghetti/store/useSpaghettiStore.test.ts`
5. `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Future/Model-Viewport_Phase Model-Viewport-1 - Geometry Execution Reset, Preview Policy, And Authoritative Build Path.md`

Recommended execution order:
1. identify the repeated same-graph authoritative replacement path under the corrected release-first policy
2. harden latest-intent waiting replacement so only one authoritative placeholder survives per graph during churn
3. prove release dispatch after churn targets only that latest surviving authoritative intent
4. prove stale accepted-result handling still prevents older authoritative arrivals from rolling newer truth backward
5. close the family handoff with honest wording around release-first final behavior and latest-intent-only convergence

Recommended implementation-grade scenarios:
- `authoritative release waiting replaces 20 with 10 and 10 with 50 before run`
- `release dispatch after churn targets only the latest authoritative intent`
- `late authoritative result from superseded request stale-drops without overwriting newer accepted truth`
- `accepted draft and authoritative truth remain stable while release-first authoritative intent is only being replaced`

## [x] Worker-Vision-3 Phase 6 - Display Preference Versus Build Policy Cleanup

### Purpose

Clean up the remaining ownership mismatch between Browser build timing and viewport display preference so final/B-rep auto-build behavior becomes predictable again without re-breaking manual build escape hatches.

### Owns

- separating Browser execution timing from viewport display preference
- removing the remaining cases where `Auto / Draft / Final` silently changes build policy
- ensuring authoritative/final auto-build still follows Browser timing rules honestly
- tightening the `Final` viewport path so it requests needed final work without pretending draft fallback is final truth

### Does Not Own

- new kernel/body-generation capability
- export reuse changes beyond keeping manual final requests intact
- broad viewport UI redesign

### Implementation Target

After this slice:
- Browser `live / release / manual / off` is the build-timing owner
- viewport `Auto / Draft / Final` is the display-preference owner
- switching viewport display mode does not silently rewrite Browser timing policy
- `Final` can still cause the app to pursue authoritative geometry honestly when auto-build policy allows it
- Browser `off` keeps scoped worker work frozen instead of acting like a mere hide toggle

### Current Strongest Read

The live code now provides these strongest seams:
- `src/app/store/useAppStore.ts`
  - already owns:
    - Browser policy interpretation through `selectEffectiveBrowserExecutionPolicy(...)`
    - Browser-triggered auto-build dispatch through `requestBrowserGraphDocumentBuild(...)`
    - authoritative waiting plus release dispatch through `requestGraphDocumentBuild(...)` and `endBrowserBuildInteraction(...)`
  - also currently contains the ownership mismatch where Browser policy still acts like too broad a top-level gate for final/authoritative behavior
- `src/app/workspace/useWorkspaceStore.ts`
  - already owns:
    - viewport-local `Auto / Draft / Final` state only
  - and therefore should stay display-only rather than becoming a hidden scheduling owner
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
  - already owns:
    - final-only rendering from accepted authoritative mesh preview
    - draft fallback behavior in `Auto`
  - so it is the right read surface to keep display honesty explicit once build ownership is corrected

Important current limitation:
- `Final` can currently read as unavailable even when manual build proves the graph is still capable of producing final geometry, which means the remaining gap is not necessarily the simple rectangle extrude kernel path itself
- the stronger remaining risk is that final/authoritative auto-build is not being requested or released under the right policy ownership, especially when Browser policy and viewport mode disagree

Most important observed live read:
- manual `Build` from the Spaghetti graph can still produce geometry for the simple `Geometry/Sketch -> Geometry/Extrude` case, so the highest-probability regression is not that simple rectangle extrusion lost B-rep capability entirely
- switching viewport display mode through `setViewportResultMode(...)` currently updates workspace state only and does not itself request a build
- Browser policy still suppresses or short-circuits `requestBrowserGraphDocumentBuild(...)` at the top-level `manual` and `off` gates, which is the strongest current seam where final/authoritative follow-through can still be blocked too broadly

### Locked Direction

#### 1. Browser policy should own timing, not viewport display mode

Recommended first rule:
- Browser `live / release / manual / off` should answer when auto-build runs
- viewport `Auto / Draft / Final` should answer what result lane the viewport prefers to show

Important rule:
- do not let `Auto / Draft / Final` silently rewrite Browser timing policy
- do not let Browser `off` mean something different only because the viewport is in `Final`
- do not treat Browser `off` as a visibility-only toggle; it should mean the worker does not process new build work for that scoped target while suppression remains active

#### 2. Viewport mode should stay display-only, with explicit honest fallout

Recommended first rule:
- `Draft` shows draft only
- `Final` shows final only
- `Auto` prefers final when available and otherwise falls back to draft

Important rule:
- do not let display preference masquerade as a separate build policy
- if final geometry is unavailable, `Final Unavailable` should stay honest rather than showing draft as if it were final

#### 3. Final/authoritative auto-build should still follow Browser timing ownership

Recommended first rule:
- if Browser policy allows auto-build, the app should still pursue authoritative/final work on that timing contract
- release-first authoritative scheduling should remain latest-intent-only under repeated churn
- `manual` should keep authoritative work dormant until the user explicitly requests `Build`
- `off` should keep authoritative work suppressed entirely for ordinary automatic follow-through, even if upstream references keep changing

Important rule:
- do not require manual build for normal final/B-rep convergence when Browser policy is permitting auto-build
- manual build should remain an explicit override path, not the only path that still works
- Browser `off` should not be bypassed just because the viewport is in `Final` or `Auto`

#### 4. Mode switches should request needed work without becoming a hidden policy rewrite

Recommended first rule:
- switching into `Final` or `Auto` may request the needed authoritative work for the active graph when auto-build timing allows it
- that request should still respect Browser timing ownership instead of inventing a new viewport-local scheduling vocabulary

Important rule:
- do not create a second competing build-policy system owned by the viewport
- do not regress active-graph latest-intent replacement or stale-drop acceptance hardening

#### 5. Manual build should become corroborating proof, not the only surviving path

Recommended first rule:
- if manual `Build` can still produce final geometry for a graph, automatic final convergence should be treated as a policy/request-ownership bug until proven otherwise
- the cleanup should preserve the explicit manual path while restoring the ordinary automatic final path under allowed Browser timing
- when Browser policy is `manual`, repeated explicit `Build` requests should still stay latest-intent-safe under edit churn rather than behaving like a queue
- when Browser policy is `off`, manual `Build` is the only acceptable escape hatch if the product still wants one, because ordinary worker follow-through should remain frozen

Important rule:
- do not solve the regression by redefining `Final` to mean manual-only
- do not widen the fix into kernel/extrude feature work unless the policy/request seams are disproven first

### First Proof

- Browser `live / release / manual / off` remains the timing owner for automatic builds after the cleanup
- `Auto / Draft / Final` no longer mutates effective build policy by itself
- switching into `Final` does not leave the app stranded on draft-only truth when auto-build timing should still pursue authoritative work
- manual build still succeeds as an explicit override path without being required for ordinary final convergence
- Browser `off` prevents new worker processing for the scoped target instead of merely hiding its already accepted geometry
- a simple `Geometry/Sketch -> Geometry/Extrude` graph can again converge to renderable final geometry automatically under allowed auto-build timing

Required concrete regression read:
- prove the simple rectangle-extrude graph that currently reaches final geometry through manual `Build` can also reach final geometry automatically once Browser timing ownership is corrected

### Expected File Targets

Primary implementation files:
- `src/app/store/useAppStore.ts`
- `src/app/store/useAppStore.test.ts`

Likely supporting files:
- `src/app/workspace/useWorkspaceStore.ts`
  - only if one narrow mode-switch trigger or coordination seam belongs there
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
  - if one display-honesty read needs tightening once build ownership is corrected
- `src/app/components/ViewerHost.test.tsx`
  - if one focused viewport-mode proof is clearer at the render boundary

### Verification Bar

Required focused proof:
- Browser policy remains the sole auto-build timing owner after the cleanup
- viewport mode changes do not silently rewrite effective build policy
- `Final` and `Auto` can still drive authoritative convergence honestly when Browser timing allows it
- manual build remains a working explicit override path
- Browser `off` leaves the scoped target worker-suppressed even while upstream references continue changing
- canonical simple extrude final-view behavior is covered by a focused regression proof

Required focused runtime check:
- switching the active viewport from `Draft` to `Final` while Browser timing allows auto-build produces a real authoritative build request or release-path placeholder instead of only changing display state

### Implementation Spec

Recommended reading order:
1. `src/app/store/useAppStore.ts`
2. `src/app/store/useAppStore.test.ts`
3. `src/app/workspace/useWorkspaceStore.ts`
4. `src/app/spaghetti/selectors/selectViewportResultState.ts`
5. `src/app/components/ViewerHost.tsx`
6. `src/app/components/ViewerHost.test.tsx`

Recommended execution order:
1. identify every remaining place where viewport mode still influences build timing or target selection too directly, especially the active-viewer geometry-target resolution and the missing mode-switch build request path
2. tighten Browser policy ownership so draft and authoritative auto-build timing flow from one timing seam instead of letting Browser `manual` or `off` short-circuit final too broadly
3. add the smallest needed trigger so `Final` or `Auto` can request authoritative work for the active graph without redefining timing policy
4. prove manual build still works as the explicit override path and that the same simple extrude graph now converges automatically under allowed Browser timing
5. lock the final-view simple-extrude regression with one honest end-to-end proof at the app or viewer boundary

Recommended implementation-grade scenarios:
- `switching viewport from Draft to Final does not rewrite Browser policy but still requests needed final work when auto-build timing allows it`
- `Browser Off plus Final remains honestly unavailable until manual build`
- `Browser Off freezes worker processing for a scoped loft-style object while upstream references continue changing`
- `Browser Manual plus Final waits for explicit Build, and repeated build plus edit churn still converges on latest intent safely`
- `Browser Release plus Final converges to latest authoritative result on release without requiring manual build`
- `simple rectangle sketch extrude regains automatic final convergence while Auto may still show draft fallback before final arrives`
- `manual build still succeeds for the same simple rectangle extrude graph, confirming the cleanup fixed request ownership rather than relying on a separate manual-only geometry path`

### Current status

- shipped in code
- `src/app/store/useAppStore.ts` now treats Browser `live / release / manual / off` as the sole timing owner for automatic build follow-through, including the authoritative `live` lane, the release-edge dispatch path, the explicit/manual escape hatch, and Browser `off` suppression that still blocks worker processing for scoped targets
- active viewport switches into `Final` or `Auto` now request needed authoritative work through the shared Browser build seam instead of only mutating display state, while the workspace store remains display-only
- `src/app/spaghetti/store/useSpaghettiStore.ts` now prevents stale accepted authoritative geometry from staying viewer-readable once the current graph revision moves past the accepted revision, so disconnected-current final geometry clears honestly instead of lingering on screen
- `src/app/store/useAppStore.test.ts` and `src/app/components/ViewerHost.test.tsx` now prove the Phase 6 timing-ownership cleanup and the stale-final disconnect regression path

## [x] Worker-Vision-3 Phase 7 - Auto Draft Visibility And Final Swap Cleanup

### Purpose

Make viewport `Auto` feel responsive and honest by showing live draft geometry during edit churn, while still pursuing authoritative/final truth in the background and swapping to it once the newer final result is truly ready.

### Owns

- tightening `Auto` so draft geometry remains visibly responsive during drag/edit churn
- separating `Auto` execution follow-through from the too-final-biased request path it still inherits today
- ensuring final/authoritative work can continue in the background while `Auto` shows draft fallback honestly
- swapping visible geometry from draft to final once the newer authoritative result is accepted

### Does Not Own

- `Final` mode semantics
- Browser `off` suppression rules
- new kernel/body-generation capability
- broad viewer UI redesign beyond truthful `Auto` behavior

### Implementation Target

After this slice:
- `Auto` shows draft geometry while the user is actively changing values and draft truth is the newest available visible result
- `Auto` still pursues authoritative/final work on the Browser timing contract in the background
- when newer authoritative geometry is accepted, `Auto` swaps from draft display to final display cleanly
- `Auto` no longer feels like a mostly-final execution path with only accidental draft fallback

### Current Strongest Read

The live code now provides these strongest seams:
- `src/app/store/useAppStore.ts`
  - already owns:
    - request-time geometry-target selection in `resolveGraphBuildGeometryTarget(...)`
    - Browser-timed build dispatch through `requestBrowserGraphDocumentBuild(...)`
    - mode-switch authoritative request follow-through from Phase 6
  - still currently resolves `Auto` too close to the authoritative lane, which makes draft responsiveness under churn feel weaker than intended
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
  - already owns:
    - `Auto` draft fallback versus final replacement display logic
  - means the display contract is mostly right already; the remaining gap is the request/execution path that decides whether draft work is being pursued visibly enough
- `src/app/components/ViewerHost.tsx`
  - already reads the selector result and shows whichever render VM wins
  - is therefore the right proof surface for the eventual draft-then-final swap behavior

Important current limitation:
- `Auto` currently feels too final-biased because the request-time geometry target still tends to route `Auto` toward authoritative work instead of intentionally keeping visible draft work alive during churn
- that means the selector may be willing to show draft fallback, but the runtime is not always producing the live draft updates the user expects to see
- the current app seam still thinks in terms of one request-time `geometryTarget` per request, while the desired `Auto` behavior really needs draft responsiveness plus authoritative follow-through for the same current graph revision

Important live bug read after the Phase 7 review:
- the repo now has one narrower failure beyond request-time bias: after a newer draft-only acceptance in `Auto`, the graph runtime intentionally preserves the older accepted authoritative geometry lane, while the shared accepted revision still advances to the newer current graph revision
- that means selector-side final visibility can still treat the preserved authoritative B-rep result as current enough to win display, even though it still represents the old input value
- at the same time, the current `Auto` companion-authoritative helper in `useAppStore.ts` still gates follow-through on `acceptedAuthoritativeGeometryResult !== null`, so the preserved old final can also suppress the newer authoritative request that should replace it
- the visible symptom matches the live extrude-style regression read:
  - draft preview updates to the new number during churn
  - `Auto` then lands back on retained B-rep/final geometry
  - that final geometry may still reflect the previous number because authoritative freshness is not yet tracked separately from shared accepted revision

Current strongest code-backed read of that bug:
- `src/app/store/useAppStore.ts`
  - `maybeRequestAutoViewportAuthoritativeFollowThrough(...)` currently treats any non-null accepted authoritative result as enough reason to skip the companion final request, even when that authoritative result may belong to an older accepted lane state
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - accepted draft and accepted authoritative geometry are preserved as separate lanes, which is correct and should stay true
  - but the runtime does not yet carry one explicit accepted authoritative revision/freshness read separate from the shared `latestAcceptedGraphRevision`
- selector reads such as the current viewer-target authoritative geometry helpers still gate final availability through the shared accepted-versus-current revision match, which is too coarse once draft and authoritative lanes are intentionally allowed to diverge in time

Implementation-prep conclusion:
- the remaining Phase 7 fix should not be framed only as `Auto needs paired requests`
- it also needs one explicit authoritative-lane freshness rule so older final truth cannot masquerade as current final after draft-only acceptance moves the shared accepted revision forward
- the next implementation slice should therefore treat `authoritative exists` and `authoritative is current for this graph revision` as different facts

### Remaining ambiguity to remove before implementation

Phase 7 is close to ready, but one contract needs to be explicit so implementation does not guess:

- when `Auto` is active for a graph revision, the app likely needs:
  - one draft-visible request path
  - and one companion authoritative-follow-through path
- that companion final path must still obey Browser `live / release / manual / off`
- latest-intent replacement must remain safe independently for the draft-visible lane and the authoritative lane

Recommended first answer:
- `Auto` should no longer mean `geometryTarget = authoritative`
- instead, `Auto` should mean:
  - request draft visibility for ordinary edit churn
  - also stage or request authoritative follow-through for the same revision when Browser timing allows it

Important rule:
- do not hide this by overloading one request to pretend it is both draft and authoritative if the runtime contract cannot represent that honestly
- if the app needs paired requests or a companion request helper, name that seam explicitly in this phase instead of leaving it implicit
- do not let preserved older authoritative truth count as fresh authoritative truth for the current graph revision just because the shared accepted revision advanced through a draft-only accept

### Locked Direction

#### 1. `Auto` should be draft-visible during churn, not final-blocked during churn

Recommended first rule:
- while the user drags or rapidly edits values, `Auto` should show the newest draft geometry if that is the freshest visible truth
- `Auto` should not wait silently for authoritative completion before anything appears to update

Important rule:
- do not redefine `Auto` into another final-only display mode
- do not let `Auto` feel visually frozen just because final work is still in progress

#### 2. `Auto` should still pursue final in the background

Recommended first rule:
- `Auto` should continue to request authoritative/final work on the Browser timing contract
- Browser `live / release / manual / off` should still own when that background final pursuit is allowed to run
- the first implementation should prefer one explicit companion-authoritative request path over hidden selector-side inference

Important rule:
- this slice should not steal timing ownership away from Browser policy
- `Auto` should gain draft-visible responsiveness without creating a second timing system

#### 3. The visible result swap should happen only when newer final truth is truly accepted

Recommended first rule:
- `Auto` may show draft while final is pending
- once a newer authoritative result is accepted for the current graph revision, `Auto` should swap to final

Important rule:
- do not swap to stale final truth
- do not treat waiting or in-flight authoritative work as if final is already available
- do not let a preserved older authoritative lane win final display just because draft acceptance moved the shared accepted revision forward

#### 4. `Auto` should remain honest when final is blocked or suppressed

Recommended first rule:
- if Browser policy is `manual` or `off`, `Auto` may still show draft if draft truth exists
- but `Auto` should not imply that final is on the way when Browser policy is intentionally suppressing or withholding it

Important rule:
- preserve the Phase 6 rule that Browser `off` remains worker suppression
- preserve the explicit/manual escape hatch without making `Auto` look misleadingly complete

#### 5. `Auto` should have one explicit mixed-lane request contract

Recommended first rule:
- when viewport mode is `Auto`, ordinary edit churn should produce:
  - a draft-visible request for responsiveness
  - plus a companion authoritative request, delay, or release-path placeholder when Browser timing allows it

Important rule:
- that companion authoritative path must be latest-intent-only and revision-safe
- if Browser policy is `manual` or `off`, the companion authoritative path may remain withheld or suppressed while draft still updates honestly
- this phase should not rely on mode-switch-only final requests; it must cover later graph revisions that happen while the viewport stays in `Auto`
- that companion authoritative path must evaluate whether current authoritative truth is fresh for the current graph revision, not just whether some accepted authoritative object is still retained

#### 6. Authoritative freshness must be lane-specific

Recommended first rule:
- the runtime should be able to distinguish:
  - accepted draft is current for graph revision `N`
  - accepted authoritative is still from graph revision `N - 1`
- `Auto` may preserve that older authoritative lane in runtime state if later phases still want stale-final presentation, but Phase 7 display and scheduling must not treat it as current final truth

Important rule:
- do not collapse accepted draft and accepted authoritative into one lane just to solve this regression
- do not rely on `acceptedAuthoritativeGeometryResult !== null` as the freshness test for follow-through
- prefer one explicit authoritative accepted revision or equivalent freshness seam over selector-side guesswork

### First Proof

- dragging an extrude-style value in `Auto` visibly updates draft geometry during churn
- `Auto` still requests authoritative/final work in the background when Browser timing allows it
- once newer final geometry is accepted, `Auto` swaps from draft display to final display
- `Auto` does not silently wake suppressed Browser `off` targets or bypass `manual`
- the same simple extrude path now reads as responsive during edit churn instead of looking final-blocked
- repeated graph revisions while remaining in `Auto` still pursue newer final truth; final pursuit is not limited to the first mode switch into `Auto`
- if an older authoritative B-rep result is still retained while a newer draft-only result has already been accepted, `Auto` does not present that older final as though it already reflects the new number

### Expected File Targets

Primary implementation files:
- `src/app/store/useAppStore.ts`
- `src/app/store/useAppStore.test.ts`

Likely supporting files:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`

### Verification Bar

Required focused proof:
- `Auto` shows live draft geometry during value drag/edit churn
- `Auto` still converges to final when newer authoritative truth lands
- Browser policy remains the timing owner for final/background follow-through
- `manual` and `off` remain honest in `Auto`
- a focused simple extrude regression proves draft-visible-then-final-swap behavior at the viewer boundary
- a focused app-store proof shows `Auto` produces draft follow-through plus a companion authoritative path for later graph revisions without requiring another mode switch

### Implementation Spec

Recommended reading order:
1. `src/app/store/useAppStore.ts`
2. `src/app/store/useAppStore.test.ts`
3. `src/app/spaghetti/selectors/selectViewportResultState.ts`
4. `src/app/components/ViewerHost.tsx`
5. `src/app/components/ViewerHost.test.tsx`

Recommended execution order:
1. identify the request-time geometry-target and policy seams where `Auto` still behaves too much like a final-only lane
2. add one explicit app-owned mixed-lane request seam for `Auto` so draft-visible work and companion authoritative follow-through can both exist for the same graph revision without redefining Browser timing ownership
3. make `Auto` keep visible draft follow-through alive during churn while the companion authoritative path obeys Browser `live / release / manual / off`
4. prove repeated graph revisions while staying in `Auto` still replace older pending authoritative intent with newer latest intent safely
5. prove the visible viewer swap from draft to final once the newer authoritative result is accepted
6. lock the simple extrude drag/read path with one focused viewer regression

Recommended implementation-grade scenarios:
- `Auto shows live extrude draft geometry while depth is dragged`
- `Auto swaps from draft mesh to final mesh once authoritative geometry lands`
- `Auto respects Browser Release by showing draft during churn and converging to final on release`
- `Auto respects Browser Manual by showing available draft truth without implying automatic final follow-through`
- `Auto respects Browser Off by showing no new worker-driven updates for suppressed targets`
- `Auto continues to request newer authoritative follow-through for later graph revisions even when the user never leaves Auto mode`
- `Auto does not let a retained authoritative result for depth 20 block the newer authoritative follow-through after draft acceptance has already moved the current graph revision to depth 10`
- `Auto does not show the retained depth 20 B-rep result as current final truth after the depth 10 draft path has already accepted`

## [x] Worker-Vision-3 Phase 8 - Viewport Result Layering And Relevance Presentation

Detailed split execution now lives in:
- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker-Vision-3 Phase 8 - Viewport Result Layering And Relevance Presentation.md`

Use that standalone Phase 8 doc for:
- `Worker-Vision-3 Phase 8.1 - Draft Worker Versus Authoritative Worker Split`
- `Worker-Vision-3 Phase 8.2 - Viewport Result Contract And Relevance Gating`
- `Worker-Vision-3 Phase 8.3 - Auto Layered Presentation`
- `Worker-Vision-3 Phase 8.4 - Strict Draft Final Hardening And Viewer Proof`

This umbrella section remains the high-level Phase 8 direction.

### Purpose

Make viewport result presentation honest and readable during final catch-up by explicitly defining how `Auto`, `Draft`, and `Final` should display retained authoritative geometry versus live draft preview while newer authoritative truth is still pending.

### Owns

- defining when retained authoritative geometry may remain visible while a newer draft revision is active
- defining the mixed-lane presentation rule for `Auto`
- defining the strict lane rules for `Draft` and `Final`
- locking the opacity and swap rules for solid retained final versus translucent live draft preview
- locking the relevance rule so stale authoritative results never promote just because they finished later

### Does Not Own

- Browser timing policy
- authoritative scheduling ownership
- worker scheduling or latest-intent replacement rules
- broad material/theme redesign beyond the narrow opacity/presentation cue needed for result honesty

### Implementation Target

After this slice:
- `Auto` may show the last relevant accepted authoritative/final result as the solid base geometry while the user edits
- `Auto` may show the current live draft/preview geometry above that retained final result at reduced opacity
- the retained final remains fully solid while draft is still changing
- once a newer authoritative result is accepted and still matches the current graph revision, `Auto` swaps to that newer final as the new solid base and removes the older retained final
- `Draft` remains a pure draft-visible mode without retained-final layering
- `Final` remains a strict final-only mode without translucent draft overlay

### Current Strongest Read

The live code now provides these strongest seams:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - already owns accepted draft-versus-authoritative lane truth plus lane-specific revision freshness
  - is therefore the strongest place to derive whether retained authoritative geometry is still relevant for the current graph revision
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
  - already owns the visible `Auto / Draft / Final` result read contract
  - should likely stay the seam that decides whether the viewport surfaces:
    - retained authoritative base
    - draft overlay
    - strict final-only view
- `src/app/components/ViewerHost.tsx`
  - already turns selector output into viewer render input
  - is the strongest likely proof surface for layered opacity and swap behavior
- `src/viewer/Viewer.ts`
  - already contains transparent-material and opacity handling seams
  - means the reduced-opacity draft-overlay rule can likely land as a narrow presentation cue without inventing a second geometry owner

Important current limitation:
- the repo currently thinks mostly in terms of one visible winning render VM at a time
- there is not yet one explicit viewport contract for:
  - showing retained authoritative/final geometry as the solid base
  - showing draft preview as a translucent overlay above it
  - keeping `Draft` and `Final` out of that mixed-lane presentation
- there is also not yet one explicit promotion rule that says a newly completed authoritative result must still be relevant to the current graph revision before it can replace the retained final on screen

### Locked Direction

#### 1. Retained final is a presentation base, not a second truth owner

Recommended first rule:
- retained authoritative/final geometry should reuse already accepted authoritative truth
- when it remains visible during later churn, it should exist only as a presentation of known retained final truth against a newer current graph revision

Important rule:
- do not treat retained final presentation as proof that the current revision is already accepted authoritatively
- do not let the retained final presentation become another hidden geometry state owner

#### 2. Only `Auto` should mix retained final and live draft

Recommended first rule:
- `Auto` may show:
  - retained older final as solid context
  - current draft as the responsive translucent lane
  - newer current final once accepted
- `Draft` should show draft only
- `Final` should show final only

Important rule:
- do not widen the mixed overlay into `Draft`
- do not widen the mixed overlay into `Final`
- `Draft` should remain the clearest fast-edit lane
- `Final` should remain strict and honest rather than showing translucent draft fallback

#### 3. Draft overlay must be visually distinct from retained final

Recommended first rule:
- retained authoritative/final geometry should remain fully solid
- current live draft overlay should render at roughly `0.5` opacity or another clearly reduced-opacity starting point above the retained final
- once newer final truth is accepted and relevant, that newer final should render solid and the draft overlay should disappear

Important rule:
- the draft overlay should not read as already accepted final truth
- the user should be able to tell immediately which geometry is retained final and which geometry is live in-progress preview

#### 4. Final promotion must remain relevance-gated

Recommended first rule:
- when authoritative work finishes, the app should check whether that result still matches the current graph revision before promoting it into visible final truth
- if the user kept dragging and the authoritative result is already stale, it should not replace the currently retained final on screen
- only a still-relevant accepted authoritative result may become the new solid final presentation

Important rule:
- do not let a stale later-arriving B-rep result flash on screen just because it finished
- do not keep stacking older retained finals across multiple revisions

#### 5. Release is the swap boundary for solid current final in `Auto`

Recommended first rule:
- while the user is actively dragging or editing, `Auto` may keep the last relevant accepted final solid and the current draft overlay translucent
- once the user releases and a still-relevant newer authoritative result is accepted, the viewport should swap to that newer final as the solid result

Important rule:
- do not make the solid final flicker between intermediate authoritative completions during active churn
- if the user never pauses long enough for a relevant authoritative result to finish, the viewport should keep the retained final plus translucent draft instead of pretending the current value is already final

#### 6. `Draft` and `Final` need explicit non-`Auto` rules

Recommended first rule:
- `Draft`
  - show draft-visible geometry only
  - no retained-final base underneath
- `Final`
  - show only current relevant accepted authoritative/final truth
  - if no current relevant final exists, remain honestly unavailable or pending according to the existing strict final contract

Important rule:
- do not let `Draft` accidentally inherit retained-final layering just because the runtime still retains authoritative truth
- do not let `Final` fall back to translucent draft overlay, because that would blur the final-only meaning again

### First Proof

- in `Auto`, after accepted final geometry exists for one graph revision, changing an input produces a state where the retained final remains fully solid while current draft stays responsive at reduced opacity
- when newer authoritative geometry for the updated graph revision is accepted and still relevant, the retained old final disappears and the new final renders solid
- if an authoritative result finishes for an already superseded graph revision, it does not replace the retained final on screen
- `Draft` does not adopt the retained-final layering behavior
- `Final` does not adopt the translucent draft-overlay behavior
- the presentation layer does not wake worker processing or bypass Browser `manual` or `off`

### Expected File Targets

Primary implementation files:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/components/ViewerHost.tsx`

Likely supporting files:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/components/ViewportOverlay.test.tsx`
- `src/viewer/Viewer.ts`

### Verification Bar

Required focused proof:
- `Auto` can show retained final solid plus current draft overlay at reduced opacity during active value churn
- retained-final presentation is tied to `accepted authoritative revision < current graph revision`
- only a still-relevant newer authoritative acceptance replaces the retained final
- stale later-arriving authoritative results are ignored for visible promotion
- `Draft` stays pure and does not layer retained final under draft
- `Final` stays strict and does not use translucent draft overlay
- Browser `manual` and `off` remain timing/suppression owners rather than being bypassed by the presentation layer

### Implementation Spec

Recommended reading order:
1. `src/app/spaghetti/selectors/selectViewportResultState.ts`
2. `src/app/spaghetti/store/useSpaghettiStore.ts`
3. `src/app/components/ViewerHost.tsx`
4. `src/app/components/ViewportOverlay.tsx`
5. `src/app/components/ViewerHost.test.tsx`
6. `src/app/components/ViewportOverlay.test.tsx`
7. `src/viewer/Viewer.ts`

Recommended execution order:
1. identify the narrow selector/view-model seam that can emit separate retained-final and draft-overlay presentation lanes without reintroducing stale-truth bugs
2. extend the viewport result VM so `Auto` can expose:
   - one solid retained-final lane
   - one translucent draft-overlay lane
   - one relevance-gated final-promotion seam
3. pass one narrow opacity or render-style hint into the viewer without widening geometry ownership
4. lock `Draft` and `Final` into their non-mixed display rules so only `Auto` uses the layered presentation
5. prove the `extrude 10 accepted -> drag toward 20 -> depth 10 final stays solid -> live draft is half opacity -> stale depth 14 final completion does not replace visible truth -> release and relevant depth 20 final lands solid` path
6. prove `Final` mode remains strict and that Browser timing/suppression semantics are unchanged

Recommended implementation-grade scenarios:
- `Auto shows extrude depth 10 final solid, then while dragging toward 20 keeps depth 10 final solid and shows the live draft path at half opacity`
- `Auto ignores an already stale authoritative completion for an intermediate drag value and keeps the retained final plus current draft overlay`
- `Auto swaps to the newer depth 20 final only when that accepted authoritative result is still relevant for the current graph revision`
- `Draft mode shows only the current draft path without retained-final layering`
- `Final mode clears or withholds stale final instead of showing translucent draft fallback`
- `Browser Manual plus Auto may still show retained older final plus draft overlay as presentation, but does not imply automatic final catch-up`
- `Browser Off plus Auto may still retain previously accepted final as presentation, but does not wake worker processing for suppressed targets`

## [x] Worker-Vision-3 Phase 9 - Held Authoritative Preview Presentation

Detailed execution now lives in:
- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker-Vision-3 Phase 9 - Held Authoritative Preview Presentation.md`

Use that standalone Phase 9 doc for:
- `Worker-Vision-3 Phase 9.1 - Presentation Settings Schema And Ownership`
- `Worker-Vision-3 Phase 9.2 - Presentation Controls UI Surface`
- `Worker-Vision-3 Phase 9.3 - Viewport Presentation State Contract`
- `Worker-Vision-3 Phase 9.4 - Viewer Application Of Presentation Controls`
- `Worker-Vision-3 Phase 9.5 - Held Authoritative 75 Percent Promotion`
- `Worker-Vision-3 Phase 9.6 - Runtime Narration And Hardening Proof`

This umbrella section remains the high-level Phase 9 direction.

### Purpose

Refine the Phase 8 viewport presentation ladder so authoritative geometry that becomes ready during an active interaction can be shown as clearly more real than draft mesh, but still clearly less than released accepted truth.

### Owns

- the high-level product direction for the held-authoritative preview state
- the rule that `75%` means authoritative-ready-held rather than accepted
- preserving one Browser build policy while widening only presentation/read truth
- the honest distinction between ready authoritative preview and committed accepted result

### Does Not Own

- Browser policy redesign
- worker-lane redesign
- accepted-result ownership
- export behavior

### Implementation Target

After this slice:
- active draft-only interaction still reads as `50%`
- active interaction with ready authoritative geometry may upgrade to `75%`
- released accepted authoritative presentation remains the only `100%` state
- the Browser still exposes one user-facing execution-policy system rather than separate mesh and final controls

## [ ] Worker-Vision-3 Phase 10 - UI-Only Graph Revision Versus Geometry Build Revision Split

Detailed execution now lives in:
- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker-Vision-3 Phase 10 - UI-Only Graph Revision Versus Geometry Build Revision Split.md`

Use that standalone Phase 10 doc for:
- `Worker-Vision-3 Phase 10.1 - UI-Only Graph Edits Stop Triggering Geometry Build Churn`

If later follow-ons are needed after `10.1`, add them inside that same standalone Phase 10 doc as:
- `Worker-Vision-3 Phase 10.2 - ...`
- `Worker-Vision-3 Phase 10.3 - ...`

This umbrella section remains the high-level Phase 10 direction.

### Purpose

Keep full graph-document persistence honest, including node-position layout data needed for later spaghetti-graph file export, while preventing UI-only graph edits from being treated like geometry-authoring changes that should wake compile/build invalidation and worker scheduling.

### Owns

- the high-level direction that graph layout and other editor-only graph UI state may persist in the graph document without automatically becoming worker-relevant
- the split between full document revision truth and geometry-build-trigger truth
- keeping worker payload and build invalidation focused on geometry-relevant authored changes only
- preserving future graph-file export honesty without turning layout metadata into worker work

### Does Not Own

- graph-file export UX or serialization format redesign
- Browser build policy redesign
- node-editor interaction polish
- wider worker scheduling redesign beyond the revision and invalidation contract

### Implementation Target

After this slice:
- node position and similar graph UI metadata remain saved as part of graph-document truth
- moving nodes no longer wakes geometry compile/build churn just because the graph document revision changed
- geometry-authoring changes still advance the worker-facing invalidation path normally
- the worker-facing payload remains free of layout-only data such as node canvas position
