# Cleanup Phase Cleanup-7 - Node-Owned CAD Authoring And Command Adapter Unification

## Doc Header

### Doc History
1. 2026-04-12 20:15: Created this standalone `Cleanup 7` future phase doc to hold the node-owned CAD authoring and command-adapter cleanup lane under the Cleanup family

### Purpose

This doc defines the seventh cleanup phase for the `Cleanup` family.

Use it to answer:
- where CAD authoring truth should live as spaghetti node families widen
- how toolbar, console, and viewport interaction should relate to node-owned truth
- how this cleanup lane should be sequenced at a high level

Do not use it for:
- detailed implementation steps for any one node family
- full smart-wiring rollout planning
- replacing the dedicated `Transform/` architecture family for viewer-owned transform behavior

### Relationship To Other Docs

- `../Cleanup-Index.md`
  - family scan surface

- `../Cleanup-Vision.md`
  - cleanup framing for ownership sinks and adapter drift

- `../Canonical-Ownership-Targets.md`
  - graph document, graph runtime, and transform-session ownership targets

- `../Canonical-Owner-Decisions.md`
  - owner-decision baseline

- `../../Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Nodes/Nodes-Vision.md`
  - current node-family toolbar and graph-authoring direction

## Doc Body

## [ ] Cleanup 7 - Node-Owned CAD Authoring And Command Adapter Unification

### Header

Purpose:
- lock the cleanup rule that spaghetti CAD nodes own authored truth while toolbar, console, and viewport command flows act only as adapters into that same node-owned graph state

Owns:
- node-owned CAD truth direction
- command-adapter versus node-owner boundary
- one graph mutation path rule for command-triggered node edits
- preview and stale-result ownership honesty for CAD authoring surfaces

Does not own:
- the detailed authored contract for every node family
- full smart-wiring implementation
- viewer-only `Transform` behavior that still belongs to the dedicated `Architecture/Transform/` family

### Why This Phase Exists

ParaHook is moving toward a Fusion-style workflow where the user can:
- start a CAD command from the viewport
- use a toolbar while modeling
- later start the same kind of command from the console

That direction becomes risky if those command surfaces start acting like hidden owners.

The cleanup rule for this phase is:
- nodes own the durable authored truth
- toolbar, console, and viewport tools adapt into that truth

Without that rule:
- toolbar-local draft models start competing with node params
- viewport interaction starts mutating graph state through bespoke side paths
- console command entry and toolbar entry drift apart
- later auto-wiring grows as a special-case command trick instead of as one honest graph mutation seam

### Scope

This phase covers:
- node-owned authored truth for CAD node families
- adapter rules for toolbar, console, and viewport command surfaces
- one shared graph mutation path for command-driven node edits
- preview ownership and stale authoritative-result honesty

This phase does not cover:
- the full implementation of `Sketch`, `Extrude`, `Loft`, or `Transform`
- detailed runtime geometry behavior for each node family
- generic Browser or Console decomposition outside the CAD authoring boundary

### Locked Direction

- spaghetti node params, wiring, outputs, and graph runtime remain the durable authored truth for CAD authoring
- toolbar, console, and viewport interactions are command-entry adapters over that same truth
- command-triggered edits should mutate the graph through one canonical graph mutation path instead of separate toolbar-only or console-only write paths
- reopening a CAD toolbar should rehydrate from the active node rather than from a toolbar-owned shadow model
- draft preview may be newer than authoritative result truth, but that split should remain explicit and owned by graph/runtime state rather than by toolbar-local state
- node families such as `Sketch`, `Extrude`, `Loft`, and later graph-native `Transform` should all follow the same node-owned authoring rule

### Phase Ladder

## [ ] Phase 1 - Lock Node-Owned CAD Truth

Purpose:
- restate which authored CAD truths must remain canonical in spaghetti node and graph state

Focus:
- node params
- node wiring
- node outputs
- graph-local draft/runtime preview state

## [ ] Phase 2 - Trace Command Adapter Drift

Purpose:
- identify where toolbar, console, or viewport command entry still behaves like a hidden owner instead of an adapter

Likely hotspots:
- toolbar-local command state
- viewport-first draft interaction that bypasses node params
- console entry paths that do not resolve into the same underlying mutation seam

## [ ] Phase 3 - Tighten One Graph Mutation Path

Purpose:
- make command-triggered graph edits converge on one canonical mutation route shared by toolbar, console, and later auto-wiring flows

Focus:
- active-node targeting
- auto-create or reselect behavior for command-started nodes
- wire and param mutations through one shared graph update seam

## [ ] Phase 4 - Prove Rehydration And Preview Honesty

Purpose:
- verify that command surfaces can close and reopen without losing truth because the node remains the source of authored state

Focus:
- toolbar rehydration from active node truth
- draft preview versus authoritative result honesty
- stale-result read clarity

### Acceptance Checks

- CAD authoring truth has one obvious canonical owner in node and graph state
- toolbar, console, and viewport command surfaces read as adapters rather than hidden owners
- command-triggered node edits follow one graph mutation path
- draft preview and stale authoritative-result state stay explicit instead of becoming toolbar-only truth

### Likely Related Files

- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/consoleReferenceContentCommands.ts`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Spaghetti-Editor-Arch/Nodes/Nodes-Vision.md`

### Success Read

This phase succeeds when:
- CAD command entry feels viewport-first and console-friendly without creating a second authoring model
- the active node remains the durable source of truth when command surfaces open, close, and reopen
- later node families can adopt toolbar and console command flows without re-inventing ownership rules
