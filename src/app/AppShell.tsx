import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { TitleStatusBar } from './components/TitleStatusBar'
import { ViewToolbar } from './components/ViewToolbar'
import { ViewerHost } from './components/ViewerHost'
import { ViewportOverlay } from './components/ViewportOverlay'
import { ConsoleDock } from './console/ConsoleDock'
import { BrowserDockHost } from './hosts/BrowserDockHost'
import { RadioRuntimeHost } from './hosts/RadioRuntimeHost'
import { SpaghettiWindowHost } from './hosts/SpaghettiWindowHost'
import {
  defaultLeftDockWidth,
  useAppShellDockController,
} from './hosts/useAppShellDockController'
import type {
  LeftDockResizeMenuState,
  WorkspaceSplitMenuState,
} from './hosts/useAppShellDockController'
import { RadioPanel } from './panels/RadioPanel'
import { selectActiveEditorViewport, useSpaghettiStore } from './spaghetti/store/useSpaghettiStore'
import { useAudioSamplerStore } from './store/audioSamplerStore'
import { useAppStore } from './store/useAppStore'
import {
  defaultWorkspaceSplitDirection,
  defaultWorkspaceSplitPriority,
  type WorkspaceSplitDirection,
  type WorkspaceSplitPriority,
} from './workspace/workspaceSplitTypes'

const floatingDockLockGap = 25
const splitDividerHeight = 10

export function AppShell() {
  const activeEditorViewport = useSpaghettiStore(selectActiveEditorViewport)
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
  const dockedBrowserHostRef = useRef<HTMLDivElement | null>(null)
  const dockedMeatballHostRef = useRef<HTMLDivElement | null>(null)
  const leftDockWidthPreviewHandlerRef = useRef<((nextWidth: number) => void) | null>(null)
  const [leftDockWidth, setLeftDockWidth] = useState(defaultLeftDockWidth)
  const [isLeftDockViewportSplit, setIsLeftDockViewportSplit] = useState(false)
  const [activeLeftDockPreviewPanelId, setActiveLeftDockPreviewPanelId] = useState<
    'browser' | 'meatball-editor' | null
  >(null)
  const [isBrowserFloating, setIsBrowserFloating] = useState(false)
  const [leftDockResizeMenu, setLeftDockResizeMenu] = useState<LeftDockResizeMenuState | null>(null)
  const [workspaceSplitMenu, setWorkspaceSplitMenu] = useState<WorkspaceSplitMenuState | null>(null)
  const [, setActiveFloatingShell] = useState<'spaghetti' | 'browser' | null>(null)
  const lastHandledFloatingShellActivationSeqRef = useRef(0)

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
    leftDockResizeMenu,
    setLeftDockResizeMenu,
    workspaceSplitMenu,
    setWorkspaceSplitMenu,
    setIsLeftDockViewportSplit,
    onLeftDockWidthPreview: (nextWidth) => {
      leftDockWidthPreviewHandlerRef.current?.(nextWidth)
    },
  })

  const activeWindowMode = activeEditorViewport?.windowMode ?? null
  const showEditorSurface = activeEditorViewport !== null
  const showFloatingShell =
    showEditorSurface &&
    (activeWindowMode === 'expanded' ||
      activeWindowMode === 'maximized' ||
      activeWindowMode === 'collapsed')
  const showSplitLayout = showEditorSurface && activeWindowMode === 'split view'
  const splitRatio = activeEditorViewport?.splitRatio ?? 0.5
  const splitDirection = activeEditorViewport?.splitDirection ?? defaultWorkspaceSplitDirection
  const splitPriority = activeEditorViewport?.splitPriority ?? defaultWorkspaceSplitPriority
  const isBrowserDockPreviewActive = activeLeftDockPreviewPanelId === 'browser'
  const isMeatballDockPreviewActive = activeLeftDockPreviewPanelId === 'meatball-editor'

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
    if (!isBrowserFloating && workspaceActiveSurface === 'browser') {
      setActiveFloatingShell(null)
    }
  }, [isBrowserFloating, workspaceActiveSurface])

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
    if (isBrowserFloating) {
      setActiveFloatingShell('browser')
      setActiveSurface('browser')
    }
  }, [floatingShellActivationRequest, isBrowserFloating, setActiveSurface, showFloatingShell])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target
      if (
        target instanceof Element &&
        (target.closest('.SpaghettiFloatingWindow') !== null ||
          target.closest('.BrowserFloatingWindow') !== null ||
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

  const viewerSurface = (
    <>
      <div className="ViewportViewerSurface" onPointerDownCapture={handleActivateViewerSurface}>
        <ViewerHost />
      </div>
      <ViewportOverlay />
    </>
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
        dockedBrowserHostRef={dockedBrowserHostRef}
        activeLeftDockPreviewPanelId={activeLeftDockPreviewPanelId}
        setActiveLeftDockPreviewPanelId={setActiveLeftDockPreviewPanelId}
        resolveLeftDockPreviewPanelId={resolveLeftDockPreviewPanelId}
        onActivateBrowserFloatingWindow={handleActivateBrowserFloatingWindow}
        onFloatingStateChange={setIsBrowserFloating}
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
      <ViewToolbar />
    </div>
  )
}
