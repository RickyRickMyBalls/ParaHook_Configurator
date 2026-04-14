# Worker Generation 2 Index

## Doc Header

### Doc History
5. 2026-04-14 11:36:43: Converted the `Generation 2` ladder into an explicit `Worker - N` roadmap index with checklist-style `## [ ]` phase sections, placing `Worker 9` through `Worker 13` into their proper Gen 2 slots and turning the still-missing identity, dependency, widening, and capstone work into forward-numbered `Worker 14` through `Worker 19` slots so this file now reads like a real family index instead of a generic numbered essay
4. 2026-04-14 11:33:23: Reorganized this `Generation 2` umbrella so it no longer reads like the current viewport honesty lanes are the whole generation, explicitly separating the Gen 2 story into foundation work, supporting retained-truth honesty lanes, the still-missing shared-reference architecture core, and the final proof/generalization ladder while keeping `Worker 13` aligned as support work rather than a narrowing of the full Gen 2 vision
3. 2026-04-14 11:18:12: Added `Worker 13` to the `Generation 2` umbrella as the shared-output-composition locality lane, recording that retained-truth presentation is not honestly complete until branch-local preview behavior inside one composed `Output Preview` surface is scoped at the output-entry level instead of leaking across untouched siblings
2. 2026-04-14 10:17:51: Added `Worker 12` to the `Generation 2` umbrella as a supporting request-dispatch honesty lane, recording that unresolved output continuation must stop fake worker dispatch before later affected-subgraph and retained-truth phases can be judged cleanly
1. 2026-04-13 18:45: Created this `Generation 2` umbrella planning doc so the worker family now has one explicit place to map the Gen 2 values in `Worker-Vision.md` to a concrete phase ladder across local branch narrowing, retained-result presentation, shared-reference identity, dependency mapping, safe widening, and the first reusable proof of reference-level downstream invalidation

### Purpose

This doc defines the phase ladder for ParaHook's `Worker` `Generation 2`.

Use it to answer:
- what `Generation 2` is trying to accomplish
- which values are non-negotiable for the generation
- which already-written worker docs belong to `Generation 2`
- how foundation work, support lanes, and still-missing architecture core fit together
- what phases still need to land before `Generation 2` is honestly complete
- how to sequence local branch narrowing, retained truth, shared-reference identity, and reference-level invalidation without smuggling `Generation 3` behavior in too early

### Why This Doc Exists

`Worker-Vision.md` now says `Generation 2` is the `Retained Truth And Affected-Subgraph Worker`.

That gives the right north star, but the actual planning surfaces are currently spread across:
- `Worker-Vision.md`
- `Worker_Phase Worker 9 - Affected Subgraph Invalidation And Retained Sibling Recomposition.md`
- `Worker_Phase Worker 10 - Last-Committed Viewport Baseline During Live Preview.md`
- `Worker_Phase Worker 11 - Viewport Result Presentation Contract.md`
- `Worker_Phase Worker 12 - Skip Worker Dispatch For Unresolved Output Continuation.md`
- `Worker_Phase Worker 13 - Output Entry Locality Inside Shared Output Composition.md`

Those docs are useful, but they do not yet give one generation-level phase ladder that answers:
- what is foundation work versus supporting presentation work
- what still has to happen after the first local `Extrude` proof
- how stable reference identity and reference-level dependency mapping should enter the roadmap
- where safe widening and topology-change rules fit

This doc exists to provide that ladder.

Important reading rule:
- this file must not let the currently painful viewport or preview bugs redefine the whole generation
- `Generation 2` is broader than the active support fixes
- the support fixes matter because presentation must stay honest, but they do not replace the deeper identity, dependency, and widening work that actually completes the generation

Important planning rule:
- `Worker 9`, `Worker 10`, and `Worker 11` remain the concrete implementation-ready docs
- this file is the generation-level umbrella that decides how those docs fit together
- future implementation-ready phase docs can be spun out from this file as the later Gen 2 slots become active

### Scope

This doc covers:
- the `Generation 2` values
- the Gen 2 phase ladder
- sequencing rules between the worker, runtime acceptance, and viewport presentation seams
- the completion bar for saying `Generation 2` is actually done

