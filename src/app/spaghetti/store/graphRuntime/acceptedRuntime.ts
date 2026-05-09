import { compileSpaghettiGraph } from '../../compiler/compileGraph'
import type {
  BuildChangedInputHint,
  BuildExecutionIntent,
  BuildResultBundle,
  BuildResultEntry,
  BuildRoutingIdentity,
  BuildUnitId,
  PartArtifact,
} from '../../../../shared/buildTypes'
import { DEFAULT_BUILD_EXECUTION_INTENT } from '../../../../shared/buildTypes'
import {
  cloneGeometryResultBundle,
  getGeometryResultAuthoritativeHandleId,
  type GeometryResultBundle,
} from '../../../../shared/geometryResult'
import type { GraphOutputSurface } from '../../outputSurface'
import type { GraphPreviewPreparation } from '../../previewPreparation'
import { artifactToPartKeyStr } from '../../../parts/partKeyResolver'

export type GraphCompileBuildState = {
  lastCompileResult: ReturnType<typeof compileSpaghettiGraph> | null
  previousBuildInputs: ReturnType<typeof compileSpaghettiGraph>['buildInputs'] | null
  comparisonBuildInputs: ReturnType<typeof compileSpaghettiGraph>['buildInputs'] | null
  pendingChangedParamIds: string[]
  pendingChangedInputHint: BuildChangedInputHint | null
  pendingStatsPartKeys: string[]
  pendingTargetBuildUnitIds: BuildUnitId[]
  pendingAffectedBuildUnitIds: BuildUnitId[]
  currentDocumentRevision: number
  currentGraphRevision: number
  lastBuildSeq: number | null
  latestIssuedGraphRevision: number | null
  latestIssuedBuildSeq: number
  latestAcceptedGraphRevision: number | null
  latestAcceptedBuildSeq: number | null
  latestAcceptedBuildUnitIds: BuildUnitId[]
  inFlightGraphRevision: number | null
  inFlightBuildRequestId: string | null
  inFlightBuildSeq: number | null
  inFlightExecutionIntent: BuildExecutionIntent | null
}

export type AcceptedBuildImpactEntry = Pick<
  BuildResultEntry,
  'buildUnitId' | 'outputEntryId' | 'sourceNodeId' | 'status' | 'resultClass'
>

export type AcceptedBuildImpactSnapshot = {
  seq: number
  graphDocumentId: string
  buildRequestId: string
  changedParamIds: string[]
  affectedBuildUnitIds: BuildUnitId[]
  targetBuildUnitIds: BuildUnitId[]
  summary: BuildResultBundle['summary']
  entries: AcceptedBuildImpactEntry[]
}

export type StagedAuthoritativePreviewResult = {
  buildSeq: number
  buildRequestId: string
  graphRevision: number
  targetBuildUnitIds: BuildUnitId[]
  acceptedBuildImpact: AcceptedBuildImpactSnapshot
  acceptedBuildBundle: BuildResultBundle
  acceptedPreviewBuildBundle: BuildResultBundle
  acceptedBuildOutputs: PartArtifact[]
  acceptedPreviewBuildOutputs: PartArtifact[]
  authoritativeGeometryResult: GeometryResultBundle | null
}

export type GraphRuntimeState = {
  compileBuild: GraphCompileBuildState
  previewPreparation: GraphPreviewPreparation
  acceptedBuildImpact: AcceptedBuildImpactSnapshot | null
  acceptedBuildBundle: BuildResultBundle | null
  acceptedPreviewBuildBundle: BuildResultBundle | null
  acceptedAuthoritativeGraphRevision: number | null
  acceptedPreviewGraphRevision: number | null
  acceptedDraftGraphRevision: number | null
  acceptedAuthoritativeGeometryResult: GeometryResultBundle | null
  acceptedDraftGeometryResult: GeometryResultBundle | null
  stagedAuthoritativePreviewResult: StagedAuthoritativePreviewResult | null
  acceptedBuildOutputs: PartArtifact[]
  acceptedPreviewBuildOutputs: PartArtifact[]
  outputSurface: GraphOutputSurface
}

