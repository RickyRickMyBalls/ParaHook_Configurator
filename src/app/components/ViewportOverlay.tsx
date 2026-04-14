import {
  useEffect,
  useRef,
  useState,
  useMemo,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { routeKeyboardInput } from '../inputRouting'
import { revealFinishedSketch } from '../sketch/finishSketchVisibility'
import {
  selectRenderedProjectPartSet,
  useAppStore,
} from '../store/useAppStore'
import {
  buildWorkspaceIntentDepsFromCurrentStoreState,
  startSketchDrawIntent,
  startSketchReviewIntent,
} from '../store/workspaceIntents'
import { getViewer, subscribeViewer, type ViewerApi } from '../viewerBridge'
import { useUiPrefsStore } from '../store/uiPrefsStore'
import { useWorkspaceStore } from '../workspace/useWorkspaceStore'
import { ParaSlider } from './ParaSlider'
import { ParaSelect } from './ParaSelect'
import { ParaVec2Slider } from './ParaVec2Slider'
import { ParaVec3Slider } from './ParaVec3Slider'
import { ReferenceTransformToolbar } from './ReferenceTransformToolbar'
import {
  ViewportOverlayToolPanel,
  ViewportOverlayToolSectionStack,
  ViewportOverlayToolSplitLayout,
  ViewportOverlayToolSection,
  type ViewportOverlayToolPanelResizeDirection,
} from './ViewportOverlayToolPanel'
import { SpaghettiContextMenu } from '../spaghetti/ui/SpaghettiContextMenu'
import {
  selectSharedViewerComposition,
  selectViewerTargetGraphAcceptedGeometryResult,
  selectViewerTargetGraphAcceptedPreviewBuildBundle,
  selectViewerTargetGraphAcceptedPreviewBuildOutputs,
  selectViewerTargetGraphAcceptedPreviewGeometryResult,
  selectViewerTargetGraphCommittedAuthoritativeGeometryResult,
  selectViewerTargetGraphCommittedDraftGeometryResult,
  selectViewerTargetGraphPreviewReadyAuthoritativeGeometryResult,
  selectViewerTargetGraphPreviewPreparation,
  useSpaghettiStore,
} from '../spaghetti/store/useSpaghettiStore'
import { getTypeColor } from '../spaghetti/canvas/typeColors'
import type { WorkspaceViewportId } from '../workspace/workspaceShellTypes'
import { resolveWorkspaceViewportResultModeBehavior } from '../workspace/workspaceViewportResultMode'
import type {
  ConsoleBackgroundColorMode,
  ConsoleBackgroundFillMode,
  ConsoleToolsPreset,
} from '../console/consoleTypes'
import type { GeometrySketchTool } from '../spaghetti/store/useSpaghettiStore'
import {
  getPrimarySketchDrawToolLabel,
  PRIMARY_SKETCH_DRAW_TOOLS,
  type PrimarySketchDrawTool,
} from '../spaghetti/sketchCommands/drawCommands'
import type {
  Line2Component,
  RectangleComponent,
  SketchComponent,
  SketchFeature,
} from '../spaghetti/features/featureTypes'
import {
  formatStableNumber,
  labelProfilesForPreview,
  renderProfilePreview,
} from '../spaghetti/ui/features/profilePreview'
import { buildViewportResultSelectorOptions } from './buildViewportResultSelectorOptions'
import { selectViewportResultState } from '../spaghetti/selectors/selectViewportResultState'
import { selectViewportResultStatus } from '../spaghetti/selectors/selectViewportResultStatus'
import {
  AXIS_WIDGET_TOP,
  COMPACT_AXIS_WIDGET_SIZE,
  DEFAULT_EXPANDED_AXIS_WIDGET_SIZE,
  MAX_AXIS_WIDGET_SIZE,
  MIN_AXIS_WIDGET_SIZE,
  RIGHT_DOCK_PADDING_X,
  resolveViewportHudRight,
} from './viewToolbarLayout'

type OverlayPosition = {
  left: number
  top: number
}

type OverlaySize = {
  width: number
  height: number
}

type SliderClampRange = {
  min: number
  max: number
}

type OverlayToolDensity = 'collapsed' | 'essentials' | 'expanded'
type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

const defaultOverlayPosition: OverlayPosition = {
  left: 24,
  top: 72,
}

const normalizeSliderClampRange = (range: SliderClampRange): SliderClampRange => ({
  min: Math.min(range.min, range.max),
  max: Math.max(range.min, range.max),
})

const formatSketchPlaneHistorySignedValue = (value: number): string => {
  const rounded = Math.round(value * 10) / 10
  if (Object.is(rounded, -0)) {
    return '+0'
  }
  const literal = Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(1)
  return rounded >= 0 ? `+${literal}` : literal
}

type SketchPlaneTransformHistoryRowVm = {
  entryId: string
  label: string
  locked: boolean
}
type SketchEntityListRowVm =
  | {
      kind: 'component'
      key: string
      entryNumber: string
      label: string
      defaultLabel: string
      detail: string
      rowId: string
      expandable: false
    }
  | {
      kind: 'editable'
      key: string
      entryNumber: string
      label: string
      defaultLabel: string
      detail: string
      rowId: string
      component: Line2Component | RectangleComponent
      expandable: true
    }
  | {
      kind: 'group'
      key: string
      entryNumber: string
      label: string
      defaultLabel: string
      detail: string
      groupId: string
      children: Array<{
        key: string
        entryNumber: string
        label: string
        defaultLabel: string
        detail: string
        rowId: string
        component: Line2Component
      }>
    }

const DEFAULT_OVERLAY_TOOL_PANEL_SIZE: OverlaySize = {
  width: 340,
  height: 360,
}
const DEFAULT_SKETCH_SESSION_WINDOW_SIZE: OverlaySize = {
  width: 420,
  height: 520,
}
const MIN_OVERLAY_TOOL_PANEL_WIDTH = 280
const MIN_OVERLAY_TOOL_PANEL_HEIGHT = 240
const MIN_SKETCH_SESSION_WINDOW_WIDTH = 75
const MIN_SKETCH_SESSION_WINDOW_HEIGHT = 320
const SKETCH_SESSION_WINDOW_VIEWPORT_MARGIN = 12
const overlayToolDensityOrder: readonly OverlayToolDensity[] = [
  'collapsed',
  'essentials',
  'expanded',
] as const
const DEFAULT_OVERLAY_TOOL_BACKGROUND_OPACITY = 96
const DEFAULT_OVERLAY_TOOL_TEXT_OPACITY = 100
const DEFAULT_OVERLAY_TOOL_FONT_SIZE = 12
const DEFAULT_OVERLAY_TOOL_Z_INDEX = 28
const MIN_OVERLAY_TOOL_Z_INDEX = 0
const MAX_OVERLAY_TOOL_Z_INDEX = 40
const DEFAULT_OVERLAY_TOOL_FILL_MODE: ConsoleBackgroundFillMode = 'blur'
const DEFAULT_OVERLAY_TOOL_COLOR_MODE: ConsoleBackgroundColorMode = 'midnight'
const CLEAR_OVERLAY_TOOL_BACKGROUND_OPACITY = 10
const CLEAR_OVERLAY_TOOL_FILL_MODE: ConsoleBackgroundFillMode = 'flat'
const overlayToolBackgroundColorByMode: Record<ConsoleBackgroundColorMode, string> = {
  midnight: '10, 12, 18',
  slate: '20, 24, 32',
  navy: '16, 24, 44',
}

const clampOverlayPosition = (
  next: OverlayPosition,
  hostWidth: number,
  hostHeight: number,
  boundsWidth: number,
  boundsHeight: number,
): OverlayPosition => ({
  left: Math.round(
    Math.min(Math.max(next.left, 8), Math.max(boundsWidth - hostWidth - 8, 8)),
  ),
  top: Math.round(
    Math.min(Math.max(next.top, 8), Math.max(boundsHeight - hostHeight - 8, 8)),
  ),
})
const formatPoint = (point: { x: number; y: number }): string =>
  `(${formatStableNumber(point.x)}, ${formatStableNumber(point.y)})`

const formatSketchComponentDetail = (component: SketchComponent): string =>
  component.type === 'circle'
    ? `${formatPoint(component.center)} -> ${formatPoint(component.edge)}`
    : component.type === 'rectangle'
      ? `${formatPoint(component.a)} -> ${formatPoint(component.b)}`
      : component.type === 'line'
        ? `${formatPoint(component.a)} -> ${formatPoint(component.b)}`
        : component.type === 'arc3pt'
          ? `${formatPoint(component.start)} -> ${formatPoint(component.end)}`
        : `${formatPoint(component.p0)} -> ${formatPoint(component.p3)}`

const getRectangleWidth = (component: RectangleComponent): number =>
  Math.abs(component.b.x - component.a.x)

const getRectangleHeight = (component: RectangleComponent): number =>
  Math.abs(component.b.y - component.a.y)

const updateRectangleWidth = (
  component: RectangleComponent,
  nextWidth: number,
): { x: number; y: number } => ({
  x: component.a.x + (component.b.x >= component.a.x ? 1 : -1) * nextWidth,
  y: component.b.y,
})

const updateRectangleHeight = (
  component: RectangleComponent,
  nextHeight: number,
): { x: number; y: number } => ({
  x: component.b.x,
  y: component.a.y + (component.b.y >= component.a.y ? 1 : -1) * nextHeight,
})

const buildSketchEntityListRows = (
  components: readonly SketchComponent[],
): SketchEntityListRowVm[] => {
  const rows: SketchEntityListRowVm[] = []
  let polylineIndex = 1
  let entryNumber = 1
  for (let index = 0; index < components.length; index += 1) {
    const component = components[index]
    if (component === undefined) {
      continue
    }
    if (component.type === 'line' && typeof component.drawGroupId === 'string') {
      const groupedLines: typeof component[] = [component]
      let nextIndex = index + 1
      while (nextIndex < components.length) {
        const nextComponent = components[nextIndex]
        if (
          nextComponent?.type !== 'line' ||
          nextComponent.drawGroupId !== component.drawGroupId
        ) {
          break
        }
        groupedLines.push(nextComponent)
        nextIndex += 1
      }
      rows.push({
        kind: 'group',
        key: component.drawGroupId,
        entryNumber: `${entryNumber}`,
        label: component.drawGroupName ?? `PLine ${polylineIndex}`,
        defaultLabel: `PLine ${polylineIndex}`,
        detail: `${groupedLines.length} lines`,
        groupId: component.drawGroupId,
        children: groupedLines.map((line, lineIndex) => ({
          key: line.rowId,
          entryNumber: `${entryNumber}.${lineIndex + 1}`,
          label: line.name ?? `Line ${lineIndex + 1}`,
          defaultLabel: `Line ${lineIndex + 1}`,
          detail: formatSketchComponentDetail(line),
          rowId: line.rowId,
          component: line,
        })),
      })
      polylineIndex += 1
      entryNumber += 1
      index = nextIndex - 1
      continue
    }
    if (component.type === 'line' || component.type === 'rectangle') {
      rows.push({
        kind: 'editable',
        key: component.rowId,
        entryNumber: `${entryNumber}`,
        label: component.name ?? (component.type === 'rectangle' ? 'Rectangle' : 'Line'),
        defaultLabel: component.type === 'rectangle' ? 'Rectangle' : 'Line',
        detail: formatSketchComponentDetail(component),
        rowId: component.rowId,
        component,
        expandable: true,
      })
      entryNumber += 1
      continue
    }
    rows.push({
      kind: 'component',
      key: component.rowId,
      entryNumber: `${entryNumber}`,
      label: component.name ?? component.type,
      defaultLabel: component.type,
      detail: formatSketchComponentDetail(component),
      rowId: component.rowId,
      expandable: false,
    })
    entryNumber += 1
  }
  return rows
}

const getSketchEntityRowSelectionIds = (row: SketchEntityListRowVm): string[] =>
  row.kind === 'group'
    ? row.children.map((child) => child.rowId)
    : row.kind === 'editable' || row.kind === 'component'
      ? [row.rowId]
      : []

const isSketchEntityRowSelected = (
  row: SketchEntityListRowVm,
  selectedComponentIds: ReadonlySet<string>,
): boolean => {
  const rowSelectionIds = getSketchEntityRowSelectionIds(row)
  return rowSelectionIds.length > 0 && rowSelectionIds.every((rowId) => selectedComponentIds.has(rowId))
}

const isSketchEntityRowHovered = (
  row: SketchEntityListRowVm,
  hoveredComponentId: string | null,
): boolean =>
  hoveredComponentId !== null &&
  getSketchEntityRowSelectionIds(row).includes(hoveredComponentId)

const isPrimarySketchDrawToolLabelCandidate = (
  tool: GeometrySketchTool,
): tool is PrimarySketchDrawTool =>
  tool === 'line' || tool === 'pline' || tool === 'rectangle' || tool === 'circle'

const getGeometrySketchToolLabel = (tool: GeometrySketchTool): string =>
  tool === 'arc3pt'
    ? 'Arc3Point'
    : tool === 'spline'
      ? 'BezierSpline'
      : isPrimarySketchDrawToolLabelCandidate(tool)
        ? getPrimarySketchDrawToolLabel(tool)
        : String(tool)

const renderGeometrySketchToolIcon = (tool: GeometrySketchTool) => {
  if (tool === 'line') {
    return (
      <svg viewBox="0 0 20 20" className="ViewportOverlaySketchToolIcon" aria-hidden="true">
        <path d="M4 15L16 5" />
        <circle cx="4" cy="15" r="1.35" fill="currentColor" stroke="none" />
        <circle cx="16" cy="5" r="1.35" fill="currentColor" stroke="none" />
      </svg>
    )
  }
  if (tool === 'pline') {
    return (
      <svg viewBox="0 0 20 20" className="ViewportOverlaySketchToolIcon" aria-hidden="true">
        <path d="M4 15L9 10L14 12L16 5" />
        <circle cx="4" cy="15" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="9" cy="10" r="1.1" fill="currentColor" stroke="none" opacity="0.88" />
        <circle cx="14" cy="12" r="1.1" fill="currentColor" stroke="none" opacity="0.88" />
        <circle cx="16" cy="5" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    )
  }
  if (tool === 'arc3pt') {
    return (
      <svg viewBox="0 0 20 20" className="ViewportOverlaySketchToolIcon" aria-hidden="true">
        <path d="M4 14Q10 4 16 10" />
        <circle cx="4" cy="14" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="10" cy="4.5" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="16" cy="10" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    )
  }
  if (tool === 'spline') {
    return (
      <svg viewBox="0 0 20 20" className="ViewportOverlaySketchToolIcon" aria-hidden="true">
        <path d="M3.5 14.5C5.2 8.5 7.8 7.2 10.4 10.2C12.6 12.8 14.4 12.4 16.5 5.5" />
        <circle cx="3.5" cy="14.5" r="1.15" fill="currentColor" stroke="none" />
        <circle cx="7.4" cy="7.6" r="0.95" fill="currentColor" stroke="none" opacity="0.85" />
        <circle cx="12.6" cy="12.2" r="0.95" fill="currentColor" stroke="none" opacity="0.85" />
        <circle cx="16.5" cy="5.5" r="1.15" fill="currentColor" stroke="none" />
      </svg>
    )
  }
  if (tool === 'rectangle') {
    return (
      <svg viewBox="0 0 20 20" className="ViewportOverlaySketchToolIcon" aria-hidden="true">
        <rect x="4" y="5" width="12" height="10" rx="1.5" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 20 20" className="ViewportOverlaySketchToolIcon" aria-hidden="true">
      <circle cx="10" cy="10" r="5.6" />
    </svg>
  )
}

const getOverlayToolPreset = ({
  backgroundOpacity,
  textOpacity,
  fontSize,
  zIndex,
  fillMode,
  colorMode,
}: {
  backgroundOpacity: number
  textOpacity: number
  fontSize: number
  zIndex: number
  fillMode: ConsoleBackgroundFillMode
  colorMode: ConsoleBackgroundColorMode
}): ConsoleToolsPreset => {
  if (
    backgroundOpacity === DEFAULT_OVERLAY_TOOL_BACKGROUND_OPACITY &&
    textOpacity === DEFAULT_OVERLAY_TOOL_TEXT_OPACITY &&
    fontSize === DEFAULT_OVERLAY_TOOL_FONT_SIZE &&
    zIndex === DEFAULT_OVERLAY_TOOL_Z_INDEX &&
    fillMode === DEFAULT_OVERLAY_TOOL_FILL_MODE &&
    colorMode === DEFAULT_OVERLAY_TOOL_COLOR_MODE
  ) {
    return 'default'
  }
  if (
    backgroundOpacity === CLEAR_OVERLAY_TOOL_BACKGROUND_OPACITY &&
    textOpacity === DEFAULT_OVERLAY_TOOL_TEXT_OPACITY &&
    fontSize === DEFAULT_OVERLAY_TOOL_FONT_SIZE &&
    zIndex === DEFAULT_OVERLAY_TOOL_Z_INDEX &&
    fillMode === CLEAR_OVERLAY_TOOL_FILL_MODE &&
    colorMode === DEFAULT_OVERLAY_TOOL_COLOR_MODE
  ) {
    return 'clear'
  }
  return 'custom'
}

type ViewportOverlayProps = {
  viewportId?: WorkspaceViewportId
}

export function ViewportOverlay(props: ViewportOverlayProps = {}) {
  const { viewportId } = props
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const axisWidgetRef = useRef<HTMLDivElement | null>(null)
  const overlayRootRef = useRef<HTMLDivElement | null>(null)
  const sketchPlaneToolPanelRef = useRef<HTMLDivElement | null>(null)
  const sketchSessionWindowRef = useRef<HTMLDivElement | null>(null)
  const [flyMoveSpeed, setFlyMoveSpeed] = useState<number | null>(null)
  const selectedPartKey = useAppStore((state) => state.selectedPartKey)
  const partsVisibility = useAppStore((state) => state.partsVisibility)
  const currentProject = useAppStore((state) => state.currentProject)
  const projectContent = useAppStore((state) => state.projectContent)
  const browserGraphBuildPolicyByGraphDocumentId = useAppStore(
    (state) => state.browserGraphBuildPolicyByGraphDocumentId,
  )
  const browserContentBuildPolicyByRowId = useAppStore(
    (state) => state.browserContentBuildPolicyByRowId,
  )
  const browserInteractionGraphDocumentIds = useAppStore(
    (state) => state.browserInteractionGraphDocumentIds,
  )
  const isInteracting = useAppStore((state) => state.isInteracting)
  const delayedDraftBuildByGraphDocumentId = useAppStore(
    (state) => state.delayedDraftBuildByGraphDocumentId,
  )
  const delayedAuthoritativeBuildByGraphDocumentId = useAppStore(
    (state) => state.delayedAuthoritativeBuildByGraphDocumentId,
  )
  const beginInteraction = useAppStore((state) => state.beginInteraction)
  const endInteraction = useAppStore((state) => state.endInteraction)
  const beginBrowserBuildInteraction = useAppStore((state) => state.beginBrowserBuildInteraction)
  const endBrowserBuildInteraction = useAppStore((state) => state.endBrowserBuildInteraction)
  const activeGraphDocumentId = useSpaghettiStore((state) => state.activeGraphDocumentId)
  const graphRuntimeByDocumentId = useSpaghettiStore((state) => state.graphRuntimeByDocumentId)
  const graphDocumentsById = useSpaghettiStore((state) => state.graphDocumentsById)
  const sketchPlanePickSession = useSpaghettiStore((state) => state.sketchPlanePickSession)
  const geometrySketchSession = useSpaghettiStore((state) => state.geometrySketchSession)
  const sharedViewerComposition = useSpaghettiStore(selectSharedViewerComposition)
  const viewerTargetGraphDocumentId = useSpaghettiStore((state) => state.viewerTargetGraphDocumentId)
  const viewerTargetGeometryResult = useSpaghettiStore(selectViewerTargetGraphAcceptedGeometryResult)
  const viewerTargetPreviewReadyAuthoritativeGeometryResult = useSpaghettiStore(
    selectViewerTargetGraphPreviewReadyAuthoritativeGeometryResult,
  )
  const viewerTargetCommittedGeometryResult = useSpaghettiStore(
    selectViewerTargetGraphCommittedAuthoritativeGeometryResult,
  )
  const viewerTargetPreviewPreparation = useSpaghettiStore(selectViewerTargetGraphPreviewPreparation)
  const viewerTargetBuildBundle = useSpaghettiStore(selectViewerTargetGraphAcceptedPreviewBuildBundle)
  const viewerTargetBuildOutputs = useSpaghettiStore(selectViewerTargetGraphAcceptedPreviewBuildOutputs)
  const viewerTargetPreviewGeometryResult = useSpaghettiStore(
    selectViewerTargetGraphAcceptedPreviewGeometryResult,
  )
  const viewerTargetCommittedPreviewGeometryResult = useSpaghettiStore(
    selectViewerTargetGraphCommittedDraftGeometryResult,
  )
  const activePlanePickNode = useSpaghettiStore((state) => {
    const nodeId = state.sketchPlanePickSession?.nodeId
    if (nodeId === undefined) {
      return null
    }
    return state.graph.nodes.find(
      (node) => node.nodeId === nodeId && node.type === 'Geometry/Sketch',
    ) ?? null
  })
  const activeGeometrySketchNode = useSpaghettiStore((state) => {
    const nodeId = state.geometrySketchSession?.nodeId
    if (nodeId === undefined) {
      return null
    }
    return state.graph.nodes.find(
      (node) => node.nodeId === nodeId && node.type === 'Geometry/Sketch',
    ) ?? null
  })
  const runSketchPlaneCommand = useSpaghettiStore((state) => state.runSketchPlaneCommand)
  const reopenSketchPlanePickPlaneSelection = useSpaghettiStore(
    (state) => state.reopenSketchPlanePickPlaneSelection,
  )
  const resetSketchPlanePickDraftTransform = useSpaghettiStore(
    (state) => state.resetSketchPlanePickDraftTransform,
  )
  const setSketchPlanePickTranslationAxis = useSpaghettiStore(
    (state) => state.setSketchPlanePickTranslationAxis,
  )
  const setSketchPlanePickRotationAxis = useSpaghettiStore(
    (state) => state.setSketchPlanePickRotationAxis,
  )
  const toggleSketchPlaneTransformHistoryLock = useSpaghettiStore(
    (state) => state.toggleSketchPlaneTransformHistoryLock,
  )
  const mergeSketchPlaneTransformHistory = useSpaghettiStore(
    (state) => state.mergeSketchPlaneTransformHistory,
  )
  const updateGeometrySketchComponentPoint = useSpaghettiStore(
    (state) => state.updateGeometrySketchComponentPoint,
  )
  const setGeometrySketchComponentName = useSpaghettiStore(
    (state) => state.setGeometrySketchComponentName,
  )
  const setGeometrySketchDrawGroupName = useSpaghettiStore(
    (state) => state.setGeometrySketchDrawGroupName,
  )
  const setGeometrySketchSelectedComponents = useSpaghettiStore(
    (state) => state.setGeometrySketchSelectedComponents,
  )
  const deleteGeometrySketchSelectedComponents = useSpaghettiStore(
    (state) => state.deleteGeometrySketchSelectedComponents,
  )
  const closeGeometrySketchSession = useSpaghettiStore((state) => state.closeGeometrySketchSession)
  const runGeometrySketchDrawCommand = useSpaghettiStore(
    (state) => state.runGeometrySketchDrawCommand,
  )
  const setGeometrySketchSelectedProfile = useSpaghettiStore(
    (state) => state.setGeometrySketchSelectedProfile,
  )
  const beginGraphParameterInteraction = () => {
    if (activeGraphDocumentId === null) {
      return
    }
    beginInteraction()
    beginBrowserBuildInteraction(activeGraphDocumentId)
  }
  const endGraphParameterInteraction = () => {
    if (activeGraphDocumentId === null) {
      return
    }
    endInteraction()
    endBrowserBuildInteraction(activeGraphDocumentId)
  }
  const localViewState = useWorkspaceStore(
    (state) =>
      (viewportId !== undefined ? state.viewportChromeById[viewportId]?.localViewState : null) ?? null,
  )
  const setViewportLocalViewState = useWorkspaceStore((state) => state.setViewportLocalViewState)
  const axisOverlayEnabled = localViewState?.axisOverlayEnabled ?? false
  const viewToolbarOpen = localViewState?.viewToolbarOpen ?? false
  const expandedAxisWidgetSize = localViewState?.viewToolbarExpandedAxisWidgetSize ?? null
  const viewportResultMode = localViewState?.viewportResultMode ?? 'auto'
  const sketchPlaneToolbarGhostPlaneScale = useUiPrefsStore(
    (state) => state.sketchPlaneToolbarGhostPlaneScale,
  )
  const sketchPlaneToolbarGizmoScale = useUiPrefsStore(
    (state) => state.sketchPlaneToolbarGizmoScale,
  )
  const sketchPlaneToolbarTranslateSnapEnabled = useUiPrefsStore(
    (state) => state.sketchPlaneToolbarTranslateSnapEnabled,
  )
  const sketchPlaneToolbarTranslateSnapValue = useUiPrefsStore(
    (state) => state.sketchPlaneToolbarTranslateSnapValue,
  )
  const sketchPlaneToolbarRotateSnapEnabled = useUiPrefsStore(
    (state) => state.sketchPlaneToolbarRotateSnapEnabled,
  )
  const sketchPlaneToolbarRotateSnapValue = useUiPrefsStore(
    (state) => state.sketchPlaneToolbarRotateSnapValue,
  )
  const setSketchPlaneToolbarGhostPlaneScale = useUiPrefsStore(
    (state) => state.setSketchPlaneToolbarGhostPlaneScale,
  )
  const setSketchPlaneToolbarGizmoScale = useUiPrefsStore(
    (state) => state.setSketchPlaneToolbarGizmoScale,
  )
  const setSketchPlaneToolbarTranslateSnapEnabled = useUiPrefsStore(
    (state) => state.setSketchPlaneToolbarTranslateSnapEnabled,
  )
  const setSketchPlaneToolbarTranslateSnapValue = useUiPrefsStore(
    (state) => state.setSketchPlaneToolbarTranslateSnapValue,
  )
  const setSketchPlaneToolbarRotateSnapEnabled = useUiPrefsStore(
    (state) => state.setSketchPlaneToolbarRotateSnapEnabled,
  )
  const setSketchPlaneToolbarRotateSnapValue = useUiPrefsStore(
    (state) => state.setSketchPlaneToolbarRotateSnapValue,
  )
  const sketchDrawSnapEnabled = useUiPrefsStore((state) => state.sketchDrawSnapEnabled)
  const sketchDrawSnapDistancePx = useUiPrefsStore((state) => state.sketchDrawSnapDistancePx)
  const sketchDrawCrosshairSize = useUiPrefsStore((state) => state.sketchDrawCrosshairSize)
  const sketchDrawStartPointVisible = useUiPrefsStore(
    (state) => state.sketchDrawStartPointVisible,
  )
  const sketchDrawStartPointSymbolSize = useUiPrefsStore(
    (state) => state.sketchDrawStartPointSymbolSize,
  )
  const sketchDrawStartPointSymbolType = useUiPrefsStore(
    (state) => state.sketchDrawStartPointSymbolType,
  )
  const sketchDrawPlinePointVisible = useUiPrefsStore(
    (state) => state.sketchDrawPlinePointVisible,
  )
  const sketchDrawPlinePointSymbolSize = useUiPrefsStore(
    (state) => state.sketchDrawPlinePointSymbolSize,
  )
  const sketchDrawPlinePointSymbolType = useUiPrefsStore(
    (state) => state.sketchDrawPlinePointSymbolType,
  )
  const setSketchDrawSnapEnabled = useUiPrefsStore((state) => state.setSketchDrawSnapEnabled)
  const setSketchDrawSnapDistancePx = useUiPrefsStore(
    (state) => state.setSketchDrawSnapDistancePx,
  )
  const setSketchDrawCrosshairSize = useUiPrefsStore((state) => state.setSketchDrawCrosshairSize)
  const setSketchDrawStartPointVisible = useUiPrefsStore(
    (state) => state.setSketchDrawStartPointVisible,
  )
  const setSketchDrawStartPointSymbolSize = useUiPrefsStore(
    (state) => state.setSketchDrawStartPointSymbolSize,
  )
  const setSketchDrawStartPointSymbolType = useUiPrefsStore(
    (state) => state.setSketchDrawStartPointSymbolType,
  )
  const setSketchDrawPlinePointVisible = useUiPrefsStore(
    (state) => state.setSketchDrawPlinePointVisible,
  )
  const setSketchDrawPlinePointSymbolSize = useUiPrefsStore(
    (state) => state.setSketchDrawPlinePointSymbolSize,
  )
  const setSketchDrawPlinePointSymbolType = useUiPrefsStore(
    (state) => state.setSketchDrawPlinePointSymbolType,
  )
  const [axisWidgetSize, setAxisWidgetSize] = useState<number>(COMPACT_AXIS_WIDGET_SIZE)
  const [sketchPlaneToolPanelPosition, setSketchPlaneToolPanelPosition] = useState<OverlayPosition>(
    {
      left: defaultOverlayPosition.left,
      top: 84,
    },
  )
  const [sketchPlaneToolPanelSize, setSketchPlaneToolPanelSize] = useState<OverlaySize | null>(
    null,
  )
  const [sketchPlaneToolPanelHeightMode, setSketchPlaneToolPanelHeightMode] = useState<
    'auto' | 'manual'
  >('auto')
  const [sketchPlaneToolPanelDensity, setSketchPlaneToolPanelDensity] =
    useState<OverlayToolDensity>('expanded')
  const [sketchPlaneToolBackgroundOpacity, setSketchPlaneToolBackgroundOpacity] = useState(
    DEFAULT_OVERLAY_TOOL_BACKGROUND_OPACITY,
  )
  const [sketchPlaneToolTextOpacity, setSketchPlaneToolTextOpacity] = useState(
    DEFAULT_OVERLAY_TOOL_TEXT_OPACITY,
  )
  const [sketchPlaneToolFontSize, setSketchPlaneToolFontSize] = useState(
    DEFAULT_OVERLAY_TOOL_FONT_SIZE,
  )
  const [sketchPlaneToolZIndex, setSketchPlaneToolZIndex] = useState(
    DEFAULT_OVERLAY_TOOL_Z_INDEX,
  )
  const [sketchPlaneToolFillMode, setSketchPlaneToolFillMode] =
    useState<ConsoleBackgroundFillMode>(DEFAULT_OVERLAY_TOOL_FILL_MODE)
  const [sketchPlaneToolColorMode, setSketchPlaneToolColorMode] =
    useState<ConsoleBackgroundColorMode>(DEFAULT_OVERLAY_TOOL_COLOR_MODE)
  const [sketchPlanePlaneSelectionExpanded, setSketchPlanePlaneSelectionExpanded] = useState(true)
  const [sketchPlaneTransformExpanded, setSketchPlaneTransformExpanded] = useState(true)
  const [sketchPlaneMoveExpanded, setSketchPlaneMoveExpanded] = useState(true)
  const [sketchPlaneRotateExpanded, setSketchPlaneRotateExpanded] = useState(true)
  const [sketchPlaneTransformHistoryExpanded, setSketchPlaneTransformHistoryExpanded] =
    useState(true)
  const [sketchPlaneToolbarWindowExpanded, setSketchPlaneToolbarWindowExpanded] = useState(true)
  const [sketchPlaneToolbarSketchUiExpanded, setSketchPlaneToolbarSketchUiExpanded] =
    useState(true)
  const [sketchSessionWindowPosition, setSketchSessionWindowPosition] =
    useState<OverlayPosition>({
      left: defaultOverlayPosition.left,
      top: defaultOverlayPosition.top + 120,
    })
  const [sketchSessionWindowSize, setSketchSessionWindowSize] =
    useState<OverlaySize | null>(null)
  const [sketchSessionWindowHeightMode, setSketchSessionWindowHeightMode] = useState<
    'auto' | 'manual'
  >('auto')
  const [sketchSessionToolPanelDensity, setSketchSessionToolPanelDensity] =
    useState<OverlayToolDensity>('expanded')
  const [sketchSessionSectionStackResetNonce, setSketchSessionSectionStackResetNonce] =
    useState(0)
  const [sketchSessionTitleBarContextMenu, setSketchSessionTitleBarContextMenu] = useState<{
    x: number
    y: number
  } | null>(null)
  const [sketchSessionIMenuOpen, setSketchSessionIMenuOpen] = useState(false)
  const [sketchSessionIMenuExpanded, setSketchSessionIMenuExpanded] = useState(true)
  const [sketchSessionToolbarWindowExpanded, setSketchSessionToolbarWindowExpanded] =
    useState(true)
  const [sketchSessionSketchDrawSettingsExpanded, setSketchSessionSketchDrawSettingsExpanded] =
    useState(true)
  const [sketchSessionSnapExpanded, setSketchSessionSnapExpanded] = useState(true)
  const [sketchSessionToolSelectionExpanded, setSketchSessionToolSelectionExpanded] =
    useState(true)
  const [sketchSessionActiveToolExpanded, setSketchSessionActiveToolExpanded] =
    useState(true)
  const [sketchSessionEntitiesExpanded, setSketchSessionEntitiesExpanded] =
    useState(true)
  const [sketchSessionEntityGroupsExpanded, setSketchSessionEntityGroupsExpanded] = useState<
    Record<string, boolean>
  >({})
  const [sketchSessionEntityLineRowsExpanded, setSketchSessionEntityLineRowsExpanded] = useState<
    Record<string, boolean>
  >({})
  const [sketchSessionEntryRenameDrafts, setSketchSessionEntryRenameDrafts] = useState<
    Record<string, string>
  >({})
  const [sketchSessionClampEditing, setSketchSessionClampEditing] = useState(false)
  const [sketchSessionSliderClampRanges, setSketchSessionSliderClampRanges] = useState<
    Record<string, SliderClampRange>
  >({})
  const [sketchSessionProfilesExpanded, setSketchSessionProfilesExpanded] =
    useState(true)
  const [sketchSessionSessionExpanded, setSketchSessionSessionExpanded] =
    useState(true)
  const viewportResultModeBehavior = useMemo(
    () => resolveWorkspaceViewportResultModeBehavior(viewportResultMode),
    [viewportResultMode],
  )
  const renderedProjectPartSet = useMemo(
    () =>
      selectRenderedProjectPartSet({
        currentProject,
        projectContent,
        graphRuntimeByDocumentId,
        graphDocumentsById,
        browserGraphBuildPolicyByGraphDocumentId,
        browserContentBuildPolicyByRowId,
        partsVisibility,
        graphDocumentIds: sharedViewerComposition?.graphDocumentIds,
      }),
    [
      browserContentBuildPolicyByRowId,
      browserGraphBuildPolicyByGraphDocumentId,
      currentProject,
      graphDocumentsById,
      graphRuntimeByDocumentId,
      partsVisibility,
      projectContent,
      sharedViewerComposition,
    ],
  )
  const viewportResultState = useMemo(
    () =>
      selectViewportResultState(
        buildViewportResultSelectorOptions({
          currentProject,
          projectContent,
          browserGraphBuildPolicyByGraphDocumentId,
          browserContentBuildPolicyByRowId,
          browserInteractionGraphDocumentIds,
          isInteracting,
          delayedDraftBuildByGraphDocumentId,
          delayedAuthoritativeBuildByGraphDocumentId,
          requestedMode: viewportResultMode,
          modeBehavior: viewportResultModeBehavior,
          renderedProjectPartSet,
          graphDocumentsById,
          viewerTargetGraphDocumentId,
          sharedViewerComposition,
          sketchPlanePickSession,
          acceptedAuthoritativeGeometryResult: viewerTargetGeometryResult,
          previewReadyAuthoritativeGeometryResult:
            viewerTargetPreviewReadyAuthoritativeGeometryResult,
          acceptedDraftGeometryResult: viewerTargetPreviewGeometryResult,
          committedAuthoritativeGeometryResult: viewerTargetCommittedGeometryResult,
          committedDraftGeometryResult: viewerTargetCommittedPreviewGeometryResult,
          acceptedPreviewBuildBundle: viewerTargetBuildBundle,
          acceptedPreviewBuildOutputs: viewerTargetBuildOutputs,
          previewPreparation: viewerTargetPreviewPreparation,
        }),
      ),
    [
      browserInteractionGraphDocumentIds,
      browserContentBuildPolicyByRowId,
      browserGraphBuildPolicyByGraphDocumentId,
      currentProject,
      isInteracting,
      delayedAuthoritativeBuildByGraphDocumentId,
      delayedDraftBuildByGraphDocumentId,
      graphDocumentsById,
      projectContent,
      renderedProjectPartSet,
      sharedViewerComposition,
      sketchPlanePickSession,
      viewerTargetBuildOutputs,
      viewerTargetCommittedGeometryResult,
      viewerTargetCommittedPreviewGeometryResult,
      viewerTargetGeometryResult,
      viewerTargetGraphDocumentId,
      viewerTargetBuildBundle,
      viewerTargetPreviewReadyAuthoritativeGeometryResult,
      viewerTargetPreviewGeometryResult,
      viewerTargetPreviewPreparation,
      viewportResultMode,
      viewportResultModeBehavior,
    ],
  )
  const viewportResultStatus = useMemo(
    () => selectViewportResultStatus(viewportResultState),
    [viewportResultState],
  )
  const resizeStateRef = useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    startSize: 0,
  })
  const sketchSessionWindowDragStateRef = useRef({
    active: false,
    pointerId: null as number | null,
    startX: 0,
    startY: 0,
    startLeft: defaultOverlayPosition.left,
    startTop: defaultOverlayPosition.top + 120,
  })
  const sketchSessionWindowResizeStateRef = useRef<{
    active: boolean
    pointerId: number
    direction: ResizeDirection
    startX: number
    startY: number
    startLeft: number
    startTop: number
    startWidth: number
    startHeight: number
  } | null>(null)
  const sketchPlaneToolPanelDragStateRef = useRef({
    active: false,
    pointerId: null as number | null,
    startX: 0,
    startY: 0,
    startLeft: defaultOverlayPosition.left,
    startTop: 84,
  })
  const sketchPlaneToolPanelResizeStateRef = useRef<{
    active: boolean
    pointerId: number
    direction: ViewportOverlayToolPanelResizeDirection
    startX: number
    startY: number
    startLeft: number
    startTop: number
    startWidth: number
    startHeight: number
  } | null>(null)
  const sketchPlaneLiveTransformActivationKeyRef = useRef<string | null>(null)

  const resolvedAxisWidgetSize = viewToolbarOpen
    ? expandedAxisWidgetSize ?? DEFAULT_EXPANDED_AXIS_WIDGET_SIZE
    : COMPACT_AXIS_WIDGET_SIZE

  const pickStageLabel = useMemo(() => {
    if (sketchPlanePickSession === null) {
      return ''
    }
    return sketchPlanePickSession.stage === 'pick' ? 'Pick Origin Plane' : 'Adjust Sketch Plane'
  }, [sketchPlanePickSession])
  const pickStageActionLabel = useMemo(() => {
    if (sketchPlanePickSession === null) {
      return ''
    }
    if (sketchPlanePickSession.stage === 'pick') {
      return 'Selecting Plane'
    }
    return 'Reselect Plane'
  }, [sketchPlanePickSession])

  const activePickPlane = sketchPlanePickSession?.draftPlane ?? 'XY'
  const activePickTransform = sketchPlanePickSession?.draftTransform ?? null
  const sketchPlaneTransformHistoryEntries = sketchPlanePickSession?.transformHistory ?? []
  const activeSketchPlaneTransformAxis = sketchPlanePickSession?.activeTransformAxis ?? null
  const moveSnapScopeActive = sketchPlanePickSession?.adjustScope === 'move-snap'
  const rotateSnapScopeActive = sketchPlanePickSession?.adjustScope === 'rotate-snap'
  const moveRowsHighlighted =
    sketchPlanePickSession?.adjustScope === 'move' &&
    (activeSketchPlaneTransformAxis === 'free' || activeSketchPlaneTransformAxis === null)
  const rotateRowsHighlighted =
    sketchPlanePickSession?.adjustScope === 'rotate' &&
    (activeSketchPlaneTransformAxis === 'free' || activeSketchPlaneTransformAxis === null)
  const moveAxisHighlighted =
    (sketchPlanePickSession?.adjustScope === 'move' ||
      sketchPlanePickSession?.adjustScope === 'move-axis') &&
    activeSketchPlaneTransformAxis !== 'free'
      ? activeSketchPlaneTransformAxis
      : null
  const rotateAxisHighlighted =
    sketchPlanePickSession?.adjustScope === 'rotate' &&
    activeSketchPlaneTransformAxis !== 'free'
      ? activeSketchPlaneTransformAxis
      : null
  const sketchPlaneAccent = getTypeColor('plane')
  const sketchSessionAccent = getTypeColor('sketchEntities')
  const sketchPlaneToolPreset = useMemo(
    () =>
      getOverlayToolPreset({
        backgroundOpacity: sketchPlaneToolBackgroundOpacity,
        textOpacity: sketchPlaneToolTextOpacity,
        fontSize: sketchPlaneToolFontSize,
        zIndex: sketchPlaneToolZIndex,
        fillMode: sketchPlaneToolFillMode,
        colorMode: sketchPlaneToolColorMode,
      }),
    [
      sketchPlaneToolBackgroundOpacity,
      sketchPlaneToolColorMode,
      sketchPlaneToolFillMode,
      sketchPlaneToolFontSize,
      sketchPlaneToolTextOpacity,
      sketchPlaneToolZIndex,
    ],
  )
  const sketchPlanePlaneOptions = useMemo(
    () =>
      ([
        { value: 'XY', label: 'XY' },
        { value: 'XZ', label: 'XZ' },
        { value: 'YZ', label: 'YZ' },
      ] as const),
    [],
  )
  const sketchPlaneTransformHistoryRows = useMemo<SketchPlaneTransformHistoryRowVm[]>(
    () => {
      let previousPoint = { x: 0, y: 0, z: 0 }
      return sketchPlaneTransformHistoryEntries.map((entry) => {
        const diff = {
          x: entry.point.x - previousPoint.x,
          y: entry.point.y - previousPoint.y,
          z: entry.point.z - previousPoint.z,
        }
        previousPoint = entry.point
        return {
          entryId: entry.entryId,
          label: `Vec(${formatSketchPlaneHistorySignedValue(diff.x)}, ${formatSketchPlaneHistorySignedValue(diff.y)}, ${formatSketchPlaneHistorySignedValue(diff.z)})`,
          locked: entry.locked,
        }
      })
    },
    [sketchPlaneTransformHistoryEntries],
  )
  const canMergeSketchPlaneTransformHistory = useMemo(() => {
    if (sketchPlaneTransformHistoryEntries.length <= 1) {
      return false
    }
    const lastIndex = sketchPlaneTransformHistoryEntries.length - 1
    return sketchPlaneTransformHistoryEntries.some(
      (entry, index) => index !== lastIndex && !entry.locked,
    )
  }, [sketchPlaneTransformHistoryEntries])
  const sketchPlaneToolDensityButtonLabel =
    sketchPlaneToolPanelDensity === 'collapsed'
      ? '-'
      : sketchPlaneToolPanelDensity === 'essentials'
        ? 'e'
        : '+'
  const sketchPlaneToolDensityButtonTitle =
    sketchPlaneToolPanelDensity === 'collapsed'
      ? 'Toolbar mode: Collapsed. Click to switch to Essentials.'
      : sketchPlaneToolPanelDensity === 'essentials'
        ? 'Toolbar mode: Essentials. Click to switch to Expanded.'
        : 'Toolbar mode: Expanded. Click to switch to Collapsed.'
  const sketchSessionToolDensityButtonLabel =
    sketchSessionToolPanelDensity === 'collapsed'
      ? '-'
      : sketchSessionToolPanelDensity === 'essentials'
        ? 'e'
        : '+'
  const sketchSessionToolDensityButtonTitle =
    sketchSessionToolPanelDensity === 'collapsed'
      ? 'Toolbar mode: Collapsed. Click to switch to Essentials.'
      : sketchSessionToolPanelDensity === 'essentials'
        ? 'Toolbar mode: Essentials. Click to switch to Expanded.'
        : 'Toolbar mode: Expanded. Click to switch to Collapsed.'

  const getOverlayHostMetrics = () => {
    const overlayRoot = overlayRootRef.current
    const overlayRect = overlayRoot?.getBoundingClientRect()
    const width = overlayRoot?.clientWidth ?? 0
    const height = overlayRoot?.clientHeight ?? 0
    return {
      left: overlayRect?.left ?? 0,
      top: overlayRect?.top ?? 0,
      width: width > 0 ? width : window.innerWidth,
      height: height > 0 ? height : window.innerHeight,
    }
  }

  const getSketchOverlaySpawnPosition = (
    preferredWidth: number,
    preferredHeight: number,
  ): OverlayPosition => {
    const browserPanel = document.querySelector<HTMLElement>(
      '.PrimaryViewportLeftDock .PrimaryViewportLeftDockPanelTarget--browser',
    )
    const leftDock = document.querySelector<HTMLElement>('.PrimaryViewportLeftDock')
    const anchor = browserPanel ?? leftDock
    const overlayHost = getOverlayHostMetrics()
    if (anchor === null) {
      return clampOverlayPosition(
        defaultOverlayPosition,
        preferredWidth,
        preferredHeight,
        overlayHost.width,
        overlayHost.height,
      )
    }

    const rect = anchor.getBoundingClientRect()
    return clampOverlayPosition(
      {
        left: Math.max(24, Math.round(rect.right - overlayHost.left + 16)),
        top: Math.max(24, Math.round(rect.top - overlayHost.top + 16)),
      },
      preferredWidth,
      preferredHeight,
      overlayHost.width,
      overlayHost.height,
    )
  }

  const getSketchPlaneToolPanelSpawnPosition = (
    preferredWidth: number,
    preferredHeight: number,
  ): OverlayPosition => {
    const overlayHost = getOverlayHostMetrics()
    return clampOverlayPosition(
      {
        left: Math.max(18, Math.round(overlayHost.width - preferredWidth - 18)),
        top: 84,
      },
      preferredWidth,
      preferredHeight,
      overlayHost.width,
      overlayHost.height,
    )
  }

  const resetSketchPlaneToolPanelToAutoHeight = () => {
    setSketchPlaneToolPanelHeightMode('auto')
  }

  const resetSketchSessionWindowToAutoHeight = () => {
    setSketchSessionWindowHeightMode('auto')
    setSketchSessionSectionStackResetNonce((current) => current + 1)
  }

  const setSketchPlaneToolPanelSizeAxis = (axis: 'width' | 'height', nextValue: number) => {
    const overlayHost = getOverlayHostMetrics()
    const currentWidth =
      sketchPlaneToolPanelSize?.width ??
      sketchPlaneToolPanelRef.current?.offsetWidth ??
      DEFAULT_OVERLAY_TOOL_PANEL_SIZE.width
    const currentHeight =
      sketchPlaneToolPanelSize?.height ??
      sketchPlaneToolPanelRef.current?.offsetHeight ??
      DEFAULT_OVERLAY_TOOL_PANEL_SIZE.height
    const maxWidth = Math.max(
      MIN_OVERLAY_TOOL_PANEL_WIDTH,
      overlayHost.width - SKETCH_SESSION_WINDOW_VIEWPORT_MARGIN * 2,
    )
    const maxHeight = Math.max(
      MIN_OVERLAY_TOOL_PANEL_HEIGHT,
      overlayHost.height - SKETCH_SESSION_WINDOW_VIEWPORT_MARGIN * 2,
    )
    const resolvedWidth = Math.round(
      Math.min(
        Math.max(axis === 'width' ? nextValue : currentWidth, MIN_OVERLAY_TOOL_PANEL_WIDTH),
        maxWidth,
      ),
    )
    const resolvedHeight = Math.round(
      Math.min(
        Math.max(axis === 'height' ? nextValue : currentHeight, MIN_OVERLAY_TOOL_PANEL_HEIGHT),
        maxHeight,
      ),
    )

    setSketchPlaneToolPanelPosition((currentPosition) =>
      clampOverlayPosition(
        currentPosition,
        resolvedWidth,
        resolvedHeight,
        overlayHost.width,
        overlayHost.height,
      ),
    )
    setSketchPlaneToolPanelSize({
      width: resolvedWidth,
      height: resolvedHeight,
    })
    if (axis === 'height') {
      setSketchPlaneToolPanelHeightMode('manual')
    }
  }

  const applySketchPlaneToolPreset = (preset: Exclude<ConsoleToolsPreset, 'custom'>) => {
    if (preset === 'default') {
      setSketchPlaneToolBackgroundOpacity(DEFAULT_OVERLAY_TOOL_BACKGROUND_OPACITY)
      setSketchPlaneToolTextOpacity(DEFAULT_OVERLAY_TOOL_TEXT_OPACITY)
      setSketchPlaneToolFontSize(DEFAULT_OVERLAY_TOOL_FONT_SIZE)
      setSketchPlaneToolZIndex(DEFAULT_OVERLAY_TOOL_Z_INDEX)
      setSketchPlaneToolFillMode(DEFAULT_OVERLAY_TOOL_FILL_MODE)
      setSketchPlaneToolColorMode(DEFAULT_OVERLAY_TOOL_COLOR_MODE)
      return
    }
    setSketchPlaneToolBackgroundOpacity(CLEAR_OVERLAY_TOOL_BACKGROUND_OPACITY)
    setSketchPlaneToolTextOpacity(DEFAULT_OVERLAY_TOOL_TEXT_OPACITY)
    setSketchPlaneToolFontSize(DEFAULT_OVERLAY_TOOL_FONT_SIZE)
    setSketchPlaneToolZIndex(DEFAULT_OVERLAY_TOOL_Z_INDEX)
    setSketchPlaneToolFillMode(CLEAR_OVERLAY_TOOL_FILL_MODE)
    setSketchPlaneToolColorMode(DEFAULT_OVERLAY_TOOL_COLOR_MODE)
  }

  const startResize = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (!viewToolbarOpen) {
      return
    }
    const host = axisWidgetRef.current
    if (host === null) {
      return
    }

    const currentSize = axisWidgetSize || host.clientWidth
    if (currentSize <= 0) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    resizeStateRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startSize: currentSize,
    }

    const move = (moveEvent: PointerEvent): void => {
      const state = resizeStateRef.current
      if (!state.active || moveEvent.pointerId !== state.pointerId) {
        return
      }

      const deltaX = -(moveEvent.clientX - state.startX)
      const deltaY = moveEvent.clientY - state.startY
      const delta = Math.max(deltaX, deltaY)
      const next = Math.round(state.startSize + delta)
      const clamped = Math.min(Math.max(next, MIN_AXIS_WIDGET_SIZE), MAX_AXIS_WIDGET_SIZE)
      if (viewportId !== undefined) {
        setViewportLocalViewState(viewportId, {
          viewToolbarExpandedAxisWidgetSize: clamped,
        })
      }
    }

    const stop = (stopEvent: PointerEvent): void => {
      const state = resizeStateRef.current
      if (stopEvent.pointerId !== state.pointerId) {
        return
      }
      resizeStateRef.current = {
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
    let attachedViewer: ViewerApi | null = null
    const canvas = axisOverlayEnabled ? canvasRef.current : null

    const attach = (viewer: ViewerApi | null): void => {
      if (attachedViewer !== viewer) {
        attachedViewer?.setAxisOverlayCanvas(null)
        attachedViewer = viewer
      }

      if (attachedViewer === null) {
        return
      }

      attachedViewer.setAxisOverlayCanvas(canvas)
    }

    attach(getViewer(viewportId))
    const unsubscribe = subscribeViewer((viewer) => {
      attach(viewer)
    }, viewportId)

    return () => {
      attachedViewer?.setAxisOverlayCanvas(null)
      unsubscribe()
    }
  }, [axisOverlayEnabled, viewportId])

  useEffect(() => {
    const syncFlyMoveSpeed = (viewer: ViewerApi | null): void => {
      if (
        viewer === null ||
        typeof viewer.getFlyMoveSpeed !== 'function' ||
        typeof viewer.setFlyMoveSpeed !== 'function'
      ) {
        setFlyMoveSpeed(null)
        return
      }
      setFlyMoveSpeed(viewer.getFlyMoveSpeed())
    }

    let attachedViewer: ViewerApi | null = null
    const attach = (viewer: ViewerApi | null): void => {
      attachedViewer?.setOnFlyMoveSpeedChange?.(null)
      attachedViewer = viewer
      syncFlyMoveSpeed(viewer)
      viewer?.setOnFlyMoveSpeedChange?.((speed) => {
        setFlyMoveSpeed(speed)
      })
    }

    attach(getViewer(viewportId))
    const unsubscribe = subscribeViewer((viewer) => {
      attach(viewer)
    }, viewportId)

    return () => {
      attachedViewer?.setOnFlyMoveSpeedChange?.(null)
      unsubscribe()
    }
  }, [viewportId])

  useEffect(() => {
    setAxisWidgetSize(resolvedAxisWidgetSize)
  }, [resolvedAxisWidgetSize])

  useEffect(() => {
    if (activePlanePickNode === null) {
      return
    }
    const hostWidth =
      sketchPlaneToolPanelSize?.width ?? sketchPlaneToolPanelRef.current?.offsetWidth ?? DEFAULT_OVERLAY_TOOL_PANEL_SIZE.width
    const hostHeight =
      sketchPlaneToolPanelSize?.height ??
      sketchPlaneToolPanelRef.current?.offsetHeight ??
      DEFAULT_OVERLAY_TOOL_PANEL_SIZE.height
    setSketchPlaneToolPanelPosition(
      getSketchPlaneToolPanelSpawnPosition(hostWidth, hostHeight),
    )
    setSketchPlaneToolPanelSize(null)
    setSketchPlaneToolPanelHeightMode('auto')
    setSketchPlaneToolPanelDensity('expanded')
    setSketchPlanePlaneSelectionExpanded(true)
    setSketchPlaneTransformExpanded(true)
    setSketchPlaneMoveExpanded(true)
    setSketchPlaneRotateExpanded(true)
    setSketchPlaneTransformHistoryExpanded(true)
    setSketchPlaneToolbarWindowExpanded(true)
    setSketchPlaneToolbarSketchUiExpanded(true)
    setSketchPlaneToolbarTranslateSnapEnabled(false)
    setSketchPlaneToolbarTranslateSnapValue(10)
    setSketchPlaneToolbarRotateSnapEnabled(false)
    setSketchPlaneToolbarRotateSnapValue(15)
  }, [activePlanePickNode?.nodeId])

  useEffect(() => {
    if (activeGeometrySketchNode === null) {
      return
    }
    const overlayHost = getOverlayHostMetrics()
    const spawn = getSketchOverlaySpawnPosition(
      DEFAULT_SKETCH_SESSION_WINDOW_SIZE.width,
      DEFAULT_SKETCH_SESSION_WINDOW_SIZE.height,
    )
    setSketchSessionWindowPosition(
      clampOverlayPosition(
        {
          left: spawn.left,
          top: spawn.top + 112,
        },
        DEFAULT_SKETCH_SESSION_WINDOW_SIZE.width,
        DEFAULT_SKETCH_SESSION_WINDOW_SIZE.height,
        overlayHost.width,
        overlayHost.height,
      ),
    )
    setSketchSessionWindowSize(null)
    setSketchSessionWindowHeightMode('auto')
    setSketchSessionIMenuOpen(false)
    setSketchSessionIMenuExpanded(true)
    setSketchSessionSnapExpanded(true)
    setSketchSessionSectionStackResetNonce((current) => current + 1)
  }, [activeGeometrySketchNode?.nodeId])

  useEffect(() => {
    const stopActiveSketchPlaneTransformInteraction = () => {
      if (sketchPlaneLiveTransformActivationKeyRef.current === null) {
        return
      }
      sketchPlaneLiveTransformActivationKeyRef.current = null
      const viewer = getViewer()
      if (viewer === null) {
        return
      }
      viewer.completeReferenceTransformDrag()
      viewer.clearReferenceTransformHandle()
    }

    if (sketchPlanePickSession?.stage !== 'adjust') {
      stopActiveSketchPlaneTransformInteraction()
      return
    }
    if (
      sketchPlanePickSession.adjustScope === 'move' ||
      sketchPlanePickSession.adjustScope === 'move-axis'
    ) {
      setSketchPlaneMoveExpanded(true)
    }
    if (sketchPlanePickSession.adjustScope === 'rotate') {
      setSketchPlaneRotateExpanded(true)
    }
    if (
      sketchPlanePickSession.adjustScope === 'root' ||
      (sketchPlanePickSession.adjustScope !== 'move' &&
        sketchPlanePickSession.adjustScope !== 'move-axis' &&
        sketchPlanePickSession.adjustScope !== 'rotate')
    ) {
      stopActiveSketchPlaneTransformInteraction()
      return
    }

    const activationKey = `${sketchPlanePickSession.adjustScope}:${
      activeSketchPlaneTransformAxis ?? 'none'
    }:${sketchPlanePickSession.liveTransformActivationNonce}`
    if (sketchPlaneLiveTransformActivationKeyRef.current === activationKey) {
      return
    }
    sketchPlaneLiveTransformActivationKeyRef.current = activationKey

    const frame = window.requestAnimationFrame(() => {
      const viewer = getViewer()
      if (viewer === null) {
        return
      }
      if (
        sketchPlanePickSession.adjustScope === 'move' ||
        sketchPlanePickSession.adjustScope === 'move-axis'
      ) {
        if (activeSketchPlaneTransformAxis === 'x') {
          viewer.activateTranslateHandle('X')
          return
        }
        if (activeSketchPlaneTransformAxis === 'y') {
          viewer.activateTranslateHandle('Y')
          return
        }
        if (activeSketchPlaneTransformAxis === 'z') {
          viewer.activateTranslateHandle('Z')
          return
        }
        viewer.activateTranslateCenterHandle()
        return
      }
      if (activeSketchPlaneTransformAxis === 'x') {
        viewer.activateRotateHandle('X')
        return
      }
      if (activeSketchPlaneTransformAxis === 'y') {
        viewer.activateRotateHandle('Y')
        return
      }
      if (activeSketchPlaneTransformAxis === 'z') {
        viewer.activateRotateHandle('Z')
        return
      }
      viewer.activateRotateCenterHandle()
    })

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [
    activeSketchPlaneTransformAxis,
    sketchPlanePickSession?.liveTransformActivationNonce,
    sketchPlanePickSession?.adjustScope,
    sketchPlanePickSession?.stage,
  ])

  useEffect(() => {
    if (
      activePlanePickNode === null ||
      sketchPlaneToolPanelHeightMode !== 'auto' ||
      typeof ResizeObserver === 'undefined'
    ) {
      return
    }
    const host = sketchPlaneToolPanelRef.current
    if (host === null) {
      return
    }

    let frameId = 0
    const syncPositionToAutoHeight = () => {
      window.cancelAnimationFrame(frameId)
      frameId = window.requestAnimationFrame(() => {
        const width = host.offsetWidth || DEFAULT_OVERLAY_TOOL_PANEL_SIZE.width
        const height = host.offsetHeight || DEFAULT_OVERLAY_TOOL_PANEL_SIZE.height
        const overlayHost = getOverlayHostMetrics()
        setSketchPlaneToolPanelPosition((currentPosition) =>
          clampOverlayPosition(
            currentPosition,
            width,
            height,
            overlayHost.width,
            overlayHost.height,
          ),
        )
      })
    }

    syncPositionToAutoHeight()
    const observer = new ResizeObserver(() => {
      syncPositionToAutoHeight()
    })
    observer.observe(host)

    return () => {
      window.cancelAnimationFrame(frameId)
      observer.disconnect()
    }
  }, [activePlanePickNode, sketchPlaneToolPanelHeightMode])

  useEffect(() => {
    if (sketchPlanePickSession === null) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return
      }
      const routing = routeKeyboardInput({
        event,
        sketchPlanePickStage: sketchPlanePickSession.stage,
      })
      if (routing.owner !== 'sketch-plane' || routing.decision !== 'handle') {
        return
      }
      if (event.key === 'Escape') {
        event.preventDefault()
        runSketchPlaneCommand('esc')
        return
      }
      if (sketchPlanePickSession.stage !== 'adjust') {
        return
      }
      const key = event.key.toLowerCase()
      if (key === 'm') {
        event.preventDefault()
        if (sketchPlanePickSession.adjustScope === 'move') {
          runSketchPlaneCommand('move-again')
        } else {
          runSketchPlaneCommand('move')
        }
        setSketchPlaneMoveExpanded(true)
        setSketchPlaneRotateExpanded(false)
        return
      }
      if (key === 'r') {
        event.preventDefault()
        if (sketchPlanePickSession.gizmoMode !== 'rotate') {
          runSketchPlaneCommand('rotate')
        }
        setSketchPlaneRotateExpanded(true)
        setSketchPlaneMoveExpanded(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    runSketchPlaneCommand,
    sketchPlanePickSession,
  ])

  useEffect(() => {
    if (geometrySketchSession?.mode !== 'draw') {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return
      }
      const routing = routeKeyboardInput({
        event,
        geometrySketchMode: geometrySketchSession.mode,
      })
      if (routing.owner !== 'sketch-draw' || routing.decision !== 'handle') {
        return
      }
      if (event.key === 'Escape') {
        event.preventDefault()
        runGeometrySketchDrawCommand('esc')
        return
      }
      if (event.key === 'Enter') {
        event.preventDefault()
        runGeometrySketchDrawCommand('enter')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [geometrySketchSession, runGeometrySketchDrawCommand])

  const beginSketchSessionWindowDrag = (
    pointerId: number | null,
    clientX: number,
    clientY: number,
  ): void => {
    const host = sketchSessionWindowRef.current
    if (host === null) {
      return
    }
    if (sketchSessionWindowDragStateRef.current.active) {
      return
    }

    sketchSessionWindowDragStateRef.current = {
      active: true,
      pointerId,
      startX: clientX,
      startY: clientY,
      startLeft: sketchSessionWindowPosition.left,
      startTop: sketchSessionWindowPosition.top,
    }

    const move = (moveEvent: PointerEvent | MouseEvent): void => {
      const state = sketchSessionWindowDragStateRef.current
      if (!state.active) {
        return
      }
      if ('pointerId' in moveEvent && state.pointerId !== null && moveEvent.pointerId !== state.pointerId) {
        return
      }
      setSketchSessionWindowPosition(
        clampOverlayPosition(
          {
            left: state.startLeft + (moveEvent.clientX - state.startX),
            top: state.startTop + (moveEvent.clientY - state.startY),
          },
          host.offsetWidth || 420,
          host.offsetHeight || 360,
          getOverlayHostMetrics().width,
          getOverlayHostMetrics().height,
        ),
      )
    }

    const stop = (stopEvent: PointerEvent | MouseEvent): void => {
      const state = sketchSessionWindowDragStateRef.current
      if (!state.active) {
        return
      }
      if ('pointerId' in stopEvent && state.pointerId !== null && stopEvent.pointerId !== state.pointerId) {
        return
      }
      sketchSessionWindowDragStateRef.current = {
        ...state,
        active: false,
        pointerId: null,
      }
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', stop)
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', stop)
  }

  const beginSketchPlaneToolPanelDrag = (
    pointerId: number | null,
    clientX: number,
    clientY: number,
  ): void => {
    const host = sketchPlaneToolPanelRef.current
    if (host === null) {
      return
    }
    if (sketchPlaneToolPanelDragStateRef.current.active) {
      return
    }

    sketchPlaneToolPanelDragStateRef.current = {
      active: true,
      pointerId,
      startX: clientX,
      startY: clientY,
      startLeft: sketchPlaneToolPanelPosition.left,
      startTop: sketchPlaneToolPanelPosition.top,
    }

    const move = (moveEvent: PointerEvent | MouseEvent): void => {
      const state = sketchPlaneToolPanelDragStateRef.current
      if (!state.active) {
        return
      }
      if (
        'pointerId' in moveEvent &&
        state.pointerId !== null &&
        moveEvent.pointerId !== state.pointerId
      ) {
        return
      }
      setSketchPlaneToolPanelPosition(
        clampOverlayPosition(
          {
            left: state.startLeft + (moveEvent.clientX - state.startX),
            top: state.startTop + (moveEvent.clientY - state.startY),
          },
          host.offsetWidth || DEFAULT_OVERLAY_TOOL_PANEL_SIZE.width,
          host.offsetHeight || DEFAULT_OVERLAY_TOOL_PANEL_SIZE.height,
          getOverlayHostMetrics().width,
          getOverlayHostMetrics().height,
        ),
      )
    }

    const stop = (stopEvent: PointerEvent | MouseEvent): void => {
      const state = sketchPlaneToolPanelDragStateRef.current
      if (!state.active) {
        return
      }
      if (
        'pointerId' in stopEvent &&
        state.pointerId !== null &&
        stopEvent.pointerId !== state.pointerId
      ) {
        return
      }
      sketchPlaneToolPanelDragStateRef.current = {
        ...state,
        active: false,
        pointerId: null,
      }
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', stop)
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', stop)
  }

  const startSketchPlaneToolPanelDrag = (event: ReactPointerEvent<HTMLDivElement>): void => {
    event.preventDefault()
    event.stopPropagation()
    beginSketchPlaneToolPanelDrag(event.pointerId, event.clientX, event.clientY)
  }

  const startSketchPlaneToolPanelMouseDrag = (
    event: ReactMouseEvent<HTMLDivElement>,
  ): void => {
    if (event.button !== 0) {
      return
    }
    event.preventDefault()
    event.stopPropagation()
    beginSketchPlaneToolPanelDrag(null, event.clientX, event.clientY)
  }

  const startSketchPlaneToolPanelResize = (
    direction: ViewportOverlayToolPanelResizeDirection,
    event: ReactPointerEvent<HTMLDivElement>,
  ): void => {
    const host = sketchPlaneToolPanelRef.current
    if (host === null) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    const startWidth =
      host.offsetWidth ||
      sketchPlaneToolPanelSize?.width ||
      DEFAULT_OVERLAY_TOOL_PANEL_SIZE.width
    const startHeight =
      host.offsetHeight ||
      sketchPlaneToolPanelSize?.height ||
      DEFAULT_OVERLAY_TOOL_PANEL_SIZE.height
    sketchPlaneToolPanelResizeStateRef.current = {
      active: true,
      pointerId: event.pointerId,
      direction,
      startX: event.clientX,
      startY: event.clientY,
      startLeft: sketchPlaneToolPanelPosition.left,
      startTop: sketchPlaneToolPanelPosition.top,
      startWidth,
      startHeight,
    }

    const move = (moveEvent: PointerEvent): void => {
      const state = sketchPlaneToolPanelResizeStateRef.current
      if (state === null || !state.active || moveEvent.pointerId !== state.pointerId) {
        return
      }

      const deltaX = moveEvent.clientX - state.startX
      const deltaY = moveEvent.clientY - state.startY
      const overlayHost = getOverlayHostMetrics()
      const viewportWidth = overlayHost.width
      const viewportHeight = overlayHost.height

      let nextWidth = state.startWidth
      let nextHeight = state.startHeight
      let nextLeft = state.startLeft
      let nextTop = state.startTop

      if (state.direction.includes('e')) {
        nextWidth = state.startWidth + deltaX
      }
      if (state.direction.includes('s')) {
        nextHeight = state.startHeight + deltaY
      }
      if (state.direction.includes('w')) {
        nextWidth = state.startWidth - deltaX
        nextLeft = state.startLeft + deltaX
      }
      if (state.direction.includes('n')) {
        nextHeight = state.startHeight - deltaY
        nextTop = state.startTop + deltaY
      }

      const maxWidth = Math.max(
        MIN_OVERLAY_TOOL_PANEL_WIDTH,
        viewportWidth - SKETCH_SESSION_WINDOW_VIEWPORT_MARGIN * 2,
      )
      const maxHeight = Math.max(
        MIN_OVERLAY_TOOL_PANEL_HEIGHT,
        viewportHeight - SKETCH_SESSION_WINDOW_VIEWPORT_MARGIN * 2,
      )
      nextWidth = Math.min(Math.max(nextWidth, MIN_OVERLAY_TOOL_PANEL_WIDTH), maxWidth)
      nextHeight = Math.min(Math.max(nextHeight, MIN_OVERLAY_TOOL_PANEL_HEIGHT), maxHeight)

      if (state.direction.includes('w')) {
        nextLeft = state.startLeft + (state.startWidth - nextWidth)
      }
      if (state.direction.includes('n')) {
        nextTop = state.startTop + (state.startHeight - nextHeight)
      }

      nextLeft = Math.max(
        SKETCH_SESSION_WINDOW_VIEWPORT_MARGIN,
        Math.min(nextLeft, viewportWidth - nextWidth - SKETCH_SESSION_WINDOW_VIEWPORT_MARGIN),
      )
      nextTop = Math.max(
        SKETCH_SESSION_WINDOW_VIEWPORT_MARGIN,
        Math.min(nextTop, viewportHeight - nextHeight - SKETCH_SESSION_WINDOW_VIEWPORT_MARGIN),
      )

      setSketchPlaneToolPanelHeightMode('manual')
      setSketchPlaneToolPanelPosition({
        left: Math.round(nextLeft),
        top: Math.round(nextTop),
      })
      setSketchPlaneToolPanelSize({
        width: Math.round(nextWidth),
        height: Math.round(nextHeight),
      })
    }

    const stop = (stopEvent: PointerEvent): void => {
      const state = sketchPlaneToolPanelResizeStateRef.current
      if (state === null || stopEvent.pointerId !== state.pointerId) {
        return
      }
      sketchPlaneToolPanelResizeStateRef.current = {
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

  const startSketchSessionWindowDrag = (event: ReactPointerEvent<HTMLDivElement>): void => {
    event.preventDefault()
    event.stopPropagation()
    beginSketchSessionWindowDrag(event.pointerId, event.clientX, event.clientY)
  }

  const startSketchSessionWindowMouseDrag = (event: ReactMouseEvent<HTMLDivElement>): void => {
    if (event.button !== 0) {
      return
    }
    event.preventDefault()
    event.stopPropagation()
    beginSketchSessionWindowDrag(null, event.clientX, event.clientY)
  }

  const handleSketchSessionTitleBarContextMenu = (
    event: ReactMouseEvent<HTMLDivElement>,
  ): void => {
    event.preventDefault()
    event.stopPropagation()
    const panelRect = sketchSessionWindowRef.current?.getBoundingClientRect()
    setSketchSessionTitleBarContextMenu({
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

  const startSketchSessionWindowResize = (
    event: ReactPointerEvent<HTMLDivElement>,
    direction: ResizeDirection,
  ): void => {
    const host = sketchSessionWindowRef.current
    if (host === null) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    const startWidth = host.offsetWidth || sketchSessionWindowSize?.width || DEFAULT_SKETCH_SESSION_WINDOW_SIZE.width
    const startHeight = host.offsetHeight || sketchSessionWindowSize?.height || DEFAULT_SKETCH_SESSION_WINDOW_SIZE.height
    sketchSessionWindowResizeStateRef.current = {
      active: true,
      pointerId: event.pointerId,
      direction,
      startX: event.clientX,
      startY: event.clientY,
      startLeft: sketchSessionWindowPosition.left,
      startTop: sketchSessionWindowPosition.top,
      startWidth,
      startHeight,
    }

    const move = (moveEvent: PointerEvent): void => {
      const state = sketchSessionWindowResizeStateRef.current
      if (state === null || !state.active || moveEvent.pointerId !== state.pointerId) {
        return
      }

      const deltaX = moveEvent.clientX - state.startX
      const deltaY = moveEvent.clientY - state.startY
      const overlayHost = getOverlayHostMetrics()
      const viewportWidth = overlayHost.width
      const viewportHeight = overlayHost.height

      let nextWidth = state.startWidth
      let nextHeight = state.startHeight
      let nextLeft = state.startLeft
      let nextTop = state.startTop

      if (state.direction.includes('e')) {
        nextWidth = state.startWidth + deltaX
      }
      if (state.direction.includes('s')) {
        nextHeight = state.startHeight + deltaY
      }
      if (state.direction.includes('w')) {
        nextWidth = state.startWidth - deltaX
        nextLeft = state.startLeft + deltaX
      }
      if (state.direction.includes('n')) {
        nextHeight = state.startHeight - deltaY
        nextTop = state.startTop + deltaY
      }

      const maxWidth = Math.max(
        MIN_SKETCH_SESSION_WINDOW_WIDTH,
        viewportWidth - SKETCH_SESSION_WINDOW_VIEWPORT_MARGIN * 2,
      )
      const maxHeight = Math.max(
        MIN_SKETCH_SESSION_WINDOW_HEIGHT,
        viewportHeight - SKETCH_SESSION_WINDOW_VIEWPORT_MARGIN * 2,
      )
      nextWidth = Math.min(Math.max(nextWidth, MIN_SKETCH_SESSION_WINDOW_WIDTH), maxWidth)
      nextHeight = Math.min(Math.max(nextHeight, MIN_SKETCH_SESSION_WINDOW_HEIGHT), maxHeight)

      if (state.direction.includes('w')) {
        nextLeft = state.startLeft + (state.startWidth - nextWidth)
      }
      if (state.direction.includes('n')) {
        nextTop = state.startTop + (state.startHeight - nextHeight)
      }

      nextLeft = Math.max(
        SKETCH_SESSION_WINDOW_VIEWPORT_MARGIN,
        Math.min(nextLeft, viewportWidth - nextWidth - SKETCH_SESSION_WINDOW_VIEWPORT_MARGIN),
      )
      nextTop = Math.max(
        SKETCH_SESSION_WINDOW_VIEWPORT_MARGIN,
        Math.min(nextTop, viewportHeight - nextHeight - SKETCH_SESSION_WINDOW_VIEWPORT_MARGIN),
      )

      setSketchSessionWindowPosition({
        left: Math.round(nextLeft),
        top: Math.round(nextTop),
      })
      setSketchSessionWindowSize({
        width: Math.round(nextWidth),
        height: Math.round(nextHeight),
      })
      setSketchSessionWindowHeightMode('manual')
    }

    const stop = (stopEvent: PointerEvent): void => {
      const state = sketchSessionWindowResizeStateRef.current
      if (state === null || stopEvent.pointerId !== state.pointerId) {
        return
      }
      sketchSessionWindowResizeStateRef.current = {
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

  const axisWidgetStyle = useMemo(
    () => ({
      top: `${AXIS_WIDGET_TOP}px`,
      right: `${RIGHT_DOCK_PADDING_X}px`,
      width: `${axisWidgetSize}px`,
      height: `${axisWidgetSize}px`,
    }),
    [axisWidgetSize],
  )
  const viewportHudStyle = useMemo(
    () => ({
      right: `${resolveViewportHudRight(axisWidgetSize)}px`,
    }),
    [axisWidgetSize],
  )
  const handleFlyMoveSpeedChange = (nextSpeed: number): void => {
    const viewer = getViewer(viewportId)
    if (
      viewer === null ||
      typeof viewer.getFlyMoveSpeed !== 'function' ||
      typeof viewer.setFlyMoveSpeed !== 'function'
    ) {
      return
    }
    viewer.setFlyMoveSpeed(nextSpeed)
    setFlyMoveSpeed(viewer.getFlyMoveSpeed())
  }
  const overlayModeLabel =
    sketchPlanePickSession !== null
      ? 'sketch plane pick'
      : geometrySketchSession !== null
        ? `sketch ${geometrySketchSession.mode}`
        : 'preview'

  const sketchFeature = activeGeometrySketchNode?.params.sketch as SketchFeature | undefined
  const sketchComponents = sketchFeature?.components ?? []
  const sketchEntityRows = useMemo(
    () => buildSketchEntityListRows(sketchComponents),
    [sketchComponents],
  )
  const getSketchSessionSliderClampRange = (
    sliderId: string,
    min: number,
    max: number,
  ): SliderClampRange =>
    normalizeSliderClampRange(sketchSessionSliderClampRanges[sliderId] ?? { min, max })
  const buildSketchSessionClampProps = ({
    sliderId,
    min,
    max,
    formatValue,
    displayValue,
  }: {
    sliderId: string
    min: number
    max: number
    formatValue: (value: number) => string
    displayValue?: string
  }) => {
    const range = getSketchSessionSliderClampRange(sliderId, min, max)
    return {
      clampMin: range.min,
      clampMax: range.max,
      isEditingClamp: sketchSessionClampEditing,
      onClampChange: (nextRange: SliderClampRange) => {
        setSketchSessionSliderClampRanges((current) => ({
          ...current,
          [sliderId]: normalizeSliderClampRange(nextRange),
        }))
      },
      displayLabel: sketchSessionClampEditing ? formatValue(range.min) : undefined,
      displayValue: sketchSessionClampEditing ? formatValue(range.max) : displayValue,
    }
  }
  const buildSketchSessionVec2ClampProps = ({
    sliderId,
    min,
    max,
    formatValue,
  }: {
    sliderId: string
    min: number
    max: number
    formatValue: (value: number) => string
  }) => {
    const xRange = getSketchSessionSliderClampRange(`${sliderId}:x`, min, max)
    const yRange = getSketchSessionSliderClampRange(`${sliderId}:y`, min, max)
    return {
      clampMin: {
        x: xRange.min,
        y: yRange.min,
      },
      clampMax: {
        x: xRange.max,
        y: yRange.max,
      },
      isEditingClamp: sketchSessionClampEditing,
      onClampChangeAxis: (axis: 'x' | 'y', nextRange: SliderClampRange) => {
        setSketchSessionSliderClampRanges((current) => ({
          ...current,
          [`${sliderId}:${axis}`]: normalizeSliderClampRange(nextRange),
        }))
      },
      formatValue: (_axis: 'x' | 'y', value: number) => formatValue(value),
    }
  }
  const buildSketchEntryRenameInput = ({
    entryKey,
    currentLabel,
    defaultLabel,
    ariaLabel,
    onCommit,
  }: {
    entryKey: string
    currentLabel: string
    defaultLabel: string
    ariaLabel: string
    onCommit: (value: string | null) => void
  }) => (
    <input
      className="ViewportOverlaySketchEntityNameInput"
      type="text"
      value={sketchSessionEntryRenameDrafts[entryKey] ?? currentLabel}
      placeholder={defaultLabel}
      aria-label={ariaLabel}
      onPointerDown={(event) => {
        event.stopPropagation()
      }}
      onInput={(event) =>
        setSketchSessionEntryRenameDrafts((current) => ({
          ...current,
          [entryKey]: (event.target as HTMLInputElement).value,
        }))
      }
      onChange={(event) =>
        setSketchSessionEntryRenameDrafts((current) => ({
          ...current,
          [entryKey]: event.target.value,
        }))
      }
      onBlur={(event) => {
        onCommit(event.target.value)
        setSketchSessionEntryRenameDrafts((current) => {
          const next = { ...current }
          delete next[entryKey]
          return next
        })
      }}
      onKeyDown={(event) => {
        event.stopPropagation()
        if (event.key === 'Enter') {
          onCommit((event.target as HTMLInputElement).value)
          setSketchSessionEntryRenameDrafts((current) => {
            const next = { ...current }
            delete next[entryKey]
            return next
          })
          ;(event.target as HTMLInputElement).blur()
          return
        }
        if (event.key === 'Escape') {
          setSketchSessionEntryRenameDrafts((current) => {
            const next = { ...current }
            delete next[entryKey]
            return next
          })
          ;(event.target as HTMLInputElement).value = currentLabel
          ;(event.target as HTMLInputElement).blur()
        }
      }}
    />
  )
  const renderSketchEntityNameEditorRow = ({
    entryKey,
    currentLabel,
    defaultLabel,
    ariaLabel,
    onCommit,
  }: {
    entryKey: string
    currentLabel: string
    defaultLabel: string
    ariaLabel: string
    onCommit: (value: string | null) => void
  }) => (
    <div className="ViewportOverlaySketchEntityEditorRow ViewportOverlaySketchEntityEditorRow--name">
      <span className="ViewportOverlaySketchEntityEditorLabel">Name</span>
      {buildSketchEntryRenameInput({
        entryKey,
        currentLabel,
        defaultLabel,
        ariaLabel,
        onCommit,
      })}
    </div>
  )
  const renderSketchEditableEntityEditors = (
    rowId: string,
    component: Line2Component | RectangleComponent,
    options?: {
      entryKey?: string
      currentLabel?: string
      defaultLabel?: string
    },
  ) => {
    if (activeGeometrySketchNode === null) {
      return null
    }
    return (
      <div className="ViewportOverlaySketchEntityEditors">
        {renderSketchEntityNameEditorRow({
          entryKey: options?.entryKey ?? rowId,
          currentLabel: options?.currentLabel ?? component.name ?? 'Entry',
          defaultLabel:
            options?.defaultLabel ?? (component.type === 'rectangle' ? 'Rectangle' : 'Line'),
          ariaLabel: `Rename ${options?.defaultLabel ?? component.type} entry`,
          onCommit: (value) =>
            setGeometrySketchComponentName(activeGeometrySketchNode.nodeId, rowId, value),
        })}
        <div className="ViewportOverlaySketchEntityEditorRow">
          <span className="ViewportOverlaySketchEntityEditorLabel">A</span>
          <ParaVec2Slider
            value={{ x: component.a.x, y: component.a.y }}
            min={-2000}
            max={2000}
            step={0.1}
            onActivate={beginGraphParameterInteraction}
            onChangeAxis={(axis, nextValue) =>
              updateGeometrySketchComponentPoint(activeGeometrySketchNode.nodeId, rowId, 'a', {
                kind: 'lit',
                x: axis === 'x' ? nextValue : component.a.x,
                y: axis === 'y' ? nextValue : component.a.y,
              })
            }
            onChangeEndAxis={() => endGraphParameterInteraction()}
            displayValue={(_axis, value) => formatStableNumber(value)}
            {...buildSketchSessionVec2ClampProps({
              sliderId: `entity:${rowId}:a`,
              min: -2000,
              max: 2000,
              formatValue: formatStableNumber,
            })}
          />
        </div>
        <div className="ViewportOverlaySketchEntityEditorRow">
          <span className="ViewportOverlaySketchEntityEditorLabel">B</span>
          <ParaVec2Slider
            value={{ x: component.b.x, y: component.b.y }}
            min={-2000}
            max={2000}
            step={0.1}
            onActivate={beginGraphParameterInteraction}
            onChangeAxis={(axis, nextValue) =>
              updateGeometrySketchComponentPoint(activeGeometrySketchNode.nodeId, rowId, 'b', {
                kind: 'lit',
                x: axis === 'x' ? nextValue : component.b.x,
                y: axis === 'y' ? nextValue : component.b.y,
              })
            }
            onChangeEndAxis={() => endGraphParameterInteraction()}
            displayValue={(_axis, value) => formatStableNumber(value)}
            {...buildSketchSessionVec2ClampProps({
              sliderId: `entity:${rowId}:b`,
              min: -2000,
              max: 2000,
              formatValue: formatStableNumber,
            })}
          />
        </div>
        {component.type === 'rectangle' ? (
          <>
            <div className="ViewportOverlaySketchEntityEditorRow ViewportOverlaySketchEntityEditorRow--full">
              <ParaSlider
                label="Width"
                value={getRectangleWidth(component)}
                min={0}
                max={2000}
                step={0.1}
                onActivate={beginGraphParameterInteraction}
                onChange={(nextWidth) =>
                  updateGeometrySketchComponentPoint(activeGeometrySketchNode.nodeId, rowId, 'b', {
                    kind: 'lit',
                    ...updateRectangleWidth(component, nextWidth),
                  })
                }
                onChangeEnd={() => endGraphParameterInteraction()}
                formatValue={(value) => formatStableNumber(value)}
                {...buildSketchSessionClampProps({
                  sliderId: `entity:${rowId}:width`,
                  min: 0,
                  max: 2000,
                  formatValue: formatStableNumber,
                  displayValue: formatStableNumber(getRectangleWidth(component)),
                })}
              />
            </div>
            <div className="ViewportOverlaySketchEntityEditorRow ViewportOverlaySketchEntityEditorRow--full">
              <ParaSlider
                label="Height"
                value={getRectangleHeight(component)}
                min={0}
                max={2000}
                step={0.1}
                onActivate={beginGraphParameterInteraction}
                onChange={(nextHeight) =>
                  updateGeometrySketchComponentPoint(activeGeometrySketchNode.nodeId, rowId, 'b', {
                    kind: 'lit',
                    ...updateRectangleHeight(component, nextHeight),
                  })
                }
                onChangeEnd={() => endGraphParameterInteraction()}
                formatValue={(value) => formatStableNumber(value)}
                {...buildSketchSessionClampProps({
                  sliderId: `entity:${rowId}:height`,
                  min: 0,
                  max: 2000,
                  formatValue: formatStableNumber,
                  displayValue: formatStableNumber(getRectangleHeight(component)),
                })}
              />
            </div>
          </>
        ) : null}
      </div>
    )
  }
  const previewProfiles = labelProfilesForPreview(
    (sketchFeature?.outputs.profiles ?? []).map((profile) => ({
      profileId: profile.profileId,
      area: profile.area,
      vertices: profile.verticesProxy,
    })),
  )
  const selectedProfileId =
    sketchFeature?.uiState.selectedProfileId ??
    (previewProfiles.length === 1 ? previewProfiles[0].profileId : undefined)
  const selectedProfile =
    previewProfiles.find((profile) => profile.profileId === selectedProfileId) ?? null
  const activeTool = geometrySketchSession?.activeTool ?? null
  const activeDrawStage = geometrySketchSession?.drawStage ?? null
  const activeDrawDraft = geometrySketchSession?.drawDraft ?? null
  const selectedSketchComponentIds = geometrySketchSession?.selectedComponentIds ?? []
  const selectedSketchComponentIdSet = useMemo(
    () => new Set(selectedSketchComponentIds),
    [selectedSketchComponentIds],
  )
  const hoveredSketchComponentId = geometrySketchSession?.hoveredComponentId ?? null
  const isIdleSketchEntitySelection =
    geometrySketchSession?.mode === 'draw' &&
    activeTool === null &&
    activeDrawStage === 'sessionIdle'
  const activeLineStartPoint = activeDrawDraft?.points[0] ?? null
  const activePlineLastPoint =
    activeDrawDraft === null || activeDrawDraft.points.length === 0
      ? null
      : activeDrawDraft.points[activeDrawDraft.points.length - 1]
  const activeHoverPoint = activeDrawDraft?.hoverPoint ?? null
  const activeCircleCenterPoint = activeDrawDraft?.points[0] ?? null
  const activePreviewStartPoint =
    activeTool === 'pline'
      ? activePlineLastPoint
      : activeTool === 'line' || activeTool === 'rectangle' || activeTool === 'circle'
        ? activeLineStartPoint
        : null
  const activePreviewLength =
    activePreviewStartPoint !== null && activeHoverPoint !== null
      ? Math.hypot(
          activeHoverPoint.x - activePreviewStartPoint.x,
          activeHoverPoint.y - activePreviewStartPoint.y,
        )
      : null
  const activeDrawPointTargetLabel =
    activeTool === 'circle'
      ? activeCircleCenterPoint === null
        ? 'Center'
        : 'Radius'
      : activeTool === 'line' || activeTool === 'rectangle'
      ? activeLineStartPoint === null
        ? 'P1'
        : 'P2'
      : activeTool === 'pline'
        ? `P${(activeDrawDraft?.points.length ?? 0) + 1}`
        : 'n/a'
  const canAcceptTwoPointTool =
    (activeTool === 'line' || activeTool === 'rectangle') &&
    activeLineStartPoint !== null &&
    activeHoverPoint !== null &&
    (activeLineStartPoint.x !== activeHoverPoint.x || activeLineStartPoint.y !== activeHoverPoint.y)
  const canAcceptCircle =
    activeTool === 'circle' &&
    activeCircleCenterPoint !== null &&
    activeHoverPoint !== null &&
    (activeCircleCenterPoint.x !== activeHoverPoint.x ||
      activeCircleCenterPoint.y !== activeHoverPoint.y)
  const canFinishPline =
    activeTool === 'pline' && (activeDrawDraft?.points.length ?? 0) >= 2
  const activeDrawPrompt =
    geometrySketchSession?.mode !== 'draw'
      ? ''
      : activeDrawStage === 'sessionIdle'
        ? selectedSketchComponentIds.length > 0
          ? 'Selection active. Click or drag to replace it, Delete removes it, and Enter re-arms the last draw tool.'
          : 'Click entities or drag Window/Crossing to select, or choose a sketch tool to begin drawing.'
        : activeTool === 'pline'
        ? activeDrawDraft === null || activeDrawDraft.points.length === 0
          ? 'Click or type the first point to start PLine.'
          : 'Click or type the next point. Empty Enter finishes once two points exist.'
        : activeTool === 'circle' && activeCircleCenterPoint === null
          ? 'Move the mouse to stage Center, then click or type Vec2 to start Circle.'
          : activeTool === 'circle'
            ? 'Move the mouse to preview Radius, then click, type Float, or press Enter to place the circle.'
        : activeTool === 'rectangle' && activeLineStartPoint === null
          ? 'Click or type the first corner to start Rectangle.'
          : activeTool === 'rectangle'
            ? 'Move the mouse to preview P2, then click or press Enter to place the rectangle.'
        : activeTool === 'line' && activeLineStartPoint === null
          ? 'Click or type the first point to start Line.'
        : activeTool === 'line'
            ? 'Move the mouse to preview P2, then click or press Enter to place the line.'
            : 'Choose a sketch tool to begin drawing in the main viewport.'

  const selectSketchEntityRow = (row: SketchEntityListRowVm) => {
    setGeometrySketchSelectedComponents(getSketchEntityRowSelectionIds(row))
  }

  const setSketchSessionWindowSizeAxis = (axis: 'width' | 'height', nextValue: number) => {
    const overlayHost = getOverlayHostMetrics()
    const maxWidth = Math.max(
      MIN_SKETCH_SESSION_WINDOW_WIDTH,
      overlayHost.width - SKETCH_SESSION_WINDOW_VIEWPORT_MARGIN * 2,
    )
    const maxHeight = Math.max(
      MIN_SKETCH_SESSION_WINDOW_HEIGHT,
      overlayHost.height - SKETCH_SESSION_WINDOW_VIEWPORT_MARGIN * 2,
    )
    const clampedValue = Math.round(
      Math.min(
        Math.max(
          nextValue,
          axis === 'width' ? MIN_SKETCH_SESSION_WINDOW_WIDTH : MIN_SKETCH_SESSION_WINDOW_HEIGHT,
        ),
        axis === 'width' ? maxWidth : maxHeight,
      ),
    )
    setSketchSessionWindowSize((current) => {
      const currentWidth = current?.width ?? DEFAULT_SKETCH_SESSION_WINDOW_SIZE.width
      const currentHeight = current?.height ?? DEFAULT_SKETCH_SESSION_WINDOW_SIZE.height
      return {
        width: axis === 'width' ? clampedValue : currentWidth,
        height: axis === 'height' ? clampedValue : currentHeight,
      }
    })
    if (axis === 'height') {
      setSketchSessionWindowHeightMode('manual')
    }
  }


  return (
    <div
      ref={overlayRootRef}
      className="ViewportOverlayRoot"
      data-workspace-viewport-id={viewportId}
    >
      <ReferenceTransformToolbar />
      {axisOverlayEnabled ? (
        <div
          ref={axisWidgetRef}
          className={`ViewportOverlayWidget AxisWidget ${viewToolbarOpen ? 'isExpanded' : 'isCompact'}`}
          style={axisWidgetStyle}
        >
          <canvas ref={canvasRef} />
          {viewToolbarOpen ? (
            <div className="AxisWidgetResizeHandle" onPointerDown={startResize} />
          ) : null}
        </div>
      ) : null}
      {activePlanePickNode !== null && sketchPlanePickSession !== null ? (
        <div
          className="ViewportOverlaySketchPlaneSession"
          style={
            {
              '--sketch-plane-accent': sketchPlaneAccent,
              '--overlay-tool-accent': sketchPlaneAccent,
              '--overlay-tool-bg-rgb':
                overlayToolBackgroundColorByMode[sketchPlaneToolColorMode],
              '--overlay-tool-bg-alpha': `${sketchPlaneToolBackgroundOpacity / 100}`,
              '--overlay-tool-text-alpha': `${sketchPlaneToolTextOpacity / 100}`,
              '--overlay-tool-font-size': `${sketchPlaneToolFontSize}px`,
              '--overlay-tool-backdrop-filter':
                sketchPlaneToolFillMode === 'blur' ? 'blur(8px)' : 'none',
              '--overlay-tool-alpha-scale':
                sketchPlaneToolFillMode === 'clear' ? '0.45' : '1',
            } as React.CSSProperties
          }
        >
          <ViewportOverlayToolPanel
            ref={sketchPlaneToolPanelRef}
            className="ViewportOverlaySketchPlaneDock"
            style={{
              left: `${sketchPlaneToolPanelPosition.left}px`,
              top: `${sketchPlaneToolPanelPosition.top}px`,
              right: 'auto',
              zIndex: sketchPlaneToolZIndex,
              width: `${sketchPlaneToolPanelSize?.width ?? DEFAULT_OVERLAY_TOOL_PANEL_SIZE.width}px`,
              height:
                sketchPlaneToolPanelDensity === 'collapsed' ||
                sketchPlaneToolPanelHeightMode === 'auto'
                  ? undefined
                  : `${sketchPlaneToolPanelSize?.height ?? DEFAULT_OVERLAY_TOOL_PANEL_SIZE.height}px`,
            }}
            iMenuLabel="UI Customization"
            onIMenuOpenChange={() => {
              resetSketchPlaneToolPanelToAutoHeight()
            }}
            onIMenuExpandedChange={() => {
              resetSketchPlaneToolPanelToAutoHeight()
            }}
            iMenuContent={
              <div className="ViewportOverlayToolPanelCustomizationRows">
                <div className="ViewportOverlayToolPanelCustomizationNote">
                  Match the toolbar shell to the same customization language used by console tools.
                </div>
                <div className="ViewportOverlayToolPanelCustomizationSubsection">
                  <button
                    type="button"
                    className="ViewportOverlayToolPanelTextToggle"
                    onClick={() => {
                      resetSketchPlaneToolPanelToAutoHeight()
                      setSketchPlaneToolbarWindowExpanded(
                        (currentExpanded) => !currentExpanded,
                      )
                    }}
                  >
                    <span
                      className={`ViewportOverlayToolPanelChevron ${
                        sketchPlaneToolbarWindowExpanded ? 'isExpanded' : ''
                      }`}
                      aria-hidden="true"
                    >
                      ›
                    </span>
                    <span>Toolbar Window</span>
                  </button>
                  {sketchPlaneToolbarWindowExpanded ? (
                    <div className="ViewportOverlayToolPanelCustomizationRows">
                      <ParaSelect
                        label="Preset"
                        value={sketchPlaneToolPreset}
                        options={[
                          { value: 'default', label: 'Default' },
                          { value: 'clear', label: 'Clear' },
                          { value: 'custom', label: 'Custom' },
                        ]}
                        onChange={(value) => {
                          if (value === 'default' || value === 'clear') {
                            applySketchPlaneToolPreset(value)
                          }
                        }}
                      />
                      <ParaSlider
                        label="BG Fill"
                        value={sketchPlaneToolBackgroundOpacity}
                        min={0}
                        max={100}
                        step={1}
                        onChange={(value) =>
                          setSketchPlaneToolBackgroundOpacity(
                            Math.min(Math.max(Math.round(value), 0), 100),
                          )
                        }
                        formatValue={(value) => `${Math.round(value)}%`}
                      />
                      <ParaSlider
                        label="Text"
                        value={sketchPlaneToolTextOpacity}
                        min={0}
                        max={100}
                        step={1}
                        onChange={(value) =>
                          setSketchPlaneToolTextOpacity(
                            Math.min(Math.max(Math.round(value), 0), 100),
                          )
                        }
                        formatValue={(value) => `${Math.round(value)}%`}
                      />
                      <ParaSlider
                        label="Font"
                        value={sketchPlaneToolFontSize}
                        min={1}
                        max={24}
                        step={1}
                        onChange={(value) =>
                          setSketchPlaneToolFontSize(
                            Math.min(Math.max(Math.round(value), 1), 24),
                          )
                        }
                        formatValue={(value) => `${Math.round(value)}px`}
                      />
                      <ParaSlider
                        label="Z Index"
                        value={sketchPlaneToolZIndex}
                        min={MIN_OVERLAY_TOOL_Z_INDEX}
                        max={MAX_OVERLAY_TOOL_Z_INDEX}
                        step={1}
                        onChange={(value) =>
                          setSketchPlaneToolZIndex(
                            Math.min(
                              Math.max(Math.round(value), MIN_OVERLAY_TOOL_Z_INDEX),
                              MAX_OVERLAY_TOOL_Z_INDEX,
                            ),
                          )
                        }
                        formatValue={(value) => `${Math.round(value)}`}
                      />
                      <ParaSelect
                        label="Fill Type"
                        value={sketchPlaneToolFillMode}
                        options={[
                          { value: 'blur', label: 'Blur' },
                          { value: 'flat', label: 'Flat' },
                          { value: 'clear', label: 'Clear' },
                        ]}
                        onChange={(value) =>
                          setSketchPlaneToolFillMode(
                            value as ConsoleBackgroundFillMode,
                          )
                        }
                      />
                      <ParaSelect
                        label="BG Color"
                        value={sketchPlaneToolColorMode}
                        options={[
                          { value: 'midnight', label: 'Midnight' },
                          { value: 'slate', label: 'Slate' },
                          { value: 'navy', label: 'Navy' },
                        ]}
                        onChange={(value) =>
                          setSketchPlaneToolColorMode(
                            value as ConsoleBackgroundColorMode,
                          )
                        }
                      />
                      <ParaSlider
                        label="Toolbar Width"
                        value={
                          sketchPlaneToolPanelSize?.width ?? DEFAULT_OVERLAY_TOOL_PANEL_SIZE.width
                        }
                        min={MIN_OVERLAY_TOOL_PANEL_WIDTH}
                        max={Math.max(
                          MIN_OVERLAY_TOOL_PANEL_WIDTH,
                          getOverlayHostMetrics().width - SKETCH_SESSION_WINDOW_VIEWPORT_MARGIN * 2,
                        )}
                        step={1}
                        onChange={(value) => setSketchPlaneToolPanelSizeAxis('width', value)}
                        formatValue={(value) => `${value.toFixed(0)} px`}
                      />
                      <ParaSlider
                        label="Toolbar Height"
                        value={
                          sketchPlaneToolPanelSize?.height ?? DEFAULT_OVERLAY_TOOL_PANEL_SIZE.height
                        }
                        min={MIN_OVERLAY_TOOL_PANEL_HEIGHT}
                        max={Math.max(
                          MIN_OVERLAY_TOOL_PANEL_HEIGHT,
                          getOverlayHostMetrics().height - SKETCH_SESSION_WINDOW_VIEWPORT_MARGIN * 2,
                        )}
                        step={1}
                        onChange={(value) => setSketchPlaneToolPanelSizeAxis('height', value)}
                        formatValue={(value) => `${value.toFixed(0)} px`}
                      />
                    </div>
                  ) : null}
                </div>
                <div className="ViewportOverlayToolPanelCustomizationSubsection">
                  <button
                    type="button"
                    className="ViewportOverlayToolPanelTextToggle"
                    onClick={() => {
                      resetSketchPlaneToolPanelToAutoHeight()
                      setSketchPlaneToolbarSketchUiExpanded(
                        (currentExpanded) => !currentExpanded,
                      )
                    }}
                  >
                    <span
                      className={`ViewportOverlayToolPanelChevron ${
                        sketchPlaneToolbarSketchUiExpanded ? 'isExpanded' : ''
                      }`}
                      aria-hidden="true"
                    >
                      ›
                    </span>
                    <span>Sketch Plane UI</span>
                  </button>
                  {sketchPlaneToolbarSketchUiExpanded ? (
                    <div className="ViewportOverlayToolPanelCustomizationRows">
                      <ParaSlider
                        label="Gizmo Size"
                        value={sketchPlaneToolbarGizmoScale}
                        min={0.4}
                        max={3}
                        step={0.05}
                        onChange={setSketchPlaneToolbarGizmoScale}
                        formatValue={(value) => `${value.toFixed(2)}x`}
                      />
                      <ParaSlider
                        label="Ghost Plane Size"
                        value={sketchPlaneToolbarGhostPlaneScale}
                        min={0.4}
                        max={3}
                        step={0.05}
                        onChange={setSketchPlaneToolbarGhostPlaneScale}
                        formatValue={(value) => `${value.toFixed(2)}x`}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            }
            titleMeta={
              sketchPlaneToolPanelDensity === 'collapsed'
                ? 'Collapsed'
                : sketchPlaneToolPanelDensity === 'essentials'
                  ? 'Essentials'
                  : 'Expanded'
            }
            title="Sketch Plane"
            titleActions={
              <>
                <button
                  type="button"
                  className="ViewportOverlaySketchPlaneSessionAction isPrimary ViewportOverlayToolPanelTitleDone"
                  onPointerDown={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                  }}
                  onMouseDown={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                  }}
                  onClick={() => runSketchPlaneCommand('done')}
                  disabled={sketchPlanePickSession.stage !== 'adjust'}
                  aria-label="Finish sketch plane and return to sketch"
                  title="Finish sketch plane and return to sketch"
                >
                  Done
                </button>
                <button
                  type="button"
                  className="ViewportOverlaySketchPlaneSessionAction"
                  onPointerDown={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                  }}
                  onMouseDown={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                  }}
                  onClick={() => runSketchPlaneCommand('confirm-to-sketch')}
                  disabled={
                    sketchPlanePickSession.stage !== 'adjust' ||
                    sketchPlanePickSession.adjustScope !== 'root'
                  }
                  aria-label="Confirm sketch plane and continue into sketch draw"
                  title="Confirm sketch plane and continue into sketch draw"
                >
                  ConfirmToSketch
                </button>
                <button
                  type="button"
                  className="ViewportOverlaySketchPlaneSessionAction"
                  onPointerDown={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                  }}
                  onMouseDown={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                  }}
                  onClick={() => runSketchPlaneCommand('back')}
                  aria-label="Back one sketch plane level"
                  title="Back one sketch plane level"
                >
                  Back
                </button>
                <button
                  type="button"
                  className="ViewportOverlaySketchPlaneSessionAction ViewportOverlayToolPanelDensityAction"
                  onPointerDown={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                  }}
                  onMouseDown={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                  }}
                  onClick={() => {
                    resetSketchPlaneToolPanelToAutoHeight()
                    const currentIndex = overlayToolDensityOrder.indexOf(sketchPlaneToolPanelDensity)
                    const nextIndex = (currentIndex + 1) % overlayToolDensityOrder.length
                    setSketchPlaneToolPanelDensity(overlayToolDensityOrder[nextIndex] ?? 'expanded')
                  }}
                  aria-label={sketchPlaneToolDensityButtonTitle}
                  title={sketchPlaneToolDensityButtonTitle}
                >
                  {sketchPlaneToolDensityButtonLabel}
                </button>
                <button
                  type="button"
                  className="ViewportOverlaySketchPlaneSessionAction ViewportOverlayToolPanelClose"
                  onPointerDown={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                  }}
                  onMouseDown={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                  }}
                  onClick={() => runSketchPlaneCommand('x')}
                  aria-label="Close sketch plane tool"
                  title="Close sketch plane tool"
                >
                  X
                </button>
              </>
            }
            onTitleBarPointerDown={startSketchPlaneToolPanelDrag}
            onTitleBarMouseDown={startSketchPlaneToolPanelMouseDrag}
            onResizeHandlePointerDown={startSketchPlaneToolPanelResize}
          >
            {sketchPlaneToolPanelDensity === 'essentials' ? (
              <ViewportOverlayToolSection
                className="ViewportOverlaySketchPlaneDockSection"
                label={
                  <button
                    type="button"
                    className="ViewportOverlaySketchPlaneTextToggle"
                    onClick={() => {
                      resetSketchPlaneToolPanelToAutoHeight()
                      setSketchPlanePlaneSelectionExpanded(
                        (currentExpanded) => !currentExpanded,
                      )
                    }}
                  >
                    <span
                      className={`ViewportOverlaySketchPlaneChevron ${
                        sketchPlanePlaneSelectionExpanded ? 'isExpanded' : ''
                      }`}
                      aria-hidden="true"
                    >
                      ›
                    </span>
                    <span>Plane Selection</span>
                  </button>
                }
              >
                {sketchPlanePlaneSelectionExpanded ? (
                  <>
                    <div className="ViewportOverlaySketchPlaneSessionMeta">
                      <span className="ViewportOverlaySketchPlaneSessionMetaNode">
                        {activePlanePickNode.nodeId}
                      </span>
                      <span className="ViewportOverlaySketchPlaneSessionMetaStage">
                        {pickStageLabel}
                      </span>
                    </div>
                    <div className="ViewportOverlaySketchPlaneSectionRow">
                      <button
                        type="button"
                        className={`ViewportOverlaySketchPlaneSessionAction ViewportOverlaySketchPlaneStageAction ${
                          sketchPlanePickSession.stage === 'pick' ? 'isPrimary' : ''
                        }`}
                        onClick={() => {
                          if (sketchPlanePickSession.stage !== 'pick') {
                            reopenSketchPlanePickPlaneSelection()
                          }
                        }}
                        aria-label={
                          sketchPlanePickSession.stage === 'pick'
                            ? 'Selecting origin plane'
                            : 'Reselect origin plane'
                        }
                        title={
                          sketchPlanePickSession.stage === 'pick'
                            ? 'Selecting origin plane'
                            : 'Show all origin planes again and reselect the base plane'
                        }
                      >
                        {pickStageActionLabel}
                      </button>
                      <ParaSelect
                        label="Plane"
                        value={activePickPlane}
                        options={[...sketchPlanePlaneOptions]}
                        menuMode="custom"
                        onChange={(value) =>
                          runSketchPlaneCommand(value.toLowerCase() as 'xy' | 'xz' | 'yz')
                        }
                      />
                    </div>
                  </>
                ) : null}
              </ViewportOverlayToolSection>
            ) : null}
            {sketchPlaneToolPanelDensity === 'expanded' ? (
              <ViewportOverlayToolSplitLayout
                className="ViewportOverlaySketchPlaneDockSplitLayout"
                defaultTopHeight={156}
                minTopHeight={112}
                minBottomHeight={176}
                top={
                  <ViewportOverlayToolSection
                    className="ViewportOverlaySketchPlaneDockSection"
                    label={
                      <button
                        type="button"
                        className="ViewportOverlaySketchPlaneTextToggle"
                        onClick={() => {
                          resetSketchPlaneToolPanelToAutoHeight()
                          setSketchPlanePlaneSelectionExpanded(
                            (currentExpanded) => !currentExpanded,
                          )
                        }}
                      >
                        <span
                          className={`ViewportOverlaySketchPlaneChevron ${
                            sketchPlanePlaneSelectionExpanded ? 'isExpanded' : ''
                          }`}
                          aria-hidden="true"
                        >
                          ›
                        </span>
                        <span>Plane Selection</span>
                      </button>
                    }
                  >
                    {sketchPlanePlaneSelectionExpanded ? (
                      <>
                        <div className="ViewportOverlaySketchPlaneSessionMeta">
                          <span className="ViewportOverlaySketchPlaneSessionMetaNode">
                            {activePlanePickNode.nodeId}
                          </span>
                          <span className="ViewportOverlaySketchPlaneSessionMetaStage">
                            {pickStageLabel}
                          </span>
                        </div>
                        <div className="ViewportOverlaySketchPlaneSectionRow">
                          <button
                            type="button"
                            className={`ViewportOverlaySketchPlaneSessionAction ViewportOverlaySketchPlaneStageAction ${
                              sketchPlanePickSession.stage === 'pick' ? 'isPrimary' : ''
                            }`}
                            onClick={() => {
                              if (sketchPlanePickSession.stage !== 'pick') {
                                reopenSketchPlanePickPlaneSelection()
                              }
                            }}
                            aria-label={
                              sketchPlanePickSession.stage === 'pick'
                                ? 'Selecting origin plane'
                                : 'Reselect origin plane'
                            }
                            title={
                              sketchPlanePickSession.stage === 'pick'
                                ? 'Selecting origin plane'
                                : 'Show all origin planes again and reselect the base plane'
                            }
                          >
                            {pickStageActionLabel}
                          </button>
                          <ParaSelect
                            label="Plane"
                            value={activePickPlane}
                            options={[...sketchPlanePlaneOptions]}
                            menuMode="custom"
                            onChange={(value) =>
                              runSketchPlaneCommand(value.toLowerCase() as 'xy' | 'xz' | 'yz')
                            }
                          />
                        </div>
                      </>
                    ) : null}
                  </ViewportOverlayToolSection>
                }
                bottom={
                  <ViewportOverlayToolSection
                    className="ViewportOverlaySketchPlaneDockSection ViewportOverlaySketchPlaneGizmoPanel"
                    label={
                      <div className="ViewportOverlaySketchPlaneSectionHeaderRow">
                        <button
                        type="button"
                        className="ViewportOverlaySketchPlaneTextToggle"
                        onClick={() => {
                          resetSketchPlaneToolPanelToAutoHeight()
                          setSketchPlaneTransformExpanded(
                            (currentExpanded) => !currentExpanded,
                          )
                        }}
                      >
                        <span
                          className={`ViewportOverlaySketchPlaneChevron ${
                            sketchPlaneTransformExpanded ? 'isExpanded' : ''
                          }`}
                          aria-hidden="true"
                        >
                          ›
                        </span>
                        <span>Transform</span>
                      </button>
                        <button
                          type="button"
                          className="ViewportOverlaySketchPlaneSessionAction ViewportOverlaySketchPlaneInlineAction"
                          onClick={() => resetSketchPlanePickDraftTransform()}
                          title="Reset sketch plane transform"
                          aria-label="Reset sketch plane transform"
                        >
                          Reset Transform
                        </button>
                      </div>
                    }
                  >
                    {sketchPlaneTransformExpanded && activePickTransform !== null ? (
                      <div className="ViewportOverlaySketchPlaneGizmoRows">
                        <div
                          className={`ViewportOverlaySketchPlaneGizmoSliderGroup ${
                            sketchPlanePickSession.gizmoMode === 'translate' ? 'isActive' : ''
                          }`}
                        >
                          <div className="ViewportOverlaySketchPlaneSectionHeaderRow">
                            <button
                              type="button"
                              className="ViewportOverlaySketchPlaneTextToggle ViewportOverlaySketchPlaneGizmoSliderGroupLabel"
                              onClick={() => {
                                resetSketchPlaneToolPanelToAutoHeight()
                                if (sketchPlanePickSession.gizmoMode !== 'translate') {
                                  runSketchPlaneCommand('move')
                                  setSketchPlaneMoveExpanded(true)
                                  return
                                }
                                setSketchPlaneMoveExpanded((currentExpanded) => !currentExpanded)
                              }}
                            >
                              <span
                                className={`ViewportOverlaySketchPlaneChevron ${
                                  sketchPlaneMoveExpanded ? 'isExpanded' : ''
                                }`}
                                aria-hidden="true"
                              >
                                ›
                              </span>
                              <span>Move</span>
                            </button>
                            <button
                              type="button"
                              className={`ViewportOverlaySketchPlaneSessionAction ViewportOverlaySketchPlaneInlineAction ${
                                sketchPlanePickSession.gizmoMode === 'translate' &&
                                sketchPlanePickSession.adjustScope === 'move'
                                  ? 'isPrimary'
                                  : ''
                              }`}
                              onClick={() => {
                                resetSketchPlaneToolPanelToAutoHeight()
                                runSketchPlaneCommand('move-again')
                              }}
                              title="Re-arm move from the current sketch-plane position"
                              aria-label="Move Again"
                            >
                              Move Again
                            </button>
                            <button
                              type="button"
                              className={`ViewportOverlaySketchPlaneSessionAction ViewportOverlaySketchPlaneInlineAction ${
                                sketchPlaneToolbarTranslateSnapEnabled || moveSnapScopeActive
                                  ? 'isPrimary'
                                  : ''
                              }`}
                              onClick={() => {
                                resetSketchPlaneToolPanelToAutoHeight()
                                runSketchPlaneCommand('move-snap')
                              }}
                              title="Configure move snap"
                              aria-label="Configure move snap"
                            >
                              Snap
                            </button>
                          </div>
                          {sketchPlaneToolbarTranslateSnapEnabled || moveSnapScopeActive ? (
                            <ParaSlider
                              label="Move Snap"
                              value={sketchPlaneToolbarTranslateSnapValue}
                              min={0.1}
                              max={100}
                              step={0.1}
                              onChange={setSketchPlaneToolbarTranslateSnapValue}
                              formatValue={(value) => `${value.toFixed(1)} mm`}
                            />
                          ) : null}
                          {sketchPlaneMoveExpanded ? (
                            <>
                              <div
                                className={`ViewportOverlaySketchPlaneAxisRow ${
                                  moveRowsHighlighted || moveAxisHighlighted === 'x'
                                    ? 'isActive'
                                    : ''
                                }`}
                              >
                                <ParaSlider
                                  label="Move X"
                                  value={activePickTransform.translation.x}
                                  min={-200}
                                  max={200}
                                  step={
                                    sketchPlaneToolbarTranslateSnapEnabled
                                      ? sketchPlaneToolbarTranslateSnapValue
                                      : 0.1
                                  }
                                  showContinuousDragPreview={
                                    sketchPlaneToolbarTranslateSnapEnabled
                                  }
                                  onActivate={() => {
                                    beginGraphParameterInteraction()
                                    runSketchPlaneCommand('move-x')
                                  }}
                                  onChange={(value) => setSketchPlanePickTranslationAxis('x', value)}
                                  onChangeEnd={() => endGraphParameterInteraction()}
                                  formatValue={(value) => `${value.toFixed(1)} mm`}
                                />
                              </div>
                              <div
                                className={`ViewportOverlaySketchPlaneAxisRow ${
                                  moveRowsHighlighted || moveAxisHighlighted === 'y'
                                    ? 'isActive'
                                    : ''
                                }`}
                              >
                                <ParaSlider
                                  label="Move Y"
                                  value={activePickTransform.translation.y}
                                  min={-200}
                                  max={200}
                                  step={
                                    sketchPlaneToolbarTranslateSnapEnabled
                                      ? sketchPlaneToolbarTranslateSnapValue
                                      : 0.1
                                  }
                                  showContinuousDragPreview={
                                    sketchPlaneToolbarTranslateSnapEnabled
                                  }
                                  onActivate={() => {
                                    beginGraphParameterInteraction()
                                    runSketchPlaneCommand('move-y')
                                  }}
                                  onChange={(value) => setSketchPlanePickTranslationAxis('y', value)}
                                  onChangeEnd={() => endGraphParameterInteraction()}
                                  formatValue={(value) => `${value.toFixed(1)} mm`}
                                />
                              </div>
                              <div
                                className={`ViewportOverlaySketchPlaneAxisRow ${
                                  moveRowsHighlighted || moveAxisHighlighted === 'z'
                                    ? 'isActive'
                                    : ''
                                }`}
                              >
                                <ParaSlider
                                  label="Move Z"
                                  value={activePickTransform.translation.z}
                                  min={-200}
                                  max={200}
                                  step={
                                    sketchPlaneToolbarTranslateSnapEnabled
                                      ? sketchPlaneToolbarTranslateSnapValue
                                      : 0.1
                                  }
                                  showContinuousDragPreview={
                                    sketchPlaneToolbarTranslateSnapEnabled
                                  }
                                  onActivate={() => {
                                    beginGraphParameterInteraction()
                                    runSketchPlaneCommand('move-z')
                                  }}
                                  onChange={(value) => setSketchPlanePickTranslationAxis('z', value)}
                                  onChangeEnd={() => endGraphParameterInteraction()}
                                  formatValue={(value) => `${value.toFixed(1)} mm`}
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <ParaVec3Slider
                                value={activePickTransform.translation}
                                min={-200}
                                max={200}
                                step={
                                  sketchPlaneToolbarTranslateSnapEnabled
                                    ? sketchPlaneToolbarTranslateSnapValue
                                    : 0.1
                                }
                                showContinuousDragPreview={
                                  sketchPlaneToolbarTranslateSnapEnabled
                                }
                                onActivate={beginGraphParameterInteraction}
                                onChangeAxis={setSketchPlanePickTranslationAxis}
                                onChangeEndAxis={() => endGraphParameterInteraction()}
                                formatValue={(_axis, value) => `${value.toFixed(1)} mm`}
                                displayValue={(_axis, value) => value.toFixed(1)}
                              />
                            </>
                          )}
                        </div>
                        <div
                          className={`ViewportOverlaySketchPlaneGizmoSliderGroup ${
                            sketchPlanePickSession.gizmoMode === 'rotate' ? 'isActive' : ''
                          }`}
                        >
                          <div className="ViewportOverlaySketchPlaneSectionHeaderRow">
                            <button
                              type="button"
                              className="ViewportOverlaySketchPlaneTextToggle ViewportOverlaySketchPlaneGizmoSliderGroupLabel"
                              onClick={() => {
                                resetSketchPlaneToolPanelToAutoHeight()
                                if (sketchPlanePickSession.gizmoMode !== 'rotate') {
                                  runSketchPlaneCommand('rotate')
                                  setSketchPlaneRotateExpanded(true)
                                  return
                                }
                                setSketchPlaneRotateExpanded((currentExpanded) => !currentExpanded)
                              }}
                            >
                              <span
                                className={`ViewportOverlaySketchPlaneChevron ${
                                  sketchPlaneRotateExpanded ? 'isExpanded' : ''
                                }`}
                                aria-hidden="true"
                              >
                                ›
                              </span>
                              <span>Rotate</span>
                            </button>
                            <button
                              type="button"
                              className={`ViewportOverlaySketchPlaneSessionAction ViewportOverlaySketchPlaneInlineAction ${
                                sketchPlaneToolbarRotateSnapEnabled || rotateSnapScopeActive
                                  ? 'isPrimary'
                                  : ''
                              }`}
                              onClick={() => {
                                resetSketchPlaneToolPanelToAutoHeight()
                                runSketchPlaneCommand('rotate-snap')
                              }}
                              title="Configure rotate snap"
                              aria-label="Configure rotate snap"
                            >
                              Snap
                            </button>
                          </div>
                          {sketchPlaneToolbarRotateSnapEnabled || rotateSnapScopeActive ? (
                            <ParaSlider
                              label="Rotate Snap"
                              value={sketchPlaneToolbarRotateSnapValue}
                              min={1}
                              max={90}
                              step={1}
                              onChange={setSketchPlaneToolbarRotateSnapValue}
                              formatValue={(value) => `${value.toFixed(0)} deg`}
                            />
                          ) : null}
                          {sketchPlaneRotateExpanded ? (
                            <>
                              <div
                                className={`ViewportOverlaySketchPlaneAxisRow ${
                                  rotateRowsHighlighted || rotateAxisHighlighted === 'x'
                                    ? 'isActive'
                                    : ''
                                }`}
                              >
                                <ParaSlider
                                  label="Rotate X"
                                  value={activePickTransform.rotationDeg.x}
                                  min={-180}
                                  max={180}
                                  step={
                                    sketchPlaneToolbarRotateSnapEnabled
                                      ? sketchPlaneToolbarRotateSnapValue
                                      : 1
                                  }
                                  allowWrap
                                  showContinuousDragPreview={sketchPlaneToolbarRotateSnapEnabled}
                                  onActivate={beginGraphParameterInteraction}
                                  onChange={(value) => setSketchPlanePickRotationAxis('x', value)}
                                  onChangeEnd={() => endGraphParameterInteraction()}
                                  formatValue={(value) => `${value.toFixed(0)} deg`}
                                />
                              </div>
                              <div
                                className={`ViewportOverlaySketchPlaneAxisRow ${
                                  rotateRowsHighlighted || rotateAxisHighlighted === 'y'
                                    ? 'isActive'
                                    : ''
                                }`}
                              >
                                <ParaSlider
                                  label="Rotate Y"
                                  value={activePickTransform.rotationDeg.y}
                                  min={-180}
                                  max={180}
                                  step={
                                    sketchPlaneToolbarRotateSnapEnabled
                                      ? sketchPlaneToolbarRotateSnapValue
                                      : 1
                                  }
                                  allowWrap
                                  showContinuousDragPreview={sketchPlaneToolbarRotateSnapEnabled}
                                  onActivate={beginGraphParameterInteraction}
                                  onChange={(value) => setSketchPlanePickRotationAxis('y', value)}
                                  onChangeEnd={() => endGraphParameterInteraction()}
                                  formatValue={(value) => `${value.toFixed(0)} deg`}
                                />
                              </div>
                              <div
                                className={`ViewportOverlaySketchPlaneAxisRow ${
                                  rotateRowsHighlighted || rotateAxisHighlighted === 'z'
                                    ? 'isActive'
                                    : ''
                                }`}
                              >
                                <ParaSlider
                                  label="Rotate Z"
                                  value={activePickTransform.rotationDeg.z}
                                  min={-180}
                                  max={180}
                                  step={
                                    sketchPlaneToolbarRotateSnapEnabled
                                      ? sketchPlaneToolbarRotateSnapValue
                                      : 1
                                  }
                                  allowWrap
                                  showContinuousDragPreview={sketchPlaneToolbarRotateSnapEnabled}
                                  onActivate={beginGraphParameterInteraction}
                                  onChange={(value) => setSketchPlanePickRotationAxis('z', value)}
                                  onChangeEnd={() => endGraphParameterInteraction()}
                                  formatValue={(value) => `${value.toFixed(0)} deg`}
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <ParaVec3Slider
                                value={activePickTransform.rotationDeg}
                                min={-180}
                                max={180}
                                step={
                                  sketchPlaneToolbarRotateSnapEnabled
                                    ? sketchPlaneToolbarRotateSnapValue
                                    : 1
                                }
                                allowWrap
                                showContinuousDragPreview={sketchPlaneToolbarRotateSnapEnabled}
                                onActivate={beginGraphParameterInteraction}
                                onChangeAxis={setSketchPlanePickRotationAxis}
                                onChangeEndAxis={() => endGraphParameterInteraction()}
                                formatValue={(_axis, value) => `${value.toFixed(0)} deg`}
                                displayValue={(_axis, value) => value.toFixed(0)}
                              />
                            </>
                          )}
                        </div>
                        <div className="ViewportOverlaySketchPlaneGizmoSliderGroup ViewportOverlaySketchPlaneTransformHistoryGroup">
                          <div className="ViewportOverlaySketchPlaneSectionHeaderRow">
                            <button
                              type="button"
                              className="ViewportOverlaySketchPlaneTextToggle ViewportOverlaySketchPlaneGizmoSliderGroupLabel"
                              onClick={() => {
                                resetSketchPlaneToolPanelToAutoHeight()
                                setSketchPlaneTransformHistoryExpanded(
                                  (currentExpanded) => !currentExpanded,
                                )
                              }}
                            >
                              <span
                                className={`ViewportOverlaySketchPlaneChevron ${
                                  sketchPlaneTransformHistoryExpanded ? 'isExpanded' : ''
                                }`}
                                aria-hidden="true"
                              >
                                ›
                              </span>
                              <span>Transform History</span>
                            </button>
                            <button
                              type="button"
                              className="ViewportOverlaySketchPlaneSessionAction ViewportOverlaySketchPlaneInlineAction"
                              onClick={() => mergeSketchPlaneTransformHistory()}
                              disabled={!canMergeSketchPlaneTransformHistory}
                              title="Merge unlocked transform-history entries"
                              aria-label="Merge History"
                            >
                              Merge History
                            </button>
                          </div>
                          {sketchPlaneTransformHistoryExpanded ? (
                            <>
                              <div className="ViewportOverlaySketchPlaneSectionRow">
                                <span>Origin</span>
                              </div>
                              {sketchPlaneTransformHistoryRows.map((row) => (
                                <div
                                  key={row.entryId}
                                  className="ViewportOverlaySketchPlaneSectionRow"
                                >
                                  <span>{row.label}</span>
                                  <button
                                    type="button"
                                    className={`ViewportOverlaySketchPlaneSessionAction ViewportOverlaySketchPlaneInlineAction ${
                                      row.locked ? 'isPrimary' : ''
                                    }`}
                                    onClick={() =>
                                      toggleSketchPlaneTransformHistoryLock(row.entryId)
                                    }
                                    title={row.locked ? 'Unlock history row' : 'Lock history row'}
                                    aria-label={row.locked ? 'Unlock history row' : 'Lock history row'}
                                  >
                                    {row.locked ? 'Unlock' : 'Lock'}
                                  </button>
                                </div>
                              ))}
                            </>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </ViewportOverlayToolSection>
                }
              />
            ) : null}
          </ViewportOverlayToolPanel>
        </div>
      ) : null}
      {activeGeometrySketchNode !== null && geometrySketchSession !== null ? (
        <div
          ref={sketchSessionWindowRef}
          className="ViewportOverlayWidget ViewportOverlaySketchSessionWindow ViewportOverlayToolPanel"
          style={
            {
              left: `${sketchSessionWindowPosition.left}px`,
              top: `${sketchSessionWindowPosition.top}px`,
              width:
                sketchSessionWindowSize === null ? undefined : `${sketchSessionWindowSize.width}px`,
              height:
                sketchSessionToolPanelDensity === 'collapsed' ||
                sketchSessionWindowSize === null ||
                sketchSessionWindowHeightMode === 'auto'
                  ? undefined
                  : `${sketchSessionWindowSize.height}px`,
              '--overlay-tool-accent': sketchSessionAccent,
            } as React.CSSProperties
          }
        >
          {(['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'] as const).map((direction) => (
            <div
              key={direction}
              className={`ViewportOverlaySketchSessionResizeHandle ViewportOverlayToolPanelResizeHandle ViewportOverlaySketchSessionResizeHandle--${direction} ViewportOverlayToolPanelResizeHandle--${direction}`}
              onPointerDown={(event) => startSketchSessionWindowResize(event, direction)}
            />
          ))}
          <div
            className="ViewportOverlaySketchSessionTitleBar ViewportOverlayToolPanelTitleBar"
            onPointerDown={startSketchSessionWindowDrag}
            onMouseDown={startSketchSessionWindowMouseDrag}
            onContextMenu={handleSketchSessionTitleBarContextMenu}
          >
            <div className="ViewportOverlaySketchSessionTitleBlock ViewportOverlayToolPanelTitleBlock">
              <div className="ViewportOverlaySketchSessionTitle ViewportOverlayToolPanelTitle">
                {geometrySketchSession.mode === 'draw' ? 'Sketch Draw' : 'Sketch Review'}
              </div>
              <div className="ViewportOverlaySketchSessionSubTitle ViewportOverlayToolPanelTitleMeta">
                {sketchSessionToolPanelDensity === 'collapsed'
                  ? 'Collapsed'
                  : sketchSessionToolPanelDensity === 'essentials'
                    ? 'Essentials'
                    : 'Expanded'}
              </div>
            </div>
            <div className="ViewportOverlayToolPanelTrailingActions">
              <button
                type="button"
                className="ViewportOverlaySketchPlaneSessionAction isPrimary ViewportOverlayToolPanelTitleDone"
                onPointerDown={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                }}
                onMouseDown={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                }}
                onClick={() => {
                  revealFinishedSketch(geometrySketchSession.nodeId)
                  closeGeometrySketchSession()
                }}
                disabled={
                  geometrySketchSession.mode === 'review' &&
                  selectedProfile === null &&
                  previewProfiles.length > 1
                }
              >
                Done
              </button>
              <button
                type="button"
                className="ViewportOverlaySketchPlaneSessionAction"
                onPointerDown={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                }}
                onMouseDown={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                }}
                onClick={() => {
                  runGeometrySketchDrawCommand('back')
                }}
                disabled={
                  geometrySketchSession.mode !== 'draw' || activeDrawStage === 'sessionIdle'
                }
                aria-label="Back one sketch draw level"
                title="Back one sketch draw level"
              >
                Back
              </button>
              <button
                type="button"
                className="ViewportOverlaySketchPlaneSessionAction ViewportOverlayToolPanelDensityAction"
                onPointerDown={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                }}
                onMouseDown={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                }}
                onClick={() => {
                  const currentIndex = overlayToolDensityOrder.indexOf(
                    sketchSessionToolPanelDensity,
                  )
                  const nextIndex = (currentIndex + 1) % overlayToolDensityOrder.length
                  setSketchSessionToolPanelDensity(
                    overlayToolDensityOrder[nextIndex] ?? 'expanded',
                  )
                }}
                aria-label={sketchSessionToolDensityButtonTitle}
                title={sketchSessionToolDensityButtonTitle}
              >
                {sketchSessionToolDensityButtonLabel}
              </button>
            <button
              type="button"
              className="ViewportOverlaySketchSessionClose ViewportOverlayToolPanelClose ViewportOverlaySketchPlaneSessionAction"
              onPointerDown={(event) => {
                event.preventDefault()
                event.stopPropagation()
              }}
              onMouseDown={(event) => {
                event.preventDefault()
                event.stopPropagation()
              }}
              onClick={() => {
                runGeometrySketchDrawCommand('x')
              }}
              aria-label="Close sketch session"
              title="Close sketch session"
            >
              X
            </button>
            </div>
          </div>
          <div className="ViewportOverlaySketchSessionBody ViewportOverlayToolPanelBody">
            <ViewportOverlayToolSectionStack resetKey={sketchSessionSectionStackResetNonce}>
            {sketchSessionIMenuOpen ? (
              <ViewportOverlayToolSection
                className="ViewportOverlayToolPanelIMenuSection"
                label={
                  <button
                    type="button"
                    className="ViewportOverlayToolPanelTextToggle"
                    onClick={() => {
                      resetSketchSessionWindowToAutoHeight()
                      setSketchSessionIMenuExpanded((currentExpanded) => !currentExpanded)
                    }}
                  >
                    <span
                      className={`ViewportOverlayToolPanelChevron ${
                        sketchSessionIMenuExpanded ? 'isExpanded' : ''
                      }`}
                      aria-hidden="true"
                    >
                      ›
                    </span>
                    <span>UI Customization</span>
                  </button>
                }
              >
                {sketchSessionIMenuExpanded ? (
                  <div className="ViewportOverlayToolPanelCustomizationRows">
                    <div className="ViewportOverlayToolPanelCustomizationNote">
                      Tune the floating sketch draw toolbar window.
                    </div>
                    <div className="ViewportOverlayToolPanelCustomizationSubsection">
                      <button
                        type="button"
                        className="ViewportOverlayToolPanelTextToggle"
                        onClick={() => {
                          resetSketchSessionWindowToAutoHeight()
                          setSketchSessionToolbarWindowExpanded(
                            (currentExpanded) => !currentExpanded,
                          )
                        }}
                      >
                        <span
                          className={`ViewportOverlayToolPanelChevron ${
                            sketchSessionToolbarWindowExpanded ? 'isExpanded' : ''
                          }`}
                          aria-hidden="true"
                        >
                          ›
                        </span>
                        <span>Toolbar Window</span>
                      </button>
                      {sketchSessionToolbarWindowExpanded ? (
                        <div className="ViewportOverlayToolPanelCustomizationRows">
                          <ParaSlider
                            label="Toolbar Width"
                            value={
                              sketchSessionWindowSize?.width ?? DEFAULT_SKETCH_SESSION_WINDOW_SIZE.width
                            }
                            min={MIN_SKETCH_SESSION_WINDOW_WIDTH}
                            max={Math.max(
                              MIN_SKETCH_SESSION_WINDOW_WIDTH,
                              getOverlayHostMetrics().width - SKETCH_SESSION_WINDOW_VIEWPORT_MARGIN * 2,
                            )}
                            step={1}
                            onChange={(value) => setSketchSessionWindowSizeAxis('width', value)}
                            formatValue={(value) => `${value.toFixed(0)} px`}
                            {...buildSketchSessionClampProps({
                              sliderId: 'toolbar-width',
                              min: MIN_SKETCH_SESSION_WINDOW_WIDTH,
                              max: Math.max(
                                MIN_SKETCH_SESSION_WINDOW_WIDTH,
                                getOverlayHostMetrics().width -
                                  SKETCH_SESSION_WINDOW_VIEWPORT_MARGIN * 2,
                              ),
                              formatValue: (value) => `${value.toFixed(0)} px`,
                            })}
                          />
                          <ParaSlider
                            label="Toolbar Height"
                            value={
                              sketchSessionWindowSize?.height ?? DEFAULT_SKETCH_SESSION_WINDOW_SIZE.height
                            }
                            min={MIN_SKETCH_SESSION_WINDOW_HEIGHT}
                            max={Math.max(
                              MIN_SKETCH_SESSION_WINDOW_HEIGHT,
                              getOverlayHostMetrics().height - SKETCH_SESSION_WINDOW_VIEWPORT_MARGIN * 2,
                            )}
                            step={1}
                            onChange={(value) => setSketchSessionWindowSizeAxis('height', value)}
                            formatValue={(value) => `${value.toFixed(0)} px`}
                            {...buildSketchSessionClampProps({
                              sliderId: 'toolbar-height',
                              min: MIN_SKETCH_SESSION_WINDOW_HEIGHT,
                              max: Math.max(
                                MIN_SKETCH_SESSION_WINDOW_HEIGHT,
                                getOverlayHostMetrics().height -
                                  SKETCH_SESSION_WINDOW_VIEWPORT_MARGIN * 2,
                              ),
                              formatValue: (value) => `${value.toFixed(0)} px`,
                            })}
                          />
                        </div>
                      ) : null}
                    </div>
                    <div className="ViewportOverlayToolPanelCustomizationSubsection">
                      <button
                        type="button"
                        className="ViewportOverlayToolPanelTextToggle"
                        onClick={() => {
                          resetSketchSessionWindowToAutoHeight()
                          setSketchSessionSketchDrawSettingsExpanded(
                            (currentExpanded) => !currentExpanded,
                          )
                        }}
                      >
                        <span
                          className={`ViewportOverlayToolPanelChevron ${
                            sketchSessionSketchDrawSettingsExpanded ? 'isExpanded' : ''
                          }`}
                          aria-hidden="true"
                        >
                          ›
                        </span>
                        <span>Sketch Draw Settings</span>
                      </button>
                      {sketchSessionSketchDrawSettingsExpanded ? (
                        <div className="ViewportOverlayToolPanelCustomizationRows">
                          <ParaSlider
                            label="Crosshair Size"
                            value={sketchDrawCrosshairSize}
                            min={0.5}
                            max={3}
                            step={0.05}
                            onChange={setSketchDrawCrosshairSize}
                            formatValue={(value) => `${value.toFixed(2)}x`}
                            {...buildSketchSessionClampProps({
                              sliderId: 'sketch-draw-crosshair-size',
                              min: 0.5,
                              max: 3,
                              formatValue: (value) => `${value.toFixed(2)}x`,
                            })}
                          />
                          <ParaSelect
                            label="Start Point"
                            value={sketchDrawStartPointVisible ? 'on' : 'off'}
                            options={[
                              { value: 'off', label: 'Off' },
                              { value: 'on', label: 'On' },
                            ]}
                            onChange={(value) => setSketchDrawStartPointVisible(value === 'on')}
                          />
                          <ParaSelect
                            label="Start Point Symbol"
                            value={sketchDrawStartPointSymbolType}
                            options={[
                              { value: 'crosshair', label: 'Crosshair' },
                              { value: 'circle', label: 'Circle' },
                            ]}
                            onChange={(value) =>
                              setSketchDrawStartPointSymbolType(
                                value as 'crosshair' | 'circle',
                              )
                            }
                          />
                          <ParaSlider
                            label="Start Point Symbol Size"
                            value={sketchDrawStartPointSymbolSize}
                            min={0.01}
                            max={3}
                            step={0.05}
                            onChange={setSketchDrawStartPointSymbolSize}
                            formatValue={(value) => `${value.toFixed(2)}x`}
                            {...buildSketchSessionClampProps({
                              sliderId: 'sketch-draw-start-point-symbol-size',
                              min: 0.01,
                              max: 3,
                              formatValue: (value) => `${value.toFixed(2)}x`,
                            })}
                          />
                          <ParaSelect
                            label="PLine Point Symbols"
                            value={sketchDrawPlinePointVisible ? 'on' : 'off'}
                            options={[
                              { value: 'off', label: 'Off' },
                              { value: 'on', label: 'On' },
                            ]}
                            onChange={(value) => setSketchDrawPlinePointVisible(value === 'on')}
                          />
                          <ParaSelect
                            label="PLine Point Symbol"
                            value={sketchDrawPlinePointSymbolType}
                            options={[
                              { value: 'crosshair', label: 'Crosshair' },
                              { value: 'circle', label: 'Circle' },
                            ]}
                            onChange={(value) =>
                              setSketchDrawPlinePointSymbolType(
                                value as 'crosshair' | 'circle',
                              )
                            }
                          />
                          <ParaSlider
                            label="PLine Point Size"
                            value={sketchDrawPlinePointSymbolSize}
                            min={0.01}
                            max={3}
                            step={0.05}
                            onChange={setSketchDrawPlinePointSymbolSize}
                            formatValue={(value) => `${value.toFixed(2)}x`}
                            {...buildSketchSessionClampProps({
                              sliderId: 'sketch-draw-pline-point-size',
                              min: 0.01,
                              max: 3,
                              formatValue: (value) => `${value.toFixed(2)}x`,
                            })}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </ViewportOverlayToolSection>
            ) : null}
            {geometrySketchSession.mode === 'draw' ? (
              <ViewportOverlayToolSection
                className="ViewportOverlaySketchPlaneDockSection"
                label={
                  <button
                    type="button"
                    className="ViewportOverlaySketchPlaneTextToggle"
                    onClick={() => {
                      resetSketchSessionWindowToAutoHeight()
                      setSketchSessionSnapExpanded((currentExpanded) => !currentExpanded)
                    }}
                  >
                    <span
                      className={`ViewportOverlaySketchPlaneChevron ${
                        sketchSessionSnapExpanded ? 'isExpanded' : ''
                      }`}
                      aria-hidden="true"
                    >
                      â€º
                    </span>
                    <span>Snap</span>
                  </button>
                }
              >
                {sketchSessionSnapExpanded ? (
                  <div className="ViewportOverlayToolPanelCustomizationRows">
                    <ParaSelect
                      label="Snap"
                      value={sketchDrawSnapEnabled ? 'on' : 'off'}
                      options={[
                        { value: 'off', label: 'Off' },
                        { value: 'on', label: 'On' },
                      ]}
                      onChange={(value) => setSketchDrawSnapEnabled(value === 'on')}
                    />
                    <ParaSlider
                      label="Snap Distance"
                      value={sketchDrawSnapDistancePx}
                      min={4}
                      max={64}
                      step={1}
                      onChange={setSketchDrawSnapDistancePx}
                      formatValue={(value) => `${value.toFixed(0)} px`}
                      {...buildSketchSessionClampProps({
                        sliderId: 'sketch-draw-snap-distance',
                        min: 4,
                        max: 64,
                        formatValue: (value) => `${value.toFixed(0)} px`,
                      })}
                    />
                  </div>
                ) : null}
              </ViewportOverlayToolSection>
            ) : null}
            <ViewportOverlayToolSection
              className="ViewportOverlaySketchPlaneDockSection"
              label={
                  <button
                    type="button"
                    className="ViewportOverlaySketchPlaneTextToggle"
                    onClick={() => {
                      resetSketchSessionWindowToAutoHeight()
                      setSketchSessionSessionExpanded((currentExpanded) => !currentExpanded)
                    }}
                  >
                  <span
                    className={`ViewportOverlaySketchPlaneChevron ${
                      sketchSessionSessionExpanded ? 'isExpanded' : ''
                    }`}
                    aria-hidden="true"
                  >
                    ›
                  </span>
                  <span>Session</span>
                </button>
              }
            >
              {sketchSessionSessionExpanded ? (
                <>
                  <div className="ViewportOverlaySketchPlaneSessionMeta">
                    <span className="ViewportOverlaySketchPlaneSessionMetaNode">
                      {activeGeometrySketchNode.nodeId}
                    </span>
                    <span className="ViewportOverlaySketchPlaneSessionMetaStage">
                      Plane {(sketchFeature?.plane ?? 'XY').toString()}
                    </span>
                  </div>
                  <div className="ViewportOverlaySketchEntitySummary">
                    Sketch geometry is rendered in the main viewer.
                  </div>
                  <div className="ViewportOverlaySketchSessionActions">
                    <button
                      type="button"
                      className="isGhost"
                      onClick={() => {
                        getViewer()?.alignCameraToGeometrySketchPlane()
                      }}
                      aria-label="Align view to sketch plane"
                      title="Align view to sketch plane"
                    >
                      Align View
                    </button>
                  </div>
                </>
              ) : null}
            </ViewportOverlayToolSection>
            {geometrySketchSession.mode === 'draw' && sketchSessionToolPanelDensity !== 'collapsed' ? (
              <ViewportOverlayToolSection
                className="ViewportOverlaySketchPlaneDockSection"
                label={
                  <button
                    type="button"
                    className="ViewportOverlaySketchPlaneTextToggle"
                    onClick={() => {
                      resetSketchSessionWindowToAutoHeight()
                      setSketchSessionToolSelectionExpanded(
                        (currentExpanded) => !currentExpanded,
                      )
                    }}
                  >
                    <span
                      className={`ViewportOverlaySketchPlaneChevron ${
                        sketchSessionToolSelectionExpanded ? 'isExpanded' : ''
                      }`}
                      aria-hidden="true"
                    >
                      ›
                    </span>
                    <span>Tool Selection</span>
                  </button>
                }
              >
                {sketchSessionToolSelectionExpanded ? (
                  <div className="ViewportOverlayToolPanelCustomizationRows">
                    <div className="ViewportOverlaySketchToolbar">
                    {PRIMARY_SKETCH_DRAW_TOOLS.map((tool) => (
                      <button
                        key={tool}
                        type="button"
                        className={`ViewportOverlaySketchToolButton ${
                            activeTool === tool ? 'isActive' : ''
                          }`}
                          aria-label={getGeometrySketchToolLabel(tool)}
                          title={getGeometrySketchToolLabel(tool)}
                          onClick={() => {
                            runGeometrySketchDrawCommand(tool)
                          }}
                        >
                          {renderGeometrySketchToolIcon(tool)}
                        </button>
                      ))}
                    </div>
                    <div className="ViewportOverlayToolPanelCustomizationSubsection">
                      <button
                        type="button"
                        className="ViewportOverlayToolPanelTextToggle"
                        onClick={() => {
                          resetSketchSessionWindowToAutoHeight()
                          setSketchSessionActiveToolExpanded((currentExpanded) => !currentExpanded)
                        }}
                      >
                        <span
                          className={`ViewportOverlayToolPanelChevron ${
                            sketchSessionActiveToolExpanded ? 'isExpanded' : ''
                          }`}
                          aria-hidden="true"
                        >
                          ›
                        </span>
                        <span>Active Tool</span>
                      </button>
                      {sketchSessionActiveToolExpanded ? (
                        <div className="ViewportOverlaySketchDraftCard">
                          <div className="ViewportOverlaySketchDraftTitle">
                            {activeTool === null
                              ? 'No Tool Selected'
                              : getGeometrySketchToolLabel(activeTool)}
                          </div>
                          <div className="ViewportOverlaySketchEntitySummary">
                            {activeDrawPrompt}
                          </div>
                          <div className="ViewportOverlaySketchEntityList">
                            <div className="ViewportOverlaySketchEntityItem">
                              <span>Draw Stage</span>
                              <span>
                                {activeDrawStage === 'sessionIdle'
                                  ? 'Session Idle'
                                  : activeDrawStage === 'toolSelected'
                                    ? 'Tool Selected'
                                    : activeDrawStage === 'draftActive'
                                      ? 'Draft Active'
                                      : 'n/a'}
                              </span>
                            </div>
                            <div className="ViewportOverlaySketchEntityItem">
                              <span>Plane</span>
                              <span>{sketchFeature?.plane ?? 'XY'}</span>
                            </div>
                            <div className="ViewportOverlaySketchEntityItem">
                              <span>Points</span>
                              <span>{activeDrawDraft?.points.length ?? 0}</span>
                            </div>
                            <div className="ViewportOverlaySketchEntityItem">
                              <span>Target</span>
                              <span>{activeDrawPointTargetLabel}</span>
                            </div>
                            <div className="ViewportOverlaySketchEntityItem">
                              <span>Hover</span>
                              <span>
                                {activeHoverPoint === null ? 'none' : formatPoint(activeHoverPoint)}
                              </span>
                            </div>
                            <div className="ViewportOverlaySketchEntityItem">
                              <span>Snap Target</span>
                              <span>
                                {activeDrawDraft?.hoverSnapTarget ?? 'off'}
                              </span>
                            </div>
                            {activePreviewStartPoint !== null ? (
                              <div className="ViewportOverlaySketchEntityItem">
                                <span>
                                  {activeTool === 'pline'
                                    ? 'Last Point'
                              : activeTool === 'rectangle'
                                ? 'First Corner'
                                : activeTool === 'circle'
                                  ? 'Center'
                                : 'Start Point'}
                          </span>
                          <span>{formatPoint(activePreviewStartPoint)}</span>
                              </div>
                            ) : null}
                            {activePreviewLength !== null ? (
                              <div className="ViewportOverlaySketchEntityItem">
                                <span>Preview Length</span>
                                <span>{formatStableNumber(activePreviewLength)}</span>
                              </div>
                            ) : null}
                          </div>
                          <div className="ViewportOverlaySketchSessionActions">
                            <button
                              type="button"
                              onClick={() => runGeometrySketchDrawCommand('enter')}
                              disabled={
                                activeTool === null ||
                                ((activeTool === 'line' || activeTool === 'rectangle') &&
                                  !canAcceptTwoPointTool) ||
                                (activeTool === 'circle' && !canAcceptCircle) ||
                                (activeTool === 'pline' && !canFinishPline)
                              }
                            >
                              {activeTool === 'pline'
                                ? 'Finish PLine'
                                : activeTool === 'circle'
                                  ? 'Accept Circle'
                                : activeTool === 'rectangle'
                                  ? 'Accept Rectangle'
                                  : activeTool === 'line'
                                    ? 'Accept Line'
                                    : 'Finish Draft'}
                            </button>
                            <button
                              type="button"
                              className="isGhost"
                              onClick={() => {
                                runGeometrySketchDrawCommand('back')
                              }}
                              disabled={activeTool === null}
                            >
                              Cancel Draft
                            </button>
                            <button
                              type="button"
                              className="isGhost"
                              onClick={() => {
                                if (activeGraphDocumentId.length === 0) {
                                  return
                                }
                                startSketchReviewIntent(
                                  buildWorkspaceIntentDepsFromCurrentStoreState(),
                                  activeGraphDocumentId,
                                  activeGeometrySketchNode.nodeId,
                                )
                              }}
                            >
                              Review Profiles
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </ViewportOverlayToolSection>
            ) : null}
            {geometrySketchSession.mode === 'draw' &&
            sketchSessionToolPanelDensity === 'expanded' ? (
              <ViewportOverlayToolSection
                className="ViewportOverlaySketchPlaneDockSection"
                label={
                  <div className="ViewportOverlaySketchPlaneSectionHeaderRow">
                    <button
                      type="button"
                      className="ViewportOverlaySketchPlaneTextToggle"
                      onClick={() => {
                        resetSketchSessionWindowToAutoHeight()
                        setSketchSessionEntitiesExpanded((currentExpanded) => !currentExpanded)
                      }}
                    >
                      <span
                        className={`ViewportOverlaySketchPlaneChevron ${
                          sketchSessionEntitiesExpanded ? 'isExpanded' : ''
                        }`}
                        aria-hidden="true"
                      >
                        ›
                      </span>
                      <span>Entities</span>
                    </button>
                    <button
                      type="button"
                      className={`ViewportOverlaySketchPlaneSessionAction ViewportOverlaySketchPlaneInlineAction ${
                        sketchSessionClampEditing ? 'isPrimary' : ''
                      }`}
                      onClick={() => {
                        setSketchSessionClampEditing((current) => !current)
                      }}
                      aria-pressed={sketchSessionClampEditing}
                      aria-label={
                        sketchSessionClampEditing ? 'Done clamp editing' : 'Edit clamp ranges'
                      }
                      title={
                        sketchSessionClampEditing ? 'Done clamp editing' : 'Edit clamp ranges'
                      }
                    >
                      {sketchSessionClampEditing ? 'Done Clamp' : 'Edit Clamp'}
                    </button>
                    <button
                      type="button"
                      className="ViewportOverlaySketchPlaneSessionAction ViewportOverlaySketchPlaneInlineAction"
                      onClick={() => {
                        deleteGeometrySketchSelectedComponents()
                      }}
                      disabled={!isIdleSketchEntitySelection || selectedSketchComponentIds.length === 0}
                      aria-label="Delete selected sketch entities"
                      title="Delete selected sketch entities"
                    >
                      Delete
                    </button>
                  </div>
                }
              >
                {sketchSessionEntitiesExpanded ? (
                  <>
                    <div className="ViewportOverlaySketchEntitySummary">
                      {sketchComponents.length === 0
                        ? 'No entities yet.'
                        : selectedSketchComponentIds.length > 0
                          ? `${sketchComponents.length} entities staged on this sketch. ${selectedSketchComponentIds.length} selected.`
                          : `${sketchComponents.length} entities staged on this sketch.`}
                    </div>
                    {sketchComponents.length > 0 ? (
                      <div className="ViewportOverlaySketchEntityList">
                        {sketchEntityRows.map((row) => {
                          const rowIsSelected = isSketchEntityRowSelected(
                            row,
                            selectedSketchComponentIdSet,
                          )
                          const rowIsHovered = isSketchEntityRowHovered(
                            row,
                            hoveredSketchComponentId,
                          )
                          return row.kind === 'component' ? (
                            <button
                              key={row.key}
                              type="button"
                              className={`ViewportOverlaySketchEntityItem ViewportOverlaySketchEntityButton ${
                                rowIsSelected ? 'isSelected' : ''
                              } ${rowIsHovered ? 'isHovered' : ''}`}
                              onClick={() => {
                                selectSketchEntityRow(row)
                              }}
                            >
                              <span className="ViewportOverlaySketchEntityEntryNumber">
                                {row.entryNumber}
                              </span>
                              <span className="ViewportOverlaySketchEntityPrimaryLabel">
                                {row.label}
                              </span>
                              <span className="ViewportOverlaySketchEntityDetail">{row.detail}</span>
                            </button>
                          ) : row.kind === 'editable' ? (
                            <div key={row.key} className="ViewportOverlaySketchEntityGroup">
                              <button
                                type="button"
                                className={`ViewportOverlaySketchEntityGroupHeader ${
                                  rowIsSelected ? 'isSelected' : ''
                                } ${rowIsHovered ? 'isHovered' : ''}`}
                                onClick={() => {
                                  selectSketchEntityRow(row)
                                  setSketchSessionEntityLineRowsExpanded((currentExpanded) => ({
                                    ...currentExpanded,
                                    [row.rowId]: currentExpanded[row.rowId] !== true,
                                  }))
                                }}
                              >
                                <span className="ViewportOverlaySketchEntityEntryNumber">
                                  {row.entryNumber}
                                </span>
                                <span
                                  className={`ViewportOverlaySketchPlaneChevron ${
                                    sketchSessionEntityLineRowsExpanded[row.rowId] ? 'isExpanded' : ''
                                  }`}
                                  aria-hidden="true"
                                >
                                  â€º
                                </span>
                                <span className="ViewportOverlaySketchEntityGroupTitle">
                                  {row.label}
                                </span>
                                <span className="ViewportOverlaySketchEntityDetail">{row.detail}</span>
                              </button>
                              {sketchSessionEntityLineRowsExpanded[row.rowId]
                                ? renderSketchEditableEntityEditors(row.rowId, row.component, {
                                    entryKey: row.key,
                                    currentLabel: row.label,
                                    defaultLabel: row.defaultLabel,
                                  })
                                : null}
                            </div>
                          ) : (
                            <div key={row.key} className="ViewportOverlaySketchEntityGroup">
                              <button
                                type="button"
                                className={`ViewportOverlaySketchEntityGroupHeader ${
                                  rowIsSelected ? 'isSelected' : ''
                                } ${rowIsHovered ? 'isHovered' : ''}`}
                                onClick={() => {
                                  selectSketchEntityRow(row)
                                  setSketchSessionEntityGroupsExpanded((currentExpanded) => ({
                                    ...currentExpanded,
                                    [row.groupId]: currentExpanded[row.groupId] !== true,
                                  }))
                                }}
                              >
                                <span className="ViewportOverlaySketchEntityEntryNumber">
                                  {row.entryNumber}
                                </span>
                                <span
                                  className={`ViewportOverlaySketchPlaneChevron ${
                                    sketchSessionEntityGroupsExpanded[row.groupId] ? 'isExpanded' : ''
                                  }`}
                                  aria-hidden="true"
                                >
                                  â€º
                                </span>
                                <span className="ViewportOverlaySketchEntityGroupTitle">
                                  {row.label}
                                </span>
                                <span className="ViewportOverlaySketchEntityDetail">{row.detail}</span>
                              </button>
                              {sketchSessionEntityGroupsExpanded[row.groupId] ? (
                                <div className="ViewportOverlaySketchEntityGroupChildren">
                                  {renderSketchEntityNameEditorRow({
                                    entryKey: row.key,
                                    currentLabel: row.label,
                                    defaultLabel: row.defaultLabel,
                                    ariaLabel: 'Rename PLine entry',
                                    onCommit: (value) =>
                                      setGeometrySketchDrawGroupName(
                                        activeGeometrySketchNode.nodeId,
                                        row.groupId,
                                        value,
                                      ),
                                  })}
                                  {row.children.map((child) => (
                                    <div key={child.key} className="ViewportOverlaySketchEntityGroup">
                                      <button
                                        type="button"
                                        className={`ViewportOverlaySketchEntityGroupHeader ViewportOverlaySketchEntityGroupHeader--child ${
                                          selectedSketchComponentIdSet.has(child.rowId)
                                            ? 'isSelected'
                                            : ''
                                        } ${
                                          hoveredSketchComponentId === child.rowId ? 'isHovered' : ''
                                        }`}
                                        onClick={() => {
                                          setGeometrySketchSelectedComponents([child.rowId])
                                          setSketchSessionEntityLineRowsExpanded((currentExpanded) => ({
                                            ...currentExpanded,
                                            [child.rowId]: currentExpanded[child.rowId] !== true,
                                          }))
                                        }}
                                      >
                                        <span className="ViewportOverlaySketchEntityEntryNumber">
                                          {child.entryNumber}
                                        </span>
                                        <span
                                          className={`ViewportOverlaySketchPlaneChevron ${
                                            sketchSessionEntityLineRowsExpanded[child.rowId]
                                              ? 'isExpanded'
                                              : ''
                                          }`}
                                          aria-hidden="true"
                                        >
                                          â€º
                                        </span>
                                        <span className="ViewportOverlaySketchEntityGroupTitle">
                                          {child.label}
                                        </span>
                                        <span className="ViewportOverlaySketchEntityDetail">
                                          {child.detail}
                                        </span>
                                      </button>
                                      {sketchSessionEntityLineRowsExpanded[child.rowId]
                                        ? renderSketchEditableEntityEditors(
                                            child.rowId,
                                            child.component,
                                            {
                                              entryKey: child.key,
                                              currentLabel: child.label,
                                              defaultLabel: child.defaultLabel,
                                            },
                                          )
                                        : null}
                                    </div>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          )
                        })}
                      </div>
                    ) : null}
                  </>
                ) : null}
              </ViewportOverlayToolSection>
            ) : null}
            {geometrySketchSession.mode === 'review' &&
            sketchSessionToolPanelDensity !== 'collapsed' ? (
              <ViewportOverlayToolSection
                className="ViewportOverlaySketchPlaneDockSection"
                label={
                  <button
                    type="button"
                    className="ViewportOverlaySketchPlaneTextToggle"
                    onClick={() => {
                      resetSketchSessionWindowToAutoHeight()
                      setSketchSessionProfilesExpanded((currentExpanded) => !currentExpanded)
                    }}
                  >
                    <span
                      className={`ViewportOverlaySketchPlaneChevron ${
                        sketchSessionProfilesExpanded ? 'isExpanded' : ''
                      }`}
                      aria-hidden="true"
                    >
                      ›
                    </span>
                    <span>Profiles</span>
                  </button>
                }
              >
                {sketchSessionProfilesExpanded ? (
                  <div className="ViewportOverlaySketchProfileGrid">
                    {previewProfiles.length === 0 ? (
                      <div className="ViewportOverlaySketchEmptyState">
                        No closed profiles detected yet.
                      </div>
                    ) : (
                      previewProfiles.map((profile) => (
                        <button
                          key={profile.profileId}
                          type="button"
                          className={`ViewportOverlaySketchProfileCard ${
                            selectedProfileId === profile.profileId ? 'isSelected' : ''
                          }`}
                          onClick={() => {
                            setGeometrySketchSelectedProfile(
                              activeGeometrySketchNode.nodeId,
                              profile.profileId,
                            )
                          }}
                        >
                          <div className="ViewportOverlaySketchProfileMeta">
                            <span>{profile.label}</span>
                            <span>{formatStableNumber(profile.area)}</span>
                          </div>
                          {renderProfilePreview(profile.vertices, 108, 76)}
                        </button>
                      ))
                    )}
                  </div>
                ) : null}
              </ViewportOverlayToolSection>
            ) : null}
            {geometrySketchSession.mode === 'review' &&
            sketchSessionToolPanelDensity !== 'collapsed' ? (
              <ViewportOverlayToolSection
                className="ViewportOverlaySketchPlaneDockSection"
                label={
                  <button
                    type="button"
                    className="ViewportOverlaySketchPlaneTextToggle"
                    onClick={() => {
                      resetSketchSessionWindowToAutoHeight()
                      setSketchSessionActiveToolExpanded((currentExpanded) => !currentExpanded)
                    }}
                  >
                    <span
                      className={`ViewportOverlaySketchPlaneChevron ${
                        sketchSessionActiveToolExpanded ? 'isExpanded' : ''
                      }`}
                      aria-hidden="true"
                    >
                      ›
                    </span>
                    <span>Session Actions</span>
                  </button>
                }
              >
                {sketchSessionActiveToolExpanded ? (
                  <>
                    <div className="ViewportOverlaySketchSessionActions">
                      <button
                        type="button"
                        className="isGhost"
                        onClick={() => {
                          if (activeGraphDocumentId.length === 0) {
                            return
                          }
                          startSketchDrawIntent(
                            buildWorkspaceIntentDepsFromCurrentStoreState(),
                            activeGraphDocumentId,
                            activeGeometrySketchNode.nodeId,
                          )
                        }}
                      >
                        Back To Draw
                      </button>
                    </div>
                    <div className="ViewportOverlaySketchEntitySummary">
                      {selectedProfile === null
                        ? previewProfiles.length <= 1
                          ? 'Single-profile sketches auto-resolve.'
                          : 'Choose one profile for downstream use.'
                        : `Selected ${selectedProfile.label} (${formatStableNumber(selectedProfile.area)})`}
                    </div>
                  </>
                ) : null}
              </ViewportOverlayToolSection>
            ) : null}
            </ViewportOverlayToolSectionStack>
          </div>
          <SpaghettiContextMenu
            open={sketchSessionTitleBarContextMenu !== null}
            x={sketchSessionTitleBarContextMenu?.x ?? 0}
            y={sketchSessionTitleBarContextMenu?.y ?? 0}
            onClose={() => setSketchSessionTitleBarContextMenu(null)}
            containerClassName="ViewportOverlayToolPanelContextMenu"
            items={[
              {
                id: 'toggle-sketch-session-i-menu',
                label: sketchSessionIMenuOpen ? 'Close i Menu' : 'Open i Menu',
                onSelect: () => {
                  setSketchSessionIMenuOpen((current) => {
                    const nextOpen = !current
                    if (nextOpen) {
                      setSketchSessionIMenuExpanded(true)
                    }
                    return nextOpen
                  })
                  setSketchSessionTitleBarContextMenu(null)
                },
              },
            ]}
          />
        </div>
      ) : null}
      <div className="ViewportOverlayWidget ViewportHud" style={viewportHudStyle}>
        <span
          className="HudLine ViewportHudResultStatus"
          data-viewport-result-status-kind={viewportResultStatus.kind}
        >
          Geometry: {viewportResultStatus.label}
        </span>
        <span className="HudLine">Mode: {overlayModeLabel}</span>
        <span className="HudLine">
          Selected: {selectedPartKey === null ? 'none' : selectedPartKey}
        </span>
        {flyMoveSpeed === null ? null : (
          <div className="ViewportHudFlySpeed">
            <ParaSlider
              label="Fly Speed"
              value={flyMoveSpeed}
              min={0.1}
              max={250}
              step={0.1}
              onChange={handleFlyMoveSpeedChange}
              formatValue={(value) => `${value.toFixed(1)} u/s`}
              displayValue={`${flyMoveSpeed.toFixed(1)} u/s`}
            />
          </div>
        )}
      </div>
    </div>
  )
}
