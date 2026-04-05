import {
  memo,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from 'react'
import type { PortSpec, SpaghettiNode } from '../schema/spaghettiTypes'
import type { SketchComponent, SketchFeature } from '../features/featureTypes'
import type { PartRowOrderSection } from '../parts/partRowOrder'
import {
  getFieldTree,
  isCompositeFieldNode,
  listLeafFieldPaths,
} from '../types/fieldTree'
import { SpaghettiContextMenu } from '../ui/SpaghettiContextMenu'
import { FeatureStackView } from '../ui/FeatureStackView'
import {
  GeometryNodeShell,
  type GeometryNodeShellChip,
} from './GeometryNodeShell'
import {
  getDefaultStructuredWireBlockOpen,
  getDefaultStructuredWireRowMode,
  isWiringSurfaceSection,
  type NodeTemplateBlockId,
  type StructuredWireRowMode,
} from './nodeTemplateContract'
import {
  createStructuredWireRowController,
} from './structuredWireRowController'
import { createStructuredWireNumericRowProps } from './structuredWireNumericRowProps'
import { createStructuredWireEnumRowProps } from './structuredWireEnumRowProps'
import { StructuredWireEnumRow } from './StructuredWireEnumRow'
import { PortView, type PortDetailLine } from './PortView'
import type { CompositeExpansionDirection } from './compositeExpansion'
import { NumberField } from './fields/NumberField'
import { Vec2Field } from './fields/Vec2Field'
import { getTypeColor, STRUCTURED_WIRE_ENUM_INPUT_COLOR } from './typeColors'
import { ParaSelect } from '../../components/ParaSelect'
import { ParaSlider } from '../../components/ParaSlider'
import { useAppStore } from '../../store/useAppStore'
import type {
  DriverControlRowVm,
  DriverEndpointRowVm,
  DriverNumberChange,
  InputEndpointRowVm,
  OutputPinnedRowVm,
} from './driverVm'
import type { PortDirection } from './types'
import { getNextViewMode, getRowViewFlags, type ViewMode } from './rowViewMode'
import {
  buildCompositeCollapseKey,
  buildGroupCollapseKey,
  buildSectionCollapseKey,
  useSpaghettiUiStore,
} from './state/spaghettiUiStore'
import { isInteractiveTarget, SP_INTERACTIVE_PROPS } from '../spInteractive'
import { OUTPUT_PREVIEW_NODE_TYPE } from '../system/outputPreviewNode'
import type {
  DriverRowWarningVm,
  DriverSectionGroupVm,
  ExtrudeNodeVm,
  FeatureDependencyEdge,
  FeatureDependencyRow,
  NodeInputCompositeState,
  OutputPreviewSlotRowVm,
  SketchNodeVm,
  UtilityNodeVm,
} from '../selectors'
import { useSpaghettiStore } from '../store/useSpaghettiStore'
import { setNodeParams as setNodeParamsCommand } from '../graphCommands/setNodeParams'

const DEV = import.meta.env.DEV
const DEV_PROBE_NODE_ID_KEY = '__SP_PROBE_NODE_ID'
type DevProbeWindow = Window & { [DEV_PROBE_NODE_ID_KEY]?: string }

const SECTION_IDS = {
  drivers: 'drivers',
  inputs: 'inputs',
  featureStack: 'featureStack',
  outputs: 'outputs',
  sketchProfile: 'sketch-profile',
  legacy: 'legacy',
  legacySectionPrefix: 'legacy-section',
  otherOutputs: 'otherOutputs',
} as const

type PortDropState = 'compatible' | 'incompatible' | null

type EndpointPayload = {
  nodeId: string
  portId: string
  path?: string[]
}

type CompositeContextMenuState = {
  x: number
  y: number
  portId: string
}

type GeometryBlockId = NodeTemplateBlockId

export type FeatureVirtualInputStateByPortId = Record<
  string,
  {
    driven: boolean
    connectionCount: number
    unresolved: boolean
    drivenValue?: number
  }
>

type NodeViewProps = {
  node: SpaghettiNode
  x: number
  y: number
  title: string
  nodeMode?: ViewMode
  template?: 'part' | 'sketch' | 'extrude'
  utilityVm?: UtilityNodeVm
  sketchVm?: SketchNodeVm
  extrudeVm?: ExtrudeNodeVm
  allInputs: PortSpec[]
  allOutputs: PortSpec[]
  drivers?: DriverControlRowVm[]
  inputs?: InputEndpointRowVm[]
  outputs?: OutputPinnedRowVm[]
  otherOutputs?: DriverEndpointRowVm[]
  outputPreviewComponentLabel?: string
  outputPreviewRows?: OutputPreviewSlotRowVm[]
  uiSections?: Array<{ sectionId: string; label: string; items: string[] }>
  presetOptions?: string[]
  inputPortDetails?: Record<string, PortDetailLine[]>
  outputPortDetails?: Record<string, PortDetailLine[]>
  driverInputPortByRowId?: Record<string, PortSpec>
  driverOutputPortByRowId?: Record<string, PortSpec>
  driverDrivenStateByRowId?: Record<
    string,
    {
      driven: boolean
      connectionCount: number
      resolvedValue?: unknown
      unresolved: boolean
    }
  >
  driverWarningByRowId?: Record<string, DriverRowWarningVm>
  driverGroups?: DriverSectionGroupVm[]
  driverRowIndexById?: Record<string, number>
  featureRows?: FeatureDependencyRow[]
  featureRowIndexById?: Record<string, number>
  internalDependencyEdges?: FeatureDependencyEdge[]
  inputRowIndexById?: Record<string, number>
  outputEndpointIndexByRowId?: Record<string, number>
  outputEndpointCount?: number
  featureVirtualInputStateByPortId?: FeatureVirtualInputStateByPortId
  inputCompositeState: NodeInputCompositeState
  compositeExpansionRevision: number
  getCompositeExpanded: (
    direction: CompositeExpansionDirection,
    nodeId: string,
    portId: string,
  ) => boolean
  setCompositeExpanded: (
    direction: CompositeExpansionDirection,
    nodeId: string,
    portId: string,
    expanded: boolean,
  ) => void
  selected: boolean
  previewed?: boolean
  getInputDropState: (payload: EndpointPayload) => PortDropState
  getOutputDropState: (payload: EndpointPayload) => PortDropState
  onPresetChange: (nodeId: string, presetId: string) => void
  onDriverNumberChange: (
    nodeId: string,
    change: DriverNumberChange,
    value: number,
  ) => void
  onUtilityNumberValueChange: (nodeId: string, value: number) => void
  onUtilityBooleanValueChange: (nodeId: string, value: boolean) => void
  onUtilityVec2AxisChange: (nodeId: string, axis: 'x' | 'y', value: number) => void
  onOutputPreviewComponentLabelChange?: (nodeId: string, value: string) => void
  onOutputPreviewObjectLabelChange?: (nodeId: string, objectId: string, value: string) => void
  onMoveSectionRow?: (
    nodeId: string,
    section: PartRowOrderSection,
    rowId: string,
    direction: 'up' | 'down',
  ) => void
  outputRowMinHeight: number
  onOutputRowMinHeightChange: (value: number) => void
  pinDotSize: number
  onPinDotSizeChange: (value: number) => void
  onNodeHeaderPointerDown: (
    event: PointerEvent<HTMLElement>,
    nodeId: string,
  ) => void
  onNodeBodyPointerDown: (event: PointerEvent<HTMLElement>, nodeId: string) => void
  onNodeTitleClick: (nodeId: string) => void
  onRegisterPortElement: (
    nodeId: string,
    direction: PortDirection,
    portId: string,
    path: string[] | undefined,
    element: HTMLElement | null,
  ) => void
  onOutputPointerDown: (
    event: PointerEvent<HTMLElement>,
    payload: EndpointPayload,
  ) => void
  onOutputPointerEnter: (payload: EndpointPayload) => void
  onOutputPointerLeave: (payload: EndpointPayload) => void
  onInputPointerDown: (
    event: PointerEvent<HTMLElement>,
    payload: EndpointPayload,
  ) => void
  onInputPointerEnter: (payload: EndpointPayload) => void
  onInputPointerLeave: (payload: EndpointPayload) => void
}

type InternalDependencyPathVm = {
  id: string
  d: string
  className: string
}

const endpointKey = (
  direction: PortDirection,
  portId: string,
  path?: string[],
): string => `${direction}::${portId}::${path?.join('.') ?? ''}`

const leafLabel = (path: string[], fallback?: string): string => {
  if (path.length <= 1 && fallback !== undefined && fallback.length > 0) {
    return fallback
  }
  const fromPath = path
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('.')
  if (fromPath.length > 0) {
    return fromPath
  }
  if (fallback !== undefined && fallback.length > 0) {
    return fallback
  }
  return 'Value'
}

const pathKey = (path: string[] | undefined): string =>
  path === undefined || path.length === 0 ? '' : path.join('.')

const leafPortPathKey = (portId: string, path: string[] | undefined): string =>
  `${portId}::${pathKey(path)}`

const formatPinValue = (value: number): string => {
  if (!Number.isFinite(value)) {
    return '0'
  }
  const rounded = Math.round(value * 1000) / 1000
  return Number.isInteger(rounded) ? rounded.toString() : rounded.toString()
}

const formatSketchPoint = (point: { x: number; y: number }): string =>
  `(${formatPinValue(point.x)}, ${formatPinValue(point.y)})`

const formatSketchComponentSummary = (component: SketchComponent): string => {
  if (component.type === 'line') {
    return `${formatSketchPoint(component.a)} -> ${formatSketchPoint(component.b)}`
  }
  if (component.type === 'spline') {
    return `${formatSketchPoint(component.p0)} -> ${formatSketchPoint(component.p3)}`
  }
  if (component.type === 'arc3pt') {
    return `${formatSketchPoint(component.start)} -> ${formatSketchPoint(component.end)}`
  }
  if (component.type === 'rectangle') {
    return `${formatPinValue(Math.abs(component.b.x - component.a.x))} x ${formatPinValue(
      Math.abs(component.b.y - component.a.y),
    )}`
  }
  const radius = Math.hypot(
    component.edge.x - component.center.x,
    component.edge.y - component.center.y,
  )
  return `r ${formatPinValue(radius)} @ ${formatSketchPoint(component.center)}`
}

const sketchComponentTitle = (component: SketchComponent): string => {
  if (component.type === 'line') return 'Line'
  if (component.type === 'spline') return 'BezierSpline'
  if (component.type === 'arc3pt') return 'Arc3Point'
  if (component.type === 'rectangle') return 'Rectangle'
  return 'Circle'
}

const sketchProfileSummaryLabel = (
  profileCount: number,
  hasSelectedProfile: boolean,
  selectedProfile: { profileId: string; area: number } | null,
): string => {
  if (profileCount === 0) {
    return 'no profiles'
  }
  if (hasSelectedProfile) {
    if (selectedProfile === null) {
      return '1 ready'
    }
    return `selected ${selectedProfile.profileId.slice(0, 8)}`
  }
  return `${profileCount} profiles`
}

const buildDependencyPath = (
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
): string => {
  const deltaX = Math.max(18, Math.abs(toX - fromX) * 0.45)
  const controlAX = fromX + deltaX
  const controlBX = toX - deltaX
  return `M ${fromX} ${fromY} C ${controlAX} ${fromY}, ${controlBX} ${toY}, ${toX} ${toY}`
}

const fallbackDependencyClassName = (edge: FeatureDependencyEdge): string =>
  `SpaghettiInternalDependencyWire ${
    edge.kind === 'driverToFeature'
      ? 'SpaghettiInternalDependencyWire--driver'
      : 'SpaghettiInternalDependencyWire--feature'
  } ${edge.effective ? '' : 'SpaghettiInternalDependencyWire--inactive'} ${
    edge.enabled ? '' : 'SpaghettiInternalDependencyWire--disabled'
  }`

function NodeViewComponent({
  node,
  x,
  y,
  title,
  nodeMode = 'essentials',
  template,
  utilityVm,
  sketchVm,
  extrudeVm,
  allInputs,
  allOutputs,
  drivers,
  inputs,
  outputs,
  otherOutputs,
  outputPreviewComponentLabel,
  outputPreviewRows,
  uiSections,
  presetOptions,
  inputPortDetails,
  outputPortDetails,
  driverInputPortByRowId,
  driverOutputPortByRowId,
  driverDrivenStateByRowId,
  driverWarningByRowId,
  driverGroups,
  driverRowIndexById,
  featureRows,
  featureRowIndexById,
  internalDependencyEdges,
  inputRowIndexById,
  outputEndpointIndexByRowId,
  outputEndpointCount,
  featureVirtualInputStateByPortId,
  inputCompositeState,
  compositeExpansionRevision,
  getCompositeExpanded,
  setCompositeExpanded,
  selected,
  previewed = false,
  getInputDropState,
  getOutputDropState,
  onPresetChange,
  onDriverNumberChange,
  onUtilityNumberValueChange,
  onUtilityBooleanValueChange,
  onUtilityVec2AxisChange,
  onOutputPreviewComponentLabelChange,
  onOutputPreviewObjectLabelChange,
  onMoveSectionRow,
  outputRowMinHeight,
  onOutputRowMinHeightChange,
  pinDotSize,
  onPinDotSizeChange,
  onNodeHeaderPointerDown,
  onNodeBodyPointerDown,
  onNodeTitleClick,
  onRegisterPortElement,
  onOutputPointerDown,
  onOutputPointerEnter,
  onOutputPointerLeave,
  onInputPointerDown,
  onInputPointerEnter,
  onInputPointerLeave,
}: NodeViewProps) {
  void compositeExpansionRevision

  if (DEV && typeof window !== 'undefined') {
    const probeNodeId = (window as DevProbeWindow)[DEV_PROBE_NODE_ID_KEY]
    if (probeNodeId === node.nodeId) {
      console.count(`[perf] NodeView render ${node.nodeId}`)
    }
  }

  const rowFlags = getRowViewFlags(nodeMode)
  const isCollapsedMode = nodeMode === 'collapsed'
  const showDebugInfo = rowFlags.showDebugInfo
  const showEditors = rowFlags.showEditors
  const canMutateCompositeExpansion = nodeMode === 'essentials'
  const isPartTemplate = template === 'part'
  const isSketchTemplate = template === 'sketch'
  const isExtrudeTemplate = template === 'extrude'
  const showPresetPicker = isPartTemplate

  const nodeElementRef = useRef<HTMLElement | null>(null)
  const partTemplateElementRef = useRef<HTMLDivElement | null>(null)
  const driverRowElementByIdRef = useRef<Record<string, HTMLDivElement | null>>({})
  const featureRowElementByIdRef = useRef<Record<string, HTMLDivElement | null>>({})
  const paramsText = JSON.stringify(node.params, null, 2)
  const presetValue =
    typeof node.params.presetId === 'string' && node.params.presetId.length > 0
      ? node.params.presetId
      : 'default'
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({})
  const [scrubSensitivity, setScrubSensitivity] = useState(0)
  const [showInternalWiring, setShowInternalWiring] = useState(true)
  const [toolbarEditorOpen, setToolbarEditorOpen] = useState(false)
  const [internalDependencyPaths, setInternalDependencyPaths] = useState<InternalDependencyPathVm[]>([])
  const [compositeContextMenu, setCompositeContextMenu] =
    useState<CompositeContextMenuState | null>(null)

  const collapsedState = useSpaghettiUiStore((state) => state.collapsed)
  const isCollapsed = useSpaghettiUiStore((state) => state.isCollapsed)
  const toggleCollapsed = useSpaghettiUiStore((state) => state.toggleCollapsed)
  const setCollapsed = useSpaghettiUiStore((state) => state.setCollapsed)
  const activeSketchPlanePickSession = useSpaghettiStore((state) => state.sketchPlanePickSession)
  const activeSketchPlanePickNodeId = useSpaghettiStore(
    (state) => state.sketchPlanePickSession?.nodeId ?? null,
  )
  const activeGeometrySketchSession = useSpaghettiStore((state) => state.geometrySketchSession)
  const startSketchPlanePick = useSpaghettiStore((state) => state.startSketchPlanePick)
  const cancelSketchPlanePick = useSpaghettiStore((state) => state.cancelSketchPlanePick)
  const setSketchPlanePickDraftPlane = useSpaghettiStore(
    (state) => state.setSketchPlanePickDraftPlane,
  )
  const setSketchPlanePickTranslationAxis = useSpaghettiStore(
    (state) => state.setSketchPlanePickTranslationAxis,
  )
  const setSketchPlanePickRotationAxis = useSpaghettiStore(
    (state) => state.setSketchPlanePickRotationAxis,
  )
  const setGeometrySketchPlane = useSpaghettiStore((state) => state.setGeometrySketchPlane)
  const setGeometrySketchPlaneOffset = useSpaghettiStore(
    (state) => state.setGeometrySketchPlaneOffset,
  )
  const setGeometrySketchPlaneTranslationAxis = useSpaghettiStore(
    (state) => state.setGeometrySketchPlaneTranslationAxis,
  )
  const setGeometrySketchPlaneRotationAxis = useSpaghettiStore(
    (state) => state.setGeometrySketchPlaneRotationAxis,
  )
  const setGeometrySketchPlaneInPlaneRotation = useSpaghettiStore(
    (state) => state.setGeometrySketchPlaneInPlaneRotation,
  )
  const startGeometrySketchSession = useSpaghettiStore(
    (state) => state.startGeometrySketchSession,
  )
  const moveGeometrySketchComponentUp = useSpaghettiStore(
    (state) => state.moveGeometrySketchComponentUp,
  )
  const moveGeometrySketchComponentDown = useSpaghettiStore(
    (state) => state.moveGeometrySketchComponentDown,
  )
  const removeGeometrySketchComponent = useSpaghettiStore(
    (state) => state.removeGeometrySketchComponent,
  )
  const activeGraphDocumentId = useSpaghettiStore((state) => state.activeGraphDocumentId)
  const applyGraphCommand = useSpaghettiStore((state) => state.applyGraphCommand)
  const beginBrowserBuildInteraction = useAppStore((state) => state.beginBrowserBuildInteraction)
  const endBrowserBuildInteraction = useAppStore((state) => state.endBrowserBuildInteraction)

  const beginGraphParameterInteraction = () => {
    if (activeGraphDocumentId === null) {
      return
    }
    beginBrowserBuildInteraction(activeGraphDocumentId)
  }

  const endGraphParameterInteraction = () => {
    if (activeGraphDocumentId === null) {
      return
    }
    endBrowserBuildInteraction(activeGraphDocumentId)
  }

  const sectionKey = (sectionId: string): string =>
    buildSectionCollapseKey(node.nodeId, sectionId)
  const groupKey = (sectionId: string, groupId: string): string =>
    buildGroupCollapseKey(node.nodeId, sectionId, groupId)
  const compositeKey = (sectionId: string, portId: string): string =>
    buildCompositeCollapseKey(node.nodeId, sectionId, portId)
  const geometryPortRowKey = (direction: 'in' | 'out', portId: string): string =>
    `spGeomPort|${node.nodeId}|${direction}|${portId}`
  const geometryBlockKey = (blockId: GeometryBlockId): string =>
    `spGeomBlock|${node.nodeId}|${blockId}`

  const isSectionCollapsed = (sectionId: string): boolean =>
    isCollapsed(sectionKey(sectionId))

  const isGroupCollapsed = (sectionId: string, groupId: string): boolean =>
    isCollapsed(groupKey(sectionId, groupId))

  const isCompositeCollapsed = (sectionId: string, portId: string): boolean =>
    isCollapsed(compositeKey(sectionId, portId))

  const getGeometryPortRowOverride = (
    direction: 'in' | 'out',
    portId: string,
  ): boolean | undefined => {
    const key = geometryPortRowKey(direction, portId)
    return Object.prototype.hasOwnProperty.call(collapsedState, key)
      ? collapsedState[key]
      : undefined
  }

  const getGeometryBlockOverride = (blockId: GeometryBlockId): boolean | undefined => {
    const key = geometryBlockKey(blockId)
    return Object.prototype.hasOwnProperty.call(collapsedState, key)
      ? collapsedState[key]
      : undefined
  }

  const getGeometryManagedPortConfig = (
    direction: 'in' | 'out',
    portId: string,
  ): { opensInEssentials: boolean } | null => {
    if (isSketchTemplate) {
      if (direction === 'in' && (portId === 'SketchPlane' || portId === 'SketchEntities')) {
        return { opensInEssentials: true }
      }
      if (direction === 'out' && (portId === 'SketchProfiles' || portId === 'SketchProfile')) {
        return { opensInEssentials: false }
      }
    }
    if (isExtrudeTemplate && direction === 'in') {
      if (portId === 'ExtrusionProfile') {
        return { opensInEssentials: true }
      }
    }
    return null
  }

  const isGeometryPortRowManaged = (direction: 'in' | 'out', portId: string): boolean =>
    getGeometryManagedPortConfig(direction, portId) !== null

  const isGeometryBlockManaged = (blockId: GeometryBlockId): boolean =>
    (isSketchTemplate || isExtrudeTemplate) &&
    (blockId === 'inputs' || blockId === 'content' || blockId === 'outputs')

  const isGeometryBlockOpenByDefault = (blockId: GeometryBlockId): boolean => {
    if (!isGeometryBlockManaged(blockId)) {
      return true
    }
    return getDefaultStructuredWireBlockOpen(nodeMode, blockId)
  }

  const isGeometryBlockOpen = (blockId: GeometryBlockId): boolean => {
    const override = getGeometryBlockOverride(blockId)
    if (override !== undefined) {
      return override === false
    }
    return isGeometryBlockOpenByDefault(blockId)
  }

  const toggleGeometryBlock = (blockId: GeometryBlockId) => {
    const nextCollapsed = isGeometryBlockOpen(blockId)
    setCollapsed(geometryBlockKey(blockId), nextCollapsed)
  }

  const isGeometryPortRowVisibleForMode = (
    direction: 'in' | 'out',
    portId: string,
  ): boolean => {
    if (!isGeometryPortRowManaged(direction, portId)) {
      return true
    }
    return true
  }

  const isGeometryPortRowOpenByDefault = (
    direction: 'in' | 'out',
    portId: string,
  ): boolean => {
    const managedConfig = getGeometryManagedPortConfig(direction, portId)
    if (managedConfig === null) {
      return true
    }
    return (
      getDefaultStructuredWireRowMode(nodeMode, managedConfig.opensInEssentials) !== 'collapsed'
    )
  }

  const isGeometryPortRowOpen = (direction: 'in' | 'out', portId: string): boolean => {
    const override = getGeometryPortRowOverride(direction, portId)
    if (override !== undefined) {
      return override === false
    }
    return isGeometryPortRowOpenByDefault(direction, portId)
  }

  const getManagedStructuredWireRowProps = (
    direction: 'in' | 'out',
    portId: string,
    label: string,
  ) => {
    const detailsKey = endpointKey(direction, portId)
    return createStructuredWireRowController({
      rowOpen: isGeometryPortRowOpen(direction, portId),
      rowExpanded: expandedDetails[detailsKey] === true,
      rowKey: geometryPortRowKey(direction, portId),
      detailsKey,
      label,
      direction: direction === 'in' ? 'input' : 'output',
      setCollapsed,
      setExpandedDetails,
    })
  }

  const toggleSection = (sectionId: string, forceAllGroupIds?: readonly string[]) => {
    const sectionCollapsed = isSectionCollapsed(sectionId)
    toggleCollapsed(sectionKey(sectionId))
    if (forceAllGroupIds !== undefined && forceAllGroupIds.length > 0) {
      const next = !sectionCollapsed
      for (const nextGroupId of forceAllGroupIds) {
        setCollapsed(groupKey(sectionId, nextGroupId), next)
      }
    }
  }

  const onToggleSectionSummary = (
    sectionId: string,
    forceAllGroupIds?: readonly string[],
  ) => {
    return (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation()
      if (event.altKey && forceAllGroupIds !== undefined) {
        toggleSection(sectionId, forceAllGroupIds)
        return
      }
      toggleCollapsed(sectionKey(sectionId))
    }
  }

  const onToggleGroup = (sectionId: string, groupId: string) => {
    return () => {
      const sectionScopedGroupKey = groupKey(sectionId, groupId)
      toggleCollapsed(sectionScopedGroupKey)
    }
  }

  const getCompositeExpandedForNode = (
    direction: CompositeExpansionDirection,
    portId: string,
  ): boolean => getCompositeExpanded(direction, node.nodeId, portId)

  const setCompositeExpandedForNode = (
    direction: CompositeExpansionDirection,
    portId: string,
    expanded: boolean,
  ) => {
    setCompositeExpanded(direction, node.nodeId, portId, expanded)
  }

  const handleNodeHeaderPointerDown = (event: PointerEvent<HTMLElement>) => {
    event.stopPropagation()
    onNodeHeaderPointerDown(event, node.nodeId)
  }

  const handleNodeBodyPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (isInteractiveTarget(event.target)) {
      return
    }
    event.stopPropagation()
    onNodeBodyPointerDown(event, node.nodeId)
  }

  const handleNodeTitlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.stopPropagation()
  }

  const handleNodeTitleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onNodeTitleClick(node.nodeId)
  }

  const nextNodeMode = getNextViewMode(nodeMode)
  const nodeModeButtonLabel = nodeMode === 'expanded' ? '+' : nodeMode === 'essentials' ? 'e' : '-'
  const nodeModeButtonTitle = `Switch node to ${nextNodeMode} mode`

  const openCompositeContextMenu = (
    event: MouseEvent<HTMLElement>,
    portId: string,
  ) => {
    event.preventDefault()
    event.stopPropagation()
    const nodeElement = nodeElementRef.current
    if (nodeElement === null) {
      return
    }
    const rect = nodeElement.getBoundingClientRect()
    const scaleX =
      nodeElement.offsetWidth > 0 ? rect.width / nodeElement.offsetWidth : 1
    const scaleY =
      nodeElement.offsetHeight > 0 ? rect.height / nodeElement.offsetHeight : 1
    const localX = (event.clientX - rect.left) / scaleX
    const localY = (event.clientY - rect.top) / scaleY
    setCompositeContextMenu({
      x: localX + 4,
      y: localY + 4,
      portId,
    })
  }

  const renderSectionHeader = (
    label: string,
    sectionId: string,
    forceGroupIds: readonly string[] = [],
  ) => {
    const collapsed = isSectionCollapsed(sectionId)
    return (
      <div
        className="SpaghettiNodeSectionLabel SpaghettiNodeSectionHeaderHitArea"
        {...SP_INTERACTIVE_PROPS}
        onClick={onToggleSectionSummary(sectionId, forceGroupIds)}
      >
        <span>{label}</span>
        <span className="SpaghettiNodeSectionChevron" aria-hidden="true">
          {collapsed ? '\u25B8' : '\u25BE'}
        </span>
      </div>
    )
  }

  const isSectionBodyVisible = (sectionId: string): boolean =>
    isWiringSurfaceSection(sectionId)
      ? !isSectionCollapsed(sectionId)
      : !isCollapsedMode && !isSectionCollapsed(sectionId)

  const renderTemplateSection = (
    sectionId: string,
    label: string,
    body: ReactNode,
    options?: {
      className?: string
      forceGroupIds?: readonly string[]
    },
  ) => {
    const bodyVisible = isSectionBodyVisible(sectionId)
    return (
      <section
        className={options?.className ?? 'SpaghettiNodeSection SpaghettiTemplateSection'}
        data-sp-section-id={sectionId}
        data-sp-section-body-visible={bodyVisible ? '1' : '0'}
      >
        {renderSectionHeader(label, sectionId, options?.forceGroupIds)}
        {bodyVisible ? body : null}
      </section>
    )
  }

  const renderPartSection = (
    sectionId: 'drivers' | 'inputs' | 'featureStack' | 'outputs',
    label: string,
    body: ReactNode,
    options?: {
      className?: string
      forceGroupIds?: readonly string[]
    },
  ) => renderTemplateSection(SECTION_IDS[sectionId], label, body, options)

  const renderGroupHeader = (
    label: string,
    sectionId: string,
    groupId: string,
    collapsed: boolean,
    children: ReactNode,
    summary?: ReactNode,
  ) => {
    return (
      <div
        key={`${sectionId}-${groupId}`}
        className="SpaghettiNodeGroup"
        data-sp-group-id={groupId}
        data-sp-section-id={sectionId}
      >
        <div
          className="SpaghettiNodeSectionLabel SpaghettiNodeSectionHeaderHitArea SpaghettiNodeSectionRow"
          {...SP_INTERACTIVE_PROPS}
          onClick={(event) => {
            event.stopPropagation()
            onToggleGroup(sectionId, groupId)()
          }}
        >
          <span>{label}</span>
          <span className="SpaghettiNodeSectionChevron" aria-hidden="true">
            {collapsed ? '\u25B8' : '\u25BE'}
          </span>
        </div>
        {collapsed ? summary : null}
        {!collapsed ? <div className="SpaghettiNodeGroupBody">{children}</div> : null}
      </div>
    )
  }

  const wrapWithSectionRowMoveControls = (
    section: PartRowOrderSection,
    rowId: string,
    indexInSection: number | undefined,
    sectionLength: number | undefined,
    content: ReactNode,
    options?: {
      orderable?: boolean
      alignToValueBar?: boolean
    },
  ): ReactNode => {
    const orderable = options?.orderable !== false
    if (
      !orderable ||
      onMoveSectionRow === undefined ||
      indexInSection === undefined ||
      sectionLength === undefined
    ) {
      return content
    }

    const disableAll = sectionLength < 2
    const disableUp = disableAll || indexInSection <= 0
    const disableDown = disableAll || indexInSection >= sectionLength - 1

    return (
      <div key={`row-move-${section}-${rowId}`} className="SpaghettiSectionRowWithMove">
        <div className="SpaghettiSectionRowBody">{content}</div>
        <div
          className={`SpaghettiSectionRowMoveControls ${
            options?.alignToValueBar === true
              ? 'SpaghettiSectionRowMoveControls--valueBarAligned'
              : ''
          }`}
        >
          <button
            type="button"
            className="SpaghettiSectionRowMoveButton"
            {...SP_INTERACTIVE_PROPS}
            disabled={disableUp}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation()
              if (disableUp) {
                return
              }
              onMoveSectionRow(node.nodeId, section, rowId, 'up')
            }}
            aria-label="Move row up"
          >
            {'\u25B2'}
          </button>
          <button
            type="button"
            className="SpaghettiSectionRowMoveButton"
            {...SP_INTERACTIVE_PROPS}
            disabled={disableDown}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation()
              if (disableDown) {
                return
              }
              onMoveSectionRow(node.nodeId, section, rowId, 'down')
            }}
            aria-label="Move row down"
          >
            {'\u25BC'}
          </button>
        </div>
      </div>
    )
  }

  const renderInputPort = (
    port: PortSpec,
    options?: {
      portClassName?: string
      endpointPortId?: string
      path?: string[]
      valueBarTone?: 'blue' | 'white'
      labelOverride?: string
      compositeExpanded?: boolean
      onToggleComposite?: () => void
      showDetailsToggle?: boolean
      onContextMenu?: (
        event: MouseEvent<HTMLElement>,
        payload: EndpointPayload,
      ) => void
      rowChevronState?: StructuredWireRowMode
      onCycleRowChevron?: () => void
      rowExpanded?: boolean
      onToggleRowExpanded?: () => void
      rowToggleAriaLabel?: string
      hideDetailsToggle?: boolean
      inputWiringDisabled?: boolean
      drivenMessage?: string
      editDisabled?: boolean
      suppressEditors?: boolean
      resolvedValueLabel?: string
      detailsTitle?: string
      attachedBodyContent?: ReactNode
      valueInput?: {
        value: number
        min?: number
        max?: number
        step?: number
        showSlider?: boolean
        renderAs?: 'numberField' | 'paraSlider'
        primitiveRow?: boolean
        disabled?: boolean
        driven?: boolean
        formatValue?: (value: number) => string
        displayLabel?: string
        displayValue?: string
        displayedTrackValue?: number
        className?: string
        hideSliderCaps?: boolean
        onChange: (value: number) => void
      }
    },
  ) => {
    const endpointPortId = options?.endpointPortId ?? port.portId
    const detailsKey = endpointKey('in', endpointPortId, options?.path)
    const path = options?.path
    const payload: EndpointPayload = {
      nodeId: node.nodeId,
      portId: endpointPortId,
      ...(path === undefined || path.length === 0 ? {} : { path }),
    }

    let valueInput = options?.valueInput
    if (options?.editDisabled === true && valueInput !== undefined) {
      valueInput = {
        ...valueInput,
        disabled: true,
        driven: true,
      }
    }

    const suppressEditors = options?.suppressEditors === true || !showEditors
    if (suppressEditors) {
      valueInput = undefined
    }

    return (
      <PortView
        key={`in-${endpointPortId}-${path?.join('.') ?? 'root'}`}
        className={options?.portClassName}
        nodeId={node.nodeId}
        direction="in"
        endpointPortId={endpointPortId}
        endpointPath={path}
        labelOverride={options?.labelOverride}
        port={port}
        setPortElement={(element) =>
          onRegisterPortElement(node.nodeId, 'in', endpointPortId, path, element)
        }
        dropState={getInputDropState(payload)}
        details={inputPortDetails?.[endpointPortId]}
        detailsTitle={options?.detailsTitle}
        attachedBodyContent={options?.attachedBodyContent}
        detailsExpanded={
          options?.rowChevronState === 'expanded' ||
          (showDebugInfo && expandedDetails[detailsKey] === true)
        }
        onToggleDetails={
          !showDebugInfo || options?.showDetailsToggle === false
            ? undefined
            : () =>
                setExpandedDetails((current) => ({
                  ...current,
                  [detailsKey]: !current[detailsKey],
                }))
        }
        rowChevronState={options?.rowChevronState}
        onCycleRowChevron={options?.onCycleRowChevron}
        valueInput={valueInput}
        valueBarTone={options?.valueBarTone ?? 'blue'}
        childTone={path !== undefined}
        compositeExpanded={options?.compositeExpanded}
        onToggleComposite={options?.onToggleComposite}
        rowExpanded={options?.rowExpanded}
        onToggleRowExpanded={options?.onToggleRowExpanded}
        rowToggleAriaLabel={options?.rowToggleAriaLabel}
        hideDetailsToggle={options?.hideDetailsToggle}
        onContextMenu={options?.onContextMenu}
        inputWiringDisabled={options?.inputWiringDisabled}
        drivenMessage={options?.drivenMessage}
        resolvedValueLabel={options?.resolvedValueLabel}
        scrubSpeed={scrubSensitivity}
        onInputPointerDown={onInputPointerDown}
        onInputPointerEnter={onInputPointerEnter}
        onInputPointerLeave={onInputPointerLeave}
      />
    )
  }

  const renderCompositeInputPort = (
    port: PortSpec,
    options?: {
      portClassName?: string
      endpointPortId?: string
      labelOverride?: string
      resolvedValueLabel?: string
      valueInput?: {
        value: number
        min?: number
        max?: number
        step?: number
        showSlider?: boolean
        renderAs?: 'numberField' | 'paraSlider'
        primitiveRow?: boolean
        disabled?: boolean
        driven?: boolean
        formatValue?: (value: number) => string
        displayLabel?: string
        displayValue?: string
        displayedTrackValue?: number
        className?: string
        hideSliderCaps?: boolean
        onChange: (value: number) => void
      }
    },
  ) => {
    const endpointPortId = options?.endpointPortId ?? port.portId
    const sectionId = SECTION_IDS.inputs
    const tree = getFieldTree(port.type)
    if (!isCompositeFieldNode(tree)) {
      return renderInputPort(port, {
        portClassName: options?.portClassName,
        endpointPortId,
        labelOverride: options?.labelOverride,
        resolvedValueLabel: options?.resolvedValueLabel,
        showDetailsToggle: showDebugInfo,
        suppressEditors: !showEditors,
        valueInput: options?.valueInput,
      })
    }

    const expandedByState = getCompositeExpandedForNode('in', endpointPortId)
    const expanded =
      !isSectionCollapsed(sectionId) &&
      !isCompositeCollapsed(sectionId, endpointPortId) &&
      rowFlags.renderLeafRows &&
      (rowFlags.forceLeafRows || expandedByState)
    const leaves = listLeafFieldPaths(tree)

    const wholeDriven = inputCompositeState.wholeDrivenByPortId.has(endpointPortId)
    const hasLegacyLeafOverride =
      inputCompositeState.legacyLeafOverrideOnWhole.has(endpointPortId)
    const displayVec =
      inputCompositeState.vec2DisplayByPortId.get(endpointPortId) ?? { x: 0, y: 0 }

    return (
      <div
        key={`composite-in-${endpointPortId}`}
        className={`SpaghettiCompositeGroup spComp_group ${expanded ? 'isExpanded' : ''}`}
      >
        {renderInputPort(port, {
          portClassName: options?.portClassName,
          endpointPortId,
          labelOverride: options?.labelOverride,
          valueInput: options?.valueInput,
          compositeExpanded: expanded,
          showDetailsToggle: showDebugInfo,
          onToggleComposite:
            !canMutateCompositeExpansion || !rowFlags.renderLeafRows
              ? undefined
              : () => {
                  setCollapsed(compositeKey(sectionId, endpointPortId), !expanded)
                  setCompositeExpandedForNode('in', endpointPortId, !expandedByState)
                },
          onContextMenu: (event) => openCompositeContextMenu(event, endpointPortId),
          drivenMessage: wholeDriven ? 'Driven by parent wire' : undefined,
          suppressEditors: !showEditors,
        })}
        {wholeDriven && hasLegacyLeafOverride ? (
          <div className="SpaghettiCompositeWarningBadge spComp_warning">Leaf override exists</div>
        ) : null}
        {expanded ? (
          <div className="SpaghettiCompositeChildren spComp_children">
            {leaves.map((leaf) => {
              const childPort: PortSpec = {
                ...port,
                label: leafLabel(leaf.path, leaf.node.label),
                type: leaf.node.type,
              }
              const axis =
                leaf.path.length === 1 && (leaf.path[0] === 'x' || leaf.path[0] === 'y')
                  ? (leaf.path[0] as 'x' | 'y')
                  : undefined
              const leafDriven =
                wholeDriven ||
                inputCompositeState.leafDrivenByPortIdPathKey.has(
                  leafPortPathKey(endpointPortId, leaf.path),
                )
              return renderInputPort(childPort, {
                portClassName: options?.portClassName,
                endpointPortId,
                path: leaf.path,
                labelOverride: leafLabel(leaf.path, leaf.node.label),
                valueBarTone: 'white',
                inputWiringDisabled: wholeDriven,
                drivenMessage: wholeDriven ? 'Driven by parent wire' : undefined,
                editDisabled: leafDriven,
                suppressEditors: !showEditors,
                valueInput:
                  wholeDriven && axis !== undefined
                    ? {
                        value: displayVec[axis],
                        min: -2000,
                        max: 2000,
                        step: 0.1,
                        disabled: true,
                        driven: true,
                        onChange: () => {
                          // Read-only while parent whole-port wire drives this composite.
                        },
                      }
                    : undefined,
              })
            })}
          </div>
        ) : null}
      </div>
    )
  }

  const renderInputPortByType = (
    port: PortSpec,
    options?: {
      portClassName?: string
      endpointPortId?: string
      labelOverride?: string
      rowChevronState?: StructuredWireRowMode
      onCycleRowChevron?: () => void
      rowExpanded?: boolean
      onToggleRowExpanded?: () => void
      rowToggleAriaLabel?: string
      hideDetailsToggle?: boolean
      inputWiringDisabled?: boolean
      drivenMessage?: string
      resolvedValueLabel?: string
      detailsTitle?: string
      attachedBodyContent?: ReactNode
      valueInput?: {
        value: number
        min?: number
        max?: number
        step?: number
        showSlider?: boolean
        renderAs?: 'numberField' | 'paraSlider'
        primitiveRow?: boolean
        disabled?: boolean
        driven?: boolean
        formatValue?: (value: number) => string
        displayLabel?: string
        displayValue?: string
        displayedTrackValue?: number
        className?: string
        hideSliderCaps?: boolean
        onChange: (value: number) => void
      }
    },
  ) => {
    const tree = getFieldTree(port.type)
    if (isCompositeFieldNode(tree)) {
      return renderCompositeInputPort(port, options)
    }
    return renderInputPort(port, {
      portClassName: options?.portClassName,
      endpointPortId: options?.endpointPortId,
      labelOverride: options?.labelOverride,
      rowChevronState: options?.rowChevronState,
      onCycleRowChevron: options?.onCycleRowChevron,
      rowExpanded: options?.rowExpanded,
      onToggleRowExpanded: options?.onToggleRowExpanded,
      rowToggleAriaLabel: options?.rowToggleAriaLabel,
      hideDetailsToggle: options?.hideDetailsToggle,
      inputWiringDisabled: options?.inputWiringDisabled,
      drivenMessage: options?.drivenMessage,
      resolvedValueLabel: options?.resolvedValueLabel,
      detailsTitle: options?.detailsTitle,
      attachedBodyContent: options?.attachedBodyContent,
      valueInput: options?.valueInput,
      showDetailsToggle: showDebugInfo,
      suppressEditors: !showEditors,
    })
  }

  const renderOutputPort = (
    port: PortSpec,
    options?: {
      endpointPortId?: string
      path?: string[]
      labelOverride?: string
      compositeExpanded?: boolean
      onToggleComposite?: () => void
      showDetailsToggle?: boolean
      details?: PortDetailLine[]
      rowChevronState?: StructuredWireRowMode
      onCycleRowChevron?: () => void
      rowExpanded?: boolean
      onToggleRowExpanded?: () => void
      rowToggleAriaLabel?: string
      hideDetailsToggle?: boolean
      resolvedValueLabel?: string
      detailsTitle?: string
    },
  ) => {
    const endpointPortId = options?.endpointPortId ?? port.portId
    const path = options?.path
    const payload: EndpointPayload = {
      nodeId: node.nodeId,
      portId: endpointPortId,
      ...(path === undefined || path.length === 0 ? {} : { path }),
    }
    const detailsKey = endpointKey('out', endpointPortId, path)
    const isRootPort = path === undefined || path.length === 0

    return (
      <PortView
        key={`out-${endpointPortId}-${path?.join('.') ?? 'root'}`}
        nodeId={node.nodeId}
        direction="out"
        endpointPortId={endpointPortId}
        endpointPath={path}
        labelOverride={options?.labelOverride}
        port={port}
        setPortElement={(element) =>
          onRegisterPortElement(node.nodeId, 'out', endpointPortId, path, element)
        }
        dropState={getOutputDropState(payload)}
        details={
          options?.details ??
          (isRootPort ? outputPortDetails?.[endpointPortId] : undefined)
        }
        detailsTitle={options?.detailsTitle}
        detailsExpanded={
          options?.rowChevronState === 'expanded' ||
          (showDebugInfo && expandedDetails[detailsKey] === true)
        }
        onToggleDetails={
          !showDebugInfo || options?.showDetailsToggle === false
            ? undefined
            : () =>
                setExpandedDetails((current) => ({
                  ...current,
                  [detailsKey]: !current[detailsKey],
                }))
        }
        rowChevronState={options?.rowChevronState}
        onCycleRowChevron={options?.onCycleRowChevron}
        compositeExpanded={options?.compositeExpanded}
        onToggleComposite={options?.onToggleComposite}
        rowExpanded={options?.rowExpanded}
        onToggleRowExpanded={options?.onToggleRowExpanded}
        rowToggleAriaLabel={options?.rowToggleAriaLabel}
        hideDetailsToggle={options?.hideDetailsToggle}
        childTone={path !== undefined}
        resolvedValueLabel={options?.resolvedValueLabel}
        scrubSpeed={scrubSensitivity}
        onOutputPointerDown={onOutputPointerDown}
        onOutputPointerEnter={onOutputPointerEnter}
        onOutputPointerLeave={onOutputPointerLeave}
      />
    )
  }

  const renderCompositeOutputPort = (
    port: PortSpec,
    options?: {
      endpointPortId?: string
      labelOverride?: string
    },
  ) => {
    const endpointPortId = options?.endpointPortId ?? port.portId
    const sectionId = SECTION_IDS.outputs
    const tree = getFieldTree(port.type)
    if (!isCompositeFieldNode(tree)) {
      return renderOutputPort(port, {
        endpointPortId,
        labelOverride: options?.labelOverride,
      })
    }

    const expandedByState = getCompositeExpandedForNode('out', endpointPortId)
    const expanded =
      !isSectionCollapsed(sectionId) &&
      rowFlags.renderLeafRows &&
      (rowFlags.forceLeafRows || expandedByState) &&
      !isCompositeCollapsed(sectionId, endpointPortId)
    const leaves = listLeafFieldPaths(tree)

    return (
      <div
        key={`composite-out-${endpointPortId}`}
        className={`SpaghettiCompositeGroup spComp_group ${expanded ? 'isExpanded' : ''}`}
      >
        {renderOutputPort(port, {
          endpointPortId,
          labelOverride: options?.labelOverride,
          compositeExpanded: expanded,
          onToggleComposite: undefined,
          showDetailsToggle: showDebugInfo,
        })}
        {expanded ? (
          <div className="SpaghettiCompositeChildren spComp_children">
            {leaves.map((leaf) => {
              const childPort: PortSpec = {
                ...port,
                label: leafLabel(leaf.path, leaf.node.label),
                type: leaf.node.type,
              }
              return renderOutputPort(childPort, {
                endpointPortId,
                path: leaf.path,
                labelOverride: leafLabel(leaf.path, leaf.node.label),
                showDetailsToggle: false,
                details: undefined,
              })
            })}
          </div>
        ) : null}
      </div>
    )
  }

  const renderOutputPortByType = (
    port: PortSpec,
    options?: {
      endpointPortId?: string
      labelOverride?: string
      path?: string[]
      rowChevronState?: StructuredWireRowMode
      onCycleRowChevron?: () => void
      rowExpanded?: boolean
      onToggleRowExpanded?: () => void
      rowToggleAriaLabel?: string
      hideDetailsToggle?: boolean
      resolvedValueLabel?: string
    },
  ) => {
    if (options?.path !== undefined && options.path.length > 0) {
      return renderOutputPort(port, {
        endpointPortId: options.endpointPortId,
        labelOverride: options.labelOverride,
        path: options.path,
        rowChevronState: options.rowChevronState,
        onCycleRowChevron: options.onCycleRowChevron,
        rowExpanded: options.rowExpanded,
        onToggleRowExpanded: options.onToggleRowExpanded,
        rowToggleAriaLabel: options.rowToggleAriaLabel,
        hideDetailsToggle: options.hideDetailsToggle,
        resolvedValueLabel: options.resolvedValueLabel,
      })
    }
    const tree = getFieldTree(port.type)
    if (isCompositeFieldNode(tree)) {
      return renderCompositeOutputPort(port, {
        endpointPortId: options?.endpointPortId,
        labelOverride: options?.labelOverride,
      })
    }
    return renderOutputPort(port, {
      endpointPortId: options?.endpointPortId,
      labelOverride: options?.labelOverride,
      rowChevronState: options?.rowChevronState,
      onCycleRowChevron: options?.onCycleRowChevron,
      rowExpanded: options?.rowExpanded,
      onToggleRowExpanded: options?.onToggleRowExpanded,
      rowToggleAriaLabel: options?.rowToggleAriaLabel,
      hideDetailsToggle: options?.hideDetailsToggle,
      resolvedValueLabel: options?.resolvedValueLabel,
    })
  }

  const renderDriverControlRow = (
    driver: DriverControlRowVm,
    options?: {
      pinsOnly?: boolean
      sectionIndex?: number
      sectionLength?: number
    },
  ) => {
    const pinsOnly = options?.pinsOnly === true
    const toDriverWarningTooltip = (warning: DriverRowWarningVm): string => {
      if (typeof warning.message === 'string' && warning.message.length > 0) {
        return warning.message
      }
      const reasonLabel = (warning.reasons ?? [warning.kind]).join(', ')
      return `Driver input warning: ${reasonLabel}`
    }
    const renderDriverWarning = (rowId: string) => {
      const warning = driverWarningByRowId?.[rowId]
      if (warning === undefined) {
        return null
      }
      return (
        <span
          className={`SpaghettiDriverWarningIndicator SpaghettiDriverWarningIndicator--${warning.kind}`}
          title={toDriverWarningTooltip(warning)}
          aria-label={toDriverWarningTooltip(warning)}
        >
          !
        </span>
      )
    }
    const renderDriverPins = (rowId: string) => {
      const inputPort = driverInputPortByRowId?.[rowId]
      const outputPort = driverOutputPortByRowId?.[rowId]
      if (inputPort === undefined && outputPort === undefined) {
        return null
      }
      return (
        <span className="SpaghettiDriverPinCluster">
          {inputPort !== undefined ? (
            (() => {
              const payload: EndpointPayload = {
                nodeId: node.nodeId,
                portId: inputPort.portId,
              }
              const dropState = getInputDropState(payload)
              const dropStateClass =
                dropState === null
                  ? ''
                  : dropState === 'compatible'
                    ? 'SpaghettiDriverInputPinSlot--compatible'
                    : 'SpaghettiDriverInputPinSlot--incompatible'
              return (
                <span
                  className={`SpaghettiDriverInputPinSlot ${dropStateClass}`}
                  title={
                    inputPort.type.unit === undefined
                      ? inputPort.type.kind
                      : `${inputPort.type.kind}:${inputPort.type.unit}`
                  }
                  onPointerEnter={() => onInputPointerEnter(payload)}
                  onPointerLeave={() => onInputPointerLeave(payload)}
                >
                  <span
                    ref={(element) =>
                      onRegisterPortElement(node.nodeId, 'in', inputPort.portId, undefined, element)
                    }
                    className={`SpaghettiPortAnchor SpaghettiPortAnchor--in SpaghettiPortAnchor--kind-${inputPort.type.kind} SpaghettiDriverInputPin`}
                    style={{ backgroundColor: getTypeColor(inputPort.type.kind) }}
                    onPointerDown={(event) => {
                      event.stopPropagation()
                      if (event.button !== 0) {
                        return
                      }
                      onInputPointerDown(event, payload)
                    }}
                    data-sp-driver-input-port-id={inputPort.portId}
                  />
                </span>
              )
            })()
          ) : null}
          {outputPort !== undefined ? (
            (() => {
              const payload: EndpointPayload = {
                nodeId: node.nodeId,
                portId: outputPort.portId,
              }
              const dropState = getOutputDropState(payload)
              const dropStateClass =
                dropState === null
                  ? ''
                  : dropState === 'compatible'
                    ? 'SpaghettiDriverOutputPinSlot--compatible'
                    : 'SpaghettiDriverOutputPinSlot--incompatible'
              return (
                <span
                  className={`SpaghettiDriverOutputPinSlot ${dropStateClass}`}
                  title={
                    outputPort.type.unit === undefined
                      ? outputPort.type.kind
                      : `${outputPort.type.kind}:${outputPort.type.unit}`
                  }
                  onPointerEnter={() => onOutputPointerEnter(payload)}
                  onPointerLeave={() => onOutputPointerLeave(payload)}
                >
                  <span
                    ref={(element) =>
                      onRegisterPortElement(node.nodeId, 'out', outputPort.portId, undefined, element)
                    }
                    className={`SpaghettiPortAnchor SpaghettiPortAnchor--out SpaghettiPortAnchor--kind-${outputPort.type.kind} SpaghettiDriverOutputPin`}
                    style={{ backgroundColor: getTypeColor(outputPort.type.kind) }}
                    onPointerDown={(event) => {
                      event.stopPropagation()
                      if (event.button !== 0) {
                        return
                      }
                      onOutputPointerDown(event, payload)
                    }}
                    data-sp-driver-output-port-id={outputPort.portId}
                  />
                </span>
              )
            })()
          ) : null}
        </span>
      )
    }

    if (driver.kind === 'nodeParamVec2') {
      const drivenState = driverDrivenStateByRowId?.[driver.rowId]
      const xDisabled =
        driver.xInput.disabled === true || drivenState?.driven === true || !showEditors
      const yDisabled =
        driver.yInput.disabled === true || drivenState?.driven === true || !showEditors
      const pinValueLabel = `${formatPinValue(driver.xInput.value)}, ${formatPinValue(
        driver.yInput.value,
      )}`
      const content = (
        <div
          key={driver.rowId}
          ref={(element) => {
            driverRowElementByIdRef.current[driver.rowId] = element
          }}
          className={`SpRow SpRow--driver SpaghettiDriverControlRow SpaghettiDriverControlRow--vec2 ${
            xDisabled && yDisabled ? 'isDisabled' : ''
          } ${
            driverOutputPortByRowId?.[driver.rowId] === undefined &&
            driverInputPortByRowId?.[driver.rowId] === undefined
              ? ''
              : 'SpaghettiDriverControlRow--wireableOut'
          }`}
          data-sp-driver-row-id={driver.rowId}
        >
          <span className="SpaghettiDriverControlLabel">{driver.label}</span>
          <Vec2Field
            x={{
              value: driver.xInput.value,
              min: driver.xInput.min,
              max: driver.xInput.max,
              step: driver.xInput.step,
              disabled: xDisabled,
              driven: driver.xInput.driven,
              onChange: (value) =>
                onDriverNumberChange(node.nodeId, driver.xInput.change, value),
            }}
            y={{
              value: driver.yInput.value,
              min: driver.yInput.min,
              max: driver.yInput.max,
              step: driver.yInput.step,
              disabled: yDisabled,
              driven: driver.yInput.driven,
              onChange: (value) =>
                onDriverNumberChange(node.nodeId, driver.yInput.change, value),
            }}
            scrubSpeed={scrubSensitivity}
          />
          {pinsOnly ? <span className="SpaghettiDriverPinValue">{pinValueLabel}</span> : null}
          {renderDriverWarning(driver.rowId)}
          {renderDriverPins(driver.rowId)}
          {drivenState?.unresolved === true ? (
            <span className="SpaghettiDriverUnresolvedMessage">Driven (unresolved)</span>
          ) : null}
        </div>
      )
      return wrapWithSectionRowMoveControls(
        'drivers',
        driver.rowId,
        options?.sectionIndex,
        options?.sectionLength,
        content,
        {
          alignToValueBar: true,
        },
      )
    }

    if (driver.kind === 'nodeParamNumber') {
      const valueInput = driver.numberInput
      const drivenState = driverDrivenStateByRowId?.[driver.rowId]
      const disabled =
        valueInput.disabled === true || drivenState?.driven === true || !showEditors
      const inOffsetMode =
        drivenState?.driven === true &&
        driver.offsetMode === true &&
        driver.offsetInput !== undefined
      const offsetInput = inOffsetMode ? driver.offsetInput : undefined
      const drivenDisplayValue =
        typeof driver.drivenValue === 'number' && Number.isFinite(driver.drivenValue)
          ? driver.drivenValue
          : valueInput.value
      const effectiveDisplayValue =
        typeof driver.effectiveValue === 'number' && Number.isFinite(driver.effectiveValue)
          ? driver.effectiveValue
          : undefined
      const pinValueLabel =
        inOffsetMode && effectiveDisplayValue !== undefined
          ? formatPinValue(effectiveDisplayValue)
          : formatPinValue(valueInput.value)
      const content = (
        <div
          key={driver.rowId}
          ref={(element) => {
            driverRowElementByIdRef.current[driver.rowId] = element
          }}
          className={`SpRow SpRow--driver SpaghettiDriverControlRow SpaghettiDriverControlRow--number ${
            disabled ? 'isDisabled' : ''
          } ${inOffsetMode ? 'SpaghettiDriverControlRow--offsetMode' : ''} ${
            driverOutputPortByRowId?.[driver.rowId] === undefined &&
            driverInputPortByRowId?.[driver.rowId] === undefined
              ? ''
              : 'SpaghettiDriverControlRow--wireableOut'
          }`}
          data-sp-driver-row-id={driver.rowId}
        >
          {inOffsetMode && offsetInput !== undefined ? (
            <div className="SpaghettiDriverOffsetModeStack">
              <NumberField
                scrubLabel={`${driver.label} (Driven)`}
                value={drivenDisplayValue}
                min={valueInput.min}
                max={valueInput.max}
                step={valueInput.step ?? 0.1}
                disabled={true}
                driven={true}
                scrubSpeed={scrubSensitivity}
                className="SpaghettiDriverNumberField SpaghettiDriverNumberField--drivenValue"
                onChange={() => {
                  // Read-only in driven mode.
                }}
              />
              <NumberField
                scrubLabel="Offset"
                value={offsetInput.value}
                step={offsetInput.step ?? 0.1}
                disabled={offsetInput.disabled === true || !showEditors}
                scrubSpeed={scrubSensitivity}
                className="SpaghettiDriverNumberField SpaghettiDriverNumberField--offsetValue"
                onChange={(value) =>
                  onDriverNumberChange(node.nodeId, offsetInput.change, value)
                }
              />
              {effectiveDisplayValue !== undefined ? (
                <NumberField
                  scrubLabel="Effective"
                  value={effectiveDisplayValue}
                  step={valueInput.step ?? 0.1}
                  disabled={true}
                  scrubSpeed={scrubSensitivity}
                  className="SpaghettiDriverNumberField SpaghettiDriverNumberField--effectiveValue"
                  onChange={() => {
                    // Read-only effective display.
                  }}
                />
              ) : null}
            </div>
          ) : (
            <NumberField
              scrubLabel={driver.label}
              value={valueInput.value}
              min={valueInput.min}
              max={valueInput.max}
              step={valueInput.step ?? 0.1}
              disabled={disabled}
              driven={valueInput.driven}
              scrubSpeed={scrubSensitivity}
              className="SpaghettiDriverNumberField"
              onChange={(value) => onDriverNumberChange(node.nodeId, valueInput.change, value)}
            />
          )}
          {pinsOnly ? <span className="SpaghettiDriverPinValue">{pinValueLabel}</span> : null}
          {renderDriverWarning(driver.rowId)}
          {renderDriverPins(driver.rowId)}
          {drivenState?.unresolved === true ? (
            <span className="SpaghettiDriverUnresolvedMessage">Driven (unresolved)</span>
          ) : null}
        </div>
      )
      return wrapWithSectionRowMoveControls(
        'drivers',
        driver.rowId,
        options?.sectionIndex,
        options?.sectionLength,
        content,
        {
          alignToValueBar: true,
        },
      )
    }

    const valueInput = driver.numberInput
    const drivenState = driverDrivenStateByRowId?.[driver.rowId]
    const disabled =
      valueInput.disabled === true || drivenState?.driven === true || !showEditors
    const pinValueLabel = formatPinValue(valueInput.value)
    const content = (
      <div
        key={driver.rowId}
        ref={(element) => {
          driverRowElementByIdRef.current[driver.rowId] = element
        }}
        className={`SpRow SpRow--driver SpaghettiDriverControlRow SpaghettiDriverControlRow--number ${
          disabled ? 'isDisabled' : ''
        } ${
          driverOutputPortByRowId?.[driver.rowId] === undefined &&
          driverInputPortByRowId?.[driver.rowId] === undefined
            ? ''
            : 'SpaghettiDriverControlRow--wireableOut'
        }`}
        data-sp-driver-row-id={driver.rowId}
      >
        <NumberField
          scrubLabel={driver.label}
          value={valueInput.value}
          min={valueInput.min}
          max={valueInput.max}
          step={valueInput.step ?? 0.1}
          disabled={disabled}
          driven={valueInput.driven}
          scrubSpeed={scrubSensitivity}
          className="SpaghettiDriverNumberField"
          onChange={(value) => onDriverNumberChange(node.nodeId, valueInput.change, value)}
        />
        {pinsOnly ? <span className="SpaghettiDriverPinValue">{pinValueLabel}</span> : null}
        {renderDriverWarning(driver.rowId)}
        {renderDriverPins(driver.rowId)}
        {drivenState?.unresolved === true ? (
          <span className="SpaghettiDriverUnresolvedMessage">Driven (unresolved)</span>
        ) : null}
      </div>
    )
    return wrapWithSectionRowMoveControls(
      'drivers',
      driver.rowId,
      options?.sectionIndex,
      options?.sectionLength,
      content,
      {
        alignToValueBar: true,
      },
    )
  }

  const renderInputRow = (
    driver: InputEndpointRowVm,
    options?: {
      sectionIndex?: number
      sectionLength?: number
    },
  ) => {
    const content = renderInputPortByType(driver.port, {
      endpointPortId: driver.endpointPortId,
      labelOverride: driver.labelOverride,
      resolvedValueLabel: driver.displayValue,
      inputWiringDisabled: driver.inputWiringDisabled,
      drivenMessage: driver.drivenMessage,
      ...(driver.numberInput === undefined
        ? {}
        : {
            valueInput: {
              value: driver.numberInput.value,
              min: driver.numberInput.min,
              max: driver.numberInput.max,
              step: driver.numberInput.step,
              showSlider: driver.numberInput.showSlider,
              disabled: driver.numberInput.disabled,
              driven: driver.numberInput.driven,
              onChange: (value: number) =>
                onDriverNumberChange(node.nodeId, driver.numberInput!.change, value),
            },
          }),
    })
    return wrapWithSectionRowMoveControls(
      'inputs',
      driver.rowId,
      options?.sectionIndex,
      options?.sectionLength,
      content,
      {
        alignToValueBar: driver.numberInput !== undefined,
      },
    )
  }

  const renderReservedOutputRow = (driver: Extract<OutputPinnedRowVm, { kind: 'reserved' }>) => (
    <div
      key={driver.rowId}
      className="SpaghettiPort SpRow SpRow--output SpaghettiPort--out SpaghettiPort--disabled SpaghettiReservedOutputRow"
      data-sp-interactive="1"
      data-sp-disabled-port="1"
      aria-disabled="true"
    >
      <div className="SpaghettiPortHeader">
        <div className="SpaghettiPortName">{driver.label}</div>
        <div className="SpaghettiPortType">pending</div>
      </div>
      <span
        className="SpaghettiPortAnchor SpaghettiPortAnchor--out SpaghettiPortAnchor--disabled"
        data-sp-interactive="1"
        data-sp-disabled-port="1"
        aria-hidden="true"
      />
    </div>
  )

  const renderOutputRow = (
    driver: OutputPinnedRowVm,
    options?: {
      sectionIndex?: number
      sectionLength?: number
    },
  ) => {
    if (driver.kind === 'reserved') {
      return renderReservedOutputRow(driver)
    }
    const content = renderOutputPortByType(driver.port, {
      endpointPortId: driver.endpointPortId,
      path: driver.endpointPath,
      labelOverride: driver.labelOverride,
    })
    return wrapWithSectionRowMoveControls(
      'outputs',
      driver.rowId,
      options?.sectionIndex,
      options?.sectionLength,
      content,
      {
        alignToValueBar: true,
      },
    )
  }

  const menuPortId = compositeContextMenu?.portId
  const menuPortExpanded =
    menuPortId === undefined
      ? false
      : rowFlags.renderLeafRows &&
        (rowFlags.forceLeafRows || getCompositeExpandedForNode('in', menuPortId))
  const menuPortDetailsKey =
    menuPortId === undefined ? undefined : endpointKey('in', menuPortId)
  const menuPortInfoExpanded =
    showDebugInfo &&
    menuPortDetailsKey !== undefined &&
    expandedDetails[menuPortDetailsKey] === true
  const resolvedDriverGroupsForOverlay: DriverSectionGroupVm[] =
    driverGroups ??
    [
      {
        groupId: '__untitled__',
        label: 'Properties',
        rows: drivers ?? [],
      },
    ]
  const showDriverSectionBody = isSectionBodyVisible(SECTION_IDS.drivers)
  const showFeatureStackSectionBody = isSectionBodyVisible(SECTION_IDS.featureStack)
  const visibleDriverRowIdsForOverlay = !showDriverSectionBody
    ? []
    : resolvedDriverGroupsForOverlay.flatMap((group) =>
        isGroupCollapsed(SECTION_IDS.drivers, group.groupId)
          ? []
          : group.rows.map((row) => row.rowId),
      )
  const visibleFeatureRowsForOverlay = !showFeatureStackSectionBody
    ? []
    : featureRows ?? []
  const visibleDriverRowIdsForOverlayKey = visibleDriverRowIdsForOverlay.join('|')
  const visibleFeatureRowsForOverlayKey = visibleFeatureRowsForOverlay
    .map((row) => row.rowId)
    .join('|')
  const internalDependencyEdgeKey = (internalDependencyEdges ?? [])
    .map((edge) => `${edge.id}:${edge.enabled ? '1' : '0'}:${edge.effective ? '1' : '0'}`)
    .join('|')
  const featureRowIndexKey = Object.entries(featureRowIndexById ?? {})
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([rowId, index]) => `${rowId}:${index}`)
    .join('|')
  const showInternalDependencyOverlay =
    isPartTemplate &&
    nodeMode === 'expanded' &&
    showInternalWiring &&
    visibleFeatureRowsForOverlay.length > 0 &&
    (internalDependencyEdges?.length ?? 0) > 0

  useEffect(() => {
    if (!showInternalDependencyOverlay) {
      setInternalDependencyPaths([])
      return
    }

    const partTemplateElement = partTemplateElementRef.current
    if (partTemplateElement === null) {
      return
    }

    const templateRect = partTemplateElement.getBoundingClientRect()
    const fallbackDriverYByRowId = Object.fromEntries(
      visibleDriverRowIdsForOverlay.map((rowId, index) => [rowId, 48 + index * 28]),
    ) as Record<string, number>
    const fallbackFeatureYByRowId = Object.fromEntries(
      visibleFeatureRowsForOverlay.map((row, index) => [
        row.rowId,
        220 + ((featureRowIndexById?.[row.rowId] ?? index) * 34),
      ]),
    ) as Record<string, number>

    const nextPaths = (internalDependencyEdges ?? []).flatMap((edge) => {
      if (edge.kind === 'driverToFeature' && !visibleDriverRowIdsForOverlay.includes(edge.sourceId)) {
        return []
      }
      const sourceElement =
        edge.sourceKind === 'driverRow'
          ? driverRowElementByIdRef.current[edge.sourceId]
          : featureRowElementByIdRef.current[`feature:${edge.sourceId}`]
      const targetElement = featureRowElementByIdRef.current[edge.targetRowId]

      const sourceRect = sourceElement?.getBoundingClientRect()
      const targetRect = targetElement?.getBoundingClientRect()

      const sourceX =
        sourceRect === undefined
          ? edge.sourceKind === 'driverRow'
            ? 28
            : templateRect.width * 0.44
          : sourceRect.right - templateRect.left
      const sourceY =
        sourceRect === undefined
          ? edge.sourceKind === 'driverRow'
            ? (fallbackDriverYByRowId[edge.sourceId] ?? 48)
            : (fallbackFeatureYByRowId[`feature:${edge.sourceId}`] ?? 220)
          : sourceRect.top - templateRect.top + sourceRect.height / 2
      const targetX =
        targetRect === undefined ? templateRect.width * 0.56 : targetRect.left - templateRect.left
      const targetY =
        targetRect === undefined
          ? (fallbackFeatureYByRowId[edge.targetRowId] ?? 220)
          : targetRect.top - templateRect.top + targetRect.height / 2

      return [
        {
          id: edge.id,
          d: buildDependencyPath(sourceX, sourceY, targetX, targetY),
          className: fallbackDependencyClassName(edge),
        },
      ]
    })

    setInternalDependencyPaths(nextPaths)
  }, [
    isCollapsedMode,
    isPartTemplate,
    nodeMode,
    showInternalDependencyOverlay,
    showInternalWiring,
    visibleDriverRowIdsForOverlayKey,
    visibleFeatureRowsForOverlayKey,
    internalDependencyEdgeKey,
    featureRowIndexKey,
  ])

  const renderLegacySections = () => {
    if (uiSections === undefined || uiSections.length === 0) {
      return null
    }
    const legacySectionGroupIds = uiSections.map((section) => section.sectionId)
    return (
      <section className="SpaghettiNodeSection SpaghettiTemplateAuxSection">
        {renderSectionHeader(
          'Other/Debug (Legacy)',
          SECTION_IDS.legacy,
          legacySectionGroupIds,
        )}
        {!isSectionCollapsed(SECTION_IDS.legacy) ? (
          <div className="SpaghettiNodeSections">
            {uiSections.map((section) => {
              const groupId = section.sectionId
              const collapsed = isGroupCollapsed(SECTION_IDS.legacy, groupId)
              return renderGroupHeader(
                section.label,
                SECTION_IDS.legacy,
                groupId,
                collapsed,
                <div className="SpaghettiNodeSectionItems">
                  {section.items.map((item) => (
                    <div
                      key={`${SECTION_IDS.legacySectionPrefix}-${groupId}-${item}`}
                      className="SpaghettiNodeSectionItem"
                    >
                      {item}
                    </div>
                  ))}
                </div>,
                <div className="SpaghettiNodeSectionItems SpaghettiNodeSectionItems--collapsed">
                  <span>...collapsed</span>
                </div>,
              )
            })}
          </div>
        ) : null}
      </section>
    )
  }

  const renderPartTemplate = () => {
    const controlRows = drivers ?? []
    const inputRows = inputs ?? []
    const outputRows = outputs ?? []
    const outputRemainder = otherOutputs ?? []
    const featureStackMode = nodeMode === 'expanded' ? 'full' : 'summary'
    const showExpandedExtras = nodeMode === 'expanded'
    const resolvedDriverGroups: DriverSectionGroupVm[] = resolvedDriverGroupsForOverlay
    const resolvedDriverRowIndexById = driverRowIndexById ?? {}
    const resolvedInputRowIndexById = inputRowIndexById ?? {}
    const resolvedOutputEndpointIndexByRowId = outputEndpointIndexByRowId ?? {}
    const resolvedOutputEndpointCount = outputEndpointCount ?? outputRows.length

    return (
      <div ref={partTemplateElementRef} className="SpaghettiNodeTemplate SpaghettiNodeTemplate--withInternalDeps">
        {renderPartSection(
          'drivers',
          'Drivers',
          <div className="SpaghettiNodeSectionItems">
            {resolvedDriverGroups.map((group) => {
              const collapsed = isGroupCollapsed(SECTION_IDS.drivers, group.groupId)
              return renderGroupHeader(
                group.label,
                SECTION_IDS.drivers,
                group.groupId,
                collapsed,
                <div className="SpaghettiDriverGroup">
                  {group.rows.map((driver) =>
                    renderDriverControlRow(driver, {
                      pinsOnly: false,
                      sectionIndex: resolvedDriverRowIndexById[driver.rowId],
                      sectionLength: controlRows.length,
                    }),
                  )}
                </div>,
                <div className="SpaghettiDriverGroupCollapsedSummary" />,
              )
            })}
          </div>,
          {
            forceGroupIds: resolvedDriverGroups.map((group) => group.groupId),
          },
        )}

        {renderPartSection(
          'inputs',
          'Inputs',
          <div className="SpaghettiNodePortColumn SpaghettiNodePortColumn--in">
            {inputRows.map((driver) =>
              renderInputRow(driver, {
                sectionIndex: resolvedInputRowIndexById[driver.rowId],
                sectionLength: inputRows.length,
              }),
            )}
          </div>,
        )}

        {renderPartSection(
          'featureStack',
          'Feature Stack',
          <FeatureStackView
            node={node}
            mode={featureStackMode}
            isGroupCollapsed={(groupId) => isGroupCollapsed(SECTION_IDS.featureStack, groupId)}
            onToggleGroup={(groupId) => onToggleGroup(SECTION_IDS.featureStack, groupId)()}
            featureRows={featureRows}
            onRegisterFeatureRowElement={(rowId, element) => {
              featureRowElementByIdRef.current[rowId] = element
            }}
            featureVirtualInputStateByPortId={featureVirtualInputStateByPortId}
          />,
        )}

        {renderPartSection(
          'outputs',
          'Outputs',
          <div className="SpaghettiNodePortColumn SpaghettiNodePortColumn--out">
            {outputRows.map((driver) =>
              renderOutputRow(driver, {
                sectionIndex:
                  driver.kind === 'endpoint'
                    ? resolvedOutputEndpointIndexByRowId[driver.rowId]
                    : undefined,
                sectionLength: resolvedOutputEndpointCount,
              }),
            )}
          </div>,
          {
            className:
              'SpaghettiNodeSection SpaghettiTemplateSection SpaghettiTemplateSection--outputs',
          },
        )}

        {showInternalDependencyOverlay ? (
          <svg
            className="SpaghettiInternalDependencyOverlay"
            data-sp-internal-dependency-overlay="1"
            aria-hidden="true"
          >
            {internalDependencyPaths.map((path) => (
              <path key={path.id} className={path.className} d={path.d} />
            ))}
          </svg>
        ) : null}

        {showExpandedExtras && outputRemainder.length > 0 ? (
          <section className="SpaghettiNodeSection SpaghettiTemplateSection SpaghettiTemplateSection--outputs SpaghettiNodeTemplateExtras">
            <div className="SpaghettiNodeSectionLabel">Other Outputs</div>
            <div className="SpaghettiNodePortColumn SpaghettiNodePortColumn--out">
              {outputRemainder.map((driver) =>
                renderOutputPortByType(driver.port, {
                  endpointPortId: driver.endpointPortId,
                  path: driver.endpointPath,
                  labelOverride: driver.labelOverride,
                }),
              )}
            </div>
          </section>
        ) : null}

        {showExpandedExtras ? renderLegacySections() : null}
      </div>
    )
  }

  const renderSketchTemplate = () => {
    const planePort = allInputs.find((port) => port.portId === 'SketchPlane')
    const entitiesPort = allInputs.find((port) => port.portId === 'SketchEntities')
    const planePickActive = activeSketchPlanePickNodeId === node.nodeId
    const activeSketchSession =
      activeGeometrySketchSession?.nodeId === node.nodeId ? activeGeometrySketchSession : null
    const managedSketch = (node.params.sketch as SketchFeature | undefined) ?? undefined
    const sketchComponents = managedSketch?.components ?? []
    const sketchProfiles = managedSketch?.outputs.profiles ?? []
    const sketchDiagnostics = managedSketch?.outputs.diagnostics ?? []
    const selectedProfile =
      sketchProfiles.find(
        (profile) => profile.profileId === managedSketch?.uiState.selectedProfileId,
      ) ??
      (sketchProfiles.length === 1 ? sketchProfiles[0] : null)
    const effectivePlaneLabel = sketchVm?.planeDriven === true
      ? `${sketchVm.effectivePlane} (wired)`
      : sketchVm?.effectivePlane ?? 'Unassigned'
    const headerChips: GeometryNodeShellChip[] = [
      {
        label: sketchVm?.planeDriven === true ? 'wired plane' : 'local plane',
        tone: sketchVm?.planeDriven === true ? 'accent' : 'default',
      },
      ...(activeSketchSession?.mode === 'draw'
        ? [
            {
              label: 'draw session',
              tone: 'success' as const,
            },
          ]
        : []),
    ]
    const summaryChips: GeometryNodeShellChip[] = [
      {
        label: `plane ${sketchVm?.effectivePlane ?? 'XY'}`,
        tone: sketchVm?.planeDriven === true ? 'accent' : 'default',
      },
      {
        label: `${sketchComponents.length} entities`,
      },
      {
        label: sketchProfileSummaryLabel(
          sketchVm?.profileCount ?? 0,
          sketchVm?.hasSelectedProfile ?? false,
          selectedProfile,
        ),
        tone:
          (sketchVm?.hasSelectedProfile ?? false) || (sketchVm?.profileCount ?? 0) === 1
            ? 'success'
            : sketchVm !== undefined && sketchVm.profileCount > 1
              ? 'warn'
              : 'default',
      },
    ]
    const diagnosticsContent =
      sketchDiagnostics.length > 0 ? (
        <div className="SpaghettiSketchDiagnostics">
          {sketchDiagnostics.map((diagnostic, index) => (
            <div
              key={`${diagnostic.code}-${index}`}
              className="SpaghettiSketchDiagnosticRow"
            >
              {diagnostic.code}: {diagnostic.message}
            </div>
          ))}
        </div>
      ) : undefined
    const planeRowController = getManagedStructuredWireRowProps('in', 'SketchPlane', 'SketchPlane')
    const sessionForNode =
      activeSketchPlanePickSession?.nodeId === node.nodeId ? activeSketchPlanePickSession : null
    const localPlane = sessionForNode?.draftPlane ?? managedSketch?.plane ?? 'XY'
    const planeTransform = sessionForNode?.draftTransform ?? managedSketch?.planeTransform ?? {
      offsetMm: 0,
      translation: { x: 0, y: 0, z: 0 },
      rotationDeg: { x: 0, y: 0, z: 0 },
      inPlaneRotationDeg: 0,
    }
    const entitiesRowController = getManagedStructuredWireRowProps(
      'in',
      'SketchEntities',
      'SketchDraw',
    )
    const renderSketchPlaneSectionTitle = (title: string, hint?: string) => (
      <div className="SpaghettiSketchPlaneControlHeader">
        <div className="SpaghettiSketchPlaneControlTitle">{title}</div>
        {hint !== undefined ? (
          <div className="SpaghettiSketchPlaneControlHint">{hint}</div>
        ) : null}
      </div>
    )
    const renderSketchPlaneAttachedBody = (mode: 'essentials' | 'expanded') => (
      <div className="SpaghettiSketchPlaneControlStack">
        <div className="SpaghettiSketchPlaneControlSection">
          {renderSketchPlaneSectionTitle(
            'Source',
            sketchVm?.planeDriven === true
              ? 'Wire drives the effective plane; local choice stays as fallback.'
              : 'Choose the base origin plane for this sketch.',
          )}
          <div className="SpaghettiSketchPlaneControlRows">
            <ParaSelect
              label="Origin Plane"
              value={localPlane}
              options={[
                { value: 'XY', label: 'XY' },
                { value: 'XZ', label: 'XZ' },
                { value: 'YZ', label: 'YZ' },
              ]}
              onChange={(nextValue) => {
                if (nextValue === 'XY' || nextValue === 'XZ' || nextValue === 'YZ') {
                  if (sessionForNode !== null) {
                    setSketchPlanePickDraftPlane(nextValue)
                    return
                  }
                  setGeometrySketchPlane(node.nodeId, nextValue)
                }
              }}
            />
            <div className="SpaghettiSketchPlaneControlActionRow">
              <button
                type="button"
                className={`SpaghettiSketchPlaneMiniAction ${planePickActive ? 'isActive' : ''}`}
                {...SP_INTERACTIVE_PROPS}
                onClick={(event) => {
                  event.stopPropagation()
                  if (planePickActive) {
                    cancelSketchPlanePick()
                    return
                  }
                  startSketchPlanePick(node.nodeId)
                }}
              >
                {planePickActive ? 'Cancel Viewer Pick' : 'Pick In Viewport'}
              </button>
            </div>
          </div>
        </div>
        <div className="SpaghettiSketchPlaneControlSection">
          {renderSketchPlaneSectionTitle(
            'Transform',
            mode === 'expanded'
              ? 'Adjust offset, translation, orientation, and local sketch rotation.'
              : 'Use compact transform controls for the first-pass setup.',
          )}
          <div className="SpaghettiSketchPlaneControlRows">
            <ParaSlider
              label="Offset"
              value={planeTransform.offsetMm}
              min={-200}
              max={200}
              step={0.1}
              onActivate={beginGraphParameterInteraction}
              onChange={(value) => setGeometrySketchPlaneOffset(node.nodeId, value)}
              onChangeEnd={() => endGraphParameterInteraction()}
              formatValue={(value) => `${value.toFixed(1)} mm`}
            />
            <ParaSlider
              label={mode === 'expanded' ? 'In-Plane Rotation' : 'Rotation'}
              value={planeTransform.inPlaneRotationDeg}
              min={-180}
              max={180}
              step={1}
              allowWrap
              onActivate={beginGraphParameterInteraction}
              onChange={(value) => setGeometrySketchPlaneInPlaneRotation(node.nodeId, value)}
              onChangeEnd={() => endGraphParameterInteraction()}
              formatValue={(value) => `${value.toFixed(0)} deg`}
            />
            {mode === 'expanded' ? (
              <>
                <ParaSlider
                  label="Translate X"
                  value={planeTransform.translation.x}
                  min={-200}
                  max={200}
                  step={0.1}
                  onActivate={beginGraphParameterInteraction}
                  onChange={(value) =>
                    sessionForNode !== null
                      ? setSketchPlanePickTranslationAxis('x', value)
                      : setGeometrySketchPlaneTranslationAxis(node.nodeId, 'x', value)
                  }
                  onChangeEnd={() => endGraphParameterInteraction()}
                  formatValue={(value) => `${value.toFixed(1)} mm`}
                />
                <ParaSlider
                  label="Translate Y"
                  value={planeTransform.translation.y}
                  min={-200}
                  max={200}
                  step={0.1}
                  onActivate={beginGraphParameterInteraction}
                  onChange={(value) =>
                    sessionForNode !== null
                      ? setSketchPlanePickTranslationAxis('y', value)
                      : setGeometrySketchPlaneTranslationAxis(node.nodeId, 'y', value)
                  }
                  onChangeEnd={() => endGraphParameterInteraction()}
                  formatValue={(value) => `${value.toFixed(1)} mm`}
                />
                <ParaSlider
                  label="Translate Z"
                  value={planeTransform.translation.z}
                  min={-200}
                  max={200}
                  step={0.1}
                  onActivate={beginGraphParameterInteraction}
                  onChange={(value) =>
                    sessionForNode !== null
                      ? setSketchPlanePickTranslationAxis('z', value)
                      : setGeometrySketchPlaneTranslationAxis(node.nodeId, 'z', value)
                  }
                  onChangeEnd={() => endGraphParameterInteraction()}
                  formatValue={(value) => `${value.toFixed(1)} mm`}
                />
                <ParaSlider
                  label="Rotate X"
                  value={planeTransform.rotationDeg.x}
                  min={-180}
                  max={180}
                  step={1}
                  allowWrap
                  onActivate={beginGraphParameterInteraction}
                  onChange={(value) =>
                    sessionForNode !== null
                      ? setSketchPlanePickRotationAxis('x', value)
                      : setGeometrySketchPlaneRotationAxis(node.nodeId, 'x', value)
                  }
                  onChangeEnd={() => endGraphParameterInteraction()}
                  formatValue={(value) => `${value.toFixed(0)} deg`}
                />
                <ParaSlider
                  label="Rotate Y"
                  value={planeTransform.rotationDeg.y}
                  min={-180}
                  max={180}
                  step={1}
                  allowWrap
                  onActivate={beginGraphParameterInteraction}
                  onChange={(value) =>
                    sessionForNode !== null
                      ? setSketchPlanePickRotationAxis('y', value)
                      : setGeometrySketchPlaneRotationAxis(node.nodeId, 'y', value)
                  }
                  onChangeEnd={() => endGraphParameterInteraction()}
                  formatValue={(value) => `${value.toFixed(0)} deg`}
                />
                <ParaSlider
                  label="Rotate Z"
                  value={planeTransform.rotationDeg.z}
                  min={-180}
                  max={180}
                  step={1}
                  allowWrap
                  onActivate={beginGraphParameterInteraction}
                  onChange={(value) =>
                    sessionForNode !== null
                      ? setSketchPlanePickRotationAxis('z', value)
                      : setGeometrySketchPlaneRotationAxis(node.nodeId, 'z', value)
                  }
                  onChangeEnd={() => endGraphParameterInteraction()}
                  formatValue={(value) => `${value.toFixed(0)} deg`}
                />
              </>
            ) : null}
          </div>
        </div>
      </div>
    )
    const renderSketchEntitiesAttachedBody = (mode: 'essentials' | 'expanded') => (
      <div className="SpaghettiSketchSectionBody">
        <div className="SpaghettiSketchActionRow">
          <div className="SpaghettiSketchActionMeta">
            <div className="SpaghettiSketchActionTitle">Draw</div>
            <div className="SpaghettiSketchActionHint">
              Open the viewer-side sketch toolbar and author primitives on this managed sketch.
            </div>
          </div>
          <button
            type="button"
            className={`SpaghettiSketchActionButton ${
              activeSketchSession?.mode === 'draw' ? 'isActive' : ''
            }`}
            {...SP_INTERACTIVE_PROPS}
            onClick={(event) => {
              event.stopPropagation()
              startGeometrySketchSession(node.nodeId, 'draw')
            }}
          >
            {activeSketchSession?.mode === 'draw' ? 'Resume Draw' : 'Draw'}
          </button>
        </div>
        {mode === 'expanded' ? (
          sketchComponents.length === 0 ? (
            <div className="SpaghettiSketchPlaceholder" data-sp-sketch-placeholder="draw">
              <div className="SpaghettiSketchPlaceholderTitle">No sketch entities yet</div>
              <div className="SpaghettiSketchPlaceholderBody">
                Use Draw to add `Line` or `PLine` in the main viewport.
              </div>
            </div>
          ) : (
            <div className="SpaghettiSketchEntityList" data-sp-sketch-entity-list="1">
              {sketchComponents.map((component, index) => (
                <div
                  key={component.rowId}
                  className="SpaghettiSketchEntityRow"
                  data-sp-sketch-entity-row={component.type}
                >
                  <div className="SpaghettiSketchEntityMeta">
                    <div className="SpaghettiSketchEntityTitle">
                      {sketchComponentTitle(component)} {index + 1}
                    </div>
                    <div className="SpaghettiSketchEntitySummary">
                      {formatSketchComponentSummary(component)}
                    </div>
                  </div>
                  <div className="SpaghettiSketchEntityActions">
                    <button
                      type="button"
                      {...SP_INTERACTIVE_PROPS}
                      onClick={(event) => {
                        event.stopPropagation()
                        moveGeometrySketchComponentUp(node.nodeId, component.rowId)
                      }}
                      aria-label="Move sketch entity up"
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      {...SP_INTERACTIVE_PROPS}
                      onClick={(event) => {
                        event.stopPropagation()
                        moveGeometrySketchComponentDown(node.nodeId, component.rowId)
                      }}
                      aria-label="Move sketch entity down"
                    >
                      Down
                    </button>
                    <button
                      type="button"
                      {...SP_INTERACTIVE_PROPS}
                      onClick={(event) => {
                        event.stopPropagation()
                        removeGeometrySketchComponent(node.nodeId, component.rowId)
                      }}
                      aria-label="Delete sketch entity"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : null}
      </div>
    )
    const renderManagedSketchOutputPort = (port: PortSpec) => {
      if (!isGeometryPortRowManaged('out', port.portId)) {
        return renderOutputPortByType(port)
      }
      if (!isGeometryPortRowVisibleForMode('out', port.portId)) {
        return null
      }
      const rowController = getManagedStructuredWireRowProps('out', port.portId, port.label)

      return renderOutputPortByType(port, {
        rowChevronState: rowController.rowChevronState,
        onCycleRowChevron: rowController.onCycleRowChevron,
        rowToggleAriaLabel: rowController.rowToggleAriaLabel,
        hideDetailsToggle: true,
      })
    }

    return (
      <GeometryNodeShell
        className="SpaghettiSketchNodeTemplate"
        title="Sketch"
        badge="Geometry"
        headerChips={headerChips}
        summaryChips={summaryChips}
        inputRailOpen={isGeometryBlockOpen('inputs')}
        onInputRailToggle={() => toggleGeometryBlock('inputs')}
        outputRailOpen={isGeometryBlockOpen('outputs')}
        onOutputRailToggle={() => toggleGeometryBlock('outputs')}
        inputRail={
          <div className="SpaghettiNodePortColumn SpaghettiNodePortColumn--in">
            {planePort !== undefined
              ? renderInputPortByType(planePort, {
                  endpointPortId: planePort.portId,
                  resolvedValueLabel: effectivePlaneLabel,
                  rowChevronState: planeRowController.rowChevronState,
                  onCycleRowChevron: planeRowController.onCycleRowChevron,
                  rowToggleAriaLabel: planeRowController.rowToggleAriaLabel,
                  hideDetailsToggle: true,
                  attachedBodyContent:
                    planeRowController.rowChevronState === 'collapsed'
                      ? undefined
                      : renderSketchPlaneAttachedBody(planeRowController.rowChevronState),
                })
              : null}
            {entitiesPort !== undefined
              ? renderInputPortByType(entitiesPort, {
                  endpointPortId: entitiesPort.portId,
                  resolvedValueLabel:
                    sketchComponents.length === 0
                      ? 'No sketch entities yet'
                      : `${sketchComponents.length} entities`,
                  rowChevronState: entitiesRowController.rowChevronState,
                  onCycleRowChevron: entitiesRowController.onCycleRowChevron,
                  rowToggleAriaLabel: entitiesRowController.rowToggleAriaLabel,
                  hideDetailsToggle: true,
                  attachedBodyContent:
                    entitiesRowController.rowChevronState === 'collapsed'
                      ? undefined
                      : renderSketchEntitiesAttachedBody(entitiesRowController.rowChevronState),
                })
              : null}
          </div>
        }
        outputRail={
          <div className="SpaghettiNodePortColumn SpaghettiNodePortColumn--out">
            {allOutputs.map((port) => renderManagedSketchOutputPort(port))}
          </div>
        }
        diagnostics={diagnosticsContent}
      />
    )
  }

  const renderExtrudeTemplate = () => {
    const profilePort = allInputs.find((port) => port.portId === 'ExtrusionProfile')
    const typePort = allInputs.find((port) => port.portId === 'Type')
    const depthPort = allInputs.find((port) => port.portId === 'Depth')
    const solidBodyPort = allOutputs.find((port) => port.portId === 'SolidBody')
    const extrudeType = extrudeVm?.extrudeType ?? 'Body'
    const localExtrudeType = extrudeVm?.localExtrudeType ?? extrudeType
    const effectiveDepthMm = extrudeVm?.effectiveDepthMm ?? 20
    const localDepthMm =
      typeof node.params.depthMm === 'number' ? node.params.depthMm : effectiveDepthMm
    const profileSummary =
      extrudeVm?.hasProfile === true
        ? `${extrudeVm.profileId?.slice(0, 8) ?? 'profile'} | area ${formatPinValue(
            extrudeVm.profileArea ?? 0,
          )}`
        : 'Awaiting wire'
    const bodySummaryReady =
      extrudeType === 'Walls'
        ? `Walls ready: ${extrudeVm?.bodyId ?? ''} (uncapped side walls)`
        : `Body ready: ${extrudeVm?.bodyId ?? ''} (capped result)`
    const bodySummary =
      extrudeVm?.bodyId !== undefined
        ? bodySummaryReady
        : extrudeType === 'Walls'
          ? 'Waiting for one profile and positive depth to generate uncapped side walls.'
          : 'Waiting for one profile and positive depth to generate a capped body.'
    const profileRowController = getManagedStructuredWireRowProps(
      'in',
      'ExtrusionProfile',
      'SketchProfile',
    )
    const renderExtrudeProfileAttachedBody = (mode: 'essentials' | 'expanded') => (
      <div className="SpaghettiSketchSectionBody">
        <div className="SpaghettiSketchActionRow">
          <div className="SpaghettiSketchActionMeta">
            <div className="SpaghettiSketchActionTitle">Profile Target</div>
            <div className="SpaghettiSketchActionHint">
              {extrudeVm?.hasProfile === true
                ? 'Consume one upstream SketchProfile from Geometry/Sketch as the start face for this extrude.'
                : 'Wire one SketchProfile from Geometry/Sketch into this extrude.'}
            </div>
          </div>
        </div>
        {mode === 'expanded' ? (
          extrudeVm?.hasProfile === true ? (
            <div className="SpaghettiSketchEntityList" data-sp-extrude-profile-summary="1">
              <div className="SpaghettiSketchEntityRow" data-sp-extrude-profile-row="summary">
                <div className="SpaghettiSketchEntityMeta">
                  <div className="SpaghettiSketchEntityTitle">Resolved SketchProfile</div>
                  <div className="SpaghettiSketchEntitySummary">{profileSummary}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="SpaghettiSketchPlaceholder" data-sp-extrude-placeholder="profile">
              <div className="SpaghettiSketchPlaceholderTitle">No SketchProfile wired yet</div>
              <div className="SpaghettiSketchPlaceholderBody">
                Connect one `SketchProfile` output from `Geometry/Sketch`.
              </div>
            </div>
          )
        ) : null}
      </div>
    )
    const updateExtrudeParams = (nextParams: Record<string, unknown>) => {
      applyGraphCommand(
        setNodeParamsCommand({
          nodeId: node.nodeId,
          params: nextParams,
        }),
      )
    }
    const depthRowProps = createStructuredWireNumericRowProps({
      effectiveValue: effectiveDepthMm,
      localFallbackValue: localDepthMm,
      unitLabel: 'mm',
      driven: extrudeVm?.depthDriven === true,
      editorEnabled: showEditors,
      inputRange: {
        min: 0.1,
        max: 2000,
        step: 0.1,
      },
      onChange: (value) => {
        updateExtrudeParams({
          ...node.params,
          depthMm: value,
        })
      },
      formatValueLabel: formatPinValue,
    })
    const typeRowProps = createStructuredWireEnumRowProps({
      label: 'Type',
      localFallbackValue: localExtrudeType,
      effectiveValue: extrudeType,
      driven: extrudeVm?.typeDriven === true,
      options: [
        { value: 'Body', label: 'Body' },
        { value: 'Walls', label: 'Walls' },
      ],
      onChange: (value) => {
        if (value !== 'Body' && value !== 'Walls') {
          return
        }
        updateExtrudeParams({
          ...node.params,
          extrudeType: value,
        })
      },
    })

    return (
      <GeometryNodeShell
        className="SpaghettiExtrudeNodeTemplate"
        title="Extrude"
        badge="Geometry"
        inputRailOpen={isGeometryBlockOpen('inputs')}
        onInputRailToggle={() => toggleGeometryBlock('inputs')}
        outputRailOpen={isGeometryBlockOpen('outputs')}
        onOutputRailToggle={() => toggleGeometryBlock('outputs')}
        inputRail={
          <div className="SpaghettiExtrudeInputStack">
            {profilePort !== undefined ? (
              <div className="SpaghettiExtrudeInputStackPrimary">
                {renderInputPortByType(profilePort, {
                  portClassName: 'SpaghettiExtrudeProfilePortRow',
                  endpointPortId: profilePort.portId,
                  labelOverride: 'SketchProfile',
                  resolvedValueLabel: profileSummary,
                  rowChevronState: profileRowController.rowChevronState,
                  onCycleRowChevron: profileRowController.onCycleRowChevron,
                  rowToggleAriaLabel: profileRowController.rowToggleAriaLabel,
                  hideDetailsToggle: true,
                  attachedBodyContent:
                    profileRowController.rowChevronState === 'collapsed'
                      ? undefined
                      : renderExtrudeProfileAttachedBody(profileRowController.rowChevronState),
                })}
              </div>
            ) : null}
            {typePort !== undefined ? (
              <div className="SpaghettiExtrudeInputStackPrimary">
                <StructuredWireEnumRow
                  className="SpaghettiExtrudeTypeRow"
                  nodeId={node.nodeId}
                  endpointPortId={typePort.portId}
                  port={typePort}
                  setPortElement={(element) =>
                    onRegisterPortElement(node.nodeId, 'in', typePort.portId, undefined, element)
                  }
                  dropState={getInputDropState({
                    nodeId: node.nodeId,
                    portId: typePort.portId,
                  })}
                  portColorOverride={STRUCTURED_WIRE_ENUM_INPUT_COLOR}
                  onInputPointerDown={onInputPointerDown}
                  onInputPointerEnter={onInputPointerEnter}
                  onInputPointerLeave={onInputPointerLeave}
                  label={typeRowProps.label}
                  value={typeRowProps.value}
                  valueLabel={typeRowProps.valueLabel}
                  displayedTrackValue={typeRowProps.displayedTrackValue}
                  displayedTrackLabel={typeRowProps.displayedTrackLabel}
                  options={typeRowProps.options}
                  selectedIndex={typeRowProps.selectedIndex}
                  displayedIndex={typeRowProps.displayedIndex}
                  optionCount={typeRowProps.optionCount}
                  disabled={typeRowProps.disabled || !showEditors}
                  driven={typeRowProps.driven}
                  drivenMessage={typeRowProps.drivenMessage}
                  onChange={typeRowProps.onChange}
                />
              </div>
            ) : null}
            {depthPort !== undefined ? (
              <div className="SpaghettiNodePortColumn SpaghettiNodePortColumn--in SpaghettiExtrudeInputStackSecondary">
                {renderInputPortByType(depthPort, {
                  endpointPortId: depthPort.portId,
                  valueInput: depthRowProps.valueInput,
                })}
              </div>
            ) : null}
          </div>
        }
        outputRail={
          <div className="SpaghettiNodePortColumn SpaghettiNodePortColumn--out">
            {solidBodyPort !== undefined ? renderOutputPortByType(solidBodyPort) : null}
            <div className="SpaghettiSketchPlaceholder" data-sp-extrude-body-summary="1">
              <div className="SpaghettiSketchPlaceholderTitle">SolidBody</div>
              <div className="SpaghettiSketchPlaceholderBody">{bodySummary}</div>
            </div>
          </div>
        }
      />
    )
  }

  const renderOutputPreviewTemplate = () => (
    <div className="SpaghettiNodeTemplate SpaghettiOutputPreviewTemplate">
      <section className="SpaghettiNodeSection SpaghettiTemplateSection SpaghettiOutputPreviewSection">
        <label className="SpaghettiOutputPreviewComponentRow" {...SP_INTERACTIVE_PROPS}>
          <span className="SpaghettiNodeSectionLabel">Component</span>
          <input
            className="SpaghettiOutputPreviewComponentInput"
            type="text"
            value={outputPreviewComponentLabel ?? ''}
            disabled={!showEditors}
            onPointerDown={(event) => event.stopPropagation()}
            onChange={(event) => {
              onOutputPreviewComponentLabelChange?.(node.nodeId, event.target.value)
            }}
          />
        </label>
        <div className="SpaghettiNodeSectionLabel">Parts List</div>
        <div className="SpaghettiNodePortColumn SpaghettiNodePortColumn--in">
          {(outputPreviewRows ?? []).map((row) => (
            <div
              key={row.rowId}
              className="SpaghettiOutputPreviewRow"
              data-sp-output-preview-slot-id={row.slotId}
            >
              {row.objectId !== undefined ? (
                <label className="SpaghettiOutputPreviewObjectRow" {...SP_INTERACTIVE_PROPS}>
                  <span>Object</span>
                  <input
                    className="SpaghettiOutputPreviewObjectInput"
                    type="text"
                    value={row.objectLabel ?? row.slotId}
                    disabled={!showEditors}
                    onPointerDown={(event) => event.stopPropagation()}
                    onChange={(event) => {
                      onOutputPreviewObjectLabelChange?.(
                        node.nodeId,
                        row.objectId!,
                        event.target.value,
                      )
                    }}
                  />
                </label>
              ) : null}
              {renderInputPortByType(row.port, {
                endpointPortId: row.port.portId,
                labelOverride: row.objectLabel ?? row.slotId,
                resolvedValueLabel: row.statusPrimary,
              })}
              {row.statusSecondary !== undefined ? (
                <div
                  className={`SpaghettiOutputPreviewMeta ${
                    row.isTrailingEmpty ? 'SpaghettiOutputPreviewHint' : ''
                  }`}
                  {...SP_INTERACTIVE_PROPS}
                >
                  {row.statusSecondary}
                </div>
              ) : null}
              {row.slotStatus === 'unresolved' ? (
                <div
                  className="SpaghettiOutputPreviewWarning"
                  title={row.warningMessage ?? 'Unresolved slot input.'}
                  {...SP_INTERACTIVE_PROPS}
                >
                  !
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  )

  const renderUtilityNodeTemplate = () => {
    if (utilityVm === undefined) {
      return null
    }

    const outputPort = renderOutputPortByType(utilityVm.outputPort, {
      endpointPortId: utilityVm.outputPort.portId,
    })

    const renderEditor = () => {
      if (utilityVm.kind === 'paramNumber') {
        return (
          <NumberField
            scrubLabel=""
            value={utilityVm.value}
            min={-2000}
            max={2000}
            step={0.1}
            disabled={!showEditors}
            scrubSpeed={scrubSensitivity}
            tone="white"
            compact
            onChange={(value) => {
              onUtilityNumberValueChange(node.nodeId, value)
            }}
          />
        )
      }

      if (utilityVm.kind === 'paramBoolean') {
        return (
          <label className="SpaghettiUtilityNodeToggle" {...SP_INTERACTIVE_PROPS}>
            <input
              type="checkbox"
              checked={utilityVm.value}
              disabled={!showEditors}
              onPointerDown={(event) => event.stopPropagation()}
              onChange={(event) => {
                onUtilityBooleanValueChange(node.nodeId, event.target.checked)
              }}
            />
            <span>{utilityVm.value ? 'True' : 'False'}</span>
          </label>
        )
      }

      return (
        <Vec2Field
          x={{
            value: utilityVm.value.x,
            step: 0.1,
            disabled: !showEditors,
            onChange: (value) => {
              onUtilityVec2AxisChange(node.nodeId, 'x', value)
            },
          }}
          y={{
            value: utilityVm.value.y,
            step: 0.1,
            disabled: !showEditors,
            onChange: (value) => {
              onUtilityVec2AxisChange(node.nodeId, 'y', value)
            },
          }}
          scrubSpeed={scrubSensitivity}
          tone="white"
        />
      )
    }

    return (
      <div className="SpaghettiNodeTemplate SpaghettiUtilityNodeTemplate">
        <section className="SpaghettiNodeSection SpaghettiUtilityNodeSection">
          <div className="SpaghettiUtilityNodeEditorRow" {...SP_INTERACTIVE_PROPS}>
            <span className="SpaghettiUtilityNodeEditorLabel">Value</span>
            <div className="SpaghettiUtilityNodeEditorControl">{renderEditor()}</div>
          </div>
        </section>
        <section className="SpaghettiNodeSection SpaghettiUtilityNodeSection SpaghettiUtilityNodeSection--outputs">
          <div className="SpaghettiNodePortColumn SpaghettiNodePortColumn--out">
            {outputPort}
          </div>
        </section>
      </div>
    )
  }

  const renderLegacyNodePorts = () => (
    <>
      <div className="SpaghettiNodePorts">
        <div className="SpaghettiNodePortColumn SpaghettiNodePortColumn--in">
          {allInputs.map((port) => renderInputPortByType(port))}
        </div>

        <div className="SpaghettiNodePortColumn SpaghettiNodePortColumn--out">
          {allOutputs.map((port) => renderOutputPortByType(port))}
        </div>
      </div>

      {!isCollapsedMode && uiSections !== undefined && uiSections.length > 0 ? (
        <div className="SpaghettiNodeSections">
          {uiSections.map((section) => (
            <section key={section.sectionId} className="SpaghettiNodeSection">
              <div className="SpaghettiNodeSectionLabel">{section.label}</div>
              <div className="SpaghettiNodeSectionItems">
                {section.items.map((item) => (
                  <div key={`${section.sectionId}-${item}`} className="SpaghettiNodeSectionItem">
                    {item}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : null}
    </>
  )

  return (
    <article
      ref={nodeElementRef}
      data-sp-node-id={node.nodeId}
      className={`SpaghettiNode ${selected ? 'SpaghettiNode--selected' : ''} ${
        previewed ? 'SpaghettiNode--previewed' : ''
      } ${
        showInternalWiring ? 'SpaghettiNode--showInternalWiring' : ''
      }`}
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      <header
        className="SpaghettiNodeHeader"
        data-sp-node-header-zone="1"
        onPointerDown={handleNodeHeaderPointerDown}
      >
        <div className="SpaghettiNodeHeaderMain">
          <button
            type="button"
            className="SpaghettiWindowAction SpaghettiNodeModeButton"
            data-sp-node-title-cycle="1"
            aria-label={nodeModeButtonTitle}
            title={nodeModeButtonTitle}
            {...SP_INTERACTIVE_PROPS}
            onPointerDown={handleNodeTitlePointerDown}
            onClick={handleNodeTitleClick}
          >
            {nodeModeButtonLabel}
          </button>
          <strong className="SpaghettiNodeTitleText">{title}</strong>
        </div>
        <span className="SpaghettiNodeType">{node.type}</span>
      </header>

      <div
        className="SpaghettiNodeBody"
        data-sp-node-body-zone="1"
        onPointerDown={handleNodeBodyPointerDown}
      >
        {showPresetPicker ? (
          <label className="SpaghettiNodePresetRow">
            <span>Preset</span>
            <span className="SpaghettiNodePresetControls">
              <select
                value={presetValue}
                onChange={(event) => onPresetChange(node.nodeId, event.target.value)}
                onPointerDown={(event) => event.stopPropagation()}
              >
                {(presetOptions ?? ['default']).map((option) => (
                  <option key={option} value={option}>
                    {`> ${option}`}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="SpaghettiNodeToolbarToggle"
                aria-label={
                  toolbarEditorOpen
                    ? 'Hide node toolbar controls'
                    : 'Show node toolbar controls'
                }
                {...SP_INTERACTIVE_PROPS}
                onClick={() => setToolbarEditorOpen((current) => !current)}
              >
                {toolbarEditorOpen ? '\u25BE' : '\u25B8'}
              </button>
            </span>
          </label>
        ) : null}

        {showPresetPicker && toolbarEditorOpen ? (
          <section className="SpaghettiNodeToolbarEditor" {...SP_INTERACTIVE_PROPS}>
            <label className="SpaghettiNodeToolbarRow">
              <span>Sensitivity</span>
              <input
                className="SpaghettiNodeToolbarSlider"
                type="range"
                min={0}
                max={100}
                step={1}
                value={scrubSensitivity}
                onChange={(event) => {
                  const next = Number(event.target.value)
                  if (!Number.isFinite(next)) {
                    return
                  }
                  setScrubSensitivity(Math.max(0, Math.min(100, next)))
                }}
              />
              <span className="SpaghettiNodeToolbarValue">{scrubSensitivity}</span>
            </label>
            <label className="SpaghettiNodeToolbarRow">
              <span>Output Height</span>
              <input
                className="SpaghettiNodeToolbarSlider"
                type="range"
                min={16}
                max={48}
                step={1}
                value={outputRowMinHeight}
                onChange={(event) => {
                  const next = Number(event.target.value)
                  if (!Number.isFinite(next)) {
                    return
                  }
                  onOutputRowMinHeightChange(Math.max(16, Math.min(48, Math.round(next))))
                }}
              />
              <span className="SpaghettiNodeToolbarValue">{outputRowMinHeight}</span>
            </label>
            <label className="SpaghettiNodeToolbarRow">
              <span>Pin Size</span>
              <input
                className="SpaghettiNodeToolbarSlider"
                type="range"
                min={5}
                max={16}
                step={1}
                value={pinDotSize}
                onChange={(event) => {
                  const next = Number(event.target.value)
                  if (!Number.isFinite(next)) {
                    return
                  }
                  onPinDotSizeChange(Math.max(5, Math.min(16, Math.round(next))))
                }}
              />
              <span className="SpaghettiNodeToolbarValue">{pinDotSize}</span>
            </label>
            <label className="SpaghettiNodeToolbarRow SpaghettiNodeToolbarRow--toggle">
              <input
                type="checkbox"
                checked={showInternalWiring}
                onChange={(event) => setShowInternalWiring(event.target.checked)}
              />
              <span>Show internal wiring</span>
            </label>
          </section>
        ) : null}

        {node.type === OUTPUT_PREVIEW_NODE_TYPE && outputPreviewRows !== undefined
          ? renderOutputPreviewTemplate()
          : isPartTemplate
            ? renderPartTemplate()
            : isSketchTemplate
              ? renderSketchTemplate()
              : isExtrudeTemplate
                ? renderExtrudeTemplate()
            : utilityVm !== undefined
              ? renderUtilityNodeTemplate()
              : renderLegacyNodePorts()}

        {showDebugInfo ? <pre className="SpaghettiNodeParams">{paramsText}</pre> : null}

        <SpaghettiContextMenu
          open={compositeContextMenu !== null}
          x={compositeContextMenu?.x ?? 0}
          y={compositeContextMenu?.y ?? 0}
          onClose={() => setCompositeContextMenu(null)}
          items={
            compositeContextMenu === null
              ? []
              : [
                  {
                    id: menuPortExpanded ? 'group-composite' : 'break-composite',
                    label: menuPortExpanded ? 'Group pins' : 'Break composite',
                    disabled: !canMutateCompositeExpansion,
                    onSelect: () => {
                      if (menuPortId === undefined || !canMutateCompositeExpansion) {
                        return
                      }
                      setCompositeExpandedForNode('in', menuPortId, !menuPortExpanded)
                      setCompositeContextMenu(null)
                    },
                  },
                  ...(showDebugInfo
                    ? [
                        {
                          id: menuPortInfoExpanded ? 'hide-info' : 'show-info',
                          label: menuPortInfoExpanded ? 'Hide info' : 'Show info',
                          onSelect: () => {
                            if (menuPortDetailsKey === undefined) {
                              return
                            }
                            setExpandedDetails((current) => ({
                              ...current,
                              [menuPortDetailsKey]: !menuPortInfoExpanded,
                            }))
                            setCompositeContextMenu(null)
                          },
                        },
                      ]
                    : []),
                ]
          }
        />
      </div>
    </article>
  )
}

export const NodeView = memo(NodeViewComponent)
NodeView.displayName = 'NodeView'
