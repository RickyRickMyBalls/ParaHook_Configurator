# Catalog Gen1 Index Completion Dispatch Plan

## Summary

This doc is the manager-facing dispatch plan for finishing the remaining `Generation 1` ladder in `Catalog-Index.md`.

Use it when:
- `Catalog-1` and `Catalog-2` are already complete
- `Catalog-3`, `Catalog-4`, and `Catalog-5` still need their own standalone `Future/` docs
- each of those family phases must then be broken into smaller internal phases that Codex can prep and implement one by one

This doc should be the coordinator loop for the next part of the Catalog family.

## Starting Read

Current expected starting state:

- `Catalog-1` is done
- `Catalog-2` is done
- `Catalog-3` does not yet have its own standalone `Future/` doc
- `Catalog-4` does not yet have its own standalone `Future/` doc
- `Catalog-5` does not yet have its own standalone `Future/` doc
- `Catalog-6` should only be created if the remaining `Generation 1` wishlist no longer fits honestly into `Catalog-3`, `Catalog-4`, or `Catalog-5`

## Gen1 HLG

These are the family-level goals that the remaining `Generation 1` ladder should preserve while the work is compressed into `Catalog-3`, `Catalog-4`, `Catalog-5`, and only later `Catalog-6` if needed:

- [ ] `Gen1-HLG-1. Keep Catalog As A Real Workspace Surface Beside The Model`
- [ ] `Gen1-HLG-2. Keep Asset-Type Ownership Honest Across Reference Preview, Commit, And HDRI Apply`
- [ ] `Gen1-HLG-3. Widen Generation 1 Through Stronger Metadata, Search, Tags, And Reference Notes Without Pulling In Generation 2`
- [ ] `Gen1-HLG-4. Preserve Enough Catalog Item Identity Follow-Through For Later Recall Without Making Catalog The Hidden Runtime Owner`

Important rule:
- only check off a `Gen1-HLG` when the family ladder has really achieved it
- do not check off an HLG just because one intermediate family phase moved part of the work forward

## CLG

Use these coordinator-level goals while driving the remaining ladder:

- [ ] `CLG-1. Create One Standalone Future Doc For Each Large Remaining Catalog-N Family Phase`
- [ ] `CLG-2. Break Each Catalog-N Future Doc Into Codex-Sized Internal Phases`
- [ ] `CLG-3. Use A Prep-Then-Implement Loop For Each Internal Phase`
- [ ] `CLG-4. Finish One Catalog-N Family Phase Before Moving To The Next`
- [ ] `CLG-5. Only Add Catalog-6 If The Remaining Generation 1 Wishlist No Longer Fits Honestly Into Catalog-3 Through Catalog-5`

## Manager Checklist

- [ ] `Catalog-3 future doc exists`
- [ ] `Catalog-3 internal phases are defined`
- [ ] `Catalog-3 is fully complete`
- [ ] `Catalog-4 future doc exists`
- [ ] `Catalog-4 internal phases are defined`
- [ ] `Catalog-4 is fully complete`
- [ ] `Catalog-5 future doc exists`
- [ ] `Catalog-5 internal phases are defined`
- [ ] `Catalog-5 is fully complete`
- [ ] `Catalog-6 required decision is recorded`
- [ ] `Catalog-6 future doc exists if needed`
- [ ] `Catalog-6 is fully complete if needed`
- [ ] `Catalog-Index.md is fully aligned to the finished Generation 1 ladder`

## Family-Phase Creation Loop

For each remaining `Catalog-N` family phase:

1. Start from the assigned wishlist items in `Catalog-Vision.md` and `Catalog-Index.md`.
2. Compress those items into one standalone `Future/` doc for that `Catalog-N` family phase.
3. Add family-phase HLG only for the goals that phase genuinely advances.
4. Add Codex-level goals as needed to make the family phase executable.
5. Break the family phase into internal phases small enough for Codex.
6. Stop and hand execution over to the phase loop once the future doc is implementation-ready.

Important rule:
- the umbrella index organizes the ladder
- the standalone `Future/` doc owns the internal execution ladder

## Internal Phase Loop

Once a standalone `Catalog-N` future doc exists, use this execution loop:

1. tell Codex to prep the next internal phase
2. when prep is done, tell Codex to implement that internal phase
3. repeat prep plus implementation until the full `Catalog-N` family phase is complete
4. write one final `docs/CHANGELOG.md` entry when that `Catalog-N` family phase is complete
5. update:
   - `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Catalog-Index.md`
   - the owning `Future/` family doc
   - `docs/Doc-Log.md`
6. then move to the next `Catalog-N` lane

Important rule:
- do not advance to the next `Catalog-N` family phase until the current one is fully complete

## Planned Order

