# Worker Vision

## Doc Header

### Doc History
1. 2026-04-13 16:05: Created this long-range `Worker-Vision.md` companion doc for the `Worker` family so the repo now has one explicit place to record the worker's core values, north-star runtime direction, and guardrails around latest-intent execution, draft-versus-authoritative behavior, retained truth, and narrow affected-scope rebuilds

### Purpose

This doc defines the future runtime direction for the ParaHook `Worker`.

Use it to answer:
- what core values should guide later worker changes after the graph-native contract cleanup already shipped
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
- keep ownership boundaries stable while behavior grows
- make later worker phases easier to review against one shared standard
- prevent fast-feeling behavior from drifting into fake or ambiguous truth

The main implementation-ready follow-on docs currently live at:
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase Worker-Vision-1 - Request Supersession And Cooperative Early Abort.md`
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase Worker-Vision-2 - Draft Preview Scheduling And Settle Rules.md`
- `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase Worker-Vision-3 - Authoritative Scheduling And Final Acceptance Rules.md`
- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker 9 - Affected Subgraph Invalidation And Retained Sibling Recomposition.md`

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