const EMPTY_BUILD_RESULT_ENTRIES: BuildResultEntry[] = []

const cloneBuildResultEntry = (entry: BuildResultEntry): BuildResultEntry => ({
  buildUnitId: entry.buildUnitId,
  outputEntryId: entry.outputEntryId,
  sourceNodeId: entry.sourceNodeId,
  status: entry.status,
  resultClass: entry.resultClass,
  artifacts: [...entry.artifacts],
})

export const finalizeAcceptedBuildBundle = (options: {
  previousBundle: BuildResultBundle | null
  nextBundle: BuildResultBundle
  targetBuildUnitIds: readonly BuildUnitId[]
}): BuildResultBundle => {
  const previousEntries = options.previousBundle?.entries ?? EMPTY_BUILD_RESULT_ENTRIES
  const nextEntries = options.nextBundle.entries
  const previousByBuildUnitId = new Map(previousEntries.map((entry) => [entry.buildUnitId, entry] as const))
  const nextByBuildUnitId = new Map(nextEntries.map((entry) => [entry.buildUnitId, entry] as const))
  const orderedBuildUnitIds = [
    ...new Set([
      ...previousEntries.map((entry) => entry.buildUnitId),
      ...options.targetBuildUnitIds,
      ...nextEntries.map((entry) => entry.buildUnitId),
    ]),
  ]

  const entries: BuildResultEntry[] = []
  for (const buildUnitId of orderedBuildUnitIds) {
    const rebuiltEntry = nextByBuildUnitId.get(buildUnitId)
    if (rebuiltEntry !== undefined) {
      entries.push({
        ...cloneBuildResultEntry(rebuiltEntry),
        status: 'rebuilt',
        resultClass: options.nextBundle.resultClass,
      })
      continue
    }

    const previousEntry = previousByBuildUnitId.get(buildUnitId)
    if (previousEntry === undefined) {
      continue
    }

    if (options.targetBuildUnitIds.includes(buildUnitId)) {
      entries.push({
        ...cloneBuildResultEntry(previousEntry),
        status: 'evicted',
        resultClass: options.nextBundle.resultClass,
        artifacts: [],
      })
      continue
    }

    entries.push({
      ...cloneBuildResultEntry(previousEntry),
      status: 'retained',
      resultClass: options.nextBundle.resultClass,
    })
  }

  return {
    buildRequestId: options.nextBundle.buildRequestId,
    graphDocumentId: options.nextBundle.graphDocumentId,
    seq: options.nextBundle.seq,
    resultClass: options.nextBundle.resultClass,
    executionIntent: { ...options.nextBundle.executionIntent },
    summary: {
      rebuiltCount: entries.filter((entry) => entry.status === 'rebuilt').length,
      retainedCount: entries.filter((entry) => entry.status === 'retained').length,
      evictedCount: entries.filter((entry) => entry.status === 'evicted').length,
    },
    entries,
  }
}

const bundleToAcceptedBuildOutputs = (bundle: BuildResultBundle | null): PartArtifact[] => {
  if (bundle === null) {
    return []
  }
  const artifactsByPartKey = new Map<string, PartArtifact>()
  for (const entry of bundle.entries) {
    if (entry.status === 'evicted') {
      continue
    }
    for (const artifact of entry.artifacts) {
      const partKey = artifactToPartKeyStr(artifact)
      if (!artifactsByPartKey.has(partKey)) {
        artifactsByPartKey.set(partKey, artifact)
      }
    }
  }
  return [...artifactsByPartKey.values()]
}

