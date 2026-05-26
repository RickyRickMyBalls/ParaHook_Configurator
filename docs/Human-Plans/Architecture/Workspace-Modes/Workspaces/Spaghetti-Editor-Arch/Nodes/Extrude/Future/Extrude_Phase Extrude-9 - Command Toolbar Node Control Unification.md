# `Extrude-9` - `Command Toolbar Node Control Unification`

## Doc Header

### Doc History
4. 2026-05-25 16:25:46: Completed the Dispatch 5 manager loop for `Extrude-9`, accepting all four phases after the active Extrude command toolbar moved onto the shared viewport panel shell, began editing live `Geometry/Extrude` node params through ParaSlider and ParaSelect controls, reused the same Extrude control model as the Spaghetti node surface, and proved accept/cancel/preview convergence with focused tests and production build verification.
3. 2026-05-25 14:47:06: Rerouted the shared command-toolbar shell dependency from `Floating Window Shell` to the dedicated `Templates/Viewport Command Toolbar Shell` family so detached/floating app-window shell planning stays separate from Sketch, Transform, and Extrude in-viewport command panels.
2. 2026-05-25 14:45:19: Linked this Extrude toolbar/node-control lane to the new `FWS - 2 - Viewport Command Toolbar Shell` prep phase so shared command-toolbar shell ownership is planned in `Architecture/Templates` before the Extrude active command strip is replaced.
1. 2026-05-25 14:12:59: Added this future phase doc after read-only research found that the active Extrude command toolbar is still a readout-only `ViewerHost` overlay while the real `Geometry/Extrude` authored controls already exist as ParaSlider and ParaSelect-backed node rows in `NodeView`.

### Purpose

Use this doc as the implementation-planning surface for turning the active Extrude command toolbar into a real graph-authored control surface.

The user-facing goal is:
- when the user starts `Extrude`, show a toolbar that feels like the Sketch and Transform toolbars
- expose the same meaningful options that live on the `Geometry/Extrude` node in the Spaghetti editor
- use ParaSlider and ParaSelect controls instead of readout-only chips
- keep the toolbar and the Spaghetti node surface editing the same authored node truth

### Scope

This phase covers:
- active Extrude command toolbar controls for profile summary, depth, direction, type, taper visibility, and output mode
- a shared Extrude control read/write model that can be reused by the node surface and command toolbar
- replacing command-session-only depth/options state with live `Geometry/Extrude` node params where the live command node already exists
- preserving profile picking and live preview behavior while parameter edits flow through graph-authored node truth
- focused verification that toolbar edits, node row edits, preview, accept, cancel, and edit history agree

This phase does not cover:
- new extrude geometry meanings beyond the options already represented by the node contract
- full boolean operation support beyond the current authored output/body mode contract
- reopening multi-wire `SketchProfiles` execution semantics already handled by `Extrude-7`
- broad Sketch or Transform toolbar refactors
- changing the visual design of ParaSlider or ParaSelect themselves

### Shared Shell Dependency

Shared command-toolbar shell prep is owned by:
- `docs/Human-Plans/Architecture/Templates/Viewport Command Toolbar Shell/Future/Viewport_Command_Toolbar_Shell_Phase VCTS - 1 - Shared Command Panel Prep.md`

`Extrude-9` should consume that shell direction instead of inventing a new active command toolbar shell inside `ViewerHost`.

Practical read:
- `ViewerHost` may still host the active Extrude command panel first
- `ViewportOverlayToolPanel` should provide the shared chrome/shell precedent
- Extrude owns the toolbar body and graph-param control model
- the shell must not own Extrude node params, preview semantics, or accept/cancel history behavior

## Doc Body

### Summary

`Extrude-9` is the toolbar/node-control unification lane.

Current read:
- `src/app/components/ViewerHost.tsx` owns the active Extrude command toolbar today
- that toolbar only shows readout stats:
  - `Profiles`
  - `Distance`
  - `Operation`
- `src/app/spaghetti/canvas/NodeView.tsx` already renders the real `Geometry/Extrude` authored controls:
  - `Type`
  - `Direction`
  - `Depth`
  - `Start Depth`
  - `End Depth`
  - `Taper Angle`
  - `Output`
- `src/app/spaghetti/store/useSpaghettiStore.ts` already creates or reuses a live `Geometry/Extrude` node when an active Extrude command starts
- accepting the command still writes hardcoded params such as `Body`, `OneSide`, `NewObjects`, `depthMm`, and `taperAngleDeg: 0`
- the command session still carries a separate `depth` field even though the live command node can be the authored parameter owner

