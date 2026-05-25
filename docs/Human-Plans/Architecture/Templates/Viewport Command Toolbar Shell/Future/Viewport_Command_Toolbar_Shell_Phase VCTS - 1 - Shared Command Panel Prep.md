# `VCTS - 1` - `Shared Command Panel Prep`

## Doc Header

### Doc History
1. 2026-05-25 14:47:06: Added this standalone future phase doc to prep the shared in-viewport command-toolbar shell for Sketch, Transform, and Extrude before `Extrude-9` moves the active Extrude command toolbar onto ParaSlider and ParaSelect-backed node controls.

### Purpose

Use this doc as the prep surface for a shared viewport command-toolbar shell.

The immediate reason this phase exists is `Extrude-9`.

Extrude is about to move from a readout-only active command strip into a ParaSlider and ParaSelect-backed toolbar over the live `Geometry/Extrude` node. Before that happens, the toolbar shell should be planned as shared viewport-command chrome so Extrude does not become the third separate toolbar implementation beside Sketch and Transform.

### Scope

This phase covers:
- the shared in-viewport command-toolbar shell used by active command panels
- the shell/chrome contract around title, body slots, action buttons, section layout, density, and optional sizing behavior
- the boundary between shared shell ownership and feature-owned toolbar content
- the migration target for Extrude's active command toolbar
- a later cleanup path for Sketch and Transform toolbar shell drift

This phase does not cover:
- detached or floating app-window shell behavior
- Extrude parameter ownership or node-control VM extraction
- Sketch drawing command behavior
- Transform target selection, gizmo behavior, or history behavior
- replacing `ParaSlider`, `ParaSelect`, or feature-specific control rows

## Doc Body

### Goal

Create one honest shared shell lane for in-viewport command toolbars before Extrude adopts the richer toolbar surface.

The shell should answer:
- what common command-toolbar chrome owns
- where OK/Cancel or command action placement belongs
- how a command toolbar should host ParaSlider, ParaSelect, and summary rows
- how much resize, drag, density, and title behavior should be common
- how feature content remains owned by the feature family

### Current Live Read

Current related surfaces:

- `src/app/components/ViewportOverlayToolPanel.tsx`
  - already acts as the reusable overlay panel shell for viewport tools
  - owns the strongest current shell/chrome precedent
- `src/app/components/ReferenceTransformToolbar.tsx`
  - Transform content uses the shared overlay tool panel shell
  - feature data and behavior remain Transform-owned
- `src/app/components/ViewportOverlay.tsx`
  - Sketch overlay panels use the same shell direction and classes
  - Sketch still carries sketch-specific placement/session plumbing
- `src/app/components/ViewerHost.tsx`
  - Extrude currently owns a bespoke readout-only active command strip
  - this is the near-term consumer that should move onto the shared shell

### Boundary Rules

- `Viewport Command Toolbar Shell` owns shared command-toolbar chrome when the behavior is common across active in-viewport command panels.
- Feature families own toolbar body content, command state, graph writes, preview behavior, and history behavior.
- `ViewportOverlayToolPanel` is the current shell precedent, not `ReferenceTransformToolbar` or `ViewportOverlay` themselves.
- A shared shell must not own Extrude node params, Sketch geometry state, or Transform target state.
- A shell abstraction should extract repeated truth, not force every toolbar into a fake identical layout.

### Recommended Direction

Use `ViewportOverlayToolPanel` as the first shared shell owner for Extrude.

The near-term Extrude stack should be:

```text
ViewerHost
  -> ViewportOverlayToolPanel
    -> Extrude command toolbar body
      -> shared Extrude control VM
        -> live Geometry/Extrude node params
```

Longer term, if Sketch, Transform, and Extrude reveal enough repeated command-panel behavior, extract a small command-toolbar wrapper around `ViewportOverlayToolPanel`.

That wrapper may own:
- title/action row conventions
- command action placement
- section stack defaults
- compact/expanded density decisions
- optional resize/placement presets

That wrapper must not own:
- command-specific state
- graph param writes
- preview semantics
- undo/history behavior
- feature-specific control visibility rules

### Acceptance Read

This phase is healthy when:
- the shared command-toolbar shell owner is named before Extrude implementation starts
- Extrude can point at a Templates-family shell prep phase instead of growing another custom strip
- Sketch and Transform are described honestly as partially shell-aligned, not fully unified
- future cleanup has a route for command-toolbar shell convergence after Extrude proves the pattern

## Wishlist Organization

### High Level Goals

- [ ] `VCTS-HLG-1. Active viewport command toolbars should share one shell direction instead of growing feature-local chrome.`
- [ ] `VCTS-HLG-2. Extrude should adopt the shared toolbar shell before it gains richer ParaSlider and ParaSelect controls.`
- [ ] `VCTS-HLG-3. Sketch and Transform should be treated as partial precedents, not already-complete unification.`
- [ ] `VCTS-HLG-4. Shared shell ownership must stay separate from feature content and graph truth.`

### `VCTS - 1 Phase 1`

