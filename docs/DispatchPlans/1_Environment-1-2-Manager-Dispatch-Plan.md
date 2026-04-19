# 1 Environment 1 And 2 Manager Dispatch Plan

## Summary

This doc is the canonical manager-facing dispatch plan for finishing:

- `Environment-1 - Default Lighting, Presets, And HDRI Runtime`
- `Environment-2 - Photoshop-Like Grade Controls, Persistence, And Workflow Polish`

Important rule:
- this plan is for the manager Codex
- the worker Codex should only receive one narrow task at a time
- do not hand this whole plan to one worker as a single assignment

Use this doc when:
- the current startup scene must stay preserved as the locked baseline
- the manager needs to drive the environment family through the normal prep-then-implement loop
- the user will test behavior only after both `Environment-1` and `Environment-2` are complete

## Starting Read

Current expected starting state:

- the current startup scene is locked as the preserved default baseline
- `Environment-1 / Phase 1`, `Phase 2`, `Phase 2b`, and `Phase 2d` are historical shipped work
- `Environment-1 / Phase 2c` is still open
- `Environment-1 / Phase 3` through `Phase 8` are still open
- `Environment-2` does not yet have its own standalone `Future/` doc
- the user will test behavior after both family phases are done

## Environment-1 HLG

- [ ] `Environment-1-HLG-1. Preserve The Current Startup Scene As The Locked Baseline`
- [ ] `Environment-1-HLG-2. Make Environment Presets Honest`
- [ ] `Environment-1-HLG-3. Finish The Visible Environment Surface`
- [ ] `Environment-1-HLG-4. Add Optional Browser-Facing Light Help If Still Needed`
- [ ] `Environment-1-HLG-5. Make HDRI Or Environment Lighting Real In The Viewport`
- [ ] `Environment-1-HLG-6. Make Chosen Environment Lighting Tunable`

Important rule:
- only check off an `Environment-1-HLG` when the remaining ladder has really achieved it
- do not check off an HLG just because one phase moved part of the work forward

## Environment-2 HLG

- [ ] `Environment-2-HLG-1. Add Photoshop-Like Grade Controls`
- [ ] `Environment-2-HLG-2. Keep Scene Controls Separate From Final Image Grading`
- [ ] `Environment-2-HLG-3. Add Persistence For Environment Look Workflows`
- [ ] `Environment-2-HLG-4. Add Recall And Compare Helpers`
- [ ] `Environment-2-HLG-5. Finish A Production-Ready Environment Workflow`

Important rule:
- only check off an `Environment-2-HLG` when the family ladder has really achieved it
- do not check off an HLG just because one phase moved part of the work forward

## CLG

- [ ] `CLG-1. Use This Plan As A Manager Checklist Instead Of A Worker Prompt`
- [ ] `CLG-2. Dispatch One Narrow Worker Task At A Time`
- [ ] `CLG-3. Finish Environment-1 Before Starting Environment-2 Implementation`
- [ ] `CLG-4. Create The Environment-2 Future Doc Before Any Environment-2 Implementation`
- [ ] `CLG-5. Use A Prep-Then-Implement Loop For Every Internal Phase`
- [ ] `CLG-6. Keep The Startup Scene Baseline Preserved Unless A Later Doc Explicitly Reopens It`
- [ ] `CLG-7. Add One Final Changelog Entry When Environment-1 Is Complete`
- [ ] `CLG-8. Add One Final Changelog Entry When Environment-2 Is Complete`
- [ ] `CLG-9. Leave Behavior Testing To The User After Both Family Phases Are Complete`

## Core Loop

This is the exact manager loop:

1. read this dispatch plan
2. choose the next single worker task
3. dispatch only that one task to the worker
4. wait for the worker to finish
5. review the result against this dispatch plan and the owning environment doc
6. decide the next single worker task
7. repeat until the current family phase is done

Important rule:
- the worker should never be told to finish both `Environment-1` and `Environment-2` in one assignment

## Allowed Worker Task Types

The worker should only be given tasks shaped like these:

- `prep the next phase`
- `implement the prepped phase`
- `create the future doc`
- `close out the family docs and changelog when the family is actually complete`

Important rule:
- if a task spans more than one family or more than one major phase, it is probably too broad for the worker

## Manager Checklist

