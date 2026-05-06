import { buildDispatcher } from '../../buildDispatcher'
import {
  selectGraphRuntimeByDocumentId,
  useSpaghettiStore,
  type GraphRuntimeState,
  type SpaghettiStoreState,
} from '../../spaghetti/store/useSpaghettiStore'
import { buildRequestFromBuildInputs } from '../../spaghetti/integration/buildInputsToRequest'
import {
  DEFAULT_BUILD_EXECUTION_INTENT,
  type BuildExecutionIntent,
  type GeometryExecutionTarget,
} from '../../../shared/buildTypes'
import { newId } from '../../spaghetti/utils/id'
import { appendConsoleEntry } from '../../console/useConsoleStore'
import {
  selectViewportResultModeBehaviorById,
  useWorkspaceStore,
} from '../../workspace/useWorkspaceStore'
import type {
  AppState,
  DelayedAuthoritativeBuildPlaceholder,
  DelayedDraftBuildPlaceholder,
  DraftSchedulingRuntimeEvent,
  GraphDocumentBuildRequestOptions,
} from '../useAppStore'
import { deleteRecordKey } from '../storeRecordUtils'

const isGraphVisibleInActiveViewer = (
  state: Pick<SpaghettiStoreState, 'viewerTargetGraphDocumentId' | 'sharedViewerComposition'>,
  graphDocumentId: string,
): boolean =>
  state.viewerTargetGraphDocumentId === graphDocumentId ||
  state.sharedViewerComposition?.graphDocumentIds.includes(graphDocumentId) === true

const resolveGraphBuildGeometryTarget = (graphDocumentId: string): GeometryExecutionTarget => {
  const spaghettiState = useSpaghettiStore.getState()
  if (!isGraphVisibleInActiveViewer(spaghettiState, graphDocumentId)) {
    return DEFAULT_BUILD_EXECUTION_INTENT.geometryTarget
  }

  const workspaceState = useWorkspaceStore.getState()
  const modeBehavior = selectViewportResultModeBehaviorById(
    workspaceState,
    workspaceState.activeViewerViewportId,
  )
  return modeBehavior.mode === 'final' ? 'authoritative' : 'draft_preview'
}

const resolveGraphBuildUpdatePolicy = (
  options?: GraphDocumentBuildRequestOptions,
): BuildExecutionIntent['updatePolicy'] => {
  if (options?.explicit === true || options?.browserExecutionPolicy === 'manual') {
    return 'manual'
  }
  if (options?.browserExecutionPolicy === 'release') {
    return 'defer_until_release'
  }
  return DEFAULT_BUILD_EXECUTION_INTENT.updatePolicy
}

export const resolveGraphBuildDraftPolicy = (
  graphDocumentId: string,
  options?: GraphDocumentBuildRequestOptions,
): BuildExecutionIntent['draftPolicy'] => {
  if (options?.draftPolicyOverride !== undefined) {
    return options.draftPolicyOverride
  }

  const geometryTarget =
    options?.geometryTargetOverride ?? resolveGraphBuildGeometryTarget(graphDocumentId)
  if (geometryTarget !== 'draft_preview') {
    return DEFAULT_BUILD_EXECUTION_INTENT.draftPolicy
  }

  if (options?.browserExecutionPolicy === 'off') {
    return 'suppressed'
  }
  if (options?.browserExecutionPolicy === 'release') {
    return 'release'
  }

  return DEFAULT_BUILD_EXECUTION_INTENT.draftPolicy
}

export const resolveGraphBuildAuthoritativePolicy = (
  graphDocumentId: string,
  options?: GraphDocumentBuildRequestOptions,
): BuildExecutionIntent['authoritativePolicy'] => {
  if (options?.authoritativePolicyOverride !== undefined) {
    return options.authoritativePolicyOverride
  }

  const geometryTarget =
    options?.geometryTargetOverride ?? resolveGraphBuildGeometryTarget(graphDocumentId)
  if (geometryTarget !== 'authoritative') {
    return DEFAULT_BUILD_EXECUTION_INTENT.authoritativePolicy
  }

  if (options?.explicit === true || options?.browserExecutionPolicy === 'manual') {
    return 'explicit'
  }
  if (options?.browserExecutionPolicy === 'live') {
    return 'live'
  }
  return 'release'
}