This doc does not cover:
- `Generation 3` interruption and restart behavior
- final worker-pool topology
- export execution policy
- full history scrubber UX
- detailed per-file implementation notes for every already-existing worker phase doc

## Doc Body

### Short Version

`Generation 2` is the worker generation where ParaHook stops treating every meaningful graph edit like broad scene churn.

The worker should instead become able to:
- rebuild only the changed node and its true downstream cone
- retain unaffected siblings
- present retained truth honestly while affected work updates
- distinguish parameter-preserving edits from topology-changing edits
- narrow shared-reference rebuilds to only the downstream consumers that actually depend on the changed reference
- widen honestly when the runtime cannot prove a narrow affected set

If `Generation 1` made the worker graph-native and typed, `Generation 2` should make it selective, retained-truthful, and dependency-honest.

### Generation 2 Values

The values below come from `Worker-Vision.md` and should be treated as the lock for every phase in this file.

#### 1. Stable Reference Identity

The runtime must become able to recognize when an edited upstream entity is still the same logical reference after the edit.

Without this, narrow downstream invalidation becomes guesswork.

#### 2. Reference-Level Dependency Mapping

Downstream nodes must eventually know which upstream reference or sub-entity they depend on, not only which upstream node produced them.

This is the basis for:
- `Profile 1 changed`
- therefore only the downstream object that depends on `Profile 1` rebuilds

#### 3. Safe Widening When Uncertain

If ParaHook cannot prove a narrow affected set, it should widen honestly.

Broader-but-correct is better than narrow-but-fake.

#### 4. Topology Change Versus Parameter Change

The worker must distinguish:
- edits that preserve reference identity and can stay narrow
- edits that reshape or destroy reference identity and may need to widen

#### 5. Retained Sibling Recomposition

When one branch rebuilds, unaffected sibling results should remain visible and accepted through explicit retained-plus-rebuilt recomposition.

### Current Gen 2 Map

The current worker-family docs fit into `Generation 2` like this:

- `Worker 9`
  - core runtime foundation for affected-subgraph narrowing and retained sibling recomposition
- `Worker 10`
  - viewport truth hardening so retained-versus-rebuilt runtime truth stays visible and honest during interaction
- `Worker 11`
  - locked presentation contract so Gen 2 retained truth has one stable user-facing story
- `Worker 12`
  - request-dispatch honesty guardrail so unresolved output continuation does not send fake worker work while the generation is trying to narrow and present retained truth honestly
- `Worker 13`
  - output-entry-level locality hardening so one local edit inside a shared composed output surface does not visually classify untouched siblings as part of the active preview

Important sequencing clarification:
- `Worker 10` and `Worker 11` are supporting Gen 2 honesty phases
- they help make retained truth visible
- they do not replace the still-missing shared-reference identity and dependency-mapping phases that finish the generation
- `Worker 12` is also supporting rather than foundational
- it keeps unresolved upstream disconnects from looking like valid local worker work
- it should stay narrow and should not replace the core affected-subgraph, identity, or dependency-mapping phases
- `Worker 13` is another supporting retained-truth honesty lane
- it hardens locality inside one shared composed surface after the simpler branch-local proofs, but it still does not replace the later identity and dependency-mapping phases

### Generation 2 Organization

Read `Generation 2` as four layers of work:

#### 1. Foundation

- `Worker 9`
  - affected-subgraph narrowing
  - retained sibling recomposition
  - first proof that one local branch edit should not force unrelated branch churn

This is the first hard requirement for saying Gen 2 is real at all.

#### 2. Supporting Retained-Truth Honesty Lanes

- `Worker 10`
  - drag/release/settle viewport honesty for retained-versus-rebuilt truth
- `Worker 11`
  - stable viewport presentation contract so the user-visible story stops drifting
- `Worker 12`
  - unresolved-output dispatch honesty so fake worker work does not contaminate later Gen 2 reads
- `Worker 13`
  - output-entry locality inside one shared composed output surface so untouched siblings do not get visually reclassified as part of the active preview

These lanes are important, but they are support work.

They help ParaHook tell the truth about Gen 2 behavior.

They are not the whole architecture of Gen 2.