- [ ] `Manager dispatches the next Environment-1 worker task`
- [ ] `Worker finishes that Environment-1 task`
- [ ] `Manager reviews the result against Environment-1 docs`
- [ ] `Manager dispatches the next Environment-1 worker task`
- [ ] `Environment-1 is fully complete`
- [ ] `Manager dispatches Environment-2 future-doc creation`
- [ ] `Worker finishes Environment-2 future-doc creation`
- [ ] `Manager reviews the Environment-2 future doc`
- [ ] `Manager dispatches the next Environment-2 worker task`
- [ ] `Worker finishes that Environment-2 task`
- [ ] `Manager reviews the result against Environment-2 docs`
- [ ] `Environment-2 is fully complete`
- [ ] `Environment-Index.md is fully aligned`

## Environment-1 Manager Loop

Use the existing `Environment-1` future doc as the execution surface:

- `docs/Human-Plans/Architecture/View-Toolbar/Environment/Future/Environment_Phase Environment-1 - Default Lighting, Presets, And HDRI Runtime.md`

The manager should drive `Environment-1` like this:

1. dispatch worker: `prep the next incomplete Environment-1 phase`
2. wait for completion
3. dispatch worker: `implement that Environment-1 phase`
4. wait for completion
5. repeat until the next phase is fully complete
6. continue through the remaining open ladder in order:
   - `Phase 2c`
   - `Phase 3`
   - `Phase 4`
   - `Phase 5` if still needed
   - `Phase 6`
   - `Phase 7`
   - `Phase 8`
7. when all remaining `Environment-1` phases are complete, dispatch one final closeout task:
   - update the owning future doc
   - update `Environment-Index.md`
   - update `docs/Doc-Log.md`
   - add one final `docs/CHANGELOG.md` entry for `Environment-1`

Important rules:
- `Environment-1` stays the active family until it is fully complete
- do not start `Environment-2` implementation work early
- keep the startup scene baseline preserved unless a later planning pass explicitly reopens it

## Environment-2 Manager Loop

`Environment-2` is a two-step manager sequence:

### Step 1 - Create The Future Doc

Dispatch worker:
- `create the standalone Environment-2 future doc`

That worker task should:
- start from the `Environment-2` HLG and wishlist items in `Environment-Index.md`
- compress them into:
  - family-phase purpose
  - owns / does not own
  - family-phase HLG
  - Codex-level goals if needed
  - internal phases small enough for Codex
  - checklist and done shape
- keep grading separate from scene-state ownership
- preserve the startup baseline
- stop once the standalone future doc is implementation-ready

### Step 2 - Run The Internal Loop

Once the `Environment-2` future doc exists, the manager should drive it like this:

1. dispatch worker: `prep the next incomplete Environment-2 phase`
2. wait for completion
3. dispatch worker: `implement that Environment-2 phase`
4. wait for completion
5. repeat until `Environment-2` is fully complete
6. dispatch one final closeout task:
   - update the owning future doc
   - update `Environment-Index.md`
   - update `docs/Doc-Log.md`
   - add one final `docs/CHANGELOG.md` entry for `Environment-2`

Important rules:
- do not start `Environment-2` implementation until the future doc exists
- do not widen into a new environment family unless the `Environment-2` wishlist truly no longer fits honestly inside one family doc

## Exact Worker Prompts

These are the correct prompt shapes for the worker.

### Worker Prompt A - Prep One Environment-1 Phase

```text
Continue in repo `C:\Users\Rubbe\Desktop\ParaHookConfig\20\parahook` and own one narrow task only: prep `Environment-1 / Phase N`.

Follow `AGENTS.md`, `docs/Doc-Vision.md`, `docs/Human-Plans/Architecture/View-Toolbar/Environment/Environment-Index.md`, and `docs/Human-Plans/Architecture/View-Toolbar/Environment/Future/Environment_Phase Environment-1 - Default Lighting, Presets, And HDRI Runtime.md`.

Your task is to prep `Environment-1 / Phase N` for implementation only.

Constraints:
- preserve the current startup scene as the locked default baseline
- keep scope only to `Environment-1 / Phase N`
- do not implement runtime behavior yet
- update docs that belong to the prep pass

Stop when `Environment-1 / Phase N` is implementation-ready.
```

### Worker Prompt B - Implement One Environment-1 Phase

