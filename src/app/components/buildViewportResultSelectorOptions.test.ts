import { describe, expect, it } from 'vitest'
import { toViewerRenderablePart, type PartArtifact } from '../../shared/buildTypes'
import {
  createAuthoritativeGeometryResultBundle,
  createDraftGeometryResultBundle,
} from '../../shared/geometryResult'
import type { GraphPreviewPreparation } from '../spaghetti/previewPreparation'
import type { GraphDocument } from '../spaghetti/schema/spaghettiTypes'
import { selectViewportResultState } from '../spaghetti/selectors/selectViewportResultState'
import type { SpaghettiStoreState } from '../spaghetti/store/useSpaghettiStore'
import type { AppState, RenderedProjectPartSetVm } from '../store/useAppStore'
import { resolveWorkspaceViewportResultModeBehavior } from '../workspace/workspaceViewportResultMode'
import { buildViewportResultSelectorOptions } from './buildViewportResultSelectorOptions'

const createArtifact = (partKeyStr: string): PartArtifact => ({
  id: `artifact:${partKeyStr}`,
  kind: 'box',
  label: partKeyStr,
  partKeyStr,
  partKey: { id: partKeyStr, instance: null },
  params: { width: 10, length: 20, height: 5 },
})

const createPreviewPreparation = (
  slots: Array<{
    slotId: string
    sourceNodeId: string
    sourcePartKey: string
    status?: 'ok' | 'empty' | 'unresolved'
  }>,
): GraphPreviewPreparation => ({
  outputPreviewNodeId: 'node-output-preview-1',
  outputSlotIds: slots.map((slot) => slot.slotId),
  previewCandidateSlotIds: slots.map((slot) => slot.slotId),
  previewCandidatePartKeys: slots.map((slot) => slot.sourcePartKey),
  sourceNodeIdBySlotId: Object.fromEntries(slots.map((slot) => [slot.slotId, slot.sourceNodeId])),
  sourcePartKeyBySlotId: Object.fromEntries(
    slots.map((slot) => [slot.slotId, slot.sourcePartKey]),
  ),
  sourcePortIdBySlotId: Object.fromEntries(
    slots.map((slot) => [slot.slotId, `out:${slot.sourcePartKey}`]),
  ),
  sourcePartKeyByNodeId: Object.fromEntries(
    slots.map((slot) => [slot.sourceNodeId, slot.sourcePartKey]),
  ),
  slotStatusBySlotId: Object.fromEntries(slots.map((slot) => [slot.slotId, slot.status ?? 'ok'])),
  buildStatsReadyPartKeys: [],
  previewIntent: 'outputPreview',
})

const createCurrentProject = (
  graphDocumentIds: string[],
): AppState['currentProject'] =>
  ({
    graphDocuments: graphDocumentIds.map((graphDocumentId) => ({ graphDocumentId })),
  }) as AppState['currentProject']

const createProjectContent = (): AppState['projectContent'] =>
  ({
    componentsById: {},
    objectsById: {},
  }) as AppState['projectContent']

const createRenderedProjectPartSet = (): RenderedProjectPartSetVm => {
  const artifact = createArtifact('part-1')
  const viewerPart = toViewerRenderablePart(artifact, 'viewer-part-1')
  return {
    parts: [],
    viewerParts: [viewerPart],
    contributingGraphDocumentIds: [],
  }
}

const createGraphDocumentsById = (
  graphDocumentIds: string[],
): Record<string, GraphDocument> =>
  Object.fromEntries(
    graphDocumentIds.map((graphDocumentId) => [graphDocumentId, {} as GraphDocument]),
  )

