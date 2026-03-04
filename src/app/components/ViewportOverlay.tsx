import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { useAppStore } from '../store/useAppStore'
import { getViewer, subscribeViewer, type ViewerApi } from '../viewerBridge'
import { useUiPrefsStore } from '../store/uiPrefsStore'

export function ViewportOverlay() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const axisWidgetRef = useRef<HTMLDivElement | null>(null)
  const selectedPartKey = useAppStore((state) => state.selectedPartKey)
  const viewMode = useAppStore((state) => state.viewMode)
  const axisOverlayEnabled = useUiPrefsStore((state) => state.view.axisOverlayEnabled)
  const [axisWidgetSize, setAxisWidgetSize] = useState<number | null>(null)
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

  const MIN_AXIS_WIDGET_SIZE = 80
  const MAX_AXIS_WIDGET_SIZE = 420

  const startResize = (event: ReactPointerEvent<HTMLDivElement>): void => {
    const host = axisWidgetRef.current
    if (host === null) {
      return
    }

    const currentSize = axisWidgetSize ?? host.clientWidth
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
      setAxisWidgetSize(clamped)
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
    if (!axisOverlayEnabled || axisWidgetRef.current === null) {
      return
    }

    if (axisWidgetSize === null) {
      const measured = axisWidgetRef.current.clientWidth
      if (measured > 0) {
        setAxisWidgetSize(Math.round(measured))
      }
    }
  }, [axisOverlayEnabled, axisWidgetSize])

  useEffect(() => {
    if (axisWidgetSize === null) {
      return
    }
    document.documentElement.style.setProperty(
      '--v15-axis-widget-size',
      `${axisWidgetSize}px`,
    )
  }, [axisWidgetSize])

  const axisWidgetStyle =
    axisWidgetSize === null ? undefined : { width: `${axisWidgetSize}px`, height: `${axisWidgetSize}px` }

  return (
    <div className="ViewportOverlayRoot">
      {axisOverlayEnabled ? (
        <div
          ref={axisWidgetRef}
          className="ViewportOverlayWidget AxisWidget"
          style={axisWidgetStyle}
        >
          <canvas ref={canvasRef} />
          <div className="AxisWidgetResizeHandle" onPointerDown={startResize} />
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
