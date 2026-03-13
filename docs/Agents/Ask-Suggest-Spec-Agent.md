# Ask-Suggest-Spec Agent

## Purpose

Use this agent when the user wants to prepare a phase from open roadmap state into an implementation-ready spec loop without jumping straight into code.

Typical triggers:
- `ask-suggest-spec Phase [N]`
- `do ASS# sp phase 11`
- any request that clearly means:
  - gather phase context
  - find missing phase questions
  - suggest answers
  - loop until the phase is question-complete
  - create the future task doc
  - produce an implementation-readiness plan

## Scope

This agent is for:
- roadmap-to-phase clarification
- family phase-plan question gathering
- suggested-answer drafting
- looping unresolved questions to closure
- creating a new task doc in `parahook/docs/Phase-Plans/Tasks/Future`
- ending in a plan to rewrite/spec the task doc into implementation-ready form

This agent is not for:
- directly implementing code unless the user explicitly changes the request
- silently locking major phase decisions without writing them into the relevant docs
- skipping the family phase-plan question surface

## Required Inputs

Always gather context from the relevant docs before suggesting answers:
- `parahook/docs/Human-Plans/roadmap/roadmap.md`
- `parahook/docs/CHANGELOG.md`
- the correct family file:
  - `parahook/docs/Phase-Plans/01_GE - Phase-Plans.md`
  - `parahook/docs/Phase-Plans/11_SP - Phase-Plans.md`
  - or the matching prefix family doc
- the relevant future/old task docs if they already exist
- any clearly related planning docs under:
  - `parahook/docs/Human-Plans/`
  - roadmap archive docs
  - Codex notes

Read only what is needed to shape the phase honestly.

## Workflow

### 1. Gather

Read the roadmap, changelog, family phase-plan doc, and any nearby task/planning docs needed to understand:
- what the phase is supposed to mean
- what already shipped
- what nearby phases own
- what must stay out of scope

Deliverable:
- a short working read of the phase and its unresolved seams

### 2. Add Questions

Go to the correct `(PREFIX) - Phase-Plans.md` family doc and add any missing questions needed to make the phase implementable.

Questions should usually cover:
- exact first-pass meaning
- ownership/truth boundary
- participating surfaces or units
- proof bar
- fallback/default behavior
- explicit out-of-scope line

Do not add redundant questions if the answer is already locked clearly.

### 3. Suggest Answers

Write `Suggested answer:` blocks under the open phase questions.

Suggested answers should:
- align with roadmap and vision direction
- stay narrow enough for one real phase
- avoid stealing meaning from neighboring phases
- define first-pass behavior, not full future ambition

### 4. Loop Until Ready

After writing suggested answers, re-check the phase.

If important implementation-prep ambiguity still exists:
- go back to Step 2
- add the next missing question layer
- suggest answers again

Only leave this loop when the phase has enough answered surface to support a dedicated task doc without obvious drift.

### 5. Create Future Task Doc

Create a new phase task doc in:
- `parahook/docs/Phase-Plans/Tasks/Future`

Use the current repo naming pattern for the file.

First pass:
- create the format-correct skeleton if no task doc exists

If the question surface is already ready:
- rewrite the task doc into an implementation-ready execution spec

The task doc should define:
- phase target
- problem statement
- locked direction
- first-pass contract
- seam findings
- implementation order
- deferred scope
- acceptance/proof bar

### 6. End In Plan Mode

Once the future task doc exists and the phase question surface is sufficiently complete, switch into planning behavior and produce a concrete plan to finish the implementation-ready spec work.

That plan should:
- reference the task doc directly
- describe the exact rewrite/spec work to do
- list test/proof expectations for the later implementation
- call out assumptions and deferred items

## Completion Rule

This agent run is complete when:
- the relevant family phase-plan doc contains the needed open questions
- those questions have suggested answers or locked answers
- the future phase task doc exists
- the user has an explicit implementation-readiness plan to execute next

## Guardrails

- Keep the phase aligned to the bigger roadmap and vision, not just local convenience.
- Do not mark a phase implemented if the work only reached planning/spec state.
- Do not collapse Browser ownership, project ownership, graph ownership, and viewer/workspace presentation into one phase without naming that as a problem.
- If the phase becomes too broad, recommend subphases before writing an implementation-ready task doc.

## Output Style

When running this loop, communicate progress in this order:
1. what phase is being prepared
2. what context is being read
3. what questions were added
4. what answers were suggested
5. whether another question loop is still needed
6. whether the future task doc was created or rewritten
7. the final implementation-readiness plan
