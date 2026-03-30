import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { TitleStatusBar } from './components/TitleStatusBar'
import { ConsoleDock } from './console/ConsoleDock'
import { BrowserDockHost } from './hosts/BrowserDockHost'
import { RadioRuntimeHost } from './hosts/RadioRuntimeHost'
import { SpaghettiWindowHost } from './hosts/SpaghettiWindowHost'
import { useAppShellDockController } from './hosts/useAppShellDockController'
import { RadioPanel } from './panels/RadioPanel'
import { selectActiveEditorViewport, useSpaghettiStore } from './spaghetti/store/useSpaghettiStore'
import { useAudioSamplerStore } from './store/audioSamplerStore'
import { useAppStore } from './store/useAppStore'
import { useWorkspaceStore } from './workspace/useWorkspaceStore'
import { ViewportWorkspaceHost } from './workspace/ViewportWorkspaceHost'
import {
  readPersistedWorkspaceLayout,
  serializeWorkspaceLayout,
  writePersistedWorkspaceLayout,
} from './workspace/workspacePersistence'
import {
  defaultWorkspaceSplitDirection,
  resolveDefaultWorkspaceSplitDockSide,
  resolveWorkspaceSplitDirectionForDockSide,
  defaultWorkspaceSplitPriority,
  type WorkspaceSplitDirection,
  type WorkspaceSplitPriority,
} from './workspace/workspaceSplitTypes'

const floatingDockLockGap = 25
const splitDividerHeight = 10

