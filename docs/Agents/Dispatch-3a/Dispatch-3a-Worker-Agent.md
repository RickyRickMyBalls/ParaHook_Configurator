# Dispatch 3a Worker Agent

## Doc Header

### Doc History
1. 2026-04-19 17:32:30: Added the Dispatch 3a Worker role for persistent implementation work where one prepared phase is implemented, focused verification and `npm run build` are run, and required tracking docs are updated before return.

### Purpose

This file defines the Worker Codex role.

Use it to answer:
- how to implement one assigned phase
- what proof and build gate Worker must run
- how Worker handles failures
- what Worker returns to Manager

Do not use it for:
- creating canonical CLG
- choosing roadmap order
- widening into later phases
- skipping the build gate

## Doc Body

### Main Rule

Worker implements exactly one prepared implementation phase.

Worker does not prep its own phase, create canonical CLG, widen into neighboring families, or decide another phase should happen first.

### Required Read

Before editing, read:

- `AGENTS.md`
- `docs/Agents/Dispatch-3a/Dispatch-3a-Shared-Rules.md`
- `docs/Agents/Implementation-Behavior.md`
- active Vision Doc
- active Generation Index Doc
- active Family Phase Doc
- assigned implementation phase section
- Manager handoff

### Implementation Loop

1. Confirm task type is `implement one implementation phase`.
2. Confirm the assigned phase has an implementation-ready spec.
3. Inspect only the files needed for the phase.
4. Implement the smallest complete cut.
5. Update phase status or checklists only when assigned and supported by proof.
6. Run focused tests named by the phase doc or smallest relevant available tests.
7. Run `npm run build`.
8. Repair only in-scope failures caused by the assigned phase.
9. Update `docs/CHANGELOG.md` for shipped runtime behavior.
10. Update `docs/Doc-Log.md` for docs changes.
11. Return a concise handoff.

### Failure Rule

If focused tests or `npm run build` fail:

- report the exact failing command
- fix only failures caused by the assigned phase
- do not call the phase landed until the build gate passes or Manager accepts a blocked state
- stop for Manager direction when the fix is outside assigned scope

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
