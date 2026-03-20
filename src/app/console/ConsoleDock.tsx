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
import { isEditableTarget, routeKeyboardInput } from '../inputRouting'
import { DEFAULT_REFERENCE_ROTATE_SNAP } from '../references/referenceTimeline'
import { getViewer } from '../viewerBridge'
import { useAppStore } from '../store/useAppStore'
import {
  activateGraphDocumentIntent,
  activateGraphNodeIntent,
  selectTargetIntent,
  startSketchDrawIntent,
  startSketchPlaneIntent,
  type WorkspaceIntentDeps,
} from '../store/workspaceIntents'
import { addNode as addNodeCommand, removeNode as removeNodeCommand } from '../spaghetti/graphCommands'
import { getDefaultNodeParams } from '../spaghetti/registry/nodeRegistry'
import type {
  EditorViewportWindowMode,
  GraphNodePos,
  SpaghettiGraph,
} from '../spaghetti/schema/spaghettiTypes'
import {
  type GeometrySketchDrawStage,
  selectGraphDocumentById,
  selectOrderedGraphDocuments,
  useSpaghettiStore,
} from '../spaghetti/store/useSpaghettiStore'
import { ConsoleBar } from './ConsoleBar'
import { ConsolePanel } from './ConsolePanel'
import {
  appendConsoleEntry,
  formatConsoleEntryLayerLabel,
  isConsoleEntryVisible,
  useConsoleStore,
} from './useConsoleStore'
import type { ConsoleAssistDescriptor, ConsoleFloatingRect } from './consoleTypes'
import {
  cancelConsoleStagedNavigationSession,
  createConsoleStagedNavigationContext,
  isConsoleStagedNavigationRootToken,
  resolveConsoleWorkspaceContextSync,
  submitConsoleStagedNavigationToken,
  type ConsoleStagedNavigationChoice,
  type ConsoleStagedNavigationSession,
} from './stagedNavigation'

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

const getGeometrySketchDrawStageLabel = (drawStage: GeometrySketchDrawStage | null): string =>
  drawStage === 'sessionIdle'
    ? 'Session Idle'
    : drawStage === 'toolSelected'
      ? 'Tool Selected'
      : drawStage === 'draftActive'
        ? 'Draft Active'
        : 'n/a'

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

const formatStagedBreadcrumb = (breadcrumb: string[]): string => breadcrumb.join(' > ')

const formatStagedChoiceSummary = (choices: ConsoleStagedNavigationChoice[]): string =>
  choices.map((choice) => choice.label).join(', ')

const formatAssistChoiceSummary = (descriptor: ConsoleAssistDescriptor): string =>
  descriptor.choices.map((choice) => choice.label).join(', ')

const buildFeatureAssistPromptText = (descriptor: ConsoleAssistDescriptor): string =>
  `${descriptor.label} > [${formatAssistChoiceSummary(descriptor)}]`

const buildSketchPlaneFeatureAssistDescriptor = (): ConsoleAssistDescriptor => ({
  label: 'Sketch Plane',
  prefill: 'XY',
  choices: [
    { canonicalToken: 'XY', aliases: [], label: 'XY' },
    { canonicalToken: 'XZ', aliases: [], label: 'XZ' },
    { canonicalToken: 'YZ', aliases: [], label: 'YZ' },
  ],
})

const buildSketchDrawFeatureAssistDescriptor = (): ConsoleAssistDescriptor => ({
  label: 'Sketch Draw',
  prefill: 'Line',
  choices: [
    { canonicalToken: 'LINE', aliases: ['L'], label: 'Line' },
    { canonicalToken: 'PLINE', aliases: ['PL'], label: 'PLine' },
    { canonicalToken: 'X', aliases: [], label: 'X' },
  ],
})

const getActiveFeatureAssistDescriptor = ({
  sketchPlanePickSession,
  geometrySketchSession,
}: {
  sketchPlanePickSession: ReturnType<typeof useSpaghettiStore.getState>['sketchPlanePickSession']
  geometrySketchSession: ReturnType<typeof useSpaghettiStore.getState>['geometrySketchSession']
}): ConsoleAssistDescriptor | null => {
  if (sketchPlanePickSession !== null) {
    return buildSketchPlaneFeatureAssistDescriptor()
  }
  if (
    geometrySketchSession?.mode === 'draw' &&
    geometrySketchSession.drawStage === 'sessionIdle'
  ) {
    return buildSketchDrawFeatureAssistDescriptor()
  }
  return null
}

const getStagedScopeLabel = (session: ConsoleStagedNavigationSession | null): string | null => {
  if (session === null) {
    return null
  }
  switch (session.scopeId) {
    case 'graphRoot':
    case 'graphSelected':
      return 'Graph'
    case 'graphSketchList':
    case 'graphSketchSelected':
      return 'Sketch'
    case 'graphExtrudeList':
    case 'graphExtrudeSelected':
      return 'Extrude'
    case 'graphOutputPreviewList':
    case 'graphOutputPreviewSelected':
      return 'Output Preview'
    default:
      return null
  }
}

const buildStagedPromptText = (
  session: ConsoleStagedNavigationSession | null,
  choices: ConsoleStagedNavigationChoice[],
): string => {
  const scopeLabel = getStagedScopeLabel(session)
  const baseText =
    choices.length === 0
      ? 'No further choices in this staged scope yet'
      : `Choose next [${formatStagedChoiceSummary(choices)}]`
  return scopeLabel === null ? baseText : `${scopeLabel} > ${baseText}`
}

