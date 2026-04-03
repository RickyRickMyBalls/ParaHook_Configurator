import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from 'react'
import type { ConsoleFloatingRect } from '../console/consoleTypes'
import { useConsoleStore } from '../console/useConsoleStore'
import {
  commitWorkspaceSurfaceRootSplit,
  commitWorkspaceSurfaceSlotSplit,
} from '../workspace/workspaceSurfaceActions'
import {
  defaultPrimaryViewportSlotId,
  type WorkspaceDetachedSlotSurfaceState,
  type WorkspaceViewportSlot,
} from '../workspace/workspaceShellTypes'
import {
  resolveWorkspaceSplitDockPreview,
  type WorkspaceSplitDockPreview,
} from '../workspace/workspaceSplitPreview'

const consoleFloatingViewportMargin = 12
const consoleFloatingMinWidth = 420
const consoleFloatingMinHeight = 220
const splitDividerHeight = 10

type ViewportSlotHeaderDragOutPayload = {
  pointerId: number
  clientX: number
  clientY: number
  headerRect: DOMRect
  frameRect: DOMRect
}

type UseAppShellConsoleTransitionInput = {
  appShellRef: RefObject<HTMLDivElement | null>
  viewportRef: RefObject<HTMLElement | null>
  viewportSlotsById: Record<string, WorkspaceViewportSlot>
  floatWorkspaceSurface: (
    surfaceInstanceId: string,
  ) => WorkspaceDetachedSlotSurfaceState | null
  setConsoleFloatingRect: (rect: ConsoleFloatingRect) => void
}

function clampConsoleTransitionFloatingRect(
  nextRect: ConsoleFloatingRect,
  viewportWidth: number,
  viewportHeight: number,
  bounds?: {
    minX?: number
    minY?: number
    maxX?: number
    maxY?: number
  },
): ConsoleFloatingRect {
  const maxWidth = Math.max(
    consoleFloatingMinWidth,
    viewportWidth - consoleFloatingViewportMargin * 2,
  )
  const maxHeight = Math.max(
    consoleFloatingMinHeight,
    viewportHeight - consoleFloatingViewportMargin * 2,
  )
  const width = Math.min(maxWidth, Math.max(consoleFloatingMinWidth, Math.round(nextRect.width)))
  const height = Math.min(
    maxHeight,
    Math.max(consoleFloatingMinHeight, Math.round(nextRect.height)),
  )
  const minX = Math.max(
    consoleFloatingViewportMargin,
    Math.round(bounds?.minX ?? consoleFloatingViewportMargin),
  )
  const minY = Math.max(
    consoleFloatingViewportMargin,
    Math.round(bounds?.minY ?? consoleFloatingViewportMargin),
  )
  const maxX = Math.max(
    minX,
    Math.min(
      viewportWidth - width - consoleFloatingViewportMargin,
      Math.round(bounds?.maxX ?? viewportWidth - width - consoleFloatingViewportMargin),
    ),
  )
  const maxY = Math.max(
    minY,
    Math.min(
      viewportHeight - height - consoleFloatingViewportMargin,
      Math.round(bounds?.maxY ?? viewportHeight - height - consoleFloatingViewportMargin),
    ),
  )
  return {
    x: Math.max(minX, Math.min(Math.round(nextRect.x), maxX)),
    y: Math.max(minY, Math.min(Math.round(nextRect.y), maxY)),
    width,
    height,
  }
}

