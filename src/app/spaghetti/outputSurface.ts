import type {
  BuildResultBundle,
  BuildResultClass,
  BuildResultEntryStatus,
  PartArtifact,
} from '../../shared/buildTypes'
import { artifactToPartKeyStr } from '../parts/partKeyResolver'
import {
  getPreviewPreparationEntriesForSlot,
  type GraphPreviewPreparation,
} from './previewPreparation'
import { resolveEffectiveOutputPort } from './features/effectivePorts'
import type { SpaghettiGraph } from './schema/spaghettiTypes'
import { readNormalizedOutputPreviewParams, OUTPUT_PREVIEW_NODE_TYPE } from './system/outputPreviewNode'

export type GraphPublishedOutputState = 'empty' | 'unresolved' | 'resolved'
export type GraphPublishedOutputDiagnosticsState = 'none' | 'hasDiagnostics' | 'unknown'

export type GraphPublishedOutputEntry = {
  outputEntryId: string
  slotId: string
  sourceNodeId: string
  memberIndex?: number
  label: string
  state: GraphPublishedOutputState
  acceptedArtifactKey: string | null
  buildUnitId?: string | null
  resultEntryStatus?: BuildResultEntryStatus | null
  resultClass?: BuildResultClass | null
  diagnosticsState?: GraphPublishedOutputDiagnosticsState
}

export type GraphOutputSurface = {
  graphDocumentId: string
  publishedAtBuildSeq: number | null
  surfaceVersion: number
  entries: GraphPublishedOutputEntry[]
}

export type GraphPublishedObjectSurfaceEntry = {
  objectId: string
  label: string
  outputEntryId: string
  slotId: string
  sourceNodeId: string | null
  acceptedArtifactKey: string | null
  state: GraphPublishedOutputState
}

export type GraphPublishedCollectionSubcomponentSurfaceEntry = {
  subcomponentId: string
  label: string
  slotId: string
  objects: GraphPublishedObjectSurfaceEntry[]
}

export type GraphPublishedContentSurfaceRow =
  | {
      kind: 'object'
      object: GraphPublishedObjectSurfaceEntry
    }
  | {
      kind: 'component'
      componentLabel: string
      objects: GraphPublishedObjectSurfaceEntry[]
      directObjects?: GraphPublishedObjectSurfaceEntry[]
      subcomponents?: GraphPublishedCollectionSubcomponentSurfaceEntry[]
    }

export type GraphPublishedContentSurface = {
  graphDocumentId: string
  rows: GraphPublishedContentSurfaceRow[]
}

export const GRAPH_OUTPUT_SURFACE_VERSION = 1

export const buildGraphOutputEntryId = (
  slotId: string,
  sourceNodeId: string | null | undefined,
  memberIndex?: number | null,
  sourcePortId?: string | null,
): string =>
  typeof sourceNodeId === 'string' && sourceNodeId.length > 0
    ? memberIndex === null || memberIndex === undefined
      ? sourcePortId === null || sourcePortId === undefined || sourcePortId === 'SolidBody'
        ? `output-entry:${slotId}:${sourceNodeId}`
        : `output-entry:${slotId}:${sourceNodeId}:port-${encodeURIComponent(sourcePortId)}`
      : sourcePortId === null || sourcePortId === undefined || sourcePortId === 'SolidBody'
        ? `output-entry:${slotId}:${sourceNodeId}:member-${String(memberIndex + 1).padStart(3, '0')}`
        : `output-entry:${slotId}:${sourceNodeId}:port-${encodeURIComponent(sourcePortId)}:member-${String(memberIndex + 1).padStart(3, '0')}`
    : `output-entry:${slotId}:unbound`

export const buildGraphOutputEntryIdsForSlot = (
  slotId: string,
  entries: ReadonlyArray<{
    sourceNodeId: string
    sourcePortId: string
    memberIndex?: number
  }>,
): string[] => {
  const baseOutputEntryIds = entries.map((entry) =>
    buildGraphOutputEntryId(slotId, entry.sourceNodeId, entry.memberIndex),
  )
  const duplicateBaseOutputEntryIds = new Set<string>()
  const seenBaseOutputEntryIds = new Set<string>()
  for (const outputEntryId of baseOutputEntryIds) {
    if (seenBaseOutputEntryIds.has(outputEntryId)) {
      duplicateBaseOutputEntryIds.add(outputEntryId)
      continue
    }
    seenBaseOutputEntryIds.add(outputEntryId)
  }

  const seen = new Set<string>()
  return entries.map((entry, entryIndex) => {
    const baseOutputEntryId = baseOutputEntryIds[entryIndex]
    let outputEntryId = duplicateBaseOutputEntryIds.has(baseOutputEntryId)
      ? buildGraphOutputEntryId(slotId, entry.sourceNodeId, entry.memberIndex, entry.sourcePortId)
      : baseOutputEntryId
    if (seen.has(outputEntryId)) {
      outputEntryId = `${outputEntryId}:dup-${String(entryIndex + 1).padStart(3, '0')}`
    }
    seen.add(outputEntryId)
    return outputEntryId
  })
}

