import type { PartArtifact, ViewerRenderablePart } from '../../../shared/buildTypes'
import { partKeyToString } from '../../../shared/buildTypes'
import type { CompileSpaghettiGraphResult } from '../compiler/compileGraph'
import { computeFeatureStackIrParts } from '../compiler/compileGraph'
import type { SpaghettiGraph, SpaghettiNode } from '../schema/spaghettiTypes'
import { OUTPUT_PREVIEW_NODE_TYPE } from '../system/outputPreviewNode'
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
  state: 'filled' | 'empty'
  sourceNodeId: string | null
  sourcePartKeyStr: string | null
  artifactPartKeyStr: string | null
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

const buildOutputPreviewSlots = (
  graph: SpaghettiGraph,
  buildOutputs: readonly PartArtifact[],
): DebugInspectorVm['outputPreview'] => {
  const outputPreviewNode = graph.nodes.find(isOutputPreviewNode)
  if (outputPreviewNode === undefined) {
    return {
      nodeId: null,
      slots: [],
    }
  }

  const partKeyByNodeId = computeFeatureStackIrParts(graph).nodeIdToPartKey
  const artifactByPartKey = new Map(buildOutputs.map((artifact) => [artifact.partKeyStr, artifact]))
  const slots: DebugOutputPreviewSlotRow[] = readSlotIds(outputPreviewNode).map((slotId) => {
    const matchingEdge = findMatchingIncomingSlotEdge(graph, outputPreviewNode.nodeId, slotId)
    const sourceNodeId = matchingEdge?.from.nodeId ?? null
    const sourcePartKeyStr =
      sourceNodeId === null ? null : (partKeyByNodeId[sourceNodeId] ?? null)
    const artifactPartKeyStr =
      sourcePartKeyStr === null ? null : (artifactByPartKey.get(sourcePartKeyStr)?.partKeyStr ?? null)
    return {
      slotId,
      state: matchingEdge === undefined ? 'empty' : 'filled',
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
  graph: SpaghettiGraph
  buildOutputs: PartArtifact[]
  compileResult: CompileSpaghettiGraphResult | null
  inputMode: 'legacy' | 'spaghetti'
  viewMode: 'parts' | 'assembled'
}): DebugInspectorVm => {
  const { graph, buildOutputs, compileResult, inputMode, viewMode } = options
  const previewVm = selectPreviewRenderVm(graph, buildOutputs)
  const viewerParts =
    inputMode === 'spaghetti' && viewMode === 'parts' ? previewVm.viewerParts : []

  return {
    compile: {
      hasCompile: compileResult !== null,
      ok: compileResult?.ok ?? null,
      orderedPartKeys: [...(compileResult?.buildInputs?.orderedPartKeys ?? [])],
      compiledArtifactsCount: buildOutputs.length,
      artifacts: buildArtifactRows(buildOutputs),
    },
    outputPreview: buildOutputPreviewSlots(graph, buildOutputs),
    previewVm: {
      renderEntryCount: previewVm.items.length,
      entries: buildPreviewRows(previewVm),
    },
    viewer: {
      receivesPreviewInput: inputMode === 'spaghetti' && viewMode === 'parts',
      reason:
        inputMode !== 'spaghetti'
          ? 'ViewerHost is using legacy part input.'
          : viewMode !== 'parts'
            ? 'ViewerHost is in assembled mode.'
            : 'ViewerHost is receiving spaghetti preview input.',
      renderableEntryCount: viewerParts.length,
      entries: buildViewerRows(viewerParts),
    },
  }
}
