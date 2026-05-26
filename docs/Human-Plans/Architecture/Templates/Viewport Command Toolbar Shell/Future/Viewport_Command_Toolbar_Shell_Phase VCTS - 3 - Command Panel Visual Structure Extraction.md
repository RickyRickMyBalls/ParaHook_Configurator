# `VCTS - 3` - `Command Panel Visual Structure Extraction`

## Doc Header

### Doc History
2. 2026-05-25 20:03:04: Implemented and accepted `VCTS - 3` through the Dispatch 5 manager loop by adding shared command-panel visual grammar pieces, migrating Extrude's active toolbar body/actions/readbacks onto them, preserving command behavior, and documenting the future-toolbar visual setup route.
1. 2026-05-25 19:51:44: Added this future phase doc to plan the shared command-panel visual grammar extraction after `VCTS - 2` unified floating drag/resize behavior but left Extrude's inner toolbar body visually different from Sketch and Transform.

### Purpose

Use this doc as the implementation-planning surface for making the viewport command-toolbar template shell own more of the visible panel grammar.

The user-facing goal is:
- make Extrude's toolbar feel like the same family as Sketch and Transform
- make the template shell define body rhythm, section framing, title actions, status/readback strips, and control grouping
- stop each command toolbar from inventing its own inner dashboard style
- keep command-specific controls and command semantics feature-owned

### Scope

This phase covers:
- shared command-panel body layout
- shared section/chapter structure
- shared section headers and labels
- shared title action button variants
- shared command status/readback rows
- shared control grouping conventions for ParaSlider and ParaSelect rows
- Extrude as the first migration target for the extracted visual grammar

This phase does not cover:
- detached/floating Model Viewport app-window behavior
- command drag/resize math already owned by `VCTS - 2`
- changing Extrude graph semantics, preview, accept/cancel, or node-param ownership
- redesigning `ParaSlider` or `ParaSelect`
- forcing Sketch and Transform runtime rewrites before the extracted grammar proves itself on Extrude

### Current Code-Backed Read

Current visual read:
- `src/app/components/ViewportOverlayToolPanel.tsx`
  - owns the outer shared shell: frame, title bar, title/action/body slots, i-menu surface, resize handles
  - does not currently own reusable command-body grammar beyond basic shell slots and section utilities
- `src/app/components/ReferenceTransformToolbar.tsx`
  - has the strongest command-panel grammar today: padded scrollable body, framed sections, section headers, status strip, title actions, and grouped channel boxes
  - still expresses much of that grammar through `ReferenceTransformToolbar*` classes
- `src/app/components/ViewportOverlay.tsx`
  - Sketch Plane and Sketch Draw/Review use similar section rhythm, labels, and accent-driven framing
  - some Sketch structure is mixed with command/session-specific UI and should be extracted carefully
- `src/app/components/ViewerHost.tsx`
  - Extrude uses the shared shell and floating behavior, but its body still uses bespoke stat tiles, wide select grid, and custom OK/Cancel buttons
  - visually reads less like the Sketch/Transform family even though it now uses the same outer shell behavior

### Boundary Rules

- `ViewportOverlayToolPanel` should remain the visual outer shell.
- A new shared visual-grammar layer may sit next to `ViewportOverlayToolPanel` as small components or shared classes.
- Feature families should continue to own command-specific controls, graph writes, preview, accept/cancel, history, and validation.
- Do not merge Sketch, Transform, and Extrude command bodies into one feature component.
- Do not make the visual-grammar layer depend on Spaghetti, Sketch, Transform, Viewer, or graph stores.

## Doc Body

### Summary

`VCTS - 3` is the command-panel visual grammar extraction lane.

`VCTS - 1` locked `ViewportOverlayToolPanel` as the in-viewport command-toolbar shell. `Extrude-9` moved Extrude onto that shell with node-backed ParaSlider and ParaSelect controls. `VCTS - 2` extracted floating behavior so Extrude and Transform now share drag, resize, placement, and bounds behavior.

The remaining mismatch is visual structure. Extrude has the correct outer shell and behavior, but its body still feels like a custom dashboard instead of a command panel from the same Sketch/Transform family.

Locked recommendation:
- keep `ViewportOverlayToolPanel` as the outer shell
- extract reusable command-panel visual grammar beside it
- migrate Extrude first so its body uses shared body, section, title-action, status, and control grouping rules
- then decide whether Transform and Sketch should adopt the new helper components directly or keep their existing classes as compatible shell-family skins

### Likely Shared API Shape

Preferred first cut:
- add small components or utilities near `ViewportOverlayToolPanel`

Likely components:
- `ViewportCommandPanelBody`
- `ViewportCommandPanelSection`
- `ViewportCommandPanelSectionHeader`
- `ViewportCommandPanelSectionBody`
- `ViewportCommandPanelStatusRow`
- `ViewportCommandPanelTitleButton`
- optional `ViewportCommandPanelControlStack`