- [ ] `HLG 1. Active viewport command toolbars should share one shell direction instead of growing feature-local chrome.`
- [ ] `HLG 3. Sketch and Transform should be treated as partial precedents, not already-complete unification.`
- audit Sketch, Transform, and Extrude toolbar shell ownership
- lock `ViewportOverlayToolPanel` as the first shared shell target
- define what the shell owns versus what feature toolbar bodies own

### `VCTS - 1 Phase 2`

- [ ] `HLG 2. Extrude should adopt the shared toolbar shell before it gains richer ParaSlider and ParaSelect controls.`
- [ ] `HLG 4. Shared shell ownership must stay separate from feature content and graph truth.`
- prep the Extrude migration contract over the shared shell
- identify which body slots Extrude needs for profile summary, ParaSlider/ParaSelect rows, and OK/Cancel
- keep graph-authored Extrude params owned by the Spaghetti/Extrude family

### `VCTS - 1 Phase 3`

- [ ] `HLG 1. Active viewport command toolbars should share one shell direction instead of growing feature-local chrome.`
- [ ] `HLG 3. Sketch and Transform should be treated as partial precedents, not already-complete unification.`
- after Extrude proves the pattern, evaluate whether Sketch and Transform should move through a small shared command-toolbar wrapper
- route any cleanup follow-ons without blocking the first Extrude toolbar migration

## [ ] `VCTS - 1 / Phase 1` - `Command Toolbar Shell Owner Read`

### Phase 1 Summary

#### Purpose

Name the current shell ownership reality for Sketch, Transform, and Extrude, then lock the shared shell target for Extrude.

#### Owns

- shell owner audit
- shared shell boundary
- `ViewportOverlayToolPanel` as the first target
- current-not-unified read for Sketch and Transform

#### Does Not Own

- implementing the Extrude toolbar
- changing Sketch or Transform behavior
- extracting feature body controls

### Phase 1 Implementation Spec

#### Exact First Code Cut

1. Read `ViewportOverlayToolPanel`, `ReferenceTransformToolbar`, `ViewportOverlay`, and the current `ViewerHost` Extrude toolbar.
2. Document which shared shell behaviors already exist.
3. Document which behaviors are still feature-local.
4. Lock the first shared shell target for Extrude as `ViewportOverlayToolPanel`.

#### Verification Shape

- the shell owner is explicit
- Sketch and Transform are not described as fully unified
- Extrude has a clear shell target before its toolbar body changes

#### Done Shape

`VCTS - 1 / Phase 1` is done when the shell owner and boundaries are clear enough that `Extrude-9` can start without inventing a new toolbar shell.

## [ ] `VCTS - 1 / Phase 2` - `Extrude Shell Prep Contract`

### Phase 2 Summary

#### Purpose

Define the shell/body contract Extrude should use when it moves from a readout strip to a real command toolbar.

#### Owns

- Extrude shell slots
- action placement
- section/body structure
- handoff boundary to `Extrude-9`

#### Does Not Own

- Extrude node param reads/writes
- Extrude control VM implementation
- accept/cancel graph rollback logic

### Phase 2 Implementation Spec

#### Exact First Code Cut

1. Define the Extrude command-toolbar shell slots:
   - title
   - profile summary/action row
   - ParaSlider/ParaSelect control rows
   - OK/Cancel action area
2. Decide whether the first Extrude shell pass should be fixed, draggable, resizable, or simply use existing overlay panel behavior.
3. Record that `ViewerHost` may host the active command panel first while the shell/chrome comes from the shared Templates owner.
4. Keep all Extrude option truth in the live `Geometry/Extrude` node, not the shell.

#### Verification Shape

- `Extrude-9` can reference this shell contract
- body content remains Extrude-owned
- graph truth remains Spaghetti/Extrude-owned

#### Done Shape

`VCTS - 1 / Phase 2` is done when Extrude has a prepared shared-shell contract for its first real toolbar migration.

## [ ] `VCTS - 1 / Phase 3` - `Post-Extrude Toolbar Shell Cleanup Route`

### Phase 3 Summary

#### Purpose

Keep Sketch and Transform cleanup honest after Extrude proves the shared shell pattern.

#### Owns

- follow-on routing for Sketch and Transform shell drift
- decision point for a tiny command-toolbar wrapper around `ViewportOverlayToolPanel`
- cleanup boundaries after Extrude migration

#### Does Not Own

- rewriting all command toolbars before Extrude
- merging feature body logic across Sketch, Transform, and Extrude
- replacing the existing overlay panel shell without proof

### Phase 3 Implementation Spec

#### Exact First Code Cut

1. Compare the implemented Extrude shell against Sketch and Transform shell usage.
2. Identify repeated command-toolbar chrome that is worth extracting.
3. Create a follow-on phase only if repetition is real after Extrude lands.
4. Keep Sketch and Transform feature behavior in their existing families.

#### Verification Shape

- cleanup is routed after proof, not before
- feature-specific behavior stays out of the shell
- the command-toolbar shell direction can widen without blocking Extrude

#### Done Shape

`VCTS - 1 / Phase 3` is done when the next Sketch/Transform shell cleanup step is either explicitly routed or intentionally deferred.
