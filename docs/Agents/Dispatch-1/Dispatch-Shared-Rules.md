# Dispatch Shared Rules

## Doc Header

### Doc History
7. 2026-04-19 12:22:10: Polished the shared implementation-readiness wording so manager and worker rules use the exact `### Phase N Implementation Spec` heading when talking about prep, readiness, and Family Phase Doc setup.
6. 2026-04-19 12:07:07: Tightened the shared dispatch contract around the Codex Desktop notes file ladder, defining `Vision Doc`, `Generation Index Doc`, `Family Phase Doc`, and implementation-phase layers as shared planning terms before worker implementation.
5. 2026-04-19 01:17:15: Added the shared index setup ownership contract so manager and worker agents distinguish vision-doc raw HLG and generation vision specs from index-owned CLG, wishlist organization, family phase structure, and phase summaries
4. 2026-04-18 23:20:00: Added the closeout tracking rule so implemented or closed family phases must update `docs/CHANGELOG.md` for shipped work and `docs/Doc-Log.md` for changed-file history before the loop reports completion
3. 2026-04-18 20:50:00: Added the `PubWheel` terminology rule so manager and worker agents refer to the full public-wheel build as `PubWheel` instead of calling it a `Onewheel`
2. 2026-04-18 18:24:00: Added the required planning-ladder contract so both manager and worker preserve new user HLG first in a family `## Vision` section, then derive CLG, chunk phases, update the wishlist, create phase summary sections, prep implementation specs, and only then implement
1. 2026-04-18 16:11:42: Added this reusable shared-rules companion for manager-worker dispatch loops, defining the truth hierarchy, run-state fields, resume and skip semantics, and phase-status language so generic dispatch agents can be reused across family ladders without losing control discipline

### Purpose

This file defines the shared contract both the manager and worker should follow during a reusable dispatch loop.

Use it to answer:
- which docs win when multiple docs are in play
- what run-state fields should be explicit
- how resume and skip behavior should work
- what phase-status words mean

Do not use it for:
- project-specific family truth
- replacing the active Vision Doc, Generation Index Doc, or Family Phase Doc
- replacing direct user instructions

## Doc Body

### Truth Hierarchy

When several docs are in play, interpret them in this order:

1. direct user instructions for the current run
2. `AGENTS.md`
3. `docs/Doc-Vision.md`
4. the active dispatch plan
5. the active Vision Doc, such as `IdeaName-Vision.md`
6. the active Generation Index Doc, such as `IdeaName-GenN-Index.md`
7. the active Family Phase Doc, such as `Future/IdeaName-N - Family Phase Name.md`
8. the manager's current task message to the worker

Important rule:
- lower surfaces may specialize execution
- lower surfaces should not silently override higher-level truth

### Run-State Fields

Every dispatch run should make these fields explicit:

- active objective
- active family
- active generation, if generation-scoped
- active family phase, if family-phase-scoped
- active implementation phase, if implementation-phase-scoped
- family order if more than one family is involved
- resume from
- skip list
- stop-after rule if one exists
- testing policy if one exists

Good example:

- active objective: `finish Environment-1 and Environment-2`
- family order: `Environment-1`, then `Environment-2`
- active family: `Environment-1`
- resume from: `Phase 3`
- skip list: `Phase 2`
- testing policy: `user tests after both families unless one narrow check is required to unblock`

### Resume Rule

`resume from <Phase N>` means:
- start the next live inspection at `Phase N`
- treat earlier phases as out of scope for the current run unless the user explicitly reopens them

The manager should not spend extra turns re-auditing the skipped or earlier phases unless the user asks for that review.

### Skip Rule

`skip <Phase N>` means:
- do not dispatch that phase
- do not reopen it later in the same run unless the user explicitly changes the rule

If the user says:
- resume from `Phase 3`
- skip `Phase 2`

the manager should move directly to the `Phase 3` decision point and ignore `Phase 2` for the current run.

### Phase Status Language

Use these meanings consistently. In this guide, `phase` usually means the active implementation phase unless a line explicitly says family phase.

- `open`
  - phase exists but has not been prepared enough to implement
- `implementation-ready`
  - the phase prep is complete and the next legal task is implementation
- `implemented`
  - the owned runtime or docs behavior for that phase is landed
- `verified`
  - the required proof for that phase has been gathered
- `skipped`
  - the user intentionally removed the phase from the active run
- `closed out`
  - the family or phase tracking surfaces are updated and the lane is honestly finished
- `blocked`
  - the current task cannot advance without a missing answer or dependency

### Product Terminology

Use `PubWheel` for the full assembled public-wheel build.

Important rules:
- do not call the full build a `Onewheel`
- do not call the full-build workflow `Onewheel Builder`
- use `PubWheel Builder` for the workflow that fills required full-build slots from Catalog item truth
- use `PubWheel` for pre-built starting assemblies, full-build recipes, and whole-build compatibility language
- only use source/platform terms such as `Onewheel`, `GT`, `XR`, `Pint`, or `ADV` when referring to ecosystem/platform compatibility, source data, or a quoted upstream naming context

### Planning Ladder

New user-provided HLG must move through this ladder in order:

