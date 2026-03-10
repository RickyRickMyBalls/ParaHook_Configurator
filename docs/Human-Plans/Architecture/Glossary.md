# Glossary

## Doc History
1. 2026-03-06 01:13: Updated doc history format to include time
2. 2026-03-06 01:13: Added local doc history block
3. 2026-03-06 01:13: Created the current `/20/` glossary for architecture, identity, and pipeline terms

This glossary defines the main terms used in the current `/20/parahook` architecture.

Use this doc when a term starts sounding familiar but blurry.

## App Shell

The top-level React UI composition layer.

Current example:
- `src/app/AppShell.tsx`

It owns:
- layout
- panels
- floating Spaghetti window shell
- viewport chrome

## Assemble / Assembled

`Assemble` is the operation that produces one combined assembled output instead of showing individual parts.

Related term:
- `viewMode = 'assembled'`

This is different from `parts` mode, where individual `PartArtifact`s are shown.

## Build Dispatcher

The app-side orchestrator that manages worker requests and responses.

Current file:
- `src/app/buildDispatcher.ts`

It owns:
- sequence ids
- stale result handling
- request routing
- progress routing
- result validation

It is not the worker itself.

## Build Identity

The identity of a built/generated part in source/build terms.

Main identifiers:
- `nodeId`
- `partKey`
- `partKeyStr`

Build identity answers:
- which source node produced this part?
- which part instance is this?

Build identity must remain separate from preview identity.

## Build Inputs

The resolved inputs that the app sends into the build pipeline after graph compilation.

In Spaghetti mode, these come from:
- `compileGraph`
- `buildInputsToRequest`

They are the bridge between graph intent and worker execution.

## Feature Stack

The ordered list of internal modeling features that define how a part is built.

Current examples:
- sketch
- extrude

Important rule:
- Feature Stack belongs inside part-node data
- it is not the same thing as nested graph nodes

## Feature Stack IR

The intermediate representation produced from a part node’s Feature Stack before worker execution.

It is a compile-time / runtime handoff format.

Purpose:
- turn feature definitions into deterministic runtime operations

## Graph

The canonical node/edge structure used by the Spaghetti Editor.

Current type family:
- `SpaghettiGraph`

It contains:
- nodes
- edges
- system nodes
- part nodes

## Input Mode

The current top-level modeling mode used by the app.

Current values:
- `legacy`
- `spaghetti`

Meaning:
- `legacy` uses direct app-side param inputs
- `spaghetti` uses graph compilation as the front-end

## nodeId

The unique identity of a graph node.

Examples:
- a `Part/Cube` node id
- a `System/OutputPreview` node id

This is source identity, not viewer identity.

## OutputPreview

The Spaghetti system node that maps built source parts into preview slots.

Current system node type:
- `System/OutputPreview`

Purpose:
- decide which source part appears in which preview slot

Important rule:
- OutputPreview belongs to the graph/system layer
- it is not a worker feature
- it is not a viewer-only concept

## PartArtifact

The canonical built-part contract returned from the current build path.

Current shape:

```ts
PartArtifact {
  id
  label
  kind
  params
  partKey
  partKeyStr
}
```

Purpose:
- represent one built output part

Important rule:
- this contract should not be changed casually

## partKey

The structured identity of a built part.

Current shape:

```ts
{
  id: string
  instance: number | null
}
```

Examples:
- `{ id: 'baseplate', instance: null }`
- `{ id: 'toeHook', instance: 1 }`

This is part of build identity.

## partKeyStr

The string form of `partKey`.

Examples:
- `baseplate`
- `toeHook#1`
- `heelKick#1`
- `cube`

Purpose:
- stable string key for built part identity

Important rule:
- `partKeyStr` is build/source identity
- it is not the same thing as `slotId`
- it is not the same thing as `viewerKey`

## Preview Identity

The identity used for preview rendering rows/slots rather than source/build ownership.

Main identifiers:
- `slotId`
- `viewerKey`

Preview identity answers:
- which preview slot is this render row for?

Important rule:
- preview identity is intentionally separate from build identity

## Preview VM

The derived preview view-model returned by the selector layer for rendering/debugging.

Current example:
- `selectPreviewRenderVm`

It contains:
- preview items
- `viewerParts`
- slot-scoped `viewerKey`s

It is derived state, not canonical graph or build state.

## Selector

A function that derives UI-facing data from canonical store/build state.

Examples:
- `selectPreviewRenderVm`
- `selectDebugInspectorVm`
- `selectNodeVm`

Selectors should:
- aggregate truth
- keep ordering deterministic
- shape data for UI/debug use

Selectors should not:
- mutate state
- invent fake source data

## slotId

The identity of an OutputPreview slot.

Example:
- `s001`

Purpose:
- identify one preview slot in the OutputPreview node

Important rule:
- `slotId` is preview identity
- it is not the same as `partKeyStr`

## Source Identity

The identity of something in terms of graph/build origin.

Examples:
- `nodeId`
- `partKey`
- `partKeyStr`

This is the "where did this come from?" identity family.

## Spaghetti

The node-based CAD editor/system inside the ParaHook app.

It includes:
- graph editing
- graph evaluation
- Feature Stack compilation
- OutputPreview slot mapping
- debug inspectors

Important rule:
- Spaghetti is a front-end modeling system
- it compiles into the existing build/runtime pipeline

## Spaghetti Compiler

The layer that turns graph state into diagnostics, feature-stack IR, and build inputs.

Current area:
- `src/app/spaghetti/compiler/`

It is not the worker.

## Viewer

The render engine that draws parts into the viewport.

Current file family:
- `src/viewer/*`

It owns:
- scene
- camera
- graphics/render behavior

It should not own:
- graph truth
- compile behavior
- app build policy

## ViewerHost

The app-side component that mounts and feeds the viewer.

Current file:
- `src/app/components/ViewerHost.tsx`

It bridges:
- app state
- selectors
- viewer calls

## viewerKey

The identity used by the viewer/render layer for a renderable preview item.

In current Spaghetti preview logic:
- `viewerKey` is intentionally slot-scoped
- it is usually set from `slotId`

Important rule:
- `viewerKey` is preview/render identity
- it is not the same as `partKeyStr`

## Worker Runtime

The isolated execution layer that actually performs deterministic build work.

Current area:
- `src/worker/`

It receives typed requests and returns typed results.

Important rule:
- worker runtime is execution
- it is not canonical UI/app state
