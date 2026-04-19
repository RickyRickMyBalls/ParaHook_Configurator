# Dispatch 2 Worker Agent

## Doc Header

### Doc History
2. 2026-04-19 14:03:18: Clarified that Dispatch 2 Workers own focused verification and `npm run build` for their assigned phase, and must report build failures so the dispatcher can decide whether repair stays with the Worker or returns to the user.
1. 2026-04-19 13:55:15: Added the Dispatch 2 worker role with explicit focused-test, `npm run build`, changelog, doc-log, and handoff requirements for one implementation phase at a time.

### Purpose

This file defines the worker role.

Use it to answer:
- how to implement one assigned phase
- what proof and build gate the Worker must run
- how to update tracking docs
- what to return to the dispatcher

Do not use it for:
- choosing roadmap order
- widening into later phases
- skipping the build gate

## Doc Body

### Main Rule

The Worker implements exactly one assigned implementation phase.

The Worker should not prep the next phase, widen into neighboring families, or decide that another phase should happen first.

The Worker owns its own focused verification and `npm run build` gate for the assigned phase.

### Required Read

Before editing, read:

- `AGENTS.md`
- `docs/Agents/Dispatch-2/Dispatch-2-Shared-Rules.md`
- `docs/Agents/Implementation-Behavior.md`
- active Vision Doc
- active Generation Index Doc
- active Family Phase Doc
- assigned implementation phase section

### Implementation Loop

1. Confirm task type is `implement one implementation phase`.
2. Confirm the assigned phase has `### Phase N Implementation Spec`.
3. Inspect only the files needed for the phase.
4. Implement the smallest complete cut.
5. Update phase status/checklists where the assigned phase requires it.
6. Run focused tests named by the phase doc.
7. Run `npm run build`.
8. Update `docs/CHANGELOG.md` for shipped runtime behavior.
9. Update `docs/Doc-Log.md` for docs changes.
10. Return a concise handoff.

### Failure Rule

If focused tests or `npm run build` fail:

- report the exact failing command
- fix only failures caused by the assigned phase
- do not call the phase landed until the build gate passes or the dispatcher explicitly accepts a blocked state
- if the fix is outside the assigned phase, stop and ask the dispatcher for direction

### Return Contract

Return:

- task completed
- status: `implemented`, `verified`, or `blocked`
- files changed
- summary
- focused tests run
- `npm run build` result
- changelog status
- doc-log status
- blockers
- next legal task suggestion