```text
Continue in repo `C:\Users\Rubbe\Desktop\ParaHookConfig\20\parahook` and own one narrow task only: implement `Environment-1 / Phase N`.

Follow `AGENTS.md`, `docs/Doc-Vision.md`, `docs/Human-Plans/Architecture/View-Toolbar/Environment/Environment-Index.md`, and `docs/Human-Plans/Architecture/View-Toolbar/Environment/Future/Environment_Phase Environment-1 - Default Lighting, Presets, And HDRI Runtime.md`.

Your task is to implement `Environment-1 / Phase N` only.

Constraints:
- preserve the current startup scene as the locked default baseline
- keep scope only to `Environment-1 / Phase N`
- do not widen into later `Environment-1` phases or `Environment-2`
- update the owning future doc and any required tracking docs
- do not run tests unless truly necessary

Stop when `Environment-1 / Phase N` is fully implemented.
```

### Worker Prompt C - Create The Environment-2 Future Doc

```text
Continue in repo `C:\Users\Rubbe\Desktop\ParaHookConfig\20\parahook` and own one narrow task only: create the standalone `Environment-2` future doc.

Follow `AGENTS.md`, `docs/Doc-Vision.md`, and `docs/Human-Plans/Architecture/View-Toolbar/Environment/Environment-Index.md`.

Your task is to create the standalone `Environment-2` future doc only.

Constraints:
- keep the startup scene baseline preserved
- keep grading separate from scene-state ownership
- do not implement runtime behavior yet
- update the umbrella index to point at the new future doc
- update `docs/Doc-Log.md`

Stop when the `Environment-2` future doc is implementation-ready.
```

### Worker Prompt D - Prep One Environment-2 Phase

```text
Continue in repo `C:\Users\Rubbe\Desktop\ParaHookConfig\20\parahook` and own one narrow task only: prep `Environment-2 / Phase N`.

Follow `AGENTS.md`, `docs/Doc-Vision.md`, `docs/Human-Plans/Architecture/View-Toolbar/Environment/Environment-Index.md`, and the standalone `Environment-2` future doc.

Your task is to prep `Environment-2 / Phase N` for implementation only.

Constraints:
- keep the startup scene baseline preserved
- keep scene-state ownership separate from final-image grade ownership
- keep scope only to `Environment-2 / Phase N`
- do not implement runtime behavior yet

Stop when `Environment-2 / Phase N` is implementation-ready.
```

### Worker Prompt E - Implement One Environment-2 Phase

```text
Continue in repo `C:\Users\Rubbe\Desktop\ParaHookConfig\20\parahook` and own one narrow task only: implement `Environment-2 / Phase N`.

Follow `AGENTS.md`, `docs/Doc-Vision.md`, `docs/Human-Plans/Architecture/View-Toolbar/Environment/Environment-Index.md`, and the standalone `Environment-2` future doc.

Your task is to implement `Environment-2 / Phase N` only.

Constraints:
- keep the startup scene baseline preserved
- keep scene-state ownership separate from final-image grade ownership
- keep scope only to `Environment-2 / Phase N`
- do not widen into other environment families
- update the owning future doc and required tracking docs
- do not run tests unless truly necessary

Stop when `Environment-2 / Phase N` is fully implemented.
```

## Shared Rules

Every worker task should follow these rules:

- repo: `C:\Users\Rubbe\Desktop\ParaHookConfig\20\parahook`
- follow `AGENTS.md`
- follow `docs/Doc-Vision.md`
- follow `docs/Human-Plans/Architecture/View-Toolbar/Environment/Environment-Index.md`
- follow the owning standalone future doc for the active family phase
- do not revert edits made by others
- keep scope only to the single dispatched task
- keep the current startup scene preserved unless a later planning pass explicitly reopens that decision
- keep `Environment` as the owner of active environment state
- keep `Catalog` as the owner of browseable HDRI assets rather than active scene state
- keep `Browser` downstream from environment-owned light truth
- use `apply_patch` for manual edits
- do not run tests or build unless truly necessary; the user will test after both `Environment-1` and `Environment-2` are complete
- update `docs/Doc-Log.md` for docs changes
- add one final `docs/CHANGELOG.md` entry only when a whole environment family phase is complete

## Success Read

This dispatch plan is successful when:

- the manager uses this doc as the coordinator checklist
- the worker is dispatched one narrow task at a time
- `Environment-1` is fully complete
- `Environment-2` has its own standalone future doc
- `Environment-2` is fully complete
- the current startup scene remains preserved as the default baseline
- the user can then test the combined `Environment-1` and `Environment-2` behavior in one pass
