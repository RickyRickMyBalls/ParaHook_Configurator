import { describe, expect, it } from 'vitest'
import type { ViewerRenderablePart } from '../../shared/buildTypes'
import type { ViewportLayerRecipe } from '../spaghetti/selectors/selectViewportResultState'
import type { BuildPathEvent } from './buildPathEvents'
import {
  applyBuildPathViewportPreviewMaskToLayerRecipe,
  deriveBuildPathViewportPreviewRead,
} from './buildPathViewportPreview'
import { deriveBuildPathMasterTimeline } from './buildPathTimeline'

const createBuildPathEvent = ({
  affectedNodeIds,
  affectedOutputIds,
  commandFamily,
  eventSequence,
  projectionId,
}: {
  commandFamily: BuildPathEvent['commandFamily']
  eventSequence: number
  projectionId: string
  affectedNodeIds?: string[]
  affectedOutputIds?: string[]
}): BuildPathEvent => ({
  buildPathEventId: ['build-path-event', eventSequence.toString(), projectionId].join(':'),
  sourceProjectionId: projectionId,
  sourceKind: 'recorded',
  graphDocumentId: 'graph-document-1',
  commandFamily,
  entryPoint: 'console-root',
  eventSequence,
  affectedNodeIds: affectedNodeIds ?? [`node-${projectionId}`],
  affectedEdgeIds: [],
  affectedOutputIds: affectedOutputIds ?? [],
  mutationSummary: {
    createdNodeIds: affectedNodeIds ?? [`node-${projectionId}`],
    reusedNodeIds: [],
    updatedNodeIds: [],
    addedEdgeIds: [],
    removedEdgeIds: [],
  },
  buildResultState:
    affectedOutputIds !== undefined && affectedOutputIds.length > 0
      ? { kind: 'linked', buildResultId: `build-result-${eventSequence}` }
      : { kind: 'pending' },
  timelineRole: 'unclassified',
})

const createViewerPart = (viewerKey: string): ViewerRenderablePart => ({
  viewerKey,
  artifact: {
    id: viewerKey,
    label: viewerKey,
    kind: 'box',
    params: { width: 1, length: 1, height: 1 },
    partKey: { id: viewerKey, instance: null },
    partKeyStr: viewerKey,
  },
})

const createLayerRecipe = (baseParts: ViewerRenderablePart[]): ViewportLayerRecipe => ({
  kind: 'base-only',
  baseParts,
  basePresentationStateId: 'lastLoaded',
  baselineParts: [],
  baselinePresentationStateId: null,
  baselineUsesDimmedBaseStyle: false,
  overlayParts: [],
  overlayPresentationStateId: null,
  overlayOpacity: 0.5,
})

