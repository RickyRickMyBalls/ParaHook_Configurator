import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { BrowserPanel } from '../panels/BrowserPanel'
import { useWorkspaceChildWindow } from '../workspace/useWorkspaceChildWindow'
import { useWorkspaceStore } from '../workspace/useWorkspaceStore'
import {
  defaultBrowserPopoutState,
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

type BrowserDockHostProps = {
  appShellRef: RefObject<HTMLDivElement | null>
  viewportRef: RefObject<HTMLElement | null>
  viewportSplitHostRef: RefObject<HTMLDivElement | null>
  dockedBrowserHostRef: RefObject<HTMLDivElement | null>
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
}

export function BrowserDockHost(props: BrowserDockHostProps) {
  const {
    appShellRef,
    viewportRef,
    viewportSplitHostRef,
    dockedBrowserHostRef,
    resolveLeftDockPreviewPanelId,
    onActivateBrowserFloatingWindow,
    newEditorSpawnPosition,
    workspaceActiveSurface,
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
  const isBrowserCollapsed = useWorkspaceStore((state) => state.browserShell.isCollapsed)
  const setIsBrowserCollapsed = useWorkspaceStore((state) => state.setBrowserCollapsed)
  const browserFloatingPos = useWorkspaceStore((state) => state.browserShell.position)
  const setBrowserFloatingPos = useWorkspaceStore((state) => state.setBrowserFloatingPosition)
  const browserFloatingSize = useWorkspaceStore((state) => state.browserShell.size)
  const setBrowserFloatingSize = useWorkspaceStore((state) => state.setBrowserFloatingSize)
  const browserViewportSplitRatio = useWorkspaceStore((state) => state.browserShell.viewportSplitRatio)
  const browserViewportSplitDockSide = useWorkspaceStore(
    (state) => state.browserShell.viewportSplitDockSide,
  )
  const setBrowserViewportSplitDockSide = useWorkspaceStore(
    (state) => state.setBrowserViewportSplitDockSide,
  )
  const browserPopoutState = useWorkspaceStore((state) => state.browserShell.popoutState)
  const setBrowserPopoutState = useWorkspaceStore((state) => state.setBrowserPopoutState)
  const browserFloatingWindowRef = useRef<HTMLDivElement | null>(null)
  const [browserViewportSplitPortalTarget, setBrowserViewportSplitPortalTarget] =
    useState<HTMLDivElement | null>(null)
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
  const [browserSplitDockPreviewSide, setBrowserSplitDockPreviewSide] =
    useState<WorkspaceSplitDockSide | null>(null)

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

  const clampBrowserFloatingSize = useCallback(
    (size: BrowserFloatingSize): BrowserFloatingSize => {
      const shellElement = appShellRef.current
      const limits =
        shellElement === null
          ? {
              maxWidth: minBrowserFloatingWidth,
              maxHeight: minBrowserFloatingHeight,
            }
          : {
              maxWidth: Math.max(minBrowserFloatingWidth, shellElement.clientWidth - 24),
              maxHeight: Math.max(minBrowserFloatingHeight, shellElement.clientHeight - 24),
            }
      return {
        width: Math.min(limits.maxWidth, Math.max(minBrowserFloatingWidth, Math.round(size.width))),
        height: Math.min(limits.maxHeight, Math.max(minBrowserFloatingHeight, Math.round(size.height))),
      }
    },
    [appShellRef],
  )

  const clampBrowserFloatingPos = useCallback(
    (pos: BrowserFloatingPosition): BrowserFloatingPosition => {
      const shellElement = appShellRef.current
      if (shellElement === null) {
        return {
          x: Math.max(0, Math.round(pos.x)),
          y: Math.max(0, Math.round(pos.y)),
        }
      }
      const maxX = Math.max(
        0,
        shellElement.clientWidth - browserFloatingSizeRef.current.width - floatingEdgePadding,
      )
      const maxY = Math.max(
        0,
        shellElement.clientHeight - browserFloatingSizeRef.current.height - floatingEdgePadding,
      )
      return {
        x: Math.min(maxX, Math.max(0, Math.round(pos.x))),
        y: Math.min(maxY, Math.max(0, Math.round(pos.y))),
      }
    },
    [appShellRef],
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
      event.preventDefault()
    },
    [appShellRef, isBrowserFloating, setActiveLeftDockPreviewPanelId],
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
      event.preventDefault()
      event.stopPropagation()
    },
    [
      appShellRef,
      browserViewportSplitDockSide,
      browserViewportSplitRatio,
      clampBrowserFloatingPos,
      isBrowserViewportSplit,
      setBrowserFloatingPos,
      setIsBrowserFloating,
      setIsBrowserViewportSplit,
      viewportRef,
    ],
  )

  useEffect(() => {
    setDockedBrowserPortalTarget(dockedBrowserHostRef.current)
  }, [dockedBrowserHostRef])

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
      setActiveLeftDockPreviewPanelId(null)
      setBrowserSplitDockPreviewSide(null)
      if (shouldDockBrowser) {
        setIsBrowserFloating(false)
      } else if (nextSplitDockSide !== null) {
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
    clampBrowserFloatingPos,
    clampBrowserFloatingSize,
    isBrowserFloating,
    resolveBrowserSplitDockPreviewSide,
    resolveLeftDockPreviewPanelId,
    setActiveLeftDockPreviewPanelId,
    setBrowserFloatingPos,
    setBrowserFloatingSize,
    setIsBrowserFloating,
    setBrowserViewportSplitDockSide,
    setIsBrowserViewportSplit,
  ])

  return (
    <>
      {dockedBrowserPortalTarget !== null &&
      !isBrowserFloating &&
      !isBrowserPoppedOut &&
      !isBrowserViewportSplit
        ? createPortal(
            <BrowserPanel
              isCollapsed={isBrowserCollapsed}
              onToggleCollapsed={() => setIsBrowserCollapsed(!isBrowserCollapsed)}
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
                isCollapsed={isBrowserCollapsed}
                onToggleCollapsed={() => setIsBrowserCollapsed(!isBrowserCollapsed)}
                isPoppedOut
                popoutButtonMode="dock"
                onTogglePopout={handleToggleBrowserPopout}
                newEditorSpawnPosition={newEditorSpawnPosition}
              />
            </div>,
            browserPopoutHost,
          )
        : null}
      {isBrowserViewportSplit && browserViewportSplitPortalTarget !== null
        ? createPortal(
            <div className="BrowserViewportSplitWindow">
              <BrowserPanel
                isCollapsed={isBrowserCollapsed}
                onToggleCollapsed={() => setIsBrowserCollapsed(!isBrowserCollapsed)}
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
              isCollapsed={isBrowserCollapsed}
              onToggleCollapsed={() => setIsBrowserCollapsed(!isBrowserCollapsed)}
              isFloating
              popoutButtonMode="dock"
              onTogglePopout={handleToggleBrowserFloating}
              onTitleBarPointerDown={handleBrowserDragStart}
              newEditorSpawnPosition={newEditorSpawnPosition}
            />
          </div>
        </aside>
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
