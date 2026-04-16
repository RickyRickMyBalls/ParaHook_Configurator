import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import { createPortal } from 'react-dom'
import {
  getViewer,
} from '../viewerBridge'
import {
  canReferenceItemExplode,
  resolveOwnedContentSelection,
  resolveReferenceIdsForWorkspaceTarget,
  resolveWorkspaceSelectedContentOwnerTarget,
  selectCurrentProjectTopLevelAssemblies,
  selectConsoleWorkspaceContextTarget,
  selectReferenceWorkspaceBrowserTree,
  useAppStore,
} from '../store/useAppStore'
import { useUiPrefsStore } from '../store/uiPrefsStore'
import { useWorkspaceStore } from '../workspace/useWorkspaceStore'
import {
  buildConsoleWorkspaceViewportOptions,
} from '../workspace/workspaceViewportLabels'
import {
  activateGraphDocumentIntent,
  activateGraphNodeIntent,
  buildWorkspaceIntentDepsFromCurrentStoreState,
} from '../store/workspaceIntents'
import { getNodeDef } from '../spaghetti/registry/nodeRegistry'
import type { EditorViewportWindowMode } from '../spaghetti/schema/spaghettiTypes'
import {
  type GeometrySketchDrawStage,
  selectActiveEditorViewport,
  selectEditorViewportSelectedNodeId,
  selectGraphDocumentById,
  selectOrderedGraphDocuments,
  useSpaghettiStore,
} from '../spaghetti/store/useSpaghettiStore'
import { ConsoleBar } from './ConsoleBar'
import { ConsolePanel } from './ConsolePanel'
import { normalizeRadioCommandIdentity } from './consoleCommandParser'
import {
  buildStagedPromptText,
  formatStagedBreadcrumb,
  ROOT_PROMPT_TEXT,
} from './consolePromptText'
import {
  openReferenceTransformAxisPrompt as openReferenceTransformAxisPromptCommand,
  openReferenceTransformPlanePrompt as openReferenceTransformPlanePromptCommand,
  transitionReferenceTransformAxisPrompt as transitionReferenceTransformAxisPromptCommand,
} from './consoleReferenceContentCommands'
import {
  type ConsoleSlotHeaderDragSeed,
  useConsoleWindowing,
} from './useConsoleWindowing'
import { useConsoleInteraction } from './useConsoleInteraction'
import { buildReferenceTransformAssistDescriptor } from './referenceTransformConsole'
import {
  appendConsoleEntry,
  formatConsoleEntryLayerLabel,
  isConsoleEntryVisible,
  useConsoleStore,
} from './useConsoleStore'
import type { ConsoleAssistDescriptor } from './consoleTypes'
import {
  buildContentTransformRootChoices,
  buildReferenceTransformRootChoices,
  createConsoleStagedNavigationContext,
  isConsoleStagedNavigationRootToken,
  resolveConsoleWorkspaceContextSync,
  type ConsoleStagedNavigationSession,
} from './stagedNavigation'
import {
  resolveSelectedObjectPartKeyForZoom as resolveSelectedObjectPartKeyForZoomFromAppState,
  resolveSelectedReferenceIdForZoom as resolveSelectedReferenceIdForZoomFromAppState,
} from '../zoomObjectTarget'

type ConsoleDockProps = {
  listLeftOffset?: number
  suppressDockedSurface?: boolean
  suppressSlotHeaderDragSeedReplay?: boolean
  slotHeaderDragSeed?: ConsoleSlotHeaderDragSeed | null
  onConsumeSlotHeaderDragSeed?: () => void
  onOpenFloatingSplitMenu?: (
    surfaceInstanceId: string,
    event: ReactMouseEvent<HTMLDivElement>,
  ) => void
}

const isSketchDrawLocalStagedScope = (
  session: ConsoleStagedNavigationSession | null,
): boolean =>
  session?.scopeId === 'sketchDrawRoot' ||
  session?.scopeId === 'sketchDrawCameraRoot' ||
  session?.scopeId === 'sketchDrawCameraProjectionRoot' ||
  session?.scopeId === 'sketchDrawZoomRoot'

