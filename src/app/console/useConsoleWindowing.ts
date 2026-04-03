import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react'
import {
  type WorkspaceDetachedSlotSurfaceState,
  type WorkspaceViewportSlot,
} from '../workspace/workspaceShellTypes'
import { useWorkspaceChildWindow } from '../workspace/useWorkspaceChildWindow'
import {
  commitWorkspaceSurfaceRootSplit,
  commitWorkspaceSurfaceSlotSplit,
  findSlottedSurfaceInstanceIdByKind,
  floatingConsoleCompatibilitySurfaceInstanceId,
  floatWorkspaceSurface,
  popoutWorkspaceSurface,
} from '../workspace/workspaceSurfaceActions'
import {
  resolveWorkspaceSplitDockPreview,
  type WorkspaceSplitDockPreview,
} from '../workspace/workspaceSplitPreview'
import type { ConsoleFloatingRect, ConsoleWindowMode } from './consoleTypes'

const FLOATING_MIN_WIDTH = 420
const FLOATING_MIN_HEIGHT = 220
const FLOATING_VIEWPORT_MARGIN = 12
const POPOUT_WINDOW_FEATURES =
  'popup=yes,width=1080,height=720,resizable=yes,scrollbars=no'
const CONSOLE_POPOUT_SPEC = {
  childWindowId: 'console-surface-popout',
  owner: 'child-window' as const,
  windowName: 'parahook-console',
  windowTitle: 'ParaHook Console',
  windowFeatures: POPOUT_WINDOW_FEATURES,
}

export type ConsoleSlotHeaderDragSeed = {
  pointerId: number
  clientX: number
  clientY: number
  pointerOffsetX: number
  pointerOffsetY: number
  titleBarHeight: number
}

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

type UseConsoleWindowingOptions = {
  dockRef: RefObject<HTMLDivElement | null>
  floatingRect: ConsoleFloatingRect
  setFloatingRect: (rect: ConsoleFloatingRect) => void
  windowMode: ConsoleWindowMode
  isListMode: boolean
  setExpanded: (expanded: boolean) => void
  switchToDocked: (expanded?: boolean) => void
  switchToFloating: () => void
  switchToPopout: () => void
  switchToList: () => void
  returnFromList: () => void
  handlePopoutWindowClosed: () => void
  onPopoutBlocked?: () => void
  slotHeaderDragSeed: ConsoleSlotHeaderDragSeed | null
  suppressSlotHeaderDragSeedReplay: boolean
  onConsumeSlotHeaderDragSeed?: () => void
  onOpenFloatingSplitMenu?: (
    surfaceInstanceId: string,
    event: ReactMouseEvent<HTMLDivElement>,
  ) => void
  activeDetachedConsoleSurface: WorkspaceDetachedSlotSurfaceState | null
  viewportSlotsById: Record<string, WorkspaceViewportSlot>
}

type UseConsoleWindowingResult = {
  popoutWindow: Window | null
  popoutHost: HTMLElement | null
  workspaceViewportElement: HTMLElement | null
  splitDockPreview: WorkspaceSplitDockPreview | null
  splitDockGhostStyle: CSSProperties | null
  floatingWindowStyle: CSSProperties
  handleFloatingHeaderPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void
  handleFloatingResizePointerDown: (
    event: ReactPointerEvent<HTMLDivElement>,
    direction: ResizeDirection,
  ) => void
  handleFloatToggle: () => void
  handlePopoutToggle: () => void
  handleListToggle: () => void
  handleFloatingClose: () => void
  handlePopoutClose: () => void
  handleListPanelClose: () => void
  handleFloatingHeaderContextMenu: (event: ReactMouseEvent<HTMLDivElement>) => void
}

