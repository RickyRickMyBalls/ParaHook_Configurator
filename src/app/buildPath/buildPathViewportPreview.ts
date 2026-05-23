import type { ViewerRenderablePart } from '../../shared/buildTypes'
import type { ViewportLayerRecipe } from '../spaghetti/selectors/selectViewportResultState'
import type { BuildPathMasterTimeline } from './buildPathTimeline'

export type BuildPathViewportPreviewStatus =
  | 'empty'
  | 'final'
  | 'preview-ready'
  | 'insufficient-output-mapping'

export type BuildPathViewportPreviewMappingStrategy =
  | 'none'
  | 'output-id'
  | 'source-node-id'
  | 'output-id-and-source-node-id'

export type BuildPathViewportPreviewRead = {
  status: BuildPathViewportPreviewStatus
  mappingStrategy: BuildPathViewportPreviewMappingStrategy
  selectedTimelineStepId: string | null
  selectedGraphDocumentId: string | null
  includedTimelineStepIds: string[]
  excludedTimelineStepIds: string[]
  includedBuildPathEventIds: string[]
  excludedBuildPathEventIds: string[]
  includedOutputIds: string[]
  excludedOutputIds: string[]
  includedNodeIds: string[]
  excludedNodeIds: string[]
  isViewOnly: true
  mutatesGraphTruth: false
  mutatesEditHistory: false
  mutatesBrowserVisibility: false
}

const uniqueInOrder = (values: readonly string[]): string[] => {
  const seen = new Set<string>()
  const result: string[] = []

  values.forEach((value) => {
    if (value.length === 0 || seen.has(value)) {
      return
    }
    seen.add(value)
    result.push(value)
  })

  return result
}

const emptyPreviewRead = (
  status: Extract<BuildPathViewportPreviewStatus, 'empty' | 'final'>,
  selectedTimelineStepId: string | null = null,
  selectedGraphDocumentId: string | null = null,
): BuildPathViewportPreviewRead => ({
  status,
  mappingStrategy: 'none',
  selectedTimelineStepId,
  selectedGraphDocumentId,
  includedTimelineStepIds: [],
  excludedTimelineStepIds: [],
  includedBuildPathEventIds: [],
  excludedBuildPathEventIds: [],
  includedOutputIds: [],
  excludedOutputIds: [],
  includedNodeIds: [],
  excludedNodeIds: [],
  isViewOnly: true,
  mutatesGraphTruth: false,
  mutatesEditHistory: false,
  mutatesBrowserVisibility: false,
})

const resolveMappingStrategy = ({
  excludedNodeIds,
  excludedOutputIds,
}: {
  excludedNodeIds: readonly string[]
  excludedOutputIds: readonly string[]
}): {
  status: Extract<BuildPathViewportPreviewStatus, 'preview-ready' | 'insufficient-output-mapping'>
  mappingStrategy: BuildPathViewportPreviewMappingStrategy
} => {
  if (excludedOutputIds.length > 0 && excludedNodeIds.length > 0) {
    return {
      status: 'preview-ready',
      mappingStrategy: 'output-id-and-source-node-id',
    }
  }

  if (excludedOutputIds.length > 0) {
    return {
      status: 'preview-ready',
      mappingStrategy: 'output-id',
    }
  }

  if (excludedNodeIds.length > 0) {
    return {
      status: 'preview-ready',
      mappingStrategy: 'source-node-id',
    }
  }

  return {
    status: 'insufficient-output-mapping',
    mappingStrategy: 'none',
  }
}