const getGeometrySketchDrawStageLabel = (drawStage: GeometrySketchDrawStage | null): string =>
  drawStage === 'sessionIdle'
    ? 'Session Idle'
    : drawStage === 'toolSelected'
      ? 'Tool Selected'
      : drawStage === 'draftActive'
        ? 'Draft Active'
        : 'n/a'

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
  const workspaceState = useWorkspaceStore.getState()
  const referenceTree = selectReferenceWorkspaceBrowserTree(appState)
  const workspaceViewportOptions = buildConsoleWorkspaceViewportOptions(
    workspaceState.viewportSlotsById,
    workspaceState.primaryViewportId,
  )
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
        canDelete: item.sourceKind === 'imported',
        canHide: item.isVisible,
        canExplode: canReferenceItemExplode(appState, item.referenceId),
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
    workspaceViewportOptions,
  )
}

export function ConsoleDock({
  listLeftOffset = 0,
  suppressDockedSurface = false,
  suppressSlotHeaderDragSeedReplay = false,
  slotHeaderDragSeed = null,
  onConsumeSlotHeaderDragSeed,
  onOpenFloatingSplitMenu,
}: ConsoleDockProps) {
  const dockRef = useRef<HTMLDivElement | null>(null)
  const dockedInputRef = useRef<HTMLInputElement | null>(null)
  const floatingInputRef = useRef<HTMLInputElement | null>(null)
  const popoutInputRef = useRef<HTMLInputElement | null>(null)
  const suppressAutoCaptureRef = useRef(false)
  const graphRootEditorRevealRestoreRef = useRef<GraphRootEditorRevealRestore | null>(null)
  const rootGuidedOptOutRef = useRef(false)
  const lastHandledConsoleContextSyncSeqRef = useRef(0)
  const lastHandledConsoleWorkspaceContextHandoffSeqRef = useRef(0)
  const lastHandledReferenceTransformShellExitSeqRef = useRef(0)
  const suppressNextReferenceTransformShellExitRef = useRef(false)
  const previousSketchPlanePickSessionRef = useRef<
    ReturnType<typeof useSpaghettiStore.getState>['sketchPlanePickSession']
  >(null)
  const previousSketchDrawIdleRef = useRef(false)
  const activeDetachedConsoleSurface = useWorkspaceStore((state) =>
    Object.values(state.detachedSlotSurfaceById).find((surface) => surface.surfaceKind === 'console') ??
    null,
  )
  const viewportSlotsById = useWorkspaceStore((state) => state.viewportSlotsById)
  const editorSurfaceBindingById = useWorkspaceStore((state) => state.editorSurfaceBindingById)
  const editorSurfacePlacementById = useWorkspaceStore((state) => state.editorSurfacePlacementById)
  const splitViewportSlot = useWorkspaceStore((state) => state.splitViewportSlot)
  const createDetachedViewportSurfaceCopy = useWorkspaceStore(
    (state) => state.createDetachedViewportSurfaceCopy,
  )
  const detachViewportSlotSurface = useWorkspaceStore((state) => state.detachViewportSlotSurface)
  const removeViewportSlot = useWorkspaceStore((state) => state.removeViewportSlot)
  const setActiveViewerViewportId = useWorkspaceStore((state) => state.setActiveViewerViewportId)
  const setViewportSlotSurfaceKind = useWorkspaceStore((state) => state.setViewportSlotSurfaceKind)
  const setBrowserFloatingPosition = useWorkspaceStore((state) => state.setBrowserFloatingPosition)
  const setBrowserFloatingSize = useWorkspaceStore((state) => state.setBrowserFloatingSize)
  const setIsBrowserPoppedOut = useWorkspaceStore((state) => state.setBrowserPoppedOut)
  const setBrowserViewportSplit = useWorkspaceStore((state) => state.setBrowserViewportSplit)
  const closeEditorViewport = useSpaghettiStore((state) => state.closeEditorViewport)
  const openGraphDocumentInNewViewport = useSpaghettiStore((state) => state.openGraphDocumentInNewViewport)
  const activeEditorViewport = useSpaghettiStore(selectActiveEditorViewport)
  const editorViewportsById = useSpaghettiStore((state) => state.editorViewportsById)
  const appendEscUserEntry = useCallback(() => {
    appendConsoleEntry({
      layer: 'Commands',
      commandLineKind: 'user',
      text: '> esc',
    })
  }, [])

  const createDuplicatedEditorSurfaceInstanceId = useCallback(
    (sourceSurfaceInstanceId?: string | null) => {
      const spaghettiState = useSpaghettiStore.getState()
      const preferredGraphDocumentId =
        (sourceSurfaceInstanceId !== undefined && sourceSurfaceInstanceId !== null
          ? editorSurfaceBindingById[sourceSurfaceInstanceId]?.graphDocumentId
          : undefined) ??
        activeEditorViewport?.graphDocumentId ??
        spaghettiState.activeGraphDocumentId ??
        spaghettiState.graphDocumentOrder?.[0] ??
        null
      if (preferredGraphDocumentId === null || preferredGraphDocumentId === undefined) {
        return null
      }
      return openGraphDocumentInNewViewport?.(preferredGraphDocumentId) ?? null
    },
    [activeEditorViewport?.graphDocumentId, editorSurfaceBindingById, openGraphDocumentInNewViewport],
  )

  const resolveEditorSurfaceInstanceIdForSlotSwitch = useCallback(
    (currentSlot: {
      surfaceInstanceId: string
      retainedSurfaceInstanceIdsByKind: Partial<
        Record<'modelViewer' | 'browser' | 'console' | 'spaghettiEditor', string>
      >
    }) => {
      const isReusableUnboundEditorViewport = (editorViewportId: string) => {
        const viewport = editorViewportsById[editorViewportId] ?? null
        if (viewport === null) {
          return false
        }
        const isSlotted = Object.values(viewportSlotsById).some(
          (slot) =>
            slot.surfaceKind === 'spaghettiEditor' && slot.surfaceInstanceId === editorViewportId,
        )
        if (isSlotted) {
          return false
        }
        const placement = editorSurfacePlacementById[editorViewportId] ?? null
        const windowMode = viewport.windowMode ?? placement?.windowMode
        return !(
          windowMode === 'expanded' ||
          windowMode === 'maximized' ||
          windowMode === 'collapsed' ||
          windowMode === 'meatball editor view' ||
          windowMode === 'separateWindow'
        )
      }

      const retainedEditorViewportId =
        currentSlot.retainedSurfaceInstanceIdsByKind.spaghettiEditor ?? null
      if (
        retainedEditorViewportId !== null &&
        isReusableUnboundEditorViewport(retainedEditorViewportId)
      ) {
        return retainedEditorViewportId
      }

      return createDuplicatedEditorSurfaceInstanceId(currentSlot.surfaceInstanceId)
    },
    [
      createDuplicatedEditorSurfaceInstanceId,
      editorSurfacePlacementById,
      editorViewportsById,
      viewportSlotsById,
    ],
  )

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
  const consoleWorkspaceContextHandoff = useAppStore(
    (state) => state.consoleWorkspaceContextHandoff,
  )
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
  const {
    popoutWindow,
    popoutHost,
    workspaceViewportElement,
    splitDockPreview,
    splitDockGhostStyle,
    floatingWindowStyle,
    handleFloatingHeaderPointerDown,
    handleFloatingResizePointerDown,
    handleFloatToggle,
    handlePopoutToggle,
    handleListToggle,
    handleFloatingClose,
    handlePopoutClose,
    handleListPanelClose,
    handleFloatingHeaderContextMenu,
  } = useConsoleWindowing({
    dockRef,
    floatingRect,
    setFloatingRect,
    windowMode,
    isListMode,
    setExpanded,
    switchToDocked,
    switchToFloating,
    switchToPopout,
    switchToList,
    returnFromList,
    handlePopoutWindowClosed,
    onPopoutBlocked: handleConsolePopoutBlocked,
    slotHeaderDragSeed,
    suppressSlotHeaderDragSeedReplay,
    onConsumeSlotHeaderDragSeed,
    onOpenFloatingSplitMenu,
    activeDetachedConsoleSurface,
    viewportSlotsById,
  })
  const createMissingGraphNodeInGraphDocument = useCallback((
    graphDocumentId: string,
    nodeType: 'Geometry/Sketch' | 'Geometry/Extrude' | 'System/OutputPreview',
    labelPrefix: 'sketch' | 'extrude' | 'outputPreview',
  ) => {
    const initialState = useSpaghettiStore.getState()
    const createdNode = initialState.createGraphNodeInDocumentAndSelect({
      graphDocumentId,
      nodeType,
      labelPrefix,
    })
    if (createdNode === null) {
      return null
    }
    const updatedState = useSpaghettiStore.getState()
    activateGraphNodeIntent(
      buildWorkspaceIntentDepsFromCurrentStoreState(),
      graphDocumentId,
      createdNode.nodeId,
      {
      strategy: 'open-or-focus',
      fitNodeInViewport: true,
      },
    )
    return {
      nodeId: createdNode.nodeId,
      nodeLabel: createdNode.nodeLabel,
      stagedContext: buildStagedNavigationContextFromStoreState(updatedState),
    }
  }, [])

  const resolveConsoleActionContext = useCallback(
    (preferredGraphDocumentId: string | null = null): ConsoleActionContext =>
      resolveConsoleActionContextFromState(preferredGraphDocumentId),
    [],
  )

  const resolveSelectedReferenceIdForZoom = useCallback((): string | null => {
    return resolveSelectedReferenceIdForZoomFromAppState(useAppStore.getState())
  }, [])

  const resolveSelectedObjectPartKeyForZoom = useCallback((): string | null => {
    return resolveSelectedObjectPartKeyForZoomFromAppState(useAppStore.getState())
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

  const openReferenceTransformAxisPrompt = useCallback((
    axis: 'x' | 'y' | 'z',
  ) => {
    openReferenceTransformAxisPromptCommand({
      axis,
      getAppState: () => useAppStore.getState(),
      getStagedNavigationSession: () => useConsoleStore.getState().stagedNavigationSession,
      getViewer,
      setConsolePromptSession,
    })
  }, [])

  const openReferenceTransformPlanePrompt = useCallback((
    plane: 'xy' | 'xz' | 'yz',
  ) => {
    openReferenceTransformPlanePromptCommand({
      getAppState: () => useAppStore.getState(),
      getStagedNavigationSession: () => useConsoleStore.getState().stagedNavigationSession,
      plane,
      setConsolePromptSession,
    })
  }, [])

  const transitionReferenceTransformAxisPrompt = useCallback((
    next: {
      mode: 'translate' | 'rotate' | 'scale'
      axis?: 'x' | 'y' | 'z'
    },
  ) => {
    transitionReferenceTransformAxisPromptCommand({
      clearConsolePromptSession: () => useConsoleStore.getState().clearConsolePromptSession(),
      getAppState: () => useAppStore.getState(),
      getViewer,
      next,
      openReferenceTransformAxisPrompt,
    })
  }, [openReferenceTransformAxisPrompt])
  const {
    enterGuidedRootSession,
    rehydrateGuidedRootSession,
    handleGuidedChoiceCycle,
    exitActiveReferenceTransformShell,
    handleEscCancelCommand,
    handleSubmitCommand,
  } = useConsoleInteraction({
    windowMode,
    popoutWindow,
    treatSpaceAsSubmit,
    consoleInputText,
    consolePromptSession,
    stagedNavigationSession,
    featureAssistDescriptor,
    geometrySketchSession,
    sketchPlanePickSession,
    referenceWorkspace,
    stagedChoiceIndex,
    isStagedChoiceManualOverride,
    suppressAutoCaptureRef,
    rootGuidedOptOutRef,
    previousSketchDrawIdleRef,
    focusMainConsoleInput,
    focusPopoutConsoleInput,
    setStagedNavigationSession,
    clearStagedNavigationSession,
    setFeatureAssistDescriptor,
    setConsolePromptSession,
    cycleStagedChoice,
    seedInputText,
    appendEscUserEntry,
    buildFeatureAssistPromptText,
    buildSketchDrawCameraAssistDescriptor,
    buildSketchDrawCameraProjectionAssistDescriptor,
    buildSketchDrawFeatureAssistDescriptor,
    buildStagedNavigationContextFromStoreState,
    buildWorkspaceIntentDepsFromStoreState: buildWorkspaceIntentDepsFromCurrentStoreState,
    closeEditorViewport,
    createMissingGraphNodeInGraphDocument,
    createDetachedViewportSurfaceCopy,
    detachViewportSlotSurface,
    ensureSpaghettiEditorVisibleForGraphRoot,
    findFeatureAssistChoiceByInput,
    getActiveFeatureAssistDescriptor,
    getGeometrySketchDrawStageLabel,
    graphRootEditorRevealRestoreRef,
    openReferenceTransformAxisPrompt,
    openReferenceTransformPlanePrompt,
    pushCommandHistory,
    resolveConsoleActionContext,
    resolveEditorViewportIdForGraphDocumentFromState,
    resolveEditorSurfaceInstanceIdForSlotSwitch,
    resolveSelectedObjectPartKeyForZoom,
    resolveSelectedReferenceIdForZoom,
    resolveSelectionSetForZoom,
    removeViewportSlot,
    setActiveViewerViewportId,
    setBrowserFloatingPosition,
    setBrowserFloatingSize,
    setBrowserViewportSplit,
    setIsBrowserPoppedOut,
    setViewportSlotSurfaceKind,
    splitViewportSlot,
    suppressNextReferenceTransformShellExitRef,
    switchToDocked,
    transitionReferenceTransformAxisPrompt,
  })

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
    const hasNewExplicitWorkspaceHandoff =
      consoleWorkspaceContextHandoff !== null &&
      consoleWorkspaceContextHandoff.seq !== lastHandledConsoleWorkspaceContextHandoffSeqRef.current
    const hasNewLegacyContextSync =
      consoleContextSyncRequest !== null &&
      consoleContextSyncRequest.seq !== lastHandledConsoleContextSyncSeqRef.current

    if (!hasNewExplicitWorkspaceHandoff && !hasNewLegacyContextSync) {
      return
    }

    const spaghettiState = useSpaghettiStore.getState()
    const appState = useAppStore.getState()
    let isForcedRootSync = false
    let isExplicitWorkspaceHandoff = false
    let resolvedTarget:
      | {
          graphDocumentId: string | null
          nodeId: string | null
        }
      | ReturnType<typeof selectConsoleWorkspaceContextTarget>
      | null = null

    if (hasNewExplicitWorkspaceHandoff && consoleWorkspaceContextHandoff !== null) {
      lastHandledConsoleWorkspaceContextHandoffSeqRef.current = consoleWorkspaceContextHandoff.seq
      isExplicitWorkspaceHandoff = true
      if (
        hasNewLegacyContextSync &&
        consoleContextSyncRequest !== null &&
        (consoleContextSyncRequest.reason === 'surface-activation' ||
          consoleContextSyncRequest.reason === 'surface-clear' ||
          consoleContextSyncRequest.reason === 'target-selection')
      ) {
        lastHandledConsoleContextSyncSeqRef.current = consoleContextSyncRequest.seq
      }
      if (consoleWorkspaceContextHandoff.mode === 'root') {
        isForcedRootSync = true
        resolvedTarget = null
      } else if (
        (consoleWorkspaceContextHandoff.mode === 'graph' ||
          consoleWorkspaceContextHandoff.mode === 'node') &&
        consoleWorkspaceContextHandoff.graphDocumentId !== null
      ) {
        resolvedTarget = {
          graphDocumentId: consoleWorkspaceContextHandoff.graphDocumentId,
          nodeId:
            consoleWorkspaceContextHandoff.mode === 'node'
              ? consoleWorkspaceContextHandoff.nodeId ?? null
              : null,
        }
      } else if (consoleWorkspaceContextHandoff.mode === 'selection') {
        resolvedTarget = selectConsoleWorkspaceContextTarget(appState)
      }
    } else if (hasNewLegacyContextSync && consoleContextSyncRequest !== null) {
      lastHandledConsoleContextSyncSeqRef.current = consoleContextSyncRequest.seq
      const isSurfaceActivationSync = consoleContextSyncRequest.reason === 'surface-activation'
      const workspaceContextTarget = selectConsoleWorkspaceContextTarget(appState)
      isForcedRootSync =
        consoleContextSyncRequest.reason === 'surface-clear' &&
        workspaceActiveSurface !== 'spaghetti'
      resolvedTarget =
        isForcedRootSync
          ? null
          : isSurfaceActivationSync
          ? workspaceActiveSurface === 'spaghetti'
            ? {
                graphDocumentId:
                  spaghettiState.activeGraphDocumentId.length > 0
                    ? spaghettiState.activeGraphDocumentId
                    : null,
                nodeId: spaghettiState.selectedNodeId,
              }
            : null
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
    }

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
        buildWorkspaceIntentDepsFromCurrentStoreState(),
        resolvedGraphDocumentId,
        {
          strategy: 'open-or-focus',
        },
      )
    }

    const currentSession = useConsoleStore.getState().stagedNavigationSession
    if (
      spaghettiState.geometrySketchSession?.mode === 'draw' &&
      isSketchDrawLocalStagedScope(currentSession) &&
      resolvedHandoff.session !== null &&
      !isSketchDrawLocalStagedScope(resolvedHandoff.session)
    ) {
      return
    }
    const isForcedRootAvailabilitySync =
      isForcedRootSync && currentSession === null && resolvedHandoff.session === null

    if (
      !isExplicitWorkspaceHandoff &&
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
        !isForcedRootSync &&
        !isExplicitWorkspaceHandoff &&
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
        if (
          isExplicitWorkspaceHandoff ||
          (currentSession === null && isForcedRootAvailabilitySync)
        ) {
          const lastEntry = useConsoleStore.getState().entries.at(-1)
          if (isExplicitWorkspaceHandoff || lastEntry?.text !== ROOT_PROMPT_TEXT) {
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
        if (isExplicitWorkspaceHandoff || isForcedRootAvailabilitySync) {
          const lastEntry = useConsoleStore.getState().entries.at(-1)
          if (isExplicitWorkspaceHandoff || lastEntry?.text !== ROOT_PROMPT_TEXT) {
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
    consoleWorkspaceContextHandoff,
    consoleContextSyncRequest,
    enterGuidedRootSession,
    setStagedNavigationSession,
    workspaceActiveSurface,
    workspaceSelectedTarget,
  ])

  const floatingWindow = windowMode === 'floating' ? (
    <div
      className="ConsoleFloatingWindow"
      style={floatingWindowStyle}
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
        onHeaderContextMenu={handleFloatingHeaderContextMenu}
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
      {splitDockPreview !== null &&
      splitDockGhostStyle !== null &&
      workspaceViewportElement !== null
        ? createPortal(
            <div
              className={`ViewportSplitDockGhost ${
                splitDockPreview.scope === 'global'
                  ? 'isWholeBrowserScope'
                  : 'isPaneLocalScope'
              } ${
                splitDockPreview.side === 'left'
                  ? 'isDockLeft'
                  : splitDockPreview.side === 'right'
                    ? 'isDockRight'
                    : splitDockPreview.side === 'top'
                      ? 'isDockTop'
                      : 'isDockBottom'
              }`}
              data-split-preview-scope={splitDockPreview.scope}
              aria-hidden="true"
              style={splitDockGhostStyle}
            />,
            workspaceViewportElement,
          )
        : null}
      {popoutSurface}
    </>
  )
}
