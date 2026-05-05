import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { FloatingWindowSettingsButton } from '../components/FloatingWindowSettingsButton'
import { FloatingWindowQuickDockButton } from '../components/FloatingWindowQuickDockButton'
import { DashboardSurface } from '../workspace/DashboardSurface'
import { useWorkspaceChildWindow } from '../workspace/useWorkspaceChildWindow'
import type { WorkspaceDetachedSlotSurfaceState } from '../workspace/workspaceShellTypes'

const dashboardFloatingMinWidth = 360
const dashboardFloatingMinHeight = 260
const dashboardFloatingEdgePadding = 12
const dashboardPopoutBackground = 'rgb(8, 11, 17)'

type DashboardFloatingRect = {
  x: number
  y: number
  width: number
  height: number
}

type DashboardWindowHostProps = {
  viewportRef: RefObject<HTMLElement | null>
  primaryViewportId: string
  floatingSurfaces: WorkspaceDetachedSlotSurfaceState[]
  popoutSurfaces: WorkspaceDetachedSlotSurfaceState[]
  onClearDetachedSurface: (surfaceInstanceId: string) => void
  onOpenNoteInNotepad: (surfaceInstanceId: string, noteId: string) => void
  onQuickDock: (surfaceInstanceId: string) => void
  onOpenSettings?: (initialSectionId?: import('../workspace/SettingsSurface').SettingsSectionId) => void
}

type DashboardPopoutWindowProps = {
  surface: WorkspaceDetachedSlotSurfaceState
  onClearDetachedSurface: (surfaceInstanceId: string) => void
  onOpenNoteInNotepad: (surfaceInstanceId: string, noteId: string) => void
  onQuickDock: (surfaceInstanceId: string) => void
}

function clampDashboardFloatingRect(
  nextRect: DashboardFloatingRect,
  viewportWidth: number,
  viewportHeight: number,
): DashboardFloatingRect {
  const width = Math.max(
    dashboardFloatingMinWidth,
    Math.min(
      Math.round(nextRect.width),
      Math.max(dashboardFloatingMinWidth, viewportWidth - dashboardFloatingEdgePadding * 2),
    ),
  )
  const height = Math.max(
    dashboardFloatingMinHeight,
    Math.min(
      Math.round(nextRect.height),
      Math.max(dashboardFloatingMinHeight, viewportHeight - dashboardFloatingEdgePadding * 2),
    ),
  )
  const maxX = Math.max(
    dashboardFloatingEdgePadding,
    viewportWidth - width - dashboardFloatingEdgePadding,
  )
  const maxY = Math.max(
    dashboardFloatingEdgePadding,
    viewportHeight - height - dashboardFloatingEdgePadding,
  )
  return {
    x: Math.max(dashboardFloatingEdgePadding, Math.min(Math.round(nextRect.x), maxX)),
    y: Math.max(dashboardFloatingEdgePadding, Math.min(Math.round(nextRect.y), maxY)),
    width,
    height,
  }
}

function createDashboardPopoutSpec(surfaceInstanceId: string) {
  return {
    childWindowId: `workspace-surface-${surfaceInstanceId}-popout`,
    owner: 'child-window' as const,
    windowName: `parahook-workspace-surface-${surfaceInstanceId}`,
    windowTitle: 'ParaHook Dashboard',
    windowFeatures: 'popup=yes,width=1440,height=920,resizable=yes,scrollbars=no',
  }
}

function DashboardPopoutWindow(props: DashboardPopoutWindowProps) {
  const { surface, onClearDetachedSurface, onOpenNoteInNotepad, onQuickDock } = props
  const popoutState = useMemo(
    () => createDashboardPopoutSpec(surface.surfaceInstanceId),
    [surface.surfaceInstanceId],
  )
  const { host } = useWorkspaceChildWindow({
    isOpen: true,
    spec: popoutState,
    rootClassName: 'DashboardPopoutRoot',
    bodyBackground: dashboardPopoutBackground,
    onClosed: () => onClearDetachedSurface(surface.surfaceInstanceId),
  })

  if (host === null) {
    return null
  }

  return createPortal(
    <div
      className="DashboardPopoutWindow"
      data-workspace-surface-instance-id={surface.surfaceInstanceId}
      data-workspace-host-viewport-id={surface.hostViewportId ?? ''}
      style={{
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateRows: '48px minmax(0, 1fr)',
        background: dashboardPopoutBackground,
      }}
    >
      <div
        className="DashboardPopoutWindowHeader"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '0 12px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.04)',
          color: 'rgba(241,244,255,0.94)',
        }}
      >
        <span>Dashboard</span>
        <button
          type="button"
          className="DashboardPopoutWindowQuickDock"
          onClick={() => onQuickDock(surface.surfaceInstanceId)}
        >
          Quick Dock
        </button>
      </div>
      <div style={{ position: 'relative', minHeight: 0 }}>
        <DashboardSurface
          surfaceInstanceId={surface.surfaceInstanceId}
          hostMode="popout"
          onOpenNoteInNotepad={(noteId) => onOpenNoteInNotepad(surface.surfaceInstanceId, noteId)}
        />
      </div>
    </div>,
    host,
  )
}

