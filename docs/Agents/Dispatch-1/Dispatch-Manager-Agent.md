# Dispatch Manager Agent

## Doc Header

### Doc History
8. 2026-04-19 12:21:28: Polished the active-scope wording so the manager guide names `Generation Index Doc` and `Family Phase Doc` as the current planning surfaces and uses the exact `### Phase N Implementation Spec` heading for implementation readiness.
7. 2026-04-19 12:07:07: Tightened the manager guide around the Codex Desktop notes file ladder, replacing the older single-index wording with explicit `Vision Doc`, `Generation Index Doc`, `Family Phase Doc`, and implementation-phase layers so manager dispatch can preserve generation routing, family-phase routing, and one-phase-at-a-time implementation.
6. 2026-04-19 01:17:15: Expanded the index setup rule into a full HLG-to-CLG-to-wishlist-to-phase contract so managers know how to turn generation vision specs into `IdeaName-Index.md` family phase structure before phase prep begins
5. 2026-04-19 00:48:44: Added a loop-layer identification rule so managers can tell whether the current work is raw HLG capture, generation vision-spec shaping, index setup, phase prep, phase implementation, verification, or closeout before dispatching a worker
4. 2026-04-19 00:26:39: Tightened the manager loop around the `IdeaName-Index.md` planning setup and the phase-by-phase spec-and-implementation loop so managers must require a phase-specific prep receipt before dispatching implementation
3. 2026-04-18 23:20:00: Added changelog and doc-log review gates so the manager checks closeout tracking before accepting worker implementation or family closeout as complete
2. 2026-04-18 18:24:00: Updated the manager loop to enforce the full Vision-to-implementation ladder, including Vision capture, HLG preservation, CLG derivation, phase chunking, wishlist updates, phase summary sections, implementation-spec prep, and only then worker implementation dispatch
1. 2026-04-18 16:11:42: Added this reusable manager-agent guide for one-manager plus one-worker dispatch loops, defining the generic resume, skip, review, and next-task rules so a manager Codex can continue a family from any named phase without improvising the control flow each run

### Purpose

This file defines how a manager Codex should run a narrow dispatch loop over one worker Codex.

Use it to answer:
- what the manager owns versus what the worker owns
- how the manager should resume from a named phase
- how the manager should treat skipped phases
- how to choose the next legal worker task
- how to review worker output before advancing the loop

Do not use it for:
- project-specific phase truth
- replacing the active dispatch plan
- replacing the active Generation Index Doc or Family Phase Doc

## Doc Body

### Main Rule

The manager owns sequencing.

The worker owns one narrow task.

The manager should never hand the worker one whole family ladder, one whole generation, or multiple major phases in one assignment.

### Required Inputs

Before dispatching a worker task, the manager should gather:

- `AGENTS.md`
- `docs/Doc-Vision.md`
- the active dispatch plan
- the active Vision Doc, such as `IdeaName-Vision.md`
- the active Generation Index Doc, such as `IdeaName-Gen1-Index.md` or an older family index still serving that role
- the active Family Phase Doc, such as `Future/IdeaName-N - Family Phase Name.md`, if one already exists
- the explicit user run controls for this pass

The explicit user run controls should be treated as the live run-state contract:

- active family or umbrella
- active generation if the work is generation-scoped
- active family phase if the work is inside a generation index
- active implementation phase if the work is inside a family phase doc
- resume phase
- skip list
- stop-after rule if one exists
- testing policy if one exists

### Resume And Skip Rule

The user may tell the manager to resume from any named phase.

If the user says:
- resume from `Phase 3`
- skip `Phase 2`

the manager should treat:
- `Phase 2` as intentionally out of scope for this run
- `Phase 3` as the first eligible phase to inspect

The manager should not reopen earlier phases just because they appear incomplete unless the user explicitly says to reopen them.

If the resume phase is not prepped yet:
- the next legal task is usually `prep Phase N`

If the resume phase is already implementation-ready but not implemented:
- the next legal task is usually `implement Phase N`

If the resume phase is already implemented:
- the manager should advance to the next non-skipped incomplete phase

### Allowed Worker Task Types

The manager should only dispatch one of these narrow task shapes at a time:

- `capture or update Vision Doc and HLG`
- `route HLG into generations`
- `derive CLG for one generation`
- `create or update one Generation Index Doc`
- `chunk one generation into family phases`
- `create or update one Family Phase Doc`
- `chunk one family phase into Codex-sized implementation phases`
- `prep the next incomplete implementation phase`
- `implement the prepped implementation phase`
- `run one narrow verification check if needed to unblock the loop`
- `close out the family docs when the family is actually complete`

