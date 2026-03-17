import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { DEFAULT_REFERENCE_ROTATE_SNAP } from '../references/referenceTimeline'
import { getViewer } from '../viewerBridge'
import { useAppStore } from '../store/useAppStore'
import { ConsoleBar } from './ConsoleBar'
import { ConsolePanel } from './ConsolePanel'
import { appendConsoleEntry, isConsoleEntryVisible, useConsoleStore } from './useConsoleStore'
import type { ConsoleFloatingRect } from './consoleTypes'

const FLOATING_MIN_WIDTH = 420
const FLOATING_MIN_HEIGHT = 220
const FLOATING_VIEWPORT_MARGIN = 12
const POPOUT_WINDOW_FEATURES =
  'popup=yes,width=1080,height=720,resizable=yes,scrollbars=no'

type ConsoleDockProps = {
  listLeftOffset?: number
}

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'
type ConsoleCommandName =
  | 'help'
  | 'console'
  | 'clear'
  | 'history'
  | 'frame'
  | 'zoom'
  | 'move'
  | 'rotate'
  | 'scale'
  | 'snap'
  | 'echo'
  | 'status'

const backgroundColorByMode = {
  midnight: '5, 7, 11',
  slate: '20, 24, 32',
  navy: '16, 24, 44',
} as const

const buildConsoleStyle = (
  backgroundOpacity: number,
  textOpacity: number,
  fontSize: number,
  zIndex: number,
  backgroundColorMode: keyof typeof backgroundColorByMode,
): CSSProperties => {
  const bgAlpha = backgroundOpacity / 100
  const textAlpha = textOpacity / 100
  return {
    zIndex,
    '--console-bg-rgb': backgroundColorByMode[backgroundColorMode],
    '--console-bg-alpha': `${bgAlpha}`,
    '--console-text-color': `rgba(232, 232, 234, ${textAlpha})`,
    '--console-text-dim-color': `rgba(232, 232, 234, ${textAlpha * 0.78})`,
    '--console-font-size': `${fontSize}px`,
    '--console-text-muted-color': `rgba(232, 232, 234, ${textAlpha * 0.64})`,
    '--console-text-faint-color': `rgba(255, 255, 255, ${textAlpha * 0.42})`,
    '--console-text-fainter-color': `rgba(255, 255, 255, ${textAlpha * 0.46})`,
    '--console-layer-color-commands': `rgba(245, 248, 255, ${textAlpha})`,
    '--console-layer-color-shortcuts': `rgba(127, 228, 255, ${textAlpha})`,
    '--console-layer-color-app': `rgba(143, 176, 255, ${textAlpha})`,
    '--console-layer-color-worker': `rgba(134, 233, 166, ${textAlpha})`,
    '--console-layer-color-diagnostics': `rgba(255, 143, 114, ${textAlpha})`,
    '--console-layer-color-params': `rgba(241, 194, 109, ${textAlpha})`,
    '--console-layer-color-selection': `rgba(225, 193, 255, ${textAlpha})`,
    '--console-layer-color-view': `rgba(172, 214, 255, ${textAlpha})`,
    '--console-layer-color-browser': `rgba(255, 214, 145, ${textAlpha})`,
    '--console-layer-color-transforms': `rgba(144, 255, 222, ${textAlpha})`,
  } as CSSProperties
}

const clampFloatingRect = (
  nextRect: ConsoleFloatingRect,
  viewportWidth: number,
  viewportHeight: number,
): ConsoleFloatingRect => {
  const maxWidth = Math.max(FLOATING_MIN_WIDTH, viewportWidth - FLOATING_VIEWPORT_MARGIN * 2)
  const maxHeight = Math.max(FLOATING_MIN_HEIGHT, viewportHeight - FLOATING_VIEWPORT_MARGIN * 2)
  const width = Math.min(maxWidth, Math.max(FLOATING_MIN_WIDTH, Math.round(nextRect.width)))
  const height = Math.min(maxHeight, Math.max(FLOATING_MIN_HEIGHT, Math.round(nextRect.height)))
  return {
    x: Math.max(
      FLOATING_VIEWPORT_MARGIN,
      Math.min(Math.round(nextRect.x), viewportWidth - width - FLOATING_VIEWPORT_MARGIN),
    ),
    y: Math.max(
      FLOATING_VIEWPORT_MARGIN,
      Math.min(Math.round(nextRect.y), viewportHeight - height - FLOATING_VIEWPORT_MARGIN),
    ),
    width,
    height,
  }
}