export function useAppShellConsoleTransition(input: UseAppShellConsoleTransitionInput) {
  const { appShellRef, viewportRef, viewportSlotsById, floatWorkspaceSurface, setConsoleFloatingRect } =
    input
  const [consoleTransitionSplitDockPreview, setConsoleTransitionSplitDockPreview] =
    useState<WorkspaceSplitDockPreview | null>(null)
  const [isConsoleTransitionDragActive, setIsConsoleTransitionDragActive] = useState(false)
  const consoleTransitionSplitDockPreviewRef = useRef<WorkspaceSplitDockPreview | null>(null)
  const consoleTransitionDragCleanupRef = useRef<(() => void) | null>(null)

  const resolveConsoleTransitionViewportBounds = useCallback(() => {
    const viewportElement = viewportRef.current
    const shellRect = appShellRef.current?.getBoundingClientRect()
    const viewportRect = viewportElement?.getBoundingClientRect()
    const primaryViewportBodyElement = viewportElement?.querySelector(
      '.ViewportFrame.isPrimarySlot .ViewportFrameBody',
    ) as HTMLElement | null
    const primaryViewportBodyRect = primaryViewportBodyElement?.getBoundingClientRect()
    const viewportWidth =
      shellRect?.width ??
      viewportRect?.width ??
      viewportElement?.clientWidth ??
      window.innerWidth
    const viewportHeight =
      shellRect?.height ??
      viewportRect?.height ??
      viewportElement?.clientHeight ??
      window.innerHeight

    if (
      shellRect === undefined ||
      primaryViewportBodyRect === undefined ||
      primaryViewportBodyRect.width <= 0 ||
      primaryViewportBodyRect.height <= 0
    ) {
      return {
        viewportWidth,
        viewportHeight,
        bounds: undefined,
      }
    }

    return {
      viewportWidth,
      viewportHeight,
      bounds: {
        minX: primaryViewportBodyRect.left - shellRect.left,
        minY: primaryViewportBodyRect.top - shellRect.top,
        maxX: primaryViewportBodyRect.right - shellRect.left,
        maxY: primaryViewportBodyRect.bottom - shellRect.top,
      },
    }
  }, [appShellRef, viewportRef])

  const resolveConsoleTransitionSplitDockPreview = useCallback(
    (pointerClientX: number, pointerClientY: number): WorkspaceSplitDockPreview | null =>
      resolveWorkspaceSplitDockPreview(
        viewportRef.current,
        viewportSlotsById,
        pointerClientX,
        pointerClientY,
      ),
    [viewportRef, viewportSlotsById],
  )

  const commitConsoleTransitionWorkspaceSplit = useCallback(
    (surfaceInstanceId: string, preview: WorkspaceSplitDockPreview) => {
      if (preview.scope === 'global') {
        commitWorkspaceSurfaceRootSplit(surfaceInstanceId, preview.side)
        return
      }
      if (preview.targetSlotId === null) {
        return
      }
      commitWorkspaceSurfaceSlotSplit(surfaceInstanceId, preview.targetSlotId, preview.side)
    },
    [],
  )

  const stopConsoleTransitionDrag = useCallback(() => {
    consoleTransitionDragCleanupRef.current?.()
  }, [])

  useEffect(() => () => stopConsoleTransitionDrag(), [stopConsoleTransitionDrag])

  const consoleTransitionSplitDockGhostStyle = useMemo(() => {
    if (consoleTransitionSplitDockPreview === null) {
      return null
    }
    const previewRatio = 0.25
    const horizontalPreviewWidth = Math.max(
      0,
      consoleTransitionSplitDockPreview.rect.width * previewRatio - splitDividerHeight,
    )
    const verticalPreviewHeight = Math.max(
      0,
      consoleTransitionSplitDockPreview.rect.height * previewRatio - splitDividerHeight,
    )

    if (consoleTransitionSplitDockPreview.side === 'bottom') {
      return {
        left: `${consoleTransitionSplitDockPreview.rect.left}px`,
        top: `${
          consoleTransitionSplitDockPreview.rect.top +
          consoleTransitionSplitDockPreview.rect.height * (1 - previewRatio) +
          splitDividerHeight
        }px`,
        width: `${consoleTransitionSplitDockPreview.rect.width}px`,
        height: `${verticalPreviewHeight}px`,
        right: 'auto',
        bottom: 'auto',
      } satisfies CSSProperties
    }
    if (consoleTransitionSplitDockPreview.side === 'top') {
      return {
        left: `${consoleTransitionSplitDockPreview.rect.left}px`,
        top: `${consoleTransitionSplitDockPreview.rect.top}px`,
        width: `${consoleTransitionSplitDockPreview.rect.width}px`,
        height: `${verticalPreviewHeight}px`,
        right: 'auto',
        bottom: 'auto',
      } satisfies CSSProperties
    }
    if (consoleTransitionSplitDockPreview.side === 'right') {
      return {
        left: `${
          consoleTransitionSplitDockPreview.rect.left +
          consoleTransitionSplitDockPreview.rect.width * (1 - previewRatio) +
          splitDividerHeight
        }px`,
        top: `${consoleTransitionSplitDockPreview.rect.top}px`,
        width: `${horizontalPreviewWidth}px`,
        height: `${consoleTransitionSplitDockPreview.rect.height}px`,
        right: 'auto',
        bottom: 'auto',
      } satisfies CSSProperties
    }
    return {
      left: `${consoleTransitionSplitDockPreview.rect.left}px`,
      top: `${consoleTransitionSplitDockPreview.rect.top}px`,
      width: `${horizontalPreviewWidth}px`,
      height: `${consoleTransitionSplitDockPreview.rect.height}px`,
      right: 'auto',
      bottom: 'auto',
    } satisfies CSSProperties
  }, [consoleTransitionSplitDockPreview])

  const handleConsoleViewportSlotHeaderDragOut = useCallback(
    (slotId: string, payload: ViewportSlotHeaderDragOutPayload) => {
      const slot = viewportSlotsById[slotId] ?? null
      if (
        slot === null ||
        slot.surfaceKind !== 'console' ||
        slotId === defaultPrimaryViewportSlotId
      ) {
        return
      }
      const floatingRect = useConsoleStore.getState().floatingRect
      const floatingSize = {
        width: Math.max(1, Math.round(floatingRect.width)),
        height: Math.max(1, Math.round(floatingRect.height)),
      }
      const pointerOffsetX = Math.min(
        Math.max(16, Math.round(payload.clientX - payload.frameRect.left)),
        Math.max(16, floatingSize.width - 16),
      )
      const pointerOffsetY = Math.min(
        Math.max(0, Math.round(payload.clientY - payload.frameRect.top)),
        Math.max(1, Math.round(payload.headerRect.height)) - 1,
      )
      const shellRect = appShellRef.current?.getBoundingClientRect()
      const { viewportWidth, viewportHeight, bounds } = resolveConsoleTransitionViewportBounds()
      const nextFloatingRect = clampConsoleTransitionFloatingRect(
        {
          ...floatingRect,
          ...floatingSize,
          x:
            shellRect === undefined
              ? floatingRect.x
              : Math.round(payload.clientX - shellRect.left - pointerOffsetX),
          y:
            shellRect === undefined
              ? floatingRect.y
              : Math.round(payload.clientY - shellRect.top - pointerOffsetY),
        },
        viewportWidth,
        viewportHeight,
        bounds,
      )
      stopConsoleTransitionDrag()
      consoleTransitionSplitDockPreviewRef.current = null
      setConsoleTransitionSplitDockPreview(null)
      setIsConsoleTransitionDragActive(true)
      setConsoleFloatingRect(nextFloatingRect)
      floatWorkspaceSurface(slot.surfaceInstanceId)

      let isStopped = false
      const move = (moveEvent: PointerEvent) => {
        if (moveEvent.pointerId !== payload.pointerId) {
          return
        }
        const nextBounds = resolveConsoleTransitionViewportBounds()
        setConsoleFloatingRect(
          clampConsoleTransitionFloatingRect(
            {
              ...nextFloatingRect,
              x:
                shellRect === undefined
                  ? nextFloatingRect.x
                  : Math.round(moveEvent.clientX - shellRect.left - pointerOffsetX),
              y:
                shellRect === undefined
                  ? nextFloatingRect.y
                  : Math.round(moveEvent.clientY - shellRect.top - pointerOffsetY),
            },
            nextBounds.viewportWidth,
            nextBounds.viewportHeight,
            nextBounds.bounds,
          ),
        )
        const nextSplitDockPreview = resolveConsoleTransitionSplitDockPreview(
          moveEvent.clientX,
          moveEvent.clientY,
        )
        consoleTransitionSplitDockPreviewRef.current = nextSplitDockPreview
        setConsoleTransitionSplitDockPreview(nextSplitDockPreview)
      }
      const stop = () => {
        if (isStopped) {
          return
        }
        isStopped = true
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', handlePointerUp)
        window.removeEventListener('pointercancel', handlePointerCancel)
        if (consoleTransitionDragCleanupRef.current === stop) {
          consoleTransitionDragCleanupRef.current = null
        }
        consoleTransitionSplitDockPreviewRef.current = null
        setConsoleTransitionSplitDockPreview(null)
        setIsConsoleTransitionDragActive(false)
      }
      const handlePointerUp = (upEvent: PointerEvent) => {
        if (upEvent.pointerId !== payload.pointerId) {
          return
        }
        const nextSplitDockPreview =
          consoleTransitionSplitDockPreviewRef.current ??
          resolveConsoleTransitionSplitDockPreview(upEvent.clientX, upEvent.clientY)
        stop()
        if (nextSplitDockPreview !== null) {
          commitConsoleTransitionWorkspaceSplit(slot.surfaceInstanceId, nextSplitDockPreview)
        }
      }
      const handlePointerCancel = (cancelEvent?: PointerEvent) => {
        if (cancelEvent !== undefined && cancelEvent.pointerId !== payload.pointerId) {
          return
        }
        stop()
      }

      consoleTransitionDragCleanupRef.current = stop
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', handlePointerUp)
      window.addEventListener('pointercancel', handlePointerCancel)
      const initialSplitDockPreview = resolveConsoleTransitionSplitDockPreview(
        payload.clientX,
        payload.clientY,
      )
      consoleTransitionSplitDockPreviewRef.current = initialSplitDockPreview
      setConsoleTransitionSplitDockPreview(initialSplitDockPreview)
    },
    [
      appShellRef,
      commitConsoleTransitionWorkspaceSplit,
      floatWorkspaceSurface,
      resolveConsoleTransitionSplitDockPreview,
      resolveConsoleTransitionViewportBounds,
      setConsoleFloatingRect,
      stopConsoleTransitionDrag,
      viewportSlotsById,
    ],
  )

  return {
    consoleTransitionSplitDockGhostStyle,
    consoleTransitionSplitDockPreview,
    handleConsoleViewportSlotHeaderDragOut,
    isConsoleTransitionDragActive,
  }
}
