# Worker Vision

## Doc Header

### Doc History
6. 2026-04-09 21:10: Marked `Worker Vision Phase 2 - Draft Preview Scheduling And Settle Rules` shipped after the full dedicated `Worker-Vision-2` ladder landed, then added the dedicated future planning home `Future/Worker_Phase Worker-Vision-3 - Authoritative Scheduling And Final Acceptance Rules.md` so the family handoff now moves forward from closed draft-policy work into one implementation-ready authoritative scheduling surface
5. 2026-04-09 12:10: Refreshed `Worker Vision Phase 2 - Draft Preview Scheduling And Settle Rules` after the dedicated `Worker-Vision-2` future doc was tightened and split into internal `Phase 1` through `Phase 5`, so the family handoff now points at a Codex-sized draft-policy ladder instead of one larger single-pass phase
4. 2026-04-09 12:10: Marked `Worker Vision Phase 1 - Request Supersession And Cooperative Early Abort` shipped after the full `Worker-Vision-1` ladder landed and moved into `Shipped/`, then added the dedicated future planning doc `Future/Worker_Phase Worker-Vision-2 - Draft Preview Scheduling And Settle Rules.md` so the family handoff now points at one implementation-ready draft-policy surface instead of leaving `Phase 2` as an umbrella-only note
3. 2026-04-09 11:25: Added the dedicated future planning doc `Future/Worker_Phase Worker-Vision-1 - Request Supersession And Cooperative Early Abort.md`, then refreshed the first Worker Vision phase section so the latest-intent lane now points at one implementation-ready planning surface instead of remaining only as a short bottom-ladder note
2. 2026-04-09 11:23: Broke this Worker vision into an explicit bottom phase ladder with standalone `##` sections so the family now captures reasonable Codex-sized follow-ons for supersession, draft scheduling, authoritative scheduling, shared runtime publication, and later export/runtime reuse instead of leaving the forward direction only as one undifferentiated vision note
1. 2026-04-09 11:10: Added this dedicated Worker vision doc so the Worker family now has one forward-looking architecture surface for runtime scheduling, draft-versus-authoritative execution, supersession, and honest Browser plus viewport-inspector read rules beyond the already-shipped `5.3A` cleanup ladder

### Purpose

This doc captures the forward-looking Worker vision for ParaHook.

Use it to answer:
- what kind of worker system ParaHook should grow into next
- how draft preview and authoritative geometry should relate
- how runtime scheduling, supersession, and acceptance should behave
- how Browser, viewport, and `Viewport Runtime Inspector` should read worker truth without becoming second owners

Do not use it for:
- proof that a worker behavior already shipped
- detailed implementation sequencing
- phase-by-phase execution checklists

### Relationship To Other Worker Docs

- `Worker.md`
  - umbrella Worker family index
  - shipped `5.3A` seam summary
  - future worker family home

- `Worker-Vision.md`
  - forward-looking worker direction
  - scheduling and result-model north-star
  - later worker follow-on framing

## Doc Body

### North Star

ParaHook should grow toward one honest geometry-execution system whose runtime can support:
- fast draft preview during interaction
- authoritative geometry when the user wants final truth
- explicit accepted result identity
- efficient latest-intent scheduling instead of wasted obsolete work

The worker should become better at deciding:
- what work should run now
- what work should wait for release or settle
- what work is already obsolete and should stop early

The worker should not become a second product brain.

The app still owns:
- authored graph truth
- project/workspace truth
- user-facing mode selection
- acceptance of returned runtime truth

### Core Direction

#### 1. Latest Intent Wins

The worker system should behave as latest-intent execution, not as a FIFO history player for every intermediate drag value.

That means:
- newer requests supersede older requests for the same graph/runtime target
- obsolete in-flight work should stop as early as possible
- stale result dropping is necessary but not sufficient
- real efficiency requires cooperative supersession inside the worker pipeline, not only app-side ignore-on-return behavior

Important rule:
- correctness may still rely on stale-drop at the acceptance boundary
- efficiency should not rely on stale-drop alone

#### 2. Live Draft, Conservative Final

ParaHook should prefer live draft behavior over live authoritative behavior.

Recommended default direction:
- `Draft`
  - may update live when the current command cost allows
- `Authoritative`
  - should usually wait for release, settle, or explicit request unless a later proven-fast case justifies live authoritative rebuilds

Reason:
- as CAD commands, topology, dependency depth, and meshing complexity grow, even draft preview may become expensive
- authoritative geometry will become the costlier path even more quickly

Important rule:
- do not assume preview is permanently cheap
- keep room for preview scheduling choices such as `live` versus `on release`

