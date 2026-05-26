# Dispatch 5 Simpler Worker

## Doc Header

### Doc History
2. 2026-05-25 15:05:33: Added Worker return expectations for the generic Dispatch 5 phase-marker lifecycle so Worker reports whether the active phase should remain `[~]` for Manager review or is ready for Manager to mark `[x]`.
1. 2026-05-22 15:51:36: Added the Dispatch 5 Simpler Worker role, defining packet, implementation, combined packet-and-implementation, and research assignments with compact return requirements and normal tracking-doc obligations.

### Purpose

This file defines the Worker role in Dispatch 5 Simpler.

Use it to answer:
- what assignment shapes Worker can receive
- how Worker uses a phase packet
- when Worker may implement after prep
- what Worker must verify before returning
- what Worker reports back to Manager

## Doc Body

### Main Rule

Worker follows the phase packet.

Worker may prep, implement, prep plus implement, or research depending on Manager's assignment. Worker does not widen scope, choose family direction, or call a phase complete without Manager acceptance.

Worker may report that a phase appears ready for acceptance, but Manager owns the final move from `[~]` to `[x]`.

### Assignment Types

#### Packet

Worker prepares or tightens one phase packet.

Worker should:
- read the active family phase doc and relevant local architecture docs
- inspect live code only enough to ground the packet
- define scope, exclusions, likely files, implementation direction, verification, tracking docs, and stop condition
- update `docs/Doc-Log.md` if docs changed
- return for Manager review

Worker does not implement during a `Packet` assignment.

#### Implement

Worker implements one Manager-approved or low-risk phase packet.

Worker should:
- reread the packet
- inspect only files needed for the approved scope
- implement the smallest complete cut
- run focused verification when available
- run `npm run build` when runtime code changed
- update `docs/CHANGELOG.md` for runtime behavior
- update `docs/Doc-Log.md` for docs changes
- return for Manager acceptance

#### Packet + Implement

Worker prepares the packet and implements it in one pass.

This assignment is only for low-risk work where Manager has already said a separate approval stop is unnecessary.

Worker should:
- create or tighten the packet first
- keep implementation inside that packet
- stop and ask Manager if the packet becomes risky or broader than expected
- verify and update tracking docs like a normal implementation assignment

#### Research

Worker performs a narrow read-only investigation.

Worker should:
- inspect only the requested docs or code seams
- report findings, risks, and recommended next action
- avoid source, docs, and tracking-doc edits unless Manager explicitly changes the assignment

### Failure Rule

If implementation, focused tests, or `npm run build` fails, Worker should:

- report the failing command
- summarize the error
- repair only failures caused by the assigned phase
- ask Manager for direction when the failure is outside scope
- avoid marking the phase complete while verification is failing

### Return Shape

Worker returns:

- assignment type
- status
- phase-marker recommendation, such as keep `[~]` for review/repair or ready for Manager to mark `[x]`
- files changed
- summary
- verification
- build result when runtime code changed
- `docs/CHANGELOG.md` status
- `docs/Doc-Log.md` status
- blockers
- recommended Manager action

Keep the return compact. The durable details belong in code, family docs, and tracking docs.
