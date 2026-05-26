# Build-Path-16 - Feature Edit Context Menu

## Doc Header

### Doc History
2. 2026-05-25 22:23:39: Implemented and closed `Build-Path-16 / Phases 1-2` with right-click `edit sketch` and `edit extrude` context menu actions on supported Build Path timeline/topology feature icons, canonical Sketch Draw and existing-node Extrude toolbar handoffs, focused tests, and production build proof.
1. 2026-05-25 22:09:52: Added this future Build Path phase to plan right-click feature edit menus on supported Build Path icons, starting with `edit sketch` and `edit extrude` handoffs back into Sketch Draw and the Extrude command toolbar.

### Purpose

This doc plans `Build-Path-16`.

Use it to answer:
- how Build Path icons expose a right-click edit menu
- how the first menu item should read for supported feature cards
- how `edit sketch` returns the user to Sketch Draw
- how `edit extrude` returns the user to the Extrude command toolbar for existing settings
- how Build Path stays a derived reader while handing off to the real feature authoring owners

Do not use it for:
- restore, replay, Branch From Here, Compare, Pin, or checkpoint execution
- making Build Path mutate graph truth directly
- rewriting accepted Build Path event history
- broad feature-stack context-menu design beyond the first edit handoff
- new Sketch Draw tools or new Extrude settings

## Doc Body

`Build-Path-16` is an interaction handoff phase for Build Path.

The user-facing goal is simple: right-clicking a Build Path feature icon should open a small menu whose first item says `edit <feature name>`. For example:
- right-click a Sketch card -> `edit sketch`
- right-click an Extrude card -> `edit extrude`

Choosing the item should not edit inside Build Path. It should take the user back to the owning authoring surface:
- Sketch cards should open or focus the graph document/node and enter Sketch Draw.
- Extrude cards should open or focus the graph document/node and bring back the Extrude command toolbar against the existing Extrude node settings.

The important architecture boundary:
- Build Path owns the derived timeline icon and the handoff affordance
- Spaghetti/feature command owners still own graph params, wires, Sketch Draw state, Extrude session state, preview behavior, accept/cancel, and edit history commits

This keeps Build Path useful as a navigation surface without turning it into a shadow graph editor.

## Vision

Build Path should feel like a readable construction timeline that can also help the user get back to the exact feature they want to change.

The right-click menu should be quiet and specific:
- it appears only on cards that have a real editable feature owner
- its first action uses plain feature language
- it should not offer fake edit behavior for lifecycle cards, output sinks, or unsupported future card kinds
- it should preserve scrub/playhead state unless the existing authoring handoff intentionally changes the active graph/editor focus

This phase advances Generation 1 by making the existing Build Path icon strip more useful as a graph-native CAD workflow surface while preserving the rule that graph-authored truth stays outside Build Path.

## Wishlist Organization

### High Level Goals

- [x] `Build-Path-Gen1-HLG-7. Build Path should stay derived from graph and accepted build truth instead of becoming a second authored graph or a second undo stack.`
- [x] `Build-Path-Gen1-HLG-10. Build Path icons should offer a right-click edit menu that can return the user to the owning feature authoring surface, such as Sketch Draw or the Extrude command toolbar.`

### Codex Level Goals

- [x] Build-Path-Gen1-CLG-17. Add Build Path icon context-menu edit actions that route Sketch and Extrude events through canonical workspace intents back to their owning authoring surfaces without adding Build Path-owned graph mutation.

### `Build-Path-16 / Phase 1`

- [x] Add a context-menu state and shared menu rendering path for Build Path feature cards.
- [x] Show `edit sketch` as the first item for Sketch timeline/topology cards.
- [x] Show `edit extrude` as the first item for Extrude timeline/topology cards.
- [x] Do not show fake edit actions for graph lifecycle cards or output/sink cards.
- [x] Preserve existing click-to-scrub and branch-local card selection behavior.
- [x] `Build-Path-Gen1-HLG-7`
- [x] `Build-Path-Gen1-HLG-10`

### `Build-Path-16 / Phase 2`

- [x] Route `edit sketch` through the canonical Sketch Draw workspace intent for the card's graph document and graph node id.
- [x] Add or reuse an explicit `edit extrude` workspace intent that selects the existing Extrude node and starts the command toolbar in existing-node mode.
- [x] Preload existing Extrude profile sources and current depth/settings where the live command session already supports them.
- [x] Keep Build Path event order, selected scrub position, graph truth, and Edit History boundaries stable through the handoff.
- [x] `Build-Path-Gen1-HLG-7`
- [x] `Build-Path-Gen1-HLG-10`

## [x] `Build-Path-16 / Phase 1` - `Feature Icon Context Menu`

### Phase 1 Summary

Add the visible right-click menu affordance to supported Build Path feature cards without wiring feature edit execution yet.

#### Purpose

This phase proves the context-menu surface and labels.

#### Owns

