# Transform Tool

## Doc Header

### Doc History
1. 2026-03-18 20:54: Created this architecture doc to define the ParaHook `Transform Tool` as a general viewer-side transform/session surface, using the shipped reference toolbar as the first proof and describing what must change for the tool to target more than references

### Purpose

This doc defines the architecture direction for the ParaHook `Transform Tool`.

Use it to answer:
- what the current transform tool actually is
- what part of the current toolbar is reusable
- what still makes it reference-only today
- what it needs to become to transform more than references
- how target identity, capability, persistence, and viewer gizmo ownership should be modeled
- where the boundary stays between viewer/runtime transforms and authored/source transforms

### Why This Doc Exists

ParaHook already has a working floating transform surface:
- the current `ReferenceTransformToolbar`
- the existing viewer gizmo/session path

That is an important proof surface, but it is still tightly bound to:
- `referenceWorkspace`
- `referenceId`
- reference-only store actions
- reference-specific timelines and snap behavior

At the same time, planning now points toward more transformable targets:
- references
- content objects
- sketch-plane/source placement
- later other authored or viewer-owned content

This doc exists so the project can define one honest transform-tool architecture instead of repeatedly cloning the reference-only surface for new target types.

### Scope

This doc covers:
- the current transform-tool proof surface
- the intended general transform-tool direction
- the target model needed for multiple transformable object types
- session ownership, toolbar ownership, and viewer gizmo ownership
- the capability/persistence rules needed to widen beyond references

This doc does not cover:
- final visual styling
- final keyboard shortcut mapping for every target type
- detailed Replicad/source-math implementation
- final sketch-plane-specific authored UI inside `Geometry/Sketch`
- every future transformable object class the product may ever support

## Doc Body

### Short Version

ParaHook already has the first proof of a transform tool, but it is still reference-only.

The real long-term direction should be:
- one transform-tool architecture
- one viewer-side gizmo/session model
- multiple eligible target types
- one shared toolbar/control language
- target-specific adapters for:
  - identity
  - capabilities
  - persistence
  - value read/write

That means the transform tool should evolve from:
- `ReferenceTransformToolbar`

into something closer to:
- `Transform Tool`
- or later `ContentTransformToolbar`

### What The Current Tool Is

Today the shipped transform tool is:
- a floating toolbar
- a viewer-side gizmo/session
- keyboard-assisted `Move / Rotate / Scale`
- reference-targeted value editing

Current proof surface:
- `src/app/components/ReferenceTransformToolbar.tsx`

Current strengths:
- grouped transform sections
- shared `ParaSlider` control language
- floating overlay presentation
- section collapse/expand behavior
- keyboard shortcut support
- camera follow/zoom helpers
- working viewer-gizmo attachment

Current limitation:
- the whole tool is still built around `reference` state and naming

### Problem Statement

Right now the transform tool is not really a transform tool yet.

It is a reference transform tool.

That means the repo is at risk of repeating the same pattern for every new target:
- one toolbar for references
- one different toolbar for sketch plane
- one different toolbar for content objects
- one different toolbar for later authored objects

That would duplicate:
- interaction language
- keyboard flows
- viewer-gizmo ownership
- transform-section UI
- store/session logic

The architecture should instead move toward:
- one generic transform session
- one target adapter model
- one shared transform-tool shell

### Core Naming Direction

Use these terms:

- `Transform Tool`
  - the overall system
- `Transform Session`
  - the active target-bound editing session
- `Transform Target`
  - the thing currently being transformed
- `Transform Target Adapter`
  - target-specific read/write/capability behavior
- `Viewer Transform`
  - transform that is viewer/runtime owned
- `Authored Transform`
  - transform that edits authored/source state

Important rule:
- not every transform target is the same kind of thing
- the tool should be shared
- target semantics should be delegated through adapters

### The Real Architecture Goal

The honest end state is:

```text
Transform Tool
├─ Transform Session
│  ├─ active target
│  ├─ target capabilities
│  ├─ current mode
│  ├─ current space
│  └─ current values
├─ Shared Toolbar Shell
│  ├─ Move
│  ├─ Rotate
│  ├─ Scale
│  ├─ optional target-specific controls
│  └─ shared actions / shortcuts
├─ Viewer Gizmo Layer
│  └─ one active gizmo owner at a time
└─ Target Adapters
   ├─ Reference
   ├─ Content Object
   ├─ Sketch Plane
   └─ later others
```

### What It Needs To Become

To transform more than references, the current tool needs at least these upgrades.

#### 1. Generic Target Identity

Today:
- target identity is basically `referenceId`

It needs to become:
- a generic transform target identity

Example shape:

```ts
type TransformTargetRef = {
  kind: 'reference' | 'content-object' | 'sketch-plane'
  id: string
  ownerId?: string
}
```

Important rule:
- the toolbar should not care whether the target is a reference, content object, or sketch-plane source
- it should receive a target ref plus a target adapter

#### 2. Capability Matrix

