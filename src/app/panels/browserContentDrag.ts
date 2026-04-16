import type {
  BrowserDraggableTarget,
  BrowserDraggableTargetDropResolution,
  ProjectContentDropPosition,
  ProjectContentOwnerDropTarget,
  ProjectContentOwnerTarget,
} from '../store/useAppStore'
import type { BrowserRenderableRowVm } from './selectBrowserTreeRows'

export type BrowserContentDragIntent = 'none' | 'before' | 'after' | 'into' | 'invalid'
export type BrowserContentDragPhase = 'pending' | 'active'

type BrowserContentPreviewRowVm = Pick<
  BrowserRenderableRowVm,
  'rowId' | 'depth' | 'isExpandable' | 'isExpanded' | 'rowKind'
>

export type BrowserContentPointer = {
  x: number
  y: number
}

export type BrowserContentRowMetric = {
  rowId: string
  depth: number
  isExpandable: boolean
  isExpanded: boolean
  rowKind: BrowserRenderableRowVm['rowKind']
  top: number
  left: number
  width: number
  height: number
}

type BrowserContentDropResolver = (
  draggedTarget: BrowserDraggableTarget,
  dropTarget: ProjectContentOwnerDropTarget,
) => BrowserDraggableTargetDropResolution

type BrowserContentOwnerLane = {
  dropTarget: ProjectContentOwnerDropTarget
  previewIntent: 'before' | 'after' | 'into'
  previewParentRowId: string | null
  previewAnchorRowId: string
  previewInsertIndex: number
  previewDepth: number
  previewIsCollapsedOwner: boolean
  junctionDepth: number
}

export type BrowserContentDragSession = {
  phase: BrowserContentDragPhase
  pointerId: number
  draggedRowId: string
  draggedRowIds: string[]
  draggedTarget: BrowserDraggableTarget
  draggedTargets: BrowserDraggableTarget[]
  startPointer: BrowserContentPointer
  currentPointer: BrowserContentPointer
  hoveredRowId: string | null
  resolvedIntent: BrowserContentDragIntent
  displayIntent: BrowserContentDragIntent
  resolvedDropTarget: ProjectContentOwnerDropTarget | null
  previewParentRowId: string | null
  previewAnchorRowId: string | null
  previewInsertIndex: number | null
  previewDepth: number | null
  previewIsCollapsedOwner: boolean
  junctionDepth: number | null
  ownerSupportRowId: string | null
  laneCount: number
  activeLaneIndex: number | null
}

const UPPER_DRAG_THRESHOLD_RATIO = 0.28
const LOWER_DRAG_THRESHOLD_RATIO = 0.72
const POINTER_DRAG_THRESHOLD_PX = 6

const createDropTargetKey = (dropTarget: ProjectContentOwnerDropTarget): string => {
  if (dropTarget.kind === 'assembly') {
    return `assembly:${dropTarget.assemblyId}:${dropTarget.position}`
  }
  if (dropTarget.kind === 'component') {
    return `component:${dropTarget.componentId}:${dropTarget.position}`
  }
  return `object:${dropTarget.objectId}:${dropTarget.position}`
}

export const createBrowserContentDragSession = (args: {
  draggedRowId: string
  draggedRowIds?: string[]
  draggedTarget: BrowserDraggableTarget
  draggedTargets?: BrowserDraggableTarget[]
  pointerId: number
  startPointer: BrowserContentPointer
}): BrowserContentDragSession => {
  const draggedRowIds =
    args.draggedRowIds === undefined || args.draggedRowIds.length === 0
      ? [args.draggedRowId]
      : [...new Set(args.draggedRowIds)]
  const draggedTargets =
    args.draggedTargets === undefined || args.draggedTargets.length === 0
      ? [args.draggedTarget]
      : [...args.draggedTargets]
  return {
    phase: 'pending',
    pointerId: args.pointerId,
    draggedRowId: args.draggedRowId,
    draggedRowIds,
    draggedTarget: args.draggedTarget,
    draggedTargets,
    startPointer: args.startPointer,
    currentPointer: args.startPointer,
    hoveredRowId: null,
    resolvedIntent: 'none',
    displayIntent: 'none',
    resolvedDropTarget: null,
    previewParentRowId: null,
    previewAnchorRowId: null,
    previewInsertIndex: null,
    previewDepth: null,
    previewIsCollapsedOwner: false,
    junctionDepth: null,
    ownerSupportRowId: null,
    laneCount: 0,
    activeLaneIndex: null,
  }
}

