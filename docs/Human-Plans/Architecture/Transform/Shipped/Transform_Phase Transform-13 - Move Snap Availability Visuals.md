# Transform Phase Transform-13 - Move Snap Availability Visuals

## Doc Header

### Doc History
1. 2026-03-27 15:10: Created this standalone implementation-ready `Transform 13` future phase doc as the next viewport snap-visual follow-on, narrowing the first pass to move-only active-drag visuals, splitting rotate out to later `Transform 13.1`, and locking the three move-handle visual modes around single-axis, plane, and center/3-axis move
2. 2026-03-27 15:14: Marked `Transform 13` shipped after the first move-only snap availability visuals landed, moving this phase record into `Shipped/` so the family roadmap no longer leaves the move viewer pass open while rotate remains deferred to later `Transform 13.1`

### Purpose

This phase added the first viewport snap-availability visual for reference transform.

It answered:
- when move snap visuals should appear in the viewport
- what enabled move snap should render while a live gizmo drag is active
- how the visual should differ for axis, plane, and center move handles
- how to keep the first pass local, useful, and not noisy

## Doc Body

## [x] Transform 13 - Move Snap Availability Visuals

### Shipped Summary

`Transform 13` shipped after:
- `Transform 12`
  - transform-shell polish and canonical adapter cleanup shipped

By the start of this phase, move snap already existed as real shared runtime behavior, but the viewport gave the user no local visual sense of the nearby snap targets while dragging.

The shipped pass added that first visual layer for move only.

The shipped scope stayed tight:
- only while the user is actively dragging a move gizmo during a live transform entry
- only when move snap is enabled
- only for move handles
- render nearby snap options as small white dots/spheres
- keep the field local to the active gizmo neighborhood

Explicitly left out of scope:
- passive always-on snap visuals while idle
- rotate snap visuals
- scale snap visuals
- new snap state or snap math

Shipped outcome:
- axis move shows a local one-dimensional snap field
- plane move shows a local two-dimensional snap field
- center / 3-axis move shows a local three-dimensional snap field
- all three variants read from the same shared move snap value already used by the runtime gizmo

### Owned

- viewer-side move snap availability visual while dragging
- local snap-point generation for move axis, plane, and center handles
- viewport-only presentation rules for the move snap field

### Did Not Own

- rotate snap visuals
- scale snap visuals
- new snap persistence/state shape
- transform history visuals
- transform-shell grammar changes

### Locked Outcome

- The move snap visual appears only during an active move gizmo drag inside a live transform entry
- The visual appears only when move snap is enabled
- The visual renders nearby move snap options as tiny white dots or spheres
- The visual stays local to the active gizmo neighborhood and does not fill the whole viewport
- Dot spacing follows the committed move snap value already active for the reference
- The visual must reflect the active handle mode:
  - single-axis move:
    - render a local line of snap dots along that axis
  - plane move:
    - render a local 2D field of snap dots across that active plane
  - center / 3-axis move:
    - render a local 3D field of snap dots around that active center move context
- The dots disappear when the drag ends, the entry is cancelled, or the user switches out of move
- Rotate is explicitly deferred to `Transform 13.1`
- Scale stays out of scope

### Shipped Implementation Direction

Primary targets were:
- `src/viewer/gizmo/TransformGizmo.ts`
- `src/viewer/Viewer.ts`
- `src/app/viewerBridge.ts`
- `src/app/components/ViewerHost.tsx`
- new viewer helper if needed for move snap point generation/rendering
- focused tests around viewer-host seam and helper math/rendering

The shipped implementation:
- derived the active move snap field only while a move handle is actively dragging
- reused the existing shared move snap value from reference transform state rather than adding a second visual-only snap source
- branched the visual generator by active move handle kind:
  - axis
  - plane
  - center
- kept the neighborhood bounded so the first pass stays readable and cheap
- rendered in white, lightweight enough to sit beside the gizmo without competing with the model
- kept the visual entirely viewer-owned; Console and toolbar remained adapters into snap state, not owners of the overlay

### Verification Shape

Verification covered:
- viewer/helper seam
  - axis move generates a 1D snap field
  - plane move generates a 2D snap field
  - center move generates a 3D snap field
  - spacing follows the active move snap value
  - the field is bounded/local, not unbounded
- viewer host / runtime seam
  - no move snap visual while idle
  - no move snap visual when move snap is disabled
  - move snap visual appears only during active move drag
  - visual clears on drag end/cancel
- compatibility
  - existing gizmo behavior and move snap execution stay unchanged
