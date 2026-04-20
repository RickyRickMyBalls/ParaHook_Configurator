# Dispatch 2 Start Command Flow

## Doc Header

### Doc History
2. 2026-04-19 14:33:40: Added CLG creation to the start-command descent so Guide-Rail prep mode derives or repairs Generation Index CLG from preserved Vision HLG before routing family phases or producing a Worker handoff.
1. 2026-04-19 14:30:18: Added this start-command flow so Dispatch 2 can turn a user command such as `start Home Page Gen 1` into Guide-Rail descent, implementation-phase prep, Worker handoff, implementation, build, and coverage review without requiring the user to provide anything beyond the HLG or start intent.

### Purpose

This file defines how Dispatch 2 starts from a small user command or HLG and descends the planning ladder until a Worker has a straight implementation task.

Use it to answer:
- what to do when the user says `start <family> Gen N`
- how Guide-Rail finds the Vision, Generation Index, Family Phase Doc, and next implementation phase
- what happens when a planning layer is missing
- when the dispatcher should ask the user for more direction

Do not use it for:
- replacing active family docs
- skipping Guide-Rail prep mode
- letting the Worker write its own phase target
- making product decisions that were not captured in HLG or approved by the dispatcher

## Doc Body

### Main Rule

The user should only need to provide the HLG, family intent, or start command.

Dispatch 2 should do the rest of the descent:

```text
User HLG or start command
  -> Guide-Rail descent
  -> Vision Doc HLG
  -> Guide-Rail CLG creation or repair
  -> Generation Index CLG and family-phase routing
  -> Family Phase Doc
  -> next implementation phase
  -> implementation-ready spec
  -> Worker handoff
```

### Valid Start Commands

Examples:

- `start Home Page Gen 1`
- `start Catalog Gen 2`
- `continue Home-Page-1`
- `resume Home-Page-1 Phase 2`
- `implement next Home Page phase`
- `take this HLG and start the planning ladder`

The dispatcher should treat these as enough to begin discovery unless the target is ambiguous.

### Dispatcher First Pass

When the user gives a start command, the dispatcher should:

1. identify the likely family
2. identify the requested generation, if named
3. identify the requested family phase or implementation phase, if named
4. read the active docs needed to resolve the target
5. decide whether Guide-Rail descent can proceed
6. spawn or use Guide-Rail in prep mode

If the command is ambiguous, ask one short clarifying question instead of inventing the target.

### Guide-Rail Descent

Guide-Rail prep mode should locate or create the next legal planning surface in this order:

1. `Vision Doc`
   - find the active `IdeaName-Vision.md`
   - confirm the relevant HLG exist
   - if the HLG are missing, add or propose them before lower planning
2. `Generation Index Doc`
   - find the active `IdeaName-GenN-Index.md`
   - derive or repair CLG from preserved HLG when needed
   - confirm CLG and family-phase routing exist for the selected generation
   - if missing, create or prep the generation index before implementation
3. `Family Phase Doc`
   - find the active `Future/IdeaName-N - Family Phase Name.md` or current older equivalent
   - confirm the family phase is split into implementation phases
   - if missing, create or prep the Family Phase Doc before implementation
4. `Implementation Phase`
   - find the next open implementation phase
   - confirm it has summary, no-widening rule, verification shape, done shape, and `### Phase N Implementation Spec`
   - if missing, prep the implementation phase before Worker dispatch
5. `Worker Handoff`
   - produce the exact Worker task only after the implementation phase is ready

### Missing Layer Rule

If a layer is missing, the next legal task is to create or prep that layer.

- Vision Doc missing HLG
  - Guide-Rail captures HLG in the Vision Doc before deriving CLG
- Generation Index missing
  - Guide-Rail creates or updates the Generation Index Doc
- CLG missing or stale
  - Guide-Rail derives or repairs CLG from preserved HLG before routing family phases
- Family Phase Doc missing
  - Guide-Rail creates or updates the Family Phase Doc
- Implementation Phase Spec missing
  - Guide-Rail writes or tightens `### Phase N Implementation Spec`
- Implementation Phase Spec ready
  - Guide-Rail returns a Worker handoff

Do not skip directly from HLG to Worker implementation.

### CLG Descent Rule

CLG are the bridge between human goals and implementation planning.

Guide-Rail prep mode should create CLG when the user-provided HLG have not yet been translated into repo-actionable goals.

For each CLG:

- name the HLG it serves
- state the repo-actionable goal
- keep it broader than an implementation spec
- route it into the active generation's family phases or a deferred bucket
- do not delete or rewrite the original HLG

If the Guide-Rail Codex cannot derive a CLG without making a new product decision, it should stop and ask the dispatcher for clarification.

### Ask User Only When Blocked

The dispatcher should not ask the user for details the repo docs can answer.

Ask the user only when:

- more than one family matches the start command
- more than one generation is plausible and no doc resolves it
- the docs conflict in a way that changes product direction
- the next phase needs a new UX/product decision not captured in HLG
- implementing would cross a stated no-widening rule

### Worker Handoff Shape

Guide-Rail prep mode should return a Worker handoff with:

- role: `Worker`
- active family
- active generation
- active family phase
- active implementation phase
- task type: `implement one implementation phase`
- required docs to read
- exact implementation spec heading
- owned scope
- no-widening rules
- likely files
- focused verification commands or test files
- build gate: `npm run build`
- tracking docs requirements
- stop condition
- return contract

### Worker Completion Shape

The Worker must:

1. implement only the assigned phase
2. run focused verification
3. run `npm run build`
4. repair in-scope failures caused by its changes
5. update `docs/CHANGELOG.md` for shipped behavior
6. update `docs/Doc-Log.md` for docs changes
7. return the implementation summary, files changed, tests, build result, tracking status, and blockers

### Coverage Review Shape

After the Worker returns, Guide-Rail coverage review mode should:

- compare Worker output to the Vision HLG, Generation Index CLG, Family Phase Doc, and implementation spec
- classify checklist items as `complete`, `partial`, `open`, or `blocked`
- keep broad HLG open when later phases are still required
- propose follow-up phases when coverage remains incomplete
- tell the dispatcher whether the next phase is ready to prep or implement

### Home Page Gen1 Start Read

For `start Home Page Gen 1`, the current expected descent is:

- Vision Doc:
  - `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Home-Page/Home-Page-Vision.md`
- Generation Index Doc:
  - `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Home-Page/Home-Page-Gen1-Index.md`
- Family Phase:
  - `Home-Page-1 - Workspace Landing Surface And Startup Preference`
- Family Phase Doc:
  - `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Home-Page/Future/Home-Page_Phase Home-Page-1 - Workspace Landing Surface And Startup Preference.md`
- next implementation phase:
  - `Home-Page-1 / Phase 1 - Surface Registry And Minimal Render`

If those docs remain ready, Guide-Rail prep mode should validate Phase 1 and return the Worker handoff without asking the user for more product direction.
