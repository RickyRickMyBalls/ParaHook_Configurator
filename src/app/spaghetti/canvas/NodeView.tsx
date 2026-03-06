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
import type { PartRowOrderSection } from '../parts/partRowOrder'
import {
  getFieldTree,
  isCompositeFieldNode,
  listLeafFieldPaths,
} from '../types/fieldTree'
import { SpaghettiContextMenu } from '../ui/SpaghettiContextMenu'
import { FeatureStackView } from '../ui/FeatureStackView'
import { PortView, type PortDetailLine } from './PortView'
import type { CompositeExpansionDirection } from './compositeExpansion'
import { NumberField } from './fields/NumberField'
import { Vec2Field } from './fields/Vec2Field'
import { getTypeColor } from './typeColors'
import type {
  DriverControlRowVm,
  DriverEndpointRowVm,
  DriverNumberChange,
  InputEndpointRowVm,
  OutputPinnedRowVm,
} from './driverVm'
import type { PortDirection } from './types'
import { getRowViewFlags, type RowViewMode } from './rowViewMode'
import {
  buildCompositeCollapseKey,
  buildGroupCollapseKey,
  buildSectionCollapseKey,
  useSpaghettiUiStore,
} from './state/spaghettiUiStore'
import { SP_INTERACTIVE_PROPS } from '../spInteractive'
import { OUTPUT_PREVIEW_NODE_TYPE } from '../system/outputPreviewNode'
import type {
  DriverRowWarningVm,
  DriverSectionGroupVm,
  FeatureDependencyEdge,
  FeatureDependencyRow,
  NodeInputCompositeState,
  OutputPreviewSlotRowVm,
} from '../selectors'

const DEV = import.meta.env.DEV
const DEV_PROBE_NODE_ID_KEY = '__SP_PROBE_NODE_ID'
type DevProbeWindow = Window & { [DEV_PROBE_NODE_ID_KEY]?: string }

