import type { PartArtifact, ViewerRenderablePart } from '../../../shared/buildTypes'
import { partKeyToString } from '../../../shared/buildTypes'
import type { CompileSpaghettiGraphResult } from '../compiler/compileGraph'
import { computeFeatureStackIrParts } from '../compiler/compileGraph'
import { evaluateSpaghettiGraph } from '../compiler/evaluateGraph'
import {
  classifyExtrudeProfileContributorEdge,
  isProfileOutputLike,
  isSketchProfilesValue,
  isWholeExtrusionProfileTargetEndpoint,
  type ExtrudeProfileContributor,
} from '../features/extrudeProfileConnections'
import type { GraphOutputSurface } from '../outputSurface'
import type { SpaghettiGraph, SpaghettiNode } from '../schema/spaghettiTypes'
import {
  OUTPUT_PREVIEW_DEFAULT_PUBLICATION_MODE,
  OUTPUT_PREVIEW_NODE_TYPE,
  readNormalizedOutputPreviewParams,
} from '../system/outputPreviewNode'
import {
  selectPreviewRenderVm,
  type PreviewRenderVm,
} from './selectPreviewRenderVm'

export type DebugArtifactRow = {
  id: string
  label: string
  partKey: string
  partKeyStr: string
}

export type DebugOutputPreviewSlotRow = {
  slotId: string
  publicationMode: 'grouped' | 'split'
  state: 'empty' | 'unresolved' | 'resolved'
  sourceNodeId: string | null
  sourcePartKeyStr: string | null
  artifactPartKeyStr: string | null
}

export type DebugExtrudeProfileEdgeRow = {
  edgeId: string
  fromNodeId: string
  fromPortId: string
  fromPath: string | null
  toNodeId: string
  toPortId: string
  toPath: string | null
  rawEdgeJson: string
}

export type DebugExtrudeConnectedOutputPreviewSlotRow = {
  slotId: string
  publicationMode: 'grouped' | 'split'
  objectLabel: string | null
  edgeId: string
}

export type DebugExtrudeCaptureRow = {
  nodeId: string
  profileInputSummary: string
  solidBodySummary: string
  incomingProfileEdges: DebugExtrudeProfileEdgeRow[]
  connectedOutputPreviewSlots: DebugExtrudeConnectedOutputPreviewSlotRow[]
}

export type DebugPreviewRenderRow = {
  viewerKey: string
  slotId: string
  sourceNodeId: string
  sourcePartKeyStr: string
  sourceArtifactId: string | null
  sourceArtifactPartKeyStr: string | null
}

export type DebugViewerInputRow = {
  viewerKey: string
  artifactId: string
  artifactLabel: string
  artifactPartKey: string
  artifactPartKeyStr: string
}

export type DebugInspectorVm = {
  graphDocumentId: string | null
  compile: {
    hasCompile: boolean
    ok: boolean | null
    orderedPartKeys: string[]
    compiledArtifactsCount: number
    artifacts: DebugArtifactRow[]
  }
  outputPreview: {
    nodeId: string | null
    slots: DebugOutputPreviewSlotRow[]
  }
  extrudeCapture: {
    extrudes: DebugExtrudeCaptureRow[]
  }
  previewVm: {
    renderEntryCount: number
    entries: DebugPreviewRenderRow[]
  }
  viewer: {
    receivesPreviewInput: boolean
    reason: string
    renderableEntryCount: number
    entries: DebugViewerInputRow[]
  }
}

const isOutputPreviewNode = (node: SpaghettiNode): boolean =>
  node.type === OUTPUT_PREVIEW_NODE_TYPE

const readSlotIds = (node: SpaghettiNode): string[] => {
  const rawSlots = (node.params as { slots?: unknown }).slots
  if (!Array.isArray(rawSlots)) {
    return []
  }
  return rawSlots.flatMap((slot) => {
    if (
      typeof slot !== 'object' ||
      slot === null ||
      typeof (slot as { slotId?: unknown }).slotId !== 'string'
    ) {
      return []
    }
    const slotId = (slot as { slotId: string }).slotId
    return slotId.length > 0 ? [slotId] : []
  })
}

const findMatchingIncomingSlotEdge = (
  graph: SpaghettiGraph,
  outputPreviewNodeId: string,
  slotId: string,
): SpaghettiGraph['edges'][number] | undefined => {
  const targetPortId = `in:solid:${slotId}`
  return graph.edges.find(
    (edge) => edge.to.nodeId === outputPreviewNodeId && edge.to.portId === targetPortId,
  )
}

const buildArtifactRows = (buildOutputs: readonly PartArtifact[]): DebugArtifactRow[] =>
  buildOutputs.map((artifact) => ({
    id: artifact.id,
    label: artifact.label,
    partKey: partKeyToString(artifact.partKey),
    partKeyStr: artifact.partKeyStr,
  }))

