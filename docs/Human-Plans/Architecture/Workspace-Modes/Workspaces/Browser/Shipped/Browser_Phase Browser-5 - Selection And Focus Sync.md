# Browser Phase Browser-5 - Selection And Focus Sync

## Doc Header

### Doc History
5. 2026-03-25 10:16: Refreshed this shipped Browser-5 record after Browser-5.2 landed, so the phase now points at the shipped grouped parent-selection follow-through as completed Browser-5.x work and leaves `Browser-5.3` as the next open content/reference selection-to-console follow-on
4. 2026-03-25 09:44: Refreshed this shipped Browser-5 record after Browser-5.1 landed, so the phase now points at the shipped reference-selection cleanup as completed follow-through and leaves only the later grouped parent-selection growth as open Browser-5.x work
3. 2026-03-25 02:50: Marked Browser-5 shipped after the selection/focus sync work landed in code, moved this phase record into `Shipped/`, and aligned the doc wording with the delivered viewport-to-Browser follow, empty-space deselect, and stale-selection cleanup behavior
2. 2026-03-25 02:26: Turned this Browser-5 phase doc into an implementation-ready selection/focus spec by locking shared target ownership, Browser/content subtree selection, Viewer-to-Browser follow behavior, console-context sync rules, deselection behavior, editor-focus routing boundaries, and the immediate Browser-5.1 grouped-selection follow-up
1. 2026-03-24 13:11: Created this standalone future Browser phase doc so the later Browser/viewer/graph selection-and-focus cleanup now has its own planning home under `Browser/Future/` instead of remaining only as a Browser family bullet

### Purpose

This phase makes Browser selection and focus behave like one coherent workspace system.

Use it to answer:
- how Browser selection should map to workspace targets
- how viewer highlight, graph focus, and console context should align
- where Browser-local selection should stop and shared target truth should begin

## Doc Body

## [x] Browser-5 - Selection And Focus Sync

### Summary

This phase makes Browser selection, Viewer highlight, Console context, and Graph/editor focus read one coherent shared target model instead of behaving like loosely coupled local surfaces.

Phase outcome:
- Browser target-bearing rows update shared workspace target truth
- Viewer selection follows that same target truth where a real model target exists
- Browser follows Viewer selection when a clean row match exists
- Console context sync follows the selected target to the nearest valid command layer
- stronger editor-focus routing remains intentional and row-family dependent
- deselection becomes explicit and predictable

This phase does not yet ship the later grouped/additive multi-select work.

### Shipped Result

The first shipped Browser-5 cut landed the shared selection/follow groundwork:
- viewport part picks now resolve back into shared workspace selection and matching Browser content rows
- viewport reference picks now resolve back into shared workspace selection and matching Browser reference rows
- empty viewport clicks clear lightweight content/model selection
- empty Browser clicks clear Browser row selection
- Browser selected-row resolution no longer hangs onto stale local selection when the viewer becomes the active surface with no selected target

The later `Browser-5.1` reference-selection cleanup is now shipped.

Browser-5 now also carries shipped follow-through from:
- `Browser-5.2 - Implicit Parent Multi-Selection`

Browser-5.2 delivered:
- one primary root target plus a resolved grouped content-selection set
- immediate grouped viewport highlight for assembly/component subtree selection
- softer grouped Browser child-row highlight beneath the stronger selected root row

The next open Browser-5.x follow-up is:
- `Browser-5.3`
  - content/reference selection to console-context integration

### Owns

- shared workspace-target selection from Browser rows
- Browser-to-Viewer selection sync
- Viewer-to-Browser follow behavior
- Browser-to-Console context sync
- Browser-to-Graph/editor focus-routing rules
- deselection rules
- selected-target versus focused-editor disagreement rules

### Does Not Own

- Browser build-policy behavior
- Worker/build execution semantics
- final BrowserPanel decomposition
- full explicit additive multi-select
- marquee/lasso selection tools

### Public Interfaces And State

This phase should treat `workspaceSelection.selectedTarget` as the shared selection truth for Browser selection, Viewer selection, and Console-context routing.

Required target families in scope:
- `assembly`
- `component`
- `object`
- `graph-document`
- `graph-node`
- `reference-item`
- existing `part` support where still needed for direct viewer/gizmo targeting

The phase should preserve the split between:
- lightweight target selection
- stronger editor/focus/open routing

That means:
- selection updates shared target truth immediately
- focus/open remains a stronger action owned by row family and gesture

### Locked Selection Model

#### 1. Browser target ownership

Target-bearing rows must update shared workspace target truth.

Content rows are real model-selection targets:
- `Assembly` selects the assembly target
- `Component` selects the component target
- `Object` selects the object target

Graph/authoring rows are real authoring-context targets:
- `Graph` selects the graph context
- `Graph node` selects the node context
- `Sketch` selects the sketch authoring context through its graph-node target

Only structural/container rows with no real authored or model target may remain Browser-local.

#### 2. Viewer follow behavior

Viewer selection should mirror into Browser selection when a clear matching Browser row exists.

Fusion-style rule:
- if the Viewer selects a stable target-bearing item the Browser can represent honestly, the Browser should follow it
- do not fabricate fake Browser follow for row families that still lack a clean one-to-one mapping

