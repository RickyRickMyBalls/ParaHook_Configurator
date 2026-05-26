import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import type { ViewportOverlayToolPanelResizeDirection } from './ViewportOverlayToolPanel'

export type ViewportFloatingToolPanelPosition = {
  left: number
  top: number
}

export type ViewportFloatingToolPanelSize = {
  width: number
  height: number
}

export type ViewportFloatingToolPanelBounds = {
  width: number
  height: number
}

export type ViewportFloatingToolPanelRect = ViewportFloatingToolPanelPosition &
  ViewportFloatingToolPanelSize

export type ViewportFloatingToolPanelRightAnchorInput = {
  bounds: ViewportFloatingToolPanelBounds
  size: ViewportFloatingToolPanelSize
  viewportMargin: number
  top: number
}

type UseViewportFloatingToolPanelOptions = {
  defaultPosition: ViewportFloatingToolPanelPosition
  defaultSize: ViewportFloatingToolPanelSize
  minSize: ViewportFloatingToolPanelSize
  viewportMargin?: number
  resetKey?: string | number | null
  getBounds?: () => ViewportFloatingToolPanelBounds
  initialHeightMode?: 'manual' | 'auto'
  onManualPlacementChange?: (rect: ViewportFloatingToolPanelRect) => void
}

type ResolveDragInput = {
  startPosition: ViewportFloatingToolPanelPosition
  deltaX: number
  deltaY: number
  size: ViewportFloatingToolPanelSize
  bounds: ViewportFloatingToolPanelBounds
  viewportMargin: number
}

type ResolveResizeInput = {
  direction: ViewportOverlayToolPanelResizeDirection
  startPosition: ViewportFloatingToolPanelPosition
  startSize: ViewportFloatingToolPanelSize
  deltaX: number
  deltaY: number
  minSize: ViewportFloatingToolPanelSize
  bounds: ViewportFloatingToolPanelBounds
  viewportMargin: number
}

type ResizeGestureState = {
  pointerId: number
  direction: ViewportOverlayToolPanelResizeDirection
  startX: number
  startY: number
  startPosition: ViewportFloatingToolPanelPosition
  startSize: ViewportFloatingToolPanelSize
}

type DragGestureState = {
  pointerId: number | null
  startX: number
  startY: number
  startPosition: ViewportFloatingToolPanelPosition
  startSize: ViewportFloatingToolPanelSize
}

const getWindowBounds = (): ViewportFloatingToolPanelBounds => ({
  width: typeof window === 'undefined' ? 1440 : window.innerWidth,
  height: typeof window === 'undefined' ? 900 : window.innerHeight,
})

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), Math.max(min, max))

export const resolveViewportFloatingToolPanelRightAnchor = ({
  bounds,
  size,
  top,
  viewportMargin,
}: ViewportFloatingToolPanelRightAnchorInput): ViewportFloatingToolPanelPosition => ({
  left: Math.round(
    clamp(
      bounds.width - size.width - viewportMargin,
      viewportMargin,
      bounds.width - size.width - viewportMargin,
    ),
  ),
  top: Math.round(clamp(top, viewportMargin, bounds.height - size.height - viewportMargin)),
})

export const clampViewportFloatingToolPanelRect = ({
  bounds,
  rect,
  viewportMargin,
}: {
  bounds: ViewportFloatingToolPanelBounds
  rect: ViewportFloatingToolPanelRect
  viewportMargin: number
}): ViewportFloatingToolPanelRect => {
  const maxWidth = Math.max(1, bounds.width - viewportMargin * 2)
  const maxHeight = Math.max(1, bounds.height - viewportMargin * 2)
  const width = Math.round(clamp(rect.width, 1, maxWidth))
  const height = Math.round(clamp(rect.height, 1, maxHeight))
  return {
    left: Math.round(clamp(rect.left, viewportMargin, bounds.width - width - viewportMargin)),
    top: Math.round(clamp(rect.top, viewportMargin, bounds.height - height - viewportMargin)),
    width,
    height,
  }
}

