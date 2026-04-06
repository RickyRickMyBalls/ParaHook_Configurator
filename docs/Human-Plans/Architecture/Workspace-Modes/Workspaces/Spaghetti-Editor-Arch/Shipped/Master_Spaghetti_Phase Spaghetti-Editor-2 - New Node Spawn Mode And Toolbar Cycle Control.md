# Master Spaghetti Phase Spaghetti-Editor-2 - New Node Spawn Mode And Toolbar Cycle Control

## Doc Header

### Doc History
2. 2026-04-06 10:18: Marked `Spaghetti-Editor 2 - New Node Spawn Mode And Toolbar Cycle Control` shipped after the editor gained a real global `newNodeSpawnMode` store preference, a toolbar cycle button for `Spawn: collapsed / essentials / expanded`, creation-time node-mode stamping for new nodes, and a `collapsed` default that now makes new shared-template nodes spawn with visible rails plus compact one-line rows while leaving existing nodes untouched
1. 2026-04-06 10:05: Created this standalone future `Master Spaghetti` phase doc so the new-node spawn-mode cleanup and the future global `Collapsed / Essentials / Expanded` cycle control now have one implementation-ready planning surface under `Spaghetti-Editor-Arch/Future/` instead of living only as a short umbrella-index phase block

### Purpose

This phase adds one editor-level control for how newly created nodes should appear when they first spawn on the canvas.

Use it to answer:
- what the new global spawn-default setting should mean
- where the spawn-default source of truth should live
- how the toolbar should expose the `Collapsed / Essentials / Expanded` cycle
- how new-node defaults should reuse the existing shared node-mode contract without rewriting existing nodes

## Doc Body

## [x] Spaghetti-Editor 2 - New Node Spawn Mode And Toolbar Cycle Control

Summary:
- add one global `new node spawn mode` preference for future node creation
- expose that preference through one toolbar cycle control
- reuse the existing shared node-mode contract:
  - `collapsed`
  - `essentials`
  - `expanded`
- keep existing nodes stable when the spawn-default changes

Owns:
- one editor-level source of truth for the default mode applied to newly created nodes
- one toolbar control that cycles the spawn-default mode
- the first-spawn presentation rule for shared-template nodes like `Sketch` and `Extrude`
- clarifying that `collapsed` spawn still keeps visible `Inputs` and `Outputs` rails while rows stay compact

Does not own:
- redesigning per-node row behavior
- changing the current per-node top-left node mode button
- retroactively rewriting existing node modes across the graph
- toolbar cleanup outside this narrow spawn-default control

### Current Code Truth

The shipped implementation now exists in code:

- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `defaultNodeRowMode` now defaults to `collapsed`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `newNodeSpawnMode` is a real store preference with `setNewNodeSpawnMode(...)` and `cycleNewNodeSpawnMode(...)`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `selectNodeMode(...)` still reads authored node mode, while new nodes are now stamped with the active spawn mode at creation time
- `src/app/spaghetti/canvas/nodeTemplateContract.ts`
  - `getDefaultStructuredWireRowMode(...)` already maps:
    - `collapsed`
    - `essentials`
    - `expanded`
  - onto the row-density defaults
- `src/app/spaghetti/canvas/nodeTemplateContract.ts`
  - wiring surfaces are already defined to stay visible in `collapsed`
- `src/app/spaghetti/canvas/NodeView.tsx`
  - managed rows like `SketchPlane`, `SketchEntities`, and `ExtrusionProfile` already derive their default-open behavior from the shared node-mode contract
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - the toolbar now exposes the spawn-mode cycle control and new nodes inherit the selected mode through the add-node path
- `src/app/spaghetti/ui/CollapsedEditor.tsx`
  - the collapsed editor also exposes the same spawn-mode cycle control

This means the shipped pass stayed on the intended path:
- no second spawn-presentation system
- one configurable source of truth for future node creation
- one explicit stamping seam for newly created nodes

### Why This Phase Lives Under `Master Spaghetti`

This is editor-level behavior, not a node-family feature.

The request is not:
- redesign the `SketchPlane` row
- redesign the `Extrude` row stack

The request is:
- choose how new nodes appear when created
- expose that choice in the editor toolbar
- keep that choice generic enough for future nodes

That makes this a `Master Spaghetti` ownership question:
- workspace/editor-level default presentation policy
- toolbar-owned preference surface
- shared behavior across node families

### First Implementation Target

The first target should be:

1. add one editor-level setting:
   - `newNodeSpawnMode`
2. valid values:
   - `collapsed`
   - `essentials`
   - `expanded`
3. default that setting to:
   - `collapsed`
4. when a node is newly created:
   - initialize that new node's authored mode from `newNodeSpawnMode`
5. when the toolbar cycle button is pressed:
   - rotate the stored spawn-default value
6. do not mutate already-existing nodes when the setting changes

Important rule:
- this first pass should stamp the chosen mode onto newly created nodes at creation time
- it should not make all no-explicit-mode nodes dynamically change every time the global spawn-default changes

That keeps the behavior honest and predictable:
- each created node reflects the spawn policy that was active when it was created
- later preference changes affect only future nodes

### Current Code-To-Target Mapping

Current likely seams:

- current node-mode default and selector fallback:
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
- node-mode type:
  - `src/app/spaghetti/schema/spaghettiTypes.ts`
- shared row-density and visible-rail defaults:
  - `src/app/spaghetti/canvas/nodeTemplateContract.ts`
