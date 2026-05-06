import {
  selectActiveGraphDocument,
  selectGraphRuntimeByDocumentId,
  useSpaghettiStore,
  type GraphRuntimeState,
  type SpaghettiStoreState,
} from '../../spaghetti/store/useSpaghettiStore'
import { appendConsoleEntry } from '../../console/useConsoleStore'
import {
  deriveAuthoritativeExportInput,
  type ExportPreparationResult,
} from '../../../shared/exportTypes'
import { type CompileSpaghettiGraphResult } from '../../spaghetti/compiler/compileGraph'
import type {
  AppState,
  DraftSchedulingRuntimeEvent,
  GraphDocumentBuildRequestOptions,
} from '../useAppStore'
import { dispatchDelayedGraphBuildPlaceholder } from './appStoreBuildRequests'
import { selectEffectiveBrowserExecutionPolicy } from './appStoreBuildPolicies'
import { deleteRecordKey } from '../storeRecordUtils'

const isCurrentRevisionAuthoritativeUnavailable = (
  runtime: GraphRuntimeState | null | undefined,
): boolean =>
  runtime !== undefined &&
  runtime !== null &&
  runtime.compileBuild.inFlightBuildRequestId === null &&
  runtime.compileBuild.latestAcceptedGraphRevision !== null &&
  runtime.compileBuild.latestAcceptedGraphRevision === runtime.compileBuild.currentGraphRevision &&
  runtime.acceptedBuildBundle?.executionIntent.geometryTarget === 'authoritative' &&
  deriveAuthoritativeExportInput(runtime.acceptedAuthoritativeGeometryResult) === null

type ReleaseFlowActionState = Pick<
  AppState,
  | 'browserInteractionGraphDocumentIds'
  | 'pendingBrowserBuildGraphDocumentIds'
  | 'delayedDraftBuildByGraphDocumentId'
  | 'delayedAuthoritativeBuildByGraphDocumentId'
  | 'pendingBuildAfterRelease'
>

type ReleaseFlowActionGet = () => Pick<
  AppState,
  | 'currentProject'
  | 'projectContent'
  | 'browserGraphBuildPolicyByGraphDocumentId'
  | 'browserContentBuildPolicyByRowId'
  | 'browserInteractionGraphDocumentIds'
  | 'pendingBrowserBuildGraphDocumentIds'
  | 'delayedDraftBuildByGraphDocumentId'
  | 'delayedAuthoritativeBuildByGraphDocumentId'
  | 'compileGraphDocument'
  | 'requestBrowserGraphDocumentBuild'
  | 'requestGraphDocumentBuild'
>

type ReleaseFlowActionSet = (
  updater:
    | Partial<ReleaseFlowActionState>
    | ((state: ReleaseFlowActionState) => Partial<ReleaseFlowActionState> | ReleaseFlowActionState),
) => void

type SyncCurrentProjectFromSpaghetti = (
  spaghettiState: Pick<
    SpaghettiStoreState,
    'graphDocumentsById' | 'graphDocumentOrder' | 'graphRuntimeByDocumentId'
  >,
) => void

export const createBuildReleaseFlowActions = ({
  get,
  set,
  getCompileErrorMessage,
  publishDraftSchedulingRuntimeEvent,
  syncCurrentProjectFromSpaghetti,
}: {
  get: ReleaseFlowActionGet
  set: ReleaseFlowActionSet
  getCompileErrorMessage: (compileResult: CompileSpaghettiGraphResult) => string
  publishDraftSchedulingRuntimeEvent: (
    event: Omit<DraftSchedulingRuntimeEvent, 'eventSeq'>,
  ) => void
  syncCurrentProjectFromSpaghetti: SyncCurrentProjectFromSpaghetti
}): Pick<
  AppState,
  | 'prepareGraphDocumentExport'
  | 'endBrowserBuildInteraction'
  | 'requestBrowserGraphDocumentBuild'
  | 'requestManualBuild'