const clampFloatingRect = (
  nextRect: ConsoleFloatingRect,
  viewportWidth: number,
  viewportHeight: number,
  bounds?: {
    minX?: number
    minY?: number
    maxX?: number
    maxY?: number
  },
): ConsoleFloatingRect => {
  const maxWidth = Math.max(FLOATING_MIN_WIDTH, viewportWidth - FLOATING_VIEWPORT_MARGIN * 2)
  const maxHeight = Math.max(FLOATING_MIN_HEIGHT, viewportHeight - FLOATING_VIEWPORT_MARGIN * 2)
  const width = Math.min(maxWidth, Math.max(FLOATING_MIN_WIDTH, Math.round(nextRect.width)))
  const height = Math.min(maxHeight, Math.max(FLOATING_MIN_HEIGHT, Math.round(nextRect.height)))
  const minX = Math.max(FLOATING_VIEWPORT_MARGIN, Math.round(bounds?.minX ?? FLOATING_VIEWPORT_MARGIN))
  const minY = Math.max(FLOATING_VIEWPORT_MARGIN, Math.round(bounds?.minY ?? FLOATING_VIEWPORT_MARGIN))
  const maxX = Math.max(
    minX,
    Math.min(
      viewportWidth - width - FLOATING_VIEWPORT_MARGIN,
      Math.round(bounds?.maxX ?? viewportWidth - width - FLOATING_VIEWPORT_MARGIN),
    ),
  )
  const maxY = Math.max(
    minY,
    Math.min(
      viewportHeight - height - FLOATING_VIEWPORT_MARGIN,
      Math.round(bounds?.maxY ?? viewportHeight - height - FLOATING_VIEWPORT_MARGIN),
    ),
  )
  return {
    x: Math.max(minX, Math.min(Math.round(nextRect.x), maxX)),
    y: Math.max(minY, Math.min(Math.round(nextRect.y), maxY)),
    width,
    height,
  }
}

const buildSplitDockGhostStyle = (
  splitDockPreview: WorkspaceSplitDockPreview | null,
): CSSProperties | null => {
  if (splitDockPreview === null) {
    return null
  }
  const previewRatio = 0.25
  const splitDividerHeight = 10
  const horizontalPreviewWidth = Math.max(
    0,
    splitDockPreview.rect.width * previewRatio - splitDividerHeight,
  )
  const verticalPreviewHeight = Math.max(
    0,
    splitDockPreview.rect.height * previewRatio - splitDividerHeight,
  )
  if (splitDockPreview.side === 'bottom') {
    return {
      left: `${splitDockPreview.rect.left}px`,
      top: `${splitDockPreview.rect.top + splitDockPreview.rect.height * (1 - previewRatio) + splitDividerHeight}px`,
      width: `${splitDockPreview.rect.width}px`,
      height: `${verticalPreviewHeight}px`,
      right: 'auto',
      bottom: 'auto',
    } as CSSProperties
  }
  if (splitDockPreview.side === 'top') {
    return {
      left: `${splitDockPreview.rect.left}px`,
      top: `${splitDockPreview.rect.top}px`,
      width: `${splitDockPreview.rect.width}px`,
      height: `${verticalPreviewHeight}px`,
      right: 'auto',
      bottom: 'auto',
    } as CSSProperties
  }
  if (splitDockPreview.side === 'right') {
    return {
      left: `${splitDockPreview.rect.left + splitDockPreview.rect.width * (1 - previewRatio) + splitDividerHeight}px`,
      top: `${splitDockPreview.rect.top}px`,
      width: `${horizontalPreviewWidth}px`,
      height: `${splitDockPreview.rect.height}px`,
      right: 'auto',
      bottom: 'auto',
    } as CSSProperties
  }
  return {
    left: `${splitDockPreview.rect.left}px`,
    top: `${splitDockPreview.rect.top}px`,
    width: `${horizontalPreviewWidth}px`,
    height: `${splitDockPreview.rect.height}px`,
    right: 'auto',
    bottom: 'auto',
  } as CSSProperties
}

const commitConsoleWorkspaceSplit = (
  preview: WorkspaceSplitDockPreview,
  activeDetachedConsoleSurface: WorkspaceDetachedSlotSurfaceState | null,
) => {
  const surfaceInstanceId =
    activeDetachedConsoleSurface?.surfaceInstanceId ??
    findSlottedSurfaceInstanceIdByKind('console') ??
    floatingConsoleCompatibilitySurfaceInstanceId
  if (preview.scope === 'global') {
    commitWorkspaceSurfaceRootSplit(surfaceInstanceId, preview.side)
    return
  }
  if (preview.targetSlotId === null) {
    return
  }
  commitWorkspaceSurfaceSlotSplit(surfaceInstanceId, preview.targetSlotId, preview.side)
}

const resolveFloatingSplitSurfaceInstanceId = (
  activeDetachedConsoleSurface: WorkspaceDetachedSlotSurfaceState | null,
): string =>
  activeDetachedConsoleSurface?.surfaceInstanceId ??
  findSlottedSurfaceInstanceIdByKind('console') ??
  floatingConsoleCompatibilitySurfaceInstanceId

