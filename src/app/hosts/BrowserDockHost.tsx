import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  type SetStateAction,
} from 'react'
import { createPortal } from 'react-dom'
import { BrowserPanel } from '../panels/BrowserPanel'
import { type LeftDockPanelId } from './useAppShellDockController'

type FloatingPosition = {
  x: number
  y: number
}

type FloatingSize = {
  width: number
  height: number
}

const minBrowserFloatingWidth = 280
const minBrowserFloatingHeight = 220
const floatingEdgePadding = 12
const defaultBrowserFloatingPosition: FloatingPosition = { x: 16, y: 96 }
const defaultBrowserFloatingSize: FloatingSize = { width: 320, height: 560 }

type BrowserDockHostProps = {
  appShellRef: RefObject<HTMLDivElement | null>
  dockedBrowserHostRef: RefObject<HTMLDivElement | null>
  activeLeftDockPreviewPanelId: LeftDockPanelId | null
  setActiveLeftDockPreviewPanelId: Dispatch<SetStateAction<LeftDockPanelId | null>>
  resolveLeftDockPreviewPanelId: (
    panelId: LeftDockPanelId,
    clientX: number,
    clientY: number,
  ) => LeftDockPanelId | null
  onActivateBrowserFloatingWindow: () => void
  onFloatingStateChange: (isFloating: boolean) => void
  newEditorSpawnPosition: {
    x: number
    y: number
  }
  workspaceActiveSurface: 'spaghetti' | 'browser' | 'console' | 'viewer' | null
}

