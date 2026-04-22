import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useId,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from 'react'
import type {
  DashboardLaneId,
  DashboardLaneRecord,
  DashboardStickyNoteLayout,
} from '../dashboard/dashboardTypes'
import {
  defaultDashboardStickyNoteHeight,
  defaultDashboardStickyNoteWidth,
  minimumDashboardStickyNoteHeight,
  minimumDashboardStickyNoteWidth,
} from '../dashboard/dashboardTypes'
import { useNotepadStore } from '../notepad/useNotepadStore'
import { commitNoteTextFieldWithHistory } from '../store/notepadEditHistory'
import {
  commitDashboardBoardPlacementCommandWithHistory,
  commitDashboardStickyNoteFrameWithHistory,
  commitDashboardStickyNotePlacementsWithHistory,
  createDashboardLaneAfterWithHistory,
  removeDashboardLaneWithHistory,
  renameDashboardLaneWithHistory,
} from '../store/dashboardBoardEditHistory'
import { useDashboardStore } from '../dashboard/useDashboardStore'
import { DashboardStickyNoteCard } from './DashboardStickyNoteCard'

type DashboardSurfaceProps = {
  surfaceInstanceId: string
  hostMode?: 'slotted' | 'floating' | 'popout'
  onActivate?: () => void
  onOpenNoteInNotepad?: (noteId: string) => void
}

const stickyNoteWidth = defaultDashboardStickyNoteWidth
const stickyNoteHeight = defaultDashboardStickyNoteHeight
const stickyNoteGridGap = 24
const stickyNoteGridColumns = 3
const stickyNotePadding = 16
const stickyNoteTitleBarHeight = 34
const laneFitPadding = 48
const laneWorldWidth = 2400
const laneWorldHeight = 1600
const dashboardLaneMinimumWidth = 72
const dashboardLaneMinimumWidthFloor = 24
const dashboardLaneResizeColumnWidth = 14
const dashboardLaneMinimumZoom = 0.6
const dashboardLaneMaximumZoom = 2
const dashboardLaneZoomStep = 0.1

type DashboardLaneCamera = {
  panX: number
  panY: number
  zoom: number
}

type DashboardLaneViewport = {
  width: number
  height: number
}

type DashboardSelectionBox = {
  laneId: DashboardLaneId
  left: number
  top: number
  width: number
  height: number
}

type DashboardDragPreviewLayout = {
  noteId: string
  laneId: DashboardLaneId
  x: number
  y: number
  width: number
  height: number
  parentNoteId?: string
}

type DashboardDragPreview = {
  activeLaneId: DashboardLaneId
  layoutsByNoteId: Record<string, DashboardDragPreviewLayout>
}

type DashboardDragMovementMode = 'single' | 'selection' | 'attachment'
type DashboardStickyNoteResizeDirection = 'north' | 'south' | 'east' | 'west' | 'north-east' | 'north-west' | 'south-east' | 'south-west'

type DashboardStickyNoteDimensions = {
  width: number
  height: number
}

const resolveStickyNoteDimensions = (
  layout?: Partial<Pick<DashboardStickyNoteLayout, 'width' | 'height'>>,
): DashboardStickyNoteDimensions => ({
  width:
    typeof layout?.width === 'number' && Number.isFinite(layout.width)
      ? Math.max(
          minimumDashboardStickyNoteWidth,
          Math.min(Math.round(layout.width), laneWorldWidth - stickyNotePadding * 2),
        )
      : stickyNoteWidth,
  height:
    typeof layout?.height === 'number' && Number.isFinite(layout.height)
      ? Math.max(
          minimumDashboardStickyNoteHeight,
          Math.min(Math.round(layout.height), laneWorldHeight - stickyNotePadding * 2),
        )
      : stickyNoteHeight,
})

const clampStickyNotePosition = (
  x: number,
  y: number,
  dimensions: DashboardStickyNoteDimensions = resolveStickyNoteDimensions(),
) => ({
  x: Math.max(
    stickyNotePadding,
    Math.min(
      Math.round(x),
      Math.max(stickyNotePadding, laneWorldWidth - dimensions.width - stickyNotePadding),
    ),
  ),
  y: Math.max(
    stickyNotePadding,
    Math.min(
      Math.round(y),
      Math.max(stickyNotePadding, laneWorldHeight - dimensions.height - stickyNotePadding),
    ),
  ),
})

const defaultLaneCamera = (): DashboardLaneCamera => ({ panX: 0, panY: 0, zoom: 1 })

const toLaneWorldPoint = (
  clientX: number,
  clientY: number,
  boardRect: DOMRect,
  camera: DashboardLaneCamera,
) => ({
  x: (clientX - boardRect.left - camera.panX) / camera.zoom,
  y: (clientY - boardRect.top - camera.panY) / camera.zoom,
})

const clampLaneZoom = (zoom: number): number =>
  Math.min(dashboardLaneMaximumZoom, Math.max(dashboardLaneMinimumZoom, Math.round(zoom * 100) / 100))

const clampLaneCamera = (
  panX: number,
  panY: number,
  zoom: number,
  viewport: DashboardLaneViewport,
): DashboardLaneCamera => {
  const nextZoom = clampLaneZoom(zoom)
  const minimumPanX = Math.min(0, viewport.width - laneWorldWidth * nextZoom)
  const minimumPanY = Math.min(0, viewport.height - laneWorldHeight * nextZoom)
  return {
    panX: Math.min(0, Math.max(minimumPanX, Math.round(panX))),
    panY: Math.min(0, Math.max(minimumPanY, Math.round(panY))),
    zoom: nextZoom,
  }
}

const resolveLaneViewport = (boardRect: DOMRect): DashboardLaneViewport => ({
  width: Math.max(0, Math.round(boardRect.width)),
  height: Math.max(0, Math.round(boardRect.height)),
})

const resolvePaddedLaneNoteBounds = (
  noteBounds: { left: number; top: number; right: number; bottom: number },
) => ({
  left: Math.max(0, noteBounds.left - laneFitPadding),
  top: Math.max(0, noteBounds.top - laneFitPadding),
  right: Math.min(laneWorldWidth, noteBounds.right + laneFitPadding),
  bottom: Math.min(laneWorldHeight, noteBounds.bottom + laneFitPadding),
})

const fitLaneCameraToNoteBounds = (
  noteBounds: { left: number; top: number; right: number; bottom: number },
  viewport: DashboardLaneViewport,
  zoom: number,
): DashboardLaneCamera => {
  const { left, top, right, bottom } = resolvePaddedLaneNoteBounds(noteBounds)
  const centerX = (left + right) / 2
  const centerY = (top + bottom) / 2
  return clampLaneCamera(viewport.width / 2 - centerX * zoom, viewport.height / 2 - centerY * zoom, zoom, viewport)
}

const fitLaneCameraToNoteBoundsWithZoom = (
  noteBounds: { left: number; top: number; right: number; bottom: number },
  viewport: DashboardLaneViewport,
): DashboardLaneCamera => {
  const { left, top, right, bottom } = resolvePaddedLaneNoteBounds(noteBounds)
  const paddedWidth = Math.max(1, right - left)
  const paddedHeight = Math.max(1, bottom - top)
  const nextZoom = clampLaneZoom(Math.min(viewport.width / paddedWidth, viewport.height / paddedHeight))
  const centerX = (left + right) / 2
  const centerY = (top + bottom) / 2
  return clampLaneCamera(
    viewport.width / 2 - centerX * nextZoom,
    viewport.height / 2 - centerY * nextZoom,
    nextZoom,
    viewport,
  )
}

const resolveMinimumLaneResizeWidth = (pairWidth: number): number =>
  Math.min(
    dashboardLaneMinimumWidth,
    Math.max(dashboardLaneMinimumWidthFloor, Math.floor(pairWidth / 2)),
  )

const resolveSelectionBounds = (
  startX: number,
  startY: number,
  currentX: number,
  currentY: number,
) => ({
  left: Math.min(startX, currentX),
  top: Math.min(startY, currentY),
  width: Math.abs(currentX - startX),
  height: Math.abs(currentY - startY),
})

const resolveStickyNoteMovementBounds = (
  dimensions: DashboardStickyNoteDimensions = resolveStickyNoteDimensions(),
) => ({
  minX: stickyNotePadding,
  maxX: Math.max(stickyNotePadding, laneWorldWidth - dimensions.width - stickyNotePadding),
  minY: stickyNotePadding,
  maxY: Math.max(stickyNotePadding, laneWorldHeight - dimensions.height - stickyNotePadding),
})

const clampGroupMovementDelta = (
  layoutsByNoteId: Record<string, DashboardDragPreviewLayout>,
  deltaX: number,
  deltaY: number,
) => {
  let minimumDeltaX = Number.NEGATIVE_INFINITY
  let maximumDeltaX = Number.POSITIVE_INFINITY
  let minimumDeltaY = Number.NEGATIVE_INFINITY
  let maximumDeltaY = Number.POSITIVE_INFINITY

  Object.values(layoutsByNoteId).forEach((layout) => {
    const movementBounds = resolveStickyNoteMovementBounds(resolveStickyNoteDimensions(layout))
    minimumDeltaX = Math.max(minimumDeltaX, movementBounds.minX - layout.x)
    maximumDeltaX = Math.min(maximumDeltaX, movementBounds.maxX - layout.x)
    minimumDeltaY = Math.max(minimumDeltaY, movementBounds.minY - layout.y)
    maximumDeltaY = Math.min(maximumDeltaY, movementBounds.maxY - layout.y)
  })

  return {
    deltaX: Math.max(minimumDeltaX, Math.min(maximumDeltaX, deltaX)),
    deltaY: Math.max(minimumDeltaY, Math.min(maximumDeltaY, deltaY)),
  }
}

