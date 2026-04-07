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
  isPendingFinal: boolean
  isUsingFallback: boolean
  fallbackReason: ViewportFallbackReason | null
}

type SelectViewportResultStateOptions = {
  requestedMode: WorkspaceViewportResultMode
  modeBehavior: WorkspaceViewportResultModeBehavior
  acceptedAuthoritativeGeometryResult: GeometryResultBundle | null
  acceptedDraftGeometryResult: GeometryResultBundle | null
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

const buildAuthoritativeRenderVm = (options: {
  geometryResult: GeometryResultBundle | null
  viewerTargetGraphDocumentId: string | null
}): PreviewRenderVm => {
  const geometryResult = options.geometryResult
  const meshPreview = geometryResult?.meshPreview
  if (geometryResult === null || meshPreview === null || meshPreview === undefined) {
    return EMPTY_PREVIEW_RENDER_VM
  }

  const graphDocumentId =
    options.viewerTargetGraphDocumentId ?? geometryResult.request.graphDocumentId
  const viewerKey = `${graphDocumentId}:authoritative-preview`
  const artifact: PartArtifact = {
    id: viewerKey,
    kind: 'mesh',
    label: 'Authoritative Preview',
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

const buildEmptyResultState = (
  options: SelectViewportResultStateOptions,
  artifactBuildOutputs: readonly PartArtifact[],
  overrides: {
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
  isPendingFinal: overrides.isPendingFinal,
  isUsingFallback: overrides.isUsingFallback,
  fallbackReason: overrides.fallbackReason,
})

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
      isPendingFinal: options.modeBehavior.allowsFinalReplacement && !hasRenderableFinal,
      isUsingFallback: true,
      fallbackReason: 'artifact-preview-bridge',
    }
  }

  if (options.requestedMode === 'final') {
    return buildEmptyResultState(options, artifactBuildOutputs, {
      isPendingFinal: false,
      isUsingFallback: true,
      fallbackReason: 'final-unavailable',
    })
  }

  if (!hasUsableGeometry) {
    return buildEmptyResultState(options, artifactBuildOutputs, {
      isPendingFinal: false,
      isUsingFallback: true,
      fallbackReason: 'no-accepted-geometry',
    })
  }

  return buildEmptyResultState(options, artifactBuildOutputs, {
    isPendingFinal: false,
    isUsingFallback: true,
    fallbackReason: 'mode-disallows-available-result',
  })
}