#### 3. Scheduling Truth Must Stay Explicit

The worker system should expose explicit runtime scheduling truth such as:
- active request identity
- superseded request identity
- queued follow-up request identity
- result class:
  - `transient`
  - `draft`
  - `authoritative`
- why a build did or did not run:
  - live
  - waiting for release
  - waiting for settle
  - manual only
  - suppressed

This truth should become a shared read surface for:
- Browser
- Console
- `Viewport Runtime Inspector`

Those surfaces may format or summarize that truth.
They should not invent their own competing runtime story.

### Ownership Rules

#### App Owns

- graph edits and interaction state
- viewport mode selection such as `Auto / Draft / Final`
- user policy such as explicit build commands
- final acceptance of worker results

#### Worker Scheduler Owns

- latest-intent execution order
- supersession and early-abort checks
- lane-specific scheduling behavior
- request-local runtime progress

#### Worker Execution Owns

- deterministic execution of the request it was given
- draft and authoritative result generation
- request-scoped progress and errors

#### Browser Owns

- showing policy and content hierarchy only if that truth is real
- reading runtime scheduling and accepted result truth without inventing fake queue or output semantics

#### Viewport Runtime Inspector Owns

- viewport-local explanation of runtime truth
- queue, archive, and impact readout
- later scheduling explanation such as draft-versus-authoritative and superseded-versus-accepted meaning

Important rule:
- `Viewport Runtime Inspector` is a runtime explanation surface
- it is not the owner of worker semantics

### Result Direction

The long-range result model should allow draft and authoritative results to coexist honestly without confusing what the user is currently seeing.

Recommended shared rule:
- `transient`
  - immediate interaction-only approximation
- `draft`
  - worker-produced preview result
- `authoritative`
  - worker-produced final result

The runtime should keep explicit precedence and acceptance rules.

Good target behavior:
- transient feedback may appear instantly during interaction
- draft may replace older transient or older draft output
- authoritative may replace the accepted draft for the same output identity
- accepted runtime truth should always say which class is currently active and which classes remain available

### Viewport Relationship

`Auto / Draft / Final` should remain the main user-facing viewport/result concept.

Recommended meaning:
- `Auto`
  - let runtime choose the best currently available result class honestly
- `Draft`
  - prefer draft preview
- `Final`
  - prefer authoritative result

Important rule:
- viewport result preference and worker scheduling policy are related, but not identical
- the viewport should choose what kind of result to show
- the runtime should decide how and when that result is produced

This keeps the app from overloading one visible control with too many jobs.

### Browser Policy Direction

Browser-side build policy should not remain a broad second user-facing system unless it provides clear value beyond viewport mode.

Recommended direction:
- keep app-side execution-policy hooks where they are useful
- prefer viewport result mode as the primary user-facing concept
- only preserve Browser policy as a stronger visible product feature if it becomes fully honest against worker scheduling and accepted runtime truth

Important rule:
- `off` should only exist as a serious mode if it becomes true runtime/output suppression, not merely UI-side hiding plus dispatch suppression

### Viewport Runtime Inspector Direction

`Viewport Runtime Inspector` should eventually explain:
- what request is active now
- whether newer intent has superseded older work
- whether the viewport is showing transient, draft, or authoritative output
- whether final work is waiting because the runtime is intentionally settling after interaction

The inspector should help the user understand:
- why the viewport is still showing draft
- why final has not landed yet
- why older work disappeared from relevance

It should not guess.

### Desired Runtime Behavior For Heavy Edits

For a continuous edit such as:
- extrude depth `10 -> 20 -> 5 -> 50`

good long-range behavior is:
- immediate interaction feedback may come from transient or cheap draft response
- older obsolete work should be superseded quickly
- final authoritative work should usually run once for the settled latest value, not for every intermediate value

This is the main efficiency target:
- keep interaction responsive
- keep accepted truth honest
- stop paying full cost for obsolete intermediate values

### Worker Follow-On Themes

The next Worker-family follow-ons should likely organize around:
- explicit supersession and cancellation checks
- draft-preview scheduling and settle rules
- authoritative-build scheduling and acceptance rules
- shared runtime-state publication for Browser, Console, and `Viewport Runtime Inspector`
- later export-facing reuse of accepted authoritative geometry truth

### One-Sentence Compass

Prefer worker changes that make ParaHook more latest-intent-driven, more explicit about draft-versus-authoritative runtime truth, more efficient at dropping obsolete work early, and more honest across Browser, viewport, and worker-adjacent runtime reads.

## [x] Worker Vision Phase 1 - Request Supersession And Cooperative Early Abort