const sortLayoutsForVerticalAlign = (
  left: Pick<DashboardStickyNoteLayout, 'noteId' | 'x' | 'y'>,
  right: Pick<DashboardStickyNoteLayout, 'noteId' | 'x' | 'y'>,
) =>
  left.y - right.y || left.x - right.x || left.noteId.localeCompare(right.noteId)

const sortLayoutsForHorizontalAlign = (
  left: Pick<DashboardStickyNoteLayout, 'noteId' | 'x' | 'y'>,
  right: Pick<DashboardStickyNoteLayout, 'noteId' | 'x' | 'y'>,
) => left.x - right.x || left.y - right.y || left.noteId.localeCompare(right.noteId)

const resolveStickyNoteTitleBarBounds = (
  layout: { x: number; y: number },
  dimensions: DashboardStickyNoteDimensions = resolveStickyNoteDimensions(),
) => ({
  left: layout.x,
  top: layout.y,
  right: layout.x + dimensions.width,
  bottom: layout.y + stickyNoteTitleBarHeight,
})

const resolveStickyNoteBounds = (
  layout: { x: number; y: number },
  dimensions: DashboardStickyNoteDimensions = resolveStickyNoteDimensions(),
) => ({
  left: layout.x,
  top: layout.y,
  right: layout.x + dimensions.width,
  bottom: layout.y + dimensions.height,
})

const resolveStickyNoteDefaultPlacement = (
  noteId: string,
  laneId: DashboardLaneId,
  index: number,
  dimensions: DashboardStickyNoteDimensions = resolveStickyNoteDimensions(),
): DashboardStickyNoteLayout => ({
  noteId,
  laneId,
  x: stickyNoteGridGap + (index % 3) * (dimensions.width + stickyNoteGridGap),
  y: stickyNoteGridGap + Math.floor(index / 3) * (dimensions.height + stickyNoteGridGap),
})

const resolveLaneGridPlacements = (
  laneId: DashboardLaneId,
  layouts: DashboardStickyNoteLayout[],
): Array<{ noteId: string; laneId: DashboardLaneId; x: number; y: number }> => {
  const sortedLayouts = [...layouts].sort(sortLayoutsForVerticalAlign)
  const placements: Array<{ noteId: string; laneId: DashboardLaneId; x: number; y: number }> = []
  let currentY = stickyNoteGridGap

  for (let index = 0; index < sortedLayouts.length; index += stickyNoteGridColumns) {
    const rowLayouts = sortedLayouts.slice(index, index + stickyNoteGridColumns)
    let currentX = stickyNoteGridGap
    let currentRowHeight = 0

    rowLayouts.forEach((layout) => {
      const dimensions = resolveStickyNoteDimensions(layout)
      placements.push({
        noteId: layout.noteId,
        laneId,
        x: currentX,
        y: currentY,
      })

      currentX += dimensions.width + stickyNoteGridGap
      currentRowHeight = Math.max(currentRowHeight, dimensions.height)
    })

    currentY += currentRowHeight + stickyNoteGridGap
  }

  return placements
}

const resolveSmartAlignedPlacements = ({
  laneId,
  direction,
  layouts,
}: {
  laneId: DashboardLaneId
  direction: 'vertical' | 'horizontal'
  layouts: DashboardStickyNoteLayout[]
}): Array<{ noteId: string; laneId: DashboardLaneId; x: number; y: number }> => {
  const sortedLayouts =
    direction === 'vertical'
      ? [...layouts].sort(sortLayoutsForVerticalAlign)
      : [...layouts].sort(sortLayoutsForHorizontalAlign)
  const anchorLayout = sortedLayouts[0]
  if (anchorLayout === undefined) {
    return []
  }

  let nextCoordinate = direction === 'vertical' ? anchorLayout.y : anchorLayout.x
  return sortedLayouts.map((layout) => {
    const dimensions = resolveStickyNoteDimensions(layout)
    const placement =
      direction === 'vertical'
        ? {
            noteId: layout.noteId,
            laneId,
            x: anchorLayout.x,
            y: nextCoordinate,
          }
        : {
            noteId: layout.noteId,
            laneId,
            x: nextCoordinate,
            y: anchorLayout.y,
          }

    nextCoordinate +=
      (direction === 'vertical' ? dimensions.height : dimensions.width) + stickyNoteGridGap
    return placement
  })
}

const resolveResizedStickyNoteFrame = ({
  originLayout,
  direction,
  deltaX,
  deltaY,
}: {
  originLayout: DashboardDragPreviewLayout
  direction: DashboardStickyNoteResizeDirection
  deltaX: number
  deltaY: number
}) => {
  const minimumRight = stickyNotePadding + minimumDashboardStickyNoteWidth
  const minimumBottom = stickyNotePadding + minimumDashboardStickyNoteHeight
  let left = originLayout.x
  let top = originLayout.y
  let right = originLayout.x + originLayout.width
  let bottom = originLayout.y + originLayout.height

  if (direction.includes('west')) {
    left = Math.max(
      stickyNotePadding,
      Math.min(originLayout.x + deltaX, right - minimumDashboardStickyNoteWidth),
    )
  }
  if (direction.includes('east')) {
    right = Math.max(
      minimumRight,
      Math.min(originLayout.x + originLayout.width + deltaX, laneWorldWidth - stickyNotePadding),
    )
  }
  if (direction.includes('north')) {
    top = Math.max(
      stickyNotePadding,
      Math.min(originLayout.y + deltaY, bottom - minimumDashboardStickyNoteHeight),
    )
  }
  if (direction.includes('south')) {
    bottom = Math.max(
      minimumBottom,
      Math.min(originLayout.y + originLayout.height + deltaY, laneWorldHeight - stickyNotePadding),
    )
  }

  return {
    x: Math.round(left),
    y: Math.round(top),
    width: Math.max(minimumDashboardStickyNoteWidth, Math.round(right - left)),
    height: Math.max(minimumDashboardStickyNoteHeight, Math.round(bottom - top)),
  }
}

const resolveBoundsOverlapArea = (
  leftBounds: { left: number; top: number; right: number; bottom: number },
  rightBounds: { left: number; top: number; right: number; bottom: number },
) => {
  const overlapWidth = Math.min(leftBounds.right, rightBounds.right) - Math.max(leftBounds.left, rightBounds.left)
  const overlapHeight =
    Math.min(leftBounds.bottom, rightBounds.bottom) - Math.max(leftBounds.top, rightBounds.top)
  if (overlapWidth <= 0 || overlapHeight <= 0) {
    return 0
  }
  return overlapWidth * overlapHeight
}

const resolveDropAttachmentParentNoteId = ({
  draggedNoteId,
  draggedNoteIds,
  layoutsByNoteId,
}: {
  draggedNoteId: string
  draggedNoteIds: string[]
  layoutsByNoteId: Record<string, DashboardStickyNoteLayout | DashboardDragPreviewLayout>
}): string | null => {
  const draggedLayout = layoutsByNoteId[draggedNoteId]
  if (draggedLayout === undefined) {
    return null
  }
  const draggedTitleBarBounds = resolveStickyNoteTitleBarBounds(draggedLayout)
  const draggedNoteIdSet = new Set(draggedNoteIds)
  let bestParentNoteId: string | null = null
  let bestOverlapArea = 0

  Object.entries(layoutsByNoteId).forEach(([candidateNoteId, candidateLayout]) => {
    if (draggedNoteIdSet.has(candidateNoteId) || candidateLayout.laneId !== draggedLayout.laneId) {
      return
    }
    const overlapArea = resolveBoundsOverlapArea(
      draggedTitleBarBounds,
      resolveStickyNoteBounds(candidateLayout),
    )
    if (
      overlapArea > bestOverlapArea ||
      (overlapArea > 0 &&
        overlapArea === bestOverlapArea &&
        bestParentNoteId !== null &&
        candidateNoteId.localeCompare(bestParentNoteId) < 0)
    ) {
      bestOverlapArea = overlapArea
      bestParentNoteId = candidateNoteId
    }
  })

  return bestParentNoteId
}

const resolveAttachmentSubtreeNoteIds = (
  draggedNoteId: string,
  layoutsByNoteId: Record<string, DashboardStickyNoteLayout | DashboardDragPreviewLayout>,
): string[] => {
  if (layoutsByNoteId[draggedNoteId] === undefined) {
    return [draggedNoteId]
  }

  const childrenByParentNoteId = new Map<string, string[]>()
  Object.values(layoutsByNoteId).forEach((layout) => {
    const parentNoteId =
      'parentNoteId' in layout && typeof layout.parentNoteId === 'string'
        ? layout.parentNoteId.trim()
        : ''
    if (parentNoteId.length === 0) {
      return
    }
    const currentChildren = childrenByParentNoteId.get(parentNoteId) ?? []
    currentChildren.push(layout.noteId)
    childrenByParentNoteId.set(parentNoteId, currentChildren)
  })

  const visitedNoteIds = new Set<string>([draggedNoteId])
  const orderedNoteIds = [draggedNoteId]
  const pendingParentNoteIds = [draggedNoteId]

  while (pendingParentNoteIds.length > 0) {
    const parentNoteId = pendingParentNoteIds.shift()
    if (parentNoteId === undefined) {
      break
    }
    const childNoteIds = [...(childrenByParentNoteId.get(parentNoteId) ?? [])].sort((left, right) =>
      left.localeCompare(right),
    )
    childNoteIds.forEach((childNoteId) => {
      if (visitedNoteIds.has(childNoteId)) {
        return
      }
      visitedNoteIds.add(childNoteId)
      orderedNoteIds.push(childNoteId)
      pendingParentNoteIds.push(childNoteId)
    })
  }

  return orderedNoteIds
}

