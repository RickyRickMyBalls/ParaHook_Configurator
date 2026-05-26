# `VCTS - 1` - `Shared Command Panel Prep`

## Doc Header

### Doc History
2. 2026-05-25 15:07:48: Ran the Dispatch 5 Simpler manager loop through `VCTS - 1`, marking all three prep phases complete after code-backed research confirmed `ViewportOverlayToolPanel` as the shared shell primitive, locked the Extrude shell/body handoff contract, and deferred broader Sketch/Transform cleanup until after Extrude proves the pattern.
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

### Dispatch 5 Completion Read

Manager loop:
- `VCTS - 1 / Phase 1` was selected, prepped, researched, and accepted as a shell-owner read.
- `VCTS - 1 / Phase 2` was selected, prepped, researched, and accepted as the Extrude shell prep contract.
- `VCTS - 1 / Phase 3` was selected, prepped, researched, and accepted as the post-Extrude cleanup route.

Accepted result:
- `ViewportOverlayToolPanel` is the shared in-viewport command-toolbar shell primitive.
- Transform is shell-aligned through direct `ViewportOverlayToolPanel` use in `ReferenceTransformToolbar`.
- Sketch is partially shell-aligned through `ViewportOverlay` and shared panel classes, but still carries sketch-specific placement and session plumbing.
- Extrude is not shell-aligned yet; its active command toolbar remains a bespoke `ViewerHost` strip until `Extrude-9`.
- The first Extrude migration should consume the shared shell direction while keeping Extrude body content, graph param truth, preview, accept/cancel, and history in the Extrude/Spaghetti families.
- A later wrapper around `ViewportOverlayToolPanel` is allowed only after the Extrude migration proves repeated command-panel chrome worth extracting.

Verification:
- read `src/app/components/ViewportOverlayToolPanel.tsx`
- read `src/app/components/ReferenceTransformToolbar.tsx`
- read `src/app/components/ViewportOverlay.tsx`
- read `src/app/components/ViewerHost.tsx`
- no runtime code changed
- no build was required

## Wishlist Organization

### High Level Goals

- [ ] `VCTS-HLG-1. Active viewport command toolbars should share one shell direction instead of growing feature-local chrome.`
- [ ] `VCTS-HLG-2. Extrude should adopt the shared toolbar shell before it gains richer ParaSlider and ParaSelect controls.`
- [ ] `VCTS-HLG-3. Sketch and Transform should be treated as partial precedents, not already-complete unification.`
- [ ] `VCTS-HLG-4. Shared shell ownership must stay separate from feature content and graph truth.`

### `VCTS - 1 Phase 1`

- [x] `HLG 1. Active viewport command toolbars should share one shell direction instead of growing feature-local chrome.`
- [x] `HLG 3. Sketch and Transform should be treated as partial precedents, not already-complete unification.`
- [x] audit Sketch, Transform, and Extrude toolbar shell ownership
- [x] lock `ViewportOverlayToolPanel` as the first shared shell target
- [x] define what the shell owns versus what feature toolbar bodies own

### `VCTS - 1 Phase 2`

- [x] `HLG 2. Extrude should adopt the shared toolbar shell before it gains richer ParaSlider and ParaSelect controls.`
- [x] `HLG 4. Shared shell ownership must stay separate from feature content and graph truth.`
- [x] prep the Extrude migration contract over the shared shell
- [x] identify which body slots Extrude needs for profile summary, ParaSlider/ParaSelect rows, and OK/Cancel
- [x] keep graph-authored Extrude params owned by the Spaghetti/Extrude family

### `VCTS - 1 Phase 3`

- [x] `HLG 1. Active viewport command toolbars should share one shell direction instead of growing feature-local chrome.`
- [x] `HLG 3. Sketch and Transform should be treated as partial precedents, not already-complete unification.`
- [x] after Extrude proves the pattern, evaluate whether Sketch and Transform should move through a small shared command-toolbar wrapper
- [x] route any cleanup follow-ons without blocking the first Extrude toolbar migration

## [x] `VCTS - 1 / Phase 1` - `Command Toolbar Shell Owner Read`

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

### Phase 1 Dispatch Packet

#### Scope

Audit the live shell owner seams for Sketch, Transform, and Extrude, then lock the first shared shell target for Extrude.

#### Exclusions

- no runtime implementation
- no Extract/Move code changes
- no Sketch or Transform behavior changes
- no Extrude parameter ownership changes

#### Code-Backed Findings

- `src/app/components/ViewportOverlayToolPanel.tsx`
  - exports the reusable panel shell, title bar, title actions, resize handles, body area, split layout, and section stack helpers.