export const buildAcceptedBuildImpactSnapshot = (options: {
  acceptedBuildBundle: BuildResultBundle
  changedParamIds: readonly string[]
  affectedBuildUnitIds: readonly BuildUnitId[]
  targetBuildUnitIds: readonly BuildUnitId[]
}): AcceptedBuildImpactSnapshot => ({
  seq: options.acceptedBuildBundle.seq,
  graphDocumentId: options.acceptedBuildBundle.graphDocumentId,
  buildRequestId: options.acceptedBuildBundle.buildRequestId,
  changedParamIds: [...options.changedParamIds],
  affectedBuildUnitIds: [...options.affectedBuildUnitIds],
  targetBuildUnitIds: [...options.targetBuildUnitIds],
  summary: {
    rebuiltCount: options.acceptedBuildBundle.summary.rebuiltCount,
    retainedCount: options.acceptedBuildBundle.summary.retainedCount,
    evictedCount: options.acceptedBuildBundle.summary.evictedCount,
  },
  entries: options.acceptedBuildBundle.entries.map((entry) => ({
    buildUnitId: entry.buildUnitId,
    outputEntryId: entry.outputEntryId,
    sourceNodeId: entry.sourceNodeId,
    status: entry.status,
    resultClass: entry.resultClass,
  })),
})

export const buildFinalizedAcceptedResultArtifacts = (options: {
  runtime: GraphRuntimeState
  routingIdentity: BuildRoutingIdentity & {
    buildSeq: number
    bundle?: BuildResultBundle
  }
}): {
  acceptedBuildBundle: BuildResultBundle
  acceptedPreviewBuildBundle: BuildResultBundle
  acceptedBuildOutputs: PartArtifact[]
  acceptedPreviewBuildOutputs: PartArtifact[]
  acceptedBuildImpact: AcceptedBuildImpactSnapshot
  targetBuildUnitIds: BuildUnitId[]
} => {
  const compileBuild = options.runtime.compileBuild
  const nextBundle =
    options.routingIdentity.bundle ??
    ({
      buildRequestId: options.routingIdentity.buildRequestId,
      graphDocumentId: options.routingIdentity.graphDocumentId,
      seq: options.routingIdentity.buildSeq,
      resultClass: 'final',
      executionIntent: { ...DEFAULT_BUILD_EXECUTION_INTENT },
      summary: {
        rebuiltCount: 0,
        retainedCount: 0,
        evictedCount: 0,
      },
      entries: [],
    } satisfies BuildResultBundle)
  const targetBuildUnitIds = [...compileBuild.pendingTargetBuildUnitIds]
  const acceptedBuildBundle = finalizeAcceptedBuildBundle({
    previousBundle: options.runtime.acceptedBuildBundle,
    nextBundle,
    targetBuildUnitIds,
  })
  const acceptedPreviewBuildBundle = acceptedBuildBundle
  const acceptedBuildOutputs = bundleToAcceptedBuildOutputs(acceptedBuildBundle)
  const acceptedPreviewBuildOutputs = bundleToAcceptedBuildOutputs(acceptedPreviewBuildBundle)
  const acceptedBuildImpact = buildAcceptedBuildImpactSnapshot({
    acceptedBuildBundle,
    changedParamIds: compileBuild.pendingChangedParamIds,
    affectedBuildUnitIds: compileBuild.pendingAffectedBuildUnitIds,
    targetBuildUnitIds,
  })
  return {
    acceptedBuildBundle,
    acceptedPreviewBuildBundle,
    acceptedBuildOutputs,
    acceptedPreviewBuildOutputs,
    acceptedBuildImpact,
    targetBuildUnitIds,
  }
}

export const cloneAcceptedGeometryLane = (
  geometryResult: GeometryResultBundle | null | undefined,
): GeometryResultBundle | null =>
  geometryResult === undefined || geometryResult === null
    ? null
    : cloneGeometryResultBundle(geometryResult)

