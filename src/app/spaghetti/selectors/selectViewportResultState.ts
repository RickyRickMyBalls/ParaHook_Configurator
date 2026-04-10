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
export type ViewportPresentationStateId = 'lastLoaded' | 'previewMesh' | 'previewBrep'
export type ViewportBrowserExecutionPolicy = 'live' | 'release' | 'manual' | 'off'

export type ViewportVisibleSourceKind =
  | 'retained-draft'
  | 'retained-final'
  | 'artifact-preview'
  | 'authoritative-preview'
  | 'none'

export type ViewportLayerSourceKind = ViewportVisibleSourceKind

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

export type ViewportLastLoadedState = {
  isAvailable: boolean
  presentationStateId: 'lastLoaded' | null
  resultClass: ViewportVisibleResultClass
  sourceKind: ViewportLayerSourceKind
  geometryResult: GeometryResultBundle | null
  renderVm: PreviewRenderVm
}

export type ViewportPreviewStateKind = 'none' | 'live-preview' | 'preview-ready'

export type ViewportPreviewState = {
  kind: ViewportPreviewStateKind
  presentationStateId: Exclude<ViewportPresentationStateId, 'lastLoaded'> | null
  resultClass: ViewportVisibleResultClass
  sourceKind: ViewportLayerSourceKind
  geometryResult: GeometryResultBundle | null
  renderVm: PreviewRenderVm
}

export type ViewportAcceptedState = {
  kind: 'none' | 'accepted'
  resultClass: ViewportVisibleResultClass
  sourceKind: ViewportLayerSourceKind
  geometryResult: GeometryResultBundle | null
  renderVm: PreviewRenderVm
  isVisible: boolean
}

export type ViewportResultState = {
  requestedMode: WorkspaceViewportResultMode
  browserExecutionPolicy: ViewportBrowserExecutionPolicy
  isInteractionActive: boolean
  hasQueuedPreview: boolean
  hasRetainedAcceptedBase: boolean
  hasLivePreview: boolean
  hasPreviewReadyResult: boolean
  visiblePresentationStateId: ViewportPresentationStateId | null
  retainedBasePresentationStateId: ViewportPresentationStateId | null
  overlayPresentationStateId: ViewportPresentationStateId | null
  lastLoadedState: ViewportLastLoadedState
  previewState: ViewportPreviewState
  acceptedState: ViewportAcceptedState
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
  previewReadyAuthoritativeGeometryResult?: GeometryResultBundle | null
  acceptedDraftGeometryResult: GeometryResultBundle | null
  committedAuthoritativeGeometryResult: GeometryResultBundle | null
  committedDraftGeometryResult: GeometryResultBundle | null
  acceptedPreviewBuildOutputs: readonly PartArtifact[]
  previewPreparation: GraphPreviewPreparation | null
  viewerTargetGraphDocumentId: string | null
  suppressViewerTargetArtifactPreview: boolean
  useProjectDraftPreview: boolean
  activeDraftProjectViewerParts: readonly ViewerRenderablePart[]
  browserExecutionPolicy?: ViewportBrowserExecutionPolicy
  isInteractionActive?: boolean
  hasDelayedDraftPlaceholder?: boolean
  hasDelayedAuthoritativePlaceholder?: boolean
}

type ViewportLayerCandidate = {
  resultClass: ViewportVisibleResultClass
  sourceKind: ViewportLayerSourceKind
  geometryResult: GeometryResultBundle | null
  renderVm: PreviewRenderVm
}

