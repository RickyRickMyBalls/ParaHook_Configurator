# Environment 1 And 2 Completion Dispatch Plan

## Summary

This doc is the manager-facing dispatch plan for finishing the open `Environment` family work in:

- `Environment-1 - Default Lighting, Presets, And HDRI Runtime`
- `Environment-2 - Photoshop-Like Grade Controls, Persistence, And Workflow Polish`

Use it when:
- the current startup scene baseline must stay preserved
- `Environment-1` still needs its remaining opt-in preset, Browser-light, and HDRI/runtime follow-through
- `Environment-2` still needs its grading, persistence, and workflow-polish lane
- one worker Codex should be managed through the normal prep-then-implement loop until both environment family phases are complete

This doc should be the coordinator loop for finishing the current environment family ladder.

## Starting Read

Current expected starting state:

- the current startup scene is locked as the preserved default baseline
- `Environment-1 / Phase 1`, `Phase 2`, `Phase 2b`, and `Phase 2d` are historical shipped work
- `Environment-1 / Phase 2c` is still open
- `Environment-1 / Phase 3` through `Phase 8` are still open
- `Environment-2` does not yet have its own standalone `Future/` doc
- the user will test behavior after both `Environment-1` and `Environment-2` are complete

## Environment-1 HLG

These are the family-level goals that the remaining `Environment-1` ladder should preserve while the work is compressed into the remaining open phases:

- [ ] `Environment-1-HLG-1. Preserve The Current Startup Scene As The Locked Baseline`
- [ ] `Environment-1-HLG-2. Make Environment Presets Honest`
- [ ] `Environment-1-HLG-3. Finish The Visible Environment Surface`
- [ ] `Environment-1-HLG-4. Add Optional Browser-Facing Light Help If Still Needed`
- [ ] `Environment-1-HLG-5. Make HDRI Or Environment Lighting Real In The Viewport`
- [ ] `Environment-1-HLG-6. Make Chosen Environment Lighting Tunable`

Important rule:
- only check off an `Environment-1-HLG` when the remaining ladder has really achieved it
- do not check off an HLG just because one intermediate phase moved part of the work forward

## Environment-2 HLG

These are the family-level goals that `Environment-2` should preserve while its work is organized into a standalone future doc and then completed through smaller internal phases:

- [ ] `Environment-2-HLG-1. Add Photoshop-Like Grade Controls`
- [ ] `Environment-2-HLG-2. Keep Scene Controls Separate From Final Image Grading`
- [ ] `Environment-2-HLG-3. Add Persistence For Environment Look Workflows`
- [ ] `Environment-2-HLG-4. Add Recall And Compare Helpers`
- [ ] `Environment-2-HLG-5. Finish A Production-Ready Environment Workflow`

Important rule:
- only check off an `Environment-2-HLG` when the family ladder has really achieved it
- do not check off an HLG just because one intermediate phase moved part of the work forward

## CLG

Use these coordinator-level goals while driving the remaining environment ladder:

- [ ] `CLG-1. Finish The Remaining Open Environment-1 Phases In Order`
- [ ] `CLG-2. Create One Standalone Future Doc For Environment-2 Before Implementation`
- [ ] `CLG-3. Break Environment-2 Into Codex-Sized Internal Phases`
- [ ] `CLG-4. Use A Prep-Then-Implement Loop For Every Remaining Internal Phase`
- [ ] `CLG-5. Keep The Startup Scene Baseline Preserved Unless A Later Doc Explicitly Reopens It`
- [ ] `CLG-6. Record One Final Changelog Entry When Environment-1 Is Complete And One Final Changelog Entry When Environment-2 Is Complete`
- [ ] `CLG-7. Leave Behavior Testing To The User After Both Environment-1 And Environment-2 Are Complete Unless A Narrow Check Is Truly Necessary To Unblock The Loop`

## Manager Checklist

- [ ] `Environment-1 / Phase 2c is fully complete`
- [ ] `Environment-1 / Phase 3 is fully complete`
- [ ] `Environment-1 / Phase 4 is fully complete`
- [ ] `Environment-1 / Phase 5 is fully complete if still needed`
- [ ] `Environment-1 / Phase 6 is fully complete`
- [ ] `Environment-1 / Phase 7 is fully complete`
- [ ] `Environment-1 / Phase 8 is fully complete`
- [ ] `Environment-1 is fully complete`
- [ ] `Environment-2 future doc exists`
- [ ] `Environment-2 internal phases are defined`
- [ ] `Environment-2 is fully complete`
- [ ] `Environment-Index.md is fully aligned to the finished `Environment-1` and `Environment-2` ladder`