const buildRootPromptText = (choices: string[] = ['Graph']): string =>
  `Root > Choose next [${choices.join(', ')}]`

const ROOT_PROMPT_TEXT = buildRootPromptText()

const areConsoleStagedNavigationSessionsEqual = (
  left: ConsoleStagedNavigationSession | null,
  right: ConsoleStagedNavigationSession | null,
): boolean => {
  if (left === right) {
    return true
  }
  if (left === null || right === null) {
    return false
  }
  return (
    left.scopeId === right.scopeId &&
    left.selections.graphDocumentId === right.selections.graphDocumentId &&
    left.selections.selectedNodeId === right.selections.selectedNodeId &&
    left.selections.sketchNodeId === right.selections.sketchNodeId
  )
}

type GraphRootEditorRevealRestore =
  | {
      kind: 'close-opened-viewport'
      editorViewportId: string
      previousActiveEditorViewportId: string
    }
  | {
      kind: 'restore-window-mode'
      editorViewportId: string
      windowMode: Extract<EditorViewportWindowMode, 'collapsed' | 'meatball editor view'>
      previousActiveEditorViewportId: string
    }

const ensureSpaghettiEditorVisibleForGraphRoot = (): GraphRootEditorRevealRestore | null => {
  const spaghettiState = useSpaghettiStore.getState()
  const previousActiveEditorViewportId = spaghettiState.activeEditorViewportId
  const existingViewport =
    Object.values(spaghettiState.editorViewportsById).find(
      (viewport) => viewport.graphDocumentId === spaghettiState.activeGraphDocumentId,
    ) ?? null
  const viewportId =
    spaghettiState.openGraphDocumentInViewport(spaghettiState.activeGraphDocumentId) ??
    spaghettiState.activeEditorViewportId
  if (viewportId.length === 0) {
    return null
  }
  const updatedState = useSpaghettiStore.getState()
  const activeViewport = updatedState.editorViewportsById[viewportId] ?? null
  if (activeViewport === null) {
    return null
  }
  if (existingViewport === null) {
    return {
      kind: 'close-opened-viewport',
      editorViewportId: viewportId,
      previousActiveEditorViewportId,
    }
  }
  if (
    activeViewport.windowMode === 'collapsed' ||
    activeViewport.windowMode === 'meatball editor view'
  ) {
    updatedState.setEditorViewportWindowMode(activeViewport.editorViewportId, 'expanded')
    return {
      kind: 'restore-window-mode',
      editorViewportId: activeViewport.editorViewportId,
      windowMode: activeViewport.windowMode,
      previousActiveEditorViewportId,
    }
  }
  return null
}

const buildStagedNavigationContextFromStoreState = (
  spaghettiState: ReturnType<typeof useSpaghettiStore.getState>,
) =>
  createConsoleStagedNavigationContext(
    selectOrderedGraphDocuments(spaghettiState).map((document) => ({
      graphDocumentId: document.graphDocumentId,
      name: document.name,
      sketchOptions: document.graph.nodes
        .filter((node) => node.type === 'Geometry/Sketch')
        .map((node) => ({
          nodeId: node.nodeId,
        })),
      extrudeOptions: document.graph.nodes
        .filter((node) => node.type === 'Geometry/Extrude')
        .map((node) => ({
          nodeId: node.nodeId,
        })),
      outputPreviewOptions: document.graph.nodes
        .filter((node) => node.type === 'System/OutputPreview')
        .map((node) => ({
          nodeId: node.nodeId,
        })),
    })),
  )

const buildWorkspaceIntentDepsFromStoreState = (): WorkspaceIntentDeps => {
  const appState = useAppStore.getState()
  const spaghettiState = useSpaghettiStore.getState()
  return {
    app: {
      setWorkspaceSelectedTarget: appState.setWorkspaceSelectedTarget,
      setActiveSurface: appState.setActiveSurface,
      requestFloatingShellActivation: appState.requestFloatingShellActivation,
      setReferenceItemVisibility: appState.setReferenceItemVisibility,
      beginReferenceTransform: appState.beginReferenceTransform,
      selectPart: appState.selectPart,
    },
    spaghetti: {
      activeEditorViewportId: spaghettiState.activeEditorViewportId,
      editorViewportsById: spaghettiState.editorViewportsById,
      openGraphDocumentInViewport: spaghettiState.openGraphDocumentInViewport,
      swapFocusedEditorViewportToGraphDocument:
        spaghettiState.swapFocusedEditorViewportToGraphDocument,
      setActiveEditorViewportId: spaghettiState.setActiveEditorViewportId,
      setEditorViewportPosition: spaghettiState.setEditorViewportPosition,
      setSelectedNodeId: spaghettiState.setSelectedNodeId,
      requestEditorViewportNodeFit: spaghettiState.requestEditorViewportNodeFit,
      startSketchPlanePick: spaghettiState.startSketchPlanePick,
      startGeometrySketchSession: spaghettiState.startGeometrySketchSession,
    },
  }
}

let fallbackConsoleSketchNodeIdCounter = 0

const buildTentativeConsoleSketchNodeId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `node-${crypto.randomUUID()}`
  }
  fallbackConsoleSketchNodeIdCounter += 1
  return `node-console-fallback-${fallbackConsoleSketchNodeIdCounter}`
}

const generateUniqueConsoleSketchNodeId = (graph: SpaghettiGraph): string => {
  const existing = new Set(graph.nodes.map((node) => node.nodeId))
  let candidate = buildTentativeConsoleSketchNodeId()
  let suffix = 2
  while (existing.has(candidate)) {
    candidate = `${buildTentativeConsoleSketchNodeId()}-${suffix}`
    suffix += 1
  }
  return candidate
}