Locked recommendation:
- make the active command toolbar a live editor for the command-owned `Geometry/Extrude` node
- keep profile picking as command/session workflow state, because it owns transient viewport selection and live profile-edge sync
- move durable extrude options to the live node params as soon as the command node exists
- extract a small reusable Extrude control VM so `NodeView` and the toolbar do not duplicate option rules
- accept should commit the live node params instead of overwriting them with hardcoded defaults
- cancel should roll back the live command graph exactly as it does today

### Current Code-Backed Read

The strongest owner seams for this phase are:

- `src/app/components/ViewerHost.tsx`
  - owns the current readout-only `ExtrudeCommandToolbar`
  - should become the command-toolbar host, not the source of extrude option truth
- `src/app/spaghetti/commands/extrudeCommandSession.ts`
  - owns active command lifecycle, selected profile sources, and validation
  - currently carries `depth` and `operationMode`, which should shrink as node params become the durable option source
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - owns command start/cancel/accept
  - already creates or reuses the live extrude node
  - should provide narrow active-command param write helpers instead of letting `ViewerHost` patch graph state ad hoc
- `src/app/spaghetti/canvas/NodeView.tsx`
  - owns the current full node-surface controls and visibility rules
  - should donate reusable VM/helper logic, not remain the only place that knows how Extrude controls work
- `src/app/spaghetti/canvas/structuredWireNumericRowProps.ts`
  - already provides the ParaSlider-backed numeric row prop shape used by Extrude node rows
- `src/app/spaghetti/canvas/structuredWireEnumRowProps.ts`
  - already provides the ParaSelect-backed enum row prop shape used by Extrude node rows
- `src/app/spaghetti/registry/nodeRegistry.ts`
  - owns `Geometry/Extrude` default params, inputs, output mode, and evaluator meaning

### Boundary Rules

- toolbar state is presentation and command flow state only
- authored Extrude options belong to `Geometry/Extrude` node params
- profile selection may remain active-command state while the user is picking profiles, but it must keep syncing to the live node's `ExtrusionProfile` wires
- a toolbar control must not invent an option that the node contract cannot also represent
- a node control must not have a different default, visibility rule, or write path from the toolbar control
- driven/wired parameter rows should be read-only in the toolbar for the same reason they are read-only in the node surface

## Vision

Extrude should feel like one CAD command across the viewport and Spaghetti editor.

The user can start Extrude from the viewport, pick profiles, adjust distance and options in a floating toolbar, and still trust that the graph node is the authored source of truth. The toolbar should feel like a convenient control surface over the node, not a hidden second Extrude model.

## Wishlist Organization

### High Level Goals

- [x] `Extrude-Gen1-HLG-1. When the user starts Extrude, the toolbar should show a real list of ParaSlider and ParaSelect controls instead of readout-only chips.`
- [x] `Extrude-Gen1-HLG-2. The toolbar should expose the same important options as the Geometry/Extrude node in the Spaghetti editor.`
- [x] `Extrude-Gen1-HLG-3. Sketch, Transform, and Extrude toolbars should move toward one shared control-surface pattern instead of one-off toolbar code.`
- [x] `Extrude-Gen1-HLG-4. The toolbar must edit graph-authored Extrude node truth, not become a separate hidden owner.`
- [x] `Extrude-Gen1-HLG-5. Accept, cancel, preview, and edit history should all agree with the visible toolbar values.`

### Codex Level Goals

- [x] CLG 1. Route active Extrude command option reads through the live command-owned `Geometry/Extrude` node where possible.
- [x] CLG 2. Extract one reusable Extrude control VM or helper layer from the current node-surface logic.
- [x] CLG 3. Replace the readout-only `ViewerHost` toolbar with ParaSlider and ParaSelect-backed rows using that shared control model.
- [x] CLG 4. Update command accept so it preserves live node params instead of writing hardcoded defaults.
- [x] CLG 5. Add focused proof that node edits and toolbar edits stay in sync through preview, accept, cancel, and history.

### `Extrude-9 / Phase 1`

- [x] `HLG 4. The toolbar must edit graph-authored Extrude node truth, not become a separate hidden owner.`
- identify the active command node param read source
- add narrow store helpers for active-command Extrude param writes
- make command depth read from and write to the live node param path

### `Extrude-9 / Phase 2`

- [x] `HLG 2. The toolbar should expose the same important options as the Geometry/Extrude node in the Spaghetti editor.`
- [x] `HLG 3. Sketch, Transform, and Extrude toolbars should move toward one shared control-surface pattern instead of one-off toolbar code.`
- extract reusable Extrude control VM/helpers for type, direction, depth rows, taper visibility, and output mode
- keep node-surface behavior unchanged while moving rule ownership out of inline `NodeView` code

