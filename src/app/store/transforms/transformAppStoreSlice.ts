import { newId } from '../../spaghetti/utils/id'
import {
  buildReferenceTimelineConfig,
  getReferenceTimelineDefaultRange,
  getReferenceTransformOverrideAxisValue,
  shiftReferenceTimelineConfig,
} from '../../references/referenceTimeline'
import type { ReferenceTransformOverride } from '../../references/referenceManifest'
import type { AppState } from '../useAppStore'
import {
  applyEnvironmentLightTransformHistoryEntriesToOverride,
  applyReferenceTransformHistoryEntriesToOverride,
  applyReferenceTransformTimelineDeltas,
  areReferenceTransformOverridesEqual,
  areReferenceTransformVectorsEqual,
  buildDefaultReferenceTransformOverride,
  buildEnvironmentLightTransformOverride,
  cloneReferenceTransformOverride,
  cloneReferenceTransformSnapState,
  environmentLightSupportsPosition,
  getContentObjectTransformSnapState,
  getEnvironmentLightTransformHistoryTransformAtScrubIndex,
  getNextReferenceTransformSessionOrdinal,
  getReferenceTimelineMode,
  getReferenceTransformHistoryEntryAfterValue,
  getReferenceTransformHistoryLatestScrubIndex,
  getReferenceTransformHistoryTransformAtScrubIndex,
  getReferenceTransformSnapDriverValue,
  getReferenceTransformSnapState,
  insertEnvironmentLightTransformHistoryEntryAtScrubIndex,
  insertReferenceTransformHistoryEntryAtScrubIndex,
  mergeEnvironmentLightTransformHistoryEntries,
  mergeReferenceTransformHistoryEntries,
  normalizeEnvironmentLightTransformHistoryEntries,
  normalizeReferenceTransformHistoryEntries,
  resolveReferenceTransformHistoryKind,
  resolveReferenceTransformHistoryScrubIndex,
  scaleReferenceTransformSnapAxisValues,
  selectEnvironmentLightById,
  setAllReferenceTransformSnapAxes,
  updateEnvironmentLightPosition,
} from './referenceTransformHelpers'

type AppStoreSet = (
  partial:
    | AppState
    | Partial<AppState>
    | ((state: AppState) => AppState | Partial<AppState>),
) => void

type TimelineChannel = Parameters<AppState['setReferenceChannelClampRange']>[1]
type TimelineRange = Parameters<AppState['setReferenceChannelClampRange']>[2]
type TimelineMode = Parameters<AppState['setReferenceTimelineMode']>[2]
type TimelineCycle = Parameters<AppState['setReferenceTimelineCycle']>[2]
type TimelinePoints = Parameters<AppState['setReferenceTimelinePoints']>[2]
type TransformSnapMode = Parameters<AppState['setReferenceTransformSnapEnabled']>[1]
type TransformSnapAxis = Parameters<AppState['setReferenceTransformSnapAxisValue']>[2]

const getReferenceChannelClampRange = (
  state: Pick<AppState, 'referenceWorkspace'>,
  referenceId: string,
  channel: TimelineChannel,
): TimelineRange =>
  state.referenceWorkspace.channelClampRangeByReferenceId[referenceId]?.[channel] ??
  getReferenceTimelineDefaultRange(channel)

const resolveEnvironmentLightTransformBase = (
  state: Pick<AppState, 'referenceWorkspace'>,
  lightId: string,
): ReferenceTransformOverride => {
  const light = selectEnvironmentLightById(lightId)
  return (
    cloneReferenceTransformOverride(
      state.referenceWorkspace.environmentLightTransformBaseById[lightId] ?? null,
    ) ??
    (light === null
      ? buildDefaultReferenceTransformOverride()
      : buildEnvironmentLightTransformOverride(light))
  )
}