- context-menu state local to Build Path surface rendering
- right-click handling for supported timeline feature buttons
- right-click handling for supported Parallel topology feature cards
- first menu item labels:
  - `edit sketch`
  - `edit extrude`
- no-action behavior for lifecycle cards and output/sink cards
- preservation of existing left-click scrub and topology selection behavior

#### Does Not Own

- executing the edit handoff
- Extrude existing-node session prefill
- Sketch Draw command entry
- graph mutation
- Edit History commits

### Phase 1 Implementation Spec

#### Exact First Code Cut

- Reuse the existing `SpaghettiContextMenu` component for Build Path menu rendering.
- Add a Build Path menu state that stores pointer coordinates plus the target timeline/topology card metadata.
- Add a small helper that returns supported edit menu items from a Build Path build-event step.
- Render no menu items for lifecycle cards, graph-created, graph-loaded, output-preview sinks, or unknown icons.
- Keep the existing left-click handlers intact.

#### Likely Files

- `src/app/buildPath/BuildPathSurface.tsx`
- `src/app/buildPath/BuildPathSurface.test.tsx`

#### No-Widening Rule

Do not add execution behavior in Phase 1. The first pass only proves the menu opens with truthful actions for supported cards.

#### Verification Shape

- right-click Sketch timeline card opens a menu containing `edit sketch`
- right-click Extrude timeline card opens a menu containing `edit extrude`
- lifecycle cards do not expose fake edit actions
- existing click-to-scrub behavior still works
- focused Build Path surface tests

#### Done Shape

The Build Path icon strip and workspace Parallel cards can show a truthful edit menu for supported feature cards without changing graph or scrub behavior.

## [x] `Build-Path-16 / Phase 2` - `Edit Handoff Execution`

### Phase 2 Summary

Wire the menu actions to real feature authoring owners.

#### Purpose

This phase makes `edit sketch` and `edit extrude` usable.

#### Owns

- `edit sketch` action execution through the canonical Sketch Draw workspace intent
- an explicit existing-node Extrude edit intent if no suitable intent already exists
- graph document and node targeting from Build Path event metadata
- existing Extrude node selection before starting the command toolbar
- best-effort prefill of existing Extrude profile sources and depth/settings through the existing command-session model
- tests proving Build Path stays a handoff surface

#### Does Not Own

- new Sketch Draw tools
- new Extrude settings
- broader feature-stack editing
- restore/replay behavior
- Build Path event mutation
- output/sink editing

### Phase 2 Implementation Spec

#### Exact First Code Cut

- Use Build Path build-event metadata to identify the owning graph document id and first affected graph node id.
- For Sketch events, call the existing Sketch Draw workspace intent with that graph document id and node id.
- For Extrude events, add a small workspace intent that:
  - activates the graph node
  - selects the Extrude node
  - starts the Extrude command session in existing-node reuse mode
  - reads current profile edges and depth/settings so the toolbar opens against the existing definition when practical
- Close the context menu after a successful action.

#### Likely Files

- `src/app/buildPath/BuildPathSurface.tsx`
- `src/app/store/workspaceIntents.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/buildPath/BuildPathSurface.test.tsx`
- `src/app/store/workspaceIntents.test.ts`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`

#### No-Widening Rule

Do not make Build Path own feature editing. The menu should only route to the existing feature/session owners.

#### Verification Shape

- choosing `edit sketch` starts Sketch Draw for the card's graph document and sketch node
- choosing `edit extrude` opens the Extrude command toolbar for the existing Extrude node
- Extrude handoff preserves existing depth/profile state where supported
- Build Path selected timeline step and event order do not change just because edit was chosen
- graph truth changes only through the subsequent feature command accept/cancel path, not menu opening itself
- focused tests plus TypeScript/build verification for implementation work

#### Done Shape

Right-clicking supported Build Path icons gives users a direct return path into the owning Sketch or Extrude authoring workflow while Build Path remains a derived timeline/navigation surface.

## Manager Packet

Assignment: `Build-Path-16 - Feature Edit Context Menu`.

Scope:
- add a right-click menu to supported Build Path feature icons
- make the first item `edit <feature name>`
- wire Sketch and Extrude cards back into their owning authoring workflows
- keep Build Path graph-safe and read-derived

Exclusions:
- no restore/replay
- no branch/compare/pin execution
- no graph mutation from the menu itself
- no output/sink edit behavior
- no broad feature-stack context menu

Build gate:
- [x] focused Build Path context-menu tests
- [x] focused Sketch/Extrude handoff tests
- [x] `npm.cmd test -- --run src/app/buildPath/BuildPathSurface.test.tsx`
- [x] `npm.cmd test -- --run src/app/store/workspaceIntents.test.ts`
- [x] `npm.cmd run build` for runtime/style changes

Stop condition:
- supported Sketch and Extrude Build Path icons expose a right-click edit menu and can hand the user back to Sketch Draw or the Extrude command toolbar without changing Build Path event truth.