export const buildQualifiedGraphOutputEntryId = (
  graphDocumentId: string,
  outputEntryId: string | null | undefined,
): string | null =>
  typeof outputEntryId === 'string' && outputEntryId.length > 0
    ? `${graphDocumentId}:${outputEntryId}`
    : null

export const buildGraphOutputSurface = (options: {
  graphDocumentId: string
  previewPreparation: GraphPreviewPreparation
  acceptedBundle?: BuildResultBundle | null
  acceptedBuildOutputs?: readonly PartArtifact[]
  publishedAtBuildSeq: number | null
}): GraphOutputSurface => {
  const {
    graphDocumentId,
    previewPreparation,
    acceptedBundle = null,
    acceptedBuildOutputs = [],
    publishedAtBuildSeq,
  } = options
  const bundleEntryByOutputEntryId = new Map(
    (acceptedBundle?.entries ?? []).map((entry) => [entry.outputEntryId, entry] as const),
  )
  const acceptedArtifactKeyByPartKey = new Map<string, string>()
  for (const artifact of acceptedBuildOutputs) {
    const partKey = artifactToPartKeyStr(artifact)
    if (!acceptedArtifactKeyByPartKey.has(partKey)) {
      acceptedArtifactKeyByPartKey.set(partKey, partKey)
    }
  }

  const entries = previewPreparation.outputSlotIds.flatMap((slotId) => {
    const slotEntries = getPreviewPreparationEntriesForSlot(previewPreparation, slotId)
    const rawStatus = previewPreparation.slotStatusBySlotId[slotId] ?? 'empty'
    if (slotEntries.length === 0) {
      return [
        {
          outputEntryId: buildGraphOutputEntryId(slotId, ''),
          slotId,
          sourceNodeId: '',
          label: slotId,
          state: rawStatus === 'unresolved' ? ('unresolved' as const) : ('empty' as const),
          acceptedArtifactKey: null,
          buildUnitId: null,
          resultEntryStatus: null,
          resultClass: null,
          diagnosticsState: rawStatus === 'unresolved' ? ('hasDiagnostics' as const) : ('none' as const),
        } satisfies GraphPublishedOutputEntry,
      ]
    }

    const outputEntryIds = buildGraphOutputEntryIdsForSlot(slotId, slotEntries)
    return slotEntries.map((entry, entryIndex) => {
      const outputEntryId = outputEntryIds[entryIndex]
      const bundleEntry = bundleEntryByOutputEntryId.get(outputEntryId) ?? null
      const acceptedArtifactKey =
        bundleEntry?.artifacts[0]?.partKeyStr ??
        (acceptedArtifactKeyByPartKey.get(entry.sourcePartKeyStr) ?? null)

      let state: GraphPublishedOutputState = 'empty'
      let diagnosticsState: GraphPublishedOutputDiagnosticsState = 'none'

      if (rawStatus === 'empty' || entry.sourceNodeId.length === 0) {
        state = 'empty'
        diagnosticsState = 'none'
      } else if (rawStatus === 'unresolved') {
        state = 'unresolved'
        diagnosticsState = 'hasDiagnostics'
      } else if (bundleEntry?.status === 'evicted') {
        state = 'unresolved'
        diagnosticsState = 'unknown'
      } else if (acceptedArtifactKey !== null) {
        state = 'resolved'
        diagnosticsState = 'none'
      } else {
        state = 'unresolved'
        diagnosticsState = 'unknown'
      }

      return {
        outputEntryId,
        slotId,
        sourceNodeId: entry.sourceNodeId,
        ...(entry.memberIndex === undefined ? {} : { memberIndex: entry.memberIndex }),
        label: slotId,
        state,
        acceptedArtifactKey,
        buildUnitId: bundleEntry?.buildUnitId ?? null,
        resultEntryStatus: bundleEntry?.status ?? null,
        resultClass: bundleEntry?.resultClass ?? null,
        diagnosticsState,
      } satisfies GraphPublishedOutputEntry
    })
  })

  return {
    graphDocumentId,
    publishedAtBuildSeq,
    surfaceVersion: GRAPH_OUTPUT_SURFACE_VERSION,
    entries,
  }
}

