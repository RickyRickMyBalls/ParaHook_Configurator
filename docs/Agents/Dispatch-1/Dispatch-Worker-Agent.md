# Dispatch Worker Agent

## Doc Header

### Doc History
5. 2026-04-19 12:21:28: Polished the Family Phase Doc task wording so the worker guide uses the exact `### Phase N Implementation Spec` heading when describing where implementation prep must stop, begin, or prove readiness.
4. 2026-04-19 12:07:07: Tightened the worker guide around the Codex Desktop notes file ladder, adding explicit task shapes for Vision Doc capture, generation routing, Generation Index Doc setup, Family Phase Doc setup, implementation phase prep, and implementation.
3. 2026-04-18 23:20:00: Added explicit changelog and doc-log closeout duties so workers record shipped implementation and changed-file history before returning an implemented or closed-out phase
2. 2026-04-18 18:24:00: Updated the worker guide with distinct planning-ladder task types so workers can capture Vision and HLG, derive CLG, chunk phases, add wishlist and phase summary sections, prep implementation specs, or implement specs without collapsing those steps together
1. 2026-04-18 16:11:42: Added this reusable worker-agent guide for one-task-at-a-time dispatch runs, defining the generic read, execute, stop, and return-contract rules so a worker Codex can slot into any family loop without improvising scope or handoff behavior

### Purpose

This file defines how a worker Codex should behave inside a manager-controlled dispatch loop.

Use it to answer:
- what a worker is allowed to do
- what the worker must read before starting
- how the worker should stop at the assigned boundary
- what the worker must return to the manager

Do not use it for:
- deciding the roadmap order
- picking the next family or phase
- replacing the active dispatch plan, Vision Doc, Generation Index Doc, or Family Phase Doc

## Doc Body

### Main Rule

The worker owns one narrow task only.

The worker should not decide what comes after that task unless the manager explicitly asks for a suggested next legal step in the return message.

### Required Inputs

Before starting work, the worker should have:

- the exact task type
- the active family
- the active generation when relevant
- the active family phase when relevant
- the active implementation phase when relevant
- the list of required docs to read
- the hard constraints for this run
- the stop condition

If any of those are missing, the worker should make the smallest safe assumption possible and keep the work narrow.

### Worker Task Types

The worker should expect only one of these task shapes:

- `capture or update Vision Doc and HLG`
- `route HLG into generations`
- `derive CLG for one generation`
- `create or update one Generation Index Doc`
- `chunk one generation into family phases`
- `create or update one Family Phase Doc`
- `chunk one family phase into implementation phases`
- `prep one implementation phase`
- `implement one implementation phase`
- `run one narrow verification check`
- `close out one family`

The worker should not convert one task type into another.

Example:
- if the task is `prep one implementation phase`, do not also implement that phase
- if the task is `implement one implementation phase`, do not widen into prep for the next phase
- if the task is `capture or update Vision Doc and HLG`, do not derive CLG unless assigned
- if the task is `derive CLG`, do not create implementation specs unless assigned
- if the task is `create or update one Generation Index Doc`, do not write implementation specs unless assigned
- if the task is `create or update one Family Phase Doc`, do not implement or widen into another family phase

### Worker Loop

Use this loop:

1. Read the assigned docs.
2. Confirm the owned family, phase, and task type.
3. Do only the work needed to satisfy that task.
4. Update the owned code and docs that belong to that task.
5. Stop at the assigned boundary.
6. Return a concise manager-facing handoff.

### Task-Specific Done Shapes

For `capture or update Vision Doc and HLG`:
- the family doc should have or update a `## Vision` section above `## Wishlist Organization`
- the human-readable vision summary should preserve the user's intent
- HLG should be captured there before being compressed into CLG, family phases, or implementation phases
- wishlist and implementation details should not be widened unless assigned

For `route HLG into generations`:
- the Vision Doc should route HLG into generation `##` sections
- generation routing should preserve every HLG instead of dropping awkward items
- implementation specs should not be written unless assigned

