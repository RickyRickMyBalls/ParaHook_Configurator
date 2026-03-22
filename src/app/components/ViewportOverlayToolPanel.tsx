import {
  Children,
  Fragment,
  forwardRef,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type MouseEventHandler,
  type PointerEvent as ReactPointerEvent,
  type PointerEventHandler,
  type ReactNode,
} from 'react'
import { SpaghettiContextMenu } from '../spaghetti/ui/SpaghettiContextMenu'

export type ViewportOverlayToolPanelResizeDirection =
  | 'n'
  | 's'
  | 'e'
  | 'w'
  | 'ne'
  | 'nw'
  | 'se'
  | 'sw'

const defaultResizeDirections: readonly ViewportOverlayToolPanelResizeDirection[] = [
  'n',
  's',
  'e',
  'w',
  'ne',
  'nw',
  'se',
  'sw',
] as const

type ViewportOverlayToolPanelProps = {
  className?: string
  style?: CSSProperties
  title: ReactNode
  titleMeta?: ReactNode
  leadingActions?: ReactNode
  titleActions?: ReactNode
  onTitleBarPointerDown?: PointerEventHandler<HTMLDivElement>
  onTitleBarMouseDown?: MouseEventHandler<HTMLDivElement>
  resizeDirections?: readonly ViewportOverlayToolPanelResizeDirection[]
  onResizeHandlePointerDown?: (
    direction: ViewportOverlayToolPanelResizeDirection,
    event: ReactPointerEvent<HTMLDivElement>,
  ) => void
  iMenuLabel?: ReactNode
  iMenuContent?: ReactNode
  onIMenuOpenChange?: (open: boolean) => void
  onIMenuExpandedChange?: (expanded: boolean) => void
  children: ReactNode
}

type ViewportOverlayToolSectionProps = {
  className?: string
  label?: ReactNode
  children: ReactNode
}

type ViewportOverlayToolSplitLayoutProps = {
  className?: string
  top: ReactNode
  bottom: ReactNode
  defaultTopHeight?: number
  minTopHeight?: number
  minBottomHeight?: number
}

type ViewportOverlayToolSectionStackProps = {
  className?: string
  minPaneHeight?: number
  resetKey?: number | string
  children: ReactNode
}

