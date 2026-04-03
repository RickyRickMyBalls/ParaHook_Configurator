import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type Dispatch,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type RefObject,
  type SetStateAction,
} from 'react'
import { createPortal } from 'react-dom'
import { useConsoleStore } from '../console/useConsoleStore'
import type {
  EditorViewport,
  EditorViewportWindowMode,
} from '../spaghetti/schema/spaghettiTypes'
import {
  commitWorkspaceSurfaceRootSplit,
  commitWorkspaceSurfaceSlotSplit,
  floatingConsoleCompatibilitySurfaceInstanceId,
  splitWorkspaceSurfaceToSide,
} from '../workspace/workspaceSurfaceActions'
import {
  defaultBrowserFloatingPosition,
  defaultBrowserFloatingSize,
  type EditorWorkspaceSurfaceState,
  type LeftDockResizeMenuState,
  type WorkspaceLayoutNode,
  type WorkspaceSplitMenuState,
  type WorkspaceViewportSlot,
} from '../workspace/workspaceShellTypes'
import {
  resolveWorkspaceSplitDirectionForDockSide,
  type WorkspaceSplitDirection,
  type WorkspaceSplitDockSide,
  type WorkspaceSplitPriority,
} from '../workspace/workspaceSplitTypes'

export type ViewportSpawnMenuState = {
  viewportId: string
  x: number
  y: number
  query: string
}

type UseAppShellWorkspaceMenusInput = {
  viewportRef: RefObject<HTMLElement | null>
  viewportSpawnMenu: ViewportSpawnMenuState | null
  setViewportSpawnMenu: Dispatch<SetStateAction<ViewportSpawnMenuState | null>>
  leftDockResizeMenu: LeftDockResizeMenuState | null
  workspaceSplitMenu: WorkspaceSplitMenuState | null
  isLeftDockViewportSplit: boolean
  activeDetachedConsoleSurface: {
    surfaceInstanceId: string
  } | null
  activeGraphDocumentId: string | null
  graphDocumentOrder: string[]
  editorViewportsById: Record<string, EditorViewport>
  splitRatio: number
  viewportLayoutNodesById: Record<string, WorkspaceLayoutNode>
  workspaceSplitMenuTargetSurfaceInstanceId: string | null
  workspaceSplitMenuTargetEditorViewport: EditorViewport | null
  workspaceSplitMenuTargetEditorSurface: EditorWorkspaceSurfaceState | null
  workspaceSplitMenuTargetEditorSlot: WorkspaceViewportSlot | null
  workspaceSplitMenuTargetSplitPriority: WorkspaceSplitPriority
  workspaceSplitMenuTargetSurfaceKind: 'console' | 'spaghettiEditor' | null
  resolveViewerTargetSlotId: () => string
  handleActivateViewerSurface: (viewportId: string) => void
  handleActivateSpaghettiSurface: (
    editorViewportId?: string,
    target?: {
      graphDocumentId?: string | null
      nodeId?: string | null
      mode?: 'graph' | 'node'
    },
  ) => void
  handleActivateBrowserFloatingWindow: () => void
  openGraphDocumentInNewViewport: (graphDocumentId: string) => string | null
  setEditorViewportPosition: (
    editorViewportId: string,
    position: {
      x: number
      y: number
    },
  ) => void
  setEditorViewportSplitDirection: (
    editorViewportId: string,
    splitDirection: WorkspaceSplitDirection,
  ) => void
  setEditorViewportSplitPriority: (
    editorViewportId: string,
    splitPriority: WorkspaceSplitPriority,
  ) => void
  setEditorViewportSplitRatio: (editorViewportId: string, splitRatio: number) => void
  setEditorViewportWindowMode: (
    editorViewportId: string,
    windowMode: EditorViewportWindowMode,
  ) => void
  setViewportLayoutSplitRatio: (nodeId: string, splitRatio: number) => void
  setWorkspaceSplitMenu: (menu: WorkspaceSplitMenuState | null) => void
  setIsBrowserPoppedOut: (isPoppedOut: boolean) => void
  setIsBrowserViewportSplit: (isViewportSplit: boolean) => void
  setBrowserFloating: (isFloating: boolean) => void
  setBrowserFloatingPosition: (position: { x: number; y: number }) => void
  setBrowserFloatingSize: (size: { width: number; height: number }) => void
  closeEditorViewport: (editorViewportId: string) => void
  removeViewportSlot: (slotId: string) => void
  handleResetLeftDockWidth: () => void
  handleTogglePrimaryLeftDockSlotSplit: () => void
}