- focus:
  - make latest-intent execution real inside the worker path instead of relying only on stale-result drop after work already finished
- shipped record:
  - `docs/Human-Plans/Architecture/Worker/Shipped/Worker_Phase Worker-Vision-1 - Request Supersession And Cooperative Early Abort.md`
- owns:
  - graph-target supersession identity
  - worker-visible latest-request checks
  - cooperative early-abort checkpoints at meaningful expensive boundaries
- first proof:
  - newer requests for the same graph/runtime target make older in-flight work stop early
  - accepted correctness still remains protected by stale-drop at the app boundary
  - runtime truth can say when work was superseded instead of only silently disappearing
- keep out of scope:
  - full draft-versus-authoritative scheduling policy
  - Browser or viewport UI redesign
- shipped read:
  - latest-request identity per graph target is explicit
  - worker cooperative supersession checkpoints are shipped
  - superseded work now becomes explicit runtime truth instead of silent disappearance

## [x] Worker Vision Phase 2 - Draft Preview Scheduling And Settle Rules

- focus:
  - make the draft path intentionally schedulable instead of assuming preview is always cheap enough to run live
- shipped record:
  - `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker-Vision-2 - Draft Preview Scheduling And Settle Rules.md`
- owns:
  - draft `live` versus `on release` versus short-settle behavior
  - interaction-aware preview timing rules
  - command-cost-aware room for later preview throttling
- first proof:
  - cheap draft interactions may remain live
  - heavier draft interactions can defer until release or settle without breaking accepted-truth rules
  - the runtime can explain why a draft update did or did not run
- keep out of scope:
  - authoritative acceptance changes
  - export reuse
- shipped read:
  - draft scheduling policy is now explicit at request time
  - delayed latest-intent placeholder ownership is now explicit
  - release-triggered delayed draft dispatch is now explicit
  - delayed, replaced, released, and suppressed runtime truth is now explicit
  - repeated draft scheduling churn is hardened enough that the Worker family can move forward without reopening draft-policy basics

## [~] Worker Vision Phase 3 - Authoritative Scheduling And Final Acceptance Rules

- focus:
  - make final/authoritative work intentionally conservative and explicit instead of behaving like a more expensive version of live preview
- standalone future phase doc:
  - `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker-Vision-3 - Authoritative Scheduling And Final Acceptance Rules.md`
- owns:
  - authoritative release-versus-settle-versus-explicit timing
  - acceptance and replacement rules between draft and authoritative result classes
  - the first honest rule for when final work should wait even while draft remains responsive
- first proof:
  - continuous edits do not launch full authoritative work for every intermediate value by default
  - settled latest intent can promote to authoritative cleanly
  - viewport `Final` preference reads as a truthful preference, not as a guarantee that every drag step ran authoritative rebuilds
- keep out of scope:
  - full shared runtime inspector surfacing
  - export pipeline widening
- next recommended action:
  - execute the dedicated `Worker-Vision-3` future doc one internal phase at a time

## [ ] Worker Vision Phase 4 - Shared Runtime Publication For Browser, Console, And Viewport Runtime Inspector

- focus:
  - publish one shared runtime scheduling/read model that Browser, Console, and `Viewport Runtime Inspector` can all read without inventing competing stories
- owns:
  - active versus queued versus superseded runtime identity
  - visible result-class truth:
    - `transient`
    - `draft`
    - `authoritative`
  - why work is waiting:
    - release
    - settle
    - manual
    - suppressed
- first proof:
  - Browser and `Viewport Runtime Inspector` can explain the same runtime event differently without disagreeing about the facts
  - current visible result class becomes explicit
  - superseded work is legible instead of vanishing as invisible implementation detail
- keep out of scope:
  - deeper content-hierarchy redesign
  - broad new worker lanes beyond build/runtime publication

## [ ] Worker Vision Phase 5 - Export And Long-Lived Runtime Reuse Over Accepted Authoritative Truth

- focus:
  - make accepted authoritative geometry reusable enough that export and later downstream systems do not need a separate hidden reconstruction story
- owns:
  - reuse of accepted authoritative runtime truth for export preparation
  - later shared handoff rules between accepted runtime output and export-facing consumers
  - preserving explicit runtime identity while widening into longer-lived authoritative reuse
- first proof:
  - export reads the same accepted authoritative truth seam the runtime already trusts
  - later downstream consumers do not need a second geometry owner to stay honest
  - worker/runtime identity remains explicit while reuse deepens
- keep out of scope:
  - unrelated export UI work
  - broader project-content publishing redesign outside the worker/runtime seam