Run the next part of the ladder in this order:

1. `Catalog-3`
2. `Catalog-4`
3. `Catalog-5`
4. `Catalog-6` only if still required after `Catalog-5`

## Catalog-3 Checklist

- [ ] `Create Catalog-3 future doc`
- [ ] `Map all assigned Catalog-3 wishlist items from Catalog-Vision and Catalog-Index`
- [ ] `Define Catalog-3 HLG and CLG`
- [ ] `Break Catalog-3 into internal phases`
- [ ] `Prep and implement Catalog-3 internal phases until complete`
- [ ] `Close Catalog-3 in the umbrella index`

## Catalog-4 Checklist

- [ ] `Create Catalog-4 future doc`
- [ ] `Map all assigned Catalog-4 wishlist items from Catalog-Vision and Catalog-Index`
- [ ] `Define Catalog-4 HLG and CLG`
- [ ] `Break Catalog-4 into internal phases`
- [ ] `Prep and implement Catalog-4 internal phases until complete`
- [ ] `Close Catalog-4 in the umbrella index`

## Catalog-5 Checklist

- [ ] `Create Catalog-5 future doc`
- [ ] `Map all assigned Catalog-5 wishlist items from Catalog-Vision and Catalog-Index`
- [ ] `Define Catalog-5 HLG and CLG`
- [ ] `Break Catalog-5 into internal phases`
- [ ] `Prep and implement Catalog-5 internal phases until complete`
- [ ] `Close Catalog-5 in the umbrella index`

## Catalog-6 Decision Checklist

- [ ] `Review the remaining Generation 1 wishlist after Catalog-5`
- [ ] `Decide whether Catalog-6 is required`
- [ ] `If required, create Catalog-6 future doc`
- [ ] `If required, break Catalog-6 into internal phases`
- [ ] `If required, prep and implement Catalog-6 until complete`
- [ ] `If not required, record why the remaining wishlist was already covered honestly`

## Shared Rules

Every dispatched Codex should follow these rules:

- repo: `C:\Users\Rubbe\Desktop\ParaHookConfig\20\parahook`
- follow `AGENTS.md`
- follow `docs/Doc-Vision.md`
- follow `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Catalog-Vision.md`
- follow `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Catalog-Index.md`
- do not revert edits made by others
- keep scope to the owned family phase or owned internal phase only
- use the umbrella index as the generation organizer
- use the standalone `Future/` family-phase doc as the execution surface
- use `apply_patch` for manual edits
- do not run tests unless truly necessary
- update `docs/Doc-Log.md` for docs changes
- use one final `docs/CHANGELOG.md` entry when one whole `Catalog-N` family phase is complete

## Dispatch Templates

### Template A - Create The Future Doc

```text
Continue in repo `C:\Users\Rubbe\Desktop\ParaHookConfig\20\parahook` and now own `Catalog-N` future-doc creation.

Follow `AGENTS.md`, `Doc-Vision.md`, `Catalog-Vision.md`, and `Catalog-Index.md`.

Your task is to create the standalone `Future/` doc for `Catalog-N`.

Use the assigned wishlist items from the Catalog vision and umbrella index.
Compress them into:
- family-phase purpose
- owns / does not own
- family-phase HLG
- Codex-level goals if needed
- internal phases small enough for Codex
- checklist and done shape

Do not implement runtime behavior yet.
Finish when the `Catalog-N` future doc is implementation-ready and the umbrella index is updated to point at it.
```

### Template B - Run The Internal Phase Loop

```text
Continue in repo `C:\Users\Rubbe\Desktop\ParaHookConfig\20\parahook` and now own `Catalog-N`.

Follow `AGENTS.md`, `Doc-Vision.md`, `Catalog-Vision.md`, `Catalog-Index.md`, and the standalone `Future/` doc for `Catalog-N`.

Your task is to complete `Catalog-N` through its internal phase loop:
- prep the next internal phase
- implement it
- repeat until the full `Catalog-N` family phase is complete

Constraints:
- keep scope to the owned internal phase only
- do not widen into the next `Catalog-N+1` family phase
- update the owning future doc as progress lands
- update `Catalog-Index.md`
- update `docs/Doc-Log.md`
- add one final `docs/CHANGELOG.md` entry when the whole `Catalog-N` family phase is complete

Stop only when the full `Catalog-N` family phase is complete.
```

## Success Read

This dispatch plan is successful when:

- `Catalog-3`, `Catalog-4`, and `Catalog-5` each have their own standalone `Future/` docs
- each of those family phases has been executed through smaller internal phases
- a later `Catalog-6` is only created if the remaining `Generation 1` wishlist really needs it
- the umbrella `Catalog-Index.md` ends the run as a clean Generation 1 organizer rather than a mixed execution doc
