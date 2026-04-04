import { create } from 'zustand'
import {
  normalizeDashboardStickyNoteLayouts,
  serializePersistedDashboardState,
} from './dashboardPersistence'
import type {
  DashboardLaneId,
  DashboardLaneRecord,
  DashboardStickyNoteLayout,
  PersistedDashboardState,
} from './dashboardTypes'
import {
  defaultDashboardLaneId,
  defaultDashboardLanes,
  minimumDashboardStickyNoteHeight,
  minimumDashboardStickyNoteWidth,
} from './dashboardTypes'

type DashboardStoreState = {
  lanes: DashboardLaneRecord[]
  stickyNoteLayoutsByNoteId: Record<string, DashboardStickyNoteLayout>
  hydratePersistedDashboardState: (state: PersistedDashboardState) => void
  reconcileStickyNoteLayouts: (noteIds: string[]) => void
  createLane: (title?: string) => DashboardLaneId
  renameLane: (laneId: DashboardLaneId, title: string) => void
  removeLane: (laneId: DashboardLaneId, destinationLaneId: DashboardLaneId) => void
  setAdjacentLaneWidths: (
    leftLaneId: DashboardLaneId,
    rightLaneId: DashboardLaneId,
    leftWidth: number,
    rightWidth: number,
  ) => void
  setStickyNotePosition: (noteId: string, x: number, y: number) => void
  setStickyNoteLane: (noteId: string, laneId: DashboardLaneId) => void
  setStickyNotePlacement: (noteId: string, laneId: DashboardLaneId, x: number, y: number) => void
  setStickyNotePlacements: (
    layouts: Array<{ noteId: string; laneId: DashboardLaneId; x: number; y: number }>,
  ) => void
  setStickyNoteFrame: (
    noteId: string,
    frame: { x: number; y: number; width: number; height: number },
  ) => void
  setStickyNoteAttachmentParent: (noteId: string, parentNoteId: string | null) => void
  removeStickyNoteLayout: (noteId: string) => void
}

const stickyNoteColumnGap = 24
const stickyNoteRowGap = 24
const stickyNoteDefaultX = 24
const stickyNoteDefaultY = 24
const stickyNoteColumns = 3
const stickyNoteCardWidth = 248
const stickyNoteCardHeight = 196
const minimumLaneWidthWeight = 0.15

const createInitialState = (): Pick<
  DashboardStoreState,
  'lanes' | 'stickyNoteLayoutsByNoteId'
> => ({
  lanes: defaultDashboardLanes.map((lane) => ({ ...lane })),
  stickyNoteLayoutsByNoteId: {},
})

const cloneStickyNoteLayout = (layout: DashboardStickyNoteLayout): DashboardStickyNoteLayout => ({
  noteId: layout.noteId,
  laneId: layout.laneId,
  x: layout.x,
  y: layout.y,
  ...(typeof layout.parentNoteId === 'string' && layout.parentNoteId.trim().length > 0
    ? { parentNoteId: layout.parentNoteId.trim() }
    : {}),
  ...(typeof layout.width === 'number' && Number.isFinite(layout.width)
    ? { width: Math.round(layout.width) }
    : {}),
  ...(typeof layout.height === 'number' && Number.isFinite(layout.height)
    ? { height: Math.round(layout.height) }
    : {}),
})

const normalizeStickyNoteSize = (width: number, height: number) => ({
  width: Math.max(minimumDashboardStickyNoteWidth, Math.round(width)),
  height: Math.max(minimumDashboardStickyNoteHeight, Math.round(height)),
})

const normalizeLaneTitle = (title: string | undefined, fallback: string): string => {
  const nextTitle = typeof title === 'string' ? title.trim() : ''
  return nextTitle.length > 0 ? nextTitle : fallback
}

const normalizeLaneWidth = (width: number): number =>
  Number.isFinite(width) && width > minimumLaneWidthWeight ? width : 1

