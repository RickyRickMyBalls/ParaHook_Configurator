## [x] `4.1I3` First Executable Vertical Slice

#### Questions / Decisions

##### [x] `q1` Decide what the first real executable staged path should be.

##### Suggestion
- locked direction:
- the first real executable staged path should be:
  - `Graph > graph_[n] > Sketch > sketch_[n] > Sketch Draw`
- do not split the first executable slice across multiple unrelated branches

##### [x] `q2` Decide whether `4.1I3` should invent a new sketch-draw execution path.

##### Suggestion
- locked direction:
- no
- `4.1I3` should call the same underlying `Sketch Draw` action that the current UI already uses
- staged navigation should only become a new entry seam, not a second implementation

##### [x] `q3` Decide how far the grammar should expand in this phase.

##### Suggestion
- locked direction:
- expand only as far as needed to execute the first real slice
- required path:
  - `Graph`
  - graph selection
  - `Sketch`
  - sketch selection
  - `Sketch Draw`
- leave sibling branches like `SketchPlane`, `Profiles`, `Inspect`, `Open`, and `Build` for later phases unless already needed for the path contract

##### [x] `q4` Decide how sketch selection should resolve.

##### Suggestion
- locked direction:
- sketch selection should resolve from deterministic visible order within the selected graph scope
- numeric sketch tokens such as `1`, `2`, `3` should behave the same way graph-number selections already behave
- do not require the user to know internal node ids

##### [x] `q5` Decide what should happen to the staged session after `Sketch Draw` executes.

##### Suggestion
- locked direction:
- the staged session should end after the action executes successfully
- the console should return to ordinary flat-command mode
- the transcript should show both:
  - the resolved path
  - the executed action/result note

##### [x] `q6` Decide what the console should show at the final execution step.

##### Suggestion
- locked direction:
- after the final staged token is accepted, the console should show:
  - the submitted token
  - the resolved breadcrumb
  - an action-result line such as:
  - `Sketch Draw > [Line, PLine, X]`
- do not immediately hide execution behind silent state changes

##### [x] `q7` Decide how single-choice auto-advance should behave inside the first executable slice.

##### Suggestion
- locked direction:
- keep the single-choice auto-advance rule active for real entity-selection scopes in `4.1I3`
- that means:
  - if there is only one graph, `g` may auto-advance to `graph_[1]`
  - if there is only one sketch in that graph, `s` may auto-advance to `sketch_[1]`
- the transcript must still show the auto-selection explicitly
- do not auto-execute `Sketch Draw` itself; the user must still submit `sd`

### Implementation Spec

#### Summary

`4.1I3` should take the staged grammar and live console session from `4.1I1` and `4.1I2` and drive one real app action end to end.

That first vertical slice should be:

- `graph` / `g`
- graph number
- `sketch` / `s`
- sketch number
- `sketch draw` / `sd`

This is the first point where staged navigation should stop being only a guided transcript system and start performing a real user action.

Important practical consequence:
- if the workspace has only one graph and that graph has only one sketch, the user may be able to reach the target scope as:
  - `g` + `Enter`
  - `s` + `Enter`
  - `sd` + `Enter`

That is acceptable and desirable, as long as the console shows the auto-advance steps honestly.

#### Locked Outcome

`4.1I3` should deliver:
- real staged navigation into a selected graph
- real staged navigation into a selected sketch
- a staged `Sketch Draw` action node
- execution of the existing sketch-draw session start behavior
- transcript confirmation that the action actually started

Important rule:
- the action must reuse existing app/store behavior
- do not create a second sketch session model just for the console path

#### First Executable Path

The first full staged path should read like:

- `Select > Graph > graph_[1] > Sketch > sketch_[1] > Sketch Draw`

Token-by-token interaction:

1. `g` + `Enter`
2. `1` + `Enter`
3. `s` + `Enter`
4. `1` + `Enter`
5. `sd` + `Enter`

