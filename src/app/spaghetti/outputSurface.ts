import type { PartArtifact } from '../../shared/buildTypes'
import { artifactToPartKeyStr } from '../parts/partKeyResolver'
import type { GraphPreviewPreparation } from './previewPreparation'
import type { SpaghettiGraph } from './schema/spaghettiTypes'
import { readNormalizedOutputPreviewParams } from './system/outputPreviewNode'

export type GraphPublishedOutputState = 'empty' | 'unresolved' | 'resolved'
export type GraphPublishedOutputDiagnosticsState = 'none' | 'hasDiagnostics' | 'unknown'

export type GraphPublishedOutputEntry = {
  outputEntryId: string
  slotId: string
  sourceNodeId: string
  label: string
  state: GraphPublishedOutputState
  acceptedArtifactKey: string | null
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

export type GraphPublishedContentSurfaceRow =
  | {
      kind: 'object'
      object: GraphPublishedObjectSurfaceEntry
    }
  | {
      kind: 'component'
      componentLabel: string
      objects: GraphPublishedObjectSurfaceEntry[]
    }

export type GraphPublishedContentSurface = {
  graphDocumentId: string
  rows: GraphPublishedContentSurfaceRow[]
}

export const GRAPH_OUTPUT_SURFACE_VERSION = 1

export const buildGraphOutputEntryId = (
  slotId: string,
  sourceNodeId: string | null | undefined,
): string =>
  typeof sourceNodeId === 'string' && sourceNodeId.length > 0
    ? `output-entry:${slotId}:${sourceNodeId}`
    : `output-entry:${slotId}:unbound`

export const buildGraphOutputSurface = (options: {
  graphDocumentId: string
  previewPreparation: GraphPreviewPreparation
  acceptedBuildOutputs: readonly PartArtifact[]
  publishedAtBuildSeq: number | null
}): GraphOutputSurface => {
  const {
    graphDocumentId,
    previewPreparation,
    acceptedBuildOutputs,
    publishedAtBuildSeq,
  } = options
  const acceptedArtifactKeyByPartKey = new Map<string, string>()
  for (const artifact of acceptedBuildOutputs) {
    const partKey = artifactToPartKeyStr(artifact)
    if (!acceptedArtifactKeyByPartKey.has(partKey)) {
      acceptedArtifactKeyByPartKey.set(partKey, partKey)
    }
  }

  const entries = previewPreparation.outputSlotIds.map((slotId) => {
    const sourceNodeId = previewPreparation.sourceNodeIdBySlotId[slotId] ?? ''
    const sourcePartKey = previewPreparation.sourcePartKeyBySlotId[slotId]
    const rawStatus = previewPreparation.slotStatusBySlotId[slotId] ?? 'empty'
    const acceptedArtifactKey =
      sourcePartKey === undefined ? null : (acceptedArtifactKeyByPartKey.get(sourcePartKey) ?? null)

    let state: GraphPublishedOutputState = 'empty'
    let diagnosticsState: GraphPublishedOutputDiagnosticsState = 'none'

    if (rawStatus === 'empty' || sourceNodeId.length === 0) {
      state = 'empty'
      diagnosticsState = 'none'
    } else if (rawStatus === 'unresolved') {
      state = 'unresolved'
      diagnosticsState = 'hasDiagnostics'
    } else if (acceptedArtifactKey !== null) {
      state = 'resolved'
      diagnosticsState = 'none'
    } else {
      state = 'unresolved'
      diagnosticsState = 'unknown'
    }

    return {
      outputEntryId: buildGraphOutputEntryId(slotId, sourceNodeId),
      slotId,
      sourceNodeId,
      label: slotId,
      state,
      acceptedArtifactKey,
      diagnosticsState,
    } satisfies GraphPublishedOutputEntry
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
  const normalizedParams = readNormalizedOutputPreviewParams(
    graph,
    outputSurface?.entries.map((entry) => ({ slotId: entry.slotId })),
  )
  if (normalizedParams === null) {
    return null
  }
  const outputEntryBySlotId = new Map(
    (outputSurface?.entries ?? []).map((entry) => [entry.slotId, entry] as const),
  )
  const publishedObjects = normalizedParams.objects.flatMap((objectRow) => {
    const entry = outputEntryBySlotId.get(objectRow.slotId)
    if (entry === undefined || entry.state === 'empty') {
      return []
    }
    return [
      {
        objectId: objectRow.objectId,
        label: objectRow.label,
        outputEntryId: entry.outputEntryId,
        slotId: objectRow.slotId,
        sourceNodeId: entry.sourceNodeId.length ? entry.sourceNodeId : null,
        acceptedArtifactKey: entry.acceptedArtifactKey,
        state: entry.state,
      } satisfies GraphPublishedObjectSurfaceEntry,
    ]
  })

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