export const resolveViewportFloatingToolPanelDrag = ({
  bounds,
  deltaX,
  deltaY,
  size,
  startPosition,
  viewportMargin,
}: ResolveDragInput): ViewportFloatingToolPanelPosition => ({
  left: Math.round(
    clamp(
      startPosition.left + deltaX,
      viewportMargin,
      bounds.width - size.width - viewportMargin,
    ),
  ),
  top: Math.round(
    clamp(
      startPosition.top + deltaY,
      viewportMargin,
      bounds.height - size.height - viewportMargin,
    ),
  ),
})

export const resolveViewportFloatingToolPanelResize = ({
  bounds,
  deltaX,
  deltaY,
  direction,
  minSize,
  startPosition,
  startSize,
  viewportMargin,
}: ResolveResizeInput): {
  position: ViewportFloatingToolPanelPosition
  size: ViewportFloatingToolPanelSize
} => {
  let nextWidth = startSize.width
  let nextHeight = startSize.height
  let nextLeft = startPosition.left
  let nextTop = startPosition.top

  if (direction.includes('e')) {
    nextWidth = startSize.width + deltaX
  }
  if (direction.includes('s')) {
    nextHeight = startSize.height + deltaY
  }
  if (direction.includes('w')) {
    nextWidth = startSize.width - deltaX
    nextLeft = startPosition.left + deltaX
  }
  if (direction.includes('n')) {
    nextHeight = startSize.height - deltaY
    nextTop = startPosition.top + deltaY
  }

  const maxWidth = Math.max(minSize.width, bounds.width - viewportMargin * 2)
  const maxHeight = Math.max(minSize.height, bounds.height - viewportMargin * 2)
  nextWidth = clamp(nextWidth, minSize.width, maxWidth)
  nextHeight = clamp(nextHeight, minSize.height, maxHeight)

  if (direction.includes('w')) {
    nextLeft = startPosition.left + (startSize.width - nextWidth)
  }
  if (direction.includes('n')) {
    nextTop = startPosition.top + (startSize.height - nextHeight)
  }

  nextLeft = clamp(nextLeft, viewportMargin, bounds.width - nextWidth - viewportMargin)
  nextTop = clamp(nextTop, viewportMargin, bounds.height - nextHeight - viewportMargin)

  return {
    position: {
      left: Math.round(nextLeft),
      top: Math.round(nextTop),
    },
    size: {
      width: Math.round(nextWidth),
      height: Math.round(nextHeight),
    },
  }
}

