## [x] `4.1I1` Staged Grammar Core

#### Questions / Decisions

##### [x] `q1` Decide what the first staged level-1 root should be.

##### Suggestion
- locked direction:
- the first level-1 staged root should be `Graph`
- the user should be able to enter it as:
  - `graph` + `Enter`
  - `g` + `Enter`
- do not try to ship multiple root domains in `4.1I1`

##### [x] `q2` Decide whether staged navigation begins implicitly or through an explicit root command.

##### Suggestion
- locked direction:
- staged navigation begins through an explicit root token
- first root token:
  - `Graph`
  - alias `G`
- outside a staged session, ordinary flat commands should keep their current behavior

##### [x] `q3` Decide what `4.1I1` should return from the grammar seam.

##### Suggestion
- locked direction:
- the pure resolver should return one of:
  - `advance`
  - `execute`
  - `invalid`
  - `cancelled`
- `advance` means:
  - token accepted
  - breadcrumb advanced
  - next scope/prompt available
- `execute` means:
  - token resolved to an action node
  - execution metadata is ready for the caller
- `invalid` means:
  - token rejected for current scope
  - current scope remains unchanged
- `cancelled` means:
  - staged session closed or reset

##### [x] `q4` Decide how numeric tokens should resolve.

##### Suggestion
- locked direction:
- numeric tokens such as `1`, `2`, `3` should resolve against deterministic visible order
- the grammar seam should not guess hidden ids
- the session result should carry the resolved underlying ids after numeric selection succeeds

##### [x] `q5` Decide what state the grammar core owns versus what later console wiring owns.

##### Suggestion
- locked direction:
- `4.1I1` owns:
  - grammar node model
  - alias resolution
  - staged session state
  - breadcrumb labels
  - valid-next-choice metadata
  - deterministic token resolution
- `4.1I1` does not own:
  - transcript rendering
  - console layout
  - final action dispatch side effects

##### [x] `q6` Decide how staged sessions reset.

##### Suggestion
- locked direction:
- the grammar core must support explicit reset/cancel
- successful execution may end the session by default for the first implementation
- invalid tokens must not silently reset the session
- later console wiring can map `Esc` and other lifecycle inputs onto this reset seam

### Implementation Spec

#### Summary

`4.1I1` should create the pure staged grammar engine that later console work can call.

This is not the UI phase.
This is the data model and resolver phase.

The first implementation target is narrow:
- one staged root:
  - `Graph`
- one root alias:
  - `G`

That means `4.1I1` should be able to represent and resolve the first steps of:
- `Graph`
- `Graph > graph_[n]`
- later descendants under that branch

without yet owning transcript formatting or visual console behavior.

#### Locked Outcome

`4.1I1` should deliver:
- a dedicated staged-grammar module
- a grammar node model
- a staged session model
- scoped alias resolution
- deterministic numeric-choice resolution
- structured results for `advance / execute / invalid / cancelled`

Important rule:
- do not hardcode this inside `ConsoleDock`

#### First Grammar Contract

The staged grammar seam should expose a pure API shape along these lines:

- begin a staged session from a valid root token
- submit one token against the current session scope
- inspect current breadcrumb
- inspect current valid next choices
- reset the session

The exact type names do not matter yet.
The contract shape does.

#### First Root Scope

The first staged root should be:

- canonical label:
  - `Graph`
- accepted tokens:
  - `GRAPH`
  - `G`

Submitting `Graph` or `G` from flat mode should create a staged navigation session whose first breadcrumb becomes:

- `Select > Graph`

and whose valid next choices are graph-number selections.

#### Graph Choice Rule

After entering the `Graph` root, the next valid tokens should be graph selections such as:

- `1`
- `2`
- `3`
- `LIST`

For `4.1I1`, the grammar engine should not render those choices.
It only needs to expose them as structured metadata.

#### Numeric Resolution Rule

Numeric choices must resolve against deterministic visible order.

That means:
- `1` means the first visible graph choice in the current staged scope
- `2` means the second visible graph choice

Important rule:
- do not encode numeric tokens as direct graph ids
- resolve them through the scope's current ordered option list

#### Session State Model

The staged session should minimally track:

- whether a staged session is active
- current breadcrumb
- current grammar scope
- resolved backing targets so far
  - for example selected graph document id
- valid next choices for the current scope

Important rule:
- breadcrumb labels and backing ids are not the same thing
- keep both

#### Result Model

Submitting a token should return structured results.

Minimum result meanings:

- `advance`
  - token accepted
  - scope changed
  - breadcrumb changed
  - valid-next-choice metadata available

- `execute`
  - token accepted
  - action node reached
  - caller receives execution metadata

- `invalid`
  - token rejected for current scope
  - caller receives current scope and valid choices

- `cancelled`
  - session reset/closed

Important rule:
- avoid returning only plain strings
- later console UX needs structured state, not ad hoc text parsing

#### First Tree Owned By `4.1I1`

`4.1I1` does not need the full app tree.

It should own enough grammar structure to prove:

- root
  - `GRAPH`
- `GRAPH`
  - graph choices by visible index
- `GRAPH > graph_[n]`
  - next-choice aliases such as:
    - `SKETCH`
    - `REFERENCES`
    - `OPEN`
    - `BUILD`

It is acceptable if some of those deeper nodes are only represented as grammar placeholders in `4.1I1`.

Reason:
- `4.1I1` is about the resolver contract
- real execution comes later

#### Code Ownership Rule

Primary seam:

- a new dedicated grammar/resolver module under the console area

Candidate responsibilities:
- grammar definitions
- alias normalization
- session transitions
- deterministic option ordering
- result objects

Not owned here:
- React component concerns
- transcript rendering
- DOM keyboard handling

#### Locked Deferrals

Keep these out of `4.1I1`:

- transcript rendering details
- breadcrumb UI
- command prompt copy polish
- actual `Sketch Draw` execution
- multi-root staged navigation
- fuzzy matching
- autocomplete

###### Acceptance Shape

`4.1I1` should read as complete when:

- there is a dedicated staged grammar seam outside the UI component
- `graph` and `g` can both begin the same staged session at the grammar level
- the grammar seam can resolve numeric graph choices deterministically from visible ordered options
- the grammar seam returns structured `advance / execute / invalid / cancelled` results
- invalid tokens do not destroy session state
- later console wiring has enough structured data to render:
  - current breadcrumb
  - valid next choices
  - scoped errors


