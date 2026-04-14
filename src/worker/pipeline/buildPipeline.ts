import type {
  BuildRequest,
  BuildProgress,
  BuildResult,
  CompiledBuildData,
  PartArtifact,
} from '../../shared/buildTypes'
import { getPartArtifactKey } from '../../shared/buildTypes'
import { buildModelResult } from '../buildModel'
import { emitArtifacts } from './artifactEmitter'
import { computeAffectedPartKeys } from './paramRouting'
import {
  makeBuildSignature,
  makePartSignature,
  type ControlMode,
  type EngineMode,
} from './signatures'

export type ProgressEmitter = (message: BuildProgress) => void
export type BuildSupersessionCheck = () => boolean
export type BuildPipelineOptions = {
  isSuperseded?: BuildSupersessionCheck
}

export class BuildSupersededError extends Error {
  public readonly seq: number
  public readonly projectFileId: string
  public readonly graphDocumentId: string
  public readonly buildRequestId: string

  public constructor(request: Pick<
    BuildRequest,
    'seq' | 'projectFileId' | 'graphDocumentId' | 'buildRequestId'
  >) {
    super(
      `Superseded build request: ${request.graphDocumentId} (${request.buildRequestId})`,
    )
    this.name = 'BuildSupersededError'
    this.seq = request.seq
    this.projectFileId = request.projectFileId
    this.graphDocumentId = request.graphDocumentId
    this.buildRequestId = request.buildRequestId
  }
}

export const isBuildSupersededError = (error: unknown): error is BuildSupersededError =>
  error instanceof BuildSupersededError

const buildCache = new Set<string>()
const partCache = new Set<string>()

const ENGINE_MODE: EngineMode = 'stub_box'
const CONTROL_MODE: ControlMode = 'profile_editor'

const now = (): number => Date.now()

const toBuildSignatureInput = (request: BuildRequest) => ({
  compiledBuildData: request.compiledBuildData,
})

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const filterCompiledBuildDataToPartKeys = (
  compiledBuildData: CompiledBuildData,
  partKeys: readonly string[],
): CompiledBuildData => {
  const allowedPartKeys = new Set(partKeys)
  const resolvedShared =
    compiledBuildData.resolvedShared === undefined
      ? undefined
      : { ...compiledBuildData.resolvedShared }

  const featureStackIR = resolvedShared?.sp_featureStackIR
  if (
    isRecord(featureStackIR) &&
    featureStackIR.schemaVersion === 1 &&
    isRecord(featureStackIR.parts)
  ) {
    resolvedShared!.sp_featureStackIR = {
      schemaVersion: 1 as const,
      parts: Object.fromEntries(
        Object.entries(featureStackIR.parts).filter(([partKey]) => allowedPartKeys.has(partKey)),
      ),
    }
  }

  return {
    orderedPartKeys: compiledBuildData.orderedPartKeys.filter((partKey) =>
      allowedPartKeys.has(partKey),
    ),
    resolvedParts: Object.fromEntries(
      Object.entries(compiledBuildData.resolvedParts).filter(([partKey]) =>
        allowedPartKeys.has(partKey),
      ),
    ),
    outputEntries:
      compiledBuildData.outputEntries?.filter((entry) => allowedPartKeys.has(entry.partKey)) ?? [],
    ...(resolvedShared === undefined ? {} : { resolvedShared }),
  }
}

const emit = (
  emitProgress: ProgressEmitter,
  message: Omit<BuildProgress, 'type'>,
): void => {
  emitProgress({
    type: 'build_progress',
    ...message,
  })
}

const findPart = (parts: PartArtifact[], partKey: string): PartArtifact => {
  const part = parts.find(
    (candidate) => getPartArtifactKey(candidate) === partKey,
  )
  if (part === undefined) {
    throw new Error(`Missing part artifact for key: ${partKey}`)
  }
  return part
}

const throwIfSuperseded = (
  request: Pick<BuildRequest, 'seq' | 'projectFileId' | 'graphDocumentId' | 'buildRequestId'>,
  isSuperseded: BuildSupersessionCheck | undefined,
): void => {
  if (isSuperseded?.() !== true) {
    return
  }
  throw new BuildSupersededError(request)
}

