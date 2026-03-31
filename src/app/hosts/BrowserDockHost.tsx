import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { BrowserPanel } from '../panels/BrowserPanel'
import { useWorkspaceChildWindow } from '../workspace/useWorkspaceChildWindow'
import { useWorkspaceStore } from '../workspace/useWorkspaceStore'
import {
  defaultBrowserPopoutState,
  defaultBrowserFloatingSize,
  type BrowserFloatingPosition,
  type BrowserFloatingSize,
  type LeftDockPanelId,
} from '../workspace/workspaceShellTypes'
import {
  type WorkspaceSplitDockSide,
} from '../workspace/workspaceSplitTypes'

const minBrowserFloatingWidth = 280
const minBrowserFloatingHeight = 220
const floatingEdgePadding = 12
const browserPopoutBackground = 'rgb(11, 12, 16)'
const browserSplitDividerSize = 10

type BrowserFloatingFrame = {
  shellWidth: number
  shellHeight: number
  minY: number
  maxY: number
}

type BrowserDockHostProps = {
  appShellRef: RefObject<HTMLDivElement | null>
  viewportRef: RefObject<HTMLElement | null>
  viewportSplitHostRef: RefObject<HTMLDivElement | null>
  dockedBrowserHostRef: RefObject<HTMLDivElement | null>
  renderViewportSplitSurface?: boolean
  suppressDockedSurface?: boolean
  resolveLeftDockPreviewPanelId: (
    panelId: LeftDockPanelId,
    clientX: number,
    clientY: number,
  ) => LeftDockPanelId | null
  onActivateBrowserFloatingWindow: () => void
  newEditorSpawnPosition: {
    x: number
    y: number
  }
  workspaceActiveSurface: 'spaghetti' | 'browser' | 'console' | 'viewer' | null
  slotHeaderDragSeed: {
    pointerId: number
    clientX: number
    clientY: number
    pointerOffsetX: number
    pointerOffsetY: number
    titleBarHeight: number
  } | null
  onConsumeSlotHeaderDragSeed: () => void
}

