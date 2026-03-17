import { type PointerEvent as ReactPointerEvent } from 'react'
import { ParaSlider } from '../components/ParaSlider'
import { ParaSelect } from '../components/ParaSelect'
import {
  getConsoleToolsPreset,
  CONSOLE_MAX_EXPANDED_HEIGHT,
  CONSOLE_LAYERS_IN_ORDER,
  isConsoleEntryVisible,
  useConsoleStore,
} from './useConsoleStore'

type ConsolePanelProps = {
  surfaceMode?: 'docked' | 'floating' | 'popout'
  isVisible?: boolean
  onHeaderPointerDown?: (event: ReactPointerEvent<HTMLDivElement>) => void
  onClose?: () => void
  onFloatToggle?: () => void
  onPopoutToggle?: () => void
  onListToggle?: () => void
}

export function ConsolePanel({
  surfaceMode = 'docked',
  isVisible,
  onHeaderPointerDown,
  onClose,
  onFloatToggle,
  onPopoutToggle,
  onListToggle,
}: ConsolePanelProps) {
  const isExpanded = useConsoleStore((state) => state.isExpanded)
  const windowMode = useConsoleStore((state) => state.windowMode)
  const isListMode = useConsoleStore((state) => state.isListMode)
  const expandedHeight = useConsoleStore((state) => state.expandedHeight)
  const isToolsOpen = useConsoleStore((state) => state.isToolsOpen)
  const isLayerToolbarVisible = useConsoleStore((state) => state.isLayerToolbarVisible)
  const isChromeHidden = useConsoleStore((state) => state.isChromeHidden)
  const backgroundOpacity = useConsoleStore((state) => state.backgroundOpacity)
  const textOpacity = useConsoleStore((state) => state.textOpacity)
  const fontSize = useConsoleStore((state) => state.fontSize)
  const zIndex = useConsoleStore((state) => state.zIndex)
  const backgroundFillMode = useConsoleStore((state) => state.backgroundFillMode)
  const backgroundColorMode = useConsoleStore((state) => state.backgroundColorMode)
  const entries = useConsoleStore((state) => state.entries)
  const visibleLayers = useConsoleStore((state) => state.visibleLayers)
  const filterMode = useConsoleStore((state) => state.filterMode)
  const isolatedLayer = useConsoleStore((state) => state.isolatedLayer)
  const subsetLayers = useConsoleStore((state) => state.subsetLayers)
  const isDiagnosticsPinned = useConsoleStore((state) => state.isDiagnosticsPinned)
  const toggleExpanded = useConsoleStore((state) => state.toggleExpanded)
  const toggleVisibleLayer = useConsoleStore((state) => state.toggleVisibleLayer)
  const setFilterMode = useConsoleStore((state) => state.setFilterMode)
  const setIsolatedLayer = useConsoleStore((state) => state.setIsolatedLayer)
  const toggleSubsetLayer = useConsoleStore((state) => state.toggleSubsetLayer)
  const setDiagnosticsPinned = useConsoleStore((state) => state.setDiagnosticsPinned)
  const setExpandedHeightFromDrag = useConsoleStore((state) => state.setExpandedHeightFromDrag)
  const setBackgroundOpacity = useConsoleStore((state) => state.setBackgroundOpacity)
  const setTextOpacity = useConsoleStore((state) => state.setTextOpacity)
  const setFontSize = useConsoleStore((state) => state.setFontSize)
  const setZIndex = useConsoleStore((state) => state.setZIndex)
  const setBackgroundFillMode = useConsoleStore((state) => state.setBackgroundFillMode)
  const setBackgroundColorMode = useConsoleStore((state) => state.setBackgroundColorMode)
  const applyToolsPreset = useConsoleStore((state) => state.applyToolsPreset)
  const setToolsOpen = useConsoleStore((state) => state.setToolsOpen)
  const setLayerToolbarVisible = useConsoleStore((state) => state.setLayerToolbarVisible)
  const setChromeHidden = useConsoleStore((state) => state.setChromeHidden)
  const visibleEntries = entries
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
    .reverse()
  const shouldShow = isVisible ?? (surfaceMode === 'docked' ? isExpanded : true)
  const toolsPreset = getConsoleToolsPreset({
    backgroundOpacity,
    textOpacity,
    fontSize,
    zIndex,
    backgroundFillMode,
    backgroundColorMode,
  })

  if (!shouldShow) {
    return null
  }

  const handleResizeStart = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (surfaceMode !== 'docked') {
      return
    }
    event.preventDefault()
    event.stopPropagation()
    const startY = event.clientY
    const startHeight = expandedHeight
    const move = (moveEvent: PointerEvent) => {
      const delta = startY - moveEvent.clientY
      const viewportHeight = typeof window === 'undefined' ? startHeight : window.innerHeight
      const nextHeight = Math.min(
        startHeight + delta,
        Math.min(CONSOLE_MAX_EXPANDED_HEIGHT, viewportHeight),
      )
      setExpandedHeightFromDrag(nextHeight)
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

  const stopHeaderDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <section
      className={`ConsolePanel ConsolePanel--${surfaceMode}`}
      style={surfaceMode === 'docked' ? { height: `${expandedHeight}px` } : undefined}
    >
      {isChromeHidden ? (
        <button
          type="button"
          className="ConsolePanelChromeToggle ConsolePanelChromeToggle--floating"
          aria-label="Show console chrome"
          title="Show console chrome"
          onClick={() => setChromeHidden(false)}
        >
          v
        </button>
      ) : null}
      <div
        className="ConsolePanelResizeHandle"
        onPointerDown={handleResizeStart}
        aria-hidden="true"
      />
      {!isChromeHidden ? (
        <div className="ConsolePanelHeader" onPointerDown={onHeaderPointerDown}>
          <span className="ConsolePanelTitle">Console</span>
          <div className="ConsolePanelActions">
            <button
              type="button"
              className={`ConsolePanelAction ConsolePanelAction--icon ${windowMode === 'floating' ? 'isActive' : ''}`}
              aria-label={windowMode === 'floating' ? 'Return console to docked mode' : 'Float console'}
              title={windowMode === 'floating' ? 'Return console to docked mode' : 'Float console'}
              onPointerDown={stopHeaderDrag}
              onClick={onFloatToggle}
            >
              □
            </button>
            <button
              type="button"
              className={`ConsolePanelAction ConsolePanelAction--icon ${windowMode === 'popout' ? 'isActive' : ''}`}
              aria-label={windowMode === 'popout' ? 'Return console from pop-out mode' : 'Pop out console'}
              title={windowMode === 'popout' ? 'Return console from pop-out mode' : 'Pop out console'}
              onPointerDown={stopHeaderDrag}
              onClick={onPopoutToggle}
            >
              ↗
            </button>
              <button
                type="button"
              className={`ConsolePanelAction ConsolePanelAction--icon ${isListMode ? 'isActive' : ''}`}
                aria-label="Show console list mode"
                title="Show console list mode"
                onPointerDown={stopHeaderDrag}
                onClick={onListToggle}
              >
              ≡
            </button>
            <button
              type="button"
              className="ConsolePanelAction ConsolePanelAction--icon ConsolePanelChromeToggle"
              aria-label="Hide console chrome"
              title="Hide console chrome"
              onPointerDown={stopHeaderDrag}
              onClick={() => setChromeHidden(true)}
            >
              ^
            </button>
            <button
              type="button"
              className={`ConsolePanelAction ConsolePanelAction--icon ${isToolsOpen ? 'isActive' : ''}`}
              aria-label={isToolsOpen ? 'Hide console tools' : 'Show console tools'}
              title={isToolsOpen ? 'Hide console tools' : 'Show console tools'}
              onPointerDown={stopHeaderDrag}
              onClick={() => setToolsOpen(!isToolsOpen)}
            >
              i
            </button>
            <button
              type="button"
              className={`ConsolePanelAction ConsolePanelAction--icon ${isLayerToolbarVisible ? 'isActive' : ''}`}
              aria-label={
                isLayerToolbarVisible ? 'Hide console layer toolbar' : 'Show console layer toolbar'
              }
              title={
                isLayerToolbarVisible ? 'Hide console layer toolbar' : 'Show console layer toolbar'
              }
              onPointerDown={stopHeaderDrag}
              onClick={() => setLayerToolbarVisible(!isLayerToolbarVisible)}
            >
              T
            </button>
            <button
              type="button"
              className="ConsolePanelAction"
              disabled
              aria-disabled="true"
              title="Clear is disabled for now"
              onPointerDown={stopHeaderDrag}
            >
              Clear
            </button>
            <button
              type="button"
              className="ConsolePanelAction"
              onPointerDown={stopHeaderDrag}
              onClick={onClose ?? toggleExpanded}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
      {!isChromeHidden && isToolsOpen ? (
        <div className="ConsoleToolbarMenu" aria-label="Console tools">
          <div className="ConsoleToolbarMenuTitle">Console Tools</div>
          <div className="ConsoleToolbarMenuBody">
            <div className="ConsoleToolbarMenuSliders">
              <ParaSelect
                label="Preset"
                value={toolsPreset}
                options={[
                  { value: 'default', label: 'Default' },
                  { value: 'clear', label: 'Clear' },
                  { value: 'custom', label: 'Custom' },
                ]}
                onChange={(value) => {
                  if (value === 'default' || value === 'clear') {
                    applyToolsPreset(value)
                  }
                }}
              />
              <ParaSlider
                label="BG Fill"
                value={backgroundOpacity}
                min={0}
                max={100}
                step={1}
                onChange={setBackgroundOpacity}
                formatValue={(value) => `${Math.round(value)}%`}
              />
              <ParaSlider
                label="Text"
                value={textOpacity}
                min={0}
                max={100}
                step={1}
                onChange={setTextOpacity}
                formatValue={(value) => `${Math.round(value)}%`}
              />
              <ParaSlider
                label="Font"
                value={fontSize}
                min={1}
                max={24}
                step={1}
                onChange={setFontSize}
                formatValue={(value) => `${Math.round(value)}px`}
              />
              <ParaSlider
                label="Z Index"
                value={zIndex}
                min={0}
                max={40}
                step={1}
                onChange={setZIndex}
                formatValue={(value) => `${Math.round(value)}`}
              />
              <ParaSelect
                label="Fill Type"
                value={backgroundFillMode}
                options={[
                  { value: 'blur', label: 'Blur' },
                  { value: 'flat', label: 'Flat' },
                  { value: 'clear', label: 'Clear' },
                ]}
                onChange={(value) =>
                  setBackgroundFillMode(value as 'blur' | 'flat' | 'clear')
                }
              />
              <ParaSelect
                label="BG Color"
                value={backgroundColorMode}
                options={[
                  { value: 'midnight', label: 'Midnight' },
                  { value: 'slate', label: 'Slate' },
                  { value: 'navy', label: 'Navy' },
                ]}
                onChange={(value) =>
                  setBackgroundColorMode(value as 'midnight' | 'slate' | 'navy')
                }
              />
            </div>
          </div>
        </div>
      ) : null}
      {!isChromeHidden && isLayerToolbarVisible ? (
        <div className="ConsoleLayerControls">
          <div className="ConsoleLayerFilterModes">
            <button
              type="button"
              className={`ConsoleLayerFilterButton ${filterMode === 'normal' ? 'isActive' : ''}`}
              onClick={() => setFilterMode('normal')}
            >
              Normal
            </button>
            <button
              type="button"
              className={`ConsoleLayerFilterButton ${filterMode === 'isolate' ? 'isActive' : ''}`}
              onClick={() => setFilterMode('isolate')}
            >
              Isolate
            </button>
            <button
              type="button"
              className={`ConsoleLayerFilterButton ${filterMode === 'subset' ? 'isActive' : ''}`}
              onClick={() => setFilterMode('subset')}
            >
              Subset
            </button>
            <button
              type="button"
              className={`ConsoleLayerFilterButton ${isDiagnosticsPinned ? 'isActive' : ''}`}
              onClick={() => setDiagnosticsPinned(!isDiagnosticsPinned)}
            >
              Diag Pin
            </button>
          </div>
        <div className="ConsoleLayerToggles">
          {CONSOLE_LAYERS_IN_ORDER.map((layer) => (
            <button
              key={layer}
              type="button"
              className={`ConsoleLayerToggle ${
                filterMode === 'isolate'
                  ? isolatedLayer === layer
                    ? 'isActive'
                    : ''
                  : filterMode === 'subset'
                    ? subsetLayers[layer]
                      ? 'isActive'
                      : ''
                    : visibleLayers[layer]
                      ? 'isActive'
                      : ''
              }`}
              onClick={() => {
                if (filterMode === 'isolate') {
                  setIsolatedLayer(layer)
                  return
                }
                if (filterMode === 'subset') {
                  toggleSubsetLayer(layer)
                  return
                }
                toggleVisibleLayer(layer)
              }}
            >
              {layer}
            </button>
          ))}
        </div>
        </div>
      ) : null}
      <div className="ConsoleTranscript" aria-label="Console transcript">
        {visibleEntries.length === 0 ? (
          <div className="ConsoleTranscriptEmpty">Ready</div>
        ) : (
          visibleEntries.map((entry) => (
            <div
              key={entry.id}
              className={`ConsoleTranscriptLine layer-${entry.layer.toLowerCase()} severity-${entry.severity}`}
            >
              <span className="ConsoleTranscriptTimestamp">{entry.timestampLabel}</span>
              <span className="ConsoleTranscriptLayer">[{entry.layer}]</span>
              <span className="ConsoleTranscriptText">{entry.text}</span>
              {entry.source !== null ? (
                <span className="ConsoleTranscriptSource">{entry.source}</span>
              ) : null}
            </div>
          ))
        )}
      </div>
    </section>
  )
}