export const resolveGraphBuildExecutionIntent = (
  graphDocumentId: string,
  options?: GraphDocumentBuildRequestOptions,
): BuildExecutionIntent => ({
  ...DEFAULT_BUILD_EXECUTION_INTENT,
  updatePolicy: resolveGraphBuildUpdatePolicy(options),
  draftPolicy: resolveGraphBuildDraftPolicy(graphDocumentId, options),
  authoritativePolicy: resolveGraphBuildAuthoritativePolicy(graphDocumentId, options),
  geometryTarget: options?.geometryTargetOverride ?? resolveGraphBuildGeometryTarget(graphDocumentId),
})

const resolveRequestComparisonBuildInputs = (
  runtime: GraphRuntimeState | null,
  executionIntent: BuildExecutionIntent,
  options?: GraphDocumentBuildRequestOptions,
) => {
  const compileBuild = runtime?.compileBuild ?? null
  const previousBuildInputs = compileBuild?.previousBuildInputs ?? undefined
  if (
    options?.reuseCurrentAcceptedPreviewComparison !== true ||
    executionIntent.geometryTarget !== 'authoritative'
  ) {
    return previousBuildInputs
  }

  const currentGraphRevision = compileBuild?.currentGraphRevision ?? null
  const latestAcceptedGraphRevision = compileBuild?.latestAcceptedGraphRevision ?? null
  const comparisonBuildInputs = compileBuild?.comparisonBuildInputs ?? null
  if (
    currentGraphRevision === null ||
    latestAcceptedGraphRevision === null ||
    latestAcceptedGraphRevision !== currentGraphRevision ||
    runtime?.acceptedPreviewGraphRevision !== currentGraphRevision ||
    runtime?.acceptedAuthoritativeGraphRevision === currentGraphRevision ||
    comparisonBuildInputs === null
  ) {
    return previousBuildInputs
  }

  return comparisonBuildInputs
}

export const dispatchDelayedGraphBuildPlaceholder = (
  graphDocumentId: string,
  placeholder: DelayedDraftBuildPlaceholder | DelayedAuthoritativeBuildPlaceholder,
): void => {
  const buildRequestId = newId('build-request')
  const buildSeq = buildDispatcher.requestGraphBuild({
    routingIdentity: {
      projectFileId: placeholder.projectFileId,
      graphDocumentId,
      buildRequestId,
    },
    executionIntent: placeholder.executionIntent,
    compiledBuildData: placeholder.compiledBuildData,
    buildIdentity: placeholder.buildIdentity,
    invalidation: placeholder.invalidation,
    changedParamIds: placeholder.changedParamIds,
    ...(placeholder.changedInputHint === undefined
      ? {}
      : { changedInputHint: placeholder.changedInputHint }),
    buildStatsPartKeys: placeholder.buildStatsPartKeys,
  })
  useSpaghettiStore.getState().stageGraphBuildRequest(graphDocumentId, {
    compileResult: placeholder.compileResult,
    previousBuildInputs: placeholder.previousBuildInputs,
    pendingChangedParamIds: placeholder.changedParamIds,
    pendingChangedInputHint: placeholder.changedInputHint,
    pendingStatsPartKeys: placeholder.buildStatsPartKeys,
    pendingTargetBuildUnitIds: placeholder.buildIdentity.targetBuildUnitIds,
    pendingAffectedBuildUnitIds: placeholder.invalidation.affectedBuildUnitIds,
    buildRequestId,
    buildSeq,
    executionIntent: placeholder.executionIntent,
  })
}

type BuildRequestActionState = Pick<
  AppState,
  | 'currentProject'
  | 'delayedDraftBuildByGraphDocumentId'
  | 'delayedAuthoritativeBuildByGraphDocumentId'
>

type BuildRequestActionGet = () => Pick<
  AppState,
  | 'compileGraphDocument'
  | 'currentProject'
  | 'delayedDraftBuildByGraphDocumentId'
  | 'delayedAuthoritativeBuildByGraphDocumentId'
  | 'settleGraphViewportComparison'
>