export const hasBrowserContentDragCrossedThreshold = (
  session: BrowserContentDragSession,
  pointer: BrowserContentPointer,
): boolean => {
  const deltaX = pointer.x - session.startPointer.x
  const deltaY = pointer.y - session.startPointer.y
  return Math.hypot(deltaX, deltaY) >= POINTER_DRAG_THRESHOLD_PX
}

const resolveCandidateDropPositions = (
  offsetY: number,
  rowHeight: number,
): ProjectContentDropPosition[] => {
  const upperThreshold = rowHeight * UPPER_DRAG_THRESHOLD_RATIO
  const lowerThreshold = rowHeight * LOWER_DRAG_THRESHOLD_RATIO
  if (offsetY < upperThreshold) {
    return ['before', 'into']
  }
  if (offsetY > lowerThreshold) {
    return ['after', 'into']
  }
  const middleThreshold = (upperThreshold + lowerThreshold) / 2
  return offsetY <= middleThreshold
    ? ['into', 'before', 'after']
    : ['into', 'after', 'before']
}

type BrowserHoveredRowResolution = {
  hoveredRowId: string
  candidatePositions: ProjectContentDropPosition[]
}

const findContentRowBlockEndIndex = (
  rows: BrowserContentPreviewRowVm[],
  startIndex: number,
): number => {
  const startRow = rows[startIndex]
  if (startRow === undefined) {
    return startIndex
  }
  let blockEndIndex = startIndex
  for (let index = startIndex + 1; index < rows.length; index += 1) {
    const nextRow = rows[index]
    if (nextRow === undefined || nextRow.depth <= startRow.depth) {
      break
    }
    blockEndIndex = index
  }
  return blockEndIndex
}

const findVisibleParentRowIdForContentRow = (
  rows: BrowserContentPreviewRowVm[],
  rowIndex: number,
): string | null => {
  const row = rows[rowIndex]
  if (row === undefined || row.depth === 0) {
    return null
  }
  for (let index = rowIndex - 1; index >= 0; index -= 1) {
    const candidateRow = rows[index]
    if (candidateRow !== undefined && candidateRow.depth === row.depth - 1) {
      return candidateRow.rowId
    }
  }
  return null
}

const resolveHoveredRowResolution = (
  rowMetrics: BrowserContentRowMetric[],
  pointerY: number,
): BrowserHoveredRowResolution | null => {
  if (rowMetrics.length === 0) {
    return null
  }

  const firstMetric = rowMetrics[0]
  if (firstMetric !== undefined && pointerY <= firstMetric.top) {
      return {
        hoveredRowId: firstMetric.rowId,
        candidatePositions: ['before'],
      }
  }

  for (let index = 0; index < rowMetrics.length; index += 1) {
    const metric = rowMetrics[index]
    if (metric === undefined) {
      continue
    }
    const metricBottom = metric.top + metric.height
    if (pointerY >= metric.top && pointerY <= metricBottom) {
      return {
        hoveredRowId: metric.rowId,
        candidatePositions: resolveCandidateDropPositions(pointerY - metric.top, metric.height),
      }
    }

    const nextMetric = rowMetrics[index + 1]
    if (nextMetric === undefined) {
      continue
    }
    if (pointerY > metricBottom && pointerY < nextMetric.top) {
      const gapMidpoint = metricBottom + (nextMetric.top - metricBottom) / 2
      if (pointerY < gapMidpoint) {
        return {
          hoveredRowId: metric.rowId,
          candidatePositions: ['after'],
        }
      }
      return {
        hoveredRowId: nextMetric.rowId,
        candidatePositions: ['before'],
      }
    }
  }

  const lastIndex = rowMetrics.length - 1
  if (lastIndex < 0) {
    return null
  }
  return {
    hoveredRowId: rowMetrics[lastIndex]!.rowId,
    candidatePositions: ['after'],
  }
}

