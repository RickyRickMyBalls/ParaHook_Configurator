## [ ] 4.1i
### Hierarchical Path Grammar

#### Summary

`4.1I` should extend the console beyond flat command submission and let the user move through scoped app actions one token at a time.

Important clarification:

- the user should not type literal `>` characters
- the earlier `G>1>S>1>SD` notation is only shorthand for staged `Enter` submissions

So the real interaction should be:

1. type `G`, press `Enter`
2. type `1`, press `Enter`
3. type `S`, press `Enter`
4. type `1`, press `Enter`
5. type `SD`, press `Enter`

and the console should progressively resolve that sequence as:

- `Graph`
- `Graph > graph_[1]`
- `Graph > graph_[1] > Sketch`
- `Graph > graph_[1] > Sketch > sketch_[1]`
- `Graph > graph_[1] > Sketch > sketch_[1] > Sketch Draw`

This should be treated as one deeper form of the same console command language, not as a second command system.

#### Why This Phase Exists

The console doc already points toward a future command-navigation grammar.

What is still missing is a dedicated phase that locks:
- the staged token-submission model
- alias resolution rules
- scope-sensitive navigation
- breadcrumb behavior
- next-choice prompting
- transcript behavior
- how staged navigation relates to flat commands like `move`, `line`, or `status`

This phase should provide that bridge.

#### Core Rule

The console should support two submission shapes inside one dispatcher:

1. flat command submission
- examples:
  - `move`
  - `m`
  - `line`
  - `status`

2. staged scoped navigation
- examples:
  - `G` then `Enter`
  - `1` then `Enter`
  - `S` then `Enter`
  - `1` then `Enter`
  - `SD` then `Enter`

Important rule:
- staged navigation and flat commands must still resolve through the same overall command-routing seam
- do not build a separate navigation-console product beside the existing command dispatcher

#### Staged Navigation Model

The console should maintain an active navigation session.

Each submitted token is resolved relative to the current scope, and each accepted token moves the session deeper.

Example:

- `G`
  - means `Graph` only at the root level
- `S`
  - may mean `Sketch` when the current scope is `Graph > [n]`
  - should not be treated as a global always-on alias independent of scope
- `SD`
  - may mean `Sketch Draw` when the current scope is `Graph > [n] > Sketch > [n]`

Important rule:
- alias meaning must be scope-aware
- tokens should not be resolved globally when that would create ambiguity
- the same short token may mean different things in different scopes

#### First Example Tree

The first honest grammar can begin with a narrow tree like:

- root
  - `G` / `GRAPH`
- `GRAPH`
  - `1`
  - `2`
  - `3`
  - `LIST`
- `GRAPH > [n]`
  - `S` / `SKETCH`
  - `R` / `REFERENCES`
  - `O` / `OPEN`
  - `B` / `BUILD`
- `GRAPH > [n] > SKETCH`
  - `1`
  - `2`
  - `3`
  - `LIST`
- `GRAPH > [n] > SKETCH > [n]`
  - `SD` / `SKETCHDRAW`
  - `SP` / `SKETCHPLANE`
  - `PR` / `PROFILES`
  - `IN` / `INSPECT`

This example tree is intentionally small.

The phase should lock the mechanism first, not an exhaustive app-wide command tree.

#### Submission Rule

Each `Enter` should submit the current buffer as one token against the active scope.

Suggested first resolution order:

1. read the current console buffer
2. trim whitespace
3. normalize the token to a comparison form such as uppercase
4. resolve the token against aliases valid only in the current scope
5. if the token points to another scope, advance the breadcrumb and show the next valid choices
6. if the token points to an action node, dispatch that action
7. if the token is invalid for the current scope, keep the session in place and show a scoped error

Important rule:
- staged navigation should be deterministic
- do not use fuzzy matching in this phase

#### Breadcrumb Rule

The console should visibly track the active staged path.

Example progression:

- `Select`
- `Select > Graph`
- `Select > Graph > graph_[1]`
- `Select > Graph > graph_[1] > Sketch`
- `Select > Graph > graph_[1] > Sketch > sketch_[1]`

Important rule:
- the breadcrumb is session state, not just transcript text
- the console should know what scope it is currently inside before the next token is entered

#### Prompt Rule

After each accepted non-terminal token, the console should show the next valid choices for the new scope.

Example:

- user submits `G`
- console shows:
  - `Select > Graph`
  - `Choose graph [1, 2, 3, List]`

- user submits `1`
- console shows:
  - `Select > Graph > graph_[1]`
  - `Choose next action [Sketch, References, Open, Build]`

Important rule:
- the console should guide the next step after each token
- do not force the user to remember the full tree blindly

#### Transcript Rule

The transcript should preserve both:

- the actual token the user entered
- the current resolved breadcrumb
- the next prompt or executed action result

Example:

- `[Commands] > G`
- `[Commands] Select > Graph`
- `[Commands] Choose graph [1, 2, 3, List]`
- `[Commands] > 1`
- `[Commands] Select > Graph > graph_[1]`
- `[Commands] Choose next action [Sketch, References, Open, Build]`

Reason:
- the user should see what token they typed
- the user should also see how the system interpreted that token in the active scope

#### Error Rule

Invalid staged tokens should fail with scoped feedback.

Example:

- current scope is `Select > Graph > graph_[1] > Sketch > sketch_[1]`
- user submits `B`

Good error shape:
- echo the submitted token
- identify the bad token
- show the current scope
- list the valid next choices for that scope

Important rule:
- avoid vague `Unknown command` errors when the console already knows the active path scope

#### Relationship To Flat Aliases

This phase must not break the existing flat typed-first aliases introduced earlier.

Examples:
- `s`
  - may still resolve as the flat `scale` alias in normal flat-command mode
- `G`
  - may resolve as `Graph` when the console is in a staged navigation session
- `SD`
  - may resolve as `Sketch Draw` only when the current scope allows it

Locked direction:
- do not use literal `>` detection
- staged navigation should begin only when the console is inside a navigation session
- outside that session, keep the existing flat-command path
- inside that session, resolve submitted tokens relative to the active staged scope

This prevents staged aliases from colliding with older flat one-token aliases.

#### Sketch Implication

For sketch specifically, this phase should let the console move toward:

- `G` + `Enter`
- `1` + `Enter`
- `S` + `Enter`
- `1` + `Enter`
- `SD` + `Enter`

instead of forcing sketch to stay a pile of top-level ad hoc commands forever.

This fits the larger architecture direction already described elsewhere in this doc:
- sketch should plug into the app-wide console grammar
- sketch should not become a separate console product

# Subphases