type BuildViewportResultStateArgs = {
  options: SelectViewportResultStateOptions
  artifactBuildOutputs: readonly PartArtifact[]
  previewRenderVm: PreviewRenderVm
  currentAuthoritativeGeometryResult: GeometryResultBundle | null
  currentAuthoritativeRenderVm: PreviewRenderVm
  previewReadyAuthoritativeGeometryResult: GeometryResultBundle | null
  previewReadyAuthoritativeRenderVm: PreviewRenderVm
  currentDraftGeometryResult: GeometryResultBundle | null
  currentDraftGeometryRenderVm: PreviewRenderVm
  retainedBaseState: ViewportRetainedBaseState
  baseCandidate: ViewportLayerCandidate
  visibleResultClass: ViewportVisibleResultClass
  visibleSourceKind: ViewportVisibleSourceKind
  geometryResult: GeometryResultBundle | null
  renderVm: PreviewRenderVm
  overlayCandidate: ViewportLayerCandidate
  isPendingFinal: boolean
  isUsingFallback: boolean
  fallbackReason: ViewportFallbackReason | null
}

const EMPTY_LAYER_CANDIDATE: ViewportLayerCandidate = {
  resultClass: null,
  sourceKind: 'none',
  geometryResult: null,
  renderVm: EMPTY_PREVIEW_RENDER_VM,
}

const EMPTY_LAST_LOADED_STATE: ViewportLastLoadedState = {
  isAvailable: false,
  presentationStateId: null,
  resultClass: null,
  sourceKind: 'none',
  geometryResult: null,
  renderVm: EMPTY_PREVIEW_RENDER_VM,
}

const EMPTY_PREVIEW_STATE: ViewportPreviewState = {
  kind: 'none',
  presentationStateId: null,
  resultClass: null,
  sourceKind: 'none',
  geometryResult: null,
  renderVm: EMPTY_PREVIEW_RENDER_VM,
}

const EMPTY_ACCEPTED_STATE: ViewportAcceptedState = {
  kind: 'none',
  resultClass: null,
  sourceKind: 'none',
  geometryResult: null,
  renderVm: EMPTY_PREVIEW_RENDER_VM,
  isVisible: false,
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
      return {
        retainedBaseState: 'cleared-by-dependency-break',
        baseCandidate: EMPTY_LAYER_CANDIDATE,
      }
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
    return {
      retainedBaseState: 'cleared-by-dependency-break',
      baseCandidate: EMPTY_LAYER_CANDIDATE,
    }
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
  previewReadyAuthoritativeGeometryResult: GeometryResultBundle | null
  previewReadyAuthoritativeRenderVm: PreviewRenderVm
  currentDraftGeometryResult: GeometryResultBundle | null
  previewRenderVm: PreviewRenderVm
}): ViewportLayerCandidate => {
  if (
    options.requestedMode !== 'draft' &&
    options.previewReadyAuthoritativeGeometryResult !== null &&
    options.previewReadyAuthoritativeRenderVm.viewerParts.length > 0
  ) {
    return {
      resultClass: 'final',
      sourceKind: 'authoritative-preview',
      geometryResult: options.previewReadyAuthoritativeGeometryResult,
      renderVm: options.previewReadyAuthoritativeRenderVm,
    }
  }
  return options.requestedMode !== 'final' && options.previewRenderVm.viewerParts.length > 0
    ? {
        resultClass: 'draft',
        sourceKind: 'artifact-preview',
        geometryResult: options.currentDraftGeometryResult,
        renderVm: options.previewRenderVm,
      }
    : EMPTY_LAYER_CANDIDATE
}

const getGeometryResultIdentity = (geometryResult: GeometryResultBundle | null): string | null =>
  geometryResult === null
    ? null
    : `${geometryResult.request.graphDocumentId}:${geometryResult.request.buildRequestId}`

const doesGeometryResultDifferFromCommitted = (
  currentGeometryResult: GeometryResultBundle | null,
  committedGeometryResult: GeometryResultBundle | null,
): boolean => {
  const currentIdentity = getGeometryResultIdentity(currentGeometryResult)
  if (currentIdentity === null) {
    return false
  }
  return currentIdentity !== getGeometryResultIdentity(committedGeometryResult)
}

