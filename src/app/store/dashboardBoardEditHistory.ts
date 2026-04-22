import { normalizeDashboardStickyNoteLayouts } from '../dashboard/dashboardPersistence'
import type {
  DashboardLaneId,
  DashboardLaneRecord,
  DashboardStickyNoteLayout,
} from '../dashboard/dashboardTypes'
import {
  defaultDashboardLaneId,
  defaultDashboardStickyNoteHeight,
  defaultDashboardStickyNoteWidth,
  minimumDashboardStickyNoteHeight,
  minimumDashboardStickyNoteWidth,
} from '../dashboard/dashboardTypes'
import { useDashboardStore } from '../dashboard/useDashboardStore'
import { editHistoryStore } from './editHistoryStore'

type DashboardBoardHistoryOptions = {
  entryId?: string
}

type DashboardStickyNotePlacementInput = {
  noteId: string
  laneId: DashboardLaneId
  x: number
  y: number
}

type DashboardStickyNotePlacementHistoryOptions = DashboardBoardHistoryOptions & {
  attachmentParentChange?: {
    noteId: string
    parentNoteId: string | null
  }
}

type DashboardStickyNotePlacementSnapshot = {
  noteId: string
  laneId: DashboardLaneId
  x: number
  y: number
  parentNoteId?: string
}

type DashboardStickyNoteFrameInput = {
  x: number
  y: number
  width: number
  height: number
}

type DashboardStickyNoteFrameSnapshot = {
  noteId: string
  x: number
  y: number
  width: number
  height: number
}

type DashboardBoardPlacementCommand = 'align-vertical' | 'align-horizontal' | 'arrange-grid'

type DashboardBoardPlacementCommandHistoryOptions = DashboardBoardHistoryOptions & {
  laneId: DashboardLaneId
}

type DashboardStickyNotePositionSnapshot = {
  noteId: string
  x: number
  y: number
}

const minimumLaneWidthWeight = 0.15

let dashboardBoardHistorySequence = 0

const dashboardBoardHistorySource = {
  surface: 'dashboard',
  sourceId: 'board',
  sourceLabel: 'Dashboard board',
}

const nextDashboardBoardHistoryEntryId = (): string => {
  dashboardBoardHistorySequence += 1
  return `dashboard-board-${dashboardBoardHistorySequence}`
}

const cloneLane = (lane: DashboardLaneRecord): DashboardLaneRecord => ({
  id: lane.id,
  title: lane.title,
  order: lane.order,
  width: lane.width,
})

