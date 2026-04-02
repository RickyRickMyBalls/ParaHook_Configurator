import type { WorkspaceViewportSlot } from './workspaceShellTypes'
import type { WorkspaceSplitDockSide } from './workspaceSplitTypes'

export const workspaceSplitPreviewEdgePadding = 14
export const workspaceSplitPreviewOuterBandPadding = 28

export type WorkspaceSplitPreviewScope = 'local' | 'global'

export type WorkspaceSplitDockPreview = {
  side: WorkspaceSplitDockSide
  scope: WorkspaceSplitPreviewScope
  targetSlotId: string | null
  rect: {
    left: number
    top: number
    width: number
    height: number
  }
}

export function resolveWorkspaceSplitDockPreview(
  viewportElement: HTMLElement | null,
  viewportSlotsById: Record<string, WorkspaceViewportSlot>,
  pointerClientX: number,
  pointerClientY: number,
): WorkspaceSplitDockPreview | null {
  const viewportRect = viewportElement?.getBoundingClientRect()
  if (viewportRect === undefined || viewportRect.width <= 0 || viewportRect.height <= 0) {
    return null
  }

  const overshootThreshold = 120
  if (
    pointerClientX < viewportRect.left - overshootThreshold ||
    pointerClientX > viewportRect.right + overshootThreshold ||
    pointerClientY < viewportRect.top - overshootThreshold ||
    pointerClientY > viewportRect.bottom + overshootThreshold
  ) {
    return null
  }

  const hoveredSlotElement =
    typeof document.elementsFromPoint === 'function'
      ? document
          .elementsFromPoint(pointerClientX, pointerClientY)
          .map((element) =>
            element instanceof HTMLElement ? element.closest('[data-workspace-slot-id]') : null,
          )
          .find(
            (element): element is HTMLElement =>
              element instanceof HTMLElement && viewportElement?.contains(element) === true,
          ) ?? null
      : null

  const overshootSide =
    hoveredSlotElement !== null
      ? null
      : pointerClientX >= viewportRect.right &&
          pointerClientX <= viewportRect.right + workspaceSplitPreviewEdgePadding &&
          pointerClientY >= viewportRect.top &&
          pointerClientY <= viewportRect.bottom
        ? 'right'
        : pointerClientX <= viewportRect.left &&
            pointerClientX >= viewportRect.left - workspaceSplitPreviewEdgePadding &&
            pointerClientY >= viewportRect.top &&
            pointerClientY <= viewportRect.bottom
          ? 'left'
          : pointerClientY <= viewportRect.top &&
              pointerClientY >= viewportRect.top - workspaceSplitPreviewEdgePadding &&
              pointerClientX >= viewportRect.left &&
              pointerClientX <= viewportRect.right
            ? 'top'
            : pointerClientY >= viewportRect.bottom &&
                pointerClientY <= viewportRect.bottom + workspaceSplitPreviewEdgePadding &&
                pointerClientX >= viewportRect.left &&
                pointerClientX <= viewportRect.right
              ? 'bottom'
              : null

  if (overshootSide !== null) {
    return {
      side: overshootSide,
      scope: 'global',
      targetSlotId: null,
      rect: {
        left: 0,
        top: 0,
        width: viewportRect.width,
        height: viewportRect.height,
      },
    }
  }

  const hoveredPaneRect = hoveredSlotElement?.getBoundingClientRect() ?? viewportRect
  const hoveredSlotId = hoveredSlotElement?.getAttribute('data-workspace-slot-id') ?? null
  const hoveredSlot = hoveredSlotId === null ? null : viewportSlotsById[hoveredSlotId] ?? null
  const modelViewportBodyRect =
    hoveredSlot?.surfaceKind === 'modelViewer'
      ? hoveredSlotElement?.querySelector('.ViewportFrameBody')?.getBoundingClientRect()
      : null
  const previewRect =
    modelViewportBodyRect !== undefined &&
    modelViewportBodyRect !== null &&
    modelViewportBodyRect.width > 0 &&
    modelViewportBodyRect.height > 0
      ? modelViewportBodyRect
      : hoveredPaneRect

  const clampedPointerClientX = Math.min(
    previewRect.right,
    Math.max(previewRect.left, pointerClientX),
  )
  const clampedPointerClientY = Math.min(
    previewRect.bottom,
    Math.max(previewRect.top, pointerClientY),
  )
  const topEdgeDistance = Math.max(0, clampedPointerClientY - previewRect.top)
  const rightEdgeDistance = Math.max(0, previewRect.right - clampedPointerClientX)
  const bottomEdgeDistance = Math.max(0, previewRect.bottom - clampedPointerClientY)
  const leftEdgeDistance = Math.max(0, clampedPointerClientX - previewRect.left)
  const edgeDistances: Array<{ side: WorkspaceSplitDockSide; distance: number }> = [
    { side: 'top', distance: topEdgeDistance },
    { side: 'right', distance: rightEdgeDistance },
    { side: 'bottom', distance: bottomEdgeDistance },
    { side: 'left', distance: leftEdgeDistance },
  ]
  const previewableEdge = edgeDistances
    .filter((entry) => entry.distance <= workspaceSplitPreviewOuterBandPadding)
    .sort((left, right) => left.distance - right.distance)[0]
  if (previewableEdge === undefined) {
    return null
  }

  const isGlobalPreview =
    previewableEdge.side === 'right'
      ? rightEdgeDistance <= workspaceSplitPreviewEdgePadding
      : previewableEdge.side === 'left'
        ? leftEdgeDistance <= workspaceSplitPreviewEdgePadding
        : previewableEdge.side === 'top'
          ? topEdgeDistance <= workspaceSplitPreviewEdgePadding
          : bottomEdgeDistance <= workspaceSplitPreviewEdgePadding

  return {
    side: previewableEdge.side,
    scope: isGlobalPreview ? 'global' : 'local',
    targetSlotId: isGlobalPreview ? null : hoveredSlotId,
    rect: isGlobalPreview
      ? {
          left: 0,
          top: 0,
          width: viewportRect.width,
          height: viewportRect.height,
        }
      : {
          left: previewRect.left - viewportRect.left,
          top: previewRect.top - viewportRect.top,
          width: previewRect.width,
          height: previewRect.height,
        },
  }
}