const buildCandidate = (
  resultClass: ViewportVisibleResultClass,
  sourceKind: ViewportLayerSourceKind,
  geometryResult: GeometryResultBundle | null,
  renderVm: PreviewRenderVm,
): ViewportLayerCandidate =>
  renderVm.viewerParts.length > 0
    ? {
        resultClass,
        sourceKind,
        geometryResult,
        renderVm,
      }
    : EMPTY_LAYER_CANDIDATE

const resolveLastLoadedState = (
  retainedBaseState: ViewportRetainedBaseState,
  baseCandidate: ViewportLayerCandidate,
): ViewportLastLoadedState =>
  retainedBaseState === 'retained' && baseCandidate.resultClass !== null
    ? {
        isAvailable: true,
        presentationStateId: 'lastLoaded',
        resultClass: baseCandidate.resultClass,
        sourceKind: baseCandidate.sourceKind,
        geometryResult: baseCandidate.geometryResult,
        renderVm: baseCandidate.renderVm,
      }
    : EMPTY_LAST_LOADED_STATE

const resolvePreviewState = (options: {
  requestedMode: WorkspaceViewportResultMode
  browserExecutionPolicy: ViewportBrowserExecutionPolicy
  isInteractionActive: boolean
  hasDelayedDraftPlaceholder: boolean
  hasDelayedAuthoritativePlaceholder: boolean
  retainedBaseState: ViewportRetainedBaseState
  authoritativePreviewCandidate: ViewportLayerCandidate
  draftPreviewCandidate: ViewportLayerCandidate
  currentAuthoritativeDiffersFromCommitted: boolean
  currentDraftDiffersFromCommitted: boolean
}): ViewportPreviewState => {
  if (options.browserExecutionPolicy === 'off') {
    return EMPTY_PREVIEW_STATE
  }

  const isChurnContext =
    options.isInteractionActive ||
    options.retainedBaseState === 'retained' ||
    options.hasDelayedDraftPlaceholder ||
    options.hasDelayedAuthoritativePlaceholder ||
    options.currentAuthoritativeDiffersFromCommitted ||
    options.currentDraftDiffersFromCommitted

  if (!isChurnContext) {
    return EMPTY_PREVIEW_STATE
  }

  const prefersAuthoritativePreview = options.requestedMode !== 'draft'
  const allowsDraftPreview = options.requestedMode !== 'final'
  const hasAuthoritativePreview =
    options.authoritativePreviewCandidate.resultClass !== null &&
    options.currentAuthoritativeDiffersFromCommitted
  const hasDraftPreview = options.draftPreviewCandidate.resultClass !== null

  if (options.browserExecutionPolicy === 'live' && options.isInteractionActive) {
    if (prefersAuthoritativePreview && hasAuthoritativePreview) {
      return {
        kind: 'preview-ready',
        presentationStateId: 'previewBrep',
        resultClass: options.authoritativePreviewCandidate.resultClass,
        sourceKind: options.authoritativePreviewCandidate.sourceKind,
        geometryResult: options.authoritativePreviewCandidate.geometryResult,
        renderVm: options.authoritativePreviewCandidate.renderVm,
      }
    }
    if (allowsDraftPreview && hasDraftPreview) {
      return {
        kind: 'live-preview',
        presentationStateId: 'previewMesh',
        resultClass: options.draftPreviewCandidate.resultClass,
        sourceKind: options.draftPreviewCandidate.sourceKind,
        geometryResult: options.draftPreviewCandidate.geometryResult,
        renderVm: options.draftPreviewCandidate.renderVm,
      }
    }
    return EMPTY_PREVIEW_STATE
  }

  if (options.isInteractionActive) {
    return EMPTY_PREVIEW_STATE
  }

  if (prefersAuthoritativePreview && hasAuthoritativePreview) {
    return {
      kind: 'preview-ready',
      presentationStateId: 'previewBrep',
      resultClass: options.authoritativePreviewCandidate.resultClass,
      sourceKind: options.authoritativePreviewCandidate.sourceKind,
      geometryResult: options.authoritativePreviewCandidate.geometryResult,
      renderVm: options.authoritativePreviewCandidate.renderVm,
    }
  }

  if (allowsDraftPreview && hasDraftPreview) {
    return {
      kind: 'preview-ready',
      presentationStateId: 'previewMesh',
      resultClass: options.draftPreviewCandidate.resultClass,
      sourceKind: options.draftPreviewCandidate.sourceKind,
      geometryResult: options.draftPreviewCandidate.geometryResult,
      renderVm: options.draftPreviewCandidate.renderVm,
    }
  }

  return EMPTY_PREVIEW_STATE
}