describe('buildViewportResultSelectorOptions', () => {
  it('keeps browser policy inert when no target graph document is selected', () => {
    const renderedProjectPartSet = createRenderedProjectPartSet()

    const options = buildViewportResultSelectorOptions({
      currentProject: createCurrentProject([]),
      projectContent: createProjectContent(),
      browserGraphBuildPolicyByGraphDocumentId: {},
      browserContentBuildPolicyByRowId: {},
      browserInteractionGraphDocumentIds: {},
      isInteracting: false,
      delayedDraftBuildByGraphDocumentId: {},
      delayedAuthoritativeBuildByGraphDocumentId: {},
      requestedMode: 'auto',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('auto'),
      renderedProjectPartSet,
      graphDocumentsById: {},
      viewerTargetGraphDocumentId: null,
      sharedViewerComposition: null,
      sketchPlanePickSession: null,
      acceptedAuthoritativeGeometryResult: null,
      previewReadyAuthoritativeGeometryResult: null,
      acceptedDraftGeometryResult: null,
      committedAuthoritativeGeometryResult: null,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildBundle: null,
      acceptedPreviewBuildOutputs: [],
      previewPreparation: null,
    })

    expect(options.browserExecutionPolicy).toBe('live')
    expect(options.suppressViewerTargetArtifactPreview).toBe(false)
    expect(options.useProjectDraftPreview).toBe(false)
    expect(options.isInteractionActive).toBe(false)
    expect(options.hasDelayedDraftPlaceholder).toBe(false)
    expect(options.hasDelayedAuthoritativePlaceholder).toBe(false)
    expect(options.activeDraftProjectViewerParts).toEqual(renderedProjectPartSet.viewerParts)
  })

  it('derives graph-target policy, placeholder, and draft-preview inputs from shared state', () => {
    const graphDocumentId = 'graph-document-1'
    const renderedProjectPartSet = createRenderedProjectPartSet()

    const options = buildViewportResultSelectorOptions({
      currentProject: createCurrentProject([]),
      projectContent: createProjectContent(),
      browserGraphBuildPolicyByGraphDocumentId: {
        [graphDocumentId]: 'off',
      },
      browserContentBuildPolicyByRowId: {},
      browserInteractionGraphDocumentIds: {
        [graphDocumentId]: true,
      },
      isInteracting: true,
      delayedDraftBuildByGraphDocumentId: {
        [graphDocumentId]: {} as AppState['delayedDraftBuildByGraphDocumentId'][string],
      },
      delayedAuthoritativeBuildByGraphDocumentId: {
        [graphDocumentId]:
          {} as AppState['delayedAuthoritativeBuildByGraphDocumentId'][string],
      },
      requestedMode: 'auto',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('auto'),
      renderedProjectPartSet,
      graphDocumentsById: createGraphDocumentsById([graphDocumentId]),
      viewerTargetGraphDocumentId: graphDocumentId,
      sharedViewerComposition:
        { graphDocumentIds: [graphDocumentId] } as SpaghettiStoreState['sharedViewerComposition'],
      sketchPlanePickSession: null,
      acceptedAuthoritativeGeometryResult: null,
      previewReadyAuthoritativeGeometryResult: null,
      acceptedDraftGeometryResult: null,
      committedAuthoritativeGeometryResult: null,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildBundle: null,
      acceptedPreviewBuildOutputs: [],
      previewPreparation: null,
    })

    expect(options.browserExecutionPolicy).toBe('off')
    expect(options.suppressViewerTargetArtifactPreview).toBe(true)
    expect(options.useProjectDraftPreview).toBe(true)
    expect(options.isInteractionActive).toBe(true)
    expect(options.hasDelayedDraftPlaceholder).toBe(true)
    expect(options.hasDelayedAuthoritativePlaceholder).toBe(true)
    expect(options.activeDraftProjectViewerParts).toEqual(renderedProjectPartSet.viewerParts)
  })

  it('keeps graph-runtime draft acceptance intact when browser policy suppresses viewer-facing preview', () => {
    const graphDocumentId = 'graph-document-1'
    const renderedProjectPartSet: RenderedProjectPartSetVm = {
      parts: [],
      viewerParts: [],
      contributingGraphDocumentIds: [],
    }
    const draftGeometryResult = createDraftGeometryResultBundle({
      request: {
        graphDocumentId,
        buildRequestId: 'build-request-current-draft',
        partKeys: ['part-1'],
      },
      bodies: {},
      meshPreview: {
        vertices: [
          0, 0, 0,
          2, 0, 0,
          0, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
    })
    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-part-1',
        sourceNodeId: 'node-extrude-1',
        sourcePartKey: 'part-1',
      },
    ])

    const options = buildViewportResultSelectorOptions({
      currentProject: createCurrentProject([graphDocumentId]),
      projectContent: createProjectContent(),
      browserGraphBuildPolicyByGraphDocumentId: {
        [graphDocumentId]: 'off',
      },
      browserContentBuildPolicyByRowId: {},
      browserInteractionGraphDocumentIds: {
        [graphDocumentId]: true,
      },
      isInteracting: true,
      delayedDraftBuildByGraphDocumentId: {},
      delayedAuthoritativeBuildByGraphDocumentId: {},
      requestedMode: 'draft',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('draft'),
      renderedProjectPartSet,
      graphDocumentsById: createGraphDocumentsById([graphDocumentId]),
      viewerTargetGraphDocumentId: graphDocumentId,
      sharedViewerComposition: null,
      sketchPlanePickSession: null,
      acceptedAuthoritativeGeometryResult: null,
      previewReadyAuthoritativeGeometryResult: null,
      acceptedDraftGeometryResult: draftGeometryResult,
      committedAuthoritativeGeometryResult: null,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildBundle: null,
      acceptedPreviewBuildOutputs: [createArtifact('part-1')],
      previewPreparation,
    })

    const state = selectViewportResultState(options)

    expect(options.suppressViewerTargetArtifactPreview).toBe(true)
    expect(options.browserExecutionPolicy).toBe('off')
    expect(state.visiblePresentationStateId).toBe(null)
    expect(state.previewState.kind).toBe('none')
    expect(state.acceptedState).toEqual(
      expect.objectContaining({
        kind: 'accepted',
        resultClass: 'draft',
        sourceKind: 'retained-draft',
        geometryResult: draftGeometryResult,
      }),
    )
    expect(state.previewRenderVm.viewerParts).toEqual([])
  })

  it('treats lingering browser build interaction as settled once UI interaction has ended', () => {
    const graphDocumentId = 'graph-document-1'

    const options = buildViewportResultSelectorOptions({
      currentProject: createCurrentProject([graphDocumentId]),
      projectContent: createProjectContent(),
      browserGraphBuildPolicyByGraphDocumentId: {
        [graphDocumentId]: 'live',
      },
      browserContentBuildPolicyByRowId: {},
      browserInteractionGraphDocumentIds: {
        [graphDocumentId]: true,
      },
      isInteracting: false,
      delayedDraftBuildByGraphDocumentId: {},
      delayedAuthoritativeBuildByGraphDocumentId: {},
      requestedMode: 'auto',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('auto'),
      renderedProjectPartSet: createRenderedProjectPartSet(),
      graphDocumentsById: createGraphDocumentsById([graphDocumentId]),
      viewerTargetGraphDocumentId: graphDocumentId,
      sharedViewerComposition: null,
      sketchPlanePickSession: null,
      acceptedAuthoritativeGeometryResult: null,
      previewReadyAuthoritativeGeometryResult: null,
      acceptedDraftGeometryResult: null,
      committedAuthoritativeGeometryResult: null,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildBundle: null,
      acceptedPreviewBuildOutputs: [],
      previewPreparation: null,
    })

    expect(options.isInteractionActive).toBe(false)
  })

  it('collapses auto live branch-local comparison to a base-only winner once UI interaction settles even if the graph flag lingers', () => {
    const graphDocumentId = 'graph-document-1'
    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-extrude-1',
        sourceNodeId: 'node-extrude-1',
        sourcePartKey: 'extrude-1',
      },
      {
        slotId: 'slot-extrude-2',
        sourceNodeId: 'node-extrude-2',
        sourcePartKey: 'extrude-2',
      },
    ])
    const committedAuthoritativeGeometryResult = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId,
        buildRequestId: 'build-request-final-before-explicit-settle',
        partKeys: ['extrude-1', 'extrude-2'],
      },
      bodies: {},
      meshPreview: {
        vertices: [
          0, 0, 0,
          6, 0, 0,
          0, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-final-before-explicit-settle',
      },
    })
    const acceptedDraftGeometryResult = createDraftGeometryResultBundle({
      request: {
        graphDocumentId,
        buildRequestId: 'build-request-draft-after-explicit-settle',
        partKeys: ['extrude-1', 'extrude-2'],
      },
      bodies: {},
      meshPreview: {
        vertices: [
          0, 0, 0,
          6, 0, 0,
          0, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
    })
    const extrude1 = toViewerRenderablePart(
      createArtifact('extrude-1'),
      'output-entry:slot-extrude-1:node-extrude-1',
    )
    const extrude2 = toViewerRenderablePart(
      createArtifact('extrude-2'),
      'output-entry:slot-extrude-2:node-extrude-2',
    )

    const activeOptions = buildViewportResultSelectorOptions({
      currentProject: createCurrentProject([graphDocumentId]),
      projectContent: createProjectContent(),
      browserGraphBuildPolicyByGraphDocumentId: {
        [graphDocumentId]: 'live',
      },
      browserContentBuildPolicyByRowId: {},
      browserInteractionGraphDocumentIds: {
        [graphDocumentId]: true,
      },
      isInteracting: true,
      delayedDraftBuildByGraphDocumentId: {},
      delayedAuthoritativeBuildByGraphDocumentId: {},
      requestedMode: 'auto',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('auto'),
      renderedProjectPartSet: createRenderedProjectPartSet(),
      graphDocumentsById: createGraphDocumentsById([graphDocumentId]),
      viewerTargetGraphDocumentId: graphDocumentId,
      sharedViewerComposition: null,
      sketchPlanePickSession: null,
      acceptedAuthoritativeGeometryResult: null,
      previewReadyAuthoritativeGeometryResult: null,
      acceptedDraftGeometryResult,
      committedAuthoritativeGeometryResult,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildBundle: null,
      acceptedPreviewBuildOutputs: [],
      previewPreparation,
      interactionAcceptedOutputPreviewRenderVm: {
        items: [],
        viewerParts: [extrude1, extrude2],
      },
      interactionAcceptedRebuiltPreviewRenderVm: {
        items: [],
        viewerParts: [extrude2],
      },
      committedInteractionBaseParts: [extrude1, extrude2],
      committedInteractionBranchStableParts: [extrude1, extrude2],
      committedInteractionBasePresentationStateId: 'lastLoaded',
    })

    const activeState = selectViewportResultState(activeOptions)

    expect(activeOptions.isInteractionActive).toBe(true)
    expect(activeState.layerRecipe).toEqual(
      expect.objectContaining({
        kind: 'branch-local-retained-baseline',
        basePresentationStateId: 'lastLoaded',
        baselinePresentationStateId: 'lastLoaded',
        overlayPresentationStateId: 'previewMesh',
      }),
    )

    const settledOptions = buildViewportResultSelectorOptions({
      currentProject: createCurrentProject([graphDocumentId]),
      projectContent: createProjectContent(),
      browserGraphBuildPolicyByGraphDocumentId: {
        [graphDocumentId]: 'live',
      },
      browserContentBuildPolicyByRowId: {},
      browserInteractionGraphDocumentIds: {
        [graphDocumentId]: true,
      },
      isInteracting: false,
      delayedDraftBuildByGraphDocumentId: {},
      delayedAuthoritativeBuildByGraphDocumentId: {},
      requestedMode: 'auto',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('auto'),
      renderedProjectPartSet: createRenderedProjectPartSet(),
      graphDocumentsById: createGraphDocumentsById([graphDocumentId]),
      viewerTargetGraphDocumentId: graphDocumentId,
      sharedViewerComposition: null,
      sketchPlanePickSession: null,
      acceptedAuthoritativeGeometryResult: null,
      previewReadyAuthoritativeGeometryResult: null,
      acceptedDraftGeometryResult,
      committedAuthoritativeGeometryResult,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildBundle: null,
      acceptedPreviewBuildOutputs: [],
      previewPreparation,
      interactionAcceptedOutputPreviewRenderVm: {
        items: [],
        viewerParts: [extrude1, extrude2],
      },
      interactionAcceptedRebuiltPreviewRenderVm: {
        items: [],
        viewerParts: [extrude2],
      },
      committedInteractionBaseParts: [extrude1, extrude2],
      committedInteractionBranchStableParts: [extrude1, extrude2],
      committedInteractionBasePresentationStateId: 'lastLoaded',
    })

    const settledState = selectViewportResultState(settledOptions)

    expect(settledOptions.isInteractionActive).toBe(false)
    expect(settledState.layerRecipe).toEqual(
      expect.objectContaining({
        kind: 'base-only',
        basePresentationStateId: 'lastLoaded',
        baselineParts: [],
        overlayParts: [],
      }),
    )
  })
})
