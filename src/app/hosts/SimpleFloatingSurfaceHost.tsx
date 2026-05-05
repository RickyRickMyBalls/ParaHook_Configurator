import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from 'react'
import { FloatingWindowSettingsButton } from '../components/FloatingWindowSettingsButton'
import { FloatingWindowQuickDockButton } from '../components/FloatingWindowQuickDockButton'
import type { WorkspaceDetachedSlotSurfaceState } from '../workspace/workspaceShellTypes'

type FloatingSurfaceRect = {
  x: number
  y: number
  width: number
  height: number
}

type SimpleFloatingSurfaceHostProps = {
  viewportRef: RefObject<HTMLElement | null>
  floatingSurfaces: WorkspaceDetachedSlotSurfaceState[]
  onQuickDock: (surfaceInstanceId: string) => void
  title: string
  windowClassName: string
  headerClassName: string
  quickDockClassName: string
  defaultRect: FloatingSurfaceRect
  minWidth: number
  minHeight: number
  onOpenSettings?: (initialSectionId?: import('../workspace/SettingsSurface').SettingsSectionId) => void
  edgePadding?: number
  zIndex?: number
  renderSurface: (surface: WorkspaceDetachedSlotSurfaceState) => ReactNode
}

function clampFloatingRect(
  nextRect: FloatingSurfaceRect,
  viewportWidth: number,
  viewportHeight: number,
  minWidth: number,
  minHeight: number,
  edgePadding: number,
): FloatingSurfaceRect {
  const width = Math.max(
    minWidth,
    Math.min(
      Math.round(nextRect.width),
      Math.max(minWidth, viewportWidth - edgePadding * 2),
    ),
  )
  const height = Math.max(
    minHeight,
    Math.min(
      Math.round(nextRect.height),
      Math.max(minHeight, viewportHeight - edgePadding * 2),
    ),
  )
  const maxX = Math.max(edgePadding, viewportWidth - width - edgePadding)
  const maxY = Math.max(edgePadding, viewportHeight - height - edgePadding)
  return {
    x: Math.max(edgePadding, Math.min(Math.round(nextRect.x), maxX)),
    y: Math.max(edgePadding, Math.min(Math.round(nextRect.y), maxY)),
    width,
    height,
  }
}