type BuildRequestActionSet = (
  updater:
    | Partial<BuildRequestActionState>
    | ((state: BuildRequestActionState) => Partial<BuildRequestActionState> | BuildRequestActionState),
) => void

export const createBuildRequestActions = ({
  get,
  set,
  publishDraftSchedulingRuntimeEvent,
}: {
  get: BuildRequestActionGet
  set: BuildRequestActionSet
  publishDraftSchedulingRuntimeEvent: (
    event: Omit<DraftSchedulingRuntimeEvent, 'eventSeq'>,
  ) => void
}): Pick<AppState, 'requestGraphDocumentBuild'> => ({
  requestGraphDocumentBuild: (graphDocumentId, options) => {
    if (options?.explicit === true) {
      get().settleGraphViewportComparison(graphDocumentId)
    }
    const state = get()
    const spaghettiState = useSpaghettiStore.getState()
    const existingDelayedPlaceholder =
      state.delayedDraftBuildByGraphDocumentId[graphDocumentId] ?? null
    const compileResult = get().compileGraphDocument(graphDocumentId)
    if (!compileResult.ok || compileResult.buildInputs === undefined) {
      return compileResult
    }

    const runtime = selectGraphRuntimeByDocumentId(spaghettiState, graphDocumentId)
    const pendingBuildState = runtime?.compileBuild ?? null
    const previewPreparation = runtime?.previewPreparation ?? null
    if (previewPreparation === null) {
      return compileResult
    }
    const executionIntent = resolveGraphBuildExecutionIntent(graphDocumentId, options)
    const comparisonBuildInputs = resolveRequestComparisonBuildInputs(
      runtime,
      executionIntent,
      options,
    )
    const requestBuild = buildRequestFromBuildInputs(
      compileResult.buildInputs,
      previewPreparation,
      comparisonBuildInputs,
    )
    if (requestBuild.targetBuildUnitIds.length === 0) {
      return compileResult
    }
    if (
      executionIntent.geometryTarget === 'authoritative' &&
      executionIntent.authoritativePolicy !== 'live' &&
      options?.delayedAuthoritativeDispatchTrigger !== executionIntent.authoritativePolicy
    ) {
      set((current) => ({
        delayedAuthoritativeBuildByGraphDocumentId: {
          ...current.delayedAuthoritativeBuildByGraphDocumentId,
          [graphDocumentId]: {
            projectFileId: state.currentProject.projectFileId,
            graphDocumentId,
            graphRevision: pendingBuildState?.currentGraphRevision ?? 0,
            compileResult,
            previousBuildInputs: comparisonBuildInputs ?? null,
            executionIntent: { ...executionIntent },
            compiledBuildData: requestBuild.compiledBuildData,
            buildIdentity: {
              graphRevision: pendingBuildState?.currentGraphRevision ?? 0,
              targetBuildUnitIds: [...requestBuild.targetBuildUnitIds],
            },
            invalidation: {
              affectedBuildUnitIds: [...requestBuild.affectedBuildUnitIds],
            },
            changedParamIds: [...requestBuild.changedParamIds],
            ...(requestBuild.changedInputHint === undefined
              ? {}
              : { changedInputHint: requestBuild.changedInputHint }),
            buildStatsPartKeys: [...requestBuild.buildStatsPartKeys],
          },
        },
      }))
      appendConsoleEntry({
        layer: 'App',
        text: `Delayed authoritative build staged for ${graphDocumentId}`,
        source: graphDocumentId,
        severity: 'info',
      })
      return compileResult
    }
    if (
      executionIntent.geometryTarget === 'draft_preview' &&
      (executionIntent.draftPolicy === 'release' || executionIntent.draftPolicy === 'settle') &&
      options?.delayedDraftDispatchTrigger !== executionIntent.draftPolicy
    ) {
      if (existingDelayedPlaceholder !== null) {
        publishDraftSchedulingRuntimeEvent({
          type: 'draft_replaced',
          graphDocumentId,
          draftPolicy: existingDelayedPlaceholder.executionIntent.draftPolicy,
        })
      }
      set((current) => ({
        delayedDraftBuildByGraphDocumentId: {
          ...current.delayedDraftBuildByGraphDocumentId,
          [graphDocumentId]: {
            projectFileId: state.currentProject.projectFileId,
            graphDocumentId,
            graphRevision: pendingBuildState?.currentGraphRevision ?? 0,
            compileResult,
            previousBuildInputs: comparisonBuildInputs ?? null,
            executionIntent: { ...executionIntent },
            compiledBuildData: requestBuild.compiledBuildData,
            buildIdentity: {
              graphRevision: pendingBuildState?.currentGraphRevision ?? 0,
              targetBuildUnitIds: [...requestBuild.targetBuildUnitIds],
            },
            invalidation: {
              affectedBuildUnitIds: [...requestBuild.affectedBuildUnitIds],
            },
            changedParamIds: [...requestBuild.changedParamIds],
            ...(requestBuild.changedInputHint === undefined
              ? {}
              : { changedInputHint: requestBuild.changedInputHint }),
            buildStatsPartKeys: [...requestBuild.buildStatsPartKeys],
          },
        },
      }))
      appendConsoleEntry({
        layer: 'App',
        text: `Delayed draft build staged for ${graphDocumentId}`,
        source: graphDocumentId,
        severity: 'info',
      })
      publishDraftSchedulingRuntimeEvent({
        type: 'draft_delayed',
        graphDocumentId,
        draftPolicy: executionIntent.draftPolicy,
      })
      return compileResult
    }

    set((current) => ({
      delayedDraftBuildByGraphDocumentId: deleteRecordKey(
        current.delayedDraftBuildByGraphDocumentId,
        graphDocumentId,
      ),
      delayedAuthoritativeBuildByGraphDocumentId:
        executionIntent.geometryTarget === 'authoritative'
          ? deleteRecordKey(current.delayedAuthoritativeBuildByGraphDocumentId, graphDocumentId)
          : current.delayedAuthoritativeBuildByGraphDocumentId,
    }))
    const releaseTriggeredPlaceholderDispatch =
      existingDelayedPlaceholder !== null &&
      options?.delayedDraftDispatchTrigger === existingDelayedPlaceholder.executionIntent.draftPolicy &&
      executionIntent.draftPolicy === existingDelayedPlaceholder.executionIntent.draftPolicy
    if (existingDelayedPlaceholder !== null && !releaseTriggeredPlaceholderDispatch) {
      publishDraftSchedulingRuntimeEvent({
        type: 'draft_replaced',
        graphDocumentId,
        draftPolicy: existingDelayedPlaceholder.executionIntent.draftPolicy,
      })
    }
    const buildRequestId = newId('build-request')
    const buildSeq = buildDispatcher.requestGraphBuild({
      routingIdentity: {
        projectFileId: state.currentProject.projectFileId,
        graphDocumentId,
        buildRequestId,
      },
      executionIntent,
      compiledBuildData: requestBuild.compiledBuildData,
      buildIdentity: {
        graphRevision: pendingBuildState?.currentGraphRevision ?? 0,
        targetBuildUnitIds: requestBuild.targetBuildUnitIds,
      },
      invalidation: {
        affectedBuildUnitIds: requestBuild.affectedBuildUnitIds,
      },
      changedParamIds: requestBuild.changedParamIds,
      ...(requestBuild.changedInputHint === undefined
        ? {}
        : { changedInputHint: requestBuild.changedInputHint }),
      buildStatsPartKeys: requestBuild.buildStatsPartKeys,
    })
    spaghettiState.stageGraphBuildRequest(graphDocumentId, {
      compileResult,
      previousBuildInputs: comparisonBuildInputs ?? null,
      pendingChangedParamIds: requestBuild.changedParamIds,
      pendingChangedInputHint: requestBuild.changedInputHint,
      pendingStatsPartKeys: requestBuild.buildStatsPartKeys,
      pendingTargetBuildUnitIds: requestBuild.targetBuildUnitIds,
      pendingAffectedBuildUnitIds: requestBuild.affectedBuildUnitIds,
      buildRequestId,
      buildSeq,
      executionIntent,
    })
    appendConsoleEntry({
      layer: 'App',
      text: `Requested graph build for ${graphDocumentId}`,
      source: graphDocumentId,
      severity: 'info',
    })
    return compileResult
  },
})
