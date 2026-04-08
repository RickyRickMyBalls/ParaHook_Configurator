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
    expect(state.previewRenderVm.viewerParts).toEqual([])
  })

  it('lets project-composition draft parts stay visible in draft mode', () => {
    const projectArtifact = createArtifact('baseplate')

    const state = selectViewportResultState({
      requestedMode: 'draft',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('draft'),
      acceptedAuthoritativeGeometryResult: null,
      acceptedDraftGeometryResult: null,
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
})