const resolveStickyNoteAttachmentDepth = (
  noteId: string,
  layoutsByNoteId: Record<string, DashboardStickyNoteLayout | DashboardDragPreviewLayout>,
  depthByNoteId: Map<string, number>,
): number => {
  const cachedDepth = depthByNoteId.get(noteId)
  if (cachedDepth !== undefined) {
    return cachedDepth
  }
  const layout = layoutsByNoteId[noteId]
  if (layout === undefined || !('parentNoteId' in layout) || typeof layout.parentNoteId !== 'string') {
    depthByNoteId.set(noteId, 0)
    return 0
  }
  const parentNoteId = layout.parentNoteId.trim()
  if (parentNoteId.length === 0) {
    depthByNoteId.set(noteId, 0)
    return 0
  }
  const nextDepth = resolveStickyNoteAttachmentDepth(parentNoteId, layoutsByNoteId, depthByNoteId) + 1
  depthByNoteId.set(noteId, nextDepth)
  return nextDepth
}

const sortLaneStickyNotesForRender = <
  TNote extends { id: string },
>(
  notes: TNote[],
  layoutsByNoteId: Record<string, DashboardStickyNoteLayout | DashboardDragPreviewLayout>,
  liftedNoteId: string | null = null,
): TNote[] => {
    const depthByNoteId = new Map<string, number>()
    return notes
      .map((note, index) => ({
        note,
        index,
        depth: resolveStickyNoteAttachmentDepth(note.id, layoutsByNoteId, depthByNoteId),
        isLifted: liftedNoteId !== null && note.id === liftedNoteId,
      }))
      .sort(
        (left, right) =>
          Number(left.isLifted) - Number(right.isLifted) ||
          left.depth - right.depth ||
          left.index - right.index,
      )
      .map((entry) => entry.note)
  }

