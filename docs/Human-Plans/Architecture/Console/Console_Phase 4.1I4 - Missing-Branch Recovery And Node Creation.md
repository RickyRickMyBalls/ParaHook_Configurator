## [x] `4.1I4` Missing-Branch Recovery And Node Creation

#### Questions / Decisions

##### [x] `q1` Decide what should happen when the user enters `Graph > Sketch` and the selected graph has no sketch nodes.

##### Suggestion
- locked direction:
- if the selected graph has zero sketch nodes, the staged flow should create one real `Geometry/Sketch` node instead of leaving the user in a dead-end empty scope
- this should happen inside the same staged `Graph > Sketch` branch
- do not require a separate rescue command for the first implementation

##### [x] `q2` Decide whether the new sketch should be a real graph node or a staged-session placeholder.

##### Suggestion
- locked direction:
- the new sketch must be a real `Geometry/Sketch` node committed into the graph
- use the normal graph mutation seam
- do not invent a temporary staged-only sketch object

##### [x] `q3` Decide which graph should receive the new sketch.

##### Suggestion
- locked direction:
- the new sketch should be created in the graph currently selected by the staged session
- that means:
  - `G > 1 > S` creates the sketch in `graph_[1]`
- do not redirect creation to some global fallback graph once the user has already selected a graph scope

##### [x] `q4` Decide how the new sketch should be placed in the canvas.

##### Suggestion
- locked direction:
- `4.1I4` should use one deterministic default placement rule
- shipped first-pass rule:
  - if the graph has no positioned nodes yet:
    - place the sketch at roughly `{ x: 160, y: 140 }`
  - otherwise:
    - place it to the right of the current rightmost node at the current top row
- the important thing is that the node appears in the real graph canvas and can be selected/focused reliably
- do not block `4.1I4` on a full node-placement strategy

##### [x] `q5` Decide what should happen immediately after the new sketch node is created.

##### Suggestion
- locked direction:
- after creation, the staged flow should rebuild its context, auto-select the new sketch, and continue into the normal sketch scope
- the node should also be selected and fitted in the active editor viewport
- the user should then see the same sketch-level prompt as an existing sketch:
  - `Sketch Plane`
  - `Sketch Draw`
- do not leave the user at an empty `Sketch` list after creation

##### [x] `q6` Decide whether `4.1I4` should auto-start `Sketch Plane` immediately after sketch creation.

##### Suggestion
- locked direction:
- no automatic `Sketch Plane` execution in `4.1I4`
- stop at the normal sketch scope after the new node is created
- let the user explicitly choose `SP` or `SD`
- this keeps node creation separate from sketch-tool execution

### Implementation Spec

#### Summary

`4.1I4` should make the staged `Graph > Sketch` branch recover gracefully when no sketch nodes exist yet.

The first implementation target is narrow:
- selected graph exists
- user enters `Sketch`
- graph has zero sketch nodes
- console creates one real `Geometry/Sketch` node
- staged session continues into that new sketch

This is the first staged phase that owns real node creation.

#### Locked Outcome

`4.1I4` should deliver:
- missing-sketch detection inside the staged `Graph > Sketch` branch
- real `Geometry/Sketch` node creation through the normal graph mutation seam
- deterministic default node placement
- staged-context rebuild after creation
- automatic entry into the new sketch scope
- node selection and viewport fit after creation

Important rule:
- do not implement this as a console-only fake branch

#### Creation Rule

When the user submits `S` from:
- `Select > Graph > graph_[n]`

and the selected graph has zero sketch nodes, the system should:
- create one real `Geometry/Sketch` node in that graph
- place it in the graph canvas
- update the active graph document state
- select and fit the new node in the active editor viewport
- rebuild the staged context from the updated graph
- continue the staged session into:
  - `Select > Graph > graph_[n] > Sketch > sketch_[1]`

If the graph already has one or more sketches, `4.1I4` should not change the existing behavior.

#### Node Creation Seam

`4.1I4` should reuse existing graph/node infrastructure:
- normal graph command or graph patch seam
- normal `Geometry/Sketch` default params
- normal node id generation rules

Candidate ownership:
- graph mutation in the store layer
- staged-session recovery in the console layer

Important rule:
- the console should orchestrate the flow
- it should not own the raw sketch-node object shape inline if a reusable creation seam can be factored cleanly

#### Placement Rule

For the first implementation:
- use one deterministic default canvas position
- keep the rule simple and stable

Examples of acceptable first-pass rules:
- graph origin area when no positioned nodes exist
- otherwise a fixed offset to the right of the current graph contents

Important rule:
- the node must appear on the canvas in a predictable place

#### Transcript Rule

The transcript should make the recovery visible.

Minimum visible steps:
- submitted token:
  - `> s`
- current breadcrumb:
  - `Select > Graph > graph_[1] > Sketch`
- creation feedback:
  - `Created sketch_[1]`
- post-create breadcrumb:
  - `Select > Graph > graph_[1] > Sketch > sketch_[1]`
- next prompt:
  - `Choose next [Sketch Plane, Sketch Draw, Back]`

Important rule:
- do not make auto-creation silent

#### Scope Boundary

Keep `4.1I4` focused on missing-sketch recovery only.

Owned here:
- sketch creation when the branch is empty
- staged continuation into the created sketch

Not owned here:
- top-level high-level `Sketch` command
- automatic `Sketch Plane` execution after creation
- profile creation
- non-sketch branch expansion

#### First Implementation Steps

`4.1I4` should likely be implemented in this order:

1. detect the zero-sketch case at the staged `Graph > Sketch` transition
2. create one real `Geometry/Sketch` node in the selected graph
3. rebuild the staged context from updated store state
4. continue the staged flow into the created sketch
5. show transcript feedback for creation and resumed scope

#### Acceptance Shape

`4.1I4` should read as complete when:

- if a selected graph has no sketches, submitting `S` creates one real sketch node
- the created sketch appears in the graph canvas with deterministic placement
- the created sketch is selected and fitted in the active editor viewport
- the staged session continues into that created sketch instead of failing or stopping at an empty list
- the next staged prompt becomes:
  - `Choose next [Sketch Plane, Sketch Draw, Back]`
- the transcript clearly shows that creation happened
- existing behavior for graphs that already contain sketches remains unchanged

##### [ ] `4.1I5` Robustness And Prompt Quality

Purpose:
- improve clarity, recovery, and consistency once the core system works

In scope:
- better scoped error copy
- better next-choice prompts
- clearer breadcrumb labels
- handling disappearing graphs or sketches during an active session

Acceptance shape:
- staged navigation remains understandable and recoverable under normal editing churn

#### Locked Deferrals

Keep these out of `4.1I`:

- literal `>` path string parsing
- fuzzy matching
- autocomplete UI
- freeform natural-language console interpretation
- custom user-authored aliases
- macro recording
- full app-wide grammar coverage on day one

#### Acceptance Shape

`4.1I` should read as complete when:

- the console can maintain a staged navigation session across multiple `Enter` submissions
- a staged sequence like `G`, `1`, `S`, `1`, `SD` resolves to `Graph > graph_[1] > Sketch > sketch_[1] > Sketch Draw`
- alias tokens are resolved relative to scope, not globally
- flat commands like `move`, `m`, `line`, and `status` still work unchanged outside staged navigation
- the transcript shows the submitted token, the resolved breadcrumb, and the next prompt or action result
- invalid staged tokens produce scoped, specific errors instead of generic unknown-command output