export function useViewportFloatingToolPanel({
  defaultPosition,
  defaultSize,
  getBounds = getWindowBounds,
  initialHeightMode = 'manual',
  minSize,
  onManualPlacementChange,
  resetKey = null,
  viewportMargin = 12,
}: UseViewportFloatingToolPanelOptions) {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const dragStateRef = useRef<DragGestureState | null>(null)
  const resizeStateRef = useRef<ResizeGestureState | null>(null)
  const [position, setPosition] = useState(defaultPosition)
  const [size, setSize] = useState(defaultSize)
  const [heightMode, setHeightMode] = useState(initialHeightMode)
  const defaultPositionRef = useRef(defaultPosition)
  const defaultSizeRef = useRef(defaultSize)
  const manualPlacementRef = useRef<ViewportFloatingToolPanelRect>({
    ...defaultPosition,
    ...defaultSize,
  })

  useEffect(() => {
    defaultPositionRef.current = defaultPosition
    defaultSizeRef.current = defaultSize
    manualPlacementRef.current = {
      ...defaultPosition,
      ...defaultSize,
    }
    setPosition(defaultPosition)
    setSize(defaultSize)
  }, [defaultPosition, defaultSize])

  useEffect(() => {
    if (resetKey === null) {
      return
    }
    setPosition(defaultPositionRef.current)
    setSize(defaultSizeRef.current)
    setHeightMode(initialHeightMode)
  }, [initialHeightMode, resetKey])

  const beginDrag = useCallback(
    (pointerId: number | null, clientX: number, clientY: number) => {
      const host = panelRef.current
      if (host === null) {
        return
      }

      const startSize = {
        width: host.offsetWidth || size.width,
        height: host.offsetHeight || size.height,
      }
      dragStateRef.current = {
        pointerId,
        startX: clientX,
        startY: clientY,
        startPosition: position,
        startSize,
      }

      const move = (moveEvent: PointerEvent | MouseEvent) => {
        const state = dragStateRef.current
        if (state === null) {
          return
        }
        if (
          'pointerId' in moveEvent &&
          state.pointerId !== null &&
          moveEvent.pointerId !== state.pointerId
        ) {
          return
        }
        const nextPosition = resolveViewportFloatingToolPanelDrag({
          bounds: getBounds(),
          deltaX: moveEvent.clientX - state.startX,
          deltaY: moveEvent.clientY - state.startY,
          size: state.startSize,
          startPosition: state.startPosition,
          viewportMargin,
        })
        manualPlacementRef.current = {
          ...nextPosition,
          ...state.startSize,
        }
        setPosition(nextPosition)
      }

      const stop = (stopEvent?: PointerEvent | MouseEvent) => {
        const state = dragStateRef.current
        if (state === null) {
          return
        }
        if (
          stopEvent !== undefined &&
          'pointerId' in stopEvent &&
          state.pointerId !== null &&
          stopEvent.pointerId !== state.pointerId
        ) {
          return
        }
        dragStateRef.current = null
        onManualPlacementChange?.(manualPlacementRef.current)
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', stop)
        window.removeEventListener('pointercancel', stop)
        window.removeEventListener('mousemove', move)
        window.removeEventListener('mouseup', stop)
      }

      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', stop)
      window.addEventListener('pointercancel', stop)
      window.addEventListener('mousemove', move)
      window.addEventListener('mouseup', stop)
    },
    [getBounds, onManualPlacementChange, position, size, viewportMargin],
  )

  const onTitleBarPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
      beginDrag(event.pointerId, event.clientX, event.clientY)
    },
    [beginDrag],
  )

  const onTitleBarMouseDown = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (event.button !== 0) {
        return
      }
      event.preventDefault()
      event.stopPropagation()
      beginDrag(null, event.clientX, event.clientY)
    },
    [beginDrag],
  )

  const onResizeHandlePointerDown = useCallback(
    (
      direction: ViewportOverlayToolPanelResizeDirection,
      event: ReactPointerEvent<HTMLDivElement>,
    ) => {
      const host = panelRef.current
      if (host === null) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      resizeStateRef.current = {
        pointerId: event.pointerId,
        direction,
        startX: event.clientX,
        startY: event.clientY,
        startPosition: position,
        startSize: {
          width: host.offsetWidth || size.width,
          height: host.offsetHeight || size.height,
        },
      }

      const move = (moveEvent: PointerEvent) => {
        const state = resizeStateRef.current
        if (state === null || moveEvent.pointerId !== state.pointerId) {
          return
        }
        const next = resolveViewportFloatingToolPanelResize({
          bounds: getBounds(),
          deltaX: moveEvent.clientX - state.startX,
          deltaY: moveEvent.clientY - state.startY,
          direction: state.direction,
          minSize,
          startPosition: state.startPosition,
          startSize: state.startSize,
          viewportMargin,
        })
        manualPlacementRef.current = {
          ...next.position,
          ...next.size,
        }
        setPosition(next.position)
        setSize(next.size)
        setHeightMode('manual')
      }

      const stop = (stopEvent: PointerEvent) => {
        const state = resizeStateRef.current
        if (state === null || stopEvent.pointerId !== state.pointerId) {
          return
        }
        resizeStateRef.current = null
        onManualPlacementChange?.(manualPlacementRef.current)
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', stop)
        window.removeEventListener('pointercancel', stop)
      }

      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', stop)
      window.addEventListener('pointercancel', stop)
    },
    [getBounds, minSize, onManualPlacementChange, position, size, viewportMargin],
  )

  const style = useMemo<CSSProperties>(
    () => ({
      left: `${position.left}px`,
      top: `${position.top}px`,
      right: 'auto',
      bottom: 'auto',
      transform: 'none',
      width: `${size.width}px`,
      height: heightMode === 'auto' ? undefined : `${size.height}px`,
    }),
    [heightMode, position.left, position.top, size.height, size.width],
  )

  return {
    panelRef,
    position,
    setPosition,
    setHeightMode,
    size,
    setSize,
    style,
    onTitleBarMouseDown,
    onTitleBarPointerDown,
    onResizeHandlePointerDown,
  }
}
