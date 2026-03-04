import { create } from 'zustand'
import type { BuildProgress, BuildProgressState } from '../../shared/buildTypes'

export type OverallBuildState = 'idle' | 'building' | 'assembling' | 'error'

type PartStats = {
  state: BuildProgressState
  progress01: number | null
  cached: boolean
  ms: number | null
  message: string | null
}

type BuildStatsState = {
  statsExpanded: boolean
  activeSeq: number | null
  overallState: OverallBuildState
  partOrder: string[]
  partStatsByKey: Record<string, PartStats>
  pulseNonce: number
  pulseKind: 'cache_hit' | null
  toggleStatsExpanded: () => void
  resetStatsForSeq: (seq: number, partKeys: string[]) => void
  applyProgress: (message: BuildProgress) => void
  setOverallState: (state: OverallBuildState) => void
  triggerCacheHitPulse: () => void
}

const createPartStats = (): PartStats => ({
  state: 'queued',
  progress01: null,
  cached: false,
  ms: null,
  message: null,
})

const clampProgress = (value: number): number => {
  if (value < 0) {
    return 0
  }
  if (value > 1) {
    return 1
  }
  return value
}

export const useBuildStatsStore = create<BuildStatsState>((set, get) => ({
  statsExpanded: false,
  activeSeq: null,
  overallState: 'idle',
  partOrder: [],
  partStatsByKey: {},
  pulseNonce: 0,
  pulseKind: null,
  toggleStatsExpanded: () => {
    set((state) => ({ statsExpanded: !state.statsExpanded }))
  },
  resetStatsForSeq: (seq, partKeys) => {
    const nextStats: Record<string, PartStats> = {}
    for (const key of partKeys) {
      nextStats[key] = createPartStats()
    }
    set({
      activeSeq: seq,
      partOrder: [...partKeys],
      partStatsByKey: nextStats,
    })
  },
  applyProgress: (message) => {
    const state = get()
    if (state.activeSeq === null || message.seq !== state.activeSeq) {
      return
    }

    const existing = state.partStatsByKey[message.partKey] ?? createPartStats()
    const partOrder = state.partOrder.includes(message.partKey)
      ? state.partOrder
      : [...state.partOrder, message.partKey]

    const nextStats: PartStats = {
      state: message.state,
      progress01:
        typeof message.progress01 === 'number'
          ? clampProgress(message.progress01)
          : message.state === 'cache_hit' || message.state === 'done'
            ? 1
            : message.state === 'queued'
              ? null
              : existing.progress01,
      cached: message.state === 'cache_hit' ? true : existing.cached,
      ms: typeof message.ms === 'number' ? message.ms : existing.ms,
      message: message.message ?? (message.state === 'error' ? existing.message : null),
    }

    set({
      partOrder,
      partStatsByKey: {
        ...state.partStatsByKey,
        [message.partKey]: nextStats,
      },
    })
  },
  setOverallState: (overallState) => {
    set({ overallState })
  },
  triggerCacheHitPulse: () => {
    set((state) => ({
      pulseNonce: state.pulseNonce + 1,
      pulseKind: 'cache_hit',
    }))
  },
}))

export const selectOverallProgress01 = (state: BuildStatsState): number => {
  if (state.partOrder.length === 0) {
    return 0
  }

  let total = 0
  for (const key of state.partOrder) {
    const stats = state.partStatsByKey[key]
    if (stats === undefined) {
      continue
    }

    if (stats.state === 'done' || stats.state === 'cache_hit') {
      total += 1
      continue
    }

    if (stats.state === 'building') {
      total += stats.progress01 ?? 0.3
      continue
    }

    if (stats.state === 'queued') {
      total += 0
      continue
    }

    if (stats.state === 'error') {
      total += 1
    }
  }

  return total / state.partOrder.length
}

export const selectHasDeterminateProgress = (state: BuildStatsState): boolean =>
  state.partOrder.some((key) => {
    const part = state.partStatsByKey[key]
    if (part === undefined) {
      return false
    }
    if (part.state === 'cache_hit' || part.state === 'done' || part.state === 'error') {
      return true
    }
    return part.state === 'building' && part.progress01 !== null
  })