const buildLanePlacement = (args: {
  contentRows: BrowserContentPreviewRowVm[]
  anchorIndex: number
  ownerIndex: number
  previewIntent: 'before' | 'after' | 'into'
}): Omit<BrowserContentOwnerLane, 'dropTarget'> => {
  const { anchorIndex, contentRows, ownerIndex, previewIntent } = args
  const anchorRow = contentRows[anchorIndex]
  const ownerRow = contentRows[ownerIndex]
  if (anchorRow === undefined || ownerRow === undefined) {
    return {
      previewIntent,
      previewParentRowId: null,
      previewAnchorRowId: '',
      previewInsertIndex: anchorIndex,
      previewDepth: 0,
      previewIsCollapsedOwner: false,
      junctionDepth: 0,
    }
  }

  if (previewIntent === 'before') {
    return {
      previewIntent,
      previewParentRowId: findVisibleParentRowIdForContentRow(contentRows, anchorIndex),
      previewAnchorRowId: anchorRow.rowId,
      previewInsertIndex: anchorIndex,
      previewDepth: anchorRow.depth,
      previewIsCollapsedOwner: false,
      junctionDepth: Math.max(0, anchorRow.depth - 1),
    }
  }

  if (previewIntent === 'after') {
    return {
      previewIntent,
      previewParentRowId: findVisibleParentRowIdForContentRow(contentRows, anchorIndex),
      previewAnchorRowId: anchorRow.rowId,
      previewInsertIndex: findContentRowBlockEndIndex(contentRows, anchorIndex) + 1,
      previewDepth: anchorRow.depth,
      previewIsCollapsedOwner: false,
      junctionDepth: Math.max(0, anchorRow.depth - 1),
    }
  }

  return {
    previewIntent,
    previewParentRowId: ownerRow.rowId,
    previewAnchorRowId:
      contentRows[findContentRowBlockEndIndex(contentRows, ownerIndex)]?.rowId ?? ownerRow.rowId,
    previewInsertIndex: findContentRowBlockEndIndex(contentRows, ownerIndex) + 1,
    previewDepth: ownerRow.depth + 1,
    previewIsCollapsedOwner: ownerRow.isExpandable && !ownerRow.isExpanded,
    junctionDepth: ownerRow.depth,
  }
}

const buildOwnerLaneOptions = (args: {
  contentRows: BrowserContentPreviewRowVm[]
  hoveredRowId: string
  candidatePosition: ProjectContentDropPosition
  draggedTargets: BrowserDraggableTarget[]
  resolveRowTarget: (rowId: string) => ProjectContentOwnerTarget | null
  resolveDrop: BrowserContentDropResolver
}): BrowserContentOwnerLane[] => {
  const {
    candidatePosition,
    contentRows,
    draggedTargets,
    hoveredRowId,
    resolveDrop,
    resolveRowTarget,
  } = args

  const hoveredRowIndex = contentRows.findIndex((row) => row.rowId === hoveredRowId)
  if (hoveredRowIndex < 0) {
    return []
  }
  const hoveredRow = contentRows[hoveredRowIndex]
  if (hoveredRow === undefined) {
    return []
  }
  const hoveredParentRowId = findVisibleParentRowIdForContentRow(contentRows, hoveredRowIndex)
  const hoveredParentRowIndex =
    hoveredParentRowId === null
      ? -1
      : contentRows.findIndex((row) => row.rowId === hoveredParentRowId)

  const hoveredTarget = resolveRowTarget(hoveredRow.rowId)
  const lanesByKey = new Map<string, BrowserContentOwnerLane>()
  const isGroupedDrag = draggedTargets.length > 1
  const canResolveDropTarget = (dropTarget: ProjectContentOwnerDropTarget): boolean => {
    if (draggedTargets.length === 0) {
      return false
    }
    if (
      isGroupedDrag &&
      (dropTarget.position !== 'into' ||
        (dropTarget.kind !== 'assembly' && dropTarget.kind !== 'component'))
    ) {
      return false
    }
    return draggedTargets.every((draggedTarget) => resolveDrop(draggedTarget, dropTarget).valid)
  }

  if (hoveredTarget !== null) {
    const directDropTarget = {
      ...hoveredTarget,
      position: candidatePosition,
    } as ProjectContentOwnerDropTarget
    if (canResolveDropTarget(directDropTarget)) {
      lanesByKey.set(createDropTargetKey(directDropTarget), {
        dropTarget: directDropTarget,
        ...buildLanePlacement({
          contentRows,
          anchorIndex: hoveredRowIndex,
          ownerIndex: hoveredRowIndex,
          previewIntent: candidatePosition,
        }),
      })
    }
  }

  if (
    !isGroupedDrag &&
    (candidatePosition === 'before' || candidatePosition === 'after') &&
    hoveredParentRowId !== null &&
    hoveredParentRowIndex >= 0
  ) {
    const hoveredParentTarget = resolveRowTarget(hoveredParentRowId)
    if (hoveredParentTarget !== null) {
      const parentIntoDropTarget = {
        ...hoveredParentTarget,
        position: 'into',
      } as ProjectContentOwnerDropTarget
      if (canResolveDropTarget(parentIntoDropTarget)) {
        lanesByKey.set(
          `${createDropTargetKey(parentIntoDropTarget)}:${candidatePosition}:${hoveredRow.rowId}`,
          {
            dropTarget: parentIntoDropTarget,
            ...buildLanePlacement({
              contentRows,
              anchorIndex: hoveredRowIndex,
              ownerIndex: hoveredParentRowIndex,
              previewIntent: candidatePosition,
            }),
          },
        )
      }
    }
  }

  return [...lanesByKey.values()].sort((left, right) => left.previewDepth - right.previewDepth)
}

