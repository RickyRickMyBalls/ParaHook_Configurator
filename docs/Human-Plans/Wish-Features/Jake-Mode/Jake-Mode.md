# Jake Mode

## Doc History
1. 2026-03-06 01:55: Created the Jake mode design doc and captured the current architecture direction for Spaghetti, drivers, and control-viz handles

## Purpose

This doc explains the big-picture idea for `Jake mode`.

Jake mode is intended to become the easier end-user mode for customizing a ParaHook.

It is not meant to replace Spaghetti.
It is meant to sit on top of Spaghetti.

## Big Vision

The long-term product direction is:

- `Spaghetti mode` is the real authoring system
- `Jake mode` is the simplified editing mode for ease of use

That means:
- Spaghetti will always be the system that defines how the objects are built
- Jake mode will be the simpler interface the end user uses to customize the result

## Core Architecture Direction

The important rule is:

- Jake mode should not define a separate model
- Jake mode should edit the same underlying Spaghetti-backed model

So the clean mental model is:

- Spaghetti = advanced authoring system
- Jake mode = simplified control surface for that same system

This avoids the bad architecture where:
- Spaghetti has one truth
- Jake mode has another truth
- and both have to stay in sync

## Relationship Between Spaghetti And Jake Mode

### Spaghetti Mode

Spaghetti mode is for:
- graph editing
- advanced node wiring
- part setup
- driver setup
- feature relationships
- future equations

It is the place where the real structure is authored.

### Jake Mode

Jake mode is for:
- simple user customization
- direct manipulation
- easier control of part shape
- hiding graph complexity from the end user

It should feel like:
- a simpler product UI
- not a graph editor

## Jake Mode As The End Product

Jake mode is intended to become the final easy-to-use customization mode.

That means the likely product ladder is:

- Spaghetti mode for building and defining the system
- Jake mode for using the system

So Spaghetti is the advanced editor.
Jake mode is the simplified product-facing layer.

## Control Viz Spheres

One major part of Jake mode is the return of the old control-viz sphere idea from the older app versions.

The high-level behavior is:
- the user sees control spheres in the viewport
- they click and drag a sphere
- the sphere is constrained to a known sketch plane
- when the user lets go, the model updates

This is intended to make editing feel more direct and more visual.

## Sketch Plane Constraints

Control-viz handles should not move freely in all 3D directions.

Instead, each one should usually be constrained to a known plane, such as:
- XY
- XZ
- another defined sketch plane

This matters because:
- it keeps the interaction understandable
- it keeps the control meaning consistent
- it avoids accidental invalid movements

## Drivers As The Control Contract

A key idea is that Jake mode should eventually be powered by driver nodes inside Spaghetti.

That means:
- the underlying model is still built in Spaghetti
- drivers become the approved control layer
- Jake mode exposes those drivers in a simple way

So the system becomes:

- part nodes define the parts
- driver nodes define controllable values
- wires and equations define relationships
- Jake mode exposes a curated set of those controls

## Why Drivers Matter

Drivers are important because they let the same model support:
- advanced graph authoring
- simplified end-user editing
- future equations and relationships

That means one system can power both:
- technical editing in Spaghetti
- simple editing in Jake mode

## Jake Mode Should Edit Drivers MAYBE

The clean rule is:

- Jake mode edits drivers
- drivers control the model

This is much cleaner than inventing a second independent parameter system just for Jake mode.

## Control Viz Handles Vs Drivers

A control-viz sphere is not necessarily the same thing as a driver.

Better model:

- driver = canonical editable value
- control-viz handle = viewport interaction object
- binding = rule for how the handle writes into one or more drivers

So a handle is a UI interaction layer.
The driver is the underlying value contract.

## One Handle Can Edit More Than One Value

A control-viz sphere may sometimes affect more than one driver at once.

Example:
- the user drags the endpoint of the inner arc of the toe hook
- movement is constrained to the XY plane
- the handle updates two values at once

In the simplest version, that may just be:
- one `vec2` driver

That is probably the cleanest first implementation for endpoint-style controls.

## Vec2 Drivers

Some controls that look like "two values at once" are probably best modeled as:
- one `vec2` driver

Example:
- an endpoint with `x` and `y`

In that case:
- one viewport handle
- one plane constraint
- one `vec2` driver

This is simpler than pretending it is always two separate scalar drivers.

## Multi-Target Handle Bindings

Even if some handles map cleanly to `vec2`, the architecture should still allow more advanced bindings later.

Future possibilities:
- one handle updates two separate number drivers
- one handle updates a `vec2` and another derived value
- one handle updates several values through equations

So the long-term rule should be:

- a control-viz handle may bind to one or more drivers

## Future Equations

Another important reason to use drivers is that they can later become equation inputs.

That means:
- drivers will not just be simple values forever
- they may become part of mathematical relationships between parts and features

This is important because it makes Jake mode and Spaghetti part of the same long-term system instead of two separate products.

## Clean Architecture Summary

The intended architecture is:

- Spaghetti defines the real model
- drivers define the control contract
- Jake mode exposes a simplified subset of the controls
- control-viz handles are viewport bindings that edit drivers
- some handles edit one driver
- some handles may edit multiple drivers
- equations can later build on those same drivers

## Important Rule To Preserve

Jake mode should not create a second model truth.

The correct structure is:
- one canonical model
- two editing experiences

Those two editing experiences are:
- Spaghetti mode
- Jake mode

## Practical First Version

A good first implementation path for Jake mode is:

1. define the first real driver nodes in Spaghetti
2. decide which drivers are user-facing
3. add basic control-viz handles for those drivers
4. constrain handle movement to known planes
5. update the model when the user releases the handle
6. keep the advanced graph editing in Spaghetti mode

## Later Expansion

Once the basics work, Jake mode can grow into:
- a full simplified editing experience
- grouped user controls
- viewport handles
- future equations
- curated visibility of only the important controls

## Open Design Questions

These are the main follow-up questions:

- which drivers should be user-facing in Jake mode?
- which controls should be viewport handles vs panel controls?
- which handles map cleanly to `vec2`?
- which handles need multi-driver bindings?
- should rebuild happen on release only, or also during drag for some controls?
- what metadata should every user-facing driver carry?

## Likely Metadata For User-Facing Drivers

You will probably want metadata like:
- label
- category/group
- visible in Jake mode
- editable by sphere
- editable by panel input
- plane constraint
- min/max
- snap behavior
- scalar vs vec2
- manual vs equation-driven

## Short Version

Jake mode is not a second modeling system.

It is the simplified, end-user control layer on top of the Spaghetti-defined model.

Spaghetti authors the structure.
Drivers define the controls.
Jake mode exposes those controls.
Control-viz handles make those controls direct and visual.