const findParentSplitNodeIdForLayoutNode = (
  childNodeId: string,
  viewportLayoutNodesById: Record<string, WorkspaceLayoutNode>,
): string | null => {
  for (const node of Object.values(viewportLayoutNodesById)) {
    if (
      node.kind === 'split' &&
      (node.firstChildId === childNodeId || node.secondChildId === childNodeId)
    ) {
      return node.nodeId
    }
  }
  return null
}

const clampMenuStyle = (
  x: number,
  y: number,
  width: number,
  height: number,
): CSSProperties => ({
  left: `${Math.max(
    12,
    Math.min(x, (typeof window === 'undefined' ? x : window.innerWidth) - width),
  )}px`,
  top: `${Math.max(
    12,
    Math.min(y, (typeof window === 'undefined' ? y : window.innerHeight) - height),
  )}px`,
})

export function useAppShellWorkspaceMenus(input: UseAppShellWorkspaceMenusInput) {
  const {
    viewportRef,
    viewportSpawnMenu,
    setViewportSpawnMenu,
    leftDockResizeMenu,
    workspaceSplitMenu,
    isLeftDockViewportSplit,
    activeDetachedConsoleSurface,
    activeGraphDocumentId,
    graphDocumentOrder,
    editorViewportsById,
    splitRatio,
    viewportLayoutNodesById,
    workspaceSplitMenuTargetSurfaceInstanceId,
    workspaceSplitMenuTargetEditorViewport,
    workspaceSplitMenuTargetEditorSurface,
    workspaceSplitMenuTargetEditorSlot,
    workspaceSplitMenuTargetSplitPriority,
    workspaceSplitMenuTargetSurfaceKind,
    resolveViewerTargetSlotId,
    handleActivateViewerSurface,
    handleActivateSpaghettiSurface,
    handleActivateBrowserFloatingWindow,
    openGraphDocumentInNewViewport,
    setEditorViewportPosition,
    setEditorViewportSplitDirection,
    setEditorViewportSplitPriority,
    setEditorViewportSplitRatio,
    setEditorViewportWindowMode,
    setViewportLayoutSplitRatio,
    setWorkspaceSplitMenu,
    setIsBrowserPoppedOut,
    setIsBrowserViewportSplit,
    setBrowserFloating,
    setBrowserFloatingPosition,
    setBrowserFloatingSize,
    closeEditorViewport,
    removeViewportSlot,
    handleResetLeftDockWidth,
    handleTogglePrimaryLeftDockSlotSplit,
  } = input
  const viewportSpawnMenuRef = useRef<HTMLDivElement | null>(null)
  const viewportSpawnMenuInputRef = useRef<HTMLInputElement | null>(null)
  const [isFloatingSplitSubmenuHovered, setIsFloatingSplitSubmenuHovered] = useState(false)
  const [isFloatingSplitSubmenuLocked, setIsFloatingSplitSubmenuLocked] = useState(false)

  useEffect(() => {
    if (viewportSpawnMenu === null) {
      return
    }
    viewportSpawnMenuInputRef.current?.focus()
    const handlePointerDown = (event: PointerEvent) => {
      const targetNode = event.target as Node | null
      if (targetNode !== null && viewportSpawnMenuRef.current?.contains(targetNode)) {
        return
      }
      setViewportSpawnMenu(null)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return
      }
      setViewportSpawnMenu(null)
    }
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [setViewportSpawnMenu, viewportSpawnMenu])

  useEffect(() => {
    if (workspaceSplitMenu === null || workspaceSplitMenu.scope !== 'floating-titlebar') {
      setIsFloatingSplitSubmenuHovered(false)
      setIsFloatingSplitSubmenuLocked(false)
    }
  }, [workspaceSplitMenu])

  const handleOpenViewportSpawnMenu = useCallback(
    (viewportId: string, event: ReactMouseEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
      handleActivateViewerSurface(viewportId)
      setViewportSpawnMenu({
        viewportId,
        x: event.clientX,
        y: event.clientY,
        query: '',
      })
    },
    [handleActivateViewerSurface, setViewportSpawnMenu],
  )

  const resolveViewportSpawnPosition = useCallback(
    (clientX: number, clientY: number) => {
      const viewportRect = viewportRef.current?.getBoundingClientRect()
      if (viewportRect === undefined) {
        return { ...defaultBrowserFloatingPosition }
      }
      return {
        x: Math.max(24, Math.round(clientX - viewportRect.left + 20)),
        y: Math.max(24, Math.round(clientY - viewportRect.top + 20)),
      }
    },
    [viewportRef],
  )

  const handleSpawnViewportSpaghettiEditor = useCallback(() => {
    const graphDocumentId = activeGraphDocumentId || graphDocumentOrder[0] || null
    if (graphDocumentId === null || viewportSpawnMenu === null) {
      return
    }
    const editorViewportId = openGraphDocumentInNewViewport(graphDocumentId)
    if (editorViewportId !== null) {
      setEditorViewportPosition(
        editorViewportId,
        resolveViewportSpawnPosition(viewportSpawnMenu.x, viewportSpawnMenu.y),
      )
      handleActivateSpaghettiSurface(editorViewportId, {
        graphDocumentId,
        mode: 'graph',
      })
    }
    setViewportSpawnMenu(null)
  }, [
    activeGraphDocumentId,
    graphDocumentOrder,
    handleActivateSpaghettiSurface,
    openGraphDocumentInNewViewport,
    resolveViewportSpawnPosition,
    setEditorViewportPosition,
    setViewportSpawnMenu,
    viewportSpawnMenu,
  ])

  const handleSpawnViewportBrowser = useCallback(() => {
    if (viewportSpawnMenu === null) {
      return
    }
    const spawnPosition = resolveViewportSpawnPosition(viewportSpawnMenu.x, viewportSpawnMenu.y)
    setBrowserFloatingSize(defaultBrowserFloatingSize)
    setBrowserFloatingPosition(spawnPosition)
    setIsBrowserPoppedOut(false)
    setIsBrowserViewportSplit(false)
    setBrowserFloating(true)
    handleActivateBrowserFloatingWindow()
    setViewportSpawnMenu(null)
  }, [
    handleActivateBrowserFloatingWindow,
    resolveViewportSpawnPosition,
    setBrowserFloating,
    setBrowserFloatingPosition,
    setBrowserFloatingSize,
    setIsBrowserPoppedOut,
    setIsBrowserViewportSplit,
    setViewportSpawnMenu,
    viewportSpawnMenu,
  ])

  const viewportSpawnMenuItems = useMemo(() => {
    const normalizedQuery = viewportSpawnMenu?.query.trim().toLowerCase() ?? ''
    const items = [
      {
        id: 'spawn-spaghetti-editor',
        label: 'Spawn Spaghetti Editor',
        keywords: 'spaghetti editor graph',
        onSelect: handleSpawnViewportSpaghettiEditor,
      },
      {
        id: 'spawn-browser',
        label: 'Spawn Browser',
        keywords: 'browser panel',
        onSelect: handleSpawnViewportBrowser,
      },
    ]
    if (normalizedQuery.length === 0) {
      return items
    }
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(normalizedQuery) ||
        item.keywords.includes(normalizedQuery),
    )
  }, [handleSpawnViewportBrowser, handleSpawnViewportSpaghettiEditor, viewportSpawnMenu?.query])

  const handleFloatingSplitSubmenuMouseEnter = useCallback(() => {
    if (isFloatingSplitSubmenuLocked) {
      return
    }
    setIsFloatingSplitSubmenuHovered(true)
  }, [isFloatingSplitSubmenuLocked])

  const handleFloatingSplitSubmenuMouseLeave = useCallback(() => {
    if (isFloatingSplitSubmenuLocked) {
      return
    }
    setIsFloatingSplitSubmenuHovered(false)
  }, [isFloatingSplitSubmenuLocked])

  const handleToggleFloatingSplitSubmenu = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      setIsFloatingSplitSubmenuLocked((current) => {
        const nextValue = !current
        setIsFloatingSplitSubmenuHovered(nextValue)
        return nextValue
      })
    },
    [],
  )

  const handleFloatingSplitMenu = useCallback(
    (surfaceInstanceId: string, event: ReactMouseEvent<HTMLDivElement>) => {
      if (
        editorViewportsById[surfaceInstanceId] === undefined &&
        surfaceInstanceId !== floatingConsoleCompatibilitySurfaceInstanceId &&
        activeDetachedConsoleSurface?.surfaceInstanceId !== surfaceInstanceId
      ) {
        return
      }
      event.preventDefault()
      event.stopPropagation()
      setIsFloatingSplitSubmenuHovered(false)
      setIsFloatingSplitSubmenuLocked(false)
      setWorkspaceSplitMenu({
        x: event.clientX,
        y: event.clientY,
        scope: 'floating-titlebar',
        targetSurfaceInstanceId: surfaceInstanceId,
      })
    },
    [activeDetachedConsoleSurface, editorViewportsById, setWorkspaceSplitMenu],
  )

  const clearFloatingSplitSubmenuState = useCallback(() => {
    setIsFloatingSplitSubmenuHovered(false)
    setIsFloatingSplitSubmenuLocked(false)
  }, [])

  const handleCommitFloatingSurfaceSplit = useCallback(
    (splitDockSide: WorkspaceSplitDockSide, scope: 'local' | 'global') => {
      if (workspaceSplitMenuTargetSurfaceInstanceId === null) {
        return
      }
      if (workspaceSplitMenuTargetSurfaceKind === 'console') {
        const preferredRatio = 0.5
        if (scope === 'local') {
          commitWorkspaceSurfaceSlotSplit(
            workspaceSplitMenuTargetSurfaceInstanceId,
            resolveViewerTargetSlotId(),
            splitDockSide,
            { preferredRatio },
          )
        } else {
          commitWorkspaceSurfaceRootSplit(workspaceSplitMenuTargetSurfaceInstanceId, splitDockSide, {
            preferredRatio,
          })
        }
        setWorkspaceSplitMenu(null)
        clearFloatingSplitSubmenuState()
        return
      }
      if (workspaceSplitMenuTargetEditorViewport === null) {
        return
      }
      const editorViewportId = workspaceSplitMenuTargetEditorViewport.editorViewportId
      const preferredRatio =
        workspaceSplitMenuTargetEditorSurface?.splitRatio ??
        workspaceSplitMenuTargetEditorViewport.splitRatio ??
        splitRatio
      setEditorViewportSplitDirection(
        editorViewportId,
        resolveWorkspaceSplitDirectionForDockSide(splitDockSide),
      )
      if (scope === 'local') {
        commitWorkspaceSurfaceSlotSplit(editorViewportId, resolveViewerTargetSlotId(), splitDockSide, {
          preferredRatio,
        })
      } else {
        commitWorkspaceSurfaceRootSplit(editorViewportId, splitDockSide, {
          preferredRatio,
        })
      }
      setEditorViewportWindowMode(editorViewportId, 'expanded')
      setWorkspaceSplitMenu(null)
      clearFloatingSplitSubmenuState()
    },
    [
      clearFloatingSplitSubmenuState,
      resolveViewerTargetSlotId,
      setEditorViewportSplitDirection,
      setEditorViewportWindowMode,
      setWorkspaceSplitMenu,
      splitRatio,
      workspaceSplitMenuTargetEditorSurface,
      workspaceSplitMenuTargetEditorViewport,
      workspaceSplitMenuTargetSurfaceInstanceId,
      workspaceSplitMenuTargetSurfaceKind,
    ],
  )

  const handleSelectFloatingSurfaceSplitDockSide = useCallback(
    (splitDockSide: WorkspaceSplitDockSide) => {
      if (workspaceSplitMenuTargetSurfaceInstanceId === null) {
        return
      }
      if (
        workspaceSplitMenuTargetSurfaceKind === 'console' ||
        workspaceSplitMenuTargetSurfaceKind === 'spaghettiEditor'
      ) {
        splitWorkspaceSurfaceToSide(workspaceSplitMenuTargetSurfaceInstanceId, splitDockSide, {
          preferredRatio: 0.5,
          targetSlotId: resolveViewerTargetSlotId(),
        })
        setWorkspaceSplitMenu(null)
        clearFloatingSplitSubmenuState()
        return
      }
      setWorkspaceSplitMenu(null)
      clearFloatingSplitSubmenuState()
    },
    [
      clearFloatingSplitSubmenuState,
      resolveViewerTargetSlotId,
      setWorkspaceSplitMenu,
      workspaceSplitMenuTargetSurfaceInstanceId,
      workspaceSplitMenuTargetSurfaceKind,
    ],
  )

  const handleResetSplitRatio = useCallback(() => {
    if (workspaceSplitMenuTargetEditorViewport === null) {
      return
    }
    if (workspaceSplitMenuTargetEditorSlot !== null) {
      const parentSplitNodeId = findParentSplitNodeIdForLayoutNode(
        workspaceSplitMenuTargetEditorSlot.leafNodeId,
        viewportLayoutNodesById,
      )
      if (parentSplitNodeId !== null) {
        setViewportLayoutSplitRatio(parentSplitNodeId, 0.5)
      }
    } else {
      setEditorViewportSplitRatio(workspaceSplitMenuTargetEditorViewport.editorViewportId, 0.5)
    }
    setWorkspaceSplitMenu(null)
  }, [
    setEditorViewportSplitRatio,
    setViewportLayoutSplitRatio,
    setWorkspaceSplitMenu,
    viewportLayoutNodesById,
    workspaceSplitMenuTargetEditorSlot,
    workspaceSplitMenuTargetEditorViewport,
  ])

  const handleSetSplitPriority = useCallback(
    (nextPriority: WorkspaceSplitPriority) => {
      if (workspaceSplitMenuTargetEditorViewport === null) {
        return
      }
      setEditorViewportSplitPriority(
        workspaceSplitMenuTargetEditorViewport.editorViewportId,
        nextPriority,
      )
      setWorkspaceSplitMenu(null)
    },
    [setEditorViewportSplitPriority, setWorkspaceSplitMenu, workspaceSplitMenuTargetEditorViewport],
  )

  const handleCloseSplitFromMenu = useCallback(() => {
    if (workspaceSplitMenuTargetEditorViewport === null) {
      return
    }
    if (workspaceSplitMenuTargetEditorSlot !== null) {
      removeViewportSlot(workspaceSplitMenuTargetEditorSlot.slotId)
    }
    setEditorViewportWindowMode(workspaceSplitMenuTargetEditorViewport.editorViewportId, 'expanded')
    setWorkspaceSplitMenu(null)
  }, [
    removeViewportSlot,
    setEditorViewportWindowMode,
    setWorkspaceSplitMenu,
    workspaceSplitMenuTargetEditorSlot,
    workspaceSplitMenuTargetEditorViewport,
  ])

  const handleCloseSurfaceFromFloatingMenu = useCallback(() => {
    if (workspaceSplitMenuTargetSurfaceKind === 'console') {
      useConsoleStore.getState().switchToDocked(false)
      setWorkspaceSplitMenu(null)
      clearFloatingSplitSubmenuState()
      return
    }
    if (workspaceSplitMenuTargetEditorViewport === null) {
      return
    }
    closeEditorViewport(workspaceSplitMenuTargetEditorViewport.editorViewportId)
    setWorkspaceSplitMenu(null)
    clearFloatingSplitSubmenuState()
  }, [
    clearFloatingSplitSubmenuState,
    closeEditorViewport,
    setWorkspaceSplitMenu,
    workspaceSplitMenuTargetEditorViewport,
    workspaceSplitMenuTargetSurfaceKind,
  ])

  const viewportSpawnMenuSurface: ReactNode =
    viewportSpawnMenu !== null && viewportRef.current !== null
      ? createPortal(
          <div
            ref={viewportSpawnMenuRef}
            className="ViewportSpawnMenu"
            style={{
              left: `${Math.max(
                12,
                Math.round(
                  viewportSpawnMenu.x - (viewportRef.current?.getBoundingClientRect().left ?? 0),
                ),
              )}px`,
              top: `${Math.max(
                12,
                Math.round(
                  viewportSpawnMenu.y - (viewportRef.current?.getBoundingClientRect().top ?? 0),
                ),
              )}px`,
            }}
          >
            <input
              ref={viewportSpawnMenuInputRef}
              className="ViewportSpawnMenuSearch"
              type="text"
              value={viewportSpawnMenu.query}
              placeholder="Search spawn actions"
              onChange={(event) => {
                const nextQuery = event.target.value
                setViewportSpawnMenu((current) =>
                  current === null ? null : { ...current, query: nextQuery },
                )
              }}
            />
            <div className="ViewportSpawnMenuList">
              {viewportSpawnMenuItems.length > 0 ? (
                viewportSpawnMenuItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="ViewportSpawnMenuAction"
                    onClick={() => {
                      item.onSelect()
                    }}
                  >
                    {item.label}
                  </button>
                ))
              ) : (
                <div className="ViewportSpawnMenuEmpty">No matching actions.</div>
              )}
            </div>
          </div>,
          viewportRef.current,
        )
      : null

  const leftDockResizeMenuSurface: ReactNode =
    leftDockResizeMenu !== null ? (
      <div
        className="PrimaryViewportLeftDockResizeMenu"
        style={clampMenuStyle(leftDockResizeMenu.x, leftDockResizeMenu.y, 220, 120)}
      >
        <button
          type="button"
          className="PrimaryViewportLeftDockResizeMenuAction"
          onClick={handleResetLeftDockWidth}
        >
          Default Width
        </button>
        <button
          type="button"
          className="PrimaryViewportLeftDockResizeMenuAction"
          onClick={handleTogglePrimaryLeftDockSlotSplit}
        >
          {isLeftDockViewportSplit ? 'Unsplit Viewport' : 'Split Viewport'}
        </button>
      </div>
    ) : null

  const isFloatingSplitSubmenuOpen = isFloatingSplitSubmenuLocked || isFloatingSplitSubmenuHovered
  const workspaceSplitMenuSurface: ReactNode =
    workspaceSplitMenu !== null ? (
      <div
        className="WorkspaceSplitMenu PrimaryViewportLeftDockResizeMenu"
        style={clampMenuStyle(workspaceSplitMenu.x, workspaceSplitMenu.y, 240, 280)}
      >
        {workspaceSplitMenu.scope === 'floating-titlebar' ? (
          <>
            {workspaceSplitMenuTargetSurfaceKind === 'console' ||
            workspaceSplitMenuTargetSurfaceKind === 'spaghettiEditor' ? (
              <>
                <div
                  className="PrimaryViewportLeftDockResizeMenuSubmenuGroup"
                  onMouseEnter={handleFloatingSplitSubmenuMouseEnter}
                  onMouseLeave={handleFloatingSplitSubmenuMouseLeave}
                >
                  <button
                    type="button"
                    className="PrimaryViewportLeftDockResizeMenuAction PrimaryViewportLeftDockResizeMenuAction--submenu"
                    aria-haspopup="menu"
                    aria-expanded={isFloatingSplitSubmenuOpen}
                    onFocus={handleFloatingSplitSubmenuMouseEnter}
                    onClick={handleToggleFloatingSplitSubmenu}
                  >
                    <span>Split</span>
                    <span className="PrimaryViewportLeftDockResizeMenuChevron">›</span>
                  </button>
                  {isFloatingSplitSubmenuOpen ? (
                    <div className="PrimaryViewportLeftDockResizeSubmenu" role="menu">
                      <button
                        type="button"
                        className="PrimaryViewportLeftDockResizeMenuAction"
                        onClick={() => handleSelectFloatingSurfaceSplitDockSide('top')}
                      >
                        Split Top
                      </button>
                      <button
                        type="button"
                        className="PrimaryViewportLeftDockResizeMenuAction"
                        onClick={() => handleSelectFloatingSurfaceSplitDockSide('right')}
                      >
                        Split Right
                      </button>
                      <button
                        type="button"
                        className="PrimaryViewportLeftDockResizeMenuAction"
                        onClick={() => handleSelectFloatingSurfaceSplitDockSide('bottom')}
                      >
                        Split Bottom
                      </button>
                      <button
                        type="button"
                        className="PrimaryViewportLeftDockResizeMenuAction"
                        onClick={() => handleSelectFloatingSurfaceSplitDockSide('left')}
                      >
                        Split Left
                      </button>
                    </div>
                  ) : null}
                </div>
                <button
                  type="button"
                  className="PrimaryViewportLeftDockResizeMenuAction"
                  onClick={handleCloseSurfaceFromFloatingMenu}
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="PrimaryViewportLeftDockResizeMenuAction"
                  onClick={() => handleCommitFloatingSurfaceSplit('right', 'local')}
                >
                  Split Right Locally
                </button>
                <button
                  type="button"
                  className="PrimaryViewportLeftDockResizeMenuAction"
                  onClick={() => handleCommitFloatingSurfaceSplit('right', 'global')}
                >
                  Split Right Globally
                </button>
                <button
                  type="button"
                  className="PrimaryViewportLeftDockResizeMenuAction"
                  onClick={handleCloseSurfaceFromFloatingMenu}
                >
                  Close
                </button>
              </>
            )}
          </>
        ) : null}
        {workspaceSplitMenu.scope === 'divider' ? (
          <>
            <button
              type="button"
              className="PrimaryViewportLeftDockResizeMenuAction"
              onClick={handleResetSplitRatio}
            >
              Reset Ratio
            </button>
            <button
              type="button"
              className={`PrimaryViewportLeftDockResizeMenuAction ${
                workspaceSplitMenuTargetSplitPriority === 'balanced' ? 'isActive' : ''
              }`}
              onClick={() => handleSetSplitPriority('balanced')}
            >
              Balanced Priority
            </button>
            <button
              type="button"
              className={`PrimaryViewportLeftDockResizeMenuAction ${
                workspaceSplitMenuTargetSplitPriority === 'favorFirst' ? 'isActive' : ''
              }`}
              onClick={() => handleSetSplitPriority('favorFirst')}
            >
              Favor First Pane
            </button>
            <button
              type="button"
              className={`PrimaryViewportLeftDockResizeMenuAction ${
                workspaceSplitMenuTargetSplitPriority === 'favorSecond' ? 'isActive' : ''
              }`}
              onClick={() => handleSetSplitPriority('favorSecond')}
            >
              Favor Second Pane
            </button>
            <button
              type="button"
              className="PrimaryViewportLeftDockResizeMenuAction"
              onClick={handleCloseSplitFromMenu}
            >
              Close Split
            </button>
            <button
              type="button"
              className="PrimaryViewportLeftDockResizeMenuAction"
              onClick={handleCloseSplitFromMenu}
            >
              Merge With Neighbor
            </button>
          </>
        ) : null}
      </div>
    ) : null

  return {
    handleFloatingSplitMenu,
    handleOpenViewportSpawnMenu,
    leftDockResizeMenuSurface,
    viewportSpawnMenuSurface,
    workspaceSplitMenuSurface,
  }
}