const resolveVisiblePresentationStateId = (options: {
  visibleResultClass: ViewportVisibleResultClass
  visibleSourceKind: ViewportVisibleSourceKind
  previewState: ViewportPreviewState
  lastLoadedState: ViewportLastLoadedState
}): ViewportPresentationStateId | null => {
  if (options.visibleResultClass === null) {
    return null
  }
  if (options.previewState.presentationStateId !== null) {
    return options.previewState.presentationStateId
  }
  if (
    options.lastLoadedState.isAvailable &&
    options.visibleSourceKind === options.lastLoadedState.sourceKind
  ) {
    return options.lastLoadedState.presentationStateId
  }
  return null
}

const resolveAcceptedState = (options: {
  requestedMode: WorkspaceViewportResultMode
  currentAuthoritativeGeometryResult: GeometryResultBundle | null
  currentAuthoritativeRenderVm: PreviewRenderVm
  currentDraftGeometryResult: GeometryResultBundle | null
  currentDraftRenderVm: PreviewRenderVm
  visibleResultClass: ViewportVisibleResultClass
  visiblePresentationStateId: ViewportPresentationStateId | null
}): ViewportAcceptedState => {
  const acceptedCandidate =
    options.requestedMode === 'draft'
      ? buildCandidate(
          'draft',
          'retained-draft',
          options.currentDraftGeometryResult,
          options.currentDraftRenderVm,
        )
      : buildCandidate(
          'final',
          'retained-final',
          options.currentAuthoritativeGeometryResult,
          options.currentAuthoritativeRenderVm,
        )

  if (acceptedCandidate.resultClass === null) {
    return EMPTY_ACCEPTED_STATE
  }

  return {
    kind: 'accepted',
    resultClass: acceptedCandidate.resultClass,
    sourceKind: acceptedCandidate.sourceKind,
    geometryResult: acceptedCandidate.geometryResult,
    renderVm: acceptedCandidate.renderVm,
    isVisible:
      options.visibleResultClass === acceptedCandidate.resultClass &&
      options.visiblePresentationStateId === null,
  }
}

