import {
  cloneGeometryResultBundle,
  type GeometryResultBundle,
} from '../../shared/geometryResult'
import type {
  BuildExecutionIntent,
  BuildResult,
  BuildResultBundle,
  BuildResultEntry,
  CompiledBuildData,
  PartArtifact,
} from '../../shared/buildTypes'
import {
  buildResultClassFromExecutionIntent,
  getPartArtifactKey,
} from '../../shared/buildTypes'

const buildResultEntriesFromCompiledData = (options: {
  compiledBuildData?: CompiledBuildData
  resultClass: BuildResultBundle['resultClass']
  parts: PartArtifact[]
}): BuildResultEntry[] => {
  const artifactByPartKey = new Map(
    options.parts.map((artifact) => [getPartArtifactKey(artifact), artifact] as const),
  )
  const outputEntries = options.compiledBuildData?.outputEntries ?? []

  if (outputEntries.length === 0) {
    return options.parts.map((artifact) => ({
      buildUnitId: artifact.partKeyStr,
      outputEntryId: artifact.partKeyStr,
      sourceNodeId: null,
      status: 'rebuilt',
      resultClass: options.resultClass,
      artifacts: [artifact],
    }))
  }

  return outputEntries.flatMap((outputEntry) => {
    const artifact = artifactByPartKey.get(outputEntry.partKey)
    if (artifact === undefined) {
      return []
    }
    return [
      {
        buildUnitId: outputEntry.buildUnitId,
        outputEntryId: outputEntry.outputEntryId,
        sourceNodeId: outputEntry.sourceNodeId,
        status: 'rebuilt',
        resultClass: options.resultClass,
        artifacts: [artifact],
      } satisfies BuildResultEntry,
    ]
  })
}

const buildResultBundle = (options: {
  seq: number
  graphDocumentId: string
  buildRequestId: string
  executionIntent: BuildExecutionIntent
  compiledBuildData?: CompiledBuildData
  parts: PartArtifact[]
}): BuildResultBundle => {
  const resultClass = buildResultClassFromExecutionIntent(options.executionIntent)
  const entries = buildResultEntriesFromCompiledData({
    compiledBuildData: options.compiledBuildData,
    resultClass,
    parts: options.parts,
  })

  return {
    buildRequestId: options.buildRequestId,
    graphDocumentId: options.graphDocumentId,
    seq: options.seq,
    resultClass,
    executionIntent: { ...options.executionIntent },
    summary: {
      rebuiltCount: entries.length,
      retainedCount: 0,
      evictedCount: 0,
    },
    entries,
  }
}

export const emitArtifacts = (
  options: {
    seq: number
    projectFileId: string
    graphDocumentId: string
    buildRequestId: string
    executionIntent: BuildExecutionIntent
    compiledBuildData?: CompiledBuildData
    draftGeometryResult?: GeometryResultBundle | null
    authoritativeGeometryResult?: GeometryResultBundle | null
  },
  parts: PartArtifact[],
  changedParamIds?: string[],
): BuildResult => ({
  type: 'build_result',
  lane: 'build',
  seq: options.seq,
  projectFileId: options.projectFileId,
  graphDocumentId: options.graphDocumentId,
  buildRequestId: options.buildRequestId,
  bundle: buildResultBundle({
    seq: options.seq,
    graphDocumentId: options.graphDocumentId,
    buildRequestId: options.buildRequestId,
    executionIntent: options.executionIntent,
    compiledBuildData: options.compiledBuildData,
    parts,
  }),
  ...(options.draftGeometryResult !== undefined && options.draftGeometryResult !== null
    ? { draftGeometryResult: cloneGeometryResultBundle(options.draftGeometryResult) }
    : {}),
  ...(options.authoritativeGeometryResult !== undefined &&
  options.authoritativeGeometryResult !== null
    ? {
        authoritativeGeometryResult: cloneGeometryResultBundle(
          options.authoritativeGeometryResult,
        ),
      }
    : {}),
  ...(changedParamIds !== undefined ? { changedParamIds: [...changedParamIds] } : {}),
})
