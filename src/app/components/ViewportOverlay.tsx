import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { useAppStore } from '../store/useAppStore'
import { getViewer, subscribeViewer, type ViewerApi } from '../viewerBridge'
import { useUiPrefsStore } from '../store/uiPrefsStore'
import {
  COMPACT_AXIS_WIDGET_SIZE,
  DEFAULT_EXPANDED_AXIS_WIDGET_SIZE,
  MAX_AXIS_WIDGET_SIZE,
  MIN_AXIS_WIDGET_SIZE,
} from './viewToolbarLayout'

export function ViewportOverlay() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const axisWidgetRef = useRef<HTMLDivElement | null>(null)
  const selectedPartKey = useAppStore((state) => state.selectedPartKey)
  const viewMode = useAppStore((state) => state.viewMode)
  const axisOverlayEnabled = useUiPrefsStore((state) => state.view.axisOverlayEnabled)
  const viewToolbarOpen = useUiPrefsStore((state) => state.viewToolbarOpen)
  const expandedAxisWidgetSize = useUiPrefsStore(
    (state) => state.viewToolbarExpandedAxisWidgetSize,
  )
  const setExpandedAxisWidgetSize = useUiPrefsStore(
    (state) => state.setViewToolbarExpandedAxisWidgetSize,
  )
  const [axisWidgetSize, setAxisWidgetSize] = useState<number>(COMPACT_AXIS_WIDGET_SIZE)
  const resizeStateRef = useRef<{
    active: boolean
    pointerId: number
    startX: number
    startY: number
    startSize: number
  }>({
    active: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    startSize: 0,
  })

  const resolvedAxisWidgetSize = viewToolbarOpen
    ? expandedAxisWidgetSize ?? DEFAULT_EXPANDED_AXIS_WIDGET_SIZE
    : COMPACT_AXIS_WIDGET_SIZE

  const startResize = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (!viewToolbarOpen) {
      return
    }
    const host = axisWidgetRef.current
    if (host === null) {
      return
    }

    const currentSize = axisWidgetSize || host.clientWidth
    if (currentSize <= 0) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    resizeStateRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startSize: currentSize,
    }

    const move = (moveEvent: PointerEvent): void => {
      const state = resizeStateRef.current
      if (!state.active || moveEvent.pointerId !== state.pointerId) {
        return
      }

      const deltaX = -(moveEvent.clientX - state.startX)
      const deltaY = moveEvent.clientY - state.startY
      const delta = Math.max(deltaX, deltaY)
      const next = Math.round(state.startSize + delta)
      const clamped = Math.min(
        Math.max(next, MIN_AXIS_WIDGET_SIZE),
        MAX_AXIS_WIDGET_SIZE,
      )
      setExpandedAxisWidgetSize(clamped)
    }

    const stop = (stopEvent: PointerEvent): void => {
      const state = resizeStateRef.current
      if (stopEvent.pointerId !== state.pointerId) {
        return
      }
      resizeStateRef.current = {
        ...state,
        active: false,
      }
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
  }

  useEffect(() => {
    let attachedViewer: ViewerApi | null = null
    const canvas = axisOverlayEnabled ? canvasRef.current : null

    const attach = (viewer: ViewerApi | null): void => {
      if (attachedViewer !== viewer) {
        attachedViewer?.setAxisOverlayCanvas(null)
        attachedViewer = viewer
      }

      if (attachedViewer === null) {
        return
      }

      attachedViewer.setAxisOverlayCanvas(canvas)
    }

    attach(getViewer())
    const unsubscribe = subscribeViewer((viewer) => {
      attach(viewer)
    })

    return () => {
      attachedViewer?.setAxisOverlayCanvas(null)
      unsubscribe()
    }
  }, [axisOverlayEnabled])

  useEffect(() => {
    setAxisWidgetSize(resolvedAxisWidgetSize)
  }, [resolvedAxisWidgetSize])

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--v15-axis-widget-size',
      `${resolvedAxisWidgetSize}px`,
    )
    return () => {
      document.documentElement.style.removeProperty('--v15-axis-widget-size')
    }
  }, [resolvedAxisWidgetSize])

  const axisWidgetStyle = { width: `${axisWidgetSize}px`, height: `${axisWidgetSize}px` }

  return (
    <div className="ViewportOverlayRoot">
      {axisOverlayEnabled ? (
        <div
          ref={axisWidgetRef}
          className={`ViewportOverlayWidget AxisWidget ${viewToolbarOpen ? 'isExpanded' : 'isCompact'}`}
          style={axisWidgetStyle}
        >
          <canvas ref={canvasRef} />
          {viewToolbarOpen ? (
            <div className="AxisWidgetResizeHandle" onPointerDown={startResize} />
          ) : null}
        </div>
      ) : null}
      <div className="ViewportOverlayWidget ViewportHud">
        <span className="HudLine">Mode: {viewMode}</span>
        <span className="HudLine">
          Selected: {selectedPartKey === null ? 'none' : selectedPartKey}
        </span>
      </div>
    </div>
  )
}
