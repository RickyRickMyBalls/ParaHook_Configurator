# Dispatch 3a Overview

## Doc Header

### Doc History
1. 2026-04-19 17:32:30: Added this Dispatch 3a overview to define the persistent-lane dispatch model where the live Manager keeps Yap Intake, HLG > Spec, Worker, and optional Explorer Codex agents coordinated without turning every step into a one-off sequence.

### Purpose

This file defines Dispatch 3a at a glance.

Use it to answer:
- what Dispatch 3a is for
- which persistent lanes exist
- how the live Manager stays interruptible
- how user yap becomes implementation-ready specs and shipped work

Do not use it for:
- replacing active family Vision, Generation Index, or Family Phase docs
- bypassing `AGENTS.md`
- letting child agents spawn child agents
- letting Workers implement without a prepared spec

## Doc Body

### Core Idea

Dispatch 3a turns the live Codex thread into a persistent Manager lane.

The Manager keeps the user-facing conversation alive, keeps lane agents alive when useful, and routes work between three main lanes:

```text
User yap
  -> Yap Intake Codex logs entries
  -> HLG > Spec Codex turns yap and HLG into CLG, planning docs, and specs
  -> Worker Codex implements the next prepared phase and runs npm run build
  -> Manager checks state, routes interruptions, and advances the loop
```

Dispatch 3a is still a flat fleet.

Child agents do not spawn or supervise other child agents. The live Manager is the only authority that spawns agents, watches returns, advances phases, accepts closeout, or changes run direction.

### Agent Roles

- `Manager`
  - the main Codex in the live user thread
  - owns user communication, lane supervision, interruption handling, phase advancement, and final acceptance
- `Yap Intake Codex`
  - side-channel listener the user can talk to freely
  - logs raw yap into the intake log and extracts rough HLG candidates
- `HLG > Spec Codex`
  - planning and guide-rail lane
  - turns HLG into CLG, routes Vision to Index to Family Phase docs, preps implementation specs, and reviews coverage after Worker return
- `Worker Codex`
  - implementation lane
  - implements one prepared phase, runs focused verification, runs `npm run build`, and updates required tracking docs
- `Explorer Codex`
  - optional read-only sidecar
  - answers bounded repo questions for Manager or HLG > Spec without taking ownership of planning or implementation

### Dispatch Shape

The normal Dispatch 3a loop is:

1. User yaps to the Manager or Yap Intake Codex.
2. Yap Intake records a newest-first entry with raw note, rough HLG candidates, likely family, and status.
3. Manager sends the next intake or active HLG to HLG > Spec.
4. HLG > Spec reads the repo docs and live seams, then creates or repairs CLG and the next planning layer.
5. HLG > Spec produces a Worker-ready implementation spec and handoff.
6. Manager sends the handoff to Worker.
7. Worker implements, verifies, runs `npm run build`, updates required tracking docs, and returns.
8. HLG > Spec performs coverage review from HLG through CLG, spec, diff, proof, and tracking docs.
9. Manager accepts, requests repair, advances to the next phase, or asks the user for a missing product decision.

### Non-Negotiables

- The user should only need to provide HLG, yap, or a broad start command.
- The Manager stays alive and interruptible.
- Lane agents stay alive when they are useful.
- Do not kill lane agents unless the user asks, the lane is stale, or context/tool limits require it.
- HLG are preserved as human-level goals.
- HLG > Spec creates CLG as Codex-level goals that try to accomplish HLG.
- Workers receive prepared implementation specs, not vague HLG.
- Workers run focused verification and `npm run build` before reporting a phase landed.
- Shipped implementation must update `docs/CHANGELOG.md`.
- Changed docs must update `docs/Doc-Log.md`.
- A phase is not closed until implementation, verification, build, coverage review, and tracking docs agree.
