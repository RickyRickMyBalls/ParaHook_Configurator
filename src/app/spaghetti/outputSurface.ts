import type { PartArtifact } from '../../shared/buildTypes'
import { artifactToPartKeyStr } from '../parts/partKeyResolver'
import type { GraphPreviewPreparation } from './previewPreparation'

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

export const GRAPH_OUTPUT_SURFACE_VERSION = 1

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
      outputEntryId:
        sourceNodeId.length > 0
          ? `output-entry:${slotId}:${sourceNodeId}`
          : `output-entry:${slotId}:unbound`,
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
