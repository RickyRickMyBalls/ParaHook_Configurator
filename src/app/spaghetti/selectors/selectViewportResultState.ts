import {
  type BuildResultBundle,
  toViewerRenderablePart,
  type PartArtifact,
  type ViewerRenderablePart,
} from '../../../shared/buildTypes'
import type { GeometryMesh, GeometryResultBundle } from '../../../shared/geometryResult'
import {
  hasExplicitSolidBodyMemberPublication,
  type GraphPreviewPreparation,
} from '../previewPreparation'
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

export type ViewportLayerRecipeKind =
  | 'base-only'
  | 'retained-plus-overlay'
  | 'branch-local-retained-baseline'

export type ViewportLayerRecipe = {
  kind: ViewportLayerRecipeKind
  baseParts: ViewerRenderablePart[]
  basePresentationStateId: ViewportPresentationStateId | null
  baselineParts: ViewerRenderablePart[]
  baselinePresentationStateId: ViewportPresentationStateId | null
  baselineUsesDimmedBaseStyle: boolean
  overlayParts: ViewerRenderablePart[]
  overlayPresentationStateId: ViewportPresentationStateId | null
  overlayOpacity: number
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
  acceptedPreviewBuildBundle: BuildResultBundle | null
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
  layerRecipe: ViewportLayerRecipe
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
  acceptedPreviewBuildBundle?: BuildResultBundle | null
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
  interactionAcceptedOutputPreviewRenderVm?: PreviewRenderVm
  interactionAcceptedRebuiltPreviewRenderVm?: PreviewRenderVm
  committedInteractionBaseParts?: readonly ViewerRenderablePart[]
  committedInteractionBranchStableParts?: readonly ViewerRenderablePart[]
  committedInteractionBasePresentationStateId?: ViewportPresentationStateId | null
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
  acceptedPreviewBuildBundle: BuildResultBundle | null
  previewRenderVm: PreviewRenderVm
  currentAuthoritativeGeometryResult: GeometryResultBundle | null
  currentAuthoritativeRenderVm: PreviewRenderVm
  previewReadyAuthoritativeGeometryResult: GeometryResultBundle | null
  previewReadyAuthoritativeRenderVm: PreviewRenderVm
  currentDraftGeometryResult: GeometryResultBundle | null
  currentDraftGeometryRenderVm: PreviewRenderVm
  retainedBaseState: ViewportRetainedBaseState
  baseCandidate: ViewportLayerCandidate
  draftPreviewCandidate: ViewportLayerCandidate
  visibleResultClass: ViewportVisibleResultClass
  visibleSourceKind: ViewportVisibleSourceKind
  geometryResult: GeometryResultBundle | null
  renderVm: PreviewRenderVm
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

const EMPTY_VIEWPORT_LAYER_RECIPE: ViewportLayerRecipe = {
  kind: 'base-only',
  baseParts: [],
  basePresentationStateId: null,
  baselineParts: [],
  baselinePresentationStateId: null,
  baselineUsesDimmedBaseStyle: false,
  overlayParts: [],
  overlayPresentationStateId: null,
  overlayOpacity: 0.5,
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
  acceptedPreviewBuildBundle: BuildResultBundle | null
  viewerTargetGraphDocumentId: string | null
}): PreviewRenderVm => {
  if (options.previewPreparation === null) {
    if (options.useProjectDraftPreview && options.activeDraftProjectViewerParts.length > 0) {
      return {
        items: [],
        viewerParts: [...options.activeDraftProjectViewerParts],
      }
    }
    return EMPTY_PREVIEW_RENDER_VM
  }
  const previewVm = selectPreviewRenderVmFromPreparation(
    options.previewPreparation,
    [...options.artifactBuildOutputs],
    options.acceptedPreviewBuildBundle,
    'rebuiltOnly',
  )
  if (previewVm.viewerParts.length > 0) {
    return qualifyPreviewRenderVm(previewVm, options.viewerTargetGraphDocumentId)
  }
  if (options.useProjectDraftPreview && options.activeDraftProjectViewerParts.length > 0) {
    return {
      items: [],
      viewerParts: [...options.activeDraftProjectViewerParts],
    }
  }
  return qualifyPreviewRenderVm(previewVm, options.viewerTargetGraphDocumentId)
}