export const deriveBuildPathViewportPreviewRead = ({
  selectedTimelineStepId,
  timeline,
}: {
  selectedTimelineStepId: string | null
  timeline: BuildPathMasterTimeline
}): BuildPathViewportPreviewRead => {
  if (timeline.steps.length === 0) {
    return emptyPreviewRead('empty')
  }

  const selectedStep =
    selectedTimelineStepId === null
      ? timeline.steps[0] ?? null
      : timeline.steps.find((step) => step.timelineStepId === selectedTimelineStepId) ?? null

  if (selectedStep === null || selectedStep.orderIndex >= timeline.steps.length - 1) {
    return emptyPreviewRead(
      'final',
      selectedStep?.timelineStepId ?? null,
      selectedStep?.eventReference.graphDocumentId ?? null,
    )
  }

  const includedSteps = timeline.steps.filter((step) => step.orderIndex <= selectedStep.orderIndex)
  const excludedSteps = timeline.steps.filter((step) => step.orderIndex > selectedStep.orderIndex)
  const excludedOutputIds = uniqueInOrder(
    excludedSteps.flatMap((step) => step.event.affectedOutputIds),
  )
  const excludedNodeIds = uniqueInOrder(
    excludedSteps.flatMap((step) => step.event.affectedNodeIds),
  )
  const { mappingStrategy, status } = resolveMappingStrategy({
    excludedNodeIds,
    excludedOutputIds,
  })

  return {
    status,
    mappingStrategy,
    selectedTimelineStepId: selectedStep.timelineStepId,
    selectedGraphDocumentId: selectedStep.eventReference.graphDocumentId,
    includedTimelineStepIds: includedSteps.map((step) => step.timelineStepId),
    excludedTimelineStepIds: excludedSteps.map((step) => step.timelineStepId),
    includedBuildPathEventIds: includedSteps.map((step) => step.eventReference.buildPathEventId),
    excludedBuildPathEventIds: excludedSteps.map((step) => step.eventReference.buildPathEventId),
    includedOutputIds: uniqueInOrder(includedSteps.flatMap((step) => step.event.affectedOutputIds)),
    excludedOutputIds,
    includedNodeIds: uniqueInOrder(includedSteps.flatMap((step) => step.event.affectedNodeIds)),
    excludedNodeIds,
    isViewOnly: true,
    mutatesGraphTruth: false,
    mutatesEditHistory: false,
    mutatesBrowserVisibility: false,
  }
}

const qualifyOutputId = (graphDocumentId: string | null, outputId: string): string =>
  graphDocumentId === null ? outputId : `${graphDocumentId}:${outputId}`

const readOutputEntrySourceNodeId = (viewerKey: string): string | null => {
  const outputEntryMarker = 'output-entry:'
  const outputEntryIndex = viewerKey.indexOf(outputEntryMarker)
  if (outputEntryIndex < 0) {
    return null
  }

  const outputEntrySuffix = viewerKey.slice(outputEntryIndex + outputEntryMarker.length)
  const [, sourceNodeId] = outputEntrySuffix.split(':')

  return sourceNodeId !== undefined && sourceNodeId.length > 0 && sourceNodeId !== 'unbound'
    ? sourceNodeId
    : null
}

export const isBuildPathViewportPreviewExcludedPart = (
  part: ViewerRenderablePart,
  previewRead: BuildPathViewportPreviewRead,
): boolean => {
  if (previewRead.status !== 'preview-ready') {
    return false
  }

  const excludedOutputKeys = new Set(
    previewRead.excludedOutputIds.flatMap((outputId) => [
      outputId,
      qualifyOutputId(previewRead.selectedGraphDocumentId, outputId),
    ]),
  )
  if (excludedOutputKeys.has(part.viewerKey)) {
    return true
  }

  const sourceNodeId = readOutputEntrySourceNodeId(part.viewerKey)

  return sourceNodeId !== null && previewRead.excludedNodeIds.includes(sourceNodeId)
}

const filterPreviewParts = (
  parts: readonly ViewerRenderablePart[],
  previewRead: BuildPathViewportPreviewRead,
): ViewerRenderablePart[] =>
  parts.filter((part) => !isBuildPathViewportPreviewExcludedPart(part, previewRead))

export const applyBuildPathViewportPreviewMaskToLayerRecipe = (
  layerRecipe: ViewportLayerRecipe,
  previewRead: BuildPathViewportPreviewRead,
): ViewportLayerRecipe => {
  if (previewRead.status !== 'preview-ready') {
    return layerRecipe
  }

  return {
    ...layerRecipe,
    baseParts: filterPreviewParts(layerRecipe.baseParts, previewRead),
    baselineParts: filterPreviewParts(layerRecipe.baselineParts, previewRead),
    overlayParts: filterPreviewParts(layerRecipe.overlayParts, previewRead),
  }
}
