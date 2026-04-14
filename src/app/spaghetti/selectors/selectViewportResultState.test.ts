import { describe, expect, it } from 'vitest'
import {
  toViewerRenderablePart,
  type BuildResultBundle,
  type PartArtifact,
} from '../../../shared/buildTypes'
import {
  createAuthoritativeGeometryResultBundle,
  createDraftGeometryResultBundle,
} from '../../../shared/geometryResult'
import type { GraphPreviewPreparation } from '../previewPreparation'
import { resolveWorkspaceViewportResultModeBehavior } from '../../workspace/workspaceViewportResultMode'
import { selectViewportResultState } from './selectViewportResultState'

const outputPreviewBaseplateViewerKey =
  'graph-document-1:output-entry:slot-baseplate:node-baseplate-1'

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

const createPhase5SelectorScene = () => {
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
      buildRequestId: 'build-request-phase5-committed-final',
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
      handleId: 'shape-set-phase5-committed-final',
    },
  })
  const committedDraftGeometryResult = createDraftGeometryResultBundle({
    request: {
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-phase5-committed-draft',
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
  const currentDraftGeometryResult = createDraftGeometryResultBundle({
    request: {
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-phase5-current-draft',
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
  })
  const previewReadyAuthoritativeGeometryResult = createAuthoritativeGeometryResultBundle({
    request: {
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-phase5-preview-ready-final',
      partKeys: ['baseplate'],
    },
    bodies: {},
    meshPreview: {
      vertices: [
        0, 0, 0,
        4, 0, 0,
        0, 1, 0,
      ],
      indices: [0, 1, 2],
    },
    diagnostics: [],
    trace: [],
    authoritativeHandle: {
      resourceType: 'shape_set',
      handleId: 'shape-set-phase5-preview-ready-final',
    },
  })

  return {
    previewPreparation,
    committedAuthoritativeGeometryResult,
    committedDraftGeometryResult,
    currentDraftGeometryResult,
    previewReadyAuthoritativeGeometryResult,
  }
}

type Phase5SelectorMatrixCase = {
  label: string
  mode: 'auto' | 'draft' | 'final'
  policy: 'live' | 'release' | 'manual'
  expected: {
    visibleResultClass: 'draft' | 'final'
    visiblePresentationStateId: 'lastLoaded' | 'previewMesh' | 'previewBrep' | null
    previewStateKind: 'none' | 'live-preview' | 'preview-ready'
    layerRecipeKind:
      | 'base-only'
      | 'retained-plus-overlay'
      | 'branch-local-retained-baseline'
    basePresentationStateId: 'lastLoaded' | 'previewMesh' | 'previewBrep' | null
    overlayPresentationStateId: 'previewMesh' | 'previewBrep' | null
  }
}

const buildPhase5SelectorMatrixState = (testCase: Phase5SelectorMatrixCase) => {
  const scene = createPhase5SelectorScene()
  const common = {
    requestedMode: testCase.mode,
    modeBehavior: resolveWorkspaceViewportResultModeBehavior(testCase.mode),
    committedAuthoritativeGeometryResult: scene.committedAuthoritativeGeometryResult,
    committedDraftGeometryResult:
      testCase.mode === 'draft' ? scene.committedDraftGeometryResult : null,
    acceptedPreviewBuildOutputs: [] as PartArtifact[],
    previewPreparation: scene.previewPreparation,
    viewerTargetGraphDocumentId: 'graph-document-1',
    suppressViewerTargetArtifactPreview: false,
    useProjectDraftPreview: false,
    activeDraftProjectViewerParts: [] as never[],
    browserExecutionPolicy: testCase.policy,
  }

  switch (testCase.label) {
    case 'Auto / Live - Settled Draft':
      return selectViewportResultState({
        ...common,
        acceptedAuthoritativeGeometryResult: null,
        acceptedDraftGeometryResult: scene.currentDraftGeometryResult,
        committedDraftGeometryResult: scene.currentDraftGeometryResult,
        acceptedPreviewBuildOutputs: [createArtifact('baseplate')],
        isInteractionActive: false,
      })
    case 'Auto / On Release - Active Drag':
      return selectViewportResultState({
        ...common,
        acceptedAuthoritativeGeometryResult: null,
        acceptedDraftGeometryResult: null,
        acceptedPreviewBuildOutputs: [createArtifact('baseplate')],
        isInteractionActive: true,
        hasDelayedDraftPlaceholder: true,
      })
    case 'Auto / Manual - Before Build':
      return selectViewportResultState({
        ...common,
        acceptedAuthoritativeGeometryResult: scene.committedAuthoritativeGeometryResult,
        acceptedDraftGeometryResult: null,
        isInteractionActive: false,
      })
    case 'Draft / Live - Active Drag':
      return selectViewportResultState({
        ...common,
        acceptedAuthoritativeGeometryResult: scene.committedAuthoritativeGeometryResult,
        acceptedDraftGeometryResult: scene.currentDraftGeometryResult,
        isInteractionActive: true,
      })
    case 'Draft / On Release - Settled Draft':
      return selectViewportResultState({
        ...common,
        acceptedAuthoritativeGeometryResult: scene.committedAuthoritativeGeometryResult,
        acceptedDraftGeometryResult: scene.currentDraftGeometryResult,
        isInteractionActive: false,
      })
    case 'Draft / Manual - Before Build':
      return selectViewportResultState({
        ...common,
        acceptedAuthoritativeGeometryResult: scene.committedAuthoritativeGeometryResult,
        acceptedDraftGeometryResult: scene.committedDraftGeometryResult,
        isInteractionActive: false,
      })
    case 'Final / Live - Preview Ready':
      return selectViewportResultState({
        ...common,
        acceptedAuthoritativeGeometryResult: null,
        previewReadyAuthoritativeGeometryResult: scene.previewReadyAuthoritativeGeometryResult,
        acceptedDraftGeometryResult: null,
        isInteractionActive: true,
      })
    case 'Final / On Release - Post Release':
      return selectViewportResultState({
        ...common,
        acceptedAuthoritativeGeometryResult: null,
        previewReadyAuthoritativeGeometryResult: scene.previewReadyAuthoritativeGeometryResult,
        acceptedDraftGeometryResult: null,
        isInteractionActive: false,
      })
    case 'Final / Manual - After Build':
      return selectViewportResultState({
        ...common,
        acceptedAuthoritativeGeometryResult: null,
        previewReadyAuthoritativeGeometryResult: scene.previewReadyAuthoritativeGeometryResult,
        acceptedDraftGeometryResult: null,
        isInteractionActive: false,
      })
    default:
      throw new Error(`Unhandled Phase 5 selector matrix case: ${testCase.label}`)
  }
}

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
        viewerKey: outputPreviewBaseplateViewerKey,
        artifact,
      }),
    ])
    expect(state.previewRenderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: outputPreviewBaseplateViewerKey,
        artifact,
      }),
    ])
  })

  it('prefers accepted preview bundle artifacts for singular member preview rendering', () => {
    const previewPreparation = createPreviewPreparation([
      {
        slotId: 's001',
        sourceNodeId: 'node-extrude-1',
        sourcePartKey: 'extrude',
      },
    ])
    previewPreparation.sourceEntriesBySlotId = {
      s001: [
        {
          slotId: 's001',
          sourceNodeId: 'node-extrude-1',
          sourcePartKeyStr: 'extrude',
          sourcePortId: 'SolidBody:002',
        },
      ],
    }
    const coarseArtifact = createArtifact('extrude')
    const memberArtifact = createArtifact('extrude:node-extrude-1:body:002')
    const acceptedBundle: BuildResultBundle = {
      buildRequestId: 'build-request-member',
      graphDocumentId: 'graph-document-1',
      seq: 1,
      resultClass: 'draft',
      executionIntent: {
        buildMode: 'preview',
        quality: 'draft',
        updatePolicy: 'auto',
        draftPolicy: 'live',
        authoritativePolicy: 'explicit',
        outputIntent: 'transient_preview',
        geometryTarget: 'draft_preview',
      },
      summary: {
        rebuiltCount: 1,
        retainedCount: 0,
        evictedCount: 0,
      },
      entries: [
        {
          buildUnitId: 'output-entry:s001:node-extrude-1',
          outputEntryId: 'output-entry:s001:node-extrude-1',
          sourceNodeId: 'node-extrude-1',
          status: 'rebuilt',
          resultClass: 'draft',
          artifacts: [memberArtifact],
        },
      ],
    }

    const state = selectViewportResultState({
      requestedMode: 'auto',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('auto'),
      acceptedAuthoritativeGeometryResult: null,
      acceptedDraftGeometryResult: null,
      committedAuthoritativeGeometryResult: null,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildBundle: acceptedBundle,
      acceptedPreviewBuildOutputs: [coarseArtifact],
      previewPreparation,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
    })

    expect(state.previewRenderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:output-entry:s001:node-extrude-1',
        artifact: expect.objectContaining({
          partKeyStr: 'extrude:node-extrude-1:body:002',
        }),
      }),
    ])
  })

  it('prefers accepted preview bundle artifacts for singular member final rendering', () => {
    const previewPreparation = createPreviewPreparation([
      {
        slotId: 's001',
        sourceNodeId: 'node-extrude-1',
        sourcePartKey: 'extrude',
      },
    ])
    previewPreparation.sourceEntriesBySlotId = {
      s001: [
        {
          slotId: 's001',
          sourceNodeId: 'node-extrude-1',
          sourcePartKeyStr: 'extrude',
          sourcePortId: 'SolidBody:002',
        },
      ],
    }
    const coarseArtifact = createArtifact('extrude')
    const memberArtifact = createArtifact('extrude:node-extrude-1:body:002')
    const acceptedBundle: BuildResultBundle = {
      buildRequestId: 'build-request-member-final',
      graphDocumentId: 'graph-document-1',
      seq: 2,
      resultClass: 'final',
      executionIntent: {
        buildMode: 'final',
        quality: 'full',
        updatePolicy: 'manual',
        draftPolicy: 'suppressed',
        authoritativePolicy: 'explicit',
        outputIntent: 'accepted_final',
        geometryTarget: 'authoritative',
      },
      summary: {
        rebuiltCount: 1,
        retainedCount: 0,
        evictedCount: 0,
      },
      entries: [
        {
          buildUnitId: 'output-entry:s001:node-extrude-1',
          outputEntryId: 'output-entry:s001:node-extrude-1',
          sourceNodeId: 'node-extrude-1',
          status: 'rebuilt',
          resultClass: 'final',
          artifacts: [memberArtifact],
        },
      ],
    }
    const authoritativeGeometryResult = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-member-final',
        partKeys: ['extrude'],
      },
      bodies: {},
      meshPreview: {
        vertices: [0, 0, 0, 2, 0, 0, 0, 1, 0],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-member-final',
      },
    })

    const state = selectViewportResultState({
      requestedMode: 'final',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('final'),
      acceptedAuthoritativeGeometryResult: authoritativeGeometryResult,
      acceptedDraftGeometryResult: null,
      committedAuthoritativeGeometryResult: authoritativeGeometryResult,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildBundle: acceptedBundle,
      acceptedPreviewBuildOutputs: [coarseArtifact],
      previewPreparation,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
    })

    expect(state.renderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:output-entry:s001:node-extrude-1',
        artifact: expect.objectContaining({
          partKeyStr: 'extrude:node-extrude-1:body:002',
        }),
      }),
    ])
  })

  it('does not fall back to the coarse parent artifact for unresolved explicit contributor subset preview rendering', () => {
    const previewPreparation = createPreviewPreparation([
      {
        slotId: 's001',
        sourceNodeId: 'node-extrude-1',
        sourcePartKey: 'extrude',
      },
    ])
    previewPreparation.sourceEntriesBySlotId = {
      s001: [
        {
          slotId: 's001',
          sourceNodeId: 'node-extrude-1',
          sourcePartKeyStr: 'extrude',
          sourcePortId: 'SolidBody:001',
        },
        {
          slotId: 's001',
          sourceNodeId: 'node-extrude-1',
          sourcePartKeyStr: 'extrude',
          sourcePortId: 'SolidBody:002',
        },
      ],
    }
    const coarseArtifact = createArtifact('extrude')
    const memberArtifact = createArtifact('extrude:node-extrude-1:body:001')
    const acceptedBundle: BuildResultBundle = {
      buildRequestId: 'build-request-explicit-subset',
      graphDocumentId: 'graph-document-1',
      seq: 1,
      resultClass: 'draft',
      executionIntent: {
        buildMode: 'preview',
        quality: 'draft',
        updatePolicy: 'auto',
        draftPolicy: 'live',
        authoritativePolicy: 'explicit',
        outputIntent: 'transient_preview',
        geometryTarget: 'draft_preview',
      },
      summary: {
        rebuiltCount: 1,
        retainedCount: 0,
        evictedCount: 0,
      },
      entries: [
        {
          buildUnitId: 'output-entry:s001:node-extrude-1:port-SolidBody%3A001',
          outputEntryId: 'output-entry:s001:node-extrude-1:port-SolidBody%3A001',
          sourceNodeId: 'node-extrude-1',
          status: 'rebuilt',
          resultClass: 'draft',
          artifacts: [memberArtifact],
        },
      ],
    }

    const state = selectViewportResultState({
      requestedMode: 'auto',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('auto'),
      acceptedAuthoritativeGeometryResult: null,
      acceptedDraftGeometryResult: null,
      committedAuthoritativeGeometryResult: null,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildBundle: acceptedBundle,
      acceptedPreviewBuildOutputs: [coarseArtifact],
      previewPreparation,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
    })

    expect(state.previewRenderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:output-entry:s001:node-extrude-1:port-SolidBody%3A001',
        artifact: expect.objectContaining({
          partKeyStr: 'extrude:node-extrude-1:body:001',
        }),
      }),
    ])
    expect(state.previewRenderVm.items).toEqual([
      expect.objectContaining({
        outputEntryId: 'output-entry:s001:node-extrude-1:port-SolidBody%3A001',
        viewerPart: expect.any(Object),
      }),
      expect.objectContaining({
        outputEntryId: 'output-entry:s001:node-extrude-1:port-SolidBody%3A002',
        viewerPart: null,
      }),
    ])
  })

  it('suppresses whole-node draft mesh preview for explicit SolidBody subset publication while waiting for geometry', () => {
    const previewPreparation = createPreviewPreparation([
      {
        slotId: 's001',
        sourceNodeId: 'node-extrude-1',
        sourcePartKey: 'extrude',
      },
    ])
    previewPreparation.sourceEntriesBySlotId = {
      s001: [
        {
          slotId: 's001',
          sourceNodeId: 'node-extrude-1',
          sourcePartKeyStr: 'extrude',
          sourcePortId: 'SolidBody:001',
        },
        {
          slotId: 's001',
          sourceNodeId: 'node-extrude-1',
          sourcePartKeyStr: 'extrude',
          sourcePortId: 'SolidBody:002',
        },
      ],
    }
    const draftGeometryResult = createDraftGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-subset-waiting',
        partKeys: ['extrude'],
      },
      bodies: {},
      meshPreview: {
        vertices: [0, 0, 0, 2, 0, 0, 0, 1, 0],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
    })

    const state = selectViewportResultState({
      requestedMode: 'auto',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('auto'),
      acceptedAuthoritativeGeometryResult: null,
      acceptedDraftGeometryResult: draftGeometryResult,
      committedAuthoritativeGeometryResult: null,
      committedDraftGeometryResult: draftGeometryResult,
      acceptedPreviewBuildOutputs: [],
      previewPreparation,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
    })

    expect(state.visibleResultClass).toBeNull()
    expect(state.visibleSourceKind).toBe('none')
    expect(state.renderVm.viewerParts).toEqual([])
    expect(state.previewRenderVm.viewerParts).toEqual([])
    expect(state.isUsingFallback).toBe(true)
    expect(state.fallbackReason).toBe('no-accepted-geometry')
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
        viewerKey: outputPreviewBaseplateViewerKey,
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

  it('falls back to viewer-target accepted subset artifacts when project draft preview is enabled but has no live viewer parts yet', () => {
    const previewPreparation = createPreviewPreparation([
      {
        slotId: 's001',
        sourceNodeId: 'node-extrude-1',
        sourcePartKey: 'extrude',
      },
    ])
    previewPreparation.sourceEntriesBySlotId = {
      s001: [
        {
          slotId: 's001',
          sourceNodeId: 'node-extrude-1',
          sourcePartKeyStr: 'extrude',
          sourcePortId: 'SolidBody:001',
        },
        {
          slotId: 's001',
          sourceNodeId: 'node-extrude-1',
          sourcePartKeyStr: 'extrude',
          sourcePortId: 'SolidBody:002',
        },
      ],
    }
    const body001Artifact = createArtifact('extrude:node-extrude-1:body:001')
    const body002Artifact = createArtifact('extrude:node-extrude-1:body:002')
    const acceptedBundle: BuildResultBundle = {
      buildRequestId: 'build-request-subset-draft',
      graphDocumentId: 'graph-document-1',
      seq: 5,
      resultClass: 'draft',
      executionIntent: {
        buildMode: 'preview',
        quality: 'draft',
        updatePolicy: 'auto',
        draftPolicy: 'live',
        authoritativePolicy: 'explicit',
        outputIntent: 'transient_preview',
        geometryTarget: 'draft_preview',
      },
      summary: {
        rebuiltCount: 2,
        retainedCount: 0,
        evictedCount: 0,
      },
      entries: [
        {
          buildUnitId: 'output-entry:s001:node-extrude-1:port-SolidBody%3A001',
          outputEntryId: 'output-entry:s001:node-extrude-1:port-SolidBody%3A001',
          sourceNodeId: 'node-extrude-1',
          status: 'rebuilt',
          resultClass: 'draft',
          artifacts: [body001Artifact],
        },
        {
          buildUnitId: 'output-entry:s001:node-extrude-1:port-SolidBody%3A002',
          outputEntryId: 'output-entry:s001:node-extrude-1:port-SolidBody%3A002',
          sourceNodeId: 'node-extrude-1',
          status: 'rebuilt',
          resultClass: 'draft',
          artifacts: [body002Artifact],
        },
      ],
    }

    const state = selectViewportResultState({
      requestedMode: 'draft',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('draft'),
      acceptedAuthoritativeGeometryResult: null,
      acceptedDraftGeometryResult: null,
      committedAuthoritativeGeometryResult: null,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildBundle: acceptedBundle,
      acceptedPreviewBuildOutputs: [body001Artifact, body002Artifact],
      previewPreparation,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: true,
      activeDraftProjectViewerParts: [],
    })

    expect(state).toEqual(
      expect.objectContaining({
        visibleResultClass: 'draft',
        visibleSourceKind: 'artifact-preview',
        isUsingFallback: true,
        fallbackReason: 'artifact-preview-bridge',
      }),
    )
    expect(state.renderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:output-entry:s001:node-extrude-1:port-SolidBody%3A001',
        artifact: expect.objectContaining({
          partKeyStr: 'extrude:node-extrude-1:body:001',
        }),
      }),
      expect.objectContaining({
        viewerKey: 'graph-document-1:output-entry:s001:node-extrude-1:port-SolidBody%3A002',
        artifact: expect.objectContaining({
          partKeyStr: 'extrude:node-extrude-1:body:002',
        }),
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
        viewerKey: outputPreviewBaseplateViewerKey,
        artifact,
      }),
    ])
    expect(state.previewRenderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: outputPreviewBaseplateViewerKey,
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
        viewerKey: outputPreviewBaseplateViewerKey,
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

  it('returns settled auto draft truth as lastLoaded while retaining final as the last-loaded base candidate', () => {
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
        visiblePresentationStateId: 'lastLoaded',
        retainedBaseState: 'retained',
        retainedBaseResultClass: 'final',
        retainedBaseSourceKind: 'retained-final',
        retainedBaseGeometryResult: committedAuthoritativeGeometryResult,
        overlayResultClass: null,
        overlaySourceKind: 'none',
        overlayGeometryResult: null,
      }),
    )
    expect(state.retainedBaseRenderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:authoritative-preview',
      }),
    ])
    expect(state.layerRecipe).toEqual(
      expect.objectContaining({
        kind: 'base-only',
        basePresentationStateId: 'lastLoaded',
        baselineParts: [],
        overlayParts: [],
        overlayOpacity: 0.5,
      }),
    )
  })

  it('keeps retained committed final geometry while the current output is temporarily unresolved', () => {
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
        retainedBaseState: 'retained',
        retainedBaseResultClass: 'final',
        retainedBaseSourceKind: 'retained-final',
        retainedBaseGeometryResult: committedAuthoritativeGeometryResult,
        fallbackReason: 'no-accepted-geometry',
      }),
    )
    expect(state.retainedBaseRenderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:authoritative-preview',
      }),
    ])
    expect(state.previewRenderVm.viewerParts).toEqual([])
  })

  it('clears retained committed final geometry for explicit SolidBody subset publication even when coarse part keys still match', () => {
    const previewPreparation = createPreviewPreparation([
      {
        slotId: 's001',
        sourceNodeId: 'node-extrude-1',
        sourcePartKey: 'extrude',
        status: 'unresolved',
      },
    ])
    previewPreparation.sourceEntriesBySlotId = {
      s001: [
        {
          slotId: 's001',
          sourceNodeId: 'node-extrude-1',
          sourcePartKeyStr: 'extrude',
          sourcePortId: 'SolidBody:001',
        },
        {
          slotId: 's001',
          sourceNodeId: 'node-extrude-1',
          sourcePartKeyStr: 'extrude',
          sourcePortId: 'SolidBody:002',
        },
      ],
    }
    const committedAuthoritativeGeometryResult = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-old-final',
        partKeys: ['extrude'],
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
      acceptedPreviewBuildOutputs: [createArtifact('extrude')],
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
  })

  it('keeps retained committed draft geometry while the current output is temporarily unresolved', () => {
    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
        status: 'unresolved',
      },
    ])
    const committedDraftGeometryResult = createDraftGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-old-draft',
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
        visibleResultClass: null,
        retainedBaseState: 'retained',
        retainedBaseResultClass: 'draft',
        retainedBaseSourceKind: 'retained-draft',
        retainedBaseGeometryResult: committedDraftGeometryResult,
        fallbackReason: 'no-accepted-geometry',
      }),
    )
    expect(state.retainedBaseRenderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:draft-preview',
      }),
    ])
    expect(state.previewRenderVm.viewerParts).toEqual([])
  })

  it('clears retained committed draft geometry for explicit SolidBody subset publication even when coarse part keys still match', () => {
    const previewPreparation = createPreviewPreparation([
      {
        slotId: 's001',
        sourceNodeId: 'node-extrude-1',
        sourcePartKey: 'extrude',
        status: 'unresolved',
      },
    ])
    previewPreparation.sourceEntriesBySlotId = {
      s001: [
        {
          slotId: 's001',
          sourceNodeId: 'node-extrude-1',
          sourcePartKeyStr: 'extrude',
          sourcePortId: 'SolidBody:001',
        },
        {
          slotId: 's001',
          sourceNodeId: 'node-extrude-1',
          sourcePartKeyStr: 'extrude',
          sourcePortId: 'SolidBody:002',
        },
      ],
    }
    const committedDraftGeometryResult = createDraftGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-old-draft',
        partKeys: ['extrude'],
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
      acceptedPreviewBuildOutputs: [createArtifact('extrude')],
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
  })

  it('clears retained committed geometry when the current dependency graph no longer resolves the output', () => {
    const previewPreparation = {
      ...createPreviewPreparation([
        {
          slotId: 'slot-baseplate',
          sourceNodeId: 'node-baseplate-1',
          sourcePartKey: 'baseplate',
          status: 'empty',
        },
      ]),
      previewCandidateSlotIds: [],
      previewCandidatePartKeys: [],
      sourceNodeIdBySlotId: {},
      sourcePartKeyBySlotId: {},
      sourcePortIdBySlotId: {},
      sourcePartKeyByNodeId: {},
    }
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

  it('clears accepted authoritative visibility when output preview is disconnected even if accepted final geometry still exists', () => {
    const previewPreparation = {
      ...createPreviewPreparation([
        {
          slotId: 'slot-baseplate',
          sourceNodeId: 'node-baseplate-1',
          sourcePartKey: 'baseplate',
          status: 'empty',
        },
      ]),
      previewCandidateSlotIds: [],
      previewCandidatePartKeys: [],
      sourceNodeIdBySlotId: {},
      sourcePartKeyBySlotId: {},
      sourcePortIdBySlotId: {},
      sourcePartKeyByNodeId: {},
    }
    const acceptedAuthoritativeGeometryResult = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-accepted-final-disconnected',
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
        handleId: 'shape-set-accepted-final-disconnected',
      },
    })

    const state = selectViewportResultState({
      requestedMode: 'auto',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('auto'),
      acceptedAuthoritativeGeometryResult,
      acceptedDraftGeometryResult: null,
      committedAuthoritativeGeometryResult: acceptedAuthoritativeGeometryResult,
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
        visibleSourceKind: 'none',
        retainedBaseState: 'cleared-by-dependency-break',
        retainedBaseResultClass: null,
        retainedBaseSourceKind: 'none',
        retainedBaseGeometryResult: null,
        overlayResultClass: null,
        overlaySourceKind: 'none',
        fallbackReason: 'no-accepted-geometry',
      }),
    )
    expect(state.retainedBaseRenderVm.viewerParts).toEqual([])
    expect(state.overlayRenderVm.viewerParts).toEqual([])
    expect(state.layerRecipe).toEqual({
      kind: 'base-only',
      baseParts: [],
      basePresentationStateId: null,
      baselineParts: [],
      baselinePresentationStateId: null,
      baselineUsesDimmedBaseStyle: false,
      overlayParts: [],
      overlayPresentationStateId: null,
      overlayOpacity: 0.5,
    })
  })

  it('clears retained final geometry when the current output membership drops one previously accepted part', () => {
    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-object-1',
        sourceNodeId: 'node-object-1',
        sourcePartKey: 'object-1',
      },
    ])
    const committedAuthoritativeGeometryResult = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-old-final',
        partKeys: ['object-1', 'object-2'],
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
      requestedMode: 'final',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('final'),
      acceptedAuthoritativeGeometryResult: null,
      acceptedDraftGeometryResult: null,
      committedAuthoritativeGeometryResult,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildOutputs: [createArtifact('object-1')],
      previewPreparation,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
    })

    expect(state).toEqual(
      expect.objectContaining({
        visibleResultClass: null,
        visibleSourceKind: 'none',
        retainedBaseState: 'cleared-by-dependency-break',
        retainedBaseResultClass: null,
        retainedBaseSourceKind: 'none',
        retainedBaseGeometryResult: null,
        fallbackReason: 'final-unavailable',
      }),
    )
    expect(state.retainedBaseRenderVm.viewerParts).toEqual([])
  })

  it('returns settled draft truth as lastLoaded while retaining draft as the last-loaded base candidate', () => {
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
        visiblePresentationStateId: 'lastLoaded',
        retainedBaseState: 'retained',
        retainedBaseResultClass: 'draft',
        retainedBaseSourceKind: 'retained-draft',
        retainedBaseGeometryResult: committedDraftGeometryResult,
        overlayResultClass: null,
        overlaySourceKind: 'none',
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
    expect(state.overlayRenderVm.viewerParts).toEqual([])
    expect(state.layerRecipe).toEqual(
      expect.objectContaining({
        kind: 'base-only',
        basePresentationStateId: 'lastLoaded',
        baselineParts: [],
        overlayParts: [],
        overlayOpacity: 0.5,
      }),
    )
  })

  it('uses current draft geometry as visible preview in draft mode when the artifact preview bridge is empty', () => {
    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
      },
    ])
    const currentDraftGeometryResult = createDraftGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-current-draft-only',
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
      acceptedDraftGeometryResult: currentDraftGeometryResult,
      committedAuthoritativeGeometryResult: null,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildOutputs: [],
      previewPreparation,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
      browserExecutionPolicy: 'live',
      isInteractionActive: true,
    })

    expect(state).toEqual(
      expect.objectContaining({
        visibleResultClass: 'draft',
        visibleSourceKind: 'retained-draft',
        visiblePresentationStateId: 'previewMesh',
        retainedBaseState: 'current',
        retainedBaseResultClass: 'draft',
        retainedBaseSourceKind: 'retained-draft',
        retainedBaseGeometryResult: currentDraftGeometryResult,
        overlayResultClass: 'draft',
        overlaySourceKind: 'retained-draft',
        overlayGeometryResult: currentDraftGeometryResult,
        hasLivePreview: true,
        fallbackReason: null,
      }),
    )
    expect(state.acceptedState).toEqual(
      expect.objectContaining({
        kind: 'accepted',
        resultClass: 'draft',
        sourceKind: 'retained-draft',
        geometryResult: currentDraftGeometryResult,
        isVisible: false,
      }),
    )
    expect(state.previewState).toEqual(
      expect.objectContaining({
        kind: 'live-preview',
        presentationStateId: 'previewMesh',
        resultClass: 'draft',
        sourceKind: 'retained-draft',
        geometryResult: currentDraftGeometryResult,
      }),
    )
    expect(state.retainedBaseRenderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:draft-preview',
      }),
    ])
    expect(state.previewRenderVm.viewerParts).toEqual([])
    expect(state.renderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:draft-preview',
      }),
    ])
    expect(state.layerRecipe).toEqual(
      expect.objectContaining({
        kind: 'base-only',
        basePresentationStateId: 'previewMesh',
        baselineParts: [],
        overlayParts: [],
        overlayOpacity: 0.5,
      }),
    )
  })

  it('returns draft on release as a base-only lastLoaded recipe once accepted draft becomes settled truth', () => {
    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
      },
    ])
    const currentDraftGeometryResult = createDraftGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-current-draft-release',
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
      acceptedDraftGeometryResult: currentDraftGeometryResult,
      committedAuthoritativeGeometryResult: null,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildOutputs: [],
      previewPreparation,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
      browserExecutionPolicy: 'release',
      isInteractionActive: false,
    })

    expect(state).toEqual(
      expect.objectContaining({
        visibleResultClass: 'draft',
        visibleSourceKind: 'retained-draft',
        visiblePresentationStateId: 'lastLoaded',
        hasLivePreview: false,
        hasPreviewReadyResult: false,
      }),
    )
    expect(state.layerRecipe).toEqual(
      expect.objectContaining({
        kind: 'base-only',
        basePresentationStateId: 'lastLoaded',
        baselineParts: [],
        overlayParts: [],
        overlayOpacity: 0.5,
      }),
    )
  })

  it('returns idle draft to lastLoaded once accepted draft becomes the settled visible truth', () => {
    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
      },
    ])
    const currentDraftGeometryResult = createDraftGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-current-draft-idle',
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
      acceptedDraftGeometryResult: currentDraftGeometryResult,
      committedAuthoritativeGeometryResult: null,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildOutputs: [],
      previewPreparation,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
      browserExecutionPolicy: 'live',
      isInteractionActive: false,
    })

    expect(state).toEqual(
      expect.objectContaining({
        visibleResultClass: 'draft',
        visibleSourceKind: 'retained-draft',
        visiblePresentationStateId: 'lastLoaded',
        retainedBaseState: 'current',
        retainedBaseResultClass: 'draft',
        retainedBaseSourceKind: 'retained-draft',
        retainedBaseGeometryResult: currentDraftGeometryResult,
        overlayResultClass: null,
        overlaySourceKind: 'none',
        overlayGeometryResult: null,
        hasLivePreview: false,
        hasPreviewReadyResult: false,
        fallbackReason: null,
      }),
    )
    expect(state.acceptedState).toEqual(
      expect.objectContaining({
        kind: 'accepted',
        resultClass: 'draft',
        sourceKind: 'retained-draft',
        geometryResult: currentDraftGeometryResult,
        isVisible: false,
      }),
    )
    expect(state.previewState).toEqual(
      expect.objectContaining({
        kind: 'none',
        presentationStateId: null,
        resultClass: null,
        sourceKind: 'none',
        geometryResult: null,
      }),
    )
    expect(state.previewState.renderVm.viewerParts).toEqual([])
    expect(state.renderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:draft-preview',
      }),
    ])
  })

  it('keeps retained final underneath current draft preview in auto mode while output is temporarily unresolved', () => {
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
        buildRequestId: 'build-request-retained-final',
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
        handleId: 'shape-set-retained-final',
      },
    })
    const currentDraftGeometryResult = createDraftGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-current-draft-only',
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
      requestedMode: 'auto',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('auto'),
      acceptedAuthoritativeGeometryResult: null,
      acceptedDraftGeometryResult: currentDraftGeometryResult,
      committedAuthoritativeGeometryResult,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildOutputs: [],
      previewPreparation,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
      browserExecutionPolicy: 'live',
      isInteractionActive: true,
    })

    expect(state).toEqual(
      expect.objectContaining({
        visibleResultClass: 'draft',
        visibleSourceKind: 'retained-draft',
        visiblePresentationStateId: 'previewMesh',
        retainedBaseState: 'retained',
        retainedBaseResultClass: 'final',
        retainedBaseSourceKind: 'retained-final',
        retainedBaseGeometryResult: committedAuthoritativeGeometryResult,
        overlayResultClass: 'draft',
        overlaySourceKind: 'retained-draft',
        overlayGeometryResult: currentDraftGeometryResult,
        hasLivePreview: true,
        hasPreviewReadyResult: false,
        fallbackReason: null,
      }),
    )
    expect(state.previewState).toEqual(
      expect.objectContaining({
        kind: 'live-preview',
        presentationStateId: 'previewMesh',
        resultClass: 'draft',
        sourceKind: 'retained-draft',
        geometryResult: currentDraftGeometryResult,
      }),
    )
    expect(state.acceptedState.kind).toBe('none')
    expect(state.previewRenderVm.viewerParts).toEqual([])
    expect(state.retainedBaseRenderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:authoritative-preview',
      }),
    ])
    expect(state.renderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:draft-preview',
      }),
    ])
  })

  it('keeps the drag-time retained final base on committed authoritative geometry instead of current preview publication', () => {
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
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-committed-final-two-extrude',
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
        handleId: 'shape-set-committed-final-two-extrude',
      },
    })
    const currentDraftGeometryResult = createDraftGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-current-draft-two-extrude',
        partKeys: ['extrude-1', 'extrude-2'],
      },
      bodies: {},
      meshPreview: {
        vertices: [
          0, 0, 0,
          4, 0, 0,
          0, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
    })
    const acceptedPreviewBuildBundle: BuildResultBundle = {
      buildRequestId: 'build-request-current-preview-two-extrude',
      graphDocumentId: 'graph-document-1',
      seq: 17,
      resultClass: 'draft',
      executionIntent: {
        buildMode: 'preview',
        quality: 'draft',
        updatePolicy: 'auto',
        draftPolicy: 'live',
        authoritativePolicy: 'explicit',
        outputIntent: 'transient_preview',
        geometryTarget: 'draft_preview',
      },
      summary: {
        rebuiltCount: 2,
        retainedCount: 0,
        evictedCount: 0,
      },
      entries: [
        {
          buildUnitId: 'output-entry:slot-extrude-1:node-extrude-1',
          outputEntryId: 'output-entry:slot-extrude-1:node-extrude-1',
          sourceNodeId: 'node-extrude-1',
          status: 'rebuilt',
          resultClass: 'draft',
          artifacts: [createArtifact('extrude-1')],
        },
        {
          buildUnitId: 'output-entry:slot-extrude-2:node-extrude-2',
          outputEntryId: 'output-entry:slot-extrude-2:node-extrude-2',
          sourceNodeId: 'node-extrude-2',
          status: 'rebuilt',
          resultClass: 'draft',
          artifacts: [createArtifact('extrude-2')],
        },
      ],
    }

    const state = selectViewportResultState({
      requestedMode: 'auto',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('auto'),
      acceptedAuthoritativeGeometryResult: null,
      acceptedDraftGeometryResult: currentDraftGeometryResult,
      committedAuthoritativeGeometryResult,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildBundle,
      acceptedPreviewBuildOutputs: [createArtifact('extrude-1'), createArtifact('extrude-2')],
      previewPreparation,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
      browserExecutionPolicy: 'live',
      isInteractionActive: true,
    })

    expect(state).toEqual(
      expect.objectContaining({
        visibleResultClass: 'draft',
        visibleSourceKind: 'artifact-preview',
        visiblePresentationStateId: 'previewMesh',
        retainedBaseState: 'retained',
        retainedBaseResultClass: 'final',
        retainedBaseSourceKind: 'retained-final',
        retainedBaseGeometryResult: committedAuthoritativeGeometryResult,
        hasLivePreview: true,
        hasPreviewReadyResult: false,
        fallbackReason: 'artifact-preview-bridge',
      }),
    )
    expect(state.retainedBaseRenderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:authoritative-preview',
      }),
    ])
    expect(state.retainedBaseRenderVm.viewerParts).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          viewerKey: 'graph-document-1:output-entry:slot-extrude-2:node-extrude-2',
        }),
      ]),
    )
    expect(state.renderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:output-entry:slot-extrude-1:node-extrude-1',
      }),
      expect.objectContaining({
        viewerKey: 'graph-document-1:output-entry:slot-extrude-2:node-extrude-2',
      }),
    ])
  })

  it('keeps retained siblings out of the live preview overlay when only one branch rebuilt', () => {
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
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-committed-final-two-extrude-retained',
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
        handleId: 'shape-set-committed-final-two-extrude-retained',
      },
    })
    const currentDraftGeometryResult = createDraftGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-current-draft-two-extrude-retained',
        partKeys: ['extrude-1', 'extrude-2'],
      },
      bodies: {},
      meshPreview: {
        vertices: [
          0, 0, 0,
          4, 0, 0,
          0, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
    })
    const acceptedPreviewBuildBundle: BuildResultBundle = {
      buildRequestId: 'build-request-current-preview-two-extrude-retained',
      graphDocumentId: 'graph-document-1',
      seq: 18,
      resultClass: 'draft',
      executionIntent: {
        buildMode: 'preview',
        quality: 'draft',
        updatePolicy: 'auto',
        draftPolicy: 'live',
        authoritativePolicy: 'explicit',
        outputIntent: 'transient_preview',
        geometryTarget: 'draft_preview',
      },
      summary: {
        rebuiltCount: 1,
        retainedCount: 1,
        evictedCount: 0,
      },
      entries: [
        {
          buildUnitId: 'output-entry:slot-extrude-1:node-extrude-1',
          outputEntryId: 'output-entry:slot-extrude-1:node-extrude-1',
          sourceNodeId: 'node-extrude-1',
          status: 'retained',
          resultClass: 'draft',
          artifacts: [createArtifact('extrude-1')],
        },
        {
          buildUnitId: 'output-entry:slot-extrude-2:node-extrude-2',
          outputEntryId: 'output-entry:slot-extrude-2:node-extrude-2',
          sourceNodeId: 'node-extrude-2',
          status: 'rebuilt',
          resultClass: 'draft',
          artifacts: [createArtifact('extrude-2')],
        },
      ],
    }

    const state = selectViewportResultState({
      requestedMode: 'auto',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('auto'),
      acceptedAuthoritativeGeometryResult: null,
      acceptedDraftGeometryResult: currentDraftGeometryResult,
      committedAuthoritativeGeometryResult,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildBundle,
      acceptedPreviewBuildOutputs: [createArtifact('extrude-1'), createArtifact('extrude-2')],
      previewPreparation,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
      browserExecutionPolicy: 'live',
      isInteractionActive: true,
    })

    expect(state).toEqual(
      expect.objectContaining({
        visibleResultClass: 'draft',
        visibleSourceKind: 'artifact-preview',
        visiblePresentationStateId: 'previewMesh',
        retainedBaseState: 'retained',
        retainedBaseResultClass: 'final',
        retainedBaseSourceKind: 'retained-final',
        retainedBaseGeometryResult: committedAuthoritativeGeometryResult,
        overlayResultClass: 'draft',
        overlaySourceKind: 'artifact-preview',
        overlayGeometryResult: currentDraftGeometryResult,
        hasLivePreview: true,
        fallbackReason: 'artifact-preview-bridge',
      }),
    )
    expect(state.previewRenderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:output-entry:slot-extrude-2:node-extrude-2',
      }),
    ])
    expect(state.previewRenderVm.viewerParts).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          viewerKey: 'graph-document-1:output-entry:slot-extrude-1:node-extrude-1',
        }),
      ]),
    )
    expect(state.renderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:output-entry:slot-extrude-2:node-extrude-2',
      }),
    ])
  })

  it('keeps retained siblings visible in settled draft truth when one branch rebuilt', () => {
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
    const currentDraftGeometryResult = createDraftGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-current-draft-two-extrude-settled',
        partKeys: ['extrude-1', 'extrude-2'],
      },
      bodies: {},
      meshPreview: {
        vertices: [
          0, 0, 0,
          4, 0, 0,
          0, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
    })
    const acceptedPreviewBuildBundle: BuildResultBundle = {
      buildRequestId: 'build-request-current-preview-two-extrude-settled',
      graphDocumentId: 'graph-document-1',
      seq: 20,
      resultClass: 'draft',
      executionIntent: {
        buildMode: 'preview',
        quality: 'draft',
        updatePolicy: 'auto',
        draftPolicy: 'live',
        authoritativePolicy: 'explicit',
        outputIntent: 'transient_preview',
        geometryTarget: 'draft_preview',
      },
      summary: {
        rebuiltCount: 1,
        retainedCount: 1,
        evictedCount: 0,
      },
      entries: [
        {
          buildUnitId: 'output-entry:slot-extrude-1:node-extrude-1',
          outputEntryId: 'output-entry:slot-extrude-1:node-extrude-1',
          sourceNodeId: 'node-extrude-1',
          status: 'retained',
          resultClass: 'draft',
          artifacts: [createArtifact('extrude-1')],
        },
        {
          buildUnitId: 'output-entry:slot-extrude-2:node-extrude-2',
          outputEntryId: 'output-entry:slot-extrude-2:node-extrude-2',
          sourceNodeId: 'node-extrude-2',
          status: 'rebuilt',
          resultClass: 'draft',
          artifacts: [createArtifact('extrude-2')],
        },
      ],
    }

    const state = selectViewportResultState({
      requestedMode: 'draft',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('draft'),
      acceptedAuthoritativeGeometryResult: null,
      acceptedDraftGeometryResult: currentDraftGeometryResult,
      committedAuthoritativeGeometryResult: null,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildBundle,
      acceptedPreviewBuildOutputs: [createArtifact('extrude-1'), createArtifact('extrude-2')],
      previewPreparation,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
      browserExecutionPolicy: 'live',
      isInteractionActive: false,
    })

    expect(state).toEqual(
      expect.objectContaining({
        visibleResultClass: 'draft',
        visibleSourceKind: 'artifact-preview',
        visiblePresentationStateId: 'lastLoaded',
        overlayResultClass: null,
        overlaySourceKind: 'none',
        overlayGeometryResult: null,
        hasLivePreview: false,
        hasPreviewReadyResult: false,
        fallbackReason: 'artifact-preview-bridge',
      }),
    )
    expect(state.previewRenderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:output-entry:slot-extrude-2:node-extrude-2',
      }),
    ])
    expect(state.renderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:output-entry:slot-extrude-1:node-extrude-1',
      }),
      expect.objectContaining({
        viewerKey: 'graph-document-1:output-entry:slot-extrude-2:node-extrude-2',
      }),
    ])
  })

  it('prefers rebuilt-only viewer-target bundle preview over broad project draft preview when both are available', () => {
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
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-committed-final-two-extrude-project-preview',
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
        handleId: 'shape-set-committed-final-two-extrude-project-preview',
      },
    })
    const currentDraftGeometryResult = createDraftGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-current-draft-two-extrude-project-preview',
        partKeys: ['extrude-1', 'extrude-2'],
      },
      bodies: {},
      meshPreview: {
        vertices: [
          0, 0, 0,
          4, 0, 0,
          0, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
    })
    const acceptedPreviewBuildBundle: BuildResultBundle = {
      buildRequestId: 'build-request-current-preview-two-extrude-project-preview',
      graphDocumentId: 'graph-document-1',
      seq: 19,
      resultClass: 'draft',
      executionIntent: {
        buildMode: 'preview',
        quality: 'draft',
        updatePolicy: 'auto',
        draftPolicy: 'live',
        authoritativePolicy: 'explicit',
        outputIntent: 'transient_preview',
        geometryTarget: 'draft_preview',
      },
      summary: {
        rebuiltCount: 1,
        retainedCount: 1,
        evictedCount: 0,
      },
      entries: [
        {
          buildUnitId: 'output-entry:slot-extrude-1:node-extrude-1',
          outputEntryId: 'output-entry:slot-extrude-1:node-extrude-1',
          sourceNodeId: 'node-extrude-1',
          status: 'retained',
          resultClass: 'draft',
          artifacts: [createArtifact('extrude-1')],
        },
        {
          buildUnitId: 'output-entry:slot-extrude-2:node-extrude-2',
          outputEntryId: 'output-entry:slot-extrude-2:node-extrude-2',
          sourceNodeId: 'node-extrude-2',
          status: 'rebuilt',
          resultClass: 'draft',
          artifacts: [createArtifact('extrude-2')],
        },
      ],
    }

    const state = selectViewportResultState({
      requestedMode: 'auto',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('auto'),
      acceptedAuthoritativeGeometryResult: null,
      acceptedDraftGeometryResult: currentDraftGeometryResult,
      committedAuthoritativeGeometryResult,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildBundle,
      acceptedPreviewBuildOutputs: [createArtifact('extrude-1'), createArtifact('extrude-2')],
      previewPreparation,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: true,
      activeDraftProjectViewerParts: [
        toViewerRenderablePart(createArtifact('extrude-1'), 'graph-document-1:slot-extrude-1'),
        toViewerRenderablePart(createArtifact('extrude-2'), 'graph-document-1:slot-extrude-2'),
      ],
      browserExecutionPolicy: 'live',
      isInteractionActive: true,
    })

    expect(state.previewRenderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:output-entry:slot-extrude-2:node-extrude-2',
      }),
    ])
    expect(state.previewRenderVm.viewerParts).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          viewerKey: 'graph-document-1:slot-extrude-1',
        }),
        expect.objectContaining({
          viewerKey: 'graph-document-1:slot-extrude-2',
        }),
      ]),
    )
  })

  it('keeps retained final underneath committed draft preview in auto mode while waiting for a newer draft result', () => {
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
        buildRequestId: 'build-request-retained-final-waiting',
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
        handleId: 'shape-set-retained-final-waiting',
      },
    })
    const committedDraftGeometryResult = createDraftGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-retained-draft-waiting',
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
      requestedMode: 'auto',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('auto'),
      acceptedAuthoritativeGeometryResult: null,
      acceptedDraftGeometryResult: null,
      committedAuthoritativeGeometryResult,
      committedDraftGeometryResult,
      acceptedPreviewBuildOutputs: [],
      previewPreparation,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
      browserExecutionPolicy: 'live',
      isInteractionActive: true,
    })

    expect(state).toEqual(
      expect.objectContaining({
        visibleResultClass: 'draft',
        visibleSourceKind: 'retained-draft',
        visiblePresentationStateId: 'previewMesh',
        retainedBaseState: 'retained',
        retainedBaseResultClass: 'final',
        retainedBaseSourceKind: 'retained-final',
        retainedBaseGeometryResult: committedAuthoritativeGeometryResult,
        overlayResultClass: 'draft',
        overlaySourceKind: 'retained-draft',
        overlayGeometryResult: committedDraftGeometryResult,
        hasLivePreview: true,
        fallbackReason: null,
      }),
    )
    expect(state.previewState).toEqual(
      expect.objectContaining({
        kind: 'live-preview',
        presentationStateId: 'previewMesh',
        resultClass: 'draft',
        sourceKind: 'retained-draft',
        geometryResult: committedDraftGeometryResult,
      }),
    )
    expect(state.retainedBaseRenderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:authoritative-preview',
      }),
    ])
    expect(state.renderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:draft-preview',
      }),
    ])
  })

  it('returns auto live to lastLoaded once interaction settles and accepted draft becomes the visible truth', () => {
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
        buildRequestId: 'build-request-retained-final-after-release',
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
        handleId: 'shape-set-retained-final-after-release',
      },
    })
    const currentDraftGeometryResult = createDraftGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-current-draft-after-release',
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
      requestedMode: 'auto',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('auto'),
      acceptedAuthoritativeGeometryResult: null,
      acceptedDraftGeometryResult: currentDraftGeometryResult,
      committedAuthoritativeGeometryResult,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildOutputs: [],
      previewPreparation,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
      browserExecutionPolicy: 'live',
      isInteractionActive: false,
    })

    expect(state).toEqual(
      expect.objectContaining({
        visibleResultClass: 'draft',
        visibleSourceKind: 'retained-draft',
        visiblePresentationStateId: 'lastLoaded',
        retainedBaseState: 'retained',
        retainedBaseResultClass: 'final',
        retainedBaseSourceKind: 'retained-final',
        retainedBaseGeometryResult: committedAuthoritativeGeometryResult,
        overlayResultClass: null,
        overlaySourceKind: 'none',
        overlayGeometryResult: null,
        hasLivePreview: false,
        hasPreviewReadyResult: false,
        fallbackReason: null,
      }),
    )
    expect(state.previewState).toEqual(
      expect.objectContaining({
        kind: 'none',
        presentationStateId: null,
        resultClass: null,
        sourceKind: 'none',
        geometryResult: null,
      }),
    )
    expect(state.previewState.renderVm.viewerParts).toEqual([])
    expect(state.retainedBaseRenderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:authoritative-preview',
      }),
    ])
    expect(state.renderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:draft-preview',
      }),
    ])
    expect(state.layerRecipe).toEqual(
      expect.objectContaining({
        kind: 'base-only',
        basePresentationStateId: 'lastLoaded',
        baselineParts: [],
        overlayParts: [],
        overlayOpacity: 0.5,
      }),
    )
  })

  it('returns a branch-local retained-baseline recipe during two-branch live interaction when rebuilt-only overlay is available', () => {
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
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-final-before-branch-local-selector',
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
        handleId: 'shape-set-branch-local-selector',
      },
    })
    const currentDraftGeometryResult = createDraftGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-draft-branch-local-selector',
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

    const state = selectViewportResultState({
      requestedMode: 'auto',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('auto'),
      acceptedAuthoritativeGeometryResult: null,
      acceptedDraftGeometryResult: currentDraftGeometryResult,
      committedAuthoritativeGeometryResult,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildOutputs: [],
      previewPreparation,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
      browserExecutionPolicy: 'live',
      isInteractionActive: true,
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

    expect(state.layerRecipe).toEqual(
      expect.objectContaining({
        kind: 'branch-local-retained-baseline',
        basePresentationStateId: 'lastLoaded',
        baselinePresentationStateId: 'lastLoaded',
        baselineUsesDimmedBaseStyle: true,
        overlayPresentationStateId: 'previewMesh',
        overlayOpacity: 0.5,
        baseParts: [
          expect.objectContaining({
            viewerKey: 'output-entry:slot-extrude-1:node-extrude-1',
          }),
        ],
        baselineParts: [
          expect.objectContaining({
            viewerKey: 'output-entry:slot-extrude-2:node-extrude-2',
          }),
        ],
        overlayParts: [
          expect.objectContaining({
            viewerKey: 'output-entry:slot-extrude-2:node-extrude-2',
          }),
        ],
      }),
    )
  })

  it('drops the old branch-local baseline after settle while keeping the changed winner visible for the same two-branch graph', () => {
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
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-final-before-branch-local-settle',
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
        handleId: 'shape-set-final-before-branch-local-settle',
      },
    })
    const currentDraftGeometryResult = createDraftGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-draft-after-branch-local-settle',
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

    const state = selectViewportResultState({
      requestedMode: 'auto',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('auto'),
      acceptedAuthoritativeGeometryResult: null,
      acceptedDraftGeometryResult: currentDraftGeometryResult,
      committedAuthoritativeGeometryResult,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildOutputs: [],
      previewPreparation,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
      browserExecutionPolicy: 'live',
      isInteractionActive: false,
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

    expect(state).toEqual(
      expect.objectContaining({
        visibleResultClass: 'draft',
        visibleSourceKind: 'retained-draft',
        visiblePresentationStateId: 'lastLoaded',
        retainedBaseState: 'retained',
        retainedBaseResultClass: 'final',
        retainedBaseSourceKind: 'retained-final',
        overlayResultClass: null,
        overlaySourceKind: 'none',
      }),
    )
    expect(state.renderVm.viewerParts).toEqual([
      expect.objectContaining({
        viewerKey: 'graph-document-1:draft-preview',
      }),
    ])
    expect(state.layerRecipe).toEqual(
      expect.objectContaining({
        kind: 'base-only',
        basePresentationStateId: 'lastLoaded',
        baselineParts: [],
        overlayParts: [],
        overlayOpacity: 0.5,
      }),
    )
  })

  it('does not activate branch-local draft layering in final live mode when the selector has no visible overlay state', () => {
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
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-final-no-branch-local-leak',
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
        handleId: 'shape-set-final-no-branch-local-leak',
      },
    })
    const extrude1 = toViewerRenderablePart(
      createArtifact('extrude-1'),
      'output-entry:slot-extrude-1:node-extrude-1',
    )
    const extrude2 = toViewerRenderablePart(
      createArtifact('extrude-2'),
      'output-entry:slot-extrude-2:node-extrude-2',
    )

    const state = selectViewportResultState({
      requestedMode: 'final',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('final'),
      acceptedAuthoritativeGeometryResult: committedAuthoritativeGeometryResult,
      acceptedDraftGeometryResult: null,
      committedAuthoritativeGeometryResult,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildOutputs: [],
      previewPreparation,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
      browserExecutionPolicy: 'live',
      isInteractionActive: true,
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

    expect(state.previewState.kind).toBe('none')
    expect(state.overlayResultClass).toBeNull()
    expect(state.layerRecipe).toEqual(
      expect.objectContaining({
        kind: 'base-only',
        baselineParts: [],
        overlayParts: [],
      }),
    )
  })

  it('uses previewBrep styling for branch-local authoritative preview-ready layering during live interaction', () => {
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
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-final-before-branch-local-brep',
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
        handleId: 'shape-set-final-before-branch-local-brep',
      },
    })
    const previewReadyAuthoritativeGeometryResult = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-final-preview-ready-branch-local-brep',
        partKeys: ['extrude-1', 'extrude-2'],
      },
      bodies: {},
      meshPreview: {
        vertices: [
          0, 0, 0,
          7, 0, 0,
          0, 1, 0,
        ],
        indices: [0, 1, 2],
      },
      diagnostics: [],
      trace: [],
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-final-preview-ready-branch-local-brep',
      },
    })
    const extrude1 = toViewerRenderablePart(
      createArtifact('extrude-1'),
      'output-entry:slot-extrude-1:node-extrude-1',
    )
    const extrude2 = toViewerRenderablePart(
      createArtifact('extrude-2'),
      'output-entry:slot-extrude-2:node-extrude-2',
    )

    const state = selectViewportResultState({
      requestedMode: 'final',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('final'),
      acceptedAuthoritativeGeometryResult: null,
      previewReadyAuthoritativeGeometryResult,
      acceptedDraftGeometryResult: null,
      committedAuthoritativeGeometryResult,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildOutputs: [],
      previewPreparation,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
      browserExecutionPolicy: 'live',
      isInteractionActive: true,
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

    expect(state.previewState).toEqual(
      expect.objectContaining({
        kind: 'preview-ready',
        presentationStateId: 'previewBrep',
        resultClass: 'final',
      }),
    )
    expect(state.layerRecipe).toEqual(
      expect.objectContaining({
        kind: 'branch-local-retained-baseline',
        basePresentationStateId: 'lastLoaded',
        baselinePresentationStateId: 'lastLoaded',
        baselineUsesDimmedBaseStyle: true,
        overlayPresentationStateId: 'previewBrep',
        overlayOpacity: 0.75,
        baseParts: [
          expect.objectContaining({
            viewerKey: 'output-entry:slot-extrude-1:node-extrude-1',
          }),
        ],
        baselineParts: [
          expect.objectContaining({
            viewerKey: 'output-entry:slot-extrude-2:node-extrude-2',
          }),
        ],
        overlayParts: [
          expect.objectContaining({
            viewerKey: 'output-entry:slot-extrude-2:node-extrude-2',
          }),
        ],
      }),
    )
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
    expect(state.layerRecipe).toEqual(
      expect.objectContaining({
        kind: 'retained-plus-overlay',
        basePresentationStateId: 'lastLoaded',
        baselineParts: [],
        overlayPresentationStateId: 'previewBrep',
        overlayOpacity: 0.75,
      }),
    )
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

  it('does not surface artifact-preview or previewMesh in auto mode when viewer-facing stale preview artifacts have been freshness-gated away', () => {
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

    const state = selectViewportResultState({
      requestedMode: 'auto',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('auto'),
      acceptedAuthoritativeGeometryResult: null,
      acceptedDraftGeometryResult: null,
      committedAuthoritativeGeometryResult,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildOutputs: [],
      previewPreparation,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
      browserExecutionPolicy: 'live',
      isInteractionActive: true,
    })

    expect(state.previewState.kind).toBe('none')
    expect(state.previewState.presentationStateId).toBe(null)
    expect(state.hasLivePreview).toBe(false)
    expect(state.visiblePresentationStateId).toBe(null)
    expect(state.visibleSourceKind).toBe('none')
    expect(state.overlaySourceKind).toBe('none')
    expect(state.previewRenderVm.viewerParts).toEqual([])
  })

  it('shows the newer authoritative result without previewBrep after release when release policy has a newer authoritative result than the retained base', () => {
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

    expect(state.previewState.kind).toBe('none')
    expect(state.hasPreviewReadyResult).toBe(false)
    expect(state.visibleResultClass).toBe('final')
    expect(state.visibleSourceKind).toBe('authoritative-preview')
    expect(state.geometryResult).toBe(currentAuthoritativeGeometryResult)
    expect(state.visiblePresentationStateId).toBe(null)
    expect(state.retainedBasePresentationStateId).toBe('lastLoaded')
    expect(state.overlayResultClass).toBe(null)
    expect(state.acceptedState.isVisible).toBe(false)
  })

  it('shows the newer authoritative result without previewBrep after release in final mode', () => {
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
        buildRequestId: 'build-request-old-final-final-release',
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
        handleId: 'shape-set-old-final-final-release',
      },
    })
    const currentAuthoritativeGeometryResult = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-new-final-final-release',
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
        handleId: 'shape-set-new-final-final-release',
      },
    })

    const state = selectViewportResultState({
      requestedMode: 'final',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('final'),
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

    expect(state.previewState.kind).toBe('none')
    expect(state.hasPreviewReadyResult).toBe(false)
    expect(state.visibleResultClass).toBe('final')
    expect(state.visibleSourceKind).toBe('authoritative-preview')
    expect(state.geometryResult).toBe(currentAuthoritativeGeometryResult)
    expect(state.visiblePresentationStateId).toBe(null)
    expect(state.retainedBasePresentationStateId).toBe('lastLoaded')
    expect(state.overlayResultClass).toBe(null)
    expect(state.acceptedState.isVisible).toBe(false)
  })

  it('keeps manual mode visually unchanged before explicit build starts', () => {
    const acceptedAuthoritativeGeometryResult = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-current-final-manual-idle',
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
        handleId: 'shape-set-current-final-manual-idle',
      },
    })

    const state = selectViewportResultState({
      requestedMode: 'auto',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('auto'),
      acceptedAuthoritativeGeometryResult,
      acceptedDraftGeometryResult: null,
      committedAuthoritativeGeometryResult: acceptedAuthoritativeGeometryResult,
      committedDraftGeometryResult: null,
      acceptedPreviewBuildOutputs: [],
      previewPreparation: null,
      viewerTargetGraphDocumentId: 'graph-document-1',
      suppressViewerTargetArtifactPreview: false,
      useProjectDraftPreview: false,
      activeDraftProjectViewerParts: [],
      browserExecutionPolicy: 'manual',
      isInteractionActive: false,
    })

    expect(state.previewState.kind).toBe('none')
    expect(state.visibleResultClass).toBe('final')
    expect(state.visiblePresentationStateId).toBe(null)
    expect(state.overlayResultClass).toBe(null)
    expect(state.acceptedState.isVisible).toBe(true)
  })

  it('shows the newer authoritative result without previewBrep after explicit build starts in final manual mode', () => {
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
        buildRequestId: 'build-request-old-final-final-manual',
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
        handleId: 'shape-set-old-final-final-manual',
      },
    })
    const currentAuthoritativeGeometryResult = createAuthoritativeGeometryResultBundle({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-new-final-final-manual',
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
        handleId: 'shape-set-new-final-final-manual',
      },
    })

    const state = selectViewportResultState({
      requestedMode: 'final',
      modeBehavior: resolveWorkspaceViewportResultModeBehavior('final'),
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
      browserExecutionPolicy: 'manual',
      isInteractionActive: false,
    })

    expect(state.previewState.kind).toBe('none')
    expect(state.hasPreviewReadyResult).toBe(false)
    expect(state.visibleResultClass).toBe('final')
    expect(state.visibleSourceKind).toBe('authoritative-preview')
    expect(state.geometryResult).toBe(currentAuthoritativeGeometryResult)
    expect(state.visiblePresentationStateId).toBe(null)
    expect(state.overlayResultClass).toBe(null)
    expect(state.acceptedState.isVisible).toBe(false)
  })

  describe('Phase 5 nine-state matrix', () => {
    const cases: Phase5SelectorMatrixCase[] = [
      {
        label: 'Auto / Live - Settled Draft',
        mode: 'auto',
        policy: 'live',
        expected: {
          visibleResultClass: 'draft',
          visiblePresentationStateId: 'lastLoaded',
          previewStateKind: 'none',
          layerRecipeKind: 'base-only',
          basePresentationStateId: 'lastLoaded',
          overlayPresentationStateId: null,
        },
      },
      {
        label: 'Auto / On Release - Active Drag',
        mode: 'auto',
        policy: 'release',
        expected: {
          visibleResultClass: 'final',
          visiblePresentationStateId: 'lastLoaded',
          previewStateKind: 'none',
          layerRecipeKind: 'base-only',
          basePresentationStateId: 'lastLoaded',
          overlayPresentationStateId: null,
        },
      },
      {
        label: 'Auto / Manual - Before Build',
        mode: 'auto',
        policy: 'manual',
        expected: {
          visibleResultClass: 'final',
          visiblePresentationStateId: null,
          previewStateKind: 'none',
          layerRecipeKind: 'base-only',
          basePresentationStateId: null,
          overlayPresentationStateId: null,
        },
      },
      {
        label: 'Draft / Live - Active Drag',
        mode: 'draft',
        policy: 'live',
        expected: {
          visibleResultClass: 'draft',
          visiblePresentationStateId: 'previewMesh',
          previewStateKind: 'live-preview',
          layerRecipeKind: 'base-only',
          basePresentationStateId: 'previewMesh',
          overlayPresentationStateId: null,
        },
      },
      {
        label: 'Draft / On Release - Settled Draft',
        mode: 'draft',
        policy: 'release',
        expected: {
          visibleResultClass: 'draft',
          visiblePresentationStateId: 'lastLoaded',
          previewStateKind: 'none',
          layerRecipeKind: 'base-only',
          basePresentationStateId: 'lastLoaded',
          overlayPresentationStateId: null,
        },
      },
      {
        label: 'Draft / Manual - Before Build',
        mode: 'draft',
        policy: 'manual',
        expected: {
          visibleResultClass: 'draft',
          visiblePresentationStateId: 'lastLoaded',
          previewStateKind: 'none',
          layerRecipeKind: 'base-only',
          basePresentationStateId: 'lastLoaded',
          overlayPresentationStateId: null,
        },
      },
      {
        label: 'Final / Live - Preview Ready',
        mode: 'final',
        policy: 'live',
        expected: {
          visibleResultClass: 'final',
          visiblePresentationStateId: 'previewBrep',
          previewStateKind: 'preview-ready',
          layerRecipeKind: 'retained-plus-overlay',
          basePresentationStateId: 'lastLoaded',
          overlayPresentationStateId: 'previewBrep',
        },
      },
      {
        label: 'Final / On Release - Post Release',
        mode: 'final',
        policy: 'release',
        expected: {
          visibleResultClass: 'final',
          visiblePresentationStateId: null,
          previewStateKind: 'none',
          layerRecipeKind: 'base-only',
          basePresentationStateId: 'lastLoaded',
          overlayPresentationStateId: null,
        },
      },
      {
        label: 'Final / Manual - After Build',
        mode: 'final',
        policy: 'manual',
        expected: {
          visibleResultClass: 'final',
          visiblePresentationStateId: null,
          previewStateKind: 'none',
          layerRecipeKind: 'base-only',
          basePresentationStateId: 'lastLoaded',
          overlayPresentationStateId: null,
        },
      },
    ]

    it.each(cases)('locks selector-visible truth for %s', (testCase) => {
      const state = buildPhase5SelectorMatrixState(testCase)

      expect(state.visibleResultClass).toBe(testCase.expected.visibleResultClass)
      expect(state.visiblePresentationStateId).toBe(
        testCase.expected.visiblePresentationStateId,
      )
      expect(state.previewState.kind).toBe(testCase.expected.previewStateKind)
      expect(state.layerRecipe.kind).toBe(testCase.expected.layerRecipeKind)
      expect(state.layerRecipe.basePresentationStateId).toBe(
        testCase.expected.basePresentationStateId,
      )
      expect(state.layerRecipe.overlayPresentationStateId).toBe(
        testCase.expected.overlayPresentationStateId,
      )
    })
  })
})