- `src/app/components/ReferenceTransformToolbar.tsx`
  - directly wraps Transform UI in `ViewportOverlayToolPanel`.
  - uses `ParaSlider` and `ParaSelect` inside the panel body.
  - keeps Transform-specific state and behavior outside the shell.
- `src/app/components/ViewportOverlay.tsx`
  - uses `ViewportOverlayToolPanel` for Sketch Plane tooling.
  - uses shared `ViewportOverlayToolPanel*` classes for Sketch Draw-style panel markup.
  - still owns sketch-specific placement, density, customization, and session logic locally.
- `src/app/components/ViewerHost.tsx`
  - owns `ExtrudeCommandToolbar` as a bespoke `section` with readout chips and OK/Cancel buttons.
  - does not consume `ViewportOverlayToolPanel` for Extrude yet.

#### Accepted Decision

`ViewportOverlayToolPanel` is the shell primitive for the first Extrude command-toolbar migration.

Transform and Sketch are precedents, not owners. Extrude should not copy `ReferenceTransformToolbar` or `ViewportOverlay` wholesale.

#### Verification Result

Passed by read-only source inspection. No runtime verification was needed because this phase only locks the shell-owner read.

## [x] `VCTS - 1 / Phase 2` - `Extrude Shell Prep Contract`

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

### Phase 2 Dispatch Packet

#### Scope

Define the shell/body contract that `Extrude-9` should consume when the active Extrude command toolbar moves from a bespoke readout strip to a real control panel.

#### Exclusions

- no Extrude node param implementation
- no ParaSlider or ParaSelect design changes
- no accept/cancel graph rollback changes
- no broad command-toolbar wrapper extraction before proof

#### Accepted Shell Contract

Initial Extrude migration stack:

```text
ViewerHost
  -> ViewportOverlayToolPanel
    -> Extrude command toolbar body
      -> Extrude control VM
        -> live Geometry/Extrude node params
```

Shell owns:
- panel title and optional title meta
- action placement convention
- body container and section layout
- optional resize/drag affordances only when adopted from the existing overlay panel behavior

Extrude body owns:
- profile summary and re-pick affordance
- ParaSlider/ParaSelect control rows
- row visibility and disabled/driven state from the Extrude control VM
- OK/Cancel command actions when those actions are command-specific

Spaghetti/Extrude owns:
- live `Geometry/Extrude` node params
- graph writes
- preview semantics
- accept/cancel rollback
- edit-history shape

#### First Extrude Body Slots

The first Extrude command toolbar should reserve:
- title: `Extrude`
- title meta or status: active step / selected profile count
- profile summary/action row
- `Type` ParaSelect
- `Direction` ParaSelect
- `Depth` ParaSlider for one-sided direction
- `Start Depth` and `End Depth` ParaSliders for two-sided direction
- `Taper Angle` ParaSlider when supported
- `Output` ParaSelect
- OK/Cancel action area

#### Verification Result

Passed by comparing the desired Extrude slots against the current `ViewerHost` toolbar and the existing Transform/Sketch overlay panel usage. Runtime implementation remains deferred to `Extrude-9`.

## [x] `VCTS - 1 / Phase 3` - `Post-Extrude Toolbar Shell Cleanup Route`

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

### Phase 3 Dispatch Packet

#### Scope

Route later Sketch/Transform cleanup without blocking the first Extrude migration.

#### Exclusions

- no Sketch migration before Extrude proves the shell pattern
- no Transform rewrite before repeated command-panel chrome is proven
- no generic command-toolbar wrapper until there is actual duplication to extract

#### Accepted Cleanup Route

After `Extrude-9` lands, compare the implemented Extrude panel against:
- `ReferenceTransformToolbar` direct `ViewportOverlayToolPanel` usage
- `ViewportOverlay` Sketch Plane `ViewportOverlayToolPanel` usage
- Sketch Draw class-compatible panel markup

Create a follow-on only if the comparison shows repeated command-toolbar chrome worth extracting.

Possible follow-on:
- `VCTS - 2 - Command Toolbar Wrapper Extraction`

That follow-on should consider a small wrapper around `ViewportOverlayToolPanel` for:
- default command title/action layout
- shared command body section stack defaults
- common OK/Cancel placement only when command actions really align
- shared fixed/drag/resize policy after Extrude validates the need

The follow-on must not merge:
- Sketch session behavior
- Transform target/gizmo behavior
- Extrude node-param control logic
- graph writes, preview, or history behavior

#### Verification Result

Passed by deferring cleanup until after Extrude provides implementation proof. No new follow-on doc was created because the next legal action remains `Extrude-9`, not a premature wrapper extraction.
