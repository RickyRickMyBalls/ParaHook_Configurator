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
import { FloatingWindowQuickDockButton } from '../components/FloatingWindowQuickDockButton'
import { NotepadSurface } from '../notepad/NotepadSurface'
import { useWorkspaceChildWindow } from '../workspace/useWorkspaceChildWindow'
import type { WorkspaceDetachedSlotSurfaceState } from '../workspace/workspaceShellTypes'

const notepadFloatingMinWidth = 420
const notepadFloatingMinHeight = 320
const notepadFloatingEdgePadding = 12
const notepadPopoutBackground = 'rgb(10, 12, 17)'

type NotepadFloatingRect = {
  x: number
  y: number
  width: number
  height: number
}

type NotepadWindowHostProps = {
  viewportRef: RefObject<HTMLElement | null>
  floatingSurfaces: WorkspaceDetachedSlotSurfaceState[]
  popoutSurfaces: WorkspaceDetachedSlotSurfaceState[]
  onClearDetachedSurface: (surfaceInstanceId: string) => void
  onQuickDock: (surfaceInstanceId: string) => void
}

type NotepadPopoutWindowProps = {
  surface: WorkspaceDetachedSlotSurfaceState
  onClearDetachedSurface: (surfaceInstanceId: string) => void
  onQuickDock: (surfaceInstanceId: string) => void
}

function clampNotepadFloatingRect(
  nextRect: NotepadFloatingRect,
  viewportWidth: number,
  viewportHeight: number,
): NotepadFloatingRect {
  const width = Math.max(
    notepadFloatingMinWidth,
    Math.min(
      Math.round(nextRect.width),
      Math.max(notepadFloatingMinWidth, viewportWidth - notepadFloatingEdgePadding * 2),
    ),
  )
  const height = Math.max(
    notepadFloatingMinHeight,
    Math.min(
      Math.round(nextRect.height),
      Math.max(notepadFloatingMinHeight, viewportHeight - notepadFloatingEdgePadding * 2),
    ),
  )
  const maxX = Math.max(notepadFloatingEdgePadding, viewportWidth - width - notepadFloatingEdgePadding)
  const maxY = Math.max(
    notepadFloatingEdgePadding,
    viewportHeight - height - notepadFloatingEdgePadding,
  )
  return {
    x: Math.max(notepadFloatingEdgePadding, Math.min(Math.round(nextRect.x), maxX)),
    y: Math.max(notepadFloatingEdgePadding, Math.min(Math.round(nextRect.y), maxY)),
    width,
    height,
  }
}

function createNotepadPopoutSpec(surfaceInstanceId: string) {
  return {
    childWindowId: `workspace-surface-${surfaceInstanceId}-popout`,
    owner: 'child-window' as const,
    windowName: `parahook-workspace-surface-${surfaceInstanceId}`,
    windowTitle: 'ParaHook Notepad',
    windowFeatures: 'popup=yes,width=1320,height=880,resizable=yes,scrollbars=no',
  }
}

function NotepadPopoutWindow(props: NotepadPopoutWindowProps) {
  const { surface, onClearDetachedSurface, onQuickDock } = props
  const popoutState = useMemo(
    () => createNotepadPopoutSpec(surface.surfaceInstanceId),
    [surface.surfaceInstanceId],
  )
  const { host } = useWorkspaceChildWindow({
    isOpen: true,
    spec: popoutState,
    rootClassName: 'NotepadPopoutRoot',
    bodyBackground: notepadPopoutBackground,
    onClosed: () => onClearDetachedSurface(surface.surfaceInstanceId),
  })

  if (host === null) {
    return null
  }

  return createPortal(
    <div
      className="NotepadPopoutWindow"
      data-workspace-surface-instance-id={surface.surfaceInstanceId}
      data-workspace-host-viewport-id={surface.hostViewportId ?? ''}
      style={{
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateRows: '48px minmax(0, 1fr)',
        background: notepadPopoutBackground,
      }}
    >
      <div
        className="NotepadPopoutWindowHeader"
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
        <span>Notepad</span>
        <button
          type="button"
          className="NotepadPopoutWindowQuickDock"
          onClick={() => onQuickDock(surface.surfaceInstanceId)}
        >
          Quick Dock
        </button>
      </div>
      <div style={{ position: 'relative', minHeight: 0 }}>
        <NotepadSurface surfaceInstanceId={surface.surfaceInstanceId} hostMode="popout" />
      </div>
    </div>,
    host,
  )
}

export function NotepadWindowHost(props: NotepadWindowHostProps) {
  const { viewportRef, floatingSurfaces, popoutSurfaces, onClearDetachedSurface, onQuickDock } = props
  const floatingRectsRef = useRef<Record<string, NotepadFloatingRect>>({})
  const floatingWindowRefBySurfaceId = useRef<Record<string, HTMLDivElement | null>>({})
  const dragStateRef = useRef<{
    surfaceInstanceId: string
    pointerId: number
    pointerOffsetX: number
    pointerOffsetY: number
  } | null>(null)
  const [, setLayoutVersion] = useState(0)

  const getDefaultFloatingRect = useCallback(
    (_surface: WorkspaceDetachedSlotSurfaceState): NotepadFloatingRect => {
      const viewportAreaRect = viewportRef.current?.getBoundingClientRect() ?? null
      const nextRect = {
        x: 56,
        y: 56,
        width: 680,
        height: 480,
      }
      if (viewportAreaRect === null) {
        return nextRect
      }
      return clampNotepadFloatingRect(
        nextRect,
        Math.max(1, Math.round(viewportAreaRect.width)),
        Math.max(1, Math.round(viewportAreaRect.height)),
      )
    },
    [viewportRef],
  )

  const setFloatingRect = useCallback((surfaceInstanceId: string, nextRect: NotepadFloatingRect) => {
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
        clampNotepadFloatingRect(
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
    window.addEventListener('pointercancel', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
    }
  }, [setFloatingRect, viewportRef])

  const floatingWindows = floatingSurfaces.map((surface) => {
    const rect = floatingRectsRef.current[surface.surfaceInstanceId] ?? getDefaultFloatingRect(surface)
    return (
      <div
        key={surface.surfaceInstanceId}
        ref={(element) => {
          floatingWindowRefBySurfaceId.current[surface.surfaceInstanceId] = element
        }}
        className="NotepadFloatingWindow"
        data-workspace-surface-instance-id={surface.surfaceInstanceId}
        data-workspace-host-viewport-id={surface.hostViewportId ?? ''}
        style={{
          position: 'absolute',
          left: `${rect.x}px`,
          top: `${rect.y}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
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
          className="NotepadFloatingWindowHeader"
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
          <span>Floating Notepad</span>
          <FloatingWindowQuickDockButton
            className="NotepadFloatingWindowQuickDock"
            onClick={() => onQuickDock(surface.surfaceInstanceId)}
          />
        </div>
        <div style={{ position: 'relative', minHeight: 0 }}>
          <NotepadSurface surfaceInstanceId={surface.surfaceInstanceId} hostMode="floating" />
        </div>
      </div>
    )
  })

  const popoutWindows = popoutSurfaces.map((surface) => (
    <NotepadPopoutWindow
      key={surface.surfaceInstanceId}
      surface={surface}
      onClearDetachedSurface={onClearDetachedSurface}
      onQuickDock={onQuickDock}
    />
  ))

  return (
    <>
      {floatingWindows}
      {popoutWindows}
    </>
  )
}
