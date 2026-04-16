import {
  useCallback,
  useEffect,
  useRef,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react'
import {
  defaultLeftDockWidth,
  type LeftDockPanelId,
  type LeftDockResizeMenuState,
  type WorkspaceSplitMenuState,
} from '../workspace/workspaceShellTypes'

const dockGhostHeight = 72
const minLeftDockWidth = 260
const maxLeftDockWidth = 1000

type DockTargetRect = {
  left: number
  right: number
  top: number
  bottom: number
}

function isPointInsideRect(clientX: number, clientY: number, rect: DockTargetRect | null): boolean {
  if (rect === null) {
    return false
  }
  return (
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom
  )
}

type UseAppShellDockControllerInput = {
  appShellRef: RefObject<HTMLDivElement | null>
  dockedBrowserHostRef: RefObject<HTMLDivElement | null>
  dockedMeatballHostRef: RefObject<HTMLDivElement | null>
  leftDockWidth: number
  setLeftDockWidth: (nextWidth: number) => void
  leftDockResizeMenu: LeftDockResizeMenuState | null
  setLeftDockResizeMenu: (menu: LeftDockResizeMenuState | null) => void
  workspaceSplitMenu: WorkspaceSplitMenuState | null
  setWorkspaceSplitMenu: (menu: WorkspaceSplitMenuState | null) => void
  onLeftDockWidthPreview?: (nextWidth: number) => void
}

export function useAppShellDockController(input: UseAppShellDockControllerInput) {
  const {
    appShellRef,
    dockedBrowserHostRef,
    dockedMeatballHostRef,
    leftDockWidth,
    setLeftDockWidth,
    leftDockResizeMenu,
    setLeftDockResizeMenu,
    workspaceSplitMenu,
    setWorkspaceSplitMenu,
    onLeftDockWidthPreview,
  } = input
  const leftDockResizeRef = useRef<{
    startPointerX: number
    startWidth: number
  } | null>(null)

  const clampLeftDockWidth = useCallback(
    (nextWidth: number) => {
      const shellWidth = appShellRef.current?.clientWidth ?? 1440
      const cappedMaxWidth = Math.min(
        maxLeftDockWidth,
        Math.max(minLeftDockWidth, shellWidth - 50),
      )
      return Math.min(cappedMaxWidth, Math.max(minLeftDockWidth, Math.round(nextWidth)))
    },
    [appShellRef],
  )

  const getLeftDockTargetRect = useCallback(
    (panelId: LeftDockPanelId): DockTargetRect | null => {
      const targetElement =
        panelId === 'browser' ? dockedBrowserHostRef.current : dockedMeatballHostRef.current
      if (targetElement === null) {
        return null
      }
      const targetRect = targetElement.getBoundingClientRect()
      const parentRect = targetElement.parentElement?.getBoundingClientRect()
      const left = targetRect.width > 1 ? targetRect.left : (parentRect?.left ?? targetRect.left)
      const right = targetRect.width > 1 ? targetRect.right : (parentRect?.right ?? targetRect.right)
      const top = targetRect.height > 1 ? targetRect.top : (parentRect?.top ?? targetRect.top)
      const bottom =
        targetRect.height > 1
          ? targetRect.bottom
          : Math.max(
              top + dockGhostHeight,
              parentRect?.bottom ?? top + dockGhostHeight,
            )
      return {
        left,
        right,
        top,
        bottom,
      }
    },
    [dockedBrowserHostRef, dockedMeatballHostRef],
  )

  const getLeftDockStatusRect = useCallback((panelId: LeftDockPanelId): DockTargetRect | null => {
    const targetElement =
      panelId === 'browser' ? dockedBrowserHostRef.current : dockedMeatballHostRef.current
    const statusElement = targetElement
      ?.closest('.PrimaryViewportLeftDock')
      ?.querySelector('.PrimaryViewportLeftDockStatus')
    if (!(statusElement instanceof HTMLElement)) {
      return null
    }
    const rect = statusElement.getBoundingClientRect()
    return {
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom,
    }
  }, [dockedBrowserHostRef, dockedMeatballHostRef])

  const resolveLeftDockPreviewPanelId = useCallback(
    (panelId: LeftDockPanelId, clientX: number, clientY: number): LeftDockPanelId | null =>
      isPointInsideRect(clientX, clientY, getLeftDockTargetRect(panelId)) ||
      isPointInsideRect(clientX, clientY, getLeftDockStatusRect(panelId))
        ? panelId
        : null,
    [getLeftDockStatusRect, getLeftDockTargetRect],
  )

  useEffect(() => {
    if (leftDockResizeMenu === null) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target
      if (
        target instanceof Element &&
        target.closest('.PrimaryViewportLeftDockResizeMenu') !== null
      ) {
        return
      }
      setLeftDockResizeMenu(null)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return
      }
      if (event.key === 'Escape') {
        setLeftDockResizeMenu(null)
      }
    }

    const handleWindowChange = () => {
      setLeftDockResizeMenu(null)
    }

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleWindowChange)
    window.addEventListener('blur', handleWindowChange)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleWindowChange)
      window.removeEventListener('blur', handleWindowChange)
    }
  }, [leftDockResizeMenu, setLeftDockResizeMenu])

  useEffect(() => {
    if (workspaceSplitMenu === null) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target
      if (target instanceof Element && target.closest('.WorkspaceSplitMenu') !== null) {
        return
      }
      setWorkspaceSplitMenu(null)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return
      }
      if (event.key === 'Escape') {
        setWorkspaceSplitMenu(null)
      }
    }

    const handleWindowChange = () => {
      setWorkspaceSplitMenu(null)
    }

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleWindowChange)
    window.addEventListener('blur', handleWindowChange)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleWindowChange)
      window.removeEventListener('blur', handleWindowChange)
    }
  }, [setWorkspaceSplitMenu, workspaceSplitMenu])

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (leftDockResizeRef.current === null) {
        return
      }
      const nextWidth = clampLeftDockWidth(
        leftDockResizeRef.current.startWidth +
          (event.clientX - leftDockResizeRef.current.startPointerX),
      )
      setLeftDockWidth(nextWidth)
      onLeftDockWidthPreview?.(nextWidth)
    }

    const handlePointerUp = () => {
      leftDockResizeRef.current = null
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [clampLeftDockWidth, onLeftDockWidthPreview, setLeftDockWidth])

  const handleLeftDockResizeStart = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) {
        return
      }
      setLeftDockResizeMenu(null)
      leftDockResizeRef.current = {
        startPointerX: event.clientX,
        startWidth: leftDockWidth,
      }
      event.preventDefault()
      event.stopPropagation()
    },
    [leftDockWidth, setLeftDockResizeMenu],
  )

  const handleLeftDockResizeContextMenu = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
      setLeftDockResizeMenu({
        x: event.clientX,
        y: event.clientY,
      })
    },
    [setLeftDockResizeMenu],
  )

  const handleResetLeftDockWidth = useCallback(() => {
    setLeftDockWidth(defaultLeftDockWidth)
    setLeftDockResizeMenu(null)
  }, [setLeftDockResizeMenu, setLeftDockWidth])

  return {
    resolveLeftDockPreviewPanelId,
    handleLeftDockResizeStart,
    handleLeftDockResizeContextMenu,
    handleResetLeftDockWidth,
  }
}