Likely inputs:
- `label`
- `accent`
- `collapsible`
- `expanded`
- `titleActions`
- `variant`
- `disabled`

The first implementation should prefer thin shared components and classes over a large new abstraction.

## Wishlist Organization

### High Level Goals

- [x] `VCTS-Gen1-HLG-5. Extrude should visually read as the same viewport command-panel family as Sketch and Transform.`
- [x] `VCTS-Gen1-HLG-6. The template shell should own command-panel visual grammar, not only outer frame and drag/resize behavior.`
- [x] `VCTS-Gen1-HLG-7. Future command toolbars should start from shared body, section, title-action, status, and control grouping pieces.`
- [x] `VCTS-Gen1-HLG-8. Feature-specific command state and graph semantics should stay outside the visual grammar layer.`

### Codex Level Goals

- [x] CLG 1. Audit Sketch, Transform, and Extrude visual grammar and identify extractable shared parts.
- [x] CLG 2. Add a shared command-panel body and section grammar beside `ViewportOverlayToolPanel`.
- [x] CLG 3. Add shared title action and command status/readback row patterns.
- [x] CLG 4. Migrate Extrude to the shared visual grammar while preserving `Extrude-9` command behavior and `VCTS - 2` floating behavior.
- [x] CLG 5. Document the visual grammar recipe for future command toolbars.

### `VCTS - 3 / Phase 1`

- [x] `HLG 5. Extrude should visually read as the same viewport command-panel family as Sketch and Transform.`
- [x] `HLG 6. The template shell should own command-panel visual grammar, not only outer frame and drag/resize behavior.`
- audit the current Sketch, Transform, and Extrude panel structures
- identify which styles are shell grammar versus feature-specific presentation
- lock the first extraction boundary

### `VCTS - 3 / Phase 2`

- [x] `HLG 6. The template shell should own command-panel visual grammar, not only outer frame and drag/resize behavior.`
- [x] `HLG 7. Future command toolbars should start from shared body, section, title-action, status, and control grouping pieces.`
- add shared command-panel body, section, header, status, and title-action pieces
- keep the pieces store-agnostic and feature-agnostic
- preserve `ViewportOverlayToolPanel` as the outer shell

### `VCTS - 3 / Phase 3`

- [x] `HLG 5. Extrude should visually read as the same viewport command-panel family as Sketch and Transform.`
- [x] `HLG 8. Feature-specific command state and graph semantics should stay outside the visual grammar layer.`
- migrate Extrude's toolbar body to the shared visual grammar
- replace bespoke stat tiles and loose grid layout with shared status/readback and section framing
- preserve live node writes, preview, OK/Cancel, and active command validation

### `VCTS - 3 / Phase 4`

- [x] `HLG 7. Future command toolbars should start from shared body, section, title-action, status, and control grouping pieces.`
- [x] `HLG 8. Feature-specific command state and graph semantics should stay outside the visual grammar layer.`
- document the future-toolbar visual setup recipe
- add focused tests or snapshots that protect the shared grammar hooks where practical
- route any Transform/Sketch cleanup into follow-on work if direct migration is too broad

## [x] `VCTS - 3 / Phase 1` - `Visual Grammar Owner Audit`

### Phase 1 Summary

#### Purpose

Decide what the template shell should visually own before extracting new components or classes.

#### Owns

- comparing Sketch Plane, Sketch Draw/Review, Transform, and Extrude panel body structures
- classifying shared shell grammar versus command-specific UI
- naming the first shared visual pieces
- deciding whether the first extraction should be components, CSS classes, or both

#### Does Not Own

- runtime implementation
- changing Extrude behavior
- changing Transform or Sketch behavior

### Phase 1 Implementation Spec

1. Inspect `ReferenceTransformToolbar.tsx` and its CSS for reusable body, section, header, action, status, and channel-box grammar.
2. Inspect `ViewportOverlay.tsx` and its CSS for Sketch section rhythm, labels, accent use, and command-state readbacks.
3. Inspect `ViewerHost.tsx` and Extrude CSS for current bespoke body/stat/control layout.
4. Write an owner map naming the first shared visual grammar pieces.
5. Mark any UI that should remain feature-specific.

### Verification Shape

- no runtime build required unless formatting tooling is run
- owner map names exact seams and target shared pieces

### Done Shape

The extraction boundary is clear enough that Phase 2 can implement without turning the shell into a feature-specific component.

### Accepted Read

The shared grammar boundary is locked: the template layer owns reusable body stack, framed sections, section headers, title buttons, status/readback rows, and control stacks; feature components keep command state, graph writes, preview, validation, and command-specific control choices.