const readOutputPreviewPublicationModeBySlotId = (
  graph: SpaghettiGraph,
): ReadonlyMap<string, 'grouped' | 'split'> =>
  new Map(
    (readNormalizedOutputPreviewParams(graph)?.slots ?? []).map((slot) => [
      slot.slotId,
      slot.publicationMode ?? OUTPUT_PREVIEW_DEFAULT_PUBLICATION_MODE,
    ]),
  )

const buildOutputPreviewSlots = (
  graph: SpaghettiGraph,
  outputSurface: GraphOutputSurface | null,
  buildOutputs: readonly PartArtifact[],
): DebugInspectorVm['outputPreview'] => {
  const outputPreviewNode = graph.nodes.find(isOutputPreviewNode)
  const publicationModeBySlotId = readOutputPreviewPublicationModeBySlotId(graph)
  if (outputPreviewNode === undefined) {
    return {
      nodeId: null,
      slots: [],
    }
  }

  const partKeyByNodeId = computeFeatureStackIrParts(graph).nodeIdToPartKey
  const artifactByPartKey = new Map(buildOutputs.map((artifact) => [artifact.partKeyStr, artifact]))
  const slots: DebugOutputPreviewSlotRow[] = (outputSurface?.entries ?? readSlotIds(outputPreviewNode).map((slotId) => ({
    slotId,
    sourceNodeId: findMatchingIncomingSlotEdge(graph, outputPreviewNode.nodeId, slotId)?.from.nodeId ?? '',
    state: findMatchingIncomingSlotEdge(graph, outputPreviewNode.nodeId, slotId) === undefined
      ? 'empty'
      : 'resolved',
    acceptedArtifactKey: null,
    outputEntryId: `debug-fallback:${slotId}`,
    label: slotId,
  }))).map((entry) => {
    const sourceNodeId = entry.sourceNodeId.length > 0 ? entry.sourceNodeId : null
    const sourcePartKeyStr =
      sourceNodeId === null ? null : (partKeyByNodeId[sourceNodeId] ?? null)
    const artifactPartKeyStr =
      entry.acceptedArtifactKey === null
        ? (sourcePartKeyStr === null ? null : (artifactByPartKey.get(sourcePartKeyStr)?.partKeyStr ?? null))
        : (artifactByPartKey.get(entry.acceptedArtifactKey)?.partKeyStr ?? entry.acceptedArtifactKey)
    return {
      slotId: entry.slotId,
      publicationMode:
        publicationModeBySlotId.get(entry.slotId) ?? OUTPUT_PREVIEW_DEFAULT_PUBLICATION_MODE,
      state: entry.state,
      sourceNodeId,
      sourcePartKeyStr,
      artifactPartKeyStr,
    }
  })

  return {
    nodeId: outputPreviewNode.nodeId,
    slots,
  }
}

const formatPath = (path: string[] | undefined): string | null =>
  path === undefined || path.length === 0 ? null : path.join('.')

const isSolidBodyLike = (value: unknown): value is { bodyId: string } =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as { bodyId?: unknown }).bodyId === 'string'

const isSolidBodiesLike = (value: unknown): value is { bodies: unknown[] } =>
  typeof value === 'object' &&
  value !== null &&
  Array.isArray((value as { bodies?: unknown[] }).bodies)

const describeExtrudeProfileInput = (
  value: unknown,
  contributors: readonly ExtrudeProfileContributor[],
): string => {
  if (isSketchProfilesValue(value)) {
    if (contributors.some((contributor) => contributor.kind === 'aggregate')) {
      return `aggregate profiles (${value.length})`
    }
    if (contributors.length === 1 && contributors[0]?.kind === 'single' && value.length === 1) {
      return `single profile (${value[0].profileId})`
    }
    return `profiles (${value.length})`
  }
  if (isProfileOutputLike(value)) {
    return `single profile (${value.profileId})`
  }
  if (value === undefined) {
    return 'missing'
  }
  if (value === null) {
    return 'null'
  }
  return typeof value
}

const describeExtrudeSolidBodyOutput = (value: unknown): string => {
  if (isSolidBodiesLike(value)) {
    return `solidBodies (${value.bodies.length})`
  }
  if (isSolidBodyLike(value)) {
    return `solidBody (${value.bodyId})`
  }
  if (value === undefined) {
    return 'missing'
  }
  if (value === null) {
    return 'null'
  }
  return typeof value
}

