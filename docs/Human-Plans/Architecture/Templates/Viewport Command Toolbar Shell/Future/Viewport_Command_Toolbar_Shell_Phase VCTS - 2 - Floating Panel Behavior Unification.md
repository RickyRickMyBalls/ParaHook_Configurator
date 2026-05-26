# `VCTS - 2` - `Floating Panel Behavior Unification`

## Doc Header

### Doc History
2. 2026-05-25 19:32:34: Implemented and accepted `VCTS - 2` through the Dispatch 5 manager loop by adding the shared `useViewportFloatingToolPanel` behavior helper, moving Extrude and Transform onto it, preserving Sketch as a routed follow-on cleanup lane, and documenting the future-toolbar setup recipe.
1. 2026-05-25 16:48:47: Added this future phase doc to plan the shared drag, resize, placement, and future-toolbar setup behavior for in-viewport command panels after `Extrude-9` proved Extrude can consume the shared `ViewportOverlayToolPanel` shell visually.

### Purpose

Use this doc as the implementation-planning surface for making the shared viewport command-toolbar shell carry real floating-panel behavior.

The user-facing goal is:
- make the Extrude command toolbar's shell draggable
- make the Extrude command toolbar resizable from all edges and corners
- stop copying drag/resize math into each future toolbar
- make the next new viewport command toolbar start from a ready shared shell instead of a one-off panel

### Scope

This phase covers:
- shared in-viewport command panel drag behavior from the title bar
- shared in-viewport command panel resize behavior from all 8 directions
- viewport clamping, default position, default size, minimum size, and optional auto-height behavior
- first migration target: active Extrude command toolbar
- follow-on migration targets: Transform and Sketch shell behavior once the shared seam is proven
- reusable setup pattern for the next command toolbar

This phase does not cover:
- detached/floating app-window behavior such as floating the whole Model Viewport
- workspace dock/tiling/window mode behavior
- feature-specific toolbar controls, graph writes, preview, accept/cancel, or history
- redesigning `ParaSlider`, `ParaSelect`, Sketch tools, Transform controls, or Extrude controls

### Current Code-Backed Read

Current shell read:
- `src/app/components/ViewportOverlayToolPanel.tsx`
  - owns the shared visual panel shell, title bar, title action slots, body slot, i-menu surface, and resize-handle rendering
  - renders all 8 resize handles by default only when an `onResizeHandlePointerDown` handler is provided
  - does not currently own drag/resize state or viewport clamping math
- `src/app/components/ReferenceTransformToolbar.tsx`
  - uses `ViewportOverlayToolPanel`
  - owns its own toolbar position, size, title-bar drag, all-edge resize, and viewport clamping behavior locally
- `src/app/components/ViewportOverlay.tsx`
  - uses `ViewportOverlayToolPanel` directly for the Sketch Plane panel
  - uses a custom `ViewportOverlaySketchSessionWindow` shell for Sketch Draw/Review while borrowing the same `ViewportOverlayToolPanel*` classes and manually rendering all 8 resize handles
- `src/app/components/ViewerHost.tsx`
  - uses `ViewportOverlayToolPanel` for the active Extrude command toolbar after `Extrude-9`
  - currently keeps Extrude fixed at the bottom and passes no drag or resize behavior

### Boundary Rules

- `ViewportOverlayToolPanel` should stay the shared visual shell.
- Feature families should own toolbar body content and command behavior.
- Shared floating-panel behavior should own placement, dragging, resizing, bounds, defaults, and basic persistence hooks.
- Do not make `ViewportOverlayToolPanel` itself depend on Extrude, Sketch, Transform, Viewer, or Spaghetti stores.
- Do not route this through `Floating Window Shell`; this is in-viewport command-panel behavior.

## Doc Body

### Summary

`VCTS - 2` is the shell behavior unification lane.

`VCTS - 1` answered which shell family owns in-viewport command panels. `Extrude-9` proved Extrude can consume `ViewportOverlayToolPanel` for real command controls. The remaining shell gap is behavior: Transform and Sketch already have draggable/resizable command panels, but that behavior is still duplicated locally instead of being available as the default setup for any new viewport command toolbar.

Locked recommendation:
- keep `ViewportOverlayToolPanel` as the visual component
- extract shared drag/resize placement behavior into a small hook or wrapper next to the shell
- migrate Extrude first because it is currently the newest and simplest command toolbar
- migrate Transform after Extrude proves parity
- route Sketch custom session shell cleanup after the shared helper has survived both Extrude and Transform

### Likely Shared API Shape

Preferred first cut:
- add `useViewportFloatingToolPanel(...)`

