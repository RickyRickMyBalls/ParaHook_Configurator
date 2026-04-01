import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { createPortal } from 'react-dom'
import { isEditableTarget, routeKeyboardInput } from '../inputRouting'
import { getViewer } from '../viewerBridge'
import { requestRadioRuntimeWarmup } from '../../runtime/audio/radioRuntimeWarmup'
import { revealFinishedSketch } from '../sketch/finishSketchVisibility'
import {
  type RadioBurstTriggerKind,
  useAudioSamplerStore,
} from '../store/audioSamplerStore'
import {
  DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE,
  type ReferenceTransformSnapAxis,
  type ReferenceTransformSnapMode,
  REFERENCE_ROOT_ROW_ID,
  buildImportedReferenceRowId,
  buildReferenceCategoryRowId,
  buildObjectPartKeys,
  resolveOwnedContentSelection,
  resolveReferenceRuntimeTraits,
  resolveReferenceIdsForWorkspaceTarget,
  resolveWorkspaceSelectedContentOwnerTarget,
  resolveSingleTargetContentSelection,
  selectCurrentProjectTopLevelAssemblies,
  selectConsoleWorkspaceContextTarget,
  selectReferenceWorkspaceBrowserTree,
  useAppStore,
} from '../store/useAppStore'
import { useUiPrefsStore } from '../store/uiPrefsStore'
import { useWorkspaceChildWindow } from '../workspace/useWorkspaceChildWindow'
import {
  findSlottedSurfaceInstanceIdByKind,
  floatWorkspaceSurface,
  popoutWorkspaceSurface,
} from '../workspace/workspaceSurfaceActions'
import {
  activateGraphDocumentIntent,
  activateGraphNodeIntent,
  selectTargetIntent,
  startSketchDrawIntent,
  startSketchPlaneIntent,
  type WorkspaceIntentDeps,
} from '../store/workspaceIntents'
import { commitWorkspaceTargetSelection } from '../store/workspaceSelectionCommands'
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
  selectEditorViewportSelectedNodeId,
  selectGraphDocumentById,
  selectOrderedGraphDocuments,
  useSpaghettiStore,
} from '../spaghetti/store/useSpaghettiStore'
import { ConsoleBar } from './ConsoleBar'
import { ConsolePanel } from './ConsolePanel'
import { resolveConsoleRadioCommandIdentity } from './radioCommandIdentity'
import {
  applyReferenceTransformAxisValue,
  applyReferenceTransformPlaneValue,
  applyReferenceTransformVec3Value,
  buildReferenceConsoleWorkspaceTarget,
  buildReferenceTransformAssistDescriptor,
  buildReferenceTransformAxisPromptSession,
  buildReferenceTransformPlanePromptSession,
  getReferenceTransformPromptPrefill,
  isSameReferenceTransformPromptSession,
  parseReferenceTransformAxisInput,
  resolveReferenceTransformPromptSessionFromHandle,
} from './referenceTransformConsole'
import {
  appendConsoleEntry,
  formatConsoleEntryLayerLabel,
  isConsoleEntryVisible,
  type ConsolePromptSession,
  useConsoleStore,
} from './useConsoleStore'
import type { ConsoleAssistDescriptor, ConsoleFloatingRect } from './consoleTypes'
import {
  buildContentTransformRootChoices,
  buildReferenceTransformRootChoices,
  cancelConsoleStagedNavigationSession,
  createContentObjectTransformRootSession,
  createConsoleRootSession,
  createReferenceTransformRootSessionForTarget,
  createSketchDrawZoomRootSession,
  createSketchDrawRootSession,
  createConsoleStagedNavigationContext,
  isConsoleStagedNavigationRootToken,
  resolveConsoleWorkspaceContextSync,
  submitConsoleStagedNavigationToken,
  type ConsoleStagedNavigationChoice,
  type ConsoleStagedNavigationSession,
} from './stagedNavigation'
import {
  frameAllCommand,
  frameExtentsCommand,
  framePreviousCommand,
  frameSelectionSetCommand,
  frameReferenceCommand,
  frameSelectedCommand,
  frameSelectedGeometrySketchCommand,
  setConsoleCameraModeCommand,
  setProjectionModeCommand,
} from '../viewCommands'

const FLOATING_MIN_WIDTH = 420
const FLOATING_MIN_HEIGHT = 220
const FLOATING_VIEWPORT_MARGIN = 12
const POPOUT_WINDOW_FEATURES =
  'popup=yes,width=1080,height=720,resizable=yes,scrollbars=no'
const CONSOLE_POPOUT_SPEC = {
  childWindowId: 'console-surface-popout',
  owner: 'child-window' as const,
  windowName: 'parahook-console',
  windowTitle: 'ParaHook Console',
  windowFeatures: POPOUT_WINDOW_FEATURES,
}

type ConsoleDockProps = {
  listLeftOffset?: number
  suppressDockedSurface?: boolean
  slotHeaderDragSeed?: {
    pointerId: number
    clientX: number
    clientY: number
    pointerOffsetX: number
    pointerOffsetY: number
    titleBarHeight: number
  } | null
  onConsumeSlotHeaderDragSeed?: () => void
}

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'
type ConsoleCommandName =
  | 'help'
  | 'console'
  | 'clear'
  | 'history'
  | 'frame'
  | 'zoom'
  | 'pan'
  | 'orbit'
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

const DRAW_VEC2_LITERAL_PATTERN =
  /^\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*,\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))\s*$/

const parseConsoleVec2Literal = (
  rawValue: string,
): { x: number; y: number } | null => {
  const matched = rawValue.match(DRAW_VEC2_LITERAL_PATTERN)
  if (matched === null) {
    return null
  }
  const x = Number(matched[1])
  const y = Number(matched[2])
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return null
  }
  return { x, y }
}

const formatGeometrySketchStatusNumber = (value: number): string => {
  const normalized = Math.abs(value) < 0.0005 ? 0 : value
  const trimmed = normalized.toFixed(3).replace(/\.?0+$/, '')
  return trimmed === '-0' ? '0' : trimmed
}

const formatGeometrySketchStatusVec2 = (
  point: { x: number; y: number } | null,
): string =>
  point === null
    ? 'Vec(?,?)'
    : `Vec(${formatGeometrySketchStatusNumber(point.x)},${formatGeometrySketchStatusNumber(point.y)})`

const formatGeometrySketchStatusFloat = (value: number | null): string =>
  value === null ? 'Float(?)' : `Float(${formatGeometrySketchStatusNumber(value)})`

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
    pan: 'pan',
    orbit: 'orbit',
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

const normalizeConsoleBranchTokens = (args: string[]): string[] =>
  args
    .map((token) => token.trim())
    .filter((token) => token.length > 0 && token !== '>')
    .map((token) => token.toLowerCase())

const parseZoomCommandAction = (
  args: string[],
): 'all' | 'extents' | 'previous' | 'window' | 'object' | null => {
  const normalizedTokens = normalizeConsoleBranchTokens(args)
  const terminalToken = normalizedTokens.at(-1) ?? null
  if (terminalToken === null) {
    return null
  }
  if (terminalToken === 'a' || terminalToken === 'all') {
    return 'all'
  }
  if (terminalToken === 'e' || terminalToken === 'extents') {
    return 'extents'
  }
  if (terminalToken === 'p' || terminalToken === 'previous') {
    return 'previous'
  }
  if (terminalToken === 'w' || terminalToken === 'window') {
    return 'window'
  }
  if (terminalToken === 'o' || terminalToken === 'object') {
    return 'object'
  }
  return null
}

const formatStagedBreadcrumb = (breadcrumb: string[]): string => breadcrumb.join(' > ')

const formatStagedChoiceSummary = (choices: ConsoleStagedNavigationChoice[]): string =>
  choices.map((choice) => choice.label).join(', ')

const formatAssistChoiceSummary = (descriptor: ConsoleAssistDescriptor): string =>
  descriptor.choices.map((choice) => choice.label).join(', ')

const buildFeatureAssistPromptText = (descriptor: ConsoleAssistDescriptor): string =>
  descriptor.choices.length === 0
    ? `${(descriptor.breadcrumb ?? [descriptor.label]).join(' > ')}${
        descriptor.summaryLeadText ?? ''
      }`
    : `${descriptor.label} > [${formatAssistChoiceSummary(descriptor)}]`

const formatSketchPlaneVec3ChoiceLabel = (values: {
  x: number
  y: number
  z: number
}): string =>
  `Vec3(${values.x.toFixed(1)}, ${values.y.toFixed(1)}, ${values.z.toFixed(1)})`

const formatSketchPlaneAxisValueToken = (value: number): string => value.toFixed(1)