const buildPublishedAuthoritativeRenderVm = (options: {
  previewPreparation: GraphPreviewPreparation | null
  artifactBuildOutputs: readonly PartArtifact[]
  acceptedPreviewBuildBundle: BuildResultBundle | null
  viewerTargetGraphDocumentId: string | null
}): PreviewRenderVm => {
  if (options.previewPreparation === null || options.acceptedPreviewBuildBundle === null) {
    return EMPTY_PREVIEW_RENDER_VM
  }
  const previewVm = selectPreviewRenderVmFromPreparation(
    options.previewPreparation,
    [...options.artifactBuildOutputs],
    options.acceptedPreviewBuildBundle,
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
      slotStatus !== 'empty' &&
      typeof sourceNodeId === 'string' &&
      sourceNodeId.length > 0 &&
      typeof sourcePartKey === 'string' &&
      sourcePartKey.length > 0
    )
  })
}

const doesCurrentOutputMatchGeometryResultPartKeys = (
  previewPreparation: GraphPreviewPreparation | null,
  geometryResult: GeometryResultBundle | null,
): boolean => {
  if (previewPreparation === null || geometryResult === null) {
    return false
  }

  if (hasExplicitSolidBodyMemberPublication(previewPreparation)) {
    return false
  }

  const currentPartKeys = [...new Set(previewPreparation.previewCandidatePartKeys)].filter(
    (partKey) => partKey.length > 0,
  )
  const committedPartKeys = [...new Set(geometryResult.request.partKeys)].filter(
    (partKey) => partKey.length > 0,
  )

  if (currentPartKeys.length !== committedPartKeys.length) {
    return false
  }

  const currentPartKeySet = new Set(currentPartKeys)
  return committedPartKeys.every((partKey) => currentPartKeySet.has(partKey))
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
  currentOutputMatchesCommittedAuthoritative: boolean
  currentOutputMatchesCommittedDraft: boolean
}): {
  retainedBaseState: ViewportRetainedBaseState
  baseCandidate: ViewportLayerCandidate
} => {
  if (options.requestedMode === 'draft') {
    const hasRenderableCurrentDraft = options.currentDraftRenderVm.viewerParts.length > 0
    if (
      options.currentDraftGeometryResult !== null &&
      hasRenderableCurrentDraft &&
      options.hasCurrentOutputContinuation
    ) {
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
      !options.currentOutputMatchesCommittedDraft ||
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
    options.currentAuthoritativeRenderVm.viewerParts.length > 0 &&
    options.hasCurrentOutputContinuation
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
  if (
    !options.hasCurrentOutputContinuation ||
    !options.currentOutputMatchesCommittedAuthoritative ||
    !hasRenderableAuthoritative
  ) {
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
  currentDraftRenderVm: PreviewRenderVm
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
  if (options.requestedMode === 'final') {
    return EMPTY_LAYER_CANDIDATE
  }
  if (options.previewRenderVm.viewerParts.length > 0) {
    return {
      resultClass: 'draft',
      sourceKind: 'artifact-preview',
      geometryResult: options.currentDraftGeometryResult,
      renderVm: options.previewRenderVm,
    }
  }
  return options.currentDraftRenderVm.viewerParts.length > 0
    ? {
        resultClass: 'draft',
        sourceKind: 'retained-draft',
        geometryResult: options.currentDraftGeometryResult,
        renderVm: options.currentDraftRenderVm,
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

  const allowsLivePreviewBrep =
    options.browserExecutionPolicy === 'live' && options.isInteractionActive
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

  if (allowsLivePreviewBrep) {
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

  if (
    options.requestedMode === 'auto' &&
    options.browserExecutionPolicy === 'live' &&
    !options.isInteractionActive
  ) {
    return EMPTY_PREVIEW_STATE
  }

  if (options.requestedMode === 'draft' && !options.isInteractionActive) {
    return EMPTY_PREVIEW_STATE
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
  requestedMode: WorkspaceViewportResultMode
  browserExecutionPolicy: ViewportBrowserExecutionPolicy
  isInteractionActive: boolean
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
    options.requestedMode === 'auto' &&
    options.browserExecutionPolicy === 'live' &&
    !options.isInteractionActive &&
    options.visibleResultClass === 'draft'
  ) {
    return 'lastLoaded'
  }
  if (
    options.requestedMode === 'draft' &&
    !options.isInteractionActive &&
    options.visibleResultClass === 'draft'
  ) {
    return 'lastLoaded'
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

const buildBaseOnlyRecipe = (
  baseParts: readonly ViewerRenderablePart[],
  basePresentationStateId: ViewportPresentationStateId | null,
): ViewportLayerRecipe => ({
  kind: 'base-only',
  baseParts: [...baseParts],
  basePresentationStateId,
  baselineParts: [],
  baselinePresentationStateId: null,
  baselineUsesDimmedBaseStyle: false,
  overlayParts: [],
  overlayPresentationStateId: null,
  overlayOpacity: 0.5,
})

const buildRetainedOverlayRecipe = (options: {
  baseParts: readonly ViewerRenderablePart[]
  basePresentationStateId: ViewportPresentationStateId | null
  overlayParts: readonly ViewerRenderablePart[]
  overlayPresentationStateId: ViewportPresentationStateId | null
  overlayOpacity: number
}): ViewportLayerRecipe => ({
  kind: 'retained-plus-overlay',
  baseParts: [...options.baseParts],
  basePresentationStateId: options.basePresentationStateId,
  baselineParts: [],
  baselinePresentationStateId: null,
  baselineUsesDimmedBaseStyle: false,
  overlayParts: [...options.overlayParts],
  overlayPresentationStateId: options.overlayPresentationStateId,
  overlayOpacity: options.overlayOpacity,
})

const buildBranchLocalRetainedBaselineRecipe = (options: {
  committedBaseParts: readonly ViewerRenderablePart[]
  committedBranchStableParts: readonly ViewerRenderablePart[]
  overlayParts: readonly ViewerRenderablePart[]
  committedBasePresentationStateId: ViewportPresentationStateId | null
  overlayPresentationStateId: ViewportPresentationStateId | null
  overlayOpacity: number
}): ViewportLayerRecipe | null => {
  const sourceBaseParts =
    options.committedBranchStableParts.length > 0
      ? options.committedBranchStableParts
      : options.committedBaseParts
  if (sourceBaseParts.length === 0 || options.overlayParts.length === 0) {
    return null
  }

  const overlayViewerKeySet = new Set(options.overlayParts.map((part) => part.viewerKey))
  const baseParts = sourceBaseParts.filter((part) => !overlayViewerKeySet.has(part.viewerKey))
  const baselineParts = sourceBaseParts.filter((part) => overlayViewerKeySet.has(part.viewerKey))
  if (baselineParts.length === 0) {
    return null
  }

  return {
    kind: 'branch-local-retained-baseline',
    baseParts,
    basePresentationStateId: options.committedBasePresentationStateId,
    baselineParts,
    baselinePresentationStateId: options.committedBasePresentationStateId,
    baselineUsesDimmedBaseStyle: true,
    overlayParts: [...options.overlayParts],
    overlayPresentationStateId: options.overlayPresentationStateId,
    overlayOpacity: options.overlayOpacity,
  }
}

const resolveViewportLayerRecipe = (options: {
  requestedMode: WorkspaceViewportResultMode
  isInteractionActive: boolean
  visibleResultClass: ViewportVisibleResultClass
  visiblePresentationStateId: ViewportPresentationStateId | null
  retainedBaseState: ViewportRetainedBaseState
  retainedBaseResultClass: ViewportVisibleResultClass
  retainedBaseRenderVm: PreviewRenderVm
  retainedBasePresentationStateId: ViewportPresentationStateId | null
  overlayResultClass: ViewportVisibleResultClass
  overlaySourceKind: ViewportLayerSourceKind
  overlayRenderVm: PreviewRenderVm
  overlayPresentationStateId: ViewportPresentationStateId | null
  renderVm: PreviewRenderVm
  interactionAcceptedOutputPreviewRenderVm: PreviewRenderVm
  interactionAcceptedRebuiltPreviewRenderVm: PreviewRenderVm
  committedInteractionBaseParts: readonly ViewerRenderablePart[]
  committedInteractionBranchStableParts: readonly ViewerRenderablePart[]
  committedInteractionBasePresentationStateId: ViewportPresentationStateId | null
}): ViewportLayerRecipe => {
  const showsSettledAutoDraftBase =
    options.requestedMode === 'auto' &&
    options.retainedBaseState === 'retained' &&
    options.retainedBaseResultClass === 'final' &&
    options.overlayResultClass === null &&
    options.visibleResultClass === 'draft' &&
    options.visiblePresentationStateId === 'lastLoaded'

  const branchLocalOverlayParts =
    options.overlayPresentationStateId === null
      ? []
      : options.interactionAcceptedRebuiltPreviewRenderVm.viewerParts.length > 0
        ? options.interactionAcceptedRebuiltPreviewRenderVm.viewerParts
        : options.overlayRenderVm.viewerParts
  const branchLocalStableParts =
    options.committedInteractionBranchStableParts.length > 0
      ? options.committedInteractionBranchStableParts
      : options.interactionAcceptedOutputPreviewRenderVm.viewerParts
  const showsBranchLocalRetainedBaseline =
    options.isInteractionActive &&
    options.overlayPresentationStateId !== null &&
    branchLocalOverlayParts.length > 0 &&
    (branchLocalStableParts.length > 0 || options.committedInteractionBaseParts.length > 0)

  if (showsBranchLocalRetainedBaseline) {
    const branchLocalRecipe = buildBranchLocalRetainedBaselineRecipe({
      committedBaseParts: options.committedInteractionBaseParts,
      committedBranchStableParts: branchLocalStableParts,
      overlayParts: branchLocalOverlayParts,
      committedBasePresentationStateId: options.committedInteractionBasePresentationStateId,
      overlayPresentationStateId: options.overlayPresentationStateId,
      overlayOpacity: options.overlayPresentationStateId === 'previewBrep' ? 0.75 : 0.5,
    })
    if (branchLocalRecipe !== null) {
      return branchLocalRecipe
    }
  }

  if (options.retainedBaseState === 'retained') {
    if (
      options.requestedMode === 'auto' &&
      options.retainedBaseResultClass === 'final' &&
      (options.overlayResultClass === 'draft' || options.overlayResultClass === 'final')
    ) {
      const shouldShowOverlay =
        options.overlaySourceKind !== 'retained-draft' || options.overlayResultClass === 'final'
      const overlayParts = shouldShowOverlay ? options.overlayRenderVm.viewerParts : []
      return overlayParts.length === 0
        ? buildBaseOnlyRecipe(
            options.retainedBaseRenderVm.viewerParts,
            options.retainedBasePresentationStateId,
          )
        : buildRetainedOverlayRecipe({
            baseParts: options.retainedBaseRenderVm.viewerParts,
            basePresentationStateId: options.retainedBasePresentationStateId,
            overlayParts,
            overlayPresentationStateId: options.overlayPresentationStateId,
            overlayOpacity: options.overlayResultClass === 'final' ? 0.75 : 0.5,
          })
    }

    if (
      options.requestedMode === 'auto' &&
      options.retainedBaseResultClass === 'final' &&
      !showsSettledAutoDraftBase
    ) {
      return buildBaseOnlyRecipe(
        options.retainedBaseRenderVm.viewerParts,
        options.retainedBasePresentationStateId,
      )
    }

    if (options.requestedMode === 'draft' && options.retainedBaseResultClass === 'draft') {
      const overlayParts =
        options.overlayResultClass === 'draft' ? options.overlayRenderVm.viewerParts : []
      return overlayParts.length === 0
        ? buildBaseOnlyRecipe(
            options.retainedBaseRenderVm.viewerParts,
            options.retainedBasePresentationStateId,
          )
        : buildRetainedOverlayRecipe({
            baseParts: options.retainedBaseRenderVm.viewerParts,
            basePresentationStateId: options.retainedBasePresentationStateId,
            overlayParts,
            overlayPresentationStateId:
              options.overlayResultClass === 'draft' ? options.overlayPresentationStateId : null,
            overlayOpacity: 0.5,
          })
    }

    if (options.requestedMode === 'final' && options.retainedBaseResultClass === 'final') {
      const overlayParts =
        options.overlayResultClass === 'final' ? options.overlayRenderVm.viewerParts : []
      return overlayParts.length === 0
        ? buildBaseOnlyRecipe(
            options.retainedBaseRenderVm.viewerParts,
            options.retainedBasePresentationStateId,
          )
        : buildRetainedOverlayRecipe({
            baseParts: options.retainedBaseRenderVm.viewerParts,
            basePresentationStateId: options.retainedBasePresentationStateId,
            overlayParts,
            overlayPresentationStateId:
              options.overlayResultClass === 'final' ? options.overlayPresentationStateId : null,
            overlayOpacity: 0.5,
          })
    }
  }

  if (options.renderVm.viewerParts.length === 0 && options.visiblePresentationStateId === null) {
    return EMPTY_VIEWPORT_LAYER_RECIPE
  }

  return buildBaseOnlyRecipe(options.renderVm.viewerParts, options.visiblePresentationStateId)
}

const buildViewportResultState = ({
  options,
  artifactBuildOutputs,
  acceptedPreviewBuildBundle,
  previewRenderVm,
  currentAuthoritativeGeometryResult,
  currentAuthoritativeRenderVm,
  previewReadyAuthoritativeGeometryResult,
  previewReadyAuthoritativeRenderVm,
  currentDraftGeometryResult,
  currentDraftGeometryRenderVm,
  retainedBaseState,
  baseCandidate,
  draftPreviewCandidate,
  visibleResultClass,
  visibleSourceKind,
  geometryResult,
  renderVm,
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
    draftPreviewCandidate,
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
    requestedMode: options.requestedMode,
    browserExecutionPolicy,
    isInteractionActive,
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
  const layerRecipe = resolveViewportLayerRecipe({
    requestedMode: options.requestedMode,
    isInteractionActive,
    visibleResultClass,
    visiblePresentationStateId,
    retainedBaseState,
    retainedBaseResultClass: baseCandidate.resultClass,
    retainedBaseRenderVm: baseCandidate.renderVm,
    retainedBasePresentationStateId: lastLoadedState.presentationStateId,
    overlayResultClass: previewState.presentationStateId === null ? null : previewState.resultClass,
    overlaySourceKind:
      previewState.presentationStateId === null ? 'none' : previewState.sourceKind,
    overlayRenderVm:
      previewState.presentationStateId === null ? EMPTY_PREVIEW_RENDER_VM : previewState.renderVm,
    overlayPresentationStateId: previewState.presentationStateId,
    renderVm,
    interactionAcceptedOutputPreviewRenderVm:
      options.interactionAcceptedOutputPreviewRenderVm ?? EMPTY_PREVIEW_RENDER_VM,
    interactionAcceptedRebuiltPreviewRenderVm:
      options.interactionAcceptedRebuiltPreviewRenderVm ?? EMPTY_PREVIEW_RENDER_VM,
    committedInteractionBaseParts: options.committedInteractionBaseParts ?? [],
    committedInteractionBranchStableParts: options.committedInteractionBranchStableParts ?? [],
    committedInteractionBasePresentationStateId:
      options.committedInteractionBasePresentationStateId ?? null,
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
    acceptedPreviewBuildBundle,
    previewPreparation: options.previewPreparation,
    renderVm,
    previewRenderVm,
    retainedBaseState,
    retainedBaseResultClass: baseCandidate.resultClass,
    retainedBaseSourceKind: baseCandidate.sourceKind,
    retainedBaseGeometryResult: baseCandidate.geometryResult,
    retainedBaseRenderVm: baseCandidate.renderVm,
    overlayResultClass:
      previewState.presentationStateId === null ? null : previewState.resultClass,
    overlaySourceKind:
      previewState.presentationStateId === null ? 'none' : previewState.sourceKind,
    overlayGeometryResult:
      previewState.presentationStateId === null ? null : previewState.geometryResult,
    overlayRenderVm:
      previewState.presentationStateId === null
        ? EMPTY_PREVIEW_RENDER_VM
        : previewState.renderVm,
    layerRecipe,
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
    acceptedPreviewBuildBundle: options.acceptedPreviewBuildBundle ?? null,
    viewerTargetGraphDocumentId: options.viewerTargetGraphDocumentId,
  })
  const publishedAuthoritativeRenderVm = buildPublishedAuthoritativeRenderVm({
    previewPreparation: options.previewPreparation,
    artifactBuildOutputs,
    acceptedPreviewBuildBundle: options.acceptedPreviewBuildBundle ?? null,
    viewerTargetGraphDocumentId: options.viewerTargetGraphDocumentId,
  })
  const authoritativeGeometryRenderVm = buildAuthoritativeRenderVm({
    geometryResult: finalGeometryResult,
    viewerTargetGraphDocumentId: options.viewerTargetGraphDocumentId,
  })
  const authoritativeRenderVm =
    finalGeometryResult !== null && publishedAuthoritativeRenderVm.viewerParts.length > 0
      ? publishedAuthoritativeRenderVm
      : authoritativeGeometryRenderVm
  const previewReadyAuthoritativeRenderVm = buildAuthoritativeRenderVm({
    geometryResult: previewReadyAuthoritativeGeometryResult,
    viewerTargetGraphDocumentId: options.viewerTargetGraphDocumentId,
  })
  const committedAuthoritativeGeometryRenderVm = buildAuthoritativeRenderVm({
    geometryResult: options.committedAuthoritativeGeometryResult,
    viewerTargetGraphDocumentId: options.viewerTargetGraphDocumentId,
  })
  const committedAuthoritativeRenderVm =
    committedAuthoritativeGeometryRenderVm.viewerParts.length > 0
      ? committedAuthoritativeGeometryRenderVm
      : options.committedAuthoritativeGeometryResult !== null &&
          publishedAuthoritativeRenderVm.viewerParts.length > 0
        ? publishedAuthoritativeRenderVm
        : committedAuthoritativeGeometryRenderVm
  const suppressWholeNodeDraftMeshPreview = hasExplicitSolidBodyMemberPublication(
    options.previewPreparation,
  )
  const currentDraftGeometryRenderVm = suppressWholeNodeDraftMeshPreview
    ? EMPTY_PREVIEW_RENDER_VM
    : buildDraftGeometryRenderVm({
        geometryResult: draftGeometryResult,
        viewerTargetGraphDocumentId: options.viewerTargetGraphDocumentId,
      })
  const committedDraftRenderVm = suppressWholeNodeDraftMeshPreview
    ? EMPTY_PREVIEW_RENDER_VM
    : buildDraftGeometryRenderVm({
        geometryResult: options.committedDraftGeometryResult,
        viewerTargetGraphDocumentId: options.viewerTargetGraphDocumentId,
      })
  const hasOutputContinuation = hasCurrentOutputContinuation(options.previewPreparation)
  const shouldEnforceCurrentOutputResolution = options.previewPreparation !== null
  const currentOutputMatchesCommittedAuthoritative = doesCurrentOutputMatchGeometryResultPartKeys(
    options.previewPreparation,
    options.committedAuthoritativeGeometryResult,
  )
  const currentOutputMatchesCommittedDraft = doesCurrentOutputMatchGeometryResultPartKeys(
    options.previewPreparation,
    options.committedDraftGeometryResult,
  )
  const allowsCurrentAuthoritativeVisibility =
    !shouldEnforceCurrentOutputResolution || hasOutputContinuation
  const allowsCurrentDraftVisibility = !shouldEnforceCurrentOutputResolution || hasOutputContinuation
  const allowsPreviewReadyAuthoritativeVisibility =
    !shouldEnforceCurrentOutputResolution || hasOutputContinuation
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
    currentOutputMatchesCommittedAuthoritative,
    currentOutputMatchesCommittedDraft,
  })
  const overlayCandidate = resolveOverlayCandidate({
    requestedMode: options.requestedMode,
    previewReadyAuthoritativeGeometryResult: allowsPreviewReadyAuthoritativeVisibility
      ? previewReadyAuthoritativeGeometryResult
      : null,
    previewReadyAuthoritativeRenderVm: allowsPreviewReadyAuthoritativeVisibility
      ? previewReadyAuthoritativeRenderVm
      : EMPTY_PREVIEW_RENDER_VM,
    currentDraftRenderVm: allowsCurrentDraftVisibility
      ? currentDraftGeometryRenderVm
      : EMPTY_PREVIEW_RENDER_VM,
    currentDraftGeometryResult: allowsCurrentDraftVisibility ? draftGeometryResult : null,
    previewRenderVm,
  })
  const hasRenderableFinal =
    allowsCurrentAuthoritativeVisibility && authoritativeRenderVm.viewerParts.length > 0
  const hasRenderablePreviewReadyAuthoritative =
    allowsPreviewReadyAuthoritativeVisibility &&
    previewReadyAuthoritativeRenderVm.viewerParts.length > 0
  const waitingDraftFallbackCandidate =
    overlayCandidate.resultClass === null &&
    browserExecutionPolicy === 'live' &&
    isInteractionActive &&
    options.requestedMode === 'auto' &&
    options.committedDraftGeometryResult !== null &&
    committedDraftRenderVm.viewerParts.length > 0 &&
    hasOutputContinuation &&
    currentOutputMatchesCommittedDraft
      ? buildCandidate(
          'draft',
          'retained-draft',
          options.committedDraftGeometryResult,
          committedDraftRenderVm,
        )
      : EMPTY_LAYER_CANDIDATE
  const draftPreviewCandidate =
    overlayCandidate.resultClass === 'draft' ? overlayCandidate : waitingDraftFallbackCandidate
  const settledDraftSceneCandidate =
    !isInteractionActive &&
    allowsCurrentDraftVisibility &&
    options.acceptedPreviewBuildBundle?.resultClass === 'draft' &&
    publishedAuthoritativeRenderVm.viewerParts.length > 0 &&
    draftPreviewCandidate.resultClass === 'draft'
      ? buildCandidate(
          'draft',
          'artifact-preview',
          draftGeometryResult,
          publishedAuthoritativeRenderVm,
        )
      : draftPreviewCandidate
  const hasUsableDraftPreview = settledDraftSceneCandidate.resultClass !== null
  const hasUsableGeometry = hasUsableDraftPreview || hasRenderableFinal
  const suppressVisiblePreviewDuringRelease =
    browserExecutionPolicy === 'release' && isInteractionActive

  if (suppressVisiblePreviewDuringRelease) {
    if (retainedBaseState === 'retained' && baseCandidate.resultClass !== null) {
      return buildViewportResultState({
        options,
        artifactBuildOutputs,
        acceptedPreviewBuildBundle: options.acceptedPreviewBuildBundle ?? null,
        previewRenderVm,
        currentAuthoritativeGeometryResult: finalGeometryResult,
        currentAuthoritativeRenderVm: authoritativeRenderVm,
        previewReadyAuthoritativeGeometryResult,
        previewReadyAuthoritativeRenderVm,
        currentDraftGeometryResult: draftGeometryResult,
        currentDraftGeometryRenderVm,
        retainedBaseState,
        baseCandidate,
        draftPreviewCandidate,
        visibleResultClass: baseCandidate.resultClass,
        visibleSourceKind: baseCandidate.sourceKind,
        geometryResult: baseCandidate.geometryResult,
        renderVm: baseCandidate.renderVm,
        isPendingFinal: false,
        isUsingFallback: false,
        fallbackReason: null,
      })
    }

    return buildViewportResultState({
      options,
      artifactBuildOutputs,
      acceptedPreviewBuildBundle: options.acceptedPreviewBuildBundle ?? null,
      previewRenderVm,
      currentAuthoritativeGeometryResult: finalGeometryResult,
      currentAuthoritativeRenderVm: authoritativeRenderVm,
      previewReadyAuthoritativeGeometryResult,
      previewReadyAuthoritativeRenderVm,
      currentDraftGeometryResult: draftGeometryResult,
      currentDraftGeometryRenderVm,
      retainedBaseState,
      baseCandidate,
      draftPreviewCandidate,
      visibleResultClass: null,
      visibleSourceKind: 'none',
      geometryResult: null,
      renderVm: EMPTY_PREVIEW_RENDER_VM,
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
      acceptedPreviewBuildBundle: options.acceptedPreviewBuildBundle ?? null,
      previewRenderVm,
      currentAuthoritativeGeometryResult: finalGeometryResult,
      currentAuthoritativeRenderVm: authoritativeRenderVm,
      previewReadyAuthoritativeGeometryResult,
      previewReadyAuthoritativeRenderVm,
      currentDraftGeometryResult: draftGeometryResult,
      currentDraftGeometryRenderVm,
      retainedBaseState,
      baseCandidate,
      draftPreviewCandidate,
      visibleResultClass: 'final',
      visibleSourceKind: 'authoritative-preview',
      geometryResult: previewReadyAuthoritativeGeometryResult,
      renderVm: previewReadyAuthoritativeRenderVm,
      isPendingFinal: false,
      isUsingFallback: false,
      fallbackReason: null,
    })
  }

  if (hasRenderableFinal && finalGeometryResult !== null && options.modeBehavior.allowsFinalDisplay) {
    return buildViewportResultState({
      options,
      artifactBuildOutputs,
      acceptedPreviewBuildBundle: options.acceptedPreviewBuildBundle ?? null,
      previewRenderVm,
      currentAuthoritativeGeometryResult: finalGeometryResult,
      currentAuthoritativeRenderVm: authoritativeRenderVm,
      previewReadyAuthoritativeGeometryResult,
      previewReadyAuthoritativeRenderVm,
      currentDraftGeometryResult: draftGeometryResult,
      currentDraftGeometryRenderVm,
      retainedBaseState,
      baseCandidate,
      draftPreviewCandidate,
      visibleResultClass: 'final',
      visibleSourceKind: 'retained-final',
      geometryResult: finalGeometryResult,
      renderVm: authoritativeRenderVm,
      isPendingFinal: false,
      isUsingFallback: false,
      fallbackReason: null,
    })
  }

  if (hasUsableDraftPreview && options.modeBehavior.allowsDraftDisplay) {
    return buildViewportResultState({
      options,
      artifactBuildOutputs,
      acceptedPreviewBuildBundle: options.acceptedPreviewBuildBundle ?? null,
      previewRenderVm,
      currentAuthoritativeGeometryResult: finalGeometryResult,
      currentAuthoritativeRenderVm: authoritativeRenderVm,
      previewReadyAuthoritativeGeometryResult,
      previewReadyAuthoritativeRenderVm,
      currentDraftGeometryResult: draftGeometryResult,
      currentDraftGeometryRenderVm,
      retainedBaseState,
      baseCandidate,
      draftPreviewCandidate,
      visibleResultClass: 'draft',
      visibleSourceKind: settledDraftSceneCandidate.sourceKind,
      geometryResult: settledDraftSceneCandidate.geometryResult,
      renderVm: settledDraftSceneCandidate.renderVm,
      isPendingFinal: options.modeBehavior.allowsFinalReplacement && !hasRenderableFinal,
      isUsingFallback: settledDraftSceneCandidate.sourceKind === 'artifact-preview',
      fallbackReason:
        settledDraftSceneCandidate.sourceKind === 'artifact-preview'
          ? 'artifact-preview-bridge'
          : null,
    })
  }

  if (options.requestedMode === 'final') {
    return buildViewportResultState({
      options,
      artifactBuildOutputs,
      acceptedPreviewBuildBundle: options.acceptedPreviewBuildBundle ?? null,
      previewRenderVm,
      currentAuthoritativeGeometryResult: finalGeometryResult,
      currentAuthoritativeRenderVm: authoritativeRenderVm,
      previewReadyAuthoritativeGeometryResult,
      previewReadyAuthoritativeRenderVm,
      currentDraftGeometryResult: draftGeometryResult,
      currentDraftGeometryRenderVm,
      retainedBaseState,
      baseCandidate,
      draftPreviewCandidate,
      visibleResultClass: null,
      visibleSourceKind: 'none',
      geometryResult: null,
      renderVm: EMPTY_PREVIEW_RENDER_VM,
      isPendingFinal: false,
      isUsingFallback: true,
      fallbackReason: 'final-unavailable',
    })
  }

  if (!hasUsableGeometry) {
    return buildViewportResultState({
      options,
      artifactBuildOutputs,
      acceptedPreviewBuildBundle: options.acceptedPreviewBuildBundle ?? null,
      previewRenderVm,
      currentAuthoritativeGeometryResult: finalGeometryResult,
      currentAuthoritativeRenderVm: authoritativeRenderVm,
      previewReadyAuthoritativeGeometryResult,
      previewReadyAuthoritativeRenderVm,
      currentDraftGeometryResult: draftGeometryResult,
      currentDraftGeometryRenderVm,
      retainedBaseState,
      baseCandidate,
      draftPreviewCandidate,
      visibleResultClass: null,
      visibleSourceKind: 'none',
      geometryResult: null,
      renderVm: EMPTY_PREVIEW_RENDER_VM,
      isPendingFinal: false,
      isUsingFallback: true,
      fallbackReason: 'no-accepted-geometry',
    })
  }

  return buildViewportResultState({
    options,
    artifactBuildOutputs,
    acceptedPreviewBuildBundle: options.acceptedPreviewBuildBundle ?? null,
    previewRenderVm,
    currentAuthoritativeGeometryResult: finalGeometryResult,
    currentAuthoritativeRenderVm: authoritativeRenderVm,
    previewReadyAuthoritativeGeometryResult,
    previewReadyAuthoritativeRenderVm,
    currentDraftGeometryResult: draftGeometryResult,
    currentDraftGeometryRenderVm,
    retainedBaseState,
    baseCandidate,
    draftPreviewCandidate,
    visibleResultClass: null,
    visibleSourceKind: 'none',
    geometryResult: null,
    renderVm: EMPTY_PREVIEW_RENDER_VM,
    isPendingFinal: false,
    isUsingFallback: true,
    fallbackReason: 'mode-disallows-available-result',
  })
}
