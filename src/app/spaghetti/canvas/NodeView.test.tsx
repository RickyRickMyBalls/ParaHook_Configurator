import { afterEach, describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import type { PortSpec, SpaghettiNode } from '../schema/spaghettiTypes'
import { getDefaultNodeParams } from '../registry/nodeRegistry'
import { useSpaghettiStore } from '../store/useSpaghettiStore'
import type {
  DriverControlRowVm,
  InputEndpointRowVm,
  OutputPinnedRowVm,
} from './driverVm'
import { NodeView } from './NodeView'
import type {
  DriverRowWarningVm,
  ExtrudeNodeVm,
  FeatureDependencyEdge,
  FeatureDependencyRow,
  NodeInputCompositeState,
  OutputPreviewSlotRowVm,
  SketchNodeVm,
  UtilityNodeVm,
} from '../selectors'
import {
  buildSectionCollapseKey,
  useSpaghettiUiStore,
} from './state/spaghettiUiStore'
import type { ViewMode } from './rowViewMode'
import { OUTPUT_PREVIEW_NODE_TYPE } from '../system/outputPreviewNode'

const emptyCompositeState: NodeInputCompositeState = {
  wholeDrivenByPortId: new Set<string>(),
  leafDrivenByPortIdPathKey: new Set<string>(),
  legacyLeafOverrideOnWhole: new Set<string>(),
  vec2DisplayByPortId: new Map<string, { x: number; y: number }>(),
}

const baseNode = (params: Record<string, unknown>): SpaghettiNode => ({
  nodeId: 'node-baseplate-1',
  type: 'Part/Baseplate',
  params,
})

const seedGraphForRender = (node: SpaghettiNode, mode: ViewMode = 'essentials') => {
  const nextNodeModes: Record<string, ViewMode> = {}
  if (mode === 'essentials') {
    delete nextNodeModes[node.nodeId]
  } else {
    nextNodeModes[node.nodeId] = mode
  }
  useSpaghettiStore.getState().setGraph({
    schemaVersion: 1,
    nodes: [node],
    edges: [],
    ui: {
      ...(Object.keys(nextNodeModes).length === 0 ? {} : { nodeModesByNodeId: nextNodeModes }),
    },
  })
}

const renderPartNode = (
  node: SpaghettiNode,
  options?: {
    nodeMode?: ViewMode
    drivers?: DriverControlRowVm[]
    inputs?: InputEndpointRowVm[]
    outputs?: OutputPinnedRowVm[]
    driverInputPortByRowId?: Record<string, PortSpec>
    driverOutputPortByRowId?: Record<string, PortSpec>
    driverDrivenStateByRowId?: Record<
      string,
      { driven: boolean; connectionCount: number; resolvedValue?: unknown; unresolved: boolean }
    >
    driverWarningByRowId?: Record<string, DriverRowWarningVm>
    featureVirtualInputStateByPortId?: Record<
      string,
      {
        driven: boolean
        connectionCount: number
        unresolved: boolean
        drivenValue?: number
      }
    >
    featureRows?: FeatureDependencyRow[]
    featureRowIndexById?: Record<string, number>
    internalDependencyEdges?: FeatureDependencyEdge[]
    collapsedSections?: Array<'drivers' | 'inputs' | 'featureStack' | 'outputs'>
  },
): string => {
  seedGraphForRender(node, options?.nodeMode)
  useSpaghettiUiStore.setState((state) => ({
    ...state,
    collapsed: Object.fromEntries(
      (options?.collapsedSections ?? []).map((sectionId) => [
        buildSectionCollapseKey(node.nodeId, sectionId),
        true,
      ]),
    ),
  }))
  return renderToStaticMarkup(
    <NodeView
      node={node}
      x={0}
      y={0}
      title="Baseplate"
      nodeMode={options?.nodeMode ?? 'essentials'}
      template="part"
      allInputs={[]}
      allOutputs={[]}
      drivers={options?.drivers ?? []}
      inputs={options?.inputs ?? []}
      outputs={options?.outputs ?? []}
      otherOutputs={[]}
      driverInputPortByRowId={options?.driverInputPortByRowId}
      driverOutputPortByRowId={options?.driverOutputPortByRowId}
      driverDrivenStateByRowId={options?.driverDrivenStateByRowId}
      driverWarningByRowId={options?.driverWarningByRowId}
      featureRows={options?.featureRows}
      featureRowIndexById={options?.featureRowIndexById}
      internalDependencyEdges={options?.internalDependencyEdges}
      featureVirtualInputStateByPortId={options?.featureVirtualInputStateByPortId}
      inputCompositeState={emptyCompositeState}
      compositeExpansionRevision={0}
      getCompositeExpanded={() => false}
      setCompositeExpanded={() => {
        // no-op in static render test
      }}
      selected={false}
      getInputDropState={() => null}
      getOutputDropState={() => null}
      onPresetChange={() => {
        // no-op in static render test
      }}
      onDriverNumberChange={() => {
        // no-op in static render test
      }}
      onUtilityNumberValueChange={() => {
        // no-op in static render test
      }}
      onUtilityBooleanValueChange={() => {
        // no-op in static render test
      }}
      onUtilityVec2AxisChange={() => {
        // no-op in static render test
      }}
      onMoveSectionRow={() => {
        // no-op in static render test
      }}
      outputRowMinHeight={40}
      onOutputRowMinHeightChange={() => {
        // no-op in static render test
      }}
      pinDotSize={8}
      onPinDotSizeChange={() => {
        // no-op in static render test
      }}
      onNodeHeaderPointerDown={() => {
        // no-op in static render test
      }}
      onNodeBodyPointerDown={() => {
        // no-op in static render test
      }}
      onNodeTitleClick={() => {
        // no-op in static render test
      }}
      onRegisterPortElement={() => {
        // no-op in static render test
      }}
      onOutputPointerDown={() => {
        // no-op in static render test
      }}
      onOutputPointerEnter={() => {
        // no-op in static render test
      }}
      onOutputPointerLeave={() => {
        // no-op in static render test
      }}
      onInputPointerDown={() => {
        // no-op in static render test
      }}
      onInputPointerEnter={() => {
        // no-op in static render test
      }}
      onInputPointerLeave={() => {
        // no-op in static render test
      }}
    />,
  )
}

const outputPreviewPort = (slotId: string): PortSpec => ({
  portId: `in:solid:${slotId}`,
  label: slotId,
  type: { kind: 'toeLoft' },
  optional: true,
  maxConnectionsIn: 1,
})

const numberPort = (portId: string, label: string): PortSpec => ({
  portId,
  label,
  type: { kind: 'number', unit: 'mm' },
  optional: true,
  maxConnectionsIn: 1,
})

const inputEndpointRow = (
  rowId: string,
  portId: string,
  label: string,
): InputEndpointRowVm => ({
  kind: 'endpoint',
  rowId,
  direction: 'in',
  port: numberPort(portId, label),
  endpointPortId: portId,
  labelOverride: label,
})

const outputEndpointRow = (
  rowId: string,
  portId: string,
  label: string,
): OutputPinnedRowVm => ({
  kind: 'endpoint',
  rowId,
  direction: 'out',
  port: numberPort(portId, label),
  endpointPortId: portId,
  labelOverride: label,
})

const renderOutputPreviewNode = (
  outputPreviewRows: OutputPreviewSlotRowVm[],
): string => {
  seedGraphForRender({
    nodeId: 'node-output-preview-1',
    type: OUTPUT_PREVIEW_NODE_TYPE,
    params: {
      slots: outputPreviewRows.map((row) => ({ slotId: row.slotId })),
      nextSlotIndex: outputPreviewRows.length + 1,
    },
  })
  return renderToStaticMarkup(
    <NodeView
      node={{
        nodeId: 'node-output-preview-1',
        type: OUTPUT_PREVIEW_NODE_TYPE,
        params: {
          slots: outputPreviewRows.map((row) => ({ slotId: row.slotId })),
          nextSlotIndex: outputPreviewRows.length + 1,
        },
      }}
      x={0}
      y={0}
      title="Output Preview"
      nodeMode="essentials"
      allInputs={outputPreviewRows.map((row) => row.port)}
      allOutputs={[]}
      outputPreviewRows={outputPreviewRows}
      inputCompositeState={emptyCompositeState}
      compositeExpansionRevision={0}
      getCompositeExpanded={() => false}
      setCompositeExpanded={() => {
        // no-op in static render test
      }}
      selected={false}
      getInputDropState={() => null}
      getOutputDropState={() => null}
      onPresetChange={() => {
        // no-op in static render test
      }}
      onDriverNumberChange={() => {
        // no-op in static render test
      }}
      onUtilityNumberValueChange={() => {
        // no-op in static render test
      }}
      onUtilityBooleanValueChange={() => {
        // no-op in static render test
      }}
      onUtilityVec2AxisChange={() => {
        // no-op in static render test
      }}
      outputRowMinHeight={40}
      onOutputRowMinHeightChange={() => {
        // no-op in static render test
      }}
      pinDotSize={8}
      onPinDotSizeChange={() => {
        // no-op in static render test
      }}
      onNodeHeaderPointerDown={() => {
        // no-op in static render test
      }}
      onNodeBodyPointerDown={() => {
        // no-op in static render test
      }}
      onNodeTitleClick={() => {
        // no-op in static render test
      }}
      onRegisterPortElement={() => {
        // no-op in static render test
      }}
      onOutputPointerDown={() => {
        // no-op in static render test
      }}
      onOutputPointerEnter={() => {
        // no-op in static render test
      }}
      onOutputPointerLeave={() => {
        // no-op in static render test
      }}
      onInputPointerDown={() => {
        // no-op in static render test
      }}
      onInputPointerEnter={() => {
        // no-op in static render test
      }}
      onInputPointerLeave={() => {
        // no-op in static render test
      }}
    />,
  )
}

const renderUtilityNode = (options: {
  node: SpaghettiNode
  title: string
  utilityVm: UtilityNodeVm
}): string => {
  seedGraphForRender(options.node)
  return renderToStaticMarkup(
    <NodeView
      node={options.node}
      x={0}
      y={0}
      title={options.title}
      nodeMode="essentials"
      utilityVm={options.utilityVm}
      allInputs={[]}
      allOutputs={[options.utilityVm.outputPort]}
      inputCompositeState={emptyCompositeState}
      compositeExpansionRevision={0}
      getCompositeExpanded={() => false}
      setCompositeExpanded={() => {
        // no-op in static render test
      }}
      selected={false}
      getInputDropState={() => null}
      getOutputDropState={() => null}
      onPresetChange={() => {
        // no-op in static render test
      }}
      onDriverNumberChange={() => {
        // no-op in static render test
      }}
      onUtilityNumberValueChange={() => {
        // no-op in static render test
      }}
      onUtilityBooleanValueChange={() => {
        // no-op in static render test
      }}
      onUtilityVec2AxisChange={() => {
        // no-op in static render test
      }}
      outputRowMinHeight={40}
      onOutputRowMinHeightChange={() => {
        // no-op in static render test
      }}
      pinDotSize={8}
      onPinDotSizeChange={() => {
        // no-op in static render test
      }}
      onNodeHeaderPointerDown={() => {
        // no-op in static render test
      }}
      onNodeBodyPointerDown={() => {
        // no-op in static render test
      }}
      onNodeTitleClick={() => {
        // no-op in static render test
      }}
      onRegisterPortElement={() => {
        // no-op in static render test
      }}
      onOutputPointerDown={() => {
        // no-op in static render test
      }}
      onOutputPointerEnter={() => {
        // no-op in static render test
      }}
      onOutputPointerLeave={() => {
        // no-op in static render test
      }}
      onInputPointerDown={() => {
        // no-op in static render test
      }}
      onInputPointerEnter={() => {
        // no-op in static render test
      }}
      onInputPointerLeave={() => {
        // no-op in static render test
      }}
    />,
  )
}

const renderSketchNode = (options: {
  node: SpaghettiNode
  sketchVm: SketchNodeVm
  allInputs: PortSpec[]
  allOutputs: PortSpec[]
}): string => {
  seedGraphForRender(options.node)
  return renderToStaticMarkup(
    <NodeView
      node={options.node}
      x={0}
      y={0}
      title="Sketch"
      nodeMode="essentials"
      template="sketch"
      sketchVm={options.sketchVm}
      allInputs={options.allInputs}
      allOutputs={options.allOutputs}
      inputCompositeState={emptyCompositeState}
      compositeExpansionRevision={0}
      getCompositeExpanded={() => false}
      setCompositeExpanded={() => {
        // no-op in static render test
      }}
      selected={false}
      getInputDropState={() => null}
      getOutputDropState={() => null}
      onPresetChange={() => {
        // no-op in static render test
      }}
      onDriverNumberChange={() => {
        // no-op in static render test
      }}
      onUtilityNumberValueChange={() => {
        // no-op in static render test
      }}
      onUtilityBooleanValueChange={() => {
        // no-op in static render test
      }}
      onUtilityVec2AxisChange={() => {
        // no-op in static render test
      }}
      outputRowMinHeight={40}
      onOutputRowMinHeightChange={() => {
        // no-op in static render test
      }}
      pinDotSize={8}
      onPinDotSizeChange={() => {
        // no-op in static render test
      }}
      onNodeHeaderPointerDown={() => {
        // no-op in static render test
      }}
      onNodeBodyPointerDown={() => {
        // no-op in static render test
      }}
      onNodeTitleClick={() => {
        // no-op in static render test
      }}
      onRegisterPortElement={() => {
        // no-op in static render test
      }}
      onOutputPointerDown={() => {
        // no-op in static render test
      }}
      onOutputPointerEnter={() => {
        // no-op in static render test
      }}
      onOutputPointerLeave={() => {
        // no-op in static render test
      }}
      onInputPointerDown={() => {
        // no-op in static render test
      }}
      onInputPointerEnter={() => {
        // no-op in static render test
      }}
      onInputPointerLeave={() => {
        // no-op in static render test
      }}
    />,
  )
}

const renderExtrudeNode = (options: {
  node: SpaghettiNode
  extrudeVm: ExtrudeNodeVm
  allInputs: PortSpec[]
  allOutputs: PortSpec[]
}): string => {
  seedGraphForRender(options.node)
  return renderToStaticMarkup(
    <NodeView
      node={options.node}
      x={0}
      y={0}
      title="Extrude"
      nodeMode="essentials"
      template="extrude"
      extrudeVm={options.extrudeVm}
      allInputs={options.allInputs}
      allOutputs={options.allOutputs}
      inputCompositeState={emptyCompositeState}
      compositeExpansionRevision={0}
      getCompositeExpanded={() => false}
      setCompositeExpanded={() => {
        // no-op in static render test
      }}
      selected={false}
      getInputDropState={() => null}
      getOutputDropState={() => null}
      onPresetChange={() => {
        // no-op in static render test
      }}
      onDriverNumberChange={() => {
        // no-op in static render test
      }}
      onUtilityNumberValueChange={() => {
        // no-op in static render test
      }}
      onUtilityBooleanValueChange={() => {
        // no-op in static render test
      }}
      onUtilityVec2AxisChange={() => {
        // no-op in static render test
      }}
      outputRowMinHeight={40}
      onOutputRowMinHeightChange={() => {
        // no-op in static render test
      }}
      pinDotSize={8}
      onPinDotSizeChange={() => {
        // no-op in static render test
      }}
      onNodeHeaderPointerDown={() => {
        // no-op in static render test
      }}
      onNodeBodyPointerDown={() => {
        // no-op in static render test
      }}
      onNodeTitleClick={() => {
        // no-op in static render test
      }}
      onRegisterPortElement={() => {
        // no-op in static render test
      }}
      onOutputPointerDown={() => {
        // no-op in static render test
      }}
      onOutputPointerEnter={() => {
        // no-op in static render test
      }}
      onOutputPointerLeave={() => {
        // no-op in static render test
      }}
      onInputPointerDown={() => {
        // no-op in static render test
      }}
      onInputPointerEnter={() => {
        // no-op in static render test
      }}
      onInputPointerLeave={() => {
        // no-op in static render test
      }}
    />,
  )
}

describe('NodeView part section order', () => {
  afterEach(() => {
    useSpaghettiUiStore.setState({ collapsed: {} })
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [],
      edges: [],
    })
  })

  it('renders separate header and body interaction zones', () => {
    const html = renderPartNode(baseNode({}))

    expect(html.includes('data-sp-node-header-zone="1"')).toBe(true)
    expect(html.includes('data-sp-node-body-zone="1"')).toBe(true)
  })

  it('renders a dedicated title cycle control inside the header zone', () => {
    const html = renderPartNode(baseNode({}))

    expect(html.includes('data-sp-node-title-cycle="1"')).toBe(true)
    expect(html.includes('SpaghettiNodeTitleText')).toBe(true)
    expect(html.includes('>e<')).toBe(true)
    expect(html.includes('>i<')).toBe(false)
  })

  it('renders nodes using their own stored mode', () => {
    const expandedNode: SpaghettiNode = {
      nodeId: 'node-expanded-1',
      type: 'Part/Baseplate',
      params: {
        featureStack: [
          {
            type: 'sketch',
            featureId: 'feature-1',
            entities: [],
            outputs: {
              profiles: [],
            },
            uiState: {
              collapsed: false,
            },
          },
        ],
      },
    }
    const collapsedNode: SpaghettiNode = {
      nodeId: 'node-collapsed-1',
      type: 'Part/Baseplate',
      params: {
        featureStack: [
          {
            type: 'sketch',
            featureId: 'feature-1',
            entities: [],
            outputs: {
              profiles: [],
            },
            uiState: {
              collapsed: false,
            },
          },
        ],
      },
    }

    const expandedHtml = renderPartNode(expandedNode, { nodeMode: 'expanded' })
    const collapsedHtml = renderPartNode(collapsedNode, { nodeMode: 'collapsed' })

    expect(expandedHtml.includes('Sketch: 0 profiles')).toBe(true)
    expect(collapsedHtml.includes('Sketch: 0 profiles')).toBe(false)
  })

  it('renders Drivers -> Inputs -> Feature Stack -> Outputs in locked order', () => {
    const html = renderPartNode(baseNode({}))

    const driversIndex = html.indexOf('Drivers')
    const inputsIndex = html.indexOf('Inputs')
    const featureStackIndex = html.indexOf('Feature Stack')
    const outputsIndex = html.indexOf('Outputs')

    expect(driversIndex).toBeGreaterThan(-1)
    expect(inputsIndex).toBeGreaterThan(-1)
    expect(featureStackIndex).toBeGreaterThan(-1)
    expect(outputsIndex).toBeGreaterThan(-1)

    expect(driversIndex).toBeLessThan(inputsIndex)
    expect(inputsIndex).toBeLessThan(featureStackIndex)
    expect(featureStackIndex).toBeLessThan(outputsIndex)
  })

  it('keeps Feature Stack content sourced from embedded node.params.featureStack', () => {
    const html = renderPartNode(
      baseNode({
        featureStack: [
          {
            type: 'sketch',
            featureId: 'feature-1',
            entities: [],
            outputs: {
              profiles: [],
            },
            uiState: {
              collapsed: false,
            },
          },
        ],
      }),
    )

    expect(html.includes('Sketch: 0 profiles')).toBe(true)
  })

  it('collapsed mode keeps section shells and hides all section bodies', () => {
    const html = renderPartNode(
      baseNode({
        featureStack: [
          {
            type: 'extrude',
            featureId: 'feature-depth-1',
            inputs: {
              profileRef: null,
            },
            params: {
              depth: {
                kind: 'lit',
                value: 10,
              },
            },
            outputs: {
              bodyId: 'body-1',
            },
            uiState: {
              collapsed: false,
            },
          },
        ],
      }),
      {
        nodeMode: 'collapsed',
        drivers: [
          {
            kind: 'nodeParamNumber',
            rowId: 'drv:widthMm',
            label: 'Width Driver',
            numberInput: {
              value: 30,
              change: {
                kind: 'nodeParam',
                paramId: 'widthMm',
              },
            },
          },
        ],
        inputs: [inputEndpointRow('in:depth', 'fs:in:feature-depth-1:extrude:depth', 'Depth Input')],
        outputs: [outputEndpointRow('out:body', 'out:body', 'Body Output')],
      },
    )

    expect(html.includes('data-sp-section-body-visible="0"')).toBe(true)
    expect(html.includes('Width Driver')).toBe(false)
    expect(html.includes('Depth Input')).toBe(false)
    expect(html.includes('Sketch: 0 profiles')).toBe(false)
    expect(html.includes('Body Output')).toBe(false)
  })

  it('section toggles operate independently', () => {
    const html = renderPartNode(
      baseNode({
        featureStack: [
          {
            type: 'sketch',
            featureId: 'feature-1',
            entities: [],
            outputs: {
              profiles: [],
            },
            uiState: {
              collapsed: false,
            },
          },
        ],
      }),
      {
        nodeMode: 'expanded',
        drivers: [
          {
            kind: 'nodeParamNumber',
            rowId: 'drv:widthMm',
            label: 'Width Driver',
            numberInput: {
              value: 30,
              change: {
                kind: 'nodeParam',
                paramId: 'widthMm',
              },
            },
          },
        ],
        inputs: [inputEndpointRow('in:width', 'in:width', 'Width Input')],
        outputs: [outputEndpointRow('out:body', 'out:body', 'Body Output')],
        collapsedSections: ['inputs'],
      },
    )

    expect(html.includes('Width Driver')).toBe(true)
    expect(html.includes('Width Input')).toBe(false)
    expect(html.includes('Sketch: 0 profiles')).toBe(true)
    expect(html.includes('Body Output')).toBe(true)
  })

  it('disables manual depth editor when extrude depth is wired', () => {
    const html = renderPartNode(
      baseNode({
        featureStack: [
          {
            type: 'extrude',
            featureId: 'feature-depth-1',
            inputs: {
              profileRef: null,
            },
            params: {
              depth: {
                kind: 'lit',
                value: 10,
              },
            },
            outputs: {
              bodyId: 'body-1',
            },
            uiState: {
              collapsed: false,
            },
          },
        ],
      }),
      {
        nodeMode: 'expanded',
        featureVirtualInputStateByPortId: {
          'fs:in:feature-depth-1:extrude:depth': {
            driven: true,
            connectionCount: 1,
            unresolved: false,
            drivenValue: 42,
          },
        },
      },
    )

    expect(html.includes('Depth: Linked input')).toBe(true)
    expect(html.includes('SpaghettiValueBar--disabled')).toBe(true)
    expect(html.includes('value="42"')).toBe(true)
  })

  it('keeps actual input rows in Inputs and removes feature-owned port rows from Feature Stack', () => {
    const html = renderPartNode(
      {
        nodeId: 'node-cube-1',
        type: 'Part/Cube',
        params: getDefaultNodeParams('Part/Cube'),
      },
      {
        nodeMode: 'expanded',
        inputs: [
          inputEndpointRow(
            'in:feature-width',
            'fs:in:cube-sketch-1:sketchRect:width',
            'Width Input',
          ),
          inputEndpointRow(
            'in:feature-length',
            'fs:in:cube-sketch-1:sketchRect:length',
            'Length Input',
          ),
        ],
        featureVirtualInputStateByPortId: {
          'fs:in:cube-sketch-1:sketchRect:width': {
            driven: true,
            connectionCount: 1,
            unresolved: false,
            drivenValue: 30,
          },
          'fs:in:cube-sketch-1:sketchRect:length': {
            driven: true,
            connectionCount: 1,
            unresolved: true,
          },
        },
      },
    )

    expect(html.includes('Width Input')).toBe(true)
    expect(html.includes('Length Input')).toBe(true)
    expect(html.includes('Feature Wire Inputs')).toBe(false)
    expect(html.includes('data-sp-feature-width-port-id=')).toBe(false)
    expect(html.includes('data-sp-feature-length-port-id=')).toBe(false)
    expect(html.includes('Width: Linked input')).toBe(true)
    expect(html.includes('Length: Linked input (unresolved)')).toBe(true)
  })

  it('renders feature row controls and disabled feature state in full mode', () => {
    const html = renderPartNode(
      baseNode({
        featureStack: [
          {
            type: 'extrude',
            featureId: 'feature-depth-1',
            enabled: false,
            inputs: {
              profileRef: null,
            },
            params: {
              depth: {
                kind: 'lit',
                value: 10,
              },
            },
            outputs: {
              bodyId: 'body-1',
            },
            uiState: {
              collapsed: false,
            },
          },
        ],
      }),
      {
        nodeMode: 'expanded',
      },
    )

    expect(html.includes('Disabled · Profile: -, Depth: 10')).toBe(true)
    expect(html.includes('Enable')).toBe(true)
    expect(html.includes('Up')).toBe(true)
    expect(html.includes('Down')).toBe(true)
  })

  it('renders the internal dependency overlay only in expanded mode', () => {
    const featureRows: FeatureDependencyRow[] = [
      {
        rowId: 'feature:sketch-1',
        featureId: 'sketch-1',
        featureType: 'sketch',
        orderIndex: 0,
        enabled: true,
        effective: true,
      },
      {
        rowId: 'feature:extrude-1',
        featureId: 'extrude-1',
        featureType: 'extrude',
        orderIndex: 1,
        enabled: true,
        effective: true,
      },
    ]
    const internalDependencyEdges: FeatureDependencyEdge[] = [
      {
        id: 'dep:driver:drv:feature:firstExtrudeDepth->feature:extrude-1',
        kind: 'driverToFeature',
        sourceKind: 'driverRow',
        sourceId: 'drv:feature:firstExtrudeDepth',
        targetFeatureId: 'extrude-1',
        targetRowId: 'feature:extrude-1',
        enabled: true,
        effective: true,
      },
      {
        id: 'dep:feature:sketch-1->feature:extrude-1',
        kind: 'featureToFeature',
        sourceKind: 'feature',
        sourceId: 'sketch-1',
        targetFeatureId: 'extrude-1',
        targetRowId: 'feature:extrude-1',
        enabled: true,
        effective: true,
      },
    ]

    const htmlExpanded = renderPartNode(
      baseNode({
        featureStack: [
          {
            type: 'sketch',
            featureId: 'sketch-1',
            plane: 'XY',
            components: [],
            outputs: { profiles: [] },
            uiState: { collapsed: false },
          },
          {
            type: 'extrude',
            featureId: 'extrude-1',
            inputs: { profileRef: null },
            params: {
              depth: {
                kind: 'lit',
                value: 10,
              },
            },
            outputs: { bodyId: 'body-1' },
            uiState: { collapsed: false },
          },
        ],
      }),
      {
        nodeMode: 'expanded',
        featureRows,
        featureRowIndexById: {
          'feature:sketch-1': 0,
          'feature:extrude-1': 1,
        },
        internalDependencyEdges,
      },
    )
    const htmlEssentials = renderPartNode(
      baseNode({
        featureStack: [
          {
            type: 'sketch',
            featureId: 'sketch-1',
            plane: 'XY',
            components: [],
            outputs: { profiles: [] },
            uiState: { collapsed: false },
          },
        ],
      }),
      {
        nodeMode: 'essentials',
        featureRows,
        featureRowIndexById: {
          'feature:sketch-1': 0,
          'feature:extrude-1': 1,
        },
        internalDependencyEdges,
      },
    )

    expect(htmlExpanded.includes('data-sp-internal-dependency-overlay="1"')).toBe(true)
    expect(htmlEssentials.includes('data-sp-internal-dependency-overlay="1"')).toBe(false)
  })

  it('renders selector-owned feature row anchor attributes for dependency wiring', () => {
    const html = renderPartNode(
      baseNode({
        featureStack: [
          {
            type: 'sketch',
            featureId: 'sketch-1',
            plane: 'XY',
            components: [],
            outputs: { profiles: [] },
            uiState: { collapsed: false },
          },
        ],
      }),
      {
        nodeMode: 'expanded',
        featureRows: [
          {
            rowId: 'feature:sketch-1',
            featureId: 'sketch-1',
            featureType: 'sketch',
            orderIndex: 0,
            enabled: true,
            effective: true,
          },
        ],
      },
    )

    expect(html.includes('data-sp-feature-row-id="feature:sketch-1"')).toBe(true)
    expect(html.includes('data-sp-feature-row-anchor-id="feature:sketch-1"')).toBe(true)
  })

  it('renders input/output pins for nodeParam driver rows only', () => {
    const html = renderPartNode(baseNode({}), {
      drivers: [
        {
          kind: 'nodeParamNumber',
          rowId: 'drv:widthMm',
          label: 'Width',
          numberInput: {
            value: 30,
            change: {
              kind: 'nodeParam',
              paramId: 'widthMm',
            },
          },
        },
        {
          kind: 'featureParam',
          rowId: 'drv:feature:firstExtrudeDepth',
          label: 'Thickness',
          numberInput: {
            value: 10,
            change: {
              kind: 'featureParam',
              featureParamKind: 'firstExtrudeDepth',
            },
          },
        },
      ],
      driverInputPortByRowId: {
        'drv:widthMm': {
          portId: 'in:drv:widthMm',
          label: 'Width Driver Input',
          type: { kind: 'number', unit: 'mm' },
          maxConnectionsIn: 1,
        },
      },
      driverOutputPortByRowId: {
        'drv:widthMm': {
          portId: 'out:drv:widthMm',
          label: 'Width',
          type: { kind: 'number', unit: 'mm' },
        },
      },
    })

    expect(html.includes('data-sp-driver-input-port-id="in:drv:widthMm"')).toBe(true)
    expect(html.includes('data-sp-driver-output-port-id="out:drv:widthMm"')).toBe(true)
    expect(html.includes('data-sp-driver-input-port-id="in:drv:feature:firstExtrudeDepth"')).toBe(
      false,
    )
    expect(html.includes('data-sp-driver-output-port-id="out:drv:feature:firstExtrudeDepth"')).toBe(
      false,
    )
  })

  it('locks driver row and shows unresolved state when driven but unresolved', () => {
    const html = renderPartNode(baseNode({}), {
      drivers: [
        {
          kind: 'nodeParamNumber',
          rowId: 'drv:widthMm',
          label: 'Width',
          numberInput: {
            value: 30,
            change: {
              kind: 'nodeParam',
              paramId: 'widthMm',
            },
          },
        },
      ],
      driverInputPortByRowId: {
        'drv:widthMm': {
          portId: 'in:drv:widthMm',
          label: 'Width Driver Input',
          type: { kind: 'number', unit: 'mm' },
          maxConnectionsIn: 1,
        },
      },
      driverOutputPortByRowId: {
        'drv:widthMm': {
          portId: 'out:drv:widthMm',
          label: 'Width',
          type: { kind: 'number', unit: 'mm' },
        },
      },
      driverDrivenStateByRowId: {
        'drv:widthMm': {
          driven: true,
          connectionCount: 1,
          unresolved: true,
        },
      },
    })

    expect(html.includes('Driven (unresolved)')).toBe(true)
    expect(html.includes('SpaghettiDriverControlRow--number')).toBe(true)
    expect(html.includes('isDisabled')).toBe(true)
  })

  it('renders driven numeric driver offset mode with driven/offset/effective controls', () => {
    const html = renderPartNode(baseNode({}), {
      drivers: [
        {
          kind: 'nodeParamNumber',
          rowId: 'drv:widthMm',
          label: 'Width',
          numberInput: {
            value: 40,
            change: {
              kind: 'nodeParam',
              paramId: 'widthMm',
            },
          },
          offsetMode: true,
          drivenValue: 40,
          offsetInput: {
            value: 2,
            change: {
              kind: 'nodeParamOffset',
              paramId: 'widthMm',
            },
          },
          effectiveValue: 42,
        },
      ],
      driverInputPortByRowId: {
        'drv:widthMm': {
          portId: 'in:drv:widthMm',
          label: 'Width Driver Input',
          type: { kind: 'number', unit: 'mm' },
          maxConnectionsIn: 1,
        },
      },
      driverOutputPortByRowId: {
        'drv:widthMm': {
          portId: 'out:drv:widthMm',
          label: 'Width',
          type: { kind: 'number', unit: 'mm' },
        },
      },
      driverDrivenStateByRowId: {
        'drv:widthMm': {
          driven: true,
          connectionCount: 1,
          resolvedValue: 40,
          unresolved: false,
        },
      },
    })

    expect(html.includes('SpaghettiDriverControlRow--offsetMode')).toBe(true)
    expect(html.includes('Width (Driven)')).toBe(true)
    expect(html.includes('Offset')).toBe(true)
    expect(html.includes('Effective')).toBe(true)
    expect(html.includes('value=\"42\"')).toBe(true)
  })

  it('renders driver warning indicator tooltip on non-ok driver rows', () => {
    const html = renderPartNode(baseNode({}), {
      drivers: [
        {
          kind: 'nodeParamNumber',
          rowId: 'drv:widthMm',
          label: 'Width',
          numberInput: {
            value: 30,
            change: {
              kind: 'nodeParam',
              paramId: 'widthMm',
            },
          },
        },
      ],
      driverWarningByRowId: {
        'drv:widthMm': {
          kind: 'missingPort',
          message: 'Input port is missing.',
          reasons: ['missingPort'],
        },
      },
    })

    expect(html.includes('SpaghettiDriverWarningIndicator')).toBe(true)
    expect(html.includes('title=\"Input port is missing.\"')).toBe(true)
  })

  it('keeps non-driven numeric driver row in legacy single-control mode', () => {
    const html = renderPartNode(baseNode({}), {
      drivers: [
        {
          kind: 'nodeParamNumber',
          rowId: 'drv:widthMm',
          label: 'Width',
          numberInput: {
            value: 30,
            change: {
              kind: 'nodeParam',
              paramId: 'widthMm',
            },
          },
        },
      ],
    })

    expect(html.includes('SpaghettiDriverControlRow--offsetMode')).toBe(false)
    expect(html.includes('Width (Driven)')).toBe(false)
    expect(html.includes('Effective')).toBe(false)
  })

  it('renders OutputPreview parts-list slot rows in order with filled and empty states', () => {
    const html = renderOutputPreviewNode([
      {
        rowId: 'op-slot:s001',
        nodeId: 'node-output-preview-1',
        slotId: 's001',
        port: outputPreviewPort('s001'),
        slotStatus: 'ok',
        statusPrimary: 'Toe Hook',
        statusSecondary: 'Part/ToeHook | toeLoft',
        isTrailingEmpty: false,
      },
      {
        rowId: 'op-slot:s002',
        nodeId: 'node-output-preview-1',
        slotId: 's002',
        port: outputPreviewPort('s002'),
        slotStatus: 'empty',
        statusPrimary: '(empty)',
        statusSecondary: 'Drop part here',
        isTrailingEmpty: true,
      },
    ])

    const s001Index = html.indexOf('data-sp-output-preview-slot-id="s001"')
    const s002Index = html.indexOf('data-sp-output-preview-slot-id="s002"')
    const filledLabelIndex = html.indexOf('Toe Hook')
    const emptyLabelIndex = html.indexOf('(empty)')

    expect(html.includes('Parts List')).toBe(true)
    expect(s001Index).toBeGreaterThan(-1)
    expect(s002Index).toBeGreaterThan(-1)
    expect(s001Index).toBeLessThan(s002Index)
    expect(filledLabelIndex).toBeGreaterThan(-1)
    expect(emptyLabelIndex).toBeGreaterThan(-1)
    expect(html.includes('Drop part here')).toBe(true)
  })

  it('keeps deterministic section order and feature-stack ownership across current part nodes', () => {
    const nodeTypes: Array<'Part/Baseplate' | 'Part/Cube' | 'Part/ToeHook' | 'Part/HeelKick'> = [
      'Part/Baseplate',
      'Part/Cube',
      'Part/ToeHook',
      'Part/HeelKick',
    ]

    for (const nodeType of nodeTypes) {
      const html = renderPartNode(
        {
          nodeId: `node-${nodeType.replace('/', '-').toLowerCase()}`,
          type: nodeType,
          params: getDefaultNodeParams(nodeType),
        },
        {
          nodeMode: 'expanded',
        },
      )

      const driversIndex = html.indexOf('Drivers')
      const inputsIndex = html.indexOf('Inputs')
      const featureStackIndex = html.indexOf('Feature Stack')
      const outputsIndex = html.indexOf('Outputs')

      expect(driversIndex).toBeGreaterThan(-1)
      expect(inputsIndex).toBeGreaterThan(-1)
      expect(featureStackIndex).toBeGreaterThan(-1)
      expect(outputsIndex).toBeGreaterThan(-1)
      expect(driversIndex).toBeLessThan(inputsIndex)
      expect(inputsIndex).toBeLessThan(featureStackIndex)
      expect(featureStackIndex).toBeLessThan(outputsIndex)
      expect(html.includes('Feature Wire Inputs')).toBe(false)
      expect(html.includes('data-sp-feature-depth-port-id=')).toBe(false)
      expect(html.includes('data-sp-feature-width-port-id=')).toBe(false)
    }
  })

  it('renders compact Param/Number utility nodes', () => {
    const html = renderUtilityNode({
      node: {
        nodeId: 'node-param-number-1',
        type: 'Param/Number',
        params: { value: 12.5 },
      },
      title: 'Param Number',
      utilityVm: {
        source: 'param',
        kind: 'paramNumber',
        value: 12.5,
        outputPort: {
          portId: 'value',
          label: 'Value',
          type: { kind: 'number', unit: 'mm' },
        },
      },
    })

    expect(html.includes('SpaghettiUtilityNodeTemplate')).toBe(true)
    expect(html.includes('SpaghettiUtilityNodeEditorLabel')).toBe(true)
    expect(html.includes('value="12.5"')).toBe(true)
    expect(html.includes('number:mm')).toBe(true)
  })

  it('renders compact Param/Boolean utility nodes', () => {
    const html = renderUtilityNode({
      node: {
        nodeId: 'node-param-boolean-1',
        type: 'Param/Boolean',
        params: { value: true },
      },
      title: 'Param Boolean',
      utilityVm: {
        source: 'param',
        kind: 'paramBoolean',
        value: true,
        outputPort: {
          portId: 'value',
          label: 'Value',
          type: { kind: 'boolean' },
        },
      },
    })

    expect(html.includes('type="checkbox"')).toBe(true)
    expect(html.includes('checked=""')).toBe(true)
    expect(html.includes('True')).toBe(true)
    expect(html.includes('boolean')).toBe(true)
  })

  it('renders compact Param/Vec2 utility nodes', () => {
    const html = renderUtilityNode({
      node: {
        nodeId: 'node-param-vec2-1',
        type: 'Param/Vec2',
        params: { value: { x: 3, y: 8 } },
      },
      title: 'Param Vec2',
      utilityVm: {
        source: 'param',
        kind: 'paramVec2',
        value: { x: 3, y: 8 },
        outputPort: {
          portId: 'value',
          label: 'Value',
          type: { kind: 'vec2', unit: 'mm' },
        },
      },
    })

    expect(html.includes('SpVec2Field')).toBe(true)
    expect(html.includes('value="3"')).toBe(true)
    expect(html.includes('value="8"')).toBe(true)
    expect(html.includes('vec2:mm')).toBe(true)
  })

  it('renders the dedicated sketch template with plane-pick control and draw/review actions', () => {
    const html = renderSketchNode({
      node: {
        nodeId: 'node-sketch-1',
        type: 'Geometry/Sketch',
        params: {
          sketch: {
            type: 'sketch',
            featureId: 'sketch-1',
            plane: 'XY',
            components: [],
            outputs: {
              profiles: [],
              diagnostics: [],
            },
            uiState: {
              collapsed: false,
            },
          },
        },
      },
      sketchVm: {
        localPlane: 'XY',
        effectivePlane: 'XY',
        planeDriven: false,
        profileCount: 0,
        hasSelectedProfile: false,
      },
      allInputs: [
        {
          portId: 'SketchPlane',
          label: 'SketchPlane',
          type: { kind: 'plane' },
          optional: true,
          maxConnectionsIn: 1,
        },
        {
          portId: 'SketchEntities',
          label: 'SketchDraw',
          type: { kind: 'sketchEntities' },
          optional: true,
          maxConnectionsIn: 1,
        },
      ],
      allOutputs: [
        {
          portId: 'SketchProfiles',
          label: 'SketchProfiles',
          type: { kind: 'sketchProfiles' },
        },
        {
          portId: 'SketchProfile',
          label: 'SketchProfile',
          type: { kind: 'sketchProfile' },
        },
      ],
    })

    expect(html.includes('SpaghettiSketchNodeTemplate')).toBe(true)
    expect(html.includes('SpaghettiGeometryNodeShell')).toBe(true)
    expect(html.includes('data-sp-geometry-block="inputs"')).toBe(true)
    expect(html.includes('data-sp-geometry-block-open="1"')).toBe(true)
    expect(html.includes('data-sp-geometry-block="outputs"')).toBe(true)
    expect(html.includes('data-sp-geometry-port-row="in:SketchPlane"')).toBe(false)
    expect(html.includes('data-sp-geometry-port-row="out:SketchProfiles"')).toBe(false)
    expect(html.includes('data-sp-geometry-port-row="out:SketchProfile"')).toBe(false)
    expect(html.includes('SpaghettiPort--in')).toBe(true)
    expect(html.includes('SpaghettiPortChevron--leading')).toBe(true)
    expect(html.includes('data-sp-port-row-open="1"')).toBe(true)
    expect(html.includes('SketchPlane')).toBe(true)
    expect(html.includes('SketchDraw')).toBe(true)
    expect(html.includes('>XY<')).toBe(true)
    expect(html.includes('Source')).toBe(true)
    expect(html.includes('Transform')).toBe(true)
    expect(html.includes('Origin Plane')).toBe(true)
    expect(html.includes('ParaSelect')).toBe(true)
    expect(html.includes('ParaSlider')).toBe(true)
    expect(html.includes('SpaghettiGeometryNodeRailLabel">Inputs<')).toBe(true)
    expect(html.includes('SpaghettiGeometryNodeRailLabel">Sketch<')).toBe(true)
    expect(html.includes('SpaghettiGeometryNodeRailLabel">Outputs<')).toBe(true)
    expect(html.includes('Geometry')).toBe(true)
    expect(html.includes('Plane')).toBe(true)
    expect(html.includes('Draw')).toBe(true)
    expect(html.includes('data-sp-sketch-plane-row="1"')).toBe(true)
    expect(html.includes('Expand SketchDraw input row')).toBe(true)
    expect(html.includes('Open the viewer-side sketch toolbar')).toBe(true)
    expect(html.includes('No sketch entities yet')).toBe(true)
    expect(html.includes('Review')).toBe(true)
    expect(html.includes('No closed profiles detected yet.')).toBe(false)
    expect(html.includes('Draw/Edit Curves Inside')).toBe(false)
    expect(html.includes('Close/Select Profile')).toBe(false)
  })

  it('renders the dedicated extrude template with profile summary, depth control, and body output summary', () => {
    const html = renderExtrudeNode({
      node: {
        nodeId: 'node-extrude-1',
        type: 'Geometry/Extrude',
        params: {
          extrudeType: 'Basic',
          depthMm: 30,
        },
      },
      extrudeVm: {
        extrudeType: 'Basic',
        effectiveDepthMm: 30,
        depthDriven: false,
        hasProfile: true,
        profileId: 'profile-1',
        profileArea: 5000,
        bodyId: 'node-extrude-1:body',
      },
      allInputs: [
        {
          portId: 'ExtrusionProfile',
          label: 'ExtrusionProfile',
          type: { kind: 'sketchProfile' },
          optional: true,
          maxConnectionsIn: 1,
        },
        {
          portId: 'Depth',
          label: 'Depth',
          type: { kind: 'number', unit: 'mm' },
          optional: true,
          maxConnectionsIn: 1,
        },
      ],
      allOutputs: [
        {
          portId: 'SolidBody',
          label: 'SolidBody',
          type: { kind: 'solidBody' },
        },
      ],
    })

    expect(html.includes('SpaghettiExtrudeNodeTemplate')).toBe(true)
    expect(html.includes('ExtrusionProfile')).toBe(true)
    expect(html.includes('Depth')).toBe(true)
    expect(html.includes('Extrude Type')).toBe(true)
    expect(html.includes('Basic')).toBe(true)
    expect(html.includes('Twist')).toBe(true)
    expect(html.includes('Body ready: node-extrude-1:body')).toBe(true)
  })
})

