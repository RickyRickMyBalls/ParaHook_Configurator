# Dispatch 3a Handoff Templates

## Doc Header

### Doc History
1. 2026-04-19 17:32:30: Added reusable Dispatch 3a handoff templates for Yap Intake, HLG > Spec prep, Worker implementation, Explorer research, Worker return, and HLG > Spec coverage review.

### Purpose

This file provides copy-ready handoff shapes for Dispatch 3a.

Use it to answer:
- what information each lane should receive
- what each lane should return
- how Manager keeps handoffs consistent

Do not use it for:
- replacing active phase docs
- skipping repo-specific instructions
- letting templates override user direction

## Doc Body

### Yap Intake Assignment

```text
Role: Yap Intake Codex
Task type: log user yap
Source note:
<paste user yap>

Write or update:
- docs/Agents/Dispatch-3a/Dispatch-3a-Yap-Intake-Log.md

Return:
- intake entry id or heading
- rough HLG candidates
- suspected family
- suspected planning layer
- status
- handoff target for HLG > Spec
```

### HLG > Spec Prep Assignment

```text
Role: HLG > Spec Codex
Task type: prep one planning layer or implementation phase
Active objective:
Active family:
Active generation:
Input source:
Required docs:
- AGENTS.md
- docs/Vision.md
- docs/Agents/Dispatch-3a/Dispatch-3a-Shared-Rules.md
- <active Vision Doc>
- <active Generation Index Doc>
- <active Family Phase Doc, if known>

Task:
Turn the selected HLG or intake entry into repo-grounded CLG, routing, and the next implementation-ready phase or Worker handoff.

Return:
- files read or changed
- HLG preserved
- CLG created or confirmed
- planning layer updated
- Worker handoff, if ready
- blockers
- next legal task
```

### Worker Implementation Assignment

```text
Role: Worker Codex
Task type: implement one implementation phase
Active family:
Active generation:
Active family phase:
Active implementation phase:
Required docs:
- AGENTS.md
- docs/Agents/Dispatch-3a/Dispatch-3a-Shared-Rules.md
- docs/Agents/Implementation-Behavior.md
- <active Vision Doc>
- <active Generation Index Doc>
- <active Family Phase Doc>

Implement:
<exact phase heading and spec>

Scope:
<owned scope>

Do not widen into:
<no-widening list>

Verification:
<focused tests>
Build gate:
npm run build

Tracking:
- update docs/CHANGELOG.md for shipped runtime behavior
- update docs/Doc-Log.md for docs changes

Return:
- status
- files changed
- summary
- tests run
- npm run build result
- changelog status
- doc-log status
- blockers
```

### Explorer Research Assignment

```text
Role: Explorer Codex
Task type: explore one seam
Question:
<bounded question>

Read-only unless explicitly told otherwise.

Return:
- answer
- files inspected
- relevant seams
- risks
- recommended next task
- whether this blocks current implementation
```

### Worker Return Template

```text
Task completed:
Status:
Files changed:
Summary:
Focused verification:
npm run build:
CHANGELOG status:
Doc-Log status:
Blockers:
Next legal task suggestion:
```

### HLG > Spec Coverage Review Return

```text
Active mode: coverage review
Worker result reviewed:
Files read:
Findings:
Coverage accounting:
- HLG:
- CLG:
- phase checklist:
Tracking docs:
Residual risk:
Follow-up phase proposal:
Recommendation:
```
