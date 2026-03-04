import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { BuildStatsDrawer } from './components/BuildStatsDrawer'
import { TitleStatusBar } from './components/TitleStatusBar'
import { Toolbar } from './components/Toolbar'
import { ViewToolbar } from './components/ViewToolbar'
import { ViewerHost } from './components/ViewerHost'
import { ViewportOverlay } from './components/ViewportOverlay'
import { BoxPanel } from './panels/BoxPanel'
import { PartsListPanel } from './panels/PartsListPanel'
import { SpaghettiPanel } from './panels/SpaghettiPanel'
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

const minFloatingWidth = 560
const minFloatingHeight = 420
const floatingEdgePadding = 12
const axisGizmoLeftInset = 324

export function AppShell() {
  const statsExpanded = useBuildStatsStore((state) => state.statsExpanded)
  const inputMode = useAppStore((state) => state.inputMode)
  const showSpaghettiFloating = inputMode === 'spaghetti'
  const viewportRef = useRef<HTMLElement | null>(null)
  const floatingWindowRef = useRef<HTMLDivElement | null>(null)
  const [floatingPos, setFloatingPos] = useState<FloatingPosition>(initialFloatingPosition)
  const [floatingSize, setFloatingSize] = useState<FloatingSize>({
    width: 980,
    height: 760,
  })
  const [hasManualResize, setHasManualResize] = useState(false)
  const floatingPosRef = useRef<FloatingPosition>(initialFloatingPosition)
  const floatingSizeRef = useRef<FloatingSize>({
    width: 980,
    height: 760,
  })
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

const anchorTopLeftPos = useCallback((): FloatingPosition => {
    const viewportElement = viewportRef.current
    if (viewportElement === null) {
      return { x: 12, y: 12 }
    }
    return clampFloatingPos({
      x: 12,
      y: Math.round(viewportElement.clientHeight * 0.3),
    })
  }, [clampFloatingPos])

  useEffect(() => {
    floatingPosRef.current = floatingPos
  }, [floatingPos])

  useEffect(() => {
    floatingSizeRef.current = floatingSize
  }, [floatingSize])

  useEffect(() => {
    if (!showSpaghettiFloating) {
      return
    }
    setHasManualResize(false)
    const viewportElement = viewportRef.current
    if (viewportElement !== null) {
      const nextPos = anchorTopLeftPos()
      const nextSize = clampFloatingSize({
        width: viewportElement.clientWidth - nextPos.x - axisGizmoLeftInset,
        height: viewportElement.clientHeight - nextPos.y - floatingEdgePadding,
      })
      floatingSizeRef.current = nextSize
      setFloatingSize(nextSize)
      const clampedPos = clampFloatingPos(nextPos)
      floatingPosRef.current = clampedPos
      setFloatingPos(clampedPos)
      return
    }
    setFloatingPos((current) => {
      const clamped = clampFloatingPos(current)
      floatingPosRef.current = clamped
      return clamped
    })
  }, [anchorTopLeftPos, clampFloatingPos, clampFloatingSize, showSpaghettiFloating])

  useEffect(() => {
    const handleResize = () => {
      setFloatingSize((current) => {
        const clamped = clampFloatingSize(current)
        floatingSizeRef.current = clamped
        return clamped
      })
      setFloatingPos((current) => {
        if (!hasManualResize) {
          const anchored = anchorTopLeftPos()
          floatingPosRef.current = anchored
          return anchored
        }
        const clamped = clampFloatingPos(current)
        floatingPosRef.current = clamped
        return clamped
      })
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [anchorTopLeftPos, clampFloatingPos, clampFloatingSize, hasManualResize])

  const handleSpaghettiDragStart = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) {
        return
      }
      const viewportElement = viewportRef.current
      if (viewportElement === null) {
        return
      }
      if (!hasManualResize) {
        setHasManualResize(true)
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
        setFloatingPos(clamped)
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
    [clampFloatingPos, hasManualResize],
  )

  const handleSpaghettiResizeStart = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) {
        return
      }
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
        setFloatingSize(nextSize)
        if (!hasManualResize) {
          setHasManualResize(true)
        }
        setFloatingPos((current) => {
          if (!hasManualResize) {
            const anchored = anchorTopLeftPos()
            floatingPosRef.current = anchored
            return anchored
          }
          const clamped = clampFloatingPos(current)
          floatingPosRef.current = clamped
          return clamped
        })
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
    [anchorTopLeftPos, clampFloatingPos, clampFloatingSize, hasManualResize],
  )

  return (
    <div className="AppShellRoot">
      <aside className="LeftDock">
        <TitleStatusBar />
        {statsExpanded ? <BuildStatsDrawer /> : null}
        <div className="PanelStack">
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
              ref={floatingWindowRef}
              className="SpaghettiFloatingWindow"
              style={{
                left: `${floatingPos.x}px`,
                top: `${floatingPos.y}px`,
                width: `${floatingSize.width}px`,
                height: `${floatingSize.height}px`,
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
                <SpaghettiPanel />
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