export function BrowserDockHost(props: BrowserDockHostProps) {
  const {
    appShellRef,
    dockedBrowserHostRef,
    activeLeftDockPreviewPanelId,
    setActiveLeftDockPreviewPanelId,
    resolveLeftDockPreviewPanelId,
    onActivateBrowserFloatingWindow,
    onFloatingStateChange,
    newEditorSpawnPosition,
    workspaceActiveSurface,
  } = props
  const [dockedBrowserPortalTarget, setDockedBrowserPortalTarget] = useState<HTMLDivElement | null>(null)
  const [isBrowserFloating, setIsBrowserFloating] = useState(false)
  const [isBrowserCollapsed, setIsBrowserCollapsed] = useState(false)
  const [browserFloatingPos, setBrowserFloatingPos] = useState<FloatingPosition>(
    defaultBrowserFloatingPosition,
  )
  const [browserFloatingSize, setBrowserFloatingSize] = useState<FloatingSize>(
    defaultBrowserFloatingSize,
  )
  const browserFloatingWindowRef = useRef<HTMLDivElement | null>(null)
  const browserFloatingPosRef = useRef<FloatingPosition>(defaultBrowserFloatingPosition)
  const browserFloatingSizeRef = useRef<FloatingSize>(defaultBrowserFloatingSize)
  const browserDragRef = useRef<{
    pointerOffsetX: number
    pointerOffsetY: number
  } | null>(null)
  const browserDockDragIntentRef = useRef<{
    startClientX: number
    startClientY: number
    pointerOffsetX: number
    pointerOffsetY: number
    width: number
    height: number
  } | null>(null)

  const clampBrowserFloatingSize = useCallback(
    (size: FloatingSize): FloatingSize => {
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
    (pos: FloatingPosition): FloatingPosition => {
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

  const openBrowserFloatingFromDock = useCallback(() => {
    const shellRect = appShellRef.current?.getBoundingClientRect()
    const dockedRect = dockedBrowserHostRef.current?.getBoundingClientRect()
    if (shellRect !== undefined && dockedRect !== undefined) {
      const nextSize = clampBrowserFloatingSize({
        width: dockedRect.width,
        height: Math.min(dockedRect.height, defaultBrowserFloatingSize.height),
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
  }, [appShellRef, clampBrowserFloatingPos, clampBrowserFloatingSize, dockedBrowserHostRef])

  const handleToggleBrowserFloating = useCallback(() => {
    setActiveLeftDockPreviewPanelId(null)
    if (isBrowserFloating) {
      setIsBrowserFloating(false)
      return
    }
    openBrowserFloatingFromDock()
  }, [isBrowserFloating, openBrowserFloatingFromDock, setActiveLeftDockPreviewPanelId])

  const handleBrowserDragStart = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 || !isBrowserFloating) {
        return
      }
      setActiveLeftDockPreviewPanelId(null)
      const shellRect = appShellRef.current?.getBoundingClientRect()
      if (shellRect === undefined) {
        return
      }
      browserDragRef.current = {
        pointerOffsetX: event.clientX - shellRect.left - browserFloatingPosRef.current.x,
        pointerOffsetY: event.clientY - shellRect.top - browserFloatingPosRef.current.y,
      }
      event.preventDefault()
    },
    [appShellRef, isBrowserFloating, setActiveLeftDockPreviewPanelId],
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
      if (shellRect === undefined || panelRect === undefined) {
        return
      }
      browserDockDragIntentRef.current = {
        startClientX: event.clientX,
        startClientY: event.clientY,
        pointerOffsetX: event.clientX - panelRect.left,
        pointerOffsetY: event.clientY - panelRect.top,
        width: panelRect.width,
        height: panelRect.height,
      }
      event.preventDefault()
    },
    [appShellRef, isBrowserFloating, setActiveLeftDockPreviewPanelId],
  )

  useEffect(() => {
    setDockedBrowserPortalTarget(dockedBrowserHostRef.current)
  }, [dockedBrowserHostRef])

  useEffect(() => {
    onFloatingStateChange(isBrowserFloating)
  }, [isBrowserFloating, onFloatingStateChange])

  useEffect(() => {
    browserFloatingPosRef.current = browserFloatingPos
  }, [browserFloatingPos])

  useEffect(() => {
    browserFloatingSizeRef.current = browserFloatingSize
  }, [browserFloatingSize])

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
      browserFloatingSizeRef.current = {
        ...browserFloatingSizeRef.current,
        height: nextHeight,
      }
    }

    syncBrowserFloatingHeight()
    const observer = new ResizeObserver(() => {
      syncBrowserFloatingHeight()
    })
    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [isBrowserFloating])

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
    const handlePointerMove = (event: PointerEvent) => {
      if (browserDockDragIntentRef.current !== null && !isBrowserFloating) {
        const shellRect = appShellRef.current?.getBoundingClientRect()
        if (shellRect !== undefined) {
          const intent = browserDockDragIntentRef.current
          const deltaX = event.clientX - intent.startClientX
          const deltaY = event.clientY - intent.startClientY
          if (Math.hypot(deltaX, deltaY) >= 8) {
            const nextSize = clampBrowserFloatingSize({
              width: intent.width,
              height: intent.height,
            })
            const nextPos = clampBrowserFloatingPos({
              x: event.clientX - shellRect.left - intent.pointerOffsetX,
              y: event.clientY - shellRect.top - intent.pointerOffsetY,
            })
            browserFloatingSizeRef.current = nextSize
            browserFloatingPosRef.current = nextPos
            setBrowserFloatingSize(nextSize)
            setBrowserFloatingPos(nextPos)
            setIsBrowserFloating(true)
            browserDragRef.current = {
              pointerOffsetX: intent.pointerOffsetX,
              pointerOffsetY: intent.pointerOffsetY,
            }
            browserDockDragIntentRef.current = null
          }
        }
      }

      if (browserDragRef.current !== null) {
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
        setActiveLeftDockPreviewPanelId(
          resolveLeftDockPreviewPanelId('browser', event.clientX, event.clientY),
        )
      }
    }

    const handlePointerUp = (event: PointerEvent) => {
      const shouldDockBrowser =
        browserDragRef.current !== null &&
        resolveLeftDockPreviewPanelId('browser', event.clientX, event.clientY) === 'browser'
      browserDragRef.current = null
      browserDockDragIntentRef.current = null
      setActiveLeftDockPreviewPanelId(null)
      if (shouldDockBrowser) {
        setIsBrowserFloating(false)
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
    resolveLeftDockPreviewPanelId,
    setActiveLeftDockPreviewPanelId,
  ])

  return (
    <>
      {dockedBrowserPortalTarget !== null && !isBrowserFloating
        ? createPortal(
            <BrowserPanel
              isCollapsed={isBrowserCollapsed}
              onToggleCollapsed={() => setIsBrowserCollapsed((current) => !current)}
              onTogglePopout={handleToggleBrowserFloating}
              onTitleBarPointerDown={handleBrowserDockDragStart}
              newEditorSpawnPosition={newEditorSpawnPosition}
            />,
            dockedBrowserPortalTarget,
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
              onToggleCollapsed={() => setIsBrowserCollapsed((current) => !current)}
              isFloating
              onTogglePopout={handleToggleBrowserFloating}
              onTitleBarPointerDown={handleBrowserDragStart}
              newEditorSpawnPosition={newEditorSpawnPosition}
            />
          </div>
        </aside>
      ) : null}
    </>
  )
}