If a proposed task spans more than one generation, more than one family phase, multiple implementation phases, or both prep and implementation together, it is probably too broad.

### Planning Ladder Gate

The manager must enforce this ladder before any implementation dispatch:

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

When the user provides new HLG or explains new product vision:
- first preserve it in the active family doc `## Vision` section
- update the `Vision Summary`
- then route it into one or more generations
- then update the relevant Generation Index Doc
- then derive CLG for the selected generation
- then decide which family phase should own the work
- then update the generation wishlist and family-phase summaries
- then create or update one Family Phase Doc
- then split that family phase into implementation phases before writing implementation specs

The manager should not dispatch implementation from only HLG, CLG, review findings, or checklist items.

If the active family phase exists in a generation index but lacks a Family Phase Doc:
- the next legal task is `create or update one Family Phase Doc`

If the active implementation phase exists but lacks a `### Phase N Implementation Spec`:
- the next legal task is `prep implementation Phase N`

If the active implementation phase lacks the phase `##` section or summary:
- the next legal task is an implementation-phase addition or summary task, not prep or implementation

If the active family doc lacks a `## Vision` section:
- the next legal task is to add or normalize that section before placing new HLG directly into the wishlist

### Loop Layer Identification

Before choosing a worker task, the manager should identify which layer of the loop is currently active.

Use these layers:

1. `raw HLG capture`
   - preserve the user's ideas and high-level goals without prematurely turning them into phases
   - next legal task is usually `capture or update Vision Doc and HLG`
2. `generation organization`
   - sort raw HLG into generations such as cleanup/prep, first local product shape, external-source widening, compatibility checks, or dimensional proof
   - next legal task is usually `route HLG into generations`
3. `generation vision shaping`
   - write each generation section in the Vision Doc as a summary vision: detailed enough to feed a Generation Index Doc, not detailed like an implementation spec
   - next legal task is usually `write or tighten generation vision`
4. `generation index setup`
   - use the generation vision to build or update `IdeaName-GenN-Index.md`: HLG, CLG, wishlist items, family phases, and family-phase summaries
   - next legal task is usually one generation-index setup step, not implementation
5. `family phase doc setup`
   - create or update `Future/IdeaName-N - Family Phase Name.md` for exactly one family phase and split it into Codex-sized implementation phases
   - next legal task is usually one family-phase-doc setup step, not runtime implementation
6. `implementation phase prep`
   - prepare exactly one implementation phase into an implementation-ready spec and receipt
   - next legal task is `prep implementation Phase N`
7. `implementation phase implementation`
   - implement exactly one already-prepped implementation phase
   - next legal task is `implement implementation Phase N`
8. `verification`
   - run the narrow proof needed to unblock or close the current phase
   - next legal task is one verification check
9. `closeout`
   - align phase/family docs, changelog, and doc log after shipped work or completed family state
   - next legal task is closeout only when the family or phase is actually complete

Important rule:
- `generation vision shaping` comes before `generation index setup`
- `generation index setup` comes before `family phase doc setup`
- `family phase doc setup` comes before `implementation phase prep`
- `implementation phase prep` comes before `implementation phase implementation`

The manager should name the active loop layer in its own notes and in any worker handoff where it affects the legal task shape.

Do not treat a generation vision as a Generation Index Doc, a Generation Index Doc as a Family Phase Doc, a Family Phase Doc as an implementation prep receipt, or a prep receipt as implementation.

### Generation Index Setup Contract

After the active Vision Doc has raw HLG organized into generation sections, the manager should use the active `IdeaName-GenN-Index.md` as the next planning surface.

The generation index setup layer should:

1. copy the relevant generation HLG from the Vision Doc into the Generation Index Doc
2. derive CLG from the HLG plus the generation vision
3. use CLG to bridge the gap between raw user goals and Codex-sized code-phase goals
4. convert the HLG and CLG into wishlist items that preserve goal links
5. organize the wishlist by HLG, CLG, generation, and family phase
6. create the `## IdeaName-N - Family Phase Name` sections required to achieve all selected HLG and CLG
7. give each family phase a summary, purpose, owns or does-not-own boundary, verification shape, and done shape
8. stop before writing implementation-phase specs unless the current task is explicitly a prep task inside a Family Phase Doc

This generation index setup can make the generation readable, ordered, and ready for Family Phase Doc setup.

It does not by itself make every implementation phase implementation-ready.

Important ownership split:
- the Vision Doc owns raw HLG and generation routing
- the Generation Index Doc owns CLG, wishlist organization, family phase structure, and family-phase summaries
- the Family Phase Doc owns implementation phase structure and implementation-phase summaries
- implementation phase prep owns implementation specs
- implementation owns code changes

