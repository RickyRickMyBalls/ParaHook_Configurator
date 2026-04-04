import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import type { WorkspaceSurfaceKind, WorkspaceViewportSlotId } from './workspaceShellTypes'

export type ViewportFrameHeaderDragOutPayload = {
  pointerId: number
  clientX: number
  clientY: number
  headerRect: DOMRect
  frameRect: DOMRect
}

type ViewportFrameProps = {
  slotId: WorkspaceViewportSlotId
  surfaceKind: WorkspaceSurfaceKind
  availableSurfaceKinds?: readonly WorkspaceSurfaceKind[]
  enableHeaderStripContextMenu?: boolean
  isPrimary?: boolean
  onActivateSurface?: () => void
  onPrimaryButtonClick?: () => void
  primaryButtonLabel?: string
  primaryButtonAriaLabel?: string
  primaryButtonTitle?: string
  primaryButtonExpanded?: boolean
  onRequestSurfaceKind?: (surfaceKind: WorkspaceSurfaceKind) => void
  onSplitTop?: () => void
  onSplitRight?: () => void
  onSplitBottom?: () => void
  onSplitLeft?: () => void
  onFloat?: () => void
  onPopOut?: () => void
  popOutButtonAriaLabel?: string
  popOutButtonTitle?: string
  onClose?: () => void
  onHeaderDragOut?: (payload: ViewportFrameHeaderDragOutPayload) => void
  children: ReactNode
}

const surfaceKindLabels: Record<WorkspaceSurfaceKind, string> = {
  modelViewer: 'Model Viewport',
  browser: 'Browser',
  console: 'Console',
  spaghettiEditor: 'Spaghetti Editor',
  notepad: 'Notepad',
  dashboard: 'Dashboard',
}

const typePickerWidth = 180
const typePickerHeight = 198
const actionMenuWidth = 180
const actionMenuHeight = 210
const menuEdgePadding = 8

type FrameMenuPosition = {
  left: number
  top: number
}

