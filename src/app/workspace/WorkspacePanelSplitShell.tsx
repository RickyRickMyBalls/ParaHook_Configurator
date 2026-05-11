import {
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'

export const WORKSPACE_PANEL_SPLIT_SHELL_MIN_LEFT_WIDTH = 184
export const WORKSPACE_PANEL_SPLIT_SHELL_DEFAULT_LEFT_WIDTH = 240
export const WORKSPACE_PANEL_SPLIT_SHELL_MAX_LEFT_WIDTH = 420
export const WORKSPACE_PANEL_SPLIT_SHELL_KEYBOARD_STEP = 16

const workspacePanelSplitShellResizingBodyClass = 'WorkspacePanelSplitShellIsResizing'

type WorkspacePanelSplitShellProps = {
  left: ReactNode
  right: ReactNode
  leftLabel: string
  rightLabel: string
  className?: string
  dataShellKind?: string
  defaultLeftWidth?: number
  minLeftWidth?: number
  maxLeftWidth?: number
  keyboardStep?: number
  resizeLabel?: string
}

type WorkspacePanelSplitShellStyle = CSSProperties & {
  '--workspace-panel-shell-left-width': string
}

function clampWorkspacePanelSplitShellWidth(
  width: number,
  minLeftWidth: number,
  maxLeftWidth: number,
): number {
  return Math.min(maxLeftWidth, Math.max(minLeftWidth, width))
}

export function WorkspacePanelSplitShell(props: WorkspacePanelSplitShellProps) {
  const {
    left,
    right,
    leftLabel,
    rightLabel,
    className,
    dataShellKind = 'workspace',
    defaultLeftWidth = WORKSPACE_PANEL_SPLIT_SHELL_DEFAULT_LEFT_WIDTH,
    minLeftWidth = WORKSPACE_PANEL_SPLIT_SHELL_MIN_LEFT_WIDTH,
    maxLeftWidth = WORKSPACE_PANEL_SPLIT_SHELL_MAX_LEFT_WIDTH,
    keyboardStep = WORKSPACE_PANEL_SPLIT_SHELL_KEYBOARD_STEP,
    resizeLabel = 'Resize workspace panel',
  } = props
  const [leftWidth, setLeftWidth] = useState(() =>
    clampWorkspacePanelSplitShellWidth(defaultLeftWidth, minLeftWidth, maxLeftWidth),
  )
  const [isResizing, setIsResizing] = useState(false)
  const resizeStartClientXRef = useRef(0)
  const resizeStartLeftWidthRef = useRef(leftWidth)

  useEffect(() => {
    if (!isResizing) {
      return undefined
    }

    const handleMouseMove = (event: globalThis.MouseEvent) => {
      const dragOffset = event.clientX - resizeStartClientXRef.current
      setLeftWidth(
        clampWorkspacePanelSplitShellWidth(
          resizeStartLeftWidthRef.current + dragOffset,
          minLeftWidth,
          maxLeftWidth,
        ),
      )
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.classList.add(workspacePanelSplitShellResizingBodyClass)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.classList.remove(workspacePanelSplitShellResizingBodyClass)
    }
  }, [isResizing, maxLeftWidth, minLeftWidth])

  const handleResizeStart = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    resizeStartClientXRef.current = event.clientX
    resizeStartLeftWidthRef.current = leftWidth
    setIsResizing(true)
  }

  const handleResizeKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      event.key !== 'ArrowLeft' &&
      event.key !== 'ArrowRight' &&
      event.key !== 'Home' &&
      event.key !== 'End'
    ) {
      return
    }

    event.preventDefault()
    setLeftWidth((currentWidth) => {
      if (event.key === 'Home') {
        return minLeftWidth
      }

      if (event.key === 'End') {
        return maxLeftWidth
      }

      const direction = event.key === 'ArrowLeft' ? -1 : 1
      return clampWorkspacePanelSplitShellWidth(
        currentWidth + direction * keyboardStep,
        minLeftWidth,
        maxLeftWidth,
      )
    })
  }

  const shellStyle: WorkspacePanelSplitShellStyle = {
    '--workspace-panel-shell-left-width': `${leftWidth}px`,
  }
  const shellClassName = [
    'WorkspacePanelSplitShell',
    isResizing ? 'isResizingPanel' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={shellClassName}
      data-workspace-panel-shell={dataShellKind}
      style={shellStyle}
    >
      <section
        className="WorkspacePanelSplitShellPanel WorkspacePanelSplitShellPanel--left"
        aria-label={leftLabel}
        data-workspace-panel-shell-region="left"
      >
        {left}
      </section>
      <div
        className="WorkspacePanelSplitShellResizeHandle"
        role="separator"
        aria-label={resizeLabel}
        aria-orientation="vertical"
        aria-valuemin={minLeftWidth}
        aria-valuemax={maxLeftWidth}
        aria-valuenow={leftWidth}
        tabIndex={0}
        data-workspace-panel-shell-region="resize-handle"
        onMouseDown={handleResizeStart}
        onKeyDown={handleResizeKeyDown}
      />
      <section
        className="WorkspacePanelSplitShellPanel WorkspacePanelSplitShellPanel--right"
        aria-label={rightLabel}
        data-workspace-panel-shell-region="right"
      >
        {right}
      </section>
    </div>
  )
}