const sortAndNormalizeLanes = (lanes: DashboardLaneRecord[]): DashboardLaneRecord[] =>
  lanes
    .slice()
    .sort((left, right) => left.order - right.order)
    .map((lane, index) => ({
      ...lane,
      order: index,
      width: normalizeLaneWidth(lane.width),
    }))

const resolveFallbackLaneId = (lanes: DashboardLaneRecord[]): DashboardLaneId =>
  lanes[0]?.id ?? defaultDashboardLaneId

const resolveValidLaneId = (
  lanes: DashboardLaneRecord[],
  laneId: DashboardLaneId,
): DashboardLaneId => {
  const normalizedLaneId = typeof laneId === 'string' ? laneId.trim() : ''
  if (normalizedLaneId.length > 0 && lanes.some((lane) => lane.id === normalizedLaneId)) {
    return normalizedLaneId
  }
  return resolveFallbackLaneId(lanes)
}

const createNextLaneId = (lanes: DashboardLaneRecord[]): DashboardLaneId => {
  const nextIndex =
    lanes.reduce((highestIndex, lane) => {
      const match = /^lane-(\d+)$/.exec(lane.id)
      if (match === null) {
        return highestIndex
      }
      return Math.max(highestIndex, Number.parseInt(match[1] ?? '0', 10))
    }, 0) + 1
  return `lane-${nextIndex}`
}

const createDefaultStickyNoteLayout = (
  noteId: string,
  index: number,
  laneId: DashboardLaneId,
): DashboardStickyNoteLayout => {
  const column = index % stickyNoteColumns
  const row = Math.floor(index / stickyNoteColumns)
  return {
    noteId,
    laneId,
    x: stickyNoteDefaultX + column * (stickyNoteCardWidth + stickyNoteColumnGap),
    y: stickyNoteDefaultY + row * (stickyNoteCardHeight + stickyNoteRowGap),
  }
}

const countLaneLayouts = (
  layoutsByNoteId: Record<string, DashboardStickyNoteLayout>,
  laneId: DashboardLaneId,
): number => Object.values(layoutsByNoteId).filter((layout) => layout.laneId === laneId).length

export const serializeDashboardState = (
  state: Pick<DashboardStoreState, 'lanes' | 'stickyNoteLayoutsByNoteId'>,
): PersistedDashboardState =>
  serializePersistedDashboardState({
    lanes: state.lanes,
    stickyNoteLayoutsByNoteId: state.stickyNoteLayoutsByNoteId,
  })