## Environment-1 Completion Loop

Use the existing `Environment-1` future doc as the execution surface:

- `docs/Human-Plans/Architecture/View-Toolbar/Environment/Future/Environment_Phase Environment-1 - Default Lighting, Presets, And HDRI Runtime.md`

For the remaining open `Environment-1` ladder:

1. start with the next incomplete phase in the `Environment-1` doc
2. tell Codex to prep that next incomplete phase
3. when prep is done, tell Codex to implement that phase
4. repeat until the next `Environment-1` phase is fully complete
5. continue through the remaining open ladder in order:
   - `Phase 2c`
   - `Phase 3`
   - `Phase 4`
   - `Phase 5` if still needed
   - `Phase 6`
   - `Phase 7`
   - `Phase 8`
6. when all remaining `Environment-1` phases are complete:
   - update the owning future doc
   - update `docs/Human-Plans/Architecture/View-Toolbar/Environment/Environment-Index.md`
   - update `docs/Doc-Log.md`
   - write one final `docs/CHANGELOG.md` entry for `Environment-1`

Important rule:
- `Environment-1` stays the active lane until it is fully complete
- do not move to `Environment-2` early just because one late `Environment-1` phase feels small

## Environment-2 Creation Loop

Before implementation, create the standalone future doc for `Environment-2`.

The `Environment-2` doc should:

1. start from the `Environment-2` HLG and wishlist items in `Environment-Index.md`
2. compress those items into:
   - family-phase purpose
   - owns / does not own
   - family-phase HLG
   - Codex-level goals if needed
   - internal phases small enough for Codex
   - checklist and done shape
3. keep the grading lane explicitly separate from scene-state ownership
4. keep the startup baseline preserved
5. stop once the standalone `Environment-2` future doc is implementation-ready

Important rule:
- the umbrella index organizes the family ladder
- the standalone `Environment-2` future doc owns the internal execution ladder

## Environment-2 Execution Loop

Once the standalone `Environment-2` future doc exists, use this execution loop:

1. tell Codex to prep the next internal phase
2. when prep is done, tell Codex to implement that internal phase
3. repeat prep plus implementation until the full `Environment-2` family phase is complete
4. when `Environment-2` is fully complete:
   - update the owning future doc
   - update `docs/Human-Plans/Architecture/View-Toolbar/Environment/Environment-Index.md`
   - update `docs/Doc-Log.md`
   - write one final `docs/CHANGELOG.md` entry for `Environment-2`

Important rule:
- do not create an extra environment family phase unless the `Environment-2` wishlist truly no longer fits honestly inside one family doc

## Planned Order

Run the remaining environment ladder in this order:

1. finish `Environment-1`
2. create the `Environment-2` future doc
3. finish `Environment-2`
4. hand behavior testing to the user after both family phases are complete

## Environment-1 Checklist

- [ ] `Confirm the preserved-startup-baseline rule stays explicit in the Environment docs`
- [ ] `Prep and implement Environment-1 / Phase 2c until complete`
- [ ] `Prep and implement Environment-1 / Phase 3 until complete`
- [ ] `Prep and implement Environment-1 / Phase 4 until complete`
- [ ] `Prep and implement Environment-1 / Phase 5 if still needed`
- [ ] `Prep and implement Environment-1 / Phase 6 until complete`
- [ ] `Prep and implement Environment-1 / Phase 7 until complete`
- [ ] `Prep and implement Environment-1 / Phase 8 until complete`
- [ ] `Close Environment-1 in the umbrella index`
- [ ] `Add final Environment-1 changelog entry`

## Environment-2 Checklist

- [ ] `Create Environment-2 future doc`
- [ ] `Map all assigned Environment-2 wishlist items from Environment-Index`
- [ ] `Define Environment-2 HLG and CLG`
- [ ] `Break Environment-2 into internal phases`
- [ ] `Prep and implement Environment-2 internal phases until complete`
- [ ] `Close Environment-2 in the umbrella index`
- [ ] `Add final Environment-2 changelog entry`

## Shared Rules

Every dispatched Codex should follow these rules:

