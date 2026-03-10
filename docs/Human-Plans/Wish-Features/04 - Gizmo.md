# 04 - Gizmo

## Doc History
1. 2026-03-06 01:13: Updated doc history format to include time
2. 2026-03-06 01:13: Added local doc history block
3. 2026-03-06 01:13: Created gizmo parity plan for matching the old `/15.1/replicad-app` gizmo style and controls

## Purpose

Bring the `/20/parahook` viewport gizmo back to the `/15.1/replicad-app` style and behavior as closely as possible, then expose the missing visual controls so the gizmo can be tuned instead of being a fixed overlay.

This is a wishlist / planning doc, not an implementation task yet.

## Old `/15.1` Gizmo Reference

Reference files:
- `/15.1/replicad-app/src/viewer.ts`
- `/15.1/replicad-app/index.html`

What the old gizmo was doing:
- top-right overlay gizmo rendered inside the viewport
- clickable axis endpoint spheres for view snapping
- clickable corner spheres for isometric snap directions
- `AxesHelper`-based line core with colored endpoint spheres
- fixed overlay sizing owned by the viewer
- click interception inside the gizmo viewport before orbit drag handling

Important `/15.1` visual details to preserve:
- axis viewport size: `120`
- axis viewport padding: `10`
- colored endpoint spheres
- smaller light-gray corner spheres
- top-right placement
- direct click-to-snap camera behavior

Important `/15.1` behavior details to preserve:
- gizmo click region is handled before main orbit interaction
- snapping works for axis views and corner/isometric views
- gizmo reads the main camera orientation and mirrors it live

## Current `/20/` Situation

Current relevant files:
- `/20/parahook/src/viewer/overlay/AxisGizmo.ts`
- `/20/parahook/src/app/components/ViewportOverlay.tsx`
- `/20/parahook/src/app/components/ViewToolbar.tsx`
- `/20/parahook/src/shared/viewSettingsTypes.ts`

Current split:
- `AxisGizmo.ts` draws the clickable axis overlay
- `ViewportOverlay.tsx` owns the overlay canvas host and manual resize handle
- `ViewToolbar.tsx` owns transform gizmo buttons and one `Axis Overlay` checkbox

Current gaps vs the old `/15` style:
- the overlay system is spread across multiple layers instead of feeling like one coherent gizmo feature
- `/20/` only exposes `axisOverlayEnabled` as persisted view state
- `/20/` does not expose visual gizmo controls for:
  - line opacity
  - text on/off
  - text height
- `/20/` currently mixes two different ideas under "gizmo":
  - viewport axis/orientation gizmo
  - transform gizmo for selected parts

## Desired Outcome

`/20/` should have a viewport gizmo that feels visually and behaviorally the same as `/15.1`, while also gaining a proper settings surface for future tuning.

The viewport gizmo should expose:
- enable / disable
- line opacity
- text visibility
- text height

The transform gizmo should remain a separate tool, but the UI should stop making the two gizmo systems feel like one confusing combined feature.

## Plan

### Phase A - Lock Old Style Parity

- Use `/15.1/replicad-app/src/viewer.ts` as the visual behavior reference.
- Match the old top-right placement, axis sphere sizing, corner sphere sizing, and snap behavior.
- Match the old color language for the axis endpoints.
- Match the old click interception behavior so gizmo clicks do not leak into orbit drag.

### Phase B - Unify `/20/` Gizmo Ownership

- Treat the viewport orientation gizmo as one feature with one config surface.
- Keep rendering logic in the viewer/overlay layer.
- Keep sizing and style config in a single settings model instead of scattered local state.
- Keep transform gizmo controls separate in naming and layout.

### Phase C - Add Missing Visual Controls

Add persisted viewport-gizmo settings for:
- line opacity
- text enabled
- text height

Possible future settings if needed:
- overall widget size
- sphere opacity
- label opacity
- padding from top/right edge

### Phase D - Toolbar / UI Cleanup

- Add a dedicated viewport gizmo section in the view controls.
- Make it clear which controls belong to:
  - orientation gizmo
  - transform gizmo
- If the old `/15` layout had a cleaner feel, copy that tone directly instead of inventing a new styling system.

## Proposed Settings Shape

Possible `/20/` settings object:

```ts
viewportGizmo: {
  enabled: boolean
  lineOpacity: number
  textEnabled: boolean
  textHeight: number
  sizePx: number
}
```

This should live in the view settings layer, not inside temporary component-local state, if the values are meant to persist.

## Implementation Notes

- `AxisGizmo.ts` is the most likely place to absorb `/15` visual parity work.
- `ViewportOverlay.tsx` currently owns widget sizing UI; decide whether that remains user-resizable or becomes a settings-driven size.
- `ViewToolbar.tsx` should stop using one generic "Gizmo" label for both transform and orientation systems.
- If text labels are added, they should not break click picking or make the overlay blurry at small sizes.

## Questions To Answer Before Build

- Should viewport gizmo size remain drag-resizable in `/20/`, or should it move to a controlled setting?
- Should text labels always be visible, or only at larger sizes?
- Should `/20/` copy `/15.1` exactly first, then add text controls after parity is reached?
- Should transform gizmo controls stay in `ViewToolbar`, or move into a separate transform/selection tool area?

## Done Means

- `/20/` viewport gizmo visually matches the old `/15.1` feel
- snap behavior matches the old axis/corner interaction
- line opacity is adjustable
- text can be enabled/disabled
- text height is adjustable
- orientation gizmo and transform gizmo are clearly separated in the UI
