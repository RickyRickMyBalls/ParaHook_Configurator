import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import type {
  GroundMaterialPresetId,
  LightSpec,
  LightType,
  MaterialPreset,
  MaterialPresetId,
  Vec3,
} from '../../shared/viewSettingsTypes'
import {
  artifactToPartKeyStr,
  partKeyStrToLabel,
} from '../parts/partKeyResolver'
import { useConsoleStore } from '../console/useConsoleStore'
import { useAppStore } from '../store/useAppStore'
import { useUiPrefsStore } from '../store/uiPrefsStore'
import { useWorkspaceStore } from '../workspace/useWorkspaceStore'
import {
  selectViewerTargetGraphAcceptedBuildOutputs,
  useSpaghettiStore,
} from '../spaghetti/store/useSpaghettiStore'
import {
  type FlyActivationMode,
  type FlyModeType,
  getViewer,
  subscribeViewer,
  type ViewerApi,
  type CameraPreset,
  type GizmoMode,
  type GizmoSpace,
} from '../viewerBridge'
import {
  frameAllCommand,
  frameSelectedCommand,
  setCameraPresetCommand,
  setProjectionModeCommand,
} from '../viewCommands'
import {
  COMPACT_AXIS_WIDGET_SIZE,
  DEFAULT_EXPANDED_AXIS_WIDGET_SIZE,
  resolveRightDockWidth,
  resolveViewAnchorTop,
} from './viewToolbarLayout'
import { ParaSlider } from './ParaSlider'
import { ParaSelect } from './ParaSelect'
import { ParaVec3Field } from './ParaVec3Field'
import { FloatingWindowQuickDockButton } from './FloatingWindowQuickDockButton'
import { SpaghettiContextMenu } from '../spaghetti/ui/SpaghettiContextMenu'
import type {
  WorkspaceFloatingRect,
  WorkspaceViewportId,
  WorkspaceViewToolbarDockMode,
  WorkspaceViewToolbarExpandedPresentationMode,
  WorkspaceViewToolbarTabKey,
} from '../workspace/workspaceShellTypes'

const cameraPresets: CameraPreset[] = ['iso', 'top', 'front', 'left', 'right']
const lightTypes: LightType[] = ['directional', 'point', 'spot', 'hemisphere', 'ambient']
const shadowSizes = [256, 512, 1024, 2048]
const axisLabelVisibilityOptions = [
  { value: 'on', label: 'On' },
  { value: 'off', label: 'Off' },
]
const axisBackgroundOptions = [
  { value: 'none', label: 'None' },
  { value: 'blur', label: 'Blur' },
]
const axisLabelSizeOptions = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
]
const flyActivationModeOptions = [
  { value: 'right-click', label: 'Right Click' },
  { value: 'always-on', label: 'Always On' },
]
const flyModeTypeOptions = [
  { value: 'drone', label: 'Drone' },
  { value: 'free-cam', label: 'Free Cam' },
]
const viewToolbarPresentationOptions = [
  { value: 'classic', label: 'Classic' },
  { value: 'tabs', label: 'Tabs' },
]
const viewToolbarDockModeOptions = [
  { value: 'below-axis', label: 'Below Axis' },
  { value: 'top-right-cluster', label: 'Top Right Cluster' },
]
const groundEnabledOptions = [
  { value: 'off', label: 'Off' },
  { value: 'on', label: 'On' },
]
const shadowsEnabledOptions = [
  { value: 'off', label: 'Off' },
  { value: 'on', label: 'On' },
]
const toneMappingOptions = [
  { value: 'none', label: 'None' },
  { value: 'aces', label: 'ACES' },
]
const envPresetOptions = [
  { value: 'none', label: 'None' },
  { value: 'studio', label: 'Studio' },
]
const enabledOptions = [
  { value: 'off', label: 'Off' },
  { value: 'on', label: 'On' },
]
const shadowMapOptions = shadowSizes.map((size) => ({
  value: `${size}`,
  label: `${size}`,
}))
const groundMaterialOptions: Array<{ value: GroundMaterialPresetId; label: string }> = [
  { value: 'matte_dark', label: 'Matte Dark' },
  { value: 'matte_mid', label: 'Matte Mid' },
  { value: 'glossy_studio', label: 'Glossy Studio' },
]
const MIN_FLY_ROLL_SPEED_RADIANS_PER_SEC = 0
const MAX_FLY_ROLL_SPEED_RADIANS_PER_SEC = Math.PI * 2
const FLY_ROLL_SPEED_STEP_RADIANS_PER_SEC = 0.05
const MIN_PERSPECTIVE_FOV_DEG = 1
const MAX_PERSPECTIVE_FOV_DEG = 179
const PERSPECTIVE_FOV_STEP_DEG = 1
const MIN_CAMERA_CLIP_START = 0.01
const MIN_CAMERA_CLIP_SPAN = 0.01
const DEFAULT_CAMERA_CLIP_END_MAX = 1000
const MIN_CAMERA_SHORTCUT_TRANSITION_DURATION_MS = 50
const MAX_CAMERA_SHORTCUT_TRANSITION_DURATION_MS = 2000
const CAMERA_SHORTCUT_TRANSITION_DURATION_STEP_MS = 10
const VIEW_TOOLBAR_FLOATING_EDGE_PADDING = 12
const VIEW_TOOLBAR_FLOATING_MIN_WIDTH = 280
const VIEW_TOOLBAR_FLOATING_MIN_HEIGHT = 180
const VIEW_TOOLBAR_FLOATING_DEFAULT_HEIGHT = 360
const VIEW_TOOLBAR_FLOATING_TITLEBAR_HEIGHT = 32
const VIEW_TOOLBAR_DETACH_DRAG_THRESHOLD_PX = 8
const VIEW_TOOLBAR_FLOATING_RESIZE_HANDLE_THICKNESS = 6
const VIEW_TOOLBAR_FLOATING_RESIZE_CORNER_SIZE = 14

type ViewToolbarFloatingResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

const viewToolbarFloatingResizeDirections: ViewToolbarFloatingResizeDirection[] = [
  'n',
  's',
  'e',
  'w',
  'ne',
  'nw',
  'se',
  'sw',
]

const viewToolbarFloatingResizeCursorByDirection: Record<
  ViewToolbarFloatingResizeDirection,
  string
> = {
  n: 'ns-resize',
  s: 'ns-resize',
  e: 'ew-resize',
  w: 'ew-resize',
  ne: 'nesw-resize',
  nw: 'nwse-resize',
  se: 'nwse-resize',
  sw: 'nesw-resize',
}

const numericValue = (value: string, fallback: number): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const formatFlyRollSpeedDegreesPerSec = (speed: number): string =>
  `${Math.round((speed * 180) / Math.PI)} deg/s`

const formatPerspectiveFovDegrees = (fovDeg: number): string => `${Math.round(fovDeg)} deg`

const formatClipDistance = (value: number): string => {
  const precision = value >= 100 ? 0 : value >= 10 ? 1 : value >= 1 ? 2 : 3
  return Number(value.toFixed(precision)).toString()
}

const formatCameraShortcutTransitionDuration = (value: number): string =>
  `${Math.round(value)} ms`

const formatExposureValue = (value: number): string =>
  Number(value.toFixed(2)).toString()

const formatLightIntensityValue = (value: number): string =>
  Number(value.toFixed(2)).toString()

const formatLightDistanceValue = (value: number): string =>
  Number(value.toFixed(1)).toString()

const formatLightDecayValue = (value: number): string =>
  Number(value.toFixed(1)).toString()

const formatLightAngleValue = (value: number): string =>
  `${Math.round(value)} deg`

const formatLightPenumbraValue = (value: number): string =>
  Number(value.toFixed(2)).toString()

const formatLightShadowBiasValue = (value: number): string =>
  value.toFixed(4)

const updateVec3Axis = (
  value: Vec3 | undefined,
  axis: 'x' | 'y' | 'z',
  nextAxisValue: number,
): Vec3 => ({
  x: axis === 'x' ? nextAxisValue : value?.x ?? 0,
  y: axis === 'y' ? nextAxisValue : value?.y ?? 0,
  z: axis === 'z' ? nextAxisValue : value?.z ?? 0,
})

const resolveClipDistanceStep = (value: number): number => {
  if (value >= 100) {
    return 1
  }
  if (value >= 10) {
    return 0.1
  }
  return 0.01
}

const shouldIgnoreViewToolbarShellContextMenu = (target: EventTarget | null): boolean => {
  if (!(target instanceof Element)) {
    return false
  }
  return (
    target.closest(
      'button, input, select, textarea, label, .ParaSelect, .ParaSlider, .SpaghettiContextMenu',
    ) !== null
  )
}

type ViewToolbarSectionDefinition = {
  key: WorkspaceViewToolbarTabKey
  label: string
  className?: string
  renderBody: () => ReactNode
}

type ViewToolbarBodyProps = {
  sections: ViewToolbarSectionDefinition[]
  isTabsPresentation: boolean
  activeTab: WorkspaceViewToolbarTabKey
  onSelectTab: (tab: WorkspaceViewToolbarTabKey) => void
}

type ViewToolbarSectionProps = {
  section: ViewToolbarSectionDefinition
  isTabsPresentation: boolean
  activeTab: WorkspaceViewToolbarTabKey
}

function ViewToolbarSection(props: ViewToolbarSectionProps) {
  const { section, isTabsPresentation, activeTab } = props
  const isActive = activeTab === section.key
  const sectionClassName = ['ViewSection', section.className, 'ViewStyledSection']
    .filter(Boolean)
    .join(' ')

  return (
    <details
      className={sectionClassName}
      data-view-toolbar-section={section.key}
      data-tab-active={isActive ? 'true' : 'false'}
      open={isTabsPresentation ? isActive : undefined}
    >
      <summary>{section.label}</summary>
      {section.renderBody()}
    </details>
  )
}

function ViewToolbarBody(props: ViewToolbarBodyProps) {
  const { sections, isTabsPresentation, activeTab, onSelectTab } = props

  return (
    <>
      {isTabsPresentation ? (
        <div className="ViewToolbarTabRail" role="tablist" aria-label="View toolbar sections">
          {sections.map((section) => {
            const isActive = activeTab === section.key
            return (
              <button
                key={section.key}
                type="button"
                role="tab"
                className={`ViewToolbarTabButton ${isActive ? 'isActive' : ''}`}
                aria-selected={isActive}
                aria-pressed={isActive}
                data-view-toolbar-tab={section.key}
                onClick={() => onSelectTab(section.key)}
              >
                <span className="ViewToolbarTabLabel">{section.label}</span>
              </button>
            )
          })}
        </div>
      ) : null}
      <div className={isTabsPresentation ? 'ViewToolbarTabContent' : undefined}>
        {sections.map((section) => (
          <ViewToolbarSection
            key={section.key}
            section={section}
            isTabsPresentation={isTabsPresentation}
            activeTab={activeTab}
          />
        ))}
      </div>
    </>
  )
}

