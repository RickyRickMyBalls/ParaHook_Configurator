import {
  memo,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from 'react'
import type { NodeUiSection } from '../registry/nodeRegistry'
import type { PortSpec, SpaghettiNode } from '../schema/spaghettiTypes'
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

export type NodeInputCompositeState = {
  wholeDrivenByPortId: ReadonlySet<string>
  leafDrivenByPortIdPathKey: ReadonlySet<string>
  legacyLeafOverrideOnWhole: ReadonlySet<string>
  vec2DisplayByPortId: ReadonlyMap<string, { x: number; y: number }>
}

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
  uiSections?: NodeUiSection[]
  presetOptions?: string[]
  inputPortDetails?: Record<string, PortDetailLine[]>
  outputPortDetails?: Record<string, PortDetailLine[]>
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
  uiSections,
  presetOptions,
  inputPortDetails,
  outputPortDetails,
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
  const paramsText = JSON.stringify(node.params, null, 2)
  const presetValue =
    typeof node.params.presetId === 'string' && node.params.presetId.length > 0
      ? node.params.presetId
      : 'default'
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({})
  const [scrubSensitivity, setScrubSensitivity] = useState(0)
  const [showInternalWiring, setShowInternalWiring] = useState(true)
  const [toolbarEditorOpen, setToolbarEditorOpen] = useState(false)
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
      <div className="SpaghettiNodeGroup" data-sp-group-id={groupId} data-sp-section-id={sectionId}>
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
    options?: { pinsOnly?: boolean },
  ) => {
    const pinsOnly = options?.pinsOnly === true
    if (driver.kind === 'nodeParamVec2') {
      const xDisabled = driver.xInput.disabled === true || !showEditors
      const yDisabled = driver.yInput.disabled === true || !showEditors
      const pinValueLabel = `${formatPinValue(driver.xInput.value)}, ${formatPinValue(
        driver.yInput.value,
      )}`
      return (
        <div
          key={driver.rowId}
          className={`SpRow SpRow--driver SpaghettiDriverControlRow SpaghettiDriverControlRow--vec2 ${
            xDisabled && yDisabled ? 'isDisabled' : ''
          }`}
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
        </div>
      )
    }

    const valueInput = driver.numberInput
    const disabled = valueInput.disabled === true || !showEditors
    const pinValueLabel = formatPinValue(valueInput.value)
    return (
      <div
        key={driver.rowId}
        className={`SpRow SpRow--driver SpaghettiDriverControlRow SpaghettiDriverControlRow--number ${
          disabled ? 'isDisabled' : ''
        }`}
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
      </div>
    )
  }

  const renderInputRow = (driver: InputEndpointRowVm) => {
    return renderInputPortByType(driver.port, {
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

  const renderOutputRow = (driver: OutputPinnedRowVm) => {
    if (driver.kind === 'reserved') {
      return renderReservedOutputRow(driver)
    }
    return renderOutputPortByType(driver.port, {
      endpointPortId: driver.endpointPortId,
      path: driver.endpointPath,
      labelOverride: driver.labelOverride,
    })
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
    const showInternalDependenciesPlaceholder = false
    const driversSectionCollapsed = isSectionCollapsed(SECTION_IDS.drivers)
    const inputsSectionCollapsed = isSectionCollapsed(SECTION_IDS.inputs)
    const outputsSectionCollapsed = isSectionCollapsed(SECTION_IDS.outputs)
    const driversPinsOnly = driversSectionCollapsed
    const inputsPinsOnly = inputsSectionCollapsed
    const outputsPinsOnly = outputsSectionCollapsed
    const hideFeatureStackBody = isCollapsedMode || isSectionCollapsed(SECTION_IDS.featureStack)

    const groupedControlRows: Array<{ groupLabel: string; rows: DriverControlRowVm[] }> = []
    const groupedControlRowsByLabel = new Map<string, { groupLabel: string; rows: DriverControlRowVm[] }>()
    for (const row of controlRows) {
      const groupLabel =
        row.groupLabel === undefined || row.groupLabel.length === 0 ? '__untitled__' : row.groupLabel
      const existing = groupedControlRowsByLabel.get(groupLabel)
      if (existing !== undefined) {
        existing.rows.push(row)
        continue
      }
      const created = {
        groupLabel,
        rows: [row],
      }
      groupedControlRowsByLabel.set(groupLabel, created)
      groupedControlRows.push(created)
    }

    return (
      <div className="SpaghettiNodeTemplate">
        <section className="SpaghettiNodeSection SpaghettiTemplateSection">
          {renderSectionHeader(
            'Drivers',
            SECTION_IDS.drivers,
            groupedControlRows.map((group) => group.groupLabel),
          )}
          {!driversPinsOnly ? (
            <div className="SpaghettiNodeSectionItems">
              {groupedControlRows.map((group) => {
                const collapsed = isGroupCollapsed(SECTION_IDS.drivers, group.groupLabel)
                const isDefaultGroup = group.groupLabel === '__untitled__'
                return renderGroupHeader(
                  isDefaultGroup ? 'Properties' : group.groupLabel,
                  SECTION_IDS.drivers,
                  group.groupLabel,
                  collapsed,
                  <div className="SpaghettiDriverGroup">
                    {group.rows.map((driver) =>
                      renderDriverControlRow(driver, { pinsOnly: driversPinsOnly }),
                    )}
                  </div>,
                  <div className="SpaghettiDriverGroupCollapsedSummary" />,
                )
              })}
            </div>
          ) : null}
        </section>

        <section className="SpaghettiNodeSection SpaghettiTemplateSection">
          {renderSectionHeader('Inputs', SECTION_IDS.inputs)}
          {!inputsPinsOnly ? (
            <div
              className={`SpaghettiNodePortColumn SpaghettiNodePortColumn--in ${
                inputsPinsOnly ? 'InputsSection--pinsOnly' : ''
              }`}
            >
              {inputRows.map((driver) => renderInputRow(driver))}
            </div>
          ) : null}
        </section>

        <section className="SpaghettiNodeSection SpaghettiTemplateSection">
          {renderSectionHeader('Feature Stack', SECTION_IDS.featureStack)}
          {hideFeatureStackBody ? null : (
            <FeatureStackView
              node={node}
              mode={featureStackMode}
              isGroupCollapsed={(groupId) => isGroupCollapsed(SECTION_IDS.featureStack, groupId)}
              onToggleGroup={(groupId) => onToggleGroup(SECTION_IDS.featureStack, groupId)()}
            />
          )}
        </section>

        <section className="SpaghettiNodeSection SpaghettiTemplateSection SpaghettiTemplateSection--outputs">
          {renderSectionHeader('Outputs', SECTION_IDS.outputs)}
          {!outputsPinsOnly ? (
            <div
              className={`SpaghettiNodePortColumn SpaghettiNodePortColumn--out ${
                outputsPinsOnly ? 'OutputsSection--pinsOnly' : ''
              }`}
            >
              {outputRows.map((driver) => renderOutputRow(driver))}
            </div>
          ) : null}
        </section>

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

        {showEverythingExtras && showInternalDependenciesPlaceholder ? (
          <section className="SpaghettiNodeSection SpaghettiTemplateAuxSection">
            <div className="SpaghettiNodeSectionLabel">Internal Dependencies (future)</div>
            <div className="SpaghettiNodeSectionItem">Reserved</div>
          </section>
        ) : null}
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

      {isPartTemplate ? renderPartTemplate() : renderLegacyNodePorts()}

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
