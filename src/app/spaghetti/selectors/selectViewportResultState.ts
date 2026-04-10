import {
  toViewerRenderablePart,
  type PartArtifact,
  type ViewerRenderablePart,
} from '../../../shared/buildTypes'
import type { GeometryMesh, GeometryResultBundle } from '../../../shared/geometryResult'
import type { GraphPreviewPreparation } from '../previewPreparation'
import {
  selectPreviewRenderVmFromPreparation,
  type PreviewRenderVm,
} from './selectPreviewRenderVm'
import type { WorkspaceViewportResultMode } from '../../workspace/workspaceShellTypes'
import type { WorkspaceViewportResultModeBehavior } from '../../workspace/workspaceViewportResultMode'

const EMPTY_PREVIEW_RENDER_VM: PreviewRenderVm = {
  items: [],
  viewerParts: [],
}

export type ViewportVisibleResultClass = 'draft' | 'final' | null

export type ViewportVisibleSourceKind =
  | 'retained-draft'
  | 'retained-final'
  | 'artifact-preview'
  | 'none'

export type ViewportLayerSourceKind = ViewportVisibleSourceKind | 'authoritative-preview'

export type ViewportRetainedBaseState =
  | 'none'
  | 'current'
  | 'retained'
  | 'cleared-by-dependency-break'

export type ViewportFallbackReason =
  | 'artifact-preview-bridge'
  | 'final-unavailable'
  | 'no-accepted-geometry'
  | 'mode-disallows-available-result'

export type ViewportResultState = {
  requestedMode: WorkspaceViewportResultMode
  visibleResultClass: ViewportVisibleResultClass
  visibleSourceKind: ViewportVisibleSourceKind
  geometryResult: GeometryResultBundle | null
  artifactBuildOutputs: readonly PartArtifact[]
  previewPreparation: GraphPreviewPreparation | null
  renderVm: PreviewRenderVm
  previewRenderVm: PreviewRenderVm
  retainedBaseState: ViewportRetainedBaseState
  retainedBaseResultClass: ViewportVisibleResultClass
  retainedBaseSourceKind: ViewportLayerSourceKind
  retainedBaseGeometryResult: GeometryResultBundle | null
  retainedBaseRenderVm: PreviewRenderVm
  overlayResultClass: ViewportVisibleResultClass
  overlaySourceKind: ViewportLayerSourceKind
  overlayGeometryResult: GeometryResultBundle | null
  overlayRenderVm: PreviewRenderVm
  isPendingFinal: boolean
  isUsingFallback: boolean
  fallbackReason: ViewportFallbackReason | null
}

type SelectViewportResultStateOptions = {
  requestedMode: WorkspaceViewportResultMode
  modeBehavior: WorkspaceViewportResultModeBehavior
  acceptedAuthoritativeGeometryResult: GeometryResultBundle | null
  acceptedDraftGeometryResult: GeometryResultBundle | null
  committedAuthoritativeGeometryResult: GeometryResultBundle | null
  committedDraftGeometryResult: GeometryResultBundle | null
  acceptedPreviewBuildOutputs: readonly PartArtifact[]
  previewPreparation: GraphPreviewPreparation | null
  viewerTargetGraphDocumentId: string | null
  suppressViewerTargetArtifactPreview: boolean
  useProjectDraftPreview: boolean
  activeDraftProjectViewerParts: readonly ViewerRenderablePart[]
}

const qualifyViewerKey = (graphDocumentId: string, viewerKey: string): string =>
  `${graphDocumentId}:${viewerKey}`

const qualifyPreviewRenderVm = (
  previewVm: PreviewRenderVm,
  graphDocumentId: string | null,
): PreviewRenderVm => {
  if (graphDocumentId === null) {
    return previewVm
  }
  return {
    items: previewVm.items.map((item) => {
      const viewerKey = qualifyViewerKey(graphDocumentId, item.viewerKey)
      return {
        ...item,
        viewerKey,
        viewerPart:
          item.viewerPart === null
            ? null
            : {
                ...item.viewerPart,
                viewerKey,
              },
      }
    }),
    viewerParts: previewVm.viewerParts.map((viewerPart) => ({
      ...viewerPart,
      viewerKey: qualifyViewerKey(graphDocumentId, viewerPart.viewerKey),
    })),
  }
}

