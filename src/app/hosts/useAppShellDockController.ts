import {
  useCallback,
  useEffect,
  useRef,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react'
import {
  type LeftDockPanelId,
  type LeftDockResizeMenuState,
  type LeftDockVerticalResizeTarget,
  type WorkspaceSplitMenuState,
} from '../workspace/workspaceShellTypes'
import { resetLeftDockWidthWithHistory } from '../store/workspaceLayoutEditHistory'

const dockGhostHeight = 72
const minLeftDockWidth = 260
const maxLeftDockWidth = 1000
const leftDockStackDividerSize = 10
const minLeftDockStackHeight = 250
const maxLeftDockStackHeight = 1200
const minLeftDockPanelHeight = 120

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
  leftDockStackHeight: number
  setLeftDockStackHeight: (nextHeight: number) => void
  setLeftDockStackSplitRatio: (nextRatio: number) => void
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
    leftDockStackHeight,
    setLeftDockStackHeight,
    setLeftDockStackSplitRatio,
    leftDockResizeMenu,
    setLeftDockResizeMenu,
    workspaceSplitMenu,
    setWorkspaceSplitMenu,
    onLeftDockWidthPreview,
  } = input
  const leftDockResizeRef = useRef<
    | {
        target: 'width'
        startPointerX: number
        startWidth: number
      }
    | {
        target: 'stack-height'
        startPointerY: number
        startHeight: number
      }
    | {
        target: 'stack-split'
        stackTop: number
        stackHeight: number
      }
    | null
  >(null)

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

  const clampLeftDockStackHeight = useCallback(
    (nextHeight: number) => {
      const shellHeight = appShellRef.current?.clientHeight ?? 900
      const cappedMaxHeight = Math.min(
        maxLeftDockStackHeight,
        Math.max(minLeftDockStackHeight, shellHeight - 120),
      )
      return Math.min(cappedMaxHeight, Math.max(minLeftDockStackHeight, Math.round(nextHeight)))
    },
    [appShellRef],
  )

  const clampLeftDockStackSplitRatio = useCallback(
    (nextRatio: number, stackHeight: number) => {
      const availableHeight = Math.max(
        minLeftDockPanelHeight * 2,
        stackHeight - leftDockStackDividerSize,
      )
      const minRatio = minLeftDockPanelHeight / availableHeight
      const maxRatio = 1 - minRatio
      return Math.min(maxRatio, Math.max(minRatio, nextRatio))
    },
    [],
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
      if (leftDockResizeRef.current.target === 'width') {
        const nextWidth = clampLeftDockWidth(
          leftDockResizeRef.current.startWidth +
            (event.clientX - leftDockResizeRef.current.startPointerX),
        )
        setLeftDockWidth(nextWidth)
        onLeftDockWidthPreview?.(nextWidth)
        return
      }
      if (leftDockResizeRef.current.target === 'stack-height') {
        const nextHeight = clampLeftDockStackHeight(
          leftDockResizeRef.current.startHeight +
            (event.clientY - leftDockResizeRef.current.startPointerY),
        )
        setLeftDockStackHeight(nextHeight)
        return
      }
      const ratio =
        (event.clientY - leftDockResizeRef.current.stackTop) /
        Math.max(1, leftDockResizeRef.current.stackHeight - leftDockStackDividerSize)
      setLeftDockStackSplitRatio(
        clampLeftDockStackSplitRatio(ratio, leftDockResizeRef.current.stackHeight),
      )
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
  }, [
    clampLeftDockStackHeight,
    clampLeftDockStackSplitRatio,
    clampLeftDockWidth,
    onLeftDockWidthPreview,
    setLeftDockStackHeight,
    setLeftDockStackSplitRatio,
    setLeftDockWidth,
  ])

  const handleLeftDockResizeStart = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) {
        return
      }
      setLeftDockResizeMenu(null)
      const resizeTarget = (
        event.currentTarget.dataset.leftDockResizeTarget as LeftDockVerticalResizeTarget | undefined
      ) ?? 'width'
      if (resizeTarget === 'stack-height') {
        leftDockResizeRef.current = {
          target: 'stack-height',
          startPointerY: event.clientY,
          startHeight: leftDockStackHeight,
        }
      } else if (resizeTarget === 'stack-split') {
        const stackShell = event.currentTarget.closest('.PrimaryViewportLeftDockPanelStackShell')
        const stackRect = stackShell?.getBoundingClientRect()
        leftDockResizeRef.current = {
          target: 'stack-split',
          stackTop: stackRect?.top ?? event.clientY,
          stackHeight: stackRect?.height ?? leftDockStackHeight,
        }
      } else {
        leftDockResizeRef.current = {
          target: 'width',
          startPointerX: event.clientX,
          startWidth: leftDockWidth,
        }
      }
      event.preventDefault()
      event.stopPropagation()
    },
    [leftDockStackHeight, leftDockWidth, setLeftDockResizeMenu],
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
    resetLeftDockWidthWithHistory()
    setLeftDockResizeMenu(null)
  }, [setLeftDockResizeMenu])

  return {
    resolveLeftDockPreviewPanelId,
    handleLeftDockResizeStart,
    handleLeftDockResizeContextMenu,
    handleResetLeftDockWidth,
  }
}