const clampViewToolbarFloatingRect = (
  nextRect: WorkspaceFloatingRect,
  viewportWidth: number,
  viewportHeight: number,
): WorkspaceFloatingRect => {
  const width = Math.max(
    VIEW_TOOLBAR_FLOATING_MIN_WIDTH,
    Math.min(
      Math.round(nextRect.width),
      Math.max(VIEW_TOOLBAR_FLOATING_MIN_WIDTH, viewportWidth - VIEW_TOOLBAR_FLOATING_EDGE_PADDING * 2),
    ),
  )
  const height = Math.max(
    VIEW_TOOLBAR_FLOATING_MIN_HEIGHT,
    Math.min(
      Math.round(nextRect.height),
      Math.max(VIEW_TOOLBAR_FLOATING_MIN_HEIGHT, viewportHeight - VIEW_TOOLBAR_FLOATING_EDGE_PADDING * 2),
    ),
  )
  const maxX = Math.max(
    VIEW_TOOLBAR_FLOATING_EDGE_PADDING,
    viewportWidth - width - VIEW_TOOLBAR_FLOATING_EDGE_PADDING,
  )
  const maxY = Math.max(
    VIEW_TOOLBAR_FLOATING_EDGE_PADDING,
    viewportHeight - height - VIEW_TOOLBAR_FLOATING_EDGE_PADDING,
  )

  return {
    x: Math.max(VIEW_TOOLBAR_FLOATING_EDGE_PADDING, Math.min(Math.round(nextRect.x), maxX)),
    y: Math.max(VIEW_TOOLBAR_FLOATING_EDGE_PADDING, Math.min(Math.round(nextRect.y), maxY)),
    width,
    height,
  }
}

const createDefaultViewToolbarFloatingRect = (
  viewportWidth: number,
  viewportHeight: number,
  preferredWidth: number,
  preferredHeight: number,
): WorkspaceFloatingRect =>
  clampViewToolbarFloatingRect(
    {
      x: viewportWidth - preferredWidth - VIEW_TOOLBAR_FLOATING_EDGE_PADDING * 2,
      y: VIEW_TOOLBAR_FLOATING_EDGE_PADDING * 2,
      width: preferredWidth,
      height: preferredHeight,
    },
    viewportWidth,
    viewportHeight,
  )

const resizeViewToolbarFloatingRect = (
  anchorRect: WorkspaceFloatingRect,
  direction: ViewToolbarFloatingResizeDirection,
  deltaX: number,
  deltaY: number,
  viewportWidth: number,
  viewportHeight: number,
): WorkspaceFloatingRect => {
  const viewportMaxWidth = Math.max(
    VIEW_TOOLBAR_FLOATING_MIN_WIDTH,
    viewportWidth - VIEW_TOOLBAR_FLOATING_EDGE_PADDING * 2,
  )
  const viewportMaxHeight = Math.max(
    VIEW_TOOLBAR_FLOATING_MIN_HEIGHT,
    viewportHeight - VIEW_TOOLBAR_FLOATING_EDGE_PADDING * 2,
  )
  let left = anchorRect.x
  let top = anchorRect.y
  let right = anchorRect.x + anchorRect.width
  let bottom = anchorRect.y + anchorRect.height

  if (direction.includes('w')) {
    left += deltaX
    left = Math.max(VIEW_TOOLBAR_FLOATING_EDGE_PADDING, left)
    left = Math.min(left, right - VIEW_TOOLBAR_FLOATING_MIN_WIDTH)
    left = Math.max(left, right - viewportMaxWidth)
  }

  if (direction.includes('e')) {
    right += deltaX
    right = Math.min(viewportWidth - VIEW_TOOLBAR_FLOATING_EDGE_PADDING, right)
    right = Math.max(right, left + VIEW_TOOLBAR_FLOATING_MIN_WIDTH)
    right = Math.min(right, left + viewportMaxWidth)
  }

  if (direction.includes('n')) {
    top += deltaY
    top = Math.max(VIEW_TOOLBAR_FLOATING_EDGE_PADDING, top)
    top = Math.min(top, bottom - VIEW_TOOLBAR_FLOATING_MIN_HEIGHT)
    top = Math.max(top, bottom - viewportMaxHeight)
  }

  if (direction.includes('s')) {
    bottom += deltaY
    bottom = Math.min(viewportHeight - VIEW_TOOLBAR_FLOATING_EDGE_PADDING, bottom)
    bottom = Math.max(bottom, top + VIEW_TOOLBAR_FLOATING_MIN_HEIGHT)
    bottom = Math.min(bottom, top + viewportMaxHeight)
  }

  return clampViewToolbarFloatingRect(
    {
      x: left,
      y: top,
      width: right - left,
      height: bottom - top,
    },
    viewportWidth,
    viewportHeight,
  )
}

const resolveViewToolbarFloatingResizeHandleStyle = (
  direction: ViewToolbarFloatingResizeDirection,
) => {
  const edgeInset = VIEW_TOOLBAR_FLOATING_RESIZE_CORNER_SIZE
  const baseStyle = {
    position: 'absolute' as const,
    zIndex: 2,
    touchAction: 'none' as const,
    userSelect: 'none' as const,
    WebkitUserSelect: 'none' as const,
    background: 'transparent',
    cursor: viewToolbarFloatingResizeCursorByDirection[direction],
  }

  if (direction === 'n') {
    return {
      ...baseStyle,
      left: `${edgeInset}px`,
      right: `${edgeInset}px`,
      top: '0',
      height: `${VIEW_TOOLBAR_FLOATING_RESIZE_HANDLE_THICKNESS}px`,
    }
  }
  if (direction === 's') {
    return {
      ...baseStyle,
      left: `${edgeInset}px`,
      right: `${edgeInset}px`,
      bottom: '0',
      height: `${VIEW_TOOLBAR_FLOATING_RESIZE_HANDLE_THICKNESS}px`,
    }
  }
  if (direction === 'e') {
    return {
      ...baseStyle,
      top: `${edgeInset}px`,
      bottom: `${edgeInset}px`,
      right: '0',
      width: `${VIEW_TOOLBAR_FLOATING_RESIZE_HANDLE_THICKNESS}px`,
    }
  }
  if (direction === 'w') {
    return {
      ...baseStyle,
      top: `${edgeInset}px`,
      bottom: `${edgeInset}px`,
      left: '0',
      width: `${VIEW_TOOLBAR_FLOATING_RESIZE_HANDLE_THICKNESS}px`,
    }
  }

  return {
    ...baseStyle,
    width: `${VIEW_TOOLBAR_FLOATING_RESIZE_CORNER_SIZE}px`,
    height: `${VIEW_TOOLBAR_FLOATING_RESIZE_CORNER_SIZE}px`,
    ...(direction.includes('n') ? { top: '0' } : { bottom: '0' }),
    ...(direction.includes('w') ? { left: '0' } : { right: '0' }),
  }
}

const resolveViewToolbarViewportHostElement = (
  viewportId: WorkspaceViewportId | undefined,
  anchorElement: Element | null,
): HTMLElement | null => {
  const closestHost = anchorElement?.closest('.ViewportWorkspaceHost, .ViewportFrameBody')
  if (closestHost instanceof HTMLElement) {
    return closestHost
  }
  if (viewportId !== undefined) {
    const escapedViewportId =
      typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
        ? CSS.escape(viewportId)
        : viewportId
    const viewportHost = document.querySelector(
      `.ViewportWorkspaceHost[data-workspace-viewport-id="${escapedViewportId}"]`,
    )
    if (viewportHost instanceof HTMLElement) {
      return viewportHost
    }
  }
  const frameBody = document.querySelector('.ViewportFrameBody')
  return frameBody instanceof HTMLElement ? frameBody : null
}

const getLightTypeDefaults = (type: LightType): Partial<LightSpec> => {
  if (type === 'directional') {
    return {
      position: { x: 6, y: 8, z: 6 },
      target: { x: 0, y: 0, z: 0 },
      castShadow: true,
      shadowBias: -0.0005,
      shadowMapSize: 1024,
      distance: undefined,
      angleDeg: undefined,
      penumbra: undefined,
      decay: undefined,
    }
  }
  if (type === 'point') {
    return {
      position: { x: 4, y: 6, z: 4 },
      castShadow: true,
      shadowBias: -0.0002,
      shadowMapSize: 1024,
      distance: 0,
      decay: 2,
      target: undefined,
      angleDeg: undefined,
      penumbra: undefined,
    }
  }
  if (type === 'spot') {
    return {
      position: { x: 5, y: 8, z: 5 },
      target: { x: 0, y: 0, z: 0 },
      castShadow: true,
      shadowBias: -0.0003,
      shadowMapSize: 1024,
      distance: 0,
      decay: 2,
      angleDeg: 35,
      penumbra: 0.2,
    }
  }
  return {
    position: undefined,
    target: undefined,
    castShadow: undefined,
    shadowBias: undefined,
    shadowMapSize: undefined,
    distance: undefined,
    decay: undefined,
    angleDeg: undefined,
    penumbra: undefined,
  }
}

const supportsPosition = (type: LightType): boolean =>
  type === 'directional' || type === 'point' || type === 'spot'

const supportsTarget = (type: LightType): boolean =>
  type === 'directional' || type === 'spot'

const supportsSpot = (type: LightType): boolean => type === 'spot'

const supportsDistance = (type: LightType): boolean =>
  type === 'point' || type === 'spot'

const supportsShadow = (type: LightType): boolean =>
  type === 'directional' || type === 'point' || type === 'spot'

const lightTypeLabel = (type: LightType): string => {
  if (type === 'directional') {
    return 'Directional'
  }
  if (type === 'point') {
    return 'Point'
  }
  if (type === 'spot') {
    return 'Spot'
  }
  if (type === 'hemisphere') {
    return 'Hemisphere'
  }
  return 'Ambient'
}

type ViewToolbarProps = {
  viewportId?: WorkspaceViewportId
}

