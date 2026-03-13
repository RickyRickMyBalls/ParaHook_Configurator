import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { addNode as addNodeCommand } from '../spaghetti/graphCommands'
import { getDefaultNodeParams, type NodeTypeId } from '../spaghetti/registry/nodeRegistry'
import type { SpaghettiNode } from '../spaghetti/schema/spaghettiTypes'
import {
  createValidBaseplateHeelKickGraph,
  createCycleGraph,
  createValidBaseplateGraph,
  createValidBaseplateToeHookGraph,
} from '../spaghetti/dev/sampleGraph'
import { DebugInspectorDrawer } from '../spaghetti/ui/DebugInspectorDrawer'
import { SpaghettiEditor } from '../spaghetti/ui/SpaghettiEditor'
import { SpaghettiEditorBoundary } from '../spaghetti/ui/SpaghettiEditorBoundary'
import {
  selectEditorViewportById,
  selectGraphByDocumentId,
  selectGraphCompileResultByDocumentId,
  selectSharedViewerComposition,
  useSpaghettiStore,
} from '../spaghetti/store/useSpaghettiStore'
import { useAppStore } from '../store/useAppStore'
import {
  defaultSpaghettiWindowAppearance,
  spaghettiWindowSliderBounds,
  type SpaghettiWindowAppearance,
} from './spaghettiWindowAppearance'
import { ParaSlider } from '../components/ParaSlider'
import { ParaSelect } from '../components/ParaSelect'

const describeDiagnosticContext = (diagnostic: {
  nodeId?: string
  edgeId?: string
}): string => {
  const refs: string[] = []
  if (diagnostic.nodeId !== undefined) {
    refs.push(`node:${diagnostic.nodeId}`)
  }
  if (diagnostic.edgeId !== undefined) {
    refs.push(`edge:${diagnostic.edgeId}`)
  }
  return refs.length > 0 ? ` (${refs.join(', ')})` : ''
}

const minCanvasHeight = 100
const minDebugDrawerHeight = 160
const defaultDebugDrawerHeight = 360
const collapsedToolbarHeight = 10
const defaultExpandedToolbarHeight = 150

type SpaghettiEditorViewMode = 'expanded' | 'collapsed'
type PartNodeType = Extract<NodeTypeId, 'Part/Baseplate' | 'Part/ToeHook' | 'Part/HeelKick'>

const compareNodes = (a: SpaghettiNode, b: SpaghettiNode): number =>
  a.nodeId.localeCompare(b.nodeId) || a.type.localeCompare(b.type)

const partTypeOptions: Array<{ value: PartNodeType; label: string }> = [
  { value: 'Part/Baseplate', label: 'Baseplate' },
  { value: 'Part/ToeHook', label: 'Toe Hook' },
  { value: 'Part/HeelKick', label: 'Heel Kick' },
]

const titlebarTintOptions: Array<{
  value: SpaghettiWindowAppearance['titlebarTint']
  label: string
}> = [
  { value: 'default', label: 'Default' },
  { value: 'slate', label: 'Slate' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'red', label: 'Red' },
]

const bodyTintOptions: Array<{
  value: SpaghettiWindowAppearance['bodyTint']
  label: string
}> = [
  { value: 'default', label: 'Default' },
  { value: 'cool-dark', label: 'Cool Dark' },
  { value: 'neutral-dark', label: 'Neutral Dark' },
  { value: 'glass-dark', label: 'Glass Dark' },
]

const fontScaleOptions: Array<{
  value: SpaghettiWindowAppearance['fontScale']
  label: string
}> = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Normal' },
  { value: 'lg', label: 'Large' },
]

const fontFamilyOptions: Array<{
  value: SpaghettiWindowAppearance['fontFamily']
  label: string
}> = [
  { value: 'default', label: 'Default' },
  { value: 'mono', label: 'Mono' },
  { value: 'serif', label: 'Serif' },
]

const paddingScaleOptions: Array<{
  value: SpaghettiWindowAppearance['paddingScale']
  label: string
}> = [
  { value: 'tight', label: 'Tight' },
  { value: 'normal', label: 'Normal' },
  { value: 'loose', label: 'Loose' },
]

