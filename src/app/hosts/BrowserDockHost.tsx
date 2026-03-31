import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { BrowserPanel } from '../panels/BrowserPanel'
import { useWorkspaceChildWindow } from '../workspace/useWorkspaceChildWindow'
import { useWorkspaceStore } from '../workspace/useWorkspaceStore'
import {
  defaultBrowserPopoutState,
  defaultBrowserFloatingSize,
  defaultBrowserToolbarOwnerSurfaceInstanceId,
  type BrowserFloatingPosition,
  type BrowserFloatingSize,
  type LeftDockPanelId,
  type WorkspaceViewportSlotId,
} from '../workspace/workspaceShellTypes'
import {
  type WorkspaceSplitDockSide,
} from '../workspace/workspaceSplitTypes'

const minBrowserFloatingWidth = 280
const minBrowserFloatingHeight = 220
const floatingEdgePadding = 12
const browserPopoutBackground = 'rgb(11, 12, 16)'
const browserSplitDividerSize = 10
const browserSplitPreviewEdgePadding = 14
const browserSplitPreviewOuterBandPadding = 28

type BrowserFloatingFrame = {
  shellWidth: number
  shellHeight: number
  minY: number
  maxY: number
}

type BrowserNestedSplitPreview = {
  targetSlotId: WorkspaceViewportSlotId
  candidateSides: readonly [WorkspaceSplitDockSide, WorkspaceSplitDockSide]
  activeSide: WorkspaceSplitDockSide
  rect: {
    left: number
    top: number
    width: number
    height: number
  }
}