const buildArtifactPreviewRenderVm = (options: {
  useProjectDraftPreview: boolean
  activeDraftProjectViewerParts: readonly ViewerRenderablePart[]
  previewPreparation: GraphPreviewPreparation | null
  artifactBuildOutputs: readonly PartArtifact[]
  viewerTargetGraphDocumentId: string | null
}): PreviewRenderVm => {
  if (options.useProjectDraftPreview) {
    return {
      items: [],
      viewerParts: [...options.activeDraftProjectViewerParts],
    }
  }
  if (options.previewPreparation === null) {
    return EMPTY_PREVIEW_RENDER_VM
  }
  const previewVm = selectPreviewRenderVmFromPreparation(
    options.previewPreparation,
    [...options.artifactBuildOutputs],
  )
  return qualifyPreviewRenderVm(previewVm, options.viewerTargetGraphDocumentId)
}

const cloneGeometryMesh = (mesh: GeometryMesh): GeometryMesh => ({
  vertices: [...mesh.vertices],
  indices: [...mesh.indices],
})

const buildGeometryPreviewRenderVm = (options: {
  geometryResult: GeometryResultBundle | null
  viewerTargetGraphDocumentId: string | null
  label: string
  viewerKeySuffix: string
}): PreviewRenderVm => {
  const geometryResult = options.geometryResult
  const meshPreview = geometryResult?.meshPreview
  if (geometryResult === null || meshPreview === null || meshPreview === undefined) {
    return EMPTY_PREVIEW_RENDER_VM
  }

  const graphDocumentId =
    options.viewerTargetGraphDocumentId ?? geometryResult.request.graphDocumentId
  const viewerKey = `${graphDocumentId}:${options.viewerKeySuffix}`
  const artifact: PartArtifact = {
    id: viewerKey,
    kind: 'mesh',
    label: options.label,
    mesh: cloneGeometryMesh(meshPreview),
    partKeyStr: viewerKey,
    partKey: {
      id: viewerKey,
      instance: null,
    },
  }

  return {
    items: [],
    viewerParts: [toViewerRenderablePart(artifact, viewerKey)],
  }
}

const buildAuthoritativeRenderVm = (options: {
  geometryResult: GeometryResultBundle | null
  viewerTargetGraphDocumentId: string | null
}): PreviewRenderVm =>
  buildGeometryPreviewRenderVm({
    ...options,
    label: 'Authoritative Preview',
    viewerKeySuffix: 'authoritative-preview',
  })

const buildDraftGeometryRenderVm = (options: {
  geometryResult: GeometryResultBundle | null
  viewerTargetGraphDocumentId: string | null
}): PreviewRenderVm =>
  buildGeometryPreviewRenderVm({
    ...options,
    label: 'Draft Preview',
    viewerKeySuffix: 'draft-preview',
  })

const buildEmptyResultState = (
  options: SelectViewportResultStateOptions,
  artifactBuildOutputs: readonly PartArtifact[],
  overrides: {
    retainedBaseState?: ViewportRetainedBaseState
    retainedBaseResultClass?: ViewportVisibleResultClass
    retainedBaseSourceKind?: ViewportLayerSourceKind
    retainedBaseGeometryResult?: GeometryResultBundle | null
    retainedBaseRenderVm?: PreviewRenderVm
    overlayResultClass?: ViewportVisibleResultClass
    overlaySourceKind?: ViewportLayerSourceKind
    overlayGeometryResult?: GeometryResultBundle | null
    overlayRenderVm?: PreviewRenderVm
    isPendingFinal: boolean
    isUsingFallback: boolean
    fallbackReason: ViewportFallbackReason
  },
): ViewportResultState => ({
  requestedMode: options.requestedMode,
  visibleResultClass: null,
  visibleSourceKind: 'none',
  geometryResult: null,
  artifactBuildOutputs,
  previewPreparation: options.previewPreparation,
  renderVm: EMPTY_PREVIEW_RENDER_VM,
  previewRenderVm: EMPTY_PREVIEW_RENDER_VM,
  retainedBaseState: overrides.retainedBaseState ?? 'none',
  retainedBaseResultClass: overrides.retainedBaseResultClass ?? null,
  retainedBaseSourceKind: overrides.retainedBaseSourceKind ?? 'none',
  retainedBaseGeometryResult: overrides.retainedBaseGeometryResult ?? null,
  retainedBaseRenderVm: overrides.retainedBaseRenderVm ?? EMPTY_PREVIEW_RENDER_VM,
  overlayResultClass: overrides.overlayResultClass ?? null,
  overlaySourceKind: overrides.overlaySourceKind ?? 'none',
  overlayGeometryResult: overrides.overlayGeometryResult ?? null,
  overlayRenderVm: overrides.overlayRenderVm ?? EMPTY_PREVIEW_RENDER_VM,
  isPendingFinal: overrides.isPendingFinal,
  isUsingFallback: overrides.isUsingFallback,
  fallbackReason: overrides.fallbackReason,
})