const typeLegend: Array<{ type: string; colorToken: string; className: string }> = [
  { type: 'number', colorToken: '#ffffff', className: 'SpaghettiTypeSwatch--number' },
  { type: 'boolean', colorToken: '#f6d365', className: 'SpaghettiTypeSwatch--boolean' },
  { type: 'vec2', colorToken: '#38bdf8', className: 'SpaghettiTypeSwatch--vec2' },
  { type: 'vec3', colorToken: '#22d3ee', className: 'SpaghettiTypeSwatch--vec3' },
  { type: 'spline2', colorToken: '#ff4e4e', className: 'SpaghettiTypeSwatch--spline2' },
  { type: 'spline3', colorToken: '#fb7185', className: 'SpaghettiTypeSwatch--spline3' },
  { type: 'profileLoop', colorToken: '#34d399', className: 'SpaghettiTypeSwatch--profileLoop' },
  { type: 'stations', colorToken: '#a78bfa', className: 'SpaghettiTypeSwatch--stations' },
  { type: 'railMath', colorToken: '#9ca3af', className: 'SpaghettiTypeSwatch--railMath' },
  { type: 'toeLoft', colorToken: '#cbd5e1', className: 'SpaghettiTypeSwatch--toeLoft' },
]

let fallbackNodeCounter = 0

const createNodeId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `node-${crypto.randomUUID()}`
  }
  fallbackNodeCounter += 1
  return `node-fallback-${fallbackNodeCounter}`
}

type ResizeState = {
  startClientY: number
  startHeight: number
  maxHeight: number
}

type SpaghettiPanelProps = {
  editorViewportId: string
  isWindowSettingsOpen?: boolean
  isClampEditing?: boolean
  windowAppearance?: SpaghettiWindowAppearance
  onWindowAppearanceChange?: (patch: Partial<SpaghettiWindowAppearance>) => void
  onToggleClampEditing?: () => void
  onResetWindowAppearance?: () => void
  isHeaderCollapsed?: boolean
  isCanvasToolbarVisible?: boolean
  headerToggleRevision?: number
  onSetHeaderCollapsed?: (collapsed: boolean) => void
}