type BrowserSplitDockPreview = {
  side: WorkspaceSplitDockSide
  scope: 'pane-local' | 'whole-browser'
  targetSlotId: WorkspaceViewportSlotId | null
  rect: {
    left: number
    top: number
    width: number
    height: number
  }
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
  const setBrowserToolbarOwnerSurfaceInstanceId = useWorkspaceStore(
    (state) => state.setBrowserToolbarOwnerSurfaceInstanceId,
  )
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
  const splitViewportSlot = useWorkspaceStore((state) => state.splitViewportSlot)
  const splitViewportRoot = useWorkspaceStore((state) => state.splitViewportRoot)
  const viewportSlotsById = useWorkspaceStore((state) => state.viewportSlotsById)
  const viewportLayoutNodesById = useWorkspaceStore((state) => state.viewportLayoutNodesById)
  const browserToolbarOwnerSurfaceInstanceId = useWorkspaceStore(
    (state) => state.browserToolbarOwnerSurfaceInstanceId,
  )
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
  const browserSplitDockPreviewRef = useRef<BrowserSplitDockPreview | null>(null)
  const browserNestedSplitPreviewRef = useRef<BrowserNestedSplitPreview | null>(null)
  const browserDragUserSelectRestoreRef = useRef<string | null>(null)
  const [browserSplitDockPreview, setBrowserSplitDockPreview] =
    useState<BrowserSplitDockPreview | null>(null)
  const [browserNestedSplitPreview, setBrowserNestedSplitPreview] =
    useState<BrowserNestedSplitPreview | null>(null)
  const activeDetachedBrowserSurface =
    Object.values(detachedSlotSurfaceById).find((surface) => surface.surfaceKind === 'browser') ?? null

  const forwardWheelIntoDockedBrowserScrollTarget = useCallback(
    (browserRoot: HTMLElement, deltaY: number) => {
      if (deltaY === 0) {
        return false
      }

      const dockedPanelStack = browserRoot.closest('.PanelStack.isConstrained')
      if (dockedPanelStack instanceof HTMLElement) {
        const maxScrollTop = Math.max(
          0,
          dockedPanelStack.scrollHeight - dockedPanelStack.clientHeight,
        )
        if (maxScrollTop > 0) {
          const nextScrollTop = Math.max(
            0,
            Math.min(maxScrollTop, dockedPanelStack.scrollTop + deltaY),
          )
          if (nextScrollTop !== dockedPanelStack.scrollTop) {
            dockedPanelStack.scrollTop = nextScrollTop
            return true
          }
        }
      }

      const browserBody = browserRoot.querySelector('.BrowserPanelBody')
      if (!(browserBody instanceof HTMLElement)) {
        return false
      }
      const maxScrollTop = Math.max(0, browserBody.scrollHeight - browserBody.clientHeight)
      if (maxScrollTop <= 0) {
        return false
      }
      const nextScrollTop = Math.max(0, Math.min(maxScrollTop, browserBody.scrollTop + deltaY))
      if (nextScrollTop === browserBody.scrollTop) {
        return false
      }
      browserBody.scrollTop = nextScrollTop
      return true
    },
    [],
  )

  const handleDockedBrowserWheelCapture = useCallback((event: ReactWheelEvent<HTMLElement>) => {
    const deltaY =
      Math.abs(event.deltaY) >= Math.abs(event.deltaX) || event.deltaX === 0
        ? event.deltaY
        : event.deltaX
    const didScroll = forwardWheelIntoDockedBrowserScrollTarget(event.currentTarget, deltaY)
    if (!didScroll) {
      return
    }
    event.preventDefault()
    event.stopPropagation()
  }, [forwardWheelIntoDockedBrowserScrollTarget])

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
    (pointerClientX: number, pointerClientY: number): BrowserSplitDockPreview | null => {
      const viewportRect = viewportRef.current?.getBoundingClientRect()
      if (viewportRect === undefined || viewportRect.width <= 0 || viewportRect.height <= 0) {
        return null
      }
      const overshootThreshold = 120
      if (
        pointerClientX < viewportRect.left - overshootThreshold ||
        pointerClientX > viewportRect.right + overshootThreshold ||
        pointerClientY < viewportRect.top - overshootThreshold ||
        pointerClientY > viewportRect.bottom + overshootThreshold
      ) {
        return null
      }
      const hoveredSlotElement =
        typeof document.elementsFromPoint === 'function'
          ? document
              .elementsFromPoint(pointerClientX, pointerClientY)
              .map((element) =>
                element instanceof HTMLElement
                  ? element.closest('[data-workspace-slot-id]')
                  : null,
              )
              .find(
                (element): element is HTMLElement =>
                  element instanceof HTMLElement && viewportRef.current?.contains(element) === true,
              ) ?? null
          : null
      const overshootSide =
        hoveredSlotElement !== null
          ? null
          : pointerClientX >= viewportRect.right &&
              pointerClientX <= viewportRect.right + browserSplitPreviewEdgePadding &&
              pointerClientY >= viewportRect.top &&
              pointerClientY <= viewportRect.bottom
            ? 'right'
            : pointerClientX <= viewportRect.left &&
                pointerClientX >= viewportRect.left - browserSplitPreviewEdgePadding &&
                pointerClientY >= viewportRect.top &&
                pointerClientY <= viewportRect.bottom
              ? 'left'
              : pointerClientY <= viewportRect.top &&
                  pointerClientY >= viewportRect.top - browserSplitPreviewEdgePadding &&
                  pointerClientX >= viewportRect.left &&
                  pointerClientX <= viewportRect.right
                ? 'top'
                : pointerClientY >= viewportRect.bottom &&
                    pointerClientY <= viewportRect.bottom + browserSplitPreviewEdgePadding &&
                    pointerClientX >= viewportRect.left &&
                    pointerClientX <= viewportRect.right
                  ? 'bottom'
                  : null
      if (overshootSide !== null) {
        const lastPreview = browserSplitDockPreviewRef.current
        if (lastPreview?.side === overshootSide) {
          return {
            side: overshootSide,
            scope: 'whole-browser',
            targetSlotId: null,
            rect: {
              left: 0,
              top: 0,
              width: viewportRect.width,
              height: viewportRect.height,
            },
          }
        }
      }
      const hoveredPaneRect = hoveredSlotElement?.getBoundingClientRect() ?? viewportRect
      const hoveredSlotId = hoveredSlotElement?.getAttribute('data-workspace-slot-id') ?? null
      const hoveredSlot = hoveredSlotId === null ? null : viewportSlotsById[hoveredSlotId] ?? null
      const modelViewportBodyRect =
        hoveredSlot?.surfaceKind === 'modelViewer'
          ? hoveredSlotElement?.querySelector('.ViewportFrameBody')?.getBoundingClientRect()
          : null
      const previewRect =
        modelViewportBodyRect !== undefined &&
        modelViewportBodyRect !== null &&
        modelViewportBodyRect.width > 0 &&
        modelViewportBodyRect.height > 0
          ? modelViewportBodyRect
          : hoveredPaneRect
      const clampedPointerClientX = Math.min(
        previewRect.right,
        Math.max(previewRect.left, pointerClientX),
      )
      const clampedPointerClientY = Math.min(
        previewRect.bottom,
        Math.max(previewRect.top, pointerClientY),
      )
      const topEdgeDistance = Math.max(0, clampedPointerClientY - previewRect.top)
      const rightEdgeDistance = Math.max(0, previewRect.right - clampedPointerClientX)
      const bottomEdgeDistance = Math.max(0, previewRect.bottom - clampedPointerClientY)
      const leftEdgeDistance = Math.max(0, clampedPointerClientX - previewRect.left)
      const edgeDistances: Array<{ side: WorkspaceSplitDockSide; distance: number }> = [
        {
          side: 'top',
          distance: topEdgeDistance,
        },
        {
          side: 'right',
          distance: rightEdgeDistance,
        },
        {
          side: 'bottom',
          distance: bottomEdgeDistance,
        },
        { side: 'left', distance: leftEdgeDistance },
      ]
      const previewableEdge = edgeDistances
        .filter((entry) =>
          entry.distance <= browserSplitPreviewOuterBandPadding,
        )
        .sort((left, right) => left.distance - right.distance)[0]
      if (previewableEdge === undefined) {
        return null
      }
      const isWholeBrowserPreview =
        previewableEdge.side === 'right'
          ? rightEdgeDistance <= browserSplitPreviewEdgePadding
          : previewableEdge.side === 'left'
            ? leftEdgeDistance <= browserSplitPreviewEdgePadding
            : previewableEdge.side === 'top'
              ? topEdgeDistance <= browserSplitPreviewEdgePadding
              : bottomEdgeDistance <= browserSplitPreviewEdgePadding
      return {
        side: previewableEdge.side,
        scope: isWholeBrowserPreview ? 'whole-browser' : 'pane-local',
        targetSlotId:
          !isWholeBrowserPreview ? hoveredSlotId : null,
        rect: isWholeBrowserPreview
          ? {
              left: 0,
              top: 0,
              width: viewportRect.width,
              height: viewportRect.height,
            }
          : {
              left: previewRect.left - viewportRect.left,
              top: previewRect.top - viewportRect.top,
              width: previewRect.width,
              height: previewRect.height,
            },
      }
    },
    [viewportRef, viewportSlotsById],
  )

  const findParentSplitNodeIdForLeaf = useCallback(
    (leafNodeId: string): string | null => {
      for (const [nodeId, node] of Object.entries(viewportLayoutNodesById)) {
        if (
          node.kind === 'split' &&
          (node.firstChildId === leafNodeId || node.secondChildId === leafNodeId)
        ) {
          return nodeId
        }
      }
      return null
    },
    [viewportLayoutNodesById],
  )

  const resolveBrowserNestedSplitPreview = useCallback(
    (pointerClientX: number, pointerClientY: number): BrowserNestedSplitPreview | null => {
      const viewportRect = viewportRef.current?.getBoundingClientRect()
      if (viewportRect === undefined || viewportRect.width <= 0 || viewportRect.height <= 0) {
        return null
      }
      if (typeof document.elementsFromPoint !== 'function') {
        return null
      }
      const hoveredSlotElement =
        document
          .elementsFromPoint(pointerClientX, pointerClientY)
          .map((element) =>
            element instanceof HTMLElement ? element.closest('[data-workspace-slot-id]') : null,
          )
          .find(
            (element): element is HTMLElement =>
              element instanceof HTMLElement &&
              viewportRef.current?.contains(element) === true &&
              element.getAttribute('data-workspace-slot-id') !== null,
          ) ?? null
      if (hoveredSlotElement === null) {
        return null
      }
      const targetSlotId = hoveredSlotElement.getAttribute('data-workspace-slot-id')
      if (targetSlotId === null) {
        return null
      }
      const targetSlot = viewportSlotsById[targetSlotId]
      if (targetSlot === undefined) {
        return null
      }
      if (targetSlot.surfaceKind === 'modelViewer') {
        return null
      }
      if (findParentSplitNodeIdForLeaf(targetSlot.leafNodeId) === null) {
        return null
      }

      const hoveredPaneRect = hoveredSlotElement.getBoundingClientRect()
      if (hoveredPaneRect.width <= 0 || hoveredPaneRect.height <= 0) {
        return null
      }
      const edgeThreshold = Math.min(
        96,
        Math.max(24, Math.round(Math.min(hoveredPaneRect.width, hoveredPaneRect.height) * 0.2)),
      )
      if (
        pointerClientX - hoveredPaneRect.left <= edgeThreshold ||
        hoveredPaneRect.right - pointerClientX <= edgeThreshold ||
        pointerClientY - hoveredPaneRect.top <= edgeThreshold ||
        hoveredPaneRect.bottom - pointerClientY <= edgeThreshold
      ) {
        return null
      }

      const paneCenterX = hoveredPaneRect.left + hoveredPaneRect.width / 2
      const paneCenterY = hoveredPaneRect.top + hoveredPaneRect.height / 2
      const normalizedX =
        hoveredPaneRect.width <= 0 ? 0 : (pointerClientX - paneCenterX) / (hoveredPaneRect.width / 2)
      const normalizedY =
        hoveredPaneRect.height <= 0
          ? 0
          : (pointerClientY - paneCenterY) / (hoveredPaneRect.height / 2)
      const preferLeftRight = Math.abs(normalizedX) >= Math.abs(normalizedY)
      const candidateSides = preferLeftRight
        ? (['left', 'right'] as const)
        : (['top', 'bottom'] as const)
      const activeSide = preferLeftRight
        ? pointerClientX <= paneCenterX
          ? 'left'
          : 'right'
        : pointerClientY <= paneCenterY
          ? 'top'
          : 'bottom'

      return {
        targetSlotId,
        candidateSides,
        activeSide,
        rect: {
          left: hoveredPaneRect.left - viewportRect.left,
          top: hoveredPaneRect.top - viewportRect.top,
          width: hoveredPaneRect.width,
          height: hoveredPaneRect.height,
        },
      }
    },
    [findParentSplitNodeIdForLeaf, viewportRef, viewportSlotsById],
  )

  const handleQuickDockBrowser = useCallback(() => {
    setBrowserFloatingSplitMenu(null)
    setActiveLeftDockPreviewPanelId(null)
    setBrowserSplitDockPreview(null)
    setBrowserNestedSplitPreview(null)
    if (activeDetachedBrowserSurface !== null) {
      clearDetachedSlotSurface(activeDetachedBrowserSurface.surfaceInstanceId)
      setBrowserToolbarOwnerSurfaceInstanceId(activeDetachedBrowserSurface.surfaceInstanceId)
    } else {
      setBrowserToolbarOwnerSurfaceInstanceId(defaultBrowserToolbarOwnerSurfaceInstanceId)
    }
    setIsBrowserViewportSplit(false)
    setIsBrowserFloating(false)
  }, [
    activeDetachedBrowserSurface,
    clearDetachedSlotSurface,
    setActiveLeftDockPreviewPanelId,
    setBrowserNestedSplitPreview,
    setBrowserToolbarOwnerSurfaceInstanceId,
    setIsBrowserFloating,
    setIsBrowserViewportSplit,
  ])

  const handleCycleBrowserPresentationMode = useCallback(() => {
    setBrowserPresentationMode(
      browserPresentationMode === 'expanded'
        ? 'essentials'
        : browserPresentationMode === 'essentials'
          ? 'collapsed'
          : 'expanded',
    )
  }, [browserPresentationMode, setBrowserPresentationMode])

  const handleOpenBrowserPopout = useCallback(() => {
    setActiveLeftDockPreviewPanelId(null)
    setBrowserSplitDockPreview(null)
    setBrowserNestedSplitPreview(null)
    if (isBrowserPoppedOut) {
      browserPopoutWindow?.focus()
      return
    }
    setBrowserPopoutState(browserPopoutState ?? defaultBrowserPopoutState)
    setIsBrowserPoppedOut(true)
  }, [
    browserPopoutWindow,
    browserPopoutState,
    setActiveLeftDockPreviewPanelId,
    setBrowserNestedSplitPreview,
    setBrowserPopoutState,
    setIsBrowserPoppedOut,
    isBrowserPoppedOut,
  ])

  const handleCloseBrowserPopout = useCallback(() => {
    setIsBrowserPoppedOut(false)
  }, [setIsBrowserPoppedOut])

  const handleOpenFloatingSplitMenu = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (!isBrowserFloating) {
        return
      }
      event.preventDefault()
      event.stopPropagation()
      setActiveLeftDockPreviewPanelId(null)
      setBrowserSplitDockPreview(null)
      setBrowserNestedSplitPreview(null)
      setBrowserFloatingSplitMenu({
        x: event.clientX,
        y: event.clientY,
      })
    },
    [
      isBrowserFloating,
      setActiveLeftDockPreviewPanelId,
      setBrowserNestedSplitPreview,
    ],
  )

  const handleSelectFloatingSplitDockSide = useCallback(
    (splitDockSide: WorkspaceSplitDockSide) => {
      setBrowserFloatingSplitMenu(null)
      setActiveLeftDockPreviewPanelId(null)
      setBrowserSplitDockPreview(null)
      setBrowserNestedSplitPreview(null)
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
      setBrowserNestedSplitPreview,
      setBrowserViewportSplitRatio,
      setBrowserViewportSplitDockSide,
    ],
  )

  const commitBrowserSlotSplit = useCallback(
    (targetSlotId: WorkspaceViewportSlotId, splitDockSide: WorkspaceSplitDockSide) => {
      const preferredRatio = resolvePreferredBrowserViewportSplitRatio(splitDockSide)
      if (activeDetachedBrowserSurface !== null) {
        splitViewportSlot(targetSlotId, splitDockSide, {
          surfaceKind: 'browser',
          surfaceInstanceId: activeDetachedBrowserSurface.surfaceInstanceId,
          preferredRatio,
        })
        clearDetachedSlotSurface(activeDetachedBrowserSurface.surfaceInstanceId)
        setIsBrowserFloating(false)
        setIsBrowserViewportSplit(false)
        return
      }

      splitViewportSlot(targetSlotId, splitDockSide, {
        surfaceKind: 'browser',
        surfaceInstanceId:
          browserToolbarOwnerSurfaceInstanceId ?? defaultBrowserToolbarOwnerSurfaceInstanceId,
        preferredRatio,
      })
      setBrowserToolbarOwnerSurfaceInstanceId(null)
      setIsBrowserFloating(false)
      setIsBrowserViewportSplit(false)
    },
    [
      activeDetachedBrowserSurface,
      browserToolbarOwnerSurfaceInstanceId,
      clearDetachedSlotSurface,
      resolvePreferredBrowserViewportSplitRatio,
      setBrowserToolbarOwnerSurfaceInstanceId,
      setIsBrowserFloating,
      setIsBrowserViewportSplit,
      splitViewportSlot,
    ],
  )

  const commitBrowserWholeLayoutSplit = useCallback(
    (splitDockSide: WorkspaceSplitDockSide) => {
      const preferredRatio = resolvePreferredBrowserViewportSplitRatio(splitDockSide)
      setBrowserViewportSplitRatio(preferredRatio)
      if (activeDetachedBrowserSurface !== null) {
        splitViewportRoot(splitDockSide, {
          surfaceKind: 'browser',
          surfaceInstanceId: activeDetachedBrowserSurface.surfaceInstanceId,
          preferredRatio,
          hostViewportId: activeDetachedBrowserSurface.hostViewportId,
        })
        clearDetachedSlotSurface(activeDetachedBrowserSurface.surfaceInstanceId)
        setIsBrowserFloating(false)
        setIsBrowserViewportSplit(false)
        return
      }

      splitViewportRoot(splitDockSide, {
        surfaceKind: 'browser',
        surfaceInstanceId:
          browserToolbarOwnerSurfaceInstanceId ?? defaultBrowserToolbarOwnerSurfaceInstanceId,
        preferredRatio,
      })
      setBrowserToolbarOwnerSurfaceInstanceId(null)
      setIsBrowserFloating(false)
      setIsBrowserViewportSplit(false)
    },
    [
      activeDetachedBrowserSurface,
      browserToolbarOwnerSurfaceInstanceId,
      clearDetachedSlotSurface,
      resolvePreferredBrowserViewportSplitRatio,
      setBrowserViewportSplitRatio,
      setBrowserToolbarOwnerSurfaceInstanceId,
      setIsBrowserFloating,
      setIsBrowserViewportSplit,
      splitViewportRoot,
    ],
  )

  const handleBrowserDragStart = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 || !isBrowserFloating) {
        return
      }
      setActiveLeftDockPreviewPanelId(null)
      setBrowserSplitDockPreview(null)
      setBrowserNestedSplitPreview(null)
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
    [
      appShellRef,
      isBrowserFloating,
      lockBrowserDragTextSelection,
      setActiveLeftDockPreviewPanelId,
      setBrowserNestedSplitPreview,
    ],
  )

  const handleBrowserDockDragStart = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 || isBrowserFloating) {
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
      setBrowserToolbarOwnerSurfaceInstanceId(null)
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
      setActiveLeftDockPreviewPanelId,
      setBrowserFloatingPos,
      setBrowserFloatingSize,
      setBrowserToolbarOwnerSurfaceInstanceId,
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
    browserSplitDockPreviewRef.current = browserSplitDockPreview
  }, [browserSplitDockPreview])

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
    if (!isBrowserFloating && browserSplitDockPreview !== null) {
      setBrowserSplitDockPreview(null)
    }
  }, [browserSplitDockPreview, isBrowserFloating])

  useEffect(() => {
    browserNestedSplitPreviewRef.current = browserNestedSplitPreview
  }, [browserNestedSplitPreview])

  useEffect(() => {
    if (!isBrowserFloating && browserNestedSplitPreview !== null) {
      setBrowserNestedSplitPreview(null)
    }
  }, [browserNestedSplitPreview, isBrowserFloating])

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
    const handleGlobalWheelCapture = (event: WheelEvent) => {
      if (isBrowserFloating || isBrowserViewportSplit) {
        return
      }
      const browserRoot = dockedBrowserPortalTarget?.querySelector('.BrowserPanelRoot')
      if (!(browserRoot instanceof HTMLElement)) {
        return
      }
      const rootRect = browserRoot.getBoundingClientRect()
      if (
        event.clientX < rootRect.left ||
        event.clientX > rootRect.right ||
        event.clientY < rootRect.top ||
        event.clientY > rootRect.bottom
      ) {
        return
      }
      const deltaY =
        Math.abs(event.deltaY) >= Math.abs(event.deltaX) || event.deltaX === 0
          ? event.deltaY
          : event.deltaX
      const didScroll = forwardWheelIntoDockedBrowserScrollTarget(browserRoot, deltaY)
      if (!didScroll) {
        return
      }
      event.preventDefault()
      event.stopPropagation()
    }

    window.addEventListener('wheel', handleGlobalWheelCapture, {
      capture: true,
      passive: false,
    })
    return () => {
      window.removeEventListener('wheel', handleGlobalWheelCapture, true)
    }
  }, [
    dockedBrowserPortalTarget,
    forwardWheelIntoDockedBrowserScrollTarget,
    isBrowserFloating,
    isBrowserViewportSplit,
  ])

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
        const nextNestedSplitPreview =
          allowDockOrSplit && nextDockPreviewPanelId === null
            ? resolveBrowserNestedSplitPreview(event.clientX, event.clientY)
            : null
        const nextSplitDockPreviewSide =
          allowDockOrSplit &&
          nextDockPreviewPanelId === null &&
          nextNestedSplitPreview === null
            ? resolveBrowserSplitDockPreviewSide(
                event.clientX,
                event.clientY,
              )
            : null
        browserNestedSplitPreviewRef.current = nextNestedSplitPreview
        browserSplitDockPreviewRef.current = nextSplitDockPreviewSide
        setBrowserNestedSplitPreview(nextNestedSplitPreview)
        setBrowserSplitDockPreview(nextSplitDockPreviewSide)
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
      const nextNestedSplitPreview =
        !allowDockOrSplit || browserDragRef.current === null
          ? null
          : browserNestedSplitPreviewRef.current ??
            resolveBrowserNestedSplitPreview(event.clientX, event.clientY)
      const nextSplitDockPreview =
        !allowDockOrSplit ||
        browserDragRef.current === null ||
        nextNestedSplitPreview !== null
          ? null
          : browserSplitDockPreviewRef.current ??
            resolveBrowserSplitDockPreviewSide(event.clientX, event.clientY)
      browserDragRef.current = null
      unlockBrowserDragTextSelection()
      setActiveLeftDockPreviewPanelId(null)
      setBrowserSplitDockPreview(null)
      setBrowserNestedSplitPreview(null)
      if (shouldDockBrowser) {
        if (activeDetachedBrowserSurface !== null) {
          clearDetachedSlotSurface(activeDetachedBrowserSurface.surfaceInstanceId)
          setBrowserToolbarOwnerSurfaceInstanceId(activeDetachedBrowserSurface.surfaceInstanceId)
        } else {
          setBrowserToolbarOwnerSurfaceInstanceId(defaultBrowserToolbarOwnerSurfaceInstanceId)
        }
        setIsBrowserFloating(false)
      } else if (nextNestedSplitPreview !== null) {
        commitBrowserSlotSplit(nextNestedSplitPreview.targetSlotId, nextNestedSplitPreview.activeSide)
      } else if (nextSplitDockPreview !== null) {
        if (
          nextSplitDockPreview.scope === 'pane-local' &&
          nextSplitDockPreview.targetSlotId !== null
        ) {
          commitBrowserSlotSplit(nextSplitDockPreview.targetSlotId, nextSplitDockPreview.side)
        } else {
          commitBrowserWholeLayoutSplit(nextSplitDockPreview.side)
        }
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
    commitBrowserSlotSplit,
    commitBrowserWholeLayoutSplit,
    clearDetachedSlotSurface,
    clampBrowserFloatingPos,
    clampBrowserFloatingSize,
    isBrowserFloating,
    resolveBrowserNestedSplitPreview,
    resolveBrowserSplitDockPreviewSide,
    resolveLeftDockPreviewPanelId,
    setActiveLeftDockPreviewPanelId,
    setBrowserFloatingPos,
    setBrowserFloatingSize,
    setBrowserNestedSplitPreview,
    setBrowserSplitDockPreview,
    setBrowserToolbarOwnerSurfaceInstanceId,
    setIsBrowserFloating,
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
      !isBrowserViewportSplit
        ? createPortal(
            <BrowserPanel
              presentationMode={browserPresentationMode}
              onCyclePresentationMode={handleCycleBrowserPresentationMode}
              isCollapsed={isBrowserCollapsed}
              popoutButtonMode="popout"
              onTogglePopout={handleOpenBrowserPopout}
              onTitleBarPointerDown={handleBrowserDockDragStart}
              onWheelCapture={handleDockedBrowserWheelCapture}
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
                onTogglePopout={handleCloseBrowserPopout}
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
                popoutButtonMode="popout"
                onTogglePopout={handleOpenBrowserPopout}
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
              onQuickDock={handleQuickDockBrowser}
              onTogglePopout={handleOpenBrowserPopout}
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
      {browserSplitDockPreview !== null && viewportRef.current !== null
        ? createPortal(
            (() => {
              const horizontalPreviewRatio = 0.25
              const verticalPreviewHeight = Math.max(
                0,
                browserSplitDockPreview.rect.height * browserViewportSplitRatio - 10,
              )
              const horizontalPreviewWidth = Math.max(
                0,
                browserSplitDockPreview.rect.width * horizontalPreviewRatio - 10,
              )
              return (
                <div
                  className={`ViewportSplitDockGhost ${
                    browserSplitDockPreview.scope === 'whole-browser'
                      ? 'isWholeBrowserScope'
                      : 'isPaneLocalScope'
                  } ${
                    browserSplitDockPreview.side === 'left'
                      ? 'isDockLeft'
                      : browserSplitDockPreview.side === 'right'
                        ? 'isDockRight'
                        : browserSplitDockPreview.side === 'top'
                          ? 'isDockTop'
                          : 'isDockBottom'
                  }`}
                  data-split-preview-scope={browserSplitDockPreview.scope}
                  style={
                    browserSplitDockPreview.side === 'bottom'
                      ? ({
                          left: `${browserSplitDockPreview.rect.left}px`,
                          top: `${browserSplitDockPreview.rect.top + browserSplitDockPreview.rect.height * (1 - browserViewportSplitRatio) + 10}px`,
                          width: `${browserSplitDockPreview.rect.width}px`,
                          height: `${verticalPreviewHeight}px`,
                          right: 'auto',
                          bottom: 'auto',
                        } as CSSProperties)
                      : browserSplitDockPreview.side === 'top'
                        ? ({
                            left: `${browserSplitDockPreview.rect.left}px`,
                            top: `${browserSplitDockPreview.rect.top}px`,
                            width: `${browserSplitDockPreview.rect.width}px`,
                            height: `${verticalPreviewHeight}px`,
                            right: 'auto',
                            bottom: 'auto',
                          } as CSSProperties)
                        : browserSplitDockPreview.side === 'right'
                          ? ({
                              left: `${browserSplitDockPreview.rect.left + browserSplitDockPreview.rect.width * (1 - horizontalPreviewRatio) + 10}px`,
                              top: `${browserSplitDockPreview.rect.top}px`,
                              width: `${horizontalPreviewWidth}px`,
                              height: `${browserSplitDockPreview.rect.height}px`,
                              right: 'auto',
                              bottom: 'auto',
                            } as CSSProperties)
                          : ({
                              left: `${browserSplitDockPreview.rect.left}px`,
                              top: `${browserSplitDockPreview.rect.top}px`,
                              width: `${horizontalPreviewWidth}px`,
                              height: `${browserSplitDockPreview.rect.height}px`,
                              right: 'auto',
                              bottom: 'auto',
                            } as CSSProperties)
                  }
                  aria-hidden="true"
                />
              )
            })(),
            viewportRef.current,
          )
        : null}
      {browserNestedSplitPreview !== null && viewportRef.current !== null
        ? createPortal(
            <>
              {browserNestedSplitPreview.candidateSides.map((side, index) => {
                const isLeftRightPair = browserNestedSplitPreview.candidateSides[0] === 'left'
                const candidateWidth = isLeftRightPair
                  ? browserNestedSplitPreview.rect.width / 2
                  : browserNestedSplitPreview.rect.width
                const candidateHeight = isLeftRightPair
                  ? browserNestedSplitPreview.rect.height
                  : browserNestedSplitPreview.rect.height / 2
                const left =
                  isLeftRightPair && index === 1
                    ? browserNestedSplitPreview.rect.left + candidateWidth
                    : browserNestedSplitPreview.rect.left
                const top =
                  !isLeftRightPair && index === 1
                    ? browserNestedSplitPreview.rect.top + candidateHeight
                    : browserNestedSplitPreview.rect.top
                const isActive = browserNestedSplitPreview.activeSide === side
                return (
                  <div
                    key={side}
                    className={`ViewportSplitDockGhost isNestedSuggestion ${
                      isActive ? 'isActiveNestedSuggestion' : 'isInactiveNestedSuggestion'
                    }`}
                    data-split-preview-kind="nested"
                    data-split-preview-side={side}
                    data-split-preview-active={isActive ? 'true' : 'false'}
                    style={{
                      left: `${left}px`,
                      top: `${top}px`,
                      width: `${candidateWidth}px`,
                      height: `${candidateHeight}px`,
                      right: 'auto',
                      bottom: 'auto',
                      borderRadius: '12px',
                    }}
                    aria-hidden="true"
                  />
                )
              })}
            </>,
            viewportRef.current,
          )
        : null}
    </>
  )
}