export function ViewportFrame(props: ViewportFrameProps) {
  const {
    slotId,
    surfaceKind,
    availableSurfaceKinds,
    enableHeaderStripContextMenu = false,
    isPrimary = false,
    onActivateSurface,
    onPrimaryButtonClick,
    onRequestSurfaceKind,
    onSplitTop,
    onSplitRight,
    onSplitBottom,
    onSplitLeft,
    onFloat,
    onPopOut,
    onClose,
    onHeaderDragOut,
    children,
  } = props
  const [isTypePickerOpen, setIsTypePickerOpen] = useState(false)
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false)
  const [hoveredActionSubmenu, setHoveredActionSubmenu] = useState<'split' | 'viewportType' | null>(null)
  const [lockedActionSubmenu, setLockedActionSubmenu] = useState<'split' | 'viewportType' | null>(null)
  const [typePickerPosition, setTypePickerPosition] = useState<FrameMenuPosition>({
    left: 8,
    top: 44,
  })
  const [actionMenuPosition, setActionMenuPosition] = useState<FrameMenuPosition>({
    left: 8,
    top: 44,
  })
  const frameRef = useRef<HTMLDivElement | null>(null)
  const modeButtonRef = useRef<HTMLButtonElement | null>(null)
  const typePickerRef = useRef<HTMLDivElement | null>(null)
  const actionMenuButtonRef = useRef<HTMLButtonElement | null>(null)
  const actionMenuRef = useRef<HTMLDivElement | null>(null)
  const pendingHeaderDragRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    headerElement: HTMLDivElement
  } | null>(null)
  const surfaceChoices = useMemo(
    () =>
      (availableSurfaceKinds ??
        (['modelViewer', 'browser', 'console', 'spaghettiEditor', 'notepad', 'dashboard'] as const)
      ).map((kind) => ({
        kind,
        label: surfaceKindLabels[kind],
        disabled: isPrimary && kind !== 'modelViewer',
      })),
    [availableSurfaceKinds, isPrimary],
  )
  const splitActions = useMemo(
    () => [
      { id: 'split-top', label: 'Split Top', onSelect: onSplitTop },
      { id: 'split-right', label: 'Split Right', onSelect: onSplitRight },
      { id: 'split-bottom', label: 'Split Bottom', onSelect: onSplitBottom },
      { id: 'split-left', label: 'Split Left', onSelect: onSplitLeft },
    ],
    [onSplitBottom, onSplitLeft, onSplitRight, onSplitTop],
  )
  const slotActions = useMemo(
    () => [
      { id: 'float', label: 'Float', onSelect: onFloat },
      { id: 'popout', label: 'Pop Out', onSelect: onPopOut },
      { id: 'close', label: 'Close', onSelect: onClose },
    ],
    [onClose, onFloat, onPopOut],
  )
  const isSplitSubmenuOpen =
    lockedActionSubmenu === 'split' ||
    (lockedActionSubmenu === null && hoveredActionSubmenu === 'split')
  const isViewportTypeSubmenuOpen =
    lockedActionSubmenu === 'viewportType' ||
    (lockedActionSubmenu === null && hoveredActionSubmenu === 'viewportType')

  useEffect(() => {
    if (!isTypePickerOpen && !isActionMenuOpen) {
      return
    }
    const handlePointerDown = (event: PointerEvent) => {
      const targetNode = event.target as Node | null
      if (targetNode === null) {
        setIsTypePickerOpen(false)
        setIsActionMenuOpen(false)
        setHoveredActionSubmenu(null)
        setLockedActionSubmenu(null)
        return
      }
      if (
        isTypePickerOpen &&
        (typePickerRef.current?.contains(targetNode) === true ||
          modeButtonRef.current?.contains(targetNode) === true)
      ) {
        return
      }
      if (
        isActionMenuOpen &&
        (actionMenuRef.current?.contains(targetNode) === true ||
          actionMenuButtonRef.current?.contains(targetNode) === true)
      ) {
        return
      }
      setIsTypePickerOpen(false)
      setIsActionMenuOpen(false)
      setHoveredActionSubmenu(null)
      setLockedActionSubmenu(null)
    }
    window.addEventListener('pointerdown', handlePointerDown)
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isActionMenuOpen, isTypePickerOpen])

  useEffect(() => {
    if (onHeaderDragOut === undefined) {
      return
    }
    const handlePointerMove = (event: PointerEvent) => {
      const pendingHeaderDrag = pendingHeaderDragRef.current
      if (pendingHeaderDrag === null || pendingHeaderDrag.pointerId !== event.pointerId) {
        return
      }
      const deltaX = event.clientX - pendingHeaderDrag.startX
      const deltaY = event.clientY - pendingHeaderDrag.startY
      if (Math.hypot(deltaX, deltaY) < 8) {
        return
      }
      const headerRect = pendingHeaderDrag.headerElement.getBoundingClientRect()
      const frameRect =
        pendingHeaderDrag.headerElement.closest('.ViewportFrame')?.getBoundingClientRect() ?? headerRect
      pendingHeaderDragRef.current = null
      onHeaderDragOut({
        pointerId: event.pointerId,
        clientX: event.clientX,
        clientY: event.clientY,
        headerRect,
        frameRect,
      })
    }
    const handlePointerUp = (event: PointerEvent) => {
      const pendingHeaderDrag = pendingHeaderDragRef.current
      if (pendingHeaderDrag === null || pendingHeaderDrag.pointerId !== event.pointerId) {
        return
      }
      pendingHeaderDragRef.current = null
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [onHeaderDragOut])

  const resolveMenuPosition = (
    clientX: number,
    clientY: number,
    menuWidth: number,
    menuHeight: number,
  ): FrameMenuPosition => {
    const frameRect = frameRef.current?.getBoundingClientRect()
    if (frameRect === undefined) {
      return { left: 8, top: 44 }
    }
    const maxLeft = Math.max(menuEdgePadding, frameRect.width - menuWidth - menuEdgePadding)
    const maxTop = Math.max(menuEdgePadding, frameRect.height - menuHeight - menuEdgePadding)
    return {
      left: Math.min(maxLeft, Math.max(menuEdgePadding, Math.round(clientX - frameRect.left))),
      top: Math.min(maxTop, Math.max(menuEdgePadding, Math.round(clientY - frameRect.top))),
    }
  }

  const handleViewportButtonContextMenu = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsActionMenuOpen(false)
    setHoveredActionSubmenu(null)
    setLockedActionSubmenu(null)
    setTypePickerPosition(
      resolveMenuPosition(event.clientX, event.clientY, typePickerWidth, typePickerHeight),
    )
    setIsTypePickerOpen((current) => !current)
  }

  const handleViewportHeaderContextMenu = (event: ReactMouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsTypePickerOpen(false)
    setHoveredActionSubmenu(null)
    setLockedActionSubmenu(null)
    setActionMenuPosition(
      resolveMenuPosition(event.clientX, event.clientY, actionMenuWidth, actionMenuHeight),
    )
    setIsActionMenuOpen(true)
  }

  const handleViewportFrameContextMenuCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!enableHeaderStripContextMenu) {
      return
    }
    const frameRect = frameRef.current?.getBoundingClientRect()
    if (frameRect === undefined) {
      return
    }
    const isWithinTopStrip = event.clientY >= frameRect.top && event.clientY <= frameRect.top + 44
    if (!isWithinTopStrip) {
      return
    }
    const targetElement = event.target as Element | null
    if (targetElement?.closest('.ViewportFrameActionMenu, .ViewportFrameTypePicker') !== null) {
      return
    }
    event.preventDefault()
    event.stopPropagation()
    setIsTypePickerOpen(false)
    setHoveredActionSubmenu(null)
    setLockedActionSubmenu(null)
    setActionMenuPosition(
      resolveMenuPosition(event.clientX, event.clientY, actionMenuWidth, actionMenuHeight),
    )
    setIsActionMenuOpen(true)
  }

  const handleViewportHeaderPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || onHeaderDragOut === undefined) {
      return
    }
    if (event.target instanceof Element && event.target.closest('button') !== null) {
      return
    }
    event.preventDefault()
    pendingHeaderDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      headerElement: event.currentTarget,
    }
  }

  const handleSelectSurfaceKind = (nextSurfaceKind: WorkspaceSurfaceKind) => {
    setIsTypePickerOpen(false)
    setIsActionMenuOpen(false)
    setHoveredActionSubmenu(null)
    setLockedActionSubmenu(null)
    onRequestSurfaceKind?.(nextSurfaceKind)
  }

  const handleActionSelect = (action: (() => void) | undefined) => {
    setIsActionMenuOpen(false)
    setHoveredActionSubmenu(null)
    setLockedActionSubmenu(null)
    action?.()
  }

  const handlePopOutButtonClick = () => {
    setIsTypePickerOpen(false)
    setIsActionMenuOpen(false)
    setHoveredActionSubmenu(null)
    setLockedActionSubmenu(null)
    onPopOut?.()
  }

  const handleHoverActionSubmenu = (submenu: 'split' | 'viewportType') => {
    if (lockedActionSubmenu !== null) {
      return
    }
    setHoveredActionSubmenu(submenu)
  }

  const handleLeaveActionSubmenu = (submenu: 'split' | 'viewportType') => {
    if (lockedActionSubmenu !== null || hoveredActionSubmenu !== submenu) {
      return
    }
    setHoveredActionSubmenu(null)
  }

  const handleToggleActionSubmenu = (
    submenu: 'split' | 'viewportType',
    event: ReactMouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
    event.stopPropagation()
    setLockedActionSubmenu((current) => {
      const nextValue = current === submenu ? null : submenu
      setHoveredActionSubmenu(nextValue)
      return nextValue
    })
  }

  return (
    <div
      ref={frameRef}
      className={`ViewportFrame ViewportFrame--${surfaceKind} ${isPrimary ? 'isPrimarySlot' : ''}`}
      data-workspace-slot-id={slotId}
      data-workspace-surface-kind={surfaceKind}
      onPointerDownCapture={onActivateSurface}
      onContextMenuCapture={handleViewportFrameContextMenuCapture}
    >
      <div
        className="ViewportFrameHeader"
        onContextMenu={handleViewportHeaderContextMenu}
        onPointerDown={handleViewportHeaderPointerDown}
      >
        <div className="ViewportFrameHeaderStart">
          <button
            ref={modeButtonRef}
            type="button"
            className="ViewportFrameModeButton"
            onClick={onPrimaryButtonClick}
            onContextMenu={handleViewportButtonContextMenu}
            aria-label={
              props.primaryButtonAriaLabel ?? `Viewport controls for ${surfaceKindLabels[surfaceKind]}`
            }
            aria-expanded={props.primaryButtonExpanded}
            title={
              props.primaryButtonTitle ??
              `Left click keeps the current view control. Right click changes this viewport.`
            }
          >
            {props.primaryButtonLabel ?? '-'}
          </button>
          <span className="ViewportFrameTitle">{surfaceKindLabels[surfaceKind]}</span>
        </div>
        {onPopOut !== undefined ? (
          <button
            ref={actionMenuButtonRef}
            type="button"
            className="ViewportFrameActionMenuButton"
            onClick={handlePopOutButtonClick}
            aria-label={props.popOutButtonAriaLabel ?? `Pop out ${surfaceKindLabels[surfaceKind]}`}
            title={props.popOutButtonTitle ?? 'Pop out viewport'}
          >
            ↗
          </button>
        ) : null}
        {isTypePickerOpen ? (
          <div
            ref={typePickerRef}
            className="ViewportFrameTypePicker"
            role="menu"
            aria-label="Viewport type picker"
            style={{
              left: `${typePickerPosition.left}px`,
              top: `${typePickerPosition.top}px`,
            }}
          >
            {surfaceChoices.map((choice) => (
              <button
                key={choice.kind}
                type="button"
                className={`ViewportFrameTypePickerAction ${
                  choice.kind === surfaceKind ? 'isActive' : ''
                }`}
                disabled={choice.disabled}
                onClick={() => handleSelectSurfaceKind(choice.kind)}
              >
                {choice.label}
              </button>
            ))}
          </div>
        ) : null}
        {isActionMenuOpen ? (
          <div
            ref={actionMenuRef}
            className="ViewportFrameActionMenu"
            role="menu"
            aria-label="Viewport actions"
            style={{
              left: `${actionMenuPosition.left}px`,
              top: `${actionMenuPosition.top}px`,
            }}
          >
            <div
              className="ViewportFrameActionMenuSubmenuGroup"
              onMouseEnter={() => handleHoverActionSubmenu('split')}
              onMouseLeave={() => handleLeaveActionSubmenu('split')}
            >
              <button
                type="button"
                className="ViewportFrameActionMenuAction ViewportFrameActionMenuAction--submenu"
                aria-haspopup="menu"
                aria-expanded={isSplitSubmenuOpen}
                onFocus={() => handleHoverActionSubmenu('split')}
                onClick={(event) => handleToggleActionSubmenu('split', event)}
              >
                <span>Split</span>
                <span className="ViewportFrameActionMenuChevron">›</span>
              </button>
              {isSplitSubmenuOpen ? (
                <div className="ViewportFrameActionSubmenu" role="menu">
                  {splitActions.map((action) => (
                    <button
                      key={action.id}
                      type="button"
                      className="ViewportFrameActionMenuAction"
                      disabled={action.onSelect === undefined}
                      onClick={() => handleActionSelect(action.onSelect)}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <div
              className="ViewportFrameActionMenuSubmenuGroup"
              onMouseEnter={() => handleHoverActionSubmenu('viewportType')}
              onMouseLeave={() => handleLeaveActionSubmenu('viewportType')}
            >
              <button
                type="button"
                className="ViewportFrameActionMenuAction ViewportFrameActionMenuAction--submenu"
                aria-haspopup="menu"
                aria-expanded={isViewportTypeSubmenuOpen}
                onFocus={() => handleHoverActionSubmenu('viewportType')}
                onClick={(event) => handleToggleActionSubmenu('viewportType', event)}
              >
                <span>Viewport Type</span>
                <span className="ViewportFrameActionMenuChevron">›</span>
              </button>
              {isViewportTypeSubmenuOpen ? (
                <div className="ViewportFrameActionSubmenu" role="menu">
                  {surfaceChoices.map((choice) => (
                    <button
                      key={choice.kind}
                      type="button"
                      className={`ViewportFrameActionMenuAction ${
                        choice.kind === surfaceKind ? 'isActive' : ''
                      }`}
                      disabled={choice.disabled}
                      onClick={() => handleSelectSurfaceKind(choice.kind)}
                    >
                      {choice.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            {slotActions.map((action) => (
              <button
                key={action.id}
                type="button"
                className="ViewportFrameActionMenuAction"
                disabled={action.onSelect === undefined}
                onClick={() => handleActionSelect(action.onSelect)}
              >
                {action.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="ViewportFrameBody">{children}</div>
    </div>
  )
}
