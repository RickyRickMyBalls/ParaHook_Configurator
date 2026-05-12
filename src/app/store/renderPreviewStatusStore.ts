import { create } from 'zustand'

export type RenderPreviewStatusKind =
  | 'inactive'
  | 'fallback'
  | 'unsupported'
  | 'queued'
  | 'rendering'
  | 'complete'
  | 'stale'
  | 'canceled'
  | 'error'

export type RenderPreviewStaleReason =
  | 'camera'
  | 'geometry'
  | 'material'
  | 'lighting'
  | 'display-mode-exit'

export type RenderPreviewStatus = {
  status: RenderPreviewStatusKind
  completedIterations: number | null
  targetIterations: number | null
  completedSamples: number | null
  targetSamples: number | null
  message: string | null
  staleReason: RenderPreviewStaleReason | null
  updatedAtMs: number | null
}

type RenderPreviewProgressPatch = Partial<
  Pick<
    RenderPreviewStatus,
    'completedIterations' | 'targetIterations' | 'completedSamples' | 'targetSamples' | 'message'
  >
>

type RenderPreviewStatusStoreState = {
  statusByViewportId: Record<string, RenderPreviewStatus>
  enterFallback: (viewportId: string, message?: string | null) => void
  leavePreview: (viewportId: string) => void
  markUnsupported: (viewportId: string, message?: string | null) => void
  markQueued: (viewportId: string, message?: string | null) => void
  updateProgress: (viewportId: string, progress: RenderPreviewProgressPatch) => void
  markComplete: (viewportId: string, progress?: RenderPreviewProgressPatch) => void
  markStale: (viewportId: string, reason: RenderPreviewStaleReason, message?: string | null) => void
  markCanceled: (viewportId: string, message?: string | null) => void
  markError: (viewportId: string, message: string) => void
  clearViewportStatus: (viewportId: string) => void
}

export const EMPTY_RENDER_PREVIEW_STATUS: RenderPreviewStatus = {
  status: 'inactive',
  completedIterations: null,
  targetIterations: null,
  completedSamples: null,
  targetSamples: null,
  message: null,
  staleReason: null,
  updatedAtMs: null,
}

const makeStatus = (
  status: RenderPreviewStatusKind,
  patch: Partial<RenderPreviewStatus> = {},
): RenderPreviewStatus => ({
  ...EMPTY_RENDER_PREVIEW_STATUS,
  status,
  updatedAtMs: Date.now(),
  ...patch,
})

const normalizeProgressValue = (value: number | null | undefined): number | null => {
  if (value === undefined || value === null || !Number.isFinite(value)) {
    return null
  }
  return Math.max(0, Math.floor(value))
}

const normalizeProgressPatch = (progress: RenderPreviewProgressPatch): RenderPreviewProgressPatch => {
  const normalizedProgress: RenderPreviewProgressPatch = {}
  if ('completedIterations' in progress) {
    normalizedProgress.completedIterations = normalizeProgressValue(progress.completedIterations)
  }
  if ('targetIterations' in progress) {
    normalizedProgress.targetIterations = normalizeProgressValue(progress.targetIterations)
  }
  if ('completedSamples' in progress) {
    normalizedProgress.completedSamples = normalizeProgressValue(progress.completedSamples)
  }
  if ('targetSamples' in progress) {
    normalizedProgress.targetSamples = normalizeProgressValue(progress.targetSamples)
  }
  if ('message' in progress) {
    normalizedProgress.message = progress.message ?? null
  }
  return normalizedProgress
}