export function AppShell() {
  const activeEditorViewport = useSpaghettiStore(selectActiveEditorViewport)
  const activeEditorViewportId = useSpaghettiStore((state) => state.activeEditorViewportId)
  const sketchPlanePickSession = useSpaghettiStore((state) => state.sketchPlanePickSession ?? null)
  const setEditorViewportWindowMode = useSpaghettiStore((state) => state.setEditorViewportWindowMode)
  const setEditorViewportSplitDirection = useSpaghettiStore(
    (state) => state.setEditorViewportSplitDirection,
  )
  const setEditorViewportSplitPriority = useSpaghettiStore(
    (state) => state.setEditorViewportSplitPriority,
  )
  const setEditorViewportSplitRatio = useSpaghettiStore((state) => state.setEditorViewportSplitRatio)
  const isRadioToolbarOpen = useAudioSamplerStore((state) => state.isRadioToolbarOpen)
  const floatingShellActivationRequest = useAppStore((state) => state.floatingShellActivationRequest)
  const workspaceActiveSurface = useAppStore((state) => state.workspaceSelection.activeSurface)
  const workspaceSelectedTarget = useAppStore((state) => state.workspaceSelection.selectedTarget)
  const workspaceExplicitSelectedTargets = useAppStore(
    (state) => state.workspaceSelection.explicitSelectedTargets ?? [],
  )
  const setActiveSurface = useAppStore((state) => state.setActiveSurface)
  const requestConsoleContextSync = useAppStore((state) => state.requestConsoleContextSync)
  const appShellRef = useRef<HTMLDivElement | null>(null)
  const viewportRef = useRef<HTMLElement | null>(null)
  const browserViewportSplitHostRef = useRef<HTMLDivElement | null>(null)
  const dockedBrowserHostRef = useRef<HTMLDivElement | null>(null)
  const dockedMeatballHostRef = useRef<HTMLDivElement | null>(null)
  const leftDockWidthPreviewHandlerRef = useRef<((nextWidth: number) => void) | null>(null)
  const leftDockWidth = useWorkspaceStore((state) => state.leftDockWidth)
  const setLeftDockWidth = useWorkspaceStore((state) => state.setLeftDockWidth)
  const isLeftDockViewportSplit = useWorkspaceStore((state) => state.isLeftDockViewportSplit)
  const setIsLeftDockViewportSplit = useWorkspaceStore((state) => state.setLeftDockViewportSplit)
  const activeLeftDockPreviewPanelId = useWorkspaceStore(
    (state) => state.activeLeftDockPreviewPanelId,
  )
  const setActiveLeftDockPreviewPanelId = useWorkspaceStore(
    (state) => state.setActiveLeftDockPreviewPanelId,
  )
  const leftDockResizeMenu = useWorkspaceStore((state) => state.leftDockResizeMenu)
  const setLeftDockResizeMenu = useWorkspaceStore((state) => state.setLeftDockResizeMenu)
  const workspaceSplitMenu = useWorkspaceStore((state) => state.workspaceSplitMenu)
  const setWorkspaceSplitMenu = useWorkspaceStore((state) => state.setWorkspaceSplitMenu)
  const isBrowserFloating = useWorkspaceStore((state) => state.browserShell.isFloating)
  const isBrowserPoppedOut = useWorkspaceStore((state) => state.browserShell.isPoppedOut)
  const isBrowserViewportSplit = useWorkspaceStore((state) => state.browserShell.isViewportSplit)
  const browserViewportSplitRatio = useWorkspaceStore((state) => state.browserShell.viewportSplitRatio)
  const browserViewportSplitDockSide = useWorkspaceStore(
    (state) => state.browserShell.viewportSplitDockSide,
  )
  const setBrowserViewportSplitRatio = useWorkspaceStore((state) => state.setBrowserViewportSplitRatio)
  const primaryViewportId = useWorkspaceStore((state) => state.primaryViewportId)
  const hydratePersistedWorkspaceLayout = useWorkspaceStore(
    (state) => state.hydratePersistedWorkspaceLayout,
  )
  const activeEditorSurface = useWorkspaceStore((state) =>
    activeEditorViewportId.length > 0 ? state.editorSurfacePlacementById[activeEditorViewportId] ?? null : null,
  )
  const [, setActiveFloatingShell] = useState<'spaghetti' | 'browser' | null>(null)
  const lastHandledFloatingShellActivationSeqRef = useRef(0)
  const hasHydratedWorkspacePersistenceRef = useRef(false)
  const browserSplitResizeRef = useRef<{
    viewportTop: number
    viewportHeight: number
  } | null>(null)

  const {
    resolveLeftDockPreviewPanelId,
    handleLeftDockResizeStart,
    handleLeftDockResizeContextMenu,
    handleResetLeftDockWidth,
    handleToggleLeftDockViewportSplit,
    handleLeftDockSplitTogglePointerDown,
    handleLeftDockSplitToggleClick,
  } = useAppShellDockController({
    appShellRef,
    dockedBrowserHostRef,
    dockedMeatballHostRef,
    leftDockWidth,
    setLeftDockWidth,
    isLeftDockViewportSplit,
    leftDockResizeMenu,
    setLeftDockResizeMenu,
    workspaceSplitMenu,
    setWorkspaceSplitMenu,
    setIsLeftDockViewportSplit,
    onLeftDockWidthPreview: (nextWidth) => {
      leftDockWidthPreviewHandlerRef.current?.(nextWidth)
    },
  })

  const activeWindowMode = activeEditorSurface?.windowMode ?? activeEditorViewport?.windowMode ?? null
  const showEditorSurface = activeEditorViewport !== null
  const showFloatingShell =
    showEditorSurface &&
    (activeWindowMode === 'expanded' ||
      activeWindowMode === 'maximized' ||
      activeWindowMode === 'collapsed')
  const showSplitLayout = showEditorSurface && activeWindowMode === 'split view'
  const splitRatio = activeEditorSurface?.splitRatio ?? activeEditorViewport?.splitRatio ?? 0.5
  const splitDirection =
    activeEditorSurface?.splitDirection ??
    activeEditorViewport?.splitDirection ??
    defaultWorkspaceSplitDirection
  const splitDockSide =
    activeEditorSurface?.splitDockSide ??
    activeEditorViewport?.splitDockSide ??
    resolveDefaultWorkspaceSplitDockSide(splitDirection)
  const splitPriority =
    activeEditorSurface?.splitPriority ??
    activeEditorViewport?.splitPriority ??
    defaultWorkspaceSplitPriority
  const isBrowserDockPreviewActive = activeLeftDockPreviewPanelId === 'browser'
  const isMeatballDockPreviewActive = activeLeftDockPreviewPanelId === 'meatball-editor'
  const browserViewportSplitDirection = resolveWorkspaceSplitDirectionForDockSide(
    browserViewportSplitDockSide,
  )
  const browserViewportSplitDirectionClass =
    browserViewportSplitDirection === 'vertical' ? 'isVertical' : 'isHorizontal'
  const browserViewportSplitDockSideClass =
    browserViewportSplitDockSide === 'left'
      ? 'isEditorLeft'
      : browserViewportSplitDockSide === 'right'
        ? 'isEditorRight'
        : browserViewportSplitDockSide === 'top'
          ? 'isEditorTop'
          : 'isEditorBottom'

  const handleActivateSpaghettiFloatingWindow = useCallback(() => {
    setActiveFloatingShell('spaghetti')
    setActiveSurface('spaghetti')
    requestConsoleContextSync('surface-activation')
  }, [requestConsoleContextSync, setActiveSurface])

  const handleActivateSpaghettiSurface = useCallback(() => {
    setActiveSurface('spaghetti')
    requestConsoleContextSync('surface-activation')
  }, [requestConsoleContextSync, setActiveSurface])

  const handleActivateViewerSurface = useCallback(() => {
    setActiveFloatingShell(null)
    setActiveSurface('viewer')
    if (sketchPlanePickSession !== null) {
      return
    }
    if (workspaceSelectedTarget !== null || workspaceExplicitSelectedTargets.length > 0) {
      return
    }
    requestConsoleContextSync('surface-clear')
  }, [
    requestConsoleContextSync,
    setActiveSurface,
    sketchPlanePickSession,
    workspaceExplicitSelectedTargets.length,
    workspaceSelectedTarget,
  ])

  const handleActivateBrowserFloatingWindow = useCallback(() => {
    setActiveFloatingShell('browser')
    setActiveSurface('browser')
  }, [setActiveSurface])

  useEffect(() => {
    if (!showFloatingShell && workspaceActiveSurface === 'spaghetti') {
      setActiveFloatingShell(null)
      setActiveSurface(null)
      requestConsoleContextSync('surface-clear')
    }
  }, [requestConsoleContextSync, setActiveSurface, showFloatingShell, workspaceActiveSurface])

  useEffect(() => {
    if (!isBrowserFloating && !isBrowserPoppedOut && workspaceActiveSurface === 'browser') {
      setActiveFloatingShell(null)
    }
  }, [isBrowserFloating, isBrowserPoppedOut, workspaceActiveSurface])

  useEffect(() => {
    if (
      floatingShellActivationRequest === null ||
      floatingShellActivationRequest.seq === lastHandledFloatingShellActivationSeqRef.current
    ) {
      return
    }
    lastHandledFloatingShellActivationSeqRef.current = floatingShellActivationRequest.seq
    if (floatingShellActivationRequest.target === 'spaghetti') {
      if (showFloatingShell) {
        setActiveFloatingShell('spaghetti')
        setActiveSurface('spaghetti')
      }
      return
    }
    if (isBrowserFloating || isBrowserPoppedOut) {
      setActiveFloatingShell('browser')
      setActiveSurface('browser')
    }
  }, [
    floatingShellActivationRequest,
    isBrowserFloating,
    isBrowserPoppedOut,
    setActiveSurface,
    showFloatingShell,
  ])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target
      if (
        target instanceof Element &&
        (target.closest('.SpaghettiFloatingWindow') !== null ||
          target.closest('.BrowserFloatingWindow') !== null ||
          target.closest('.ViewportWorkspaceHost') !== null ||
          target.closest('.ViewportViewerSurface') !== null)
      ) {
        return
      }
      if (workspaceActiveSurface === 'spaghetti' || workspaceActiveSurface === 'browser') {
        setActiveFloatingShell(null)
        setActiveSurface(null)
        requestConsoleContextSync('surface-clear')
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [requestConsoleContextSync, setActiveSurface, workspaceActiveSurface])

  useEffect(() => {
    if (hasHydratedWorkspacePersistenceRef.current) {
      return
    }
    hasHydratedWorkspacePersistenceRef.current = true
    const persistedLayout = readPersistedWorkspaceLayout()
    if (persistedLayout !== null) {
      hydratePersistedWorkspaceLayout(persistedLayout)
      const spaghettiState = useSpaghettiStore.getState()
      for (const [editorViewportId, placement] of Object.entries(
        persistedLayout.editorSurfacePlacementById,
      )) {
        if (spaghettiState.editorViewportsById[editorViewportId] === undefined) {
          continue
        }
        spaghettiState.setEditorViewportPosition(editorViewportId, placement.position)
        spaghettiState.setEditorViewportSize(editorViewportId, placement.size)
        spaghettiState.setEditorViewportSplitRatio(editorViewportId, placement.splitRatio)
        spaghettiState.setEditorViewportSplitDirection(editorViewportId, placement.splitDirection)
        spaghettiState.setEditorViewportSplitDockSide(editorViewportId, placement.splitDockSide)
        spaghettiState.setEditorViewportSplitPriority(editorViewportId, placement.splitPriority)
        spaghettiState.setEditorViewportWindowMode(editorViewportId, placement.windowMode)
      }
    }
    writePersistedWorkspaceLayout(serializeWorkspaceLayout(useWorkspaceStore.getState()))
  }, [hydratePersistedWorkspaceLayout])

  useEffect(() => {
    const unsubscribe = useWorkspaceStore.subscribe((state) => {
      if (!hasHydratedWorkspacePersistenceRef.current) {
        return
      }
      writePersistedWorkspaceLayout(serializeWorkspaceLayout(state))
    })
    return unsubscribe
  }, [])

  const handleFloatingSplitMenu = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (activeEditorViewport === null || activeWindowMode === 'split view') {
        return
      }
      event.preventDefault()
      event.stopPropagation()
      setWorkspaceSplitMenu({
        x: event.clientX,
        y: event.clientY,
        scope: 'floating-titlebar',
      })
    },
    [activeEditorViewport, activeWindowMode],
  )

  const handleDividerSplitMenu = useCallback((event: ReactMouseEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setWorkspaceSplitMenu({
      x: event.clientX,
      y: event.clientY,
      scope: 'divider',
    })
  }, [])

  const handleSetSplitDirection = useCallback(
    (nextDirection: WorkspaceSplitDirection) => {
      if (activeEditorViewport === null) {
        return
      }
      const editorViewportId = activeEditorViewport.editorViewportId
      setEditorViewportSplitDirection(editorViewportId, nextDirection)
      if (activeWindowMode !== 'split view') {
        setEditorViewportWindowMode(editorViewportId, 'split view')
      }
      setWorkspaceSplitMenu(null)
    },
    [
      activeEditorViewport,
      activeWindowMode,
      setEditorViewportSplitDirection,
      setEditorViewportWindowMode,
    ],
  )

  const handleResetSplitRatio = useCallback(() => {
    if (activeEditorViewport === null) {
      return
    }
    setEditorViewportSplitRatio(activeEditorViewport.editorViewportId, 0.5)
    setWorkspaceSplitMenu(null)
  }, [activeEditorViewport, setEditorViewportSplitRatio])

  const handleBrowserSplitResizeStart = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (event.button !== 0 || !isBrowserViewportSplit) {
        return
      }
      const viewportElement = viewportRef.current
      if (viewportElement === null) {
        return
      }
      const rect = viewportElement.getBoundingClientRect()
      browserSplitResizeRef.current = {
        viewportTop: rect.top,
        viewportHeight: rect.height - splitDividerHeight,
      }

      const handleMove = (moveEvent: PointerEvent) => {
        const state = browserSplitResizeRef.current
        const liveViewportRect = viewportRef.current?.getBoundingClientRect()
        if (state === null || liveViewportRect === undefined) {
          return
        }
        const nextRatio =
          browserViewportSplitDirection === 'vertical'
            ? browserViewportSplitDockSide === 'left'
              ? (moveEvent.clientX - liveViewportRect.left) /
                Math.max(1, liveViewportRect.width - splitDividerHeight)
              : (liveViewportRect.right - moveEvent.clientX) /
                Math.max(1, liveViewportRect.width - splitDividerHeight)
            : browserViewportSplitDockSide === 'top'
              ? (moveEvent.clientY - state.viewportTop) /
                Math.max(1, state.viewportHeight)
              : (liveViewportRect.bottom - moveEvent.clientY) /
                Math.max(1, state.viewportHeight)
        setBrowserViewportSplitRatio(nextRatio)
      }

      const handleUp = () => {
        browserSplitResizeRef.current = null
        window.removeEventListener('pointermove', handleMove)
        window.removeEventListener('pointerup', handleUp)
      }

      window.addEventListener('pointermove', handleMove)
      window.addEventListener('pointerup', handleUp)
      event.preventDefault()
      event.stopPropagation()
    },
    [
      browserViewportSplitDirection,
      browserViewportSplitDockSide,
      isBrowserViewportSplit,
      setBrowserViewportSplitRatio,
    ],
  )

  const handleSetSplitPriority = useCallback(
    (nextPriority: WorkspaceSplitPriority) => {
      if (activeEditorViewport === null) {
        return
      }
      setEditorViewportSplitPriority(activeEditorViewport.editorViewportId, nextPriority)
      setWorkspaceSplitMenu(null)
    },
    [activeEditorViewport, setEditorViewportSplitPriority],
  )

  const handleCloseSplitFromMenu = useCallback(() => {
    if (activeEditorViewport === null || activeWindowMode !== 'split view') {
      return
    }
    setEditorViewportWindowMode(activeEditorViewport.editorViewportId, 'split view')
    setWorkspaceSplitMenu(null)
  }, [activeEditorViewport, activeWindowMode, setEditorViewportWindowMode])

  const newEditorSpawnPosition = useMemo(
    () => ({
      x: leftDockWidth + floatingDockLockGap,
      y: 16,
    }),
    [leftDockWidth],
  )

  const leftDockResizeMenuStyle =
    leftDockResizeMenu === null
      ? undefined
      : {
          left: `${Math.max(
            12,
            Math.min(
              leftDockResizeMenu.x,
              (typeof window === 'undefined' ? leftDockResizeMenu.x : window.innerWidth) - 220,
            ),
          )}px`,
          top: `${Math.max(
            12,
            Math.min(
              leftDockResizeMenu.y,
              (typeof window === 'undefined' ? leftDockResizeMenu.y : window.innerHeight) - 120,
            ),
          )}px`,
        }

  const workspaceSplitMenuStyle =
    workspaceSplitMenu === null
      ? undefined
      : {
          left: `${Math.max(
            12,
            Math.min(
              workspaceSplitMenu.x,
              (typeof window === 'undefined' ? workspaceSplitMenu.x : window.innerWidth) - 240,
            ),
          )}px`,
          top: `${Math.max(
            12,
            Math.min(
              workspaceSplitMenu.y,
              (typeof window === 'undefined' ? workspaceSplitMenu.y : window.innerHeight) - 280,
            ),
          )}px`,
        }

  const consoleListLeftOffset =
    isLeftDockViewportSplit && !showSplitLayout ? 0 : leftDockWidth

  const baseViewerSurface = (
    <ViewportWorkspaceHost
      viewportId={primaryViewportId}
      onActivateViewerSurface={handleActivateViewerSurface}
    />
  )

  const viewerSurface = isBrowserViewportSplit ? (
    <div
      className={`ViewportSplitLayout BrowserViewportSplitLayout ${browserViewportSplitDirectionClass} ${browserViewportSplitDockSideClass}`}
      style={{
        gridTemplateColumns:
          browserViewportSplitDirection === 'vertical'
            ? browserViewportSplitDockSide === 'left'
              ? `${browserViewportSplitRatio}fr ${splitDividerHeight}px ${1 - browserViewportSplitRatio}fr`
              : `${1 - browserViewportSplitRatio}fr ${splitDividerHeight}px ${browserViewportSplitRatio}fr`
            : 'minmax(0, 1fr)',
        gridTemplateRows:
          browserViewportSplitDirection === 'vertical'
            ? 'minmax(0, 1fr)'
            : browserViewportSplitDockSide === 'top'
              ? `${browserViewportSplitRatio}fr ${splitDividerHeight}px ${1 - browserViewportSplitRatio}fr`
              : `${1 - browserViewportSplitRatio}fr ${splitDividerHeight}px ${browserViewportSplitRatio}fr`,
        gridTemplateAreas:
          browserViewportSplitDirection === 'vertical'
            ? browserViewportSplitDockSide === 'left'
              ? '"editor divider viewer"'
              : '"viewer divider editor"'
            : browserViewportSplitDockSide === 'top'
              ? '"editor" "divider" "viewer"'
              : '"viewer" "divider" "editor"',
      }}
    >
      <div className="ViewportSplitPane ViewportSplitPane--viewer" style={{ gridArea: 'viewer' }}>
        {baseViewerSurface}
      </div>
      <div className="ViewportSplitDividerShell" style={{ gridArea: 'divider' }}>
        <button
          type="button"
          className="ViewportSplitDivider"
          onPointerDown={handleBrowserSplitResizeStart}
          aria-label="Resize browser split view"
          title="Drag to resize viewport and browser"
        />
      </div>
      <div className="ViewportSplitPane ViewportSplitPane--editor" style={{ gridArea: 'editor' }}>
        <div ref={browserViewportSplitHostRef} className="BrowserViewportSplitHost" />
      </div>
    </div>
  ) : (
    baseViewerSurface
  )

  return (
    <div ref={appShellRef} className="AppShellRoot">
      <aside
        className="LeftDock"
        style={{
          width: `${leftDockWidth}px`,
          minWidth: `${leftDockWidth}px`,
          maxWidth: `${leftDockWidth}px`,
          bottom:
            showSplitLayout &&
            splitDirection === 'horizontal' &&
            splitDockSide === 'bottom' &&
            (!isLeftDockViewportSplit || splitPriority !== 'favorFirst')
              ? `calc(${((1 - splitRatio) * 100).toFixed(4)}% + ${splitDividerHeight}px)`
              : '0px',
        }}
      >
        <div className="LeftDockContent">
          <TitleStatusBar />
          <div
            className={`LeftDockPanelStackShell ${
              isLeftDockViewportSplit || showSplitLayout ? 'isConstrained' : ''
            }`}
          >
            <div className={`PanelStack ${isLeftDockViewportSplit || showSplitLayout ? 'isConstrained' : ''}`}>
              <div
                ref={dockedBrowserHostRef}
                className={`LeftDockPanelTarget LeftDockPanelTarget--browser ${
                  isBrowserDockPreviewActive ? 'isPreviewActive' : ''
                }`}
              >
                <div className="LeftDockPanelGhostSlot" aria-hidden={!isBrowserDockPreviewActive}>
                  <div className="LeftDockPanelGhost">Browser Dock Target</div>
                </div>
              </div>
              <div
                ref={dockedMeatballHostRef}
                className={`LeftDockPanelTarget LeftDockPanelTarget--meatball-editor ${
                  isMeatballDockPreviewActive ? 'isPreviewActive' : ''
                }`}
              >
                <div className="LeftDockPanelGhostSlot" aria-hidden={!isMeatballDockPreviewActive}>
                  <div className="LeftDockPanelGhost">Meatball Dock Target</div>
                </div>
              </div>
            </div>
            <div
              className={`LeftDockResizeHandle ${
                isLeftDockViewportSplit && showSplitLayout ? 'isViewportSplit' : ''
              }`}
              onPointerDown={handleLeftDockResizeStart}
              onContextMenu={handleLeftDockResizeContextMenu}
              aria-hidden="true"
            >
              <button
                type="button"
                className={`LeftDockResizeToggle ${isLeftDockViewportSplit ? 'isActive' : ''}`}
                onPointerDown={handleLeftDockSplitTogglePointerDown}
                onClick={handleLeftDockSplitToggleClick}
                aria-label="Toggle left dock viewport split"
                title={isLeftDockViewportSplit ? 'Unsplit viewport' : 'Split viewport'}
              >
                []
              </button>
            </div>
          </div>
        </div>
      </aside>
      <section
        ref={viewportRef}
        className={`ViewportArea ${isLeftDockViewportSplit && !showSplitLayout ? 'isLeftDockSplit' : ''}`}
        style={{
          marginLeft:
            isLeftDockViewportSplit && !showSplitLayout ? `${leftDockWidth}px` : undefined,
        }}
      >
        <SpaghettiWindowHost
          appShellRef={appShellRef}
          viewportRef={viewportRef}
          dockedMeatballHostRef={dockedMeatballHostRef}
          leftDockWidth={leftDockWidth}
          isLeftDockViewportSplit={isLeftDockViewportSplit}
          activeLeftDockPreviewPanelId={activeLeftDockPreviewPanelId}
          setActiveLeftDockPreviewPanelId={setActiveLeftDockPreviewPanelId}
          resolveLeftDockPreviewPanelId={resolveLeftDockPreviewPanelId}
          viewerSurface={viewerSurface}
          workspaceActiveSurface={workspaceActiveSurface}
          onActivateSpaghettiSurface={handleActivateSpaghettiSurface}
          onActivateSpaghettiFloatingWindow={handleActivateSpaghettiFloatingWindow}
          onOpenFloatingSplitMenu={handleFloatingSplitMenu}
          onOpenDividerSplitMenu={handleDividerSplitMenu}
          onResetSplitRatio={handleResetSplitRatio}
          leftDockWidthPreviewHandlerRef={leftDockWidthPreviewHandlerRef}
        />
        <ConsoleDock listLeftOffset={consoleListLeftOffset} />
      </section>
      <BrowserDockHost
        appShellRef={appShellRef}
        viewportRef={viewportRef}
        viewportSplitHostRef={browserViewportSplitHostRef}
        dockedBrowserHostRef={dockedBrowserHostRef}
        resolveLeftDockPreviewPanelId={resolveLeftDockPreviewPanelId}
        onActivateBrowserFloatingWindow={handleActivateBrowserFloatingWindow}
        newEditorSpawnPosition={newEditorSpawnPosition}
        workspaceActiveSurface={workspaceActiveSurface}
      />
      {leftDockResizeMenu !== null ? (
        <div className="LeftDockResizeMenu" style={leftDockResizeMenuStyle}>
          <button
            type="button"
            className="LeftDockResizeMenuAction"
            onClick={handleResetLeftDockWidth}
          >
            Default Width
          </button>
          <button
            type="button"
            className="LeftDockResizeMenuAction"
            onClick={handleToggleLeftDockViewportSplit}
          >
            {isLeftDockViewportSplit ? 'Unsplit Viewport' : 'Split Viewport'}
          </button>
        </div>
      ) : null}
      {workspaceSplitMenu !== null ? (
        <div className="WorkspaceSplitMenu LeftDockResizeMenu" style={workspaceSplitMenuStyle}>
          <button
            type="button"
            className="LeftDockResizeMenuAction"
            onClick={() => handleSetSplitDirection('horizontal')}
          >
            Split Horizontal
          </button>
          <button
            type="button"
            className="LeftDockResizeMenuAction"
            onClick={() => handleSetSplitDirection('vertical')}
          >
            Split Vertical
          </button>
          {workspaceSplitMenu.scope === 'divider' ? (
            <>
              <button
                type="button"
                className="LeftDockResizeMenuAction"
                onClick={handleResetSplitRatio}
              >
                Reset Ratio
              </button>
              <button
                type="button"
                className={`LeftDockResizeMenuAction ${
                  splitPriority === 'balanced' ? 'isActive' : ''
                }`}
                onClick={() => handleSetSplitPriority('balanced')}
              >
                Balanced Priority
              </button>
              <button
                type="button"
                className={`LeftDockResizeMenuAction ${
                  splitPriority === 'favorFirst' ? 'isActive' : ''
                }`}
                onClick={() => handleSetSplitPriority('favorFirst')}
              >
                Favor First Pane
              </button>
              <button
                type="button"
                className={`LeftDockResizeMenuAction ${
                  splitPriority === 'favorSecond' ? 'isActive' : ''
                }`}
                onClick={() => handleSetSplitPriority('favorSecond')}
              >
                Favor Second Pane
              </button>
              <button
                type="button"
                className="LeftDockResizeMenuAction"
                onClick={handleCloseSplitFromMenu}
              >
                Close Split
              </button>
              <button
                type="button"
                className="LeftDockResizeMenuAction"
                onClick={handleCloseSplitFromMenu}
              >
                Merge With Neighbor
              </button>
            </>
          ) : null}
        </div>
      ) : null}
      {isRadioToolbarOpen ? <RadioPanel /> : null}
      <RadioRuntimeHost />
    </div>
  )
}
