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
  selectEditorViewportSelectedNodeId,
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
const minWindowSettingsHeight = 72
const defaultExpandedWindowSettingsHeight = 180

type SpaghettiEditorViewMode = 'expanded' | 'essentials' | 'collapsed'
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

type WindowSettingsSectionId = 'titlebar' | 'body' | 'text'

type SpaghettiPanelProps = {
  editorViewportId: string
  onActivateEditorContext?: (
    editorViewportId: string,
    target?: {
      graphDocumentId?: string | null
      nodeId?: string | null
      mode?: 'graph' | 'node'
    },
  ) => void
  activateOnPointerDownCapture?: boolean
  isEssentials?: boolean
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
  onActivateEditorContext,
  activateOnPointerDownCapture = false,
  isEssentials = false,
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
  const [windowSettingsHeight, setWindowSettingsHeight] = useState<number | null>(null)
  const [debugHeight, setDebugHeight] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<SpaghettiEditorViewMode>('expanded')
  const [newPartType, setNewPartType] = useState<PartNodeType>('Part/Baseplate')
  const [isWindowSettingsExpanded, setIsWindowSettingsExpanded] = useState(true)
  const [expandedWindowSettingsSections, setExpandedWindowSettingsSections] = useState<
    Record<WindowSettingsSectionId, boolean>
  >({
    titlebar: true,
    body: true,
    text: true,
  })
  const [fitNodeRequest, setFitNodeRequest] = useState<{ nodeId: string | null; key: number }>({
    nodeId: null,
    key: 0,
  })
  const [fitCanvasRequestKey, setFitCanvasRequestKey] = useState(0)
  const buildPolicy = useAppStore((state) => state.buildPolicy)
  const setSpaghettiGraph = useAppStore((state) => state.setSpaghettiGraph)
  const workspaceSelectedTarget = useAppStore((state) => state.workspaceSelection.selectedTarget)
  const workspaceActiveSurface = useAppStore((state) => state.workspaceSelection.activeSurface)
  const setWorkspaceSelectedTarget = useAppStore((state) => state.setWorkspaceSelectedTarget)
  const requestConsoleContextSync = useAppStore((state) => state.requestConsoleContextSync)
  const uiMessage = useSpaghettiStore((state) => state.uiMessage)
  const viewport = useSpaghettiStore((state) => selectEditorViewportById(state, editorViewportId))
  const activeEditorViewportId = useSpaghettiStore((state) => state.activeEditorViewportId)
  const graphDocumentsById = useSpaghettiStore((state) => state.graphDocumentsById)
  const graphDocumentOrder = useSpaghettiStore((state) => state.graphDocumentOrder)
  const graph = useSpaghettiStore((state) =>
    viewport === null ? null : selectGraphByDocumentId(state, viewport.graphDocumentId),
  )
  const selectedNodeId = useSpaghettiStore((state) =>
    selectEditorViewportSelectedNodeId(state, editorViewportId),
  )
  const setActiveEditorViewportId = useSpaghettiStore((state) => state.setActiveEditorViewportId)
  const createGraphDocument = useSpaghettiStore((state) => state.createGraphDocument)
  const bindEditorViewportToGraphDocument = useSpaghettiStore(
    (state) => state.bindEditorViewportToGraphDocument,
  )
  const applyGraphCommand = useSpaghettiStore((state) => state.applyGraphCommand)
  const addEditorViewportGraphToSharedViewerComposition = useSpaghettiStore(
    (state) => state.addEditorViewportGraphToSharedViewerComposition,
  )
  const removeEditorViewportGraphFromSharedViewerComposition = useSpaghettiStore(
    (state) => state.removeEditorViewportGraphFromSharedViewerComposition,
  )
  const sharedViewerComposition = useSpaghettiStore(selectSharedViewerComposition)
  const setEditorViewportSelectedNodeId = useSpaghettiStore(
    (state) => state.setEditorViewportSelectedNodeId,
  )
  const editorViewportNodeFitRequest = useSpaghettiStore((state) => state.editorViewportNodeFitRequest)
  const editorViewportCanvasFitRequest = useSpaghettiStore(
    (state) => state.editorViewportCanvasFitRequest,
  )
  const setUiMessage = useSpaghettiStore((state) => state.setUiMessage)
  const saveFocusedEditorViewportGraphToFile = useSpaghettiStore(
    (state) => state.saveFocusedEditorViewportGraphToFile,
  )
  const panelRef = useRef<HTMLElement | null>(null)
  const titleRef = useRef<HTMLDivElement | null>(null)
  const windowSettingsScrollRef = useRef<HTMLDivElement | null>(null)
  const toolbarScrollRef = useRef<HTMLDivElement | null>(null)
  const resizeStateRef = useRef<ResizeState | null>(null)
  const expandedWindowSettingsHeightRef = useRef<number | null>(null)
  const expandedToolbarHeightRef = useRef<number | null>(null)
  const lastHeaderToggleRevisionRef = useRef<number>(headerToggleRevision)
  const lastExternalFitRequestKeyRef = useRef<number>(-1)
  const isHeaderCollapsed = controlledHeaderCollapsed ?? false
  const getPanelWindow = useCallback(
    () => panelRef.current?.ownerDocument.defaultView ?? window,
    [],
  )
  const graphDocumentId = viewport?.graphDocumentId ?? null
  const isActiveEditorViewport = activeEditorViewportId === editorViewportId
  const spaghettiLastCompile = useSpaghettiStore((state) =>
    graphDocumentId === null ? null : selectGraphCompileResultByDocumentId(state, graphDocumentId),
  )
  const sortedNodes = useMemo(() => [...(graph?.nodes ?? [])].sort(compareNodes), [graph?.nodes])
  const activateEditorContext = useCallback(() => {
    if (viewport === null) {
      return
    }
    if (onActivateEditorContext !== undefined) {
      onActivateEditorContext(viewport.editorViewportId)
      return
    }
    setActiveEditorViewportId(viewport.editorViewportId)
  }, [onActivateEditorContext, setActiveEditorViewportId, viewport])
  const orderedGraphDocuments = useMemo(
    () =>
      graphDocumentOrder
        .map((nextGraphDocumentId) => graphDocumentsById[nextGraphDocumentId] ?? null)
        .filter((document) => document !== null),
    [graphDocumentOrder, graphDocumentsById],
  )
  const graphDocumentOptions = useMemo(
    () =>
      orderedGraphDocuments.map((document) => ({
        value: document.graphDocumentId,
        label: document.name,
      })),
    [orderedGraphDocuments],
  )
  const focusNodeOptions = useMemo(
    () =>
      sortedNodes.length === 0
        ? [{ value: '', label: 'No nodes' }]
        : sortedNodes.map((node) => ({
            value: node.nodeId,
            label: node.nodeId,
          })),
    [sortedNodes],
  )
  const availableNodeIds = useMemo(() => new Set(sortedNodes.map((node) => node.nodeId)), [sortedNodes])
  const [focusNodeId, setFocusNodeId] = useState<string | null>(selectedNodeId)

  const errors = spaghettiLastCompile?.diagnostics.errors ?? []
  const warnings = spaghettiLastCompile?.diagnostics.warnings ?? []
  const topoLength = spaghettiLastCompile?.evaluation?.topoOrder.length ?? 0
  const isGraphInSharedViewerComposition =
    graphDocumentId !== null &&
    (sharedViewerComposition?.graphDocumentIds.includes(graphDocumentId) ?? false)
  const sharedViewerCompositionSize = sharedViewerComposition?.graphDocumentIds.length ?? 0

  const toggleWindowSettingsExpanded = useCallback(() => {
    setIsWindowSettingsExpanded((current) => !current)
  }, [])

  const toggleWindowSettingsSection = useCallback((sectionId: WindowSettingsSectionId) => {
    setExpandedWindowSettingsSections((current) => ({
      ...current,
      [sectionId]: !current[sectionId],
    }))
  }, [])

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

  const getMaxWindowSettingsHeight = useCallback(() => {
    const panel = panelRef.current
    const windowSettingsScroll = windowSettingsScrollRef.current
    if (panel === null) {
      return defaultExpandedWindowSettingsHeight
    }

    const panelHeight = Math.round(panel.getBoundingClientRect().height)
    if (panelHeight <= 0) {
      return defaultExpandedWindowSettingsHeight
    }
    const windowSettingsCurrentHeight = Math.round(
      windowSettingsScroll?.getBoundingClientRect().height ??
        windowSettingsHeight ??
        defaultExpandedWindowSettingsHeight,
    )
    const headerShell = panel.querySelector<HTMLElement>('.SpaghettiPanelHeaderShell')
    const canvasResizeBar = panel.querySelector<HTMLElement>('.SpaghettiCanvasResizeBar')
    const debugResizeBar = panel.querySelector<HTMLElement>('.SpaghettiDebugResizeBar')
    const debugDrawer = panel.querySelector<HTMLElement>('.SpaghettiDebugDrawer')
    const fixedChromeHeight =
      Math.max(
        0,
        Math.round(headerShell?.getBoundingClientRect().height ?? 0) - windowSettingsCurrentHeight,
      ) +
      Math.round(canvasResizeBar?.getBoundingClientRect().height ?? 0) +
      Math.round(debugResizeBar?.getBoundingClientRect().height ?? 0) +
      Math.round(debugDrawer?.getBoundingClientRect().height ?? 0)

    return Math.max(
      minWindowSettingsHeight,
      panelHeight - fixedChromeHeight - minCanvasHeight,
    )
  }, [windowSettingsHeight])

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

  const clampWindowSettingsToAvailableSpace = useCallback(() => {
    if (!isWindowSettingsOpen || !isWindowSettingsExpanded) {
      return
    }
    const maxHeight = getMaxWindowSettingsHeight()
    setWindowSettingsHeight((current) => {
      const desiredHeight =
        expandedWindowSettingsHeightRef.current ??
        current ??
        defaultExpandedWindowSettingsHeight
      return Math.min(maxHeight, Math.max(minWindowSettingsHeight, desiredHeight))
    })
  }, [getMaxWindowSettingsHeight, isWindowSettingsExpanded, isWindowSettingsOpen])

  useEffect(() => {
    if (toolbarHeight === null) {
      return
    }

    const panelWindow = getPanelWindow()
    panelWindow.addEventListener('resize', clampToolbarToAvailableSpace)

    const observedPanel = panelRef.current
    let resizeObserver: ResizeObserver | null = null
    if (observedPanel !== null && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        clampToolbarToAvailableSpace()
      })
      resizeObserver.observe(observedPanel)
    }

    return () => {
      panelWindow.removeEventListener('resize', clampToolbarToAvailableSpace)
      resizeObserver?.disconnect()
    }
  }, [clampToolbarToAvailableSpace, getPanelWindow, toolbarHeight])

  useEffect(() => {
    if (windowSettingsHeight === null || !isWindowSettingsOpen || !isWindowSettingsExpanded) {
      return
    }

    const panelWindow = getPanelWindow()
    panelWindow.addEventListener('resize', clampWindowSettingsToAvailableSpace)

    const observedPanel = panelRef.current
    let resizeObserver: ResizeObserver | null = null
    if (observedPanel !== null && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        clampWindowSettingsToAvailableSpace()
      })
      resizeObserver.observe(observedPanel)
    }

    return () => {
      panelWindow.removeEventListener('resize', clampWindowSettingsToAvailableSpace)
      resizeObserver?.disconnect()
    }
  }, [
    clampWindowSettingsToAvailableSpace,
    getPanelWindow,
    isWindowSettingsExpanded,
    isWindowSettingsOpen,
    windowSettingsHeight,
  ])

  useEffect(() => {
    if (selectedNodeId === null) {
      setFocusNodeId(null)
      return
    }
    if (availableNodeIds.has(selectedNodeId)) {
      setFocusNodeId(selectedNodeId)
      return
    }
    setFocusNodeId(null)
  }, [availableNodeIds, selectedNodeId])

  useEffect(() => {
    if (
      onActivateEditorContext !== undefined ||
      graphDocumentId === null ||
      workspaceActiveSurface !== 'spaghetti' ||
      !isActiveEditorViewport
    ) {
      return
    }
    const nextTarget =
      selectedNodeId === null
        ? {
            kind: 'graph-document' as const,
            graphDocumentId,
          }
        : {
            kind: 'graph-node' as const,
            graphDocumentId,
            nodeId: selectedNodeId,
          }

    const isAlreadySynced =
      workspaceSelectedTarget?.kind === nextTarget.kind &&
      workspaceSelectedTarget.graphDocumentId === nextTarget.graphDocumentId &&
      (workspaceSelectedTarget.kind !== 'graph-node' ||
        workspaceSelectedTarget.nodeId === nextTarget.nodeId)

    if (isAlreadySynced) {
      return
    }

    setWorkspaceSelectedTarget(nextTarget)
    requestConsoleContextSync('target-selection')
  }, [
    graphDocumentId,
    isActiveEditorViewport,
    requestConsoleContextSync,
    selectedNodeId,
    setWorkspaceSelectedTarget,
    workspaceActiveSurface,
    workspaceSelectedTarget,
    onActivateEditorContext,
  ])

  useEffect(() => {
    if (editorViewportNodeFitRequest === null) {
      return
    }
    if (editorViewportNodeFitRequest.editorViewportId !== editorViewportId) {
      return
    }
    if (lastExternalFitRequestKeyRef.current === editorViewportNodeFitRequest.key) {
      return
    }
    lastExternalFitRequestKeyRef.current = editorViewportNodeFitRequest.key
    setFitNodeRequest({
      nodeId: editorViewportNodeFitRequest.nodeId,
      key: editorViewportNodeFitRequest.key,
    })
  }, [editorViewportId, editorViewportNodeFitRequest])

  useEffect(() => {
    if (editorViewportCanvasFitRequest == null) {
      return
    }
    if (editorViewportCanvasFitRequest.editorViewportId !== editorViewportId) {
      return
    }
    setFitCanvasRequestKey(editorViewportCanvasFitRequest.key)
  }, [editorViewportCanvasFitRequest, editorViewportId])

  useEffect(() => {
    if (focusNodeId !== null && availableNodeIds.has(focusNodeId)) {
      return
    }
    setFocusNodeId(null)
  }, [availableNodeIds, focusNodeId])

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

  useEffect(() => {
    if (!isWindowSettingsOpen || !isWindowSettingsExpanded) {
      return
    }

    const nextExpandedHeight =
      expandedWindowSettingsHeightRef.current ?? defaultExpandedWindowSettingsHeight
    expandedWindowSettingsHeightRef.current = nextExpandedHeight
    setWindowSettingsHeight(Math.min(nextExpandedHeight, getMaxWindowSettingsHeight()))
  }, [getMaxWindowSettingsHeight, isWindowSettingsExpanded, isWindowSettingsOpen])

  useEffect(() => {
    if (windowSettingsHeight === null) {
      return
    }
    clampToolbarToAvailableSpace()
  }, [clampToolbarToAvailableSpace, windowSettingsHeight])

  useEffect(() => {
    if (!isWindowSettingsOpen || !isWindowSettingsExpanded || toolbarHeight === null) {
      return
    }
    clampWindowSettingsToAvailableSpace()
  }, [
    clampWindowSettingsToAvailableSpace,
    isWindowSettingsExpanded,
    isWindowSettingsOpen,
    toolbarHeight,
  ])

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

    const panelWindow = getPanelWindow()
    const handlePointerUp = () => {
      resizeStateRef.current = null
      panelWindow.removeEventListener('pointermove', handlePointerMove)
      panelWindow.removeEventListener('pointerup', handlePointerUp)
    }

    panelWindow.addEventListener('pointermove', handlePointerMove)
    panelWindow.addEventListener('pointerup', handlePointerUp)
    event.preventDefault()
  }

  const handleResetHeight = () => {
    expandedToolbarHeightRef.current = defaultExpandedToolbarHeight
    setToolbarHeight(Math.min(defaultExpandedToolbarHeight, getMaxToolbarHeight()))
    onSetHeaderCollapsed?.(false)
  }

  const handleWindowSettingsResizeStart = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || !isWindowSettingsOpen || !isWindowSettingsExpanded) {
      return
    }

    const startHeight = Math.round(
      windowSettingsScrollRef.current?.getBoundingClientRect().height ??
        windowSettingsHeight ??
        defaultExpandedWindowSettingsHeight,
    )
    resizeStateRef.current = {
      startClientY: event.clientY,
      startHeight,
      maxHeight: getMaxWindowSettingsHeight(),
    }

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const resizeState = resizeStateRef.current
      if (resizeState === null) {
        return
      }
      const deltaY = moveEvent.clientY - resizeState.startClientY
      const nextHeight = Math.max(
        minWindowSettingsHeight,
        Math.min(resizeState.maxHeight, resizeState.startHeight + deltaY),
      )
      setWindowSettingsHeight(nextHeight)
      expandedWindowSettingsHeightRef.current = nextHeight
    }

    const panelWindow = getPanelWindow()
    const handlePointerUp = () => {
      resizeStateRef.current = null
      panelWindow.removeEventListener('pointermove', handlePointerMove)
      panelWindow.removeEventListener('pointerup', handlePointerUp)
    }

    panelWindow.addEventListener('pointermove', handlePointerMove)
    panelWindow.addEventListener('pointerup', handlePointerUp)
    event.preventDefault()
  }

  const handleResetWindowSettingsHeight = () => {
    expandedWindowSettingsHeightRef.current = defaultExpandedWindowSettingsHeight
    setWindowSettingsHeight(
      Math.min(defaultExpandedWindowSettingsHeight, getMaxWindowSettingsHeight()),
    )
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

    const panelWindow = getPanelWindow()
    const handlePointerUp = () => {
      resizeStateRef.current = null
      panelWindow.removeEventListener('pointermove', handlePointerMove)
      panelWindow.removeEventListener('pointerup', handlePointerUp)
    }

    panelWindow.addEventListener('pointermove', handlePointerMove)
    panelWindow.addEventListener('pointerup', handlePointerUp)
    event.preventDefault()
  }

  const handleResetDebugHeight = () => {
    setDebugHeight(null)
  }

  const handleSaveGraph = () => {
    if (viewport === null) {
      return
    }
    activateEditorContext()
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
    setEditorViewportSelectedNodeId(editorViewportId, nodeId)
    setFocusNodeId(nodeId)
    setUiMessage({
      level: 'info',
      text: `Added ${newPartType} node.`,
    })
  }

  const handleFocusNodeChange = (nextNodeId: string | null) => {
    if (viewport !== null && onActivateEditorContext !== undefined) {
      onActivateEditorContext(viewport.editorViewportId, {
        graphDocumentId,
        nodeId: nextNodeId,
        mode: nextNodeId === null ? 'graph' : 'node',
      })
    } else {
      activateEditorContext()
    }
    setFocusNodeId(nextNodeId)
    setEditorViewportSelectedNodeId(editorViewportId, nextNodeId)
    if (graphDocumentId !== null) {
      setWorkspaceSelectedTarget(
        nextNodeId === null
          ? {
              kind: 'graph-document',
              graphDocumentId,
            }
          : {
              kind: 'graph-node',
              graphDocumentId,
              nodeId: nextNodeId,
            },
      )
      if (onActivateEditorContext === undefined) {
        requestConsoleContextSync('target-selection')
      }
    }
    setFitNodeRequest((current) => ({
      nodeId: nextNodeId,
      key: current.key + 1,
    }))
  }

  const handleGraphChange = (nextGraphDocumentId: string) => {
    if (viewport === null || nextGraphDocumentId.length === 0) {
      return
    }
    if (onActivateEditorContext !== undefined) {
      onActivateEditorContext(viewport.editorViewportId, {
        graphDocumentId: nextGraphDocumentId,
        nodeId: null,
        mode: 'graph',
      })
    } else {
      activateEditorContext()
    }
    bindEditorViewportToGraphDocument(viewport.editorViewportId, nextGraphDocumentId)
  }

  const handleCreateGraph = () => {
    if (viewport === null) {
      return
    }
    const nextGraphDocumentId = createGraphDocument()
    if (onActivateEditorContext !== undefined) {
      onActivateEditorContext(viewport.editorViewportId, {
        graphDocumentId: nextGraphDocumentId,
        nodeId: null,
        mode: 'graph',
      })
    } else {
      activateEditorContext()
    }
    bindEditorViewportToGraphDocument(viewport.editorViewportId, nextGraphDocumentId)
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

  const windowSettingsScrollStyle: CSSProperties | undefined =
    !isWindowSettingsOpen || !isWindowSettingsExpanded || windowSettingsHeight === null
      ? undefined
      : {
          height: `${windowSettingsHeight}px`,
          minHeight: `${windowSettingsHeight}px`,
          maxHeight: `${windowSettingsHeight}px`,
          flex: `0 0 ${windowSettingsHeight}px`,
        }

  const debugDrawerStyle: CSSProperties | undefined =
    isDebugVisible
      ? {
          height: `${debugHeight ?? defaultDebugDrawerHeight}px`,
          flex: '0 0 auto',
        }
      : undefined
  const effectiveViewMode: SpaghettiEditorViewMode = isEssentials ? 'essentials' : viewMode

  return (
    <section
      ref={panelRef}
      className={`V15Panel SpaghettiPanelRoot ${isEssentials ? 'isEssentials' : ''}`}
      data-editor-viewport-id={editorViewportId}
      data-graph-document-id={graphDocumentId ?? ''}
      onPointerDownCapture={
        activateOnPointerDownCapture
          ? () => {
              activateEditorContext()
            }
          : undefined
      }
    >
      {!isEssentials ? (
        <div ref={titleRef} className="SpaghettiPanelHeaderShell">
        {isWindowSettingsOpen ? (
          <>
            <div className="SpaghettiPanelPinnedRow SpaghettiWindowSettingsSection">
              <div className="SpaghettiWindowSettingsHeader">
                <button
                  type="button"
                  className="SpaghettiWindowSettingsHeaderToggle"
                  aria-expanded={isWindowSettingsExpanded}
                  onClick={toggleWindowSettingsExpanded}
                >
                  <span className="SpaghettiWindowSettingsGroupChevron">
                    {isWindowSettingsExpanded ? '-' : '+'}
                  </span>
                  <span>Window Settings</span>
                </button>
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
              {isWindowSettingsExpanded ? (
                <div
                  ref={windowSettingsScrollRef}
                  className="SpaghettiWindowSettingsGroups"
                  style={windowSettingsScrollStyle}
                >
                <section
                  className={`SpaghettiWindowSettingsGroup ${
                    expandedWindowSettingsSections.titlebar ? 'isExpanded' : ''
                  }`}
                  aria-label="Title bar settings"
                  data-section-id="titlebar"
                >
                  <button
                    type="button"
                    className="SpaghettiWindowSettingsGroupToggle"
                    aria-expanded={expandedWindowSettingsSections.titlebar}
                    onClick={() => toggleWindowSettingsSection('titlebar')}
                  >
                    <span className="SpaghettiWindowSettingsGroupChevron">
                      {expandedWindowSettingsSections.titlebar ? '-' : '+'}
                    </span>
                    <span className="SpaghettiWindowSettingsGroupTitle">Title bar</span>
                  </button>
                  {expandedWindowSettingsSections.titlebar ? (
                    <div className="SpaghettiWindowSettingsGroupFields isExpanded">
                      <div className="SpaghettiWindowSettingsField">
                        <ParaSlider
                          label="Opacity"
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
                      <ParaSelect
                        label="Color"
                        value={windowAppearance.titlebarTint}
                        options={titlebarTintOptions}
                        menuMode="custom"
                        onChange={(nextValue) =>
                          onWindowAppearanceChange?.({
                            titlebarTint: nextValue as SpaghettiWindowAppearance['titlebarTint'],
                            })
                          }
                        />
                      </div>
                    </div>
                  ) : null}
                </section>
                <section
                  className={`SpaghettiWindowSettingsGroup ${
                    expandedWindowSettingsSections.body ? 'isExpanded' : ''
                  }`}
                  aria-label="Body settings"
                  data-section-id="body"
                >
                  <button
                    type="button"
                    className="SpaghettiWindowSettingsGroupToggle"
                    aria-expanded={expandedWindowSettingsSections.body}
                    onClick={() => toggleWindowSettingsSection('body')}
                  >
                    <span className="SpaghettiWindowSettingsGroupChevron">
                      {expandedWindowSettingsSections.body ? '-' : '+'}
                    </span>
                    <span className="SpaghettiWindowSettingsGroupTitle">Body</span>
                  </button>
                  {expandedWindowSettingsSections.body ? (
                    <div className="SpaghettiWindowSettingsGroupFields isExpanded">
                      <div className="SpaghettiWindowSettingsField">
                        <ParaSlider
                          label="Opacity"
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
                      <ParaSelect
                        label="Color"
                        value={windowAppearance.bodyTint}
                        options={bodyTintOptions}
                        menuMode="custom"
                        onChange={(nextValue) =>
                          onWindowAppearanceChange?.({
                            bodyTint: nextValue as SpaghettiWindowAppearance['bodyTint'],
                            })
                          }
                        />
                      </div>
                      <div className="SpaghettiWindowSettingsField">
                        <ParaSlider
                          label="Side Padding"
                          min={spaghettiWindowSliderBounds.min}
                          max={spaghettiWindowSliderBounds.max}
                          step={spaghettiWindowSliderBounds.step}
                          value={windowAppearance.bodyInsetX}
                          clampMin={windowAppearance.bodyInsetXClamp.min}
                          clampMax={windowAppearance.bodyInsetXClamp.max}
                          isEditingClamp={isClampEditing}
                          onChange={(nextValue) =>
                            onWindowAppearanceChange?.({ bodyInsetX: nextValue })
                          }
                          onClampChange={(nextRange) =>
                            onWindowAppearanceChange?.({ bodyInsetXClamp: nextRange })
                          }
                          formatValue={(nextValue) => `${Math.round(nextValue * 12)}px`}
                        />
                      </div>
                      <div className="SpaghettiWindowSettingsField">
                        <ParaSlider
                          label="Top Bottom Padding"
                          min={spaghettiWindowSliderBounds.min}
                          max={spaghettiWindowSliderBounds.max}
                          step={spaghettiWindowSliderBounds.step}
                          value={windowAppearance.bodyInsetY}
                          clampMin={windowAppearance.bodyInsetYClamp.min}
                          clampMax={windowAppearance.bodyInsetYClamp.max}
                          isEditingClamp={isClampEditing}
                          onChange={(nextValue) =>
                            onWindowAppearanceChange?.({ bodyInsetY: nextValue })
                          }
                          onClampChange={(nextRange) =>
                            onWindowAppearanceChange?.({ bodyInsetYClamp: nextRange })
                          }
                          formatValue={(nextValue) => `${Math.round(nextValue * 12)}px`}
                        />
                      </div>
                    </div>
                  ) : null}
                </section>
                <section
                  className={`SpaghettiWindowSettingsGroup ${
                    expandedWindowSettingsSections.text ? 'isExpanded' : ''
                  }`}
                  aria-label="Text settings"
                  data-section-id="text"
                >
                  <button
                    type="button"
                    className="SpaghettiWindowSettingsGroupToggle"
                    aria-expanded={expandedWindowSettingsSections.text}
                    onClick={() => toggleWindowSettingsSection('text')}
                  >
                    <span className="SpaghettiWindowSettingsGroupChevron">
                      {expandedWindowSettingsSections.text ? '-' : '+'}
                    </span>
                    <span className="SpaghettiWindowSettingsGroupTitle">Text</span>
                  </button>
                  {expandedWindowSettingsSections.text ? (
                    <div className="SpaghettiWindowSettingsGroupFields isExpanded">
                      <div className="SpaghettiWindowSettingsField">
                        <ParaSlider
                          label="Opacity"
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
                        label="Size"
                        value={windowAppearance.fontScale}
                        options={fontScaleOptions}
                        menuMode="custom"
                        onChange={(nextValue) =>
                          onWindowAppearanceChange?.({
                            fontScale: nextValue as SpaghettiWindowAppearance['fontScale'],
                          })
                        }
                      />
                    </div>
                    <div className="SpaghettiWindowSettingsField">
                      <ParaSelect
                        label="Type"
                        value={windowAppearance.fontFamily}
                        options={fontFamilyOptions}
                        menuMode="custom"
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
                        menuMode="custom"
                        onChange={(nextValue) =>
                          onWindowAppearanceChange?.({
                            paddingScale: nextValue as SpaghettiWindowAppearance['paddingScale'],
                          })
                        }
                      />
                    </div>
                  </div>
                ) : null}
              </section>
              </div>
            ) : null}
            </div>
            {isWindowSettingsExpanded ? (
              <button
                type="button"
                className="SpaghettiWindowSettingsResizeBar"
                onPointerDown={handleWindowSettingsResizeStart}
                onDoubleClick={handleResetWindowSettingsHeight}
                aria-label="Resize window settings area"
              >
                <span className="SpaghettiCanvasResizeGrip" />
              </button>
            ) : null}
          </>
        ) : null}
        <div className="SpaghettiPanelPinnedRow SpaghettiToolbarRow SpaghettiFocusRow">
          <div className="SpaghettiFocusPickerCell SpaghettiFocusPickerCell--graph">
            <ParaSelect
              label="Graph"
              value={graphDocumentId ?? ''}
              options={graphDocumentOptions}
              menuMode="custom"
              onChange={handleGraphChange}
              menuActions={[
                {
                  label: 'Add New Graph',
                  onSelect: handleCreateGraph,
                },
              ]}
            />
          </div>
          <div className="SpaghettiFocusPickerCell SpaghettiFocusPickerCell--node">
            <ParaSelect
              label="Focus Node"
              value={focusNodeId ?? ''}
              options={focusNodeOptions}
              menuMode="custom"
              onChange={(nextValue) => {
                const nextNodeId = nextValue.trim().length > 0 ? nextValue : null
                handleFocusNodeChange(nextNodeId)
              }}
            />
          </div>
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
      ) : null}

      {!isEssentials ? (
        <button
          type="button"
          className="SpaghettiCanvasResizeBar"
          onPointerDown={handleResizeStart}
          onDoubleClick={handleResetHeight}
          aria-label="Resize spaghetti editor area"
        >
          <span className="SpaghettiCanvasResizeGrip" />
        </button>
      ) : null}

      <div
        className={`SpaghettiPanelCanvasWrap ${isHeaderCollapsed ? 'isExpanded' : ''} ${
          isEssentials ? 'isEssentials' : ''
        }`}
      >
        <SpaghettiEditorBoundary>
          {graphDocumentId === null ? (
            <div className="V15Error">Viewport graph binding is missing.</div>
          ) : (
            <SpaghettiEditor
              editorViewportId={editorViewportId}
              graphDocumentId={graphDocumentId}
              viewMode={effectiveViewMode}
              focusNodeId={focusNodeId}
              fitCanvasRequestKey={fitCanvasRequestKey}
              fitNodeId={fitNodeRequest.nodeId}
              fitNodeRequestKey={fitNodeRequest.key}
              isMeatballView={viewport?.windowMode === 'meatball editor view'}
              isCanvasToolbarVisible={isCanvasToolbarVisible}
              onSetViewMode={setViewMode}
            />
          )}
        </SpaghettiEditorBoundary>
      </div>

      {!isEssentials && isDebugVisible ? (
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

      {!isEssentials ? (
        <DebugInspectorDrawer
          isOpen={isDebugVisible}
          onToggle={() => setIsDebugVisible((value) => !value)}
          style={debugDrawerStyle}
        />
      ) : null}
    </section>
  )
}