### `Extrude-9 / Phase 3`

- [x] `HLG 1. When the user starts Extrude, the toolbar should show a real list of ParaSlider and ParaSelect controls instead of readout-only chips.`
- [x] `HLG 2. The toolbar should expose the same important options as the Geometry/Extrude node in the Spaghetti editor.`
- render the active Extrude toolbar as a list of ParaSlider and ParaSelect controls
- keep profile selection as a summary/action row while durable options use the shared node-control model

### `Extrude-9 / Phase 4`

- [x] `HLG 5. Accept, cancel, preview, and edit history should all agree with the visible toolbar values.`
- make accept preserve live node params
- prove cancel rollback restores the prior graph
- prove toolbar and node edits converge on one accepted history entry shape

## [x] `Extrude-9 / Phase 1` - `Live Command Node Parameter Ownership`

### Phase 1 Summary

#### Purpose

Move active Extrude command option ownership toward the live command-owned `Geometry/Extrude` node.

#### Owns

- reading active command option values from the live Extrude node when `liveGraph.liveExtrudeNodeId` exists
- writing active command depth through a graph param path
- preserving profile selection/session validation behavior
- preparing command state to shrink away from duplicate durable option fields

#### Does Not Own

- visible toolbar redesign
- extracting all node-control helpers
- changing Extrude runtime geometry meaning
- changing multi-profile selection semantics

#### Current Live Read

The command already creates or reuses a `Geometry/Extrude` node through `ensureLiveExtrudeCommandGraph`. The command session still carries `depth`, and accept still overwrites node params with fixed defaults. This phase should make depth the first durable option that clearly reads and writes through the live node.

### Phase 1 Implementation Spec

#### Exact First Code Cut

1. Add a helper that resolves the active command's live Extrude node from `extrudeCommandSession.liveGraph.liveExtrudeNodeId`.
2. Add a narrow store action for active command Extrude param writes, starting with `depthMm`.
3. Update active command depth changes to patch the live node param.
4. Keep `extrudeCommandSession.depth` only as a compatibility read if needed during this transition.
5. Make preview derive the active depth from the live node param once available.

#### Likely Files

- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/commands/extrudeCommandSession.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`

#### No-Widening Rule

Do not add new Extrude options yet. This phase is about source-of-truth repair for the current command depth path.

#### Verification Shape

- active command depth edits update the live Extrude node param
- live preview follows the node param value
- selected profile validation still works
- cancel still removes or restores the live command graph

#### Done Shape

Active command `Depth` is no longer primarily a toolbar/session-only value.

## [x] `Extrude-9 / Phase 2` - `Reusable Extrude Control Model`

### Phase 2 Summary

#### Purpose

Extract the Extrude option rules currently embedded in `NodeView` into a reusable control model that can power both node rows and the active command toolbar.

#### Owns

- one reusable read model for visible Extrude controls
- shared visibility rules for `Depth`, `Start Depth`, `End Depth`, and `Taper Angle`
- shared option lists for `Type`, `Direction`, and `Output`
- shared driven/read-only messaging where a parameter is wired

#### Does Not Own

- changing ParaSlider or ParaSelect internals
- redesigning node row markup
- moving Sketch or Transform controls to the new model in this pass
- changing current Extrude option labels unless they are already drifted from the node contract

#### Current Live Read

`NodeView` already knows the important rules, but those rules are inline inside `renderExtrudeTemplate`. Reusing them in `ViewerHost` by copying code would deepen the split. The safer path is a helper that returns the same values, options, disabled states, and visibility booleans for either surface.

### Phase 2 Implementation Spec

#### Exact First Code Cut

1. Create a small Extrude control helper near the Spaghetti node/canvas ownership layer.
2. Move option constants and visibility calculations into that helper.
3. Keep node-surface rendering visually unchanged while consuming the helper.
4. Return enough metadata for a toolbar renderer to create ParaSlider and ParaSelect rows without duplicating Extrude-specific rules.

#### Likely Files

- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/structuredWireNumericRowProps.ts`
- `src/app/spaghetti/canvas/structuredWireEnumRowProps.ts`
- a new focused helper under `src/app/spaghetti/` or `src/app/spaghetti/canvas/`
- focused helper tests

#### No-Widening Rule

Do not move broad node-shell rendering out of `NodeView`. Extract only the rules needed to make Extrude controls reusable.

#### Verification Shape

- existing node-surface tests still see ParaSlider and ParaSelect rows
- type/direction/output options remain unchanged
- `TwoSides` still shows start/end depth instead of single depth
- taper remains visible only for the supported `Body + OneSide` path

