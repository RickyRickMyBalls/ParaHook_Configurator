# Worker Vision

## Doc Header

### Doc History
9. 2026-04-13 17:09: Added explicit `Generation 4` architectural goals covering user-directed cost control, separate runtime lanes, parallel lane capability, lane-specific relevance rules, hold/reuse/defer behavior, per-target cost policy, presentation alignment, predictable policy, export/final isolation, and explainable multi-lane runtime truth so the later user-directed worker generation now has a concrete value set instead of only a broad theme
8. 2026-04-13 17:03: Added explicit `Generation 3` architectural goals covering latest-intent supersession, cooperative interruption, restart from newest parameters, one active story per target, latest-result-wins acceptance, in-flight obsolete detection, and safe stop rules so the later interrupt-and-restart generation now has a concrete value set beyond the initial drag-churn example
7. 2026-04-13 16:57: Added five explicit `Generation 2` architectural goals covering stable reference identity, reference-level dependency mapping, safe widening when uncertain, topology-change versus parameter-change distinction, and retained sibling recomposition so the retained-truth generation now has clearer reusable guardrails beyond the first `Worker 9` and `Worker 10` proof cases
6. 2026-04-13 16:49: Broadened the `Generation 2` language from sketch-specific downstream narrowing to the more general shared-reference invalidation rule, clarifying that `Worker 10` should be the first proof of reference-level downstream invalidation with shared sketch profiles as the initial example rather than the whole architectural definition
5. 2026-04-13 16:43: Expanded `Generation 2` so it now covers both the active `Worker 9` retained-sibling and affected-subgraph lane plus the next `Worker 10` style profile-local downstream-reference narrowing, making explicit that a shared sketch edit should eventually rebuild only the downstream objects that truly reference the changed profile instead of widening to every object sourced from the same sketch
4. 2026-04-13 16:36: Tightened `Generation 3` around the clearer latest-intent supersession goal, reframing it as a `Latest-Intent Superseding Worker`, adding the concrete `10 -> 50 -> 5 -> 60` parameter-churn example, and clarifying that this generation is about cooperative interruption and restart of stale in-flight work rather than ordinary input debouncing
3. 2026-04-13 16:28: Reorganized the generation ladder so `Generation 2` now matches the active `Worker 9` retained-truth and affected-subgraph lane, while `Generation 3` now describes the later interrupt-and-restart worker direction that will need fresh plan docs because the older `Worker-Vision-1/2/3` planning surfaces are now stale for that next generation
2. 2026-04-13 16:18: Reframed this vision around explicit worker `generations`, making the current shipped worker read as `Generation 1` and adding later generation descriptions so future worker phases can be placed against a clearer runtime-evolution ladder
1. 2026-04-13 16:05: Created this long-range `Worker-Vision.md` companion doc for the `Worker` family so the repo now has one explicit place to record the worker's core values, north-star runtime direction, and guardrails around latest-intent execution, draft-versus-authoritative behavior, retained truth, and narrow affected-scope rebuilds

### Purpose

This doc defines the future runtime direction for the ParaHook `Worker`.

Use it to answer:
- what core values should guide later worker changes after the graph-native contract cleanup already shipped
- what `generation` the worker is in today
- what later worker generations should add without violating the core worker values
- how latest-intent execution, draft-versus-authoritative behavior, retained results, and partial invalidation should fit together
- where runtime truth should live versus where product presentation should stay downstream
- what later worker phases should preserve even as scheduling and rebuild behavior become more sophisticated

### Why This Doc Exists

`Worker-Index.md` now describes the shipped worker boundary and the concrete implementation family that cleaned up the graph-native contract.

That is useful, but it is not the same thing as a long-range worker vision.

The worker family now has follow-on lanes that are more about runtime behavior than basic boundary cleanup:
- latest-intent supersession
- draft scheduling
- authoritative scheduling
- retained-result presentation
- affected-subgraph narrowing

Those later lanes need one shared north star so they do not each redefine the worker's values from scratch.

This doc exists to record that north star.

The goal is not to freeze every later implementation detail.

The goal is to:
- name the worker values clearly
- organize the worker roadmap into explicit generations
- keep ownership boundaries stable while behavior grows
- make later worker phases easier to review against one shared standard
- prevent fast-feeling behavior from drifting into fake or ambiguous truth