export function DashboardWindowHost(props: DashboardWindowHostProps) {
  const {
    viewportRef,
    primaryViewportId,
    floatingSurfaces,
    popoutSurfaces,
    onClearDetachedSurface,
    onOpenNoteInNotepad,
    onQuickDock,
    onOpenSettings,
  } = props
  const floatingRectsRef = useRef<Record<string, DashboardFloatingRect>>({})
  const floatingWindowRefBySurfaceId = useRef<Record<string, HTMLDivElement | null>>({})
  const dragStateRef = useRef<{
    surfaceInstanceId: string
    pointerId: number
    pointerOffsetX: number
    pointerOffsetY: number
  } | null>(null)
  const [, setLayoutVersion] = useState(0)

  const getDefaultFloatingRect = useCallback(
    (_surface: WorkspaceDetachedSlotSurfaceState): DashboardFloatingRect => {
      const viewportAreaRect = viewportRef.current?.getBoundingClientRect() ?? null
      const nextRect = {
        x: 40,
        y: 40,
        width: 420,
        height: 320,
      }
      if (viewportAreaRect === null) {
        return nextRect
      }
      return clampDashboardFloatingRect(
        nextRect,
        Math.max(1, Math.round(viewportAreaRect.width)),
        Math.max(1, Math.round(viewportAreaRect.height)),
      )
    },
    [viewportRef],
  )

  const setFloatingRect = useCallback((surfaceInstanceId: string, nextRect: DashboardFloatingRect) => {
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
      if (
        dragState === null ||
        dragState.pointerId !== event.pointerId ||
        viewportAreaRect === null
      ) {
        return
      }
      const currentRect = floatingRectsRef.current[dragState.surfaceInstanceId] ?? null
      if (currentRect === null) {
        return
      }
      setFloatingRect(
        dragState.surfaceInstanceId,
        clampDashboardFloatingRect(
          {
            ...currentRect,
            x: event.clientX - viewportAreaRect.left - dragState.pointerOffsetX,
            y: event.clientY - viewportAreaRect.top - dragState.pointerOffsetY,
          },
          Math.max(1, Math.round(viewportAreaRect.width)),
          Math.max(1, Math.round(viewportAreaRect.height)),
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
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [setFloatingRect, viewportRef])

  return (
    <>
      {floatingSurfaces.map((surface) => {
        const floatingRect =
          floatingRectsRef.current[surface.surfaceInstanceId] ?? getDefaultFloatingRect(surface)
        const hostViewportId = surface.hostViewportId ?? primaryViewportId

        return (
          <div
            key={surface.surfaceInstanceId}
            ref={(element) => {
              floatingWindowRefBySurfaceId.current[surface.surfaceInstanceId] = element
            }}
            className="DashboardFloatingWindow"
            data-workspace-surface-instance-id={surface.surfaceInstanceId}
            data-workspace-host-viewport-id={hostViewportId}
            style={{
              position: 'absolute',
              left: `${floatingRect.x}px`,
              top: `${floatingRect.y}px`,
              width: `${floatingRect.width}px`,
              height: `${floatingRect.height}px`,
              zIndex: 19,
              display: 'grid',
              gridTemplateRows: '32px minmax(0, 1fr)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '12px',
              overflow: 'hidden',
              background: 'rgba(8, 11, 17, 0.96)',
              boxShadow: '0 18px 44px rgba(0, 0, 0, 0.4)',
            }}
          >
            <div
              className="DashboardFloatingWindowHeader"
              onPointerDown={(event: ReactPointerEvent<HTMLDivElement>) => {
                if (event.button !== 0) {
                  return
                }
                if (event.target instanceof Element && event.target.closest('button') !== null) {
                  return
                }
                const floatingWindow =
                  floatingWindowRefBySurfaceId.current[surface.surfaceInstanceId]
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
                color: 'rgba(241,244,255,0.94)',
                cursor: 'grab',
              }}
            >
              <span>Floating Dashboard</span>
              {onOpenSettings !== undefined ? (
                <FloatingWindowSettingsButton
                  className="DashboardFloatingWindowSettings"
                  onClick={() => onOpenSettings('workspace')}
                />
              ) : null}
              <FloatingWindowQuickDockButton
                className="DashboardFloatingWindowQuickDock"
                onClick={() => onQuickDock(surface.surfaceInstanceId)}
              />
            </div>
            <div style={{ position: 'relative', minHeight: 0 }}>
              <DashboardSurface
                surfaceInstanceId={surface.surfaceInstanceId}
                hostMode="floating"
                onOpenNoteInNotepad={(noteId) => onOpenNoteInNotepad(surface.surfaceInstanceId, noteId)}
              />
            </div>
          </div>
        )
      })}
      {popoutSurfaces.map((surface) => (
        <DashboardPopoutWindow
          key={surface.surfaceInstanceId}
          surface={surface}
          onClearDetachedSurface={onClearDetachedSurface}
          onOpenNoteInNotepad={onOpenNoteInNotepad}
          onQuickDock={onQuickDock}
        />
      ))}
    </>
  )
}