export function BrowserDockHost(props: BrowserDockHostProps) {
  const {
    appShellRef,
    viewportRef,
    viewportSplitHostRef,
    dockedBrowserHostRef,
    renderViewportSplitSurface = true,
    suppressDockedSurface = false,
    resolveLeftDockPreviewPanelId,
    onActivateBrowserFloatingWindow,
    newEditorSpawnPosition,
    workspaceActiveSurface,
    slotHeaderDragSeed,
    onConsumeSlotHeaderDragSeed,
  } = props
  const [dockedBrowserPortalTarget, setDockedBrowserPortalTarget] = useState<HTMLDivElement | null>(null)
  const activeLeftDockPreviewPanelId = useWorkspaceStore(
    (state) => state.activeLeftDockPreviewPanelId,
  )
  const setActiveLeftDockPreviewPanelId = useWorkspaceStore(
    (state) => state.setActiveLeftDockPreviewPanelId,
  )
  const isBrowserFloating = useWorkspaceStore((state) => state.browserShell.isFloating)
  const setIsBrowserFloating = useWorkspaceStore((state) => state.setBrowserFloating)
  const isBrowserPoppedOut = useWorkspaceStore((state) => state.browserShell.isPoppedOut)
  const setIsBrowserPoppedOut = useWorkspaceStore((state) => state.setBrowserPoppedOut)
  const isBrowserViewportSplit = useWorkspaceStore((state) => state.browserShell.isViewportSplit)
  const setIsBrowserViewportSplit = useWorkspaceStore((state) => state.setBrowserViewportSplit)
  const browserPresentationMode = useWorkspaceStore((state) => state.browserShell.presentationMode)
  const isBrowserCollapsed = useWorkspaceStore((state) => state.browserShell.isCollapsed)
  const setBrowserPresentationMode = useWorkspaceStore((state) => state.setBrowserPresentationMode)
  const browserFloatingPos = useWorkspaceStore((state) => state.browserShell.position)
  const setBrowserFloatingPos = useWorkspaceStore((state) => state.setBrowserFloatingPosition)
  const browserFloatingSize = useWorkspaceStore((state) => state.browserShell.size)
  const setBrowserFloatingSize = useWorkspaceStore((state) => state.setBrowserFloatingSize)
  const browserViewportSplitRatio = useWorkspaceStore((state) => state.browserShell.viewportSplitRatio)
  const setBrowserViewportSplitRatio = useWorkspaceStore(
    (state) => state.setBrowserViewportSplitRatio,
  )
  const browserViewportSplitDockSide = useWorkspaceStore(
    (state) => state.browserShell.viewportSplitDockSide,
  )
  const setBrowserViewportSplitDockSide = useWorkspaceStore(
    (state) => state.setBrowserViewportSplitDockSide,
  )
  const browserPopoutState = useWorkspaceStore((state) => state.browserShell.popoutState)
  const setBrowserPopoutState = useWorkspaceStore((state) => state.setBrowserPopoutState)
  const detachedSlotSurfaceById = useWorkspaceStore((state) => state.detachedSlotSurfaceById)
  const clearDetachedSlotSurface = useWorkspaceStore((state) => state.clearDetachedSlotSurface)
  const redockDetachedSurface = useWorkspaceStore((state) => state.redockDetachedSurface)
  const browserFloatingWindowRef = useRef<HTMLDivElement | null>(null)
  const [browserViewportSplitPortalTarget, setBrowserViewportSplitPortalTarget] =
    useState<HTMLDivElement | null>(null)
  const [browserFloatingSplitMenu, setBrowserFloatingSplitMenu] = useState<{
    x: number
    y: number
  } | null>(null)
  const browserFloatingPosRef = useRef(browserFloatingPos)
  const browserFloatingSizeRef = useRef(browserFloatingSize)
  const browserDragRef = useRef<{
    pointerOffsetX: number
    pointerOffsetY: number
    titleBarHeight: number
    sourceKind: 'floating' | 'docked' | 'viewportSplit'
    hasExitedSourceRect: boolean
    sourceRect:
      | {
          left: number
          right: number
          top: number
          bottom: number
        }
      | null
  } | null>(null)
  const browserSplitDockPreviewSideRef = useRef<WorkspaceSplitDockSide | null>(null)
  const browserDragUserSelectRestoreRef = useRef<string | null>(null)
  const [browserSplitDockPreviewSide, setBrowserSplitDockPreviewSide] =
    useState<WorkspaceSplitDockSide | null>(null)
  const activeDetachedBrowserSurface =
    Object.values(detachedSlotSurfaceById).find((surface) => surface.surfaceKind === 'browser') ?? null

  const lockBrowserDragTextSelection = useCallback(() => {
    if (typeof document === 'undefined') {
      return
    }
    if (browserDragUserSelectRestoreRef.current === null) {
      browserDragUserSelectRestoreRef.current = document.body.style.userSelect
    }
    document.body.style.userSelect = 'none'
    window.getSelection?.()?.removeAllRanges()
  }, [])

  const unlockBrowserDragTextSelection = useCallback(() => {
    if (typeof document === 'undefined') {
      return
    }
    document.body.style.userSelect = browserDragUserSelectRestoreRef.current ?? ''
    browserDragUserSelectRestoreRef.current = null
  }, [])

  const resolvePreferredBrowserViewportSplitRatio = useCallback(
    (splitDockSide: WorkspaceSplitDockSide) => {
      if (splitDockSide === 'top' || splitDockSide === 'bottom') {
        return browserViewportSplitRatio
      }
      const viewportRect = viewportRef.current?.getBoundingClientRect()
      if (viewportRect === undefined || viewportRect.width <= 0) {
        return browserViewportSplitRatio
      }
      return defaultBrowserFloatingSize.width / viewportRect.width
    },
    [browserViewportSplitRatio, viewportRef],
  )

  const handleBrowserPopoutClosed = useCallback(() => {
    setIsBrowserPoppedOut(false)
  }, [setIsBrowserPoppedOut])

  const handleBrowserPopoutBlocked = useCallback(() => {
    setIsBrowserPoppedOut(false)
  }, [setIsBrowserPoppedOut])

  const { childWindow: browserPopoutWindow, host: browserPopoutHost } = useWorkspaceChildWindow({
    isOpen: isBrowserPoppedOut,
    spec: browserPopoutState ?? defaultBrowserPopoutState,
    rootClassName: 'BrowserPopoutRoot',
    bodyBackground: browserPopoutBackground,
    onBlocked: handleBrowserPopoutBlocked,
    onClosed: handleBrowserPopoutClosed,
  })

  const getBrowserFloatingFrame = useCallback((): BrowserFloatingFrame | null => {
    const shellElement = appShellRef.current
    const viewportElement = viewportRef.current
    const primaryViewportBodyElement =
      viewportElement?.querySelector('.ViewportFrame.isPrimarySlot .ViewportFrameBody') instanceof
      HTMLElement
        ? (viewportElement.querySelector('.ViewportFrame.isPrimarySlot .ViewportFrameBody') as HTMLElement)
        : null
    const shellRect = shellElement?.getBoundingClientRect()
    const primaryViewportBodyRect = primaryViewportBodyElement?.getBoundingClientRect()
    const viewportRect = viewportElement?.getBoundingClientRect()
    if (shellElement === null || shellRect === undefined) {
      return null
    }
    const fallbackMinY =
      viewportRect === undefined || viewportRect.height <= 0
        ? 0
        : Math.max(0, Math.round(viewportRect.top - shellRect.top))
    const fallbackMaxY =
      viewportRect === undefined || viewportRect.height <= 0
        ? shellElement.clientHeight
        : Math.round(viewportRect.bottom - shellRect.top)
    const minY =
      primaryViewportBodyRect !== undefined &&
      primaryViewportBodyRect.width > 0 &&
      primaryViewportBodyRect.height > 0
        ? Math.round(primaryViewportBodyRect.top - shellRect.top)
        : fallbackMinY
    const maxY =
      primaryViewportBodyRect !== undefined &&
      primaryViewportBodyRect.width > 0 &&
      primaryViewportBodyRect.height > 0
        ? Math.round(primaryViewportBodyRect.bottom - shellRect.top)
        : fallbackMaxY
    return {
      shellWidth: shellElement.clientWidth,
      shellHeight: shellElement.clientHeight,
      minY,
      maxY,
    }
  }, [appShellRef, viewportRef])

  const clampBrowserFloatingSize = useCallback(
    (size: BrowserFloatingSize): BrowserFloatingSize => {
      const frame = getBrowserFloatingFrame()
      const limits =
        frame === null
          ? {
              maxWidth: minBrowserFloatingWidth,
              maxHeight: minBrowserFloatingHeight,
            }
          : {
              maxWidth: Math.max(minBrowserFloatingWidth, frame.shellWidth - 24),
              maxHeight: Math.max(minBrowserFloatingHeight, frame.shellHeight - 24),
            }
      return {
        width: Math.min(limits.maxWidth, Math.max(minBrowserFloatingWidth, Math.round(size.width))),
        height: Math.min(limits.maxHeight, Math.max(minBrowserFloatingHeight, Math.round(size.height))),
      }
    },
    [getBrowserFloatingFrame],
  )

  const clampBrowserFloatingPos = useCallback(
    (pos: BrowserFloatingPosition): BrowserFloatingPosition => {
      const frame = getBrowserFloatingFrame()
      if (frame === null) {
        return {
          x: Math.max(0, Math.round(pos.x)),
          y: Math.max(0, Math.round(pos.y)),
        }
      }
      const minX = 0
      const minY = frame.minY
      const maxX = Math.max(
        minX,
        frame.shellWidth - browserFloatingSizeRef.current.width - floatingEdgePadding,
      )
      const maxY = Math.max(
        minY,
        frame.maxY - browserFloatingSizeRef.current.height - floatingEdgePadding,
      )
      return {
        x: Math.min(maxX, Math.max(minX, Math.round(pos.x))),
        y: Math.min(maxY, Math.max(minY, Math.round(pos.y))),
      }
    },
    [getBrowserFloatingFrame],
  )

  const resolveBrowserSplitDockPreviewSide = useCallback(
    (
      pointerClientX: number,
      pointerClientY: number,
      pointerOffsetX: number,
      pointerOffsetY: number,
      titleBarHeight: number,
    ): WorkspaceSplitDockSide | null => {
      const viewportRect = viewportRef.current?.getBoundingClientRect()
      if (viewportRect === undefined || viewportRect.width <= 0 || viewportRect.height <= 0) {
        return null
      }
      const edgeThreshold = 20
      const candidateX = pointerClientX - viewportRect.left - pointerOffsetX
      const candidateY = pointerClientY - viewportRect.top - pointerOffsetY
      const edgeDistances: Array<{ side: WorkspaceSplitDockSide; distance: number }> = [
        { side: 'top', distance: Math.max(0, candidateY) },
        {
          side: 'right',
          distance: Math.max(
            0,
            viewportRect.width - (candidateX + browserFloatingSizeRef.current.width),
          ),
        },
        {
          side: 'bottom',
          distance: Math.max(0, viewportRect.height - (candidateY + titleBarHeight)),
        },
        { side: 'left', distance: Math.max(0, candidateX) },
      ]
      const previewableEdge = edgeDistances
        .filter((entry) => entry.distance <= edgeThreshold)
        .sort((left, right) => left.distance - right.distance)[0]
      return previewableEdge?.side ?? null
    },
    [viewportRef],
  )

  const openBrowserFloatingFromDock = useCallback(() => {
    const shellRect = appShellRef.current?.getBoundingClientRect()
    const dockedRect = dockedBrowserHostRef.current?.getBoundingClientRect()
    if (shellRect !== undefined && dockedRect !== undefined) {
      const nextSize = clampBrowserFloatingSize({
        width: dockedRect.width,
        height: Math.min(dockedRect.height, browserFloatingSizeRef.current.height),
      })
      browserFloatingSizeRef.current = nextSize
      setBrowserFloatingSize(nextSize)
      const nextPos = clampBrowserFloatingPos({
        x: dockedRect.left - shellRect.left,
        y: dockedRect.top - shellRect.top,
      })
      browserFloatingPosRef.current = nextPos
      setBrowserFloatingPos(nextPos)
    }
    setIsBrowserFloating(true)
  }, [
    appShellRef,
    clampBrowserFloatingPos,
    clampBrowserFloatingSize,
    dockedBrowserHostRef,
    setBrowserFloatingPos,
    setBrowserFloatingSize,
    setIsBrowserFloating,
  ])

  const handleToggleBrowserFloating = useCallback(() => {
    setActiveLeftDockPreviewPanelId(null)
    if (isBrowserFloating) {
      setIsBrowserFloating(false)
      return
    }
    openBrowserFloatingFromDock()
  }, [isBrowserFloating, openBrowserFloatingFromDock, setActiveLeftDockPreviewPanelId])

  const handleCycleBrowserPresentationMode = useCallback(() => {
    setBrowserPresentationMode(
      browserPresentationMode === 'expanded'
        ? 'essentials'
        : browserPresentationMode === 'essentials'
          ? 'collapsed'
          : 'expanded',
    )
  }, [browserPresentationMode, setBrowserPresentationMode])

  const handleToggleBrowserPopout = useCallback(() => {
    setActiveLeftDockPreviewPanelId(null)
    setBrowserSplitDockPreviewSide(null)
    if (isBrowserViewportSplit) {
      setIsBrowserViewportSplit(false)
      return
    }
    if (isBrowserPoppedOut) {
      setIsBrowserPoppedOut(false)
      return
    }
    setBrowserPopoutState(browserPopoutState ?? defaultBrowserPopoutState)
    setIsBrowserFloating(false)
    setIsBrowserPoppedOut(true)
  }, [
    browserPopoutState,
    setActiveLeftDockPreviewPanelId,
    setBrowserPopoutState,
    setIsBrowserFloating,
    setIsBrowserPoppedOut,
    setIsBrowserViewportSplit,
    isBrowserPoppedOut,
    isBrowserViewportSplit,
  ])

  const handleOpenFloatingSplitMenu = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (!isBrowserFloating) {
        return
      }
      event.preventDefault()
      event.stopPropagation()
      setActiveLeftDockPreviewPanelId(null)
      setBrowserSplitDockPreviewSide(null)
      setBrowserFloatingSplitMenu({
        x: event.clientX,
        y: event.clientY,
      })
    },
    [isBrowserFloating, setActiveLeftDockPreviewPanelId],
  )

  const handleSelectFloatingSplitDockSide = useCallback(
    (splitDockSide: WorkspaceSplitDockSide) => {
      setBrowserFloatingSplitMenu(null)
      setActiveLeftDockPreviewPanelId(null)
      setBrowserSplitDockPreviewSide(null)
      setBrowserViewportSplitRatio(resolvePreferredBrowserViewportSplitRatio(splitDockSide))
      if (activeDetachedBrowserSurface !== null) {
        redockDetachedSurface(activeDetachedBrowserSurface.surfaceInstanceId, splitDockSide)
        setIsBrowserFloating(false)
        setIsBrowserViewportSplit(false)
        return
      }
      setBrowserViewportSplitDockSide(splitDockSide)
      setIsBrowserViewportSplit(true)
    },
    [
      activeDetachedBrowserSurface,
      redockDetachedSurface,
      resolvePreferredBrowserViewportSplitRatio,
      setActiveLeftDockPreviewPanelId,
      setIsBrowserFloating,
      setIsBrowserViewportSplit,
      setBrowserViewportSplitRatio,
      setBrowserViewportSplitDockSide,
    ],
  )

  const handleBrowserDragStart = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 || !isBrowserFloating) {
        return
      }
      setActiveLeftDockPreviewPanelId(null)
      setBrowserSplitDockPreviewSide(null)
      const shellRect = appShellRef.current?.getBoundingClientRect()
      const titleBarRect = event.currentTarget.getBoundingClientRect()
      if (shellRect === undefined) {
        return
      }
      browserDragRef.current = {
        pointerOffsetX: event.clientX - shellRect.left - browserFloatingPosRef.current.x,
        pointerOffsetY: event.clientY - shellRect.top - browserFloatingPosRef.current.y,
        titleBarHeight: Math.max(1, Math.round(titleBarRect.height)),
        sourceKind: 'floating',
        hasExitedSourceRect: true,
        sourceRect: null,
      }
      lockBrowserDragTextSelection()
      event.preventDefault()
    },
    [appShellRef, isBrowserFloating, lockBrowserDragTextSelection, setActiveLeftDockPreviewPanelId],
  )

  const handleBrowserDockDragStart = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 || isBrowserFloating || isBrowserPoppedOut) {
        return
      }
      setActiveLeftDockPreviewPanelId(null)
      const shellRect = appShellRef.current?.getBoundingClientRect()
      const panelElement = event.currentTarget.parentElement
      const panelRect = panelElement?.getBoundingClientRect()
      const titleBarRect = event.currentTarget.getBoundingClientRect()
      if (shellRect === undefined || panelRect === undefined) {
        return
      }
      const nextSize = clampBrowserFloatingSize({
        width: panelRect.width,
        height: panelRect.height,
      })
      const pointerOffsetX = event.clientX - panelRect.left
      const pointerOffsetY = event.clientY - panelRect.top
      const nextPos = clampBrowserFloatingPos({
        x: event.clientX - shellRect.left - pointerOffsetX,
        y: event.clientY - shellRect.top - pointerOffsetY,
      })
      browserFloatingSizeRef.current = nextSize
      browserFloatingPosRef.current = nextPos
      setBrowserFloatingSize(nextSize)
      setBrowserFloatingPos(nextPos)
      setIsBrowserFloating(true)
      browserDragRef.current = {
        pointerOffsetX,
        pointerOffsetY,
        titleBarHeight: Math.max(1, Math.round(titleBarRect.height)),
        sourceKind: 'docked',
        hasExitedSourceRect: false,
        sourceRect: {
          left: panelRect.left,
          right: panelRect.right,
          top: panelRect.top,
          bottom: panelRect.bottom,
        },
      }
      lockBrowserDragTextSelection()
      event.preventDefault()
    },
    [
      appShellRef,
      clampBrowserFloatingPos,
      clampBrowserFloatingSize,
      isBrowserFloating,
      isBrowserPoppedOut,
      setActiveLeftDockPreviewPanelId,
      setBrowserFloatingPos,
      setBrowserFloatingSize,
      setIsBrowserFloating,
      lockBrowserDragTextSelection,
    ],
  )

  const handleBrowserSplitDragStart = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 || !isBrowserViewportSplit) {
        return
      }
      const shellRect = appShellRef.current?.getBoundingClientRect()
      const titleBarRect = event.currentTarget.getBoundingClientRect()
      const viewportRect = viewportRef.current?.getBoundingClientRect()
      if (shellRect === undefined) {
        return
      }
      const splitPaneRect =
        viewportRect === undefined || viewportRect.width <= 0 || viewportRect.height <= 0
          ? null
          : browserViewportSplitDockSide === 'left'
            ? {
                left: viewportRect.left,
                right:
                  viewportRect.left +
                  Math.max(0, viewportRect.width - browserSplitDividerSize) *
                    browserViewportSplitRatio,
                top: viewportRect.top,
                bottom: viewportRect.bottom,
              }
            : browserViewportSplitDockSide === 'right'
              ? {
                  left:
                    viewportRect.right -
                    Math.max(0, viewportRect.width - browserSplitDividerSize) *
                      browserViewportSplitRatio,
                  right: viewportRect.right,
                  top: viewportRect.top,
                  bottom: viewportRect.bottom,
                }
              : browserViewportSplitDockSide === 'top'
                ? {
                    left: viewportRect.left,
                    right: viewportRect.right,
                    top: viewportRect.top,
                    bottom:
                      viewportRect.top +
                      Math.max(0, viewportRect.height - browserSplitDividerSize) *
                        browserViewportSplitRatio,
                  }
                : {
                    left: viewportRect.left,
                    right: viewportRect.right,
                    top:
                      viewportRect.bottom -
                      Math.max(0, viewportRect.height - browserSplitDividerSize) *
                        browserViewportSplitRatio,
                    bottom: viewportRect.bottom,
                  }
      const hasValidSplitPaneRect = splitPaneRect !== null
      const titleBarHeight = Math.max(32, Math.round(titleBarRect.height))
      const pointerOffsetX = hasValidSplitPaneRect
        ? Math.min(
            Math.max(16, browserFloatingSizeRef.current.width - 16),
            Math.max(16, event.clientX - splitPaneRect.left),
          )
        : Math.round(browserFloatingSizeRef.current.width / 2)
      const pointerOffsetY =
        titleBarRect.height > 0
          ? Math.min(titleBarHeight - 1, Math.max(0, event.clientY - titleBarRect.top))
          : Math.round(titleBarHeight / 2)
      const nextPos = clampBrowserFloatingPos({
        x: event.clientX - shellRect.left - pointerOffsetX,
        y: event.clientY - shellRect.top - pointerOffsetY,
      })
      browserFloatingPosRef.current = nextPos
      setBrowserFloatingPos(nextPos)
      setIsBrowserViewportSplit(false)
      setIsBrowserFloating(true)
      browserDragRef.current = {
        pointerOffsetX,
        pointerOffsetY,
        titleBarHeight,
        sourceKind: 'viewportSplit',
        hasExitedSourceRect: !hasValidSplitPaneRect,
        sourceRect: splitPaneRect,
      }
      lockBrowserDragTextSelection()
      event.preventDefault()
      event.stopPropagation()
    },
    [
      appShellRef,
      browserViewportSplitDockSide,
      browserViewportSplitRatio,
      clampBrowserFloatingPos,
      isBrowserViewportSplit,
      lockBrowserDragTextSelection,
      setBrowserFloatingPos,
      setIsBrowserFloating,
      setIsBrowserViewportSplit,
      viewportRef,
    ],
  )

  useEffect(() => {
    const nextPortalTarget = dockedBrowserHostRef.current
    setDockedBrowserPortalTarget((currentPortalTarget) =>
      currentPortalTarget === nextPortalTarget ? currentPortalTarget : nextPortalTarget,
    )
  })

  useEffect(() => {
    setBrowserViewportSplitPortalTarget(isBrowserViewportSplit ? viewportSplitHostRef.current : null)
  }, [isBrowserViewportSplit, viewportSplitHostRef])

  useEffect(() => {
    browserFloatingPosRef.current = browserFloatingPos
  }, [browserFloatingPos])

  useEffect(() => {
    browserFloatingSizeRef.current = browserFloatingSize
  }, [browserFloatingSize])

  useEffect(() => {
    browserSplitDockPreviewSideRef.current = browserSplitDockPreviewSide
  }, [browserSplitDockPreviewSide])

  useLayoutEffect(() => {
    if (!isBrowserFloating || slotHeaderDragSeed === null) {
      return
    }
    const shellRect = appShellRef.current?.getBoundingClientRect()
    if (shellRect !== undefined) {
      const nextPos = clampBrowserFloatingPos({
        x: slotHeaderDragSeed.clientX - shellRect.left - slotHeaderDragSeed.pointerOffsetX,
        y: slotHeaderDragSeed.clientY - shellRect.top - slotHeaderDragSeed.pointerOffsetY,
      })
      browserFloatingPosRef.current = nextPos
      setBrowserFloatingPos(nextPos)
    }
    browserDragRef.current = {
      pointerOffsetX: slotHeaderDragSeed.pointerOffsetX,
      pointerOffsetY: slotHeaderDragSeed.pointerOffsetY,
      titleBarHeight: slotHeaderDragSeed.titleBarHeight,
      sourceKind: 'floating',
      hasExitedSourceRect: true,
      sourceRect: null,
    }
    lockBrowserDragTextSelection()
    onConsumeSlotHeaderDragSeed()
  }, [
    appShellRef,
    clampBrowserFloatingPos,
    isBrowserFloating,
    lockBrowserDragTextSelection,
    onConsumeSlotHeaderDragSeed,
    setBrowserFloatingPos,
    slotHeaderDragSeed,
  ])

  useEffect(() => {
    if (!isBrowserFloating || typeof ResizeObserver === 'undefined') {
      return
    }
    const element = browserFloatingWindowRef.current
    if (element === null) {
      return
    }

    const syncBrowserFloatingHeight = () => {
      const nextHeight = Math.round(element.getBoundingClientRect().height)
      if (nextHeight <= 0) {
        return
      }
      const nextSize = {
        ...browserFloatingSizeRef.current,
        height: nextHeight,
      }
      browserFloatingSizeRef.current = nextSize
      setBrowserFloatingSize(nextSize)
    }

    syncBrowserFloatingHeight()
    const observer = new ResizeObserver(() => {
      syncBrowserFloatingHeight()
    })
    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [isBrowserFloating, setBrowserFloatingSize])

  useEffect(() => {
    if (
      activeLeftDockPreviewPanelId === 'browser' &&
      !isBrowserFloating &&
      browserDragRef.current === null
    ) {
      setActiveLeftDockPreviewPanelId(null)
    }
  }, [activeLeftDockPreviewPanelId, isBrowserFloating, setActiveLeftDockPreviewPanelId])

  useEffect(() => {
    if (browserFloatingSplitMenu === null) {
      return
    }
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null
      if (target instanceof Element && target.closest('.WorkspaceSplitMenu') !== null) {
        return
      }
      setBrowserFloatingSplitMenu(null)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setBrowserFloatingSplitMenu(null)
      }
    }
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [browserFloatingSplitMenu])

  useEffect(() => {
    if (!isBrowserFloating && browserSplitDockPreviewSide !== null) {
      setBrowserSplitDockPreviewSide(null)
    }
  }, [browserSplitDockPreviewSide, isBrowserFloating])

  useEffect(() => {
    const handleResize = () => {
      if (!isBrowserFloating) {
        return
      }
      const nextSize = clampBrowserFloatingSize(browserFloatingSizeRef.current)
      if (
        nextSize.width !== browserFloatingSizeRef.current.width ||
        nextSize.height !== browserFloatingSizeRef.current.height
      ) {
        browserFloatingSizeRef.current = nextSize
        setBrowserFloatingSize(nextSize)
      }
      const nextPos = clampBrowserFloatingPos(browserFloatingPosRef.current)
      if (
        nextPos.x !== browserFloatingPosRef.current.x ||
        nextPos.y !== browserFloatingPosRef.current.y
      ) {
        browserFloatingPosRef.current = nextPos
        setBrowserFloatingPos(nextPos)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [clampBrowserFloatingPos, clampBrowserFloatingSize, isBrowserFloating])

  useEffect(() => {
    if (browserPopoutWindow === null) {
      return
    }
    const handleFocus = () => {
      onActivateBrowserFloatingWindow()
    }
    browserPopoutWindow.addEventListener('focus', handleFocus)
    return () => {
      browserPopoutWindow.removeEventListener('focus', handleFocus)
    }
  }, [browserPopoutWindow, onActivateBrowserFloatingWindow])

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (browserDragRef.current !== null) {
        if (
          !browserDragRef.current.hasExitedSourceRect &&
          browserDragRef.current.sourceRect !== null &&
          (event.clientX < browserDragRef.current.sourceRect.left ||
            event.clientX > browserDragRef.current.sourceRect.right ||
            event.clientY < browserDragRef.current.sourceRect.top ||
            event.clientY > browserDragRef.current.sourceRect.bottom)
        ) {
          browserDragRef.current.hasExitedSourceRect = true
        }
        const shellRect = appShellRef.current?.getBoundingClientRect()
        if (shellRect === undefined) {
          return
        }
        const nextPos = clampBrowserFloatingPos({
          x: event.clientX - shellRect.left - browserDragRef.current.pointerOffsetX,
          y: event.clientY - shellRect.top - browserDragRef.current.pointerOffsetY,
        })
        browserFloatingPosRef.current = nextPos
        setBrowserFloatingPos(nextPos)
        const allowDockOrSplit =
          browserDragRef.current.sourceKind === 'floating' ||
          browserDragRef.current.hasExitedSourceRect
        const nextDockPreviewPanelId = allowDockOrSplit
          ? resolveLeftDockPreviewPanelId('browser', event.clientX, event.clientY)
          : null
        setActiveLeftDockPreviewPanelId(nextDockPreviewPanelId)
        const nextSplitDockPreviewSide =
          allowDockOrSplit && nextDockPreviewPanelId === null
            ? resolveBrowserSplitDockPreviewSide(
                event.clientX,
                event.clientY,
                browserDragRef.current.pointerOffsetX,
                browserDragRef.current.pointerOffsetY,
                browserDragRef.current.titleBarHeight,
              )
            : null
        browserSplitDockPreviewSideRef.current = nextSplitDockPreviewSide
        setBrowserSplitDockPreviewSide(nextSplitDockPreviewSide)
      }
    }

    const handlePointerUp = (event: PointerEvent) => {
      const allowDockOrSplit =
        browserDragRef.current?.sourceKind === 'floating' ||
        browserDragRef.current?.hasExitedSourceRect === true
      const shouldDockBrowser =
        allowDockOrSplit &&
        browserDragRef.current !== null &&
        resolveLeftDockPreviewPanelId('browser', event.clientX, event.clientY) === 'browser'
      const nextSplitDockSide =
        !allowDockOrSplit || browserDragRef.current === null
          ? null
          : browserSplitDockPreviewSideRef.current ??
            resolveBrowserSplitDockPreviewSide(
              event.clientX,
              event.clientY,
              browserDragRef.current.pointerOffsetX,
              browserDragRef.current.pointerOffsetY,
              browserDragRef.current.titleBarHeight,
            )
      browserDragRef.current = null
      unlockBrowserDragTextSelection()
      setActiveLeftDockPreviewPanelId(null)
      setBrowserSplitDockPreviewSide(null)
      if (shouldDockBrowser) {
        if (activeDetachedBrowserSurface !== null) {
          clearDetachedSlotSurface(activeDetachedBrowserSurface.surfaceInstanceId)
        }
        setIsBrowserFloating(false)
      } else if (nextSplitDockSide !== null) {
        setBrowserViewportSplitRatio(resolvePreferredBrowserViewportSplitRatio(nextSplitDockSide))
        if (activeDetachedBrowserSurface !== null) {
          redockDetachedSurface(activeDetachedBrowserSurface.surfaceInstanceId, nextSplitDockSide)
          setIsBrowserFloating(false)
          setIsBrowserViewportSplit(false)
          return
        }
        setBrowserViewportSplitDockSide(nextSplitDockSide)
        setIsBrowserViewportSplit(true)
      }
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [
    appShellRef,
    activeDetachedBrowserSurface,
    clearDetachedSlotSurface,
    clampBrowserFloatingPos,
    clampBrowserFloatingSize,
    isBrowserFloating,
    redockDetachedSurface,
    resolvePreferredBrowserViewportSplitRatio,
    resolveBrowserSplitDockPreviewSide,
    resolveLeftDockPreviewPanelId,
    setActiveLeftDockPreviewPanelId,
    setBrowserFloatingPos,
    setBrowserFloatingSize,
    setIsBrowserFloating,
    setBrowserViewportSplitRatio,
    setBrowserViewportSplitDockSide,
    setIsBrowserViewportSplit,
    unlockBrowserDragTextSelection,
  ])

  useEffect(() => () => {
    unlockBrowserDragTextSelection()
  }, [unlockBrowserDragTextSelection])

  return (
    <>
      {dockedBrowserPortalTarget !== null &&
      !suppressDockedSurface &&
      !isBrowserFloating &&
      !isBrowserPoppedOut &&
      !isBrowserViewportSplit
        ? createPortal(
            <BrowserPanel
              presentationMode={browserPresentationMode}
              onCyclePresentationMode={handleCycleBrowserPresentationMode}
              isCollapsed={isBrowserCollapsed}
              popoutButtonMode="popout"
              onTogglePopout={handleToggleBrowserPopout}
              onTitleBarPointerDown={handleBrowserDockDragStart}
              newEditorSpawnPosition={newEditorSpawnPosition}
            />,
            dockedBrowserPortalTarget,
          )
        : null}
      {isBrowserPoppedOut && browserPopoutHost !== null
        ? createPortal(
            <div className="BrowserPopoutSurface">
              <BrowserPanel
                presentationMode={browserPresentationMode}
                onCyclePresentationMode={handleCycleBrowserPresentationMode}
                isCollapsed={isBrowserCollapsed}
                isPoppedOut
                popoutButtonMode="dock"
                onTogglePopout={handleToggleBrowserPopout}
                newEditorSpawnPosition={newEditorSpawnPosition}
              />
            </div>,
            browserPopoutHost,
          )
        : null}
      {renderViewportSplitSurface && isBrowserViewportSplit && browserViewportSplitPortalTarget !== null
        ? createPortal(
            <div className="BrowserViewportSplitWindow">
              <BrowserPanel
                presentationMode={browserPresentationMode}
                onCyclePresentationMode={handleCycleBrowserPresentationMode}
                isCollapsed={isBrowserCollapsed}
                popoutButtonMode="dock"
                onTogglePopout={handleToggleBrowserPopout}
                onTitleBarPointerDown={handleBrowserSplitDragStart}
                newEditorSpawnPosition={newEditorSpawnPosition}
              />
            </div>,
            browserViewportSplitPortalTarget,
          )
        : null}
      {isBrowserFloating ? (
        <aside className="BrowserFloatingDock">
          <div
            ref={browserFloatingWindowRef}
            className={`BrowserFloatingWindow ${isBrowserCollapsed ? 'isCollapsed' : ''} ${
              workspaceActiveSurface === 'browser' ? 'isActiveWindow' : ''
            }`}
            onPointerDown={onActivateBrowserFloatingWindow}
            style={{
              left: `${browserFloatingPos.x}px`,
              top: `${browserFloatingPos.y}px`,
              width: `${browserFloatingSize.width}px`,
            }}
          >
            <BrowserPanel
              presentationMode={browserPresentationMode}
              onCyclePresentationMode={handleCycleBrowserPresentationMode}
              isCollapsed={isBrowserCollapsed}
              isFloating
              popoutButtonMode="popout"
              showQuickDockButton
              onQuickDock={handleToggleBrowserFloating}
              onTogglePopout={handleToggleBrowserPopout}
              onTitleBarContextMenu={handleOpenFloatingSplitMenu}
              onTitleBarPointerDown={handleBrowserDragStart}
              newEditorSpawnPosition={newEditorSpawnPosition}
            />
          </div>
        </aside>
      ) : null}
      {browserFloatingSplitMenu !== null ? (
        <div
          className="WorkspaceSplitMenu PrimaryViewportLeftDockResizeMenu"
          style={{
            left: `${Math.max(
              12,
              Math.min(
                browserFloatingSplitMenu.x,
                (typeof window === 'undefined' ? browserFloatingSplitMenu.x : window.innerWidth) - 240,
              ),
            )}px`,
            top: `${Math.max(
              12,
              Math.min(
                browserFloatingSplitMenu.y,
                (typeof window === 'undefined' ? browserFloatingSplitMenu.y : window.innerHeight) - 280,
              ),
            )}px`,
          }}
        >
          <button
            type="button"
            className="PrimaryViewportLeftDockResizeMenuAction"
            onClick={() => handleSelectFloatingSplitDockSide('top')}
          >
            Split Top
          </button>
          <button
            type="button"
            className="PrimaryViewportLeftDockResizeMenuAction"
            onClick={() => handleSelectFloatingSplitDockSide('right')}
          >
            Split Right
          </button>
          <button
            type="button"
            className="PrimaryViewportLeftDockResizeMenuAction"
            onClick={() => handleSelectFloatingSplitDockSide('bottom')}
          >
            Split Bottom
          </button>
          <button
            type="button"
            className="PrimaryViewportLeftDockResizeMenuAction"
            onClick={() => handleSelectFloatingSplitDockSide('left')}
          >
            Split Left
          </button>
        </div>
      ) : null}
      {browserSplitDockPreviewSide !== null && viewportRef.current !== null
        ? createPortal(
            <div
              className={`ViewportSplitDockGhost ${
                browserSplitDockPreviewSide === 'left'
                  ? 'isDockLeft'
                  : browserSplitDockPreviewSide === 'right'
                    ? 'isDockRight'
                    : browserSplitDockPreviewSide === 'top'
                      ? 'isDockTop'
                      : 'isDockBottom'
              }`}
              style={
                browserSplitDockPreviewSide === 'bottom'
                  ? ({
                      top: `calc(${((1 - browserViewportSplitRatio) * 100).toFixed(4)}% + 10px)`,
                    } as CSSProperties)
                  : browserSplitDockPreviewSide === 'top'
                    ? ({
                        bottom: `calc(${((1 - browserViewportSplitRatio) * 100).toFixed(4)}% + 10px)`,
                      } as CSSProperties)
                    : browserSplitDockPreviewSide === 'right'
                      ? ({
                          left: `calc(${((1 - browserViewportSplitRatio) * 100).toFixed(4)}% + 10px)`,
                        } as CSSProperties)
                      : ({
                          right: `calc(${((1 - browserViewportSplitRatio) * 100).toFixed(4)}% + 10px)`,
                        } as CSSProperties)
              }
              aria-hidden="true"
            />,
            viewportRef.current,
          )
        : null}
    </>
  )
}
