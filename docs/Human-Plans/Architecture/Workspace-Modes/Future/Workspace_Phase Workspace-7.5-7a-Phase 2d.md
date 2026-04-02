# Workspace 7.5-7A Continuation: Console Focus Replay And Noise Cleanup

## Summary
Implement `Phase 2D` as the next live repair in `Workspace 7.5-7A`, then keep two follow-on cleanup phases in the same doc for the rest of the noisy user loop.

The current live truth is:
- valid spaghetti focus already lands
- repeated split clicks now publish again
- a later clear path still replays `Root`
- simple floating-editor clicks also over-publish duplicate graph-selection lines

So the next work should be:
1. stop the late global clear replay
2. dedupe spaghetti activation publishing
3. only then touch submit-path cleanup if `Graph` still fails afterward

## Phase 2D: Prevent Late Global Clear Replay
Immediate implementation target.

### Key changes
- Patch the global `window` `pointerdown` clear logic in [AppShell.tsx](./src/app/AppShell.tsx) so split and floating spaghetti interactions are treated as in-bounds workspace clicks, not outside clicks.
- Expand the allowlist used by that global handler to include the actual workspace frame and slot surface classes used by split-host spaghetti, not just viewer and floating-window selectors.
- Keep `Phase 2C` frame-level spaghetti activation intact; `2D` must only stop the later clear from undoing that valid focus.
- Do not change `ConsoleDock` precedence again in this slice unless the global clear trace proves the replay is not coming from `AppShell`.

### Expected behavior after 2D
- `load in -> Enter Graph -> click floating spaghetti` does not append a later `Returned to root`
- `load in -> Enter Graph -> drag spaghetti to right split -> click split spaghetti` does not append a later `Returned to root`
- valid spaghetti graph focus remains active after the click instead of bouncing back to `Root`

## Follow-on phases inside 7A
Keep these in the same doc so the full live loop stays together.

### Phase 2E: Dedupe Spaghetti Activation Noise
Use after `2D` if the console still prints repeated copies of:
- `Selected target: graph_[1]`
- `Select > Graph > graph_[1]`
- `Graph > Choose next [...]`

Implementation direction:
- audit all spaghetti activation publishers for one user click:
  - frame-level activation in `AppShell` / `ViewportFrame`
  - panel-local `onActivateEditorContext` in `SpaghettiPanel`
  - floating-window activation path
- define one canonical base activation per click
- keep graph/node refinement, but prevent multiple identical graph-focus publishes from the same interaction cycle

### Phase 2F: Submit Path Cleanup Only If Still Needed
Use only if `Graph` still cannot commit after `2D` and `2E`.

Implementation direction:
- inspect staged navigation/session submit handling in `ConsoleDock`
- patch only the final `Graph` enter/commit seam
- do not reopen publisher or replay work already settled in `2D`/`2E`

## Test plan
### Immediate 2D coverage
- Extend the real-console repro in [AppShell.consoleLiveFocus.test.tsx](./src/app/AppShell.consoleLiveFocus.test.tsx) so it proves:
  - valid spaghetti graph focus lands
  - no later `Returned to root` appears for the same click
- Add focused AppShell coverage that exercises:
  - floating spaghetti click
  - split spaghetti click after drag/dock
  - global pointerdown clear path with in-bounds spaghetti targets
- Re-run:
  - `npm.cmd test -- --run src/app/AppShell.test.tsx src/app/AppShell.consoleLiveFocus.test.tsx src/app/console/ConsoleDock.test.tsx`
  - `npm.cmd run build`

### Manual acceptance sequence
Use this exact loop:
1. load in
2. press `Enter` on `Graph`
3. click the floating spaghetti editor
4. drag it to the right-side split ghost
5. click the split spaghetti editor

Acceptance criteria:
- no extra `Returned to root` after valid spaghetti focus
- no bounce back to `Root`
- console remains in graph scope after steps 3 and 5

## Assumptions and defaults
- Keep this work in `Workspace 7.5-7A`; do not spin it into a new doc yet.
- Treat the current root replay as an `AppShell` global clear problem first, not another `ConsoleDock` precedence problem.
- Do not add new console commands or broader console architecture cleanup in this loop.
- Do not use the submit-only reserve phase unless replay and duplicate-publish cleanup are both complete and `Graph` still fails.
