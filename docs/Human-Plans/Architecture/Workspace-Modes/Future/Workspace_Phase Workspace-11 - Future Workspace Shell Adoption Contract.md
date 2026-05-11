# Workspace Phase Workspace-11 - Future Workspace Shell Adoption Contract

## Doc Header

### Doc History
1. 2026-05-11 15:55:21: Added this future `Workspace-11` planning doc to capture the standard shell-adoption contract for future workspace surfaces, making `ViewportFrame`, shared action eligibility, and catalog-owned host support the default path for viewport-type, presentation, pop-out, close, and later shell controls.

### Purpose

Use this phase to make future workspace surfaces inherit the same shared pane shell as existing workspaces by default.

The goal is that adding a future workspace does not require hand-coding another local titlebar, pop-out button, viewport-type button, close button, or future shared action. A new workspace should register its surface capabilities once, render its body through the shared slotted host, and receive the shared shell controls from the same `ViewportFrame` contract as Browser, Model Viewer, Console, Catalog, Properties, Settings, Dashboard, Notepad, and later surfaces.

### Scope

This phase covers:
- a shared workspace pane shell adoption contract for future surfaces
- a standard rule for which shell controls future surfaces inherit
- pop-out eligibility and placement standardization through shared metadata and action eligibility
- a small helper or normalized shell-action read if the current prop assembly remains too scattered
- documentation and proof that future surfaces can adopt the shell without per-surface chrome copies

This phase does not cover:
- implementing a specific new workspace surface
- popup-shell parity by itself unless it is already a tiny reuse of the same contract
- redesigning the whole titlebar visual language
- changing what existing surfaces can do unless needed to make the future-adoption rule honest
- new pop-out mutation semantics

## Doc Body

### Summary

`Workspace 11` is the future workspace shell-adoption contract.

It should make one rule explicit:
- future slotted workspace surfaces get the shared `ViewportFrame` shell by default

The shared shell should own:
- viewport-type `-`
- optional surface presentation controls adjacent to `-`
- pop-out arrow when the surface and slot are eligible
- split-pane `x` close control when the pane is eligible
- later shared shell controls added to the frame

Workspace surfaces should own:
- their body content
- their surface-specific internal behavior
- any surface-specific presentation control content passed into the shared shell

### Locked Direction

`Workspace 11` should be:
- a standardization and future-adoption lane
- a contract that makes new workspace surfaces cheaper and safer to add
- an extension of the existing `ViewportFrame`, `WorkspaceViewportTree`, `workspaceSurfaceCatalog`, and `workspaceSurfaceActionEligibility` seams
- a way to prevent new surface-local copies of shared shell buttons

`Workspace 11` should not be:
- a new workspace surface implementation
- another local titlebar pattern
- a separate pop-out architecture
- a replacement for the existing slot tree or host-mode owner paths
- a reason to widen `Workspace 10` while its current close-control phases are still active

### Current Live Read

Useful existing seams:
- `src/app/workspace/ViewportFrame.tsx` owns the main shared slotted pane shell.
- `src/app/workspace/WorkspaceViewportTree.tsx` wraps slotted surfaces in `ViewportFrame` and converts slot state into shell props.
- `src/app/workspace/workspaceSurfaceCatalog.ts` owns surface registration, labels, host support, and split support.
- `src/app/workspace/workspaceSurfaceActionEligibility.ts` owns shared action eligibility for split, viewport type, float, pop-out, and close.
- `src/app/workspace/workspaceViewportTypeChoices.ts` owns viewport-type menu labels and aliases from catalog truth.
- `src/app/workspace/ViewportSurfaceRegistry.tsx` routes non-model slotted surface bodies under the shared frame.

Current issue this phase preserves:
- `Workspace 10` is improving current shell controls, but a future surface can still accidentally bypass or duplicate shared shell behavior unless the adoption rule is written down and tested.

Likely implementation shape:
- a small normalized shell-action read, such as `getWorkspacePaneShellActions(...)`, may be useful if `WorkspaceViewportTree` keeps hand-assembling `canPopout`, `canClose`, viewport-type availability, and presentation-control placement.
- new workspace registration should usually be enough for basic shell adoption:
  - add the surface to `workspaceSurfaceCatalog.ts`
  - declare `supports.slotted`, `supports.popout`, `supports.split`, and other host support truth
  - render the surface body through `ViewportSurfaceRegistry`
  - pass only optional surface-specific presentation controls into the shared frame

### Acceptance Read

This phase counts as honest when:
- there is one documented adoption path for future slotted workspace surfaces
- pop-out availability for future workspaces comes from catalog support plus shared action eligibility
- future surfaces can receive shared frame controls without hand-coding their own titlebar buttons
- representative proof shows a newly registered or fixture surface can inherit shared shell controls through the catalog/registry path
- the rule is explicit about what belongs in `ViewportFrame` versus what belongs in a surface body
- popup/detached host chrome is either covered by the same contract or explicitly deferred without pretending it is solved

## Vision

The user-facing promise is:
- as more workspace types are added, they should feel like they belong to the same app shell
- shell actions should appear in predictable places without each surface needing a custom titlebar
- adding a future workspace should not mean remembering to copy `-`, pop-out, close, or later shared controls
- pop-out should become a capability declared by the surface and resolved by shared eligibility, not a one-off UI decision