> => ({
  prepareGraphDocumentExport: (graphDocumentId): ExportPreparationResult => {
    const initialRuntime = selectGraphRuntimeByDocumentId(
      useSpaghettiStore.getState(),
      graphDocumentId,
    )
    const acceptedExportInput = deriveAuthoritativeExportInput(
      initialRuntime?.acceptedAuthoritativeGeometryResult,
    )
    if (acceptedExportInput !== null) {
      return {
        status: 'ready',
        graphDocumentId,
        input: acceptedExportInput,
      }
    }

    const compileResult = get().compileGraphDocument(graphDocumentId)
    if (!compileResult.ok) {
      return {
        status: 'blocked',
        graphDocumentId,
        blockedReason: 'compile-invalid',
        message: getCompileErrorMessage(compileResult),
      }
    }
    if (compileResult.buildInputs === undefined) {
      return {
        status: 'blocked',
        graphDocumentId,
        blockedReason: 'missing-build-inputs',
        message: 'The graph has no buildable output to prepare for export.',
      }
    }

    const runtimeAfterCompile = selectGraphRuntimeByDocumentId(
      useSpaghettiStore.getState(),
      graphDocumentId,
    )
    if (runtimeAfterCompile === null || runtimeAfterCompile === undefined) {
      return {
        status: 'blocked',
        graphDocumentId,
        blockedReason: 'missing-preview-preparation',
        message: 'The graph runtime is not available for export preparation.',
      }
    }

    const currentAcceptedExportInput = deriveAuthoritativeExportInput(
      runtimeAfterCompile.acceptedAuthoritativeGeometryResult,
    )
    if (currentAcceptedExportInput !== null) {
      return {
        status: 'ready',
        graphDocumentId,
        input: currentAcceptedExportInput,
      }
    }

    const delayedAuthoritativePlaceholder =
      get().delayedAuthoritativeBuildByGraphDocumentId[graphDocumentId] ?? null
    if (delayedAuthoritativePlaceholder !== null) {
      return {
        status: 'pending',
        graphDocumentId,
        pendingReason: 'awaiting-authoritative-build',
      }
    }

    if (
      runtimeAfterCompile.compileBuild.inFlightBuildRequestId !== null &&
      runtimeAfterCompile.compileBuild.inFlightBuildSeq !== null &&
      runtimeAfterCompile.compileBuild.inFlightExecutionIntent?.geometryTarget ===
        'authoritative'
    ) {
      return {
        status: 'pending',
        graphDocumentId,
        pendingReason: 'awaiting-authoritative-build',
        buildRequestId: runtimeAfterCompile.compileBuild.inFlightBuildRequestId,
        buildSeq: runtimeAfterCompile.compileBuild.inFlightBuildSeq,
      }
    }

    if (isCurrentRevisionAuthoritativeUnavailable(runtimeAfterCompile)) {
      return {
        status: 'blocked',
        graphDocumentId,
        blockedReason: 'authoritative-unavailable',
        message: 'The current graph revision does not have reusable authoritative geometry for export.',
      }
    }

    const requestResult = get().requestGraphDocumentBuild(graphDocumentId, {
      explicit: true,
      delayedAuthoritativeDispatchTrigger: 'explicit',
      geometryTargetOverride: 'authoritative',
    })
    if (!requestResult.ok) {
      return {
        status: 'blocked',
        graphDocumentId,
        blockedReason: 'compile-invalid',
        message: getCompileErrorMessage(requestResult),
      }
    }

    const runtimeAfterRequest = selectGraphRuntimeByDocumentId(
      useSpaghettiStore.getState(),
      graphDocumentId,
    )
    const delayedAuthoritativePlaceholderAfterRequest =
      get().delayedAuthoritativeBuildByGraphDocumentId[graphDocumentId] ?? null
    const pendingBuildRequestId = runtimeAfterRequest?.compileBuild.inFlightBuildRequestId ?? null
    const pendingBuildSeq = runtimeAfterRequest?.compileBuild.inFlightBuildSeq ?? null
    if (
      pendingBuildRequestId !== null &&
      pendingBuildSeq !== null &&
      runtimeAfterRequest?.compileBuild.inFlightExecutionIntent?.geometryTarget === 'authoritative'
    ) {
      return {
        status: 'pending',
        graphDocumentId,
        pendingReason: 'requested-authoritative-build',
        buildRequestId: pendingBuildRequestId,
        buildSeq: pendingBuildSeq,
      }
    }
    if (delayedAuthoritativePlaceholderAfterRequest !== null) {
      return {
        status: 'pending',
        graphDocumentId,
        pendingReason: 'requested-authoritative-build',
      }
    }

    const requestedAcceptedExportInput = deriveAuthoritativeExportInput(
      runtimeAfterRequest?.acceptedAuthoritativeGeometryResult,
    )
    if (requestedAcceptedExportInput !== null) {
      return {
        status: 'ready',
        graphDocumentId,
        input: requestedAcceptedExportInput,
      }
    }

    if (isCurrentRevisionAuthoritativeUnavailable(runtimeAfterRequest)) {
      return {
        status: 'blocked',
        graphDocumentId,
        blockedReason: 'authoritative-unavailable',
        message: 'The current graph revision does not have reusable authoritative geometry for export.',
      }
    }

    return {
      status: 'blocked',
      graphDocumentId,
      blockedReason: 'no-build-targets',
      message: 'The graph has no exportable build targets to prepare.',
    }
  },
  endBrowserBuildInteraction: (graphDocumentId) => {
    if (graphDocumentId.length === 0) {
      return
    }
    const shouldDispatchQueuedBuild =
      get().pendingBrowserBuildGraphDocumentIds[graphDocumentId] === true
    const delayedDraftPlaceholder = get().delayedDraftBuildByGraphDocumentId[graphDocumentId] ?? null
    const delayedAuthoritativePlaceholder =
      get().delayedAuthoritativeBuildByGraphDocumentId[graphDocumentId] ?? null
    set((state) => ({
      browserInteractionGraphDocumentIds: deleteRecordKey(
        state.browserInteractionGraphDocumentIds,
        graphDocumentId,
      ),
      pendingBrowserBuildGraphDocumentIds: deleteRecordKey(
        state.pendingBrowserBuildGraphDocumentIds,
        graphDocumentId,
      ),
    }))
    useSpaghettiStore.getState().promoteStagedAuthoritativePreviewResult(graphDocumentId)
    if (shouldDispatchQueuedBuild) {
      if (delayedDraftPlaceholder !== null) {
        publishDraftSchedulingRuntimeEvent({
          type: 'draft_released',
          graphDocumentId,
          draftPolicy: delayedDraftPlaceholder.executionIntent.draftPolicy,
        })
      }
      get().requestBrowserGraphDocumentBuild(graphDocumentId, {
        delayedDraftDispatchTrigger: 'release',
        delayedAuthoritativeDispatchTrigger: 'release',
      })
      return
    }
    if (delayedDraftPlaceholder?.executionIntent.draftPolicy === 'release') {
      publishDraftSchedulingRuntimeEvent({
        type: 'draft_released',
        graphDocumentId,
        draftPolicy: delayedDraftPlaceholder.executionIntent.draftPolicy,
      })
      set((state) => ({
        delayedDraftBuildByGraphDocumentId: deleteRecordKey(
          state.delayedDraftBuildByGraphDocumentId,
          graphDocumentId,
        ),
      }))
      dispatchDelayedGraphBuildPlaceholder(graphDocumentId, delayedDraftPlaceholder)
      appendConsoleEntry({
        layer: 'App',
        text: `Released delayed draft build for ${graphDocumentId}`,
        source: graphDocumentId,
        severity: 'info',
      })
    }
    if (delayedAuthoritativePlaceholder?.executionIntent.authoritativePolicy === 'release') {
      set((state) => ({
        delayedAuthoritativeBuildByGraphDocumentId: deleteRecordKey(
          state.delayedAuthoritativeBuildByGraphDocumentId,
          graphDocumentId,
        ),
      }))
      dispatchDelayedGraphBuildPlaceholder(graphDocumentId, delayedAuthoritativePlaceholder)
      appendConsoleEntry({
        layer: 'App',
        text: `Released delayed authoritative build for ${graphDocumentId}`,
        source: graphDocumentId,
        severity: 'info',
      })
    }
  },
  requestBrowserGraphDocumentBuild: (
    graphDocumentId,
    options?: GraphDocumentBuildRequestOptions,
  ) => {
    const policy = selectEffectiveBrowserExecutionPolicy(get(), {
      kind: 'graph-document',
      graphDocumentId,
    })
    const isExplicit = options?.explicit === true
    const releaseAlreadyReached =
      policy === 'release' && get().browserInteractionGraphDocumentIds[graphDocumentId] !== true

    if (policy === 'off') {
      set((state) => ({
        delayedDraftBuildByGraphDocumentId: deleteRecordKey(
          state.delayedDraftBuildByGraphDocumentId,
          graphDocumentId,
        ),
        delayedAuthoritativeBuildByGraphDocumentId: deleteRecordKey(
          state.delayedAuthoritativeBuildByGraphDocumentId,
          graphDocumentId,
        ),
        pendingBrowserBuildGraphDocumentIds: deleteRecordKey(
          state.pendingBrowserBuildGraphDocumentIds,
          graphDocumentId,
        ),
      }))
      appendConsoleEntry({
        layer: 'Browser',
        text: `Build suppressed for ${graphDocumentId} because policy is Off`,
        source: graphDocumentId,
        severity: 'info',
      })
      publishDraftSchedulingRuntimeEvent({
        type: 'draft_suppressed',
        graphDocumentId,
        draftPolicy: 'suppressed',
      })
      syncCurrentProjectFromSpaghetti(useSpaghettiStore.getState())
      return null
    }

    if (!isExplicit && policy === 'manual') {
      return null
    }

    set((state) => ({
      pendingBrowserBuildGraphDocumentIds: deleteRecordKey(
        state.pendingBrowserBuildGraphDocumentIds,
        graphDocumentId,
      ),
    }))
    return get().requestGraphDocumentBuild(graphDocumentId, {
      browserExecutionPolicy: policy,
      explicit: isExplicit,
      reuseCurrentAcceptedPreviewComparison: options?.reuseCurrentAcceptedPreviewComparison,
      delayedDraftDispatchTrigger:
        options?.delayedDraftDispatchTrigger ?? (releaseAlreadyReached ? 'release' : undefined),
      delayedAuthoritativeDispatchTrigger:
        options?.delayedAuthoritativeDispatchTrigger ??
        (isExplicit ? 'explicit' : releaseAlreadyReached ? 'release' : undefined),
      draftPolicyOverride: options?.draftPolicyOverride,
      authoritativePolicyOverride: options?.authoritativePolicyOverride,
      geometryTargetOverride: options?.geometryTargetOverride,
    })
  },
  requestManualBuild: () => {
    const activeGraphDocument = selectActiveGraphDocument(useSpaghettiStore.getState())
    set({ pendingBuildAfterRelease: false })
    appendConsoleEntry({
      layer: 'App',
      text: `Manual build requested for ${activeGraphDocument.graphDocumentId}`,
      source: activeGraphDocument.graphDocumentId,
      severity: 'info',
    })
    get().requestBrowserGraphDocumentBuild(activeGraphDocument.graphDocumentId, {
      explicit: true,
    })
  },
})
