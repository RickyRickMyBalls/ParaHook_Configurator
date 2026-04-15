import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type {
  LightSpec,
  LightType,
  MaterialPreset,
  MaterialPresetId,
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
  type CameraPreset,
  type GizmoMode,
  type GizmoSpace,
  type ViewerApi,
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
import type { WorkspaceViewportId } from '../workspace/workspaceShellTypes'

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
const MIN_FLY_ROLL_SPEED_RADIANS_PER_SEC = 0
const MAX_FLY_ROLL_SPEED_RADIANS_PER_SEC = Math.PI * 2
const FLY_ROLL_SPEED_STEP_RADIANS_PER_SEC = 0.05

const numericValue = (value: string, fallback: number): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const formatFlyRollSpeedDegreesPerSec = (speed: number): string =>
  `${Math.round((speed * 180) / Math.PI)} deg/s`

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
  const rightPanelStackRef = useRef<HTMLDivElement | null>(null)
  const viewToolbarRootRef = useRef<HTMLDetailsElement | null>(null)
  const viewToolbarPanelRef = useRef<HTMLDivElement | null>(null)
  const viewerTargetParts = useSpaghettiStore(selectViewerTargetGraphAcceptedBuildOutputs)
  const selectedPartKey = useAppStore((state) => state.selectedPartKey)
  const parts = viewerTargetParts

  const globalView = useUiPrefsStore((state) => state.view)
  const setView = useUiPrefsStore((state) => state.setView)
  const setViewKey = useUiPrefsStore((state) => state.setViewKey)
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
  const [addLightType, setAddLightType] = useState<LightType>('point')
  const [addLightName, setAddLightName] = useState('')
  const [viewToolbarMaxHeight, setViewToolbarMaxHeight] = useState<number | null>(null)
  const [viewToolbarUsedHeight, setViewToolbarUsedHeight] = useState<number | null>(null)
  const [viewToolbarHasOverflow, setViewToolbarHasOverflow] = useState(false)

  const selectedLight = useMemo(
    () => view.lighting.lights.find((light) => light.id === view.lighting.selectedLightId) ?? null,
    [view.lighting.lights, view.lighting.selectedLightId],
  )

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

  const toggleGizmo = () => {
    const next = !gizmoEnabled
    setGizmoEnabled(next)
    withViewer((viewer) => viewer.setGizmoEnabled(next))
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
  const dockedConsoleCollapsedReserve = 45
  const dockedConsoleExpandedGap = 20
  const dockedConsoleReserve =
    consoleWindowMode !== 'docked'
      ? 0
      : consoleIsExpanded
        ? consoleExpandedHeight + dockedConsoleExpandedGap
        : dockedConsoleCollapsedReserve
  const viewToolbarBottomContentPadding = 12

  useLayoutEffect(() => {
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
      panelElement.querySelectorAll<HTMLDetailsElement>('.ViewSection'),
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
  }, [dockedConsoleReserve, rightDockWidth, viewToolbarOpen])

  return (
    <aside
      className={`RightDock ${viewToolbarOpen ? 'isExpanded' : 'isCompact'}`}
      data-workspace-viewport-id={viewportId}
      style={{
        width: `${rightDockWidth}px`,
        minWidth: `${rightDockWidth}px`,
        maxWidth: `${rightDockWidth}px`,
        paddingTop: `${resolveViewAnchorTop(resolvedAxisWidgetSize)}px`,
        ['--v15-view-toolbar-content-padding-bottom' as string]: `${viewToolbarBottomContentPadding}px`,
      }}
    >
      <div className="RightPanelStack" ref={rightPanelStackRef}>
        <details
          className="V15Panel ViewToolbarRoot ViewToolbarScrollSurface"
          open={viewToolbarOpen}
          ref={viewToolbarRootRef}
          data-scrollable={viewToolbarHasOverflow ? 'true' : 'false'}
          style={{
            ['--v15-view-toolbar-max-height' as string]:
              viewToolbarMaxHeight !== null ? `${viewToolbarMaxHeight}px` : undefined,
            ['--v15-view-toolbar-used-height' as string]:
              viewToolbarUsedHeight !== null ? `${viewToolbarUsedHeight}px` : undefined,
          }}
        >
          <summary
            className="V15PanelTitle ViewToolbarToggle"
            onClick={(event) => {
              event.preventDefault()
              if (viewportId !== undefined) {
                setViewportLocalViewState(viewportId, {
                  viewToolbarOpen: !viewToolbarOpen,
                })
              }
            }}
          >
            View
          </summary>
          <div className="ViewToolbarPanel" ref={viewToolbarPanelRef}>
          <details className="ViewSection CameraSection ViewStyledSection">
            <summary>Camera</summary>
            <div className="V15Wrap CameraToolbar">
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
          </details>

          <details className="ViewSection FlyModeSection ViewStyledSection">
            <summary>Fly Mode</summary>
            {flyModeType === null && flyActivationMode === null && flyRollSpeed === null ? (
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
            )}
          </details>

          <details className="ViewSection TransformSection ViewStyledSection">
            <summary>Transform</summary>
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
          </details>

          <details className="ViewSection SnapSection ViewStyledSection">
            <summary>Snap</summary>
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
          </details>

          <details className="ViewSection GizmoSection ViewStyledSection">
            <summary>Gizmo</summary>
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
          </details>

          <details className="ViewSection ViewStyledSection">
            <summary>View</summary>
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
                  checked={view.shadowsEnabled}
                  onChange={(event) => setViewKey('shadowsEnabled', event.target.checked)}
                />
                Shadows
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
            <div className="MiniFieldGrid">
              <label>
                Tone Mapping
                <select
                  value={view.toneMapping}
                  onChange={(event) =>
                    setViewKey('toneMapping', event.target.value as typeof view.toneMapping)
                  }
                >
                  <option value="none">None</option>
                  <option value="aces">ACES</option>
                </select>
              </label>
              <label>
                Exposure
                <input
                  type="range"
                  min={0}
                  max={2}
                  step={0.05}
                  value={view.exposure}
                  onChange={(event) => setViewKey('exposure', Number(event.target.value))}
                />
              </label>
              <label>
                Exposure Value
                <input
                  type="number"
                  min={0}
                  max={2}
                  step={0.05}
                  value={view.exposure}
                  onChange={(event) => setViewKey('exposure', Number(event.target.value))}
                />
              </label>
            </div>
          </details>

          <details className="ViewSection ViewStyledSection">
            <summary>Environment</summary>
            <div className="MiniFieldGrid">
              <label>
                Preset
                <select
                  value={view.envPreset}
                  onChange={(event) =>
                    setViewKey('envPreset', event.target.value as typeof view.envPreset)
                  }
                >
                  <option value="none">None</option>
                  <option value="studio">Studio</option>
                </select>
              </label>
            </div>

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
              <select
                value={addLightType}
                onChange={(event) => setAddLightType(event.target.value as LightType)}
              >
                {lightTypes.map((type) => (
                  <option key={type} value={type}>
                    {lightTypeLabel(type)}
                  </option>
                ))}
              </select>
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
                  <label>
                    Enabled
                    <input
                      type="checkbox"
                      checked={selectedLight.enabled}
                      onChange={(event) =>
                        updateLight(selectedLight.id, { enabled: event.target.checked })
                      }
                    />
                  </label>
                  <label>
                    Name
                    <input
                      type="text"
                      value={selectedLight.name}
                      onChange={(event) =>
                        updateLight(selectedLight.id, { name: event.target.value })
                      }
                    />
                  </label>
                  <label>
                    Type
                    <select
                      value={selectedLight.type}
                      onChange={(event) => {
                        const type = event.target.value as LightType
                        updateLight(selectedLight.id, {
                          type,
                          ...getLightTypeDefaults(type),
                        })
                      }}
                    >
                      {lightTypes.map((type) => (
                        <option key={type} value={type}>
                          {lightTypeLabel(type)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Color
                    <input
                      type="color"
                      value={selectedLight.color}
                      onChange={(event) =>
                        updateLight(selectedLight.id, { color: event.target.value })
                      }
                    />
                  </label>
                  <label>
                    Intensity
                    <input
                      type="range"
                      min={0}
                      max={8}
                      step={0.05}
                      value={selectedLight.intensity}
                      onChange={(event) =>
                        updateLight(selectedLight.id, { intensity: Number(event.target.value) })
                      }
                    />
                  </label>
                  <label>
                    Intensity Value
                    <input
                      type="number"
                      min={0}
                      max={8}
                      step={0.05}
                      value={selectedLight.intensity}
                      onChange={(event) =>
                        updateLight(selectedLight.id, { intensity: Number(event.target.value) })
                      }
                    />
                  </label>
                </div>

                {supportsPosition(selectedLight.type) ? (
                  <div className="VectorFieldGrid">
                    <span>Position</span>
                    <input type="number" step={0.1} value={selectedLight.position?.x ?? 0} onChange={(event) => updateLight(selectedLight.id, { position: { x: Number(event.target.value), y: selectedLight.position?.y ?? 0, z: selectedLight.position?.z ?? 0 } })} />
                    <input type="number" step={0.1} value={selectedLight.position?.y ?? 0} onChange={(event) => updateLight(selectedLight.id, { position: { x: selectedLight.position?.x ?? 0, y: Number(event.target.value), z: selectedLight.position?.z ?? 0 } })} />
                    <input type="number" step={0.1} value={selectedLight.position?.z ?? 0} onChange={(event) => updateLight(selectedLight.id, { position: { x: selectedLight.position?.x ?? 0, y: selectedLight.position?.y ?? 0, z: Number(event.target.value) } })} />
                  </div>
                ) : null}

                {supportsTarget(selectedLight.type) ? (
                  <div className="VectorFieldGrid">
                    <span>Target</span>
                    <input type="number" step={0.1} value={selectedLight.target?.x ?? 0} onChange={(event) => updateLight(selectedLight.id, { target: { x: Number(event.target.value), y: selectedLight.target?.y ?? 0, z: selectedLight.target?.z ?? 0 } })} />
                    <input type="number" step={0.1} value={selectedLight.target?.y ?? 0} onChange={(event) => updateLight(selectedLight.id, { target: { x: selectedLight.target?.x ?? 0, y: Number(event.target.value), z: selectedLight.target?.z ?? 0 } })} />
                    <input type="number" step={0.1} value={selectedLight.target?.z ?? 0} onChange={(event) => updateLight(selectedLight.id, { target: { x: selectedLight.target?.x ?? 0, y: selectedLight.target?.y ?? 0, z: Number(event.target.value) } })} />
                  </div>
                ) : null}

                {supportsDistance(selectedLight.type) ? (
                  <div className="MiniFieldGrid">
                    <label>
                      Distance
                      <input type="number" min={0} step={0.1} value={selectedLight.distance ?? 0} onChange={(event) => updateLight(selectedLight.id, { distance: Number(event.target.value) })} />
                    </label>
                    <label>
                      Decay
                      <input type="number" min={0} step={0.1} value={selectedLight.decay ?? 2} onChange={(event) => updateLight(selectedLight.id, { decay: Number(event.target.value) })} />
                    </label>
                  </div>
                ) : null}

                {supportsSpot(selectedLight.type) ? (
                  <div className="MiniFieldGrid">
                    <label>
                      Angle (deg)
                      <input type="number" min={0} max={89} step={1} value={selectedLight.angleDeg ?? 35} onChange={(event) => updateLight(selectedLight.id, { angleDeg: Number(event.target.value) })} />
                    </label>
                    <label>
                      Penumbra
                      <input type="number" min={0} max={1} step={0.05} value={selectedLight.penumbra ?? 0.2} onChange={(event) => updateLight(selectedLight.id, { penumbra: Number(event.target.value) })} />
                    </label>
                  </div>
                ) : null}

                {supportsShadow(selectedLight.type) ? (
                  <div className="MiniFieldGrid">
                    <label>
                      Cast Shadow
                      <input type="checkbox" checked={selectedLight.castShadow ?? false} onChange={(event) => updateLight(selectedLight.id, { castShadow: event.target.checked })} />
                    </label>
                    <label>
                      Shadow Bias
                      <input type="number" step={0.0001} value={selectedLight.shadowBias ?? -0.0003} onChange={(event) => updateLight(selectedLight.id, { shadowBias: Number(event.target.value) })} />
                    </label>
                    <label>
                      Shadow Map
                      <select value={selectedLight.shadowMapSize ?? 1024} onChange={(event) => updateLight(selectedLight.id, { shadowMapSize: Number(event.target.value) })}>
                        {shadowSizes.map((size) => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                ) : null}
              </div>
            )}
          </details>

          <details className="ViewSection ViewStyledSection">
            <summary>Materials</summary>
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
                    <input type="text" value={selectedPreset.name} onChange={(event) => updateMaterialPreset(selectedPreset.id, { name: event.target.value })} />
                  </label>
                  <label>
                    Color
                    <input type="color" value={selectedPreset.color} onChange={(event) => updateMaterialPreset(selectedPreset.id, { color: event.target.value })} />
                  </label>
                  <label>
                    Metalness
                    <input type="range" min={0} max={1} step={0.01} value={selectedPreset.metalness} onChange={(event) => updateMaterialPreset(selectedPreset.id, { metalness: Number(event.target.value) })} />
                  </label>
                  <label>
                    Roughness
                    <input type="range" min={0} max={1} step={0.01} value={selectedPreset.roughness} onChange={(event) => updateMaterialPreset(selectedPreset.id, { roughness: Number(event.target.value) })} />
                  </label>
                  <label>
                    Emissive
                    <input type="color" value={selectedPreset.emissive} onChange={(event) => updateMaterialPreset(selectedPreset.id, { emissive: event.target.value })} />
                  </label>
                  <label>
                    Emissive Intensity
                    <input type="number" min={0} max={2} step={0.05} value={selectedPreset.emissiveIntensity} onChange={(event) => updateMaterialPreset(selectedPreset.id, { emissiveIntensity: Number(event.target.value) })} />
                  </label>
                  <label>
                    Opacity
                    <input type="number" min={0} max={1} step={0.05} value={selectedPreset.opacity} onChange={(event) => updateMaterialPreset(selectedPreset.id, { opacity: Number(event.target.value) })} />
                  </label>
                  <label>
                    Transparent
                    <input type="checkbox" checked={selectedPreset.transparent} onChange={(event) => updateMaterialPreset(selectedPreset.id, { transparent: event.target.checked })} />
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
                      <button type="button" className="IconButton" onClick={() => clearPartMaterial(partKeyStr)}>
                        Clear
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          </details>
          </div>
        </details>
      </div>
    </aside>
  )
}