The main worker-family records currently live at:
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase Worker-Vision-1 - Request Supersession And Cooperative Early Abort.md`
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase Worker-Vision-2 - Draft Preview Scheduling And Settle Rules.md`
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase Worker-Vision-3 - Authoritative Scheduling And Final Acceptance Rules.md`
- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker 9 - Affected Subgraph Invalidation And Retained Sibling Recomposition.md`

Important current planning rule:
- the older `Worker-Vision-1/2/3` docs remain useful shipped history and value references
- they should not be treated as the current canonical future-generation ladder
- the next post-`Worker 9` interrupt-and-restart generation should get fresh plan docs instead of extending those older planning surfaces indefinitely

### Scope

This doc covers:
- the values that should shape future worker behavior
- long-range runtime scheduling direction
- retained-versus-rebuilt result truth
- affected-scope and reuse direction
- ownership boundaries between worker, runtime acceptance, Browser, Console, and viewer presentation

This doc does not cover:
- one final scheduler implementation
- one final worker-pool topology
- detailed UI layout for Browser or viewport surfaces
- export product design
- every later implementation phase in full detail

## Doc Body

### Short Version

The worker should feel fast because it does less obsolete work, less unrelated work, and because it tells the truth about what happened.

ParaHook should not chase responsiveness by faking finality, hiding retained state, or widening rebuilds more than the dependency graph requires.

The worker vision is therefore:
- latest intent should win
- accepted truth should stay explicit
- draft and authoritative work should remain different promises
- unaffected results should stay retained
- rebuild scope should narrow to the real affected downstream cone
- scheduling and presentation should stay explainable

This should now be read as a generation ladder instead of one flat destination.

### Worker Generations

The worker should be described as evolving through explicit generations.

The point of the generations is not branding.

The point is to make it easy to say:
- what we already have
- what we are adding next
- what should wait for a later generation instead of being smuggled into the current one

#### Generation 1 - Typed Graph Worker

This is the current shipped worker baseline.

`Generation 1` means ParaHook already has:
- one real app-to-worker graph-native contract
- explicit request identity and execution intent
- deterministic worker execution
- typed progress, result, and error messages
- accepted runtime truth owned outside the worker
- bundle-first rebuilt, retained, and evicted result semantics
- the first honest split between draft-facing and authoritative-facing intent

What `Generation 1` does well:
- computes requested build work
- keeps the worker boundary graph-native
- preserves accepted-result correctness
- keeps product truth outside the worker

What `Generation 1` does not yet fully do:
- aggressively stop obsolete work
- narrow rebuild scope to the smallest true affected downstream cone
- fully recompose retained plus rebuilt branch outputs in every partial-build case
- make worker interruption-and-restart the dominant runtime behavior

In short:

`Generation 1` is a correct, typed, graph-native worker.

It is not yet the fully intent-aware, selectively rebuilding, retained-result-maximizing worker.

#### Generation 2 - Retained Truth And Affected-Subgraph Worker

This generation makes the worker narrower and more reuse-aware.

`Generation 2` is where the runtime should become able to:
- rebuild only the changed node and its true downstream dependency cone
- retain unaffected siblings
- recompose downstream outputs from retained plus rebuilt results
- preserve accepted truth without silently replacing whole accepted surfaces with partial snapshots
- narrow shared-reference downstream rebuilds to only the objects that truly reference the changed upstream entity or sub-entity

The main promise of `Generation 2` is:
- unrelated branches should stop rebuilding just because they share a preview surface
- known-good outputs should stay alive while affected branches update
- partial worker rebuilds should converge on one honest accepted result
- shared-reference edits should eventually stop widening to every downstream object when only some downstream consumers actually reference the changed entity

This generation is mainly about:
- downstream-only invalidation
- retained sibling preservation
- retained-plus-rebuilt recomposition
- reference-level downstream invalidation from shared upstream sources
- preserving correctness while reducing unrelated rebuild churn

This generation is where affected-subgraph invalidation and retained sibling recomposition become first-class worker behavior rather than isolated special cases.

`Worker 9` belongs to the start of this generation.

`Worker 10` should also belong to this generation.

That later lane should make one additional requirement real:
- when a user changes a shared upstream reference, the worker should eventually rebuild only the downstream objects that truly reference the changed upstream entity or sub-entity
- it should not automatically rebuild every downstream object just because those objects all originate from the same shared upstream node