What must stay true:
- shared workspace ownership stays in the slot tree and shell owner paths
- `ViewportFrame` remains the shared chrome owner for slotted panes
- individual workspace surfaces do not hand-code shared shell controls
- surface capability metadata stays in the catalog
- action availability stays in shared eligibility
- surface bodies stay focused on their own content and behavior

## Wishlist Organization

### High Level Goals
- [ ] `Workspace-11-HLG-1. Future workspaces should automatically use the same shared pane shell as existing workspaces.`
- [ ] `Workspace-11-HLG-2. Pop-out, close, viewport-type, and later shared controls should carry over through the shell instead of being copied into each workspace.`
- [ ] `Workspace-11-HLG-3. Future workspace registration should declare capabilities once and let the shell decide which buttons appear.`
- [ ] `Workspace-11-HLG-4. Surface-specific controls should stay adjacent and secondary without replacing shared shell navigation.`
- [ ] `Workspace-11-HLG-5. Popup and detached host parity should be explicit instead of quietly mixed into main slotted shell work.`

### Codex Level Goals
- [ ] CLG 1. Define one shell-adoption contract for future slotted workspace surfaces.
- [ ] CLG 2. Keep shared shell controls owned by `ViewportFrame`.
- [ ] CLG 3. Keep action availability driven by `workspaceSurfaceCatalog.ts` plus `workspaceSurfaceActionEligibility.ts`.
- [ ] CLG 4. Create or evaluate a normalized shell-action helper if direct prop assembly remains too scattered.
- [ ] CLG 5. Add proof that a future/fixture surface inherits shell controls without hand-coded body chrome.
- [ ] CLG 6. Explicitly defer popup/detached host parity if it is not tiny and identical.

### `Workspace-11 / Phase 1`

- [ ] Write down the future workspace shell-adoption contract in the Workspace-Modes planning surface.
- [ ] Identify the minimal metadata a future workspace must declare to inherit shell controls.
- [ ] `Workspace-11-HLG-1`
- [ ] `Workspace-11-HLG-2`
- [ ] `Workspace-11-HLG-3`
- [ ] CLG 1.
- [ ] CLG 2.
- [ ] CLG 3.

### `Workspace-11 / Phase 2`

- [ ] Implement or prove the normalized shell-action read if the current `WorkspaceViewportTree` prop assembly remains too spread out.
- [ ] Keep pop-out, close, viewport-type, and presentation-control placement on shared owner paths.
- [ ] Add fixture/future-surface proof for inherited shell controls.
- [ ] `Workspace-11-HLG-1`
- [ ] `Workspace-11-HLG-2`
- [ ] `Workspace-11-HLG-3`
- [ ] `Workspace-11-HLG-4`
- [ ] CLG 2.
- [ ] CLG 3.
- [ ] CLG 4.
- [ ] CLG 5.

### `Workspace-11 / Phase 3`

- [ ] Decide whether popup/detached host chrome can reuse the same shell contract or should remain a separate explicit parity lane.
- [ ] Close the future-adoption contract around what every new workspace gets automatically and what remains host-specific.
- [ ] `Workspace-11-HLG-2`
- [ ] `Workspace-11-HLG-5`
- [ ] CLG 5.
- [ ] CLG 6.

## [ ] `Workspace-11 / Phase 1` - `Future Surface Shell Contract`

### Phase 1 Summary

Create the explicit adoption contract for future workspace surfaces.

This phase should prove:
- future surfaces should enter the shared shell through the existing catalog, registry, eligibility, and frame seams
- shared shell controls belong to `ViewportFrame`
- future surfaces should not copy the `-`, pop-out arrow, split close `x`, or later shared controls into their body UI

### Phase 1 Implementation Spec

#### Purpose

Make the future workspace shell contract explicit before new surfaces are added.

#### Owns

- written shell adoption rules
- minimal future-surface registration expectations
- clear boundary between shared shell controls and surface-owned body controls

#### Does Not Own

- runtime code changes unless a tiny doc-reference helper is needed
- a specific new workspace surface
- popup parity implementation
- changing current surface behavior

#### First Code Cut

This first pass should:
- keep the work mostly documentation/planning
- add the contract to the Workspace-Modes planning surface
- point future implementers at `ViewportFrame`, `WorkspaceViewportTree`, `workspaceSurfaceCatalog`, `workspaceSurfaceActionEligibility`, `workspaceViewportTypeChoices`, and `ViewportSurfaceRegistry`
- state that a future workspace should inherit shared shell controls by registering capabilities rather than copying UI buttons

#### Likely Files

- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-11 - Future Workspace Shell Adoption Contract.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`
- `docs/Doc-Log.md`

#### No-Widening Rule

- Do not implement future workspace runtime behavior in Phase 1.
- Do not interrupt active `Workspace 10` implementation work.
- Do not treat popup parity as solved unless later code proves the same contract applies cleanly.

#### Checklist

- [ ] Create the `Workspace-11` future plan doc.
- [ ] Add `Workspace-11` to the Workspace-Modes index and future-doc list.
- [ ] Update `docs/Doc-Log.md`.

#### Verification Shape

- Documentation read-back only.

#### Done Shape

- `Workspace-11` exists as a future planning home for shared shell adoption by future workspaces.
- `Workspace 10` can continue without carrying this broader future-surface contract inside its current close-control phases.