export const createTransformAppStoreSlice = (set: AppStoreSet) => ({
  beginReferenceTransformShell: (referenceId: string) => {
    set((state) => {
      const existingSession = state.referenceWorkspace.activeReferenceTransformSession
      if (existingSession?.referenceId === referenceId && existingSession.shellActive) {
        return state
      }
      const currentTransformOverride =
        state.referenceWorkspace.transformOverrideById[referenceId] ?? null
      const currentEntries = normalizeReferenceTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByReferenceId[referenceId] ?? [],
      )
      const latestScrubIndex = getReferenceTransformHistoryLatestScrubIndex(currentEntries)
      const draftTransform =
        cloneReferenceTransformOverride(currentTransformOverride) ??
        getReferenceTransformHistoryTransformAtScrubIndex(currentEntries, latestScrubIndex)
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformHistoryByReferenceId: {
            ...state.referenceWorkspace.transformHistoryByReferenceId,
            [referenceId]: currentEntries,
          },
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            [referenceId]: true,
          },
          activeContentObjectTransformSession: null,
          activeEnvironmentLightTransformSession: null,
          activeReferenceTransformSession: {
            referenceId,
            sessionId: newId('reference-transform-session'),
            sessionOrdinal: getNextReferenceTransformSessionOrdinal(currentEntries),
            mode: 'translate',
            space: 'local',
            shellActive: true,
            entryActive: false,
            activeHandle: null,
            historyScrubIndex: latestScrubIndex,
            draftTransform,
            entryOrigin: null,
          },
        },
      }
    })
  },
  exitReferenceTransformShell: () => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        activeReferenceTransformSession: null,
      },
    }))
  },
  beginReferenceTransformEntry: (mode: AppState['beginReferenceTransformEntry'] extends (
    mode: infer T,
  ) => void
    ? T
    : never) => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeReferenceTransformSession
      if (activeSession === null) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeReferenceTransformSession: {
            ...activeSession,
            mode,
            entryActive: true,
            activeHandle: null,
            entryOrigin:
              cloneReferenceTransformOverride(activeSession.draftTransform) ??
              buildDefaultReferenceTransformOverride(),
            draftTransform:
              cloneReferenceTransformOverride(activeSession.draftTransform) ??
              buildDefaultReferenceTransformOverride(),
          },
        },
      }
    })
  },
  commitActiveReferenceTransformEntry: () => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeReferenceTransformSession
      if (activeSession === null) {
        return state
      }
      const activeReferenceId = activeSession.referenceId
      const committedTransformOverride =
        cloneReferenceTransformOverride(activeSession.draftTransform) ??
        buildDefaultReferenceTransformOverride()
      const previousTransformOverride =
        state.referenceWorkspace.transformOverrideById[activeReferenceId] ?? null
      const kind = resolveReferenceTransformHistoryKind(activeSession.mode)
      const after = getReferenceTransformHistoryEntryAfterValue(committedTransformOverride, kind)
      const currentEntries = normalizeReferenceTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByReferenceId[activeReferenceId] ?? [],
      )
      const currentScrubIndex = resolveReferenceTransformHistoryScrubIndex(
        currentEntries,
        activeSession.historyScrubIndex,
      )
      const nextEntries = insertReferenceTransformHistoryEntryAtScrubIndex(
        currentEntries,
        currentScrubIndex,
        activeSession.sessionId,
        activeSession.sessionOrdinal,
        kind,
        after,
      )
      const historyChanged =
        currentEntries.length !== nextEntries.length ||
        currentEntries.some((entry, index) => {
          const other = nextEntries[index]
          return (
            other === undefined ||
            entry.entryId !== other.entryId ||
            !areReferenceTransformVectorsEqual(entry.delta, other.delta) ||
            !areReferenceTransformVectorsEqual(entry.after, other.after) ||
            !areReferenceTransformOverridesEqual(entry.transformAfter, other.transformAfter) ||
            entry.locked !== other.locked
          )
        })
      const latestScrubIndex = getReferenceTransformHistoryLatestScrubIndex(nextEntries)
      const nextTransformOverride = getReferenceTransformHistoryTransformAtScrubIndex(
        nextEntries,
        latestScrubIndex,
      )
      const nextActiveScrubIndex = historyChanged
        ? Math.min(latestScrubIndex, currentScrubIndex + 1)
        : Math.min(latestScrubIndex, currentScrubIndex)
      const nextActiveDraftTransform = getReferenceTransformHistoryTransformAtScrubIndex(
        nextEntries,
        nextActiveScrubIndex,
      )
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeReferenceTransformSession: {
            ...activeSession,
            entryActive: false,
            activeHandle: null,
            historyScrubIndex: nextActiveScrubIndex,
            draftTransform: nextActiveDraftTransform,
            entryOrigin: null,
          },
          transformOverrideById: {
            ...state.referenceWorkspace.transformOverrideById,
            [activeReferenceId]: nextTransformOverride,
          },
          transformHistoryByReferenceId: historyChanged
            ? {
                ...state.referenceWorkspace.transformHistoryByReferenceId,
                [activeReferenceId]: nextEntries,
              }
            : state.referenceWorkspace.transformHistoryByReferenceId,
          timelineConfigByReferenceId: applyReferenceTransformTimelineDeltas(
            state.referenceWorkspace,
            activeReferenceId,
            previousTransformOverride,
            nextTransformOverride,
          ),
        },
      }
    })
  },
  setActiveReferenceTransformMode: (
    mode: AppState['setActiveReferenceTransformMode'] extends (mode: infer T) => void ? T : never,
  ) => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeReferenceTransformSession
      if (activeSession === null) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeReferenceTransformSession: {
            ...activeSession,
            mode,
          },
        },
      }
    })
  },
  setActiveReferenceTransformSpace: (
    space: AppState['setActiveReferenceTransformSpace'] extends (space: infer T) => void ? T : never,
  ) => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeReferenceTransformSession
      if (activeSession === null || activeSession.space === space) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeReferenceTransformSession: {
            ...activeSession,
            space,
          },
        },
      }
    })
  },
  setActiveReferenceTransformHandle: (
    handle: AppState['setActiveReferenceTransformHandle'] extends (handle: infer T) => void ? T : never,
  ) => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeReferenceTransformSession
      if (activeSession === null) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeReferenceTransformSession: {
            ...activeSession,
            activeHandle: handle === null ? null : { ...handle },
          },
        },
      }
    })
  },
  setActiveReferenceTransformDraft: (transformOverride: ReferenceTransformOverride | null) => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeReferenceTransformSession
      if (activeSession === null) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeReferenceTransformSession: {
            ...activeSession,
            draftTransform:
              cloneReferenceTransformOverride(transformOverride) ??
              buildDefaultReferenceTransformOverride(),
          },
        },
      }
    })
  },
  setActiveReferenceTransformHistoryScrubIndex: (scrubIndex: number) => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeReferenceTransformSession
      if (activeSession === null || activeSession.entryActive) {
        return state
      }
      const currentEntries = normalizeReferenceTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByReferenceId[activeSession.referenceId] ?? [],
      )
      const nextScrubIndex = resolveReferenceTransformHistoryScrubIndex(currentEntries, scrubIndex)
      if (nextScrubIndex === activeSession.historyScrubIndex) {
        return state
      }
      const nextDraftTransform = getReferenceTransformHistoryTransformAtScrubIndex(
        currentEntries,
        nextScrubIndex,
      )
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeReferenceTransformSession: {
            ...activeSession,
            historyScrubIndex: nextScrubIndex,
            draftTransform: nextDraftTransform,
          },
        },
      }
    })
  },
  setReferenceTransformOverride: (
    referenceId: string,
    transformOverride: ReferenceTransformOverride | null,
  ) => {
    set((state) => {
      const previousTransformOverride =
        state.referenceWorkspace.transformOverrideById[referenceId] ?? null
      const activeSession = state.referenceWorkspace.activeReferenceTransformSession
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformOverrideById: {
            ...state.referenceWorkspace.transformOverrideById,
            [referenceId]: transformOverride,
          },
          activeReferenceTransformSession:
            activeSession?.referenceId === referenceId
              ? {
                  ...activeSession,
                  draftTransform:
                    cloneReferenceTransformOverride(transformOverride) ??
                    buildDefaultReferenceTransformOverride(),
                }
              : activeSession,
          timelineConfigByReferenceId: applyReferenceTransformTimelineDeltas(
            state.referenceWorkspace,
            referenceId,
            previousTransformOverride,
            transformOverride,
          ),
        },
      }
    })
  },
  resetReferenceTransform: (referenceId: string) => {
    set((state) => {
      const previousTransformOverride =
        state.referenceWorkspace.transformOverrideById[referenceId] ?? null
      const activeSession = state.referenceWorkspace.activeReferenceTransformSession
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformOverrideById: {
            ...state.referenceWorkspace.transformOverrideById,
            [referenceId]: null,
          },
          activeReferenceTransformSession:
            activeSession?.referenceId === referenceId
              ? {
                  ...activeSession,
                  draftTransform: buildDefaultReferenceTransformOverride(),
                  entryOrigin: activeSession.entryActive ? activeSession.entryOrigin : null,
                }
              : activeSession,
          timelineConfigByReferenceId: applyReferenceTransformTimelineDeltas(
            state.referenceWorkspace,
            referenceId,
            previousTransformOverride,
            null,
          ),
        },
      }
    })
  },
  setReferenceTransformHistoryEntryDeltaValue: (
    referenceId: string,
    entryId: string,
    axis: 'x' | 'y' | 'z',
    value: number,
  ) => {
    set((state) => {
      const previousTransformOverride =
        state.referenceWorkspace.transformOverrideById[referenceId] ?? null
      const activeSession = state.referenceWorkspace.activeReferenceTransformSession
      const currentEntries = normalizeReferenceTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByReferenceId[referenceId] ?? [],
      )
      let changed = false
      const nextEntries = normalizeReferenceTransformHistoryEntries(
        currentEntries.map((entry) => {
          if (entry.entryId !== entryId || entry.delta[axis] === value) {
            return entry
          }
          changed = true
          return {
            ...entry,
            delta: {
              ...entry.delta,
              [axis]: value,
            },
          }
        }),
      )
      if (!changed) {
        return state
      }
      const nextTransformOverride = applyReferenceTransformHistoryEntriesToOverride(nextEntries)
      const nextScrubIndex =
        activeSession?.referenceId !== referenceId
          ? undefined
          : resolveReferenceTransformHistoryScrubIndex(nextEntries, activeSession.historyScrubIndex)
      const nextDraftTransform =
        nextScrubIndex === undefined
          ? nextTransformOverride
          : getReferenceTransformHistoryTransformAtScrubIndex(nextEntries, nextScrubIndex)
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformOverrideById: {
            ...state.referenceWorkspace.transformOverrideById,
            [referenceId]: nextTransformOverride,
          },
          transformHistoryByReferenceId: {
            ...state.referenceWorkspace.transformHistoryByReferenceId,
            [referenceId]: nextEntries,
          },
          activeReferenceTransformSession:
            activeSession?.referenceId !== referenceId
              ? activeSession
              : {
                  ...activeSession,
                  historyScrubIndex: nextScrubIndex,
                  draftTransform:
                    cloneReferenceTransformOverride(nextDraftTransform) ??
                    buildDefaultReferenceTransformOverride(),
                  entryOrigin:
                    activeSession.entryOrigin === null
                      ? null
                      : cloneReferenceTransformOverride(nextDraftTransform),
                },
          timelineConfigByReferenceId: applyReferenceTransformTimelineDeltas(
            state.referenceWorkspace,
            referenceId,
            previousTransformOverride,
            nextTransformOverride,
          ),
        },
      }
    })
  },
  deleteReferenceTransformHistoryEntry: (referenceId: string, entryId: string) => {
    set((state) => {
      const previousTransformOverride =
        state.referenceWorkspace.transformOverrideById[referenceId] ?? null
      const activeSession = state.referenceWorkspace.activeReferenceTransformSession
      const currentEntries = normalizeReferenceTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByReferenceId[referenceId] ?? [],
      )
      const removedIndex = currentEntries.findIndex((entry) => entry.entryId === entryId)
      if (removedIndex < 0) {
        return state
      }
      const nextEntries = normalizeReferenceTransformHistoryEntries([
        ...currentEntries.slice(0, removedIndex),
        ...currentEntries.slice(removedIndex + 1),
      ])
      const nextTransformOverride = applyReferenceTransformHistoryEntriesToOverride(nextEntries)
      const currentScrubIndex =
        activeSession?.referenceId !== referenceId
          ? undefined
          : resolveReferenceTransformHistoryScrubIndex(
              currentEntries,
              activeSession.historyScrubIndex,
            )
      const nextScrubIndex =
        currentScrubIndex === undefined
          ? undefined
          : resolveReferenceTransformHistoryScrubIndex(
              nextEntries,
              currentScrubIndex - (removedIndex + 1 < currentScrubIndex ? 1 : 0),
            )
      const nextDraftTransform =
        nextScrubIndex === undefined
          ? nextTransformOverride
          : getReferenceTransformHistoryTransformAtScrubIndex(nextEntries, nextScrubIndex)
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformOverrideById: {
            ...state.referenceWorkspace.transformOverrideById,
            [referenceId]: nextTransformOverride,
          },
          transformHistoryByReferenceId: {
            ...state.referenceWorkspace.transformHistoryByReferenceId,
            [referenceId]: nextEntries,
          },
          activeReferenceTransformSession:
            activeSession?.referenceId !== referenceId
              ? activeSession
              : {
                  ...activeSession,
                  historyScrubIndex: nextScrubIndex,
                  draftTransform:
                    cloneReferenceTransformOverride(nextDraftTransform) ??
                    buildDefaultReferenceTransformOverride(),
                  entryOrigin:
                    activeSession.entryOrigin === null
                      ? null
                      : cloneReferenceTransformOverride(nextDraftTransform),
                },
          timelineConfigByReferenceId: applyReferenceTransformTimelineDeltas(
            state.referenceWorkspace,
            referenceId,
            previousTransformOverride,
            nextTransformOverride,
          ),
        },
      }
    })
  },
  toggleReferenceTransformHistoryLock: (referenceId: string, entryId: string) => {
    set((state) => {
      const currentEntries = normalizeReferenceTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByReferenceId[referenceId] ?? [],
      )
      let changed = false
      const nextEntries = currentEntries.map((entry) => {
        if (entry.entryId !== entryId) {
          return entry
        }
        changed = true
        return {
          ...entry,
          locked: !entry.locked,
        }
      })
      if (!changed) {
        return state
      }
      const nextTransformOverride = applyReferenceTransformHistoryEntriesToOverride(nextEntries)
      const activeSession = state.referenceWorkspace.activeReferenceTransformSession
      const nextScrubIndex =
        activeSession?.referenceId !== referenceId
          ? undefined
          : resolveReferenceTransformHistoryScrubIndex(nextEntries, activeSession.historyScrubIndex)
      const nextDraftTransform =
        nextScrubIndex === undefined
          ? nextTransformOverride
          : getReferenceTransformHistoryTransformAtScrubIndex(nextEntries, nextScrubIndex)
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformOverrideById: {
            ...state.referenceWorkspace.transformOverrideById,
            [referenceId]: nextTransformOverride,
          },
          transformHistoryByReferenceId: {
            ...state.referenceWorkspace.transformHistoryByReferenceId,
            [referenceId]: nextEntries,
          },
          activeReferenceTransformSession:
            activeSession?.referenceId !== referenceId
              ? activeSession
              : {
                  ...activeSession,
                  historyScrubIndex: nextScrubIndex,
                  draftTransform:
                    cloneReferenceTransformOverride(nextDraftTransform) ??
                    buildDefaultReferenceTransformOverride(),
                },
        },
      }
    })
  },
  mergeReferenceTransformHistory: (referenceId: string) => {
    set((state) => {
      const currentEntries = normalizeReferenceTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByReferenceId[referenceId] ?? [],
      )
      const nextEntries = mergeReferenceTransformHistoryEntries(currentEntries)
      const changed =
        currentEntries.length !== nextEntries.length ||
        currentEntries.some((entry, index) => {
          const other = nextEntries[index]
          return (
            other === undefined ||
            entry.entryId !== other.entryId ||
            entry.sessionId !== other.sessionId ||
            entry.sessionOrdinal !== other.sessionOrdinal ||
            entry.locked !== other.locked ||
            !areReferenceTransformVectorsEqual(entry.delta, other.delta) ||
            !areReferenceTransformVectorsEqual(entry.after, other.after) ||
            !areReferenceTransformOverridesEqual(entry.transformAfter, other.transformAfter)
          )
        })
      if (!changed) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformHistoryByReferenceId: {
            ...state.referenceWorkspace.transformHistoryByReferenceId,
            [referenceId]: nextEntries,
          },
        },
      }
    })
  },
  cancelActiveReferenceTransformEntry: () => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeReferenceTransformSession
      if (activeSession === null) {
        return state
      }
      const baseline =
        cloneReferenceTransformOverride(activeSession.entryOrigin) ??
        buildDefaultReferenceTransformOverride()
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeReferenceTransformSession: {
            ...activeSession,
            entryActive: false,
            activeHandle: null,
            draftTransform: baseline,
            entryOrigin: null,
          },
        },
      }
    })
  },
  beginContentObjectTransformShell: (objectId: string) => {
    set((state) => {
      const existingSession = state.referenceWorkspace.activeContentObjectTransformSession
      if (existingSession?.objectId === objectId && existingSession.shellActive) {
        return state
      }
      const currentTransformOverride =
        state.referenceWorkspace.contentObjectTransformOverrideById[objectId] ?? null
      const currentEntries = normalizeReferenceTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByObjectId[objectId] ?? [],
      )
      const latestScrubIndex = getReferenceTransformHistoryLatestScrubIndex(currentEntries)
      const draftTransform =
        cloneReferenceTransformOverride(currentTransformOverride) ??
        getReferenceTransformHistoryTransformAtScrubIndex(currentEntries, latestScrubIndex)
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformHistoryByObjectId: {
            ...state.referenceWorkspace.transformHistoryByObjectId,
            [objectId]: currentEntries,
          },
          activeReferenceTransformSession: null,
          activeEnvironmentLightTransformSession: null,
          activeContentObjectTransformSession: {
            objectId,
            sessionId: newId('content-object-transform-session'),
            sessionOrdinal: getNextReferenceTransformSessionOrdinal(currentEntries),
            mode: 'translate',
            space: 'local',
            shellActive: true,
            entryActive: false,
            activeHandle: null,
            historyScrubIndex: latestScrubIndex,
            draftTransform,
            entryOrigin: null,
          },
        },
      }
    })
  },
  exitContentObjectTransformShell: () => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        activeContentObjectTransformSession: null,
      },
    }))
  },
  beginContentObjectTransformEntry: (
    mode: AppState['beginContentObjectTransformEntry'] extends (mode: infer T) => void ? T : never,
  ) => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeContentObjectTransformSession
      if (activeSession === null) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeContentObjectTransformSession: {
            ...activeSession,
            mode,
            entryActive: true,
            activeHandle: null,
            entryOrigin:
              cloneReferenceTransformOverride(activeSession.draftTransform) ??
              buildDefaultReferenceTransformOverride(),
            draftTransform:
              cloneReferenceTransformOverride(activeSession.draftTransform) ??
              buildDefaultReferenceTransformOverride(),
          },
        },
      }
    })
  },
  commitActiveContentObjectTransformEntry: () => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeContentObjectTransformSession
      if (activeSession === null) {
        return state
      }
      const activeObjectId = activeSession.objectId
      const committedTransformOverride =
        cloneReferenceTransformOverride(activeSession.draftTransform) ??
        buildDefaultReferenceTransformOverride()
      const kind = resolveReferenceTransformHistoryKind(activeSession.mode)
      const after = getReferenceTransformHistoryEntryAfterValue(committedTransformOverride, kind)
      const currentEntries = normalizeReferenceTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByObjectId[activeObjectId] ?? [],
      )
      const currentScrubIndex = resolveReferenceTransformHistoryScrubIndex(
        currentEntries,
        activeSession.historyScrubIndex,
      )
      const nextEntries = insertReferenceTransformHistoryEntryAtScrubIndex(
        currentEntries,
        currentScrubIndex,
        activeSession.sessionId,
        activeSession.sessionOrdinal,
        kind,
        after,
      )
      const historyChanged =
        currentEntries.length !== nextEntries.length ||
        currentEntries.some((entry, index) => {
          const other = nextEntries[index]
          return (
            other === undefined ||
            entry.entryId !== other.entryId ||
            !areReferenceTransformVectorsEqual(entry.delta, other.delta) ||
            !areReferenceTransformVectorsEqual(entry.after, other.after) ||
            !areReferenceTransformOverridesEqual(entry.transformAfter, other.transformAfter) ||
            entry.locked !== other.locked
          )
        })
      const latestScrubIndex = getReferenceTransformHistoryLatestScrubIndex(nextEntries)
      const nextTransformOverride = getReferenceTransformHistoryTransformAtScrubIndex(
        nextEntries,
        latestScrubIndex,
      )
      const nextActiveScrubIndex = historyChanged
        ? Math.min(latestScrubIndex, currentScrubIndex + 1)
        : Math.min(latestScrubIndex, currentScrubIndex)
      const nextActiveDraftTransform = getReferenceTransformHistoryTransformAtScrubIndex(
        nextEntries,
        nextActiveScrubIndex,
      )
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeContentObjectTransformSession: {
            ...activeSession,
            entryActive: false,
            activeHandle: null,
            historyScrubIndex: nextActiveScrubIndex,
            draftTransform:
              cloneReferenceTransformOverride(nextActiveDraftTransform) ??
              buildDefaultReferenceTransformOverride(),
            entryOrigin: null,
          },
          contentObjectTransformOverrideById: {
            ...state.referenceWorkspace.contentObjectTransformOverrideById,
            [activeObjectId]: nextTransformOverride,
          },
          transformHistoryByObjectId: historyChanged
            ? {
                ...state.referenceWorkspace.transformHistoryByObjectId,
                [activeObjectId]: nextEntries,
              }
            : state.referenceWorkspace.transformHistoryByObjectId,
        },
      }
    })
  },
  setActiveContentObjectTransformMode: (
    mode: AppState['setActiveContentObjectTransformMode'] extends (mode: infer T) => void
      ? T
      : never,
  ) => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeContentObjectTransformSession
      if (activeSession === null || activeSession.mode === mode) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeContentObjectTransformSession: {
            ...activeSession,
            mode,
          },
        },
      }
    })
  },
  setActiveContentObjectTransformSpace: (
    space: AppState['setActiveContentObjectTransformSpace'] extends (space: infer T) => void
      ? T
      : never,
  ) => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeContentObjectTransformSession
      if (activeSession === null || activeSession.space === space) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeContentObjectTransformSession: {
            ...activeSession,
            space,
          },
        },
      }
    })
  },
  setActiveContentObjectTransformHandle: (
    handle: AppState['setActiveContentObjectTransformHandle'] extends (handle: infer T) => void
      ? T
      : never,
  ) => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeContentObjectTransformSession
      if (activeSession === null) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeContentObjectTransformSession: {
            ...activeSession,
            activeHandle: handle === null ? null : { ...handle },
          },
        },
      }
    })
  },
  setActiveContentObjectTransformDraft: (transformOverride: ReferenceTransformOverride | null) => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeContentObjectTransformSession
      if (activeSession === null) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeContentObjectTransformSession: {
            ...activeSession,
            draftTransform:
              cloneReferenceTransformOverride(transformOverride) ??
              buildDefaultReferenceTransformOverride(),
          },
        },
      }
    })
  },
  setContentObjectTransformOverride: (
    objectId: string,
    transformOverride: ReferenceTransformOverride | null,
  ) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        contentObjectTransformOverrideById: {
          ...state.referenceWorkspace.contentObjectTransformOverrideById,
          [objectId]: transformOverride,
        },
        activeContentObjectTransformSession:
          state.referenceWorkspace.activeContentObjectTransformSession?.objectId !== objectId
            ? state.referenceWorkspace.activeContentObjectTransformSession
            : {
                ...state.referenceWorkspace.activeContentObjectTransformSession,
                draftTransform:
                  cloneReferenceTransformOverride(transformOverride) ??
                  buildDefaultReferenceTransformOverride(),
              },
      },
    }))
  },
  setActiveContentObjectTransformHistoryScrubIndex: (scrubIndex: number) => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeContentObjectTransformSession
      if (activeSession === null) {
        return state
      }
      const currentEntries = normalizeReferenceTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByObjectId[activeSession.objectId] ?? [],
      )
      const nextScrubIndex = resolveReferenceTransformHistoryScrubIndex(currentEntries, scrubIndex)
      const nextDraftTransform = getReferenceTransformHistoryTransformAtScrubIndex(
        currentEntries,
        nextScrubIndex,
      )
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeContentObjectTransformSession: {
            ...activeSession,
            entryActive: false,
            activeHandle: null,
            historyScrubIndex: nextScrubIndex,
            draftTransform:
              cloneReferenceTransformOverride(nextDraftTransform) ??
              buildDefaultReferenceTransformOverride(),
            entryOrigin:
              activeSession.entryOrigin === null
                ? null
                : cloneReferenceTransformOverride(nextDraftTransform),
          },
        },
      }
    })
  },
  resetContentObjectTransform: (objectId: string) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        contentObjectTransformOverrideById: {
          ...state.referenceWorkspace.contentObjectTransformOverrideById,
          [objectId]: null,
        },
        transformHistoryByObjectId: {
          ...state.referenceWorkspace.transformHistoryByObjectId,
          [objectId]: [],
        },
        activeContentObjectTransformSession:
          state.referenceWorkspace.activeContentObjectTransformSession?.objectId !== objectId
            ? state.referenceWorkspace.activeContentObjectTransformSession
            : {
                ...state.referenceWorkspace.activeContentObjectTransformSession,
                historyScrubIndex: 0,
                draftTransform: buildDefaultReferenceTransformOverride(),
                entryOrigin: null,
                entryActive: false,
                activeHandle: null,
              },
      },
    }))
  },
  setContentObjectTransformHistoryEntryDeltaValue: (
    objectId: string,
    entryId: string,
    axis: 'x' | 'y' | 'z',
    value: number,
  ) => {
    set((state) => {
      const currentEntries = normalizeReferenceTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByObjectId[objectId] ?? [],
      )
      let changed = false
      const nextEntries = currentEntries.map((entry) => {
        if (entry.entryId !== entryId) {
          return entry
        }
        changed = true
        return {
          ...entry,
          delta: {
            ...entry.delta,
            [axis]: value,
          },
        }
      })
      if (!changed) {
        return state
      }
      const nextTransformOverride = applyReferenceTransformHistoryEntriesToOverride(nextEntries)
      const activeSession = state.referenceWorkspace.activeContentObjectTransformSession
      const nextScrubIndex =
        activeSession?.objectId !== objectId
          ? undefined
          : resolveReferenceTransformHistoryScrubIndex(nextEntries, activeSession.historyScrubIndex)
      const nextDraftTransform =
        nextScrubIndex === undefined
          ? nextTransformOverride
          : getReferenceTransformHistoryTransformAtScrubIndex(nextEntries, nextScrubIndex)
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          contentObjectTransformOverrideById: {
            ...state.referenceWorkspace.contentObjectTransformOverrideById,
            [objectId]: nextTransformOverride,
          },
          transformHistoryByObjectId: {
            ...state.referenceWorkspace.transformHistoryByObjectId,
            [objectId]: nextEntries,
          },
          activeContentObjectTransformSession:
            activeSession?.objectId !== objectId
              ? activeSession
              : {
                  ...activeSession,
                  historyScrubIndex: nextScrubIndex,
                  draftTransform:
                    cloneReferenceTransformOverride(nextDraftTransform) ??
                    buildDefaultReferenceTransformOverride(),
                  entryOrigin:
                    activeSession.entryOrigin === null
                      ? null
                      : cloneReferenceTransformOverride(nextDraftTransform),
                },
        },
      }
    })
  },
  deleteContentObjectTransformHistoryEntry: (objectId: string, entryId: string) => {
    set((state) => {
      const currentEntries = normalizeReferenceTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByObjectId[objectId] ?? [],
      )
      const nextEntries = currentEntries.filter((entry) => entry.entryId !== entryId)
      if (nextEntries.length === currentEntries.length) {
        return state
      }
      const nextTransformOverride = applyReferenceTransformHistoryEntriesToOverride(nextEntries)
      const activeSession = state.referenceWorkspace.activeContentObjectTransformSession
      const nextScrubIndex =
        activeSession?.objectId !== objectId
          ? undefined
          : resolveReferenceTransformHistoryScrubIndex(nextEntries, activeSession.historyScrubIndex)
      const nextDraftTransform =
        nextScrubIndex === undefined
          ? nextTransformOverride
          : getReferenceTransformHistoryTransformAtScrubIndex(nextEntries, nextScrubIndex)
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          contentObjectTransformOverrideById: {
            ...state.referenceWorkspace.contentObjectTransformOverrideById,
            [objectId]: nextTransformOverride,
          },
          transformHistoryByObjectId: {
            ...state.referenceWorkspace.transformHistoryByObjectId,
            [objectId]: nextEntries,
          },
          activeContentObjectTransformSession:
            activeSession?.objectId !== objectId
              ? activeSession
              : {
                  ...activeSession,
                  historyScrubIndex: nextScrubIndex,
                  draftTransform:
                    cloneReferenceTransformOverride(nextDraftTransform) ??
                    buildDefaultReferenceTransformOverride(),
                  entryOrigin:
                    activeSession.entryOrigin === null
                      ? null
                      : cloneReferenceTransformOverride(nextDraftTransform),
                },
        },
      }
    })
  },
  toggleContentObjectTransformHistoryLock: (objectId: string, entryId: string) => {
    set((state) => {
      const currentEntries = normalizeReferenceTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByObjectId[objectId] ?? [],
      )
      let changed = false
      const nextEntries = currentEntries.map((entry) => {
        if (entry.entryId !== entryId) {
          return entry
        }
        changed = true
        return {
          ...entry,
          locked: !entry.locked,
        }
      })
      if (!changed) {
        return state
      }
      const nextTransformOverride = applyReferenceTransformHistoryEntriesToOverride(nextEntries)
      const activeSession = state.referenceWorkspace.activeContentObjectTransformSession
      const nextScrubIndex =
        activeSession?.objectId !== objectId
          ? undefined
          : resolveReferenceTransformHistoryScrubIndex(nextEntries, activeSession.historyScrubIndex)
      const nextDraftTransform =
        nextScrubIndex === undefined
          ? nextTransformOverride
          : getReferenceTransformHistoryTransformAtScrubIndex(nextEntries, nextScrubIndex)
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          contentObjectTransformOverrideById: {
            ...state.referenceWorkspace.contentObjectTransformOverrideById,
            [objectId]: nextTransformOverride,
          },
          transformHistoryByObjectId: {
            ...state.referenceWorkspace.transformHistoryByObjectId,
            [objectId]: nextEntries,
          },
          activeContentObjectTransformSession:
            activeSession?.objectId !== objectId
              ? activeSession
              : {
                  ...activeSession,
                  historyScrubIndex: nextScrubIndex,
                  draftTransform:
                    cloneReferenceTransformOverride(nextDraftTransform) ??
                    buildDefaultReferenceTransformOverride(),
                },
        },
      }
    })
  },
  mergeContentObjectTransformHistory: (objectId: string) => {
    set((state) => {
      const currentEntries = normalizeReferenceTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByObjectId[objectId] ?? [],
      )
      const nextEntries = mergeReferenceTransformHistoryEntries(currentEntries)
      const changed =
        currentEntries.length !== nextEntries.length ||
        currentEntries.some((entry, index) => {
          const other = nextEntries[index]
          return (
            other === undefined ||
            entry.entryId !== other.entryId ||
            entry.sessionId !== other.sessionId ||
            entry.sessionOrdinal !== other.sessionOrdinal ||
            entry.locked !== other.locked ||
            !areReferenceTransformVectorsEqual(entry.delta, other.delta) ||
            !areReferenceTransformVectorsEqual(entry.after, other.after) ||
            !areReferenceTransformOverridesEqual(entry.transformAfter, other.transformAfter)
          )
        })
      if (!changed) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformHistoryByObjectId: {
            ...state.referenceWorkspace.transformHistoryByObjectId,
            [objectId]: nextEntries,
          },
        },
      }
    })
  },
  cancelActiveContentObjectTransformEntry: () => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeContentObjectTransformSession
      if (activeSession === null) {
        return state
      }
      const baseline =
        cloneReferenceTransformOverride(activeSession.entryOrigin) ??
        buildDefaultReferenceTransformOverride()
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeContentObjectTransformSession: {
            ...activeSession,
            entryActive: false,
            activeHandle: null,
            draftTransform: baseline,
            entryOrigin: null,
          },
        },
      }
    })
  },
  beginEnvironmentLightTransformShell: (lightId: string) => {
    set((state) => {
      const light = selectEnvironmentLightById(lightId)
      if (light === null || !environmentLightSupportsPosition(light)) {
        return {
          referenceWorkspace: {
            ...state.referenceWorkspace,
            activeEnvironmentLightTransformSession: null,
          },
        }
      }
      const existingSession = state.referenceWorkspace.activeEnvironmentLightTransformSession
      if (existingSession?.lightId === lightId && existingSession.shellActive) {
        return state
      }
      const baseTransform =
        cloneReferenceTransformOverride(
          state.referenceWorkspace.environmentLightTransformBaseById[lightId] ?? null,
        ) ?? buildEnvironmentLightTransformOverride(light)
      const currentEntries = normalizeEnvironmentLightTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByEnvironmentLightId[lightId] ?? [],
        baseTransform,
      )
      const latestScrubIndex = getReferenceTransformHistoryLatestScrubIndex(currentEntries)
      const draftTransform = getEnvironmentLightTransformHistoryTransformAtScrubIndex(
        currentEntries,
        latestScrubIndex,
        baseTransform,
      )
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          environmentLightTransformBaseById: {
            ...state.referenceWorkspace.environmentLightTransformBaseById,
            [lightId]: baseTransform,
          },
          transformHistoryByEnvironmentLightId: {
            ...state.referenceWorkspace.transformHistoryByEnvironmentLightId,
            [lightId]: currentEntries,
          },
          activeReferenceTransformSession: null,
          activeContentObjectTransformSession: null,
          activeEnvironmentLightTransformSession: {
            lightId,
            sessionId: newId('environment-light-transform-session'),
            sessionOrdinal: getNextReferenceTransformSessionOrdinal(currentEntries),
            mode: 'translate',
            space: 'world',
            shellActive: true,
            entryActive: false,
            activeHandle: null,
            historyScrubIndex: latestScrubIndex,
            draftTransform,
            entryOrigin: null,
          },
        },
      }
    })
  },
  exitEnvironmentLightTransformShell: () => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        activeEnvironmentLightTransformSession: null,
      },
    }))
  },
  beginEnvironmentLightTransformEntry: (
    mode: AppState['beginEnvironmentLightTransformEntry'] extends (mode: infer T) => void
      ? T
      : never,
  ) => {
    if (mode !== 'translate') {
      return
    }
    set((state) => {
      const activeSession = state.referenceWorkspace.activeEnvironmentLightTransformSession
      if (activeSession === null) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeEnvironmentLightTransformSession: {
            ...activeSession,
            mode: 'translate',
            entryActive: true,
            activeHandle: null,
            entryOrigin:
              cloneReferenceTransformOverride(activeSession.draftTransform) ??
              buildDefaultReferenceTransformOverride(),
            draftTransform:
              cloneReferenceTransformOverride(activeSession.draftTransform) ??
              buildDefaultReferenceTransformOverride(),
          },
        },
      }
    })
  },
  commitActiveEnvironmentLightTransformEntry: () => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeEnvironmentLightTransformSession
      if (activeSession === null) {
        return state
      }
      const activeLightId = activeSession.lightId
      const light = selectEnvironmentLightById(activeLightId)
      if (light === null || !environmentLightSupportsPosition(light)) {
        return state
      }
      const baseTransform =
        cloneReferenceTransformOverride(
          state.referenceWorkspace.environmentLightTransformBaseById[activeLightId] ?? null,
        ) ?? buildEnvironmentLightTransformOverride(light)
      const committedTransformOverride =
        cloneReferenceTransformOverride(activeSession.draftTransform) ?? baseTransform
      const currentEntries = normalizeEnvironmentLightTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByEnvironmentLightId[activeLightId] ?? [],
        baseTransform,
      )
      const currentScrubIndex = resolveReferenceTransformHistoryScrubIndex(
        currentEntries,
        activeSession.historyScrubIndex,
      )
      const nextEntries = insertEnvironmentLightTransformHistoryEntryAtScrubIndex(
        currentEntries,
        currentScrubIndex,
        activeSession.sessionId,
        activeSession.sessionOrdinal,
        committedTransformOverride.position,
        baseTransform,
      )
      const historyChanged =
        currentEntries.length !== nextEntries.length ||
        currentEntries.some((entry, index) => {
          const other = nextEntries[index]
          return (
            other === undefined ||
            entry.entryId !== other.entryId ||
            !areReferenceTransformVectorsEqual(entry.delta, other.delta) ||
            !areReferenceTransformVectorsEqual(entry.after, other.after) ||
            !areReferenceTransformOverridesEqual(entry.transformAfter, other.transformAfter) ||
            entry.locked !== other.locked
          )
        })
      const latestScrubIndex = getReferenceTransformHistoryLatestScrubIndex(nextEntries)
      const nextActiveScrubIndex = historyChanged
        ? Math.min(latestScrubIndex, currentScrubIndex + 1)
        : Math.min(latestScrubIndex, currentScrubIndex)
      const nextActiveDraftTransform = getEnvironmentLightTransformHistoryTransformAtScrubIndex(
        nextEntries,
        nextActiveScrubIndex,
        baseTransform,
      )
      updateEnvironmentLightPosition(activeLightId, nextActiveDraftTransform)
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          environmentLightTransformBaseById: {
            ...state.referenceWorkspace.environmentLightTransformBaseById,
            [activeLightId]: baseTransform,
          },
          transformHistoryByEnvironmentLightId: historyChanged
            ? {
                ...state.referenceWorkspace.transformHistoryByEnvironmentLightId,
                [activeLightId]: nextEntries,
              }
            : state.referenceWorkspace.transformHistoryByEnvironmentLightId,
          activeEnvironmentLightTransformSession: {
            ...activeSession,
            entryActive: false,
            activeHandle: null,
            historyScrubIndex: nextActiveScrubIndex,
            draftTransform: nextActiveDraftTransform,
            entryOrigin: null,
          },
        },
      }
    })
  },
  setActiveEnvironmentLightTransformMode: (
    mode: AppState['setActiveEnvironmentLightTransformMode'] extends (mode: infer T) => void
      ? T
      : never,
  ) => {
    if (mode !== 'translate') {
      return
    }
    set((state) => {
      const activeSession = state.referenceWorkspace.activeEnvironmentLightTransformSession
      if (activeSession === null) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeEnvironmentLightTransformSession: {
            ...activeSession,
            mode: 'translate',
          },
        },
      }
    })
  },
  setActiveEnvironmentLightTransformSpace: (
    space: AppState['setActiveEnvironmentLightTransformSpace'] extends (space: infer T) => void
      ? T
      : never,
  ) => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeEnvironmentLightTransformSession
      if (activeSession === null || activeSession.space === space) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeEnvironmentLightTransformSession: {
            ...activeSession,
            space,
          },
        },
      }
    })
  },
  setActiveEnvironmentLightTransformHandle: (
    handle: AppState['setActiveEnvironmentLightTransformHandle'] extends (handle: infer T) => void
      ? T
      : never,
  ) => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeEnvironmentLightTransformSession
      if (activeSession === null) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeEnvironmentLightTransformSession: {
            ...activeSession,
            activeHandle: handle === null || handle.mode !== 'translate' ? null : { ...handle },
          },
        },
      }
    })
  },
  setActiveEnvironmentLightTransformDraft: (
    transformOverride: ReferenceTransformOverride | null,
  ) => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeEnvironmentLightTransformSession
      if (activeSession === null) {
        return state
      }
      const nextTransformOverride =
        cloneReferenceTransformOverride(transformOverride) ?? buildDefaultReferenceTransformOverride()
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeEnvironmentLightTransformSession: {
            ...activeSession,
            draftTransform: {
              ...activeSession.draftTransform,
              position: { ...nextTransformOverride.position },
            },
          },
        },
      }
    })
  },
  setActiveEnvironmentLightTransformHistoryScrubIndex: (scrubIndex: number) => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeEnvironmentLightTransformSession
      if (activeSession === null || activeSession.entryActive) {
        return state
      }
      const baseTransform = resolveEnvironmentLightTransformBase(state, activeSession.lightId)
      const currentEntries = normalizeEnvironmentLightTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByEnvironmentLightId[activeSession.lightId] ?? [],
        baseTransform,
      )
      const nextScrubIndex = resolveReferenceTransformHistoryScrubIndex(currentEntries, scrubIndex)
      if (nextScrubIndex === activeSession.historyScrubIndex) {
        return state
      }
      const nextDraftTransform = getEnvironmentLightTransformHistoryTransformAtScrubIndex(
        currentEntries,
        nextScrubIndex,
        baseTransform,
      )
      updateEnvironmentLightPosition(activeSession.lightId, nextDraftTransform)
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeEnvironmentLightTransformSession: {
            ...activeSession,
            entryActive: false,
            activeHandle: null,
            historyScrubIndex: nextScrubIndex,
            draftTransform: nextDraftTransform,
            entryOrigin:
              activeSession.entryOrigin === null
                ? null
                : cloneReferenceTransformOverride(nextDraftTransform),
          },
        },
      }
    })
  },
  resetEnvironmentLightTransform: (lightId: string) => {
    set((state) => {
      const baseTransform = resolveEnvironmentLightTransformBase(state, lightId)
      updateEnvironmentLightPosition(lightId, baseTransform)
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformHistoryByEnvironmentLightId: {
            ...state.referenceWorkspace.transformHistoryByEnvironmentLightId,
            [lightId]: [],
          },
          activeEnvironmentLightTransformSession:
            state.referenceWorkspace.activeEnvironmentLightTransformSession?.lightId !== lightId
              ? state.referenceWorkspace.activeEnvironmentLightTransformSession
              : {
                  ...state.referenceWorkspace.activeEnvironmentLightTransformSession,
                  historyScrubIndex: 0,
                  draftTransform: baseTransform,
                  entryOrigin: null,
                  entryActive: false,
                  activeHandle: null,
                },
        },
      }
    })
  },
  setEnvironmentLightTransformHistoryEntryDeltaValue: (
    lightId: string,
    entryId: string,
    axis: 'x' | 'y' | 'z',
    value: number,
  ) => {
    set((state) => {
      const baseTransform = resolveEnvironmentLightTransformBase(state, lightId)
      const currentEntries = normalizeEnvironmentLightTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByEnvironmentLightId[lightId] ?? [],
        baseTransform,
      )
      let changed = false
      const nextEntries = normalizeEnvironmentLightTransformHistoryEntries(
        currentEntries.map((entry) => {
          if (entry.entryId !== entryId || entry.delta[axis] === value) {
            return entry
          }
          changed = true
          return {
            ...entry,
            delta: {
              ...entry.delta,
              [axis]: value,
            },
          }
        }),
        baseTransform,
      )
      if (!changed) {
        return state
      }
      const nextTransformOverride = applyEnvironmentLightTransformHistoryEntriesToOverride(
        nextEntries,
        baseTransform,
      )
      const activeSession = state.referenceWorkspace.activeEnvironmentLightTransformSession
      const nextScrubIndex =
        activeSession?.lightId !== lightId
          ? undefined
          : resolveReferenceTransformHistoryScrubIndex(nextEntries, activeSession.historyScrubIndex)
      const nextDraftTransform =
        nextScrubIndex === undefined
          ? nextTransformOverride
          : getEnvironmentLightTransformHistoryTransformAtScrubIndex(
              nextEntries,
              nextScrubIndex,
              baseTransform,
            )
      updateEnvironmentLightPosition(lightId, nextDraftTransform)
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformHistoryByEnvironmentLightId: {
            ...state.referenceWorkspace.transformHistoryByEnvironmentLightId,
            [lightId]: nextEntries,
          },
          activeEnvironmentLightTransformSession:
            activeSession?.lightId !== lightId
              ? activeSession
              : {
                  ...activeSession,
                  historyScrubIndex: nextScrubIndex,
                  draftTransform:
                    cloneReferenceTransformOverride(nextDraftTransform) ??
                    buildDefaultReferenceTransformOverride(),
                  entryOrigin:
                    activeSession.entryOrigin === null
                      ? null
                      : cloneReferenceTransformOverride(nextDraftTransform),
                },
        },
      }
    })
  },
  deleteEnvironmentLightTransformHistoryEntry: (lightId: string, entryId: string) => {
    set((state) => {
      const baseTransform = resolveEnvironmentLightTransformBase(state, lightId)
      const currentEntries = normalizeEnvironmentLightTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByEnvironmentLightId[lightId] ?? [],
        baseTransform,
      )
      const removedIndex = currentEntries.findIndex((entry) => entry.entryId === entryId)
      if (removedIndex < 0) {
        return state
      }
      const nextEntries = normalizeEnvironmentLightTransformHistoryEntries(
        [...currentEntries.slice(0, removedIndex), ...currentEntries.slice(removedIndex + 1)],
        baseTransform,
      )
      const activeSession = state.referenceWorkspace.activeEnvironmentLightTransformSession
      const currentScrubIndex =
        activeSession?.lightId !== lightId
          ? undefined
          : resolveReferenceTransformHistoryScrubIndex(
              currentEntries,
              activeSession.historyScrubIndex,
            )
      const nextScrubIndex =
        currentScrubIndex === undefined
          ? undefined
          : resolveReferenceTransformHistoryScrubIndex(
              nextEntries,
              currentScrubIndex - (removedIndex + 1 < currentScrubIndex ? 1 : 0),
            )
      const nextTransformOverride =
        nextScrubIndex === undefined
          ? applyEnvironmentLightTransformHistoryEntriesToOverride(nextEntries, baseTransform)
          : getEnvironmentLightTransformHistoryTransformAtScrubIndex(
              nextEntries,
              nextScrubIndex,
              baseTransform,
            )
      updateEnvironmentLightPosition(lightId, nextTransformOverride)
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformHistoryByEnvironmentLightId: {
            ...state.referenceWorkspace.transformHistoryByEnvironmentLightId,
            [lightId]: nextEntries,
          },
          activeEnvironmentLightTransformSession:
            activeSession?.lightId !== lightId
              ? activeSession
              : {
                  ...activeSession,
                  historyScrubIndex: nextScrubIndex,
                  draftTransform:
                    cloneReferenceTransformOverride(nextTransformOverride) ??
                    buildDefaultReferenceTransformOverride(),
                  entryOrigin:
                    activeSession.entryOrigin === null
                      ? null
                      : cloneReferenceTransformOverride(nextTransformOverride),
                },
        },
      }
    })
  },
  toggleEnvironmentLightTransformHistoryLock: (lightId: string, entryId: string) => {
    set((state) => {
      const baseTransform = resolveEnvironmentLightTransformBase(state, lightId)
      const currentEntries = normalizeEnvironmentLightTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByEnvironmentLightId[lightId] ?? [],
        baseTransform,
      )
      let changed = false
      const nextEntries = currentEntries.map((entry) => {
        if (entry.entryId !== entryId) {
          return entry
        }
        changed = true
        return {
          ...entry,
          locked: !entry.locked,
        }
      })
      if (!changed) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformHistoryByEnvironmentLightId: {
            ...state.referenceWorkspace.transformHistoryByEnvironmentLightId,
            [lightId]: nextEntries,
          },
        },
      }
    })
  },
  mergeEnvironmentLightTransformHistory: (lightId: string) => {
    set((state) => {
      const baseTransform = resolveEnvironmentLightTransformBase(state, lightId)
      const currentEntries = normalizeEnvironmentLightTransformHistoryEntries(
        state.referenceWorkspace.transformHistoryByEnvironmentLightId[lightId] ?? [],
        baseTransform,
      )
      const nextEntries = mergeEnvironmentLightTransformHistoryEntries(currentEntries, baseTransform)
      const changed =
        currentEntries.length !== nextEntries.length ||
        currentEntries.some((entry, index) => {
          const other = nextEntries[index]
          return (
            other === undefined ||
            entry.entryId !== other.entryId ||
            entry.sessionId !== other.sessionId ||
            entry.sessionOrdinal !== other.sessionOrdinal ||
            entry.locked !== other.locked ||
            !areReferenceTransformVectorsEqual(entry.delta, other.delta) ||
            !areReferenceTransformVectorsEqual(entry.after, other.after) ||
            !areReferenceTransformOverridesEqual(entry.transformAfter, other.transformAfter)
          )
        })
      if (!changed) {
        return state
      }
      const nextTransformOverride = applyEnvironmentLightTransformHistoryEntriesToOverride(
        nextEntries,
        baseTransform,
      )
      updateEnvironmentLightPosition(lightId, nextTransformOverride)
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformHistoryByEnvironmentLightId: {
            ...state.referenceWorkspace.transformHistoryByEnvironmentLightId,
            [lightId]: nextEntries,
          },
        },
      }
    })
  },
  cancelActiveEnvironmentLightTransformEntry: () => {
    set((state) => {
      const activeSession = state.referenceWorkspace.activeEnvironmentLightTransformSession
      if (activeSession === null) {
        return state
      }
      const baseline =
        cloneReferenceTransformOverride(activeSession.entryOrigin) ??
        buildDefaultReferenceTransformOverride()
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeEnvironmentLightTransformSession: {
            ...activeSession,
            entryActive: false,
            activeHandle: null,
            draftTransform: baseline,
            entryOrigin: null,
          },
        },
      }
    })
  },
  setReferenceChannelClampRange: (
    referenceId: string,
    channel: TimelineChannel,
    range: TimelineRange,
  ) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        channelClampRangeByReferenceId: {
          ...state.referenceWorkspace.channelClampRangeByReferenceId,
          [referenceId]: {
            ...(state.referenceWorkspace.channelClampRangeByReferenceId[referenceId] ?? {}),
            [channel]: range,
          },
        },
      },
    }))
  },
  setReferenceTimelineMode: (
    referenceId: string,
    channel: TimelineChannel,
    mode: TimelineMode,
    startedAtMs = performance.now(),
  ) => {
    set((state) => {
      const effectiveMode =
        channel === 'rotate-snap' &&
        mode === 'timeline' &&
        !getReferenceTransformSnapState(state.referenceWorkspace, referenceId).rotate.xyzLocked
          ? 'basic'
          : mode
      const nextTimelineModeByReferenceId = {
        ...state.referenceWorkspace.timelineModeByReferenceId,
        [referenceId]: {
          ...(state.referenceWorkspace.timelineModeByReferenceId[referenceId] ?? {}),
          [channel]: effectiveMode,
        },
      }
      const nextTimelineConfigByReferenceId = {
        ...state.referenceWorkspace.timelineConfigByReferenceId,
      }
      if (effectiveMode === 'timeline') {
        const existingConfig = nextTimelineConfigByReferenceId[referenceId]?.[channel]
        if (existingConfig === undefined) {
          const baseValue =
            channel === 'rotate-snap'
              ? getReferenceTransformSnapDriverValue(
                  getReferenceTransformSnapState(state.referenceWorkspace, referenceId).rotate,
                )
              : getReferenceTransformOverrideAxisValue(
                  state.referenceWorkspace.transformOverrideById[referenceId],
                  channel,
                )
          nextTimelineConfigByReferenceId[referenceId] = {
            ...(nextTimelineConfigByReferenceId[referenceId] ?? {}),
            [channel]: buildReferenceTimelineConfig(
              baseValue,
              getReferenceChannelClampRange(state, referenceId, channel),
              startedAtMs,
            ),
          }
        }
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          timelineModeByReferenceId: nextTimelineModeByReferenceId,
          timelineConfigByReferenceId: nextTimelineConfigByReferenceId,
        },
      }
    })
  },
  setReferenceTimelineSpeed: (referenceId: string, channel: TimelineChannel, speed: number) => {
    set((state) => {
      const existingConfig = state.referenceWorkspace.timelineConfigByReferenceId[referenceId]?.[channel]
      if (existingConfig === undefined) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          timelineConfigByReferenceId: {
            ...state.referenceWorkspace.timelineConfigByReferenceId,
            [referenceId]: {
              ...(state.referenceWorkspace.timelineConfigByReferenceId[referenceId] ?? {}),
              [channel]: {
                ...existingConfig,
                speed,
              },
            },
          },
        },
      }
    })
  },
  setReferenceTimelineCycle: (
    referenceId: string,
    channel: TimelineChannel,
    cycle: TimelineCycle,
  ) => {
    set((state) => {
      const existingConfig = state.referenceWorkspace.timelineConfigByReferenceId[referenceId]?.[channel]
      if (existingConfig === undefined) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          timelineConfigByReferenceId: {
            ...state.referenceWorkspace.timelineConfigByReferenceId,
            [referenceId]: {
              ...(state.referenceWorkspace.timelineConfigByReferenceId[referenceId] ?? {}),
              [channel]: {
                ...existingConfig,
                cycle,
              },
            },
          },
        },
      }
    })
  },
  setReferenceTimelinePoints: (
    referenceId: string,
    channel: TimelineChannel,
    points: TimelinePoints,
  ) => {
    set((state) => {
      const existingConfig = state.referenceWorkspace.timelineConfigByReferenceId[referenceId]?.[channel]
      if (existingConfig === undefined) {
        return state
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          timelineConfigByReferenceId: {
            ...state.referenceWorkspace.timelineConfigByReferenceId,
            [referenceId]: {
              ...(state.referenceWorkspace.timelineConfigByReferenceId[referenceId] ?? {}),
              [channel]: {
                ...existingConfig,
                points,
              },
            },
          },
        },
      }
    })
  },
  setReferenceTransformSnapEnabled: (
    referenceId: string,
    mode: TransformSnapMode,
    enabled: boolean,
  ) => {
    set((state) => {
      const currentSnapState = cloneReferenceTransformSnapState(
        getReferenceTransformSnapState(state.referenceWorkspace, referenceId),
      )
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformSnapByReferenceId: {
            ...state.referenceWorkspace.transformSnapByReferenceId,
            [referenceId]: {
              ...currentSnapState,
              [mode]: {
                ...currentSnapState[mode as keyof typeof currentSnapState],
                enabled,
              },
            },
          },
        },
      }
    })
  },
  setReferenceTransformSnapValue: (
    referenceId: string,
    mode: TransformSnapMode,
    value: number,
  ) => {
    set((state) => {
      const currentSnapState = cloneReferenceTransformSnapState(
        getReferenceTransformSnapState(state.referenceWorkspace, referenceId),
      )
      const nextTimelineConfigByReferenceId = {
        ...state.referenceWorkspace.timelineConfigByReferenceId,
      }
      if (mode === 'rotate') {
        const previousValue = getReferenceTransformSnapDriverValue(currentSnapState.rotate)
        if (getReferenceTimelineMode(state.referenceWorkspace, referenceId, 'rotate-snap') === 'timeline') {
          const existingConfig = nextTimelineConfigByReferenceId[referenceId]?.['rotate-snap']
          if (existingConfig !== undefined) {
            nextTimelineConfigByReferenceId[referenceId] = {
              ...(nextTimelineConfigByReferenceId[referenceId] ?? {}),
              'rotate-snap': shiftReferenceTimelineConfig(
                existingConfig,
                value - previousValue,
                getReferenceChannelClampRange(state, referenceId, 'rotate-snap'),
              ),
            }
          }
        }
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformSnapByReferenceId: {
            ...state.referenceWorkspace.transformSnapByReferenceId,
            [referenceId]: {
              ...currentSnapState,
              [mode]: {
                ...currentSnapState[mode as keyof typeof currentSnapState],
                enabled: true,
                values: setAllReferenceTransformSnapAxes(value),
              },
            },
          },
          timelineConfigByReferenceId: nextTimelineConfigByReferenceId,
        },
      }
    })
  },
  setReferenceTransformSnapAxisValue: (
    referenceId: string,
    mode: TransformSnapMode,
    axis: TransformSnapAxis,
    value: number,
  ) => {
    set((state) => {
      const currentSnapState = cloneReferenceTransformSnapState(
        getReferenceTransformSnapState(state.referenceWorkspace, referenceId),
      )
      const currentModeState = currentSnapState[mode as keyof typeof currentSnapState]
      const previousRotateDriverValue = getReferenceTransformSnapDriverValue(currentSnapState.rotate)
      const nextModeState = {
        ...currentModeState,
        enabled: true,
        values: currentModeState.xyzLocked
          ? scaleReferenceTransformSnapAxisValues(currentModeState.values, axis, value)
          : {
              ...currentModeState.values,
              [axis]: value,
            },
      }
      const nextSnapState = {
        ...currentSnapState,
        [mode]: nextModeState,
      }
      const nextTimelineModeByReferenceId = {
        ...state.referenceWorkspace.timelineModeByReferenceId,
      }
      const nextTimelineConfigByReferenceId = {
        ...state.referenceWorkspace.timelineConfigByReferenceId,
      }
      if (mode === 'rotate') {
        if (!nextModeState.xyzLocked) {
          nextTimelineModeByReferenceId[referenceId] = {
            ...(nextTimelineModeByReferenceId[referenceId] ?? {}),
            'rotate-snap': 'basic',
          }
        } else if (
          getReferenceTimelineMode(state.referenceWorkspace, referenceId, 'rotate-snap') === 'timeline'
        ) {
          const nextRotateDriverValue = getReferenceTransformSnapDriverValue(nextModeState)
          const existingConfig = nextTimelineConfigByReferenceId[referenceId]?.['rotate-snap']
          if (existingConfig !== undefined) {
            nextTimelineConfigByReferenceId[referenceId] = {
              ...(nextTimelineConfigByReferenceId[referenceId] ?? {}),
              'rotate-snap': shiftReferenceTimelineConfig(
                existingConfig,
                nextRotateDriverValue - previousRotateDriverValue,
                getReferenceChannelClampRange(state, referenceId, 'rotate-snap'),
              ),
            }
          }
        }
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformSnapByReferenceId: {
            ...state.referenceWorkspace.transformSnapByReferenceId,
            [referenceId]: nextSnapState,
          },
          timelineModeByReferenceId: nextTimelineModeByReferenceId,
          timelineConfigByReferenceId: nextTimelineConfigByReferenceId,
        },
      }
    })
  },
  setReferenceTransformSnapLocked: (
    referenceId: string,
    mode: TransformSnapMode,
    locked: boolean,
  ) => {
    set((state) => {
      const currentSnapState = cloneReferenceTransformSnapState(
        getReferenceTransformSnapState(state.referenceWorkspace, referenceId),
      )
      const nextSnapState = {
        ...currentSnapState,
        [mode]: {
          ...currentSnapState[mode as keyof typeof currentSnapState],
          xyzLocked: locked,
        },
      }
      const nextTimelineModeByReferenceId = {
        ...state.referenceWorkspace.timelineModeByReferenceId,
      }
      if (mode === 'rotate' && !locked) {
        nextTimelineModeByReferenceId[referenceId] = {
          ...(nextTimelineModeByReferenceId[referenceId] ?? {}),
          'rotate-snap': 'basic',
        }
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformSnapByReferenceId: {
            ...state.referenceWorkspace.transformSnapByReferenceId,
            [referenceId]: nextSnapState,
          },
          timelineModeByReferenceId: nextTimelineModeByReferenceId,
        },
      }
    })
  },
  setContentObjectTransformSnapEnabled: (
    objectId: string,
    mode: TransformSnapMode,
    enabled: boolean,
  ) => {
    set((state) => {
      const currentSnapState = cloneReferenceTransformSnapState(
        getContentObjectTransformSnapState(state.referenceWorkspace, objectId),
      )
      currentSnapState[mode].enabled = enabled
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformSnapByObjectId: {
            ...state.referenceWorkspace.transformSnapByObjectId,
            [objectId]: currentSnapState,
          },
        },
      }
    })
  },
  setContentObjectTransformSnapValue: (
    objectId: string,
    mode: TransformSnapMode,
    value: number,
  ) => {
    set((state) => {
      const currentSnapState = cloneReferenceTransformSnapState(
        getContentObjectTransformSnapState(state.referenceWorkspace, objectId),
      )
      currentSnapState[mode].values =
        currentSnapState[mode].xyzLocked === true
          ? setAllReferenceTransformSnapAxes(value)
          : {
              ...currentSnapState[mode].values,
              x: value,
            }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformSnapByObjectId: {
            ...state.referenceWorkspace.transformSnapByObjectId,
            [objectId]: currentSnapState,
          },
        },
      }
    })
  },
  setContentObjectTransformSnapAxisValue: (
    objectId: string,
    mode: TransformSnapMode,
    axis: TransformSnapAxis,
    value: number,
  ) => {
    set((state) => {
      const currentSnapState = cloneReferenceTransformSnapState(
        getContentObjectTransformSnapState(state.referenceWorkspace, objectId),
      )
      currentSnapState[mode].values[axis] = value
      if (currentSnapState[mode].xyzLocked) {
        currentSnapState[mode].values = setAllReferenceTransformSnapAxes(value)
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformSnapByObjectId: {
            ...state.referenceWorkspace.transformSnapByObjectId,
            [objectId]: currentSnapState,
          },
        },
      }
    })
  },
  setContentObjectTransformSnapLocked: (
    objectId: string,
    mode: TransformSnapMode,
    locked: boolean,
  ) => {
    set((state) => {
      const currentSnapState = cloneReferenceTransformSnapState(
        getContentObjectTransformSnapState(state.referenceWorkspace, objectId),
      )
      currentSnapState[mode].xyzLocked = locked
      if (locked) {
        currentSnapState[mode].values = setAllReferenceTransformSnapAxes(
          getReferenceTransformSnapDriverValue(currentSnapState[mode]),
        )
      }
      return {
        referenceWorkspace: {
          ...state.referenceWorkspace,
          transformSnapByObjectId: {
            ...state.referenceWorkspace.transformSnapByObjectId,
            [objectId]: currentSnapState,
          },
        },
      }
    })
  },
  setReferenceTransformMoveSnapDotScale: (value: number) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        moveSnapDotScale: Math.min(4, Math.max(0.1, Number.isFinite(value) ? value : 1)),
      },
    }))
  },
  setReferenceTransformMoveSnapDotsEnabled: (enabled: boolean) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        moveSnapDotsEnabled: enabled,
      },
    }))
  },
  setReferenceTransformPreviewLastMoveSnapDotsEnabled: (enabled: boolean) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        previewLastMoveSnapDotsEnabled: enabled,
      },
    }))
  },
  setReferenceTransformMoveSnapDotDelayMs: (value: number) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        moveSnapDotDelayMs: Math.min(500, Math.max(0, Number.isFinite(value) ? value : 120)),
      },
    }))
  },
  setReferenceTransformMoveSnapDotNearScale: (value: number) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        moveSnapDotNearScale: Math.min(3, Math.max(0.1, Number.isFinite(value) ? value : 1.45)),
      },
    }))
  },
  setReferenceTransformMoveSnapDotFarScale: (value: number) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        moveSnapDotFarScale: Math.min(1.5, Math.max(0, Number.isFinite(value) ? value : 0.04)),
      },
    }))
  },
  setReferenceTransformMoveSnapDotVisibleRadiusMultiplier: (value: number) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        moveSnapDotVisibleRadiusMultiplier: Math.min(
          200,
          Math.max(1, Number.isFinite(value) ? value : 40),
        ),
      },
    }))
  },
  setReferenceTransformRotateSnapPreviewEnabled: (enabled: boolean) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        rotateSnapPreviewEnabled: enabled,
      },
    }))
  },
  setReferenceTransformRotateSnapPreviewLineSize: (value: number) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        rotateSnapPreviewLineSize: Math.min(3, Math.max(0.25, Number.isFinite(value) ? value : 1)),
      },
    }))
  },
  setReferenceTransformRotateSnapPreviewLineThickness: (value: number) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        rotateSnapPreviewLineThickness: Math.min(
          3,
          Math.max(0.25, Number.isFinite(value) ? value : 1),
        ),
      },
    }))
  },
  setReferenceTransformRotateSnapPreviewRadiusDeg: (value: number) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        rotateSnapPreviewRadiusDeg: Math.min(
          180,
          Math.max(10, Number.isFinite(value) ? value : 60),
        ),
      },
    }))
  },
  setReferenceTransformRotateSnapPreviewDelayMs: (value: number) => {
    set((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        rotateSnapPreviewDelayMs: Math.min(500, Math.max(0, Number.isFinite(value) ? value : 120)),
      },
    }))
  },
  requestReferenceTransformShellExit: (
    source: AppState['requestReferenceTransformShellExit'] extends (source: infer T) => void
      ? T
      : never,
  ) => {
    set((state) => ({
      referenceTransformShellExitRequest: {
        source,
        seq: (state.referenceTransformShellExitRequest?.seq ?? 0) + 1,
      },
    }))
  },
})