The final token should execute the real sketch-draw action for the selected sketch.

#### Grammar Expansion Required For `4.1I3`

To support the first executable slice, the staged grammar should gain:

- a real `Graph > graph_[n] > Sketch` scope
- deterministic sketch choices under that scope
- a `Sketch Draw` action node

Suggested staged aliases:

- `Sketch`
  - `S`
- `Sketch Draw`
  - `SD`

Important rule:
- alias meaning remains scope-sensitive
- `s` in flat-command mode may still mean `scale`
- `s` inside the active staged graph scope may mean `Sketch`

#### Sketch Resolution Rule

Sketch choices should be generated from the currently selected graph.

Those choices should:
- use deterministic visible ordering
- carry the backing node id with the session state after selection
- expose user-facing labels such as:
  - `sketch_[1]`
  - `sketch_[2]`

Important rule:
- visible labels and backing node ids should both be tracked
- the grammar should not collapse those into one value

#### Execution Rule

When the user reaches `Sketch Draw`:

- the staged grammar/result should identify an executable action node
- the console layer should dispatch the existing sketch-draw entry action

That dispatch should reuse the existing app behavior for opening/starting sketch draw on the targeted sketch node.

Current concrete seam:

- `startGeometrySketchSession(nodeId, 'draw')`

Important rule:
- staged execution must call into the same store/UI seam already used by the normal app workflow
- do not add a console-only sketch-session start function

#### Transcript Rule

At the final execution step, the transcript should show:

1. submitted token
- `[Commands] > sd`

2. resolved breadcrumb
- `[Commands] Select > Graph > graph_[1] > Sketch > sketch_[1] > Sketch Draw`

3. action result
- `[App] Sketch Draw > [Line, PLine, X]`

This should make the staged path feel real and inspectable rather than invisible.

#### Session Completion Rule

After successful `Sketch Draw` execution:

- the staged session should end
- staged-session state should clear
- the console should return to ordinary flat-command behavior

Reason:
- the user is now inside the live sketch-draw workflow
- staged navigation has completed its job

#### First Integration Seams

Primary seams:

- `src/app/console/stagedNavigation.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- graph and sketch lookup helpers already present in app state

Likely responsibilities:

- `stagedNavigation.ts`
  - expose the deeper graph/sketch/action nodes
- `ConsoleDock.tsx`
  - route the final staged execution result into the existing action
- `useSpaghettiStore.ts`
  - continue to own the real sketch-draw session entry via:
    - `startGeometrySketchSession(nodeId, 'draw')`

#### First Implementation Steps

`4.1I3` should likely be implemented in this order:

1. expand the staged grammar from `Graph > graph_[n]` into a real `Sketch` scope
2. resolve visible ordered sketch choices from the selected graph
3. store the selected sketch node id in staged session state
4. add a `Sketch Draw` action node under the selected sketch scope
5. route that action result from `ConsoleDock` into:
   - `startGeometrySketchSession(nodeId, 'draw')`
6. emit the final transcript/result lines
7. clear the staged session after successful execution

Important rule:
- do not mix branch expansion and execution wiring randomly
- prove the real slice in this exact order

#### Locked Deferrals

Keep these out of `4.1I3`:

- `SketchPlane`
- `Profiles`
- `Inspect`
- multi-action sketch authoring from the staged tree
- broader graph-management actions
- multiple root domains

#### Acceptance Shape

`4.1I3` should read as complete when:

- the staged grammar can navigate from `Graph` into a real sketch selection scope
- the user can select a sketch by visible number
- if there is exactly one graph and one sketch, the staged flow can honestly auto-advance through those scopes while still showing the auto-selection steps
- the user can submit `sd` at the sketch scope to start real `Sketch Draw`
- the action reuses the existing sketch-draw entry seam rather than a separate implementation
- the transcript shows token, breadcrumb, and action-result feedback
- the staged session clears after successful execution