const copyDocumentStyles = (sourceDocument: Document, targetDocument: Document) => {
  const existing = targetDocument.querySelector('[data-console-popout-styles="true"]')
  if (existing !== null) {
    return
  }
  const fragment = targetDocument.createDocumentFragment()
  Array.from(sourceDocument.querySelectorAll('link[rel="stylesheet"], style')).forEach((node) => {
    const clone = node.cloneNode(true)
    if (clone instanceof HTMLElement) {
      clone.setAttribute('data-console-popout-styles', 'true')
    }
    fragment.appendChild(clone)
  })
  targetDocument.head.appendChild(fragment)
}

const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false
  }
  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT' ||
    target.isContentEditable
  )
}

const parseConsoleCommand = (
  inputText: string,
): {
  raw: string
  name: ConsoleCommandName | null
  args: string[]
  argumentText: string
} | null => {
  const raw = inputText.trim()
  if (raw.length === 0) {
    return null
  }
  const firstSpaceIndex = raw.search(/\s/)
  const commandText =
    firstSpaceIndex === -1 ? raw.toLowerCase() : raw.slice(0, firstSpaceIndex).toLowerCase()
  const argumentText = firstSpaceIndex === -1 ? '' : raw.slice(firstSpaceIndex).trim()
  const args = argumentText.length === 0 ? [] : argumentText.split(/\s+/)
  const aliases: Record<string, ConsoleCommandName> = {
    help: 'help',
    console: 'console',
    clear: 'clear',
    history: 'history',
    frame: 'frame',
    f: 'frame',
    zoom: 'zoom',
    z: 'zoom',
    move: 'move',
    m: 'move',
    rotate: 'rotate',
    r: 'rotate',
    scale: 'scale',
    s: 'scale',
    snap: 'snap',
    echo: 'echo',
    status: 'status',
  }
  return {
    raw,
    name: aliases[commandText] ?? null,
    args,
    argumentText,
  }
}

