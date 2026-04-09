import { create } from 'zustand'

export type ViewportRuntimeStats = {
  triangles: number | null
  lines: number | null
  points: number | null
  fps: number | null
}

type ViewportRuntimeStatsStoreState = {
  statsByViewportId: Record<string, ViewportRuntimeStats>
  setViewportRuntimeStats: (viewportId: string, stats: ViewportRuntimeStats) => void
  clearViewportRuntimeStats: (viewportId: string) => void
}

export const EMPTY_VIEWPORT_RUNTIME_STATS: ViewportRuntimeStats = {
  triangles: null,
  lines: null,
  points: null,
  fps: null,
}

export const useViewportRuntimeStatsStore = create<ViewportRuntimeStatsStoreState>((set) => ({
  statsByViewportId: {},
  setViewportRuntimeStats: (viewportId, stats) => {
    set((state) => ({
      statsByViewportId: {
        ...state.statsByViewportId,
        [viewportId]: stats,
      },
    }))
  },
  clearViewportRuntimeStats: (viewportId) => {
    set((state) => {
      if (state.statsByViewportId[viewportId] === undefined) {
        return state
      }
      const nextStatsByViewportId = { ...state.statsByViewportId }
      delete nextStatsByViewportId[viewportId]
      return {
        statsByViewportId: nextStatsByViewportId,
      }
    })
  },
}))

export const selectViewportRuntimeStats = (
  state: ViewportRuntimeStatsStoreState,
  viewportId: string,
): ViewportRuntimeStats => state.statsByViewportId[viewportId] ?? EMPTY_VIEWPORT_RUNTIME_STATS
