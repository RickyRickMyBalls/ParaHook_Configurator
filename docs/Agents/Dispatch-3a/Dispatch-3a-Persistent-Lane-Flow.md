# Dispatch 3a Persistent Lane Flow

## Doc Header

### Doc History
1. 2026-04-19 17:32:30: Added the Dispatch 3a persistent-lane flow recipe for running Yap Intake, HLG > Spec, Worker, and optional Explorer lanes under one live Manager without killing useful agents between tasks.

### Purpose

This file defines how Dispatch 3a lanes run together.

Use it to answer:
- what the normal loop is
- how HLG > Spec works ahead of Worker
- how interruptions are handled
- which agents to preserve when capacity is limited

Do not use it for:
- replacing role-specific docs
- skipping the Worker build gate
- letting child agents spawn other agents

## Doc Body

### Normal Loop

The normal persistent-lane loop is:

```text
User yap
  -> Yap Intake records newest-first entry
  -> Manager routes next entry to HLG > Spec
  -> HLG > Spec creates or repairs HLG, CLG, docs, and implementation spec
  -> Manager sends prepared phase to Worker
  -> Worker implements, verifies, builds, and returns
  -> HLG > Spec reviews coverage
  -> Manager accepts, repairs, advances, or asks user
```

### Work-Ahead Rule

HLG > Spec should work ahead while Worker implements.

Good work-ahead tasks:

- consume the next Yap Intake entry
- repair missing CLG in a Generation Index
- prep the next Family Phase Doc
- tighten a future implementation spec
- ask Explorer for one bounded seam question

HLG > Spec should not rewrite active Worker scope while Worker is implementing unless Manager interrupts the Worker or sends an updated handoff.

### Interruption Rule

When the user interrupts:

1. Manager acknowledges the new instruction.
2. Manager decides whether active Worker, HLG > Spec, or Yap Intake work conflicts.
3. Manager sends updated instructions to affected agents.
4. Manager preserves non-conflicting work.
5. Manager updates `Dispatch-3a-Run-State.md` when the interruption changes the objective or next legal task.

### Agent Capacity Rule

If there are too many active agents, preserve:

1. Manager
2. active HLG > Spec
3. active Worker
4. Yap Intake when the user is actively yapping
5. Explorer

Close or pause Explorer first when capacity is tight.

### Readiness Flow

Worker implementation is legal only after HLG > Spec or Manager can name:

- active family
- active generation, when relevant
- active family phase
- active implementation phase
- implementation spec
- no-widening rule
- verification command or test shape
- `npm run build`
- tracking docs requirement
- stop condition

### Closeout Flow

Closeout requires:

- Worker return
- focused verification result
- `npm run build` result
- required changelog and doc-log status
- HLG > Spec coverage review
- Manager acceptance
- updated run state

If any part is missing, the next legal task is repair, review, or tracking cleanup.