Likely inputs:
- `defaultPosition`
- `defaultSize`
- `minSize`
- `viewportMargin`
- `heightMode`
- `panelRef`
- optional reset key

Likely outputs:
- `panelRef`
- `style`
- `onTitleBarPointerDown`
- `onTitleBarMouseDown`
- `onResizeHandlePointerDown`
- `setPosition`
- `setSize`
- `resetPlacement`

Optional later wrapper:
- `ViewportCommandToolPanelShell`

The hook should come first unless implementation shows wrapper duplication stays high after Extrude and Transform migrate.

## Vision

Viewport command toolbars should feel like one family of floating CAD command panels.

When the user starts Sketch, Transform, Extrude, or a later command, the panel should have predictable shell behavior: drag it by the title bar, resize it from an edge or corner, and keep it inside the viewport. The command body can differ by feature, but the floating-panel behavior should be a shared setup path instead of a fresh local implementation every time.

## Wishlist Organization

### High Level Goals

- [x] `VCTS-Gen1-HLG-1. Extrude's command toolbar shell should be draggable and resizable like Sketch and Transform.`
- [x] `VCTS-Gen1-HLG-2. Future viewport command toolbars should get drag and resize behavior by default instead of copying custom handlers.`
- [~] `VCTS-Gen1-HLG-3. Sketch, Transform, and Extrude should converge on one shared command-panel behavior pattern without merging their feature-specific command bodies.`
- [x] `VCTS-Gen1-HLG-4. The shell behavior should stay separate from detached/floating Model Viewport app-window behavior.`

### Codex Level Goals

- [x] CLG 1. Extract shared in-viewport panel placement, drag, resize, and bounds behavior from the mature Transform/Sketch implementations.
- [x] CLG 2. Migrate Extrude to the shared behavior first while preserving its `Extrude-9` node-backed toolbar body.
- [x] CLG 3. Prove the shared behavior supports all 8 resize directions, title-bar drag, viewport clamping, min dimensions, and auto/manual height.
- [x] CLG 4. Migrate or stage Transform and Sketch shell behavior cleanup without breaking their command-specific controls.
- [x] CLG 5. Document the future-toolbar setup recipe so new command panels start from the shared behavior seam.

### `VCTS - 2 / Phase 1`

- [x] `HLG 2. Future viewport command toolbars should get drag and resize behavior by default instead of copying custom handlers.`
- [~] `HLG 3. Sketch, Transform, and Extrude should converge on one shared command-panel behavior pattern without merging their feature-specific command bodies.`
- audit current Transform, Sketch Plane, Sketch Draw/Review, and Extrude floating-panel behavior
- decide the exact hook or wrapper boundary
- write the first implementation packet with behavior parity expectations

### `VCTS - 2 / Phase 2`

- [x] `HLG 2. Future viewport command toolbars should get drag and resize behavior by default instead of copying custom handlers.`
- [x] `HLG 4. The shell behavior should stay separate from detached/floating Model Viewport app-window behavior.`
- add the shared floating command-panel behavior helper
- keep it feature-agnostic and viewport-panel-specific
- add focused unit tests for drag/resize math if the logic can be isolated

### `VCTS - 2 / Phase 3`

- [x] `HLG 1. Extrude's command toolbar shell should be draggable and resizable like Sketch and Transform.`
- [x] `HLG 2. Future viewport command toolbars should get drag and resize behavior by default instead of copying custom handlers.`
- migrate the active Extrude command toolbar onto the shared behavior helper
- enable all 8 resize handles
- preserve Extrude's command controls, OK/Cancel, live node writes, preview, accept, and cancel behavior

### `VCTS - 2 / Phase 4`

- [x] `HLG 3. Sketch, Transform, and Extrude should converge on one shared command-panel behavior pattern without merging their feature-specific command bodies.`
- migrate Transform toolbar drag/resize behavior to the shared helper or prove why it needs one narrow adapter
- keep visible Transform behavior unchanged
- remove duplicated local drag/resize math only after parity tests pass

### `VCTS - 2 / Phase 5`

- [~] `HLG 3. Sketch, Transform, and Extrude should converge on one shared command-panel behavior pattern without merging their feature-specific command bodies.`
- route Sketch shell cleanup after Extrude and Transform are stable on the shared helper
- decide whether Sketch Draw/Review can move directly to `ViewportOverlayToolPanel` or should keep a wrapper adapter temporarily
- preserve Sketch Draw/Review density, i-menu, sections, entity lists, and close/done behavior

### `VCTS - 2 / Phase 6`

