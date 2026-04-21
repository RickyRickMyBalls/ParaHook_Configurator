# Dispatch 4 Simple Worker

## Doc Header

### Doc History
2. 2026-04-20 12:40:50: Corrected Worker duties so Worker always performs the selected phase's prep-for-implementation pass inside the family phase plan doc, then separately implements the approved phase and runs focused tests plus `npm run build`.
1. 2026-04-20 12:27:46: Added the Dispatch 4 Simple Worker role so one Worker can receive a prep assignment, wait for Manager approval, then receive a separate implementation assignment for the approved phase.

### Purpose

This file defines the Worker role in Dispatch 4 Simple.

Use it to answer:
- how Worker preps a phase
- how Worker implements after approval
- what Worker must run before returning
- what Worker should report back to Manager

## Doc Body

### Main Rule

Worker has two possible assignments, and they must stay separate:

1. prep one selected phase for implementation inside the active family phase plan doc
2. implement one Manager-approved phase and run focused tests plus `npm run build`

Worker does not implement during the prep assignment.

Worker does not prep a new phase during the implementation assignment unless Manager asks for a repair to the current phase doc.

Worker does not decide family phase completion or invent follow-up phases without Manager direction.

### Prep Assignment

When Manager says to prep a phase, Worker should:

- read the active vision or plan doc
- read the active family phase plan doc
- read the relevant local architecture docs
- inspect live code only as needed to ground the spec
- add or tighten the selected phase inside the family phase plan doc
- include a clear summary, owns, does-not-own, implementation direction, likely files, focused verification, `npm run build`, tracking docs, and stop condition
- update `docs/Doc-Log.md`
- return for Manager approval

Prep does not update `docs/CHANGELOG.md` because no runtime behavior has shipped.

### Implementation Assignment

When Manager approves the spec and sends implementation, Worker should:

- reread the approved phase section
- inspect only the files needed for the approved phase
- implement the smallest complete cut
- keep changes inside the approved scope
- run focused verification when available
- run `npm run build`
- repair only in-scope failures caused by the phase
- update `docs/CHANGELOG.md` for runtime behavior
- update `docs/Doc-Log.md` for docs changes
- return to Manager for acceptance

### Failure Rule

If implementation, focused tests, or `npm run build` fails:

- report the failing command and error
- repair only failures caused by the assigned phase
- ask Manager for research or direction if the issue is outside scope
- do not mark the phase complete while focused verification or `npm run build` is failing

### Return Shape

Worker returns:

- assignment type: prep or implementation
- status: ready for review, implemented, verified, or blocked
- files changed
- summary
- focused verification
- `npm run build` result when implementation was assigned
- `docs/CHANGELOG.md` status
- `docs/Doc-Log.md` status
- blockers
- recommended next Manager action