export function DashboardSurface(props: DashboardSurfaceProps) {
  const {
    surfaceInstanceId,
    hostMode = 'slotted',
    onActivate,
    onOpenNoteInNotepad,
  } = props
  const noteOrder = useNotepadStore((state) => state.noteOrder)
  const notesById = useNotepadStore((state) => state.notesById)
  const createNote = useNotepadStore((state) => state.createNote)
  const setNotePinned = useNotepadStore((state) => state.setNotePinned)
  const setNoteColorPreset = useNotepadStore((state) => state.setNoteColorPreset)
  const lanes = useDashboardStore((state) => state.lanes)
  const stickyNoteLayoutsByNoteId = useDashboardStore((state) => state.stickyNoteLayoutsByNoteId)
  const reconcileStickyNoteLayouts = useDashboardStore((state) => state.reconcileStickyNoteLayouts)
  const setAdjacentLaneWidths = useDashboardStore((state) => state.setAdjacentLaneWidths)
  const setStickyNotePlacement = useDashboardStore((state) => state.setStickyNotePlacement)
  const pinnedNoteIds = useMemo(
    () => noteOrder.filter((noteId) => notesById[noteId]?.isPinned === true),
    [noteOrder, notesById],
  )
  const pinnedNotes = useMemo(
    () =>
      pinnedNoteIds
        .map((noteId) => notesById[noteId] ?? null)
        .filter((note): note is NonNullable<typeof note> => note !== null),
    [notesById, pinnedNoteIds],
  )
  const pinnedNoteIdsSignature = pinnedNoteIds.join('|')
  const laneWidthSignature = lanes.map((lane) => `${lane.id}:${lane.width}`).join('|')
  const laneBoardRefByLane = useRef<Record<string, HTMLDivElement | null>>({})
  const laneSurfaceRefByLane = useRef<Record<string, HTMLElement | null>>({})
  const dragStateRef = useRef<{
    noteId: string
    pointerId: number
    pointerOffsetX: number
    pointerOffsetY: number
    activeLane: DashboardLaneId
    movementMode: DashboardDragMovementMode
    draggedNoteIds: string[]
    originLayoutsByNoteId: Record<string, DashboardDragPreviewLayout>
  } | null>(null)
  const dragPreviewRef = useRef<DashboardDragPreview | null>(null)
  const resizeStateRef = useRef<{
    noteId: string
    pointerId: number
    laneId: DashboardLaneId
    direction: DashboardStickyNoteResizeDirection
    originPointerWorldX: number
    originPointerWorldY: number
    originLayout: DashboardDragPreviewLayout
  } | null>(null)
  const resizePreviewRef = useRef<DashboardStickyNoteLayout | null>(null)
  const lanePanStateRef = useRef<{
    laneId: DashboardLaneId
    pointerId: number
    originClientX: number
    originClientY: number
    originPanX: number
    originPanY: number
  } | null>(null)
  const laneResizeStateRef = useRef<{
    leftLaneId: DashboardLaneId
    rightLaneId: DashboardLaneId
    pointerId: number
    originClientX: number
    originLeftWidth: number
    originRightWidth: number
    originLeftWeight: number
    originRightWeight: number
  } | null>(null)
  const selectionGestureRef = useRef<{
    laneId: DashboardLaneId
    pointerId: number
    startX: number
    startY: number
    currentX: number
    currentY: number
  } | null>(null)
  const laneCameraRef = useRef<Record<string, DashboardLaneCamera>>({})
  const [draggingNoteIds, setDraggingNoteIds] = useState<string[]>([])
  const [dragPreview, setDragPreview] = useState<DashboardDragPreview | null>(null)
  const [, setResizingNoteId] = useState<string | null>(null)
  const [resizePreviewLayout, setResizePreviewLayout] = useState<DashboardStickyNoteLayout | null>(null)
  const [pendingBodyFocusNoteId, setPendingBodyFocusNoteId] = useState<string | null>(null)
  const [panningLaneId, setPanningLaneId] = useState<DashboardLaneId | null>(null)
  const [resizingLanePair, setResizingLanePair] = useState<{
    leftLaneId: DashboardLaneId
    rightLaneId: DashboardLaneId
  } | null>(null)
  const [editingLaneId, setEditingLaneId] = useState<DashboardLaneId | null>(null)
  const [editingLaneTitleDraft, setEditingLaneTitleDraft] = useState('')
  const [laneCameras, setLaneCameras] = useState<Record<string, DashboardLaneCamera>>({})
  const [laneZoomUnlockedById, setLaneZoomUnlockedById] = useState<Record<string, boolean>>({})
  const [smartAlignEnabledByLane, setSmartAlignEnabledByLane] = useState<Record<string, boolean>>({})
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([])
  const [liftedStickyNoteId, setLiftedStickyNoteId] = useState<string | null>(null)
  const [selectionBox, setSelectionBox] = useState<DashboardSelectionBox | null>(null)
  const laneTitleInputRef = useRef<HTMLInputElement | null>(null)
  const stickyNoteLayoutsRef = useRef<Record<string, DashboardStickyNoteLayout>>({})
  const laneTitleInputId = useId()

  useEffect(() => {
    laneCameraRef.current = laneCameras
  }, [laneCameras])

  useEffect(() => {
    stickyNoteLayoutsRef.current = stickyNoteLayoutsByNoteId
  }, [stickyNoteLayoutsByNoteId])

  useEffect(() => {
    setLaneCameras((current) => {
      const next: Record<string, DashboardLaneCamera> = {}
      let didChange = Object.keys(current).length !== lanes.length
      lanes.forEach((lane) => {
        const existingCamera = current[lane.id]
        if (existingCamera === undefined) {
          next[lane.id] = defaultLaneCamera()
          didChange = true
          return
        }
        next[lane.id] = existingCamera
      })
      return didChange ? next : current
    })
  }, [lanes])

  useEffect(() => {
    setLaneZoomUnlockedById((current) => {
      const next: Record<string, boolean> = {}
      let didChange = Object.keys(current).length !== lanes.length
      lanes.forEach((lane) => {
        if (current[lane.id] === undefined) {
          next[lane.id] = false
          didChange = true
          return
        }
        next[lane.id] = current[lane.id]
      })
      return didChange ? next : current
    })
  }, [lanes])

  useEffect(() => {
    setSmartAlignEnabledByLane((current) => {
      const next: Record<string, boolean> = {}
      let didChange = Object.keys(current).length !== lanes.length
      lanes.forEach((lane) => {
        if (current[lane.id] === undefined) {
          next[lane.id] = false
          didChange = true
          return
        }
        next[lane.id] = current[lane.id]
      })
      return didChange ? next : current
    })
  }, [lanes])

  useEffect(() => {
    setLaneCameras((current) => {
      let didChange = false
      const next: Record<string, DashboardLaneCamera> = { ...current }
      lanes.forEach((lane) => {
        const boardRect = laneBoardRefByLane.current[lane.id]?.getBoundingClientRect() ?? null
        if (boardRect === null) {
          return
        }
        const currentCamera = current[lane.id] ?? defaultLaneCamera()
        const clampedCamera = clampLaneCamera(
          currentCamera.panX,
          currentCamera.panY,
          currentCamera.zoom,
          resolveLaneViewport(boardRect),
        )
        if (
          clampedCamera.panX !== currentCamera.panX ||
          clampedCamera.panY !== currentCamera.panY ||
          clampedCamera.zoom !== currentCamera.zoom
        ) {
          next[lane.id] = clampedCamera
          didChange = true
        }
      })
      return didChange ? next : current
    })
  }, [laneWidthSignature, lanes])

  useEffect(() => {
    reconcileStickyNoteLayouts(pinnedNoteIds)
  }, [pinnedNoteIds, pinnedNoteIdsSignature, reconcileStickyNoteLayouts])

  useEffect(() => {
    setSelectedNoteIds((currentSelectedNoteIds) => {
      const nextSelectedNoteIds = currentSelectedNoteIds.filter((noteId) =>
        pinnedNoteIds.includes(noteId),
      )
      return nextSelectedNoteIds.length === currentSelectedNoteIds.length
        ? currentSelectedNoteIds
        : nextSelectedNoteIds
    })
  }, [pinnedNoteIds])

  useEffect(() => {
    if (liftedStickyNoteId === null || pinnedNoteIds.includes(liftedStickyNoteId)) {
      return
    }
    setLiftedStickyNoteId(null)
  }, [liftedStickyNoteId, pinnedNoteIds])

  useEffect(() => {
    if (editingLaneId === null) {
      return
    }
    laneTitleInputRef.current?.focus()
    laneTitleInputRef.current?.select()
  }, [editingLaneId])

  useEffect(() => {
    const resolveLaneUnderPointer = (
      clientX: number,
      clientY: number,
    ): DashboardLaneId | null => {
      for (const lane of lanes) {
        const boardRect = laneBoardRefByLane.current[lane.id]?.getBoundingClientRect() ?? null
        if (
          boardRect !== null &&
          clientX >= boardRect.left &&
          clientX <= boardRect.right &&
          clientY >= boardRect.top &&
          clientY <= boardRect.bottom
        ) {
          return lane.id
        }
      }
      return null
    }

    const handlePointerMove = (event: PointerEvent) => {
      const laneResizeState = laneResizeStateRef.current
      if (laneResizeState !== null && laneResizeState.pointerId === event.pointerId) {
        const pairWidth = laneResizeState.originLeftWidth + laneResizeState.originRightWidth
        if (pairWidth > 0) {
          const minimumWidth = resolveMinimumLaneResizeWidth(pairWidth)
          const nextLeftWidth = Math.max(
            minimumWidth,
            Math.min(
              pairWidth - minimumWidth,
              laneResizeState.originLeftWidth + (event.clientX - laneResizeState.originClientX),
            ),
          )
          const nextRightWidth = pairWidth - nextLeftWidth
          const nextPairWeight =
            laneResizeState.originLeftWeight + laneResizeState.originRightWeight
          setAdjacentLaneWidths(
            laneResizeState.leftLaneId,
            laneResizeState.rightLaneId,
            (nextPairWeight * nextLeftWidth) / pairWidth,
            (nextPairWeight * nextRightWidth) / pairWidth,
          )
        }
        event.preventDefault()
        return
      }
      const lanePanState = lanePanStateRef.current
      if (lanePanState !== null && lanePanState.pointerId === event.pointerId) {
        const nextPanX = lanePanState.originPanX + (event.clientX - lanePanState.originClientX)
        const nextPanY = lanePanState.originPanY + (event.clientY - lanePanState.originClientY)
        setLaneCameras((current) => ({
          ...current,
          [lanePanState.laneId]: {
            ...(current[lanePanState.laneId] ?? defaultLaneCamera()),
            panX: Math.round(nextPanX),
            panY: Math.round(nextPanY),
          },
        }))
        event.preventDefault()
        return
      }
      const resizeState = resizeStateRef.current
      if (resizeState !== null && resizeState.pointerId === event.pointerId) {
        const boardRect = laneBoardRefByLane.current[resizeState.laneId]?.getBoundingClientRect() ?? null
        if (boardRect === null) {
          return
        }
        const laneCamera = laneCameraRef.current[resizeState.laneId] ?? defaultLaneCamera()
        const nextPointerWorld = toLaneWorldPoint(event.clientX, event.clientY, boardRect, laneCamera)
        const nextFrame = resolveResizedStickyNoteFrame({
          originLayout: resizeState.originLayout,
          direction: resizeState.direction,
          deltaX: nextPointerWorld.x - resizeState.originPointerWorldX,
          deltaY: nextPointerWorld.y - resizeState.originPointerWorldY,
        })
        const nextPreviewLayout: DashboardStickyNoteLayout = {
          noteId: resizeState.noteId,
          laneId: resizeState.originLayout.laneId,
          x: nextFrame.x,
          y: nextFrame.y,
          width: nextFrame.width,
          height: nextFrame.height,
          ...(typeof stickyNoteLayoutsRef.current[resizeState.noteId]?.parentNoteId === 'string'
            ? { parentNoteId: stickyNoteLayoutsRef.current[resizeState.noteId]?.parentNoteId }
            : {}),
        }
        resizePreviewRef.current = nextPreviewLayout
        setResizePreviewLayout((currentLayout) => {
          if (
            currentLayout?.x === nextPreviewLayout.x &&
            currentLayout?.y === nextPreviewLayout.y &&
            currentLayout?.width === nextPreviewLayout.width &&
            currentLayout?.height === nextPreviewLayout.height
          ) {
            return currentLayout
          }
          return nextPreviewLayout
        })
        event.preventDefault()
        return
      }
      const selectionGesture = selectionGestureRef.current
      if (selectionGesture !== null && selectionGesture.pointerId === event.pointerId) {
        selectionGesture.currentX = event.clientX
        selectionGesture.currentY = event.clientY
        const laneBoard = laneBoardRefByLane.current[selectionGesture.laneId]
        if (laneBoard !== null) {
          const boardRect = laneBoard.getBoundingClientRect()
          const laneCamera = laneCameraRef.current[selectionGesture.laneId] ?? defaultLaneCamera()
          const startWorld = toLaneWorldPoint(
            selectionGesture.startX,
            selectionGesture.startY,
            boardRect,
            laneCamera,
          )
          const currentWorld = toLaneWorldPoint(event.clientX, event.clientY, boardRect, laneCamera)
          const nextSelectionBounds = resolveSelectionBounds(
            startWorld.x,
            startWorld.y,
            currentWorld.x,
            currentWorld.y,
          )
          setSelectionBox({
            laneId: selectionGesture.laneId,
            ...nextSelectionBounds,
          })
        }
        event.preventDefault()
        return
      }
      const dragState = dragStateRef.current
      if (dragState === null || dragState.pointerId !== event.pointerId) {
        return
      }
      const nextLaneId =
        dragState.movementMode === 'selection'
          ? dragState.activeLane
          : resolveLaneUnderPointer(event.clientX, event.clientY) ?? dragState.activeLane
      const boardRect = laneBoardRefByLane.current[nextLaneId]?.getBoundingClientRect() ?? null
      if (boardRect === null) {
        return
      }
      const nextCamera = laneCameraRef.current[nextLaneId] ?? defaultLaneCamera()
      const nextPointerWorld = toLaneWorldPoint(event.clientX, event.clientY, boardRect, nextCamera)
      const anchorOriginLayout = dragState.originLayoutsByNoteId[dragState.noteId]
      if (anchorOriginLayout === undefined) {
        return
      }
      const nextAnchorPosition = clampStickyNotePosition(
        nextPointerWorld.x - dragState.pointerOffsetX,
        nextPointerWorld.y - dragState.pointerOffsetY,
        resolveStickyNoteDimensions(anchorOriginLayout),
      )
      const nextDelta = clampGroupMovementDelta(
        dragState.originLayoutsByNoteId,
        nextAnchorPosition.x - anchorOriginLayout.x,
        nextAnchorPosition.y - anchorOriginLayout.y,
      )
      dragState.activeLane = nextLaneId
      const nextLayoutsByNoteId = Object.fromEntries(
        Object.values(dragState.originLayoutsByNoteId).map((layout) => [
          layout.noteId,
          {
            noteId: layout.noteId,
            laneId: nextLaneId,
            x: Math.round(layout.x + nextDelta.deltaX),
            y: Math.round(layout.y + nextDelta.deltaY),
            width: layout.width,
            height: layout.height,
            ...(typeof layout.parentNoteId === 'string' ? { parentNoteId: layout.parentNoteId } : {}),
          },
        ]),
      ) as Record<string, DashboardDragPreviewLayout>
      const nextPreview = {
        activeLaneId: nextLaneId,
        layoutsByNoteId: nextLayoutsByNoteId,
      }
      dragPreviewRef.current = nextPreview
      setDragPreview((currentPreview) => {
        if (JSON.stringify(currentPreview) === JSON.stringify(nextPreview)) {
          return currentPreview
        }
        return nextPreview
      })
    }
    const handlePointerFinish = (event: PointerEvent) => {
      const laneResizeState = laneResizeStateRef.current
      if (laneResizeState !== null && laneResizeState.pointerId === event.pointerId) {
        laneResizeStateRef.current = null
        setResizingLanePair(null)
        return
      }
      const resizeState = resizeStateRef.current
      if (resizeState !== null && resizeState.pointerId === event.pointerId) {
        const finalPreview = resizePreviewRef.current
        if (finalPreview !== null) {
          commitDashboardStickyNoteFrameWithHistory(finalPreview.noteId, {
            x: finalPreview.x,
            y: finalPreview.y,
            width: finalPreview.width ?? stickyNoteWidth,
            height: finalPreview.height ?? stickyNoteHeight,
          })
        }
        resizeStateRef.current = null
        resizePreviewRef.current = null
        setResizePreviewLayout(null)
        setResizingNoteId(null)
        return
      }
      const lanePanState = lanePanStateRef.current
      if (lanePanState !== null && lanePanState.pointerId === event.pointerId) {
        lanePanStateRef.current = null
        setPanningLaneId(null)
        return
      }
      const selectionGesture = selectionGestureRef.current
      if (selectionGesture !== null && selectionGesture.pointerId === event.pointerId) {
        const laneBoard = laneBoardRefByLane.current[selectionGesture.laneId]
        if (laneBoard !== null) {
          const boardRect = laneBoard.getBoundingClientRect()
          const laneCamera = laneCameraRef.current[selectionGesture.laneId] ?? defaultLaneCamera()
          const startWorld = toLaneWorldPoint(
            selectionGesture.startX,
            selectionGesture.startY,
            boardRect,
            laneCamera,
          )
          const endWorld = toLaneWorldPoint(
            selectionGesture.currentX,
            selectionGesture.currentY,
            boardRect,
            laneCamera,
          )
          const nextSelectionBounds = resolveSelectionBounds(
            startWorld.x,
            startWorld.y,
            endWorld.x,
            endWorld.y,
          )
          const movedEnough = nextSelectionBounds.width >= 4 || nextSelectionBounds.height >= 4
          if (movedEnough) {
            setSelectedNoteIds(
              (pinnedNotesByLane[selectionGesture.laneId] ?? [])
                .filter((note) => {
                  const layout = effectiveStickyNoteLayoutsByNoteId[note.id]
                  if (layout === undefined) {
                    return false
                  }
                  const noteBounds = resolveStickyNoteBounds(layout)
                  return !(
                    noteBounds.right < nextSelectionBounds.left ||
                    noteBounds.left > nextSelectionBounds.left + nextSelectionBounds.width ||
                    noteBounds.bottom < nextSelectionBounds.top ||
                    noteBounds.top > nextSelectionBounds.top + nextSelectionBounds.height
                  )
                })
                .map((note) => note.id),
            )
          } else {
            setSelectedNoteIds([])
          }
        } else {
          setSelectedNoteIds([])
        }
        selectionGestureRef.current = null
        setSelectionBox(null)
        return
      }
      const dragState = dragStateRef.current
      if (dragState === null || dragState.pointerId !== event.pointerId) {
        return
      }
      const finalPreview = dragPreviewRef.current
      if (finalPreview !== null) {
        commitDashboardStickyNotePlacementsWithHistory(Object.values(finalPreview.layoutsByNoteId), {
          attachmentParentChange: {
            noteId: dragState.noteId,
            parentNoteId: resolveDropAttachmentParentNoteId({
              draggedNoteId: dragState.noteId,
              draggedNoteIds: dragState.draggedNoteIds,
              layoutsByNoteId: {
                ...stickyNoteLayoutsRef.current,
                ...finalPreview.layoutsByNoteId,
              },
            }),
          },
        })
      }
      dragStateRef.current = null
      dragPreviewRef.current = null
      setDragPreview(null)
      setDraggingNoteIds([])
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerFinish)
    window.addEventListener('pointercancel', handlePointerFinish)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerFinish)
      window.removeEventListener('pointercancel', handlePointerFinish)
    }
  }, [lanes, setAdjacentLaneWidths])

  const effectiveStickyNoteLayoutsByNoteId = useMemo(() => {
    const nextLayoutsByNoteId =
      dragPreview === null
        ? { ...stickyNoteLayoutsByNoteId }
        : {
            ...stickyNoteLayoutsByNoteId,
            ...dragPreview.layoutsByNoteId,
          }
    if (resizePreviewLayout !== null) {
      nextLayoutsByNoteId[resizePreviewLayout.noteId] = resizePreviewLayout
    }
    return nextLayoutsByNoteId
  }, [dragPreview, resizePreviewLayout, stickyNoteLayoutsByNoteId])

  const fallbackLaneId = lanes[0]?.id ?? 'todo'
  const pinnedNotesByLane = useMemo(
    () =>
      Object.fromEntries(
          lanes.map((lane) => [
            lane.id,
            sortLaneStickyNotesForRender(
              pinnedNotes.filter(
                (note) =>
                  (effectiveStickyNoteLayoutsByNoteId[note.id]?.laneId ?? fallbackLaneId) === lane.id,
              ),
              effectiveStickyNoteLayoutsByNoteId,
              liftedStickyNoteId,
            ),
          ]),
        ) as Record<DashboardLaneId, typeof pinnedNotes>,
      [effectiveStickyNoteLayoutsByNoteId, fallbackLaneId, lanes, liftedStickyNoteId, pinnedNotes],
    )
  const selectedNoteIdsByLane = useMemo(
    () =>
      Object.fromEntries(
        lanes.map((lane) => [
          lane.id,
          selectedNoteIds.filter((noteId) => {
            const layout = effectiveStickyNoteLayoutsByNoteId[noteId]
            return layout !== undefined && layout.laneId === lane.id
          }),
        ]),
      ) as Record<DashboardLaneId, string[]>,
    [effectiveStickyNoteLayoutsByNoteId, lanes, selectedNoteIds],
  )

  const findLane = (laneId: DashboardLaneId): DashboardLaneRecord | null =>
    lanes.find((lane) => lane.id === laneId) ?? null

  const resolveLaneTitle = (laneId: DashboardLaneId): string => findLane(laneId)?.title ?? 'Lane'

  const handleCreateLaneAfter = (laneId: DashboardLaneId) => {
    createDashboardLaneAfterWithHistory(laneId, 'New lane')
  }

  const handleCreateStickyNoteInLane = (laneId: DashboardLaneId) => {
    const noteId = createNote({
      title: '',
      body: '',
      isPinned: true,
    })
    const nextPlacement = resolveStickyNoteDefaultPlacement(
      noteId,
      laneId,
      (pinnedNotesByLane[laneId] ?? []).length,
    )
    setStickyNotePlacement(noteId, laneId, nextPlacement.x, nextPlacement.y)
    setPendingBodyFocusNoteId(noteId)
  }

  const handleRenameStickyNote = (noteId: string, title: string) => {
    const currentNote = useNotepadStore.getState().notesById[noteId] ?? null
    if (currentNote === null) {
      return
    }
    commitNoteTextFieldWithHistory(noteId, 'title', currentNote.title, title, {
      updatedAtBefore: currentNote.updatedAt,
    })
  }

  const handleUpdateStickyNoteBody = (noteId: string, body: string) => {
    const currentNote = useNotepadStore.getState().notesById[noteId] ?? null
    if (currentNote === null) {
      return
    }
    commitNoteTextFieldWithHistory(noteId, 'body', currentNote.body, body, {
      updatedAtBefore: currentNote.updatedAt,
    })
  }

  const handleStartLaneRename = (laneId: DashboardLaneId) => {
    const lane = findLane(laneId)
    if (lane === null) {
      return
    }
    setEditingLaneId(laneId)
    setEditingLaneTitleDraft(lane.title)
  }

  const handleCancelLaneRename = () => {
    setEditingLaneId(null)
    setEditingLaneTitleDraft('')
  }

  const handleCommitLaneRename = (laneId: DashboardLaneId, rawTitle?: string) => {
    const lane = findLane(laneId)
    if (lane === null) {
      handleCancelLaneRename()
      return
    }
    const trimmedTitle = (rawTitle ?? editingLaneTitleDraft).trim()
    renameDashboardLaneWithHistory(laneId, trimmedTitle.length > 0 ? trimmedTitle : lane.title)
    handleCancelLaneRename()
  }

  const handleAlignSelectedNotes = (
    laneId: DashboardLaneId,
    direction: 'vertical' | 'horizontal',
  ) => {
    const selectedLayouts = (selectedNoteIdsByLane[laneId] ?? [])
      .map((noteId) => effectiveStickyNoteLayoutsByNoteId[noteId] ?? null)
      .filter((layout): layout is DashboardStickyNoteLayout => layout !== null)
    if (selectedLayouts.length < 2) {
      return
    }
    const anchorLayout =
      direction === 'vertical'
        ? [...selectedLayouts].sort(sortLayoutsForVerticalAlign)[0]
        : [...selectedLayouts].sort(sortLayoutsForHorizontalAlign)[0]
    if (anchorLayout === undefined) {
      return
    }
    const command = direction === 'vertical' ? 'align-vertical' : 'align-horizontal'
    if (smartAlignEnabledByLane[laneId] === true) {
      commitDashboardBoardPlacementCommandWithHistory(
        command,
        resolveSmartAlignedPlacements({
          laneId,
          direction,
          layouts: selectedLayouts,
        }),
        { laneId },
      )
      return
    }
    commitDashboardBoardPlacementCommandWithHistory(
      command,
      selectedLayouts.map((layout) => ({
        noteId: layout.noteId,
        laneId,
        x: direction === 'vertical' ? anchorLayout.x : layout.x,
        y: direction === 'horizontal' ? anchorLayout.y : layout.y,
      })),
      { laneId },
    )
  }

  const handleArrangeLaneNotesIntoGrid = (laneId: DashboardLaneId) => {
    const selectedLayouts = (selectedNoteIdsByLane[laneId] ?? [])
      .map((noteId) => effectiveStickyNoteLayoutsByNoteId[noteId] ?? null)
      .filter((layout): layout is DashboardStickyNoteLayout => layout !== null)

    const targetLayouts =
      selectedLayouts.length >= 2
        ? selectedLayouts
        : (pinnedNotesByLane[laneId] ?? [])
            .map((note) => effectiveStickyNoteLayoutsByNoteId[note.id] ?? null)
            .filter((layout): layout is DashboardStickyNoteLayout => layout !== null)

    if (targetLayouts.length < 2) {
      return
    }

    commitDashboardBoardPlacementCommandWithHistory(
      'arrange-grid',
      resolveLaneGridPlacements(laneId, targetLayouts),
      { laneId },
    )
  }

  const resolveMigrationDestination = (
    laneId: DashboardLaneId,
    response: string,
  ): DashboardLaneRecord | null => {
    const normalizedResponse = response.trim().toLowerCase()
    return (
      lanes.find((lane) => lane.id !== laneId && lane.id.toLowerCase() === normalizedResponse) ??
      lanes.find((lane) => lane.id !== laneId && lane.title.trim().toLowerCase() === normalizedResponse) ??
      null
    )
  }

  const handleDeleteLane = (laneId: DashboardLaneId) => {
    if (lanes.length <= 1) {
      return
    }
    const defaultDestinationLane = lanes.find((lane) => lane.id !== laneId) ?? null
    if (defaultDestinationLane === null) {
      return
    }
    const laneNotes = pinnedNotesByLane[laneId] ?? []
    let destinationLaneId = defaultDestinationLane.id
    if (laneNotes.length > 0) {
      if (typeof window === 'undefined' || typeof window.prompt !== 'function') {
        return
      }
      const response = window.prompt(
        `Move notes from "${resolveLaneTitle(laneId)}" to which lane?`,
        defaultDestinationLane.title,
      )
      if (response === null) {
        return
      }
      const resolvedDestinationLane = resolveMigrationDestination(laneId, response)
      if (resolvedDestinationLane === null) {
        return
      }
      destinationLaneId = resolvedDestinationLane.id
    }
    if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
      const confirmed = window.confirm(`Delete lane "${resolveLaneTitle(laneId)}"?`)
      if (!confirmed) {
        return
      }
    }
    removeDashboardLaneWithHistory(laneId, destinationLaneId)
  }

  const fitLaneToNotes = (laneId: DashboardLaneId) => {
    const laneBoard = laneBoardRefByLane.current[laneId]
    if (laneBoard === null || (pinnedNotesByLane[laneId] ?? []).length === 0) {
      return
    }
    const boardRect = laneBoard.getBoundingClientRect()
    const viewport = resolveLaneViewport(boardRect)
    const noteBounds = (pinnedNotesByLane[laneId] ?? []).reduce<{
      left: number
      top: number
      right: number
      bottom: number
    } | null>((currentBounds, note) => {
      const layout =
        effectiveStickyNoteLayoutsByNoteId[note.id] ??
        resolveStickyNoteDefaultPlacement(note.id, laneId, 0)
      const nextBounds = resolveStickyNoteBounds(layout)
      if (currentBounds === null) {
        return nextBounds
      }
      return {
        left: Math.min(currentBounds.left, nextBounds.left),
        top: Math.min(currentBounds.top, nextBounds.top),
        right: Math.max(currentBounds.right, nextBounds.right),
        bottom: Math.max(currentBounds.bottom, nextBounds.bottom),
      }
    }, null)
    if (noteBounds === null) {
      return
    }
    const currentCamera = laneCameraRef.current[laneId] ?? defaultLaneCamera()
    const nextCamera =
      laneZoomUnlockedById[laneId] === true
        ? fitLaneCameraToNoteBoundsWithZoom(noteBounds, viewport)
        : fitLaneCameraToNoteBounds(noteBounds, viewport, currentCamera.zoom)
    setLaneCameras((current) => ({
      ...current,
      [laneId]: nextCamera,
    }))
  }

  const handleLaneZoomWheel = (laneId: DashboardLaneId, event: ReactWheelEvent<HTMLDivElement>) => {
    if (laneZoomUnlockedById[laneId] !== true) {
      return
    }
    const laneBoard = laneBoardRefByLane.current[laneId]
    if (laneBoard === null) {
      return
    }
    const boardRect = laneBoard.getBoundingClientRect()
    const viewport = resolveLaneViewport(boardRect)
    const currentCamera = laneCameraRef.current[laneId] ?? defaultLaneCamera()
    const zoomDirection = event.deltaY < 0 ? 1 : -1
    const nextZoom = clampLaneZoom(currentCamera.zoom + zoomDirection * dashboardLaneZoomStep)
    if (nextZoom === currentCamera.zoom) {
      event.preventDefault()
      return
    }
    const pointerWorld = toLaneWorldPoint(event.clientX, event.clientY, boardRect, currentCamera)
    const nextPanX = event.clientX - boardRect.left - pointerWorld.x * nextZoom
    const nextPanY = event.clientY - boardRect.top - pointerWorld.y * nextZoom
    setLaneCameras((current) => ({
      ...current,
      [laneId]: clampLaneCamera(nextPanX, nextPanY, nextZoom, viewport),
    }))
    event.preventDefault()
  }

  const boardTemplateColumns = useMemo(
    () =>
      lanes
        .flatMap((lane, index) =>
          index === lanes.length - 1
            ? [`minmax(0, ${lane.width}fr)`]
            : [`minmax(0, ${lane.width}fr)`, `${dashboardLaneResizeColumnWidth}px`],
        )
        .join(' '),
    [lanes],
  )

  return (
    <div
      className="WorkspaceViewportSlotSurface WorkspaceViewportSlotSurface--dashboard DashboardSurface"
      data-workspace-surface-instance-id={surfaceInstanceId}
      data-dashboard-host-mode={hostMode}
      onPointerDownCapture={onActivate}
    >
      <div className="DashboardSurfaceCanvas">
        <div
          className="DashboardSurfaceBoard"
          data-dashboard-board="true"
          role="region"
          aria-label="Dashboard sticky note board"
          style={{
            gridTemplateColumns: boardTemplateColumns,
          }}
        >
          {lanes.map((lane, laneIndex) => (
            <Fragment key={lane.id}>
              {(() => {
                const selectedNoteIdsInLane = selectedNoteIdsByLane[lane.id] ?? []
                const alignActionsEnabled = selectedNoteIdsInLane.length >= 2
                const laneNoteCount = (pinnedNotesByLane[lane.id] ?? []).length
                return (
              <section
                ref={(element) => {
                  laneSurfaceRefByLane.current[lane.id] = element
                }}
                className="DashboardSurfaceLane"
                data-dashboard-lane={lane.id}
                aria-label={`${lane.title} sticky notes`}
              >
                <div className="DashboardSurfaceLaneHeader">
                  <div className="DashboardSurfaceLaneTitleGroup">
                    {editingLaneId === lane.id ? (
                      <input
                        id={laneTitleInputId}
                        ref={laneTitleInputRef}
                        type="text"
                        className="DashboardSurfaceLaneTitleInput"
                        data-dashboard-lane-title-input={lane.id}
                        aria-label={`Rename ${lane.title} lane`}
                        value={editingLaneTitleDraft}
                        onChange={(event) => {
                          setEditingLaneTitleDraft(event.currentTarget.value)
                        }}
                        onBlur={(event) => {
                          handleCommitLaneRename(lane.id, event.currentTarget.value)
                        }}
                        onKeyDown={(event: ReactKeyboardEvent<HTMLInputElement>) => {
                          if (event.key === 'Enter') {
                            event.preventDefault()
                            handleCommitLaneRename(lane.id, event.currentTarget.value)
                          }
                          if (event.key === 'Escape') {
                            event.preventDefault()
                            handleCancelLaneRename()
                          }
                        }}
                      />
                    ) : (
                      <button
                        type="button"
                        className="DashboardSurfaceLaneTitleButton"
                        data-dashboard-lane-title-button={lane.id}
                        onClick={() => {
                          handleStartLaneRename(lane.id)
                        }}
                      >
                        <span className="DashboardSurfaceLaneTitle">{lane.title}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      className="DashboardSurfaceLaneFitButton"
                      data-dashboard-lane-fit-button={lane.id}
                      aria-label={`Fit ${lane.title} notes into view`}
                      disabled={(pinnedNotesByLane[lane.id] ?? []).length === 0}
                      onClick={() => {
                        fitLaneToNotes(lane.id)
                      }}
                    >
                      <svg
                        className="DashboardSurfaceLaneFitIcon"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M7 3.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7Zm-5 3.5a5 5 0 1 1 9.1 2.9l2 2a.75.75 0 1 1-1.06 1.06l-2-2A5 5 0 0 1 2 7Z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className={`DashboardSurfaceLaneFitButton${
                        laneZoomUnlockedById[lane.id] === true ? ' isUnlocked' : ''
                      }`}
                      data-dashboard-lane-zoom-lock-button={lane.id}
                      aria-label={`${
                        laneZoomUnlockedById[lane.id] === true ? 'Lock' : 'Unlock'
                      } zoom for ${lane.title}`}
                      aria-pressed={laneZoomUnlockedById[lane.id] === true}
                      onClick={() => {
                        setLaneZoomUnlockedById((current) => ({
                          ...current,
                          [lane.id]: !(current[lane.id] ?? false),
                        }))
                      }}
                    >
                      <svg
                        className="DashboardSurfaceLaneFitIcon"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                        focusable="false"
                      >
                        {laneZoomUnlockedById[lane.id] === true ? (
                          <path
                            d="M5.25 6V4.75a2.75 2.75 0 1 1 5.5 0v.5a.75.75 0 0 1-1.5 0v-.5a1.25 1.25 0 0 0-2.5 0V6h3.75c.69 0 1.25.56 1.25 1.25v4.5c0 .69-.56 1.25-1.25 1.25h-7A1.25 1.25 0 0 1 2.25 11.75v-4.5C2.25 6.56 2.81 6 3.5 6h1.75Z"
                            fill="currentColor"
                          />
                        ) : (
                          <path
                            d="M5.25 6V4.75a2.75 2.75 0 1 1 5.5 0V6h.75c.69 0 1.25.56 1.25 1.25v4.5c0 .69-.56 1.25-1.25 1.25h-7A1.25 1.25 0 0 1 2.25 11.75v-4.5C2.25 6.56 2.81 6 3.5 6h1.75Zm1.5 0h2.5V4.75a1.25 1.25 0 1 0-2.5 0V6Z"
                            fill="currentColor"
                          />
                        )}
                      </svg>
                    </button>
                    <button
                      type="button"
                      className={`DashboardSurfaceLaneHeaderButton${
                        smartAlignEnabledByLane[lane.id] === true ? ' isActive' : ''
                      }`}
                      data-dashboard-lane-smart-align-button={lane.id}
                      aria-label={`${
                        smartAlignEnabledByLane[lane.id] === true ? 'Disable' : 'Enable'
                      } smart align for ${lane.title}`}
                      aria-pressed={smartAlignEnabledByLane[lane.id] === true}
                      onClick={() => {
                        setSmartAlignEnabledByLane((current) => ({
                          ...current,
                          [lane.id]: !(current[lane.id] ?? false),
                        }))
                      }}
                    >
                      Smart
                    </button>
                    <button
                      type="button"
                      className="DashboardSurfaceLaneFitButton"
                      data-dashboard-lane-align-vertical-button={lane.id}
                      aria-label={`Align selected ${lane.title} notes vertically`}
                      disabled={!alignActionsEnabled}
                      onClick={() => {
                        handleAlignSelectedNotes(lane.id, 'vertical')
                      }}
                    >
                      <svg
                        className="DashboardSurfaceLaneFitIcon"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M8.75 2a.75.75 0 0 0-1.5 0v12a.75.75 0 0 0 1.5 0V2ZM4 4.25a.75.75 0 0 0 0 1.5h2.25v-1.5H4Zm0 6a.75.75 0 0 0 0 1.5h2.25v-1.5H4Zm5.75-6v1.5H12a.75.75 0 0 0 0-1.5H9.75Zm0 6v1.5H12a.75.75 0 0 0 0-1.5H9.75Z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="DashboardSurfaceLaneFitButton"
                      data-dashboard-lane-grid-button={lane.id}
                      aria-label={`Arrange ${lane.title} notes into a grid`}
                      disabled={laneNoteCount === 0}
                      onClick={() => {
                        handleArrangeLaneNotesIntoGrid(lane.id)
                      }}
                    >
                      <svg
                        className="DashboardSurfaceLaneFitIcon"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M3 2.75A.75.75 0 0 0 2.25 3.5v2A.75.75 0 0 0 3 6.25h2A.75.75 0 0 0 5.75 5.5v-2A.75.75 0 0 0 5 2.75H3Zm4 0a.75.75 0 0 0-.75.75v2A.75.75 0 0 0 7 6.25h2a.75.75 0 0 0 .75-.75v-2A.75.75 0 0 0 9 2.75H7Zm4 0a.75.75 0 0 0-.75.75v2a.75.75 0 0 0 .75.75h2a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 0-.75-.75h-2ZM3 7.25a.75.75 0 0 0-.75.75v2c0 .41.34.75.75.75h2a.75.75 0 0 0 .75-.75V8A.75.75 0 0 0 5 7.25H3Zm4 0a.75.75 0 0 0-.75.75v2c0 .41.34.75.75.75h2a.75.75 0 0 0 .75-.75V8A.75.75 0 0 0 9 7.25H7Zm4 0a.75.75 0 0 0-.75.75v2c0 .41.34.75.75.75h2a.75.75 0 0 0 .75-.75V8a.75.75 0 0 0-.75-.75h-2Z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="DashboardSurfaceLaneFitButton"
                      data-dashboard-lane-align-horizontal-button={lane.id}
                      aria-label={`Align selected ${lane.title} notes horizontally`}
                      disabled={!alignActionsEnabled}
                      onClick={() => {
                        handleAlignSelectedNotes(lane.id, 'horizontal')
                      }}
                    >
                      <svg
                        className="DashboardSurfaceLaneFitIcon"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M2 8.75a.75.75 0 0 1 0-1.5h12a.75.75 0 0 1 0 1.5H2ZM4.25 4a.75.75 0 0 1 1.5 0v2.25h-1.5V4Zm0 5.75h1.5V12a.75.75 0 0 1-1.5 0V9.75Zm6-5.75a.75.75 0 0 1 1.5 0v2.25h-1.5V4Zm0 5.75h1.5V12a.75.75 0 0 1-1.5 0V9.75Z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="DashboardSurfaceLaneHeaderButton DashboardSurfaceLaneHeaderButton--secondary"
                      data-dashboard-lane-delete-button={lane.id}
                      disabled={lanes.length <= 1}
                      onClick={() => {
                        handleDeleteLane(lane.id)
                      }}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="DashboardSurfaceLaneFitButton"
                      data-dashboard-lane-add-note-button={lane.id}
                      aria-label={`Add sticky note to ${lane.title}`}
                      title={`Add sticky note to ${lane.title}`}
                      onClick={() => {
                        handleCreateStickyNoteInLane(lane.id)
                      }}
                    >
                      <svg
                        className="DashboardSurfaceLaneFitIcon"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M4 2.75A1.75 1.75 0 0 0 2.25 4.5v7A1.75 1.75 0 0 0 4 13.25h6.5a1.75 1.75 0 0 0 1.75-1.75V9.75a.75.75 0 0 0-1.5 0v1.75a.25.25 0 0 1-.25.25H4a.25.25 0 0 1-.25-.25v-7A.25.25 0 0 1 4 4.25h3a.75.75 0 0 0 0-1.5H4Z"
                          fill="currentColor"
                        />
                        <path
                          d="M11 2.25a.75.75 0 0 1 .75.75v1.5h1.5a.75.75 0 0 1 0 1.5h-1.5v1.5a.75.75 0 0 1-1.5 0V6H8.75a.75.75 0 0 1 0-1.5h1.5V3a.75.75 0 0 1 .75-.75Z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="DashboardSurfaceLaneFitButton"
                      data-dashboard-lane-add-lane-button={lane.id}
                      aria-label={`Add lane after ${lane.title}`}
                      title={`Add lane after ${lane.title}`}
                      onClick={() => {
                        handleCreateLaneAfter(lane.id)
                      }}
                    >
                      <svg
                        className="DashboardSurfaceLaneFitIcon"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M3.25 3.75a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-8.5Zm5.5 0a.5.5 0 0 1 .5-.5h1v9.5h-1a.5.5 0 0 1-.5-.5v-8.5Z"
                          fill="currentColor"
                        />
                        <path
                          d="M12.25 6.25a.75.75 0 0 1 .75.75v1h1a.75.75 0 0 1 0 1.5h-1v1a.75.75 0 0 1-1.5 0v-1h-1a.75.75 0 0 1 0-1.5h1V7a.75.75 0 0 1 .75-.75Z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  </div>
                  <span className="DashboardSurfaceLaneCount">
                    {laneNoteCount} note
                    {laneNoteCount === 1 ? '' : 's'}
                  </span>
                </div>
                <div
                  ref={(element) => {
                    laneBoardRefByLane.current[lane.id] = element
                  }}
                  className={`DashboardSurfaceLaneBoard${
                    draggingNoteIds.length > 0 && dragPreview?.activeLaneId === lane.id ? ' isDropTarget' : ''
                  }${panningLaneId === lane.id ? ' isPanning' : ''}`}
                  data-dashboard-lane-board={lane.id}
                  onPointerDown={(event: ReactPointerEvent<HTMLDivElement>) => {
                    const stickyNoteTarget =
                      event.target instanceof Element &&
                      event.target.closest('.DashboardStickyNote') !== null
                    if (event.button === 0) {
                      if (stickyNoteTarget) {
                        return
                      }
                      const laneBoard = laneBoardRefByLane.current[lane.id]
                      if (laneBoard === null) {
                        return
                      }
                      selectionGestureRef.current = {
                        laneId: lane.id,
                        pointerId: event.pointerId,
                        startX: event.clientX,
                        startY: event.clientY,
                        currentX: event.clientX,
                        currentY: event.clientY,
                      }
                      const boardRect = laneBoard.getBoundingClientRect()
                      const laneCamera = laneCameraRef.current[lane.id] ?? defaultLaneCamera()
                      const startWorld = toLaneWorldPoint(
                        event.clientX,
                        event.clientY,
                        boardRect,
                        laneCamera,
                      )
                      setSelectionBox({
                        laneId: lane.id,
                        left: startWorld.x,
                        top: startWorld.y,
                        width: 0,
                        height: 0,
                      })
                      event.preventDefault()
                      return
                    }
                    if (event.button !== 1) {
                      return
                    }
                    if (stickyNoteTarget) {
                      return
                    }
                    const laneBoard = laneBoardRefByLane.current[lane.id]
                    if (laneBoard === null) {
                      return
                    }
                    const laneCamera = laneCameraRef.current[lane.id] ?? defaultLaneCamera()
                    lanePanStateRef.current = {
                      laneId: lane.id,
                      pointerId: event.pointerId,
                      originClientX: event.clientX,
                      originClientY: event.clientY,
                      originPanX: laneCamera.panX,
                      originPanY: laneCamera.panY,
                    }
                    setPanningLaneId(lane.id)
                    event.preventDefault()
                  }}
                  onWheel={(event) => {
                    handleLaneZoomWheel(lane.id, event)
                  }}
                >
                  {(() => {
                    const laneCamera = laneCameras[lane.id] ?? defaultLaneCamera()
                    return (
                  <div
                    className="DashboardSurfaceLaneStage"
                    data-dashboard-lane-stage={lane.id}
                    data-dashboard-camera-x={laneCamera.panX}
                    data-dashboard-camera-y={laneCamera.panY}
                    data-dashboard-camera-zoom={laneCamera.zoom}
                    style={{
                      width: `${laneWorldWidth}px`,
                      height: `${laneWorldHeight}px`,
                      transform: `translate(${laneCamera.panX}px, ${laneCamera.panY}px) scale(${laneCamera.zoom})`,
                    }}
                  >
                  {(pinnedNotesByLane[lane.id] ?? []).length === 0 ? (
                    <div className="DashboardSurfaceLaneEmptyState">
                      {lane.id === 'todo'
                        ? 'Sticky notes land here. Pinned notes start here before they are finished.'
                        : lane.id === 'completed'
                          ? 'Move completed notes here to keep the board tidy.'
                          : 'This lane is ready for pinned notes.'}
                    </div>
                  ) : null}
                  {selectionBox !== null && selectionBox.laneId === lane.id ? (
                    <div
                      className="DashboardSurfaceSelectionBox"
                      data-dashboard-selection-box={lane.id}
                      style={{
                        left: `${selectionBox.left}px`,
                        top: `${selectionBox.top}px`,
                        width: `${selectionBox.width}px`,
                        height: `${selectionBox.height}px`,
                      }}
                    />
                  ) : null}
                  {(pinnedNotesByLane[lane.id] ?? []).map((note, index) => {
                    const stickyNoteLayout =
                      effectiveStickyNoteLayoutsByNoteId[note.id] ??
                      resolveStickyNoteDefaultPlacement(note.id, lane.id, index)
                    const stickyNoteDimensions = resolveStickyNoteDimensions(stickyNoteLayout)
                    return (
                      <DashboardStickyNoteCard
                        key={note.id}
                        note={note}
                        laneTitle={resolveLaneTitle(stickyNoteLayout.laneId)}
                        x={stickyNoteLayout.x}
                        y={stickyNoteLayout.y}
                        width={stickyNoteDimensions.width}
                        height={stickyNoteDimensions.height}
                        isDragging={draggingNoteIds.includes(note.id)}
                        isSelected={selectedNoteIds.includes(note.id)}
                        autoFocusBody={pendingBodyFocusNoteId === note.id}
                        onConsumeAutoFocusBody={() => {
                          setPendingBodyFocusNoteId((currentNoteId) =>
                            currentNoteId === note.id ? null : currentNoteId,
                          )
                        }}
                        onSelectNotePointerDown={() => {
                          setSelectedNoteIds((currentSelectedNoteIds) =>
                            currentSelectedNoteIds.includes(note.id) ? currentSelectedNoteIds : [note.id],
                          )
                        }}
                        onToggleFocusLift={(noteId) => {
                          setLiftedStickyNoteId((currentNoteId) =>
                            currentNoteId === noteId ? null : noteId,
                          )
                        }}
                        onTitleBarPointerDown={(event: ReactPointerEvent<HTMLDivElement>) => {
                            if (event.button !== 0) {
                              return
                            }
                            const selectedNoteIdsInLane = selectedNoteIds.includes(note.id)
                              ? selectedNoteIds.filter(
                                  (selectedNoteId) =>
                                    (effectiveStickyNoteLayoutsByNoteId[selectedNoteId]?.laneId ?? fallbackLaneId) ===
                                    stickyNoteLayout.laneId,
                                )
                              : [note.id]
                            const attachmentSubtreeNoteIds = resolveAttachmentSubtreeNoteIds(
                              note.id,
                              effectiveStickyNoteLayoutsByNoteId,
                            )
                            const movementMode: DashboardDragMovementMode =
                              attachmentSubtreeNoteIds.length > 1
                                ? 'attachment'
                                : selectedNoteIdsInLane.length > 1
                                  ? 'selection'
                                  : 'single'
                            const draggedNoteIds =
                              movementMode === 'attachment'
                                ? attachmentSubtreeNoteIds
                                : movementMode === 'selection'
                                  ? selectedNoteIdsInLane
                                  : [note.id]
                            const originLayoutsByNoteId = Object.fromEntries(
                              draggedNoteIds.map((draggedNoteId) => {
                                const draggedNoteLayout =
                                  effectiveStickyNoteLayoutsByNoteId[draggedNoteId] ?? {
                                    noteId: draggedNoteId,
                                    laneId: stickyNoteLayout.laneId,
                                    x: stickyNoteLayout.x,
                                    y: stickyNoteLayout.y,
                                  }
                                return [
                                  draggedNoteId,
                                  {
                                    noteId: draggedNoteId,
                                    laneId: draggedNoteLayout.laneId,
                                    x: draggedNoteLayout.x,
                                    y: draggedNoteLayout.y,
                                    width: resolveStickyNoteDimensions(draggedNoteLayout).width,
                                    height: resolveStickyNoteDimensions(draggedNoteLayout).height,
                                    ...(typeof draggedNoteLayout.parentNoteId === 'string'
                                      ? { parentNoteId: draggedNoteLayout.parentNoteId }
                                      : {}),
                                  },
                                ]
                              }),
                            ) as Record<string, DashboardDragPreviewLayout>
                            const boardRect =
                              laneBoardRefByLane.current[stickyNoteLayout.laneId]?.getBoundingClientRect() ?? null
                            if (boardRect === null) {
                              return
                            }
                            const laneCamera =
                              laneCameraRef.current[stickyNoteLayout.laneId] ?? defaultLaneCamera()
                            const pointerWorld = toLaneWorldPoint(
                              event.clientX,
                              event.clientY,
                              boardRect,
                              laneCamera,
                            )
                            dragStateRef.current = {
                              noteId: note.id,
                              pointerId: event.pointerId,
                              pointerOffsetX: pointerWorld.x - stickyNoteLayout.x,
                              pointerOffsetY: pointerWorld.y - stickyNoteLayout.y,
                              activeLane: stickyNoteLayout.laneId,
                              movementMode,
                              draggedNoteIds,
                              originLayoutsByNoteId,
                            }
                            dragPreviewRef.current = {
                              activeLaneId: stickyNoteLayout.laneId,
                              layoutsByNoteId: originLayoutsByNoteId,
                            }
                            setDragPreview(dragPreviewRef.current)
                            setDraggingNoteIds(draggedNoteIds)
                            event.preventDefault()
                          }}
                        onResizeHandlePointerDown={(direction, event) => {
                          if (event.button !== 0) {
                            return
                          }
                          const boardRect =
                            laneBoardRefByLane.current[stickyNoteLayout.laneId]?.getBoundingClientRect() ?? null
                          if (boardRect === null) {
                            return
                          }
                          const laneCamera =
                            laneCameraRef.current[stickyNoteLayout.laneId] ?? defaultLaneCamera()
                          const pointerWorld = toLaneWorldPoint(
                            event.clientX,
                            event.clientY,
                            boardRect,
                            laneCamera,
                          )
                          resizeStateRef.current = {
                            noteId: note.id,
                            pointerId: event.pointerId,
                            laneId: stickyNoteLayout.laneId,
                            direction,
                            originPointerWorldX: pointerWorld.x,
                            originPointerWorldY: pointerWorld.y,
                            originLayout: {
                              noteId: note.id,
                              laneId: stickyNoteLayout.laneId,
                              x: stickyNoteLayout.x,
                              y: stickyNoteLayout.y,
                              width: stickyNoteDimensions.width,
                              height: stickyNoteDimensions.height,
                            },
                          }
                          resizePreviewRef.current = {
                            noteId: note.id,
                            laneId: stickyNoteLayout.laneId,
                            x: stickyNoteLayout.x,
                            y: stickyNoteLayout.y,
                            width: stickyNoteDimensions.width,
                            height: stickyNoteDimensions.height,
                            ...('parentNoteId' in stickyNoteLayout &&
                            typeof stickyNoteLayout.parentNoteId === 'string'
                              ? { parentNoteId: stickyNoteLayout.parentNoteId }
                              : {}),
                          }
                          setResizePreviewLayout(resizePreviewRef.current)
                          setResizingNoteId(note.id)
                          event.preventDefault()
                          event.stopPropagation()
                        }}
                        onOpenInNotepad={onOpenNoteInNotepad}
                        onUnpin={(noteId) => setNotePinned(noteId, false)}
                        onRenameNote={handleRenameStickyNote}
                        onUpdateNoteBody={handleUpdateStickyNoteBody}
                        onSetNoteColorPreset={setNoteColorPreset}
                      />
                    )
                  })}
                  </div>
                    )
                  })()}
                </div>
              </section>
                )
              })()}
              {laneIndex < lanes.length - 1 ? (
                <div
                  key={`${lane.id}-resize-handle`}
                  className={`DashboardSurfaceLaneResizeColumn${
                    resizingLanePair?.leftLaneId === lane.id ? ' isActive' : ''
                  }`}
                >
                  <div
                    role="separator"
                    aria-orientation="vertical"
                    className="DashboardSurfaceLaneResizeHandle"
                    data-dashboard-lane-resize-handle={`${lane.id}:${lanes[laneIndex + 1]?.id ?? ''}`}
                    onPointerDown={(event: ReactPointerEvent<HTMLDivElement>) => {
                      if (event.button !== 0) {
                        return
                      }
                      const leftLane = lane
                      const rightLane = lanes[laneIndex + 1] ?? null
                      if (rightLane === null) {
                        return
                      }
                      const leftRect =
                        laneSurfaceRefByLane.current[leftLane.id]?.getBoundingClientRect() ?? null
                      const rightRect =
                        laneSurfaceRefByLane.current[rightLane.id]?.getBoundingClientRect() ?? null
                      if (leftRect === null || rightRect === null) {
                        return
                      }
                      laneResizeStateRef.current = {
                        leftLaneId: leftLane.id,
                        rightLaneId: rightLane.id,
                        pointerId: event.pointerId,
                        originClientX: event.clientX,
                        originLeftWidth: leftRect.width,
                        originRightWidth: rightRect.width,
                        originLeftWeight: leftLane.width,
                        originRightWeight: rightLane.width,
                      }
                      setResizingLanePair({
                        leftLaneId: leftLane.id,
                        rightLaneId: rightLane.id,
                      })
                      event.preventDefault()
                      event.stopPropagation()
                    }}
                  />
                </div>
              ) : null}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