- live node rendering:
  - `src/app/spaghetti/canvas/NodeView.tsx`
- toolbar/editor shell:
  - `src/app/spaghetti/ui/SpaghettiEditor.tsx`
  - related editor-shell controls nearby in:
    - `src/app/spaghetti/ui/CollapsedEditor.tsx`
    - `src/app/spaghetti/ui/ExpandedEditor.tsx`
- node creation paths:
  - search around graph-command or store paths that create new nodes and currently rely on the default fallback instead of explicitly stamping a mode

Target direction:

- move the global default from a hardcoded module constant to one persisted editor-level preference in the store
- create one narrow helper that returns the initial node mode for newly created nodes
- call that helper in node-creation seams so fresh nodes get an explicit initial mode
- keep `selectNodeMode(...)` as the reader for authored node mode, but avoid making existing nodes drift when the spawn-default changes later

### Recommended First Implementation Shape

Use one simple explicit model:

1. store one global preference:
   - `newNodeSpawnMode`
2. add one store action:
   - cycle to next spawn mode
3. on node creation:
   - if the new node has no explicit authored mode yet, stamp the current `newNodeSpawnMode` into `graph.ui.nodeModesByNodeId[nodeId]`
4. keep per-node mode changes working exactly as they do now
5. expose one toolbar button label such as:
   - `Spawn: Collapsed`
   - `Spawn: Essentials`
   - `Spawn: Expanded`

Why this shape is preferred:

- it is explicit
- it avoids global retroactive drift
- it keeps old nodes stable
- it uses the already-shipped row/block contracts

Avoid this first-pass shape:

- changing the fallback reader so all legacy nodes silently restyle when the preference changes

That would make the preference feel like a graph-wide restyle toggle instead of a new-node spawn policy.

### Toolbar Behavior Direction

The toolbar control should:

- live near the current editor-level mode controls
- cycle one step per click
- always show the active next-node policy in the label itself
- not affect the current selected node immediately

Suggested first-pass wording:

- `Spawn: Collapsed`
- `Spawn: Essentials`
- `Spawn: Expanded`

This is better than a vague unlabeled icon-only control because the user is choosing a future-node default, not toggling the current canvas view.

### Questions / Decisions

#### [x] `q1` Should the first pass use one global spawn-default rather than separate per-node-type defaults?

Suggestion:
- yes
- keep the first pass global, clear, and editor-level

Decision:
- yes
- use one global `newNodeSpawnMode`

#### [x] `q2` Should changing the toolbar spawn-default leave already-existing nodes untouched?

Suggestion:
- yes
- the control should answer only how the next node spawns

Decision:
- yes
- existing nodes must not be retroactively rewritten

#### [x] `q3` Should `collapsed` become the preferred first shipped default for new-node spawn?

Suggestion:
- yes
- that is the current desired compact behavior:
  - visible rails
  - one-line rows

Decision:
- yes
- ship the first pass with `collapsed` as the default spawn mode

#### [x] `q4` Should new nodes receive an explicit authored mode at creation time instead of depending forever on a mutable global fallback?

Suggestion:
- yes
- stamp the chosen mode when the node is created

Decision:
- yes
- node creation should write the current spawn-default as the node's initial authored mode

### Shipped Result

The phase shipped with the intended first-pass behavior:

- one global `newNodeSpawnMode`
- one toolbar cycle control:
  - `Spawn: collapsed`
  - `Spawn: essentials`
  - `Spawn: expanded`
- `collapsed` as the default shipped spawn mode
- creation-time node-mode stamping for newly created nodes
- no retroactive restyling of already-existing nodes

That gives the desired compact default for new shared-template nodes:
- visible rails
- compact one-line rows
- normal per-node mode cycling still available afterward

### Phase Boundary

Owned here:
- one global spawn-default preference
- one toolbar cycle control
- one explicit node-creation stamping rule
- focused verification for `Sketch`, `Extrude`, and generic future shared-template nodes

Not owned here:
- redesigning the visible shell of `collapsed`, `essentials`, or `expanded`
- changing the meaning of the existing per-node mode cycle button
- per-node-family manual-open defaults beyond what the shared contract already defines
- multi-setting toolbar personalization

### Acceptance Checks

- the editor exposes one clear control for the spawn mode of newly created nodes
- the control cycles through:
  - `Collapsed`
  - `Essentials`
  - `Expanded`
- the default shipped value is `Collapsed`
- creating a new `Sketch` while the control shows `Spawn: Collapsed` produces a node with visible rails and compact one-line rows
- creating a new `Extrude` while the control shows `Spawn: Collapsed` produces a node with visible rails and compact one-line rows
- switching the toolbar control to `Spawn: Essentials` affects the next created node but does not restyle older nodes
- switching the toolbar control to `Spawn: Expanded` affects the next created node but does not restyle older nodes
- per-node mode toggles still work after spawn
- future shared-template nodes can inherit the same initial mode without a second spawn-state system

### Suggested Verification

- store test:
  - cycling `newNodeSpawnMode` rotates `collapsed -> essentials -> expanded -> collapsed`
- store or graph-command test:
  - newly created node records the currently selected spawn mode as its authored node mode
- regression test:
  - changing `newNodeSpawnMode` does not mutate previously created nodes
- canvas render test:
  - new `Sketch` under `collapsed` spawns with visible rails and compact rows
- canvas render test:
  - new `Extrude` under `collapsed` spawns with visible rails and compact rows
- toolbar interaction test:
  - the button label updates as the cycle changes
