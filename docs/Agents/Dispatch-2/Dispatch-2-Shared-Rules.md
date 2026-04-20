# Dispatch 2 Shared Rules

## Doc Header

### Doc History
6. 2026-04-19 14:33:40: Added the CLG creation rule naming Guide-Rail Codex as the canonical creator and maintainer of Codex-level goals derived from preserved HLG during prep mode.
5. 2026-04-19 14:30:18: Added the start-command descent rule so Dispatch 2 can begin from a user HLG or start command, locate or create the required planning layer, and stop at Worker handoff only after the implementation phase is ready.
4. 2026-04-19 14:20:05: Replaced the separate Coverage Reviewer framing with the Guide-Rail Codex role, which owns both prep mode and coverage review mode while Worker stays focused on implementation plus build.
3. 2026-04-19 14:08:52: Added Coverage Reviewer responsibilities for checklist accounting, HLG/CLG status reads, and dispatcher-approved follow-up phase proposals when implementation does not fully achieve assigned goals.
2. 2026-04-19 14:03:18: Removed the Planning Manager and Verifier task roles from the active Dispatch 2 model, making the Worker responsible for focused verification and `npm run build` while the Reviewer checks guide-rail alignment from Vision HLG through implementation spec.
1. 2026-04-19 13:55:15: Added the shared Dispatch 2 rules for run state, task boundaries, verification gates, build gates, tracking docs, and child-agent authority limits.

### Purpose

This file defines the rules every Dispatch 2 role follows.

Use it to answer:
- which instructions win
- what run state must be explicit
- when implementation is legal
- what verification and build gates are required
- how changelog and doc-log closeout works

Do not use it for:
- choosing product roadmap order without the active family docs
- replacing role-specific Dispatch 2 docs
- replacing `AGENTS.md`

## Doc Body

### Truth Hierarchy

Interpret instructions in this order:

1. direct user instructions in the live thread
2. `AGENTS.md`
3. `docs/Vision.md`
4. `docs/Human-Plans/roadmap/Vision-roadmap.md`
5. `docs/Agents/Implementation-Behavior.md`
6. active Dispatch 2 role docs
7. active Vision Doc
8. active Generation Index Doc
9. active Family Phase Doc
10. active worker handoff

Lower documents may specialize execution, but they must not silently override higher-level truth.

### Run State

Every dispatch handoff should name:

- active objective
- active family
- active generation, when relevant
- active family phase, when relevant
- active implementation phase, when relevant
- task type
- resume point
- skip list
- stop-after rule
- testing policy
- closeout policy

If a field is unknown, say it is unknown instead of inventing state.

### Start Command Rule

When the user gives only an HLG, family intent, or start command, use `Dispatch-2-Start-Command-Flow.md`.

The dispatcher and Guide-Rail Codex should derive the next legal task from the repo docs instead of asking the user to manually name every file or phase.

The descent order is:

```text
User HLG or start command
  -> Vision Doc HLG
  -> Generation Index CLG
  -> Family Phase Doc
  -> Implementation Phase
  -> Implementation Spec
  -> Worker Handoff
```

Ask the user only when the docs are ambiguous, conflicting, or missing a product decision that cannot be safely inferred.

### Legal Task Types

Dispatch 2 agents receive one of these task types:

- `explore one seam`
- `prep one implementation phase`
- `implement one implementation phase`
- `review one worker result`
- `account for phase coverage`
- `close out one phase or family`

Agents must not convert one task type into another without dispatcher approval.

### Implementation Readiness

Implementation is legal only when the active implementation phase has:

- a top-level `##` section in the active Family Phase Doc
- `### Phase N Summary`
- `### Phase N Implementation Spec`
- HLG and CLG coverage links
- no-widening rule
- likely files or live seams
- verification shape
- done shape

If any of those are missing, the next task is prep, not implementation.

### Build Gate

Every `implement one implementation phase` task must run the normal build gate before reporting the phase as landed.

For this repo, the normal build gate is:

```powershell
npm run build
```

If the phase doc names a different or additional build gate, run both unless the user or dispatcher narrows the policy.

If `npm run build` fails:
- the worker must report the failure
- the worker may make a narrow fix only if the failure is caused by its assigned phase
- the worker must not hide or defer the failure while calling the phase landed
- the dispatcher decides whether to let the Worker repair the failure or stop for user direction

### Focused Verification

Workers should run the focused tests named by the active implementation phase before `npm run build`.

If no focused test is named:
- inspect nearby test scripts or files
- run the smallest relevant test command available
- still run `npm run build`

### Tracking Docs

When implementation ships runtime behavior:
- update `docs/CHANGELOG.md`
- update `docs/Doc-Log.md` for changed docs

When docs change without runtime behavior:
- update `docs/Doc-Log.md`

When a phase or family closes after implementation:
- confirm the Family Phase Doc, Generation Index Doc, `docs/CHANGELOG.md`, and `docs/Doc-Log.md` agree

### Authority Boundary

The dispatcher may spawn agents.

Guide-Rail agents, Workers, and Explorers do not spawn further agents in the Dispatch 2 operating model. They may recommend a follow-up agent, but the live dispatcher makes the actual spawn and phase-advancement decision.

### Guide-Rail Rule

The Guide-Rail Codex owns two modes.

In `prep mode`, it turns the next legal planning target into an implementation-ready phase by tightening:

- CLG derived from preserved HLG
- HLG and CLG coverage links
- phase summary
- `### Phase N Implementation Spec`
- no-widening rule
- likely files or seams
- focused verification shape
- `npm run build` build gate
- done shape
- Worker stop condition

In `coverage review mode`, it checks whether the Worker stayed aligned with the full planning ladder:

1. active Vision Doc HLG
2. active Generation Index Doc CLG and family phase routing
3. active Family Phase Doc implementation phase
4. assigned `### Phase N Implementation Spec`
5. no-widening rule
6. verification/build/tracking closeout

The Guide-Rail Codex should treat guide-rail drift as a finding even when the code compiles.

The Guide-Rail Codex also owns checklist accounting after implementation:

- mark implementation-phase checklist items only when proof supports completion
- classify HLG and CLG coverage as complete, partial, open, or blocked
- keep broad HLG open when later phases are still required
- propose follow-up phases when implementation did not fully achieve the assigned goal
- wait for dispatcher approval before adding new follow-up phase sections

Workers do not prep their own phase or grade their own HLG/CLG completion. Workers may report completion claims, but the Guide-Rail Codex decides the honest coverage read before dispatcher acceptance.

### CLG Creation Rule

Guide-Rail Codex is the canonical CLG creator in Dispatch 2.

CLG are Codex-level goals that translate HLG into repo-actionable planning goals.

Guide-Rail may create or revise CLG during prep mode when:

- HLG exist in the Vision Doc but no CLG exist for the selected generation
- CLG are too broad to route into family phases
- CLG no longer match the live repo seams
- CLG coverage is missing from the Generation Index or Family Phase Doc
- a follow-up phase needs a new repo-actionable goal to finish an HLG honestly

Every CLG must:

- link back to one or more HLG
- route into a family phase, implementation phase, or explicit deferred bucket
- remain more actionable than HLG but less detailed than implementation specs
- preserve original HLG instead of replacing it
- avoid new product direction unless the dispatcher or user approves it

Workers and Explorers do not create canonical CLG unless the dispatcher explicitly assigns that task.

### Handoff Return

Every agent return should include:

- task completed
- status
- files read or changed
- summary
- guide-rail mode, if relevant
- verification run, if any
- build result, if relevant
- coverage accounting, if relevant
- changelog status
- doc-log status
- blockers
- recommended next legal task