#### 3. Console context sync

Browser selection should eventually be able to drive Console context for every meaningful row family.

Current concrete priority:
- `Graph Documents`
- graph nodes
- sketches

Direction for content rows:
- content rows should later gain real object/assembly command contexts such as:
  - `Move`
  - `Rotate`
  - `Scale`
  - `Material`
  - `Export`
  - later CAD operations such as `Shell`, `Explode To Faces`, and boolean-related commands

Execution rule for Browser-5:
- move the console to the nearest valid command scope for the selected target
- do not fabricate noisy placeholder context for row families that do not yet have a real command layer

#### 4. Selection versus focus

Selection is lightweight:
- sets shared workspace target truth
- updates Browser selected row
- updates Viewer highlight or selection-follow state where applicable
- may request Console-context sync where a real command layer exists

Focus/open is stronger:
- brings the owning editor/authoring surface forward
- may swap/open graph editors
- may fit/focus graph-node surfaces
- remains row-family dependent and gesture dependent

#### 5. Disagreement between selected target and active editor

Single-selecting a different Browser item always re-targets the workspace selection immediately.

That means:
- Browser selected row changes immediately
- viewport highlight/selection-follow changes immediately
- other lightweight target-follow surfaces change immediately

But stronger editor-focus routing remains intentional:
- authoring-context rows may move active graph/editor focus when that row family owns focus/open behavior
- content rows do not automatically yank the user into a different graph editor just because the selected object belongs to another graph

#### 6. Deselect behavior

Primary deselect path:
- empty model-viewport click clears the current lightweight model/content selection
- empty Browser click clears the current Browser row selection

Replacement rule:
- selecting a different target replaces the old one unless later explicit multi-select is active

`Esc` rule:
- `Esc` is only a backup clear path when no active tool/session already owns it for cancel/exit behavior

### Row-Family Behavior

#### Content rows

Single-click:
- set shared workspace target
- update Browser selection
- update viewport selection/highlight
- do not directly trigger build behavior
- do not automatically steal graph-editor focus

Double-click:
- can later grow stronger content-focused actions if needed
- this phase does not require inventing a fake stronger action for every content row

#### Graph rows

Single-click:
- select graph context
- update Browser selection
- update shared target
- request Console-context sync to the nearest valid graph command layer

Double-click:
- strong open/focus gesture
- may open/focus the graph editor

#### Graph node / sketch rows

Single-click:
- select authoring context
- update shared target
- sync Console context to nearest valid node/sketch command layer

Double-click:
- stronger open/focus gesture
- may open/focus the owning graph editor and fit/focus the node

#### Reference rows

This phase keeps reference rows under the same shared-target model where mapping is honest, while allowing stronger transform/open behavior to remain family-specific.

### Browser-5.1 Shipped Follow-Through

Browser-5 now explicitly carries shipped follow-through from:
- `Browser-5.1 - Reference Selection Cleanup`

Browser-5.1 delivered:
- reference-selection cleanup and parity
- plain reference selection staying lightweight and distinct from stronger transform/open actions
- reference Browser/Viewer follow cleanup where selection behavior previously still felt pieced together

### Browser-5.2 Shipped Follow-Through

Browser-5 now explicitly carries shipped follow-through from:
- `Browser-5.2 - Implicit Parent Multi-Selection`

Browser-5.2 delivered:
- implicit grouped selection from parent content rows
- one primary root target plus a resolved grouped descendant selection set
- immediate grouped viewport highlight and softer grouped Browser descendant-row highlight

Locked direction:
- selecting an `Assembly` should resolve to a multi-selection of its selectable descendants
- selecting a `Component` should resolve to a multi-selection of its selectable descendants
- selecting an `Object` should resolve to itself

This is not the same as later explicit additive multi-select.

Later explicit multi-select remains a separate phase for:
- `Ctrl` add/remove behavior
- marquee/lasso
- mixed manual selection sets

### Required File Targets

Expected implementation seam owners:
- `src/app/panels/BrowserPanel.tsx`
- `src/app/components/ViewerHost.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/store/workspaceIntents.ts`
- `src/app/console/ConsoleDock.tsx`
- Viewer-side selection bridge files where Browser/Viewer follow behavior is finalized

### Test Plan

Required Browser-5 verification:

- Browser content-row single-click updates shared workspace target for:
  - `assembly`
  - `component`
  - `object`
- Browser graph/graph-node/sketch single-click updates shared workspace target and requests the correct Console-context sync
- Browser content-row single-click does not force a graph-editor swap/open when the selected content belongs to a different graph
- Browser graph-row and node/sketch double-click still perform the stronger open/focus action
- Viewer selection mirrors into Browser selection when a clear matching row exists
- empty model-viewport click clears lightweight selection
- empty Browser click clears Browser row selection
- `Esc` does not steal cancel/exit ownership from active tool/session flows

### Assumptions

- Browser-5 builds on the already-landed content-row target/highlight groundwork.
- Browser-5 does not need to solve full additive multi-select to be valid.
- Content rows may become true command-bearing console contexts later even if the first concrete sync surfaces are graph/sketch-oriented today.