export const buildGraphPublishedContentSurface = (options: {
  graphDocumentId: string
  graph: SpaghettiGraph
  outputSurface: GraphOutputSurface | null | undefined
}): GraphPublishedContentSurface | null => {
  const { graph, graphDocumentId, outputSurface } = options
  const normalizedParams = readNormalizedOutputPreviewParams(graph)
  if (normalizedParams === null) {
    return null
  }
  const outputPreviewNodeId =
    graph.nodes.find((node) => node.type === OUTPUT_PREVIEW_NODE_TYPE)?.nodeId ?? null
  const outputEntriesBySlotId = new Map<string, GraphOutputSurface['entries']>()
  for (const entry of outputSurface?.entries ?? []) {
    const existing = outputEntriesBySlotId.get(entry.slotId)
    if (existing === undefined) {
      outputEntriesBySlotId.set(entry.slotId, [entry])
      continue
    }
    existing.push(entry)
  }
  const graphNodesById = new Map(graph.nodes.map((node) => [node.nodeId, node] as const))
  const collectionSourceFlagsBySlotId = new Map<string, boolean[]>()
  if (outputPreviewNodeId !== null) {
    for (const edge of graph.edges) {
      if (edge.to.nodeId !== outputPreviewNodeId || !edge.to.portId.startsWith('in:solid:')) {
        continue
      }
      const slotId = edge.to.portId.slice('in:solid:'.length)
      const sourceNode = graphNodesById.get(edge.from.nodeId)
      const effectiveOutputPort =
        sourceNode === undefined
          ? undefined
          : resolveEffectiveOutputPort(sourceNode, edge.from.portId, undefined, graph)
      const isCollectionSourcePort =
        effectiveOutputPort?.type.kind === 'solidBodies' || edge.from.portId === 'SolidBodies'
      const existing = collectionSourceFlagsBySlotId.get(slotId)
      if (existing === undefined) {
        collectionSourceFlagsBySlotId.set(slotId, [isCollectionSourcePort])
        continue
      }
      existing.push(isCollectionSourcePort)
    }
  }

  const publishedSlotRows = normalizedParams.objects.flatMap((objectRow) => {
    const entries = outputEntriesBySlotId.get(objectRow.slotId) ?? []
    if (entries.length === 0) {
      return []
    }
    const objects = entries.flatMap((entry, memberIndex) => {
      if (entry.state === 'empty') {
        return []
      }
      const needsIndexedObjectIdentity = entries.length > 1
      const suffix = needsIndexedObjectIdentity ? ` ${memberIndex + 1}` : ''
      const objectId = needsIndexedObjectIdentity
        ? `${objectRow.objectId}:member-${String(memberIndex + 1).padStart(3, '0')}`
        : objectRow.objectId
      return [
        {
          objectId,
          label: `${objectRow.label}${suffix}`,
          outputEntryId: entry.outputEntryId,
          slotId: objectRow.slotId,
          sourceNodeId: entry.sourceNodeId.length ? entry.sourceNodeId : null,
          acceptedArtifactKey: entry.acceptedArtifactKey,
          state: entry.state,
        } satisfies GraphPublishedObjectSurfaceEntry,
      ]
    })
    if (objects.length === 0) {
      return []
    }
    const collectionSourceFlags = collectionSourceFlagsBySlotId.get(objectRow.slotId) ?? []
    const hasCollectionSourcePort = collectionSourceFlags.some(Boolean)
    return [
      {
        slotId: objectRow.slotId,
        label: objectRow.label,
        objects,
        isCollectionRow: hasCollectionSourcePort,
      },
    ]
  })

  const publishedObjects = publishedSlotRows.flatMap((slotRow) => slotRow.objects)

  if (publishedObjects.length === 0) {
    return {
      graphDocumentId,
      rows: [],
    }
  }
  if (publishedObjects.length === 1) {
    return {
      graphDocumentId,
      rows: [{ kind: 'object', object: publishedObjects[0] }],
    }
  }
  const collectionSlotRows = publishedSlotRows.filter((slotRow) => slotRow.isCollectionRow)
  const directSlotRows = publishedSlotRows.filter((slotRow) => !slotRow.isCollectionRow)
  const shouldMaterializeCollectionSubcomponents =
    collectionSlotRows.length >= 2 || (collectionSlotRows.length >= 1 && directSlotRows.length >= 1)
  if (!shouldMaterializeCollectionSubcomponents) {
    return {
      graphDocumentId,
      rows: [
        {
          kind: 'component',
          componentLabel: normalizedParams.componentLabel,
          objects: publishedObjects,
        },
      ],
    }
  }
  return {
    graphDocumentId,
    rows: [
      {
        kind: 'component',
        componentLabel: normalizedParams.componentLabel,
        objects: publishedObjects,
        ...(directSlotRows.length > 0
          ? { directObjects: directSlotRows.flatMap((slotRow) => slotRow.objects) }
          : {}),
        subcomponents: collectionSlotRows.map((slotRow) => ({
          subcomponentId: `${normalizedParams.objects.find((objectRow) => objectRow.slotId === slotRow.slotId)?.objectId ?? `output-subcomponent:${slotRow.slotId}`}:collection`,
          label: slotRow.label,
          slotId: slotRow.slotId,
          objects: slotRow.objects,
        })),
      },
    ],
  }
}