export function SimpleFloatingSurfaceHost(props: SimpleFloatingSurfaceHostProps) {
  const {
    viewportRef,
    floatingSurfaces,
    onQuickDock,
    title,
    windowClassName,
    headerClassName,
    quickDockClassName,
    defaultRect,
    minWidth,
    minHeight,
    onOpenSettings,
    edgePadding = 12,
    zIndex = 19,
    renderSurface,
  } = props
  const floatingRectsRef = useRef<Record<string, FloatingSurfaceRect>>({})
  const floatingWindowRefBySurfaceId = useRef<Record<string, HTMLDivElement | null>>({})
  const dragStateRef = useRef<{
    surfaceInstanceId: string
    pointerId: number
    pointerOffsetX: number
    pointerOffsetY: number
  } | null>(null)
  const [, setLayoutVersion] = useState(0)

  const getDefaultFloatingRect = useCallback(
    (_surface: WorkspaceDetachedSlotSurfaceState): FloatingSurfaceRect => {
      const viewportAreaRect = viewportRef.current?.getBoundingClientRect() ?? null
      if (viewportAreaRect === null) {
        return defaultRect
      }
      return clampFloatingRect(
        defaultRect,
        Math.max(1, Math.round(viewportAreaRect.width)),
        Math.max(1, Math.round(viewportAreaRect.height)),
        minWidth,
        minHeight,
        edgePadding,
      )
    },
    [defaultRect, edgePadding, minHeight, minWidth, viewportRef],
  )

  const setFloatingRect = useCallback((surfaceInstanceId: string, nextRect: FloatingSurfaceRect) => {
    floatingRectsRef.current[surfaceInstanceId] = nextRect
    setLayoutVersion((version) => version + 1)
  }, [])

  useEffect(() => {
    const nextSurfaceIds = new Set(floatingSurfaces.map((surface) => surface.surfaceInstanceId))
    let didChange = false
    for (const surface of floatingSurfaces) {
      if (floatingRectsRef.current[surface.surfaceInstanceId] !== undefined) {
        continue
      }
      floatingRectsRef.current[surface.surfaceInstanceId] = getDefaultFloatingRect(surface)
      didChange = true
    }
    for (const surfaceInstanceId of Object.keys(floatingRectsRef.current)) {
      if (nextSurfaceIds.has(surfaceInstanceId)) {
        continue
      }
      delete floatingRectsRef.current[surfaceInstanceId]
      delete floatingWindowRefBySurfaceId.current[surfaceInstanceId]
      didChange = true
    }
    if (didChange) {
      setLayoutVersion((version) => version + 1)
    }
  }, [floatingSurfaces, getDefaultFloatingRect])

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const dragState = dragStateRef.current
      const viewportAreaRect = viewportRef.current?.getBoundingClientRect() ?? null
      if (dragState === null || dragState.pointerId !== event.pointerId || viewportAreaRect === null) {
        return
      }
      const currentRect = floatingRectsRef.current[dragState.surfaceInstanceId] ?? null
      if (currentRect === null) {
        return
      }
      setFloatingRect(
        dragState.surfaceInstanceId,
        clampFloatingRect(
          {
            ...currentRect,
            x: event.clientX - viewportAreaRect.left - dragState.pointerOffsetX,
            y: event.clientY - viewportAreaRect.top - dragState.pointerOffsetY,
          },
          Math.max(1, Math.round(viewportAreaRect.width)),
          Math.max(1, Math.round(viewportAreaRect.height)),
          minWidth,
          minHeight,
          edgePadding,
        ),
      )
    }
    const stopDrag = (pointerId?: number) => {
      if (
        dragStateRef.current === null ||
        (pointerId !== undefined && dragStateRef.current.pointerId !== pointerId)
      ) {
        return
      }
      dragStateRef.current = null
    }
    const handlePointerUp = (event: PointerEvent) => {
      stopDrag(event.pointerId)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
    }
  }, [edgePadding, minHeight, minWidth, setFloatingRect, viewportRef])

  return (
    <>
      {floatingSurfaces.map((surface) => {
        const rect =
          floatingRectsRef.current[surface.surfaceInstanceId] ?? getDefaultFloatingRect(surface)
        return (
          <div
            key={surface.surfaceInstanceId}
            ref={(element) => {
              floatingWindowRefBySurfaceId.current[surface.surfaceInstanceId] = element
            }}
            className={windowClassName}
            data-workspace-surface-instance-id={surface.surfaceInstanceId}
            data-workspace-host-viewport-id={surface.hostViewportId ?? ''}
            style={{
              position: 'absolute',
              left: `${rect.x}px`,
              top: `${rect.y}px`,
              width: `${rect.width}px`,
              height: `${rect.height}px`,
              zIndex,
              display: 'grid',
              gridTemplateRows: '40px minmax(0, 1fr)',
              borderRadius: '14px',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.36)',
              background: 'rgba(10, 12, 17, 0.98)',
            }}
          >
            <div
              className={headerClassName}
              onPointerDown={(event: ReactPointerEvent<HTMLDivElement>) => {
                const floatingWindow = floatingWindowRefBySurfaceId.current[surface.surfaceInstanceId]
                const floatingWindowRect = floatingWindow?.getBoundingClientRect() ?? null
                if (floatingWindowRect === null) {
                  return
                }
                dragStateRef.current = {
                  surfaceInstanceId: surface.surfaceInstanceId,
                  pointerId: event.pointerId,
                  pointerOffsetX: event.clientX - floatingWindowRect.left,
                  pointerOffsetY: event.clientY - floatingWindowRect.top,
                }
                event.preventDefault()
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                padding: '0 10px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(241,244,255,0.92)',
                cursor: 'grab',
              }}
            >
              <span>{title}</span>
              {onOpenSettings !== undefined ? (
                <FloatingWindowSettingsButton
                  className={`${windowClassName}Settings`}
                  onClick={() => onOpenSettings('general')}
                />
              ) : null}
              <FloatingWindowQuickDockButton
                className={quickDockClassName}
                onClick={() => onQuickDock(surface.surfaceInstanceId)}
              />
            </div>
            <div style={{ position: 'relative', minHeight: 0 }}>{renderSurface(surface)}</div>
          </div>
        )
      })}
    </>
  )
}