const hasCurrentOutputContinuation = (
  previewPreparation: GraphPreviewPreparation | null,
): boolean => {
  if (previewPreparation === null) {
    return false
  }
  return previewPreparation.previewCandidateSlotIds.some((slotId) => {
    const slotStatus = previewPreparation.slotStatusBySlotId[slotId]
    const sourceNodeId = previewPreparation.sourceNodeIdBySlotId[slotId]
    const sourcePartKey = previewPreparation.sourcePartKeyBySlotId[slotId]
    return (
      slotStatus === 'ok' &&
      typeof sourceNodeId === 'string' &&
      sourceNodeId.length > 0 &&
      typeof sourcePartKey === 'string' &&
      sourcePartKey.length > 0
    )
  })
}

type ViewportLayerCandidate = {
  resultClass: ViewportVisibleResultClass
  sourceKind: ViewportLayerSourceKind
  geometryResult: GeometryResultBundle | null
  renderVm: PreviewRenderVm
}

const EMPTY_LAYER_CANDIDATE: ViewportLayerCandidate = {
  resultClass: null,
  sourceKind: 'none',
  geometryResult: null,
  renderVm: EMPTY_PREVIEW_RENDER_VM,
}

const resolveRetainedBaseCandidate = (options: {
  requestedMode: WorkspaceViewportResultMode
  currentAuthoritativeGeometryResult: GeometryResultBundle | null
  committedAuthoritativeGeometryResult: GeometryResultBundle | null
  currentAuthoritativeRenderVm: PreviewRenderVm
  committedAuthoritativeRenderVm: PreviewRenderVm
  currentDraftGeometryResult: GeometryResultBundle | null
  committedDraftGeometryResult: GeometryResultBundle | null
  currentDraftRenderVm: PreviewRenderVm
  committedDraftRenderVm: PreviewRenderVm
  hasCurrentOutputContinuation: boolean
}): {
  retainedBaseState: ViewportRetainedBaseState
  baseCandidate: ViewportLayerCandidate
} => {
  if (options.requestedMode === 'draft') {
    const hasRenderableCurrentDraft = options.currentDraftRenderVm.viewerParts.length > 0
    if (options.currentDraftGeometryResult !== null && hasRenderableCurrentDraft) {
      return {
        retainedBaseState: 'current',
        baseCandidate: {
          resultClass: 'draft',
          sourceKind: 'retained-draft',
          geometryResult: options.currentDraftGeometryResult,
          renderVm: options.currentDraftRenderVm,
        },
      }
    }
    if (options.committedDraftGeometryResult === null) {
      return { retainedBaseState: 'none', baseCandidate: EMPTY_LAYER_CANDIDATE }
    }
    if (
      !options.hasCurrentOutputContinuation ||
      options.committedDraftRenderVm.viewerParts.length === 0
    ) {
      return { retainedBaseState: 'cleared-by-dependency-break', baseCandidate: EMPTY_LAYER_CANDIDATE }
    }
    return {
      retainedBaseState: 'retained',
      baseCandidate: {
        resultClass: 'draft',
        sourceKind: 'retained-draft',
        geometryResult: options.committedDraftGeometryResult,
        renderVm: options.committedDraftRenderVm,
      },
    }
  }

  const hasRenderableAuthoritative = options.committedAuthoritativeRenderVm.viewerParts.length > 0
  if (
    options.currentAuthoritativeGeometryResult !== null &&
    options.currentAuthoritativeRenderVm.viewerParts.length > 0
  ) {
    return {
      retainedBaseState: 'current',
      baseCandidate: {
        resultClass: 'final',
        sourceKind: 'retained-final',
        geometryResult: options.currentAuthoritativeGeometryResult,
        renderVm: options.currentAuthoritativeRenderVm,
      },
    }
  }
  if (options.committedAuthoritativeGeometryResult === null) {
    return { retainedBaseState: 'none', baseCandidate: EMPTY_LAYER_CANDIDATE }
  }
  if (!options.hasCurrentOutputContinuation || !hasRenderableAuthoritative) {
    return { retainedBaseState: 'cleared-by-dependency-break', baseCandidate: EMPTY_LAYER_CANDIDATE }
  }
  return {
    retainedBaseState: 'retained',
    baseCandidate: {
      resultClass: 'final',
      sourceKind: 'retained-final',
      geometryResult: options.committedAuthoritativeGeometryResult,
      renderVm: options.committedAuthoritativeRenderVm,
    },
  }
}