Architecturally, `Worker 10` should be the first explicit proof of reference-level downstream invalidation.

That means:
- the architecture should not define `Worker 10` as "the sketch-specific worker"
- shared sketch profiles should be the first proof case, not the whole definition
- later shared-reference families should be able to reuse the same rule when they also depend on one shared upstream source but only some downstream consumers reference the changed part

Concrete example:

- `Sketch 1` contains five profiles
- each profile feeds a different downstream `Extrude`
- those extrudes publish five visible objects
- if the user changes the width of `Profile 1`
- the runtime should eventually know that only `Object 1` is affected
- `Object 2` through `Object 5` should stay retained if they do not reference the changed profile

In other words:

`Generation 2` should first narrow branch-local downstream rebuilds through `Worker 9`, then continue into shared-reference downstream narrowing through `Worker 10`, with shared sketch profiles as the first proof surface.

Additional `Generation 2` goals:

- `Stable Reference Identity`
  The runtime should become able to tell when an upstream reference before an edit is still the same logical reference after the edit. Without stable identity, narrow downstream rebuilds cannot stay trustworthy.
- `Reference-Level Dependency Mapping`
  Downstream nodes should eventually know which upstream reference or sub-entity they depend on, not only which upstream node they came from. This is the real basis for `only Object 1 rebuilds`.
- `Safe Widening When Uncertain`
  If the worker cannot prove the affected set narrowly, it should widen honestly instead of pretending. `Generation 2` should prefer broader-but-correct invalidation over narrow-but-wrong invalidation.
- `Topology Change Versus Parameter Change`
  The worker should distinguish between a local parameter edit that preserves reference identity and a topology-changing edit that may invalidate or reshape downstream references. Parameter-preserving edits should stay narrow when they can; topology-changing edits may widen when reference identity can no longer be proven stable.
- `Retained Sibling Recomposition`
  When one branch rebuilds, unaffected sibling results should remain visible through explicit retained-plus-rebuilt recomposition instead of being dropped or silently replaced by a partial worker snapshot.

#### Generation 3 - Latest-Intent Superseding Worker

This generation makes the worker truly latest-intent-driven during execution, not only narrower in what it rebuilds.

`Generation 3` is where the worker should become able to:
- be interrupted when newer relevant parameters arrive
- stop obsolete in-flight work safely
- restart from the newer surviving parameters instead of continuing stale computation
- make interruption and restart a normal runtime behavior instead of a rare special case
- converge on the newest relevant parameter state instead of faithfully completing every intermediate drag value

The main promise of `Generation 3` is:
- the worker should spend time on the newest relevant parameter state
- the runtime should stop paying full cost for work that is already obsolete
- interruption should preserve correctness instead of corrupting retained or accepted truth

Concrete example:

- if the user drags `Extrude depth` through `10 -> 50 -> 5 -> 60`
- the system should not fully build and publish every intermediate B-rep result
- once `50` arrives, `10` is obsolete for that same target
- once `5` arrives, `50` is obsolete
- once `60` arrives, `5` is obsolete
- the runtime should converge on `60`, not proudly finish the old story first

This generation is not just ordinary input debouncing.

Debouncing may still exist as a helper at the input edge, but the architectural goal is deeper:
- newer intent supersedes older intent for the same build target
- stale in-flight work notices that it is obsolete
- stale work exits at safe checkpoints
- the worker restarts or continues from the newest surviving parameters
- only the newest relevant result is allowed to count as the current answer

This generation keeps the same core value that already mattered in older supersession planning:
- the newest relevant intent should win
- obsolete work should stop
- the worker should continue from the new parameters, not finish the old story first

Important planning rule:

- the older `Worker-Vision-1/2/3` docs captured related values
- but they are now stale as the canonical planning surface for this later generation
- `Generation 3` should get fresh plan docs when this lane becomes active again

This generation is mainly about:
- latest-intent supersession
- interruption
- cooperative interruption and restart
- restart from newer parameters
- latest-value-wins execution during runtime
- safe stopping without weakening accepted-result correctness

Additional `Generation 3` goals:

- `Latest-Intent Supersession`
  Newer parameter states for the same build target should replace older parameter states instead of joining a long queue of stale work.
- `Cooperative Interruption`
  In-flight work should stop at safe checkpoints when it becomes obsolete. The goal is safe exit, not hard interruption that risks corrupting runtime state.
