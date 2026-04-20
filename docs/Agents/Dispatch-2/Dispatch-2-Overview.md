# Dispatch 2 Overview

## Doc Header

### Doc History
6. 2026-04-19 14:33:40: Clarified that Guide-Rail Codex is the Dispatch 2 CLG creator, deriving Codex-level goals from preserved HLG before family-phase routing, implementation specs, and Worker handoffs.
5. 2026-04-19 14:30:18: Added the Start Command Flow to Dispatch 2 so a user command such as `start Home Page Gen 1` can drive Guide-Rail descent from HLG and Vision through the Generation Index, Family Phase Doc, implementation spec, and Worker handoff.
4. 2026-04-19 14:20:05: Replaced the Coverage Reviewer role with Guide-Rail Codex, combining implementation-phase prep and post-worker coverage review into one HLG/CLG-to-spec ownership role while keeping Worker and Explorer separate.
3. 2026-04-19 14:08:52: Clarified that the active Reviewer is a Coverage Reviewer that checks guide-rail alignment, owns end-of-phase checklist accounting, and proposes dispatcher-approved follow-up phases when HLG/CLG coverage remains incomplete.
2. 2026-04-19 14:03:18: Simplified Dispatch 2 from a manager-plus-verifier fleet into the real flat fleet model where the live dispatcher directly coordinates Workers, Explorers, and Reviewers, and Workers own focused verification plus `npm run build`.
1. 2026-04-19 13:55:15: Added this Dispatch 2 overview as the promoted-dispatcher operating model for running manager, worker, explorer, reviewer, and verifier Codex agents around one live user-facing dispatcher.

### Purpose

This file defines the Dispatch 2 system at a glance.

Use it to answer:
- what Dispatch 2 is for
- which agent roles exist
- how the live dispatcher stays interruptible by the user
- how implementation phases move from planning to shipped closeout

Do not use it for:
- replacing project-specific Vision Docs
- replacing active Generation Index Docs or Family Phase Docs
- bypassing `AGENTS.md`
- letting child agents decide roadmap order

## Doc Body

### Core Idea

Dispatch 2 promotes the main Codex in the user's live thread into the dispatcher.

The dispatcher stays available to the user, keeps the overall context, and spawns bounded agents for implementation, exploration, and review.

The user should be able to start from an HLG or command such as `start Home Page Gen 1`. Dispatch 2 then uses Guide-Rail descent to find the right Vision Doc, Generation Index Doc, Family Phase Doc, implementation phase, and Worker handoff.

Dispatch 2 is a flat fleet, not a nested manager tree.

Child agents do not spawn or supervise other child agents. The live dispatcher is the only authority that spawns agents, watches returns, advances phases, accepts closeout, or changes run direction.

### Agent Roles

- `Dispatcher`
  - the main Codex in the live user thread
  - owns user communication, interruption handling, phase advancement, and final acceptance
- `Guide-Rail`
  - creates or revises CLG from preserved Vision HLG during prep mode
  - preps implementation phases from Vision HLG, Generation Index CLG, Family Phase Doc intent, and live seams
  - writes or tightens implementation specs before Worker dispatch
  - reviews Worker results after implementation
  - accounts for which phase checklist items, HLG, and CLG were actually achieved
  - proposes follow-up phases when coverage remains incomplete
- `Explorer`
  - inspects code or docs for a future or adjacent phase
  - returns findings without editing unless explicitly assigned
- `Worker`
  - implements exactly one assigned implementation phase
  - runs focused verification and the normal build gate before returning
  - updates required tracking docs for shipped implementation

### Dispatch Shape

The normal Dispatch 2 loop is:

1. User gives intent or approves a run.
2. Dispatcher reads the active docs and establishes run state.
3. Dispatcher uses `Dispatch-2-Start-Command-Flow.md` when the user gives a broad start command.
4. Dispatcher uses Guide-Rail prep mode to make the next implementation phase ready.
5. Dispatcher spawns one Worker for the prepared implementation phase.
6. Dispatcher may spawn Explorers in parallel for future seams.
7. Worker implements, verifies, builds, updates tracking docs, and returns.
8. Dispatcher uses Guide-Rail coverage review mode to check the work against the full guide-rail ladder and account for checklist coverage.
9. Dispatcher advances, repairs, approves a follow-up phase, or stops based on the result.

### Non-Negotiables

- The user can interrupt or redirect the dispatcher at any time.
- The user should only need to provide the HLG, family intent, or start command.
- The dispatcher keeps one clear source of phase advancement.
- A worker receives one narrow task, not a whole generation or family ladder.
- The Guide-Rail Codex creates CLG from preserved HLG before family-phase routing or Worker dispatch.
- The Guide-Rail Codex owns phase prep before Worker dispatch.
- Implementation phases must run focused tests when named and `npm run build` before being reported as landed.
- The Worker owns verification and build for its assigned phase unless the dispatcher explicitly takes over a command.
- The Guide-Rail Codex owns coverage review from Vision HLG down to implementation spec after Worker return.
- The Guide-Rail Codex owns final HLG/CLG checklist accounting before phase acceptance.
- Follow-up phases may be proposed by the Guide-Rail Codex, but only the dispatcher approves adding them.
- Shipped implementation must update `docs/CHANGELOG.md`.
- Any docs changed must update `docs/Doc-Log.md`.
- A phase is not closed out until implementation, verification, build, review, and tracking agree.