1. `Vision Doc`
2. `HLG`
3. `Generation Routing`
4. `Generation Index Doc`
5. `CLG`
6. `Family Phase Chunking`
7. `Family Phase ## Sections With Summaries`
8. `Family Phase Doc`
9. `Implementation Phase Chunking`
10. `Implementation Phase ## Sections With Summaries`
11. `Implementation Spec`
12. `Worker Implementation Task`

Do not skip directly from HLG, CLG, review findings, or user notes into implementation.

The Family Phase Doc should contain a `## Vision` section above `## Wishlist Organization`.

The `## Vision` section should preserve:
- the human-readable summary vision
- the full HLG list
- any new HLG that have not yet been chunked into family phases or implementation phases

The `## Wishlist Organization` section should preserve:
- CLG derived from the vision and HLG
- the family-phase and implementation-phase chunking result
- implementation-phase checklist items small enough for one worker task each

Each implementation phase `##` section should preserve:
- phase summary
- purpose
- owns and does not own, when useful
- current live read, when useful
- no-widening rule
- checklist
- verification shape
- done shape

The `### Phase N Implementation Spec` is added during a worker prep task after the implementation phase exists.

Implementation is legal only when the active implementation phase already has:
- matching HLG and CLG links
- wishlist checklist items
- a full implementation phase `##` section
- a phase summary
- a `### Phase N Implementation Spec`
- a no-widening rule
- verification shape
- done shape

Review findings may create or reopen a family phase or implementation phase, but they do not replace the planning ladder.

### Planning Layer Ownership

After raw HLG have been organized into generation routing in the Vision Doc, the Generation Index Doc becomes the setup surface.

The ownership split is:
- the Vision Doc owns raw HLG and generation routing
- the Generation Index Doc owns CLG, wishlist organization, family phase structure, and family-phase summaries
- the Family Phase Doc owns implementation phase structure and implementation-phase summaries
- implementation phase prep owns `### Phase N Implementation Spec`
- implementation owns code changes

Generation Index Doc setup should:
- copy relevant generation HLG from the Vision Doc
- derive CLG from the HLG plus the generation vision
- turn HLG and CLG into linked wishlist items
- organize those wishlist items by generation and likely family phase
- create the `## IdeaName-N - Family Phase Name` sections needed to cover all selected HLG and CLG
- stop before implementation specs unless the assigned task is explicitly implementation phase prep

Family Phase Doc setup should:
- copy the relevant family phase HLG and CLG from the Generation Index Doc
- split the family phase into Codex-sized implementation phases
- create one `## IdeaName-N / Phase N - Implementation Phase Name` section per implementation phase
- include at least a summary and a future `### Phase N Implementation Spec` home for each implementation phase
- stop before runtime work unless the assigned task is explicitly implementation

The Generation Index Doc is ready for Family Phase Doc setup only when every selected HLG has CLG, every CLG is represented in wishlist organization, and every active family phase has a summary plus enough boundary detail to support a later family-phase-doc task.

The Family Phase Doc is ready for implementation phase prep only when the active implementation phase has matching HLG and CLG links, wishlist checklist items, a full `##` section, a phase summary, no-widening rule, verification shape, and done shape.

### Narrow Ownership Rule

The manager owns:
- sequencing
- legality of the next task
- honoring resume and skip rules
- deciding when a family can advance
- confirming closeout tracking is complete before reporting a phase or family as finished

The worker owns:
- doing one assigned task
- staying inside the phase boundary
- returning a clear handoff
- updating closeout tracking when the assigned task implements or closes shipped work

### Closeout Tracking Rule

When a worker implements runtime behavior, ships a major docs/system consolidation, or closes a phase/family after implementation, closeout must include:

- `docs/CHANGELOG.md`
  - required for permanent completed-work history when shipped behavior or a major completed planning/system lane lands
  - the entry should use the next sequential `[NNN]` changelog number and include the usual human summary, scope, implementation, files changed, behavior changes when relevant, and verification sections
- `docs/Doc-Log.md`
  - required for changed-file history on any implementation, closeout, or important planning/doc update
  - the entry should use the next sequential doc-log number and name the important touched files plus the phase/family result

Important rules:
- implementation is not honestly `closed out` until the relevant Vision Doc, Generation Index Doc, Family Phase Doc, changelog, and doc log are updated
- if a worker is assigned only prep, vision, CLG, generation routing, phase chunking, or a narrow verification check, `docs/Doc-Log.md` is still expected when docs changed, while `docs/CHANGELOG.md` is only required if the task produced permanent completed-work history
- if the manager chooses to defer changelog or doc-log updates, the final user-facing report must say that closeout tracking is still incomplete

### Handoff Rule

Every handoff from manager to worker should include:

- active family
- active generation when relevant
- active family phase when relevant
- active implementation phase when relevant
- task type
- docs to read
- hard constraints
- stop condition

Every handoff from worker back to manager should include:

- status
- files changed
- summary
- changelog and doc-log status
- blockers
- next legal task suggestion

### Completion Rule

This shared rules file is working correctly when:

- both agents use the same run-state language
- resume and skip instructions remain stable across the whole loop
- the manager and worker do not argue over ownership
- phase advancement stays explicit instead of implied