const SECTION_IDS = {
  drivers: 'drivers',
  inputs: 'inputs',
  featureStack: 'featureStack',
  outputs: 'outputs',
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
  rowViewMode: RowViewMode
  x: number
  y: number
  title: string
  template?: 'part'
  allInputs: PortSpec[]
  allOutputs: PortSpec[]
  drivers?: DriverControlRowVm[]
  inputs?: InputEndpointRowVm[]
  outputs?: OutputPinnedRowVm[]
  otherOutputs?: DriverEndpointRowVm[]
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
  primitiveNumberValue?: number
  selected: boolean
  getInputDropState: (payload: EndpointPayload) => PortDropState
  getOutputDropState: (payload: EndpointPayload) => PortDropState
  onPresetChange: (nodeId: string, presetId: string) => void
  onDriverNumberChange: (
    nodeId: string,
    change: DriverNumberChange,
    value: number,
  ) => void
  onMoveSectionRow?: (
    nodeId: string,
    section: PartRowOrderSection,
    rowId: string,
    direction: 'up' | 'down',
  ) => void
  onPrimitiveNumberValueChange: (nodeId: string, value: number) => void
  outputRowMinHeight: number
  onOutputRowMinHeightChange: (value: number) => void
  pinDotSize: number
  onPinDotSizeChange: (value: number) => void
  onNodePointerDown: (event: PointerEvent<HTMLElement>, nodeId: string) => void
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
  rowViewMode,
  x,
  y,
  title,
  template,
  allInputs,
  allOutputs,
  drivers,
  inputs,
  outputs,
  otherOutputs,
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
  primitiveNumberValue,
  selected,
  getInputDropState,
  getOutputDropState,
  onPresetChange,
  onDriverNumberChange,
  onMoveSectionRow,
  onPrimitiveNumberValueChange,
  outputRowMinHeight,
  onOutputRowMinHeightChange,
  pinDotSize,
  onPinDotSizeChange,
  onNodePointerDown,
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

  const rowFlags = getRowViewFlags(rowViewMode)
  const isCollapsedMode = rowViewMode === 'collapsed'
  const showDebugInfo = rowFlags.showDebugInfo
  const showEditors = rowFlags.showEditors
  const canMutateCompositeExpansion = rowViewMode === 'essentials'
  const isPartTemplate = template === 'part'
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

  const isCollapsed = useSpaghettiUiStore((state) => state.isCollapsed)
  const toggleCollapsed = useSpaghettiUiStore((state) => state.toggleCollapsed)
  const setCollapsed = useSpaghettiUiStore((state) => state.setCollapsed)

  const sectionKey = (sectionId: string): string =>
    buildSectionCollapseKey(node.nodeId, sectionId)
  const groupKey = (sectionId: string, groupId: string): string =>
    buildGroupCollapseKey(node.nodeId, sectionId, groupId)
  const compositeKey = (sectionId: string, portId: string): string =>
    buildCompositeCollapseKey(node.nodeId, sectionId, portId)

  const isSectionCollapsed = (sectionId: string): boolean =>
    isCollapsed(sectionKey(sectionId))

  const isGroupCollapsed = (sectionId: string, groupId: string): boolean =>
    isCollapsed(groupKey(sectionId, groupId))

  const isCompositeCollapsed = (sectionId: string, portId: string): boolean =>
    isCollapsed(compositeKey(sectionId, portId))

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
      inputWiringDisabled?: boolean
      drivenMessage?: string
      editDisabled?: boolean
      suppressEditors?: boolean
      resolvedValueLabel?: string
      valueInput?: {
        value: number
        min?: number
        max?: number
        step?: number
        showSlider?: boolean
        disabled?: boolean
        driven?: boolean
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
        detailsExpanded={showDebugInfo && expandedDetails[detailsKey] === true}
        onToggleDetails={
          !showDebugInfo || options?.showDetailsToggle === false
            ? undefined
            : () =>
                setExpandedDetails((current) => ({
                  ...current,
                  [detailsKey]: !current[detailsKey],
                }))
        }
        valueInput={valueInput}
        valueBarTone={options?.valueBarTone ?? 'blue'}
        childTone={path !== undefined}
        compositeExpanded={options?.compositeExpanded}
        onToggleComposite={options?.onToggleComposite}
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
      endpointPortId?: string
      labelOverride?: string
      resolvedValueLabel?: string
      valueInput?: {
        value: number
        min?: number
        max?: number
        step?: number
        showSlider?: boolean
        disabled?: boolean
        driven?: boolean
        onChange: (value: number) => void
      }
    },
  ) => {
    const endpointPortId = options?.endpointPortId ?? port.portId
    const sectionId = SECTION_IDS.inputs
    const tree = getFieldTree(port.type)
    if (!isCompositeFieldNode(tree)) {
      return renderInputPort(port, {
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
      endpointPortId?: string
      labelOverride?: string
      inputWiringDisabled?: boolean
      drivenMessage?: string
      resolvedValueLabel?: string
      valueInput?: {
        value: number
        min?: number
        max?: number
        step?: number
        showSlider?: boolean
        disabled?: boolean
        driven?: boolean
        onChange: (value: number) => void
      }
    },
  ) => {
    const tree = getFieldTree(port.type)
    if (isCompositeFieldNode(tree)) {
      return renderCompositeInputPort(port, options)
    }
    return renderInputPort(port, {
      endpointPortId: options?.endpointPortId,
      labelOverride: options?.labelOverride,
      inputWiringDisabled: options?.inputWiringDisabled,
      drivenMessage: options?.drivenMessage,
      resolvedValueLabel: options?.resolvedValueLabel,
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

    const valueInput =
      !isRootPort || !showEditors || node.type !== 'Primitive/Number' || endpointPortId !== 'value'
        ? undefined
        : {
            value: primitiveNumberValue ?? 0,
            min: -1000,
            max: 1000,
            step: 0.1,
            showSlider: true,
            onChange: (value: number) => {
              onPrimitiveNumberValueChange(node.nodeId, value)
            },
          }

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
        detailsExpanded={showDebugInfo && expandedDetails[detailsKey] === true}
        onToggleDetails={
          !showDebugInfo || options?.showDetailsToggle === false
            ? undefined
            : () =>
                setExpandedDetails((current) => ({
                  ...current,
                  [detailsKey]: !current[detailsKey],
                }))
        }
        compositeExpanded={options?.compositeExpanded}
        onToggleComposite={options?.onToggleComposite}
        childTone={path !== undefined}
        valueInput={valueInput}
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
    },
  ) => {
    if (options?.path !== undefined && options.path.length > 0) {
      return renderOutputPort(port, {
        endpointPortId: options.endpointPortId,
        labelOverride: options.labelOverride,
        path: options.path,
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
  const driverSectionCollapsedForOverlay = isSectionCollapsed(SECTION_IDS.drivers)
  const featureSectionCollapsedForOverlay =
    isCollapsedMode || isSectionCollapsed(SECTION_IDS.featureStack)
  const visibleDriverRowIdsForOverlay = driverSectionCollapsedForOverlay
    ? []
    : resolvedDriverGroupsForOverlay.flatMap((group) =>
        isGroupCollapsed(SECTION_IDS.drivers, group.groupId)
          ? []
          : group.rows.map((row) => row.rowId),
      )
  const visibleFeatureRowsForOverlay = featureSectionCollapsedForOverlay
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
    rowViewMode === 'everything' &&
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
    rowViewMode,
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
    const featureStackMode = rowViewMode === 'everything' ? 'full' : 'summary'
    const showEverythingExtras = rowViewMode === 'everything'
    const driversSectionCollapsed = isSectionCollapsed(SECTION_IDS.drivers)
    const inputsSectionCollapsed = isSectionCollapsed(SECTION_IDS.inputs)
    const outputsSectionCollapsed = isSectionCollapsed(SECTION_IDS.outputs)
    const driversPinsOnly = driversSectionCollapsed
    const inputsPinsOnly = inputsSectionCollapsed
    const outputsPinsOnly = outputsSectionCollapsed
    const hideFeatureStackBody = isCollapsedMode || isSectionCollapsed(SECTION_IDS.featureStack)
    const resolvedDriverGroups: DriverSectionGroupVm[] = resolvedDriverGroupsForOverlay
    const resolvedDriverRowIndexById = driverRowIndexById ?? {}
    const resolvedInputRowIndexById = inputRowIndexById ?? {}
    const resolvedOutputEndpointIndexByRowId = outputEndpointIndexByRowId ?? {}
    const resolvedOutputEndpointCount = outputEndpointCount ?? outputRows.length

    const orderedSections: Array<{
      key: 'drivers' | 'inputs' | 'featureStack' | 'outputs'
      className: string
      renderBody: () => ReactNode
    }> = [
      {
        key: 'drivers',
        className: 'SpaghettiNodeSection SpaghettiTemplateSection',
        renderBody: () => (
          <>
            {renderSectionHeader(
              'Drivers',
              SECTION_IDS.drivers,
              resolvedDriverGroups.map((group) => group.groupId),
            )}
            {!driversPinsOnly ? (
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
                          pinsOnly: driversPinsOnly,
                          sectionIndex: resolvedDriverRowIndexById[driver.rowId],
                          sectionLength: controlRows.length,
                        }),
                      )}
                    </div>,
                    <div className="SpaghettiDriverGroupCollapsedSummary" />,
                  )
                })}
              </div>
            ) : null}
          </>
        ),
      },
      {
        key: 'inputs',
        className: 'SpaghettiNodeSection SpaghettiTemplateSection',
        renderBody: () => (
          <>
            {renderSectionHeader('Inputs', SECTION_IDS.inputs)}
            {!inputsPinsOnly ? (
              <div
                className={`SpaghettiNodePortColumn SpaghettiNodePortColumn--in ${
                  inputsPinsOnly ? 'InputsSection--pinsOnly' : ''
                }`}
              >
                {inputRows.map((driver) =>
                  renderInputRow(driver, {
                    sectionIndex: resolvedInputRowIndexById[driver.rowId],
                    sectionLength: inputRows.length,
                  }),
                )}
              </div>
            ) : null}
          </>
        ),
      },
      {
        key: 'featureStack',
        className: 'SpaghettiNodeSection SpaghettiTemplateSection',
        renderBody: () => (
          <>
            {renderSectionHeader('Feature Stack', SECTION_IDS.featureStack)}
            {hideFeatureStackBody ? null : (
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
                featureInputWiring={{
                  getInputDropState,
                  onRegisterPortElement,
                  onInputPointerDown,
                  onInputPointerEnter,
                  onInputPointerLeave,
                }}
              />
            )}
          </>
        ),
      },
      {
        key: 'outputs',
        className: 'SpaghettiNodeSection SpaghettiTemplateSection SpaghettiTemplateSection--outputs',
        renderBody: () => (
          <>
            {renderSectionHeader('Outputs', SECTION_IDS.outputs)}
            {!outputsPinsOnly ? (
              <div
                className={`SpaghettiNodePortColumn SpaghettiNodePortColumn--out ${
                  outputsPinsOnly ? 'OutputsSection--pinsOnly' : ''
                }`}
              >
                {outputRows.map((driver) =>
                  renderOutputRow(driver, {
                    sectionIndex:
                      driver.kind === 'endpoint'
                        ? resolvedOutputEndpointIndexByRowId[driver.rowId]
                        : undefined,
                    sectionLength: resolvedOutputEndpointCount,
                  }),
                )}
              </div>
            ) : null}
          </>
        ),
      },
    ]

    return (
      <div ref={partTemplateElementRef} className="SpaghettiNodeTemplate SpaghettiNodeTemplate--withInternalDeps">
        {orderedSections.map((section) => (
          <section key={section.key} className={section.className}>
            {section.renderBody()}
          </section>
        ))}

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

        {showEverythingExtras && outputRemainder.length > 0 ? (
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

        {showEverythingExtras ? renderLegacySections() : null}
      </div>
    )
  }

  const renderOutputPreviewTemplate = () => (
    <div className="SpaghettiNodeTemplate SpaghettiOutputPreviewTemplate">
      <section className="SpaghettiNodeSection SpaghettiTemplateSection SpaghettiOutputPreviewSection">
        <div className="SpaghettiNodeSectionLabel">Parts List</div>
        <div className="SpaghettiNodePortColumn SpaghettiNodePortColumn--in">
          {(outputPreviewRows ?? []).map((row) => (
            <div
              key={row.rowId}
              className="SpaghettiOutputPreviewRow"
              data-sp-output-preview-slot-id={row.slotId}
            >
              {renderInputPortByType(row.port, {
                endpointPortId: row.port.portId,
                labelOverride: row.slotId,
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
      className={`SpaghettiNode ${selected ? 'SpaghettiNode--selected' : ''} ${
        showInternalWiring ? 'SpaghettiNode--showInternalWiring' : ''
      }`}
      style={{ left: `${x}px`, top: `${y}px` }}
      onPointerDown={(event) => onNodePointerDown(event, node.nodeId)}
    >
      <header className="SpaghettiNodeHeader">
        <strong>{title}</strong>
        <span className="SpaghettiNodeType">{node.type}</span>
      </header>

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
              aria-label={toolbarEditorOpen ? 'Hide node toolbar controls' : 'Show node toolbar controls'}
              {...SP_INTERACTIVE_PROPS}
              onClick={() => setToolbarEditorOpen((current) => !current)}
            >
              {toolbarEditorOpen ? '\u25BE' : '\u25B8'}
            </button>
          </span>
        </label>
      ) : null}

      {showPresetPicker && toolbarEditorOpen ? (
        <section
          className="SpaghettiNodeToolbarEditor"
          {...SP_INTERACTIVE_PROPS}
        >
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
    </article>
  )
}

export const NodeView = memo(NodeViewComponent)
NodeView.displayName = 'NodeView'