#### 3. Still-Missing Architecture Core

- stable shared-reference identity
- reference-level dependency mapping
- parameter-preserving versus topology-changing classification
- honest widening when narrow proof is unavailable

This is the biggest remaining center of gravity for the generation.

If these phases do not land, Gen 2 remains a partly hardened presentation story sitting on top of incomplete shared-reference invalidation truth.

#### 4. Capstone Proof And Generalization

- first end-to-end shared-reference downstream narrowing proof
- reuse of the same model outside the first proof family

This is where Gen 2 stops being:
- one local branch proof
- plus several honesty patches

and becomes:
- a reusable worker/runtime rule set

### Big-Picture Rule

Do not narrow `Generation 2` down to:
- only viewport styling honesty
- only one `Extrude` proof family
- only the currently active bug queue

The full Gen 2 vision remains:
- narrower true downstream rebuild scope
- retained sibling preservation
- honest retained-versus-rebuilt presentation
- shared-reference identity
- dependency-aware downstream invalidation
- explicit widening when certainty is missing

### Phase Ladder

The `Generation 2` roadmap should be read through explicit `Worker - N` slots.

The slots below are not all the same kind of work:
- `Worker 9` is the first foundation proof
- `Worker 10` through `Worker 13` are supporting honesty lanes
- `Worker 14` through `Worker 17` are the still-missing architecture core
- `Worker 18` and `Worker 19` are the capstone proof and generalization passes

## [ ] Worker - 9 - Affected Subgraph Invalidation And Retained Sibling Recomposition

Standalone future doc:
- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker 9 - Affected Subgraph Invalidation And Retained Sibling Recomposition.md`

Role in `Generation 2`:
- turn the graph-native worker into a selective worker that rebuilds only the true affected downstream scope while keeping retained truth honest

Owns:
- affected-subgraph invalidation
- retained sibling preservation and recomposition for local branch edits

What this phase must make true:
- branch-local parameter edits stay local to the changed authored branch and its real downstream cone
- unaffected sibling outputs remain retained
- downstream composition surfaces such as `Output Preview` recompose from retained plus rebuilt outputs instead of forcing broad sibling rebuilds

Why this phase comes first:
- it is the first proof that `Generation 2` is about real worker scope reduction, not just nicer wording around already-broad work

Done when:
- the first parallel-branch `Extrude` proof stays narrow through the actual worker request/build path
- retained sibling bundle truth remains explicit and accepted-result-owned
- unrelated sibling rebuild churn stops for the targeted proof graph

## [ ] Worker - 10 - Last-Committed Viewport Baseline During Live Preview

Standalone future doc:
- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker 10 - Last-Committed Viewport Baseline During Live Preview.md`

Role in `Generation 2`:
- supporting retained-truth honesty lane

Goal:
- make the viewport tell the truth about retained versus rebuilt work during drag, release, and settle behavior

What this phase must make true:
- the pre-edit committed baseline remains visible while the changed branch previews above it
- unchanged siblings stay visually stable and keep ordinary loaded presentation
- retained sibling entries in an accepted bundle do not automatically become preview overlay members
- settled scenes still show the full loaded result, including retained siblings

Why this phase is still Gen 2:
- `Generation 2` is not only about internal narrowing
- it is also about making retained truth visible and honest to the user

Done when:
- branch-local edits no longer visually look like broad whole-scene preview churn
- the viewport now has a stable retained-baseline live-preview story to hand forward into later Gen 2 work

## [ ] Worker - 11 - Viewport Result Presentation Contract

Standalone future doc:
- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker 11 - Viewport Result Presentation Contract.md`

Role in `Generation 2`:
- supporting retained-truth honesty lane

Goal:
- freeze one stable user-visible contract for retained versus rebuilt viewport presentation

What this phase must make true:
- viewport result classes and presentation states have one stable story
- unchanged siblings do not flicker, dim, disappear, or inherit preview styling during local edits
- the viewport presentation contract is stable enough that later Gen 2 runtime phases can be judged against one fixed user-visible story

Done when:
- later Gen 2 runtime and selector work can be reviewed against one fixed viewport contract instead of moving UI semantics

## [ ] Worker - 12 - Skip Worker Dispatch For Unresolved Output Continuation

Standalone future doc:
- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker 12 - Skip Worker Dispatch For Unresolved Output Continuation.md`

