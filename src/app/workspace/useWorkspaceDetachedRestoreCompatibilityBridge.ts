import { useEffect } from 'react'
import type { ConsoleWindowMode } from '../console/consoleTypes'
import {
  defaultPrimaryViewportSlotId,
  type WorkspaceDetachedSlotSurfaceState,
} from './workspaceShellTypes'
import type { WorkspaceSplitDockSide } from './workspaceSplitTypes'
import { restoreDetachedSurfaceByKind } from './workspaceSurfaceActions'

type WorkspaceDetachedRestoreCompatibilityBridgeProps = {
  activeDetachedBrowserSurface: WorkspaceDetachedSlotSurfaceState | null
  activeDetachedConsoleSurface: WorkspaceDetachedSlotSurfaceState | null
  browserSlotCount: number
  browserViewportSplitDockSide: WorkspaceSplitDockSide
  browserViewportSplitRatio: number
  consoleSlotCount: number
  consoleWindowMode: ConsoleWindowMode
  isBrowserFloating: boolean
  isBrowserPoppedOut: boolean
  isBrowserViewportSplit: boolean
  setIsBrowserViewportSplit: (isViewportSplit: boolean) => void
  splitViewportSlot: (
    slotId: string,
    splitDockSide: WorkspaceSplitDockSide,
    options?: {
      surfaceKind?: 'browser' | 'console' | 'spaghettiEditor' | 'modelViewer'
      surfaceInstanceId?: string
      preferredRatio?: number
    },
  ) => string | null
}

export function useWorkspaceDetachedRestoreCompatibilityBridge(
  props: WorkspaceDetachedRestoreCompatibilityBridgeProps,
) {
  const {
    activeDetachedBrowserSurface,
    activeDetachedConsoleSurface,
    browserSlotCount,
    browserViewportSplitDockSide,
    browserViewportSplitRatio,
    consoleSlotCount,
    consoleWindowMode,
    isBrowserFloating,
    isBrowserPoppedOut,
    isBrowserViewportSplit,
    setIsBrowserViewportSplit,
    splitViewportSlot,
  } = props

  useEffect(() => {
    if (!isBrowserViewportSplit || browserSlotCount > 0) {
      return
    }
    if (activeDetachedBrowserSurface !== null) {
      restoreDetachedSurfaceByKind('browser', {
        splitDockSide: browserViewportSplitDockSide,
      })
      setIsBrowserViewportSplit(false)
      return
    }
    splitViewportSlot(defaultPrimaryViewportSlotId, browserViewportSplitDockSide, {
      surfaceKind: 'browser',
      preferredRatio: browserViewportSplitRatio,
    })
  }, [
    activeDetachedBrowserSurface,
    browserSlotCount,
    browserViewportSplitDockSide,
    browserViewportSplitRatio,
    isBrowserViewportSplit,
    setIsBrowserViewportSplit,
    splitViewportSlot,
  ])

  useEffect(() => {
    if (
      activeDetachedBrowserSurface === null ||
      isBrowserFloating ||
      isBrowserPoppedOut ||
      isBrowserViewportSplit ||
      browserSlotCount > 0
    ) {
      return
    }
    restoreDetachedSurfaceByKind('browser')
  }, [
    activeDetachedBrowserSurface,
    browserSlotCount,
    isBrowserFloating,
    isBrowserPoppedOut,
    isBrowserViewportSplit,
  ])

  useEffect(() => {
    if (activeDetachedConsoleSurface === null || consoleWindowMode !== 'docked' || consoleSlotCount > 0) {
      return
    }
    restoreDetachedSurfaceByKind('console')
  }, [activeDetachedConsoleSurface, consoleSlotCount, consoleWindowMode])
}