#### Done Shape

There is one reusable Extrude control model ready for both the node surface and command toolbar.

## [x] `Extrude-9 / Phase 3` - `ParaSlider And ParaSelect Command Toolbar`

### Phase 3 Summary

#### Purpose

Replace the readout-only active Extrude command toolbar with a real control surface using the shared Extrude control model.

#### Owns

- consuming the shared command-toolbar shell direction from `VCTS - 1`
- visible toolbar rows for profile summary, type, direction, depth, conditional depth rows, taper, and output mode
- ParaSlider for numeric rows
- ParaSelect for enum rows
- OK and Cancel actions
- basic toolbar layout parity with the calm Sketch and Transform toolbar style

#### Does Not Own

- making the toolbar resizable or draggable unless the existing shell pattern makes that nearly free
- adding new parameter kinds
- changing profile-pick behavior beyond the summary/action row
- broad toolbar framework extraction across all command families

#### Current Live Read

`ViewerHost` currently renders `ExtrudeCommandToolbar` as a compact stats strip. This phase should keep the host but replace the body with controls. Profile picking still needs a concise status row because profile selection is partly command workflow state, not just a scalar node param.

### Phase 3 Implementation Spec

#### Exact First Code Cut

1. Import/use `ParaSlider` and `ParaSelect` in the active Extrude toolbar component.
2. Render the toolbar inside the shared shell direction prepared by `VCTS - 1`, likely `ViewportOverlayToolPanel` for the first cut.
3. Feed the toolbar from the shared Extrude control model.
4. Render profile selection as a summary row that still reflects active command selected profile sources.
5. Render only visible controls according to the same node rules.
6. Patch live node params through the store actions from Phase 1.
7. Preserve existing OK/Cancel behavior and disabled state.

#### Likely Files

- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/components/ParaSlider.tsx`
- `src/app/components/ParaSelect.tsx`
- `src/app/theme/foundation/base.css` or the relevant viewport toolbar stylesheet if layout work is needed

#### No-Widening Rule

Do not create a second custom Extrude selector widget. Use `ParaSlider` and `ParaSelect` so this remains aligned with the node surface and other toolbars.

#### Verification Shape

- active toolbar renders ParaSlider for depth
- active toolbar renders ParaSelect for type, direction, and output mode
- changing toolbar controls updates the live node params
- changing direction changes visible depth rows
- profile count updates as the user picks profiles
- OK remains disabled until required profiles exist

#### Done Shape

The active Extrude command toolbar is a real list of node-backed controls instead of readout-only chips.

## [x] `Extrude-9 / Phase 4` - `Accept Cancel Preview And History Convergence`

### Phase 4 Summary

#### Purpose

Make command completion and rollback honor the new single-source parameter model.

#### Owns

- accept preserving live node params
- cancel rollback proof after toolbar param edits
- preview proof for toolbar-edited params
- edit history proof for accepted command graph changes
- regression coverage that node-surface edits and toolbar edits converge

#### Does Not Own

- final B-rep/export semantics for unsupported option combinations
- new operation modes not already represented by the node
- broad edit-history redesign

#### Current Live Read

Accept currently calls a helper that writes fixed Extrude params. Once the toolbar edits live node params, that helper must stop erasing user-authored choices. Cancel already rolls back the live command graph, but toolbar edits add a new reason to prove rollback is complete.

### Phase 4 Implementation Spec

#### Exact First Code Cut

1. Replace hardcoded accept-param overwrites with preservation of live node params.
2. Keep any minimum normalization needed for valid `Geometry/Extrude` defaults.
3. Confirm output-preview wiring still happens after accept.
4. Add rollback tests where the user changes toolbar depth/type/direction and cancels.
5. Add accept tests where the accepted node keeps toolbar-edited params.
6. Add a node-toolbar parity test where an accepted Extrude node displays the same values in `NodeView`.

#### Likely Files

- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- `src/app/console/graphCommandAuthoring.test.ts` if command summaries need updating

#### No-Widening Rule

Do not make unsupported geometry combinations look fully solved. If a parameter is visible but runtime support is still limited, keep the visible rules and tests honest about the supported subset.

#### Verification Shape

- accept keeps toolbar-edited params
- cancel restores the graph that existed before command start
- preview reads the same params shown in the toolbar
- node surface shows the accepted values after command commit
- edit history undo/redo restores the accepted command graph

#### Done Shape

Extrude command toolbar, Spaghetti node rows, preview, accept/cancel, and edit history all agree on one authored node truth.