export const useRenderPreviewStatusStore = create<RenderPreviewStatusStoreState>((set) => ({
  statusByViewportId: {},
  enterFallback: (viewportId, message = 'interactive fallback') => {
    set((state) => ({
      statusByViewportId: {
        ...state.statusByViewportId,
        [viewportId]: makeStatus('fallback', { message }),
      },
    }))
  },
  leavePreview: (viewportId) => {
    set((state) => ({
      statusByViewportId: {
        ...state.statusByViewportId,
        [viewportId]: makeStatus('inactive', { staleReason: 'display-mode-exit' }),
      },
    }))
  },
  markUnsupported: (viewportId, message = 'backend not connected') => {
    set((state) => ({
      statusByViewportId: {
        ...state.statusByViewportId,
        [viewportId]: makeStatus('unsupported', { message }),
      },
    }))
  },
  markQueued: (viewportId, message = null) => {
    set((state) => ({
      statusByViewportId: {
        ...state.statusByViewportId,
        [viewportId]: makeStatus('queued', { message }),
      },
    }))
  },
  updateProgress: (viewportId, progress) => {
    set((state) => {
      const current = state.statusByViewportId[viewportId] ?? EMPTY_RENDER_PREVIEW_STATUS
      return {
        statusByViewportId: {
          ...state.statusByViewportId,
          [viewportId]: {
            ...current,
            ...normalizeProgressPatch(progress),
            status: 'rendering',
            staleReason: null,
            updatedAtMs: Date.now(),
          },
        },
      }
    })
  },
  markComplete: (viewportId, progress = {}) => {
    set((state) => {
      const current = state.statusByViewportId[viewportId] ?? EMPTY_RENDER_PREVIEW_STATUS
      return {
        statusByViewportId: {
          ...state.statusByViewportId,
          [viewportId]: {
            ...current,
            ...normalizeProgressPatch(progress),
            status: 'complete',
            staleReason: null,
            updatedAtMs: Date.now(),
          },
        },
      }
    })
  },
  markStale: (viewportId, reason, message = null) => {
    set((state) => {
      const current = state.statusByViewportId[viewportId] ?? EMPTY_RENDER_PREVIEW_STATUS
      if (current.status === 'inactive') {
        return state
      }
      return {
        statusByViewportId: {
          ...state.statusByViewportId,
          [viewportId]: {
            ...current,
            status: 'stale',
            staleReason: reason,
            message,
            updatedAtMs: Date.now(),
          },
        },
      }
    })
  },
  markCanceled: (viewportId, message = null) => {
    set((state) => ({
      statusByViewportId: {
        ...state.statusByViewportId,
        [viewportId]: makeStatus('canceled', { message }),
      },
    }))
  },
  markError: (viewportId, message) => {
    set((state) => ({
      statusByViewportId: {
        ...state.statusByViewportId,
        [viewportId]: makeStatus('error', { message }),
      },
    }))
  },
  clearViewportStatus: (viewportId) => {
    set((state) => {
      if (state.statusByViewportId[viewportId] === undefined) {
        return state
      }
      const nextStatusByViewportId = { ...state.statusByViewportId }
      delete nextStatusByViewportId[viewportId]
      return {
        statusByViewportId: nextStatusByViewportId,
      }
    })
  },
}))

export const selectRenderPreviewStatus = (
  state: RenderPreviewStatusStoreState,
  viewportId: string,
): RenderPreviewStatus => state.statusByViewportId[viewportId] ?? EMPTY_RENDER_PREVIEW_STATUS

export const formatRenderPreviewStatusLabel = (status: RenderPreviewStatus): string => {
  if (status.status === 'inactive') {
    return ''
  }

  if (
    status.status === 'rendering' &&
    status.completedIterations !== null &&
    status.targetIterations !== null
  ) {
    return `Render Preview: ${status.completedIterations} / ${status.targetIterations} iterations`
  }

  if (
    status.status === 'rendering' &&
    status.completedSamples !== null &&
    status.targetSamples !== null
  ) {
    return `Render Preview: ${status.completedSamples} / ${status.targetSamples} samples`
  }

  if (status.status === 'fallback') {
    return 'Render Preview: interactive fallback'
  }
  if (status.status === 'unsupported') {
    return 'Render Preview: unavailable'
  }
  if (status.status === 'queued') {
    return 'Render Preview: queued'
  }
  if (status.status === 'rendering') {
    return 'Render Preview: rendering'
  }
  if (status.status === 'complete') {
    return 'Render Preview: complete'
  }
  if (status.status === 'stale') {
    return `Render Preview: stale${status.staleReason === null ? '' : ` - ${status.staleReason} changed`}`
  }
  if (status.status === 'canceled') {
    return 'Render Preview: canceled'
  }
  return 'Render Preview: error'
}