const cloneLayout = (layout: DashboardStickyNoteLayout): DashboardStickyNoteLayout => ({
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

const cloneLayoutsByNoteId = (
  layoutsByNoteId: Record<string, DashboardStickyNoteLayout>,
): Record<string, DashboardStickyNoteLayout> =>
  Object.fromEntries(
    Object.entries(layoutsByNoteId).map(([noteId, layout]) => [noteId, cloneLayout(layout)]),
  )

const clonePlacementSnapshot = (
  layout: DashboardStickyNoteLayout,
): DashboardStickyNotePlacementSnapshot => ({
  noteId: layout.noteId,
  laneId: layout.laneId,
  x: Math.round(layout.x),
  y: Math.round(layout.y),
  ...(typeof layout.parentNoteId === 'string' && layout.parentNoteId.trim().length > 0
    ? { parentNoteId: layout.parentNoteId.trim() }
    : {}),
})

const normalizeStickyNoteFrameDimension = (
  dimension: number | undefined,
  fallback: number,
  minimum: number,
): number =>
  Math.max(
    minimum,
    Math.round(typeof dimension === 'number' && Number.isFinite(dimension) ? dimension : fallback),
  )

const cloneFrameSnapshot = (
  layout: DashboardStickyNoteLayout,
): DashboardStickyNoteFrameSnapshot => ({
  noteId: layout.noteId,
  x: Math.round(layout.x),
  y: Math.round(layout.y),
  width: normalizeStickyNoteFrameDimension(
    layout.width,
    defaultDashboardStickyNoteWidth,
    minimumDashboardStickyNoteWidth,
  ),
  height: normalizeStickyNoteFrameDimension(
    layout.height,
    defaultDashboardStickyNoteHeight,
    minimumDashboardStickyNoteHeight,
  ),
})

const cloneFrameInputSnapshot = (
  noteId: string,
  frame: DashboardStickyNoteFrameInput,
): DashboardStickyNoteFrameSnapshot => ({
  noteId,
  x: Math.round(frame.x),
  y: Math.round(frame.y),
  width: Math.max(minimumDashboardStickyNoteWidth, Math.round(frame.width)),
  height: Math.max(minimumDashboardStickyNoteHeight, Math.round(frame.height)),
})

const clonePositionSnapshot = (
  layout: DashboardStickyNoteLayout,
): DashboardStickyNotePositionSnapshot => ({
  noteId: layout.noteId,
  x: Math.round(layout.x),
  y: Math.round(layout.y),
})

const placementSnapshotsEqual = (
  before: DashboardStickyNotePlacementSnapshot,
  after: DashboardStickyNotePlacementSnapshot,
): boolean =>
  before.laneId === after.laneId &&
  before.x === after.x &&
  before.y === after.y &&
  (before.parentNoteId ?? null) === (after.parentNoteId ?? null)

const frameSnapshotsEqual = (
  before: DashboardStickyNoteFrameSnapshot,
  after: DashboardStickyNoteFrameSnapshot,
): boolean =>
  before.x === after.x &&
  before.y === after.y &&
  before.width === after.width &&
  before.height === after.height

const positionSnapshotsEqual = (
  before: DashboardStickyNotePositionSnapshot,
  after: DashboardStickyNotePositionSnapshot,
): boolean => before.x === after.x && before.y === after.y

const normalizeLaneWidth = (width: number): number =>
  Number.isFinite(width) && width > minimumLaneWidthWeight ? width : 1

const normalizeLanes = (lanes: DashboardLaneRecord[]): DashboardLaneRecord[] =>
  lanes.map((lane, index) => ({
    ...lane,
    order: index,
    width: normalizeLaneWidth(lane.width),
  }))

const mergeCapturedLanesWithCurrent = (
  capturedLanes: DashboardLaneRecord[],
  currentLanes: DashboardLaneRecord[],
  forcedLanes: DashboardLaneRecord[] = [],
): DashboardLaneRecord[] => {
  const currentById = new Map(currentLanes.map((lane) => [lane.id, cloneLane(lane)]))
  const forcedById = new Map(forcedLanes.map((lane) => [lane.id, cloneLane(lane)]))
  const nextLanes: DashboardLaneRecord[] = []
  const pushedLaneIds = new Set<DashboardLaneId>()

  capturedLanes.forEach((capturedLane) => {
    const forcedLane = forcedById.get(capturedLane.id)
    const currentLane = currentById.get(capturedLane.id)
    const nextLane = forcedLane ?? currentLane ?? null
    if (nextLane !== null && !pushedLaneIds.has(nextLane.id)) {
      nextLanes.push(nextLane)
      pushedLaneIds.add(nextLane.id)
    }
  })

  currentLanes.forEach((lane) => {
    if (!pushedLaneIds.has(lane.id)) {
      nextLanes.push(cloneLane(lane))
      pushedLaneIds.add(lane.id)
    }
  })

  forcedLanes.forEach((lane) => {
    if (!pushedLaneIds.has(lane.id)) {
      nextLanes.push(cloneLane(lane))
      pushedLaneIds.add(lane.id)
    }
  })

  return normalizeLanes(nextLanes)
}

const resolveFallbackLaneId = (
  lanes: DashboardLaneRecord[],
  excludedLaneId?: DashboardLaneId,
): DashboardLaneId =>
  lanes.find((lane) => lane.id !== excludedLaneId)?.id ?? lanes[0]?.id ?? defaultDashboardLaneId

const moveLayoutsFromLane = (
  layoutsByNoteId: Record<string, DashboardStickyNoteLayout>,
  laneId: DashboardLaneId,
  destinationLaneId: DashboardLaneId,
): Record<string, DashboardStickyNoteLayout> =>
  normalizeDashboardStickyNoteLayouts(
    Object.fromEntries(
      Object.entries(layoutsByNoteId).map(([noteId, layout]) => [
        noteId,
        layout.laneId === laneId
          ? {
              ...cloneLayout(layout),
              laneId: destinationLaneId,
            }
          : cloneLayout(layout),
      ]),
    ),
  )

const restoreCreatedLane = (
  lane: DashboardLaneRecord,
  laneOrder: DashboardLaneRecord[],
): void => {
  useDashboardStore.setState((state) => ({
    lanes: mergeCapturedLanesWithCurrent(laneOrder, state.lanes, [lane]),
  }))
}

const removeCreatedLane = (
  laneId: DashboardLaneId,
  laneOrder: DashboardLaneRecord[],
): void => {
  useDashboardStore.setState((state) => {
    const currentLanesWithoutTarget = state.lanes.filter((lane) => lane.id !== laneId)
    const nextLanes = mergeCapturedLanesWithCurrent(laneOrder, currentLanesWithoutTarget)
    const fallbackLaneId = resolveFallbackLaneId(nextLanes, laneId)
    return {
      lanes: nextLanes,
      stickyNoteLayoutsByNoteId: moveLayoutsFromLane(
        state.stickyNoteLayoutsByNoteId,
        laneId,
        fallbackLaneId,
      ),
    }
  })
}

const restoreLaneTitle = (
  laneId: DashboardLaneId,
  title: string,
): void => {
  useDashboardStore.setState((state) => {
    if (!state.lanes.some((lane) => lane.id === laneId)) {
      return state
    }
    return {
      lanes: state.lanes.map((lane) =>
        lane.id === laneId
          ? {
              ...lane,
              title,
            }
          : lane,
      ),
    }
  })
}

const restoreRemovedLane = (
  lane: DashboardLaneRecord,
  laneOrder: DashboardLaneRecord[],
  affectedLayoutsByNoteId: Record<string, DashboardStickyNoteLayout>,
): void => {
  useDashboardStore.setState((state) => ({
    lanes: mergeCapturedLanesWithCurrent(laneOrder, state.lanes, [lane]),
    stickyNoteLayoutsByNoteId: normalizeDashboardStickyNoteLayouts({
      ...cloneLayoutsByNoteId(state.stickyNoteLayoutsByNoteId),
      ...cloneLayoutsByNoteId(affectedLayoutsByNoteId),
    }),
  }))
}

const removeLaneAgain = (
  laneId: DashboardLaneId,
  destinationLaneId: DashboardLaneId,
  laneOrder: DashboardLaneRecord[],
): void => {
  useDashboardStore.setState((state) => {
    const destinationExists = state.lanes.some((lane) => lane.id === destinationLaneId)
    if (!destinationExists) {
      return state
    }
    const currentLanesWithoutTarget = state.lanes.filter((lane) => lane.id !== laneId)
    const nextLanes = mergeCapturedLanesWithCurrent(laneOrder, currentLanesWithoutTarget)
    return {
      lanes: nextLanes,
      stickyNoteLayoutsByNoteId: moveLayoutsFromLane(
        state.stickyNoteLayoutsByNoteId,
        laneId,
        destinationLaneId,
      ),
    }
  })
}

const restoreStickyNotePlacementSnapshots = (
  snapshotsByNoteId: Record<string, DashboardStickyNotePlacementSnapshot>,
): void => {
  useDashboardStore.setState((state) => {
    const nextLayoutsByNoteId = cloneLayoutsByNoteId(state.stickyNoteLayoutsByNoteId)
    let didChange = false

    Object.entries(snapshotsByNoteId).forEach(([noteId, snapshot]) => {
      const currentLayout = nextLayoutsByNoteId[noteId] ?? null
      if (currentLayout === null) {
        return
      }

      const nextLayout: DashboardStickyNoteLayout = {
        ...currentLayout,
        laneId: snapshot.laneId,
        x: snapshot.x,
        y: snapshot.y,
      }
      if (typeof snapshot.parentNoteId === 'string' && snapshot.parentNoteId.length > 0) {
        nextLayout.parentNoteId = snapshot.parentNoteId
      } else {
        delete nextLayout.parentNoteId
      }

      if (
        currentLayout.laneId === nextLayout.laneId &&
        currentLayout.x === nextLayout.x &&
        currentLayout.y === nextLayout.y &&
        (currentLayout.parentNoteId ?? null) === (nextLayout.parentNoteId ?? null)
      ) {
        return
      }

      nextLayoutsByNoteId[noteId] = nextLayout
      didChange = true
    })

    if (!didChange) {
      return state
    }

    return {
      stickyNoteLayoutsByNoteId: normalizeDashboardStickyNoteLayouts(nextLayoutsByNoteId),
    }
  })
}

const restoreStickyNoteFrameSnapshot = (snapshot: DashboardStickyNoteFrameSnapshot): void => {
  useDashboardStore.setState((state) => {
    const currentLayout = state.stickyNoteLayoutsByNoteId[snapshot.noteId] ?? null
    if (currentLayout === null) {
      return state
    }

    if (frameSnapshotsEqual(cloneFrameSnapshot(currentLayout), snapshot)) {
      return state
    }

    return {
      stickyNoteLayoutsByNoteId: normalizeDashboardStickyNoteLayouts({
        ...cloneLayoutsByNoteId(state.stickyNoteLayoutsByNoteId),
        [snapshot.noteId]: {
          ...currentLayout,
          x: snapshot.x,
          y: snapshot.y,
          width: snapshot.width,
          height: snapshot.height,
        },
      }),
    }
  })
}

const restoreStickyNotePositionSnapshots = (
  snapshotsByNoteId: Record<string, DashboardStickyNotePositionSnapshot>,
): void => {
  useDashboardStore.setState((state) => {
    const nextLayoutsByNoteId = cloneLayoutsByNoteId(state.stickyNoteLayoutsByNoteId)
    let didChange = false

    Object.entries(snapshotsByNoteId).forEach(([noteId, snapshot]) => {
      const currentLayout = nextLayoutsByNoteId[noteId] ?? null
      if (currentLayout === null) {
        return
      }
      if (positionSnapshotsEqual(clonePositionSnapshot(currentLayout), snapshot)) {
        return
      }
      nextLayoutsByNoteId[noteId] = {
        ...currentLayout,
        x: snapshot.x,
        y: snapshot.y,
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
}

const resolveDashboardBoardPlacementCommandMetadata = (
  command: DashboardBoardPlacementCommand,
  laneId: DashboardLaneId,
): {
  label: string
  targetId: string
  targetLabel: string
} => {
  switch (command) {
    case 'align-vertical':
      return {
        label: 'Align sticky notes',
        targetId: `dashboard-board-command:align-vertical:${laneId}`,
        targetLabel: 'Vertical alignment',
      }
    case 'align-horizontal':
      return {
        label: 'Align sticky notes',
        targetId: `dashboard-board-command:align-horizontal:${laneId}`,
        targetLabel: 'Horizontal alignment',
      }
    case 'arrange-grid':
      return {
        label: 'Arrange sticky notes',
        targetId: `dashboard-board-command:grid:${laneId}`,
        targetLabel: 'Sticky note grid',
      }
  }
}

export const createDashboardLaneAfterWithHistory = (
  afterLaneId: DashboardLaneId,
  title = 'New lane',
  options: DashboardBoardHistoryOptions = {},
): DashboardLaneId => {
  const beforeState = useDashboardStore.getState()
  const beforeLaneOrder = beforeState.lanes.map(cloneLane)
  const laneId = beforeState.createLaneAfter(afterLaneId, title)
  const afterState = useDashboardStore.getState()
  const createdLane = afterState.lanes.find((lane) => lane.id === laneId) ?? null
  if (createdLane === null) {
    return laneId
  }
  const afterLane = cloneLane(createdLane)
  const afterLaneOrder = afterState.lanes.map(cloneLane)

  editHistoryStore.commitEntry({
    entryId: options.entryId ?? nextDashboardBoardHistoryEntryId(),
    label: 'Create Dashboard lane',
    source: dashboardBoardHistorySource,
    targetId: `dashboard-lane:${laneId}`,
    targetLabel: afterLane.title,
    undo: () => removeCreatedLane(laneId, beforeLaneOrder),
    redo: () => restoreCreatedLane(afterLane, afterLaneOrder),
  })

  return laneId
}

export const renameDashboardLaneWithHistory = (
  laneId: DashboardLaneId,
  title: string,
  options: DashboardBoardHistoryOptions = {},
): boolean => {
  const beforeState = useDashboardStore.getState()
  const beforeLane = beforeState.lanes.find((lane) => lane.id === laneId) ?? null
  if (beforeLane === null) {
    return false
  }

  beforeState.renameLane(laneId, title)
  const afterLane = useDashboardStore.getState().lanes.find((lane) => lane.id === laneId) ?? null
  if (afterLane === null || beforeLane.title === afterLane.title) {
    return false
  }

  return editHistoryStore.commitEntry({
    entryId: options.entryId ?? nextDashboardBoardHistoryEntryId(),
    label: 'Rename Dashboard lane',
    source: dashboardBoardHistorySource,
    targetId: `dashboard-lane:${laneId}:title`,
    targetLabel: 'Dashboard lane title',
    undo: () => restoreLaneTitle(laneId, beforeLane.title),
    redo: () => restoreLaneTitle(laneId, afterLane.title),
  })
}

export const removeDashboardLaneWithHistory = (
  laneId: DashboardLaneId,
  destinationLaneId: DashboardLaneId,
  options: DashboardBoardHistoryOptions = {},
): boolean => {
  const beforeState = useDashboardStore.getState()
  const removedLane = beforeState.lanes.find((lane) => lane.id === laneId) ?? null
  const destinationLane = beforeState.lanes.find((lane) => lane.id === destinationLaneId) ?? null
  if (
    beforeState.lanes.length <= 1 ||
    removedLane === null ||
    destinationLane === null ||
    laneId === destinationLaneId
  ) {
    return false
  }
  const beforeLaneOrder = beforeState.lanes.map(cloneLane)
  const affectedLayoutsByNoteId = Object.fromEntries(
    Object.entries(beforeState.stickyNoteLayoutsByNoteId)
      .filter(([, layout]) => layout.laneId === laneId)
      .map(([noteId, layout]) => [noteId, cloneLayout(layout)]),
  )

  beforeState.removeLane(laneId, destinationLaneId)
  const afterState = useDashboardStore.getState()
  if (afterState.lanes.some((lane) => lane.id === laneId)) {
    return false
  }
  const afterLaneOrder = afterState.lanes.map(cloneLane)

  return editHistoryStore.commitEntry({
    entryId: options.entryId ?? nextDashboardBoardHistoryEntryId(),
    label: 'Delete Dashboard lane',
    source: dashboardBoardHistorySource,
    targetId: `dashboard-lane:${laneId}`,
    targetLabel: removedLane.title,
    undo: () => restoreRemovedLane(removedLane, beforeLaneOrder, affectedLayoutsByNoteId),
    redo: () => removeLaneAgain(laneId, destinationLaneId, afterLaneOrder),
  })
}

export const commitDashboardStickyNotePlacementsWithHistory = (
  layouts: DashboardStickyNotePlacementInput[],
  options: DashboardStickyNotePlacementHistoryOptions = {},
): boolean => {
  const beforeState = useDashboardStore.getState()
  const affectedNoteIds = Array.from(
    new Set([
      ...layouts.map((layout) => layout.noteId),
      ...(options.attachmentParentChange === undefined
        ? []
        : [options.attachmentParentChange.noteId]),
    ]),
  )
  const beforeSnapshotsByNoteId = Object.fromEntries(
    affectedNoteIds.flatMap((noteId) => {
      const layout = beforeState.stickyNoteLayoutsByNoteId[noteId] ?? null
      return layout === null ? [] : [[noteId, clonePlacementSnapshot(layout)]]
    }),
  )

  beforeState.setStickyNotePlacements(layouts)
  if (options.attachmentParentChange !== undefined) {
    useDashboardStore
      .getState()
      .setStickyNoteAttachmentParent(
        options.attachmentParentChange.noteId,
        options.attachmentParentChange.parentNoteId,
      )
  }

  const afterState = useDashboardStore.getState()
  const afterSnapshotsByNoteId = Object.fromEntries(
    affectedNoteIds.flatMap((noteId) => {
      const beforeSnapshot = beforeSnapshotsByNoteId[noteId] ?? null
      const layout = afterState.stickyNoteLayoutsByNoteId[noteId] ?? null
      if (beforeSnapshot === null || layout === null) {
        return []
      }
      const afterSnapshot = clonePlacementSnapshot(layout)
      return placementSnapshotsEqual(beforeSnapshot, afterSnapshot)
        ? []
        : [[noteId, afterSnapshot]]
    }),
  )
  const changedNoteIds = Object.keys(afterSnapshotsByNoteId)

  if (changedNoteIds.length === 0) {
    return false
  }

  const beforeChangedSnapshotsByNoteId = Object.fromEntries(
    changedNoteIds.map((noteId) => [noteId, beforeSnapshotsByNoteId[noteId]]),
  )
  const isSingleNoteMove = changedNoteIds.length === 1
  const targetNoteId = changedNoteIds[0] ?? 'selection'

  return editHistoryStore.commitEntry({
    entryId: options.entryId ?? nextDashboardBoardHistoryEntryId(),
    label: isSingleNoteMove ? 'Move sticky note' : 'Move sticky notes',
    source: dashboardBoardHistorySource,
    targetId: isSingleNoteMove
      ? `dashboard-note-layout:${targetNoteId}`
      : 'dashboard-note-layout:selection',
    targetLabel: isSingleNoteMove ? 'Sticky note layout' : 'Sticky note layouts',
    undo: () => restoreStickyNotePlacementSnapshots(beforeChangedSnapshotsByNoteId),
    redo: () => restoreStickyNotePlacementSnapshots(afterSnapshotsByNoteId),
  })
}

export const commitDashboardBoardPlacementCommandWithHistory = (
  command: DashboardBoardPlacementCommand,
  layouts: DashboardStickyNotePlacementInput[],
  options: DashboardBoardPlacementCommandHistoryOptions,
): boolean => {
  const beforeState = useDashboardStore.getState()
  const validLayoutsByNoteId = new Map<string, DashboardStickyNotePlacementInput>()
  layouts.forEach((layout) => {
    if (beforeState.stickyNoteLayoutsByNoteId[layout.noteId] !== undefined) {
      validLayoutsByNoteId.set(layout.noteId, layout)
    }
  })
  const validLayouts = Array.from(validLayoutsByNoteId.values())
  if (validLayouts.length < 2) {
    return false
  }

  const beforeSnapshotsByNoteId = Object.fromEntries(
    validLayouts.map((layout) => [
      layout.noteId,
      clonePositionSnapshot(beforeState.stickyNoteLayoutsByNoteId[layout.noteId]),
    ]),
  )

  beforeState.setStickyNotePlacements(validLayouts)

  const afterState = useDashboardStore.getState()
  const afterSnapshotsByNoteId = Object.fromEntries(
    validLayouts.flatMap((layout) => {
      const beforeSnapshot = beforeSnapshotsByNoteId[layout.noteId] ?? null
      const afterLayout = afterState.stickyNoteLayoutsByNoteId[layout.noteId] ?? null
      if (beforeSnapshot === null || afterLayout === null) {
        return []
      }
      const afterSnapshot = clonePositionSnapshot(afterLayout)
      return positionSnapshotsEqual(beforeSnapshot, afterSnapshot)
        ? []
        : [[layout.noteId, afterSnapshot]]
    }),
  )
  const changedNoteIds = Object.keys(afterSnapshotsByNoteId)
  if (changedNoteIds.length === 0) {
    return false
  }

  const beforeChangedSnapshotsByNoteId = Object.fromEntries(
    changedNoteIds.map((noteId) => [noteId, beforeSnapshotsByNoteId[noteId]]),
  )
  const metadata = resolveDashboardBoardPlacementCommandMetadata(command, options.laneId)

  return editHistoryStore.commitEntry({
    entryId: options.entryId ?? nextDashboardBoardHistoryEntryId(),
    label: metadata.label,
    source: dashboardBoardHistorySource,
    targetId: metadata.targetId,
    targetLabel: metadata.targetLabel,
    undo: () => restoreStickyNotePositionSnapshots(beforeChangedSnapshotsByNoteId),
    redo: () => restoreStickyNotePositionSnapshots(afterSnapshotsByNoteId),
  })
}

export const commitDashboardStickyNoteFrameWithHistory = (
  noteId: string,
  frame: DashboardStickyNoteFrameInput,
  options: DashboardBoardHistoryOptions = {},
): boolean => {
  const beforeState = useDashboardStore.getState()
  const beforeLayout = beforeState.stickyNoteLayoutsByNoteId[noteId] ?? null
  if (beforeLayout === null) {
    return false
  }
  const beforeSnapshot = cloneFrameSnapshot(beforeLayout)
  const requestedSnapshot = cloneFrameInputSnapshot(noteId, frame)
  if (frameSnapshotsEqual(beforeSnapshot, requestedSnapshot)) {
    return false
  }

  beforeState.setStickyNoteFrame(noteId, frame)

  const afterLayout = useDashboardStore.getState().stickyNoteLayoutsByNoteId[noteId] ?? null
  if (afterLayout === null) {
    return false
  }
  const afterSnapshot = cloneFrameSnapshot(afterLayout)
  if (frameSnapshotsEqual(beforeSnapshot, afterSnapshot)) {
    return false
  }

  return editHistoryStore.commitEntry({
    entryId: options.entryId ?? nextDashboardBoardHistoryEntryId(),
    label: 'Resize sticky note',
    source: dashboardBoardHistorySource,
    targetId: `dashboard-note-frame:${noteId}`,
    targetLabel: 'Sticky note frame',
    undo: () => restoreStickyNoteFrameSnapshot(beforeSnapshot),
    redo: () => restoreStickyNoteFrameSnapshot(afterSnapshot),
  })
}