const buildViewportResultState = ({
  options,
  artifactBuildOutputs,
  previewRenderVm,
  currentAuthoritativeGeometryResult,
  currentAuthoritativeRenderVm,
  previewReadyAuthoritativeGeometryResult,
  previewReadyAuthoritativeRenderVm,
  currentDraftGeometryResult,
  currentDraftGeometryRenderVm,
  retainedBaseState,
  baseCandidate,
  visibleResultClass,
  visibleSourceKind,
  geometryResult,
  renderVm,
  overlayCandidate,
  isPendingFinal,
  isUsingFallback,
  fallbackReason,
}: BuildViewportResultStateArgs): ViewportResultState => {
  const browserExecutionPolicy = options.browserExecutionPolicy ?? 'live'
  const isInteractionActive = options.isInteractionActive === true
  const hasDelayedDraftPlaceholder = options.hasDelayedDraftPlaceholder === true
  const hasDelayedAuthoritativePlaceholder = options.hasDelayedAuthoritativePlaceholder === true
  const lastLoadedState = resolveLastLoadedState(retainedBaseState, baseCandidate)
  const previewState = resolvePreviewState({
    requestedMode: options.requestedMode,
    browserExecutionPolicy,
    isInteractionActive,
    hasDelayedDraftPlaceholder,
    hasDelayedAuthoritativePlaceholder,
    retainedBaseState,
    authoritativePreviewCandidate: buildCandidate(
      'final',
      'authoritative-preview',
      previewReadyAuthoritativeGeometryResult,
      previewReadyAuthoritativeRenderVm,
    ),
    draftPreviewCandidate: buildCandidate(
      'draft',
      'artifact-preview',
      currentDraftGeometryResult,
      previewRenderVm,
    ),
    currentAuthoritativeDiffersFromCommitted: doesGeometryResultDifferFromCommitted(
      previewReadyAuthoritativeGeometryResult,
      options.committedAuthoritativeGeometryResult,
    ),
    currentDraftDiffersFromCommitted: doesGeometryResultDifferFromCommitted(
      currentDraftGeometryResult,
      options.committedDraftGeometryResult,
    ),
  })
  const visiblePresentationStateId = resolveVisiblePresentationStateId({
    visibleResultClass,
    visibleSourceKind,
    previewState,
    lastLoadedState,
  })
  const acceptedState = resolveAcceptedState({
    requestedMode: options.requestedMode,
    currentAuthoritativeGeometryResult,
    currentAuthoritativeRenderVm,
    currentDraftGeometryResult,
    currentDraftRenderVm: currentDraftGeometryRenderVm,
    visibleResultClass,
    visiblePresentationStateId,
  })

  return {
    requestedMode: options.requestedMode,
    browserExecutionPolicy,
    isInteractionActive,
    hasQueuedPreview: hasDelayedDraftPlaceholder || hasDelayedAuthoritativePlaceholder,
    hasRetainedAcceptedBase: lastLoadedState.isAvailable,
    hasLivePreview: previewState.kind === 'live-preview',
    hasPreviewReadyResult: previewState.kind === 'preview-ready',
    visiblePresentationStateId,
    retainedBasePresentationStateId: lastLoadedState.presentationStateId,
    overlayPresentationStateId: previewState.presentationStateId,
    lastLoadedState,
    previewState,
    acceptedState,
    visibleResultClass,
    visibleSourceKind,
    geometryResult,
    artifactBuildOutputs,
    previewPreparation: options.previewPreparation,
    renderVm,
    previewRenderVm,
    retainedBaseState,
    retainedBaseResultClass: baseCandidate.resultClass,
    retainedBaseSourceKind: baseCandidate.sourceKind,
    retainedBaseGeometryResult: baseCandidate.geometryResult,
    retainedBaseRenderVm: baseCandidate.renderVm,
    overlayResultClass:
      previewState.presentationStateId === null ? null : overlayCandidate.resultClass,
    overlaySourceKind:
      previewState.presentationStateId === null ? 'none' : overlayCandidate.sourceKind,
    overlayGeometryResult:
      previewState.presentationStateId === null ? null : overlayCandidate.geometryResult,
    overlayRenderVm:
      previewState.presentationStateId === null
        ? EMPTY_PREVIEW_RENDER_VM
        : overlayCandidate.renderVm,
    isPendingFinal,
    isUsingFallback,
    fallbackReason,
  }
}