export function ConsoleDock({ listLeftOffset = 0 }: ConsoleDockProps) {
  const dockRef = useRef<HTMLDivElement | null>(null)
  const floatingWindowRef = useRef<HTMLDivElement | null>(null)
  const popoutWindowRef = useRef<Window | null>(null)
  const dockedInputRef = useRef<HTMLInputElement | null>(null)
  const floatingInputRef = useRef<HTMLInputElement | null>(null)
  const popoutInputRef = useRef<HTMLInputElement | null>(null)
  const suppressPopoutCloseRef = useRef(false)
  const [popoutHost, setPopoutHost] = useState<HTMLElement | null>(null)

  const isExpanded = useConsoleStore((state) => state.isExpanded)
  const windowMode = useConsoleStore((state) => state.windowMode)
  const isListMode = useConsoleStore((state) => state.isListMode)
  const backgroundOpacity = useConsoleStore((state) => state.backgroundOpacity)
  const textOpacity = useConsoleStore((state) => state.textOpacity)
  const fontSize = useConsoleStore((state) => state.fontSize)
  const zIndex = useConsoleStore((state) => state.zIndex)
  const backgroundFillMode = useConsoleStore((state) => state.backgroundFillMode)
  const backgroundColorMode = useConsoleStore((state) => state.backgroundColorMode)
  const floatingRect = useConsoleStore((state) => state.floatingRect)
  const entries = useConsoleStore((state) => state.entries)
  const visibleLayers = useConsoleStore((state) => state.visibleLayers)
  const filterMode = useConsoleStore((state) => state.filterMode)
  const isolatedLayer = useConsoleStore((state) => state.isolatedLayer)
  const subsetLayers = useConsoleStore((state) => state.subsetLayers)
  const isDiagnosticsPinned = useConsoleStore((state) => state.isDiagnosticsPinned)
  const switchToDocked = useConsoleStore((state) => state.switchToDocked)
  const switchToFloating = useConsoleStore((state) => state.switchToFloating)
  const switchToPopout = useConsoleStore((state) => state.switchToPopout)
  const switchToList = useConsoleStore((state) => state.switchToList)
  const returnFromList = useConsoleStore((state) => state.returnFromList)
  const setFloatingRect = useConsoleStore((state) => state.setFloatingRect)
  const handlePopoutWindowClosed = useConsoleStore((state) => state.handlePopoutWindowClosed)
  const setExpanded = useConsoleStore((state) => state.setExpanded)
  const pushCommandHistory = useConsoleStore((state) => state.pushCommandHistory)
  const visibleEntries = useMemo(
    () =>
      entries
        .filter((entry) =>
          isConsoleEntryVisible(entry, {
            visibleLayers,
            filterMode,
            isolatedLayer,
            subsetLayers,
            isDiagnosticsPinned,
          }),
        )
        .slice()
        .reverse(),
    [entries, filterMode, isDiagnosticsPinned, isolatedLayer, subsetLayers, visibleLayers],
  )

  const sharedStyle = useMemo(
    () => buildConsoleStyle(backgroundOpacity, textOpacity, fontSize, zIndex, backgroundColorMode),
    [backgroundOpacity, textOpacity, fontSize, zIndex, backgroundColorMode],
  )

  const focusMainConsoleInput = useCallback(() => {
    if (windowMode === 'floating') {
      floatingInputRef.current?.focus()
      return
    }
    dockedInputRef.current?.focus()
  }, [windowMode])

  const focusPopoutConsoleInput = useCallback(() => {
    popoutInputRef.current?.focus()
  }, [])

  const dispatchImmediateShortcut = useCallback((key: 'm' | 'r' | 's') => {
    window.dispatchEvent(
      new KeyboardEvent('keydown', {
        key,
        bubbles: true,
        cancelable: true,
      }),
    )
  }, [])

  const handleSubmitCommand = useCallback(
    (inputText: string) => {
      const parsed = parseConsoleCommand(inputText)
      if (parsed === null) {
        useConsoleStore.getState().setInputText('')
        return
      }

      appendConsoleEntry({
        layer: 'Commands',
        text: `> ${parsed.raw}`,
      })
      pushCommandHistory(parsed.raw)

      const viewer = getViewer()
      const appState = useAppStore.getState()
      const activeReferenceId = appState.referenceWorkspace.activeTransformReferenceId
      const rotateSnapState =
        activeReferenceId === null
          ? DEFAULT_REFERENCE_ROTATE_SNAP
          : appState.referenceWorkspace.rotateSnapByReferenceId[activeReferenceId] ??
            DEFAULT_REFERENCE_ROTATE_SNAP

      switch (parsed.name) {
        case 'help':
          appendConsoleEntry({
            layer: 'Commands',
            text: 'Commands: help, console, clear, history, frame, zoom, move, rotate, scale, snap, echo, status',
            severity: 'info',
          })
          return
        case 'console': {
          useConsoleStore.getState().toggleExpanded()
          const nextState = useConsoleStore.getState()
          appendConsoleEntry({
            layer: 'App',
            text:
              nextState.windowMode === 'docked' && nextState.isExpanded
                ? 'Console expanded'
                : 'Console collapsed',
            source: 'console',
            severity: 'info',
          })
          return
        }
        case 'clear':
          appendConsoleEntry({
            layer: 'Diagnostics',
            text: 'Console clear is disabled for now',
            source: 'console',
            severity: 'warn',
          })
          return
        case 'history':
          if (useConsoleStore.getState().commandHistory.length === 0) {
            appendConsoleEntry({
              layer: 'Commands',
              text: 'No command history yet',
              source: 'console',
              severity: 'info',
            })
            return
          }
          appendConsoleEntry({
            layer: 'Commands',
            text: `History: ${useConsoleStore
              .getState()
              .commandHistory.slice(-8)
              .join(' | ')}`,
            source: 'console',
            severity: 'info',
          })
          return
        case 'frame':
          viewer?.frameAll()
          appendConsoleEntry({
            layer: 'View',
            text: 'Frame all',
            source: 'console',
            severity: 'info',
          })
          return
        case 'zoom':
          viewer?.frameSelected(appState.selectedPartKey)
          appendConsoleEntry({
            layer: 'View',
            text:
              appState.selectedPartKey === null
                ? 'Zoom selected: no active part, framed all'
                : `Zoom selected: ${appState.selectedPartKey}`,
            source: 'console',
            severity: 'info',
          })
          return
        case 'move':
          dispatchImmediateShortcut('m')
          return
        case 'rotate':
          dispatchImmediateShortcut('r')
          return
        case 'scale':
          dispatchImmediateShortcut('s')
          return
        case 'snap':
          if (activeReferenceId === null) {
            appendConsoleEntry({
              layer: 'Diagnostics',
              text: 'Snap requires an active reference transform session',
              source: 'console',
              severity: 'warn',
            })
            return
          }
          appState.setReferenceRotateSnapEnabled(activeReferenceId, !rotateSnapState.enabled)
          appendConsoleEntry({
            layer: 'Transforms',
            text: `Rotate snap ${rotateSnapState.enabled ? 'disabled' : 'enabled'}`,
            source: 'console',
            severity: 'info',
          })
          return
        case 'echo':
          appendConsoleEntry({
            layer: 'Commands',
            text: parsed.argumentText.length === 0 ? '(empty)' : parsed.argumentText,
            source: 'console',
            severity: 'info',
          })
          return
        case 'status':
          appendConsoleEntry({
            layer: 'App',
            text: `Status: input=${appState.inputMode}, view=${appState.viewMode}`,
            source: 'console',
            severity: 'info',
          })
          appendConsoleEntry({
            layer: 'Selection',
            text: `Selected: ${appState.selectedPartKey ?? 'none'}`,
            source: 'console',
            severity: 'info',
          })
          appendConsoleEntry({
            layer: 'Shortcuts',
            text:
              activeReferenceId === null
                ? 'Reference transform: none'
                : `Reference transform: ${appState.referenceWorkspace.activeTransformMode} ${activeReferenceId}`,
            source: 'console',
            severity: 'info',
          })
          return
        default:
          appendConsoleEntry({
            layer: 'Diagnostics',
            text: `Unknown command: ${parsed.raw}`,
            source: 'console',
            severity: 'warn',
          })
      }
    },
    [dispatchImmediateShortcut, pushCommandHistory],
  )

  useEffect(() => {
    if (windowMode !== 'floating') {
      return
    }
    const viewportWidth = dockRef.current?.clientWidth ?? window.innerWidth
    const viewportHeight = dockRef.current?.clientHeight ?? window.innerHeight
    const clamped = clampFloatingRect(floatingRect, viewportWidth, viewportHeight)
    if (
      clamped.x !== floatingRect.x ||
      clamped.y !== floatingRect.y ||
      clamped.width !== floatingRect.width ||
      clamped.height !== floatingRect.height
    ) {
      setFloatingRect(clamped)
    }
  }, [floatingRect, setFloatingRect, windowMode])

  useEffect(() => {
    if (windowMode !== 'popout') {
      if (popoutWindowRef.current !== null) {
        suppressPopoutCloseRef.current = true
        popoutWindowRef.current.close()
        popoutWindowRef.current = null
        setPopoutHost(null)
      }
      return
    }

    let popup = popoutWindowRef.current
    if (popup === null || popup.closed) {
      popup = window.open('', 'parahook-console', POPOUT_WINDOW_FEATURES)
      if (popup === null) {
        appendConsoleEntry({
          layer: 'Diagnostics',
          text: 'Console pop-out was blocked by the browser',
          source: 'console',
          severity: 'warn',
        })
        switchToDocked(false)
        return
      }
      popoutWindowRef.current = popup
      popup.document.title = 'ParaHook Console'
      popup.document.body.innerHTML = ''
      popup.document.body.style.margin = '0'
      popup.document.body.style.background = 'rgb(5, 7, 11)'
      popup.document.body.style.overflow = 'hidden'
      copyDocumentStyles(document, popup.document)
      const host = popup.document.createElement('div')
      host.className = 'ConsolePopoutRoot'
      popup.document.body.appendChild(host)
      setPopoutHost(host)
      const handleBeforeUnload = () => {
        popoutWindowRef.current = null
        setPopoutHost(null)
        if (suppressPopoutCloseRef.current) {
          suppressPopoutCloseRef.current = false
          return
        }
        handlePopoutWindowClosed()
      }
      popup.addEventListener('beforeunload', handleBeforeUnload, { once: true })
    } else {
      popup.focus()
      const host = popup.document.querySelector('.ConsolePopoutRoot')
      if (host instanceof HTMLElement) {
        setPopoutHost(host)
      }
    }

    return () => {
      if (windowMode !== 'popout') {
        return
      }
    }
  }, [handlePopoutWindowClosed, switchToDocked, windowMode])

  useEffect(() => {
    return () => {
      if (popoutWindowRef.current !== null && !popoutWindowRef.current.closed) {
        suppressPopoutCloseRef.current = true
        popoutWindowRef.current.close()
      }
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.key !== '/' ||
        event.ctrlKey ||
        event.altKey ||
        event.metaKey ||
        isEditableTarget(event.target)
      ) {
        return
      }
      event.preventDefault()
      focusMainConsoleInput()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [focusMainConsoleInput])

  useEffect(() => {
    const popoutWindow = popoutWindowRef.current
    if (windowMode !== 'popout' || popoutWindow === null) {
      return
    }

    const handlePopoutKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.key !== '/' ||
        event.ctrlKey ||
        event.altKey ||
        event.metaKey ||
        isEditableTarget(event.target)
      ) {
        return
      }
      event.preventDefault()
      focusPopoutConsoleInput()
    }

    popoutWindow.addEventListener('keydown', handlePopoutKeyDown)
    return () => {
      popoutWindow.removeEventListener('keydown', handlePopoutKeyDown)
    }
  }, [focusPopoutConsoleInput, popoutHost, windowMode])

  const handleFloatingHeaderPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null
    if (target?.closest('button, input, select') !== null) {
      return
    }
    event.preventDefault()
    event.stopPropagation()
    const startX = event.clientX
    const startY = event.clientY
    const startRect = floatingRect
    const move = (moveEvent: PointerEvent) => {
      const viewportWidth = dockRef.current?.clientWidth ?? window.innerWidth
      const viewportHeight = dockRef.current?.clientHeight ?? window.innerHeight
      setFloatingRect(
        clampFloatingRect(
          {
            ...startRect,
            x: startRect.x + (moveEvent.clientX - startX),
            y: startRect.y + (moveEvent.clientY - startY),
          },
          viewportWidth,
          viewportHeight,
        ),
      )
    }
    const stop = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
  }

  const handleFloatingResizePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
    direction: ResizeDirection,
  ) => {
    event.preventDefault()
    event.stopPropagation()
    const startRect = floatingRect
    const startX = event.clientX
    const startY = event.clientY
    const move = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX
      const deltaY = moveEvent.clientY - startY
      let nextRect = { ...startRect }

      if (direction.includes('e')) {
        nextRect.width = startRect.width + deltaX
      }
      if (direction.includes('s')) {
        nextRect.height = startRect.height + deltaY
      }
      if (direction.includes('w')) {
        nextRect.x = startRect.x + deltaX
        nextRect.width = startRect.width - deltaX
      }
      if (direction.includes('n')) {
        nextRect.y = startRect.y + deltaY
        nextRect.height = startRect.height - deltaY
      }

      const viewportWidth = dockRef.current?.clientWidth ?? window.innerWidth
      const viewportHeight = dockRef.current?.clientHeight ?? window.innerHeight
      setFloatingRect(clampFloatingRect(nextRect, viewportWidth, viewportHeight))
    }
    const stop = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
  }

  const handleFloatToggle = () => {
    if (windowMode === 'floating') {
      switchToDocked(true)
      return
    }
    switchToFloating()
  }

  const handlePopoutToggle = () => {
    if (windowMode === 'popout') {
      switchToDocked(false)
      return
    }
    switchToPopout()
  }

  const handleListToggle = () => {
    if (isListMode) {
      returnFromList()
      return
    }
    switchToList()
  }

  const handleFloatingClose = () => {
    switchToDocked(false)
  }

  const handlePopoutClose = () => {
    switchToDocked(false)
  }

  const handleListPanelClose = () => {
    setExpanded(false)
  }

  const floatingWindow = windowMode === 'floating' ? (
    <div
      ref={floatingWindowRef}
      className="ConsoleFloatingWindow"
      style={{
        left: `${floatingRect.x}px`,
        top: `${floatingRect.y}px`,
        width: `${floatingRect.width}px`,
        height: `${floatingRect.height}px`,
      }}
    >
      {(['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'] as const).map((direction) => (
        <div
          key={direction}
          className={`ConsoleFloatingResizeHandle ConsoleFloatingResizeHandle--${direction}`}
          onPointerDown={(event) => handleFloatingResizePointerDown(event, direction)}
        />
      ))}
      <ConsolePanel
        surfaceMode="floating"
        onHeaderPointerDown={handleFloatingHeaderPointerDown}
        onClose={handleFloatingClose}
        onFloatToggle={handleFloatToggle}
        onPopoutToggle={handlePopoutToggle}
        onListToggle={handleListToggle}
      />
      <ConsoleBar
        surfaceMode="floating"
        showExpandToggle={false}
        inputRef={floatingInputRef}
        onSubmitCommand={handleSubmitCommand}
      />
    </div>
  ) : null

  const popoutSurface =
    windowMode === 'popout' && popoutHost !== null
      ? createPortal(
          <div
            className="ConsoleDock ConsoleDock--popoutSurface"
            style={sharedStyle}
            data-console-fill-mode={backgroundFillMode}
          >
            <ConsolePanel
              surfaceMode="popout"
              isVisible
              onClose={handlePopoutClose}
              onFloatToggle={handleFloatToggle}
              onPopoutToggle={handlePopoutToggle}
              onListToggle={handleListToggle}
            />
            <ConsoleBar
              surfaceMode="popout"
              showExpandToggle={false}
              inputRef={popoutInputRef}
              onSubmitCommand={handleSubmitCommand}
            />
          </div>,
          popoutHost,
        )
      : null

  const listSurface =
    isListMode ? (
      <div className={`ConsoleListOverlay ${windowMode === 'docked' && isExpanded ? 'isPanelOpen' : ''}`}>
      <div
        className="ConsoleListView"
        style={{ left: `${Math.max(0, Math.round(listLeftOffset))}px` }}
        aria-label="Console list view"
      >
        {visibleEntries.length === 0 ? (
          <div className="ConsoleListViewEmpty">Ready</div>
        ) : (
          visibleEntries.map((entry) => (
            <div
              key={entry.id}
              className={`ConsoleListViewLine layer-${entry.layer.toLowerCase()} severity-${entry.severity}`}
            >
              <span className="ConsoleListViewTimestamp">{entry.timestampLabel}</span>
              <span className="ConsoleListViewLayer">[{entry.layer}]</span>
              <span className="ConsoleListViewText">{entry.text}</span>
              {entry.source !== null ? (
                <span className="ConsoleListViewSource">{entry.source}</span>
              ) : null}
            </div>
          ))
        )}
      </div>
      </div>
    ) : null

  return (
    <>
      {listSurface}
      <div
        ref={dockRef}
        className={`ConsoleDock ${
          windowMode === 'floating'
            ? 'ConsoleDock--floatingOwner'
            : windowMode === 'popout'
              ? 'ConsoleDock--popoutOwner'
              : 'ConsoleDock--docked'
        }`}
        style={sharedStyle}
        data-console-fill-mode={backgroundFillMode}
      >
        {isExpanded && windowMode === 'docked' ? (
          <ConsolePanel
            surfaceMode="docked"
            isVisible
            onClose={isListMode ? handleListPanelClose : undefined}
            onFloatToggle={handleFloatToggle}
            onPopoutToggle={handlePopoutToggle}
            onListToggle={handleListToggle}
          />
        ) : null}
        {windowMode !== 'floating' ? (
          <ConsoleBar
            surfaceMode="docked"
            showExpandToggle
            inputRef={dockedInputRef}
            onSubmitCommand={handleSubmitCommand}
          />
        ) : null}
        {floatingWindow}
      </div>
      {popoutSurface}
    </>
  )
}