- [x] `HLG 2. Future viewport command toolbars should get drag and resize behavior by default instead of copying custom handlers.`
- add a future-toolbar setup recipe and proof fixture
- document the minimal code path for a new command toolbar to opt into title-bar drag, all-edge resize, clamping, and default sizing
- add a small example or test-only fixture if useful

## [x] `VCTS - 2 / Phase 1` - `Behavior Owner Audit And Helper Boundary`

### Phase 1 Summary

#### Purpose

Lock the exact shared behavior boundary before extracting code.

#### Owns

- reading Transform's current drag/resize behavior
- reading Sketch Plane and Sketch Draw/Review drag/resize behavior
- reading Extrude's current fixed panel behavior after `Extrude-9`
- deciding whether the first shared seam should be a hook, wrapper component, or both

#### Does Not Own

- runtime implementation
- changing visible toolbar behavior
- changing any feature command body

### Phase 1 Implementation Spec

1. Inspect the current title-bar drag and all-edge resize handlers in `ReferenceTransformToolbar.tsx`.
2. Inspect Sketch's custom session-window handlers in `ViewportOverlay.tsx`.
3. Inspect Extrude's `ViewportOverlayToolPanel` use in `ViewerHost.tsx`.
4. Write a short owner-map section into this doc or a follow-on packet noting which behavior belongs to the shared helper.
5. Mark any behavior that should stay feature-specific.

### Verification Shape

- no code build required unless formatting tooling is run
- owner map names exact source seams and target shared seam

### Done Shape

The shared helper boundary is clear enough that Phase 2 can implement without re-litigating ownership.

### Accepted Read

The owner map is locked: `ViewportOverlayToolPanel` owns visual chrome, `useViewportFloatingToolPanel` owns in-viewport panel movement and sizing behavior, and feature toolbar components own command bodies and command semantics.

## [x] `VCTS - 2 / Phase 2` - `Shared Floating Panel Behavior Helper`

### Phase 2 Summary

#### Purpose

Create the reusable behavior seam for in-viewport command panel drag, resize, sizing, and bounds.

#### Owns

- shared placement state
- title-bar drag callbacks
- all-edge and all-corner resize callbacks
- min width and height clamping
- viewport margin clamping
- optional auto/manual height mode

#### Does Not Own

- visual panel markup already owned by `ViewportOverlayToolPanel`
- command body layout
- command-specific stores
- app-window floating shell behavior

### Phase 2 Implementation Spec

1. Add a helper such as `useViewportFloatingToolPanel(...)` near `ViewportOverlayToolPanel`.
2. Keep the helper feature-agnostic.
3. Return `style`, title-bar handlers, resize handler, and optional reset helpers.
4. Isolate math enough to unit test without mounting full command toolbars where practical.
5. Preserve the existing `ViewportOverlayToolPanel` API unless a narrow prop addition is needed.

### Verification Shape

- unit tests for east, west, north, south, and corner resize math
- unit tests or component tests for viewport clamping
- TypeScript proof

### Done Shape

A new toolbar can opt into shared floating behavior without copying Transform or Sketch handler code.

### Accepted Read

`src/app/components/useViewportFloatingToolPanel.ts` now exposes shared placement, drag, resize, clamping, min-size, and auto/manual height behavior. The pure drag/resize math is covered by `src/app/components/useViewportFloatingToolPanel.test.ts`.

## [x] `VCTS - 2 / Phase 3` - `Extrude Shared Floating Behavior Adoption`

### Phase 3 Summary

#### Purpose

Make the active Extrude command toolbar draggable and resizable through the shared behavior helper.

#### Owns

- Extrude toolbar position and size setup
- title-bar drag behavior
- all 8 resize handles
- viewport clamping
- preserving `Extrude-9` ParaSlider and ParaSelect command body behavior

#### Does Not Own

- changing Extrude node params
- changing accept/cancel semantics
- changing profile-pick behavior
- migrating Transform or Sketch

### Phase 3 Implementation Spec

1. Remove Extrude's fixed bottom-centered placement as the only placement mode.
2. Wire Extrude's `ViewportOverlayToolPanel` to the shared helper.
3. Enable default resize handles by providing the shared resize handler.
4. Preserve current OK/Cancel behavior and node-backed controls.
5. Add component tests proving Extrude renders resize handles and responds to drag/resize entry points.

### Verification Shape

- active Extrude toolbar renders all 8 resize handles
- title-bar pointer drag changes panel position
- resize handle pointer drag changes panel size
- toolbar remains inside viewport bounds
- focused Extrude command tests still pass
- production build passes

### Done Shape

Extrude's visible command shell can be dragged and resized like the mature command panels.