export const selectViewportResultState = (
  options: SelectViewportResultStateOptions,
): ViewportResultState => {
  const browserExecutionPolicy = options.browserExecutionPolicy ?? 'live'
  const isInteractionActive = options.isInteractionActive === true
  const finalGeometryResult = options.acceptedAuthoritativeGeometryResult
  const previewReadyAuthoritativeGeometryResult =
    options.previewReadyAuthoritativeGeometryResult ?? null
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
  const previewReadyAuthoritativeRenderVm = buildAuthoritativeRenderVm({
    geometryResult: previewReadyAuthoritativeGeometryResult,
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
    previewReadyAuthoritativeGeometryResult,
    previewReadyAuthoritativeRenderVm,
    currentDraftGeometryResult: draftGeometryResult,
    previewRenderVm,
  })
  const hasUsableDraftPreview = previewRenderVm.viewerParts.length > 0
  const hasRenderableFinal = authoritativeRenderVm.viewerParts.length > 0
  const hasRenderablePreviewReadyAuthoritative =
    previewReadyAuthoritativeRenderVm.viewerParts.length > 0
  const hasUsableGeometry = hasUsableDraftPreview || hasRenderableFinal
  const suppressVisiblePreviewDuringRelease =
    browserExecutionPolicy === 'release' && isInteractionActive

  if (suppressVisiblePreviewDuringRelease) {
    if (retainedBaseState === 'retained' && baseCandidate.resultClass !== null) {
      return buildViewportResultState({
        options,
        artifactBuildOutputs,
        previewRenderVm,
        currentAuthoritativeGeometryResult: finalGeometryResult,
        currentAuthoritativeRenderVm: authoritativeRenderVm,
        previewReadyAuthoritativeGeometryResult,
        previewReadyAuthoritativeRenderVm,
        currentDraftGeometryResult: draftGeometryResult,
        currentDraftGeometryRenderVm,
        retainedBaseState,
        baseCandidate,
        visibleResultClass: baseCandidate.resultClass,
        visibleSourceKind: baseCandidate.sourceKind,
        geometryResult: baseCandidate.geometryResult,
        renderVm: baseCandidate.renderVm,
        overlayCandidate: EMPTY_LAYER_CANDIDATE,
        isPendingFinal: false,
        isUsingFallback: false,
        fallbackReason: null,
      })
    }

    return buildViewportResultState({
      options,
      artifactBuildOutputs,
      previewRenderVm,
      currentAuthoritativeGeometryResult: finalGeometryResult,
      currentAuthoritativeRenderVm: authoritativeRenderVm,
      previewReadyAuthoritativeGeometryResult,
      previewReadyAuthoritativeRenderVm,
      currentDraftGeometryResult: draftGeometryResult,
      currentDraftGeometryRenderVm,
      retainedBaseState,
      baseCandidate,
      visibleResultClass: null,
      visibleSourceKind: 'none',
      geometryResult: null,
      renderVm: EMPTY_PREVIEW_RENDER_VM,
      overlayCandidate: EMPTY_LAYER_CANDIDATE,
      isPendingFinal: false,
      isUsingFallback: true,
      fallbackReason: 'no-accepted-geometry',
    })
  }

  if (
    hasRenderablePreviewReadyAuthoritative &&
    previewReadyAuthoritativeGeometryResult !== null &&
    options.modeBehavior.allowsFinalDisplay
  ) {
    return buildViewportResultState({
      options,
      artifactBuildOutputs,
      previewRenderVm,
      currentAuthoritativeGeometryResult: finalGeometryResult,
      currentAuthoritativeRenderVm: authoritativeRenderVm,
      previewReadyAuthoritativeGeometryResult,
      previewReadyAuthoritativeRenderVm,
      currentDraftGeometryResult: draftGeometryResult,
      currentDraftGeometryRenderVm,
      retainedBaseState,
      baseCandidate,
      visibleResultClass: 'final',
      visibleSourceKind: 'authoritative-preview',
      geometryResult: previewReadyAuthoritativeGeometryResult,
      renderVm: previewReadyAuthoritativeRenderVm,
      overlayCandidate,
      isPendingFinal: false,
      isUsingFallback: false,
      fallbackReason: null,
    })
  }

  if (hasRenderableFinal && finalGeometryResult !== null && options.modeBehavior.allowsFinalDisplay) {
    return buildViewportResultState({
      options,
      artifactBuildOutputs,
      previewRenderVm,
      currentAuthoritativeGeometryResult: finalGeometryResult,
      currentAuthoritativeRenderVm: authoritativeRenderVm,
      previewReadyAuthoritativeGeometryResult,
      previewReadyAuthoritativeRenderVm,
      currentDraftGeometryResult: draftGeometryResult,
      currentDraftGeometryRenderVm,
      retainedBaseState,
      baseCandidate,
      visibleResultClass: 'final',
      visibleSourceKind: 'retained-final',
      geometryResult: finalGeometryResult,
      renderVm: authoritativeRenderVm,
      overlayCandidate,
      isPendingFinal: false,
      isUsingFallback: false,
      fallbackReason: null,
    })
  }

  if (hasUsableDraftPreview && options.modeBehavior.allowsDraftDisplay) {
    return buildViewportResultState({
      options,
      artifactBuildOutputs,
      previewRenderVm,
      currentAuthoritativeGeometryResult: finalGeometryResult,
      currentAuthoritativeRenderVm: authoritativeRenderVm,
      previewReadyAuthoritativeGeometryResult,
      previewReadyAuthoritativeRenderVm,
      currentDraftGeometryResult: draftGeometryResult,
      currentDraftGeometryRenderVm,
      retainedBaseState,
      baseCandidate,
      visibleResultClass: 'draft',
      visibleSourceKind: 'artifact-preview',
      geometryResult: draftGeometryResult,
      renderVm: previewRenderVm,
      overlayCandidate,
      isPendingFinal: options.modeBehavior.allowsFinalReplacement && !hasRenderableFinal,
      isUsingFallback: true,
      fallbackReason: 'artifact-preview-bridge',
    })
  }

  if (options.requestedMode === 'final') {
    return buildViewportResultState({
      options,
      artifactBuildOutputs,
      previewRenderVm,
      currentAuthoritativeGeometryResult: finalGeometryResult,
      currentAuthoritativeRenderVm: authoritativeRenderVm,
      previewReadyAuthoritativeGeometryResult,
      previewReadyAuthoritativeRenderVm,
      currentDraftGeometryResult: draftGeometryResult,
      currentDraftGeometryRenderVm,
      retainedBaseState,
      baseCandidate,
      visibleResultClass: null,
      visibleSourceKind: 'none',
      geometryResult: null,
      renderVm: EMPTY_PREVIEW_RENDER_VM,
      overlayCandidate,
      isPendingFinal: false,
      isUsingFallback: true,
      fallbackReason: 'final-unavailable',
    })
  }

  if (!hasUsableGeometry) {
    return buildViewportResultState({
      options,
      artifactBuildOutputs,
      previewRenderVm,
      currentAuthoritativeGeometryResult: finalGeometryResult,
      currentAuthoritativeRenderVm: authoritativeRenderVm,
      previewReadyAuthoritativeGeometryResult,
      previewReadyAuthoritativeRenderVm,
      currentDraftGeometryResult: draftGeometryResult,
      currentDraftGeometryRenderVm,
      retainedBaseState,
      baseCandidate,
      visibleResultClass: null,
      visibleSourceKind: 'none',
      geometryResult: null,
      renderVm: EMPTY_PREVIEW_RENDER_VM,
      overlayCandidate,
      isPendingFinal: false,
      isUsingFallback: true,
      fallbackReason: 'no-accepted-geometry',
    })
  }

  return buildViewportResultState({
    options,
    artifactBuildOutputs,
    previewRenderVm,
    currentAuthoritativeGeometryResult: finalGeometryResult,
    currentAuthoritativeRenderVm: authoritativeRenderVm,
    previewReadyAuthoritativeGeometryResult,
    previewReadyAuthoritativeRenderVm,
    currentDraftGeometryResult: draftGeometryResult,
    currentDraftGeometryRenderVm,
    retainedBaseState,
    baseCandidate,
    visibleResultClass: null,
    visibleSourceKind: 'none',
    geometryResult: null,
    renderVm: EMPTY_PREVIEW_RENDER_VM,
    overlayCandidate,
    isPendingFinal: false,
    isUsingFallback: true,
    fallbackReason: 'mode-disallows-available-result',
  })
}