- repo: `C:\Users\Rubbe\Desktop\ParaHookConfig\20\parahook`
- follow `AGENTS.md`
- follow `docs/Doc-Vision.md`
- follow `docs/Human-Plans/Architecture/View-Toolbar/Environment/Environment-Index.md`
- follow the owning standalone future doc for the active environment family phase
- do not revert edits made by others
- keep scope to the owned family phase or owned internal phase only
- keep the current startup scene preserved unless a later planning pass explicitly reopens that decision
- keep `Environment` as the owner of active environment state
- keep `Catalog` as the owner of browseable HDRI assets rather than active scene state
- keep `Browser` downstream from environment-owned light truth
- use `apply_patch` for manual edits
- do not run tests or build unless truly necessary to unblock the current phase; the user will test behavior after both `Environment-1` and `Environment-2` are done
- update `docs/Doc-Log.md` for docs changes
- add one final `docs/CHANGELOG.md` entry when `Environment-1` is complete
- add one final `docs/CHANGELOG.md` entry when `Environment-2` is complete

## Dispatch Templates

### Template A - Finish Environment-1

```text
Continue in repo `C:\Users\Rubbe\Desktop\ParaHookConfig\20\parahook` and now own the remaining `Environment-1` ladder.

Follow `AGENTS.md`, `docs/Doc-Vision.md`, `docs/Human-Plans/Architecture/View-Toolbar/Environment/Environment-Index.md`, and `docs/Human-Plans/Architecture/View-Toolbar/Environment/Future/Environment_Phase Environment-1 - Default Lighting, Presets, And HDRI Runtime.md`.

Your task is to finish the remaining `Environment-1` phases through the normal loop:
- prep the next incomplete phase
- implement it
- repeat until `Environment-1` is fully complete

Constraints:
- preserve the current startup scene as the locked default baseline
- keep scope to the owned `Environment-1` phase only
- do not widen into `Environment-2`
- update the owning future doc as progress lands
- update `Environment-Index.md`
- update `docs/Doc-Log.md`
- add one final `docs/CHANGELOG.md` entry when the whole `Environment-1` family phase is complete
- do not run tests unless truly necessary; the user will test after both `Environment-1` and `Environment-2` are complete

Stop only when the full remaining `Environment-1` ladder is complete.
```

### Template B - Create The Environment-2 Future Doc

```text
Continue in repo `C:\Users\Rubbe\Desktop\ParaHookConfig\20\parahook` and now own `Environment-2` future-doc creation.

Follow `AGENTS.md`, `docs/Doc-Vision.md`, and `docs/Human-Plans/Architecture/View-Toolbar/Environment/Environment-Index.md`.

Your task is to create the standalone `Future/` doc for `Environment-2`.

Use the assigned wishlist items from the Environment index.
Compress them into:
- family-phase purpose
- owns / does not own
- family-phase HLG
- Codex-level goals if needed
- internal phases small enough for Codex
- checklist and done shape

Constraints:
- keep the startup scene baseline preserved
- keep the grading lane explicitly separate from scene-state ownership
- do not implement runtime behavior yet

Finish when the `Environment-2` future doc is implementation-ready and the umbrella index is updated to point at it.
```

### Template C - Run The Environment-2 Internal Phase Loop

```text
Continue in repo `C:\Users\Rubbe\Desktop\ParaHookConfig\20\parahook` and now own `Environment-2`.

Follow `AGENTS.md`, `docs/Doc-Vision.md`, `docs/Human-Plans/Architecture/View-Toolbar/Environment/Environment-Index.md`, and the standalone `Future/` doc for `Environment-2`.

Your task is to complete `Environment-2` through its internal phase loop:
- prep the next internal phase
- implement it
- repeat until the full `Environment-2` family phase is complete

Constraints:
- keep scene-state ownership separate from final-image grade ownership
- keep the startup scene baseline preserved
- keep scope to the owned internal phase only
- do not widen beyond `Environment-2`
- update the owning future doc as progress lands
- update `Environment-Index.md`
- update `docs/Doc-Log.md`
- add one final `docs/CHANGELOG.md` entry when the whole `Environment-2` family phase is complete
- do not run tests unless truly necessary; the user will test after both `Environment-1` and `Environment-2` are complete

Stop only when the full `Environment-2` family phase is complete.
```

## Success Read

This dispatch plan is successful when:

- the remaining `Environment-1` ladder is fully complete
- `Environment-2` has its own standalone `Future/` doc
- `Environment-2` has been executed through smaller internal phases
- the current startup scene remains preserved as the default baseline
- `Environment-Index.md` ends the run as a clean environment-family organizer rather than a mixed execution doc
- the user can then test the combined `Environment-1` and `Environment-2` behavior in one pass