- `Restart From Newest Parameters`
  After stale work stops, the runtime should restart from the newest surviving parameters instead of resuming or finishing the obsolete request.
- `Single Active Story Per Target`
  The runtime should prefer one active build plus the newest pending replacement for a given target, not a backlog of every intermediate drag value.
- `Only The Latest Result Can Win`
  Even if an older request finishes late, it should not become the accepted current answer once a newer relevant request exists.
- `In-Flight Obsolete Detection`
  The worker should be able to ask whether it is still the newest relevant request for the current target before expensive work starts, between meaningful phases, and before publication.
- `Safe Stop Without Truth Corruption`
  Interrupting obsolete work must not corrupt accepted truth, retained truth, caches, or recomposition state.
- `Interaction Churn Compression`
  Rapid parameter streams such as `10 -> 50 -> 5 -> 60` should converge toward the newest relevant state instead of fully computing every intermediate B-rep result.
- `Explainable Runtime Narration`
  The runtime should be able to say that work started, was superseded, stopped, restarted from newer parameters, or was accepted as the newest surviving result.

#### Generation 4 - User-Directed Cost And Multi-Lane Runtime Worker

This generation makes the worker feel like an explicit runtime system instead of a single hidden background task.

`Generation 4` is where ParaHook could eventually support:
- stronger user-facing cost controls
- per-output or per-build-unit execution choices where they are useful
- richer coexistence of retained base truth plus in-flight overlay truth
- clearer separation or parallelism between draft and authoritative execution lanes when the repo truly needs both at once
- a runtime experience where the user can understand not only what built, but what was intentionally held, reused, or deferred

The main promise of `Generation 4` is not simply more speed.

It is more understandable control over speed, cost, and truth.

This generation should only happen if the earlier generations already made runtime ownership and accepted truth strong enough to support it cleanly.

Additional `Generation 4` goals:

- `User-Directed Cost Control`
  Users should be able to choose meaningful cost-versus-responsiveness behavior instead of inheriting one hidden runtime policy for every kind of work.
- `Separate Runtime Lanes`
  Draft, authoritative, retained-context, and later export-oriented execution should remain distinguishable lanes with different promises instead of collapsing into one ambiguous background task.
- `Parallel Lane Capability`
  When the repo truly needs it, different runtime lanes should be able to progress independently instead of always serializing behind one shared execution path.
- `Lane-Specific Relevance Rules`
  Each lane should know when its result is still relevant. A late result from one lane should not override newer more relevant truth from another lane without an explicit rule that says it can.
- `Hold, Reuse, And Defer As First-Class Behavior`
  The runtime should be able to intentionally hold known-good truth, reuse retained truth, or defer expensive work and still explain that state clearly.
- `Per-Target Cost Policy`
  Different outputs or build targets should eventually be allowed to use different runtime policies when that distinction is materially useful and still understandable.
- `Presentation Matches Runtime Truth`
  If the user is seeing retained base truth, an in-flight overlay, deferred authoritative work, or held final truth, the presentation should reflect that exact runtime state instead of flattening everything into one generic building story.
- `Predictable Policy Over Hidden Magic`
  More runtime power should not make the system more mysterious. Users should be able to form a reliable mental model of what runs live, what waits, what reuses retained truth, and what requires explicit finalization.
- `Export And Final Isolation`
  Export-grade or final-grade work should stay isolated from cheaper interactive shortcuts unless one explicit policy says otherwise.
- `Explainable Multi-Lane Runtime`
  The runtime should be able to narrate what is active, what is retained, what is deferred, what is waiting for release or manual trigger, and why the currently visible result is the one on screen.

#### Generation Boundaries

Use the generations as a scoping rule:

- if a change is about making the current worker contract real and honest, it is still `Generation 1`
- if a change is about retained sibling preservation, recomposition, and real downstream-only invalidation, it is `Generation 2`
- if a change is about worker interruption, safe stop, and restart from newer parameters, it is `Generation 3`
- if a change is about richer user-directed cost control or true multi-lane runtime behavior, it is `Generation 4`

Important rule:

later generations should build on earlier ones, not bypass them.

