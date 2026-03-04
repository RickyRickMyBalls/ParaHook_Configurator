import type {
  AssembleRequest,
  AssembleResult,
  BuildProgress,
  BuildRequest,
  BuildResult,
  PartArtifact,
} from '../../shared/buildTypes'
import { buildModel } from '../buildModel'
import { emitArtifacts } from './artifactEmitter'
import { computeAffectedPartKeys } from './paramRouting'
import { deriveBuildPartKeyStrings } from './partsSpec'
import {
  makeBuildSignature,
  makePartSignature,
  type ControlMode,
  type EngineMode,
} from './signatures'

export type ProgressEmitter = (message: BuildProgress) => void

const buildCache = new Set<string>()
const partCache = new Set<string>()
const assembleCache = new Set<string>()

const ENGINE_MODE: EngineMode = 'stub_box'
const CONTROL_MODE: ControlMode = 'profile_editor'

const now = (): number => Date.now()

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
    (candidate) => (candidate.partKeyStr ?? candidate.id) === partKey,
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
  const { seq, payload, heelKickInstances, toeHookInstances } = request
  const instances = { heelKickInstances, toeHookInstances }
  const buildSignature = makeBuildSignature(payload, ENGINE_MODE, CONTROL_MODE)
  const parts = buildModel({
    payload,
    instances,
  })
  const orderedPartKeys = deriveBuildPartKeyStrings(instances)
  const affectedSet = new Set(computeAffectedPartKeys(request.changedParamIds, instances))

  for (const partKey of orderedPartKeys) {
    emit(emitProgress, {
      seq,
      phase: 'parts',
      partKey,
      state: 'queued',
    })

    const partSignature = makePartSignature(partKey, payload, ENGINE_MODE, CONTROL_MODE)
    const isAffected = affectedSet.has(partKey)

    if (!isAffected && partCache.has(partSignature)) {
      emit(emitProgress, {
        seq,
        phase: 'parts',
        partKey,
        state: 'cache_hit',
        progress01: 1,
        ms: 0,
      })
      emit(emitProgress, {
        seq,
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
        phase: 'parts',
        partKey,
        state: 'cache_hit',
        progress01: 1,
        ms: 0,
      })
      emit(emitProgress, {
        seq,
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
        phase: 'parts',
        partKey,
        state: 'building',
        progress01: 0,
      })

      await Promise.resolve()

      emit(emitProgress, {
        seq,
        phase: 'parts',
        partKey,
        state: 'building',
        progress01: 0.5,
      })

      // Stub compute point; deterministic part output is owned by partsSpec.
      void findPart(parts, partKey)

      const elapsed = now() - start
      partCache.add(partSignature)

      emit(emitProgress, {
        seq,
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
        phase: 'parts',
        partKey,
        state: 'error',
        message,
      })
      throw error
    }
  }

  buildCache.add(buildSignature)
  return emitArtifacts(seq, parts, request.changedParamIds)
}

export const assemblePipeline = async (
  request: AssembleRequest,
  emitProgress: ProgressEmitter,
): Promise<AssembleResult> => {
  const { seq, payload } = request
  const signature = makeBuildSignature(payload, ENGINE_MODE, CONTROL_MODE)
  const partKey = 'assembled'

  emit(emitProgress, {
    seq,
    phase: 'assemble',
    partKey,
    state: 'queued',
  })

  if (assembleCache.has(signature)) {
    emit(emitProgress, {
      seq,
      phase: 'assemble',
      partKey,
      state: 'cache_hit',
      progress01: 1,
      ms: 0,
    })
    emit(emitProgress, {
      seq,
      phase: 'assemble',
      partKey,
      state: 'done',
      progress01: 1,
      ms: 0,
    })
    return {
      type: 'assemble_result',
      seq,
      assembled: {
        width: payload.width,
        length: payload.length,
        height: payload.height,
      },
      signature,
    }
  }

  const start = now()

  try {
    emit(emitProgress, {
      seq,
      phase: 'assemble',
      partKey,
      state: 'building',
      progress01: 0,
    })

    await Promise.resolve()

    emit(emitProgress, {
      seq,
      phase: 'assemble',
      partKey,
      state: 'building',
      progress01: 0.5,
    })

    const elapsed = now() - start
    assembleCache.add(signature)
    buildCache.add(signature)

    emit(emitProgress, {
      seq,
      phase: 'assemble',
      partKey,
      state: 'done',
      progress01: 1,
      ms: elapsed,
    })

    return {
      type: 'assemble_result',
      seq,
      assembled: {
        width: payload.width,
        length: payload.length,
        height: payload.height,
      },
      signature,
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Assemble failed.'
    emit(emitProgress, {
      seq,
      phase: 'assemble',
      partKey,
      state: 'error',
      message,
    })
    throw error
  }
}