The index is ready when:
- every selected HLG has matching CLG
- every CLG is represented in the wishlist organization
- every wishlist group routes to one family phase or an explicit later/deferred generation
- every active family phase has a `##` section with enough summary and boundary detail to support a later prep task
- no implementation work is required to understand the next legal Family Phase Doc

### Spec And Implementation Loop

After the Generation Index Doc and Family Phase Doc setup ladder exists, the manager must run this implementation phase loop:

1. dispatch `prep implementation Phase 1`
2. wait
3. review the prep result and confirm it produced a phase-specific implementation-ready receipt
4. dispatch `implement implementation Phase 1`
5. wait
6. review the implementation result
7. dispatch `prep implementation Phase 2`
8. wait
9. review the prep result
10. dispatch `implement implementation Phase 2`
11. wait
12. continue the same pattern until the family is complete

A Family Phase Doc, Generation Index Doc family-phase summary, or broad wishlist organization is not a substitute for the implementation-phase prep pass.

Before dispatching implementation, the manager must be able to point to the most recent prep result for that exact implementation phase.

The phase-specific prep receipt should identify:

- active family
- active family phase
- active implementation phase
- task type: `prep one implementation phase`
- exact implementation spec heading or location
- no-widening boundary
- likely files, seams, or docs affected
- verification shape
- stop condition
- confirmation that no runtime behavior was implemented during prep

If that receipt is missing or belongs to a different implementation phase, the next legal task is `prep implementation Phase N`, not implementation.

### Manager Loop

Use this loop every time:

1. Read the required inputs.
2. Establish the active run state from the user instructions.
3. Determine the current ladder layer: Vision Doc capture, generation routing, Generation Index Doc setup, Family Phase Doc setup, implementation phase prep, implementation, verification, or closeout.
4. Find the next legal non-skipped implementation phase only after the earlier planning layers are complete.
5. Choose exactly one worker task.
6. Dispatch only that task.
7. Wait for the worker to finish.
8. Review the result against the active docs and run-state rules.
9. Decide whether the same implementation phase now needs implementation-spec prep, implementation, verification, closeout, or whether the loop should advance.
10. Repeat.

### Review Checklist

After each worker run, the manager should review:

- did the worker stay inside the assigned implementation phase and task type
- if implementation was dispatched, did a prior implementation-phase prep receipt exist for this exact implementation phase
- did the worker preserve the higher-level goals and phase boundaries
- did the worker preserve the Vision and HLG before compressing into CLG or phases
- did the worker avoid adding wishlist items before the family-phase chunking decision was clear
- did the worker avoid writing implementation specs before the implementation phase `##` section and summary existed
- were the right docs updated for the task type
- if implementation shipped behavior or closed a major lane, did the worker add `docs/CHANGELOG.md`
- did the worker add or update `docs/Doc-Log.md` for the changed-file history
- do the active Family Phase Doc, owning Generation Index Doc, changelog, and doc log agree about the completed state
- is the implementation phase now `implementation-ready`, `implemented`, `verified`, or still blocked
- what is the next legal task after this result

### Output Shape

When dispatching, the manager should provide:

- active family
- active generation when relevant
- active family phase when relevant
- active implementation phase when relevant
- task type
- required docs to read
- hard constraints
- stop condition

When reporting back to the user, the manager should say:

- what task was just completed
- what generation, family phase, or implementation phase is now active
- what the next legal task is
- whether the loop is still aligned with the user-provided resume and skip rules

### Guardrails

- Do not combine prep and implementation in one worker assignment unless the user explicitly changes the loop.
- Do not treat a Generation Index Doc, Family Phase Doc, wishlist organization, family-phase summary, or implementation-phase summary as a substitute for the implementation-phase prep receipt.
- Do not start a later family early just because an earlier one feels mostly done.
- Do not silently unskip a skipped phase.
- Do not mark human-level goals complete just because one phase moved the ladder forward.
- Do not place new HLG only in the wishlist; preserve them in `## Vision` first.
- Do not dispatch implementation until the active implementation phase has a `### Phase N Implementation Spec`.
- Do not ask a worker to write an implementation spec and implement it in the same task.
- Do not let the worker decide roadmap order.
- Do not let the worker widen into neighboring families or future phases.
- Do not report a phase or family as closed out until required changelog and doc-log entries are present or the final report explicitly says closeout tracking remains incomplete.

### Completion Rule

This manager guide is being followed correctly when:

- the manager always chooses one narrow next task
- the worker always receives one narrow next task
- resume and skip instructions stay honored
- the loop advances phase by phase without hidden widening
- family closeout only happens when the family is actually complete
