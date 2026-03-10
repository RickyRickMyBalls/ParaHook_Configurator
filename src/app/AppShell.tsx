import {
  useCallback,
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { BuildStatsDrawer } from './components/BuildStatsDrawer'
import { TitleStatusBar } from './components/TitleStatusBar'
import { Toolbar } from './components/Toolbar'
import { ViewToolbar } from './components/ViewToolbar'
import { ViewerHost } from './components/ViewerHost'
import { ViewportOverlay } from './components/ViewportOverlay'
import { BoxPanel } from './panels/BoxPanel'
import { BrowserPanel } from './panels/BrowserPanel'
import { PartsListPanel } from './panels/PartsListPanel'
import { SpaghettiPanel } from './panels/SpaghettiPanel'
import { selectActiveEditorViewport, useSpaghettiStore } from './spaghetti/store/useSpaghettiStore'
import { useAppStore } from './store/useAppStore'
import { useBuildStatsStore } from './store/buildStatsStore'

type FloatingPosition = {
  x: number
  y: number
}

type FloatingSize = {
  width: number
  height: number
}

const initialFloatingPosition: FloatingPosition = {
  x: 12,
  y: 12,
}

const initialFloatingSize: FloatingSize = {
  width: 980,
  height: 760,
}

const minFloatingWidth = 200
const minFloatingHeight = 200
const floatingEdgePadding = 12

export function AppShell() {
  const statsExpanded = useBuildStatsStore((state) => state.statsExpanded)
  const inputMode = useAppStore((state) => state.inputMode)
  const activeEditorViewport = useSpaghettiStore(selectActiveEditorViewport)
  const setActiveEditorViewportId = useSpaghettiStore((state) => state.setActiveEditorViewportId)
  const setEditorViewportPosition = useSpaghettiStore((state) => state.setEditorViewportPosition)
  const setEditorViewportSize = useSpaghettiStore((state) => state.setEditorViewportSize)
  const showSpaghettiFloating = inputMode === 'spaghetti' && activeEditorViewport !== null
  const viewportRef = useRef<HTMLElement | null>(null)
  const floatingPosRef = useRef<FloatingPosition>(initialFloatingPosition)
  const floatingSizeRef = useRef<FloatingSize>(initialFloatingSize)
  const dragRef = useRef<{
    pointerOffsetX: number
    pointerOffsetY: number
  } | null>(null)
  const resizeRef = useRef<{
    startPointerX: number
    startPointerY: number
    startWidth: number
    startHeight: number
  } | null>(null)

  const getViewportLimits = useCallback(() => {
    const viewportElement = viewportRef.current
    if (viewportElement === null) {
      return {
        maxWidth: minFloatingWidth,
        maxHeight: minFloatingHeight,
      }
    }
    return {
      maxWidth: Math.max(minFloatingWidth, viewportElement.clientWidth - 24),
      maxHeight: Math.max(minFloatingHeight, viewportElement.clientHeight - 24),
    }
  }, [])

  const clampFloatingSize = useCallback(
    (size: FloatingSize): FloatingSize => {
      const limits = getViewportLimits()
      return {
        width: Math.min(limits.maxWidth, Math.max(minFloatingWidth, Math.round(size.width))),
        height: Math.min(limits.maxHeight, Math.max(minFloatingHeight, Math.round(size.height))),
      }
    },
    [getViewportLimits],
  )

  const clampFloatingPos = useCallback((pos: FloatingPosition): FloatingPosition => {
    const viewportElement = viewportRef.current
    if (viewportElement === null) {
      return {
        x: Math.max(0, Math.round(pos.x)),
        y: Math.max(0, Math.round(pos.y)),
      }
    }
    const maxX = Math.max(0, viewportElement.clientWidth - floatingSizeRef.current.width - floatingEdgePadding)
    const maxY = Math.max(0, viewportElement.clientHeight - floatingSizeRef.current.height - floatingEdgePadding)
    return {
      x: Math.min(maxX, Math.max(0, Math.round(pos.x))),
      y: Math.min(maxY, Math.max(0, Math.round(pos.y))),
    }
  }, [])

  useEffect(() => {
    floatingPosRef.current = activeEditorViewport?.position ?? initialFloatingPosition
  }, [activeEditorViewport?.position])

  useEffect(() => {
    floatingSizeRef.current = activeEditorViewport?.size ?? initialFloatingSize
  }, [activeEditorViewport?.size])

  useEffect(() => {
    if (!showSpaghettiFloating || activeEditorViewport === null) {
      return
    }
    const clampedSize = clampFloatingSize(activeEditorViewport.size)
    if (
      clampedSize.width !== activeEditorViewport.size.width ||
      clampedSize.height !== activeEditorViewport.size.height
    ) {
      setEditorViewportSize(activeEditorViewport.editorViewportId, clampedSize)
    }
    const clampedPos = clampFloatingPos(activeEditorViewport.position)
    if (
      clampedPos.x !== activeEditorViewport.position.x ||
      clampedPos.y !== activeEditorViewport.position.y
    ) {
      setEditorViewportPosition(activeEditorViewport.editorViewportId, clampedPos)
    }
  }, [
    activeEditorViewport,
    clampFloatingPos,
    clampFloatingSize,
    setEditorViewportPosition,
    setEditorViewportSize,
    showSpaghettiFloating,
  ])

  useEffect(() => {
    const handleResize = () => {
      if (activeEditorViewport === null) {
        return
      }
      const nextSize = clampFloatingSize(activeEditorViewport.size)
      if (
        nextSize.width !== activeEditorViewport.size.width ||
        nextSize.height !== activeEditorViewport.size.height
      ) {
        setEditorViewportSize(activeEditorViewport.editorViewportId, nextSize)
      }
      const nextPos = clampFloatingPos(activeEditorViewport.position)
      if (
        nextPos.x !== activeEditorViewport.position.x ||
        nextPos.y !== activeEditorViewport.position.y
      ) {
        setEditorViewportPosition(activeEditorViewport.editorViewportId, nextPos)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [
    activeEditorViewport,
    clampFloatingPos,
    clampFloatingSize,
    setEditorViewportPosition,
    setEditorViewportSize,
  ])

  const handleSpaghettiDragStart = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 || activeEditorViewport === null) {
        return
      }
      setActiveEditorViewportId(activeEditorViewport.editorViewportId)
      const viewportElement = viewportRef.current
      if (viewportElement === null) {
        return
      }

      const viewportRect = viewportElement.getBoundingClientRect()
      dragRef.current = {
        pointerOffsetX: event.clientX - viewportRect.left - floatingPosRef.current.x,
        pointerOffsetY: event.clientY - viewportRect.top - floatingPosRef.current.y,
      }

      const handleMove = (moveEvent: PointerEvent) => {
        const viewport = viewportRef.current
        const dragState = dragRef.current
        if (viewport === null || dragState === null) {
          return
        }
        const rect = viewport.getBoundingClientRect()
        const candidate = {
          x: moveEvent.clientX - rect.left - dragState.pointerOffsetX,
          y: moveEvent.clientY - rect.top - dragState.pointerOffsetY,
        }
        const clamped = clampFloatingPos(candidate)
        floatingPosRef.current = clamped
        setEditorViewportPosition(activeEditorViewport.editorViewportId, clamped)
      }

      const handleUp = () => {
        dragRef.current = null
        window.removeEventListener('pointermove', handleMove)
        window.removeEventListener('pointerup', handleUp)
      }

      window.addEventListener('pointermove', handleMove)
      window.addEventListener('pointerup', handleUp)
      event.preventDefault()
    },
    [activeEditorViewport, clampFloatingPos, setActiveEditorViewportId, setEditorViewportPosition],
  )

  const handleSpaghettiResizeStart = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 || activeEditorViewport === null) {
        return
      }
      setActiveEditorViewportId(activeEditorViewport.editorViewportId)
      resizeRef.current = {
        startPointerX: event.clientX,
        startPointerY: event.clientY,
        startWidth: floatingSizeRef.current.width,
        startHeight: floatingSizeRef.current.height,
      }

      const handleMove = (moveEvent: PointerEvent) => {
        const state = resizeRef.current
        if (state === null) {
          return
        }
        const nextSize = clampFloatingSize({
          width: state.startWidth + (moveEvent.clientX - state.startPointerX),
          height: state.startHeight + (moveEvent.clientY - state.startPointerY),
        })
        floatingSizeRef.current = nextSize
        setEditorViewportSize(activeEditorViewport.editorViewportId, nextSize)
        const clamped = clampFloatingPos(floatingPosRef.current)
        floatingPosRef.current = clamped
        setEditorViewportPosition(activeEditorViewport.editorViewportId, clamped)
      }

      const handleUp = () => {
        resizeRef.current = null
        window.removeEventListener('pointermove', handleMove)
        window.removeEventListener('pointerup', handleUp)
      }

      window.addEventListener('pointermove', handleMove)
      window.addEventListener('pointerup', handleUp)
      event.preventDefault()
      event.stopPropagation()
    },
    [
      activeEditorViewport,
      clampFloatingPos,
      clampFloatingSize,
      setActiveEditorViewportId,
      setEditorViewportPosition,
      setEditorViewportSize,
    ],
  )

  return (
    <div className="AppShellRoot">
      <aside className="LeftDock">
        <TitleStatusBar />
        {statsExpanded ? <BuildStatsDrawer /> : null}
        <div className="PanelStack">
          <BrowserPanel />
          <Toolbar />
          <PartsListPanel />
          {inputMode === 'legacy' ? <BoxPanel /> : null}
        </div>
      </aside>
      <section ref={viewportRef} className="ViewportArea">
        <ViewerHost />
        <ViewportOverlay />
        {showSpaghettiFloating ? (
          <aside className="SpaghettiFloatingDock">
            <div
              className="SpaghettiFloatingWindow"
              style={{
                left: `${activeEditorViewport.position.x}px`,
                top: `${activeEditorViewport.position.y}px`,
                width: `${activeEditorViewport.size.width}px`,
                height: `${activeEditorViewport.size.height}px`,
                zIndex: activeEditorViewport.zOrder,
              }}
            >
              <div
                className="SpaghettiFloatingHandle"
                onPointerDown={handleSpaghettiDragStart}
              >
                <span>Spaghetti Editor</span>
                <span>Drag</span>
              </div>
              <div className="SpaghettiFloatingBody">
                <SpaghettiPanel editorViewportId={activeEditorViewport.editorViewportId} />
              </div>
              <div
                className="SpaghettiFloatingResizeHandle"
                onPointerDown={handleSpaghettiResizeStart}
              />
            </div>
          </aside>
        ) : null}
      </section>
      <ViewToolbar />
    </div>
  )
}