For `derive CLG for one generation`:
- CLG should be derived from the Vision Summary and HLG
- CLG should keep repo-actionable language without becoming implementation specs
- family-phase chunking should not be finalized unless assigned

For `create or update one Generation Index Doc`:
- the Generation Index Doc should include `## Doc Header`, `## Vision`, `## Wishlist Organization`, and one `## IdeaName-N - Family Phase Name` section per family phase
- HLG and CLG should be represented in the wishlist organization
- each family phase should have a summary and ownership boundaries
- implementation specs should not be written unless assigned

For `chunk one generation into family phases`:
- HLG and CLG should be split into large family phases such as `Catalog-1`, `Catalog-2`, or `Home-Page-1`
- if one family phase is enough, create one family phase
- if several family phases are needed, propose or add several family phases
- implementation specs should not be written unless assigned

For `create or update one Family Phase Doc`:
- the Family Phase Doc should include `## Doc Header`, `## Vision`, `## Wishlist Organization`, and one `## IdeaName-N / Phase N - Implementation Phase Name` section per implementation phase
- the doc filename target should be `Future/IdeaName-N - Family Phase Name.md`, while older repo files may still use `Future/IdeaName_Phase IdeaName-N - Family Phase Name.md`
- each implementation phase should have a summary and planning shell
- the section should stop before `### Phase N Implementation Spec` unless the task explicitly says to prep implementation

For `chunk one family phase into implementation phases`:
- the family phase should be split into Codex-sized implementation phases
- each implementation phase should preserve relevant HLG and CLG links
- runtime implementation should not happen unless assigned

For `prep one implementation phase`:
- the implementation phase should end implementation-ready
- the worker should add or tighten the `### Phase N Implementation Spec`
- runtime behavior should not be widened unless the task explicitly allows it

For `implement one implementation phase`:
- the owned behavior for that phase should be landed
- the active implementation phase must already have a `### Phase N Implementation Spec`
- the worker should update the active Family Phase Doc and owning Generation Index Doc status when the implementation changes phase state
- the worker should add `docs/CHANGELOG.md` and `docs/Doc-Log.md` entries before returning if the implementation shipped behavior or closes a major docs/system lane
- the worker should stop before touching later phases

For `run one narrow verification check`:
- only the requested proof should be gathered
- no opportunistic cleanup or later-phase work should be added

For `close out one family`:
- only the required closeout docs and tracking surfaces should be updated
- the Vision Doc, Generation Index Doc, Family Phase Doc, `docs/CHANGELOG.md`, and `docs/Doc-Log.md` should all be checked before reporting `closed out`
- the worker should not invent new future work unless the active docs require an honest follow-on note

### Return Contract

Every worker run should return:

- the task completed
- the current status
- the files changed
- a short summary of what changed
- changelog status
- doc-log status
- blockers or unresolved seams
- the next legal task the manager should consider

Status language should stay concrete:

- `not started`
- `blocked`
- `implementation-ready`
- `implemented`
- `verified`
- `closed out`

### Guardrails

- Do not widen into a different family.
- Do not widen into later phases.
- Do not reopen skipped phases.
- Do not silently rewrite the user’s run controls.
- Do not mark human-level goals complete unless the active docs explicitly support that conclusion.
- Do not turn one narrow task into a whole-family completion pass.
- Do not move new HLG directly into wishlist execution without preserving them in `## Vision` first.
- Do not write `### Phase N Implementation Spec` while doing only Vision, CLG, or phase-chunking work.
- Do not implement a phase unless the manager assigned implementation and the active implementation phase already has an implementation spec.
- Do not report an implemented or closed-out phase as fully complete while required changelog or doc-log entries are missing.

### Completion Rule

This worker guide is being followed correctly when:

- the worker stays inside one task type
- the worker stays inside one owned phase or family surface
- the manager can decide the next step without re-reading the whole repo
- the return message makes the next legal handoff obvious
