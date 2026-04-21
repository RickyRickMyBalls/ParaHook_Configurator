# Dispatch 4 Simple Run State

## Doc Header

### Doc History
3. 2026-04-20 12:43:36: Added the vision coverage audit step to the simple run-state queue so Manager checks whether remaining wishlist work needs a new family phase or a normal/follow-up phase before Worker prep.
2. 2026-04-20 12:40:50: Updated the run-state language so Manager blocks out family phase plan docs and adds follow-up phases when coverage remains incomplete, while Worker owns selected phase prep and implementation with `npm run build`.
1. 2026-04-20 12:27:46: Added the Dispatch 4 Simple run-state board for tracking the current Manager plus Worker loop while Catalog Vision 2 is being filled and implemented phase by phase.

### Purpose

This file is the lightweight state board for Dispatch 4 Simple.

Use it to answer:
- what the Manager is currently supervising
- which phase is being prepped or implemented
- whether Worker is waiting for approval
- what the next legal Manager action is

Do not use it for:
- full implementation specs
- replacing active family plan docs
- replacing `docs/CHANGELOG.md` or `docs/Doc-Log.md`

## Doc Body

### Current Objective

- Status: `[ ]` Dispatch 4 Simple created and ready for first active phase
- User objective: continue Catalog Vision 2 until it is complete using the simple Manager plus Worker loop
- Active family: Catalog
- Active vision/planning surface: Catalog Vision 2, to be supplied or expanded by the user and separate spec agent
- Active family phase plan doc: none yet
- Active phase: none yet
- Manager resume point: block out the next Catalog Vision 2 family phase plan doc or select the next ready phase, then send Worker a prep assignment for that phase

### Active Roles

- Manager: live user-facing Codex
- Worker: one Worker assigned by Manager when a selected phase is ready for prep or implementation
- Separate spec agent: outside this loop; user may use it to keep filling the vision and wishlist

### Queue

- `[ ]` Identify the first Catalog Vision 2 plan-doc target.
- `[ ]` Manager compares active Vision 2 wishlist against Generation Index and existing family phase docs.
- `[ ]` Manager decides whether the next move is a new family phase, a normal phase, a follow-up phase, a docs-only repair, or a later-generation defer.
- `[ ]` Manager blocks out or updates the family phase plan doc.
- `[ ]` Send Worker a prep assignment for one selected phase inside the family phase plan doc.
- `[ ]` Manager reviews the prepared spec and researches live code seams.
- `[ ]` Manager approves or revises the spec.
- `[ ]` Send Worker the implementation assignment.
- `[ ]` Worker implements, verifies, and runs `npm run build`.
- `[ ]` Manager checks wishlist, HLG, CLG, focused tests, and build proof.
- `[ ]` Manager accepts, repairs, adds a follow-up phase, or advances to the next phase.

### Blockers

- No active Catalog Vision 2 phase has been selected yet.

### Next Legal Task

Select or block out the first Catalog Vision 2 family phase plan doc, then use Dispatch 4 Simple Worker prep mode for the first selected phase.