For example:
- `Generation 2` should not fake narrow rebuild truth if `Generation 1` accepted-result ownership is still unclear
- `Generation 3` should not interrupt work aggressively if `Generation 1` accepted-result safety and `Generation 2` retained-result truth are still ambiguous
- `Generation 4` should not expose more user controls if the earlier generations still leave runtime truth ambiguous

### Core Values

#### 1. Correctness Before Cleverness

The worker may become faster, narrower, and more opportunistic over time.

But those gains must sit on top of correctness, not replace it.

That means:
- stale-drop and accepted-result checks remain the safety net
- retained outputs are preserved only when they are still honest
- partial worker execution must never masquerade as complete accepted truth
- cache reuse, supersession, and preview shortcuts must fail safe

Fast wrong answers are not a win.

Cheap misleading answers are not a win.

#### 2. Latest Intent Wins

The worker should spend effort on what the user currently means, not on obsolete intermediate work that happened to start first.

That means:
- newer relevant requests supersede older requests for the same runtime target
- waiting work should be replaceable
- in-flight work should stop cooperatively when it becomes obsolete
- runtime surfaces should say when work was superseded instead of pretending it completed normally

The worker should converge on the newest surviving intent, not proudly finish stale work.

#### 3. Explicit Truth Beats Hidden Heuristics

The worker family should prefer named policies and explicit runtime facts over silent behavior that only makes sense if you already know the implementation.

That means:
- draft policy should be explicit
- authoritative policy should be explicit
- retained, rebuilt, evicted, delayed, released, replaced, and superseded states should be explicit
- viewer and Browser surfaces should read shared runtime truth instead of inventing their own interpretations

If the system is doing something meaningful, it should be possible to name that thing clearly.

#### 4. Draft And Authoritative Are Different Promises

Draft work is allowed to be cheaper, faster, and interaction-oriented.

Authoritative work is allowed to be slower, more conservative, and final-oriented.

Those two lanes should stay distinct.

That means:
- draft should not silently count as final
- final should not silently fall back to ordinary draft and pretend nothing changed
- viewport preferences should remain honest about which lane is visible and why
- accepted draft truth and accepted authoritative truth should remain separate facts even when they coexist

Responsiveness matters.

So does not lying about whether the user is looking at draft or final truth.

#### 5. Retain Known Good Work

When a change does not invalidate some existing result, ParaHook should preserve that result instead of throwing it away just because a nearby branch changed.

That means:
- accepted retained results are a feature, not a temporary hack
- sibling outputs should remain visible when they are unaffected
- downstream composition should recompose from rebuilt plus retained outputs
- preserved older accepted truth may remain useful while newer work is still pending, as long as presentation stays honest about relevance and freshness

The worker should not erase value it already has unless the dependency graph says that value is no longer valid.

#### 6. Rebuild Only The Real Affected Downstream Cone

Changing one node should not imply broad rebuild churn across unrelated branches.

The intended direction is:
- rebuild the changed node
- rebuild its true downstream dependents
- keep upstream sources untouched unless they were actually edited
- keep unrelated siblings retained

This is the core reason affected-subgraph invalidation matters.

The worker should become narrower because the graph truth becomes clearer, not because result labels become more optimistic.

#### 7. Runtime Acceptance Owns Accepted Truth

The worker executes and emits results.

The graph runtime accepts, retains, promotes, recomposes, or rejects those results.

Browser, Console, and viewer surfaces should remain downstream consumers of that accepted truth.

That means:
- accepted bundle truth stays runtime-owned
- retained-versus-rebuilt classification should not be reinvented in UI selectors
- artifact emission should not fabricate retained siblings on its own
- viewer presentation should not decide freshness or validity

The more advanced the runtime becomes, the more important it is to keep this ownership split clean.

#### 8. User Cost Control Should Be Real

The worker should eventually support meaningful control over cost, not just one hidden fixed policy.

That means the architecture should be able to support:
- cheaper interactive behavior when fast feedback matters most
- more expensive authoritative behavior when exactness matters most
- explicit timing differences such as live, release, settle, manual, or off where those differences are genuinely meaningful
- later per-output or per-build-unit control if that becomes useful

But those controls must remain understandable.

A bigger policy surface is only worth it if users can predict what the runtime will do.

#### 9. Shared Runtime Truth Should Be Explainable

If a user asks "what is building, what is waiting, what was reused, what got retained, and why is this still visible?" the system should have one coherent answer.

That answer should come from shared runtime truth, not from separate app features each guessing independently.