export const ViewportOverlayToolPanel = forwardRef<HTMLDivElement, ViewportOverlayToolPanelProps>(
  function ViewportOverlayToolPanel(props, ref) {
    const {
      className,
      style,
      title,
      titleMeta,
      leadingActions,
      titleActions,
      onTitleBarPointerDown,
      onTitleBarMouseDown,
      resizeDirections,
      onResizeHandlePointerDown,
      iMenuLabel,
      iMenuContent,
      onIMenuOpenChange,
      onIMenuExpandedChange,
      children,
    } = props
    const panelRef = useRef<HTMLDivElement | null>(null)
    const [titleBarContextMenu, setTitleBarContextMenu] = useState<{
      x: number
      y: number
    } | null>(null)
  const [iMenuOpen, setIMenuOpen] = useState(false)
  const [iMenuExpanded, setIMenuExpanded] = useState(true)
    const iMenuSplitContainerRef = useRef<HTMLDivElement | null>(null)
    const iMenuSplitDragStateRef = useRef<{
      active: boolean
      pointerId: number
      startY: number
      startTopHeight: number
    } | null>(null)
    const [iMenuTopHeight, setIMenuTopHeight] = useState(220)
    const resolvedResizeDirections =
      onResizeHandlePointerDown === undefined ? [] : resizeDirections ?? defaultResizeDirections
    const hasIMenu = iMenuContent !== undefined && iMenuContent !== null

    const handlePanelRef = (node: HTMLDivElement | null) => {
      panelRef.current = node
      if (typeof ref === 'function') {
        ref(node)
        return
      }
      if (ref !== null) {
        ref.current = node
      }
    }

    const handleTitleBarContextMenu = (event: ReactMouseEvent<HTMLDivElement>) => {
      if (!hasIMenu) {
        return
      }
      event.preventDefault()
      event.stopPropagation()
      const panelRect = panelRef.current?.getBoundingClientRect()
      setTitleBarContextMenu({
        x:
          panelRect === undefined || panelRect === null
            ? event.clientX
            : event.clientX - panelRect.left,
        y:
          panelRect === undefined || panelRect === null
            ? event.clientY
            : event.clientY - panelRect.top,
      })
    }

    const startIMenuSplitResize = (event: ReactPointerEvent<HTMLDivElement>) => {
      const container = iMenuSplitContainerRef.current
      if (container === null) {
        return
      }
      event.preventDefault()
      event.stopPropagation()

      iMenuSplitDragStateRef.current = {
        active: true,
        pointerId: event.pointerId,
        startY: event.clientY,
        startTopHeight: iMenuTopHeight,
      }

      const move = (moveEvent: PointerEvent) => {
        const state = iMenuSplitDragStateRef.current
        if (state === null || !state.active || moveEvent.pointerId !== state.pointerId) {
          return
        }

        const nextRawHeight = state.startTopHeight + (moveEvent.clientY - state.startY)
        const containerHeight = container.getBoundingClientRect().height
        const minTopHeight = iMenuExpanded ? 112 : 30
        const minBottomHeight = 140
        const maxTopHeight =
          containerHeight > 0
            ? Math.max(minTopHeight, containerHeight - minBottomHeight - 10)
            : Number.POSITIVE_INFINITY
        setIMenuTopHeight(Math.round(Math.min(Math.max(nextRawHeight, minTopHeight), maxTopHeight)))
      }

      const stop = (stopEvent: PointerEvent) => {
        const state = iMenuSplitDragStateRef.current
        if (state === null || stopEvent.pointerId !== state.pointerId) {
          return
        }
        iMenuSplitDragStateRef.current = {
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

    return (
      <div
        ref={handlePanelRef}
        className={`ViewportOverlayToolPanel${className ? ` ${className}` : ''}`}
        style={style}
      >
        {resolvedResizeDirections.map((direction) => (
          <div
            key={direction}
            className={`ViewportOverlayToolPanelResizeHandle ViewportOverlayToolPanelResizeHandle--${direction}`}
            onPointerDown={(event) => onResizeHandlePointerDown?.(direction, event)}
          />
        ))}
        <div
          className="ViewportOverlayToolPanelTitleBar"
          onPointerDown={onTitleBarPointerDown}
          onMouseDown={onTitleBarMouseDown}
          onContextMenu={handleTitleBarContextMenu}
        >
          {leadingActions !== undefined && leadingActions !== null ? (
            <div className="ViewportOverlayToolPanelLeadingActions">{leadingActions}</div>
          ) : null}
          <div className="ViewportOverlayToolPanelTitleBlock">
            <div className="ViewportOverlayToolPanelTitle">{title}</div>
            {titleMeta !== undefined && titleMeta !== null ? (
              <div className="ViewportOverlayToolPanelTitleMeta">{titleMeta}</div>
            ) : null}
          </div>
          {titleActions !== undefined && titleActions !== null ? (
            <div className="ViewportOverlayToolPanelTrailingActions">{titleActions}</div>
          ) : null}
        </div>
        <div className="ViewportOverlayToolPanelBody">
          {hasIMenu && iMenuOpen ? (
            <div ref={iMenuSplitContainerRef} className="ViewportOverlayToolPanelBodySplitLayout">
              <div
                className="ViewportOverlayToolPanelBodySplitPane ViewportOverlayToolPanelBodySplitPane--top"
                style={{ height: `${iMenuTopHeight}px` }}
              >
                <ViewportOverlayToolSection
                  className="ViewportOverlayToolPanelIMenuSection"
                  label={
                    <button
                      type="button"
                      className="ViewportOverlayToolPanelTextToggle"
                      onClick={() =>
                        setIMenuExpanded((current) => {
                          const next = !current
                          onIMenuExpandedChange?.(next)
                          return next
                        })
                      }
                    >
                      <span
                        className={`ViewportOverlayToolPanelChevron ${
                          iMenuExpanded ? 'isExpanded' : ''
                        }`}
                        aria-hidden="true"
                      >
                        ›
                      </span>
                      <span>{iMenuLabel ?? 'i Menu'}</span>
                    </button>
                  }
                >
                  {iMenuExpanded ? iMenuContent : null}
                </ViewportOverlayToolSection>
              </div>
              <div
                className="ViewportOverlayToolPanelBodySplitResizeHandle"
                onPointerDown={startIMenuSplitResize}
                role="separator"
                aria-orientation="horizontal"
                aria-label="Resize customization section"
              >
                <div className="ViewportOverlayToolPanelBodySplitResizeRule" />
              </div>
              <div className="ViewportOverlayToolPanelBodySplitPane ViewportOverlayToolPanelBodySplitPane--bottom">
                {children}
              </div>
            </div>
          ) : (
            children
          )}
        </div>
        <SpaghettiContextMenu
          open={titleBarContextMenu !== null}
          x={titleBarContextMenu?.x ?? 0}
          y={titleBarContextMenu?.y ?? 0}
          onClose={() => setTitleBarContextMenu(null)}
          containerClassName="ViewportOverlayToolPanelContextMenu"
          items={
            hasIMenu
              ? [
                  {
                    id: 'toggle-i-menu',
                    label: iMenuOpen ? 'Close i Menu' : 'Open i Menu',
                    onSelect: () => {
                      setIMenuOpen((current) => {
                        const nextOpen = !current
                        if (nextOpen) {
                          setIMenuExpanded(true)
                          onIMenuExpandedChange?.(true)
                        }
                        onIMenuOpenChange?.(nextOpen)
                        return nextOpen
                      })
                      setTitleBarContextMenu(null)
                    },
                  },
                ]
              : []
          }
        />
      </div>
    )
  },
)

export function ViewportOverlayToolSection(props: ViewportOverlayToolSectionProps) {
  const { className, label, children } = props
  return (
    <div className={`ViewportOverlayToolPanelSection${className ? ` ${className}` : ''}`}>
      {label !== undefined && label !== null ? (
        <div className="ViewportOverlayToolPanelSectionLabel">{label}</div>
      ) : null}
      {children}
    </div>
  )
}

export function ViewportOverlayToolSplitLayout(props: ViewportOverlayToolSplitLayoutProps) {
  const {
    className,
    top,
    bottom,
    defaultTopHeight = 144,
    minTopHeight = 108,
    minBottomHeight = 140,
  } = props
  const containerRef = useRef<HTMLDivElement | null>(null)
  const dragStateRef = useRef<{
    active: boolean
    pointerId: number
    startY: number
    startTopHeight: number
  } | null>(null)
  const [topHeight, setTopHeight] = useState<number>(defaultTopHeight)

  const startResize = (event: ReactPointerEvent<HTMLDivElement>) => {
    const container = containerRef.current
    if (container === null) {
      return
    }
    event.preventDefault()
    event.stopPropagation()

    dragStateRef.current = {
      active: true,
      pointerId: event.pointerId,
      startY: event.clientY,
      startTopHeight: topHeight,
    }

    const move = (moveEvent: PointerEvent) => {
      const state = dragStateRef.current
      if (state === null || !state.active || moveEvent.pointerId !== state.pointerId) {
        return
      }

      const nextRawHeight = state.startTopHeight + (moveEvent.clientY - state.startY)
      const containerHeight = container.getBoundingClientRect().height
      const maxTopHeight =
        containerHeight > 0
          ? Math.max(minTopHeight, containerHeight - minBottomHeight - 10)
          : Number.POSITIVE_INFINITY
      setTopHeight(Math.round(Math.min(Math.max(nextRawHeight, minTopHeight), maxTopHeight)))
    }

    const stop = (stopEvent: PointerEvent) => {
      const state = dragStateRef.current
      if (state === null || stopEvent.pointerId !== state.pointerId) {
        return
      }
      dragStateRef.current = {
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

  return (
    <div
      ref={containerRef}
      className={`ViewportOverlayToolPanelSplitLayout${className ? ` ${className}` : ''}`}
    >
      <div className="ViewportOverlayToolPanelSplitPane ViewportOverlayToolPanelSplitPane--top" style={{ height: `${topHeight}px` }}>
        {top}
      </div>
      <div
        className="ViewportOverlayToolPanelSplitResizeHandle"
        onPointerDown={startResize}
        role="separator"
        aria-orientation="horizontal"
        aria-label="Resize toolbar sections"
      >
        <div className="ViewportOverlayToolPanelSplitResizeRule" />
      </div>
      <div className="ViewportOverlayToolPanelSplitPane ViewportOverlayToolPanelSplitPane--bottom">
        {bottom}
      </div>
    </div>
  )
}

export function ViewportOverlayToolSectionStack(props: ViewportOverlayToolSectionStackProps) {
  const { className, minPaneHeight = 56, resetKey, children } = props
  const paneRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const dragStateRef = useRef<{
    active: boolean
    pointerId: number
    upperId: string
    lowerId: string
    startY: number
    startUpperHeight: number
    startLowerHeight: number
  } | null>(null)
  const [paneHeights, setPaneHeights] = useState<Record<string, number>>({})
  const resolvedSections = Children.toArray(children).map((child, index) => ({
    id: `section-${index}`,
    content: child,
  }))

  const sectionIds = resolvedSections.map((section) => section.id).join('|')

  const setPaneRef = (id: string, node: HTMLDivElement | null) => {
    paneRefs.current[id] = node
  }

  const clearMissingPaneHeights = () => {
    setPaneHeights((current) => {
      const nextEntries = Object.entries(current).filter(([id]) =>
        resolvedSections.some((section) => section.id === id),
      )
      if (nextEntries.length === Object.keys(current).length) {
        return current
      }
      return Object.fromEntries(nextEntries)
    })
  }

  const resetPaneHeights = () => {
    setPaneHeights({})
  }

  const startResize =
    (upperId: string, lowerId: string) => (event: ReactPointerEvent<HTMLDivElement>) => {
      const upper = paneRefs.current[upperId]
      const lower = paneRefs.current[lowerId]
      if (upper === null || upper === undefined || lower === null || lower === undefined) {
        return
      }
      event.preventDefault()
      event.stopPropagation()

      dragStateRef.current = {
        active: true,
        pointerId: event.pointerId,
        upperId,
        lowerId,
        startY: event.clientY,
        startUpperHeight: upper.getBoundingClientRect().height,
        startLowerHeight: lower.getBoundingClientRect().height,
      }

      const move = (moveEvent: PointerEvent) => {
        const state = dragStateRef.current
        if (state === null || !state.active || moveEvent.pointerId !== state.pointerId) {
          return
        }
        const totalHeight = state.startUpperHeight + state.startLowerHeight
        const nextUpperHeight = Math.min(
          Math.max(state.startUpperHeight + (moveEvent.clientY - state.startY), minPaneHeight),
          totalHeight - minPaneHeight,
        )
        const nextLowerHeight = totalHeight - nextUpperHeight
        setPaneHeights((current) => ({
          ...current,
          [state.upperId]: Math.round(nextUpperHeight),
          [state.lowerId]: Math.round(nextLowerHeight),
        }))
      }

      const stop = (stopEvent: PointerEvent) => {
        const state = dragStateRef.current
        if (state === null || stopEvent.pointerId !== state.pointerId) {
          return
        }
        dragStateRef.current = {
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
    clearMissingPaneHeights()
  }, [sectionIds])

  useEffect(() => {
    resetPaneHeights()
  }, [resetKey])

  return (
    <div className={`ViewportOverlayToolPanelSectionStack${className ? ` ${className}` : ''}`}>
      {resolvedSections.map((section, index) => (
        <Fragment key={section.id}>
          <div
            ref={(node) => setPaneRef(section.id, node)}
            className="ViewportOverlayToolPanelSectionStackPane"
            data-section-id={section.id}
            style={
              paneHeights[section.id] === undefined
                ? undefined
                : { height: `${paneHeights[section.id]}px` }
            }
          >
            {section.content}
          </div>
          {index < resolvedSections.length - 1 ? (
            <div
              className="ViewportOverlayToolPanelSectionStackResizeHandle"
              onPointerDown={startResize(section.id, resolvedSections[index + 1]!.id)}
              role="separator"
              aria-orientation="horizontal"
              aria-label={`Resize ${section.id} section`}
            >
              <div className="ViewportOverlayToolPanelSectionStackResizeRule" />
            </div>
          ) : null}
        </Fragment>
      ))}
    </div>
  )
}