const buildSketchPlaneMoveAxisConfirmChoiceLabel = (literal: string): string =>
  `confirm ${literal} off snap`

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
        { canonicalToken: 'MOVE AGAIN', aliases: ['M'], label: 'Move Again' },
        { canonicalToken: 'MOVE X', aliases: ['X', 'MX'], label: 'Move X' },
        { canonicalToken: 'MOVE Y', aliases: ['Y', 'MY'], label: 'Move Y' },
        { canonicalToken: 'MOVE Z', aliases: ['Z', 'MZ'], label: 'Move Z' },
        { canonicalToken: 'SNAP', aliases: [], label: 'Snap' },
        { canonicalToken: 'BACK', aliases: ['B'], label: 'Back' },
      ],
    }
  }
  if (sketchPlanePickSession.adjustScope === 'move-axis') {
    const axis = sketchPlanePickSession.activeTransformAxis
    if (axis === 'x' || axis === 'y' || axis === 'z') {
      const axisLabel = axis.toUpperCase()
      const axisValueToken = formatSketchPlaneAxisValueToken(
        sketchPlanePickSession.draftTransform.translation[axis],
      )
      const pendingConfirmation = sketchPlanePickSession.pendingMoveAxisOffSnapConfirmation
      if (pendingConfirmation !== null) {
        const confirmLabel = buildSketchPlaneMoveAxisConfirmChoiceLabel(
          pendingConfirmation.literal,
        )
        return {
          label: `Sketch Plane > Move > ${axisLabel} > ${confirmLabel}`,
          breadcrumb: ['Graph', 'Sketch', 'Sketch Plane', 'Move', axisLabel],
          prefill: 'confirm',
          choices: [
            { canonicalToken: 'CONFIRM', aliases: [], label: 'confirm' },
            { canonicalToken: 'DENY', aliases: [], label: 'deny' },
          ],
        }
      }
      return {
        label: `Sketch Plane > Move > ${axisLabel}`,
        breadcrumb: ['Graph', 'Sketch', 'Sketch Plane', 'Move', axisLabel],
        prefill: axisValueToken,
        choices: [
          { canonicalToken: axisValueToken, aliases: [], label: axisValueToken },
          { canonicalToken: 'BACK', aliases: ['B'], label: 'Back' },
        ],
      }
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

const buildSketchDrawFeatureAssistDescriptor = (
  geometrySketchSession: NonNullable<
    ReturnType<typeof useSpaghettiStore.getState>['geometrySketchSession']
  >,
): ConsoleAssistDescriptor => {
  const idleChoices: ConsoleAssistDescriptor['choices'] = [
    { canonicalToken: 'LINE', aliases: ['L'], label: 'Line' },
    { canonicalToken: 'PLINE', aliases: ['PL'], label: 'PLine' },
    { canonicalToken: 'RECTANGLE', aliases: ['REC'], label: 'Rectangle' },
    { canonicalToken: 'CIRCLE', aliases: ['CC'], label: 'Circle' },
    { canonicalToken: 'CAMERA', aliases: ['C'], label: 'Camera' },
    { canonicalToken: 'ZOOM', aliases: ['Z'], label: 'Zoom' },
    ...(geometrySketchSession.selectedComponentIds.length > 0
      ? [{ canonicalToken: 'DELETE', aliases: ['DEL'], label: 'Delete' }]
      : []),
    ...(geometrySketchSession.lastUsedTool !== null
      ? [{ canonicalToken: 'PREVIOUS', aliases: ['P'], label: 'Previous' }]
      : []),
    { canonicalToken: 'X', aliases: [], label: 'X' },
  ]

  if (
    geometrySketchSession.activeTool !== 'line' &&
    geometrySketchSession.activeTool !== 'pline' &&
    geometrySketchSession.activeTool !== 'rectangle' &&
    geometrySketchSession.activeTool !== 'circle'
  ) {
    const idlePrefill =
      geometrySketchSession.lastUsedTool === 'pline'
        ? 'PLine'
        : geometrySketchSession.lastUsedTool === 'rectangle'
          ? 'Rectangle'
          : geometrySketchSession.lastUsedTool === 'circle'
            ? 'Circle'
            : geometrySketchSession.lastUsedTool === 'line'
              ? 'Line'
              : 'Line'
    return {
      label: 'Sketch Draw',
      breadcrumb: ['Graph', 'Sketch', 'Sketch Draw'],
      prefill: idlePrefill,
      choices: idleChoices,
    }
  }

  if (geometrySketchSession.activeTool === 'circle') {
    const centerPoint = geometrySketchSession.drawDraft?.points[0] ?? null
    const hoverPoint = geometrySketchSession.drawDraft?.hoverPoint ?? null
    const hoverRadius =
      centerPoint !== null && hoverPoint !== null
        ? Math.hypot(hoverPoint.x - centerPoint.x, hoverPoint.y - centerPoint.y)
        : null
    return {
      label: 'Sketch Draw',
      breadcrumb:
        centerPoint === null
          ? [
              'Graph',
              'Sketch',
              'Sketch Draw',
              'Circle',
              'Center',
              formatGeometrySketchStatusVec2(hoverPoint),
            ]
          : [
              'Graph',
              'Sketch',
              'Sketch Draw',
              'Circle',
              `Center ${formatGeometrySketchStatusVec2(centerPoint)}`,
              'Radius',
              formatGeometrySketchStatusFloat(hoverRadius),
            ],
      prefill: null,
      choices: [],
    }
  }

  const pointIndex =
    geometrySketchSession.activeTool === 'line' || geometrySketchSession.activeTool === 'rectangle'
      ? geometrySketchSession.drawDraft?.points.length === 0
        ? 1
        : 2
      : (geometrySketchSession.drawDraft?.points.length ?? 0) + 1

  const toolToken =
    geometrySketchSession.activeTool === 'line'
      ? 'L'
      : geometrySketchSession.activeTool === 'pline'
        ? 'PL'
        : 'REC'

  return {
    label: 'Sketch Draw',
    breadcrumb: [
      'Graph',
      'Sketch',
      'Sketch Draw',
      toolToken,
      `P${pointIndex}`,
      formatGeometrySketchStatusVec2(geometrySketchSession.drawDraft?.hoverPoint ?? null),
    ],
    prefill: null,
    choices: [],
  }
}

const buildSketchDrawCameraAssistDescriptor = (): ConsoleAssistDescriptor => ({
  label: 'Sketch Draw > Camera',
  breadcrumb: ['Graph', 'Sketch', 'Sketch Draw', 'Camera'],
  prefill: 'Projection',
  choices: [
    { canonicalToken: 'PROJECTION', aliases: [], label: 'Projection' },
    { canonicalToken: 'BACK', aliases: ['B'], label: 'Back' },
  ],
})

const buildSketchDrawCameraProjectionAssistDescriptor = (): ConsoleAssistDescriptor => {
  const projectionMode = useUiPrefsStore.getState().view.projectionMode
  return {
    label: 'Sketch Draw > Camera > Projection',
    breadcrumb: ['Graph', 'Sketch', 'Sketch Draw', 'Camera', 'Projection'],
    prefill: projectionMode === 'orthographic' ? 'Orthographic' : 'Perspective',
    choices: [
      { canonicalToken: 'ORTHOGRAPHIC', aliases: ['O'], label: 'Orthographic' },
      { canonicalToken: 'PERSPECTIVE', aliases: ['P'], label: 'Perspective' },
      { canonicalToken: 'BACK', aliases: ['B'], label: 'Back' },
    ],
  }
}

const getActiveFeatureAssistDescriptor = ({
  sketchPlanePickSession,
  geometrySketchSession,
  referenceWorkspace,
  stagedNavigationSession,
}: {
  sketchPlanePickSession: ReturnType<typeof useSpaghettiStore.getState>['sketchPlanePickSession']
  geometrySketchSession: ReturnType<typeof useSpaghettiStore.getState>['geometrySketchSession']
  referenceWorkspace: ReturnType<typeof useAppStore.getState>['referenceWorkspace']
  stagedNavigationSession: ConsoleStagedNavigationSession | null
}): ConsoleAssistDescriptor | null => {
  if (sketchPlanePickSession !== null) {
    return buildSketchPlaneFeatureAssistDescriptor(sketchPlanePickSession)
  }
  const referenceTransformDescriptor = buildReferenceTransformAssistDescriptor(
    referenceWorkspace,
    stagedNavigationSession,
  )
  if (referenceTransformDescriptor !== null) {
    return referenceTransformDescriptor
  }
  if (
    geometrySketchSession?.mode === 'draw' &&
    geometrySketchSession.activeTool !== null
  ) {
    return buildSketchDrawFeatureAssistDescriptor(geometrySketchSession)
  }
  return null
}

const getStagedScopeLabel = (session: ConsoleStagedNavigationSession | null): string | null => {
  if (session === null) {
    return null
  }
  switch (session.scopeId) {
    case 'root':
      return 'Root'
    case 'cameraRoot':
      return 'Camera'
    case 'cameraProjectionRoot':
      return 'Camera > Projection'
    case 'zoomRoot':
      return 'Zoom'
    case 'sketchDrawRoot':
      return 'Graph > Sketch > Sketch Draw'
    case 'sketchDrawCameraRoot':
      return 'Graph > Sketch > Sketch Draw > Camera'
    case 'sketchDrawCameraProjectionRoot':
      return 'Graph > Sketch > Sketch Draw > Camera > Projection'
    case 'sketchDrawZoomRoot':
      return 'Graph > Sketch > Sketch Draw > Zoom'
    case 'radioRoot':
      return 'Radio'
    case 'graphRoot':
    case 'graphSelected':
      return 'Graph'
    case 'graphZoomRoot':
      return 'Graph > Zoom'
    case 'graphZoomCanvas':
      return 'Graph > Zoom > Canvas'
    case 'graphZoomModelViewport':
      return 'Graph > Zoom > Model Viewport'
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
    case 'contentRoot':
      return 'Content'
    case 'contentAssemblySelected':
      return 'Content'
    case 'contentAssemblyZoomRoot':
      return formatStagedBreadcrumb(session.breadcrumb)
    case 'contentComponentSelected':
      return 'Content'
    case 'contentObjectSelected':
      return 'Content'
    case 'contentObjectTransformRoot':
    case 'contentObjectTransformSettingsRoot':
    case 'contentObjectTransformSpaceRoot':
    case 'contentObjectTransformSnapRoot':
    case 'contentObjectTransformMoveSnapRoot':
    case 'contentObjectTransformRotateSnapRoot':
    case 'contentObjectTransformScaleSnapRoot':
    case 'contentObjectTransformMoveSnapXRoot':
    case 'contentObjectTransformMoveSnapYRoot':
    case 'contentObjectTransformMoveSnapZRoot':
    case 'contentObjectTransformRotateSnapXRoot':
    case 'contentObjectTransformRotateSnapYRoot':
    case 'contentObjectTransformRotateSnapZRoot':
    case 'contentObjectTransformScaleSnapXRoot':
    case 'contentObjectTransformScaleSnapYRoot':
    case 'contentObjectTransformScaleSnapZRoot':
      return formatStagedBreadcrumb(session.breadcrumb)
    case 'contentObjectZoomRoot':
      return formatStagedBreadcrumb(session.breadcrumb)
    case 'multiSelectSelected':
      return null
    case 'multiSelectZoomRoot':
      return 'Zoom'
    case 'referencesSelected':
      return 'References'
    case 'referencesZoomRoot':
      return formatStagedBreadcrumb(session.breadcrumb)
    case 'referenceCategorySelected':
      return 'References'
    case 'referenceCategoryZoomRoot':
      return formatStagedBreadcrumb(session.breadcrumb)
    case 'referenceSelected':
      return 'Reference'
    case 'referenceTransformRoot':
    case 'referenceTransformSettingsRoot':
    case 'referenceTransformSpaceRoot':
    case 'referenceTransformSnapRoot':
    case 'referenceTransformMoveSnapRoot':
    case 'referenceTransformRotateSnapRoot':
    case 'referenceTransformScaleSnapRoot':
      return formatStagedBreadcrumb(session.breadcrumb)
    case 'referenceZoomRoot':
      return formatStagedBreadcrumb(session.breadcrumb)
    default:
      return null
  }
}

const buildStagedPromptText = (
  session: ConsoleStagedNavigationSession | null,
  choices: ConsoleStagedNavigationChoice[],
): string => {
  const scopeLabel = getStagedScopeLabel(session)
  if (
    session?.scopeId === 'referenceTransformMoveSnapRoot' ||
    session?.scopeId === 'referenceTransformRotateSnapRoot' ||
    session?.scopeId === 'referenceTransformScaleSnapRoot' ||
    session?.scopeId === 'contentObjectTransformMoveSnapRoot' ||
    session?.scopeId === 'contentObjectTransformRotateSnapRoot' ||
    session?.scopeId === 'contentObjectTransformScaleSnapRoot'
  ) {
    const choiceSummary = formatStagedChoiceSummary(choices)
    return `${scopeLabel} > Enter value [${choiceSummary}]`
  }
  const baseText =
    choices.length === 0
      ? 'No further choices in this staged scope yet'
      : `Choose next [${formatStagedChoiceSummary(choices)}]`
  return scopeLabel === null ? baseText : `${scopeLabel} > ${baseText}`
}

const buildReferenceTransformAxisPromptChoices = (
  promptSession: Extract<ConsolePromptSession, { kind: 'reference-transform.axis' }>,
): string[] => {
  const siblingAxes = (['X', 'Y', 'Z'] as const).filter(
    (axis) => axis !== promptSession.axis.toUpperCase(),
  )
  const modeChoices =
    promptSession.mode === 'translate'
      ? ['Scale', 'Rotate']
      : promptSession.mode === 'rotate'
        ? ['Move', 'Scale']
        : ['Move', 'Rotate']
  return ['Enter value', ...siblingAxes, ...modeChoices]
}

const buildConsolePromptSessionText = (
  promptSession: ConsolePromptSession,
): string => {
  if (promptSession.kind === 'reference-transform.axis') {
    return `${formatStagedBreadcrumb(promptSession.breadcrumb)} > Choose next [${buildReferenceTransformAxisPromptChoices(
      promptSession,
    ).join(', ')}]`
  }
  if (promptSession.kind === 'transform.delete-latest.confirm') {
    return `${formatStagedBreadcrumb(promptSession.breadcrumb)} > Are you sure? [${promptSession.prefill}]`
  }
  return `${formatStagedBreadcrumb(promptSession.breadcrumb)} > Enter value [${promptSession.prefill}]`
}

const buildRootPromptText = (
  choices: string[] = ['Graph', 'References', 'Camera', 'Radio', 'Zoom', 'Pan', 'Orbit'],
): string =>
  `Root > Choose next [${choices.join(', ')}]`

const ROOT_PROMPT_TEXT = buildRootPromptText()

const normalizeRadioCommandIdentity = (rawToken: string): string =>
  rawToken.trim().toUpperCase().replace(/\s+/g, ' ')

const getFeatureAssistChoiceInputText = (choice: ConsoleAssistDescriptor['choices'][number]): string => {
  const normalizedLabel = normalizeRadioCommandIdentity(choice.label)
  const compactLabel = normalizedLabel.replace(/\s+/gu, '')
  if (
    normalizedLabel === choice.canonicalToken ||
    compactLabel === choice.canonicalToken ||
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
    /^\s*(?:vec3\s*[\[(]\s*)?(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*(?:[\])]\s*)?$/i,
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

const parseConsoleSignedFloatLiteral = (input: string): number | null => {
  const trimmed = input.trim()
  if (!/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(trimmed)) {
    return null
  }
  const value = Number(trimmed)
  return Number.isFinite(value) ? value : null
}

const formatReferenceTransformSnapValue = (value: number): string =>
  Number.isInteger(value) ? `${value}` : `${Number(value.toFixed(4))}`

const getReferenceTransformSnapModeLabel = (mode: ReferenceTransformSnapMode): 'Move' | 'Rotate' | 'Scale' =>
  mode === 'translate' ? 'Move' : mode === 'rotate' ? 'Rotate' : 'Scale'

const getReferenceTransformSnapAxisLabel = (axis: ReferenceTransformSnapAxis): 'X' | 'Y' | 'Z' =>
  axis === 'x' ? 'X' : axis === 'y' ? 'Y' : 'Z'

const getReferenceTransformSnapDriverValue = (
  snapState: (typeof DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE)[ReferenceTransformSnapMode],
): number => snapState.values.x

const getReferenceTransformSnapAxisValue = (
  snapState: (typeof DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE)[ReferenceTransformSnapMode],
  axis: ReferenceTransformSnapAxis,
): number => snapState.values[axis]

const getReferenceTransformSnapScopeMode = (
  scopeId: ConsoleStagedNavigationSession['scopeId'] | null | undefined,
): ReferenceTransformSnapMode | null =>
  scopeId === 'referenceTransformMoveSnapRoot' ||
  scopeId === 'referenceTransformMoveSnapXRoot' ||
  scopeId === 'referenceTransformMoveSnapYRoot' ||
  scopeId === 'referenceTransformMoveSnapZRoot'
    ? 'translate'
    : scopeId === 'referenceTransformRotateSnapRoot' ||
        scopeId === 'referenceTransformRotateSnapXRoot' ||
        scopeId === 'referenceTransformRotateSnapYRoot' ||
        scopeId === 'referenceTransformRotateSnapZRoot'
      ? 'rotate'
      : scopeId === 'referenceTransformScaleSnapRoot' ||
          scopeId === 'referenceTransformScaleSnapXRoot' ||
          scopeId === 'referenceTransformScaleSnapYRoot' ||
          scopeId === 'referenceTransformScaleSnapZRoot'
        ? 'scale'
        : null

const getReferenceTransformSnapScopeAxis = (
  scopeId: ConsoleStagedNavigationSession['scopeId'] | null | undefined,
): ReferenceTransformSnapAxis | null =>
  scopeId === 'referenceTransformMoveSnapXRoot' ||
  scopeId === 'referenceTransformRotateSnapXRoot' ||
  scopeId === 'referenceTransformScaleSnapXRoot'
    ? 'x'
    : scopeId === 'referenceTransformMoveSnapYRoot' ||
        scopeId === 'referenceTransformRotateSnapYRoot' ||
        scopeId === 'referenceTransformScaleSnapYRoot'
      ? 'y'
      : scopeId === 'referenceTransformMoveSnapZRoot' ||
          scopeId === 'referenceTransformRotateSnapZRoot' ||
          scopeId === 'referenceTransformScaleSnapZRoot'
        ? 'z'
        : null

const isReferenceTransformSnapScope = (
  scopeId: ConsoleStagedNavigationSession['scopeId'] | null | undefined,
): boolean => getReferenceTransformSnapScopeMode(scopeId) !== null || scopeId === 'referenceTransformSnapRoot'

const isContentObjectTransformSnapScope = (
  scopeId: ConsoleStagedNavigationSession['scopeId'] | null | undefined,
): boolean =>
  scopeId === 'contentObjectTransformSnapRoot' ||
  scopeId === 'contentObjectTransformMoveSnapRoot' ||
  scopeId === 'contentObjectTransformRotateSnapRoot' ||
  scopeId === 'contentObjectTransformScaleSnapRoot' ||
  scopeId === 'contentObjectTransformMoveSnapXRoot' ||
  scopeId === 'contentObjectTransformMoveSnapYRoot' ||
  scopeId === 'contentObjectTransformMoveSnapZRoot' ||
  scopeId === 'contentObjectTransformRotateSnapXRoot' ||
  scopeId === 'contentObjectTransformRotateSnapYRoot' ||
  scopeId === 'contentObjectTransformRotateSnapZRoot' ||
  scopeId === 'contentObjectTransformScaleSnapXRoot' ||
  scopeId === 'contentObjectTransformScaleSnapYRoot' ||
  scopeId === 'contentObjectTransformScaleSnapZRoot'

const isValueAlignedToStep = (value: number, step: number): boolean => {
  if (!Number.isFinite(step) || step <= 0) {
    return true
  }
  const quotient = value / step
  return Math.abs(quotient - Math.round(quotient)) < 0.000001
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
    left.breadcrumb.length === right.breadcrumb.length &&
    left.breadcrumb.every((crumb, index) => crumb === right.breadcrumb[index]) &&
    left.selections.graphDocumentId === right.selections.graphDocumentId &&
    left.selections.selectedNodeId === right.selections.selectedNodeId &&
    left.selections.sketchNodeId === right.selections.sketchNodeId &&
    (left.selections.referenceId ?? null) === (right.selections.referenceId ?? null) &&
    (left.selections.referenceCategoryId ?? null) ===
      (right.selections.referenceCategoryId ?? null)
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

type ConsoleActionContext = {
  graphDocumentId: string | null
  editorViewportId: string | null
  selectedNodeId: string | null
}

const resolveEditorViewportIdForGraphDocumentFromState = (
  spaghettiState: ReturnType<typeof useSpaghettiStore.getState>,
  graphDocumentId: string,
): string | null => {
  const activeViewport =
    spaghettiState.editorViewportsById[spaghettiState.activeEditorViewportId] ?? null
  if (activeViewport?.graphDocumentId === graphDocumentId) {
    return activeViewport.editorViewportId
  }
  return (
    spaghettiState.editorViewportOrder.find((editorViewportId) => {
      const viewport = spaghettiState.editorViewportsById[editorViewportId]
      return viewport?.graphDocumentId === graphDocumentId
    }) ?? null
  )
}

const resolveConsoleGraphDocumentIdFromState = (
  appState: ReturnType<typeof useAppStore.getState>,
  spaghettiState: ReturnType<typeof useSpaghettiStore.getState>,
  preferredGraphDocumentId: string | null = null,
): string | null => {
  if (
    preferredGraphDocumentId !== null &&
    spaghettiState.graphDocumentsById[preferredGraphDocumentId] !== undefined
  ) {
    return preferredGraphDocumentId
  }
  const workspaceContextTarget = selectConsoleWorkspaceContextTarget(appState)
  if (
    workspaceContextTarget?.kind === 'graph-document' ||
    workspaceContextTarget?.kind === 'graph-node'
  ) {
    return workspaceContextTarget.graphDocumentId
  }
  if (
    workspaceContextTarget?.fallbackGraphDocumentId !== null &&
    workspaceContextTarget?.fallbackGraphDocumentId !== undefined &&
    spaghettiState.graphDocumentsById[workspaceContextTarget.fallbackGraphDocumentId] !== undefined
  ) {
    return workspaceContextTarget.fallbackGraphDocumentId
  }
  const selectedContentOwnerTarget = resolveWorkspaceSelectedContentOwnerTarget(
    appState,
    appState.workspaceSelection.selectedTarget,
  )
  if (
    selectedContentOwnerTarget?.fallbackGraphDocumentId !== null &&
    selectedContentOwnerTarget?.fallbackGraphDocumentId !== undefined &&
    spaghettiState.graphDocumentsById[selectedContentOwnerTarget.fallbackGraphDocumentId] !== undefined
  ) {
    return selectedContentOwnerTarget.fallbackGraphDocumentId
  }
  if (appState.workspaceSelection.selectedTarget?.kind === 'object') {
    const objectRecord =
      appState.projectContent.objectsById[appState.workspaceSelection.selectedTarget.objectId] ?? null
    const objectGraphDocumentId =
      objectRecord?.sourceGraphDocumentId ?? objectRecord?.ownerGraphDocumentId ?? null
    if (
      objectGraphDocumentId !== null &&
      spaghettiState.graphDocumentsById[objectGraphDocumentId] !== undefined
    ) {
      return objectGraphDocumentId
    }
  }
  return spaghettiState.activeGraphDocumentId.length > 0 ? spaghettiState.activeGraphDocumentId : null
}

const resolveConsoleActionContextFromState = (
  preferredGraphDocumentId: string | null = null,
): ConsoleActionContext => {
  const spaghettiState = useSpaghettiStore.getState()
  const appState = useAppStore.getState()
  const graphDocumentId = resolveConsoleGraphDocumentIdFromState(
    appState,
    spaghettiState,
    preferredGraphDocumentId,
  )
  const editorViewportId =
    graphDocumentId === null
      ? null
      : resolveEditorViewportIdForGraphDocumentFromState(spaghettiState, graphDocumentId)
  return {
    graphDocumentId,
    editorViewportId,
    selectedNodeId:
      editorViewportId === null
        ? null
        : selectEditorViewportSelectedNodeId(spaghettiState, editorViewportId),
  }
}

const ensureSpaghettiEditorVisibleForGraphRoot = (
  graphDocumentId: string | null,
): GraphRootEditorRevealRestore | null => {
  if (graphDocumentId === null) {
    return null
  }
  const spaghettiState = useSpaghettiStore.getState()
  const previousActiveEditorViewportId = spaghettiState.activeEditorViewportId
  const existingViewport =
    Object.values(spaghettiState.editorViewportsById).find(
      (viewport) => viewport.graphDocumentId === graphDocumentId,
    ) ?? null
  const viewportId =
    spaghettiState.openGraphDocumentInViewport(graphDocumentId) ??
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
) => {
  const appState = useAppStore.getState()
  const referenceTree = selectReferenceWorkspaceBrowserTree(appState)
  return createConsoleStagedNavigationContext(
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
    selectCurrentProjectTopLevelAssemblies(appState).map((assembly) => ({
      assemblyId: assembly.assemblyId,
      label: assembly.label,
      canDelete: assembly.assemblySourceKind === 'authored',
    })),
    referenceTree.categories.map((category) => ({
      categoryId: category.categoryId,
      label: category.label,
      canLoadAll: category.items.some(
        (item) => !item.isVisible || item.loadState === 'error' || item.loadState === 'unloaded',
      ),
      items: category.items.map((item) => ({
        referenceId: item.referenceId,
        label: item.label,
        canLoadModel: !item.isVisible || item.loadState === 'error' || item.loadState === 'unloaded',
      })),
    })),
    {
      hasSelection: (spaghettiState.geometrySketchSession?.selectedComponentIds.length ?? 0) > 0,
      hasPrevious: spaghettiState.geometrySketchSession?.lastUsedTool !== null,
      preferredTool:
        spaghettiState.geometrySketchSession?.activeTool === 'pline' ||
        spaghettiState.geometrySketchSession?.lastUsedTool === 'pline'
          ? 'PLINE'
          : spaghettiState.geometrySketchSession?.activeTool === 'rectangle' ||
              spaghettiState.geometrySketchSession?.lastUsedTool === 'rectangle'
            ? 'RECTANGLE'
            : spaghettiState.geometrySketchSession?.activeTool === 'circle' ||
                spaghettiState.geometrySketchSession?.lastUsedTool === 'circle'
              ? 'CIRCLE'
              : 'LINE',
    },
    appState.referenceWorkspace.activeReferenceTransformSession === null
      ? {}
      : {
          [appState.referenceWorkspace.activeReferenceTransformSession.referenceId]: {
            activeSessionId: appState.referenceWorkspace.activeReferenceTransformSession.sessionId,
            totalCommittedEntryCount: (
              appState.referenceWorkspace.transformHistoryByReferenceId[
                appState.referenceWorkspace.activeReferenceTransformSession.referenceId
              ] ?? []
            ).length,
            activeSessionCommittedEntryCount: (
              appState.referenceWorkspace.transformHistoryByReferenceId[
                appState.referenceWorkspace.activeReferenceTransformSession.referenceId
              ] ?? []
            ).filter(
              (entry) =>
                entry.sessionId === appState.referenceWorkspace.activeReferenceTransformSession?.sessionId,
            ).length,
          },
        },
    Object.fromEntries(
      Object.entries(appState.referenceWorkspace.transformSnapByReferenceId).map(
        ([referenceId, snapState]) => [
          referenceId,
          {
            translate: snapState.translate.xyzLocked,
            rotate: snapState.rotate.xyzLocked,
            scale: snapState.scale.xyzLocked,
          },
        ],
      ),
    ),
    Object.fromEntries(
      Object.entries(appState.referenceWorkspace.transformSnapByReferenceId).map(
        ([referenceId, snapState]) => [
          referenceId,
          {
            translate: snapState.translate.enabled,
            rotate: snapState.rotate.enabled,
            scale: snapState.scale.enabled,
          },
        ],
      ),
    ),
    Object.fromEntries(
      Object.entries(appState.referenceWorkspace.transformSnapByObjectId).map(
        ([objectId, snapState]) => [
          objectId,
          {
            translate: snapState.translate.xyzLocked,
            rotate: snapState.rotate.xyzLocked,
            scale: snapState.scale.xyzLocked,
          },
        ],
      ),
    ),
    Object.fromEntries(
      Object.entries(appState.referenceWorkspace.transformSnapByObjectId).map(
        ([objectId, snapState]) => [
          objectId,
          {
            translate: snapState.translate.enabled,
            rotate: snapState.rotate.enabled,
            scale: snapState.scale.enabled,
          },
        ],
      ),
    ),
    appState.referenceWorkspace.activeContentObjectTransformSession === null
      ? {}
      : {
          [appState.referenceWorkspace.activeContentObjectTransformSession.objectId]: {
            activeSessionId: appState.referenceWorkspace.activeContentObjectTransformSession.sessionId,
            totalCommittedEntryCount: (
              appState.referenceWorkspace.transformHistoryByObjectId[
                appState.referenceWorkspace.activeContentObjectTransformSession.objectId
              ] ?? []
            ).length,
            activeSessionCommittedEntryCount: (
              appState.referenceWorkspace.transformHistoryByObjectId[
                appState.referenceWorkspace.activeContentObjectTransformSession.objectId
              ] ?? []
            ).filter(
              (entry) =>
                entry.sessionId ===
                appState.referenceWorkspace.activeContentObjectTransformSession?.sessionId,
            ).length,
          },
        },
  )
}

const isSketchDrawLocalStagedScope = (
  session: ConsoleStagedNavigationSession | null,
): boolean =>
  session?.scopeId === 'sketchDrawRoot' ||
  session?.scopeId === 'sketchDrawCameraRoot' ||
  session?.scopeId === 'sketchDrawCameraProjectionRoot' ||
  session?.scopeId === 'sketchDrawZoomRoot'

const buildWorkspaceIntentDepsFromStoreState = (): WorkspaceIntentDeps => {
  const appState = useAppStore.getState()
  const spaghettiState = useSpaghettiStore.getState()
  return {
    app: {
      setWorkspaceSelectedTarget: appState.setWorkspaceSelectedTarget,
      setActiveSurface: appState.setActiveSurface,
      requestFloatingShellActivation: appState.requestFloatingShellActivation,
      setReferenceItemVisibility: appState.setReferenceItemVisibility,
      beginReferenceTransform: appState.beginReferenceTransformShell,
      selectPart: appState.selectPart,
    },
    spaghetti: {
      activeEditorViewportId: spaghettiState.activeEditorViewportId,
      editorViewportsById: spaghettiState.editorViewportsById,
      openGraphDocumentInViewport: spaghettiState.openGraphDocumentInViewport,
      openGraphDocumentInNewViewport: spaghettiState.openGraphDocumentInNewViewport,
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

export function ConsoleDock({
  listLeftOffset = 0,
  suppressDockedSurface = false,
  slotHeaderDragSeed = null,
  onConsumeSlotHeaderDragSeed,
}: ConsoleDockProps) {
  const dockRef = useRef<HTMLDivElement | null>(null)
  const floatingWindowRef = useRef<HTMLDivElement | null>(null)
  const consumedSlotHeaderDragPointerIdRef = useRef<number | null>(null)
  const dockedInputRef = useRef<HTMLInputElement | null>(null)
  const floatingInputRef = useRef<HTMLInputElement | null>(null)
  const popoutInputRef = useRef<HTMLInputElement | null>(null)
  const suppressAutoCaptureRef = useRef(false)
  const graphRootEditorRevealRestoreRef = useRef<GraphRootEditorRevealRestore | null>(null)
  const rootGuidedOptOutRef = useRef(false)
  const lastHandledConsoleContextSyncSeqRef = useRef(0)
  const lastHandledReferenceTransformShellExitSeqRef = useRef(0)
  const suppressNextReferenceTransformShellExitRef = useRef(false)
  const previousSketchPlanePickSessionRef = useRef<
    ReturnType<typeof useSpaghettiStore.getState>['sketchPlanePickSession']
  >(null)
  const previousSketchDrawIdleRef = useRef(false)
  const resolveFloatingViewportSize = useCallback(() => {
    const dockWidth = dockRef.current?.clientWidth ?? 0
    const dockHeight = dockRef.current?.clientHeight ?? 0
    return {
      width: dockWidth > 0 ? dockWidth : window.innerWidth,
      height: dockHeight > 0 ? dockHeight : window.innerHeight,
    }
  }, [])
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
  const referenceWorkspace = useAppStore((state) => state.referenceWorkspace)
  const workspaceSelectedTarget = useAppStore((state) => state.workspaceSelection.selectedTarget)
  const workspaceActiveSurface = useAppStore((state) => state.workspaceSelection.activeSurface)
  const consoleContextSyncRequest = useAppStore((state) => state.consoleContextSyncRequest)
  const referenceTransformShellExitRequest = useAppStore(
    (state) => state.referenceTransformShellExitRequest,
  )
  const sketchPlanePickSession = useSpaghettiStore((state) => state.sketchPlanePickSession)
  const geometrySketchSession = useSpaghettiStore((state) => state.geometrySketchSession)

  useEffect(() => {
    if (
      stagedNavigationSession?.scopeId === 'referenceTransformRoot' &&
      typeof stagedNavigationSession.selections.referenceId === 'string'
    ) {
      const appState = useAppStore.getState()
      const activeReferenceId =
        appState.referenceWorkspace.activeReferenceTransformSession?.referenceId ?? null
      if (
        activeReferenceId !==
        stagedNavigationSession.selections.referenceId
      ) {
        appState.beginReferenceTransformShell(stagedNavigationSession.selections.referenceId)
      }
    }
  }, [stagedNavigationSession])

  useEffect(() => {
    if (stagedNavigationSession?.scopeId !== 'contentObjectTransformRoot') {
      return
    }
    const appState = useAppStore.getState()
    const selectedTarget = appState.workspaceSelection.selectedTarget
    if (selectedTarget?.kind !== 'object') {
      return
    }
    const activeObjectId =
      appState.referenceWorkspace.activeContentObjectTransformSession?.objectId ?? null
    if (activeObjectId !== selectedTarget.objectId) {
      appState.beginContentObjectTransformShell(selectedTarget.objectId)
    }
  }, [stagedNavigationSession])

  useEffect(() => {
    if (
      stagedNavigationSession?.scopeId !== 'referenceTransformRoot' ||
      typeof stagedNavigationSession.selections.referenceId !== 'string'
    ) {
      return
    }
    const totalCommittedEntryCount =
      referenceWorkspace.transformHistoryByReferenceId[
        stagedNavigationSession.selections.referenceId
      ]?.length ?? 0
    const nextChoices = buildReferenceTransformRootChoices(totalCommittedEntryCount > 0)
    const currentChoiceTokens = stagedNavigationSession.validChoices.map((choice) => choice.canonicalToken)
    const nextChoiceTokens = nextChoices.map((choice) => choice.canonicalToken)
    const choicesChanged =
      currentChoiceTokens.length !== nextChoiceTokens.length ||
      currentChoiceTokens.some((token, index) => token !== nextChoiceTokens[index])
    if (!choicesChanged) {
      return
    }
    setStagedNavigationSession({
      ...stagedNavigationSession,
      validChoices: nextChoices,
    })
  }, [referenceWorkspace, setStagedNavigationSession, stagedNavigationSession])

  useEffect(() => {
    if (
      stagedNavigationSession?.scopeId !== 'contentObjectTransformRoot' ||
      typeof stagedNavigationSession.selections.contentObjectId !== 'string'
    ) {
      return
    }
    const totalCommittedEntryCount =
      referenceWorkspace.transformHistoryByObjectId[
        stagedNavigationSession.selections.contentObjectId
      ]?.length ?? 0
    const nextChoices = buildContentTransformRootChoices(totalCommittedEntryCount > 0)
    const currentChoiceTokens = stagedNavigationSession.validChoices.map((choice) => choice.canonicalToken)
    const nextChoiceTokens = nextChoices.map((choice) => choice.canonicalToken)
    const choicesChanged =
      currentChoiceTokens.length !== nextChoiceTokens.length ||
      currentChoiceTokens.some((token, index) => token !== nextChoiceTokens[index])
    if (!choicesChanged) {
      return
    }
    setStagedNavigationSession({
      ...stagedNavigationSession,
      validChoices: nextChoices,
    })
  }, [referenceWorkspace, setStagedNavigationSession, stagedNavigationSession])

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
    featureAssistDescriptor !== null ||
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

  const handleConsolePopoutBlocked = useCallback(() => {
    appendConsoleEntry({
      layer: 'Diagnostics',
      text: 'Console pop-out was blocked by the browser',
      source: 'console',
      severity: 'warn',
    })
    switchToDocked(false)
  }, [switchToDocked])

  const { childWindow: popoutWindow, host: popoutHost } = useWorkspaceChildWindow({
    isOpen: windowMode === 'popout',
    spec: CONSOLE_POPOUT_SPEC,
    rootClassName: 'ConsolePopoutRoot',
    onBlocked: handleConsolePopoutBlocked,
    onClosed: handlePopoutWindowClosed,
  })

  const enterGuidedRootSession = useCallback((options?: { appendPrompt?: boolean }) => {
    rootGuidedOptOutRef.current = false
    const rootSession = createConsoleRootSession()
    setStagedNavigationSession(rootSession)
    if (options?.appendPrompt === true) {
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
  }, [setStagedNavigationSession])

  const rehydrateGuidedRootSession = useCallback(() => {
    if (rootGuidedOptOutRef.current === false) {
      return
    }
    const consoleState = useConsoleStore.getState()
    const spaghettiState = useSpaghettiStore.getState()
    if (
      consoleState.stagedNavigationSession !== null ||
      consoleState.consolePromptSession !== null ||
      consoleState.featureAssistDescriptor !== null ||
      consoleState.inputText.trim().length > 0 ||
      spaghettiState.sketchPlanePickSession !== null ||
      spaghettiState.geometrySketchSession?.mode === 'draw'
    ) {
      return
    }
    enterGuidedRootSession()
  }, [enterGuidedRootSession])

  const trackRadioCommandIdentity = useCallback((commandIdentity: string | null | undefined) => {
    if (typeof commandIdentity !== 'string' || commandIdentity.length === 0) {
      return
    }
    useAudioSamplerStore.getState().ensureSamplePosition(commandIdentity)
  }, [])

  const requestRadioBurst = useCallback((
    commandIdentity: string | null | undefined,
    triggerKind: RadioBurstTriggerKind,
  ) => {
    if (typeof commandIdentity !== 'string' || commandIdentity.length === 0) {
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
        direction === 'previous' ? 'arrowDown' : 'arrowUp',
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

  const clearReferenceTransformPrompt = useCallback(() => {
    getViewer()?.cancelReferenceTransformDrag?.()
    getViewer()?.clearReferenceTransformHandle?.()
    useAppStore.getState().setActiveReferenceTransformHandle(null)
    useConsoleStore.getState().clearConsolePromptSession()
    const descriptor = useConsoleStore.getState().featureAssistDescriptor
    if (descriptor !== null) {
      appendConsoleEntry({
        layer: 'Commands',
        text: buildFeatureAssistPromptText(descriptor),
        source: 'console',
        severity: 'info',
      })
    }
  }, [])

  const createActiveReferenceTransformRootSession = useCallback((referenceId: string) => {
    const latestReferenceWorkspace = useAppStore.getState().referenceWorkspace
    const target = buildReferenceConsoleWorkspaceTarget(latestReferenceWorkspace, referenceId)
    const context = buildStagedNavigationContextFromStoreState(useSpaghettiStore.getState())
    return createReferenceTransformRootSessionForTarget(
      context,
      target.label,
      referenceId,
      target.referenceCategoryId,
      target.referenceCategoryLabel,
    )
  }, [])

  const createActiveContentObjectTransformRootSession = useCallback((objectId: string) => {
    const appState = useAppStore.getState()
    const objectRecord = appState.projectContent.objectsById[objectId] ?? null
    const hasCommittedEntriesInHistory =
      (appState.referenceWorkspace.transformHistoryByObjectId[objectId] ?? []).length > 0
    const breadcrumbLabels = (() => {
      if (objectRecord === null) {
        return ['Object']
      }
      const labels = [objectRecord.label]
      let nextComponentId = objectRecord.parentComponentId
      let nextAssemblyId = objectRecord.parentAssemblyId ?? null

      while (nextComponentId !== null) {
        const currentComponentId = nextComponentId
        const componentRecord = appState.projectContent.componentsById[currentComponentId] ?? null
        labels.unshift(componentRecord?.label ?? currentComponentId)
        nextAssemblyId =
          componentRecord?.parentAssemblyId ??
          nextAssemblyId ??
          Object.values(appState.projectContent.assembliesById).find((assembly) =>
            assembly.childRowIds.includes(currentComponentId),
          )?.assemblyId ??
          null
        nextComponentId = null
      }

      while (nextAssemblyId !== null) {
        const assemblyRecord = appState.projectContent.assembliesById[nextAssemblyId] ?? null
        labels.unshift(assemblyRecord?.label ?? nextAssemblyId)
        nextAssemblyId = assemblyRecord?.parentAssemblyId ?? null
      }

      return labels
    })()
    return createContentObjectTransformRootSession(
      breadcrumbLabels,
      objectRecord?.sourceGraphDocumentId ?? objectRecord?.ownerGraphDocumentId ?? null,
      objectId,
      hasCommittedEntriesInHistory,
    )
  }, [])

  const createDeleteLatestTransformConfirmPromptSession = useCallback((
    target:
      | { kind: 'reference'; referenceId: string }
      | { kind: 'content-object'; objectId: string },
    returnSession: ConsoleStagedNavigationSession,
  ): ConsolePromptSession => ({
    kind: 'transform.delete-latest.confirm',
    breadcrumb: [...returnSession.breadcrumb, 'DeleteLatest'],
    label: 'Are you sure?',
    prefill: 'yes',
    returnSession,
    target,
  }), [])

  const deleteLatestReferenceTransformEntry = useCallback((referenceId: string) => {
    const appState = useAppStore.getState()
    const currentEntries = appState.referenceWorkspace.transformHistoryByReferenceId[referenceId] ?? []
    const latestEntry = currentEntries.at(-1) ?? null
    if (latestEntry !== null) {
      appState.deleteReferenceTransformHistoryEntry(referenceId, latestEntry.entryId)
    }
    return latestEntry
  }, [])

  const deleteLatestContentObjectTransformEntry = useCallback((objectId: string) => {
    const appState = useAppStore.getState()
    const currentEntries = appState.referenceWorkspace.transformHistoryByObjectId[objectId] ?? []
    const latestEntry = currentEntries.at(-1) ?? null
    if (latestEntry !== null) {
      appState.deleteContentObjectTransformHistoryEntry(objectId, latestEntry.entryId)
    }
    return latestEntry
  }, [])

  const createActiveReferenceTransformSnapSession = useCallback((
    referenceId: string,
    mode: ReferenceTransformSnapMode,
  ) => {
    const context = buildStagedNavigationContextFromStoreState(useSpaghettiStore.getState())
    const rootSession = createActiveReferenceTransformRootSession(referenceId)
    const settingsResult = submitConsoleStagedNavigationToken(rootSession, 'settings', context)
    if (settingsResult.kind !== 'advance') {
      return null
    }
    const snapResult = submitConsoleStagedNavigationToken(settingsResult.session, 'snap', context)
    if (snapResult.kind !== 'advance') {
      return null
    }
    const modeToken = mode === 'translate' ? 'move' : mode === 'rotate' ? 'rotate' : 'scale'
    const modeResult = submitConsoleStagedNavigationToken(snapResult.session, modeToken, context)
    return modeResult.kind === 'advance' ? modeResult.session : null
  }, [createActiveReferenceTransformRootSession])

  const createActiveContentObjectTransformSnapSession = useCallback((
    objectId: string,
    mode: ReferenceTransformSnapMode,
  ) => {
    const context = buildStagedNavigationContextFromStoreState(useSpaghettiStore.getState())
    const rootSession = createActiveContentObjectTransformRootSession(objectId)
    const settingsResult = submitConsoleStagedNavigationToken(rootSession, 'settings', context)
    if (settingsResult.kind !== 'advance') {
      return null
    }
    const snapResult = submitConsoleStagedNavigationToken(settingsResult.session, 'snap', context)
    if (snapResult.kind !== 'advance') {
      return null
    }
    const modeToken = mode === 'translate' ? 'move' : mode === 'rotate' ? 'rotate' : 'scale'
    const modeResult = submitConsoleStagedNavigationToken(snapResult.session, modeToken, context)
    return modeResult.kind === 'advance' ? modeResult.session : null
  }, [createActiveContentObjectTransformRootSession])

  const closeReferenceTransformPromptToModeRoot = useCallback(() => {
    const appState = useAppStore.getState()
    const activeSession = appState.referenceWorkspace.activeReferenceTransformSession
    if (activeSession === null) {
      return null
    }
    getViewer()?.cancelReferenceTransformDrag?.()
    getViewer()?.clearReferenceTransformHandle?.()
    appState.setActiveReferenceTransformHandle(null)
    useConsoleStore.getState().clearConsolePromptSession()
    return {
      referenceId: activeSession.referenceId,
      mode: activeSession.mode,
    }
  }, [])

  const applyReferenceTransformSpaceShortcut = useCallback((
    space: 'local' | 'world',
    rawToken: string,
    options?: {
      closePromptToModeRoot?: boolean
    },
  ) => {
    const appState = useAppStore.getState()
    const activeSession = appState.referenceWorkspace.activeReferenceTransformSession
    if (activeSession === null) {
      return false
    }

    appendConsoleEntry({
      layer: 'Commands',
      commandLineKind: 'user',
      text: `> ${rawToken}`,
    })
    pushCommandHistory(rawToken)
    requestRadioBurst(
      resolveConsoleRadioCommandIdentity({
        kind: 'stagedExecute',
        activeScopeId: 'referenceTransformRoot',
        actionId:
          space === 'local'
            ? 'reference.transform.space.local'
            : 'reference.transform.space.world',
      }),
      'enter',
    )

    if (options?.closePromptToModeRoot === true) {
      closeReferenceTransformPromptToModeRoot()
    }

    const alreadyApplied = activeSession.space === space
    if (!alreadyApplied) {
      appState.setActiveReferenceTransformSpace(space)
    }

    const nextWorkspace = useAppStore.getState().referenceWorkspace
    appendConsoleEntry({
      layer: 'Transforms',
      text: `Space: ${space === 'local' ? 'Local' : 'World'}${
        alreadyApplied ? ' already applied' : ' applied'
      }`,
      source: 'console',
      severity: 'info',
    })

    const nextDescriptor = getActiveFeatureAssistDescriptor({
      sketchPlanePickSession: useSpaghettiStore.getState().sketchPlanePickSession,
      geometrySketchSession: useSpaghettiStore.getState().geometrySketchSession,
      referenceWorkspace: nextWorkspace,
      stagedNavigationSession: useConsoleStore.getState().stagedNavigationSession,
    })
    if (nextDescriptor !== null) {
      appendConsoleEntry({
        layer: 'Commands',
        text: buildFeatureAssistPromptText(nextDescriptor),
        source: 'console',
        severity: 'info',
      })
      return true
    }

    const nextStagedSession = useConsoleStore.getState().stagedNavigationSession
    if (nextStagedSession !== null) {
      appendConsoleEntry({
        layer: 'Commands',
        text: buildStagedPromptText(nextStagedSession, nextStagedSession.validChoices),
        source: 'console',
        severity: 'info',
      })
    }
    return true
  }, [closeReferenceTransformPromptToModeRoot, pushCommandHistory, requestRadioBurst])

  const cancelActiveReferenceTransformSession = useCallback(() => {
    const appState = useAppStore.getState()
    const activeSession = appState.referenceWorkspace.activeReferenceTransformSession
    const activeReferenceId = activeSession?.referenceId ?? null
    if (activeSession === null || activeReferenceId === null) {
      return
    }
    const baseline = activeSession.entryOrigin ?? activeSession.draftTransform
    getViewer()?.cancelReferenceTransformDrag()
    getViewer()?.clearReferenceTransformHandle()
    appState.cancelActiveReferenceTransformEntry()
    getViewer()?.setReferenceTransformOverride?.(activeReferenceId, baseline)
    useConsoleStore.getState().clearConsolePromptSession()

    suppressNextReferenceTransformShellExitRef.current = true
    queueMicrotask(() => {
      suppressNextReferenceTransformShellExitRef.current = false
    })
    setStagedNavigationSession(createActiveReferenceTransformRootSession(activeReferenceId))
  }, [createActiveReferenceTransformRootSession, setStagedNavigationSession])

  const cancelActiveContentObjectTransformSession = useCallback(() => {
    const appState = useAppStore.getState()
    const activeSession = appState.referenceWorkspace.activeContentObjectTransformSession
    if (activeSession === null) {
      return
    }
    const baseline = activeSession.entryOrigin ?? activeSession.draftTransform
    getViewer()?.cancelReferenceTransformDrag()
    getViewer()?.clearReferenceTransformHandle()
    appState.setContentObjectTransformOverride(activeSession.objectId, baseline)
    appState.cancelActiveContentObjectTransformEntry()
  }, [])

  const exitActiveContentObjectTransformShell = useCallback(() => {
    const appState = useAppStore.getState()
    if (appState.referenceWorkspace.activeContentObjectTransformSession === null) {
      return false
    }
    getViewer()?.cancelReferenceTransformDrag?.()
    getViewer()?.clearReferenceTransformHandle?.()
    appState.exitContentObjectTransformShell()
    useConsoleStore.getState().clearConsolePromptSession()
    appendConsoleEntry({
      layer: 'Transforms',
      text: 'Exited Viewer Transform',
      source: 'console',
      severity: 'info',
    })
    return true
  }, [])

  const exitActiveReferenceTransformShell = useCallback(() => {
    const appState = useAppStore.getState()
    const activeReferenceId =
      appState.referenceWorkspace.activeReferenceTransformSession?.referenceId ?? null
    if (activeReferenceId === null) {
      return false
    }

    getViewer()?.cancelReferenceTransformDrag?.()
    getViewer()?.clearReferenceTransformHandle?.()
    appState.exitReferenceTransformShell()
    useConsoleStore.getState().clearConsolePromptSession()

    const nextReferenceSession = resolveConsoleWorkspaceContextSync(
      buildStagedNavigationContextFromStoreState(useSpaghettiStore.getState()),
      buildReferenceConsoleWorkspaceTarget(appState.referenceWorkspace, activeReferenceId),
    ).session

    if (nextReferenceSession !== null) {
      setStagedNavigationSession(nextReferenceSession)
      appendConsoleEntry({
        layer: 'Commands',
        text: formatStagedBreadcrumb(nextReferenceSession.breadcrumb),
        source: 'console',
        severity: 'info',
      })
      appendConsoleEntry({
        layer: 'Commands',
        text: buildStagedPromptText(nextReferenceSession, nextReferenceSession.validChoices),
        source: 'console',
        severity: 'info',
      })
    }
    return true
  }, [setStagedNavigationSession])

  const routeConsoleGlobalKey = useCallback((event: KeyboardEvent) => {
    const spaghettiState = useSpaghettiStore.getState()
    const appState = useAppStore.getState()
    return routeKeyboardInput({
      event,
      sketchPlanePickStage: spaghettiState.sketchPlanePickSession?.stage ?? null,
      geometrySketchMode:
        useConsoleStore.getState().featureAssistDescriptor !== null
          ? null
          : spaghettiState.geometrySketchSession?.mode ?? null,
      referenceTransformActive:
        appState.referenceWorkspace.activeReferenceTransformSession?.entryActive === true ||
        appState.referenceWorkspace.activeContentObjectTransformSession?.entryActive === true,
      stagedConsoleActive:
        useConsoleStore.getState().stagedNavigationSession !== null ||
        useConsoleStore.getState().consolePromptSession !== null ||
        useConsoleStore.getState().featureAssistDescriptor !== null,
      allowFlatConsoleCapture: true,
    })
  }, [])

  const cancelActiveStagedNavigationSession = useCallback(() => {
    const activeSession = useConsoleStore.getState().stagedNavigationSession
    if (activeSession === null) {
      return false
    }
    const cancelled = cancelConsoleStagedNavigationSession()
    clearStagedNavigationSession()
    if (activeSession.scopeId === 'root') {
      rootGuidedOptOutRef.current = true
    }
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

    if (activeSession.scopeId === 'root') {
      cancelActiveStagedNavigationSession()
      return true
    }

    if (isSketchDrawLocalStagedScope(activeSession)) {
      return true
    }

    if (activeSession.scopeId === 'graphRoot' || activeSession.scopeId === 'radioRoot') {
      enterGuidedRootSession()
      appendConsoleEntry({
        layer: 'Commands',
        text: ROOT_PROMPT_TEXT,
        source: 'console',
        severity: 'info',
      })
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
    enterGuidedRootSession,
    setStagedNavigationSession,
  ])

  const stepActiveConsolePromptSessionBack = useCallback(() => {
    const activePromptSession = useConsoleStore.getState().consolePromptSession
    if (activePromptSession === null) {
      return false
    }

    if (
      activePromptSession.kind === 'reference-transform.axis' ||
      activePromptSession.kind === 'reference-transform.plane'
    ) {
      appendEscUserEntry()
      clearReferenceTransformPrompt()
      return true
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
  }, [appendEscUserEntry, clearReferenceTransformPrompt, setStagedNavigationSession])

  const handleEscCancelCommand = useCallback(() => {
    if (stepActiveConsolePromptSessionBack()) {
      return
    }
    const activeSession = useConsoleStore.getState().stagedNavigationSession
    const appState = useAppStore.getState()
    const activeReferenceSession = appState.referenceWorkspace.activeReferenceTransformSession
    const activeContentObjectSession =
      appState.referenceWorkspace.activeContentObjectTransformSession
    if (
      activeSession?.scopeId === 'referenceTransformRoot' &&
      activeReferenceSession !== null &&
      !activeReferenceSession.entryActive
    ) {
      if (suppressNextReferenceTransformShellExitRef.current) {
        return
      }
      appendEscUserEntry()
      exitActiveReferenceTransformShell()
      return
    }
    if (
      activeSession?.scopeId === 'contentObjectTransformRoot' &&
      activeContentObjectSession !== null &&
      !activeContentObjectSession.entryActive
    ) {
      appendEscUserEntry()
      exitActiveContentObjectTransformShell()
      return
    }
    if (
      activeSession?.scopeId === 'contentAssemblySelected' ||
      activeSession?.scopeId === 'contentComponentSelected' ||
      activeSession?.scopeId === 'contentObjectSelected'
    ) {
      appendEscUserEntry()
      setStagedNavigationSession(null)
      appState.setWorkspaceExplicitSelection({
        selectedTarget: null,
        explicitSelectedTargets: [],
        selectionAnchorTarget: null,
      })
      appState.selectPart(null)
      appState.requestConsoleContextSync('surface-clear')
      return
    }
    if (
      activeSession?.scopeId === 'referencesSelected' ||
      activeSession?.scopeId === 'referenceCategorySelected' ||
      activeSession?.scopeId === 'referenceSelected'
    ) {
      appendEscUserEntry()
      setStagedNavigationSession(null)
      appState.setWorkspaceExplicitSelection({
        selectedTarget: null,
        explicitSelectedTargets: [],
        selectionAnchorTarget: null,
      })
      appState.selectPart(null)
      appState.requestConsoleContextSync('surface-clear')
      return
    }
    if (
      activeReferenceSession?.entryActive === true &&
      (activeSession?.scopeId === 'referenceTransformSettingsRoot' ||
        activeSession?.scopeId === 'referenceTransformSpaceRoot' ||
        isReferenceTransformSnapScope(activeSession?.scopeId))
    ) {
      if (stepActiveStagedNavigationSessionOneLevel()) {
        return
      }
    }
    if (
      activeContentObjectSession?.entryActive === true &&
      (activeSession?.scopeId === 'contentObjectTransformSettingsRoot' ||
        activeSession?.scopeId === 'contentObjectTransformSpaceRoot' ||
        isContentObjectTransformSnapScope(activeSession?.scopeId))
    ) {
      if (stepActiveStagedNavigationSessionOneLevel()) {
        return
      }
    }
    if (
      activeReferenceSession?.entryActive === true
    ) {
      cancelActiveReferenceTransformSession()
      return
    }
    if (activeContentObjectSession?.entryActive === true) {
      cancelActiveContentObjectTransformSession()
      return
    }
    if (stepActiveStagedNavigationSessionOneLevel()) {
      return
    }
    setConsoleCameraModeCommand(null)
    const spaghettiState = useSpaghettiStore.getState()
    if (spaghettiState.sketchPlanePickSession !== null) {
      spaghettiState.runSketchPlaneCommand('esc')
      return
    }
    if (spaghettiState.geometrySketchSession?.mode === 'draw') {
      spaghettiState.runGeometrySketchDrawCommand('esc')
    }
  }, [
    appendEscUserEntry,
    cancelActiveContentObjectTransformSession,
    cancelActiveReferenceTransformSession,
    exitActiveContentObjectTransformShell,
    exitActiveReferenceTransformShell,
    setStagedNavigationSession,
    stepActiveConsolePromptSessionBack,
    stepActiveStagedNavigationSessionOneLevel,
  ])

  const primeSketchDrawStagedRootForTyping = useCallback(() => {
    const consoleState = useConsoleStore.getState()
    const spaghettiState = useSpaghettiStore.getState()
    const isSketchDrawIdle =
      spaghettiState.geometrySketchSession?.mode === 'draw' &&
      spaghettiState.geometrySketchSession.activeTool === null
    if (!isSketchDrawIdle || consoleState.stagedNavigationSession !== null) {
      return
    }
    setStagedNavigationSession(
      createSketchDrawRootSession(buildStagedNavigationContextFromStoreState(spaghettiState)),
    )
  }, [setStagedNavigationSession])

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

  const resolveConsoleActionContext = useCallback(
    (preferredGraphDocumentId: string | null = null): ConsoleActionContext =>
      resolveConsoleActionContextFromState(preferredGraphDocumentId),
    [],
  )

  const resolveSelectedReferenceIdForZoom = useCallback((): string | null => {
    const appState = useAppStore.getState()
    const selectedTarget = appState.workspaceSelection.selectedTarget
    if (selectedTarget !== null) {
      const resolvedReferenceIds = resolveReferenceIdsForWorkspaceTarget(appState, selectedTarget)
      if (resolvedReferenceIds.length === 1) {
        return resolvedReferenceIds[0]
      }
    }
    return appState.referenceWorkspace.activeReferenceTransformSession?.referenceId ?? null
  }, [])

  const resolveSelectedObjectPartKeyForZoom = useCallback((): string | null => {
    const appState = useAppStore.getState()
    if (appState.selectedPartKey !== null) {
      return appState.selectedPartKey
    }
    const explicitObjectTarget =
      appState.workspaceSelection.explicitSelectedTargets.find(
        (target) => target.kind === 'object',
      ) ?? null
    const selectedTarget =
      appState.workspaceSelection.selectedTarget?.kind === 'object'
        ? appState.workspaceSelection.selectedTarget
        : explicitObjectTarget?.kind === 'object'
          ? explicitObjectTarget
          : null
    if (selectedTarget !== null) {
      const objectRecord = appState.projectContent.objectsById[selectedTarget.objectId]
      if (objectRecord !== undefined) {
        return buildObjectPartKeys(objectRecord)[0] ?? null
      }
    }
    return appState.workspaceSelection.resolvedContentSelection?.partKeys[0] ?? null
  }, [])

  const resolveSelectionSetForZoom = useCallback(() => {
    const appState = useAppStore.getState()
    const fallbackContentSelection =
      appState.workspaceSelection.resolvedContentSelection ??
      (appState.workspaceSelection.selectedTarget !== null
        ? resolveOwnedContentSelection(
            {
              projectContent: appState.projectContent,
              referenceWorkspace: appState.referenceWorkspace,
            },
            appState.workspaceSelection.selectedTarget,
          )
        : null)
    const partKeys = [...new Set(fallbackContentSelection?.partKeys ?? [])]
    const referenceIds = [
      ...new Set(
        (
          appState.workspaceSelection.explicitSelectedTargets.length > 0
            ? appState.workspaceSelection.explicitSelectedTargets
            : appState.workspaceSelection.selectedTarget === null
              ? []
              : [appState.workspaceSelection.selectedTarget]
        ).flatMap((target) =>
          resolveReferenceIdsForWorkspaceTarget(
            {
              projectContent: appState.projectContent,
              referenceWorkspace: appState.referenceWorkspace,
            },
            target,
          ),
        ),
      ),
    ]
    return {
      partKeys,
      referenceIds,
    }
  }, [])

  const commitActiveReferenceTransformFromConsole = useCallback((rawToken: string) => {
    const appState = useAppStore.getState()
    const activeSession = appState.referenceWorkspace.activeReferenceTransformSession
    const activeReferenceId = activeSession?.referenceId ?? null
    if (activeSession === null || activeReferenceId === null) {
      return
    }
    const commandIdentity = resolveFeatureAssistSubmitIdentity(rawToken)
    appendConsoleEntry({
      layer: 'Commands',
      commandLineKind: 'user',
      text: `> ${rawToken}`,
    })
    pushCommandHistory(rawToken)
    requestRadioBurst(commandIdentity, 'enter')
    appState.setActiveReferenceTransformHandle(null)
    getViewer()?.clearReferenceTransformHandle?.()
    appState.commitActiveReferenceTransformEntry()
    useConsoleStore.getState().clearConsolePromptSession()
    const nextAppState = useAppStore.getState()
    const target = buildReferenceConsoleWorkspaceTarget(
      nextAppState.referenceWorkspace,
      activeReferenceId,
    )
    const nextTransformRootSession = createReferenceTransformRootSessionForTarget(
      buildStagedNavigationContextFromStoreState(useSpaghettiStore.getState()),
      target.label,
      target.referenceId ?? activeReferenceId,
      target.referenceCategoryId,
      target.referenceCategoryLabel,
    )
    setStagedNavigationSession(nextTransformRootSession)
    useConsoleStore.getState().setInputText(
      nextTransformRootSession.validChoices[0]?.label ?? '',
    )
  }, [pushCommandHistory, requestRadioBurst, resolveFeatureAssistSubmitIdentity, setStagedNavigationSession])

  const openReferenceTransformAxisPrompt = useCallback((
    axis: 'x' | 'y' | 'z',
  ) => {
    const appState = useAppStore.getState()
    const activeSession = appState.referenceWorkspace.activeReferenceTransformSession
    const activeReferenceId = activeSession?.referenceId ?? null
    if (activeSession === null || activeReferenceId === null) {
      return
    }
    const stagedSession =
      useConsoleStore.getState().stagedNavigationSession ?? createConsoleRootSession()
    const viewerAxis = axis.toUpperCase() as 'X' | 'Y' | 'Z'
    if (activeSession.mode === 'translate') {
      getViewer()?.activateTranslateHandle?.(viewerAxis)
    } else if (activeSession.mode === 'rotate') {
      getViewer()?.activateRotateHandle?.(viewerAxis)
    } else {
      getViewer()?.activateScaleHandle?.(viewerAxis)
    }
    const nextPromptSession = buildReferenceTransformAxisPromptSession({
      referenceWorkspace: appState.referenceWorkspace,
      stagedNavigationSession: stagedSession,
      axis,
    })
    if (nextPromptSession !== null) {
      useConsoleStore.getState().setConsolePromptSession(nextPromptSession)
    }
  }, [])

  const openReferenceTransformPlanePrompt = useCallback((
    plane: 'xy' | 'xz' | 'yz',
  ) => {
    const appState = useAppStore.getState()
    const activeSession = appState.referenceWorkspace.activeReferenceTransformSession
    const activeReferenceId = activeSession?.referenceId ?? null
    if (activeSession === null || activeReferenceId === null) {
      return
    }
    const stagedSession =
      useConsoleStore.getState().stagedNavigationSession ?? createConsoleRootSession()
    const nextPromptSession = buildReferenceTransformPlanePromptSession({
      referenceWorkspace: appState.referenceWorkspace,
      stagedNavigationSession: stagedSession,
      plane,
    })
    if (nextPromptSession !== null) {
      useConsoleStore.getState().setConsolePromptSession(nextPromptSession)
    }
  }, [])

  const cancelReferenceTransformLeafForTransition = useCallback(() => {
    const appState = useAppStore.getState()
    const activeSession = appState.referenceWorkspace.activeReferenceTransformSession
    const activeReferenceId = activeSession?.referenceId ?? null
    if (activeSession === null || activeReferenceId === null) {
      return null
    }
    const baseline =
      activeSession.entryOrigin ?? activeSession.draftTransform
    getViewer()?.cancelReferenceTransformDrag?.()
    getViewer()?.clearReferenceTransformHandle?.()
    appState.setActiveReferenceTransformHandle(null)
    appState.cancelActiveReferenceTransformEntry()
    appState.setActiveReferenceTransformDraft(baseline)
    getViewer()?.setReferenceTransformOverride?.(activeReferenceId, baseline)
    useConsoleStore.getState().clearConsolePromptSession()
    return {
      referenceId: activeReferenceId,
      space: activeSession.space,
    }
  }, [])

  const transitionReferenceTransformAxisPrompt = useCallback((
    next: {
      mode: 'translate' | 'rotate' | 'scale'
      axis?: 'x' | 'y' | 'z'
    },
  ) => {
    const transitionState = cancelReferenceTransformLeafForTransition()
    if (transitionState === null) {
      return
    }
    const appState = useAppStore.getState()
    appState.beginReferenceTransformEntry(next.mode)
    const nextSession = useAppStore.getState().referenceWorkspace.activeReferenceTransformSession
    getViewer()?.setReferenceTransformSession?.({
      referenceId: transitionState.referenceId,
      mode: next.mode,
      space: transitionState.space,
      entryOrigin: nextSession?.entryOrigin ?? null,
    })
    if (next.axis !== undefined) {
      openReferenceTransformAxisPrompt(next.axis)
      return
    }
    useConsoleStore.getState().clearConsolePromptSession()
  }, [cancelReferenceTransformLeafForTransition, openReferenceTransformAxisPrompt])

  const cycleActiveReferenceTransformModeWithTab = useCallback(() => {
    const appState = useAppStore.getState()
    const activeSession = appState.referenceWorkspace.activeReferenceTransformSession
    const stagedSession = useConsoleStore.getState().stagedNavigationSession
    const promptSession = useConsoleStore.getState().consolePromptSession
    const isReferenceTransformPrompt =
      promptSession?.kind === 'reference-transform.axis' ||
      promptSession?.kind === 'reference-transform.plane'
    if (
      activeSession === null ||
      (!isReferenceTransformPrompt && stagedSession?.scopeId !== 'referenceTransformRoot')
    ) {
      return false
    }
    const nextMode =
      activeSession.mode === 'translate'
        ? 'rotate'
        : activeSession.mode === 'rotate'
          ? 'scale'
          : 'translate'
    if (activeSession.entryActive || isReferenceTransformPrompt) {
      transitionReferenceTransformAxisPrompt({ mode: nextMode })
    } else {
      appState.beginReferenceTransformEntry(nextMode)
      const nextSession = useAppStore.getState().referenceWorkspace.activeReferenceTransformSession
      useConsoleStore.getState().clearConsolePromptSession()
      getViewer()?.setReferenceTransformSession?.({
        referenceId: activeSession.referenceId,
        mode: nextMode,
        space: activeSession.space,
        entryOrigin: nextSession?.entryOrigin ?? null,
      })
    }
    setStagedNavigationSession(createActiveReferenceTransformRootSession(activeSession.referenceId))
    return true
  }, [
    createActiveReferenceTransformRootSession,
    setStagedNavigationSession,
    transitionReferenceTransformAxisPrompt,
  ])

  const cycleActiveContentObjectTransformModeWithTab = useCallback(() => {
    const appState = useAppStore.getState()
    const activeSession = appState.referenceWorkspace.activeContentObjectTransformSession
    const stagedSession = useConsoleStore.getState().stagedNavigationSession
    if (activeSession === null || stagedSession?.scopeId !== 'contentObjectTransformRoot') {
      return false
    }
    const nextMode =
      activeSession.mode === 'translate'
        ? 'rotate'
        : activeSession.mode === 'rotate'
          ? 'scale'
          : 'translate'
    appState.beginContentObjectTransformEntry(nextMode)
    const nextSession = useAppStore.getState().referenceWorkspace.activeContentObjectTransformSession
    useConsoleStore.getState().clearConsolePromptSession()
    getViewer()?.setContentObjectTransformSession?.({
      objectId: activeSession.objectId,
      mode: nextMode,
      space: activeSession.space,
      entryOrigin: nextSession?.entryOrigin ?? null,
    })
    if (nextMode === 'rotate') {
      getViewer()?.activateRotateCenterHandle?.()
    } else if (nextMode === 'scale') {
      getViewer()?.activateScaleCenterHandle?.()
    } else {
      getViewer()?.activateTranslateCenterHandle?.()
    }
    setStagedNavigationSession(createActiveContentObjectTransformRootSession(activeSession.objectId))
    return true
  }, [
    createActiveContentObjectTransformRootSession,
    setStagedNavigationSession,
  ])

  const handleSubmitCommand = useCallback(
    (inputText: string) => {
      const trimmedInput = inputText.trim().toLowerCase()
      const spaghettiState = useSpaghettiStore.getState()
      const activePromptSession = useConsoleStore.getState().consolePromptSession
      const activeStagedSession = useConsoleStore.getState().stagedNavigationSession
      const stagedContext = buildStagedNavigationContextFromStoreState(spaghettiState)

      if (activePromptSession !== null) {
        const rawToken = inputText.trim()
        const normalizedPromptToken = normalizeRadioCommandIdentity(rawToken)

        if (activePromptSession.kind === 'transform.delete-latest.confirm') {
          appendConsoleEntry({
            layer: 'Commands',
            commandLineKind: 'user',
            text: `> ${rawToken}`,
          })
          pushCommandHistory(rawToken)
          if (
            normalizedPromptToken === 'YES' ||
            normalizedPromptToken === 'Y' ||
            normalizedPromptToken === 'CONFIRM'
          ) {
            if (activePromptSession.target.kind === 'reference') {
              const latestEntry = deleteLatestReferenceTransformEntry(
                activePromptSession.target.referenceId,
              )
              const nextTransformRootSession = createActiveReferenceTransformRootSession(
                activePromptSession.target.referenceId,
              )
              setStagedNavigationSession(nextTransformRootSession)
              useConsoleStore.getState().clearConsolePromptSession()
              appendConsoleEntry({
                layer: 'Transforms',
                text:
                  latestEntry === null
                    ? 'Delete latest skipped: no committed transform entry'
                    : 'Deleted latest transform entry',
                source: 'console',
                severity: latestEntry === null ? 'warn' : 'info',
              })
              appendConsoleEntry({
                layer: 'Commands',
                text: buildStagedPromptText(
                  nextTransformRootSession,
                  nextTransformRootSession.validChoices,
                ),
                source: 'console',
                severity: 'info',
              })
              return
            }

            const latestEntry = deleteLatestContentObjectTransformEntry(
              activePromptSession.target.objectId,
            )
            const nextTransformRootSession = createActiveContentObjectTransformRootSession(
              activePromptSession.target.objectId,
            )
            setStagedNavigationSession(nextTransformRootSession)
            useConsoleStore.getState().clearConsolePromptSession()
            appendConsoleEntry({
              layer: 'Transforms',
              text:
                latestEntry === null
                  ? 'Delete latest skipped: no committed transform entry'
                  : 'Deleted latest transform entry',
              source: 'console',
              severity: latestEntry === null ? 'warn' : 'info',
            })
            appendConsoleEntry({
              layer: 'Commands',
              text: buildStagedPromptText(
                nextTransformRootSession,
                nextTransformRootSession.validChoices,
              ),
              source: 'console',
              severity: 'info',
            })
            return
          }

          if (
            normalizedPromptToken === 'NO' ||
            normalizedPromptToken === 'N' ||
            normalizedPromptToken === 'BACK' ||
            normalizedPromptToken === 'B' ||
            normalizedPromptToken === 'ESC' ||
            normalizedPromptToken === 'CANCEL'
          ) {
            useConsoleStore.getState().clearConsolePromptSession()
            setStagedNavigationSession(activePromptSession.returnSession)
            appendConsoleEntry({
              layer: 'Transforms',
              text: 'Delete latest cancelled',
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

          appendConsoleEntry({
            layer: 'Commands',
            text: buildConsolePromptSessionText(activePromptSession),
            source: 'console',
            severity: 'info',
          })
          useConsoleStore.getState().setInputText(rawToken)
          return
        }

        if (activePromptSession.kind === 'reference-transform.axis') {
          const normalizedReferenceToken = normalizedPromptToken
          if (normalizedReferenceToken === 'L' || normalizedReferenceToken === 'LOCAL') {
            applyReferenceTransformSpaceShortcut('local', rawToken, {
              closePromptToModeRoot: true,
            })
            return
          }
          if (normalizedReferenceToken === 'W' || normalizedReferenceToken === 'WORLD') {
            applyReferenceTransformSpaceShortcut('world', rawToken, {
              closePromptToModeRoot: true,
            })
            return
          }
          const currentAxisToken = activePromptSession.axis.toUpperCase()
          if (
            normalizedReferenceToken === 'X' ||
            normalizedReferenceToken === 'Y' ||
            normalizedReferenceToken === 'Z'
          ) {
            if (normalizedReferenceToken !== currentAxisToken) {
              appendConsoleEntry({
                layer: 'Commands',
                commandLineKind: 'user',
                text: `> ${rawToken}`,
              })
              pushCommandHistory(rawToken)
              transitionReferenceTransformAxisPrompt({
                mode: activePromptSession.mode,
                axis: normalizedReferenceToken.toLowerCase() as 'x' | 'y' | 'z',
              })
              const nextPromptSession = useConsoleStore.getState().consolePromptSession
              if (nextPromptSession !== null) {
                appendConsoleEntry({
                  layer: 'Commands',
                  text: buildConsolePromptSessionText(nextPromptSession),
                  source: 'console',
                  severity: 'info',
                })
              }
              return
            }
          }
          if (normalizedReferenceToken === 'MOVE' || normalizedReferenceToken === 'M') {
            if (activePromptSession.mode !== 'translate') {
              appendConsoleEntry({
                layer: 'Commands',
                commandLineKind: 'user',
                text: `> ${rawToken}`,
              })
              pushCommandHistory(rawToken)
              transitionReferenceTransformAxisPrompt({
                mode: 'translate',
              })
              const nextDescriptor = buildReferenceTransformAssistDescriptor(
                useAppStore.getState().referenceWorkspace,
                useConsoleStore.getState().stagedNavigationSession,
              )
              if (nextDescriptor !== null) {
                appendConsoleEntry({
                  layer: 'Commands',
                  text: buildFeatureAssistPromptText(nextDescriptor),
                  source: 'console',
                  severity: 'info',
                })
              }
              return
            }
          }
          if (normalizedReferenceToken === 'ROTATE' || normalizedReferenceToken === 'R') {
            if (activePromptSession.mode !== 'rotate') {
              appendConsoleEntry({
                layer: 'Commands',
                commandLineKind: 'user',
                text: `> ${rawToken}`,
              })
              pushCommandHistory(rawToken)
              transitionReferenceTransformAxisPrompt({
                mode: 'rotate',
              })
              const nextDescriptor = buildReferenceTransformAssistDescriptor(
                useAppStore.getState().referenceWorkspace,
                useConsoleStore.getState().stagedNavigationSession,
              )
              if (nextDescriptor !== null) {
                appendConsoleEntry({
                  layer: 'Commands',
                  text: buildFeatureAssistPromptText(nextDescriptor),
                  source: 'console',
                  severity: 'info',
                })
              }
              return
            }
          }
          if (normalizedReferenceToken === 'SCALE' || normalizedReferenceToken === 'S') {
            if (activePromptSession.mode !== 'scale') {
              appendConsoleEntry({
                layer: 'Commands',
                commandLineKind: 'user',
                text: `> ${rawToken}`,
              })
              pushCommandHistory(rawToken)
              transitionReferenceTransformAxisPrompt({
                mode: 'scale',
              })
              const nextDescriptor = buildReferenceTransformAssistDescriptor(
                useAppStore.getState().referenceWorkspace,
                useConsoleStore.getState().stagedNavigationSession,
              )
              if (nextDescriptor !== null) {
                appendConsoleEntry({
                  layer: 'Commands',
                  text: buildFeatureAssistPromptText(nextDescriptor),
                  source: 'console',
                  severity: 'info',
                })
              }
              return
            }
          }

          const axisInput = parseReferenceTransformAxisInput(rawToken)
          if (axisInput === null) {
            appendConsoleEntry({
              layer: 'Commands',
              commandLineKind: 'user',
              text: `> ${rawToken}`,
            })
            pushCommandHistory(rawToken)
            appendConsoleEntry({
              layer: 'Commands',
              text: buildConsolePromptSessionText(activePromptSession),
              source: 'console',
              severity: 'info',
            })
            useConsoleStore.getState().setInputText(rawToken)
            return
          }

          const appState = useAppStore.getState()
          const activeSession = appState.referenceWorkspace.activeReferenceTransformSession
          const activeReferenceId = activeSession?.referenceId ?? null
          if (activeSession === null || activeReferenceId === null) {
            useConsoleStore.getState().clearConsolePromptSession()
            return
          }
          const axisBaselineTransform =
            axisInput.absolute === true
              ? activeSession.draftTransform
              : activeSession.entryOrigin ?? activeSession.draftTransform
          const nextTransformOverride = applyReferenceTransformAxisValue(
            axisBaselineTransform,
            activePromptSession.mode,
            activePromptSession.axis,
            axisInput.value,
            { absolute: axisInput.absolute },
          )
          getViewer()?.cancelReferenceTransformDrag?.()
          appState.setActiveReferenceTransformDraft(nextTransformOverride)
          getViewer()?.setReferenceTransformOverride(
            activeSession.referenceId,
            nextTransformOverride,
          )
          commitActiveReferenceTransformFromConsole(rawToken)
          return
        }

        if (activePromptSession.kind === 'reference-transform.plane') {
          const normalizedReferenceToken = normalizedPromptToken
          if (normalizedReferenceToken === 'L' || normalizedReferenceToken === 'LOCAL') {
            applyReferenceTransformSpaceShortcut('local', rawToken, {
              closePromptToModeRoot: true,
            })
            return
          }
          if (normalizedReferenceToken === 'W' || normalizedReferenceToken === 'WORLD') {
            applyReferenceTransformSpaceShortcut('world', rawToken, {
              closePromptToModeRoot: true,
            })
            return
          }
          const parsedVec3 = parseConsoleVec3Literal(rawToken)
          if (parsedVec3 === null) {
            appendConsoleEntry({
              layer: 'Commands',
              commandLineKind: 'user',
              text: `> ${rawToken}`,
            })
            pushCommandHistory(rawToken)
            appendConsoleEntry({
              layer: 'Commands',
              text: buildConsolePromptSessionText(activePromptSession),
              source: 'console',
              severity: 'info',
            })
            useConsoleStore.getState().setInputText(rawToken)
            return
          }

          const appState = useAppStore.getState()
          const activeSession = appState.referenceWorkspace.activeReferenceTransformSession
          const activeReferenceId = activeSession?.referenceId ?? null
          if (activeSession === null || activeReferenceId === null) {
            useConsoleStore.getState().clearConsolePromptSession()
            return
          }
          const nextTransformOverride = applyReferenceTransformPlaneValue(
            activeSession.draftTransform,
            activePromptSession.mode,
            activePromptSession.plane,
            parsedVec3,
          )
          getViewer()?.cancelReferenceTransformDrag?.()
          appState.setActiveReferenceTransformDraft(nextTransformOverride)
          getViewer()?.setReferenceTransformOverride(
            activeSession.referenceId,
            nextTransformOverride,
          )
          commitActiveReferenceTransformFromConsole(rawToken)
          return
        }

        if (activePromptSession.kind === 'content.owner.label') {
          appendConsoleEntry({
            layer: 'Commands',
            commandLineKind: 'user',
            text: `> ${rawToken}`,
          })
          pushCommandHistory(rawToken)
          const nextLabel = rawToken.trim()
          if (nextLabel.length === 0) {
            appendConsoleEntry({
              layer: 'Diagnostics',
              text: 'Name cannot be empty',
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
          const renamed = useAppStore
            .getState()
            .renameProjectContentOwner(activePromptSession.target, nextLabel)
          if (!renamed) {
            appendConsoleEntry({
              layer: 'Diagnostics',
              text: 'Rename is not available for this content owner',
              source: 'console',
              severity: 'warn',
            })
            return
          }
          useAppStore.getState().requestConsoleContextSync('target-selection')
          setStagedNavigationSession(activePromptSession.returnSession)
          appendConsoleEntry({
            layer: 'Browser',
            text: `Renamed to ${nextLabel}`,
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

      const referenceWorkspaceState = useAppStore.getState().referenceWorkspace
      const activeReferenceSession = referenceWorkspaceState.activeReferenceTransformSession
      const activeReferenceId = activeReferenceSession?.referenceId ?? null
      if (
        activeReferenceSession !== null &&
        activeReferenceSession.entryActive &&
        !isReferenceTransformSnapScope(activeStagedSession?.scopeId)
      ) {
        const rawToken = inputText.trim()
        const matchedChoice =
          featureAssistDescriptor !== null
            ? findFeatureAssistChoiceByInput(featureAssistDescriptor, inputText)
            : null
        const normalizedReferenceToken = normalizeRadioCommandIdentity(rawToken)
        const submitReferenceTransformCommand = () => {
          const commandIdentity = resolveFeatureAssistSubmitIdentity(rawToken)
          appendConsoleEntry({
            layer: 'Commands',
            commandLineKind: 'user',
            text: `> ${rawToken}`,
          })
          pushCommandHistory(rawToken)
          requestRadioBurst(commandIdentity, 'enter')
        }

        if (normalizedReferenceToken === 'ESC' || normalizedReferenceToken === 'BACK' || normalizedReferenceToken === 'B') {
          submitReferenceTransformCommand()
          cancelActiveReferenceTransformSession()
          return
        }

        if (normalizedReferenceToken === 'M' || normalizedReferenceToken === 'MOVE') {
          submitReferenceTransformCommand()
          dispatchImmediateShortcut('m')
          return
        }
        if (normalizedReferenceToken === 'R' || normalizedReferenceToken === 'ROTATE') {
          submitReferenceTransformCommand()
          dispatchImmediateShortcut('r')
          return
        }
        if (normalizedReferenceToken === 'S' || normalizedReferenceToken === 'SCALE') {
          submitReferenceTransformCommand()
          dispatchImmediateShortcut('s')
          return
        }
        if (normalizedReferenceToken === 'L' || normalizedReferenceToken === 'LOCAL') {
          applyReferenceTransformSpaceShortcut('local', rawToken)
          return
        }
        if (normalizedReferenceToken === 'W' || normalizedReferenceToken === 'WORLD') {
          applyReferenceTransformSpaceShortcut('world', rawToken)
          return
        }

        const parsedVec3 = parseConsoleVec3Literal(rawToken)
        if (parsedVec3 !== null) {
          const appState = useAppStore.getState()
          getViewer()?.cancelReferenceTransformDrag?.()
          appState.setActiveReferenceTransformHandle(null)
          getViewer()?.clearReferenceTransformHandle?.()
          const nextTransformOverride = applyReferenceTransformVec3Value(
            activeReferenceSession.draftTransform,
            activeReferenceSession.mode,
            parsedVec3,
          )
          appState.setActiveReferenceTransformDraft(nextTransformOverride)
          getViewer()?.setReferenceTransformOverride(
            activeReferenceSession.referenceId,
            nextTransformOverride,
          )
          commitActiveReferenceTransformFromConsole(rawToken)
          return
        }

        if (
          (activeReferenceSession.mode === 'rotate' || activeReferenceSession.mode === 'scale') &&
          parseConsoleSignedFloatLiteral(rawToken) !== null
        ) {
          const scalarValue = parseConsoleSignedFloatLiteral(rawToken)!
          const appState = useAppStore.getState()
          getViewer()?.cancelReferenceTransformDrag?.()
          appState.setActiveReferenceTransformHandle(null)
          getViewer()?.clearReferenceTransformHandle?.()
          const nextTransformOverride = applyReferenceTransformVec3Value(
            activeReferenceSession.draftTransform,
            activeReferenceSession.mode,
            { x: scalarValue, y: scalarValue, z: scalarValue },
          )
          appState.setActiveReferenceTransformDraft(nextTransformOverride)
          getViewer()?.setReferenceTransformOverride(
            activeReferenceSession.referenceId,
            nextTransformOverride,
          )
          commitActiveReferenceTransformFromConsole(rawToken)
          return
        }

        switch (matchedChoice?.canonicalToken) {
          case 'SNAP': {
            submitReferenceTransformCommand()
            const snapSession = createActiveReferenceTransformSnapSession(
              activeReferenceSession.referenceId,
              activeReferenceSession.mode,
            )
            if (snapSession !== null) {
              setStagedNavigationSession(snapSession)
              const snapState =
                useAppStore.getState().referenceWorkspace.transformSnapByReferenceId[
                  activeReferenceSession.referenceId
                ] ?? DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE
              useConsoleStore.getState().setInputText(
                formatReferenceTransformSnapValue(
                  getReferenceTransformSnapDriverValue(snapState[activeReferenceSession.mode]),
                ),
                { preserveGuidedReplace: true },
              )
              appendConsoleEntry({
                layer: 'Commands',
                text: buildStagedPromptText(snapSession, snapSession.validChoices),
                source: 'console',
                severity: 'info',
              })
            }
            return
          }
          case 'VEC3':
            commitActiveReferenceTransformFromConsole(rawToken)
            return
          case 'X':
          case 'Y':
          case 'Z':
            submitReferenceTransformCommand()
            openReferenceTransformAxisPrompt(matchedChoice.canonicalToken.toLowerCase() as 'x' | 'y' | 'z')
            appendConsoleEntry({
              layer: 'Commands',
              text: buildConsolePromptSessionText(useConsoleStore.getState().consolePromptSession!),
              source: 'console',
              severity: 'info',
            })
            return
          case 'XY':
          case 'XZ':
          case 'YZ':
            submitReferenceTransformCommand()
            openReferenceTransformPlanePrompt(matchedChoice.canonicalToken.toLowerCase() as 'xy' | 'xz' | 'yz')
            appendConsoleEntry({
              layer: 'Commands',
              text: buildConsolePromptSessionText(useConsoleStore.getState().consolePromptSession!),
              source: 'console',
              severity: 'info',
            })
            return
          default:
            break
        }
      }

      if (
        activeReferenceSession !== null &&
        activeReferenceId !== null &&
        activeStagedSession?.scopeId === 'referenceTransformRoot'
      ) {
        const rawToken = inputText.trim()
        const normalizedReferenceToken = normalizeRadioCommandIdentity(rawToken)
        if (
          normalizedReferenceToken === 'DELETELATEST' ||
          normalizedReferenceToken === 'DELETE' ||
          normalizedReferenceToken === 'DEL' ||
          normalizedReferenceToken === 'D'
        ) {
          const commandIdentity = resolveConsoleRadioCommandIdentity({
            kind: 'stagedExecute',
            activeScopeId: 'referenceTransformRoot',
            actionId: 'reference.transform.deleteLatest',
          })
          appendConsoleEntry({
            layer: 'Commands',
            commandLineKind: 'user',
            text: `> ${rawToken}`,
          })
          pushCommandHistory(rawToken)
          requestRadioBurst(commandIdentity, 'enter')
          const latestEntry = (
            useAppStore.getState().referenceWorkspace.transformHistoryByReferenceId[activeReferenceId] ??
            []
          ).at(-1) ?? null
          if (latestEntry !== null) {
            useAppStore
              .getState()
              .deleteReferenceTransformHistoryEntry(activeReferenceId, latestEntry.entryId)
          }
          const nextTransformRootSession = createActiveReferenceTransformRootSession(activeReferenceId)
          setStagedNavigationSession(nextTransformRootSession)
            appendConsoleEntry({
              layer: 'Transforms',
              text:
                latestEntry === null
                  ? 'Delete latest skipped: no committed transform entry'
                  : 'Deleted latest transform entry',
              source: 'console',
              severity: latestEntry === null ? 'warn' : 'info',
            })
          appendConsoleEntry({
            layer: 'Commands',
            text: buildStagedPromptText(
              nextTransformRootSession,
              nextTransformRootSession.validChoices,
            ),
            source: 'console',
            severity: 'info',
          })
          return
        }
      }

      const shouldHandleAsStagedNavigation =
        (activeStagedSession !== null && activeStagedSession.scopeId !== 'root') ||
        (
          spaghettiState.sketchPlanePickSession === null &&
          spaghettiState.geometrySketchSession?.mode !== 'draw' &&
          isConsoleStagedNavigationRootToken(inputText)
        )

      if (shouldHandleAsStagedNavigation) {
        const rawToken = inputText.trim()
        const normalizedRawToken = normalizeRadioCommandIdentity(rawToken)
        const appStateForGraphShortcut = useAppStore.getState()
        const workspaceContextTargetForGraphShortcut =
          selectConsoleWorkspaceContextTarget(appStateForGraphShortcut)
        const contextFallbackGraphDocumentId =
          workspaceContextTargetForGraphShortcut !== null &&
          'fallbackGraphDocumentId' in workspaceContextTargetForGraphShortcut
            ? workspaceContextTargetForGraphShortcut.fallbackGraphDocumentId ?? null
            : null
        const directGraphShortcutGraphDocumentId = resolveConsoleActionContext().graphDocumentId
        const isContextScopedGraphShortcut =
          activeStagedSession !== null &&
          (activeStagedSession.scopeId.startsWith('content') ||
            activeStagedSession.scopeId.startsWith('reference') ||
            activeStagedSession.scopeId === 'referencesSelected' ||
            activeStagedSession.scopeId === 'referenceCategorySelected' ||
            activeStagedSession.scopeId === 'referenceSelected' ||
            activeStagedSession.scopeId === 'multiSelectSelected')
        const shouldDirectContextGraphSelection =
          (normalizedRawToken === 'GRAPH' || normalizedRawToken === 'G') &&
          (contextFallbackGraphDocumentId !== null || isContextScopedGraphShortcut) &&
          directGraphShortcutGraphDocumentId !== null &&
          activeStagedSession?.scopeId !== 'graphRoot' &&
          activeStagedSession?.scopeId !== 'graphSelected'
        if (shouldDirectContextGraphSelection) {
          const commandIdentity = resolveConsoleRadioCommandIdentity({
            kind: 'stagedAdvance',
            activeScopeId: activeStagedSession?.scopeId ?? null,
            matchedCanonicalToken: 'GRAPH',
            matchedLabel: 'Graph',
          })
          trackRadioCommandIdentity(commandIdentity)
          graphRootEditorRevealRestoreRef.current = ensureSpaghettiEditorVisibleForGraphRoot(
            directGraphShortcutGraphDocumentId,
          )
          activateGraphDocumentIntent(
            buildWorkspaceIntentDepsFromStoreState(),
            directGraphShortcutGraphDocumentId,
            {
              strategy: 'open-or-focus',
            },
          )
          const directedGraphHandoff = resolveConsoleWorkspaceContextSync(
            buildStagedNavigationContextFromStoreState(useSpaghettiStore.getState()),
            {
              graphDocumentId: directGraphShortcutGraphDocumentId,
              nodeId: null,
            },
          ).session
          appendConsoleEntry({
            layer: 'Commands',
            commandLineKind: 'user',
            text: `> ${rawToken}`,
          })
          pushCommandHistory(rawToken)
          if (directedGraphHandoff !== null) {
            setStagedNavigationSession(directedGraphHandoff)
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(directedGraphHandoff.breadcrumb),
              source: 'console',
              severity: 'info',
            })
            appendConsoleEntry({
              layer: 'Commands',
              text: buildStagedPromptText(
                directedGraphHandoff,
                directedGraphHandoff.validChoices,
              ),
              source: 'console',
              severity: 'info',
            })
          }
          requestRadioBurst(commandIdentity, 'enter')
          return
        }
        if (
          (
            (activeStagedSession === null &&
              isConsoleStagedNavigationRootToken(inputText)) ||
            activeStagedSession?.scopeId === 'root'
          ) &&
          (normalizedRawToken === 'GRAPH' || normalizedRawToken === 'G')
        ) {
          const consoleActionContext = resolveConsoleActionContext()
          graphRootEditorRevealRestoreRef.current = ensureSpaghettiEditorVisibleForGraphRoot(
            consoleActionContext.graphDocumentId,
          )
          if (consoleActionContext.graphDocumentId !== null) {
            activateGraphDocumentIntent(
              buildWorkspaceIntentDepsFromStoreState(),
              consoleActionContext.graphDocumentId,
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
          const isObjectLocalViewerNavigation =
            (activeStagedSession?.scopeId === 'contentObjectSelected' &&
              (stagedResult.session.scopeId === 'contentObjectZoomRoot' ||
                stagedResult.session.scopeId === 'contentObjectTransformRoot')) ||
            ((activeStagedSession?.scopeId === 'contentObjectZoomRoot' ||
              activeStagedSession?.scopeId === 'contentObjectTransformRoot') &&
              stagedResult.session.scopeId === 'contentObjectSelected')
          const commandIdentity = resolveConsoleRadioCommandIdentity({
            kind: 'stagedAdvance',
            activeScopeId: activeStagedSession?.scopeId ?? null,
            matchedCanonicalToken: stagedResult.matchedChoice.canonicalToken,
            matchedLabel: stagedResult.matchedChoice.label,
          })
          trackRadioCommandIdentity(commandIdentity)
          requestRadioBurst(commandIdentity, 'enter')
          if (stagedResult.session.scopeId === 'referencesSelected') {
            const appState = useAppStore.getState()
            if (
              stagedResult.matchedChoice.canonicalToken === 'REFERENCES' ||
              (activeStagedSession?.scopeId === 'referenceCategorySelected' &&
                stagedResult.matchedChoice.canonicalToken === 'BACK')
            ) {
              commitWorkspaceTargetSelection(
                {
                  setWorkspaceSelectedTarget: appState.setWorkspaceSelectedTarget,
                  selectPart: appState.selectPart,
                  requestConsoleContextSync: appState.requestConsoleContextSync,
                },
                {
                  kind: 'assembly',
                  assemblyId: REFERENCE_ROOT_ROW_ID,
                },
                {
                  selectedPartKey: null,
                },
              )
            }
          }
          if (
            (activeStagedSession?.scopeId === 'contentAssemblySelected' ||
              activeStagedSession?.scopeId === 'contentComponentSelected' ||
              activeStagedSession?.scopeId === 'contentObjectSelected') &&
            stagedResult.matchedChoice.canonicalToken === 'BACK'
          ) {
            const appState = useAppStore.getState()
            appState.setWorkspaceExplicitSelection({
              selectedTarget: null,
              explicitSelectedTargets: [],
              selectionAnchorTarget: null,
            })
            appState.selectPart(null)
          }
          if (
            activeStagedSession?.scopeId === 'referencesSelected' &&
            stagedResult.matchedChoice.canonicalToken === 'BACK'
          ) {
            const appState = useAppStore.getState()
            appState.setWorkspaceExplicitSelection({
              selectedTarget: null,
              explicitSelectedTargets: [],
              selectionAnchorTarget: null,
            })
            appState.selectPart(null)
          }
          if (
            stagedResult.session.scopeId === 'referenceCategorySelected' &&
            typeof stagedResult.selections.referenceCategoryId === 'string'
          ) {
            const appState = useAppStore.getState()
            commitWorkspaceTargetSelection(
              {
                setWorkspaceSelectedTarget: appState.setWorkspaceSelectedTarget,
                selectPart: appState.selectPart,
                requestConsoleContextSync: appState.requestConsoleContextSync,
              },
              {
                kind: 'component',
                componentId: buildReferenceCategoryRowId(
                  stagedResult.selections.referenceCategoryId as any,
                ),
              },
              {
                selectedPartKey: null,
              },
            )
          }
          if (
            stagedResult.session.scopeId === 'referenceSelected' &&
            typeof stagedResult.selections.referenceId === 'string'
          ) {
            const appState = useAppStore.getState()
            commitWorkspaceTargetSelection(
              {
                setWorkspaceSelectedTarget: appState.setWorkspaceSelectedTarget,
                selectPart: appState.selectPart,
                requestConsoleContextSync: appState.requestConsoleContextSync,
              },
              {
                kind: 'object',
                objectId: buildImportedReferenceRowId(stagedResult.selections.referenceId),
              },
              {
                selectedPartKey: null,
              },
            )
          }
          if (stagedResult.session.scopeId === 'contentObjectTransformRoot') {
            const appState = useAppStore.getState()
            const selectedTarget = appState.workspaceSelection.selectedTarget
            if (selectedTarget?.kind === 'object') {
              const activeObjectId =
                appState.referenceWorkspace.activeContentObjectTransformSession?.objectId ?? null
              if (activeObjectId !== selectedTarget.objectId) {
                appState.beginContentObjectTransformShell(selectedTarget.objectId)
              }
            }
          }
          if (
            activeStagedSession?.selections.selectedNodeId !== null &&
            stagedResult.selections.selectedNodeId === null &&
            !isObjectLocalViewerNavigation &&
            stagedResult.selections.graphDocumentId !== null
          ) {
            selectTargetIntent(buildWorkspaceIntentDepsFromStoreState(), {
              kind: 'graph-document',
              graphDocumentId: stagedResult.selections.graphDocumentId,
            })
          } else if (
            stagedResult.selections.selectedNodeId !== null &&
            !isObjectLocalViewerNavigation &&
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
            if (!isObjectLocalViewerNavigation) {
              activateGraphDocumentIntent(
                buildWorkspaceIntentDepsFromStoreState(),
                stagedResult.selections.graphDocumentId,
                {
                  strategy: 'open-or-focus',
                },
              )
            }
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
          if (
            activeStagedSession?.scopeId === 'sketchDrawZoomRoot' &&
            stagedResult.matchedChoice.canonicalToken === 'BACK'
          ) {
            setStagedNavigationSession(null)
            return
          }
          setStagedNavigationSession(stagedResult.session)
          const stagedSnapMode = getReferenceTransformSnapScopeMode(stagedResult.session.scopeId)
          if (stagedSnapMode !== null && typeof stagedResult.selections.referenceId === 'string') {
            const snapState =
              useAppStore.getState().referenceWorkspace.transformSnapByReferenceId[
                stagedResult.selections.referenceId
              ] ?? DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE
            const stagedSnapAxis = getReferenceTransformSnapScopeAxis(stagedResult.session.scopeId)
            useConsoleStore
              .getState()
              .setInputText(
                formatReferenceTransformSnapValue(
                  stagedSnapAxis === null
                    ? getReferenceTransformSnapDriverValue(snapState[stagedSnapMode])
                    : getReferenceTransformSnapAxisValue(snapState[stagedSnapMode], stagedSnapAxis),
                ),
                { preserveGuidedReplace: true },
              )
          }
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
            stagedResult.actionId === 'radio.randomizeSampleTimes' ||
            stagedResult.actionId === 'radio.openToolbar' ||
            stagedResult.actionId === 'radio.closeToolbar'
          ) {
            let radioStateAfterAction = null as ReturnType<typeof useAudioSamplerStore.getState> | null
            const sketchDrawResumeSession =
              isSketchDrawLocalStagedScope(activeStagedSession) ? activeStagedSession : null
            const returnToSketchDrawAfterRadio = spaghettiState.geometrySketchSession?.mode === 'draw'
            if (stagedResult.actionId === 'radio.on') {
              if (returnToSketchDrawAfterRadio) {
                setStagedNavigationSession(sketchDrawResumeSession)
              } else {
                enterGuidedRootSession()
              }
              useAudioSamplerStore.getState().turnRadioOn()
              radioStateAfterAction = useAudioSamplerStore.getState()
              requestRadioRuntimeWarmup(radioStateAfterAction.sourceUrl)
            } else if (stagedResult.actionId === 'radio.off') {
              if (returnToSketchDrawAfterRadio) {
                setStagedNavigationSession(sketchDrawResumeSession)
              } else {
                enterGuidedRootSession()
              }
              useAudioSamplerStore.getState().turnRadioOff()
            } else if (stagedResult.actionId === 'radio.openToolbar') {
              setStagedNavigationSession(stagedResult.session)
              useAudioSamplerStore.getState().openRadioToolbar()
            } else if (stagedResult.actionId === 'radio.closeToolbar') {
              setStagedNavigationSession(stagedResult.session)
              useAudioSamplerStore.getState().closeRadioToolbar()
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
                    : stagedResult.actionId === 'radio.openToolbar'
                      ? 'Radio toolbar opened'
                      : stagedResult.actionId === 'radio.closeToolbar'
                        ? 'Radio toolbar closed'
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
              if (returnToSketchDrawAfterRadio) {
                if (sketchDrawResumeSession !== null) {
                  appendConsoleEntry({
                    layer: 'Commands',
                    text: buildStagedPromptText(
                      sketchDrawResumeSession,
                      sketchDrawResumeSession.validChoices,
                    ),
                    source: 'console',
                    severity: 'info',
                  })
                } else {
                  const nextDescriptor = getActiveFeatureAssistDescriptor({
                    sketchPlanePickSession: useSpaghettiStore.getState().sketchPlanePickSession,
                    geometrySketchSession: useSpaghettiStore.getState().geometrySketchSession,
                    referenceWorkspace: useAppStore.getState().referenceWorkspace,
                    stagedNavigationSession: useConsoleStore.getState().stagedNavigationSession,
                  })
                  if (nextDescriptor !== null) {
                    appendConsoleEntry({
                      layer: 'Commands',
                      text: buildFeatureAssistPromptText(nextDescriptor),
                      source: 'console',
                      severity: 'info',
                    })
                  }
                }
              } else {
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
              }
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
            stagedResult.actionId === 'sketchdraw.tool.line' ||
            stagedResult.actionId === 'sketchdraw.tool.pline' ||
            stagedResult.actionId === 'sketchdraw.tool.rectangle' ||
            stagedResult.actionId === 'sketchdraw.tool.circle' ||
            stagedResult.actionId === 'sketchdraw.previous' ||
            stagedResult.actionId === 'sketchdraw.delete' ||
            stagedResult.actionId === 'sketchdraw.done' ||
            stagedResult.actionId === 'sketchdraw.back' ||
            stagedResult.actionId === 'sketchdraw.exit'
          ) {
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(stagedResult.breadcrumb),
              source: 'console',
              severity: 'info',
            })
            if (stagedResult.actionId === 'sketchdraw.done') {
              const finishedSketchNodeId =
                useSpaghettiStore.getState().geometrySketchSession?.nodeId ?? null
              if (finishedSketchNodeId !== null) {
                revealFinishedSketch(finishedSketchNodeId)
              }
              setStagedNavigationSession(null)
              useSpaghettiStore.getState().closeGeometrySketchSession()
              const spaghettiState = useSpaghettiStore.getState()
              const resumedHandoff =
                spaghettiState.activeGraphDocumentId.length > 0
                  ? resolveConsoleWorkspaceContextSync(
                      buildStagedNavigationContextFromStoreState(spaghettiState),
                      {
                        graphDocumentId: spaghettiState.activeGraphDocumentId,
                        nodeId: spaghettiState.selectedNodeId,
                      },
                    )
                  : { session: null, selectedLabel: null }
              if (resumedHandoff.session !== null) {
                setStagedNavigationSession(resumedHandoff.session)
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
            setStagedNavigationSession(null)
            const sketchDrawCommand =
              stagedResult.actionId === 'sketchdraw.tool.line'
                ? 'line'
                : stagedResult.actionId === 'sketchdraw.tool.pline'
                  ? 'pline'
                  : stagedResult.actionId === 'sketchdraw.tool.rectangle'
                    ? 'rectangle'
                    : stagedResult.actionId === 'sketchdraw.tool.circle'
                      ? 'circle'
                      : stagedResult.actionId === 'sketchdraw.previous'
                        ? 'previous'
                        : stagedResult.actionId === 'sketchdraw.delete'
                          ? 'delete'
                          : stagedResult.actionId === 'sketchdraw.back'
                            ? 'back'
                            : 'x'
            useSpaghettiStore.getState().runGeometrySketchDrawCommand(sketchDrawCommand)
            requestRadioBurst(commandIdentity, 'enter')
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
            stagedResult.actionId === 'content.newAssembly' ||
            stagedResult.actionId === 'content.newComponent' ||
            stagedResult.actionId === 'content.rename' ||
            stagedResult.actionId === 'content.delete'
          ) {
            const appState = useAppStore.getState()
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(stagedResult.breadcrumb),
              source: 'console',
              severity: 'info',
            })
            if (stagedResult.actionId === 'content.newAssembly') {
              const assemblyId = appState.createProjectAssembly()
              appState.requestConsoleContextSync('target-selection')
              const assemblyLabel =
                useAppStore.getState().projectContent.assembliesById[assemblyId]?.label ?? 'Assembly'
              const returnSession = resolveConsoleWorkspaceContextSync(
                buildStagedNavigationContextFromStoreState(useSpaghettiStore.getState()),
                {
                  kind: 'assembly',
                  assemblyId,
                  label: assemblyLabel,
                  fallbackGraphDocumentId: null,
                  canDelete: true,
                },
              ).session ?? stagedResult.session
              setStagedNavigationSession(returnSession)
              setConsolePromptSession({
                kind: 'content.owner.label',
                breadcrumb: [...stagedResult.session.breadcrumb, assemblyLabel],
                label: 'Assembly Name',
                prefill: assemblyLabel,
                returnSession,
                target: { kind: 'assembly', assemblyId },
              })
              appendConsoleEntry({
                layer: 'Commands',
                text: buildConsolePromptSessionText(useConsoleStore.getState().consolePromptSession!),
                source: 'console',
                severity: 'info',
              })
              requestRadioBurst(commandIdentity, 'enter')
              return
            }

            if (stagedResult.actionId === 'content.newComponent') {
              const assemblyId = stagedResult.selections.contentAssemblyId ?? null
              if (assemblyId === null) {
                appendConsoleEntry({
                  layer: 'Browser',
                  text: 'New Component requires a selected assembly',
                  source: 'console',
                  severity: 'warn',
                })
                return
              }
              const componentId = appState.createProjectComponent(assemblyId)
              if (componentId === null) {
                appendConsoleEntry({
                  layer: 'Browser',
                  text: 'New Component is not available for this target',
                  source: 'console',
                  severity: 'warn',
                })
                return
              }
              appState.requestConsoleContextSync('target-selection')
              const componentLabel =
                useAppStore.getState().projectContent.componentsById[componentId]?.label ?? 'Component'
              const returnSession = resolveConsoleWorkspaceContextSync(
                buildStagedNavigationContextFromStoreState(useSpaghettiStore.getState()),
                {
                  kind: 'component',
                  componentId,
                  label: componentLabel,
                  fallbackGraphDocumentId: null,
                  canRename: true,
                  canDelete: true,
                },
              ).session ?? stagedResult.session
              setStagedNavigationSession(returnSession)
              setConsolePromptSession({
                kind: 'content.owner.label',
                breadcrumb: [...stagedResult.session.breadcrumb, componentLabel],
                label: 'Component Name',
                prefill: componentLabel,
                returnSession,
                target: { kind: 'component', componentId },
              })
              appendConsoleEntry({
                layer: 'Commands',
                text: buildConsolePromptSessionText(useConsoleStore.getState().consolePromptSession!),
                source: 'console',
                severity: 'info',
              })
              requestRadioBurst(commandIdentity, 'enter')
              return
            }

            if (stagedResult.actionId === 'content.rename') {
              const assemblyId = stagedResult.selections.contentAssemblyId ?? null
              const componentId = stagedResult.selections.contentComponentId ?? null
              if (assemblyId !== null) {
                const assemblyLabel =
                  appState.projectContent.assembliesById[assemblyId]?.label ?? 'Assembly'
                setConsolePromptSession({
                  kind: 'content.owner.label',
                  breadcrumb: stagedResult.breadcrumb,
                  label: 'Assembly Name',
                  prefill: assemblyLabel,
                  returnSession: stagedResult.session,
                  target: { kind: 'assembly', assemblyId },
                })
              } else if (componentId !== null) {
                const componentLabel =
                  appState.projectContent.componentsById[componentId]?.label ?? 'Component'
                setConsolePromptSession({
                  kind: 'content.owner.label',
                  breadcrumb: stagedResult.breadcrumb,
                  label: 'Component Name',
                  prefill: componentLabel,
                  returnSession: stagedResult.session,
                  target: { kind: 'component', componentId },
                })
              }
              appendConsoleEntry({
                layer: 'Commands',
                text: buildConsolePromptSessionText(useConsoleStore.getState().consolePromptSession!),
                source: 'console',
                severity: 'info',
              })
              requestRadioBurst(commandIdentity, 'enter')
              return
            }

            const assemblyId = stagedResult.selections.contentAssemblyId ?? null
            const componentId = stagedResult.selections.contentComponentId ?? null
            const deleteTarget =
              assemblyId !== null
                ? ({ kind: 'assembly', assemblyId } as const)
                : componentId !== null
                  ? ({ kind: 'component', componentId } as const)
                  : null
            if (deleteTarget === null) {
              appendConsoleEntry({
                layer: 'Browser',
                text: 'Delete requires a selected content owner',
                source: 'console',
                severity: 'warn',
              })
              return
            }
            const childCount =
              deleteTarget.kind === 'assembly'
                ? appState.projectContent.assembliesById[deleteTarget.assemblyId]?.childRowIds.length ?? 0
                : appState.projectContent.componentsById[deleteTarget.componentId]?.childObjectIds.length ?? 0
            const label =
              deleteTarget.kind === 'assembly'
                ? appState.projectContent.assembliesById[deleteTarget.assemblyId]?.label ?? deleteTarget.assemblyId
                : appState.projectContent.componentsById[deleteTarget.componentId]?.label ?? deleteTarget.componentId
            if (
              childCount > 0 &&
              typeof window.confirm === 'function' &&
              !window.confirm(`Delete ${label} and its subtree?`)
            ) {
              return
            }
            if (!appState.deleteProjectContentOwner(deleteTarget)) {
              appendConsoleEntry({
                layer: 'Browser',
                text: 'Delete is not available for this content owner',
                source: 'console',
                severity: 'warn',
              })
              return
            }
            appState.requestConsoleContextSync('target-selection')
            appendConsoleEntry({
              layer: 'Browser',
              text: `Deleted ${label}`,
              source: 'console',
              severity: 'info',
            })
            requestRadioBurst(commandIdentity, 'enter')
            return
          }
          if (
            stagedResult.actionId === 'camera.pan' ||
            stagedResult.actionId === 'camera.orbit' ||
            stagedResult.actionId === 'camera.projection.orthographic' ||
            stagedResult.actionId === 'camera.projection.perspective' ||
            stagedResult.actionId === 'sketchdraw.camera.projection.orthographic' ||
            stagedResult.actionId === 'sketchdraw.camera.projection.perspective' ||
            stagedResult.actionId === 'zoom.model.all' ||
            stagedResult.actionId === 'zoom.model.extents' ||
            stagedResult.actionId === 'zoom.model.previous' ||
            stagedResult.actionId === 'zoom.model.window' ||
            stagedResult.actionId === 'zoom.model.object' ||
            stagedResult.actionId === 'zoom.canvas.all' ||
            stagedResult.actionId === 'zoom.canvas.extents' ||
            stagedResult.actionId === 'zoom.canvas.previous' ||
            stagedResult.actionId === 'zoom.canvas.window' ||
            stagedResult.actionId === 'zoom.canvas.object'
          ) {
            const viewer = getViewer()
            const consoleActionContext = resolveConsoleActionContext(
              stagedResult.selections.graphDocumentId ?? null,
            )
            const commandLabel = formatStagedBreadcrumb(stagedResult.breadcrumb)
            const selectedReferenceId = resolveSelectedReferenceIdForZoom()
            const executeModelZoomObject = (): boolean => {
              if (stagedResult.session.scopeId === 'sketchDrawZoomRoot') {
                return frameSelectedGeometrySketchCommand()
              }
              if (
                stagedResult.session.scopeId === 'contentAssemblyZoomRoot' ||
                stagedResult.session.scopeId === 'referencesZoomRoot' ||
                stagedResult.session.scopeId === 'referenceCategoryZoomRoot'
              ) {
                if (stagedResult.session.scopeId === 'contentAssemblyZoomRoot') {
                  const selectionSet = resolveSelectionSetForZoom()
                  return frameSelectionSetCommand(selectionSet.partKeys, selectionSet.referenceIds)
                }
                return frameSelectionSetCommand(
                  [],
                  stagedResult.session.selections.referenceZoomIds ?? [],
                )
              }
              if (
                stagedResult.session.scopeId === 'multiSelectZoomRoot' ||
                stagedResult.session.scopeId === 'multiSelectSelected'
              ) {
                const selectionSet = resolveSelectionSetForZoom()
                return frameSelectionSetCommand(selectionSet.partKeys, selectionSet.referenceIds)
              }
              const selectedObjectPartKey = resolveSelectedObjectPartKeyForZoom()
              if (selectedObjectPartKey !== null) {
                frameSelectedCommand(selectedObjectPartKey)
                return true
              }
              if (selectedReferenceId !== null) {
                frameReferenceCommand(selectedReferenceId)
                return true
              }
              appendConsoleEntry({
                layer: 'Diagnostics',
                text: 'Zoom Object requires a selected part, object, or reference',
                source: 'console',
                severity: 'warn',
              })
              return false
            }

            const executeCanvasZoomAction = (
              action: 'all' | 'extents' | 'previous' | 'window' | 'object',
            ): boolean => {
              const workspaceSelectedTarget = useAppStore.getState().workspaceSelection.selectedTarget
              const workspaceSelectedGraphDocumentId =
                workspaceSelectedTarget?.kind === 'graph-document'
                  ? workspaceSelectedTarget.graphDocumentId
                  : workspaceSelectedTarget?.kind === 'graph-node'
                    ? workspaceSelectedTarget.graphDocumentId
                    : null
              const graphDocumentId =
                stagedResult.selections.graphDocumentId ??
                workspaceSelectedGraphDocumentId ??
                useConsoleStore.getState().stagedNavigationSession?.selections.graphDocumentId ??
                consoleActionContext.graphDocumentId
              if (graphDocumentId === null) {
                appendConsoleEntry({
                  layer: 'Diagnostics',
                  text: 'Graph zoom requires an active graph selection',
                  source: 'console',
                  severity: 'warn',
                })
                return false
              }
              const editorViewportId = resolveEditorViewportIdForGraphDocumentFromState(
                useSpaghettiStore.getState(),
                graphDocumentId,
              )
              if (editorViewportId === null) {
                appendConsoleEntry({
                  layer: 'Diagnostics',
                  text: 'Graph zoom requires an open editor viewport for the selected graph',
                  source: 'console',
                  severity: 'warn',
                })
                return false
              }
              const spaghettiState = useSpaghettiStore.getState()
              if (action === 'all' || action === 'extents') {
                spaghettiState.requestEditorViewportCanvasFit(editorViewportId)
                appendConsoleEntry({
                  layer: 'View',
                  text: 'Graph canvas zoom extents',
                  source: 'console',
                  severity: 'info',
                })
                return true
              }
              if (action === 'object') {
                const selectedNodeId =
                  stagedResult.selections.selectedNodeId ??
                  selectEditorViewportSelectedNodeId(spaghettiState, editorViewportId)
                const selectedGraph =
                  selectGraphDocumentById(spaghettiState, graphDocumentId)?.graph ?? null
                const selectedNodeExists =
                  selectedNodeId !== null &&
                  (selectedGraph?.nodes.some((node) => node.nodeId === selectedNodeId) ?? false)
                if (!selectedNodeExists || selectedNodeId === null) {
                  appendConsoleEntry({
                    layer: 'Diagnostics',
                    text: 'Graph canvas Zoom Object requires a selected node in the current graph',
                    source: 'console',
                    severity: 'warn',
                  })
                  return false
                }
                spaghettiState.requestEditorViewportNodeFit(editorViewportId, selectedNodeId)
                appendConsoleEntry({
                  layer: 'View',
                  text: `Graph canvas zoom object: ${selectedNodeId}`,
                  source: 'console',
                  severity: 'info',
                })
                return true
              }
              appendConsoleEntry({
                layer: 'Diagnostics',
                text: `Graph canvas ${action === 'previous' ? 'Zoom Previous' : 'Zoom Window'} is not implemented yet`,
                source: 'console',
                severity: 'warn',
              })
              return false
            }

            appendConsoleEntry({
              layer: 'Commands',
              text: commandLabel,
              source: 'console',
              severity: 'info',
            })

            let actionSucceeded = true
            if (stagedResult.actionId === 'camera.pan' || stagedResult.actionId === 'camera.orbit') {
              setConsoleCameraModeCommand(
                stagedResult.actionId === 'camera.pan' ? 'pan' : 'orbit',
              )
              appendConsoleEntry({
                layer: 'View',
                text:
                  stagedResult.actionId === 'camera.pan'
                    ? 'Pan armed: drag in the viewport with LMB'
                    : 'Orbit armed: drag in the viewport with LMB',
                source: 'console',
                severity: 'info',
              })
            } else if (
              stagedResult.actionId === 'camera.projection.orthographic' ||
              stagedResult.actionId === 'camera.projection.perspective' ||
              stagedResult.actionId === 'sketchdraw.camera.projection.orthographic' ||
              stagedResult.actionId === 'sketchdraw.camera.projection.perspective'
            ) {
              const projectionMode =
                stagedResult.actionId === 'camera.projection.orthographic' ||
                stagedResult.actionId === 'sketchdraw.camera.projection.orthographic'
                  ? 'orthographic'
                  : 'perspective'
              setProjectionModeCommand(projectionMode)
              appendConsoleEntry({
                layer: 'View',
                text: `Projection: ${
                  projectionMode === 'orthographic' ? 'Orthographic' : 'Perspective'
                }`,
                source: 'console',
                severity: 'info',
              })
            } else if (
              stagedResult.actionId === 'zoom.model.all' ||
              stagedResult.actionId === 'zoom.model.extents'
            ) {
              if (stagedResult.session.scopeId === 'sketchDrawZoomRoot') {
                viewer?.frameGeometrySketch()
              } else if (stagedResult.actionId === 'zoom.model.all') {
                frameAllCommand()
              } else {
                frameExtentsCommand()
              }
            } else if (stagedResult.actionId === 'zoom.model.previous') {
              framePreviousCommand()
            } else if (stagedResult.actionId === 'zoom.model.window') {
              setConsoleCameraModeCommand('zoom-window')
              appendConsoleEntry({
                layer: 'View',
                text: 'Zoom Window armed: drag a box in the viewport with LMB',
                source: 'console',
                severity: 'info',
              })
            } else if (stagedResult.actionId === 'zoom.model.object') {
              actionSucceeded = executeModelZoomObject()
            } else {
              const canvasAction =
                stagedResult.actionId === 'zoom.canvas.all'
                  ? 'all'
                  : stagedResult.actionId === 'zoom.canvas.extents'
                    ? 'extents'
                    : stagedResult.actionId === 'zoom.canvas.previous'
                      ? 'previous'
                      : stagedResult.actionId === 'zoom.canvas.window'
                        ? 'window'
                        : 'object'
              actionSucceeded = executeCanvasZoomAction(canvasAction)
            }

            let nextStagedSession: ConsoleStagedNavigationSession | null = stagedResult.session
            if (actionSucceeded && stagedResult.actionId.startsWith('zoom.')) {
              const stagedContext = buildStagedNavigationContextFromStoreState(
                useSpaghettiStore.getState(),
              )
              let unwindSession = stagedResult.session
              while (
                unwindSession.scopeId === 'zoomRoot' ||
                unwindSession.scopeId === 'sketchDrawZoomRoot' ||
                unwindSession.scopeId === 'contentAssemblyZoomRoot' ||
                unwindSession.scopeId === 'contentObjectZoomRoot' ||
                unwindSession.scopeId === 'multiSelectZoomRoot' ||
                unwindSession.scopeId === 'referencesZoomRoot' ||
                unwindSession.scopeId === 'referenceCategoryZoomRoot' ||
                unwindSession.scopeId === 'referenceZoomRoot' ||
                unwindSession.scopeId === 'graphZoomRoot' ||
                unwindSession.scopeId === 'graphZoomCanvas' ||
                unwindSession.scopeId === 'graphZoomModelViewport'
              ) {
                const resumedResult = submitConsoleStagedNavigationToken(
                  unwindSession,
                  'back',
                  stagedContext,
                )
                if (resumedResult.kind !== 'advance') {
                  break
                }
                unwindSession = resumedResult.session
              }
              nextStagedSession = unwindSession
            } else if (
              actionSucceeded &&
              (stagedResult.actionId === 'sketchdraw.camera.projection.orthographic' ||
                stagedResult.actionId === 'sketchdraw.camera.projection.perspective')
            ) {
              nextStagedSession = createSketchDrawRootSession(
                buildStagedNavigationContextFromStoreState(useSpaghettiStore.getState()),
              )
            }

            setStagedNavigationSession(nextStagedSession)
            if (nextStagedSession !== null) {
              appendConsoleEntry({
                layer: 'Commands',
                text: buildStagedPromptText(nextStagedSession, nextStagedSession.validChoices),
                source: 'console',
                severity: 'info',
              })
            }
            if (actionSucceeded) {
              requestRadioBurst(commandIdentity, 'enter')
            }
            return
          }
          if (
            (stagedResult.actionId === 'reference.loadAll' ||
              stagedResult.actionId === 'reference.category.loadAll' ||
              stagedResult.actionId === 'reference.loadModel' ||
              stagedResult.actionId === 'reference.transform.commitShell' ||
              stagedResult.actionId === 'reference.transform.deleteLatest' ||
              stagedResult.actionId === 'reference.transform.move' ||
              stagedResult.actionId === 'reference.transform.rotate' ||
              stagedResult.actionId === 'reference.transform.scale' ||
              stagedResult.actionId === 'reference.transform.space.local' ||
              stagedResult.actionId === 'reference.transform.space.world' ||
              stagedResult.actionId.startsWith('reference.transform.snap.') ||
              stagedResult.actionId === 'content.selectAll' ||
              stagedResult.actionId === 'content.transform.move' ||
              stagedResult.actionId === 'content.transform.rotate' ||
              stagedResult.actionId === 'content.transform.scale' ||
              stagedResult.actionId === 'content.transform.deleteLatest' ||
              stagedResult.actionId === 'content.transform.space.local' ||
              stagedResult.actionId === 'content.transform.space.world' ||
              stagedResult.actionId.startsWith('content.transform.snap.')) &&
            (stagedResult.actionId === 'reference.loadAll' ||
              stagedResult.actionId === 'reference.category.loadAll' ||
              typeof stagedResult.selections.referenceId === 'string' ||
              stagedResult.actionId === 'content.selectAll' ||
              stagedResult.actionId === 'content.transform.move' ||
              stagedResult.actionId === 'content.transform.rotate' ||
              stagedResult.actionId === 'content.transform.scale' ||
              stagedResult.actionId === 'content.transform.deleteLatest' ||
              stagedResult.actionId === 'content.transform.space.local' ||
              stagedResult.actionId === 'content.transform.space.world' ||
              stagedResult.actionId.startsWith('content.transform.snap.'))
          ) {
            const appState = useAppStore.getState()
            setStagedNavigationSession(stagedResult.session)
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(stagedResult.breadcrumb),
              source: 'console',
              severity: 'info',
            })
            if (stagedResult.actionId === 'reference.loadAll') {
              appState.startReferenceLoadBatchForAll()
              appendConsoleEntry({
                layer: 'Browser',
                text: 'Load All: References',
                source: 'console',
                severity: 'info',
              })
            } else if (stagedResult.actionId === 'reference.category.loadAll') {
              const categoryId = stagedResult.selections.referenceCategoryId ?? null
              if (typeof categoryId === 'string') {
                appState.startReferenceLoadBatchForCategory(categoryId as any)
              }
              appendConsoleEntry({
                layer: 'Browser',
                text: `Load All: ${stagedResult.session.breadcrumb.at(-1) ?? 'Category'}`,
                source: 'console',
                severity: 'info',
              })
            } else if (stagedResult.actionId === 'reference.loadModel') {
              const referenceId = stagedResult.selections.referenceId as string
              const nextReferenceSession = resolveConsoleWorkspaceContextSync(
                buildStagedNavigationContextFromStoreState(useSpaghettiStore.getState()),
                buildReferenceConsoleWorkspaceTarget(
                  appState.referenceWorkspace,
                  referenceId,
                  stagedResult.session.breadcrumb.at(-1) ?? referenceId,
                ),
              ).session
              const referenceRuntimeTraits = resolveReferenceRuntimeTraits(appState, referenceId)
              const currentLoadState = referenceRuntimeTraits.loadState
              const isCurrentlyVisible = referenceRuntimeTraits.isVisible
              if (!isCurrentlyVisible && currentLoadState === 'unloaded') {
                appState.retryReferenceItemLoad(referenceId)
              } else {
                appState.setReferenceItemVisibility(referenceId, true)
              }
              if (nextReferenceSession !== null) {
                setStagedNavigationSession(nextReferenceSession)
              }
              appendConsoleEntry({
                layer: 'Browser',
                text: `Load Model: ${stagedResult.session.breadcrumb.at(-1) ?? referenceId}`,
                source: 'console',
                severity: 'info',
              })
            } else if (stagedResult.actionId === 'reference.transform.commitShell') {
              appState.requestReferenceTransformShellExit('commit-shell')
              requestRadioBurst(commandIdentity, 'enter')
              return
            } else if (stagedResult.actionId === 'reference.transform.deleteLatest') {
              const referenceId = stagedResult.selections.referenceId as string
              const activeSession = appState.referenceWorkspace.activeReferenceTransformSession
              const latestEntry =
                (appState.referenceWorkspace.transformHistoryByReferenceId[referenceId] ?? []).at(-1) ??
                null
              const shouldConfirmDeleteLatest =
                latestEntry !== null &&
                activeSession?.referenceId === referenceId &&
                latestEntry.sessionId !== activeSession.sessionId
              if (shouldConfirmDeleteLatest) {
                const promptSession = createDeleteLatestTransformConfirmPromptSession(
                  { kind: 'reference', referenceId },
                  stagedResult.session,
                )
                setConsolePromptSession(promptSession)
                appendConsoleEntry({
                  layer: 'Transforms',
                  text: 'Delete latest will remove an entry from the previous transform. Are you sure?',
                  source: 'console',
                  severity: 'warn',
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
              const deletedEntry = deleteLatestReferenceTransformEntry(referenceId)
              const nextTransformRootSession = createActiveReferenceTransformRootSession(referenceId)
              setStagedNavigationSession(nextTransformRootSession)
              appendConsoleEntry({
                layer: 'Transforms',
                text:
                  deletedEntry === null
                    ? 'Delete latest skipped: no committed transform entry'
                    : 'Deleted latest transform entry',
                source: 'console',
                severity: deletedEntry === null ? 'warn' : 'info',
              })
              appendConsoleEntry({
                layer: 'Commands',
                text: buildStagedPromptText(
                  nextTransformRootSession,
                  nextTransformRootSession.validChoices,
                ),
                source: 'console',
                severity: 'info',
              })
              requestRadioBurst(commandIdentity, 'enter')
              return
            } else if (
              stagedResult.actionId === 'reference.transform.move' ||
              stagedResult.actionId === 'reference.transform.rotate' ||
              stagedResult.actionId === 'reference.transform.scale'
            ) {
              const referenceId = stagedResult.selections.referenceId as string
              const transformMode =
                stagedResult.actionId === 'reference.transform.rotate'
                  ? 'rotate'
                  : stagedResult.actionId === 'reference.transform.scale'
                    ? 'scale'
                    : 'translate'
              appState.beginReferenceTransformShell(referenceId)
              appState.beginReferenceTransformEntry(transformMode)
              const nextSession =
                useAppStore.getState().referenceWorkspace.activeReferenceTransformSession
              const viewer = getViewer()
              viewer?.setReferenceTransformSession?.({
                referenceId,
                mode: transformMode,
                space:
                  useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.space ??
                  'local',
                entryOrigin: nextSession?.entryOrigin ?? null,
              })
              if (transformMode === 'rotate') {
                viewer?.activateRotateCenterHandle?.()
              } else if (transformMode === 'scale') {
                viewer?.activateScaleCenterHandle?.()
              } else {
                viewer?.activateTranslateCenterHandle?.()
              }
              appendConsoleEntry({
                layer: 'Transforms',
                text: `${
                  transformMode === 'rotate'
                    ? 'Rotate'
                    : transformMode === 'scale'
                      ? 'Scale'
                      : 'Move'
                } armed`,
                source: 'console',
                severity: 'info',
              })
            } else if (
              stagedResult.actionId === 'reference.transform.space.local' ||
              stagedResult.actionId === 'reference.transform.space.world'
            ) {
              const referenceId = stagedResult.selections.referenceId as string
              const nextSpace =
                stagedResult.actionId === 'reference.transform.space.world' ? 'world' : 'local'
              const activeSession = appState.referenceWorkspace.activeReferenceTransformSession
              const alreadyApplied =
                activeSession?.referenceId === referenceId && activeSession.space === nextSpace
              if (!alreadyApplied) {
                appState.setActiveReferenceTransformSpace(nextSpace)
              }
              const nextTransformRootSession = createActiveReferenceTransformRootSession(referenceId)
              setStagedNavigationSession(nextTransformRootSession)
              appendConsoleEntry({
                layer: 'Transforms',
                text: `Space: ${nextSpace === 'local' ? 'Local' : 'World'}${
                  alreadyApplied ? ' already applied' : ' applied'
                }`,
                source: 'console',
                severity: 'info',
              })
              appendConsoleEntry({
                layer: 'Commands',
                text: buildStagedPromptText(
                  nextTransformRootSession,
                  nextTransformRootSession.validChoices,
                ),
                source: 'console',
                severity: 'info',
              })
              requestRadioBurst(commandIdentity, 'enter')
              return
            } else if (stagedResult.actionId.startsWith('reference.transform.snap.')) {
              const referenceId = stagedResult.selections.referenceId as string
              const snapMode =
                stagedResult.actionId.includes('.translate.')
                  ? 'translate'
                  : stagedResult.actionId.includes('.rotate.')
                    ? 'rotate'
                    : 'scale'
              const isModeValueAction =
                stagedResult.actionId === `reference.transform.snap.${snapMode}.value`
              const snapAxis = stagedResult.actionId.endsWith('.x.value')
                ? 'x'
                : stagedResult.actionId.endsWith('.y.value')
                  ? 'y'
                  : stagedResult.actionId.endsWith('.z.value')
                    ? 'z'
                    : null
              const isAxisValueAction = snapAxis !== null
              const isOnAction = stagedResult.actionId.endsWith('.on')
              const isLockAction = stagedResult.actionId.endsWith('.lock')
              const isUnlockAction = stagedResult.actionId.endsWith('.unlock')
              const numericValue = parseConsoleSignedFloatLiteral(rawToken)
              const nextSession =
                activeReferenceSession?.entryActive === true
                  ? createActiveReferenceTransformSnapSession(referenceId, snapMode)
                  : createActiveReferenceTransformRootSession(referenceId)
              if (isModeValueAction && numericValue !== null) {
                appState.setReferenceTransformSnapValue(referenceId, snapMode, numericValue)
              } else if (isAxisValueAction && numericValue !== null) {
                appState.setReferenceTransformSnapAxisValue(
                  referenceId,
                  snapMode,
                  snapAxis,
                  numericValue,
                )
              } else if (isLockAction || isUnlockAction) {
                appState.setReferenceTransformSnapLocked(referenceId, snapMode, isLockAction)
              } else {
                appState.setReferenceTransformSnapEnabled(referenceId, snapMode, isOnAction)
              }
              if (nextSession !== null) {
                setStagedNavigationSession(nextSession)
              }
              const nextSnapState =
                useAppStore.getState().referenceWorkspace.transformSnapByReferenceId[referenceId] ??
                DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE
              const modeLabel = getReferenceTransformSnapModeLabel(snapMode)
              appendConsoleEntry({
                layer: 'Transforms',
                text: isModeValueAction
                  ? `${modeLabel} snap value: ${formatReferenceTransformSnapValue(
                      getReferenceTransformSnapDriverValue(nextSnapState[snapMode]),
                    )}`
                  : isAxisValueAction
                    ? `${modeLabel} ${getReferenceTransformSnapAxisLabel(snapAxis)} snap value: ${formatReferenceTransformSnapValue(
                        getReferenceTransformSnapAxisValue(nextSnapState[snapMode], snapAxis),
                      )}`
                    : isLockAction || isUnlockAction
                      ? `${modeLabel} snap XYZ: ${isLockAction ? 'Locked' : 'Unlocked'}`
                      : `${modeLabel} snap: ${isOnAction ? 'On' : 'Off'}`,
                source: 'console',
                severity: 'info',
              })
              if (nextSession !== null) {
                if (activeReferenceSession?.entryActive === true) {
                  const nextDescriptor = getActiveFeatureAssistDescriptor({
                    sketchPlanePickSession: useSpaghettiStore.getState().sketchPlanePickSession,
                    geometrySketchSession: useSpaghettiStore.getState().geometrySketchSession,
                    referenceWorkspace: useAppStore.getState().referenceWorkspace,
                    stagedNavigationSession: nextSession,
                  })
                  if (nextDescriptor !== null) {
                    appendConsoleEntry({
                      layer: 'Commands',
                      text: buildFeatureAssistPromptText(nextDescriptor),
                      source: 'console',
                      severity: 'info',
                    })
                  }
                } else {
                  appendConsoleEntry({
                    layer: 'Commands',
                    text: buildStagedPromptText(nextSession, nextSession.validChoices),
                    source: 'console',
                    severity: 'info',
                  })
                }
              }
              requestRadioBurst(commandIdentity, 'enter')
              return
            } else if (
              stagedResult.actionId === 'content.transform.space.local' ||
              stagedResult.actionId === 'content.transform.space.world'
            ) {
              const activeSession = appState.referenceWorkspace.activeContentObjectTransformSession
              const objectId = activeSession?.objectId ?? stagedResult.selections.contentObjectId ?? null
              if (objectId === null) {
                appendConsoleEntry({
                  layer: 'Transforms',
                  text: 'Viewer Transform space requires an active content object transform session',
                  source: 'console',
                  severity: 'warn',
                })
                requestRadioBurst(commandIdentity, 'enter')
                return
              }
              const nextSpace =
                stagedResult.actionId === 'content.transform.space.world' ? 'world' : 'local'
              const alreadyApplied = activeSession?.space === nextSpace
              if (!alreadyApplied) {
                appState.setActiveContentObjectTransformSpace(nextSpace)
              }
              const nextTransformRootSession = createActiveContentObjectTransformRootSession(objectId)
              setStagedNavigationSession(nextTransformRootSession)
              appendConsoleEntry({
                layer: 'Transforms',
                text: `Space: ${nextSpace === 'local' ? 'Local' : 'World'}${
                  alreadyApplied ? ' already applied' : ' applied'
                }`,
                source: 'console',
                severity: 'info',
              })
              appendConsoleEntry({
                layer: 'Commands',
                text: buildStagedPromptText(
                  nextTransformRootSession,
                  nextTransformRootSession.validChoices,
                ),
                source: 'console',
                severity: 'info',
              })
              requestRadioBurst(commandIdentity, 'enter')
              return
            } else if (stagedResult.actionId.startsWith('content.transform.snap.')) {
              const activeSession = appState.referenceWorkspace.activeContentObjectTransformSession
              const objectId = activeSession?.objectId ?? stagedResult.selections.contentObjectId ?? null
              if (objectId === null) {
                appendConsoleEntry({
                  layer: 'Transforms',
                  text: 'Viewer Transform snap requires an active content object transform session',
                  source: 'console',
                  severity: 'warn',
                })
                requestRadioBurst(commandIdentity, 'enter')
                return
              }
              const snapMode =
                stagedResult.actionId.includes('.translate.')
                  ? 'translate'
                  : stagedResult.actionId.includes('.rotate.')
                    ? 'rotate'
                    : 'scale'
              const isModeValueAction =
                stagedResult.actionId === `content.transform.snap.${snapMode}.value`
              const snapAxis = stagedResult.actionId.endsWith('.x.value')
                ? 'x'
                : stagedResult.actionId.endsWith('.y.value')
                  ? 'y'
                  : stagedResult.actionId.endsWith('.z.value')
                    ? 'z'
                    : null
              const isAxisValueAction = snapAxis !== null
              const isOnAction = stagedResult.actionId.endsWith('.on')
              const isLockAction = stagedResult.actionId.endsWith('.lock')
              const isUnlockAction = stagedResult.actionId.endsWith('.unlock')
              const numericValue = parseConsoleSignedFloatLiteral(rawToken)
              const nextSession =
                activeSession?.entryActive === true
                  ? createActiveContentObjectTransformSnapSession(objectId, snapMode)
                  : createActiveContentObjectTransformRootSession(objectId)
              if (isModeValueAction && numericValue !== null) {
                appState.setContentObjectTransformSnapValue(objectId, snapMode, numericValue)
              } else if (isAxisValueAction && numericValue !== null) {
                appState.setContentObjectTransformSnapAxisValue(objectId, snapMode, snapAxis, numericValue)
              } else if (isLockAction || isUnlockAction) {
                appState.setContentObjectTransformSnapLocked(objectId, snapMode, isLockAction)
              } else {
                appState.setContentObjectTransformSnapEnabled(objectId, snapMode, isOnAction)
              }
              if (nextSession !== null) {
                setStagedNavigationSession(nextSession)
              }
              const nextSnapState =
                useAppStore.getState().referenceWorkspace.transformSnapByObjectId[objectId] ??
                DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE
              const modeLabel = getReferenceTransformSnapModeLabel(snapMode)
              appendConsoleEntry({
                layer: 'Transforms',
                text: isModeValueAction
                  ? `${modeLabel} snap value: ${formatReferenceTransformSnapValue(
                      getReferenceTransformSnapDriverValue(nextSnapState[snapMode]),
                    )}`
                  : isAxisValueAction
                    ? `${modeLabel} ${getReferenceTransformSnapAxisLabel(snapAxis)} snap value: ${formatReferenceTransformSnapValue(
                        getReferenceTransformSnapAxisValue(nextSnapState[snapMode], snapAxis),
                      )}`
                    : isLockAction || isUnlockAction
                      ? `${modeLabel} snap XYZ: ${isLockAction ? 'Locked' : 'Unlocked'}`
                      : `${modeLabel} snap: ${isOnAction ? 'On' : 'Off'}`,
                source: 'console',
                severity: 'info',
              })
              if (nextSession !== null) {
                appendConsoleEntry({
                  layer: 'Commands',
                  text: buildStagedPromptText(nextSession, nextSession.validChoices),
                  source: 'console',
                  severity: 'info',
                })
              }
              requestRadioBurst(commandIdentity, 'enter')
              return
            } else if (stagedResult.actionId === 'content.transform.deleteLatest') {
              const latestAppState = useAppStore.getState()
              const activeSession =
                latestAppState.referenceWorkspace.activeContentObjectTransformSession
              const objectId = activeSession?.objectId ?? stagedResult.selections.contentObjectId ?? null
              if (objectId === null) {
                appendConsoleEntry({
                  layer: 'Transforms',
                  text: 'Delete latest requires an active content object transform session',
                  source: 'console',
                  severity: 'warn',
                })
                requestRadioBurst(commandIdentity, 'enter')
                return
              }
              const currentEntries =
                latestAppState.referenceWorkspace.transformHistoryByObjectId[objectId] ?? []
              const latestEntry = currentEntries.at(-1) ?? null
              const shouldConfirmDeleteLatest =
                latestEntry !== null &&
                activeSession?.objectId === objectId &&
                latestEntry.sessionId !== activeSession.sessionId
              if (shouldConfirmDeleteLatest) {
                const promptSession = createDeleteLatestTransformConfirmPromptSession(
                  { kind: 'content-object', objectId },
                  stagedResult.session,
                )
                setConsolePromptSession(promptSession)
                appendConsoleEntry({
                  layer: 'Transforms',
                  text: 'Delete latest will remove an entry from the previous transform. Are you sure?',
                  source: 'console',
                  severity: 'warn',
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
              const deletedEntry = deleteLatestContentObjectTransformEntry(objectId)
              const nextTransformRootSession = createActiveContentObjectTransformRootSession(objectId)
              setStagedNavigationSession(nextTransformRootSession)
              appendConsoleEntry({
                layer: 'Transforms',
                text:
                  deletedEntry === null
                    ? 'Delete latest skipped: no committed transform entry'
                    : 'Deleted latest transform entry',
                source: 'console',
                severity: deletedEntry === null ? 'warn' : 'info',
              })
              appendConsoleEntry({
                layer: 'Commands',
                text: buildStagedPromptText(
                  nextTransformRootSession,
                  nextTransformRootSession.validChoices,
                ),
                source: 'console',
                severity: 'info',
              })
              requestRadioBurst(commandIdentity, 'enter')
              return
            } else if (stagedResult.actionId === 'content.selectAll') {
              const selectedTarget = appState.workspaceSelection.selectedTarget
              const selectedOwnerTarget = resolveWorkspaceSelectedContentOwnerTarget(
                appState,
                selectedTarget,
              )
              if (
                selectedTarget === null ||
                selectedOwnerTarget === null ||
                !selectedOwnerTarget.supportsSelectAll
              ) {
                appendConsoleEntry({
                  layer: 'Browser',
                  text: 'SelectAll requires a selected content parent',
                  source: 'console',
                  severity: 'warn',
                })
              } else {
                appState.setWorkspaceExplicitSelection({
                  selectedTarget,
                  explicitSelectedTargets: [selectedTarget],
                  selectionAnchorTarget: selectedTarget,
                })
                appState.requestConsoleContextSync('target-selection')
                appendConsoleEntry({
                  layer: 'Browser',
                  text: `SelectAll: ${stagedResult.session.breadcrumb.at(-1) ?? 'Content'}`,
                  source: 'console',
                  severity: 'info',
                })
              }
            } else {
              const selectedTarget = appState.workspaceSelection.selectedTarget
              const selectedOwnerTarget = resolveWorkspaceSelectedContentOwnerTarget(
                appState,
                selectedTarget,
              )
              if (
                selectedTarget?.kind !== 'object' ||
                selectedOwnerTarget?.ownerKind !== 'object-part'
              ) {
                appendConsoleEntry({
                  layer: 'Transforms',
                  text: 'Object transform requires a selected object',
                  source: 'console',
                  severity: 'warn',
                })
              } else {
                const objectRecord = appState.projectContent.objectsById[selectedTarget.objectId] ?? null
                if (!selectedOwnerTarget.supportsViewerTransform || objectRecord === null) {
                  appendConsoleEntry({
                    layer: 'Transforms',
                    text: 'Viewer Transform is only available for published objects in this phase',
                    source: 'console',
                    severity: 'warn',
                  })
                } else {
                  const objectPartKey =
                    appState.selectedPartKey ??
                    (objectRecord !== null ? (buildObjectPartKeys(objectRecord)[0] ?? null) : null) ??
                    resolveSingleTargetContentSelection(appState, selectedTarget)?.partKeys[0] ??
                    null
                  const transformMode =
                    stagedResult.actionId === 'content.transform.rotate'
                      ? 'rotate'
                      : stagedResult.actionId === 'content.transform.scale'
                        ? 'scale'
                        : 'translate'
                  if (objectPartKey === null) {
                    appendConsoleEntry({
                      layer: 'Transforms',
                      text: 'Viewer Transform requires a resolved published object with visible viewer parts',
                      source: 'console',
                      severity: 'warn',
                    })
                  } else {
                    appState.beginContentObjectTransformShell(selectedTarget.objectId)
                    appState.beginContentObjectTransformEntry(transformMode)
                    appState.selectPart(objectPartKey)
                    const nextSession =
                      useAppStore.getState().referenceWorkspace.activeContentObjectTransformSession
                    const viewer = getViewer()
                    viewer?.setSelectedPart?.(objectPartKey)
                    viewer?.setContentObjectTransformSession?.({
                      objectId: selectedTarget.objectId,
                      mode: transformMode,
                      space: nextSession?.space ?? 'local',
                      entryOrigin: nextSession?.entryOrigin ?? null,
                    })
                    if (transformMode === 'rotate') {
                      viewer?.activateRotateCenterHandle?.()
                    } else if (transformMode === 'scale') {
                      viewer?.activateScaleCenterHandle?.()
                    } else {
                      viewer?.activateTranslateCenterHandle?.()
                    }
                    appendConsoleEntry({
                      layer: 'Transforms',
                      text: `${
                        transformMode === 'rotate'
                          ? 'Rotate'
                          : transformMode === 'scale'
                            ? 'Scale'
                            : 'Move'
                      } armed`,
                      source: 'console',
                      severity: 'info',
                    })
                  }
                }
              }
            }
            appendConsoleEntry({
              layer: 'Commands',
              text: buildStagedPromptText(
                useConsoleStore.getState().stagedNavigationSession ?? stagedResult.session,
                (useConsoleStore.getState().stagedNavigationSession ?? stagedResult.session).validChoices,
              ),
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
              enterGuidedRootSession()
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
          if (
            (stagedResult.actionId === 'sketch.draw' ||
              stagedResult.actionId === 'sketch.plane') &&
            stagedResult.selections.graphDocumentId !== null &&
            stagedResult.selections.sketchNodeId !== null
          ) {
            clearStagedNavigationSession()
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
                referenceWorkspace: useAppStore.getState().referenceWorkspace,
                stagedNavigationSession: useConsoleStore.getState().stagedNavigationSession,
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
            const sketchDrawSession = createSketchDrawRootSession(
              buildStagedNavigationContextFromStoreState(useSpaghettiStore.getState()),
            )
            setStagedNavigationSession(sketchDrawSession)
            appendConsoleEntry({
              layer: 'Commands',
              text: formatStagedBreadcrumb(sketchDrawSession.breadcrumb),
              source: 'console',
              severity: 'info',
            })
            appendConsoleEntry({
              layer: 'Commands',
              text: buildStagedPromptText(sketchDrawSession, sketchDrawSession.validChoices),
              source: 'console',
              severity: 'info',
            })
            requestRadioBurst(commandIdentity, 'enter')
            return
          }
          enterGuidedRootSession()
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
          if (
            isSketchDrawLocalStagedScope(activeStagedSession) &&
            spaghettiState.geometrySketchSession?.mode === 'draw'
          ) {
            // Let sketch-draw runtime commands like Enter/Status/Help continue through the
            // draw-session handler instead of treating them as staged-navigation errors.
          } else {
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
        if (
          sketchPlanePickSession.adjustScope === 'move-axis' &&
          (sketchPlanePickSession.activeTransformAxis === 'x' ||
            sketchPlanePickSession.activeTransformAxis === 'y' ||
            sketchPlanePickSession.activeTransformAxis === 'z')
        ) {
          const axis = sketchPlanePickSession.activeTransformAxis
          const pendingConfirmation = sketchPlanePickSession.pendingMoveAxisOffSnapConfirmation
          if (pendingConfirmation !== null) {
            if (trimmedInput === 'confirm') {
              const commandIdentity = resolveFeatureAssistSubmitIdentity(trimmedInput)
              appendConsoleEntry({
                layer: 'Commands',
                commandLineKind: 'user',
                text: `> ${trimmedInput}`,
              })
              pushCommandHistory(trimmedInput)
              requestRadioBurst(commandIdentity, 'enter')
              const store = useSpaghettiStore.getState()
              store.setSketchPlanePickTranslationAxis(axis, pendingConfirmation.value)
              store.acceptActiveSketchPlaneTransformCommand()
              return
            }
            if (trimmedInput === 'deny') {
              const commandIdentity = resolveFeatureAssistSubmitIdentity(trimmedInput)
              appendConsoleEntry({
                layer: 'Commands',
                commandLineKind: 'user',
                text: `> ${trimmedInput}`,
              })
              pushCommandHistory(trimmedInput)
              requestRadioBurst(commandIdentity, 'enter')
              useSpaghettiStore.getState().clearSketchPlaneMoveAxisOffSnapConfirmation()
              return
            }
          }
          const axisValue = parseConsoleSignedFloatLiteral(trimmedInput)
          if (axisValue !== null) {
            const commandIdentity = resolveFeatureAssistSubmitIdentity(trimmedInput)
            appendConsoleEntry({
              layer: 'Commands',
              commandLineKind: 'user',
              text: `> ${trimmedInput}`,
            })
            pushCommandHistory(trimmedInput)
            requestRadioBurst(commandIdentity, 'enter')
            const prefsState = useUiPrefsStore.getState()
            const snapEnabled = prefsState.sketchPlaneToolbarTranslateSnapEnabled
            const snapValue = prefsState.sketchPlaneToolbarTranslateSnapValue
            const store = useSpaghettiStore.getState()
            if (snapEnabled && snapValue > 0 && !isValueAlignedToStep(axisValue, snapValue)) {
              store.setSketchPlaneMoveAxisOffSnapConfirmation(axis, axisValue, trimmedInput)
              return
            }
            store.clearSketchPlaneMoveAxisOffSnapConfirmation()
            store.setSketchPlanePickTranslationAxis(axis, axisValue)
            store.acceptActiveSketchPlaneTransformCommand()
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
          (sketchPlanePickSession.adjustScope !== 'move' && trimmedInput === 'm') ||
          (sketchPlanePickSession.adjustScope === 'move' && trimmedInput === 'move again') ||
          (sketchPlanePickSession.adjustScope === 'move' && trimmedInput === 'm') ||
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
          } else if (trimmedInput === 'move again' || trimmedInput === 'm') {
            command = sketchPlanePickSession.adjustScope === 'move' ? 'move-again' : 'move'
          } else if (trimmedInput === 'move') {
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
        const submitDrawCommand = (
          rawCommand: string,
          command:
            | 'line'
            | 'l'
            | 'pline'
            | 'pl'
            | 'rectangle'
            | 'rec'
            | 'circle'
            | 'cc'
            | 'previous'
            | 'p'
          | 'undo'
          | 'enter'
          | 'delete'
          | 'del'
          | 'esc'
          | 'back'
          | 'b'
            | 'x',
        ) => {
          if (rawCommand !== 'esc') {
            appendConsoleEntry({
              layer: 'Commands',
              commandLineKind: 'user',
              text: `> ${rawCommand}`,
            })
          }
          pushCommandHistory(rawCommand)
          spaghettiState.runGeometrySketchDrawCommand(command)
          useConsoleStore.getState().setInputText('')
          if (
            command === 'esc' ||
            command === 'back' ||
            command === 'b' ||
            command === 'x'
          ) {
            const nextDescriptor = getActiveFeatureAssistDescriptor({
              sketchPlanePickSession: useSpaghettiStore.getState().sketchPlanePickSession,
              geometrySketchSession: useSpaghettiStore.getState().geometrySketchSession,
              referenceWorkspace: useAppStore.getState().referenceWorkspace,
              stagedNavigationSession: useConsoleStore.getState().stagedNavigationSession,
            })
            if (nextDescriptor !== null) {
              appendConsoleEntry({
                layer: 'Commands',
                text: buildFeatureAssistPromptText(nextDescriptor),
                source: 'console',
                severity: 'info',
              })
            }
          }
        }

        if (trimmedInput.length === 0) {
          appendConsoleEntry({
            layer: 'Commands',
            commandLineKind: 'user',
            text: '> enter',
          })
          pushCommandHistory('enter')
          spaghettiState.runGeometrySketchDrawCommand('enter')
          return
        }
        if (
          trimmedInput === 'delete' ||
          trimmedInput === 'del'
        ) {
          submitDrawCommand(trimmedInput, trimmedInput)
          return
        }
        if (trimmedInput === 'radio' || trimmedInput === 'r') {
          const rawToken = inputText.trim()
          const stagedResult = submitConsoleStagedNavigationToken(
            isSketchDrawLocalStagedScope(activeStagedSession) ? activeStagedSession : null,
            rawToken,
            stagedContext,
          )
          if (stagedResult.kind === 'advance' && stagedResult.session.scopeId === 'radioRoot') {
            const commandIdentity = resolveConsoleRadioCommandIdentity({
              kind: 'stagedAdvance',
              activeScopeId: null,
              matchedCanonicalToken: stagedResult.matchedChoice.canonicalToken,
              matchedLabel: stagedResult.matchedChoice.label,
            })
            appendConsoleEntry({
              layer: 'Commands',
              commandLineKind: 'user',
              text: `> ${rawToken}`,
            })
            pushCommandHistory(rawToken)
            trackRadioCommandIdentity(commandIdentity)
            requestRadioBurst(commandIdentity, 'enter')
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
            return
          }
        }
        if (geometrySketchSession.activeTool === null) {
          const sketchDrawSession: ConsoleStagedNavigationSession =
            activeStagedSession !== null && isSketchDrawLocalStagedScope(activeStagedSession)
              ? activeStagedSession
              : createSketchDrawRootSession(stagedContext)
          const stagedResult = submitConsoleStagedNavigationToken(
            sketchDrawSession,
            trimmedInput,
            stagedContext,
          )
          if (stagedResult.kind === 'advance') {
            const commandIdentity = resolveConsoleRadioCommandIdentity({
              kind: 'stagedAdvance',
              activeScopeId: sketchDrawSession.scopeId,
              matchedCanonicalToken: stagedResult.matchedChoice.canonicalToken,
              matchedLabel: stagedResult.matchedChoice.label,
            })
            appendConsoleEntry({
              layer: 'Commands',
              commandLineKind: 'user',
              text: `> ${trimmedInput}`,
            })
            pushCommandHistory(trimmedInput)
            trackRadioCommandIdentity(commandIdentity)
            requestRadioBurst(commandIdentity, 'enter')
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
            return
          }
          if (stagedResult.kind === 'execute') {
            const commandIdentity = resolveConsoleRadioCommandIdentity({
              kind: 'stagedExecute',
              activeScopeId: sketchDrawSession.scopeId,
              actionId: stagedResult.actionId,
            })
            appendConsoleEntry({
              layer: 'Commands',
              commandLineKind: 'user',
              text: `> ${trimmedInput}`,
            })
            pushCommandHistory(trimmedInput)
            trackRadioCommandIdentity(commandIdentity)
            if (
              stagedResult.actionId === 'sketchdraw.tool.line' ||
              stagedResult.actionId === 'sketchdraw.tool.pline' ||
              stagedResult.actionId === 'sketchdraw.tool.rectangle' ||
              stagedResult.actionId === 'sketchdraw.tool.circle' ||
              stagedResult.actionId === 'sketchdraw.previous' ||
              stagedResult.actionId === 'sketchdraw.delete' ||
              stagedResult.actionId === 'sketchdraw.back' ||
              stagedResult.actionId === 'sketchdraw.exit'
            ) {
              appendConsoleEntry({
                layer: 'Commands',
                text: formatStagedBreadcrumb(stagedResult.breadcrumb),
                source: 'console',
                severity: 'info',
              })
              setStagedNavigationSession(null)
              spaghettiState.runGeometrySketchDrawCommand(
                stagedResult.actionId === 'sketchdraw.tool.line'
                  ? 'line'
                  : stagedResult.actionId === 'sketchdraw.tool.pline'
                    ? 'pline'
                    : stagedResult.actionId === 'sketchdraw.tool.rectangle'
                      ? 'rectangle'
                      : stagedResult.actionId === 'sketchdraw.tool.circle'
                        ? 'circle'
                        : stagedResult.actionId === 'sketchdraw.previous'
                          ? 'previous'
                          : stagedResult.actionId === 'sketchdraw.delete'
                            ? 'delete'
                            : stagedResult.actionId === 'sketchdraw.back'
                              ? 'back'
                              : 'x',
              )
              requestRadioBurst(commandIdentity, 'enter')
              return
            }
            if (
              stagedResult.actionId === 'sketchdraw.camera.projection.orthographic' ||
              stagedResult.actionId === 'sketchdraw.camera.projection.perspective'
            ) {
              const projectionMode =
                stagedResult.actionId === 'sketchdraw.camera.projection.orthographic'
                  ? 'orthographic'
                  : 'perspective'
              setProjectionModeCommand(projectionMode)
              setStagedNavigationSession(createSketchDrawRootSession(stagedContext))
              appendConsoleEntry({
                layer: 'Commands',
                text: formatStagedBreadcrumb(stagedResult.breadcrumb),
                source: 'console',
                severity: 'info',
              })
              appendConsoleEntry({
                layer: 'View',
                text: `Projection: ${
                  projectionMode === 'orthographic' ? 'Orthographic' : 'Perspective'
                }`,
                source: 'console',
                severity: 'info',
              })
              appendConsoleEntry({
                layer: 'Commands',
                text: buildStagedPromptText(
                  createSketchDrawRootSession(stagedContext),
                  createSketchDrawRootSession(stagedContext).validChoices,
                ),
                source: 'console',
                severity: 'info',
              })
              requestRadioBurst(commandIdentity, 'enter')
              return
            }
          }
        }
        const assistBreadcrumb = featureAssistDescriptor?.breadcrumb ?? null
        const isSketchDrawRootAssist =
          assistBreadcrumb !== null &&
          assistBreadcrumb.length === 3 &&
          assistBreadcrumb[0] === 'Graph' &&
          assistBreadcrumb[1] === 'Sketch' &&
          assistBreadcrumb[2] === 'Sketch Draw'
        const isSketchDrawCameraAssist =
          assistBreadcrumb !== null &&
          assistBreadcrumb.length === 4 &&
          assistBreadcrumb[0] === 'Graph' &&
          assistBreadcrumb[1] === 'Sketch' &&
          assistBreadcrumb[2] === 'Sketch Draw' &&
          assistBreadcrumb[3] === 'Camera'
        const isSketchDrawCameraProjectionAssist =
          assistBreadcrumb !== null &&
          assistBreadcrumb.length === 5 &&
          assistBreadcrumb[0] === 'Graph' &&
          assistBreadcrumb[1] === 'Sketch' &&
          assistBreadcrumb[2] === 'Sketch Draw' &&
          assistBreadcrumb[3] === 'Camera' &&
          assistBreadcrumb[4] === 'Projection'
        if (isSketchDrawRootAssist && (trimmedInput === 'camera' || trimmedInput === 'c')) {
          const commandIdentity = resolveFeatureAssistSubmitIdentity(trimmedInput)
          appendConsoleEntry({
            layer: 'Commands',
            commandLineKind: 'user',
            text: `> ${trimmedInput}`,
          })
          pushCommandHistory(trimmedInput)
          requestRadioBurst(commandIdentity, 'enter')
          const nextDescriptor = buildSketchDrawCameraAssistDescriptor()
          useConsoleStore.getState().setFeatureAssistDescriptor(nextDescriptor)
          appendConsoleEntry({
            layer: 'Commands',
            text: buildFeatureAssistPromptText(nextDescriptor),
            source: 'console',
            severity: 'info',
          })
          return
        }
        if (isSketchDrawCameraAssist) {
          if (trimmedInput === 'projection') {
            const commandIdentity = resolveFeatureAssistSubmitIdentity(trimmedInput)
            appendConsoleEntry({
              layer: 'Commands',
              commandLineKind: 'user',
              text: `> ${trimmedInput}`,
            })
            pushCommandHistory(trimmedInput)
            requestRadioBurst(commandIdentity, 'enter')
            const nextDescriptor = buildSketchDrawCameraProjectionAssistDescriptor()
            useConsoleStore.getState().setFeatureAssistDescriptor(nextDescriptor)
            appendConsoleEntry({
              layer: 'Commands',
              text: buildFeatureAssistPromptText(nextDescriptor),
              source: 'console',
              severity: 'info',
            })
            return
          }
          if (trimmedInput === 'back' || trimmedInput === 'b') {
            const commandIdentity = resolveFeatureAssistSubmitIdentity(trimmedInput)
            appendConsoleEntry({
              layer: 'Commands',
              commandLineKind: 'user',
              text: `> ${trimmedInput}`,
            })
            pushCommandHistory(trimmedInput)
            requestRadioBurst(commandIdentity, 'enter')
            const nextDescriptor = buildSketchDrawFeatureAssistDescriptor(geometrySketchSession)
            useConsoleStore.getState().setFeatureAssistDescriptor(nextDescriptor)
            appendConsoleEntry({
              layer: 'Commands',
              text: buildFeatureAssistPromptText(nextDescriptor),
              source: 'console',
              severity: 'info',
            })
            return
          }
        }
        if (isSketchDrawCameraProjectionAssist) {
          if (
            trimmedInput === 'orthographic' ||
            trimmedInput === 'o' ||
            trimmedInput === 'perspective' ||
            trimmedInput === 'p'
          ) {
            const commandIdentity = resolveFeatureAssistSubmitIdentity(trimmedInput)
            appendConsoleEntry({
              layer: 'Commands',
              commandLineKind: 'user',
              text: `> ${trimmedInput}`,
            })
            pushCommandHistory(trimmedInput)
            requestRadioBurst(commandIdentity, 'enter')
            const projectionMode =
              trimmedInput === 'orthographic' || trimmedInput === 'o'
                ? 'orthographic'
                : 'perspective'
            setProjectionModeCommand(projectionMode)
            appendConsoleEntry({
              layer: 'View',
              text: `Projection: ${
                projectionMode === 'orthographic' ? 'Orthographic' : 'Perspective'
              }`,
              source: 'console',
              severity: 'info',
            })
            const nextDescriptor = buildSketchDrawFeatureAssistDescriptor(geometrySketchSession)
            useConsoleStore.getState().setFeatureAssistDescriptor(nextDescriptor)
            appendConsoleEntry({
              layer: 'Commands',
              text: buildFeatureAssistPromptText(nextDescriptor),
              source: 'console',
              severity: 'info',
            })
            return
          }
          if (trimmedInput === 'back' || trimmedInput === 'b') {
            const commandIdentity = resolveFeatureAssistSubmitIdentity(trimmedInput)
            appendConsoleEntry({
              layer: 'Commands',
              commandLineKind: 'user',
              text: `> ${trimmedInput}`,
            })
            pushCommandHistory(trimmedInput)
            requestRadioBurst(commandIdentity, 'enter')
            const nextDescriptor = buildSketchDrawCameraAssistDescriptor()
            useConsoleStore.getState().setFeatureAssistDescriptor(nextDescriptor)
            appendConsoleEntry({
              layer: 'Commands',
              text: buildFeatureAssistPromptText(nextDescriptor),
              source: 'console',
              severity: 'info',
            })
            return
          }
        }
        if (trimmedInput === 'zoom' || trimmedInput === 'z') {
          appendConsoleEntry({
            layer: 'Commands',
            commandLineKind: 'user',
            text: `> ${trimmedInput}`,
          })
          pushCommandHistory(trimmedInput)
          const zoomSession = createSketchDrawZoomRootSession()
          setStagedNavigationSession(zoomSession)
          useConsoleStore.getState().setInputText('')
          appendConsoleEntry({
            layer: 'Commands',
            text: formatStagedBreadcrumb(zoomSession.breadcrumb),
            source: 'console',
            severity: 'info',
          })
          appendConsoleEntry({
            layer: 'Commands',
            text: buildStagedPromptText(zoomSession, zoomSession.validChoices),
            source: 'console',
            severity: 'info',
          })
          return
        }
        if (
          geometrySketchSession.activeTool !== null &&
          (geometrySketchSession.activeTool === 'line' ||
            geometrySketchSession.activeTool === 'pline' ||
            geometrySketchSession.activeTool === 'rectangle')
        ) {
          const parsedVec2 = parseConsoleVec2Literal(trimmedInput)
          if (parsedVec2 !== null) {
            appendConsoleEntry({
              layer: 'Commands',
              commandLineKind: 'user',
              text: `> ${trimmedInput}`,
            })
            pushCommandHistory(trimmedInput)
            spaghettiState.confirmGeometrySketchDrawPoint(parsedVec2, null)
            useConsoleStore.getState().setInputText('')
            return
          }
        }
        if (geometrySketchSession.activeTool === 'circle') {
          if ((geometrySketchSession.drawDraft?.points.length ?? 0) === 0) {
            const parsedVec2 = parseConsoleVec2Literal(trimmedInput)
            if (parsedVec2 !== null) {
              appendConsoleEntry({
                layer: 'Commands',
                commandLineKind: 'user',
                text: `> ${trimmedInput}`,
              })
              pushCommandHistory(trimmedInput)
              spaghettiState.confirmGeometrySketchDrawPoint(parsedVec2, null)
              useConsoleStore.getState().setInputText('')
              return
            }
          } else {
            const parsedRadius = parseConsoleSignedFloatLiteral(trimmedInput)
            if (parsedRadius !== null) {
              appendConsoleEntry({
                layer: 'Commands',
                commandLineKind: 'user',
                text: `> ${trimmedInput}`,
              })
              pushCommandHistory(trimmedInput)
              spaghettiState.confirmGeometrySketchDrawRadius(parsedRadius)
              useConsoleStore.getState().setInputText('')
              return
            }
          }
        }
        if (trimmedInput === 'line' || trimmedInput === 'l') {
          submitDrawCommand(trimmedInput, trimmedInput as 'line' | 'l')
          return
        }
        if (trimmedInput === 'pline' || trimmedInput === 'pl') {
          submitDrawCommand(trimmedInput, trimmedInput as 'pline' | 'pl')
          return
        }
        if (trimmedInput === 'rectangle' || trimmedInput === 'rec') {
          submitDrawCommand(trimmedInput, trimmedInput as 'rectangle' | 'rec')
          return
        }
        if (trimmedInput === 'circle' || trimmedInput === 'cc') {
          submitDrawCommand(trimmedInput, trimmedInput as 'circle' | 'cc')
          return
        }
        if (trimmedInput === 'previous' || trimmedInput === 'p') {
          submitDrawCommand(trimmedInput, trimmedInput as 'previous' | 'p')
          return
        }
        if (trimmedInput === 'undo') {
          submitDrawCommand('undo', 'undo')
          return
        }
        if (trimmedInput === 'enter') {
          submitDrawCommand('enter', 'enter')
          return
        }
        if (trimmedInput === 'esc' || trimmedInput === 'back' || trimmedInput === 'b') {
          submitDrawCommand(trimmedInput, trimmedInput as 'esc' | 'back' | 'b')
          return
        }
        if (trimmedInput === 'x') {
          submitDrawCommand('x', 'x')
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
              `target=${
                geometrySketchSession.activeTool === 'circle'
                  ? geometrySketchSession.drawDraft?.points.length === 0
                    ? 'Center'
                    : 'Radius'
                  : geometrySketchSession.activeTool === 'line' ||
                      geometrySketchSession.activeTool === 'rectangle'
                    ? `P${geometrySketchSession.drawDraft?.points.length === 0 ? 1 : 2}`
                    : `P${(geometrySketchSession.drawDraft?.points.length ?? 0) + 1}`
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
            text:
              'Draw Sketch commands: line (l), pline (pl), rectangle (rec), circle (cc), previous (p), undo, enter, esc, back (b), x, status, help',
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

      const appState = useAppStore.getState()
      const activeTransformReferenceId =
        appState.referenceWorkspace.activeReferenceTransformSession?.referenceId ?? null
      const transformSnapState =
        activeTransformReferenceId === null
          ? DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE
          : appState.referenceWorkspace.transformSnapByReferenceId[activeTransformReferenceId] ??
            DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE

      switch (parsed.name) {
        case 'help':
          requestRadioBurst(flatCommandIdentity, 'enter')
          appendConsoleEntry({
            layer: 'Commands',
            text: 'Commands: help, console, clear, history, frame, zoom, pan, orbit, move, rotate, scale, snap, echo, status',
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
          frameAllCommand()
          requestRadioBurst(flatCommandIdentity, 'enter')
          appendConsoleEntry({
            layer: 'View',
            text: 'Frame all',
            source: 'console',
            severity: 'info',
          })
          return
        case 'zoom':
          {
            const zoomAction = parseZoomCommandAction(parsed.args)
            if (zoomAction === null) {
              const stagedResult = submitConsoleStagedNavigationToken(
                null,
                'zoom',
                buildStagedNavigationContextFromStoreState(useSpaghettiStore.getState()),
              )
              if (stagedResult.kind === 'advance') {
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
                requestRadioBurst(flatCommandIdentity, 'enter')
                return
              }
            }
            const selectedReferenceId = resolveSelectedReferenceIdForZoom()
            const selectedObjectPartKey = resolveSelectedObjectPartKeyForZoom()
            if (zoomAction === 'all') {
              frameAllCommand()
            } else if (zoomAction === 'extents') {
              frameExtentsCommand()
            } else if (zoomAction === 'previous') {
              framePreviousCommand()
            } else if (zoomAction === 'window') {
              setConsoleCameraModeCommand('zoom-window')
              appendConsoleEntry({
                layer: 'View',
                text: 'Zoom Window armed: drag a box in the viewport with LMB',
                source: 'console',
                severity: 'info',
              })
            } else if (
              useSpaghettiStore.getState().geometrySketchSession?.mode === 'draw' &&
              (useSpaghettiStore.getState().geometrySketchSession?.selectedComponentIds.length ?? 0) > 0
            ) {
              const didFrameSelectedSketch = frameSelectedGeometrySketchCommand()
              if (!didFrameSelectedSketch) {
                requestRadioBurst(flatCommandIdentity, 'enter')
                return
              }
            } else if (selectedObjectPartKey !== null) {
              frameSelectedCommand(selectedObjectPartKey)
            } else if (selectedReferenceId !== null) {
              frameReferenceCommand(selectedReferenceId)
            } else {
              appendConsoleEntry({
                layer: 'Diagnostics',
                text: 'Zoom Object requires a selected part, object, or reference',
                source: 'console',
                severity: 'warn',
              })
                requestRadioBurst(flatCommandIdentity, 'enter')
                return
              }
            if (useSpaghettiStore.getState().geometrySketchSession?.mode === 'draw') {
              const sketchDrawSession = createSketchDrawRootSession(
                buildStagedNavigationContextFromStoreState(useSpaghettiStore.getState()),
              )
              setStagedNavigationSession(sketchDrawSession)
              appendConsoleEntry({
                layer: 'Commands',
                text: formatStagedBreadcrumb(sketchDrawSession.breadcrumb),
                source: 'console',
                severity: 'info',
              })
              appendConsoleEntry({
                layer: 'Commands',
                text: buildStagedPromptText(sketchDrawSession, sketchDrawSession.validChoices),
                source: 'console',
                severity: 'info',
              })
            } else {
              enterGuidedRootSession({ appendPrompt: true })
            }
            requestRadioBurst(flatCommandIdentity, 'enter')
          }
          return
        case 'pan':
          setConsoleCameraModeCommand('pan')
          requestRadioBurst(flatCommandIdentity, 'enter')
          appendConsoleEntry({
            layer: 'View',
            text: 'Pan armed: drag in the viewport with LMB',
            source: 'console',
            severity: 'info',
          })
          return
        case 'orbit':
          setConsoleCameraModeCommand('orbit')
          requestRadioBurst(flatCommandIdentity, 'enter')
          appendConsoleEntry({
            layer: 'View',
            text: 'Orbit armed: drag in the viewport with LMB',
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
          if (activeTransformReferenceId === null) {
            requestRadioBurst(flatCommandIdentity, 'enter')
            appendConsoleEntry({
              layer: 'Diagnostics',
              text: 'Snap requires an active reference transform session',
              source: 'console',
              severity: 'warn',
            })
            return
          }
          {
            const activeMode =
              appState.referenceWorkspace.activeReferenceTransformSession?.mode ?? 'translate'
            const nextEnabled = !transformSnapState[activeMode].enabled
            appState.setReferenceTransformSnapEnabled(
              activeTransformReferenceId,
              activeMode,
              nextEnabled,
            )
            const modeLabel = getReferenceTransformSnapModeLabel(activeMode)
            requestRadioBurst(flatCommandIdentity, 'enter')
            appendConsoleEntry({
              layer: 'Transforms',
              text: `${modeLabel} snap ${nextEnabled ? 'enabled' : 'disabled'}`,
              source: 'console',
              severity: 'info',
            })
            return
          }
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
                ? 'Viewer Transform: none'
                : `Viewer Transform: ${
                    appState.referenceWorkspace.activeReferenceTransformSession?.mode ?? 'translate'
                  } ${activeReferenceId}`,
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
      cancelActiveReferenceTransformSession,
      clearStagedNavigationSession,
      commitActiveReferenceTransformFromConsole,
      createActiveContentObjectTransformRootSession,
      createActiveReferenceTransformRootSession,
      createDeleteLatestTransformConfirmPromptSession,
      createMissingGraphNodeInGraphDocument,
      deleteLatestContentObjectTransformEntry,
      deleteLatestReferenceTransformEntry,
      dispatchImmediateShortcut,
      enterGuidedRootSession,
      featureAssistDescriptor,
      openReferenceTransformAxisPrompt,
      openReferenceTransformPlanePrompt,
      pushCommandHistory,
      requestRadioBurst,
      resolveConsoleActionContext,
      resolveSelectedObjectPartKeyForZoom,
      resolveSelectedReferenceIdForZoom,
      resolveSelectionSetForZoom,
      setConsolePromptSession,
      setStagedNavigationSession,
      trackRadioCommandIdentity,
      transitionReferenceTransformAxisPrompt,
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
    if (referenceTransformShellExitRequest === null) {
      return
    }
    if (
      referenceTransformShellExitRequest.seq ===
      lastHandledReferenceTransformShellExitSeqRef.current
    ) {
      return
    }
    lastHandledReferenceTransformShellExitSeqRef.current =
      referenceTransformShellExitRequest.seq

    const didExit = exitActiveReferenceTransformShell()
    if (!didExit) {
      return
    }

    if (referenceTransformShellExitRequest.source === 'commit-shell') {
      appendConsoleEntry({
        layer: 'Transforms',
        text: 'Viewer Transform committed',
        source: 'console',
        severity: 'info',
      })
    }
  }, [exitActiveReferenceTransformShell, referenceTransformShellExitRequest])

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
    const appState = useAppStore.getState()
    const workspaceContextTarget = selectConsoleWorkspaceContextTarget(appState)
    const resolvedTarget =
      isForcedRootSync
        ? null
        : workspaceContextTarget !== null
        ? workspaceContextTarget
        : workspaceActiveSurface === 'spaghetti'
        ? {
            graphDocumentId:
              spaghettiState.activeGraphDocumentId.length > 0
                ? spaghettiState.activeGraphDocumentId
                : null,
            nodeId: spaghettiState.selectedNodeId,
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
    const resolvedGraphDocumentId =
      resolvedHandoff.session?.selections.graphDocumentId ??
      (resolvedTarget !== null && 'graphDocumentId' in resolvedTarget
        ? resolvedTarget.graphDocumentId ?? null
        : resolvedTarget !== null && 'fallbackGraphDocumentId' in resolvedTarget
          ? resolvedTarget.fallbackGraphDocumentId ?? null
          : null)
    if (
      resolvedGraphDocumentId !== null &&
      spaghettiState.graphDocumentsById[resolvedGraphDocumentId] !== undefined &&
      spaghettiState.activeGraphDocumentId !== resolvedGraphDocumentId
    ) {
      activateGraphDocumentIntent(
        buildWorkspaceIntentDepsFromStoreState(),
        resolvedGraphDocumentId,
        {
          strategy: 'open-or-focus',
        },
      )
    }

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
      if (spaghettiState.geometrySketchSession?.mode === 'draw') {
        return
      }

      if (
        currentSession !== null &&
        (currentSession.scopeId === 'contentAssemblySelected' ||
          currentSession.scopeId === 'contentComponentSelected' ||
          currentSession.scopeId === 'contentObjectSelected' ||
          currentSession.scopeId === 'multiSelectSelected' ||
          currentSession.scopeId === 'referencesSelected' ||
          currentSession.scopeId === 'referenceCategorySelected' ||
          currentSession.scopeId === 'referenceSelected')
      ) {
        const fallbackGraphDocumentId = currentSession.selections.graphDocumentId ?? null
        if (fallbackGraphDocumentId !== null) {
          const fallbackGraphIndex = buildStagedNavigationContextFromStoreState(spaghettiState).graphOptions.findIndex(
            (graphOption) => graphOption.graphDocumentId === fallbackGraphDocumentId,
          )
          if (fallbackGraphIndex !== -1) {
            const fallbackHandoff = resolveConsoleWorkspaceContextSync(
              buildStagedNavigationContextFromStoreState(spaghettiState),
              {
                graphDocumentId: fallbackGraphDocumentId,
                nodeId: null,
              },
            )
            if (fallbackHandoff.session !== null) {
              setStagedNavigationSession(fallbackHandoff.session)
              appendConsoleEntry({
                layer: 'Commands',
                text: formatStagedBreadcrumb(fallbackHandoff.session.breadcrumb),
                source: 'console',
                severity: 'info',
              })
              appendConsoleEntry({
                layer: 'Commands',
                text: buildStagedPromptText(
                  fallbackHandoff.session,
                  fallbackHandoff.session.validChoices,
                ),
                source: 'console',
                severity: 'info',
              })
              return
            }
          }
        }
      }

      if (rootGuidedOptOutRef.current) {
        if (currentSession === null && isForcedRootAvailabilitySync) {
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

      if (currentSession?.scopeId === 'root') {
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
      enterGuidedRootSession()
      if (currentSession !== null) {
        appendConsoleEntry({
          layer: 'Commands',
          text: 'Returned to root',
          source: 'console',
          severity: 'info',
        })
      }
      appendConsoleEntry({
        layer: 'Commands',
        text: ROOT_PROMPT_TEXT,
        source: 'console',
        severity: 'info',
      })
      return
    }

    rootGuidedOptOutRef.current = false
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
    consoleContextSyncRequest,
    enterGuidedRootSession,
    setStagedNavigationSession,
    workspaceActiveSurface,
    workspaceSelectedTarget,
  ])

  useEffect(() => {
    const consoleState = useConsoleStore.getState()
    const spaghettiState = useSpaghettiStore.getState()
    if (
      rootGuidedOptOutRef.current ||
      consoleState.stagedNavigationSession !== null ||
      consoleState.consolePromptSession !== null ||
      consoleState.featureAssistDescriptor !== null ||
      consoleState.inputText.trim().length > 0 ||
      spaghettiState.sketchPlanePickSession !== null ||
      spaghettiState.geometrySketchSession?.mode === 'draw'
    ) {
      return
    }

    enterGuidedRootSession({ appendPrompt: true })
  }, [
    consolePromptSession,
    enterGuidedRootSession,
    featureAssistDescriptor,
    stagedNavigationSession,
  ])

  useEffect(() => {
    if (windowMode !== 'floating') {
      return
    }
    const viewportSize = resolveFloatingViewportSize()
    const clamped = clampFloatingRect(floatingRect, viewportSize.width, viewportSize.height)
    if (
      clamped.x !== floatingRect.x ||
      clamped.y !== floatingRect.y ||
      clamped.width !== floatingRect.width ||
      clamped.height !== floatingRect.height
    ) {
      setFloatingRect(clamped)
    }
  }, [floatingRect, resolveFloatingViewportSize, setFloatingRect, windowMode])

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
      if (
        event.key === 'Tab' &&
        !event.shiftKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.metaKey &&
        (cycleActiveReferenceTransformModeWithTab() ||
          cycleActiveContentObjectTransformModeWithTab())
      ) {
        event.preventDefault()
        event.stopImmediatePropagation()
        focusMainConsoleInput()
        return
      }
      if (
        event.key === 'Escape' &&
        (useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.entryActive ===
          true ||
          useAppStore.getState().referenceWorkspace.activeContentObjectTransformSession
            ?.entryActive === true)
      ) {
        event.preventDefault()
        event.stopImmediatePropagation()
        handleEscCancelCommand()
        return
      }
      const routing = routeConsoleGlobalKey(event)
      const shouldStepBackReferenceTransformPromptOnEscape =
        event.key === 'Escape' &&
        (consolePromptSession?.kind === 'reference-transform.axis' ||
          consolePromptSession?.kind === 'reference-transform.plane')
      if (
        shouldStepBackReferenceTransformPromptOnEscape ||
        (routing.owner === 'staged-console' && event.key === 'Escape')
      ) {
        event.preventDefault()
        event.stopImmediatePropagation()
        handleEscCancelCommand()
        return
      }
      if (
        (routing.owner === 'staged-console' ||
          stagedNavigationSession !== null ||
          consolePromptSession !== null ||
          featureAssistDescriptor !== null) &&
        (event.key === 'Enter' || (treatSpaceAsSubmit && event.key === ' '))
      ) {
        event.preventDefault()
        event.stopImmediatePropagation()
        focusMainConsoleInput()
        handleSubmitCommand(useConsoleStore.getState().inputText)
        return
      }
      if (
        (routing.owner === 'staged-console' ||
          stagedNavigationSession !== null ||
          consolePromptSession !== null ||
          featureAssistDescriptor !== null) &&
        event.key === 'ArrowUp'
      ) {
        event.preventDefault()
        event.stopImmediatePropagation()
        focusMainConsoleInput()
        cycleStagedChoiceWithRadioBurst('next', 'arrowUp')
        return
      }
      if (
        (routing.owner === 'staged-console' ||
          stagedNavigationSession !== null ||
          consolePromptSession !== null ||
          featureAssistDescriptor !== null) &&
        event.key === 'ArrowDown'
      ) {
        event.preventDefault()
        event.stopImmediatePropagation()
        focusMainConsoleInput()
        cycleStagedChoiceWithRadioBurst('previous', 'arrowDown')
        return
      }
      if (
        suppressAutoCaptureRef.current ||
        routing.decision !== 'handle' ||
        ((routing.owner !== 'flat-console' && routing.owner !== 'staged-console') &&
          !(
            useSpaghettiStore.getState().geometrySketchSession?.mode === 'draw' &&
            useSpaghettiStore.getState().geometrySketchSession?.activeTool === null
          ))
      ) {
        return
      }
      event.preventDefault()
      event.stopImmediatePropagation()
      focusMainConsoleInput()
      primeSketchDrawStagedRootForTyping()
      seedInputText(event.key)
    }

    window.addEventListener('keydown', handleKeyDown, true)
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [
    cycleStagedChoiceWithRadioBurst,
    cycleActiveContentObjectTransformModeWithTab,
    cycleActiveReferenceTransformModeWithTab,
    consolePromptSession,
    featureAssistDescriptor,
    focusMainConsoleInput,
    handleEscCancelCommand,
    primeSketchDrawStagedRootForTyping,
    routeConsoleGlobalKey,
    seedInputText,
    stagedNavigationSession,
    treatSpaceAsSubmit,
  ])

  useEffect(() => {
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
      if (
        event.key === 'Tab' &&
        !event.shiftKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.metaKey &&
        (cycleActiveReferenceTransformModeWithTab() ||
          cycleActiveContentObjectTransformModeWithTab())
      ) {
        event.preventDefault()
        event.stopImmediatePropagation()
        focusPopoutConsoleInput()
        return
      }
      if (
        event.key === 'Escape' &&
        (useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.entryActive ===
          true ||
          useAppStore.getState().referenceWorkspace.activeContentObjectTransformSession
            ?.entryActive === true)
      ) {
        event.preventDefault()
        event.stopImmediatePropagation()
        handleEscCancelCommand()
        return
      }
      const routing = routeConsoleGlobalKey(event)
      const shouldStepBackReferenceTransformPromptOnEscape =
        event.key === 'Escape' &&
        (consolePromptSession?.kind === 'reference-transform.axis' ||
          consolePromptSession?.kind === 'reference-transform.plane')
      if (
        shouldStepBackReferenceTransformPromptOnEscape ||
        (routing.owner === 'staged-console' && event.key === 'Escape')
      ) {
        event.preventDefault()
        event.stopImmediatePropagation()
        handleEscCancelCommand()
        return
      }
      if (
        (routing.owner === 'staged-console' ||
          stagedNavigationSession !== null ||
          consolePromptSession !== null ||
          featureAssistDescriptor !== null) &&
        (event.key === 'Enter' || (treatSpaceAsSubmit && event.key === ' '))
      ) {
        event.preventDefault()
        event.stopImmediatePropagation()
        focusPopoutConsoleInput()
        handleSubmitCommand(useConsoleStore.getState().inputText)
        return
      }
      if (
        (routing.owner === 'staged-console' ||
          stagedNavigationSession !== null ||
          consolePromptSession !== null ||
          featureAssistDescriptor !== null) &&
        event.key === 'ArrowUp'
      ) {
        event.preventDefault()
        event.stopImmediatePropagation()
        focusPopoutConsoleInput()
        cycleStagedChoiceWithRadioBurst('next', 'arrowUp')
        return
      }
      if (
        (routing.owner === 'staged-console' ||
          stagedNavigationSession !== null ||
          consolePromptSession !== null ||
          featureAssistDescriptor !== null) &&
        event.key === 'ArrowDown'
      ) {
        event.preventDefault()
        event.stopImmediatePropagation()
        focusPopoutConsoleInput()
        cycleStagedChoiceWithRadioBurst('previous', 'arrowDown')
        return
      }
      if (
        suppressAutoCaptureRef.current ||
        routing.decision !== 'handle' ||
        ((routing.owner !== 'flat-console' && routing.owner !== 'staged-console') &&
          !(
            useSpaghettiStore.getState().geometrySketchSession?.mode === 'draw' &&
            useSpaghettiStore.getState().geometrySketchSession?.activeTool === null
          ))
      ) {
        return
      }
      event.preventDefault()
      event.stopImmediatePropagation()
      focusPopoutConsoleInput()
      primeSketchDrawStagedRootForTyping()
      seedInputText(event.key)
    }

    popoutWindow.addEventListener('keydown', handlePopoutKeyDown, true)
    return () => {
      popoutWindow.removeEventListener('keydown', handlePopoutKeyDown, true)
    }
  }, [
    cycleStagedChoiceWithRadioBurst,
    cycleActiveContentObjectTransformModeWithTab,
    cycleActiveReferenceTransformModeWithTab,
    consolePromptSession,
    featureAssistDescriptor,
    focusPopoutConsoleInput,
    handleEscCancelCommand,
    popoutHost,
    primeSketchDrawStagedRootForTyping,
    routeConsoleGlobalKey,
    seedInputText,
    stagedNavigationSession,
    treatSpaceAsSubmit,
    windowMode,
  ])

  useEffect(() => {
    const isSketchDrawIdle =
      geometrySketchSession?.mode === 'draw' && geometrySketchSession.activeTool === null
    if (geometrySketchSession?.mode !== 'draw' && isSketchDrawLocalStagedScope(stagedNavigationSession)) {
      clearStagedNavigationSession()
      previousSketchDrawIdleRef.current = false
      return
    }
    if (!isSketchDrawIdle || consolePromptSession !== null) {
      previousSketchDrawIdleRef.current = isSketchDrawIdle
      return
    }
    if (stagedNavigationSession !== null && !isSketchDrawLocalStagedScope(stagedNavigationSession)) {
      previousSketchDrawIdleRef.current = isSketchDrawIdle
      return
    }
    if (stagedNavigationSession === null) {
      const sketchDrawRootSession = createSketchDrawRootSession(
        buildStagedNavigationContextFromStoreState(useSpaghettiStore.getState()),
      )
      const existingInputText = useConsoleStore.getState().inputText
      setStagedNavigationSession(sketchDrawRootSession)
      if (existingInputText.trim().length > 0) {
        useConsoleStore.getState().setInputText(existingInputText, { startManualOverride: true })
      }
      if (!previousSketchDrawIdleRef.current) {
        appendConsoleEntry({
          layer: 'Commands',
          text: 'Graph > Sketch > Sketch Draw',
          source: 'console',
          severity: 'info',
        })
        appendConsoleEntry({
          layer: 'Commands',
          text: buildStagedPromptText(sketchDrawRootSession, sketchDrawRootSession.validChoices),
          source: 'console',
          severity: 'info',
        })
      }
    }
    previousSketchDrawIdleRef.current = isSketchDrawIdle
  }, [
    clearStagedNavigationSession,
    consolePromptSession,
    geometrySketchSession,
    setStagedNavigationSession,
    stagedNavigationSession,
  ])

  useEffect(() => {
    const nextDescriptor = getActiveFeatureAssistDescriptor({
      sketchPlanePickSession,
      geometrySketchSession,
      referenceWorkspace,
      stagedNavigationSession,
    })
    if (stagedNavigationSession?.scopeId === 'root' && nextDescriptor !== null) {
      clearStagedNavigationSession()
    }
    setFeatureAssistDescriptor(nextDescriptor)
  }, [
    clearStagedNavigationSession,
    consolePromptSession,
    geometrySketchSession,
    referenceWorkspace,
    setFeatureAssistDescriptor,
    sketchPlanePickSession,
    stagedNavigationSession,
  ])

  useEffect(() => {
    if (
      consolePromptSession === null ||
      (consolePromptSession.kind !== 'reference-transform.axis' &&
        consolePromptSession.kind !== 'reference-transform.plane')
    ) {
      return
    }
    const nextPrefill = getReferenceTransformPromptPrefill(consolePromptSession, referenceWorkspace)
    useConsoleStore.getState().updateConsolePromptSessionPrefill(nextPrefill)
  }, [consolePromptSession, referenceWorkspace])

  useEffect(() => {
    const activeSession = referenceWorkspace.activeReferenceTransformSession
    const activeHandle = referenceWorkspace.activeReferenceTransformSession?.activeHandle ?? null
    const isReferenceTransformPrompt =
      consolePromptSession?.kind === 'reference-transform.axis' ||
      consolePromptSession?.kind === 'reference-transform.plane'
    if (isReferenceTransformPrompt && (activeSession === null || !activeSession.entryActive)) {
      useConsoleStore.getState().clearConsolePromptSession()
      return
    }
    if (activeHandle === null) {
      return
    }
    const nextPromptSession = resolveReferenceTransformPromptSessionFromHandle({
      referenceWorkspace,
      stagedNavigationSession,
      activeHandle,
    })
    if (nextPromptSession === null) {
      useConsoleStore.getState().setConsolePromptSession(null)
      return
    }
    if (!isSameReferenceTransformPromptSession(consolePromptSession, nextPromptSession)) {
      setConsolePromptSession(nextPromptSession)
    }
  }, [
    consolePromptSession,
    referenceWorkspace,
    setConsolePromptSession,
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

  const beginFloatingHeaderDrag = useCallback(
    (
      startRect: ConsoleFloatingRect,
      seed: {
        clientX: number
        clientY: number
        pointerOffsetX: number
        pointerOffsetY: number
      },
    ) => {
      const move = (moveEvent: PointerEvent) => {
        const viewportSize = resolveFloatingViewportSize()
        setFloatingRect(
          clampFloatingRect(
            {
              ...startRect,
              x: moveEvent.clientX - seed.pointerOffsetX,
              y: moveEvent.clientY - seed.pointerOffsetY,
            },
            viewportSize.width,
            viewportSize.height,
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
    },
    [resolveFloatingViewportSize, setFloatingRect],
  )

  const handleFloatingHeaderPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null
    if (target?.closest('button, input, select') !== null) {
      return
    }
    event.preventDefault()
    event.stopPropagation()
    beginFloatingHeaderDrag(floatingRect, {
      clientX: event.clientX,
      clientY: event.clientY,
      pointerOffsetX: event.clientX - floatingRect.x,
      pointerOffsetY: event.clientY - floatingRect.y,
    })
  }

  useLayoutEffect(() => {
    if (windowMode !== 'floating' || slotHeaderDragSeed === null) {
      return
    }
    if (consumedSlotHeaderDragPointerIdRef.current === slotHeaderDragSeed.pointerId) {
      return
    }
    consumedSlotHeaderDragPointerIdRef.current = slotHeaderDragSeed.pointerId
    const viewportSize = resolveFloatingViewportSize()
    const seededRect = clampFloatingRect(
      {
        ...floatingRect,
        x: slotHeaderDragSeed.clientX - slotHeaderDragSeed.pointerOffsetX,
        y: slotHeaderDragSeed.clientY - slotHeaderDragSeed.pointerOffsetY,
      },
      viewportSize.width,
      viewportSize.height,
    )
    setFloatingRect(seededRect)
    beginFloatingHeaderDrag(seededRect, slotHeaderDragSeed)
    onConsumeSlotHeaderDragSeed?.()
  }, [
    beginFloatingHeaderDrag,
    onConsumeSlotHeaderDragSeed,
    resolveFloatingViewportSize,
    setFloatingRect,
    slotHeaderDragSeed,
    windowMode,
  ])

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

      const viewportSize = resolveFloatingViewportSize()
      setFloatingRect(clampFloatingRect(nextRect, viewportSize.width, viewportSize.height))
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
    const slottedConsoleSurfaceInstanceId = findSlottedSurfaceInstanceIdByKind('console')
    if (slottedConsoleSurfaceInstanceId !== null) {
      floatWorkspaceSurface(slottedConsoleSurfaceInstanceId)
      return
    }
    switchToFloating()
  }

  const handlePopoutToggle = () => {
    if (windowMode === 'popout') {
      switchToDocked(false)
      return
    }
    const slottedConsoleSurfaceInstanceId = findSlottedSurfaceInstanceIdByKind('console')
    if (slottedConsoleSurfaceInstanceId !== null) {
      popoutWorkspaceSurface(slottedConsoleSurfaceInstanceId)
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
        onInputFocus={rehydrateGuidedRootSession}
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
              onInputFocus={rehydrateGuidedRootSession}
            />
          </div>,
          popoutHost,
        )
      : null

  const shouldRenderDockedSurface = !(suppressDockedSurface && windowMode === 'docked')

  const listSurface =
    isListMode && shouldRenderDockedSurface ? (
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
      {shouldRenderDockedSurface ? (
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
              onInputFocus={rehydrateGuidedRootSession}
            />
          ) : null}
          {floatingWindow}
        </div>
      ) : null}
      {popoutSurface}
    </>
  )
}
