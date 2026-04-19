# Glossary

## Doc History
1. 2026-04-12 12:49: Refreshed the glossary for the current graph-document, bundle, preview-preparation, and viewport-result architecture; corrected outdated `PartArtifact` and preview identity wording; and marked older `assembled` / input-mode language as transitional instead of current runtime truth
2. 2026-03-06 01:13: Updated doc history format to include time
3. 2026-03-06 01:13: Added local doc history block
4. 2026-03-06 01:13: Created the current `/20/` glossary for architecture, identity, and pipeline terms

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

An older or transitional term that still appears in some planning docs and node names.

Current rule:
- do not treat `assembled` as the main shared runtime truth
- current shared build types define `ViewMode = 'parts'`
- if a doc mentions `assembled`, read it as historical cleanup language or as discussion of the `Output/Assembled` node family, not the canonical live preview/build model

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

## Build Execution Intent

The typed policy object that tells the worker what kind of build is being requested.

Current fields include:
- `buildMode`
- `quality`
- `updatePolicy`
- `draftPolicy`
- `authoritativePolicy`
- `outputIntent`
- `geometryTarget`

Important rule:
- Build Execution Intent is request policy
- it is not graph truth
- it is not preview identity

## Build Identity

The identity of a built/generated part in source/build terms.

Main identifiers:
- `nodeId`
- `partKey`
- `partKeyStr`

Build identity answers:
- which source node produced this part?
- which part instance is this?

Important rule:
- build identity is different from bundle-entry identity such as `buildUnitId` and `outputEntryId`
- build identity must remain separate from preview identity

## Build Inputs

The resolved inputs that the app sends into the build pipeline after graph compilation.

In Spaghetti mode, these come from:
- `compileGraph`
- `buildInputsToRequest`

They are the bridge between graph intent and worker execution.

## Build Result Bundle

The canonical typed result package returned from the worker build path for one build request.

Current shape includes:
- `buildRequestId`
- `graphDocumentId`
- `seq`
- `resultClass`
- `executionIntent`
- `summary`
- `entries`

Purpose:
- carry accepted build truth at the bundle-entry level

Important rule:
- a `BuildResultBundle` is richer than a flat `PartArtifact[]`
- it preserves per-entry status such as `rebuilt`, `retained`, and `evicted`
- current preview, browser, and publication flows should prefer bundle-aware logic when available

## Build Routing Identity

The request identity used to route build work across the app/worker boundary.

Main identifiers:
- `projectFileId`
- `graphDocumentId`
- `buildRequestId`

Purpose:
- identify one build request in the dispatcher/runtime pipeline

Important rule:
- routing identity is not the same as source/build identity for a part

## buildUnitId

The identity of one worker-tracked build unit inside compiled build data and bundle entries.

Purpose:
- identify one rebuild/retain/evict unit across a request/result cycle

Important rule:
- `buildUnitId` is bundle-entry identity
- it is not the same thing as `partKeyStr`
- it is not the same thing as `slotId`

## Feature Stack

The ordered list of internal modeling features that define how a part is built.

Current examples:
- sketch
- extrude

Important rule:
- Feature Stack belongs inside part-node data
- it is not the same thing as nested graph nodes

## Feature Stack IR

The intermediate representation produced from a part node's Feature Stack before worker execution.

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
- optional receive references
- graph-local UI state

Important rule:
- `SpaghettiGraph` is the graph itself
- it is often wrapped inside a `GraphDocument`

## Graph Document

The persisted named wrapper around one `SpaghettiGraph`.

Current shape includes:
- `graphDocumentId`
- `name`
- `version`
- `graph`

Purpose:
- provide the identity boundary for one authored graph
- scope editor viewports, build routing, and qualified viewer/output ids

Important rule:
- many modern runtime identities are graph-document-scoped

## Graph Preview Preparation

The derived mapping layer that reads the graph's `OutputPreview` wiring and prepares it for preview/publication logic.

Current file:
- `src/app/spaghetti/previewPreparation.ts`

It contains:
- slot ids
- source node / part mappings
- publication mode
- slot status
- preview candidate part keys
- per-slot source entries

Purpose:
- bridge graph wiring into deterministic preview rows and output-entry ids

Important rule:
- Graph Preview Preparation is derived state
- it is not canonical graph data
- it is upstream of preview VMs, output surfaces, and viewport result selection

## Input Mode

An older cleanup-era term for the `legacy` versus `spaghetti` front-end split.

Current guidance:
- this vocabulary may still appear in older docs and tests
- for current architecture, `GraphDocument`, `BuildExecutionIntent`, `GraphPreviewPreparation`, and `ViewportResultState` are usually more precise than talking about "input mode"

