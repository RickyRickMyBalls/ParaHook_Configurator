# Build-Path-12.2 - Timeline Selection Edit History

## Doc Header

### Doc History
1. 2026-05-23 16:22:05: Added, specified, implemented, and closed this Build Path follow-up so user-driven master timeline selection changes are recorded in global Edit History and can be undone/redone with Ctrl+Z/Ctrl+Y.

### Purpose

This doc captures the Build Path timeline selection Edit History repair.

Use it to answer:
- why Build Path timeline moves belong in global Edit History
- which Build Path selection changes create undoable entries
- how undo/redo selection changes stay separate from CAD graph truth

Do not use it for:
- restoring CAD graph state
- replaying worker checkpoints
- persisted Build Path event history
- branch-local timeline selection history beyond the master timeline selection repaired here

## Doc Body

Build Path is a CAD-node timeline, and Edit History is the app-level Ctrl+Z/Ctrl+Y owner.

When the user manually moves the Build Path master timeline selection from one node to another, that is an app-level state change. It should be undoable in the same global Edit History stack as other app changes.

Boundary rule:
- undoing a Build Path timeline selection restores the previous selected Build Path timeline step
- redoing restores the later selected Build Path timeline step
- undo/redo must not mutate authored graph truth
- undo/redo must not execute restore, branch, compare, pin, or worker replay behavior
- automatic follow-selection after an accepted CAD command remains internal selection state, not an extra history entry

## Wishlist Organization

### High Level Goals

- [x] `Build-Path-Gen1-HLG-4. Build Path should support view-only scrub/inspection without becoming canonical Edit History undo/redo.`
- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`

### Codex Level Goals

- [x] Build-Path-Gen1-CLG-13. Add global Edit History entries for user-driven Build Path master timeline selection changes without mutating graph truth.

### `Build-Path-12.2 / Phase 1`

- [x] Record user-driven master timeline selection changes in global Edit History.
- [x] Undo restores the previous Build Path selected timeline step.
- [x] Redo restores the later Build Path selected timeline step.
- [x] Accepted CAD command auto-follow does not add a second timeline history entry.
- [x] Cancelled/skipped command intake does not change timeline selection.
- [x] Preserve graph truth and Build Path read-only scrub semantics.

## [x] `Build-Path-12.2 / Phase 1` - `Master Timeline Selection History`

### Phase 1 Summary

Make user-driven Build Path master timeline selection changes undoable through global Edit History.

### Phase 1 Implementation Spec

The implementation should:
- commit an Edit History entry when `selectTimelineStep` changes the selected master timeline step
- label the entry as Build Path timeline selection
- undo by restoring the previous selected timeline step
- redo by restoring the later selected timeline step
- avoid committing no-op entries when the selected step does not change
- keep automatic accepted CAD command follow-selection as internal state

Do not include:
- graph mutation
- restore/replay behavior
- worker checkpoint behavior
- branch-local playhead history
- lifecycle-card auto-selection history

Verification:
- `npm.cmd test -- --run src/app/buildPath/BuildPathSurface.test.tsx src/app/buildPath/recordBuildPathGraphCommand.test.ts`
- `npx.cmd tsc -b`
- `npm.cmd run build`

## Completion Read

Implemented:
- user-driven master timeline selection writes global Edit History entries
- Ctrl+Z restores the previous selected Build Path timeline step
- Ctrl+Y reapplies the later selected Build Path timeline step
- accepted CAD command auto-follow remains an internal selection update

Verified:
- focused Build Path surface and recording tests passed
- TypeScript passed
- production build passed with existing Vite OCCT/browser external and large chunk warnings