export function SpaghettiPanel({
  editorViewportId,
  isWindowSettingsOpen = false,
  isClampEditing = false,
  windowAppearance = defaultSpaghettiWindowAppearance,
  onWindowAppearanceChange,
  onToggleClampEditing,
  onResetWindowAppearance,
  isHeaderCollapsed: controlledHeaderCollapsed,
  isCanvasToolbarVisible = true,
  headerToggleRevision = 0,
  onSetHeaderCollapsed,
}: SpaghettiPanelProps) {
  const [isDebugVisible, setIsDebugVisible] = useState(false)
  const [toolbarHeight, setToolbarHeight] = useState<number | null>(null)
  const [debugHeight, setDebugHeight] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<SpaghettiEditorViewMode>('expanded')
  const [newPartType, setNewPartType] = useState<PartNodeType>('Part/Baseplate')
  const [fitNodeRequest, setFitNodeRequest] = useState<{ nodeId: string | null; key: number }>({
    nodeId: null,
    key: 0,
  })
  const buildPolicy = useAppStore((state) => state.buildPolicy)
  const setSpaghettiGraph = useAppStore((state) => state.setSpaghettiGraph)
  const uiMessage = useSpaghettiStore((state) => state.uiMessage)
  const viewport = useSpaghettiStore((state) => selectEditorViewportById(state, editorViewportId))
  const graph = useSpaghettiStore((state) =>
    viewport === null ? null : selectGraphByDocumentId(state, viewport.graphDocumentId),
  )
  const selectedNodeId = useSpaghettiStore((state) => state.selectedNodeId)
  const setActiveEditorViewportId = useSpaghettiStore((state) => state.setActiveEditorViewportId)
  const applyGraphCommand = useSpaghettiStore((state) => state.applyGraphCommand)
  const addEditorViewportGraphToSharedViewerComposition = useSpaghettiStore(
    (state) => state.addEditorViewportGraphToSharedViewerComposition,
  )
  const removeEditorViewportGraphFromSharedViewerComposition = useSpaghettiStore(
    (state) => state.removeEditorViewportGraphFromSharedViewerComposition,
  )
  const sharedViewerComposition = useSpaghettiStore(selectSharedViewerComposition)
  const setSelectedNodeId = useSpaghettiStore((state) => state.setSelectedNodeId)
  const setUiMessage = useSpaghettiStore((state) => state.setUiMessage)
  const saveFocusedEditorViewportGraphToFile = useSpaghettiStore(
    (state) => state.saveFocusedEditorViewportGraphToFile,
  )
  const panelRef = useRef<HTMLElement | null>(null)
  const titleRef = useRef<HTMLDivElement | null>(null)
  const toolbarScrollRef = useRef<HTMLDivElement | null>(null)
  const resizeStateRef = useRef<ResizeState | null>(null)
  const expandedToolbarHeightRef = useRef<number | null>(null)
  const lastHeaderToggleRevisionRef = useRef<number>(headerToggleRevision)
  const isHeaderCollapsed = controlledHeaderCollapsed ?? false
  const graphDocumentId = viewport?.graphDocumentId ?? null
  const spaghettiLastCompile = useSpaghettiStore((state) =>
    graphDocumentId === null ? null : selectGraphCompileResultByDocumentId(state, graphDocumentId),
  )
  const sortedNodes = useMemo(() => [...(graph?.nodes ?? [])].sort(compareNodes), [graph?.nodes])
  const availableNodeIds = useMemo(() => new Set(sortedNodes.map((node) => node.nodeId)), [sortedNodes])
  const [focusNodeId, setFocusNodeId] = useState<string | null>(selectedNodeId)

  const errors = spaghettiLastCompile?.diagnostics.errors ?? []
  const warnings = spaghettiLastCompile?.diagnostics.warnings ?? []
  const topoLength = spaghettiLastCompile?.evaluation?.topoOrder.length ?? 0
  const isGraphInSharedViewerComposition =
    graphDocumentId !== null &&
    (sharedViewerComposition?.graphDocumentIds.includes(graphDocumentId) ?? false)
  const sharedViewerCompositionSize = sharedViewerComposition?.graphDocumentIds.length ?? 0

  const getMaxToolbarHeight = useCallback(() => {
    const panel = panelRef.current
    const toolbar = toolbarScrollRef.current
    if (panel === null) {
      return defaultExpandedToolbarHeight
    }

    const panelHeight = Math.round(panel.getBoundingClientRect().height)
    if (panelHeight <= 0) {
      return defaultExpandedToolbarHeight
    }
    const toolbarCurrentHeight = Math.round(
      toolbar?.getBoundingClientRect().height ?? toolbarHeight ?? defaultExpandedToolbarHeight,
    )
    const headerShell = panel.querySelector<HTMLElement>('.SpaghettiPanelHeaderShell')
    const canvasResizeBar = panel.querySelector<HTMLElement>('.SpaghettiCanvasResizeBar')
    const debugResizeBar = panel.querySelector<HTMLElement>('.SpaghettiDebugResizeBar')
    const debugDrawer = panel.querySelector<HTMLElement>('.SpaghettiDebugDrawer')
    const fixedChromeHeight =
      Math.max(0, Math.round(headerShell?.getBoundingClientRect().height ?? 0) - toolbarCurrentHeight) +
      Math.round(canvasResizeBar?.getBoundingClientRect().height ?? 0) +
      Math.round(debugResizeBar?.getBoundingClientRect().height ?? 0) +
      Math.round(debugDrawer?.getBoundingClientRect().height ?? 0)

    return Math.max(
      collapsedToolbarHeight,
      panelHeight - fixedChromeHeight - minCanvasHeight,
    )
  }, [toolbarHeight])

  const clampToolbarToAvailableSpace = useCallback(() => {
    const maxHeight = getMaxToolbarHeight()
    setToolbarHeight((current) => {
      const desiredHeight = expandedToolbarHeightRef.current ?? current ?? defaultExpandedToolbarHeight
      if (isHeaderCollapsed) {
        return collapsedToolbarHeight
      }
      return Math.min(maxHeight, Math.max(collapsedToolbarHeight, desiredHeight))
    })
  }, [getMaxToolbarHeight, isHeaderCollapsed])

  useEffect(() => {
    if (toolbarHeight === null) {
      return
    }

    window.addEventListener('resize', clampToolbarToAvailableSpace)

    const observedPanel = panelRef.current
    let resizeObserver: ResizeObserver | null = null
    if (observedPanel !== null && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        clampToolbarToAvailableSpace()
      })
      resizeObserver.observe(observedPanel)
    }

    return () => {
      window.removeEventListener('resize', clampToolbarToAvailableSpace)
      resizeObserver?.disconnect()
    }
  }, [clampToolbarToAvailableSpace, toolbarHeight])

  useEffect(() => {
    if (selectedNodeId !== null && availableNodeIds.has(selectedNodeId)) {
      setFocusNodeId(selectedNodeId)
    }
  }, [availableNodeIds, selectedNodeId])

  useEffect(() => {
    if (focusNodeId !== null && availableNodeIds.has(focusNodeId)) {
      return
    }
    setFocusNodeId(sortedNodes[0]?.nodeId ?? null)
  }, [availableNodeIds, focusNodeId, sortedNodes])

  useEffect(() => {
    const toolbar = toolbarScrollRef.current
    if (toolbar === null) {
      return
    }

    const headerToggleTriggered = headerToggleRevision !== lastHeaderToggleRevisionRef.current
    lastHeaderToggleRevisionRef.current = headerToggleRevision

    if (isHeaderCollapsed) {
      const measuredHeight = Math.round(toolbar.getBoundingClientRect().height)
      if (measuredHeight > collapsedToolbarHeight) {
        expandedToolbarHeightRef.current = measuredHeight
      }
      setToolbarHeight(collapsedToolbarHeight)
      return
    }

    if (headerToggleTriggered) {
      expandedToolbarHeightRef.current = defaultExpandedToolbarHeight
      setToolbarHeight(Math.min(defaultExpandedToolbarHeight, getMaxToolbarHeight()))
      return
    }

    const nextExpandedHeight = expandedToolbarHeightRef.current ?? defaultExpandedToolbarHeight
    expandedToolbarHeightRef.current = nextExpandedHeight
    setToolbarHeight(Math.min(nextExpandedHeight, getMaxToolbarHeight()))
  }, [getMaxToolbarHeight, headerToggleRevision, isHeaderCollapsed])

  const handleResizeStart = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) {
      return
    }
    const panel = panelRef.current
    const toolbar = toolbarScrollRef.current
    if (panel === null) {
      return
    }

    const startHeight = Math.round(toolbar?.getBoundingClientRect().height ?? 0)
    resizeStateRef.current = {
      startClientY: event.clientY,
      startHeight,
      maxHeight: getMaxToolbarHeight(),
    }

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const resizeState = resizeStateRef.current
      if (resizeState === null) {
        return
      }
      const deltaY = moveEvent.clientY - resizeState.startClientY
      const nextHeight = Math.max(
        collapsedToolbarHeight,
        Math.min(resizeState.maxHeight, resizeState.startHeight + deltaY),
      )
      setToolbarHeight(nextHeight)
      if (nextHeight <= collapsedToolbarHeight) {
        onSetHeaderCollapsed?.(true)
        return
      }
      expandedToolbarHeightRef.current = nextHeight
      onSetHeaderCollapsed?.(false)
    }

    const handlePointerUp = () => {
      resizeStateRef.current = null
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    event.preventDefault()
  }

  const handleResetHeight = () => {
    expandedToolbarHeightRef.current = defaultExpandedToolbarHeight
    setToolbarHeight(Math.min(defaultExpandedToolbarHeight, getMaxToolbarHeight()))
    onSetHeaderCollapsed?.(false)
  }

  const handleDebugResizeStart = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || !isDebugVisible) {
      return
    }
    const panel = panelRef.current
    if (panel === null) {
      return
    }

    const canvasWrap = panel.querySelector<HTMLElement>('.SpaghettiPanelCanvasWrap')
    const debugDrawer = panel.querySelector<HTMLElement>('.SpaghettiDebugDrawer')
    if (canvasWrap === null || debugDrawer === null) {
      return
    }

    const startHeight = Math.round(debugDrawer.getBoundingClientRect().height)
    const canvasCurrentHeight = Math.round(canvasWrap.getBoundingClientRect().height)
    resizeStateRef.current = {
      startClientY: event.clientY,
      startHeight,
      maxHeight: Math.max(
        minDebugDrawerHeight,
        startHeight + Math.max(0, canvasCurrentHeight - minCanvasHeight),
      ),
    }

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const resizeState = resizeStateRef.current
      if (resizeState === null) {
        return
      }
      const deltaY = moveEvent.clientY - resizeState.startClientY
      const nextHeight = Math.max(
        minDebugDrawerHeight,
        Math.min(resizeState.maxHeight, resizeState.startHeight - deltaY),
      )
      setDebugHeight(nextHeight)
    }

    const handlePointerUp = () => {
      resizeStateRef.current = null
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    event.preventDefault()
  }

  const handleResetDebugHeight = () => {
    setDebugHeight(null)
  }

  const handleSaveGraph = () => {
    if (viewport === null) {
      return
    }
    setActiveEditorViewportId(viewport.editorViewportId)
    void saveFocusedEditorViewportGraphToFile().catch((error: unknown) => {
      console.error('Failed to save focused editor graph.', error)
    })
  }

  const handleAddToSharedViewer = () => {
    addEditorViewportGraphToSharedViewerComposition(editorViewportId)
  }

  const handleRemoveFromSharedViewer = () => {
    removeEditorViewportGraphFromSharedViewerComposition(editorViewportId)
  }

  const handleAddPartNode = () => {
    if (graph === null) {
      return
    }
    const nodeId = createNodeId()
    applyGraphCommand(
      addNodeCommand({
        node: {
          nodeId,
          type: newPartType,
          params: getDefaultNodeParams(newPartType),
        },
      }),
    )
    setSelectedNodeId(nodeId)
    setFocusNodeId(nodeId)
    setUiMessage({
      level: 'info',
      text: `Added ${newPartType} node.`,
    })
  }

  const handleCycleFocusNode = (direction: -1 | 1) => {
    if (sortedNodes.length === 0) {
      return
    }
    const currentIndex = focusNodeId === null ? -1 : sortedNodes.findIndex((node) => node.nodeId === focusNodeId)
    const baseIndex = currentIndex < 0 ? 0 : currentIndex
    const nextIndex = (baseIndex + direction + sortedNodes.length) % sortedNodes.length
    const nextNodeId = sortedNodes[nextIndex]?.nodeId ?? null
    setFocusNodeId(nextNodeId)
    setSelectedNodeId(nextNodeId)
    setFitNodeRequest((current) => ({
      nodeId: nextNodeId,
      key: current.key + 1,
    }))
  }

  const toolbarScrollStyle: CSSProperties | undefined =
    toolbarHeight === null
      ? undefined
      : {
          height: `${toolbarHeight}px`,
          minHeight: `${toolbarHeight}px`,
          maxHeight: `${toolbarHeight}px`,
          flex: `0 0 ${toolbarHeight}px`,
        }

  const debugDrawerStyle: CSSProperties | undefined =
    isDebugVisible
      ? {
          height: `${debugHeight ?? defaultDebugDrawerHeight}px`,
          flex: '0 0 auto',
        }
      : undefined

  return (
    <section
      ref={panelRef}
      className="V15Panel SpaghettiPanelRoot"
      data-editor-viewport-id={editorViewportId}
      data-graph-document-id={graphDocumentId ?? ''}
    >
      <div ref={titleRef} className="SpaghettiPanelHeaderShell">
        {isWindowSettingsOpen ? (
          <div className="SpaghettiPanelPinnedRow SpaghettiWindowSettingsSection">
            <div className="SpaghettiWindowSettingsHeader">
              <span>Window Settings</span>
              <div className="SpaghettiWindowSettingsActions">
                <button
                  type="button"
                  className={`SpaghettiWindowSettingsClampToggle ${
                    isClampEditing ? 'isActive' : ''
                  }`}
                  onClick={() => onToggleClampEditing?.()}
                >
                  {isClampEditing ? 'Done Clamp' : 'Edit Clamp'}
                </button>
                <button
                  type="button"
                  className="SpaghettiWindowSettingsReset"
                  onClick={() => onResetWindowAppearance?.()}
                >
                  Reset Window Style
                </button>
              </div>
            </div>
            <div className="SpaghettiWindowSettingsGrid">
              <div className="SpaghettiWindowSettingsField">
                <ParaSlider
                  label="Title Bar"
                  min={spaghettiWindowSliderBounds.min}
                  max={spaghettiWindowSliderBounds.max}
                  step={spaghettiWindowSliderBounds.step}
                  value={windowAppearance.titlebarOpacity}
                  clampMin={windowAppearance.titlebarClamp.min}
                  clampMax={windowAppearance.titlebarClamp.max}
                  isEditingClamp={isClampEditing}
                  onChange={(nextValue) =>
                    onWindowAppearanceChange?.({ titlebarOpacity: nextValue })
                  }
                  onClampChange={(nextRange) =>
                    onWindowAppearanceChange?.({ titlebarClamp: nextRange })
                  }
                  formatValue={(nextValue) => `${Math.round(nextValue * 100)}%`}
                />
              </div>
              <div className="SpaghettiWindowSettingsField">
                <ParaSlider
                  label="Window Fill"
                  min={spaghettiWindowSliderBounds.min}
                  max={spaghettiWindowSliderBounds.max}
                  step={spaghettiWindowSliderBounds.step}
                  value={windowAppearance.windowOpacity}
                  clampMin={windowAppearance.windowClamp.min}
                  clampMax={windowAppearance.windowClamp.max}
                  isEditingClamp={isClampEditing}
                  onChange={(nextValue) =>
                    onWindowAppearanceChange?.({ windowOpacity: nextValue })
                  }
                  onClampChange={(nextRange) =>
                    onWindowAppearanceChange?.({ windowClamp: nextRange })
                  }
                  formatValue={(nextValue) => `${Math.round(nextValue * 100)}%`}
                />
              </div>
              <div className="SpaghettiWindowSettingsField">
                <ParaSlider
                  label="Graph Content"
                  min={spaghettiWindowSliderBounds.min}
                  max={spaghettiWindowSliderBounds.max}
                  step={spaghettiWindowSliderBounds.step}
                  value={windowAppearance.graphContentOpacity}
                  clampMin={windowAppearance.graphContentClamp.min}
                  clampMax={windowAppearance.graphContentClamp.max}
                  isEditingClamp={isClampEditing}
                  onChange={(nextValue) =>
                    onWindowAppearanceChange?.({ graphContentOpacity: nextValue })
                  }
                  onClampChange={(nextRange) =>
                    onWindowAppearanceChange?.({ graphContentClamp: nextRange })
                  }
                  formatValue={(nextValue) => `${Math.round(nextValue * 100)}%`}
                />
              </div>
              <div className="SpaghettiWindowSettingsField">
                <ParaSelect
                  label="Title Bar Color"
                  value={windowAppearance.titlebarTint}
                  options={titlebarTintOptions}
                  onChange={(nextValue) =>
                    onWindowAppearanceChange?.({
                      titlebarTint: nextValue as SpaghettiWindowAppearance['titlebarTint'],
                    })
                  }
                />
              </div>
              <div className="SpaghettiWindowSettingsField">
                <ParaSelect
                  label="Body Color"
                  value={windowAppearance.bodyTint}
                  options={bodyTintOptions}
                  onChange={(nextValue) =>
                    onWindowAppearanceChange?.({
                      bodyTint: nextValue as SpaghettiWindowAppearance['bodyTint'],
                    })
                  }
                />
              </div>
              <div className="SpaghettiWindowSettingsField">
                <ParaSelect
                  label="Font Size"
                  value={windowAppearance.fontScale}
                  options={fontScaleOptions}
                  onChange={(nextValue) =>
                    onWindowAppearanceChange?.({
                      fontScale: nextValue as SpaghettiWindowAppearance['fontScale'],
                    })
                  }
                />
              </div>
              <div className="SpaghettiWindowSettingsField">
                <ParaSelect
                  label="Font Type"
                  value={windowAppearance.fontFamily}
                  options={fontFamilyOptions}
                  onChange={(nextValue) =>
                    onWindowAppearanceChange?.({
                      fontFamily: nextValue as SpaghettiWindowAppearance['fontFamily'],
                    })
                  }
                />
              </div>
              <div className="SpaghettiWindowSettingsField">
                <ParaSelect
                  label="Padding"
                  value={windowAppearance.paddingScale}
                  options={paddingScaleOptions}
                  onChange={(nextValue) =>
                    onWindowAppearanceChange?.({
                      paddingScale: nextValue as SpaghettiWindowAppearance['paddingScale'],
                    })
                  }
                />
              </div>
            </div>
          </div>
        ) : null}
        <div className="SpaghettiPanelPinnedRow SpaghettiToolbarRow SpaghettiFocusRow">
          <label className="SpaghettiEditorFocusField">
            <span>Focus Node</span>
            <div className="SpaghettiFocusNodeControls">
              <button
                type="button"
                className="SpaghettiFocusNodeCycle"
                onClick={() => handleCycleFocusNode(-1)}
                disabled={sortedNodes.length === 0}
                aria-label="Focus previous node"
                title="Focus previous node"
              >
                {'<'}
              </button>
              <button
                type="button"
                className="SpaghettiFocusNodeCycle"
                onClick={() => handleCycleFocusNode(1)}
                disabled={sortedNodes.length === 0}
                aria-label="Focus next node"
                title="Focus next node"
              >
                {'>'}
              </button>
            </div>
            <select
              value={focusNodeId ?? ''}
              onChange={(event) => {
                const next = event.target.value.trim()
                const nextNodeId = next.length > 0 ? next : null
                setFocusNodeId(nextNodeId)
                setSelectedNodeId(nextNodeId)
              }}
            >
              {sortedNodes.length === 0 ? (
                <option value="">No nodes</option>
              ) : (
                sortedNodes.map((node) => (
                  <option key={node.nodeId} value={node.nodeId}>
                    {node.nodeId}
                  </option>
                ))
              )}
            </select>
          </label>
        </div>
        <div
          ref={toolbarScrollRef}
          className={`SpaghettiPanelHeaderBlock ${isHeaderCollapsed ? 'isCollapsed' : ''}`}
          style={toolbarScrollStyle}
        >
          <div
            className={`SpaghettiPanelHeaderScroll ${isHeaderCollapsed ? 'isCollapsed' : ''}`}
          >
            <details className="SpaghettiToolbarSection">
              <summary className="SpaghettiToolbarSectionSummary">Part Nodes</summary>
              <div className="SpaghettiToolbarSectionBody">
                <div className="SpaghettiPanelToolbarGroup">
                  <label className="SpaghettiEditorFocusField">
                    <span>New Part Node</span>
                    <select
                      value={newPartType}
                      onChange={(event) => setNewPartType(event.target.value as PartNodeType)}
                    >
                      {partTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button type="button" onClick={handleAddPartNode} disabled={graph === null}>
                    Add Part Node
                  </button>
                </div>
              </div>
            </details>

            <details className="SpaghettiToolbarSection">
              <summary className="SpaghettiToolbarSectionSummary">Type Legend</summary>
              <div className="SpaghettiToolbarSectionBody">
                <div className="SpaghettiTypeLegend">
                  {typeLegend.map((item) => (
                    <div key={item.type} className="SpaghettiTypeLegendItem">
                      <span className={`SpaghettiTypeSwatch ${item.className}`} />
                      <span>{item.type}</span>
                      <span className="SpaghettiTypeLegendHex">{item.colorToken}</span>
                    </div>
                  ))}
                </div>
              </div>
            </details>

            <details className="SpaghettiHelpDetails">
              <summary className="SpaghettiHelpSummary">How To Use Spaghetti Editor</summary>
              <div className="SpaghettiHelpBody">
                <div className="V15Meta">
                  1. Load a sample graph or use Add Part Node in the editor header.
                </div>
                <div className="V15Meta">
                  2. Drag nodes by clicking and dragging the node card.
                </div>
                <div className="V15Meta">
                  3. Make wires by dragging from a right-side output port circle to a left-side input port circle.
                </div>
                <div className="V15Meta">
                  4. Delete a wire by clicking it, then press Delete/Backspace or use Delete Selected Edge.
                </div>
                <div className="V15Meta">
                  5. Rewire quickly: click a connected input anchor to detach and drag that wire to a new input.
                </div>
                <div className="V15Meta">
                  6. Use the square build icon to compile the graph and build it when validation passes.
                </div>
                <div className="V15Meta">
                  7. Review diagnostics below if the build icon does not complete successfully.
                </div>
              </div>
            </details>

            <details className="SpaghettiToolbarSection">
              <summary className="SpaghettiToolbarSectionSummary">Samples</summary>
              <div className="SpaghettiToolbarSectionBody">
                <div className="V15Wrap">
                  <button type="button" onClick={() => setSpaghettiGraph(createValidBaseplateGraph())}>
                    Load Baseplate
                  </button>
                  <button
                    type="button"
                    onClick={() => setSpaghettiGraph(createValidBaseplateToeHookGraph())}
                  >
                    Load Baseplate - ToeHook
                  </button>
                  <button
                    type="button"
                    onClick={() => setSpaghettiGraph(createValidBaseplateHeelKickGraph())}
                  >
                    Load Baseplate - HeelKick
                  </button>
                  <button type="button" onClick={() => setSpaghettiGraph(createCycleGraph())}>
                    Load Cycle
                  </button>
                </div>
              </div>
            </details>

            <details className="SpaghettiToolbarSection">
              <summary className="SpaghettiToolbarSectionSummary">Build</summary>
              <div className="SpaghettiToolbarSectionBody">
                <div className="V15Wrap">
                  <button type="button" onClick={handleSaveGraph} disabled={graphDocumentId === null}>
                    Save Graph
                  </button>
                </div>
              </div>
            </details>

            <details className="SpaghettiToolbarSection">
              <summary className="SpaghettiToolbarSectionSummary">Viewer</summary>
              <div className="SpaghettiToolbarSectionBody">
                <div className="V15Wrap">
                  <button
                    type="button"
                    onClick={handleAddToSharedViewer}
                    disabled={graphDocumentId === null || isGraphInSharedViewerComposition}
                  >
                    Add To Shared Viewer
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveFromSharedViewer}
                    disabled={graphDocumentId === null || !isGraphInSharedViewerComposition}
                  >
                    Remove From Shared Viewer
                  </button>
                </div>
                <div className="V15Meta">
                  Shared viewer composition:{' '}
                  {sharedViewerComposition === null
                    ? 'Off'
                    : `${sharedViewerCompositionSize} graph(s); current graph ${
                        isGraphInSharedViewerComposition ? 'included' : 'not included'
                      }`}
                </div>
              </div>
            </details>

            <details className="SpaghettiToolbarSection">
              <summary className="SpaghettiToolbarSectionSummary">Diagnostics</summary>
              <div className="SpaghettiToolbarSectionBody">
                <div className="V15Meta">
                  Status:{' '}
                  {spaghettiLastCompile === null
                    ? 'Not compiled'
                    : spaghettiLastCompile.ok
                      ? 'OK'
                      : 'Errors'}
                </div>
                <div className="V15Meta">Build policy: {buildPolicy} (manual compile/build in S3)</div>
                <div className="V15Meta">Topo order length: {topoLength}</div>
                <div className="V15Meta">
                  Diagnostics: {errors.length} error(s), {warnings.length} warning(s)
                </div>

                {uiMessage !== null ? (
                  <div className={uiMessage.level === 'error' ? 'V15Error' : 'V15Meta'}>
                    {uiMessage.text}
                  </div>
                ) : null}

                {errors.length > 0 ? (
                  <div className="V15SectionLabel">
                    Errors
                    <div className="ItemList">
                      {errors.map((diagnostic, index) => (
                        <div key={`${diagnostic.code}-${index}`} className="V15Error">
                          {diagnostic.code}: {diagnostic.message}
                          {describeDiagnosticContext(diagnostic)}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {warnings.length > 0 ? (
                  <div className="V15SectionLabel">
                    Warnings
                    <div className="ItemList">
                      {warnings.map((diagnostic, index) => (
                        <div key={`${diagnostic.code}-${index}`} className="V15Meta">
                          {diagnostic.code}: {diagnostic.message}
                          {describeDiagnosticContext(diagnostic)}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </details>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="SpaghettiCanvasResizeBar"
        onPointerDown={handleResizeStart}
        onDoubleClick={handleResetHeight}
        aria-label="Resize spaghetti editor area"
      >
        <span className="SpaghettiCanvasResizeGrip" />
      </button>

      <div
        className={`SpaghettiPanelCanvasWrap ${isHeaderCollapsed ? 'isExpanded' : ''}`}
      >
        <SpaghettiEditorBoundary>
          {graphDocumentId === null ? (
            <div className="V15Error">Viewport graph binding is missing.</div>
          ) : (
            <SpaghettiEditor
              graphDocumentId={graphDocumentId}
              viewMode={viewMode}
              focusNodeId={focusNodeId}
              fitNodeId={fitNodeRequest.nodeId}
              fitNodeRequestKey={fitNodeRequest.key}
              isMeatballView={viewport?.windowMode === 'meatball editor view'}
              isCanvasToolbarVisible={isCanvasToolbarVisible}
              onSetViewMode={setViewMode}
            />
          )}
        </SpaghettiEditorBoundary>
      </div>

      {isDebugVisible ? (
        <button
          type="button"
          className="SpaghettiCanvasResizeBar SpaghettiDebugResizeBar"
          onPointerDown={handleDebugResizeStart}
          onDoubleClick={handleResetDebugHeight}
          aria-label="Resize debug inspector area"
        >
          <span className="SpaghettiCanvasResizeGrip" />
        </button>
      ) : null}

      <DebugInspectorDrawer
        isOpen={isDebugVisible}
        onToggle={() => setIsDebugVisible((value) => !value)}
        style={debugDrawerStyle}
      />
    </section>
  )
}