That means:
- runtime state should be rich enough to narrate what happened
- Console should narrate, not invent
- Browser should summarize, not reinterpret
- viewport presentation should reflect the accepted/runtime state it was given

A worker system that cannot explain itself will eventually become impossible to trust.

### Ownership North Star

The clean long-range ownership split is:

- the app decides when to request work and with what policy
- the dispatcher transports and sequences requests
- the worker computes requested build work
- runtime acceptance decides what becomes accepted truth
- Browser and Console narrate shared truth
- the viewer renders the selected presentation of that truth

In simpler terms:

- the worker computes
- runtime accepts
- UI explains
- the viewer shows

Future work should be reviewed against that split.

If a phase needs viewer heuristics to explain worker state, the worker/runtime contract is probably still too weak.

If a phase needs the worker to own app policy or accepted-state meaning, ownership has drifted upward.

### Scheduling North Star

The intended runtime behavior is not "everything runs immediately."

The intended runtime behavior is:
- run the newest relevant work
- delay or suppress work intentionally when policy says to
- stop obsolete work when possible
- preserve accepted truth while newer work is pending
- promote newer truth only when it is still relevant and honestly accepted

From that perspective:

- supersession is about efficiency without losing correctness
- draft policy is about responsiveness without pretending to be final
- authoritative policy is about conservative convergence without chasing every transient intermediate value

The worker should feel intentional, not merely busy.

### Result Truth North Star

The accepted result model should keep getting stronger, not blurrier.

That means:
- accepted bundles should stay the durable truth surface for rebuilt, retained, and evicted results
- draft and authoritative accepted lanes should remain explicit where both matter
- partial branch rebuilds should merge into accepted truth honestly instead of replacing whole accepted surfaces with partial snapshots
- output surfaces should be downstream consumers of recomposed accepted truth

The worker vision does not want a fast path that makes result ownership ambiguous.

It wants a fast path that still converges on one honest accepted answer.

### Relevance And Presentation North Star

ParaHook should be allowed to keep useful retained context visible while newer work is pending.

But presentation must stay honest about what is:
- current
- retained
- stale
- draft
- authoritative

That means:
- retained final context may stay visible while a newer draft or authoritative result is still pending
- a stale authoritative completion must not replace newer current intent
- disconnected dependencies should clear retained visibility when the retained result is no longer valid
- presentation polish must remain downstream from relevance truth

The viewer may become richer.

It should not become the place where truth is guessed.

### Guardrails For Later Worker Phases

Future worker work should preserve these guardrails:

- do not make the runtime faster by hiding whether work was delayed, suppressed, superseded, or retained
- do not let draft responsiveness weaken authoritative honesty
- do not let authoritative visibility weaken latest-intent safety
- do not let `Output Preview` or any other composition surface become a reason to rebuild unrelated siblings
- do not let partial worker bundles silently replace whole accepted geometry truth
- do not move accepted-result meaning into Browser, Console, or viewer heuristics
- do not widen worker rebuild scope just because changed-input classification is still coarse
- do not widen policy vocabulary unless the runtime can narrate the added distinction clearly

### Practical Review Questions

When reviewing a future worker phase, the most useful questions are:

- does this make the newest relevant intent win more reliably or more efficiently
- does this preserve accepted-result correctness if the new optimization fails
- does this make runtime truth more explicit or more implicit
- does this narrow rebuild or scheduling scope honestly, or only cosmetically
- does this preserve retained valid work instead of throwing it away
- does this keep draft and authoritative promises distinct
- does this keep ownership with the runtime instead of pushing meaning into UI heuristics

If a proposed change cannot answer those questions cleanly, it likely needs another pass before it becomes architecture truth.

### Family Handoff

This vision should remain the long-range companion doc for the `Worker` family.

Implementation-ready work should continue to live in standalone phase docs.

The current family shape is:
- `Worker-Index.md`
  - shipped worker boundary and family index
- `Worker-Vision.md`
  - core values and long-range runtime direction
- `Worker-Vision-1`
  - latest-intent supersession and cooperative abort
- `Worker-Vision-2`
  - explicit draft scheduling policy
- `Worker-Vision-3`
  - explicit authoritative scheduling and final acceptance behavior
- `Worker 9+`
  - affected-subgraph invalidation, retained sibling recomposition, and later worker-runtime precision lanes