export function useConsoleWindowing(
  options: UseConsoleWindowingOptions,
): UseConsoleWindowingResult {
  const {
    dockRef,
    floatingRect,
    setFloatingRect,
    windowMode,
    isListMode,
    setExpanded,
    switchToDocked,
    switchToFloating,
    switchToPopout,
    switchToList,
    returnFromList,
    handlePopoutWindowClosed,
    onPopoutBlocked,
    slotHeaderDragSeed,
    suppressSlotHeaderDragSeedReplay,
    onConsumeSlotHeaderDragSeed,
    onOpenFloatingSplitMenu,
    activeDetachedConsoleSurface,
    viewportSlotsById,
  } = options
  const consumedSlotHeaderDragPointerIdRef = useRef<number | null>(null)
  const splitDockPreviewRef = useRef<WorkspaceSplitDockPreview | null>(null)
  const [splitDockPreview, setSplitDockPreview] = useState<WorkspaceSplitDockPreview | null>(null)

  const resolveFloatingViewportSize = useCallback(() => {
    const dockWidth = dockRef.current?.clientWidth ?? 0
    const dockHeight = dockRef.current?.clientHeight ?? 0
    return {
      width: dockWidth > 0 ? dockWidth : window.innerWidth,
      height: dockHeight > 0 ? dockHeight : window.innerHeight,
    }
  }, [dockRef])

  const resolveFloatingViewportBounds = useCallback(() => {
    const shellElement = dockRef.current
    const primaryViewportBodyCandidate = document.querySelector(
      '.ViewportFrame.isPrimarySlot .ViewportFrameBody',
    )
    const primaryViewportBodyElement =
      primaryViewportBodyCandidate instanceof HTMLElement ? primaryViewportBodyCandidate : null
    const shellRect = shellElement?.getBoundingClientRect()
    const primaryViewportBodyRect = primaryViewportBodyElement?.getBoundingClientRect()
    if (
      shellElement === null ||
      shellRect === undefined ||
      primaryViewportBodyRect === undefined ||
      primaryViewportBodyRect.width <= 0 ||
      primaryViewportBodyRect.height <= 0
    ) {
      return null
    }
    return {
      minX: 0,
      minY: Math.round(primaryViewportBodyRect.top - shellRect.top),
      maxX: shellElement.clientWidth - FLOATING_VIEWPORT_MARGIN,
      maxY: Math.round(primaryViewportBodyRect.bottom - shellRect.top) - FLOATING_VIEWPORT_MARGIN,
    }
  }, [dockRef])

  const clampConsoleFloatingRect = useCallback(
    (nextRect: ConsoleFloatingRect, viewportWidth: number, viewportHeight: number) =>
      clampFloatingRect(
        nextRect,
        viewportWidth,
        viewportHeight,
        resolveFloatingViewportBounds() ?? undefined,
      ),
    [resolveFloatingViewportBounds],
  )

  const { childWindow: popoutWindow, host: popoutHost } = useWorkspaceChildWindow({
    isOpen: windowMode === 'popout',
    spec: CONSOLE_POPOUT_SPEC,
    rootClassName: 'ConsolePopoutRoot',
    onBlocked: onPopoutBlocked,
    onClosed: handlePopoutWindowClosed,
  })

  const resolveWorkspaceViewportElement = useCallback(
    () => document.querySelector('.ViewportArea') as HTMLElement | null,
    [],
  )

  const resolveConsoleSplitDockPreview = useCallback(
    (pointerClientX: number, pointerClientY: number): WorkspaceSplitDockPreview | null =>
      resolveWorkspaceSplitDockPreview(
        resolveWorkspaceViewportElement(),
        viewportSlotsById,
        pointerClientX,
        pointerClientY,
      ),
    [resolveWorkspaceViewportElement, viewportSlotsById],
  )

  const beginFloatingHeaderDrag = useCallback(
    (
      startRect: ConsoleFloatingRect,
      seed: Pick<
        ConsoleSlotHeaderDragSeed,
        'clientX' | 'clientY' | 'pointerOffsetX' | 'pointerOffsetY'
      >,
    ) => {
      const move = (moveEvent: PointerEvent) => {
        const viewportSize = resolveFloatingViewportSize()
        setFloatingRect(
          clampConsoleFloatingRect(
            {
              ...startRect,
              x: moveEvent.clientX - seed.pointerOffsetX,
              y: moveEvent.clientY - seed.pointerOffsetY,
            },
            viewportSize.width,
            viewportSize.height,
          ),
        )
        const nextSplitDockPreview = resolveConsoleSplitDockPreview(
          moveEvent.clientX,
          moveEvent.clientY,
        )
        splitDockPreviewRef.current = nextSplitDockPreview
        setSplitDockPreview(nextSplitDockPreview)
      }
      const stop = () => {
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', handlePointerUp)
        window.removeEventListener('pointercancel', handlePointerCancel)
      }
      const handlePointerUp = (upEvent: PointerEvent) => {
        const nextSplitDockPreview =
          splitDockPreviewRef.current ??
          resolveConsoleSplitDockPreview(upEvent.clientX, upEvent.clientY)
        stop()
        splitDockPreviewRef.current = null
        setSplitDockPreview(null)
        if (nextSplitDockPreview !== null) {
          commitConsoleWorkspaceSplit(nextSplitDockPreview, activeDetachedConsoleSurface)
        }
      }
      const handlePointerCancel = () => {
        stop()
        splitDockPreviewRef.current = null
        setSplitDockPreview(null)
      }
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', handlePointerUp)
      window.addEventListener('pointercancel', handlePointerCancel)
    },
    [
      activeDetachedConsoleSurface,
      clampConsoleFloatingRect,
      resolveConsoleSplitDockPreview,
      resolveFloatingViewportSize,
      setFloatingRect,
    ],
  )

  const handleFloatingHeaderPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement | null
      if (target?.closest('button, input, select') !== null) {
        return
      }
      event.preventDefault()
      event.stopPropagation()
      beginFloatingHeaderDrag(floatingRect, {
        clientX: event.clientX,
        clientY: event.clientY,
        pointerOffsetX: event.clientX - floatingRect.x,
        pointerOffsetY: event.clientY - floatingRect.y,
      })
    },
    [beginFloatingHeaderDrag, floatingRect],
  )

  useLayoutEffect(() => {
    if (suppressSlotHeaderDragSeedReplay) {
      return
    }
    if (windowMode !== 'floating' || slotHeaderDragSeed === null) {
      return
    }
    if (consumedSlotHeaderDragPointerIdRef.current === slotHeaderDragSeed.pointerId) {
      return
    }
    consumedSlotHeaderDragPointerIdRef.current = slotHeaderDragSeed.pointerId
    const viewportSize = resolveFloatingViewportSize()
    const seededRect = clampConsoleFloatingRect(
      {
        ...floatingRect,
        x: slotHeaderDragSeed.clientX - slotHeaderDragSeed.pointerOffsetX,
        y: slotHeaderDragSeed.clientY - slotHeaderDragSeed.pointerOffsetY,
      },
      viewportSize.width,
      viewportSize.height,
    )
    setFloatingRect(seededRect)
    beginFloatingHeaderDrag(seededRect, slotHeaderDragSeed)
    onConsumeSlotHeaderDragSeed?.()
  }, [
    beginFloatingHeaderDrag,
    clampConsoleFloatingRect,
    floatingRect,
    onConsumeSlotHeaderDragSeed,
    resolveFloatingViewportSize,
    setFloatingRect,
    slotHeaderDragSeed,
    suppressSlotHeaderDragSeedReplay,
    windowMode,
  ])

  const handleFloatingResizePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>, direction: ResizeDirection) => {
      event.preventDefault()
      event.stopPropagation()
      const startRect = floatingRect
      const startX = event.clientX
      const startY = event.clientY
      const move = (moveEvent: PointerEvent) => {
        const deltaX = moveEvent.clientX - startX
        const deltaY = moveEvent.clientY - startY
        let nextRect = { ...startRect }

        if (direction.includes('e')) {
          nextRect.width = startRect.width + deltaX
        }
        if (direction.includes('s')) {
          nextRect.height = startRect.height + deltaY
        }
        if (direction.includes('w')) {
          nextRect.x = startRect.x + deltaX
          nextRect.width = startRect.width - deltaX
        }
        if (direction.includes('n')) {
          nextRect.y = startRect.y + deltaY
          nextRect.height = startRect.height - deltaY
        }

        const viewportSize = resolveFloatingViewportSize()
        setFloatingRect(
          clampConsoleFloatingRect(nextRect, viewportSize.width, viewportSize.height),
        )
      }
      const stop = () => {
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', stop)
        window.removeEventListener('pointercancel', stop)
      }
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', stop)
      window.addEventListener('pointercancel', stop)
    },
    [clampConsoleFloatingRect, floatingRect, resolveFloatingViewportSize, setFloatingRect],
  )

  const handleFloatToggle = useCallback(() => {
    if (windowMode === 'floating') {
      switchToDocked(true)
      return
    }
    const slottedConsoleSurfaceInstanceId = findSlottedSurfaceInstanceIdByKind('console')
    if (slottedConsoleSurfaceInstanceId !== null) {
      floatWorkspaceSurface(slottedConsoleSurfaceInstanceId)
      return
    }
    switchToFloating()
  }, [switchToDocked, switchToFloating, windowMode])

  const handlePopoutToggle = useCallback(() => {
    if (windowMode === 'popout') {
      switchToDocked(false)
      return
    }
    const slottedConsoleSurfaceInstanceId = findSlottedSurfaceInstanceIdByKind('console')
    if (slottedConsoleSurfaceInstanceId !== null) {
      popoutWorkspaceSurface(slottedConsoleSurfaceInstanceId)
      return
    }
    switchToPopout()
  }, [switchToDocked, switchToPopout, windowMode])

  const handleListToggle = useCallback(() => {
    if (isListMode) {
      returnFromList()
      return
    }
    switchToList()
  }, [isListMode, returnFromList, switchToList])

  const handleFloatingClose = useCallback(() => {
    switchToDocked(false)
  }, [switchToDocked])

  const handleFloatingHeaderContextMenu = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (windowMode !== 'floating' || onOpenFloatingSplitMenu === undefined) {
        return
      }
      onOpenFloatingSplitMenu(
        resolveFloatingSplitSurfaceInstanceId(activeDetachedConsoleSurface),
        event,
      )
    },
    [activeDetachedConsoleSurface, onOpenFloatingSplitMenu, windowMode],
  )

  const handlePopoutClose = useCallback(() => {
    switchToDocked(false)
  }, [switchToDocked])

  const handleListPanelClose = useCallback(() => {
    setExpanded(false)
  }, [setExpanded])

  useEffect(() => {
    splitDockPreviewRef.current = splitDockPreview
  }, [splitDockPreview])

  useEffect(() => {
    if (windowMode !== 'floating') {
      return
    }
    const viewportSize = resolveFloatingViewportSize()
    const clamped = clampConsoleFloatingRect(
      floatingRect,
      viewportSize.width,
      viewportSize.height,
    )
    if (
      clamped.x !== floatingRect.x ||
      clamped.y !== floatingRect.y ||
      clamped.width !== floatingRect.width ||
      clamped.height !== floatingRect.height
    ) {
      setFloatingRect(clamped)
    }
  }, [
    clampConsoleFloatingRect,
    floatingRect,
    resolveFloatingViewportSize,
    setFloatingRect,
    windowMode,
  ])

  useEffect(() => {
    if (windowMode !== 'floating' && splitDockPreview !== null) {
      setSplitDockPreview(null)
    }
  }, [splitDockPreview, windowMode])

  const floatingWindowStyle = useMemo(
    () =>
      ({
        left: `${floatingRect.x}px`,
        top: `${floatingRect.y}px`,
        width: `${floatingRect.width}px`,
        height: `${floatingRect.height}px`,
      }) as CSSProperties,
    [floatingRect],
  )

  const splitDockGhostStyle = useMemo(
    () => buildSplitDockGhostStyle(splitDockPreview),
    [splitDockPreview],
  )

  return {
    popoutWindow,
    popoutHost,
    workspaceViewportElement: resolveWorkspaceViewportElement(),
    splitDockPreview,
    splitDockGhostStyle,
    floatingWindowStyle,
    handleFloatingHeaderPointerDown,
    handleFloatingResizePointerDown,
    handleFloatToggle,
    handlePopoutToggle,
    handleListToggle,
    handleFloatingClose,
    handlePopoutClose,
    handleListPanelClose,
    handleFloatingHeaderContextMenu,
  }
}
