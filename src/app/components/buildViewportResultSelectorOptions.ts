import type { BuildResultBundle, PartArtifact } from '../../shared/buildTypes'
import type { GeometryResultBundle } from '../../shared/geometryResult'
import type { GraphPreviewPreparation } from '../spaghetti/previewPreparation'
import type { SpaghettiStoreState } from '../spaghetti/store/useSpaghettiStore'
import { selectViewportResultState } from '../spaghetti/selectors/selectViewportResultState'
import type { GraphDocument } from '../spaghetti/schema/spaghettiTypes'
import type {
  AppState,
  RenderedProjectPartSetVm,
} from '../store/useAppStore'
import {
  selectEffectiveBrowserExecutionPolicy,
  selectShouldSuppressBrowserGraphRuntimeOutput,
} from '../store/useAppStore'
import type { WorkspaceViewportResultMode } from '../workspace/workspaceShellTypes'
import type { WorkspaceViewportResultModeBehavior } from '../workspace/workspaceViewportResultMode'
import { applyActiveDraftExtrudePreviewOverride } from './activeDraftExtrudePreview'

type ViewportResultSelectorOptions = Parameters<typeof selectViewportResultState>[0]

type ViewportResultPolicyState = Pick<
  AppState,
  | 'currentProject'
  | 'projectContent'
  | 'browserGraphBuildPolicyByGraphDocumentId'
  | 'browserContentBuildPolicyByRowId'
>

type BuildViewportResultSelectorOptionsArgs = ViewportResultPolicyState &
  Pick<
    AppState,
    | 'browserInteractionGraphDocumentIds'
    | 'delayedDraftBuildByGraphDocumentId'
    | 'delayedAuthoritativeBuildByGraphDocumentId'
  > & {
    requestedMode: WorkspaceViewportResultMode
    modeBehavior: WorkspaceViewportResultModeBehavior
    renderedProjectPartSet: RenderedProjectPartSetVm
    graphDocumentsById: Record<string, GraphDocument>
    viewerTargetGraphDocumentId: string | null
    sharedViewerComposition: SpaghettiStoreState['sharedViewerComposition']
    sketchPlanePickSession: SpaghettiStoreState['sketchPlanePickSession']
    acceptedAuthoritativeGeometryResult: GeometryResultBundle | null
    previewReadyAuthoritativeGeometryResult?: GeometryResultBundle | null
    acceptedDraftGeometryResult: GeometryResultBundle | null
    committedAuthoritativeGeometryResult: GeometryResultBundle | null
    committedDraftGeometryResult: GeometryResultBundle | null
    acceptedPreviewBuildBundle?: BuildResultBundle | null
    acceptedPreviewBuildOutputs: readonly PartArtifact[]
    previewPreparation: GraphPreviewPreparation | null
  }

export const buildViewportResultSelectorOptions = (
  options: BuildViewportResultSelectorOptionsArgs,
): ViewportResultSelectorOptions => {
  const {
    currentProject,
    projectContent,
    browserGraphBuildPolicyByGraphDocumentId,
    browserContentBuildPolicyByRowId,
    browserInteractionGraphDocumentIds,
    delayedDraftBuildByGraphDocumentId,
    delayedAuthoritativeBuildByGraphDocumentId,
    renderedProjectPartSet,
    graphDocumentsById,
    viewerTargetGraphDocumentId,
    sharedViewerComposition,
    sketchPlanePickSession,
  } = options

  const appProjectionState: ViewportResultPolicyState = {
    currentProject,
    projectContent,
    browserGraphBuildPolicyByGraphDocumentId,
    browserContentBuildPolicyByRowId,
  }

  const activeDraftProjectViewerParts = applyActiveDraftExtrudePreviewOverride({
    graphDocumentsById,
    preferredGraphDocumentId: viewerTargetGraphDocumentId,
    renderedParts: renderedProjectPartSet.parts,
    viewerParts: renderedProjectPartSet.viewerParts,
    sketchPlanePickSession,
  })

  const currentProjectGraphDocumentIds = currentProject.graphDocuments
    .map((document) => document.graphDocumentId)
    .filter((graphDocumentId) => graphDocumentsById[graphDocumentId] !== undefined)

  return {
    requestedMode: options.requestedMode,
    modeBehavior: options.modeBehavior,
    acceptedAuthoritativeGeometryResult: options.acceptedAuthoritativeGeometryResult,
    previewReadyAuthoritativeGeometryResult: options.previewReadyAuthoritativeGeometryResult,
    acceptedDraftGeometryResult: options.acceptedDraftGeometryResult,
    committedAuthoritativeGeometryResult: options.committedAuthoritativeGeometryResult,
    committedDraftGeometryResult: options.committedDraftGeometryResult,
    acceptedPreviewBuildBundle: options.acceptedPreviewBuildBundle,
    acceptedPreviewBuildOutputs: options.acceptedPreviewBuildOutputs,
    previewPreparation: options.previewPreparation,
    viewerTargetGraphDocumentId,
    suppressViewerTargetArtifactPreview:
      viewerTargetGraphDocumentId !== null &&
      selectShouldSuppressBrowserGraphRuntimeOutput(
        appProjectionState,
        viewerTargetGraphDocumentId,
      ),
    useProjectDraftPreview:
      sharedViewerComposition !== null || currentProjectGraphDocumentIds.length > 0,
    activeDraftProjectViewerParts,
    browserExecutionPolicy:
      viewerTargetGraphDocumentId !== null
        ? selectEffectiveBrowserExecutionPolicy(appProjectionState, {
            kind: 'graph-document',
            graphDocumentId: viewerTargetGraphDocumentId,
          })
        : 'live',
    isInteractionActive:
      viewerTargetGraphDocumentId !== null &&
      browserInteractionGraphDocumentIds[viewerTargetGraphDocumentId] === true,
    hasDelayedDraftPlaceholder:
      viewerTargetGraphDocumentId !== null &&
      delayedDraftBuildByGraphDocumentId[viewerTargetGraphDocumentId] !== undefined,
    hasDelayedAuthoritativePlaceholder:
      viewerTargetGraphDocumentId !== null &&
      delayedAuthoritativeBuildByGraphDocumentId[viewerTargetGraphDocumentId] !== undefined,
  }
}
