# Dispatch 4 Simple Overview

## Doc Header

### Doc History
3. 2026-04-20 12:43:36: Added the Manager vision coverage audit responsibility so the simple loop explicitly checks whether remaining wishlist work needs a new family phase or a normal/follow-up phase inside the current family phase.
2. 2026-04-20 12:40:50: Corrected the simple dispatch model so Manager blocks out family phase plan docs and decides completion or follow-up phases, while Worker always owns per-phase implementation prep inside the plan doc and then implementation plus `npm run build`.
1. 2026-04-20 12:27:46: Added this simple Manager plus Worker dispatch model so Catalog Vision 2 work can move through prep, Manager approval, implementation, and app verification without using the heavier Dispatch 3a persistent-lane system.

### Purpose

This file defines the simple Dispatch 4 operating model.

Use it when:
- the user is filling a vision or wishlist with a separate spec agent
- the live Codex thread should act as Manager
- Manager should block out family phase plan docs and choose the next phase
- one Worker should prep a phase for implementation inside the family phase plan doc
- the Manager should approve or revise that prepared spec
- one Worker should then implement the approved phase
- implementation should pass focused tests and `npm run build`

Do not use it for:
- persistent Yap Intake, HLG > Spec, Explorer, and Worker fleets
- replacing active family vision or plan docs
- letting Worker choose broad product direction
- calling a phase done without Manager review
- treating a Worker prep pass as implementation

## Doc Body

### Core Idea

Dispatch 4 Simple has two active roles:

- `Manager`
  - the live user-facing Codex thread
  - owns family phase blocking, routing, research, spec approval, implementation supervision, follow-up phase decisions, and final acceptance
- `Worker`
  - one implementation helper
  - first preps the next phase for implementation inside the family phase plan doc
  - later implements the approved phase and runs `npm run build`

The separate spec agent that the user works with is outside this simple loop.

That spec agent can keep filling the vision and wishlist. The Manager's job is to continue turning the ready parts of `Vision 2` into blocked-out family phase plan docs, Worker-prepped implementation phases, approved specs, implementation, verification, and follow-up phases until `Vision 2` is done.

### Simple Loop

```text
User + separate spec agent fill Vision 2
  ->
Manager chooses the next ready phase
  ->
Manager blocks out or updates the family phase plan doc when needed
  ->
Manager tells Worker to prep that phase for implementation inside the plan doc
  ->
Manager researches the code and reviews the spec
  ->
Manager approves the spec or sends revisions
  ->
Manager tells Worker to implement the approved phase
  ->
Worker implements and runs focused checks plus npm run build
  ->
Manager helps with research if needed
  ->
Manager accepts, repairs, adds a follow-up phase, or sends the next phase
```

### Non-Negotiables

- The Manager is responsible for keeping the Worker on track.
- The Manager checks the active vision against the generation index and family phase docs before choosing the next planning move.
- The Manager decides whether missing wishlist coverage needs a new family phase or a normal/follow-up phase inside the current family phase.
- The Manager blocks out family phase plan docs and adds follow-up phases when coverage remains incomplete.
- The Worker does not implement until the Manager approves the prep spec.
- The Worker always owns the per-phase prep-for-implementation section inside the family phase plan doc.
- The Manager researches live code seams before approving risky specs.
- The Worker implements one approved phase at a time.
- `npm run build` is the required build gate for Dispatch 4 Simple implementation passes.
- Focused unit tests should run before `npm run build` whenever a focused test path exists.
- Runtime implementation still updates `docs/CHANGELOG.md`.
- Docs changes still update `docs/Doc-Log.md`.
- If implementation changes docs too, both tracking files must be kept honest.
- A family phase is complete only when its wishlist, HLG, and CLG coverage is actually achieved by docs, code, and proof.
- If a phase does not finish its promised coverage, Manager adds a follow-up phase such as `Phase 3.1` or another clearly named continuation and sends Worker through prep and implementation again.

### Vision 2 Read

For Catalog Vision 2 work, treat the active vision or plan doc as the source that accumulates the user's goals.

The Manager should:
- keep accepting new Vision 2 direction from the user or separate spec agent
- compare the active Vision 2 wishlist against Gen2 index routing and existing family phase docs
- decide whether missing coverage needs a new family phase, a normal phase, a follow-up phase, a docs-only repair, or a later-generation defer
- block out family phase plan docs from the ready Vision 2 direction
- identify the next implementation-sized phase inside the family phase plan doc
- ask Worker to prep that phase for implementation in the plan doc
- approve or revise the spec after code research
- ask Worker to implement only after approval
- compare Worker results against wishlist, HLG, CLG, unit tests, and build proof
- add follow-up phases whenever the previous phase did not finish the promised coverage
- continue the loop until the Vision 2 checklist is complete or the user changes direction