### Accepted Read

The active Extrude command toolbar in `ViewerHost.tsx` now uses `useViewportFloatingToolPanel`, renders all 8 resize handles, preserves its ParaSlider/ParaSelect body, and keeps OK/Cancel/live-node behavior from `Extrude-9`.

## [x] `VCTS - 2 / Phase 4` - `Transform Shared Behavior Migration`

### Phase 4 Summary

#### Purpose

Move Transform's existing local drag/resize behavior onto the shared helper after Extrude proves the seam.

#### Owns

- replacing duplicated Transform placement and resize math
- preserving current Transform layout and user behavior
- retaining Transform's keyboard shortcuts, title actions, and close behavior

#### Does Not Own

- changing Transform command semantics
- redesigning Transform controls
- changing Viewer transform session ownership

### Phase 4 Implementation Spec

1. Replace local Transform toolbar drag/resize handlers with the shared helper.
2. Keep Transform-specific title actions and body layout unchanged.
3. Preserve default width, min width, min height, and viewport margin behavior.
4. Add or update tests that already inspect title bar and resize handles.

### Verification Shape

- existing `ReferenceTransformToolbar` tests pass
- resize handles still render
- title-bar drag still works
- Transform body and title actions are unchanged

### Done Shape

Transform uses the same shared floating command-panel behavior as Extrude.

### Accepted Read

`ReferenceTransformToolbar.tsx` no longer carries its own local drag/resize math. It consumes the shared helper while preserving its title actions, body, default placement, min sizing, and auto-height behavior.

## [x] `VCTS - 2 / Phase 5` - `Sketch Shell Migration Route`

### Phase 5 Summary

#### Purpose

Route Sketch's custom shell behavior toward the shared helper without forcing a risky all-at-once rewrite.

#### Owns

- Sketch Plane panel behavior read
- Sketch Draw/Review custom session window behavior read
- selecting direct migration or adapter migration
- moving duplicated drag/resize math only when parity is clear

#### Does Not Own

- changing Sketch draw tools
- changing Sketch entity editing
- changing Sketch profile selection
- changing Sketch history behavior

### Phase 5 Implementation Spec

1. Keep Sketch runtime behavior unchanged during `VCTS - 2` because its plane panel and Draw/Review session shell include density, i-menu, entity-list, and session-window concerns that deserve their own narrow migration pass.
2. For Sketch Draw/Review, route the follow-on decision to either:
   - move directly to `ViewportOverlayToolPanel`, or
   - keep the custom outer wrapper but use the shared behavior helper
3. Preserve density modes, i-menu behavior, entity rows, profile rows, Done, and Close.
4. Keep the change staged if Sketch's custom shell is too broad for one implementation pass.

### Verification Shape

- Sketch panel still drags
- Sketch panel still resizes from all edges and corners
- density modes still work
- Sketch Draw/Review focused tests still pass
- production build passes

### Done Shape

Sketch has a locked follow-on route for removing bespoke floating-panel math after Extrude and Transform prove the shared helper in production code.

### Accepted Read

Sketch was intentionally staged, not rewritten in this packet. The follow-on cleanup should keep Sketch command semantics and custom session content untouched while moving its panel movement/sizing math to `useViewportFloatingToolPanel`.

## [x] `VCTS - 2 / Phase 6` - `Future Toolbar Setup Recipe`

### Phase 6 Summary

#### Purpose

Make the next new viewport command toolbar easy to start correctly.

#### Owns

- documenting the default setup path
- optional test fixture or example command panel
- naming the minimum required props/state for a new toolbar
- marking what feature families still own themselves

#### Does Not Own

- adding a new real CAD command toolbar
- broad command framework redesign
- workspace floating-window setup

### Phase 6 Implementation Spec

1. Add a small setup section to the VCTS family index or helper docs.
2. Include the preferred import and hook/wrapper usage.
3. Name the default min size, viewport margin, and all-edge resize behavior.
4. Add a test-only fixture if it materially protects future toolbar setup.
5. Update docs so new toolbar planning points at this shared shell instead of copying old Transform or Sketch code.

### Verification Shape

- docs identify the exact helper/wrapper and target file
- tests cover the shared behavior through at least Extrude and Transform
- future-toolbar setup does not require copied drag/resize handlers

### Done Shape

The next viewport command toolbar starts from one shared floating shell behavior path by default.

### Accepted Read

Future command toolbars should render `ViewportOverlayToolPanel`, call `useViewportFloatingToolPanel`, pass the returned `panelRef`, title-bar handlers, resize handler, and `style`, then keep command-specific controls inside the panel body.
