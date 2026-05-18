import { Box3, type Camera, Object3D, Vector3 } from 'three'

export type WorkspaceSelectionPick =
  | {
      kind: 'part'
      partKey: string
      faceId?: string
      edgeId?: string
      pointId?: string
      topologyBodyId?: string
    }
  | {
      kind: 'reference-item'
      referenceId: string
    }
  | {
      kind: 'environment-light'
      lightId: string
    }

export type WorkspaceSelectionPickEvent = {
  picks: WorkspaceSelectionPick[]
  ctrlKey: boolean
}

export type WorkspaceSelectionWindowMode = 'window' | 'crossing'

export type WorkspaceSelectionClientPoint = {
  x: number
  y: number
}

export type WorkspaceSelectionClientRect = {
  left: number
  top: number
  right: number
  bottom: number
}

export type WorkspaceSelectionCandidate = {
  pick: WorkspaceSelectionPick
  object: Object3D
}

export const WORKSPACE_SELECTION_DRAG_THRESHOLD_PX = 3

const BOX_CORNERS = [
  new Vector3(),
  new Vector3(),
  new Vector3(),
  new Vector3(),
  new Vector3(),
  new Vector3(),
  new Vector3(),
  new Vector3(),
]

export const hasWorkspaceSelectionDragExceededThreshold = (
  anchorClientX: number,
  anchorClientY: number,
  currentClientX: number,
  currentClientY: number,
  thresholdPx = WORKSPACE_SELECTION_DRAG_THRESHOLD_PX,
): boolean =>
  Math.max(Math.abs(currentClientX - anchorClientX), Math.abs(currentClientY - anchorClientY)) >=
  thresholdPx

export const getWorkspaceSelectionWindowMode = (
  anchor: WorkspaceSelectionClientPoint,
  current: WorkspaceSelectionClientPoint,
): WorkspaceSelectionWindowMode => (current.x < anchor.x ? 'window' : 'crossing')

export const buildWorkspaceSelectionClientRect = (
  anchor: WorkspaceSelectionClientPoint,
  current: WorkspaceSelectionClientPoint,
): WorkspaceSelectionClientRect => ({
  left: Math.min(anchor.x, current.x),
  top: Math.min(anchor.y, current.y),
  right: Math.max(anchor.x, current.x),
  bottom: Math.max(anchor.y, current.y),
})

export const isObjectWorldVisible = (object: Object3D): boolean => {
  let current: Object3D | null = object
  while (current !== null) {
    if (!current.visible) {
      return false
    }
    current = current.parent
  }
  return true
}

export const projectObjectBoundsToClientRect = (
  object: Object3D,
  camera: Camera,
  viewport: {
    width: number
    height: number
  },
): WorkspaceSelectionClientRect | null => {
  if (!isObjectWorldVisible(object) || viewport.width <= 0 || viewport.height <= 0) {
    return null
  }

  const bounds = new Box3().setFromObject(object, true)
  if (bounds.isEmpty()) {
    return null
  }

  camera.updateMatrixWorld(true)
  object.updateWorldMatrix(true, true)

  const { min, max } = bounds
  BOX_CORNERS[0].set(min.x, min.y, min.z)
  BOX_CORNERS[1].set(min.x, min.y, max.z)
  BOX_CORNERS[2].set(min.x, max.y, min.z)
  BOX_CORNERS[3].set(min.x, max.y, max.z)
  BOX_CORNERS[4].set(max.x, min.y, min.z)
  BOX_CORNERS[5].set(max.x, min.y, max.z)
  BOX_CORNERS[6].set(max.x, max.y, min.z)
  BOX_CORNERS[7].set(max.x, max.y, max.z)

  let minX = Number.POSITIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY
  let hasProjectedCorner = false

  for (const corner of BOX_CORNERS) {
    const projected = corner.clone().project(camera)
    if (
      !Number.isFinite(projected.x) ||
      !Number.isFinite(projected.y) ||
      !Number.isFinite(projected.z)
    ) {
      continue
    }
    const clientX = ((projected.x + 1) * 0.5) * viewport.width
    const clientY = ((-projected.y + 1) * 0.5) * viewport.height
    minX = Math.min(minX, clientX)
    minY = Math.min(minY, clientY)
    maxX = Math.max(maxX, clientX)
    maxY = Math.max(maxY, clientY)
    hasProjectedCorner = true
  }

  if (!hasProjectedCorner) {
    return null
  }

  return {
    left: minX,
    top: minY,
    right: maxX,
    bottom: maxY,
  }
}

export const doesWorkspaceSelectionRectMatch = (
  selectionRect: WorkspaceSelectionClientRect,
  candidateRect: WorkspaceSelectionClientRect,
  mode: WorkspaceSelectionWindowMode,
): boolean => {
  if (mode === 'window') {
    return (
      candidateRect.left >= selectionRect.left &&
      candidateRect.right <= selectionRect.right &&
      candidateRect.top >= selectionRect.top &&
      candidateRect.bottom <= selectionRect.bottom
    )
  }

  return !(
    candidateRect.right < selectionRect.left ||
    candidateRect.left > selectionRect.right ||
    candidateRect.bottom < selectionRect.top ||
    candidateRect.top > selectionRect.bottom
  )
}

export const collectWorkspaceSelectionWindowPicks = (
  candidates: WorkspaceSelectionCandidate[],
  camera: Camera,
  viewport: {
    width: number
    height: number
  },
  anchor: WorkspaceSelectionClientPoint,
  current: WorkspaceSelectionClientPoint,
): WorkspaceSelectionPick[] => {
  const selectionRect = buildWorkspaceSelectionClientRect(anchor, current)
  const mode = getWorkspaceSelectionWindowMode(anchor, current)
  const picks: WorkspaceSelectionPick[] = []
  for (const candidate of candidates) {
    const candidateRect = projectObjectBoundsToClientRect(candidate.object, camera, viewport)
    if (candidateRect === null) {
      continue
    }
    if (doesWorkspaceSelectionRectMatch(selectionRect, candidateRect, mode)) {
      picks.push(candidate.pick)
    }
  }
  return picks
}