const buildDefaultCreatedSketchPosition = (graph: SpaghettiGraph): GraphNodePos => {
  const positions = graph.nodes
    .map((node) => graph.ui?.nodes?.[node.nodeId] ?? node.ui ?? null)
    .filter((position): position is GraphNodePos => position !== null)
  if (positions.length === 0) {
    return { x: 160, y: 140 }
  }
  const maxX = Math.max(...positions.map((position) => position.x))
  const minY = Math.min(...positions.map((position) => position.y))
  return {
    x: Math.round(maxX + 240),
    y: Math.round(minY),
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
  const suppressAutoCaptureRef = useRef(false)
  const graphRootEditorRevealRestoreRef = useRef<GraphRootEditorRevealRestore | null>(null)
  const lastHandledConsoleContextSyncSeqRef = useRef(0)
  const previousSketchPlanePickSessionRef = useRef<
    ReturnType<typeof useSpaghettiStore.getState>['sketchPlanePickSession']
  >(null)
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
  const seedInputText = useConsoleStore((state) => state.seedInputText)
  const stagedNavigationSession = useConsoleStore((state) => state.stagedNavigationSession)
  const featureAssistDescriptor = useConsoleStore((state) => state.featureAssistDescriptor)
  const setStagedNavigationSession = useConsoleStore((state) => state.setStagedNavigationSession)
  const setFeatureAssistDescriptor = useConsoleStore((state) => state.setFeatureAssistDescriptor)
  const clearStagedNavigationSession = useConsoleStore((state) => state.clearStagedNavigationSession)
  const cycleStagedChoice = useConsoleStore((state) => state.cycleStagedChoice)
  const workspaceSelectedTarget = useAppStore((state) => state.workspaceSelection.selectedTarget)
  const workspaceActiveSurface = useAppStore((state) => state.workspaceSelection.activeSurface)
  const consoleContextSyncRequest = useAppStore((state) => state.consoleContextSyncRequest)
  const sketchPlanePickSession = useSpaghettiStore((state) => state.sketchPlanePickSession)
  const geometrySketchSession = useSpaghettiStore((state) => state.geometrySketchSession)
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
    suppressAutoCaptureRef.current = true
    try {
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key,
          bubbles: true,
          cancelable: true,
        }),
      )
    } finally {
      suppressAutoCaptureRef.current = false
    }
  }, [])

  const routeConsoleGlobalKey = useCallback((event: KeyboardEvent) => {
    const spaghettiState = useSpaghettiStore.getState()
    const appState = useAppStore.getState()
    return routeKeyboardInput({
      event,
      sketchPlanePickStage: spaghettiState.sketchPlanePickSession?.stage ?? null,
      geometrySketchMode: spaghettiState.geometrySketchSession?.mode ?? null,
      referenceTransformActive: appState.referenceWorkspace.activeTransformReferenceId !== null,
      stagedConsoleActive: useConsoleStore.getState().stagedNavigationSession !== null,
      allowFlatConsoleCapture: true,
    })
  }, [])

  const cancelActiveStagedNavigationSession = useCallback(() => {
    if (useConsoleStore.getState().stagedNavigationSession === null) {
      return false
    }
    const cancelled = cancelConsoleStagedNavigationSession()
    clearStagedNavigationSession()
    const revealRestore = graphRootEditorRevealRestoreRef.current
    graphRootEditorRevealRestoreRef.current = null
    if (revealRestore !== null) {
      const spaghettiState = useSpaghettiStore.getState()
      if (revealRestore.kind === 'close-opened-viewport') {
        if (spaghettiState.editorViewportsById[revealRestore.editorViewportId] !== undefined) {
          spaghettiState.closeEditorViewport(revealRestore.editorViewportId)
        }
      } else if (spaghettiState.editorViewportsById[revealRestore.editorViewportId] !== undefined) {
        spaghettiState.setEditorViewportWindowMode(
          revealRestore.editorViewportId,
          revealRestore.windowMode,
        )
      }
      if (
        revealRestore.previousActiveEditorViewportId.length > 0 &&
        useSpaghettiStore.getState().editorViewportsById[
          revealRestore.previousActiveEditorViewportId
        ] !== undefined
      ) {
        useSpaghettiStore
          .getState()
          .setActiveEditorViewportId(revealRestore.previousActiveEditorViewportId)
      }
    }
    appendConsoleEntry({
      layer: 'App',
      text: 'Staged navigation cancelled',
      source: 'console',
      severity: 'info',
    })
    appendConsoleEntry({
      layer: 'Commands',
      text: buildRootPromptText(cancelled.validChoices.map((choice) => choice.label)),
      source: 'console',
      severity: 'info',
    })
    return true
  }, [clearStagedNavigationSession])

  const createMissingGraphNodeInGraphDocument = useCallback((
    graphDocumentId: string,
    nodeType: 'Geometry/Sketch' | 'Geometry/Extrude' | 'System/OutputPreview',
    labelPrefix: 'sketch' | 'extrude' | 'outputPreview',
  ) => {
    const initialState = useSpaghettiStore.getState()
    if (initialState.activeGraphDocumentId !== graphDocumentId) {
      initialState.openGraphDocumentInViewport(graphDocumentId)
    }
    const mutationState = useSpaghettiStore.getState()
    const targetDocument = selectGraphDocumentById(mutationState, graphDocumentId)
    if (targetDocument === null) {
      return null
    }
    const existingNodeCount = targetDocument.graph.nodes.filter((node) => node.type === nodeType).length
    const nodeId = generateUniqueConsoleSketchNodeId(targetDocument.graph)
    mutationState.applyGraphCommand(
      addNodeCommand({
        node: {
          nodeId,
          type: nodeType,
          params: getDefaultNodeParams(nodeType),
        },
        position: buildDefaultCreatedSketchPosition(targetDocument.graph),
      }),
    )
    const updatedState = useSpaghettiStore.getState()
    activateGraphNodeIntent(buildWorkspaceIntentDepsFromStoreState(), graphDocumentId, nodeId, {
      strategy: 'open-or-focus',
      fitNodeInViewport: true,
    })
    return {
      nodeId,
      nodeLabel: `${labelPrefix}_[${existingNodeCount + 1}]`,
      stagedContext: buildStagedNavigationContextFromStoreState(updatedState),
    }
  }, [])

  const handleSubmitCommand = useCallback(
    (inputText: string) => {
      const trimmedInput = inputText.trim().toLowerCase()
      const spaghettiState = useSpaghettiStore.getState()
      const activeStagedSession = useConsoleStore.getState().stagedNavigationSession
      const stagedContext = buildStagedNavigationContextFromStoreState(spaghettiState)
      if (activeStagedSession !== null || isConsoleStagedNavigationRootToken(inputText)) {
        const rawToken = inputText.trim()
        if (activeStagedSession === null && isConsoleStagedNavigationRootToken(inputText)) {
          graphRootEditorRevealRestoreRef.current = ensureSpaghettiEditorVisibleForGraphRoot()
          if (spaghettiState.activeGraphDocumentId.length > 0) {
            activateGraphDocumentIntent(
              buildWorkspaceIntentDepsFromStoreState(),
              spaghettiState.activeGraphDocumentId,
              {
                strategy: 'open-or-focus',
              },
            )
          }
        }
        appendConsoleEntry({
          layer: 'Commands',
          commandLineKind: 'user',
          text: `> ${rawToken}`,
        })
        pushCommandHistory(rawToken)
        const stagedResult = submitConsoleStagedNavigationToken(
          activeStagedSession,
          inputText,
          stagedContext,
        )
        if (stagedResult.kind === 'advance') {
          if (
            activeStagedSession?.selections.selectedNodeId !== null &&
            stagedResult.selections.selectedNodeId === null &&
            stagedResult.selections.graphDocumentId !== null
          ) {
            selectTargetIntent(buildWorkspaceIntentDepsFromStoreState(), {
              kind: 'graph-document',
              graphDocumentId: stagedResult.selections.graphDocumentId,
            })
          } else if (
            stagedResult.selections.selectedNodeId !== null &&
            stagedResult.selections.graphDocumentId !== null
          ) {
            activateGraphNodeIntent(
              buildWorkspaceIntentDepsFromStoreState(),
              stagedResult.selections.graphDocumentId,
              stagedResult.selections.selectedNodeId,
              {
                strategy: 'open-or-focus',
              },
            )
          } else if (stagedResult.selections.graphDocumentId !== null) {
            activateGraphDocumentIntent(
              buildWorkspaceIntentDepsFromStoreState(),
              stagedResult.selections.graphDocumentId,
              {
                strategy: 'open-or-focus',
              },
            )
          }
          if (
            activeStagedSession?.scopeId === 'graphSelected' &&
            stagedResult.validChoices.every((choice) => choice.canonicalToken === 'BACK') &&
            stagedResult.selections.graphDocumentId !== null
          ) {
            const missingNodeRequest =
              stagedResult.session.scopeId === 'graphSketchList'
                ? {
                    nodeType: 'Geometry/Sketch' as const,
                    labelPrefix: 'sketch' as const,
                  }
                : stagedResult.session.scopeId === 'graphExtrudeList'
                  ? {
                      nodeType: 'Geometry/Extrude' as const,
                      labelPrefix: 'extrude' as const,
                    }
                  : stagedResult.session.scopeId === 'graphOutputPreviewList'
                    ? {
                        nodeType: 'System/OutputPreview' as const,
                        labelPrefix: 'outputPreview' as const,
                      }
                    : null
            if (missingNodeRequest !== null) {
              const createdNode = createMissingGraphNodeInGraphDocument(
                stagedResult.selections.graphDocumentId,
                missingNodeRequest.nodeType,
                missingNodeRequest.labelPrefix,
              )
              if (createdNode !== null) {
              const resumedResult = submitConsoleStagedNavigationToken(
                activeStagedSession,
                inputText,
                createdNode.stagedContext,
              )
              if (resumedResult.kind === 'advance') {
                setStagedNavigationSession(resumedResult.session)
                const preAutoBreadcrumb =
                  resumedResult.autoSelections.length === 0
                    ? resumedResult.breadcrumb
                    : resumedResult.breadcrumb.slice(
                        0,
                        Math.max(0, resumedResult.breadcrumb.length - resumedResult.autoSelections.length),
                      )
                appendConsoleEntry({
                  layer: 'Commands',
                  text: formatStagedBreadcrumb(preAutoBreadcrumb),
                  source: 'console',
                  severity: 'info',
                })
                appendConsoleEntry({
                  layer: 'App',
                  text: `Created ${createdNode.nodeLabel}`,
                  source: 'console',
                  severity: 'info',
                })
                resumedResult.autoSelections.forEach((choice) => {
                  appendConsoleEntry({
                    layer: 'Commands',
                    text: `Auto-selected ${choice.label}`,
                    source: 'console',
                    severity: 'info',
                  })
                })
                if (resumedResult.autoSelections.length > 0) {
                  appendConsoleEntry({
                    layer: 'Commands',
                    text: formatStagedBreadcrumb(resumedResult.breadcrumb),
                    source: 'console',
                    severity: 'info',
                  })
                }
                appendConsoleEntry({
                  layer: 'Commands',
                  text: buildStagedPromptText(resumedResult.session, resumedResult.validChoices),
                  source: 'console',
                  severity: 'info',
                })
                return
              }
            }
            }
          }
          setStagedNavigationSession(stagedResult.session)
          const preAutoBreadcrumb =
            stagedResult.autoSelections.length === 0
              ? stagedResult.breadcrumb
              : stagedResult.breadcrumb.slice(
                  0,
                  Math.max(0, stagedResult.breadcrumb.length - stagedResult.autoSelections.length),
                )
          appendConsoleEntry({
            layer: 'Commands',
            text: formatStagedBreadcrumb(preAutoBreadcrumb),
            source: 'console',
            severity: 'info',
          })
          stagedResult.autoSelections.forEach((choice) => {
            appendConsoleEntry({
              layer: 'Commands',
              text: `Auto-selected ${choice.label}`,
              source: 'console',
              severity: 'info',
            })
          })
          if (stagedResult.autoSelections.length > 0) {
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(stagedResult.breadcrumb),
              source: 'console',
              severity: 'info',
            })
          }
          appendConsoleEntry({
            layer: 'Commands',
            text: buildStagedPromptText(stagedResult.session, stagedResult.validChoices),
            source: 'console',
            severity: 'info',
          })
          return
        }
        if (stagedResult.kind === 'execute') {
          if (
            stagedResult.actionId === 'node.delete' &&
            stagedResult.selections.graphDocumentId !== null &&
            stagedResult.selections.selectedNodeId !== null
          ) {
            const deletedNodeLabel = stagedResult.session.breadcrumb.at(-1) ?? 'node'
            useSpaghettiStore
              .getState()
              .applyGraphCommand(removeNodeCommand(stagedResult.selections.selectedNodeId))
            activateGraphDocumentIntent(
              buildWorkspaceIntentDepsFromStoreState(),
              stagedResult.selections.graphDocumentId,
              {
                strategy: 'open-or-focus',
              },
            )
            const resumedHandoff = resolveConsoleWorkspaceContextSync(
              buildStagedNavigationContextFromStoreState(useSpaghettiStore.getState()),
              {
                graphDocumentId: stagedResult.selections.graphDocumentId,
                nodeId: null,
              },
            )
            if (resumedHandoff.session !== null) {
              setStagedNavigationSession(resumedHandoff.session)
            } else {
              clearStagedNavigationSession()
            }
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(stagedResult.breadcrumb),
              source: 'console',
              severity: 'info',
            })
            appendConsoleEntry({
              layer: 'App',
              text: `Deleted ${deletedNodeLabel}`,
              source: 'console',
              severity: 'info',
            })
            if (resumedHandoff.session !== null) {
              appendConsoleEntry({
                layer: 'Commands',
                text: formatStagedBreadcrumb(resumedHandoff.session.breadcrumb),
                source: 'console',
                severity: 'info',
              })
              appendConsoleEntry({
                layer: 'Commands',
                text: buildStagedPromptText(
                  resumedHandoff.session,
                  resumedHandoff.session.validChoices,
                ),
                source: 'console',
                severity: 'info',
              })
            }
            return
          }
          if (
            (stagedResult.actionId === 'graph.editor.collapsed' ||
              stagedResult.actionId === 'graph.editor.essentials' ||
              stagedResult.actionId === 'graph.editor.expanded') &&
            stagedResult.selections.graphDocumentId !== null
          ) {
            setStagedNavigationSession(stagedResult.session)
            const targetViewportId = activateGraphDocumentIntent(
              buildWorkspaceIntentDepsFromStoreState(),
              stagedResult.selections.graphDocumentId,
              {
                strategy: 'open-or-focus',
              },
            ).editorViewportId
            if (targetViewportId !== null && targetViewportId.length > 0) {
              const presentationMode =
                stagedResult.actionId === 'graph.editor.collapsed'
                  ? 'collapsed'
                  : stagedResult.actionId === 'graph.editor.essentials'
                    ? 'essentials'
                    : 'expanded'
              useSpaghettiStore
                .getState()
                .setEditorViewportPresentationMode(targetViewportId, presentationMode)
            }
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(stagedResult.breadcrumb),
              source: 'console',
              severity: 'info',
            })
            appendConsoleEntry({
              layer: 'App',
              text: `Editor mode: ${stagedResult.matchedChoice.label}`,
              source: 'console',
              severity: 'info',
            })
            appendConsoleEntry({
              layer: 'Commands',
              text: buildStagedPromptText(stagedResult.session, stagedResult.session.validChoices),
              source: 'console',
              severity: 'info',
            })
            return
          }
          graphRootEditorRevealRestoreRef.current = null
          clearStagedNavigationSession()
          if (
            (stagedResult.actionId === 'sketch.draw' ||
              stagedResult.actionId === 'sketch.plane') &&
            stagedResult.selections.graphDocumentId !== null &&
            stagedResult.selections.sketchNodeId !== null
          ) {
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(stagedResult.breadcrumb),
              source: 'console',
              severity: 'info',
            })
            if (stagedResult.actionId === 'sketch.plane') {
              startSketchPlaneIntent(
                buildWorkspaceIntentDepsFromStoreState(),
                stagedResult.selections.graphDocumentId,
                stagedResult.selections.sketchNodeId,
              )
              appendConsoleEntry({
                layer: 'Commands',
                text: buildFeatureAssistPromptText(buildSketchPlaneFeatureAssistDescriptor()),
                source: 'console',
                severity: 'info',
              })
              return
            }
            startSketchDrawIntent(
              buildWorkspaceIntentDepsFromStoreState(),
              stagedResult.selections.graphDocumentId,
              stagedResult.selections.sketchNodeId,
            )
            return
          }
          appendConsoleEntry({
            layer: 'Commands',
            text: formatStagedBreadcrumb(stagedResult.breadcrumb),
            source: 'console',
            severity: 'info',
          })
          appendConsoleEntry({
            layer: 'App',
            text: `Staged action: ${stagedResult.matchedChoice.label}`,
            source: 'console',
            severity: 'info',
          })
          return
        }
        if (stagedResult.kind === 'invalid') {
          if (stagedResult.session !== null) {
            setStagedNavigationSession(stagedResult.session)
          }
          appendConsoleEntry({
            layer: 'Commands',
            text:
              stagedResult.breadcrumb.length === 0
                ? 'Select'
                : formatStagedBreadcrumb(stagedResult.breadcrumb),
            source: 'console',
            severity: 'info',
          })
          appendConsoleEntry({
            layer: 'Diagnostics',
            text: `Invalid token for current scope: ${rawToken}`,
            source: 'console',
            severity: 'warn',
          })
          appendConsoleEntry({
            layer: 'Commands',
            text: buildStagedPromptText(stagedResult.session, stagedResult.validChoices),
            source: 'console',
            severity: 'info',
          })
          return
        }
      }
      graphRootEditorRevealRestoreRef.current = null
      const sketchPlanePickSession = useSpaghettiStore.getState().sketchPlanePickSession
      if (sketchPlanePickSession !== null) {
        if (trimmedInput === 'xy' || trimmedInput === 'xz' || trimmedInput === 'yz') {
          appendConsoleEntry({
            layer: 'Commands',
            commandLineKind: 'user',
            text: `> ${trimmedInput}`,
          })
          pushCommandHistory(trimmedInput)
          useSpaghettiStore.getState().setSketchPlanePickDraftPlane(trimmedInput.toUpperCase() as 'XY' | 'XZ' | 'YZ')
          return
        }
        if (trimmedInput === 'esc' || trimmedInput === 'back' || trimmedInput === 'b') {
          appendConsoleEntry({
            layer: 'Commands',
            commandLineKind: 'user',
            text: `> ${trimmedInput}`,
          })
          pushCommandHistory(trimmedInput)
          useSpaghettiStore.getState().returnActiveSketchSessionOneLevel()
          return
        }
      }
      const geometrySketchSession = spaghettiState.geometrySketchSession
      if (geometrySketchSession?.mode === 'draw') {
        if (trimmedInput === 'line' || trimmedInput === 'l') {
          appendConsoleEntry({
            layer: 'Commands',
            commandLineKind: 'user',
            text: `> ${trimmedInput}`,
          })
          pushCommandHistory(trimmedInput)
          spaghettiState.setGeometrySketchSessionTool('line')
          return
        }
        if (trimmedInput === 'pline' || trimmedInput === 'pl') {
          appendConsoleEntry({
            layer: 'Commands',
            commandLineKind: 'user',
            text: `> ${trimmedInput}`,
          })
          pushCommandHistory(trimmedInput)
          spaghettiState.setGeometrySketchSessionTool('pline')
          return
        }
        if (trimmedInput === 'enter') {
          appendConsoleEntry({
            layer: 'Commands',
            commandLineKind: 'user',
            text: '> enter',
          })
          pushCommandHistory('enter')
          spaghettiState.finishGeometrySketchDrawDraft()
          return
        }
        if (trimmedInput === 'esc' || trimmedInput === 'back' || trimmedInput === 'b') {
          appendConsoleEntry({
            layer: 'Commands',
            commandLineKind: 'user',
            text: `> ${trimmedInput}`,
          })
          pushCommandHistory(trimmedInput)
          spaghettiState.returnActiveSketchSessionOneLevel()
          return
        }
        if (trimmedInput === 'x') {
          appendConsoleEntry({
            layer: 'Commands',
            commandLineKind: 'user',
            text: '> x',
          })
          pushCommandHistory('x')
          spaghettiState.closeGeometrySketchSession()
          return
        }
        if (trimmedInput === 'status') {
          appendConsoleEntry({
            layer: 'Commands',
            commandLineKind: 'user',
            text: '> status',
          })
          pushCommandHistory('status')
          appendConsoleEntry({
            layer: 'App',
            text:
              `Draw Sketch ${getGeometrySketchDrawStageLabel(geometrySketchSession.drawStage)} ` +
              `tool=${
                geometrySketchSession.activeTool === null
                  ? 'none'
                  : geometrySketchSession.activeTool.toUpperCase()
              } ` +
              `points=${geometrySketchSession.drawDraft?.points.length ?? 0} ` +
              `hover=${
                geometrySketchSession.drawDraft?.hoverPoint === null
                  ? 'none'
                  : `${geometrySketchSession.drawDraft?.hoverPoint.x.toFixed(1)},${geometrySketchSession.drawDraft?.hoverPoint.y.toFixed(1)}`
              }`,
            source: 'console',
            severity: 'info',
          })
          return
        }
        if (trimmedInput === 'help') {
          appendConsoleEntry({
            layer: 'Commands',
            commandLineKind: 'user',
            text: '> help',
          })
          pushCommandHistory('help')
          appendConsoleEntry({
            layer: 'Commands',
            text: 'Draw Sketch commands: line (l), pline (pl), enter, esc, back (b), x, status, help',
            severity: 'info',
          })
          return
        }
      }
      if (trimmedInput === 'x' && useSpaghettiStore.getState().sketchPlanePickSession !== null) {
        appendConsoleEntry({
          layer: 'Commands',
          commandLineKind: 'user',
          text: '> x',
        })
        pushCommandHistory('x')
        useSpaghettiStore.getState().cancelSketchPlanePick()
        return
      }

      const parsed = parseConsoleCommand(inputText)
      if (parsed === null) {
        useConsoleStore.getState().setInputText('')
        return
      }

      appendConsoleEntry({
        layer: 'Commands',
        commandLineKind: 'user',
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
            text: 'Status: spaghetti preview active',
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
    [
      clearStagedNavigationSession,
      createMissingGraphNodeInGraphDocument,
      dispatchImmediateShortcut,
      pushCommandHistory,
      setStagedNavigationSession,
    ],
  )

  useEffect(() => {
    const previousSession = previousSketchPlanePickSessionRef.current
    previousSketchPlanePickSessionRef.current = sketchPlanePickSession

    if (previousSession === null || sketchPlanePickSession !== null) {
      return
    }

    const spaghettiState = useSpaghettiStore.getState()
    const activeDrawSession = spaghettiState.geometrySketchSession
    const didAdvanceIntoSketchDraw =
      activeDrawSession?.mode === 'draw' && activeDrawSession.nodeId === previousSession.nodeId

    if (didAdvanceIntoSketchDraw || spaghettiState.activeGraphDocumentId.length === 0) {
      return
    }

    const resumedHandoff = resolveConsoleWorkspaceContextSync(
      buildStagedNavigationContextFromStoreState(spaghettiState),
      {
        graphDocumentId: spaghettiState.activeGraphDocumentId,
        nodeId: spaghettiState.selectedNodeId ?? previousSession.nodeId,
      },
    )

    if (resumedHandoff.session === null) {
      return
    }

    setStagedNavigationSession(resumedHandoff.session)
    appendConsoleEntry({
      layer: 'Commands',
      text: buildStagedPromptText(resumedHandoff.session, resumedHandoff.session.validChoices),
      source: 'console',
      severity: 'info',
    })
  }, [setStagedNavigationSession, sketchPlanePickSession])

  useEffect(() => {
    if (consoleContextSyncRequest === null) {
      return
    }
    if (consoleContextSyncRequest.seq === lastHandledConsoleContextSyncSeqRef.current) {
      return
    }
    lastHandledConsoleContextSyncSeqRef.current = consoleContextSyncRequest.seq

    const isForcedRootSync = consoleContextSyncRequest.reason === 'surface-clear'
    const spaghettiState = useSpaghettiStore.getState()
    const resolvedTarget =
      isForcedRootSync
        ? null
        : workspaceActiveSurface === 'spaghetti'
        ? {
            graphDocumentId:
              spaghettiState.activeGraphDocumentId.length > 0
                ? spaghettiState.activeGraphDocumentId
                : null,
            nodeId: spaghettiState.selectedNodeId,
          }
        : workspaceSelectedTarget?.kind === 'graph-document'
          ? {
              graphDocumentId: workspaceSelectedTarget.graphDocumentId,
              nodeId: null,
            }
          : workspaceSelectedTarget?.kind === 'graph-node'
            ? {
                graphDocumentId: workspaceSelectedTarget.graphDocumentId,
                nodeId: workspaceSelectedTarget.nodeId,
              }
            : null

    const resolvedHandoff =
      resolvedTarget === null
        ? {
            session: null,
            selectedLabel: null,
          }
        : resolveConsoleWorkspaceContextSync(
            buildStagedNavigationContextFromStoreState(spaghettiState),
            resolvedTarget,
          )

    const currentSession = useConsoleStore.getState().stagedNavigationSession
    const isForcedRootAvailabilitySync =
      isForcedRootSync && currentSession === null && resolvedHandoff.session === null

    if (
      areConsoleStagedNavigationSessionsEqual(currentSession, resolvedHandoff.session) &&
      !isForcedRootAvailabilitySync
    ) {
      return
    }

    if (resolvedHandoff.session === null) {
      if (currentSession === null) {
        if (isForcedRootAvailabilitySync) {
          const lastEntry = useConsoleStore.getState().entries.at(-1)
          if (lastEntry?.text !== ROOT_PROMPT_TEXT) {
            appendConsoleEntry({
              layer: 'Commands',
              text: ROOT_PROMPT_TEXT,
              source: 'console',
              severity: 'info',
            })
          }
        }
        return
      }
      graphRootEditorRevealRestoreRef.current = null
      clearStagedNavigationSession()
      appendConsoleEntry({
        layer: 'Commands',
        text: 'Returned to root',
        source: 'console',
        severity: 'info',
      })
      appendConsoleEntry({
        layer: 'Commands',
        text: ROOT_PROMPT_TEXT,
        source: 'console',
        severity: 'info',
      })
      return
    }

    setStagedNavigationSession(resolvedHandoff.session)
    if (resolvedHandoff.selectedLabel !== null) {
      appendConsoleEntry({
        layer: 'Selection',
        text: `Selected target: ${resolvedHandoff.selectedLabel}`,
        source: 'console',
        severity: 'info',
      })
    }
    appendConsoleEntry({
      layer: 'Commands',
      text: formatStagedBreadcrumb(resolvedHandoff.session.breadcrumb),
      source: 'console',
      severity: 'info',
    })
    appendConsoleEntry({
      layer: 'Commands',
      text: buildStagedPromptText(resolvedHandoff.session, resolvedHandoff.session.validChoices),
      source: 'console',
      severity: 'info',
    })
  }, [
    clearStagedNavigationSession,
    consoleContextSyncRequest,
    setStagedNavigationSession,
    workspaceActiveSurface,
    workspaceSelectedTarget,
  ])

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
        isEditableTarget(event.target)
      ) {
        return
      }
      if (event.key === '/' && !event.ctrlKey && !event.altKey && !event.metaKey) {
        event.preventDefault()
        event.stopImmediatePropagation()
        focusMainConsoleInput()
        return
      }
      const routing = routeConsoleGlobalKey(event)
      if (routing.owner === 'staged-console' && event.key === 'Escape') {
        event.preventDefault()
        event.stopImmediatePropagation()
        cancelActiveStagedNavigationSession()
        return
      }
      if ((routing.owner === 'staged-console' || featureAssistDescriptor !== null) && event.key === 'ArrowUp') {
        event.preventDefault()
        event.stopImmediatePropagation()
        focusMainConsoleInput()
        cycleStagedChoice('previous')
        return
      }
      if ((routing.owner === 'staged-console' || featureAssistDescriptor !== null) && event.key === 'ArrowDown') {
        event.preventDefault()
        event.stopImmediatePropagation()
        focusMainConsoleInput()
        cycleStagedChoice('next')
        return
      }
      if (
        suppressAutoCaptureRef.current ||
        routing.decision !== 'handle' ||
        (routing.owner !== 'flat-console' && routing.owner !== 'staged-console')
      ) {
        return
      }
      event.preventDefault()
      event.stopImmediatePropagation()
      focusMainConsoleInput()
      seedInputText(event.key)
    }

    window.addEventListener('keydown', handleKeyDown, true)
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [
    cancelActiveStagedNavigationSession,
    cycleStagedChoice,
    featureAssistDescriptor,
    focusMainConsoleInput,
    routeConsoleGlobalKey,
    seedInputText,
  ])

  useEffect(() => {
    const popoutWindow = popoutWindowRef.current
    if (windowMode !== 'popout' || popoutWindow === null) {
      return
    }

    const handlePopoutKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        isEditableTarget(event.target)
      ) {
        return
      }
      if (event.key === '/' && !event.ctrlKey && !event.altKey && !event.metaKey) {
        event.preventDefault()
        event.stopImmediatePropagation()
        focusPopoutConsoleInput()
        return
      }
      const routing = routeConsoleGlobalKey(event)
      if (routing.owner === 'staged-console' && event.key === 'Escape') {
        event.preventDefault()
        event.stopImmediatePropagation()
        cancelActiveStagedNavigationSession()
        return
      }
      if ((routing.owner === 'staged-console' || featureAssistDescriptor !== null) && event.key === 'ArrowUp') {
        event.preventDefault()
        event.stopImmediatePropagation()
        focusPopoutConsoleInput()
        cycleStagedChoice('previous')
        return
      }
      if ((routing.owner === 'staged-console' || featureAssistDescriptor !== null) && event.key === 'ArrowDown') {
        event.preventDefault()
        event.stopImmediatePropagation()
        focusPopoutConsoleInput()
        cycleStagedChoice('next')
        return
      }
      if (
        suppressAutoCaptureRef.current ||
        routing.decision !== 'handle' ||
        (routing.owner !== 'flat-console' && routing.owner !== 'staged-console')
      ) {
        return
      }
      event.preventDefault()
      event.stopImmediatePropagation()
      focusPopoutConsoleInput()
      seedInputText(event.key)
    }

    popoutWindow.addEventListener('keydown', handlePopoutKeyDown, true)
    return () => {
      popoutWindow.removeEventListener('keydown', handlePopoutKeyDown, true)
    }
  }, [
    cancelActiveStagedNavigationSession,
    cycleStagedChoice,
    featureAssistDescriptor,
    focusPopoutConsoleInput,
    popoutHost,
    routeConsoleGlobalKey,
    seedInputText,
    windowMode,
  ])

  useEffect(() => {
    if (stagedNavigationSession !== null) {
      return
    }
    setFeatureAssistDescriptor(
      getActiveFeatureAssistDescriptor({
        sketchPlanePickSession,
        geometrySketchSession,
      }),
    )
  }, [geometrySketchSession, setFeatureAssistDescriptor, sketchPlanePickSession, stagedNavigationSession])

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
        onCancelCommand={cancelActiveStagedNavigationSession}
        treatSpaceAsSubmit={stagedNavigationSession !== null}
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
              onCancelCommand={cancelActiveStagedNavigationSession}
              treatSpaceAsSubmit={stagedNavigationSession !== null}
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
              <span className="ConsoleListViewLayer">[{formatConsoleEntryLayerLabel(entry)}]</span>
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
            onCancelCommand={cancelActiveStagedNavigationSession}
            treatSpaceAsSubmit={stagedNavigationSession !== null}
          />
        ) : null}
        {floatingWindow}
      </div>
      {popoutSurface}
    </>
  )
}