## [x] `VCTS - 3 / Phase 2` - `Shared Command Panel Grammar Pieces`

### Phase 2 Summary

#### Purpose

Create the reusable visual grammar pieces that make command-panel bodies look like one family.

#### Owns

- shared body stack and scroll rules
- shared section/chapter framing
- shared section headers and labels
- shared command status/readback row
- shared title action button variants
- shared control stack/grouping classes

#### Does Not Own

- command-specific control definitions
- graph store writes
- preview and accept/cancel semantics
- drag/resize behavior already owned by `useViewportFloatingToolPanel`

### Phase 2 Implementation Spec

1. Add shared grammar components or classes beside `ViewportOverlayToolPanel`.
2. Keep the new layer store-agnostic.
3. Reuse existing shell CSS variables for accent, background, text alpha, borders, and focus states.
4. Prefer a small first cut that Extrude can consume directly.
5. Add focused tests for any exported component behavior if the pieces include logic.

### Verification Shape

- TypeScript proof if components are added
- focused component tests if markup behavior is nontrivial
- CSS should keep text inside controls and avoid layout overlap

### Done Shape

A command toolbar can render a body, sections, title buttons, and status/readback rows without copying Transform-only or Sketch-only classes.

### Accepted Read

`ViewportOverlayToolPanel.tsx` now exports shared visual grammar pieces: `ViewportCommandPanelBody`, `ViewportCommandPanelSection`, `ViewportCommandPanelStatusRow`, `ViewportCommandPanelReadout`, `ViewportCommandPanelControlStack`, and `ViewportCommandPanelTitleButton`.

## [x] `VCTS - 3 / Phase 3` - `Extrude Visual Grammar Migration`

### Phase 3 Summary

#### Purpose

Make Extrude's toolbar body look like it belongs to the same command-panel family as Sketch and Transform.

#### Owns

- replacing Extrude's bespoke stat tiles with shared readback/status rows
- replacing loose grid layout with shared section/control grouping
- applying shared title action button variants to OK/Cancel
- preserving all command behavior from `Extrude-9` and floating behavior from `VCTS - 2`

#### Does Not Own

- changing Extrude node parameter names
- changing accepted geometry behavior
- changing profile selection logic
- changing ParaSlider or ParaSelect internals

### Phase 3 Implementation Spec

1. Keep `ExtrudeCommandToolbar` on `ViewportOverlayToolPanel` and `useViewportFloatingToolPanel`.
2. Move the Extrude body into the shared command-panel body component or classes.
3. Add sections for command status, type/direction/output, and depth/taper controls.
4. Use shared title action button variants for OK and Cancel.
5. Preserve existing focused Extrude toolbar tests and add visual-structure assertions where practical.

### Verification Shape

- focused Extrude toolbar tests pass
- active Extrude toolbar still renders profile count and operation readback
- OK/Cancel still work
- live node-backed controls still write params
- production build passes

### Done Shape

Extrude no longer visually reads as a separate dashboard inside the command shell.

### Accepted Read

The active Extrude command toolbar now uses shared body, section, status/readback, control stack, and title button grammar. Its default floating size is narrower and more vertical so its layout rhythm aligns better with Sketch and Transform command panels.

## [x] `VCTS - 3 / Phase 4` - `Future Toolbar Visual Recipe And Follow-On Routing`

### Phase 4 Summary

#### Purpose

Make the extracted visual grammar reusable for the next viewport command toolbar and route remaining cleanup honestly.

#### Owns

- documenting the future-toolbar visual setup recipe
- naming which shared pieces new command panels should use by default
- deciding whether Transform and Sketch should migrate immediately or through follow-on phases
- recording any remaining mismatch as follow-on work instead of silently treating it as done

#### Does Not Own

- broad Sketch session shell rewrite
- broad Transform body refactor
- new CAD command toolbar implementation

### Phase 4 Implementation Spec

1. Update the VCTS family index with the visual grammar recipe.
2. Link future command toolbar planning to the shared body/section/status/title-action pieces.
3. If Transform or Sketch still use local grammar classes, identify whether they are compatible skins or follow-on cleanup targets.
4. Add a follow-on phase doc only if the remaining mismatch is too broad to fit safely in `VCTS - 3`.

### Verification Shape

- docs identify exact shared visual grammar pieces
- future toolbar setup does not point to copying Extrude, Sketch, or Transform bespoke CSS
- any uncompleted Sketch/Transform migration is explicitly routed

### Done Shape

The next viewport command toolbar has a clear visual setup path, and Extrude proves the shared grammar in runtime code.

### Accepted Read

Future command panels should start from `ViewportOverlayToolPanel`, `useViewportFloatingToolPanel`, and the `ViewportCommandPanel*` visual grammar components. Transform and Sketch remain behavior-stable in this packet and can migrate selectively later if their existing compatible skins need cleanup.