Not every target should automatically get the same transform surface.

Each target needs a declared capability set like:
- can move
- can rotate
- can scale
- can flip
- can use local/world space
- can use snap
- can use timelines

Example shape:

```ts
type TransformCapabilities = {
  move: boolean
  rotate: boolean
  scale: boolean
  flip?: boolean
  localWorldSpace?: boolean
  snap?: boolean
  timelines?: boolean
}
```

Why:
- references may support full `Move / Rotate / Scale`
- sketch-plane placement may support:
  - move
  - rotate
  - flip
  - but not necessarily scale

#### 3. Target Adapter Read / Write Path

Today:
- the toolbar directly reads and writes reference-store state

It needs to become:
- a target adapter system

Each adapter should answer:
- how to read current transform values
- how to write current transform values
- how to reset
- whether values are session-only or persisted
- how to talk to the viewer gizmo

This is the main step that turns the current toolbar into a general transform tool.

#### 4. Persistence Policy Per Target

Different targets have different persistence rules.

Examples:
- reference transform
  - currently workspace/session oriented
- content object transform
  - may be viewer/runtime/session owned at first
- sketch-plane transform
  - may be authored and persisted in the graph/source model

Important rule:
- the transform tool should not assume one persistence model for every target
- persistence belongs to the target adapter contract

#### 5. Shared Toolbar Shell With Optional Target-Specific Extensions

The shell should stay shared:
- header
- grouped transform sections
- slider language
- keyboard language
- overlay presentation

But some targets may add or remove controls.

Examples:
- references
  - full `Move / Rotate / Scale`
  - timeline support
- sketch plane
  - `Reference`
  - `Move`
  - `Rotate`
  - `Flip`
  - maybe no scale

So the shell should be:
- shared by default
- extensible by target capability

#### 6. One Active Gizmo Owner

The viewer should continue to have one clear transform owner at a time.

That means:
- one active transform session
- one active target
- one active gizmo owner

This is already the right direction in the current reference-only implementation and should remain true after generalization.

### Boundary Between Viewer Transforms And Authored Transforms

This is one of the most important architecture boundaries.

There are really two broad categories:

#### Viewer / Runtime Transforms

Examples:
- references
- scene/content instances

Characteristics:
- session oriented
- viewer/runtime owned
- may not rewrite source-authoring data

#### Authored / Source Transforms

Examples:
- sketch-plane setup
- later other source-owned authored placement systems

Characteristics:
- change canonical authored state
- should persist into graph/source data
- may still use the same gizmo/tool language

Important rule:
- the same transform tool architecture can support both
- but it must not pretend they are the same persistence domain

### Where SketchPlane Fits

`SketchPlane` is a strong future target, but it should be treated as an authored/source target, not just another viewer instance.

That means:
- it can reuse transform-tool language
- it can reuse a viewer-side gizmo/session
- but its values likely persist into authored graph state

The sketch node architecture doc remains the canonical source for sketch-plane-specific UX:
- [Sketch](./Spaghetti-Editor-Arch/Nodes/Sketch/Sketch.md)

This doc just defines how the transform-tool architecture can become broad enough to host that target cleanly.

### Current Reusable Pieces

From the current reference toolbar, the strongest reusable pieces are:
- grouped transform sections
- `ParaSlider` transform rows
- section open/close structure
- keyboard transform language
- overlay window shell
- viewer-gizmo attachment pattern

The least reusable pieces are:
- direct `referenceWorkspace` bindings
- `referenceId`-specific targeting
- reference-only timeline ownership
- reference-specific naming

### Recommended Migration Direction

The safest direction is:

1. keep the shipped reference toolbar working
2. separate the generic shell from the reference adapter
3. introduce a generic transform-target/session model
4. widen the tool to another eligible target type
5. only then rename the surface away from `ReferenceTransformToolbar`

That avoids trying to generalize everything in one rewrite.

### Suggested First Widening Targets

The likely widening order should be:

1. references
  - already shipped proof surface
2. eligible content objects
  - aligns with the existing future task `[2.4F]`
3. sketch-plane placement
  - shared transform language, but authored persistence

Important rule:
- sketch-plane should not be forced into the generic-content pass if that would blur the authored/runtime boundary
- it can reuse the transform architecture without being identical to content-instance transforms

### What This Doc Locks

This doc locks these decisions:
- the current reference toolbar is the first proof, not the final product
- the long-term direction is one shared transform-tool architecture
- widening the tool requires:
  - generic target identity
  - capability matrix
  - target adapters
  - per-target persistence policy
- one active gizmo owner should remain true
- sketch-plane is a future valid target, but as an authored/source target

### What This Doc Leaves Open

This doc intentionally does not fully decide:
- the exact generic target-ref type
- the first non-reference target after references
- whether the final shared surface should be named `Transform Tool` or `ContentTransformToolbar`
- how much of the current timeline layer should remain reference-only
- exactly when sketch-plane should join the generalized transform-tool system