export const cloneAcceptedBuildImpactSnapshot = (
  snapshot: AcceptedBuildImpactSnapshot | null,
): AcceptedBuildImpactSnapshot | null =>
  snapshot === null
    ? null
    : {
        seq: snapshot.seq,
        graphDocumentId: snapshot.graphDocumentId,
        buildRequestId: snapshot.buildRequestId,
        changedParamIds: [...snapshot.changedParamIds],
        affectedBuildUnitIds: [...snapshot.affectedBuildUnitIds],
        targetBuildUnitIds: [...snapshot.targetBuildUnitIds],
        summary: { ...snapshot.summary },
        entries: snapshot.entries.map((entry) => ({ ...entry })),
      }

export const cloneBuildResultBundle = (
  bundle: BuildResultBundle | null,
): BuildResultBundle | null =>
  bundle === null
    ? null
    : {
        buildRequestId: bundle.buildRequestId,
        graphDocumentId: bundle.graphDocumentId,
        seq: bundle.seq,
        resultClass: bundle.resultClass,
        executionIntent: { ...bundle.executionIntent },
        summary: { ...bundle.summary },
        entries: bundle.entries.map((entry) => cloneBuildResultEntry(entry)),
      }

export const cloneStagedAuthoritativePreviewResult = (
  stagedResult: StagedAuthoritativePreviewResult | null | undefined,
): StagedAuthoritativePreviewResult | null =>
  stagedResult === undefined || stagedResult === null
    ? null
    : {
        buildSeq: stagedResult.buildSeq,
        buildRequestId: stagedResult.buildRequestId,
        graphRevision: stagedResult.graphRevision,
        targetBuildUnitIds: [...stagedResult.targetBuildUnitIds],
        acceptedBuildImpact: cloneAcceptedBuildImpactSnapshot(stagedResult.acceptedBuildImpact)!,
        acceptedBuildBundle: cloneBuildResultBundle(stagedResult.acceptedBuildBundle)!,
        acceptedPreviewBuildBundle: cloneBuildResultBundle(stagedResult.acceptedPreviewBuildBundle)!,
        acceptedBuildOutputs: [...stagedResult.acceptedBuildOutputs],
        acceptedPreviewBuildOutputs: [...stagedResult.acceptedPreviewBuildOutputs],
        authoritativeGeometryResult: cloneAcceptedGeometryLane(
          stagedResult.authoritativeGeometryResult,
        ),
      }

export const resolveAcceptedGeometryPromotion = (options: {
  previousAcceptedDraftGeometryResult: GeometryResultBundle | null
  previousAcceptedAuthoritativeGeometryResult: GeometryResultBundle | null
  incomingDraftGeometryResult?: GeometryResultBundle
  incomingAuthoritativeGeometryResult?: GeometryResultBundle
}): {
  acceptedDraftGeometryResult: GeometryResultBundle | null
  acceptedAuthoritativeGeometryResult: GeometryResultBundle | null
  authoritativeHandleIdsToRelease: string[]
} => {
  const acceptedDraftGeometryResult =
    options.incomingDraftGeometryResult === undefined
      ? cloneAcceptedGeometryLane(options.previousAcceptedDraftGeometryResult)
      : cloneAcceptedGeometryLane(options.incomingDraftGeometryResult)
  const acceptedAuthoritativeGeometryResult =
    options.incomingAuthoritativeGeometryResult === undefined
      ? cloneAcceptedGeometryLane(options.previousAcceptedAuthoritativeGeometryResult)
      : cloneAcceptedGeometryLane(options.incomingAuthoritativeGeometryResult)

  const previousAuthoritativeHandleId = getGeometryResultAuthoritativeHandleId(
    options.previousAcceptedAuthoritativeGeometryResult,
  )
  const nextAuthoritativeHandleId = getGeometryResultAuthoritativeHandleId(
    acceptedAuthoritativeGeometryResult,
  )

  return {
    acceptedDraftGeometryResult,
    acceptedAuthoritativeGeometryResult,
    authoritativeHandleIdsToRelease:
      previousAuthoritativeHandleId !== null &&
      nextAuthoritativeHandleId !== null &&
      previousAuthoritativeHandleId !== nextAuthoritativeHandleId
        ? [previousAuthoritativeHandleId]
        : [],
  }
}
