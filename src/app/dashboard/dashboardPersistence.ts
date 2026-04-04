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

export const dashboardStorageKey = 'parahook.dashboard.widgets.v4'
const legacyDashboardStorageKeyV3 = 'parahook.dashboard.widgets.v3'
const legacyDashboardStorageKeyV2 = 'parahook.dashboard.widgets.v2'
const legacyDashboardStorageKeyV1 = 'parahook.dashboard.widgets.v1'

type DashboardPersistenceSource = {
  lanes: DashboardLaneRecord[]
  stickyNoteLayoutsByNoteId: Record<string, DashboardStickyNoteLayout>
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const minimumLaneWidthWeight = 0.15

const normalizeLaneTitle = (value: unknown, fallback: string): string => {
  const title = typeof value === 'string' ? value.trim() : ''
  return title.length > 0 ? title : fallback
}

const cloneLaneRecord = (lane: DashboardLaneRecord): DashboardLaneRecord => ({
  id: lane.id,
  title: lane.title,
  order: lane.order,
  width: lane.width,
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

const sanitizeParentNoteId = (value: unknown): string | undefined => {
  const parentNoteId = typeof value === 'string' ? value.trim() : ''
  return parentNoteId.length > 0 ? parentNoteId : undefined
}

const sanitizeStickyNoteWidth = (value: unknown): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) && value >= minimumDashboardStickyNoteWidth
    ? Math.round(value)
    : undefined

const sanitizeStickyNoteHeight = (value: unknown): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) && value >= minimumDashboardStickyNoteHeight
    ? Math.round(value)
    : undefined

const withNormalizedParentNoteId = (
  layout: DashboardStickyNoteLayout,
  parentNoteId: string | undefined,
): DashboardStickyNoteLayout => {
  if (parentNoteId === undefined) {
    const { parentNoteId: _ignoredParentNoteId, ...layoutWithoutParent } = layout
    return layoutWithoutParent
  }
  return {
    ...layout,
    parentNoteId,
  }
}

const withNormalizedStickyNoteSize = (
  layout: DashboardStickyNoteLayout,
  width: number | undefined,
  height: number | undefined,
): DashboardStickyNoteLayout => {
  const nextLayout = { ...layout }
  if (width === undefined) {
    delete nextLayout.width
  } else {
    nextLayout.width = width
  }
  if (height === undefined) {
    delete nextLayout.height
  } else {
    nextLayout.height = height
  }
  return nextLayout
}

const resolveValidParentNoteId = (
  noteId: string,
  layoutsByNoteId: Record<string, DashboardStickyNoteLayout>,
): string | undefined => {
  const layout = layoutsByNoteId[noteId]
  const directParentNoteId = sanitizeParentNoteId(layout?.parentNoteId)
  if (layout === undefined || directParentNoteId === undefined) {
    return undefined
  }

  const visitedNoteIds = new Set<string>([noteId])
  let currentParentNoteId: string | undefined = directParentNoteId
  while (currentParentNoteId !== undefined) {
    if (visitedNoteIds.has(currentParentNoteId)) {
      return undefined
    }
    const parentLayout = layoutsByNoteId[currentParentNoteId]
    if (parentLayout === undefined || parentLayout.laneId !== layout.laneId) {
      return undefined
    }
    visitedNoteIds.add(currentParentNoteId)
    currentParentNoteId = sanitizeParentNoteId(parentLayout.parentNoteId)
  }

  return directParentNoteId
}

export const normalizeDashboardStickyNoteLayouts = (
  layoutsByNoteId: Record<string, DashboardStickyNoteLayout>,
): Record<string, DashboardStickyNoteLayout> => {
  const nextLayoutsByNoteId = Object.fromEntries(
    Object.entries(layoutsByNoteId).map(([noteId, layout]) => [noteId, cloneStickyNoteLayout(layout)]),
  ) as Record<string, DashboardStickyNoteLayout>

  Object.keys(nextLayoutsByNoteId)
    .sort((left, right) => left.localeCompare(right))
    .forEach((noteId) => {
      const layout = nextLayoutsByNoteId[noteId]
      if (layout === undefined) {
        return
      }
      nextLayoutsByNoteId[noteId] = withNormalizedParentNoteId(
        withNormalizedStickyNoteSize(
          layout,
          sanitizeStickyNoteWidth(layout.width),
          sanitizeStickyNoteHeight(layout.height),
        ),
        resolveValidParentNoteId(noteId, nextLayoutsByNoteId),
      )
    })

  return nextLayoutsByNoteId
}

const normalizeDashboardLaneId = (
  value: unknown,
  fallbackLaneId: DashboardLaneId = defaultDashboardLaneId,
): DashboardLaneId => {
  const laneId = typeof value === 'string' ? value.trim() : ''
  return laneId.length > 0 ? laneId : fallbackLaneId
}

const normalizeLaneWidth = (value: unknown): number =>
  typeof value === 'number' && Number.isFinite(value) && value > minimumLaneWidthWeight
    ? value
    : 1

const normalizeLaneRecord = (
  value: unknown,
  fallback: DashboardLaneRecord,
  takenIds: Set<string>,
): DashboardLaneRecord | null => {
  if (!isRecord(value)) {
    return null
  }
  const id = normalizeDashboardLaneId(value.id, fallback.id)
  if (takenIds.has(id)) {
    return null
  }
  takenIds.add(id)
  return {
    id,
    title: normalizeLaneTitle(value.title, fallback.title),
    order:
      typeof value.order === 'number' && Number.isFinite(value.order)
        ? Math.round(value.order)
        : fallback.order,
    width: normalizeLaneWidth(value.width),
  }
}

const normalizeLanes = (value: unknown): DashboardLaneRecord[] => {
  const normalized: DashboardLaneRecord[] = []
  const takenIds = new Set<string>()
  if (Array.isArray(value)) {
    value.forEach((entry, index) => {
      const fallback = defaultDashboardLanes[index] ?? {
        id: `lane-${index + 1}`,
        title: `Lane ${index + 1}`,
        order: index,
        width: 1,
      }
      const lane = normalizeLaneRecord(entry, fallback, takenIds)
      if (lane !== null) {
        normalized.push(lane)
      }
    })
  }
  if (normalized.length === 0) {
    return defaultDashboardLanes.map(cloneLaneRecord)
  }
  return normalized
    .sort((left, right) => left.order - right.order)
    .map((lane, index) => ({
      ...lane,
      order: index,
    }))
}

const normalizeStickyNoteLayout = (
  noteId: string,
  value: unknown,
  fallbackLaneId: DashboardLaneId,
): DashboardStickyNoteLayout | null => {
  if (!isRecord(value)) {
    return null
  }
  const normalizedNoteId =
    typeof value.noteId === 'string' && value.noteId.trim().length > 0
      ? value.noteId.trim()
      : noteId
  if (normalizedNoteId.length === 0) {
    return null
  }
  const laneId = normalizeDashboardLaneId(value.laneId ?? value.lane, fallbackLaneId)
  const x = typeof value.x === 'number' && Number.isFinite(value.x) ? Math.round(value.x) : 24
  const y = typeof value.y === 'number' && Number.isFinite(value.y) ? Math.round(value.y) : 24
  return withNormalizedParentNoteId(
    withNormalizedStickyNoteSize(
      {
        noteId: normalizedNoteId,
        laneId,
        x,
        y,
      },
      sanitizeStickyNoteWidth(value.width),
      sanitizeStickyNoteHeight(value.height),
    ),
    sanitizeParentNoteId(value.parentNoteId),
  )
}

export const serializePersistedDashboardState = (
  state: DashboardPersistenceSource,
): PersistedDashboardState => ({
  version: 4,
  lanes: state.lanes.map(cloneLaneRecord),
  stickyNoteLayoutsByNoteId: normalizeDashboardStickyNoteLayouts(state.stickyNoteLayoutsByNoteId),
})

export const normalizePersistedDashboardState = (
  value: unknown,
): PersistedDashboardState | null => {
  if (!isRecord(value)) {
    return null
  }
  const lanes = normalizeLanes(value.lanes)
  const laneIds = new Set(lanes.map((lane) => lane.id))
  const fallbackLaneId = lanes[0]?.id ?? defaultDashboardLaneId
  const stickyNoteLayoutsByNoteId = isRecord(value.stickyNoteLayoutsByNoteId)
    ? normalizeDashboardStickyNoteLayouts(
        Object.fromEntries(
          Object.entries(value.stickyNoteLayoutsByNoteId)
            .map(([noteId, layout]) => {
              const normalizedLayout = normalizeStickyNoteLayout(noteId, layout, fallbackLaneId)
              if (normalizedLayout === null) {
                return null
              }
              const nextLaneId = laneIds.has(normalizedLayout.laneId)
                ? normalizedLayout.laneId
                : fallbackLaneId
              return [
                normalizedLayout.noteId,
                {
                  ...normalizedLayout,
                  laneId: nextLaneId,
                },
              ] as const
            })
            .filter(
              (entry): entry is readonly [string, DashboardStickyNoteLayout] => entry !== null,
            ),
        ),
      )
    : {}
  return {
    version: 4,
    lanes,
    stickyNoteLayoutsByNoteId,
  }
}

export const readPersistedDashboardState = (): PersistedDashboardState | null => {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return null
  }
  try {
    const raw =
      window.localStorage.getItem(dashboardStorageKey) ??
      window.localStorage.getItem(legacyDashboardStorageKeyV3) ??
      window.localStorage.getItem(legacyDashboardStorageKeyV2) ??
      window.localStorage.getItem(legacyDashboardStorageKeyV1)
    if (raw === null) {
      return null
    }
    return normalizePersistedDashboardState(JSON.parse(raw))
  } catch {
    return null
  }
}

export const writePersistedDashboardState = (state: PersistedDashboardState): void => {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return
  }
  try {
    window.localStorage.setItem(dashboardStorageKey, JSON.stringify(state))
    window.localStorage.removeItem(legacyDashboardStorageKeyV3)
    window.localStorage.removeItem(legacyDashboardStorageKeyV2)
    window.localStorage.removeItem(legacyDashboardStorageKeyV1)
  } catch {
    // Ignore localStorage write failures so the workspace stays usable.
  }
}