Role in `Generation 2`:
- supporting request-honesty guardrail

Goal:
- stop fake worker work from being dispatched when downstream output continuation is unresolved

What this phase must make true:
- unresolved upstream disconnects do not produce dispatchable build targets
- request translation and app dispatch stay honest before later Gen 2 narrowing and presentation behavior are judged

Done when:
- broken output continuation no longer looks like valid local worker work

## [ ] Worker - 13 - Output Entry Locality Inside Shared Output Composition

Standalone future doc:
- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker 13 - Output Entry Locality Inside Shared Output Composition.md`

Role in `Generation 2`:
- supporting retained-truth honesty lane for shared composed surfaces

Goal:
- keep one local edit inside one shared `Output Preview` surface from visually reclassifying untouched sibling outputs

What this phase must make true:
- changed output entries alone receive branch-local preview treatment
- untouched sibling output entries stay ordinary loaded/base during drag
- untouched sibling output entries remain visible after settle

Done when:
- shared composed output surfaces no longer make untouched siblings dim, yellow, or disappear merely because one sibling changed

## [ ] Worker - 14 - Stable Shared-Reference Identity

Goal:
- create the first durable identity rules for shared upstream references so downstream narrowing can survive edits that preserve logical identity

Planning home for now:
- this `Worker-Index-Gen2.md` umbrella

This worker should answer:
- what makes one upstream reference the same logical reference before and after an edit
- which edits preserve identity
- which edits destroy identity
- what identity token or mapping the worker/runtime can trust across request revisions

What this phase must make true:
- shared upstream entities such as sketch profiles can carry stable identity across parameter-preserving edits
- the runtime can tell the difference between:
  - `same profile, changed dimensions`
  - `new or structurally different profile identity`

Important rule:
- do not fake identity stability when the underlying source cannot prove it

Done when:
- one shared-reference family has an explicit identity rule that survives ordinary parameter edits
- that identity rule is available to later dependency mapping without relying on viewer or Browser heuristics

## [ ] Worker - 15 - Reference-Level Dependency Mapping

Goal:
- move from node-level dependency knowledge to reference-level dependency knowledge

Planning home for now:
- this `Worker-Index-Gen2.md` umbrella

This worker should answer:
- which downstream node depends on which upstream reference or sub-entity
- where that mapping is stored
- how it is derived during compile/build preparation
- how it is surfaced to invalidation routing without leaking product-specific UI concerns into the worker boundary

What this phase must make true:
- downstream consumers can declare or receive dependency metadata that names the actual upstream entity they use
- worker invalidation can target:
  - `the consumers of Profile 1`
  - not just `the consumers of Sketch 1`

Important rule:
- keep the mapping graph-native and runtime-usable
- do not hide it only inside viewport or Browser presentation layers

Done when:
- at least one shared-reference family has real dependency metadata from upstream entity to downstream consumer
- the mapping is precise enough to drive the next narrowing phase

## [ ] Worker - 16 - Parameter-Preserving Versus Topology-Changing Classification

Goal:
- classify edits so the runtime knows when narrow invalidation is safe and when honest widening is required

Planning home for now:
- this `Worker-Index-Gen2.md` umbrella

This worker should answer:
- which edit kinds preserve stable reference identity
- which edit kinds can change, split, merge, or destroy reference identity
- how that classification reaches invalidation and routing code

What this phase must make true:
- local parameter edits can stay narrow when identity survives
- topology-changing edits can widen without ambiguity or hidden fallback behavior
- the runtime no longer treats all shared-source edits as one undifferentiated class

Done when:
- at least one shared-reference family has an explicit edit classifier
- invalidation logic can branch on:
  - parameter-preserving edit
  - topology-changing edit

## [ ] Worker - 17 - Honest Widening Policy And Explainable Invalidations

Goal:
- freeze the rules for when ParaHook must widen because narrow proof is missing, stale, or invalidated

Planning home for now:
- this `Worker-Index-Gen2.md` umbrella

This worker should answer:
- what uncertainty conditions trigger widening
- whether widening happens at request translation, compile-time dependency derivation, or worker routing
- how the runtime explains a widened rebuild in logs, stats, or debug surfaces

What this phase must make true:
- narrow invalidation is never used when the proof is incomplete
- widened rebuilds remain explicit and understandable
- the system prefers correctness and explainability over optimistic-but-wrong reuse

Important rule:
- do not allow silent fallback from precise to broad behavior with no way to inspect why it widened

Done when:
- the active proof family has explicit widening triggers
- debug/runtime narration can explain why a rebuild stayed narrow or widened

## [ ] Worker - 18 - Shared-Reference Downstream Narrowing First Proof

Goal:
- land the first full end-to-end proof that one shared upstream edit rebuilds only the downstream consumers that truly depend on the changed reference

First recommended proof surface:
- one sketch with multiple profiles
- multiple downstream `Extrude` consumers
- one profile-local change
- only the dependent downstream object rebuilds

What this phase must make true:
- stable identity exists for the shared upstream reference family
- reference-level dependency mapping exists for the downstream consumers
- parameter-preserving edits stay narrow
- topology-changing edits widen honestly when required
- retained siblings stay accepted and visible

Done when:
- `Profile 1` edits no longer force `Object 2` through `Object N` to rebuild when they do not depend on `Profile 1`
- the worker, runtime acceptance, and viewport all tell the same story about what changed and what stayed retained

## [ ] Worker - 19 - Generalization And Hardening

Goal:
- turn the first shared-reference proof into a reusable rule instead of a one-off sketch/extrude special case

What this phase must make true:
- the identity, dependency, and widening model can be reused by later shared-reference families
- Gen 2 behavior is covered by focused tests, runtime instrumentation, and phase-level proof graphs
- the codebase no longer relies on hidden special-case assumptions that only work for the first proof family

Done when:
- the Gen 2 rules are written as reusable worker/runtime policy rather than a single ad hoc path
- later node families can adopt the same narrowing model without redefining the generation

### Sequencing Rules

The phases above should be read with these locked ordering rules:

1. Do not start shared-reference narrowing before local branch narrowing and retained recomposition are real.
2. Do not trust reference-level dependency mapping before stable reference identity exists for the chosen proof family.
3. Do not keep narrow invalidation active for topology-changing edits unless the runtime can still prove identity safely.
4. Do not let viewport presentation become the hidden owner of retained truth; runtime acceptance remains the owner, and presentation reads from it.
5. Do not pull `Generation 3` interruption-and-restart work into this ladder before `Generation 2` retained truth is trustworthy.

### Completion Bar

`Generation 2` should be considered complete only when all of the following are true:

- local branch edits rebuild only the true downstream cone for the active proof families
- unaffected siblings remain retained and visibly stable
- retained-plus-rebuilt recomposition is explicit and accepted-result-owned
- at least one shared-reference family has:
  - stable reference identity
  - reference-level dependency mapping
  - parameter-versus-topology edit classification
  - honest widening rules
  - end-to-end downstream narrowing proof
- the viewport presentation contract still matches runtime truth during drag, release, and settle behavior

### Suggested Next Active Docs

The likely next doc sequence from this umbrella should be:

1. finish the remaining active `Worker - 9` retained recomposition work if any local branch gaps remain
2. finish the active supporting honesty lanes only as needed to keep retained truth readable and trustworthy:
   - `Worker - 10`
   - `Worker - 11`
   - `Worker - 12`
   - `Worker - 13`
3. spin out the first dedicated implementation-ready doc for `Worker - 14`
4. follow it with a dedicated implementation-ready doc for `Worker - 15`
5. then continue into `Worker - 16`, `Worker - 17`, and the first full shared-reference downstream narrowing proof under `Worker - 18`

### Guardrail Summary

If a change claims to help `Generation 2`, it should improve at least one of these without violating the others:
- narrower true downstream rebuild scope
- stronger retained sibling preservation
- more honest retained-versus-rebuilt presentation
- stronger reference identity and dependency proof
- clearer safe widening behavior

If it mainly improves interruption, restart, cancellation, or newest-intent takeover, it belongs to `Generation 3`, not here.