export const resolveBrowserContentDragPreviewState = (args: {
  contentRows: BrowserContentPreviewRowVm[]
  rowMetrics: BrowserContentRowMetric[]
  session: BrowserContentDragSession
  pointer: BrowserContentPointer
  resolveRowTarget: (rowId: string) => ProjectContentOwnerTarget | null
  resolveDrop: BrowserContentDropResolver
}): BrowserContentDragSession => {
  const { contentRows, pointer, resolveDrop, resolveRowTarget, rowMetrics, session } = args
  if (rowMetrics.length === 0) {
    return {
      ...session,
      currentPointer: pointer,
      hoveredRowId: null,
      resolvedIntent: 'none',
      displayIntent: 'none',
      resolvedDropTarget: null,
      previewParentRowId: null,
      previewAnchorRowId: null,
      previewInsertIndex: null,
      previewDepth: null,
      previewIsCollapsedOwner: false,
      junctionDepth: null,
      ownerSupportRowId: null,
      laneCount: 0,
      activeLaneIndex: null,
    }
  }

  const hoveredResolution = resolveHoveredRowResolution(rowMetrics, pointer.y)
  if (hoveredResolution === null) {
    return session
  }
  const { candidatePositions, hoveredRowId } = hoveredResolution
  const hoveredMetric = rowMetrics.find((metric) => metric.rowId === hoveredRowId)
  if (hoveredMetric === undefined) {
    return session
  }

  for (const candidatePosition of candidatePositions) {
    const lanes = buildOwnerLaneOptions({
      contentRows,
      hoveredRowId,
      candidatePosition,
      draggedTargets: session.draggedTargets,
      resolveRowTarget,
      resolveDrop,
    })
    if (lanes.length === 0) {
      continue
    }
    const nextLaneIndex = 0
    const activeLane = lanes[nextLaneIndex]
    if (activeLane === undefined) {
      break
    }
    const shouldShowIntoAsLandingSlot = activeLane.previewIntent === 'into'
    const displayIntent = shouldShowIntoAsLandingSlot ? 'after' : activeLane.previewIntent
    const ownerSupportRowId =
      activeLane.dropTarget.position === 'into' &&
      activeLane.previewParentRowId !== null &&
      (activeLane.previewIntent !== 'into' || displayIntent !== 'into')
        ? activeLane.previewParentRowId
        : null
    return {
      ...session,
      phase: 'active',
      currentPointer: pointer,
      hoveredRowId: hoveredMetric.rowId,
      resolvedIntent: activeLane.previewIntent,
      displayIntent,
      resolvedDropTarget: activeLane.dropTarget,
      previewParentRowId: activeLane.previewParentRowId,
      previewAnchorRowId: activeLane.previewAnchorRowId,
      previewInsertIndex: activeLane.previewInsertIndex,
      previewDepth: activeLane.previewDepth,
      previewIsCollapsedOwner: activeLane.previewIsCollapsedOwner,
      junctionDepth: activeLane.junctionDepth,
      ownerSupportRowId,
      laneCount: lanes.length,
      activeLaneIndex: nextLaneIndex,
    }
  }

  return {
    ...session,
    phase: 'active',
    currentPointer: pointer,
    hoveredRowId: hoveredMetric.rowId,
    resolvedIntent: 'invalid',
    displayIntent: 'invalid',
    resolvedDropTarget: null,
    previewParentRowId: null,
    previewAnchorRowId: null,
    previewInsertIndex: null,
    previewDepth: null,
    previewIsCollapsedOwner: false,
    junctionDepth: null,
    ownerSupportRowId: null,
    laneCount: 0,
    activeLaneIndex: null,
  }
}