export const buildPipeline = async (
  request: BuildRequest,
  emitProgress: ProgressEmitter,
  options: BuildPipelineOptions = {},
): Promise<BuildResult> => {
  const { seq, projectFileId, graphDocumentId, buildRequestId, compiledBuildData } = request
  const orderedPartKeys = [...compiledBuildData.orderedPartKeys]
  const affectedPartKeys = computeAffectedPartKeys(
    request.changedParamIds,
    orderedPartKeys,
    request.changedInputHint,
  )
  const shouldScopeExecution =
    request.changedInputHint !== undefined &&
    affectedPartKeys.length > 0 &&
    affectedPartKeys.length < orderedPartKeys.length
  const executionPartKeys = shouldScopeExecution ? affectedPartKeys : orderedPartKeys
  const executionCompiledBuildData = shouldScopeExecution
    ? filterCompiledBuildDataToPartKeys(compiledBuildData, executionPartKeys)
    : compiledBuildData
  const signatureInput = toBuildSignatureInput({
    ...request,
    compiledBuildData: executionCompiledBuildData,
  })
  const buildSignature = makeBuildSignature(signatureInput, ENGINE_MODE, CONTROL_MODE)
  throwIfSuperseded(request, options.isSuperseded)
  const { parts, draftGeometryResult, authoritativeGeometryResult } = await buildModelResult({
    compiledBuildData: executionCompiledBuildData,
    executionIntent: request.executionIntent,
    requestIdentity: {
      graphDocumentId,
      buildRequestId,
    },
  })
  throwIfSuperseded(request, options.isSuperseded)
  const affectedSet = new Set(affectedPartKeys)

  for (const partKey of executionPartKeys) {
    throwIfSuperseded(request, options.isSuperseded)
    emit(emitProgress, {
      seq,
      projectFileId,
      graphDocumentId,
      buildRequestId,
      lane: 'build',
      phase: 'parts',
      partKey,
      state: 'queued',
    })

    const partSignature = makePartSignature(
      partKey,
      {
        compiledBuildData: filterCompiledBuildDataToPartKeys(compiledBuildData, [partKey]),
      },
      ENGINE_MODE,
      CONTROL_MODE,
    )
    const isAffected = affectedSet.has(partKey)

    if (!isAffected && partCache.has(partSignature)) {
      emit(emitProgress, {
        seq,
        projectFileId,
        graphDocumentId,
        buildRequestId,
        lane: 'build',
        phase: 'parts',
        partKey,
        state: 'cache_hit',
        progress01: 1,
        ms: 0,
      })
      emit(emitProgress, {
        seq,
        projectFileId,
        graphDocumentId,
        buildRequestId,
        lane: 'build',
        phase: 'parts',
        partKey,
        state: 'done',
        progress01: 1,
        ms: 0,
      })
      continue
    }

    if (partCache.has(partSignature)) {
      emit(emitProgress, {
        seq,
        projectFileId,
        graphDocumentId,
        buildRequestId,
        lane: 'build',
        phase: 'parts',
        partKey,
        state: 'cache_hit',
        progress01: 1,
        ms: 0,
      })
      emit(emitProgress, {
        seq,
        projectFileId,
        graphDocumentId,
        buildRequestId,
        lane: 'build',
        phase: 'parts',
        partKey,
        state: 'done',
        progress01: 1,
        ms: 0,
      })
      continue
    }

    const start = now()

    try {
      emit(emitProgress, {
        seq,
        projectFileId,
        graphDocumentId,
        buildRequestId,
        lane: 'build',
        phase: 'parts',
        partKey,
        state: 'building',
        progress01: 0,
      })

      await Promise.resolve()
      throwIfSuperseded(request, options.isSuperseded)

      emit(emitProgress, {
        seq,
        projectFileId,
        graphDocumentId,
        buildRequestId,
        lane: 'build',
        phase: 'parts',
        partKey,
        state: 'building',
        progress01: 0.5,
      })

      void findPart(parts, partKey)
      throwIfSuperseded(request, options.isSuperseded)

      const elapsed = now() - start
      partCache.add(partSignature)

      emit(emitProgress, {
        seq,
        projectFileId,
        graphDocumentId,
        buildRequestId,
        lane: 'build',
        phase: 'parts',
        partKey,
        state: 'done',
        progress01: 1,
        ms: elapsed,
      })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Part build failed.'
      emit(emitProgress, {
        seq,
        projectFileId,
        graphDocumentId,
        buildRequestId,
        lane: 'build',
        phase: 'parts',
        partKey,
        state: 'error',
        message,
      })
      throw error
    }
  }

  buildCache.add(buildSignature)
  throwIfSuperseded(request, options.isSuperseded)
  return emitArtifacts(
    {
      seq,
      projectFileId,
      graphDocumentId,
      buildRequestId,
      executionIntent: request.executionIntent,
      compiledBuildData: executionCompiledBuildData,
      ...(shouldScopeExecution ? {} : { draftGeometryResult, authoritativeGeometryResult }),
    },
    parts,
    request.changedParamIds,
  )
}
