# Transform Phase Transform-13.2 - Persistent Move Snap Lattice Cleanup

## Doc Header

### Doc History
1. 2026-03-27 17:19: Moved the standalone `Transform 13.2` record into `Shipped/` after the persistent move snap lattice rebuild and follow-on polish landed, rewriting the phase in shipped language so the Transform family no longer keeps this move-only helper-system rebuild parked in `Future/`

### Purpose

This shipped phase records the clean move snap visual-system rebuild that followed the first `Transform 13` move snap availability pass.

Use it to answer:
- what `Transform 13.2` actually shipped in the move snap overlay
- how the move snap dots now stay keyed to stable snap positions in space
- which viewer-only controls now shape the move snap presentation
- what remained explicitly deferred after the move-only cleanup

## Doc Body

## [x] Transform 13.2 - Persistent Move Snap Visual System Rebuild

### Shipped Outcome

`Transform 13.2` shipped as the move-only cleanup pass after `Transform 13`.

It kept:
- move snap math unchanged
- shared move snap state unchanged
- the scope move-only

It changed the viewer-owned presentation model underneath that math:
- move snap dots are now keyed to stable absolute snap positions instead of behaving like a small patch attached to the gizmo
- the visible neighborhood is now derived from that stable field instead of owning the field
- size-led emphasis now changes around the current snapped move target while the mouse button is still down
- the transform reference `i` menu now exposes viewer-only controls over the move snap dot presentation

### Landed Direction

The shipped move snap overlay now follows three layers:

1. stable lattice identity
   - move snap dots are keyed by absolute snap position
   - the current snapped target no longer owns field identity
2. visible window
   - the viewer shows a bounded local neighborhood from that larger field
   - the `i` menu can widen or tighten that visible neighborhood
3. emphasis
   - size does most of the work
   - opacity stays secondary
   - the highlighted current snapped point is only modestly larger than nearby dots

### Shipped Behavior

- move snap dots now read as points in space instead of a moving local block
- the gizmo reads more like it is stepping from snap point to snap point
- the highlighted current dot now transfers on arrival at the new snapped point
- move snap dot presentation in the transform reference `i` menu now includes:
  - `Move Snap Dots`
  - dot size
  - dot delay
  - dot on-gizmo size
  - dot furthest size
  - dot radius
- the dot radius control now behaves as a world-distance budget rather than a ring-count multiplier, so changing move snap spacing still renders roughly the same spatial neighborhood

### Did Not Land Here

- rotate snap preview visuals
- scale snap preview visuals
- new Console grammar
- new snap-state ownership

### Deferred Follow-On

After this shipped move-only cleanup:
- rotate snap preview visuals stay deferred to `Transform 13.1`
- scale remains out of scope