describe('deriveBuildPathViewportPreviewRead', () => {
  it('marks later output ids as excluded when an earlier step is selected', () => {
    const timeline = deriveBuildPathMasterTimeline([
      createBuildPathEvent({
        commandFamily: 'Sketch',
        eventSequence: 1,
        projectionId: 'projection-sketch',
        affectedNodeIds: ['node-sketch'],
      }),
      createBuildPathEvent({
        commandFamily: 'Extrude',
        eventSequence: 2,
        projectionId: 'projection-extrude',
        affectedNodeIds: ['node-extrude'],
        affectedOutputIds: ['output-entry:s001:node-extrude'],
      }),
    ])

    const previewRead = deriveBuildPathViewportPreviewRead({
      selectedTimelineStepId: timeline.steps[0].timelineStepId,
      timeline,
    })

    expect(previewRead).toMatchObject({
      status: 'preview-ready',
      mappingStrategy: 'output-id-and-source-node-id',
      selectedTimelineStepId: timeline.steps[0].timelineStepId,
      excludedOutputIds: ['output-entry:s001:node-extrude'],
      excludedNodeIds: ['node-extrude'],
      isViewOnly: true,
      mutatesGraphTruth: false,
      mutatesEditHistory: false,
      mutatesBrowserVisibility: false,
    })
  })

  it('uses source node ids as a preview fallback when live output ids are unavailable', () => {
    const timeline = deriveBuildPathMasterTimeline([
      createBuildPathEvent({
        commandFamily: 'Sketch',
        eventSequence: 1,
        projectionId: 'projection-sketch',
        affectedNodeIds: ['node-sketch'],
      }),
      createBuildPathEvent({
        commandFamily: 'Extrude',
        eventSequence: 2,
        projectionId: 'projection-extrude',
        affectedNodeIds: ['node-extrude'],
      }),
    ])

    const previewRead = deriveBuildPathViewportPreviewRead({
      selectedTimelineStepId: timeline.steps[0].timelineStepId,
      timeline,
    })

    expect(previewRead.status).toBe('preview-ready')
    expect(previewRead.mappingStrategy).toBe('source-node-id')
    expect(previewRead.excludedOutputIds).toEqual([])
    expect(previewRead.excludedNodeIds).toEqual(['node-extrude'])
  })

  it('uses the first timeline step when no explicit scrub selection has been stored yet', () => {
    const timeline = deriveBuildPathMasterTimeline([
      createBuildPathEvent({
        commandFamily: 'Sketch',
        eventSequence: 1,
        projectionId: 'projection-sketch',
        affectedNodeIds: ['node-sketch'],
      }),
      createBuildPathEvent({
        commandFamily: 'Extrude',
        eventSequence: 2,
        projectionId: 'projection-extrude',
        affectedNodeIds: ['node-extrude'],
      }),
    ])

    const previewRead = deriveBuildPathViewportPreviewRead({
      selectedTimelineStepId: null,
      timeline,
    })

    expect(previewRead).toMatchObject({
      status: 'preview-ready',
      selectedTimelineStepId: timeline.steps[0].timelineStepId,
      excludedNodeIds: ['node-extrude'],
    })
  })

  it('returns final state when the latest step is selected', () => {
    const timeline = deriveBuildPathMasterTimeline([
      createBuildPathEvent({
        commandFamily: 'Sketch',
        eventSequence: 1,
        projectionId: 'projection-sketch',
      }),
      createBuildPathEvent({
        commandFamily: 'Extrude',
        eventSequence: 2,
        projectionId: 'projection-extrude',
      }),
    ])

    const previewRead = deriveBuildPathViewportPreviewRead({
      selectedTimelineStepId: timeline.steps[1].timelineStepId,
      timeline,
    })

    expect(previewRead).toMatchObject({
      status: 'final',
      mappingStrategy: 'none',
      selectedTimelineStepId: timeline.steps[1].timelineStepId,
      excludedOutputIds: [],
      excludedNodeIds: [],
    })
  })
})

describe('applyBuildPathViewportPreviewMaskToLayerRecipe', () => {
  it('removes later output parts from viewer layer presentation without changing the source recipe', () => {
    const sketchPart = createViewerPart('graph-document-1:output-entry:s001:node-sketch')
    const extrudePart = createViewerPart('graph-document-1:output-entry:s002:node-extrude')
    const timeline = deriveBuildPathMasterTimeline([
      createBuildPathEvent({
        commandFamily: 'Sketch',
        eventSequence: 1,
        projectionId: 'projection-sketch',
        affectedNodeIds: ['node-sketch'],
      }),
      createBuildPathEvent({
        commandFamily: 'Extrude',
        eventSequence: 2,
        projectionId: 'projection-extrude',
        affectedNodeIds: ['node-extrude'],
      }),
    ])
    const layerRecipe = createLayerRecipe([sketchPart, extrudePart])

    const previewRead = deriveBuildPathViewportPreviewRead({
      selectedTimelineStepId: timeline.steps[0].timelineStepId,
      timeline,
    })
    const maskedRecipe = applyBuildPathViewportPreviewMaskToLayerRecipe(
      layerRecipe,
      previewRead,
    )

    expect(maskedRecipe.baseParts.map((part) => part.viewerKey)).toEqual([
      'graph-document-1:output-entry:s001:node-sketch',
    ])
    expect(layerRecipe.baseParts.map((part) => part.viewerKey)).toEqual([
      'graph-document-1:output-entry:s001:node-sketch',
      'graph-document-1:output-entry:s002:node-extrude',
    ])
  })
})