export const useDashboardStore = create<DashboardStoreState>((set) => ({
  ...createInitialState(),
  hydratePersistedDashboardState: (state) => {
    const lanes = sortAndNormalizeLanes(state.lanes)
    const fallbackLaneId = resolveFallbackLaneId(lanes)
    set({
      lanes,
      stickyNoteLayoutsByNoteId: normalizeDashboardStickyNoteLayouts(
        Object.fromEntries(
          Object.entries(state.stickyNoteLayoutsByNoteId).map(([noteId, layout]) => [
            noteId,
            {
              ...cloneStickyNoteLayout(layout),
              laneId: resolveValidLaneId(lanes, layout.laneId ?? fallbackLaneId),
            },
          ]),
        ),
      ),
    })
  },
  reconcileStickyNoteLayouts: (noteIds) => {
    const nextNoteIds = Array.from(
      new Set(noteIds.filter((noteId) => typeof noteId === 'string' && noteId.trim().length > 0)),
    )
    set((state) => {
      const lanes = sortAndNormalizeLanes(state.lanes)
      const fallbackLaneId = resolveFallbackLaneId(lanes)
      const nextLayoutsByNoteId: Record<string, DashboardStickyNoteLayout> = {}
      let didChange = Object.keys(state.stickyNoteLayoutsByNoteId).length !== nextNoteIds.length
      let nextFallbackLayoutCount = 0
      nextNoteIds.forEach((noteId) => {
        const currentLayout = state.stickyNoteLayoutsByNoteId[noteId] ?? null
        if (currentLayout !== null) {
          const nextLaneId = resolveValidLaneId(lanes, currentLayout.laneId)
          nextLayoutsByNoteId[noteId] =
            currentLayout.laneId === nextLaneId
              ? currentLayout
              : {
                  ...currentLayout,
                  laneId: nextLaneId,
                }
          if (nextLaneId === fallbackLaneId) {
            nextFallbackLayoutCount += 1
          }
          if (nextLaneId !== currentLayout.laneId) {
            didChange = true
          }
          return
        }
        nextLayoutsByNoteId[noteId] = createDefaultStickyNoteLayout(
          noteId,
          nextFallbackLayoutCount,
          fallbackLaneId,
        )
        nextFallbackLayoutCount += 1
        didChange = true
      })
      if (!didChange) {
        return state
      }
      return {
        lanes,
        stickyNoteLayoutsByNoteId: normalizeDashboardStickyNoteLayouts(nextLayoutsByNoteId),
      }
    })
  },
  createLane: (title = 'New lane') => {
    let nextLaneId = defaultDashboardLaneId
    set((state) => {
      const nextId = createNextLaneId(state.lanes)
      nextLaneId = nextId
      return {
        lanes: sortAndNormalizeLanes([
          ...state.lanes,
          {
            id: nextId,
            title: normalizeLaneTitle(title, 'New lane'),
            order: state.lanes.length,
            width: 1,
          },
        ]),
      }
    })
    return nextLaneId
  },
  renameLane: (laneId, title) => {
    set((state) => {
      const nextTitle = normalizeLaneTitle(title, 'Untitled lane')
      const currentLane = state.lanes.find((lane) => lane.id === laneId) ?? null
      if (currentLane === null || currentLane.title === nextTitle) {
        return state
      }
      return {
        lanes: state.lanes.map((lane) =>
          lane.id === laneId
            ? {
                ...lane,
                title: nextTitle,
              }
            : lane,
        ),
      }
    })
  },
  removeLane: (laneId, destinationLaneId) => {
    set((state) => {
      if (state.lanes.length <= 1) {
        return state
      }
      const laneExists = state.lanes.some((lane) => lane.id === laneId)
      const destinationExists = state.lanes.some((lane) => lane.id === destinationLaneId)
      if (!laneExists || !destinationExists || laneId === destinationLaneId) {
        return state
      }
      const nextLanes = sortAndNormalizeLanes(
        state.lanes.filter((lane) => lane.id !== laneId),
      )
      return {
        lanes: nextLanes,
        stickyNoteLayoutsByNoteId: normalizeDashboardStickyNoteLayouts(
          Object.fromEntries(
            Object.entries(state.stickyNoteLayoutsByNoteId).map(([noteId, layout]) => [
              noteId,
              layout.laneId === laneId
                ? {
                    ...layout,
                    laneId: destinationLaneId,
                  }
                : layout,
            ]),
          ),
        ),
      }
    })
  },
  setAdjacentLaneWidths: (leftLaneId, rightLaneId, leftWidth, rightWidth) => {
    set((state) => {
      const leftLaneIndex = state.lanes.findIndex((lane) => lane.id === leftLaneId)
      const rightLaneIndex = state.lanes.findIndex((lane) => lane.id === rightLaneId)
      if (
        leftLaneIndex < 0 ||
        rightLaneIndex < 0 ||
        Math.abs(leftLaneIndex - rightLaneIndex) !== 1
      ) {
        return state
      }
      const normalizedLeftWidth = normalizeLaneWidth(leftWidth)
      const normalizedRightWidth = normalizeLaneWidth(rightWidth)
      const currentLeftLane = state.lanes[leftLaneIndex]
      const currentRightLane = state.lanes[rightLaneIndex]
      if (
        currentLeftLane?.width === normalizedLeftWidth &&
        currentRightLane?.width === normalizedRightWidth
      ) {
        return state
      }
      return {
        lanes: state.lanes.map((lane, index) => {
          if (index === leftLaneIndex) {
            return {
              ...lane,
              width: normalizedLeftWidth,
            }
          }
          if (index === rightLaneIndex) {
            return {
              ...lane,
              width: normalizedRightWidth,
            }
          }
          return lane
        }),
      }
    })
  },
  setStickyNotePosition: (noteId, x, y) => {
    set((state) => {
      const currentLayout = state.stickyNoteLayoutsByNoteId[noteId] ?? null
      const fallbackLaneId = resolveFallbackLaneId(state.lanes)
      const nextLayout = {
        noteId,
        laneId: currentLayout?.laneId ?? fallbackLaneId,
        x: Math.round(x),
        y: Math.round(y),
      }
      if (
        currentLayout !== null &&
        currentLayout.laneId === nextLayout.laneId &&
        currentLayout.x === nextLayout.x &&
        currentLayout.y === nextLayout.y
      ) {
        return state
      }
      return {
        stickyNoteLayoutsByNoteId: normalizeDashboardStickyNoteLayouts({
          ...state.stickyNoteLayoutsByNoteId,
          [noteId]:
            currentLayout === null
              ? nextLayout
              : {
                  ...currentLayout,
                  x: nextLayout.x,
                  y: nextLayout.y,
                },
        }),
      }
    })
  },
  setStickyNoteLane: (noteId, laneId) => {
    set((state) => {
      const currentLayout = state.stickyNoteLayoutsByNoteId[noteId] ?? null
      const normalizedLaneId = resolveValidLaneId(state.lanes, laneId)
      if (currentLayout !== null && currentLayout.laneId === normalizedLaneId) {
        return state
      }
      return {
        stickyNoteLayoutsByNoteId: normalizeDashboardStickyNoteLayouts({
          ...state.stickyNoteLayoutsByNoteId,
          [noteId]:
            currentLayout === null
              ? createDefaultStickyNoteLayout(
                  noteId,
                  countLaneLayouts(state.stickyNoteLayoutsByNoteId, normalizedLaneId),
                  normalizedLaneId,
                )
              : {
                  ...currentLayout,
                  laneId: normalizedLaneId,
                },
        }),
      }
    })
  },
  setStickyNotePlacement: (noteId, laneId, x, y) => {
    set((state) => {
      const currentLayout = state.stickyNoteLayoutsByNoteId[noteId] ?? null
      const nextLayout = {
        noteId,
        laneId: resolveValidLaneId(state.lanes, laneId),
        x: Math.round(x),
        y: Math.round(y),
      }
      if (
        currentLayout !== null &&
        currentLayout.laneId === nextLayout.laneId &&
        currentLayout.x === nextLayout.x &&
        currentLayout.y === nextLayout.y
      ) {
        return state
      }
      return {
        stickyNoteLayoutsByNoteId: normalizeDashboardStickyNoteLayouts({
          ...state.stickyNoteLayoutsByNoteId,
          [noteId]:
            currentLayout === null
              ? nextLayout
              : {
                  ...currentLayout,
                  laneId: nextLayout.laneId,
                  x: nextLayout.x,
                  y: nextLayout.y,
                },
        }),
      }
    })
  },
  setStickyNotePlacements: (layouts) => {
    set((state) => {
      if (layouts.length === 0) {
        return state
      }

      let didChange = false
      const nextLayoutsByNoteId = { ...state.stickyNoteLayoutsByNoteId }

      layouts.forEach((layout) => {
        const currentLayout = nextLayoutsByNoteId[layout.noteId] ?? null
        const normalizedLaneId = resolveValidLaneId(state.lanes, layout.laneId)
        const nextX = Math.round(layout.x)
        const nextY = Math.round(layout.y)

        if (
          currentLayout !== null &&
          currentLayout.laneId === normalizedLaneId &&
          currentLayout.x === nextX &&
          currentLayout.y === nextY
        ) {
          return
        }

        nextLayoutsByNoteId[layout.noteId] =
          currentLayout === null
            ? {
                noteId: layout.noteId,
                laneId: normalizedLaneId,
                x: nextX,
                y: nextY,
              }
            : {
                ...currentLayout,
                laneId: normalizedLaneId,
                x: nextX,
                y: nextY,
              }
        didChange = true
      })

      if (!didChange) {
        return state
      }

      return {
        stickyNoteLayoutsByNoteId: normalizeDashboardStickyNoteLayouts(nextLayoutsByNoteId),
      }
    })
  },
  setStickyNoteFrame: (noteId, frame) => {
    set((state) => {
      const currentLayout = state.stickyNoteLayoutsByNoteId[noteId] ?? null
      const fallbackLaneId = resolveFallbackLaneId(state.lanes)
      const nextSize = normalizeStickyNoteSize(frame.width, frame.height)
      const nextLayout: DashboardStickyNoteLayout = {
        noteId,
        laneId: currentLayout?.laneId ?? fallbackLaneId,
        x: Math.round(frame.x),
        y: Math.round(frame.y),
        width: nextSize.width,
        height: nextSize.height,
      }
      if (
        currentLayout !== null &&
        currentLayout.laneId === nextLayout.laneId &&
        currentLayout.x === nextLayout.x &&
        currentLayout.y === nextLayout.y &&
        (currentLayout.width ?? null) === nextLayout.width &&
        (currentLayout.height ?? null) === nextLayout.height
      ) {
        return state
      }
      return {
        stickyNoteLayoutsByNoteId: normalizeDashboardStickyNoteLayouts({
          ...state.stickyNoteLayoutsByNoteId,
          [noteId]:
            currentLayout === null
              ? nextLayout
              : {
                  ...currentLayout,
                  x: nextLayout.x,
                  y: nextLayout.y,
                  width: nextLayout.width,
                  height: nextLayout.height,
                },
        }),
      }
    })
  },
  setStickyNoteAttachmentParent: (noteId, parentNoteId) => {
    set((state) => {
      const currentLayout = state.stickyNoteLayoutsByNoteId[noteId] ?? null
      if (currentLayout === null) {
        return state
      }

      const normalizedParentNoteId =
        typeof parentNoteId === 'string' && parentNoteId.trim().length > 0
          ? parentNoteId.trim()
          : null
      const nextLayoutsByNoteId = {
        ...state.stickyNoteLayoutsByNoteId,
        [noteId]:
          normalizedParentNoteId === null
            ? (() => {
                const { parentNoteId: _ignoredParentNoteId, ...layoutWithoutParent } = currentLayout
                return layoutWithoutParent
              })()
            : {
                ...currentLayout,
                parentNoteId: normalizedParentNoteId,
              },
      }
      const normalizedLayoutsByNoteId = normalizeDashboardStickyNoteLayouts(nextLayoutsByNoteId)
      if ((currentLayout.parentNoteId ?? null) === (normalizedLayoutsByNoteId[noteId]?.parentNoteId ?? null)) {
        return state
      }
      return {
        stickyNoteLayoutsByNoteId: normalizedLayoutsByNoteId,
      }
    })
  },
  removeStickyNoteLayout: (noteId) => {
    set((state) => {
      if (state.stickyNoteLayoutsByNoteId[noteId] === undefined) {
        return state
      }
      const nextLayoutsByNoteId = { ...state.stickyNoteLayoutsByNoteId }
      delete nextLayoutsByNoteId[noteId]
      return {
        stickyNoteLayoutsByNoteId: normalizeDashboardStickyNoteLayouts(nextLayoutsByNoteId),
      }
    })
  },
}))