export function ViewToolbar(props: ViewToolbarProps = {}) {
  const { viewportId } = props
  const rightDockRef = useRef<HTMLElement | null>(null)
  const rightPanelStackRef = useRef<HTMLDivElement | null>(null)
  const viewToolbarRootRef = useRef<HTMLDetailsElement | null>(null)
  const viewToolbarPanelRef = useRef<HTMLDivElement | null>(null)
  const viewToolbarFloatingWindowRef = useRef<HTMLDivElement | null>(null)
  const pendingViewToolbarDetachRef = useRef<{
    pointerId: number
    startX: number
    startY: number
  } | null>(null)
  const viewToolbarFloatingDragStateRef = useRef<{
    pointerId: number
    pointerOffsetX: number
    pointerOffsetY: number
    width: number
    height: number
  } | null>(null)
  const viewToolbarFloatingResizeStateRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    direction: ViewToolbarFloatingResizeDirection
    anchorRect: WorkspaceFloatingRect
  } | null>(null)
  const viewerTargetParts = useSpaghettiStore(selectViewerTargetGraphAcceptedBuildOutputs)
  const selectedPartKey = useAppStore((state) => state.selectedPartKey)
  const parts = viewerTargetParts

  const globalView = useUiPrefsStore((state) => state.view)
  const cameraShortcutTransitionDurationMs = useUiPrefsStore(
    (state) => state.cameraShortcutTransitionDurationMs,
  )
  const setView = useUiPrefsStore((state) => state.setView)
  const setViewKey = useUiPrefsStore((state) => state.setViewKey)
  const setCameraShortcutTransitionDurationMs = useUiPrefsStore(
    (state) => state.setCameraShortcutTransitionDurationMs,
  )
  const selectLight = useUiPrefsStore((state) => state.selectLight)
  const addLight = useUiPrefsStore((state) => state.addLight)
  const deleteLight = useUiPrefsStore((state) => state.deleteLight)
  const updateLight = useUiPrefsStore((state) => state.updateLight)
  const selectMaterialPreset = useUiPrefsStore((state) => state.selectMaterialPreset)
  const updateMaterialPreset = useUiPrefsStore((state) => state.updateMaterialPreset)
  const addMaterialPreset = useUiPrefsStore((state) => state.addMaterialPreset)
  const deleteMaterialPreset = useUiPrefsStore((state) => state.deleteMaterialPreset)
  const setUsePerPartMaterial = useUiPrefsStore((state) => state.setUsePerPartMaterial)
  const assignPartMaterial = useUiPrefsStore((state) => state.assignPartMaterial)
  const clearPartMaterial = useUiPrefsStore((state) => state.clearPartMaterial)
  const consoleWindowMode = useConsoleStore((state) => state.windowMode)
  const consoleIsExpanded = useConsoleStore((state) => state.isExpanded)
  const consoleExpandedHeight = useConsoleStore((state) => state.expandedHeight)
  const localViewState = useWorkspaceStore(
    (state) =>
      (viewportId !== undefined ? state.viewportChromeById[viewportId]?.localViewState : null) ?? null,
  )
  const setViewportLocalViewState = useWorkspaceStore((state) => state.setViewportLocalViewState)

  const view = useMemo(
    () => ({
      ...globalView,
      projectionMode: localViewState?.projectionMode ?? globalView.projectionMode,
      axisOverlayEnabled: localViewState?.axisOverlayEnabled ?? globalView.axisOverlayEnabled,
    }),
    [globalView, localViewState],
  )
  const viewToolbarOpen = localViewState?.viewToolbarOpen ?? false
  const viewToolbarCompactAxisWidgetSize = localViewState?.viewToolbarCompactAxisWidgetSize ?? null
  const viewToolbarExpandedAxisWidgetSize = localViewState?.viewToolbarExpandedAxisWidgetSize ?? null
  const viewToolbarExpandedPresentationMode =
    localViewState?.viewToolbarExpandedPresentationMode ?? 'classic'
  const viewToolbarHostMode = localViewState?.viewToolbarHostMode ?? 'docked'
  const viewToolbarDockMode = localViewState?.viewToolbarDockMode ?? 'below-axis'
  const viewToolbarFloatingRect = localViewState?.viewToolbarFloatingRect ?? null
  const viewToolbarActiveTab = localViewState?.viewToolbarActiveTab ?? 'camera'

  const [gizmoEnabled, setGizmoEnabled] = useState(false)
  const [activeCameraPreset, setActiveCameraPreset] = useState<CameraPreset>('iso')
  const [gizmoMode, setGizmoMode] = useState<GizmoMode>('translate')
  const [gizmoSpace, setGizmoSpace] = useState<GizmoSpace>('local')
  const [snapTranslate, setSnapTranslate] = useState('10')
  const [snapRotate, setSnapRotate] = useState('15')
  const [snapScale, setSnapScale] = useState('0.1')
  const [flyActivationMode, setFlyActivationMode] = useState<FlyActivationMode | null>(null)
  const [flyModeType, setFlyModeType] = useState<FlyModeType | null>(null)
  const [flyRollSpeed, setFlyRollSpeed] = useState<number | null>(null)
  const [perspectiveFovDeg, setPerspectiveFovDeg] = useState<number | null>(null)
  const [cameraClipRange, setCameraClipRange] = useState<{
    mode: 'auto' | 'authored'
    clipStart: number
    clipEnd: number
  } | null>(null)
  const [cameraProjectionFramingOpen, setCameraProjectionFramingOpen] = useState(true)
  const [addLightType, setAddLightType] = useState<LightType>('point')
  const [addLightName, setAddLightName] = useState('')
  const [viewToolbarMaxHeight, setViewToolbarMaxHeight] = useState<number | null>(null)
  const [viewToolbarUsedHeight, setViewToolbarUsedHeight] = useState<number | null>(null)
  const [viewToolbarHasOverflow, setViewToolbarHasOverflow] = useState(false)
  const [viewToolbarContextMenu, setViewToolbarContextMenu] = useState<{
    x: number
    y: number
  } | null>(null)

  const selectedLight = useMemo(
    () => view.lighting.lights.find((light) => light.id === view.lighting.selectedLightId) ?? null,
    [view.lighting.lights, view.lighting.selectedLightId],
  )
  const setGround = (patch: Partial<typeof view.ground>) => {
    setView({
      ground: {
        ...view.ground,
        ...patch,
      },
    })
  }

  const selectedPreset = useMemo<MaterialPreset | null>(() => {
    return (
      view.materials.presets.find((preset) => preset.id === view.materials.selectedPresetId) ??
      view.materials.presets[0] ??
      null
    )
  }, [view.materials.presets, view.materials.selectedPresetId])

  const withViewer = (callback: (viewer: NonNullable<ReturnType<typeof getViewer>>) => void) => {
    const viewer = getViewer(viewportId)
    if (viewer === null) {
      return
    }
    callback(viewer)
  }

  const updateAxisOverlayStyle = (patch: Partial<typeof globalView.axisOverlayStyle>) => {
    const currentAxisOverlayStyle = useUiPrefsStore.getState().view.axisOverlayStyle
    setView({
      axisOverlayStyle: {
        ...currentAxisOverlayStyle,
        ...patch,
      },
    })
  }

  useEffect(() => {
    const syncFlyActivationMode = (viewer: ViewerApi | null): void => {
      if (
        viewer === null ||
        typeof viewer.getFlyActivationMode !== 'function' ||
        typeof viewer.setFlyActivationMode !== 'function'
      ) {
        setFlyActivationMode(null)
        return
      }
      setFlyActivationMode(viewer.getFlyActivationMode())
    }

    let attachedViewer: ViewerApi | null = null
    const attach = (viewer: ViewerApi | null): void => {
      attachedViewer?.setOnFlyActivationModeChange?.(null)
      attachedViewer = viewer
      syncFlyActivationMode(viewer)
      viewer?.setOnFlyActivationModeChange?.((mode) => {
        setFlyActivationMode(mode)
      })
    }

    attach(getViewer(viewportId))
    const unsubscribe = subscribeViewer((viewer) => {
      attach(viewer)
    }, viewportId)

    return () => {
      attachedViewer?.setOnFlyActivationModeChange?.(null)
      unsubscribe()
    }
  }, [viewportId])

  useEffect(() => {
    const syncFlyModeType = (viewer: ViewerApi | null): void => {
      if (
        viewer === null ||
        typeof viewer.getFlyModeType !== 'function' ||
        typeof viewer.setFlyModeType !== 'function'
      ) {
        setFlyModeType(null)
        return
      }
      setFlyModeType(viewer.getFlyModeType())
    }

    let attachedViewer: ViewerApi | null = null
    const attach = (viewer: ViewerApi | null): void => {
      attachedViewer?.setOnFlyModeTypeChange?.(null)
      attachedViewer = viewer
      syncFlyModeType(viewer)
      viewer?.setOnFlyModeTypeChange?.((mode) => {
        setFlyModeType(mode)
      })
    }

    attach(getViewer(viewportId))
    const unsubscribe = subscribeViewer((viewer) => {
      attach(viewer)
    }, viewportId)

    return () => {
      attachedViewer?.setOnFlyModeTypeChange?.(null)
      unsubscribe()
    }
  }, [viewportId])

  useEffect(() => {
    const syncFlyRollSpeed = (viewer: ViewerApi | null): void => {
      if (
        viewer === null ||
        typeof viewer.getFlyRollSpeed !== 'function' ||
        typeof viewer.setFlyRollSpeed !== 'function'
      ) {
        setFlyRollSpeed(null)
        return
      }
      setFlyRollSpeed(viewer.getFlyRollSpeed())
    }

    let attachedViewer: ViewerApi | null = null
    const attach = (viewer: ViewerApi | null): void => {
      attachedViewer?.setOnFlyRollSpeedChange?.(null)
      attachedViewer = viewer
      syncFlyRollSpeed(viewer)
      viewer?.setOnFlyRollSpeedChange?.((speed) => {
        setFlyRollSpeed(speed)
      })
    }

    attach(getViewer(viewportId))
    const unsubscribe = subscribeViewer((viewer) => {
      attach(viewer)
    }, viewportId)

    return () => {
      attachedViewer?.setOnFlyRollSpeedChange?.(null)
      unsubscribe()
    }
  }, [viewportId])

  useEffect(() => {
    const syncPerspectiveFovDeg = (viewer: ViewerApi | null): void => {
      if (
        viewer === null ||
        typeof viewer.getPerspectiveFovDeg !== 'function' ||
        typeof viewer.setPerspectiveFovDeg !== 'function'
      ) {
        setPerspectiveFovDeg(null)
        return
      }
      setPerspectiveFovDeg(viewer.getPerspectiveFovDeg())
    }

    let attachedViewer: ViewerApi | null = null
    const attach = (viewer: ViewerApi | null): void => {
      attachedViewer?.setOnPerspectiveFovDegChange?.(null)
      attachedViewer = viewer
      syncPerspectiveFovDeg(viewer)
      viewer?.setOnPerspectiveFovDegChange?.((fovDeg) => {
        setPerspectiveFovDeg(fovDeg)
      })
    }

    attach(getViewer(viewportId))
    const unsubscribe = subscribeViewer((viewer) => {
      attach(viewer)
    }, viewportId)

    return () => {
      attachedViewer?.setOnPerspectiveFovDegChange?.(null)
      unsubscribe()
    }
  }, [viewportId])

  useEffect(() => {
    const syncCameraClipRange = (viewer: ViewerApi | null): void => {
      if (
        viewer === null ||
        typeof viewer.getCameraClipRange !== 'function' ||
        typeof viewer.setCameraClipRange !== 'function'
      ) {
        setCameraClipRange(null)
        return
      }
      const range = viewer.getCameraClipRange()
      setCameraClipRange({
        mode: range.mode,
        clipStart: range.clipStart,
        clipEnd: range.clipEnd,
      })
    }

    let attachedViewer: ViewerApi | null = null
    const attach = (viewer: ViewerApi | null): void => {
      attachedViewer?.setOnCameraClipRangeChange?.(null)
      attachedViewer = viewer
      syncCameraClipRange(viewer)
      viewer?.setOnCameraClipRangeChange?.((range) => {
        setCameraClipRange({
          mode: range.mode,
          clipStart: range.clipStart,
          clipEnd: range.clipEnd,
        })
      })
    }

    attach(getViewer(viewportId))
    const unsubscribe = subscribeViewer((viewer) => {
      attach(viewer)
    }, viewportId)

    return () => {
      attachedViewer?.setOnCameraClipRangeChange?.(null)
      unsubscribe()
    }
  }, [viewportId])

  const toggleGizmo = () => {
    const next = !gizmoEnabled
    setGizmoEnabled(next)
    withViewer((viewer) => viewer.setGizmoEnabled(next))
  }

  const setViewToolbarExpandedPresentationMode = (
    mode: WorkspaceViewToolbarExpandedPresentationMode,
  ) => {
    if (viewportId === undefined) {
      return
    }
    setViewportLocalViewState(viewportId, {
      viewToolbarExpandedPresentationMode: mode,
    })
  }

  const setViewToolbarDockMode = (mode: WorkspaceViewToolbarDockMode) => {
    if (viewportId === undefined) {
      return
    }
    setViewportLocalViewState(viewportId, {
      viewToolbarDockMode: mode,
    })
  }

  const setViewToolbarActiveTab = (tab: WorkspaceViewToolbarTabKey) => {
    if (viewportId === undefined) {
      return
    }
    setViewportLocalViewState(viewportId, {
      viewToolbarActiveTab: tab,
    })
  }

  const setViewToolbarFloatingRectState = (rect: WorkspaceFloatingRect | null) => {
    if (viewportId === undefined) {
      return
    }
    setViewportLocalViewState(viewportId, {
      viewToolbarFloatingRect: rect,
    })
  }

  const openViewToolbarContextMenu = (clientX: number, clientY: number) => {
    const menuContainerRect =
      (viewToolbarHostMode === 'floating'
        ? viewToolbarFloatingWindowRef.current?.getBoundingClientRect()
        : rightPanelStackRef.current?.parentElement?.getBoundingClientRect()) ?? null
    setViewToolbarContextMenu({
      x: menuContainerRect === null ? clientX : clientX - menuContainerRect.left,
      y: menuContainerRect === null ? clientY : clientY - menuContainerRect.top,
    })
  }

  const handleFlyRollSpeedChange = (speed: number) => {
    withViewer((viewer) => {
      if (typeof viewer.setFlyRollSpeed !== 'function') {
        return
      }
      viewer.setFlyRollSpeed(speed)
      if (typeof viewer.getFlyRollSpeed === 'function') {
        setFlyRollSpeed(viewer.getFlyRollSpeed())
      }
    })
  }

  const handleFlyActivationModeChange = (mode: string) => {
    withViewer((viewer) => {
      if (typeof viewer.setFlyActivationMode !== 'function') {
        return
      }
      const nextMode = mode as FlyActivationMode
      viewer.setFlyActivationMode(nextMode)
      if (typeof viewer.getFlyActivationMode === 'function') {
        setFlyActivationMode(viewer.getFlyActivationMode())
      }
    })
  }

  const handleFlyModeTypeChange = (mode: string) => {
    withViewer((viewer) => {
      if (typeof viewer.setFlyModeType !== 'function') {
        return
      }
      const nextMode = mode as FlyModeType
      viewer.setFlyModeType(nextMode)
      if (typeof viewer.getFlyModeType === 'function') {
        setFlyModeType(viewer.getFlyModeType())
      }
    })
  }

  const handlePerspectiveFovChange = (fovDeg: number) => {
    withViewer((viewer) => {
      if (typeof viewer.setPerspectiveFovDeg !== 'function') {
        return
      }
      viewer.setPerspectiveFovDeg(fovDeg)
      if (typeof viewer.getPerspectiveFovDeg === 'function') {
        setPerspectiveFovDeg(viewer.getPerspectiveFovDeg())
      }
    })
  }

  const handleClipStartChange = (clipStart: number) => {
    withViewer((viewer) => {
      if (typeof viewer.setCameraClipRange !== 'function') {
        return
      }
      viewer.setCameraClipRange({ clipStart })
      if (typeof viewer.getCameraClipRange === 'function') {
        const range = viewer.getCameraClipRange()
        setCameraClipRange({
          mode: range.mode,
          clipStart: range.clipStart,
          clipEnd: range.clipEnd,
        })
      }
    })
  }

  const handleClipEndChange = (clipEnd: number) => {
    withViewer((viewer) => {
      if (typeof viewer.setCameraClipRange !== 'function') {
        return
      }
      viewer.setCameraClipRange({ clipEnd })
      if (typeof viewer.getCameraClipRange === 'function') {
        const range = viewer.getCameraClipRange()
        setCameraClipRange({
          mode: range.mode,
          clipStart: range.clipStart,
          clipEnd: range.clipEnd,
        })
      }
    })
  }

  const handleResetCameraClipRange = () => {
    withViewer((viewer) => {
      if (typeof viewer.resetCameraClipRange === 'function') {
        viewer.resetCameraClipRange()
      }
      if (typeof viewer.getCameraClipRange === 'function') {
        const range = viewer.getCameraClipRange()
        setCameraClipRange({
          mode: range.mode,
          clipStart: range.clipStart,
          clipEnd: range.clipEnd,
        })
      }
    })
  }

  const handleCameraShortcutTransitionDurationChange = (durationMs: number) => {
    setCameraShortcutTransitionDurationMs(durationMs)
  }

  const setGizmoModeValue = (mode: GizmoMode) => {
    setGizmoMode(mode)
    withViewer((viewer) => viewer.setGizmoMode(mode))
  }

  const toggleGizmoSpace = () => {
    const next: GizmoSpace = gizmoSpace === 'local' ? 'world' : 'local'
    setGizmoSpace(next)
    withViewer((viewer) => viewer.setGizmoSpace(next))
  }

  const resolvedAxisWidgetSize = viewToolbarOpen
    ? viewToolbarExpandedAxisWidgetSize ?? DEFAULT_EXPANDED_AXIS_WIDGET_SIZE
    : viewToolbarCompactAxisWidgetSize ?? COMPACT_AXIS_WIDGET_SIZE
  const rightDockWidth = resolveRightDockWidth(resolvedAxisWidgetSize)
  const isViewToolbarFloating = viewToolbarHostMode === 'floating'
  const effectiveViewToolbarDockMode =
    viewToolbarDockMode === 'top-right-cluster' && viewToolbarOpen
      ? 'top-right-cluster'
      : 'below-axis'
  const dockedConsoleCollapsedReserve = 45
  const dockedConsoleExpandedGap = 20
  const dockedConsoleReserve =
    consoleWindowMode !== 'docked'
      ? 0
      : consoleIsExpanded
        ? consoleExpandedHeight + dockedConsoleExpandedGap
        : dockedConsoleCollapsedReserve
  const viewToolbarBottomContentPadding = 12

  const resolveViewToolbarViewportRect = (): DOMRect | null => {
    const viewportHostElement = resolveViewToolbarViewportHostElement(
      viewportId,
      viewToolbarFloatingWindowRef.current ?? rightDockRef.current ?? viewToolbarRootRef.current,
    )
    return viewportHostElement?.getBoundingClientRect() ?? null
  }

  const resolveDefaultViewToolbarFloatingRect = (): WorkspaceFloatingRect => {
    const viewportRect = resolveViewToolbarViewportRect()
    const dockedToolbarRect = viewToolbarRootRef.current?.getBoundingClientRect() ?? null
    const preferredWidth = dockedToolbarRect?.width ?? rightDockWidth
    const preferredHeight = Math.max(
      dockedToolbarRect?.height ?? 0,
      Math.round(viewToolbarUsedHeight ?? VIEW_TOOLBAR_FLOATING_DEFAULT_HEIGHT),
    )
    if (viewportRect === null) {
      return {
        x: VIEW_TOOLBAR_FLOATING_EDGE_PADDING * 2,
        y: VIEW_TOOLBAR_FLOATING_EDGE_PADDING * 2,
        width: Math.max(VIEW_TOOLBAR_FLOATING_MIN_WIDTH, Math.round(preferredWidth)),
        height: Math.max(VIEW_TOOLBAR_FLOATING_MIN_HEIGHT, preferredHeight),
      }
    }
    return createDefaultViewToolbarFloatingRect(
      Math.max(1, Math.round(viewportRect.width)),
      Math.max(1, Math.round(viewportRect.height)),
      preferredWidth,
      preferredHeight,
    )
  }

  const resolvedViewToolbarFloatingRect = viewToolbarFloatingRect ?? resolveDefaultViewToolbarFloatingRect()

  useEffect(() => {
    if (!isViewToolbarFloating || viewToolbarFloatingRect !== null) {
      return
    }
    if (viewportId === undefined) {
      return
    }
    setViewportLocalViewState(viewportId, {
      viewToolbarOpen: true,
      viewToolbarFloatingRect: resolvedViewToolbarFloatingRect,
    })
  }, [
    isViewToolbarFloating,
    resolvedViewToolbarFloatingRect,
    setViewportLocalViewState,
    viewToolbarFloatingRect,
    viewportId,
  ])

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const pendingDetach = pendingViewToolbarDetachRef.current
      if (
        pendingDetach !== null &&
        pendingDetach.pointerId === event.pointerId &&
        viewportId !== undefined
      ) {
        const deltaX = event.clientX - pendingDetach.startX
        const deltaY = event.clientY - pendingDetach.startY
        if (Math.hypot(deltaX, deltaY) >= VIEW_TOOLBAR_DETACH_DRAG_THRESHOLD_PX) {
          const viewportRect = resolveViewToolbarViewportRect()
          const dockedToolbarRect = viewToolbarRootRef.current?.getBoundingClientRect() ?? null
          if (viewportRect !== null && dockedToolbarRect !== null) {
            const nextWidth = Math.round(dockedToolbarRect.width)
            const nextHeight = Math.max(
              Math.round(dockedToolbarRect.height),
              Math.round(viewToolbarUsedHeight ?? VIEW_TOOLBAR_FLOATING_DEFAULT_HEIGHT),
            )
            const pointerOffsetX = Math.max(
              0,
              Math.min(
                Math.round(event.clientX - dockedToolbarRect.left),
                Math.max(0, nextWidth - VIEW_TOOLBAR_FLOATING_EDGE_PADDING),
              ),
            )
            const pointerOffsetY = Math.max(
              0,
              Math.min(
                Math.round(event.clientY - dockedToolbarRect.top),
                VIEW_TOOLBAR_FLOATING_TITLEBAR_HEIGHT - 1,
              ),
            )
            const nextRect = clampViewToolbarFloatingRect(
              {
                x: event.clientX - viewportRect.left - pointerOffsetX,
                y: event.clientY - viewportRect.top - pointerOffsetY,
                width: nextWidth,
                height: nextHeight,
              },
              Math.max(1, Math.round(viewportRect.width)),
              Math.max(1, Math.round(viewportRect.height)),
            )
            viewToolbarFloatingDragStateRef.current = {
              pointerId: event.pointerId,
              pointerOffsetX,
              pointerOffsetY,
              width: nextRect.width,
              height: nextRect.height,
            }
            setViewportLocalViewState(viewportId, {
              viewToolbarHostMode: 'floating',
              viewToolbarOpen: true,
              viewToolbarFloatingRect: nextRect,
            })
          }
          pendingViewToolbarDetachRef.current = null
        }
        return
      }

      const floatingResizeState = viewToolbarFloatingResizeStateRef.current
      if (
        floatingResizeState !== null &&
        floatingResizeState.pointerId === event.pointerId &&
        viewportId !== undefined
      ) {
        const viewportRect = resolveViewToolbarViewportRect()
        if (viewportRect === null) {
          return
        }
        const nextRect = resizeViewToolbarFloatingRect(
          floatingResizeState.anchorRect,
          floatingResizeState.direction,
          event.clientX - floatingResizeState.startX,
          event.clientY - floatingResizeState.startY,
          Math.max(1, Math.round(viewportRect.width)),
          Math.max(1, Math.round(viewportRect.height)),
        )
        setViewToolbarFloatingRectState(nextRect)
        return
      }

      const floatingDragState = viewToolbarFloatingDragStateRef.current
      if (
        floatingDragState === null ||
        floatingDragState.pointerId !== event.pointerId ||
        viewportId === undefined
      ) {
        return
      }
      const viewportRect = resolveViewToolbarViewportRect()
      if (viewportRect === null) {
        return
      }
      const nextRect = clampViewToolbarFloatingRect(
        {
          x: event.clientX - viewportRect.left - floatingDragState.pointerOffsetX,
          y: event.clientY - viewportRect.top - floatingDragState.pointerOffsetY,
          width: floatingDragState.width,
          height: floatingDragState.height,
        },
        Math.max(1, Math.round(viewportRect.width)),
        Math.max(1, Math.round(viewportRect.height)),
      )
      setViewToolbarFloatingRectState(nextRect)
    }

    const handlePointerUp = (event: PointerEvent) => {
      if (
        pendingViewToolbarDetachRef.current !== null &&
        pendingViewToolbarDetachRef.current.pointerId === event.pointerId
      ) {
        pendingViewToolbarDetachRef.current = null
      }
      if (
        viewToolbarFloatingDragStateRef.current !== null &&
        viewToolbarFloatingDragStateRef.current.pointerId === event.pointerId
      ) {
        viewToolbarFloatingDragStateRef.current = null
      }
      if (
        viewToolbarFloatingResizeStateRef.current !== null &&
        viewToolbarFloatingResizeStateRef.current.pointerId === event.pointerId
      ) {
        viewToolbarFloatingResizeStateRef.current = null
      }
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [setViewportLocalViewState, viewportId, viewToolbarUsedHeight])

  useLayoutEffect(() => {
    if (isViewToolbarFloating) {
      return
    }
    const stackElement = rightPanelStackRef.current
    const toolbarElement = viewToolbarRootRef.current
    const panelElement = viewToolbarPanelRef.current
    if (stackElement === null || toolbarElement === null || panelElement === null) {
      return
    }
    let syncQueued = false
    let disposed = false

    const syncViewToolbarHeights = () => {
      if (disposed) {
        return
      }
      const viewportBodyElement = stackElement.closest('.ViewportFrameBody')
      const stackRect = stackElement.getBoundingClientRect()
      const viewportBodyRect =
        viewportBodyElement instanceof HTMLElement
          ? viewportBodyElement.getBoundingClientRect()
          : null
      const viewportHeight =
        viewportBodyRect === null ? Math.round(stackRect.height) : Math.round(viewportBodyRect.height)
      const toolbarTopOffset =
        viewportBodyRect === null ? 0 : Math.max(0, Math.round(stackRect.top - viewportBodyRect.top))
      const nextMaxHeight = Math.max(0, viewportHeight - toolbarTopOffset - dockedConsoleReserve)
      const toolbarRect = toolbarElement.getBoundingClientRect()
      const panelRect = panelElement.getBoundingClientRect()
      const panelOffsetWithinToolbar = Math.max(0, Math.round(panelRect.top - toolbarRect.top))
      const openNaturalContentHeight = Math.round(
        panelOffsetWithinToolbar + panelElement.scrollHeight,
      )
      const naturalContentHeight =
        toolbarElement.open && openNaturalContentHeight > 0
          ? openNaturalContentHeight
          : Math.round(toolbarElement.scrollHeight)
      const nextUsedHeight =
        nextMaxHeight <= 0 ? 0 : Math.min(naturalContentHeight, nextMaxHeight)
      const nextHasOverflow = naturalContentHeight > nextMaxHeight + 1
      if (nextMaxHeight <= 0 || nextUsedHeight <= 0) {
        return
      }
      setViewToolbarMaxHeight((currentHeight) =>
        currentHeight === nextMaxHeight ? currentHeight : nextMaxHeight,
      )
      setViewToolbarUsedHeight((currentHeight) =>
        currentHeight === nextUsedHeight ? currentHeight : nextUsedHeight,
      )
      setViewToolbarHasOverflow((currentValue) =>
        currentValue === nextHasOverflow ? currentValue : nextHasOverflow,
      )
    }

    const scheduleViewToolbarHeightSync = () => {
      if (syncQueued || disposed) {
        return
      }
      syncQueued = true
      const flush = () => {
        syncQueued = false
        syncViewToolbarHeights()
      }
      if (typeof queueMicrotask === 'function') {
        queueMicrotask(flush)
        return
      }
      Promise.resolve().then(flush)
    }

    syncViewToolbarHeights()
    window.addEventListener('resize', scheduleViewToolbarHeightSync)

    if (typeof ResizeObserver === 'undefined') {
      return () => {
        disposed = true
        window.removeEventListener('resize', scheduleViewToolbarHeightSync)
      }
    }

    const observer = new ResizeObserver(() => {
      scheduleViewToolbarHeightSync()
    })
    observer.observe(stackElement)
    observer.observe(panelElement)
    const viewportBodyElement = stackElement.closest('.ViewportFrameBody')
    if (viewportBodyElement instanceof HTMLElement) {
      observer.observe(viewportBodyElement)
    }
    const subsectionElements = Array.from(
      panelElement.querySelectorAll<HTMLDetailsElement>('.ViewSection, .CameraSubsection'),
    )
    const handleSubsectionToggle = () => {
      scheduleViewToolbarHeightSync()
    }
    subsectionElements.forEach((element) => {
      element.addEventListener('toggle', handleSubsectionToggle)
    })

    return () => {
      disposed = true
      window.removeEventListener('resize', scheduleViewToolbarHeightSync)
      subsectionElements.forEach((element) => {
        element.removeEventListener('toggle', handleSubsectionToggle)
      })
      observer.disconnect()
    }
  }, [
    dockedConsoleReserve,
    isViewToolbarFloating,
    rightDockWidth,
    viewToolbarActiveTab,
    viewToolbarExpandedPresentationMode,
    viewToolbarOpen,
  ])

  const viewToolbarSections: ViewToolbarSectionDefinition[] = [
    {
      key: 'camera',
      label: 'Camera',
      className: 'CameraSection',
      renderBody: () => {
        const clipStartMax =
          cameraClipRange === null
            ? MIN_CAMERA_CLIP_START + MIN_CAMERA_CLIP_SPAN
            : Math.max(MIN_CAMERA_CLIP_START + MIN_CAMERA_CLIP_SPAN, cameraClipRange.clipEnd)
        const clipEndMin =
          cameraClipRange === null
            ? MIN_CAMERA_CLIP_START + MIN_CAMERA_CLIP_SPAN
            : Math.max(
                cameraClipRange.clipStart + MIN_CAMERA_CLIP_SPAN,
                MIN_CAMERA_CLIP_START + MIN_CAMERA_CLIP_SPAN,
              )
        const clipEndMax =
          cameraClipRange === null
            ? DEFAULT_CAMERA_CLIP_END_MAX
            : Math.max(
                DEFAULT_CAMERA_CLIP_END_MAX,
                cameraClipRange.clipEnd * 2,
                cameraClipRange.clipStart + 1,
              )

        return (
          <div className="V15Wrap CameraToolbar">
            {view.projectionMode === 'perspective' && perspectiveFovDeg !== null ? (
              <ParaSlider
                label="FOV"
                min={MIN_PERSPECTIVE_FOV_DEG}
                max={MAX_PERSPECTIVE_FOV_DEG}
                step={PERSPECTIVE_FOV_STEP_DEG}
                value={perspectiveFovDeg}
                onChange={handlePerspectiveFovChange}
                formatValue={formatPerspectiveFovDegrees}
              />
            ) : null}
            {cameraClipRange === null ? null : (
              <ParaSlider
                label="Clip Start"
                min={MIN_CAMERA_CLIP_START}
                max={clipStartMax}
                step={resolveClipDistanceStep(cameraClipRange.clipStart)}
                value={cameraClipRange.clipStart}
                onChange={handleClipStartChange}
                formatValue={formatClipDistance}
              />
            )}
            {cameraClipRange === null ? null : (
              <ParaSlider
                label="Clip End"
                min={clipEndMin}
                max={clipEndMax}
                step={resolveClipDistanceStep(cameraClipRange.clipEnd)}
                value={cameraClipRange.clipEnd}
                onChange={handleClipEndChange}
                formatValue={formatClipDistance}
              />
            )}
            {cameraClipRange === null ? null : (
              <div className="V15Meta">
                Clip: {cameraClipRange.mode === 'authored' ? 'Authored' : 'Auto'}.
                {cameraClipRange.mode === 'authored' ? ' Start stays before end.' : ' Distance driven.'}
              </div>
            )}
            {cameraClipRange?.mode === 'authored' ? (
              <button
                className="CameraButton CameraActionButton"
                type="button"
                onClick={handleResetCameraClipRange}
              >
                Auto Clip
              </button>
            ) : null}
            <details
              className="CameraSubsection CameraProjectionFramingSubsection"
              open={cameraProjectionFramingOpen}
              onToggle={(event) => {
                setCameraProjectionFramingOpen(event.currentTarget.open)
              }}
            >
              <summary>Projection &amp; Framing</summary>
              {cameraProjectionFramingOpen ? (
                <div className="V15Wrap CameraProjectionFramingBody">
                  <button
                    className={`CameraButton CameraActionButton ${
                      view.projectionMode === 'perspective' ? 'isActive' : ''
                    }`}
                    type="button"
                    aria-pressed={view.projectionMode === 'perspective'}
                    onClick={() => setProjectionModeCommand('perspective', viewportId)}
                  >
                    Perspective
                  </button>
                  <button
                    className={`CameraButton CameraActionButton ${
                      view.projectionMode === 'orthographic' ? 'isActive' : ''
                    }`}
                    type="button"
                    aria-pressed={view.projectionMode === 'orthographic'}
                    onClick={() => setProjectionModeCommand('orthographic', viewportId)}
                  >
                    Orthographic
                  </button>
                  <ParaSlider
                    label="Transition"
                    min={MIN_CAMERA_SHORTCUT_TRANSITION_DURATION_MS}
                    max={MAX_CAMERA_SHORTCUT_TRANSITION_DURATION_MS}
                    step={CAMERA_SHORTCUT_TRANSITION_DURATION_STEP_MS}
                    value={cameraShortcutTransitionDurationMs}
                    onChange={handleCameraShortcutTransitionDurationChange}
                    formatValue={formatCameraShortcutTransitionDuration}
                  />
                  <div className="CameraPresetGrid">
                    {cameraPresets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        className={`CameraButton ${activeCameraPreset === preset ? 'isActive' : ''}`}
                        aria-pressed={activeCameraPreset === preset}
                        onClick={() => {
                          setActiveCameraPreset(preset)
                          setCameraPresetCommand(preset, viewportId)
                        }}
                      >
                        {preset[0].toUpperCase() + preset.slice(1)}
                      </button>
                    ))}
                  </div>
                  <button
                    className="CameraButton CameraActionButton"
                    type="button"
                    onClick={() => frameSelectedCommand(selectedPartKey, viewportId)}
                  >
                    Frame
                  </button>
                  <button
                    className="CameraButton CameraActionButton"
                    type="button"
                    onClick={() => frameAllCommand(viewportId)}
                  >
                    Frame All
                  </button>
                </div>
              ) : null}
            </details>
          </div>
        )
      },
    },
    {
      key: 'fly-mode',
      label: 'Fly Mode',
      className: 'FlyModeSection',
      renderBody: () =>
        flyModeType === null && flyActivationMode === null && flyRollSpeed === null ? (
          <div className="V15Meta">Fly mode controls unavailable for this viewport.</div>
        ) : (
          <div className="V15Wrap">
            {flyModeType === null ? null : (
              <ParaSelect
                label="Fly Mode Type"
                value={flyModeType}
                options={flyModeTypeOptions}
                onChange={handleFlyModeTypeChange}
              />
            )}
            {flyActivationMode === null ? null : (
              <ParaSelect
                label="Fly Mode Activate"
                value={flyActivationMode}
                options={flyActivationModeOptions}
                onChange={handleFlyActivationModeChange}
              />
            )}
            {flyRollSpeed === null ? null : (
              <ParaSlider
                label="Roll Speed"
                min={MIN_FLY_ROLL_SPEED_RADIANS_PER_SEC}
                max={MAX_FLY_ROLL_SPEED_RADIANS_PER_SEC}
                step={FLY_ROLL_SPEED_STEP_RADIANS_PER_SEC}
                value={flyRollSpeed}
                onChange={handleFlyRollSpeedChange}
                formatValue={formatFlyRollSpeedDegreesPerSec}
              />
            )}
          </div>
        ),
    },
    {
      key: 'transform',
      label: 'Transform',
      className: 'TransformSection',
      renderBody: () => (
        <>
          <div className="V15Wrap">
            <button type="button" onClick={toggleGizmo}>
              Gizmo {gizmoEnabled ? 'On' : 'Off'}
            </button>
            <button type="button" onClick={() => setGizmoModeValue('translate')}>
              Move
            </button>
            <button type="button" onClick={() => setGizmoModeValue('rotate')}>
              Rotate
            </button>
            <button type="button" onClick={() => setGizmoModeValue('scale')}>
              Scale
            </button>
            <button type="button" onClick={toggleGizmoSpace}>
              {gizmoSpace === 'local' ? 'Local' : 'World'}
            </button>
          </div>
          <div className="V15Meta">Mode: {gizmoMode}</div>
        </>
      ),
    },
    {
      key: 'snap',
      label: 'Snap',
      className: 'SnapSection',
      renderBody: () => (
        <>
          <div className="MiniFieldGrid">
            <label>
              Move Snap
              <input
                type="number"
                step={1}
                value={snapTranslate}
                onChange={(event) => setSnapTranslate(event.target.value)}
              />
            </label>
            <label>
              Rot Snap
              <input
                type="number"
                step={1}
                value={snapRotate}
                onChange={(event) => setSnapRotate(event.target.value)}
              />
            </label>
            <label>
              Scale Snap
              <input
                type="number"
                step={0.01}
                value={snapScale}
                onChange={(event) => setSnapScale(event.target.value)}
              />
            </label>
          </div>
          <button
            type="button"
            onClick={() =>
              withViewer((viewer) =>
                viewer.setGizmoSnap({
                  translate: {
                    x: numericValue(snapTranslate, 0),
                    y: numericValue(snapTranslate, 0),
                    z: numericValue(snapTranslate, 0),
                  },
                  rotate: {
                    x: numericValue(snapRotate, 0),
                    y: numericValue(snapRotate, 0),
                    z: numericValue(snapRotate, 0),
                  },
                  scale: {
                    x: numericValue(snapScale, 0),
                    y: numericValue(snapScale, 0),
                    z: numericValue(snapScale, 0),
                  },
                }),
              )
            }
          >
            Apply Snap
          </button>
        </>
      ),
    },
    {
      key: 'gizmo',
      label: 'Gizmo',
      className: 'GizmoSection',
      renderBody: () => (
        <div className="GizmoStyleControls">
          <ParaSlider
            label="Main Lines"
            min={0}
            max={1}
            step={0.02}
            value={view.axisOverlayStyle.mainLineOpacity}
            onChange={(value) => updateAxisOverlayStyle({ mainLineOpacity: value })}
            formatValue={(value) => `${Math.round(value * 100)}%`}
          />
          <ParaSlider
            label="Other Lines"
            min={0}
            max={1}
            step={0.02}
            value={view.axisOverlayStyle.secondaryLineOpacity}
            onChange={(value) => updateAxisOverlayStyle({ secondaryLineOpacity: value })}
            formatValue={(value) => `${Math.round(value * 100)}%`}
          />
          <ParaSlider
            label="Sphere Size"
            min={0.5}
            max={2}
            step={0.05}
            value={view.axisOverlayStyle.sphereScale}
            onChange={(value) => updateAxisOverlayStyle({ sphereScale: value })}
            formatValue={(value) => `${Math.round(value * 100)}%`}
          />
          <ParaSlider
            label="Camera Dolly"
            min={2.4}
            max={5.2}
            step={0.05}
            value={view.axisOverlayStyle.cameraDistance}
            onChange={(value) => updateAxisOverlayStyle({ cameraDistance: value })}
            formatValue={(value) => value.toFixed(2)}
          />
          <ParaSelect
            label="Labels"
            value={view.axisOverlayStyle.labelsVisible ? 'on' : 'off'}
            options={axisLabelVisibilityOptions}
            onChange={(value) => updateAxisOverlayStyle({ labelsVisible: value === 'on' })}
          />
          <ParaSelect
            label="Background"
            value={view.axisOverlayStyle.backgroundMode}
            options={axisBackgroundOptions}
            onChange={(value) =>
              updateAxisOverlayStyle({
                backgroundMode: value as typeof view.axisOverlayStyle.backgroundMode,
              })
            }
          />
          <ParaSelect
            label="Text Size"
            value={view.axisOverlayStyle.labelSize}
            options={axisLabelSizeOptions}
            onChange={(value) =>
              updateAxisOverlayStyle({
                labelSize: value as typeof view.axisOverlayStyle.labelSize,
              })
            }
          />
        </div>
      ),
    },
    {
      key: 'view',
      label: 'View',
      renderBody: () => (
        <>
          <ParaSelect
            label="Presentation"
            value={viewToolbarExpandedPresentationMode}
            options={viewToolbarPresentationOptions}
            onChange={(value) =>
              setViewToolbarExpandedPresentationMode(
                value as WorkspaceViewToolbarExpandedPresentationMode,
              )
            }
          />
          <ParaSelect
            label="Dock"
            value={viewToolbarDockMode}
            options={viewToolbarDockModeOptions}
            onChange={(value) => setViewToolbarDockMode(value as WorkspaceViewToolbarDockMode)}
          />
          <div className="ToggleList">
            <label>
              <input
                type="checkbox"
                checked={view.orbitEnabled}
                onChange={(event) => setViewKey('orbitEnabled', event.target.checked)}
              />
              Orbit Enabled
            </label>
            <label>
              <input
                type="checkbox"
                checked={view.gridVisible}
                onChange={(event) => setViewKey('gridVisible', event.target.checked)}
              />
              Grid
            </label>
            <label>
              <input
                type="checkbox"
                checked={view.axesVisible}
                onChange={(event) => setViewKey('axesVisible', event.target.checked)}
              />
              Axes
            </label>
            <label>
              <input
                type="checkbox"
                checked={view.wireframe}
                onChange={(event) => setViewKey('wireframe', event.target.checked)}
              />
              Wireframe
            </label>
            <label>
              <input
                type="checkbox"
                checked={view.axisOverlayEnabled}
                onChange={(event) => {
                  if (viewportId !== undefined) {
                    setViewportLocalViewState(viewportId, {
                      axisOverlayEnabled: event.target.checked,
                    })
                    return
                  }
                  setViewKey('axisOverlayEnabled', event.target.checked)
                }}
              />
              Axis Overlay
            </label>
          </div>
          <ParaSelect
            label="Shadows"
            value={view.shadowsEnabled ? 'on' : 'off'}
            options={shadowsEnabledOptions}
            onChange={(value) => setViewKey('shadowsEnabled', value === 'on')}
          />
          <ParaSelect
            label="Tone Mapping"
            value={view.toneMapping}
            options={toneMappingOptions}
            onChange={(value) => setViewKey('toneMapping', value as typeof view.toneMapping)}
          />
          <ParaSlider
            label="Exposure"
            value={view.exposure}
            min={0}
            max={2}
            step={0.05}
            formatValue={formatExposureValue}
            onChange={(value) => setViewKey('exposure', value)}
          />
        </>
      ),
    },
    {
      key: 'environment',
      label: 'Environment',
      renderBody: () => (
        <>
          <ParaSelect
            label="Preset"
            value={view.envPreset}
            options={envPresetOptions}
            onChange={(value) => setViewKey('envPreset', value as typeof view.envPreset)}
          />

          <div className="V15SectionLabel">Lighting</div>
          <div className="ItemList">
            {view.lighting.lights.map((light) => {
              const selected = light.id === view.lighting.selectedLightId
              return (
                <div
                  key={light.id}
                  className={`ListRow ${selected ? 'isSelected' : ''}`}
                  onClick={() => selectLight(light.id)}
                >
                  <input
                    type="checkbox"
                    checked={light.enabled}
                    onChange={(event) => {
                      event.stopPropagation()
                      updateLight(light.id, { enabled: event.target.checked })
                    }}
                    onClick={(event) => event.stopPropagation()}
                  />
                  <span className="ListRowName">{light.name}</span>
                  <span className="TypeChip">{light.type}</span>
                  <button
                    type="button"
                    className="IconButton"
                    onClick={(event) => {
                      event.stopPropagation()
                      deleteLight(light.id)
                    }}
                  >
                    Del
                  </button>
                </div>
              )
            })}
          </div>

          <div className="InlineEditorRow">
            <ParaSelect
              label="Add Light Type"
              value={addLightType}
              options={lightTypes.map((type) => ({
                value: type,
                label: lightTypeLabel(type),
              }))}
              onChange={(value) => setAddLightType(value as LightType)}
            />
            <input
              type="text"
              placeholder="Light name"
              value={addLightName}
              onChange={(event) => setAddLightName(event.target.value)}
            />
            <button
              type="button"
              onClick={() => {
                const name = addLightName.trim()
                addLight({
                  type: addLightType,
                  name: name.length > 0 ? name : undefined,
                })
                setAddLightName('')
              }}
            >
              Add Light
            </button>
          </div>

          {selectedLight === null ? null : (
            <div className="EditorPanel">
              <div className="MiniFieldGrid">
                <ParaSelect
                  label="Enabled"
                  value={selectedLight.enabled ? 'on' : 'off'}
                  options={enabledOptions}
                  onChange={(value) =>
                    updateLight(selectedLight.id, { enabled: value === 'on' })
                  }
                />
                <label>
                  Name
                  <input
                    type="text"
                    value={selectedLight.name}
                    onChange={(event) => updateLight(selectedLight.id, { name: event.target.value })}
                  />
                </label>
                <ParaSelect
                  label="Type"
                  value={selectedLight.type}
                  options={lightTypes.map((type) => ({
                    value: type,
                    label: lightTypeLabel(type),
                  }))}
                  onChange={(value) => {
                    const type = value as LightType
                    updateLight(selectedLight.id, {
                      type,
                      ...getLightTypeDefaults(type),
                    })
                  }}
                />
                <label>
                  Color
                  <input
                    type="color"
                    value={selectedLight.color}
                    onChange={(event) => updateLight(selectedLight.id, { color: event.target.value })}
                  />
                </label>
                <ParaSlider
                  label="Intensity"
                  min={0}
                  max={8}
                  step={0.05}
                  value={selectedLight.intensity}
                  onChange={(value) => updateLight(selectedLight.id, { intensity: value })}
                  formatValue={formatLightIntensityValue}
                />
              </div>

              {supportsPosition(selectedLight.type) ? (
                <ParaVec3Field
                  className="SelectedLightVectorField"
                  label="Position"
                  value={selectedLight.position ?? { x: 0, y: 0, z: 0 }}
                  min={-300}
                  max={300}
                  step={0.1}
                  onChangeAxis={(axis, value) =>
                    updateLight(selectedLight.id, {
                      position: updateVec3Axis(selectedLight.position, axis, value),
                    })
                  }
                  formatValue={(_axis, value) => value.toFixed(1)}
                  displayValue={(_axis, value) => value.toFixed(1)}
                />
              ) : null}

              {supportsTarget(selectedLight.type) ? (
                <ParaVec3Field
                  className="SelectedLightVectorField"
                  label="Target"
                  value={selectedLight.target ?? { x: 0, y: 0, z: 0 }}
                  min={-300}
                  max={300}
                  step={0.1}
                  onChangeAxis={(axis, value) =>
                    updateLight(selectedLight.id, {
                      target: updateVec3Axis(selectedLight.target, axis, value),
                    })
                  }
                  formatValue={(_axis, value) => value.toFixed(1)}
                  displayValue={(_axis, value) => value.toFixed(1)}
                />
              ) : null}

              {supportsDistance(selectedLight.type) ? (
                <div className="MiniFieldGrid">
                  <ParaSlider
                    label="Distance"
                    min={0}
                    max={50}
                    step={0.1}
                    value={selectedLight.distance ?? 0}
                    onChange={(value) => updateLight(selectedLight.id, { distance: value })}
                    formatValue={formatLightDistanceValue}
                  />
                  <ParaSlider
                    label="Decay"
                    min={0}
                    max={8}
                    step={0.1}
                    value={selectedLight.decay ?? 2}
                    onChange={(value) => updateLight(selectedLight.id, { decay: value })}
                    formatValue={formatLightDecayValue}
                  />
                </div>
              ) : null}

              {supportsSpot(selectedLight.type) ? (
                <div className="MiniFieldGrid">
                  <ParaSlider
                    label="Angle (deg)"
                    min={0}
                    max={89}
                    step={1}
                    value={selectedLight.angleDeg ?? 35}
                    onChange={(value) => updateLight(selectedLight.id, { angleDeg: value })}
                    formatValue={formatLightAngleValue}
                  />
                  <ParaSlider
                    label="Penumbra"
                    min={0}
                    max={1}
                    step={0.05}
                    value={selectedLight.penumbra ?? 0.2}
                    onChange={(value) => updateLight(selectedLight.id, { penumbra: value })}
                    formatValue={formatLightPenumbraValue}
                  />
                </div>
              ) : null}

              {supportsShadow(selectedLight.type) ? (
                <div className="MiniFieldGrid">
                  <ParaSelect
                    label="Cast Shadow"
                    value={selectedLight.castShadow ? 'on' : 'off'}
                    options={enabledOptions}
                    onChange={(value) =>
                      updateLight(selectedLight.id, { castShadow: value === 'on' })
                    }
                  />
                  <ParaSlider
                    label="Shadow Bias"
                    min={-0.01}
                    max={0.01}
                    step={0.0001}
                    value={selectedLight.shadowBias ?? -0.0003}
                    onChange={(value) => updateLight(selectedLight.id, { shadowBias: value })}
                    formatValue={formatLightShadowBiasValue}
                  />
                  <ParaSelect
                    label="Shadow Map"
                    value={`${selectedLight.shadowMapSize ?? 1024}`}
                    options={shadowMapOptions}
                    onChange={(value) =>
                      updateLight(selectedLight.id, { shadowMapSize: Number(value) })
                    }
                  />
                </div>
              ) : null}
            </div>
          )}
        </>
      ),
    },
    {
      key: 'ground',
      label: 'Ground',
      renderBody: () => (
        <>
          <ParaSelect
            label="Ground"
            value={view.ground.enabled ? 'on' : 'off'}
            options={groundEnabledOptions}
            onChange={(value) => setGround({ enabled: value === 'on' })}
          />
          <ParaSlider
            label="Ground Height"
            value={view.ground.height}
            min={-25}
            max={25}
            step={0.5}
            formatValue={(value) => value.toFixed(1)}
            onChange={(value) => setGround({ height: value })}
          />
          <ParaSelect
            label="Material"
            value={view.ground.materialPresetId}
            options={groundMaterialOptions}
            onChange={(value) => setGround({ materialPresetId: value as GroundMaterialPresetId })}
          />
        </>
      ),
    },
    {
      key: 'materials',
      label: 'Materials',
      renderBody: () => (
        <>
          <div className="ItemList">
            {view.materials.presets.map((preset) => {
              const selected = preset.id === view.materials.selectedPresetId
              return (
                <div
                  key={preset.id}
                  className={`ListRow ${selected ? 'isSelected' : ''}`}
                  onClick={() => selectMaterialPreset(preset.id)}
                >
                  <span className="Swatch" style={{ backgroundColor: preset.color }} />
                  <span className="ListRowName">{preset.name}</span>
                  <button
                    type="button"
                    className="IconButton"
                    onClick={(event) => {
                      event.stopPropagation()
                      deleteMaterialPreset(preset.id)
                    }}
                    disabled={view.materials.presets.length <= 1}
                  >
                    Del
                  </button>
                </div>
              )
            })}
          </div>

          <button type="button" onClick={() => addMaterialPreset()}>
            Add Preset
          </button>

          {selectedPreset === null ? null : (
            <div className="EditorPanel">
              <div className="MiniFieldGrid">
                <label>
                  Name
                  <input
                    type="text"
                    value={selectedPreset.name}
                    onChange={(event) =>
                      updateMaterialPreset(selectedPreset.id, { name: event.target.value })
                    }
                  />
                </label>
                <label>
                  Color
                  <input
                    type="color"
                    value={selectedPreset.color}
                    onChange={(event) =>
                      updateMaterialPreset(selectedPreset.id, { color: event.target.value })
                    }
                  />
                </label>
                <label>
                  Metalness
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={selectedPreset.metalness}
                    onChange={(event) =>
                      updateMaterialPreset(selectedPreset.id, {
                        metalness: Number(event.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  Roughness
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={selectedPreset.roughness}
                    onChange={(event) =>
                      updateMaterialPreset(selectedPreset.id, {
                        roughness: Number(event.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  Emissive
                  <input
                    type="color"
                    value={selectedPreset.emissive}
                    onChange={(event) =>
                      updateMaterialPreset(selectedPreset.id, { emissive: event.target.value })
                    }
                  />
                </label>
                <label>
                  Emissive Intensity
                  <input
                    type="number"
                    min={0}
                    max={2}
                    step={0.05}
                    value={selectedPreset.emissiveIntensity}
                    onChange={(event) =>
                      updateMaterialPreset(selectedPreset.id, {
                        emissiveIntensity: Number(event.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  Opacity
                  <input
                    type="number"
                    min={0}
                    max={1}
                    step={0.05}
                    value={selectedPreset.opacity}
                    onChange={(event) =>
                      updateMaterialPreset(selectedPreset.id, { opacity: Number(event.target.value) })
                    }
                  />
                </label>
                <label>
                  Transparent
                  <input
                    type="checkbox"
                    checked={selectedPreset.transparent}
                    onChange={(event) =>
                      updateMaterialPreset(selectedPreset.id, { transparent: event.target.checked })
                    }
                  />
                </label>
              </div>
            </div>
          )}

          <div className="V15SectionLabel">Per-Part Assignment</div>
          <label className="InlineCheck">
            <input
              type="checkbox"
              checked={view.materials.usePerPart}
              onChange={(event) => setUsePerPartMaterial(event.target.checked)}
            />
            Use per-part material map
          </label>

          <div className="ItemList">
            {parts.length === 0 ? (
              <div className="V15Meta">No parts yet.</div>
            ) : (
              parts.map((part) => {
                const partKeyStr = artifactToPartKeyStr(part)
                const assigned = view.materials.perPart[partKeyStr] ?? ''
                return (
                  <div key={partKeyStr} className="AssignmentRow">
                    <span className="ListRowName">{partKeyStrToLabel(partKeyStr)}</span>
                    <select
                      value={assigned}
                      onChange={(event) => {
                        const value = event.target.value as MaterialPresetId
                        if (value === '') {
                          clearPartMaterial(partKeyStr)
                          return
                        }
                        assignPartMaterial(partKeyStr, value)
                      }}
                    >
                      <option value="">Selected default</option>
                      {view.materials.presets.map((preset) => (
                        <option key={preset.id} value={preset.id}>
                          {preset.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="IconButton"
                      onClick={() => clearPartMaterial(partKeyStr)}
                    >
                      Clear
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </>
      ),
    },
  ]

  const isTabsPresentation = viewToolbarExpandedPresentationMode === 'tabs'
  const resolvedViewToolbarActiveTab = viewToolbarSections.some(
    (section) => section.key === viewToolbarActiveTab,
  )
    ? viewToolbarActiveTab
    : 'camera'

  const handleDockedViewToolbarSummaryPointerDown = (
    event: ReactPointerEvent<HTMLElement>,
  ) => {
    if (event.button !== 0 || viewportId === undefined) {
      return
    }
    if (event.target instanceof Element && event.target.closest('button') !== null) {
      return
    }
    event.preventDefault()
    pendingViewToolbarDetachRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
    }
  }

  const handleViewToolbarToggleClick = (event: ReactMouseEvent<HTMLElement>) => {
    event.preventDefault()
    pendingViewToolbarDetachRef.current = null
    if (viewportId !== undefined) {
      setViewportLocalViewState(viewportId, {
        viewToolbarOpen: !viewToolbarOpen,
      })
    }
  }

  const handleFloatingViewToolbarHeaderPointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (event.button !== 0) {
      return
    }
    if (event.target instanceof Element && event.target.closest('button') !== null) {
      return
    }
    const floatingWindowRect = viewToolbarFloatingWindowRef.current?.getBoundingClientRect() ?? null
    if (floatingWindowRect === null) {
      return
    }
    viewToolbarFloatingDragStateRef.current = {
      pointerId: event.pointerId,
      pointerOffsetX: Math.round(event.clientX - floatingWindowRect.left),
      pointerOffsetY: Math.round(event.clientY - floatingWindowRect.top),
      width: Math.round(floatingWindowRect.width),
      height: Math.round(floatingWindowRect.height),
    }
    event.preventDefault()
  }

  const handleFloatingViewToolbarResizeHandlePointerDown = (
    direction: ViewToolbarFloatingResizeDirection,
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (event.button !== 0) {
      return
    }
    viewToolbarFloatingDragStateRef.current = null
    viewToolbarFloatingResizeStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      direction,
      anchorRect: resolvedViewToolbarFloatingRect,
    }
    event.preventDefault()
    event.stopPropagation()
  }

  const handleQuickDockViewToolbar = () => {
    if (viewportId === undefined) {
      return
    }
    viewToolbarFloatingDragStateRef.current = null
    viewToolbarFloatingResizeStateRef.current = null
    setViewportLocalViewState(viewportId, {
      viewToolbarHostMode: 'docked',
    })
  }

  const viewToolbarContextMenuElement = (
    <SpaghettiContextMenu
      open={viewToolbarContextMenu !== null}
      x={viewToolbarContextMenu?.x ?? 0}
      y={viewToolbarContextMenu?.y ?? 0}
      onClose={() => setViewToolbarContextMenu(null)}
      containerClassName="ViewToolbarContextMenu"
      items={[
        {
          id: 'view-toolbar-presentation-classic',
          label: 'Classic',
          disabled: viewToolbarExpandedPresentationMode === 'classic',
          onSelect: () => {
            setViewToolbarExpandedPresentationMode('classic')
            setViewToolbarContextMenu(null)
          },
        },
        {
          id: 'view-toolbar-presentation-tabs',
          label: 'Tabs',
          disabled: viewToolbarExpandedPresentationMode === 'tabs',
          onSelect: () => {
            setViewToolbarExpandedPresentationMode('tabs')
            setViewToolbarContextMenu(null)
          },
        },
      ]}
    />
  )

  if (isViewToolbarFloating) {
    return (
      <div
        className="ViewToolbarFloatingWindow"
        ref={viewToolbarFloatingWindowRef}
        data-workspace-viewport-id={viewportId}
        data-view-toolbar-host-mode="floating"
        onContextMenu={(event) => {
          if (!viewToolbarOpen || shouldIgnoreViewToolbarShellContextMenu(event.target)) {
            return
          }
          event.preventDefault()
          event.stopPropagation()
          openViewToolbarContextMenu(event.clientX, event.clientY)
        }}
        style={{
          position: 'absolute',
          left: `${resolvedViewToolbarFloatingRect.x}px`,
          top: `${resolvedViewToolbarFloatingRect.y}px`,
          width: `${resolvedViewToolbarFloatingRect.width}px`,
          height: `${resolvedViewToolbarFloatingRect.height}px`,
          zIndex: 19,
          display: 'grid',
          gridTemplateRows: `${VIEW_TOOLBAR_FLOATING_TITLEBAR_HEIGHT}px minmax(0, 1fr)`,
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '12px',
          overflow: 'hidden',
          background: 'rgba(8, 11, 17, 0.96)',
          boxShadow: '0 18px 44px rgba(0, 0, 0, 0.4)',
        }}
      >
        {viewToolbarFloatingResizeDirections.map((direction) => (
          <div
            key={direction}
            aria-hidden="true"
            className={`ViewToolbarFloatingResizeHandle ViewToolbarFloatingResizeHandle--${direction}`}
            data-view-toolbar-resize-handle={direction}
            onPointerDown={(event) =>
              handleFloatingViewToolbarResizeHandlePointerDown(direction, event)
            }
            style={resolveViewToolbarFloatingResizeHandleStyle(direction)}
          />
        ))}
        <div
          className="ViewToolbarFloatingWindowHeader"
          onPointerDown={handleFloatingViewToolbarHeaderPointerDown}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            padding: '0 10px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.04)',
            color: 'rgba(241,244,255,0.94)',
            cursor: 'grab',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
        >
          <span>View</span>
          <FloatingWindowQuickDockButton
            className="ViewToolbarFloatingWindowQuickDock"
            onClick={handleQuickDockViewToolbar}
          />
        </div>
        <div
          className="V15Panel ViewToolbarRoot ViewToolbarFloatingWindowBody"
          data-scrollable="true"
          style={{
            maxHeight: '100%',
            height: '100%',
            minHeight: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <div
            className={`ViewToolbarPanel ${isTabsPresentation ? 'ViewToolbarPanel--tabs' : ''}`}
            data-presentation={isTabsPresentation ? 'tabs' : 'classic'}
            style={{
              marginTop: 0,
              padding: `12px 12px ${viewToolbarBottomContentPadding}px`,
            }}
          >
            <ViewToolbarBody
              sections={viewToolbarSections}
              isTabsPresentation={isTabsPresentation}
              activeTab={resolvedViewToolbarActiveTab}
              onSelectTab={setViewToolbarActiveTab}
            />
          </div>
        </div>
        {viewToolbarContextMenuElement}
      </div>
    )
  }

  return (
    <aside
      ref={rightDockRef}
      className={`RightDock ${viewToolbarOpen ? 'isExpanded' : 'isCompact'}`}
      data-workspace-viewport-id={viewportId}
      data-view-toolbar-dock-mode={effectiveViewToolbarDockMode}
      data-view-toolbar-host-mode="docked"
      style={{
        width: `${rightDockWidth}px`,
        minWidth: `${rightDockWidth}px`,
        maxWidth: `${rightDockWidth}px`,
        paddingTop: `${resolveViewAnchorTop(
          resolvedAxisWidgetSize,
          viewToolbarDockMode,
          viewToolbarOpen,
        )}px`,
        ['--v15-view-toolbar-content-padding-bottom' as string]: `${viewToolbarBottomContentPadding}px`,
      }}
    >
      <div className="RightPanelStack" ref={rightPanelStackRef}>
        <details
          className="V15Panel ViewToolbarRoot ViewToolbarScrollSurface"
          open={viewToolbarOpen}
          ref={viewToolbarRootRef}
          data-scrollable={viewToolbarHasOverflow ? 'true' : 'false'}
          onContextMenu={(event) => {
            if (!viewToolbarOpen || shouldIgnoreViewToolbarShellContextMenu(event.target)) {
              return
            }
            event.preventDefault()
            event.stopPropagation()
            openViewToolbarContextMenu(event.clientX, event.clientY)
          }}
          style={{
            ['--v15-view-toolbar-max-height' as string]:
              viewToolbarMaxHeight !== null ? `${viewToolbarMaxHeight}px` : undefined,
            ['--v15-view-toolbar-used-height' as string]:
              viewToolbarUsedHeight !== null ? `${viewToolbarUsedHeight}px` : undefined,
          }}
        >
          <summary
            className="V15PanelTitle ViewToolbarToggle"
            onPointerDown={handleDockedViewToolbarSummaryPointerDown}
            onClick={handleViewToolbarToggleClick}
          >
            View
          </summary>
          <div
            className={`ViewToolbarPanel ${isTabsPresentation ? 'ViewToolbarPanel--tabs' : ''}`}
            ref={viewToolbarPanelRef}
            data-presentation={isTabsPresentation ? 'tabs' : 'classic'}
          >
            <ViewToolbarBody
              sections={viewToolbarSections}
              isTabsPresentation={isTabsPresentation}
              activeTab={resolvedViewToolbarActiveTab}
              onSelectTab={setViewToolbarActiveTab}
            />
          </div>
          {viewToolbarContextMenuElement}
        </details>
      </div>
    </aside>
  )
}