## nodeId

The unique identity of a graph node.

Examples:
- a `Part/Cube` node id
- a `System/OutputPreview` node id

This is source identity, not viewer identity.

## OutputPreview

The Spaghetti system node that maps graph source outputs into preview/publication slots.

Current system node type:
- `System/OutputPreview`

Purpose:
- define which source node output is published into which slot
- drive preview preparation and output-entry generation

Important rule:
- OutputPreview belongs to the graph/system layer
- it is not a worker feature
- it is not viewer-only state

## outputEntryId

The deterministic identity of one published output entry.

It is typically derived from:
- `slotId`
- `sourceNodeId`
- and sometimes source-port or member information

Examples:
- `output-entry:s001:node-cube`
- `output-entry:s001:node-extrude-1:member-001`
- `output-entry:s001:node-extrude-1:port-SolidBody%3A001`

Purpose:
- connect preview-preparation rows, bundle entries, and published output surfaces

Important rule:
- `outputEntryId` is not the same thing as `partKeyStr`
- `outputEntryId` is not the same thing as `viewerKey`

## PartArtifact

The canonical built artifact contract used across the current build path.

Current shape:

```ts
type PartArtifact = BoxPartArtifact | MeshPartArtifact

type BoxPartArtifact = {
  id
  label
  kind: 'box'
  params
  partKey
  partKeyStr
}

type MeshPartArtifact = {
  id
  label
  kind: 'mesh'
  mesh
  partKey
  partKeyStr
}
```

Purpose:
- represent one built output artifact

Important rule:
- do not describe `PartArtifact` as one flat always-`params` shape
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
- it is not the same thing as `outputEntryId`
- it is not the same thing as `viewerKey`

## Preview Identity

The identity family used for preview/publication/render rows rather than source/build ownership.

Main identifiers:
- `slotId`
- `outputEntryId`
- `viewerKey`

Preview identity answers:
- which preview slot or published row is this?
- which renderable preview item is this?

Important rule:
- preview identity is intentionally separate from build identity
- many preview/render identities are graph-document-qualified in modern flows

## Preview VM

The derived preview view-model returned by the selector layer for rendering/debugging.

Current example:
- `selectPreviewRenderVm`

It contains:
- preview items
- `viewerParts`
- `outputEntryId`
- `viewerKey`
- `viewerPart`

It is derived state, not canonical graph or build state.

## Selector

A function that derives UI-facing data from canonical store/build state.

Examples:
- `selectPreviewRenderVm`
- `selectDebugInspectorVm`
- `selectViewportResultState`

Selectors should:
- aggregate truth
- keep ordering deterministic
- shape data for UI/debug use

Selectors should not:
- mutate state
- invent fake source data

## slotId

The identity of an `OutputPreview` slot.

Example:
- `s001`

Purpose:
- identify one preview/publication slot in the `OutputPreview` node

Important rule:
- `slotId` is preview identity
- it is not the same as `partKeyStr`
- it is not the same as `outputEntryId`

## Source Identity

The identity of something in terms of graph/build origin.

Examples:
- `graphDocumentId`
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
- graph-document-based editing/runtime state

Important rule:
- Spaghetti is a front-end modeling system
- it compiles into the existing build/runtime pipeline

## Spaghetti Compiler

The layer that turns graph state into diagnostics, Feature Stack IR, and build inputs.

Current area:
- `src/app/spaghetti/compiler/`

It is not the worker.

## Viewport Result State

The selector-derived decision model that determines what a model viewport should currently show.

Current file:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`

It reasons about:
- artifact preview
- authoritative preview
- retained accepted base
- draft/final visibility
- fallback reasons
- active presentation state ids

Important rule:
- Viewport Result State is a rendering/presentation decision layer
- it is not canonical build truth

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

The identity used by the viewer/render layer for one renderable preview item.

In current logic:
- a preview VM item often starts with `viewerKey = outputEntryId`
- viewer keys may then be graph-document-qualified
- geometry preview paths also mint special keys such as `graph-document-id:authoritative-preview` and `graph-document-id:draft-preview`

Important rule:
- `viewerKey` is preview/render identity
- it is not the same as `partKeyStr`
- it is not always just `slotId`

## Worker Runtime

The isolated execution layer that actually performs deterministic build work.

Current area:
- `src/worker/`

It receives typed requests and returns typed results such as:
- `BuildResultBundle`
- geometry results

Important rule:
- worker runtime is execution
- it is not canonical UI/app state