const resolveOverlayCandidate = (options: {
  requestedMode: WorkspaceViewportResultMode
  currentAuthoritativeGeometryResult: GeometryResultBundle | null
  currentAuthoritativeRenderVm: PreviewRenderVm
  currentDraftGeometryResult: GeometryResultBundle | null
  previewRenderVm: PreviewRenderVm
}): ViewportLayerCandidate => {
  if (options.requestedMode === 'final') {
    return options.currentAuthoritativeGeometryResult !== null &&
      options.currentAuthoritativeRenderVm.viewerParts.length > 0
      ? {
          resultClass: 'final',
          sourceKind: 'authoritative-preview',
          geometryResult: options.currentAuthoritativeGeometryResult,
          renderVm: options.currentAuthoritativeRenderVm,
        }
      : EMPTY_LAYER_CANDIDATE
  }
  return options.previewRenderVm.viewerParts.length > 0
    ? {
        resultClass: 'draft',
        sourceKind: 'artifact-preview',
        geometryResult: options.currentDraftGeometryResult,
        renderVm: options.previewRenderVm,
      }
    : EMPTY_LAYER_CANDIDATE
}

export const selectViewportResultState = (
  options: SelectViewportResultStateOptions,
): ViewportResultState => {
  const finalGeometryResult = options.acceptedAuthoritativeGeometryResult
  const draftGeometryResult = options.acceptedDraftGeometryResult
  const artifactBuildOutputs = options.suppressViewerTargetArtifactPreview
    ? ([] as readonly PartArtifact[])
    : options.acceptedPreviewBuildOutputs
  const previewRenderVm = buildArtifactPreviewRenderVm({
    useProjectDraftPreview: options.useProjectDraftPreview,
    activeDraftProjectViewerParts: options.activeDraftProjectViewerParts,
    previewPreparation: options.previewPreparation,
    artifactBuildOutputs,
    viewerTargetGraphDocumentId: options.viewerTargetGraphDocumentId,
  })
  const authoritativeRenderVm = buildAuthoritativeRenderVm({
    geometryResult: finalGeometryResult,
    viewerTargetGraphDocumentId: options.viewerTargetGraphDocumentId,
  })
  const committedAuthoritativeRenderVm = buildAuthoritativeRenderVm({
    geometryResult: options.committedAuthoritativeGeometryResult,
    viewerTargetGraphDocumentId: options.viewerTargetGraphDocumentId,
  })
  const currentDraftGeometryRenderVm = buildDraftGeometryRenderVm({
    geometryResult: draftGeometryResult,
    viewerTargetGraphDocumentId: options.viewerTargetGraphDocumentId,
  })
  const committedDraftRenderVm = buildDraftGeometryRenderVm({
    geometryResult: options.committedDraftGeometryResult,
    viewerTargetGraphDocumentId: options.viewerTargetGraphDocumentId,
  })
  const hasOutputContinuation = hasCurrentOutputContinuation(options.previewPreparation)
  const { retainedBaseState, baseCandidate } = resolveRetainedBaseCandidate({
    requestedMode: options.requestedMode,
    currentAuthoritativeGeometryResult: finalGeometryResult,
    committedAuthoritativeGeometryResult: options.committedAuthoritativeGeometryResult,
    currentAuthoritativeRenderVm: authoritativeRenderVm,
    committedAuthoritativeRenderVm,
    currentDraftGeometryResult: draftGeometryResult,
    committedDraftGeometryResult: options.committedDraftGeometryResult,
    currentDraftRenderVm: currentDraftGeometryRenderVm,
    committedDraftRenderVm,
    hasCurrentOutputContinuation: hasOutputContinuation,
  })
  const overlayCandidate = resolveOverlayCandidate({
    requestedMode: options.requestedMode,
    currentAuthoritativeGeometryResult: finalGeometryResult,
    currentAuthoritativeRenderVm: authoritativeRenderVm,
    currentDraftGeometryResult: draftGeometryResult,
    previewRenderVm,
  })
  const hasUsableDraftPreview = previewRenderVm.viewerParts.length > 0
  const hasRenderableFinal = authoritativeRenderVm.viewerParts.length > 0
  const hasUsableGeometry = hasUsableDraftPreview || hasRenderableFinal

  if (hasRenderableFinal && finalGeometryResult !== null && options.modeBehavior.allowsFinalDisplay) {
    return {
      requestedMode: options.requestedMode,
      visibleResultClass: 'final',
      visibleSourceKind: 'retained-final',
      geometryResult: finalGeometryResult,
      artifactBuildOutputs,
      previewPreparation: options.previewPreparation,
      renderVm: authoritativeRenderVm,
      previewRenderVm,
      retainedBaseState,
      retainedBaseResultClass: baseCandidate.resultClass,
      retainedBaseSourceKind: baseCandidate.sourceKind,
      retainedBaseGeometryResult: baseCandidate.geometryResult,
      retainedBaseRenderVm: baseCandidate.renderVm,
      overlayResultClass: overlayCandidate.resultClass,
      overlaySourceKind: overlayCandidate.sourceKind,
      overlayGeometryResult: overlayCandidate.geometryResult,
      overlayRenderVm: overlayCandidate.renderVm,
      isPendingFinal: false,
      isUsingFallback: false,
      fallbackReason: null,
    }
  }

  if (hasUsableDraftPreview && options.modeBehavior.allowsDraftDisplay) {
    return {
      requestedMode: options.requestedMode,
      visibleResultClass: 'draft',
      visibleSourceKind: 'artifact-preview',
      geometryResult: draftGeometryResult,
      artifactBuildOutputs,
      previewPreparation: options.previewPreparation,
      renderVm: previewRenderVm,
      previewRenderVm,
      retainedBaseState,
      retainedBaseResultClass: baseCandidate.resultClass,
      retainedBaseSourceKind: baseCandidate.sourceKind,
      retainedBaseGeometryResult: baseCandidate.geometryResult,
      retainedBaseRenderVm: baseCandidate.renderVm,
      overlayResultClass: overlayCandidate.resultClass,
      overlaySourceKind: overlayCandidate.sourceKind,
      overlayGeometryResult: overlayCandidate.geometryResult,
      overlayRenderVm: overlayCandidate.renderVm,
      isPendingFinal: options.modeBehavior.allowsFinalReplacement && !hasRenderableFinal,
      isUsingFallback: true,
      fallbackReason: 'artifact-preview-bridge',
    }
  }

  if (options.requestedMode === 'final') {
    return buildEmptyResultState(options, artifactBuildOutputs, {
      retainedBaseState,
      retainedBaseResultClass: baseCandidate.resultClass,
      retainedBaseSourceKind: baseCandidate.sourceKind,
      retainedBaseGeometryResult: baseCandidate.geometryResult,
      retainedBaseRenderVm: baseCandidate.renderVm,
      overlayResultClass: overlayCandidate.resultClass,
      overlaySourceKind: overlayCandidate.sourceKind,
      overlayGeometryResult: overlayCandidate.geometryResult,
      overlayRenderVm: overlayCandidate.renderVm,
      isPendingFinal: false,
      isUsingFallback: true,
      fallbackReason: 'final-unavailable',
    })
  }

  if (!hasUsableGeometry) {
    return buildEmptyResultState(options, artifactBuildOutputs, {
      retainedBaseState,
      retainedBaseResultClass: baseCandidate.resultClass,
      retainedBaseSourceKind: baseCandidate.sourceKind,
      retainedBaseGeometryResult: baseCandidate.geometryResult,
      retainedBaseRenderVm: baseCandidate.renderVm,
      overlayResultClass: overlayCandidate.resultClass,
      overlaySourceKind: overlayCandidate.sourceKind,
      overlayGeometryResult: overlayCandidate.geometryResult,
      overlayRenderVm: overlayCandidate.renderVm,
      isPendingFinal: false,
      isUsingFallback: true,
      fallbackReason: 'no-accepted-geometry',
    })
  }

  return buildEmptyResultState(options, artifactBuildOutputs, {
    retainedBaseState,
    retainedBaseResultClass: baseCandidate.resultClass,
    retainedBaseSourceKind: baseCandidate.sourceKind,
    retainedBaseGeometryResult: baseCandidate.geometryResult,
    retainedBaseRenderVm: baseCandidate.renderVm,
    overlayResultClass: overlayCandidate.resultClass,
    overlaySourceKind: overlayCandidate.sourceKind,
    overlayGeometryResult: overlayCandidate.geometryResult,
    overlayRenderVm: overlayCandidate.renderVm,
    isPendingFinal: false,
    isUsingFallback: true,
    fallbackReason: 'mode-disallows-available-result',
  })
}
