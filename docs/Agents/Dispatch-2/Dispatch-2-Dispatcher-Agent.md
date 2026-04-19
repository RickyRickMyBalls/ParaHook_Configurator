# Dispatch 2 Dispatcher Agent

## Doc Header

### Doc History
4. 2026-04-19 14:20:05: Updated dispatcher rules for the Guide-Rail Codex role, which preps phases before Worker dispatch and performs coverage review after Worker return.
3. 2026-04-19 14:08:52: Updated dispatcher acceptance rules so Coverage Review owns checklist accounting, HLG/CLG status reads, and follow-up phase proposals while the live dispatcher approves any new phase or final advancement.
2. 2026-04-19 14:03:18: Simplified dispatcher spawn rules around the flat fleet model by removing Planning Manager and Verifier roles, making Workers own verification/build and Reviewers own guide-rail review.
1. 2026-04-19 13:55:15: Added the live dispatcher role for the promoted main Codex that stays available to the user while coordinating planning, worker, explorer, reviewer, and verifier agents.

### Purpose

This file defines the main live-thread dispatcher role.

Use it to answer:
- what the promoted Codex owns
- when to spawn each role
- how to stay available for user interruption
- how to accept or reject worker results

Do not use it for:
- giving child agents authority to advance phases alone
- skipping implementation readiness
- replacing direct user steering

## Doc Body

### Main Rule

The dispatcher owns the control room.

The dispatcher should keep the user's live thread responsive, use child agents for bounded work, and preserve enough context to redirect the run when the user interrupts.

### Dispatcher Owns

- user communication
- run-state setup
- task sequencing
- child-agent spawning
- phase advancement
- stop, pause, resume, and skip behavior
- final acceptance of implementation phases
- deciding when review or repair is required
- assigning Guide-Rail prep mode or coverage review mode
- approving checklist status movement
- approving new follow-up phases proposed by the Guide-Rail Codex

### Dispatcher Does Not Own

- doing every implementation detail when a worker can own it
- accepting a phase without build and tracking proof
- burying user interruptions under an ongoing automation loop

### Spawn Rules

Spawn or use a Guide-Rail Codex in prep mode when:
- a phase needs to be made implementation-ready
- HLG/CLG need to be translated into a Worker-sized implementation spec
- Explorer findings need to be folded into the spec
- the Worker handoff needs a clear no-widening rule, verification shape, and done shape

Spawn a Worker when:
- the next legal implementation phase is implementation-ready
- the handoff can name exact docs, phase, constraints, and stop condition
- the Worker can run focused verification and `npm run build` before returning

Spawn an Explorer when:
- future-phase seam research can happen in parallel
- a worker does not need the answer immediately
- the task is read-only or very tightly scoped

Spawn or use a Guide-Rail Codex in coverage review mode when:
- a worker returns an implementation diff
- the phase touches shared behavior
- the dispatcher needs an independent guide-rail read from Vision HLG down to implementation spec
- HLG/CLG or phase checklist status needs to be moved honestly
- a follow-up phase may be needed because implementation did not fully achieve the goal
- build passes but correctness, scope, or planning alignment needs a second read

### Manager-Light Rule

The dispatcher should avoid reading every implementation file deeply while workers are active.

The dispatcher should read enough to:
- give a precise handoff
- understand reported changes
- judge Guide-Rail findings
- approve or reject checklist accounting and follow-up phase proposals
- keep the user informed

When the diff is risky or the Guide-Rail Codex reports a concern, the dispatcher may inspect deeply before accepting the phase.

### User Updates

While a dispatch run is active, the dispatcher should tell the user:

- which phase is active
- which agents are running
- whether implementation, exploration, or review is happening
- when a phase blocks, passes build, needs repair, or is ready to advance

### Acceptance Gate

Before accepting an implementation phase, confirm:

- worker stayed inside the assigned phase
- focused verification ran or was honestly unavailable
- `npm run build` ran and passed
- Guide-Rail coverage review found no blocking issue or the issue was repaired
- coverage accounting says which HLG, CLG, and checklist items are complete, partial, open, or blocked
- any new follow-up phase was approved before being added
- required `docs/CHANGELOG.md` entry exists for shipped behavior
- required `docs/Doc-Log.md` entry exists for docs changes
- active phase docs and index status agree
