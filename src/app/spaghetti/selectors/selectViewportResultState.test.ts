import { describe, expect, it } from 'vitest'
import { toViewerRenderablePart, type PartArtifact } from '../../../shared/buildTypes'
import {
  createAuthoritativeGeometryResultBundle,
  createDraftGeometryResultBundle,
} from '../../../shared/geometryResult'
import type { GraphPreviewPreparation } from '../previewPreparation'
import { resolveWorkspaceViewportResultModeBehavior } from '../../workspace/workspaceViewportResultMode'
import { selectViewportResultState } from './selectViewportResultState'

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

const createArtifact = (partKeyStr: string): PartArtifact => ({
  id: `artifact:${partKeyStr}`,
  kind: 'box',
  label: partKeyStr,
  partKeyStr,
  partKey: { id: partKeyStr, instance: null },
  params: { width: 10, length: 20, height: 5 },
})

describe('selectViewportResultState', () => {
  it('keeps draft artifact preview visible in auto mode while marking final as pending', () => {
    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
      },
    ])
    const artifact = createArtifact('baseplate')
    const geometryResult = createDraftGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-1',
        partKeys: ['baseplate'],
      },
      bodies: {},
      meshPreview: null,
      diagnostics: [],
      trace: [],
    })

    const state = selectViewportResultState({
      requestedMode: 'auto',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('auto'),
      acceptedAuthoritativeGeometryResult: null,
      acceptedDraftGeometryResult: geometryResult,
      committedAuthoritativeGeometryResult: null,
      committedDraftGeometryResult: geometryResult,
      acceptedPreviewBuildOutputs: [artifact],
      previewPreparation,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
    })

    expect(state).toEqual(
      expect.objectContaining({
        requestedMode: 'auto',
        visibleResultClass: 'draft',
        visibleSourceKind: 'artifact-preview',
        geometryResult,
        isPendingFinal: true,
        isUsingFallback: true,
        fallbackReason: 'artifact-preview-bridge',
      }),
    )
    expect(state.renderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:slot-baseplate',
        artifact,
      }),
    ])
    expect(state.previewRenderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:slot-baseplate',
        artifact,
      }),
    ])
  })

  it('returns an explicit final-unavailable fallback instead of silently showing draft in final mode', () => {
    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
      },
    ])
    const geometryResult = createDraftGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-1',
        partKeys: ['baseplate'],
      },
      bodies: {},
      meshPreview: null,
      diagnostics: [],
      trace: [],
    })

    const state = selectViewportResultState({
      requestedMode: 'final',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('final'),
      acceptedAuthoritativeGeometryResult: null,
      acceptedDraftGeometryResult: geometryResult,
      committedAuthoritativeGeometryResult: null,
      committedDraftGeometryResult: geometryResult,
      acceptedPreviewBuildOutputs: [createArtifact('baseplate')],
      previewPreparation,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
    })

    expect(state).toEqual(
      expect.objectContaining({
        requestedMode: 'final',
        visibleResultClass: null,
        visibleSourceKind: 'none',
        geometryResult: null,
        isPendingFinal: false,
        isUsingFallback: true,
        fallbackReason: 'final-unavailable',
      }),
    )
    expect(state.renderVm.viewerParts).toEqual([])
    expect(state.previewRenderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:slot-baseplate',
      }),
    ])
  })

  it('lets project-composition draft parts stay visible in draft mode', () => {
    const projectArtifact = createArtifact('baseplate')

    const state = selectViewportResultState({
      requestedMode: 'draft',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('draft'),
      acceptedAuthoritativeGeometryResult: null,
      acceptedDraftGeometryResult: null,
      committedAuthoritativeGeometryResult: null,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildOutputs: [],
      previewPreparation: null,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: true,
      activeDraftProjectViewerParts: [
        toViewerRenderablePart(projectArtifact, 'graph-document-1:slot-baseplate'),
      ],
    })

    expect(state).toEqual(
      expect.objectContaining({
        requestedMode: 'draft',
        visibleResultClass: 'draft',
        visibleSourceKind: 'artifact-preview',
        isPendingFinal: false,
        isUsingFallback: true,
        fallbackReason: 'artifact-preview-bridge',
      }),
    )
    expect(state.renderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:slot-baseplate',
        artifact: projectArtifact,
      }),
    ])
    expect(state.previewRenderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:slot-baseplate',
        artifact: projectArtifact,
      }),
    ])
  })

  it('reports no accepted geometry when neither retained nor artifact preview is usable', () => {
    const state = selectViewportResultState({
      requestedMode: 'auto',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('auto'),
      acceptedAuthoritativeGeometryResult: null,
      acceptedDraftGeometryResult: null,
      committedAuthoritativeGeometryResult: null,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildOutputs: [],
      previewPreparation: null,
      viewerTargetGraphDocumentId: null,
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
    })

    expect(state).toEqual(
      expect.objectContaining({
        requestedMode: 'auto',
        visibleResultClass: null,
        visibleSourceKind: 'none',
        isPendingFinal: false,
        isUsingFallback: true,
        fallbackReason: 'no-accepted-geometry',
      }),
    )
    expect(state.renderVm.viewerParts).toEqual([])
  })

  it('keeps draft visible in auto mode when accepted authoritative geometry is not yet renderable', () => {
    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
      },
    ])
    const authoritativeGeometryResult = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-8',
        partKeys: ['baseplate'],
      },
      bodies: {},
      meshPreview: null,
      diagnostics: [],
      trace: [],
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-8',
      },
    })
    const artifact = createArtifact('baseplate')

    const state = selectViewportResultState({
      requestedMode: 'auto',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('auto'),
      acceptedAuthoritativeGeometryResult: authoritativeGeometryResult,
      acceptedDraftGeometryResult: null,
      committedAuthoritativeGeometryResult: authoritativeGeometryResult,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildOutputs: [artifact],
      previewPreparation,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
    })

    expect(state).toEqual(
      expect.objectContaining({
        requestedMode: 'auto',
        visibleResultClass: 'draft',
        visibleSourceKind: 'artifact-preview',
        geometryResult: null,
        isPendingFinal: true,
        isUsingFallback: true,
        fallbackReason: 'artifact-preview-bridge',
      }),
    )
    expect(state.renderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:slot-baseplate',
        artifact,
      }),
    ])
    expect(state.previewRenderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:slot-baseplate',
        artifact,
      }),
    ])
  })

  it('derives final viewer parts from authoritative mesh preview instead of the artifact bridge', () => {
    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
      },
    ])
    const authoritativeGeometryResult = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-9',
        partKeys: ['baseplate'],
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
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-9',
      },
    })
    const artifact = createArtifact('baseplate')

    const state = selectViewportResultState({
      requestedMode: 'final',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('final'),
      acceptedAuthoritativeGeometryResult: authoritativeGeometryResult,
      acceptedDraftGeometryResult: null,
      committedAuthoritativeGeometryResult: authoritativeGeometryResult,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildOutputs: [artifact],
      previewPreparation,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
    })

    expect(state).toEqual(
      expect.objectContaining({
        requestedMode: 'final',
        visibleResultClass: 'final',
        visibleSourceKind: 'retained-final',
        geometryResult: authoritativeGeometryResult,
        isPendingFinal: false,
        isUsingFallback: false,
        fallbackReason: null,
      }),
    )
    expect(state.renderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:authoritative-preview',
        artifact: expect.objectContaining({
          kind: 'mesh',
          label: 'Authoritative Preview',
          partKeyStr: 'graph-document-1:authoritative-preview',
          mesh: {
            vertices: [
              0, 0, 0,
              2, 0, 0,
              0, 1, 0,
            ],
            indices: [0, 1, 2],
          },
        }),
      }),
    ])
    expect(state.previewRenderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:slot-baseplate',
        artifact,
      }),
    ])
  })

  it('keeps final mode explicitly unavailable when authoritative geometry has a handle but no renderable mesh preview', () => {
    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
      },
    ])
    const authoritativeGeometryResult = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-10',
        partKeys: ['baseplate'],
      },
      bodies: {},
      meshPreview: null,
      diagnostics: [],
      trace: [],
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-10',
      },
    })

    const state = selectViewportResultState({
      requestedMode: 'final',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('final'),
      acceptedAuthoritativeGeometryResult: authoritativeGeometryResult,
      acceptedDraftGeometryResult: null,
      committedAuthoritativeGeometryResult: authoritativeGeometryResult,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildOutputs: [createArtifact('baseplate')],
      previewPreparation,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
    })

    expect(state).toEqual(
      expect.objectContaining({
        requestedMode: 'final',
        visibleResultClass: null,
        visibleSourceKind: 'none',
        geometryResult: null,
        isPendingFinal: false,
        isUsingFallback: true,
        fallbackReason: 'final-unavailable',
      }),
    )
    expect(state.renderVm.viewerParts).toEqual([])
  })

  it('swaps auto mode from draft preview to retained final once renderable authoritative geometry is available', () => {
    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
      },
    ])
    const draftGeometryResult = createDraftGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-draft',
        partKeys: ['baseplate'],
      },
      bodies: {},
      meshPreview: null,
      diagnostics: [],
      trace: [],
    })
    const authoritativeGeometryResult = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-final',
        partKeys: ['baseplate'],
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
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-final',
      },
    })

    const state = selectViewportResultState({
      requestedMode: 'auto',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('auto'),
      acceptedAuthoritativeGeometryResult: authoritativeGeometryResult,
      acceptedDraftGeometryResult: draftGeometryResult,
      committedAuthoritativeGeometryResult: authoritativeGeometryResult,
      committedDraftGeometryResult: draftGeometryResult,
      acceptedPreviewBuildOutputs: [createArtifact('baseplate')],
      previewPreparation,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
    })

    expect(state).toEqual(
      expect.objectContaining({
        requestedMode: 'auto',
        visibleResultClass: 'final',
        visibleSourceKind: 'retained-final',
        geometryResult: authoritativeGeometryResult,
        isPendingFinal: false,
        isUsingFallback: false,
        fallbackReason: null,
      }),
    )
    expect(state.renderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:authoritative-preview',
        artifact: expect.objectContaining({
          kind: 'mesh',
          label: 'Authoritative Preview',
        }),
      }),
    ])
  })

  it('exposes retained final base eligibility in auto mode during parameter churn without promoting it as current final', () => {
    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
      },
    ])
    const committedAuthoritativeGeometryResult = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-retained-final',
        partKeys: ['baseplate'],
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
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-retained-final',
      },
    })
    const currentDraftGeometryResult = createDraftGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-current-draft',
        partKeys: ['baseplate'],
      },
      bodies: {},
      meshPreview: null,
      diagnostics: [],
      trace: [],
    })

    const state = selectViewportResultState({
      requestedMode: 'auto',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('auto'),
      acceptedAuthoritativeGeometryResult: null,
      acceptedDraftGeometryResult: currentDraftGeometryResult,
      committedAuthoritativeGeometryResult,
      committedDraftGeometryResult: currentDraftGeometryResult,
      acceptedPreviewBuildOutputs: [createArtifact('baseplate')],
      previewPreparation,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
    })

    expect(state).toEqual(
      expect.objectContaining({
        visibleResultClass: 'draft',
        visibleSourceKind: 'artifact-preview',
        retainedBaseState: 'retained',
        retainedBaseResultClass: 'final',
        retainedBaseSourceKind: 'retained-final',
        retainedBaseGeometryResult: committedAuthoritativeGeometryResult,
        overlayResultClass: 'draft',
        overlaySourceKind: 'artifact-preview',
        overlayGeometryResult: currentDraftGeometryResult,
      }),
    )
    expect(state.retainedBaseRenderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:authoritative-preview',
      }),
    ])
  })

  it('clears retained committed geometry when the current dependency graph no longer resolves the output', () => {
    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
        status: 'unresolved',
      },
    ])
    const committedAuthoritativeGeometryResult = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-old-final',
        partKeys: ['baseplate'],
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
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-old-final',
      },
    })

    const state = selectViewportResultState({
      requestedMode: 'auto',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('auto'),
      acceptedAuthoritativeGeometryResult: null,
      acceptedDraftGeometryResult: null,
      committedAuthoritativeGeometryResult,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildOutputs: [createArtifact('baseplate')],
      previewPreparation,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
    })

    expect(state).toEqual(
      expect.objectContaining({
        visibleResultClass: null,
        retainedBaseState: 'cleared-by-dependency-break',
        retainedBaseResultClass: null,
        retainedBaseSourceKind: 'none',
        retainedBaseGeometryResult: null,
        fallbackReason: 'no-accepted-geometry',
      }),
    )
    expect(state.retainedBaseRenderVm.viewerParts).toEqual([])
    expect(state.previewRenderVm.viewerParts).toEqual([])
  })

  it('uses retained draft mesh preview as the strict draft base during parameter churn', () => {
    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
      },
    ])
    const committedDraftGeometryResult = createDraftGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-retained-draft',
        partKeys: ['baseplate'],
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

    const state = selectViewportResultState({
      requestedMode: 'draft',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('draft'),
      acceptedAuthoritativeGeometryResult: null,
      acceptedDraftGeometryResult: null,
      committedAuthoritativeGeometryResult: null,
      committedDraftGeometryResult,
      acceptedPreviewBuildOutputs: [createArtifact('baseplate')],
      previewPreparation,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
    })

    expect(state).toEqual(
      expect.objectContaining({
        visibleResultClass: 'draft',
        visibleSourceKind: 'artifact-preview',
        retainedBaseState: 'retained',
        retainedBaseResultClass: 'draft',
        retainedBaseSourceKind: 'retained-draft',
        retainedBaseGeometryResult: committedDraftGeometryResult,
        overlayResultClass: 'draft',
        overlaySourceKind: 'artifact-preview',
      }),
    )
    expect(state.retainedBaseRenderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:draft-preview',
        artifact: expect.objectContaining({
          kind: 'mesh',
          label: 'Draft Preview',
        }),
      }),
    ])
    expect(state.overlayRenderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:slot-baseplate',
      }),
    ])
  })

  it('exposes previewMesh as the live preview state in auto live interaction when only draft preview exists', () => {
    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
      },
    ])

    const state = selectViewportResultState({
      requestedMode: 'auto',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('auto'),
      acceptedAuthoritativeGeometryResult: null,
      acceptedDraftGeometryResult: null,
      committedAuthoritativeGeometryResult: createAuthoritativeGeometryResultBundle({
        request: {
          graphDocumentId: 'graph-document-1',
          buildRequestId: 'build-request-old-final',
          partKeys: ['baseplate'],
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
        authoritativeHandle: {
          resourceType: 'shape_set',
          handleId: 'shape-set-old-final',
        },
      }),
      committedDraftGeometryResult: null,
      acceptedPreviewBuildOutputs: [createArtifact('baseplate')],
      previewPreparation,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
      browserExecutionPolicy: 'live',
      isInteractionActive: true,
    })

    expect(state.previewState).toEqual(
      expect.objectContaining({
        kind: 'live-preview',
        presentationStateId: 'previewMesh',
        resultClass: 'draft',
        sourceKind: 'artifact-preview',
      }),
    )
    expect(state.hasLivePreview).toBe(true)
    expect(state.hasPreviewReadyResult).toBe(false)
    expect(state.visiblePresentationStateId).toBe('previewMesh')
    expect(state.retainedBasePresentationStateId).toBe('lastLoaded')
  })

  it('maps auto live authoritative readiness to previewBrep instead of accepted presentation during interaction', () => {
    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
      },
    ])
    const committedAuthoritativeGeometryResult = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-old-final',
        partKeys: ['baseplate'],
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
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-old-final',
      },
    })
    const currentAuthoritativeGeometryResult = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-new-final',
        partKeys: ['baseplate'],
      },
      bodies: {},
      meshPreview: {
        vertices: [
          0, 0, 0,
          3, 0, 0,
          0, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-new-final',
      },
    })

    const state = selectViewportResultState({
      requestedMode: 'auto',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('auto'),
      acceptedAuthoritativeGeometryResult: null,
      previewReadyAuthoritativeGeometryResult: currentAuthoritativeGeometryResult,
      acceptedDraftGeometryResult: null,
      committedAuthoritativeGeometryResult,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildOutputs: [createArtifact('baseplate')],
      previewPreparation,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
      browserExecutionPolicy: 'live',
      isInteractionActive: true,
    })

    expect(state.previewState).toEqual(
      expect.objectContaining({
        kind: 'preview-ready',
        presentationStateId: 'previewBrep',
        resultClass: 'final',
        sourceKind: 'authoritative-preview',
        geometryResult: currentAuthoritativeGeometryResult,
      }),
    )
    expect(state.hasLivePreview).toBe(false)
    expect(state.hasPreviewReadyResult).toBe(true)
    expect(state.visiblePresentationStateId).toBe('previewBrep')
    expect(state.retainedBasePresentationStateId).toBe('lastLoaded')
    expect(state.overlayResultClass).toBe('final')
    expect(state.acceptedState.kind).toBe('none')
    expect(state.acceptedState.isVisible).toBe(false)
  })

  it('does not synthesize previewBrep from the already-committed authoritative result during live interaction', () => {
    const committedAuthoritativeGeometryResult = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-current-final',
        partKeys: ['baseplate'],
      },
      bodies: {},
      meshPreview: {
        vertices: [
          0, 0, 0,
          3, 0, 0,
          0, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-current-final',
      },
    })

    const state = selectViewportResultState({
      requestedMode: 'auto',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('auto'),
      acceptedAuthoritativeGeometryResult: committedAuthoritativeGeometryResult,
      acceptedDraftGeometryResult: null,
      committedAuthoritativeGeometryResult,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildOutputs: [],
      previewPreparation: null,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
      browserExecutionPolicy: 'live',
      isInteractionActive: true,
    })

    expect(state.previewState.kind).toBe('none')
    expect(state.hasLivePreview).toBe(false)
    expect(state.hasPreviewReadyResult).toBe(false)
    expect(state.visiblePresentationStateId).toBe(null)
    expect(state.acceptedState.isVisible).toBe(true)
  })

  it('suppresses live preview state during active interaction when browser policy is release', () => {
    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
      },
    ])

    const state = selectViewportResultState({
      requestedMode: 'auto',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('auto'),
      acceptedAuthoritativeGeometryResult: null,
      acceptedDraftGeometryResult: null,
      committedAuthoritativeGeometryResult: createAuthoritativeGeometryResultBundle({
        request: {
          graphDocumentId: 'graph-document-1',
          buildRequestId: 'build-request-old-final',
          partKeys: ['baseplate'],
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
        authoritativeHandle: {
          resourceType: 'shape_set',
          handleId: 'shape-set-old-final',
        },
      }),
      committedDraftGeometryResult: null,
      acceptedPreviewBuildOutputs: [createArtifact('baseplate')],
      previewPreparation,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
      browserExecutionPolicy: 'release',
      isInteractionActive: true,
      hasDelayedDraftPlaceholder: true,
    })

    expect(state.previewState.kind).toBe('none')
    expect(state.hasLivePreview).toBe(false)
    expect(state.hasPreviewReadyResult).toBe(false)
    expect(state.visiblePresentationStateId).toBe('lastLoaded')
    expect(state.visibleResultClass).toBe('final')
    expect(state.visibleSourceKind).toBe('retained-final')
    expect(state.overlayResultClass).toBe(null)
    expect(state.overlayRenderVm.viewerParts).toEqual([])
    expect(state.acceptedState.isVisible).toBe(false)
  })

  it('exposes preview-ready state after release when release policy has a newer authoritative result than the retained base', () => {
    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
      },
    ])
    const committedAuthoritativeGeometryResult = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-old-final',
        partKeys: ['baseplate'],
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
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-old-final',
      },
    })
    const currentAuthoritativeGeometryResult = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-new-final',
        partKeys: ['baseplate'],
      },
      bodies: {},
      meshPreview: {
        vertices: [
          0, 0, 0,
          3, 0, 0,
          0, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-new-final',
      },
    })

    const state = selectViewportResultState({
      requestedMode: 'auto',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('auto'),
      acceptedAuthoritativeGeometryResult: null,
      previewReadyAuthoritativeGeometryResult: currentAuthoritativeGeometryResult,
      acceptedDraftGeometryResult: null,
      committedAuthoritativeGeometryResult,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildOutputs: [createArtifact('baseplate')],
      previewPreparation,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
      browserExecutionPolicy: 'release',
      isInteractionActive: false,
    })

    expect(state.previewState).toEqual(
      expect.objectContaining({
        kind: 'preview-ready',
        presentationStateId: 'previewBrep',
        geometryResult: currentAuthoritativeGeometryResult,
      }),
    )
    expect(state.hasPreviewReadyResult).toBe(true)
    expect(state.visiblePresentationStateId).toBe('previewBrep')
    expect(state.retainedBasePresentationStateId).toBe('lastLoaded')
    expect(state.overlayResultClass).toBe('final')
    expect(state.acceptedState.isVisible).toBe(false)
  })
})
