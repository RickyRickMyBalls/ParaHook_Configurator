# Dispatch 3a Shared Rules

## Doc Header

### Doc History
1. 2026-04-19 17:32:30: Added the shared Dispatch 3a rules for truth hierarchy, persistent lane behavior, HLG-to-CLG ownership, implementation readiness, build gates, tracking docs, and child-agent authority boundaries.

### Purpose

This file defines the rules every Dispatch 3a role follows.

Use it to answer:
- which instructions win
- when persistent agents should stay alive
- when Worker implementation is legal
- who creates CLG
- what verification and tracking docs are required

Do not use it for:
- choosing product roadmap order without active family docs
- replacing role-specific Dispatch 3a docs
- replacing `AGENTS.md`

## Doc Body

### Truth Hierarchy

Interpret instructions in this order:

1. direct user instructions in the live thread
2. `AGENTS.md`
3. `docs/Vision.md`
4. `docs/Human-Plans/roadmap/Vision-roadmap.md`
5. `docs/Agents/Implementation-Behavior.md`
6. active Dispatch 3a role docs
7. active Vision Doc
8. active Generation Index Doc
9. active Family Phase Doc
10. active Worker handoff

Lower documents may specialize execution, but they must not silently override higher-level truth.

### Persistent Agent Rule

Dispatch 3a prefers persistent lane agents over one-off agents.

Keep these lanes alive when possible:

- Yap Intake Codex
- HLG > Spec Codex
- Worker Codex
- optional Explorer Codex while its question remains useful

Do not kill lane agents unless:

- the user asks
- the lane is stale and no longer useful
- context, tool, or agent-count limits require closing one
- the agent is blocked in a way that cannot be repaired by a new input

When an agent cap is hit, preserve agents in this order:

1. Manager
2. active HLG > Spec Codex
3. active Worker Codex
4. Yap Intake Codex when the user is actively yapping
5. Explorer Codex

### No Spec, No Worker Rule

A Worker may implement only after HLG > Spec or the Manager can point to an implementation-ready spec.

Implementation readiness requires:

- active family and generation, when relevant
- active Family Phase Doc or equivalent implementation plan
- one specific implementation phase
- `### Phase N Summary` or equivalent phase summary
- implementation spec or rails clear enough for Worker action
- HLG and CLG coverage links
- no-widening rule
- likely files or live seams
- focused verification shape
- `npm run build` build gate
- done shape and stop condition

If those are missing, the next task is HLG > Spec prep, not Worker implementation.

### CLG Creation Rule

HLG > Spec Codex is the canonical CLG creator in Dispatch 3a.

CLG are Codex-level goals that translate vague HLG into repo-actionable planning goals.

HLG > Spec may create or revise CLG when:

- HLG exist but CLG are missing
- CLG are too broad to route into family phases
- CLG no longer match live repo seams
- CLG coverage is missing from the Generation Index or Family Phase Doc
- a follow-up phase needs a repo-actionable goal to finish an HLG honestly

Every CLG must:

- link back to one or more HLG
- route into a family phase, implementation phase, or explicit deferred bucket
- be more actionable than HLG but less detailed than implementation specs
- preserve original HLG instead of replacing it
- avoid new product direction unless the Manager or user approves it

Workers do not create canonical CLG.

### Build Gate

Every Worker implementation task must run the normal build gate before reporting the phase as landed.

For this repo, the normal build gate is:

```powershell
npm run build
```

If the phase doc names a different or additional build gate, run both unless the Manager narrows the policy.

If `npm run build` fails:

- Worker must report the failure
- Worker may repair only failures caused by its assigned phase
- Worker must not call the phase landed while the build gate fails
- Manager decides whether repair stays with Worker or stops for user direction

### Focused Verification

Workers should run focused tests named by the active implementation phase before `npm run build`.

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
- do not update `docs/CHANGELOG.md`

When a phase or family closes after implementation:

- confirm the Family Phase Doc, Generation Index Doc, `docs/CHANGELOG.md`, and `docs/Doc-Log.md` agree

### Authority Boundary

The Manager may spawn agents.

Yap Intake, HLG > Spec, Worker, and Explorer agents do not spawn further agents in the Dispatch 3a operating model. They may recommend a follow-up agent, but the live Manager makes the actual spawn and phase-advancement decision.

### Handoff Return

Every agent return should include:

- task completed
- status
- files read or changed
- summary
- lane name
- verification run, if any
- build result, if relevant
- HLG and CLG coverage accounting, if relevant
- changelog status
- doc-log status
- blockers
- recommended next legal task
