import type {
  BuildRequest,
  BuildProgress,
  BuildResult,
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

const buildCache = new Set<string>()
const partCache = new Set<string>()

const ENGINE_MODE: EngineMode = 'stub_box'
const CONTROL_MODE: ControlMode = 'profile_editor'

const now = (): number => Date.now()

const toBuildSignatureInput = (request: BuildRequest) => ({
  compiledBuildData: request.compiledBuildData,
})

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

export const buildPipeline = async (
  request: BuildRequest,
  emitProgress: ProgressEmitter,
): Promise<BuildResult> => {
  const { seq, projectFileId, graphDocumentId, buildRequestId, compiledBuildData } = request
  const signatureInput = toBuildSignatureInput(request)
  const buildSignature = makeBuildSignature(signatureInput, ENGINE_MODE, CONTROL_MODE)
  const { parts, draftGeometryResult, authoritativeGeometryResult } = await buildModelResult({
    compiledBuildData,
    executionIntent: request.executionIntent,
    requestIdentity: {
      graphDocumentId,
      buildRequestId,
    },
  })
  const orderedPartKeys = [...compiledBuildData.orderedPartKeys]
  const affectedSet = new Set(computeAffectedPartKeys(request.changedParamIds, orderedPartKeys))

  for (const partKey of orderedPartKeys) {
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

    const partSignature = makePartSignature(partKey, signatureInput, ENGINE_MODE, CONTROL_MODE)
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
  return emitArtifacts(
    {
      seq,
      projectFileId,
      graphDocumentId,
      buildRequestId,
      executionIntent: request.executionIntent,
      compiledBuildData,
      draftGeometryResult,
      authoritativeGeometryResult,
    },
    parts,
    request.changedParamIds,
  )
}