const buildExtrudeCapture = (
  graph: SpaghettiGraph,
): DebugInspectorVm['extrudeCapture'] => {
  const evaluation = evaluateSpaghettiGraph(graph)
  const normalizedOutputPreviewParams = readNormalizedOutputPreviewParams(graph)
  const publicationModeBySlotId = readOutputPreviewPublicationModeBySlotId(graph)
  const objectLabelBySlotId = new Map(
    (normalizedOutputPreviewParams?.objects ?? []).map((objectRow) => [objectRow.slotId, objectRow.label] as const),
  )

  const extrudes = graph.nodes
    .filter((node) => node.type === 'Geometry/Extrude')
    .map((node) => {
      const incomingProfileContributors = graph.edges
        .filter(
          (edge) =>
            edge.to.nodeId === node.nodeId && isWholeExtrusionProfileTargetEndpoint(edge.to),
        )
        .map((edge) => {
          const contributor = classifyExtrudeProfileContributorEdge(edge)
          return contributor === null ? null : { edge, contributor }
        })
        .filter(
          (
            entry,
          ): entry is { edge: SpaghettiGraph['edges'][number]; contributor: ExtrudeProfileContributor } =>
            entry !== null,
        )
      const incomingProfileEdges = incomingProfileContributors.map(({ edge }) => ({
          edgeId: edge.edgeId,
          fromNodeId: edge.from.nodeId,
          fromPortId: edge.from.portId,
          fromPath: formatPath(edge.from.path),
          toNodeId: edge.to.nodeId,
          toPortId: edge.to.portId,
          toPath: formatPath(edge.to.path),
          rawEdgeJson: JSON.stringify(edge),
        }))
      const connectedOutputPreviewSlots = graph.nodes
        .filter(isOutputPreviewNode)
        .flatMap((outputPreviewNode) =>
          graph.edges
            .filter(
              (edge) =>
                edge.from.nodeId === node.nodeId &&
                edge.to.nodeId === outputPreviewNode.nodeId &&
                edge.to.portId.startsWith('in:solid:'),
            )
            .map((edge) => {
              const slotId = edge.to.portId.slice('in:solid:'.length)
              return {
                slotId,
                publicationMode:
                  publicationModeBySlotId.get(slotId) ?? OUTPUT_PREVIEW_DEFAULT_PUBLICATION_MODE,
                objectLabel: objectLabelBySlotId.get(slotId) ?? null,
                edgeId: edge.edgeId,
              }
            }),
        )

      return {
        nodeId: node.nodeId,
        profileInputSummary: describeExtrudeProfileInput(
          evaluation.inputsByNodeId[node.nodeId]?.ExtrusionProfile,
          incomingProfileContributors.map((entry) => entry.contributor),
        ),
        solidBodySummary: describeExtrudeSolidBodyOutput(
          evaluation.outputsByNodeId[node.nodeId]?.SolidBody,
        ),
        incomingProfileEdges,
        connectedOutputPreviewSlots,
      }
    })

  return {
    extrudes,
  }
}

const buildPreviewRows = (previewVm: PreviewRenderVm): DebugPreviewRenderRow[] =>
  previewVm.items.map((item) => ({
    viewerKey: item.viewerKey,
    slotId: item.slotId,
    sourceNodeId: item.sourceNodeId,
    sourcePartKeyStr: item.sourcePartKeyStr,
    sourceArtifactId: item.renderable?.id ?? null,
    sourceArtifactPartKeyStr: item.renderable?.partKeyStr ?? null,
  }))

const buildViewerRows = (
  viewerParts: readonly ViewerRenderablePart[],
): DebugViewerInputRow[] =>
  viewerParts.map((item) => ({
    viewerKey: item.viewerKey,
    artifactId: item.artifact.id,
    artifactLabel: item.artifact.label,
    artifactPartKey: partKeyToString(item.artifact.partKey),
    artifactPartKeyStr: item.artifact.partKeyStr,
  }))

export const selectDebugInspectorVm = (options: {
  graphDocumentId?: string | null
  graph: SpaghettiGraph
  outputSurface: GraphOutputSurface | null
  buildOutputs: PartArtifact[]
  compileResult: CompileSpaghettiGraphResult | null
}): DebugInspectorVm => {
  const { graph, outputSurface, buildOutputs, compileResult } = options
  const previewVm = selectPreviewRenderVm(graph, buildOutputs)
  const viewerParts = previewVm.viewerParts

  return {
    graphDocumentId: options.graphDocumentId ?? null,
    compile: {
      hasCompile: compileResult !== null,
      ok: compileResult?.ok ?? null,
      orderedPartKeys: [...(compileResult?.buildInputs?.orderedPartKeys ?? [])],
      compiledArtifactsCount: buildOutputs.length,
      artifacts: buildArtifactRows(buildOutputs),
    },
    outputPreview: buildOutputPreviewSlots(graph, outputSurface, buildOutputs),
    extrudeCapture: buildExtrudeCapture(graph),
    previewVm: {
      renderEntryCount: previewVm.items.length,
      entries: buildPreviewRows(previewVm),
    },
    viewer: {
      receivesPreviewInput: true,
      reason: 'ViewerHost is receiving spaghetti preview input.',
      renderableEntryCount: viewerParts.length,
      entries: buildViewerRows(viewerParts),
    },
  }
}
