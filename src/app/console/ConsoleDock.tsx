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
import { requestRadioRuntimeWarmup } from '../../runtime/audio/radioRuntimeWarmup'
import {
  type RadioBurstTriggerKind,
  useAudioSamplerStore,
} from '../store/audioSamplerStore'
import { useAppStore } from '../store/useAppStore'
import { useUiPrefsStore } from '../store/uiPrefsStore'
import {
  activateGraphDocumentIntent,
  activateGraphNodeIntent,
  selectTargetIntent,
  startSketchDrawIntent,
  startSketchPlaneIntent,
  type WorkspaceIntentDeps,
} from '../store/workspaceIntents'
import { addNode as addNodeCommand, removeNode as removeNodeCommand } from '../spaghetti/graphCommands'
import { getDefaultNodeParams, getNodeDef } from '../spaghetti/registry/nodeRegistry'
import type {
  EditorViewportWindowMode,
  GraphNodePos,
  SpaghettiGraph,
} from '../spaghetti/schema/spaghettiTypes'
import {
  type GeometrySketchDrawStage,
  type SketchPlaneCommand,
  selectGraphDocumentById,
  selectOrderedGraphDocuments,
  useSpaghettiStore,
} from '../spaghetti/store/useSpaghettiStore'
import { ConsoleBar } from './ConsoleBar'
import { ConsolePanel } from './ConsolePanel'
import { resolveConsoleRadioCommandIdentity } from './radioCommandIdentity'
import {
  appendConsoleEntry,
  formatConsoleEntryLayerLabel,
  isConsoleEntryVisible,
  type ConsolePromptSession,
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

const formatSketchPlaneVec3ChoiceLabel = (values: {
  x: number
  y: number
  z: number
}): string =>
  `Vec3(${values.x.toFixed(1)}, ${values.y.toFixed(1)}, ${values.z.toFixed(1)})`

const buildSketchPlaneFeatureAssistDescriptor = (
  sketchPlanePickSession: NonNullable<
    ReturnType<typeof useSpaghettiStore.getState>['sketchPlanePickSession']
  >,
): ConsoleAssistDescriptor => {
  if (sketchPlanePickSession.stage === 'pick') {
    return {
      label: 'Sketch Plane',
      breadcrumb: ['Graph', 'Sketch', 'Sketch Plane'],
      prefill: 'XY',
      choices: [
        { canonicalToken: 'XY', aliases: [], label: 'XY' },
        { canonicalToken: 'XZ', aliases: [], label: 'XZ' },
        { canonicalToken: 'YZ', aliases: [], label: 'YZ' },
      ],
    }
  }
  if (sketchPlanePickSession.adjustScope === 'move') {
    const translation = sketchPlanePickSession.draftTransform.translation
    const vec3Token = `${translation.x.toFixed(1)},${translation.y.toFixed(1)},${translation.z.toFixed(1)}`
    return {
      label: 'Sketch Plane > Move',
      breadcrumb: ['Graph', 'Sketch', 'Sketch Plane', 'Move'],
      prefill: vec3Token,
      choices: [
        {
          canonicalToken: vec3Token,
          aliases: [],
          label: formatSketchPlaneVec3ChoiceLabel(translation),
        },
        { canonicalToken: 'MOVE X', aliases: ['X', 'MX'], label: 'Move X' },
        { canonicalToken: 'MOVE Y', aliases: ['Y', 'MY'], label: 'Move Y' },
        { canonicalToken: 'MOVE Z', aliases: ['Z', 'MZ'], label: 'Move Z' },
        { canonicalToken: 'SNAP', aliases: [], label: 'Snap' },
        { canonicalToken: 'BACK', aliases: ['B'], label: 'Back' },
      ],
    }
  }
  if (sketchPlanePickSession.adjustScope === 'move-snap') {
    const prefs = useUiPrefsStore.getState()
    const snapValue = prefs.sketchPlaneToolbarTranslateSnapValue
    const snapToken = snapValue.toFixed(1)
    return {
      label: 'Sketch Plane > Move > Snap',
      breadcrumb: ['Graph', 'Sketch', 'Sketch Plane', 'Move', 'Snap'],
      prefill: snapToken,
      choices: [
        { canonicalToken: snapToken, aliases: [], label: snapToken },
        { canonicalToken: 'ON', aliases: [], label: 'On' },
        { canonicalToken: 'OFF', aliases: [], label: 'Off' },
        { canonicalToken: 'BACK', aliases: ['B'], label: 'Back' },
      ],
    }
  }
  if (sketchPlanePickSession.adjustScope === 'rotate') {
    const rotation = sketchPlanePickSession.draftTransform.rotationDeg
    const vec3Token = `${rotation.x.toFixed(1)},${rotation.y.toFixed(1)},${rotation.z.toFixed(1)}`
    return {
      label: 'Sketch Plane > Rotate',
      breadcrumb: ['Graph', 'Sketch', 'Sketch Plane', 'Rotate'],
      prefill: vec3Token,
      choices: [
        {
          canonicalToken: vec3Token,
          aliases: [],
          label: formatSketchPlaneVec3ChoiceLabel(rotation),
        },
        { canonicalToken: 'ROTATE X', aliases: ['X', 'RX'], label: 'Rotate X' },
        { canonicalToken: 'ROTATE Y', aliases: ['Y', 'RY'], label: 'Rotate Y' },
        { canonicalToken: 'ROTATE Z', aliases: ['Z', 'RZ'], label: 'Rotate Z' },
        { canonicalToken: 'SNAP', aliases: [], label: 'Snap' },
        { canonicalToken: 'BACK', aliases: ['B'], label: 'Back' },
      ],
    }
  }
  if (sketchPlanePickSession.adjustScope === 'rotate-snap') {
    const prefs = useUiPrefsStore.getState()
    const snapValue = prefs.sketchPlaneToolbarRotateSnapValue
    const snapToken = snapValue.toFixed(0)
    return {
      label: 'Sketch Plane > Rotate > Snap',
      breadcrumb: ['Graph', 'Sketch', 'Sketch Plane', 'Rotate', 'Snap'],
      prefill: snapToken,
      choices: [
        { canonicalToken: snapToken, aliases: [], label: snapToken },
        { canonicalToken: 'ON', aliases: [], label: 'On' },
        { canonicalToken: 'OFF', aliases: [], label: 'Off' },
        { canonicalToken: 'BACK', aliases: ['B'], label: 'Back' },
      ],
    }
  }
  return {
    label: 'Sketch Plane',
    breadcrumb: ['Graph', 'Sketch', 'Sketch Plane'],
    prefill: 'Move',
    choices: [
      { canonicalToken: 'MOVE', aliases: ['M'], label: 'Move' },
      { canonicalToken: 'ROTATE', aliases: ['R'], label: 'Rotate' },
      { canonicalToken: 'DONE', aliases: ['D'], label: 'Done' },
      {
        canonicalToken: 'CONFIRMTOSKETCH',
        aliases: ['C'],
        label: 'ConfirmToSketch',
      },
      { canonicalToken: 'BACK', aliases: ['B'], label: 'Back' },
    ],
  }
}

const buildSketchDrawFeatureAssistDescriptor = (): ConsoleAssistDescriptor => ({
  label: 'Sketch Draw',
  breadcrumb: ['Graph', 'Sketch', 'Sketch Draw'],
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
    return buildSketchPlaneFeatureAssistDescriptor(sketchPlanePickSession)
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
    case 'radioRoot':
      return 'Radio'
    case 'graphRoot':
    case 'graphSelected':
      return 'Graph'
    case 'graphNodeList':
    case 'graphNodeSelected':
      return 'Focus Node'
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

const buildConsolePromptSessionText = (promptSession: Pick<
  ConsolePromptSession,
  'breadcrumb' | 'prefill'
>): string => `${formatStagedBreadcrumb(promptSession.breadcrumb)} > Enter value [${promptSession.prefill}]`

const buildRootPromptText = (choices: string[] = ['Graph', 'Radio']): string =>
  `Root > Choose next [${choices.join(', ')}]`

const ROOT_PROMPT_TEXT = buildRootPromptText()

const normalizeRadioCommandIdentity = (rawToken: string): string =>
  rawToken.trim().toUpperCase().replace(/\s+/g, ' ')

const getFeatureAssistChoiceInputText = (choice: ConsoleAssistDescriptor['choices'][number]): string => {
  const normalizedLabel = normalizeRadioCommandIdentity(choice.label)
  if (
    normalizedLabel === choice.canonicalToken ||
    choice.aliases.includes(normalizedLabel)
  ) {
    return choice.label
  }
  return choice.canonicalToken
}

const findFeatureAssistChoiceByInput = (
  descriptor: ConsoleAssistDescriptor,
  inputText: string,
): ConsoleAssistDescriptor['choices'][number] | null => {
  const normalizedInput = normalizeRadioCommandIdentity(inputText)
  if (normalizedInput.length === 0) {
    return null
  }
  return (
    descriptor.choices.find((choice) => {
      const normalizedChoiceInput = normalizeRadioCommandIdentity(
        getFeatureAssistChoiceInputText(choice),
      )
      return (
        normalizedInput === normalizedChoiceInput ||
        normalizedInput === choice.canonicalToken ||
        choice.aliases.includes(normalizedInput)
      )
    }) ?? null
  )
}

const isValidRadioUrl = (input: string): boolean => {
  try {
    const url = new URL(input)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

const parseRadioSampleBurstTime = (input: string): number | null => {
  const value = Number(input.trim())
  if (!Number.isFinite(value) || value <= 0) {
    return null
  }
  return value
}

const formatRadioSampleBurstTime = (value: number): string => {
  if (Number.isInteger(value)) {
    return `${value}`
  }
  return `${value}`.replace(/(\.\d*?[1-9])0+$/u, '$1').replace(/\.0$/u, '')
}

const parseConsoleVec3Literal = (
  input: string,
): { x: number; y: number; z: number } | null => {
  const match = input.match(
    /^\s*\(?\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)?\s*$/,
  )
  if (match === null) {
    return null
  }
  const [, xText, yText, zText] = match
  const x = Number(xText)
  const y = Number(yText)
  const z = Number(zText)
  if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
    return null
  }
  return { x, y, z }
}

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
      allNodeOptions: document.graph.nodes.map((node, index) => ({
        nodeId: node.nodeId,
        label: `node_[${index + 1}] ${getNodeDef(node.type)?.label ?? node.type}`,
      })),
      sketchOptions: document.graph.nodes
        .filter((node) => node.type === 'Geometry/Sketch')
        .map((node, index) => ({
          nodeId: node.nodeId,
          label: `sketch_[${index + 1}]`,
        })),
      extrudeOptions: document.graph.nodes
        .filter((node) => node.type === 'Geometry/Extrude')
        .map((node, index) => ({
          nodeId: node.nodeId,
          label: `extrude_[${index + 1}]`,
        })),
      outputPreviewOptions: document.graph.nodes
        .filter((node) => node.type === 'System/OutputPreview')
        .map((node, index) => ({
          nodeId: node.nodeId,
          label: `outputPreview_[${index + 1}]`,
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
  const appendEscUserEntry = useCallback(() => {
    appendConsoleEntry({
      layer: 'Commands',
      commandLineKind: 'user',
      text: '> esc',
    })
  }, [])

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
  const consoleInputText = useConsoleStore((state) => state.inputText)
  const seedInputText = useConsoleStore((state) => state.seedInputText)
  const stagedNavigationSession = useConsoleStore((state) => state.stagedNavigationSession)
  const consolePromptSession = useConsoleStore((state) => state.consolePromptSession)
  const featureAssistDescriptor = useConsoleStore((state) => state.featureAssistDescriptor)
  const setStagedNavigationSession = useConsoleStore((state) => state.setStagedNavigationSession)
  const setConsolePromptSession = useConsoleStore((state) => state.setConsolePromptSession)
  const setFeatureAssistDescriptor = useConsoleStore((state) => state.setFeatureAssistDescriptor)
  const clearStagedNavigationSession = useConsoleStore((state) => state.clearStagedNavigationSession)
  const cycleStagedChoice = useConsoleStore((state) => state.cycleStagedChoice)
  const stagedChoiceIndex = useConsoleStore((state) => state.stagedChoiceIndex)
  const isStagedChoiceManualOverride = useConsoleStore(
    (state) => state.isStagedChoiceManualOverride,
  )
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
  const treatSpaceAsSubmit =
    stagedNavigationSession !== null ||
    consolePromptSession !== null ||
    isConsoleStagedNavigationRootToken(consoleInputText)

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

  const trackRadioCommandIdentity = useCallback((commandIdentity: string | null) => {
    if (commandIdentity === null) {
      return
    }
    useAudioSamplerStore.getState().ensureSamplePosition(commandIdentity)
  }, [])

  const requestRadioBurst = useCallback((
    commandIdentity: string | null,
    triggerKind: RadioBurstTriggerKind,
  ) => {
    if (commandIdentity === null) {
      return null
    }
    return useAudioSamplerStore.getState().requestRadioBurst(commandIdentity, triggerKind)
  }, [])

  const triggerBurstForActiveStagedChoice = useCallback(
    (triggerKind: Extract<RadioBurstTriggerKind, 'arrowUp' | 'arrowDown'>) => {
      const state = useConsoleStore.getState()
      const activeSession = state.stagedNavigationSession
      if (activeSession !== null) {
        const activeChoice =
          activeSession.validChoices[state.stagedChoiceIndex ?? 0] ?? null
        if (activeChoice === null) {
          return
        }
        requestRadioBurst(
          resolveConsoleRadioCommandIdentity({
            kind: 'stagedChoice',
            activeScopeId: activeSession.scopeId,
            matchedCanonicalToken: activeChoice.canonicalToken,
            matchedLabel: activeChoice.label,
          }),
          triggerKind,
        )
        return
      }

      if (state.consolePromptSession !== null) {
        return
      }

      const activeDescriptor = state.featureAssistDescriptor
      if (activeDescriptor === null) {
        return
      }

      const activeChoice = activeDescriptor.choices[state.stagedChoiceIndex ?? 0] ?? null
      if (activeChoice === null) {
        return
      }

      requestRadioBurst(
        resolveConsoleRadioCommandIdentity({
          kind: 'featureAssistChoice',
          breadcrumb: activeDescriptor.breadcrumb,
          matchedCanonicalToken: activeChoice.canonicalToken,
          matchedLabel: activeChoice.label,
        }),
        triggerKind,
      )
    },
    [requestRadioBurst],
  )

  const resolveFeatureAssistSubmitIdentity = useCallback((inputText: string): string | null => {
    const descriptor = useConsoleStore.getState().featureAssistDescriptor
    if (descriptor === null) {
      return null
    }

    const matchedChoice = findFeatureAssistChoiceByInput(descriptor, inputText)
    return resolveConsoleRadioCommandIdentity({
      kind: 'featureAssistSubmit',
      breadcrumb: descriptor.breadcrumb,
      submittedToken: normalizeRadioCommandIdentity(inputText),
      matchedCanonicalToken: matchedChoice?.canonicalToken ?? null,
      matchedLabel: matchedChoice?.label ?? null,
    })
  }, [])

  const cycleStagedChoiceWithRadioBurst = useCallback(
    (direction: 'previous' | 'next', triggerKind: Extract<RadioBurstTriggerKind, 'arrowUp' | 'arrowDown'>) => {
      cycleStagedChoice(direction)
      triggerBurstForActiveStagedChoice(triggerKind)
    },
    [cycleStagedChoice, triggerBurstForActiveStagedChoice],
  )

  const handleGuidedChoiceCycle = useCallback(
    (direction: 'previous' | 'next') => {
      cycleStagedChoiceWithRadioBurst(
        direction,
        direction === 'previous' ? 'arrowUp' : 'arrowDown',
      )
    },
    [cycleStagedChoiceWithRadioBurst],
  )

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
      stagedConsoleActive:
        useConsoleStore.getState().stagedNavigationSession !== null ||
        useConsoleStore.getState().consolePromptSession !== null,
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

  const stepActiveStagedNavigationSessionOneLevel = useCallback(() => {
    const activeSession = useConsoleStore.getState().stagedNavigationSession
    if (activeSession === null) {
      return false
    }

    appendEscUserEntry()

    if (activeSession.scopeId === 'graphRoot' || activeSession.scopeId === 'radioRoot') {
      cancelActiveStagedNavigationSession()
      return true
    }

    const spaghettiState = useSpaghettiStore.getState()
    const stagedResult = submitConsoleStagedNavigationToken(
      activeSession,
      'BACK',
      buildStagedNavigationContextFromStoreState(spaghettiState),
    )

    if (stagedResult.kind !== 'advance') {
      cancelActiveStagedNavigationSession()
      return true
    }

    if (
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

    setStagedNavigationSession(stagedResult.session)
    appendConsoleEntry({
      layer: 'Commands',
      text: formatStagedBreadcrumb(stagedResult.breadcrumb),
      source: 'console',
      severity: 'info',
    })
    appendConsoleEntry({
      layer: 'Commands',
      text: buildStagedPromptText(stagedResult.session, stagedResult.validChoices),
      source: 'console',
      severity: 'info',
    })
    return true
  }, [
    appendEscUserEntry,
    cancelActiveStagedNavigationSession,
    setStagedNavigationSession,
  ])

  const stepActiveConsolePromptSessionBack = useCallback(() => {
    const activePromptSession = useConsoleStore.getState().consolePromptSession
    if (activePromptSession === null) {
      return false
    }

    appendEscUserEntry()
    setStagedNavigationSession(activePromptSession.returnSession)
    appendConsoleEntry({
      layer: 'Commands',
      text: formatStagedBreadcrumb(activePromptSession.returnSession.breadcrumb),
      source: 'console',
      severity: 'info',
    })
    appendConsoleEntry({
      layer: 'Commands',
      text: buildStagedPromptText(
        activePromptSession.returnSession,
        activePromptSession.returnSession.validChoices,
      ),
      source: 'console',
      severity: 'info',
    })
    return true
  }, [appendEscUserEntry, setStagedNavigationSession])

  const handleEscCancelCommand = useCallback(() => {
    if (stepActiveConsolePromptSessionBack()) {
      return
    }
    if (stepActiveStagedNavigationSessionOneLevel()) {
      return
    }
    const spaghettiState = useSpaghettiStore.getState()
    if (spaghettiState.sketchPlanePickSession !== null) {
      spaghettiState.runSketchPlaneCommand('esc')
      return
    }
    if (spaghettiState.geometrySketchSession?.mode === 'draw') {
      spaghettiState.runGeometrySketchDrawCommand('esc')
    }
  }, [stepActiveConsolePromptSessionBack, stepActiveStagedNavigationSessionOneLevel])

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
      const activePromptSession = useConsoleStore.getState().consolePromptSession
      const activeStagedSession = useConsoleStore.getState().stagedNavigationSession
      const stagedContext = buildStagedNavigationContextFromStoreState(spaghettiState)

      if (activePromptSession !== null) {
        const rawToken = inputText.trim()
        appendConsoleEntry({
          layer: 'Commands',
          commandLineKind: 'user',
          text: `> ${rawToken}`,
        })
        pushCommandHistory(rawToken)

        if (activePromptSession.kind === 'radio.url') {
          if (!isValidRadioUrl(rawToken)) {
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(activePromptSession.breadcrumb),
              source: 'console',
              severity: 'info',
            })
            appendConsoleEntry({
              layer: 'Diagnostics',
              text: `Invalid radio url: ${rawToken}`,
              source: 'console',
              severity: 'warn',
            })
            appendConsoleEntry({
              layer: 'Commands',
              text: buildConsolePromptSessionText(activePromptSession),
              source: 'console',
              severity: 'info',
            })
            useConsoleStore.getState().setInputText(rawToken)
            return
          }

          const commandIdentity = resolveConsoleRadioCommandIdentity({
            kind: 'promptSubmit',
            promptKind: activePromptSession.kind,
          })
          trackRadioCommandIdentity(commandIdentity)
          useAudioSamplerStore.getState().setRadioUrl(rawToken)
          requestRadioRuntimeWarmup(rawToken)
          requestRadioBurst(commandIdentity, 'enter')
          setStagedNavigationSession(activePromptSession.returnSession)
          appendConsoleEntry({
            layer: 'Commands',
            text: formatStagedBreadcrumb(activePromptSession.breadcrumb),
            source: 'console',
            severity: 'info',
          })
          appendConsoleEntry({
            layer: 'App',
            text: `Radio url: ${rawToken}`,
            source: 'console',
            severity: 'info',
          })
          appendConsoleEntry({
            layer: 'App',
            text: 'Radio on',
            source: 'console',
            severity: 'info',
          })
          appendConsoleEntry({
            layer: 'Commands',
            text: buildStagedPromptText(
              activePromptSession.returnSession,
              activePromptSession.returnSession.validChoices,
            ),
            source: 'console',
            severity: 'info',
          })
          return
        }

        const sampleBurstTime = parseRadioSampleBurstTime(rawToken)
        if (sampleBurstTime === null) {
          appendConsoleEntry({
            layer: 'Commands',
            text: formatStagedBreadcrumb(activePromptSession.breadcrumb),
            source: 'console',
            severity: 'info',
          })
          appendConsoleEntry({
            layer: 'Diagnostics',
            text: `Invalid sample burst time: ${rawToken}`,
            source: 'console',
            severity: 'warn',
          })
          appendConsoleEntry({
            layer: 'Commands',
            text: buildConsolePromptSessionText(activePromptSession),
            source: 'console',
            severity: 'info',
          })
          useConsoleStore.getState().setInputText(rawToken)
          return
        }

        const commandIdentity = resolveConsoleRadioCommandIdentity({
          kind: 'promptSubmit',
          promptKind: activePromptSession.kind,
        })
        trackRadioCommandIdentity(commandIdentity)
        useAudioSamplerStore.getState().setSampleBurstTime(sampleBurstTime)
        requestRadioBurst(commandIdentity, 'enter')
        setStagedNavigationSession(activePromptSession.returnSession)
        appendConsoleEntry({
          layer: 'Commands',
          text: formatStagedBreadcrumb(activePromptSession.breadcrumb),
          source: 'console',
          severity: 'info',
        })
        appendConsoleEntry({
          layer: 'App',
          text: `Sample burst time: ${formatRadioSampleBurstTime(sampleBurstTime)}`,
          source: 'console',
          severity: 'info',
        })
        appendConsoleEntry({
          layer: 'Commands',
          text: buildStagedPromptText(
            activePromptSession.returnSession,
            activePromptSession.returnSession.validChoices,
          ),
          source: 'console',
          severity: 'info',
        })
        return
      }

      if (activeStagedSession !== null || isConsoleStagedNavigationRootToken(inputText)) {
        const rawToken = inputText.trim()
        if (
          activeStagedSession === null &&
          isConsoleStagedNavigationRootToken(inputText) &&
          normalizeRadioCommandIdentity(rawToken) !== 'RADIO' &&
          normalizeRadioCommandIdentity(rawToken) !== 'R'
        ) {
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
          const commandIdentity = resolveConsoleRadioCommandIdentity({
            kind: 'stagedAdvance',
            activeScopeId: activeStagedSession?.scopeId ?? null,
            matchedCanonicalToken: stagedResult.matchedChoice.canonicalToken,
            matchedLabel: stagedResult.matchedChoice.label,
          })
          trackRadioCommandIdentity(commandIdentity)
          requestRadioBurst(commandIdentity, 'enter')
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
          const commandIdentity = resolveConsoleRadioCommandIdentity({
            kind: 'stagedExecute',
            activeScopeId: activeStagedSession?.scopeId ?? null,
            actionId: stagedResult.actionId,
          })
          trackRadioCommandIdentity(commandIdentity)
          if (
            stagedResult.actionId === 'radio.on' ||
            stagedResult.actionId === 'radio.off' ||
            stagedResult.actionId === 'radio.randomizeSampleTimes'
          ) {
            let radioStateAfterAction = null as ReturnType<typeof useAudioSamplerStore.getState> | null
            if (stagedResult.actionId === 'radio.on') {
              clearStagedNavigationSession()
              useConsoleStore.getState().setInputText('')
              useAudioSamplerStore.getState().turnRadioOn()
              radioStateAfterAction = useAudioSamplerStore.getState()
              requestRadioRuntimeWarmup(radioStateAfterAction.sourceUrl)
            } else if (stagedResult.actionId === 'radio.off') {
              clearStagedNavigationSession()
              useConsoleStore.getState().setInputText('')
              useAudioSamplerStore.getState().turnRadioOff()
            } else {
              setStagedNavigationSession(stagedResult.session)
              useAudioSamplerStore.getState().randomizeSampleTimes()
            }
            requestRadioBurst(commandIdentity, 'enter')
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(stagedResult.breadcrumb),
              source: 'console',
              severity: 'info',
            })
            appendConsoleEntry({
              layer: 'App',
              text:
                stagedResult.actionId === 'radio.on'
                  ? 'Radio on'
                  : stagedResult.actionId === 'radio.off'
                    ? 'Radio off'
                    : 'randomized sample times',
              source: 'console',
              severity: 'info',
            })
            if (stagedResult.actionId === 'radio.on' && radioStateAfterAction !== null) {
              appendConsoleEntry({
                layer: 'App',
                text: `Radio url: ${radioStateAfterAction.sourceUrl}`,
                source: 'console',
                severity: 'info',
              })
              appendConsoleEntry({
                layer: 'App',
                text: `Sample burst time: ${radioStateAfterAction.sampleBurstTime}`,
                source: 'console',
                severity: 'info',
              })
            }
            if (stagedResult.actionId === 'radio.on' || stagedResult.actionId === 'radio.off') {
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
            } else {
              appendConsoleEntry({
                layer: 'Commands',
                text: buildStagedPromptText(stagedResult.session, stagedResult.session.validChoices),
                source: 'console',
                severity: 'info',
              })
            }
            return
          }
          if (
            stagedResult.actionId === 'radio.url' ||
            stagedResult.actionId === 'radio.sampleBurstTime'
          ) {
            const audioSamplerState = useAudioSamplerStore.getState()
            const promptSession: ConsolePromptSession = {
              kind:
                stagedResult.actionId === 'radio.url'
                  ? 'radio.url'
                  : 'radio.sampleBurstTime',
              breadcrumb: stagedResult.breadcrumb,
              label:
                stagedResult.actionId === 'radio.url'
                  ? 'Radio Url'
                  : 'Radio SampleBurstTime',
              prefill:
                stagedResult.actionId === 'radio.url'
                  ? audioSamplerState.sourceUrl
                  : formatRadioSampleBurstTime(audioSamplerState.sampleBurstTime),
              returnSession: stagedResult.session,
            }
            setConsolePromptSession(promptSession)
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(stagedResult.breadcrumb),
              source: 'console',
              severity: 'info',
            })
            appendConsoleEntry({
              layer: 'Commands',
              text: buildConsolePromptSessionText(promptSession),
              source: 'console',
              severity: 'info',
            })
            requestRadioBurst(commandIdentity, 'enter')
            return
          }
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
            requestRadioBurst(commandIdentity, 'enter')
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
            requestRadioBurst(commandIdentity, 'enter')
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
              const sketchPlaneDescriptor = getActiveFeatureAssistDescriptor({
                sketchPlanePickSession: useSpaghettiStore.getState().sketchPlanePickSession,
                geometrySketchSession: useSpaghettiStore.getState().geometrySketchSession,
              })
              if (sketchPlaneDescriptor !== null) {
                appendConsoleEntry({
                  layer: 'Commands',
                  text: buildFeatureAssistPromptText(sketchPlaneDescriptor),
                  source: 'console',
                  severity: 'info',
                })
              }
              requestRadioBurst(commandIdentity, 'enter')
              return
            }
            startSketchDrawIntent(
              buildWorkspaceIntentDepsFromStoreState(),
              stagedResult.selections.graphDocumentId,
              stagedResult.selections.sketchNodeId,
            )
            requestRadioBurst(commandIdentity, 'enter')
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
          requestRadioBurst(commandIdentity, 'enter')
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
        if (
          sketchPlanePickSession.adjustScope === 'move-snap' ||
          sketchPlanePickSession.adjustScope === 'rotate-snap'
        ) {
          const numericValue = Number(trimmedInput)
          if (Number.isFinite(numericValue)) {
            const commandIdentity = resolveFeatureAssistSubmitIdentity(trimmedInput)
            appendConsoleEntry({
              layer: 'Commands',
              commandLineKind: 'user',
              text: `> ${trimmedInput}`,
            })
            pushCommandHistory(trimmedInput)
            requestRadioBurst(commandIdentity, 'enter')
            const prefsState = useUiPrefsStore.getState()
            if (sketchPlanePickSession.adjustScope === 'move-snap') {
              prefsState.setSketchPlaneToolbarTranslateSnapValue(numericValue)
              prefsState.setSketchPlaneToolbarTranslateSnapEnabled(true)
            } else {
              prefsState.setSketchPlaneToolbarRotateSnapValue(numericValue)
              prefsState.setSketchPlaneToolbarRotateSnapEnabled(true)
            }
            useSpaghettiStore.getState().runSketchPlaneCommand('back')
            return
          }
          if (trimmedInput === 'on' || trimmedInput === 'off') {
            const commandIdentity = resolveFeatureAssistSubmitIdentity(trimmedInput)
            appendConsoleEntry({
              layer: 'Commands',
              commandLineKind: 'user',
              text: `> ${trimmedInput}`,
            })
            pushCommandHistory(trimmedInput)
            requestRadioBurst(commandIdentity, 'enter')
            const prefsState = useUiPrefsStore.getState()
            const enabled = trimmedInput === 'on'
            if (sketchPlanePickSession.adjustScope === 'move-snap') {
              prefsState.setSketchPlaneToolbarTranslateSnapEnabled(enabled)
            } else {
              prefsState.setSketchPlaneToolbarRotateSnapEnabled(enabled)
            }
            useSpaghettiStore.getState().runSketchPlaneCommand('back')
            return
          }
        }
        if (sketchPlanePickSession.adjustScope === 'move') {
          const moveVector = parseConsoleVec3Literal(trimmedInput)
          if (moveVector !== null) {
            const commandIdentity = resolveFeatureAssistSubmitIdentity(trimmedInput)
            appendConsoleEntry({
              layer: 'Commands',
              commandLineKind: 'user',
              text: `> ${trimmedInput}`,
            })
            pushCommandHistory(trimmedInput)
            requestRadioBurst(commandIdentity, 'enter')
            const store = useSpaghettiStore.getState()
            store.setSketchPlanePickTranslationAxis('x', moveVector.x)
            store.setSketchPlanePickTranslationAxis('y', moveVector.y)
            store.setSketchPlanePickTranslationAxis('z', moveVector.z)
            store.acceptActiveSketchPlaneTransformCommand()
            return
          }
        }
        if (sketchPlanePickSession.adjustScope === 'rotate') {
          const rotateVector = parseConsoleVec3Literal(trimmedInput)
          if (rotateVector !== null) {
            const commandIdentity = resolveFeatureAssistSubmitIdentity(trimmedInput)
            appendConsoleEntry({
              layer: 'Commands',
              commandLineKind: 'user',
              text: `> ${trimmedInput}`,
            })
            pushCommandHistory(trimmedInput)
            requestRadioBurst(commandIdentity, 'enter')
            const store = useSpaghettiStore.getState()
            store.setSketchPlanePickRotationAxis('x', rotateVector.x)
            store.setSketchPlanePickRotationAxis('y', rotateVector.y)
            store.setSketchPlanePickRotationAxis('z', rotateVector.z)
            store.acceptActiveSketchPlaneTransformCommand()
            return
          }
        }
        if (
          trimmedInput === 'xy' ||
          trimmedInput === 'xz' ||
          trimmedInput === 'yz' ||
          trimmedInput === 'move' ||
          trimmedInput === 'm' ||
          trimmedInput === 'rotate' ||
          trimmedInput === 'r' ||
          trimmedInput === 'done' ||
          trimmedInput === 'd' ||
          trimmedInput === 'confirmtosketch' ||
          trimmedInput === 'c' ||
          ((sketchPlanePickSession.adjustScope === 'move' ||
            sketchPlanePickSession.adjustScope === 'rotate') &&
            trimmedInput === 'snap') ||
          (sketchPlanePickSession.adjustScope === 'move' && trimmedInput === 'x') ||
          (sketchPlanePickSession.adjustScope === 'move' && trimmedInput === 'y') ||
          (sketchPlanePickSession.adjustScope === 'move' && trimmedInput === 'z') ||
          (sketchPlanePickSession.adjustScope === 'rotate' && trimmedInput === 'x') ||
          (sketchPlanePickSession.adjustScope === 'rotate' && trimmedInput === 'y') ||
          (sketchPlanePickSession.adjustScope === 'rotate' && trimmedInput === 'z') ||
          trimmedInput === 'move x' ||
          trimmedInput === 'mx' ||
          trimmedInput === 'move y' ||
          trimmedInput === 'my' ||
          trimmedInput === 'move z' ||
          trimmedInput === 'mz' ||
          trimmedInput === 'rotate x' ||
          trimmedInput === 'rx' ||
          trimmedInput === 'rotate y' ||
          trimmedInput === 'ry' ||
          trimmedInput === 'rotate z' ||
          trimmedInput === 'rz'
        ) {
          const commandIdentity = resolveFeatureAssistSubmitIdentity(trimmedInput)
          appendConsoleEntry({
            layer: 'Commands',
            commandLineKind: 'user',
            text: `> ${trimmedInput}`,
          })
          pushCommandHistory(trimmedInput)
          requestRadioBurst(commandIdentity, 'enter')
          let command: SketchPlaneCommand
          if (trimmedInput === 'xy' || trimmedInput === 'xz' || trimmedInput === 'yz') {
            command = trimmedInput
          } else if (trimmedInput === 'move' || trimmedInput === 'm') {
            command = 'move'
          } else if (trimmedInput === 'rotate' || trimmedInput === 'r') {
            command = 'rotate'
          } else if (trimmedInput === 'done' || trimmedInput === 'd') {
            command = 'done'
          } else if (trimmedInput === 'confirmtosketch' || trimmedInput === 'c') {
            command = 'confirm-to-sketch'
          } else if (trimmedInput === 'snap') {
            command =
              sketchPlanePickSession.adjustScope === 'rotate' ? 'rotate-snap' : 'move-snap'
          } else if (
            (sketchPlanePickSession.adjustScope === 'rotate' && trimmedInput === 'x') ||
            trimmedInput === 'rotate x' ||
            trimmedInput === 'rx'
          ) {
            command = 'rotate-x'
          } else if (
            (sketchPlanePickSession.adjustScope === 'rotate' && trimmedInput === 'y') ||
            trimmedInput === 'rotate y' ||
            trimmedInput === 'ry'
          ) {
            command = 'rotate-y'
          } else if (
            (sketchPlanePickSession.adjustScope === 'rotate' && trimmedInput === 'z') ||
            trimmedInput === 'rotate z' ||
            trimmedInput === 'rz'
          ) {
            command = 'rotate-z'
          } else if (trimmedInput === 'x' || trimmedInput === 'move x' || trimmedInput === 'mx') {
            command = 'move-x'
          } else if (trimmedInput === 'y' || trimmedInput === 'move y' || trimmedInput === 'my') {
            command = 'move-y'
          } else {
            command = 'move-z'
          }
          useSpaghettiStore.getState().runSketchPlaneCommand(command)
          return
        }
        if (trimmedInput === 'esc' || trimmedInput === 'back' || trimmedInput === 'b') {
          const commandIdentity =
            trimmedInput === 'esc' ? null : resolveFeatureAssistSubmitIdentity(trimmedInput)
          if (trimmedInput !== 'esc') {
            appendConsoleEntry({
              layer: 'Commands',
              commandLineKind: 'user',
              text: `> ${trimmedInput}`,
            })
          }
          pushCommandHistory(trimmedInput)
          requestRadioBurst(commandIdentity, 'enter')
          useSpaghettiStore
            .getState()
            .runSketchPlaneCommand(trimmedInput === 'esc' ? 'esc' : 'back')
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
          spaghettiState.runGeometrySketchDrawCommand(trimmedInput as 'line' | 'l')
          return
        }
        if (trimmedInput === 'pline' || trimmedInput === 'pl') {
          appendConsoleEntry({
            layer: 'Commands',
            commandLineKind: 'user',
            text: `> ${trimmedInput}`,
          })
          pushCommandHistory(trimmedInput)
          spaghettiState.runGeometrySketchDrawCommand(trimmedInput as 'pline' | 'pl')
          return
        }
        if (trimmedInput === 'enter') {
          appendConsoleEntry({
            layer: 'Commands',
            commandLineKind: 'user',
            text: '> enter',
          })
          pushCommandHistory('enter')
          spaghettiState.runGeometrySketchDrawCommand('enter')
          return
        }
        if (trimmedInput === 'esc' || trimmedInput === 'back' || trimmedInput === 'b') {
          if (trimmedInput !== 'esc') {
            appendConsoleEntry({
              layer: 'Commands',
              commandLineKind: 'user',
              text: `> ${trimmedInput}`,
            })
          }
          pushCommandHistory(trimmedInput)
          spaghettiState.runGeometrySketchDrawCommand(
            trimmedInput as 'esc' | 'back' | 'b',
          )
          return
        }
        if (trimmedInput === 'x') {
          appendConsoleEntry({
            layer: 'Commands',
            commandLineKind: 'user',
            text: '> x',
          })
          pushCommandHistory('x')
          spaghettiState.runGeometrySketchDrawCommand('x')
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
        useSpaghettiStore.getState().runSketchPlaneCommand('x')
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
      const flatCommandIdentity = resolveConsoleRadioCommandIdentity({
        kind: 'flatCommand',
        commandName: parsed.name,
      })
      trackRadioCommandIdentity(flatCommandIdentity)

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
          requestRadioBurst(flatCommandIdentity, 'enter')
          appendConsoleEntry({
            layer: 'Commands',
            text: 'Commands: help, console, clear, history, frame, zoom, move, rotate, scale, snap, echo, status',
            severity: 'info',
          })
          return
        case 'console': {
          useConsoleStore.getState().toggleExpanded()
          const nextState = useConsoleStore.getState()
          requestRadioBurst(flatCommandIdentity, 'enter')
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
          requestRadioBurst(flatCommandIdentity, 'enter')
          appendConsoleEntry({
            layer: 'Diagnostics',
            text: 'Console clear is disabled for now',
            source: 'console',
            severity: 'warn',
          })
          return
        case 'history':
          requestRadioBurst(flatCommandIdentity, 'enter')
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
          requestRadioBurst(flatCommandIdentity, 'enter')
          appendConsoleEntry({
            layer: 'View',
            text: 'Frame all',
            source: 'console',
            severity: 'info',
          })
          return
        case 'zoom':
          viewer?.frameSelected(appState.selectedPartKey)
          requestRadioBurst(flatCommandIdentity, 'enter')
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
          requestRadioBurst(flatCommandIdentity, 'enter')
          dispatchImmediateShortcut('m')
          return
        case 'rotate':
          requestRadioBurst(flatCommandIdentity, 'enter')
          dispatchImmediateShortcut('r')
          return
        case 'scale':
          requestRadioBurst(flatCommandIdentity, 'enter')
          dispatchImmediateShortcut('s')
          return
        case 'snap':
          if (activeReferenceId === null) {
            requestRadioBurst(flatCommandIdentity, 'enter')
            appendConsoleEntry({
              layer: 'Diagnostics',
              text: 'Snap requires an active reference transform session',
              source: 'console',
              severity: 'warn',
            })
            return
          }
          appState.setReferenceRotateSnapEnabled(activeReferenceId, !rotateSnapState.enabled)
          requestRadioBurst(flatCommandIdentity, 'enter')
          appendConsoleEntry({
            layer: 'Transforms',
            text: `Rotate snap ${rotateSnapState.enabled ? 'disabled' : 'enabled'}`,
            source: 'console',
            severity: 'info',
          })
          return
        case 'echo':
          requestRadioBurst(flatCommandIdentity, 'enter')
          appendConsoleEntry({
            layer: 'Commands',
            text: parsed.argumentText.length === 0 ? '(empty)' : parsed.argumentText,
            source: 'console',
            severity: 'info',
          })
          return
        case 'status':
          requestRadioBurst(flatCommandIdentity, 'enter')
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
      requestRadioBurst,
      setStagedNavigationSession,
      trackRadioCommandIdentity,
    ],
  )

  useEffect(() => {
    const spaghettiState = useSpaghettiStore.getState()
    if (
      stagedNavigationSession?.scopeId !== 'graphNodeList' ||
      stagedNavigationSession.selections.graphDocumentId === null
    ) {
      if (spaghettiState.consolePreviewNodeId !== null) {
        spaghettiState.setConsolePreviewNodeId(null)
      }
      return
    }

    const graphDocument = selectGraphDocumentById(
      spaghettiState,
      stagedNavigationSession.selections.graphDocumentId,
    )
    const nodeChoiceIndex = stagedChoiceIndex ?? 0
    const targetedNode =
      graphDocument?.graph.nodes[nodeChoiceIndex] ?? null
    const nextPreviewNodeId =
      targetedNode !== null &&
      stagedNavigationSession.validChoices[nodeChoiceIndex]?.canonicalToken !== 'BACK'
        ? targetedNode.nodeId
        : null

    if (spaghettiState.consolePreviewNodeId !== nextPreviewNodeId) {
      spaghettiState.setConsolePreviewNodeId(nextPreviewNodeId)
    }
  }, [stagedChoiceIndex, stagedNavigationSession])

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
        handleEscCancelCommand()
        return
      }
      if (
        (routing.owner === 'staged-console' ||
          consolePromptSession !== null ||
          featureAssistDescriptor !== null) &&
        event.key === 'ArrowUp'
      ) {
        event.preventDefault()
        event.stopImmediatePropagation()
        focusMainConsoleInput()
        cycleStagedChoiceWithRadioBurst('previous', 'arrowUp')
        return
      }
      if (
        (routing.owner === 'staged-console' ||
          consolePromptSession !== null ||
          featureAssistDescriptor !== null) &&
        event.key === 'ArrowDown'
      ) {
        event.preventDefault()
        event.stopImmediatePropagation()
        focusMainConsoleInput()
        cycleStagedChoiceWithRadioBurst('next', 'arrowDown')
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
    cycleStagedChoiceWithRadioBurst,
    consolePromptSession,
    featureAssistDescriptor,
    focusMainConsoleInput,
    handleEscCancelCommand,
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
        handleEscCancelCommand()
        return
      }
      if (
        (routing.owner === 'staged-console' ||
          consolePromptSession !== null ||
          featureAssistDescriptor !== null) &&
        event.key === 'ArrowUp'
      ) {
        event.preventDefault()
        event.stopImmediatePropagation()
        focusPopoutConsoleInput()
        cycleStagedChoiceWithRadioBurst('previous', 'arrowUp')
        return
      }
      if (
        (routing.owner === 'staged-console' ||
          consolePromptSession !== null ||
          featureAssistDescriptor !== null) &&
        event.key === 'ArrowDown'
      ) {
        event.preventDefault()
        event.stopImmediatePropagation()
        focusPopoutConsoleInput()
        cycleStagedChoiceWithRadioBurst('next', 'arrowDown')
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
    cycleStagedChoiceWithRadioBurst,
    consolePromptSession,
    featureAssistDescriptor,
    focusPopoutConsoleInput,
    handleEscCancelCommand,
    popoutHost,
    routeConsoleGlobalKey,
    seedInputText,
    windowMode,
  ])

  useEffect(() => {
    if (stagedNavigationSession !== null || consolePromptSession !== null) {
      return
    }
    setFeatureAssistDescriptor(
      getActiveFeatureAssistDescriptor({
        sketchPlanePickSession,
        geometrySketchSession,
      }),
    )
  }, [
    consolePromptSession,
    geometrySketchSession,
    setFeatureAssistDescriptor,
    sketchPlanePickSession,
    stagedNavigationSession,
  ])

  useEffect(() => {
    if (sketchPlanePickSession?.stage !== 'pick') {
      useSpaghettiStore.getState().setSketchPlanePickPreviewPlane(null)
      return
    }
    const normalizedInput = consoleInputText.trim().toUpperCase()
    const previewToken =
      isStagedChoiceManualOverride === true
        ? normalizedInput
        : featureAssistDescriptor?.choices[stagedChoiceIndex ?? 0]?.canonicalToken ?? normalizedInput
    useSpaghettiStore.getState().setSketchPlanePickPreviewPlane(
      previewToken === 'XY' || previewToken === 'XZ' || previewToken === 'YZ'
        ? previewToken
        : null,
    )
  }, [
    consoleInputText,
    featureAssistDescriptor,
    isStagedChoiceManualOverride,
    sketchPlanePickSession?.stage,
    stagedChoiceIndex,
  ])

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
        onCancelCommand={handleEscCancelCommand}
        onCycleGuidedChoice={handleGuidedChoiceCycle}
        treatSpaceAsSubmit={treatSpaceAsSubmit}
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
              onCancelCommand={handleEscCancelCommand}
              onCycleGuidedChoice={handleGuidedChoiceCycle}
              treatSpaceAsSubmit={treatSpaceAsSubmit}
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
            onCancelCommand={handleEscCancelCommand}
            onCycleGuidedChoice={handleGuidedChoiceCycle}
            treatSpaceAsSubmit={treatSpaceAsSubmit}
          />
        ) : null}
        {floatingWindow}
      </div>
      {popoutSurface}
    </>
  )
}
