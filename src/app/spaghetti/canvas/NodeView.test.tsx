import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import type { PortSpec, SpaghettiNode } from '../schema/spaghettiTypes'
import type {
  DriverControlRowVm,
  InputEndpointRowVm,
  OutputPinnedRowVm,
} from './driverVm'
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
import type { ViewMode } from './rowViewMode'
import { buildExtrudeProfileEntryPortId } from '../features/extrudeProfileEntryPorts'
import { buildSketchProfileMemberPortId } from '../features/sketchProfileVirtualPorts'

type WorkerMessageHandler = (event: MessageEvent<unknown>) => void

class MockWorker {
  private readonly handlers = new Set<WorkerMessageHandler>()

  public addEventListener(type: string, handler: EventListenerOrEventListenerObject): void {
    if (type !== 'message' || typeof handler !== 'function') {
      return
    }
    this.handlers.add(handler as WorkerMessageHandler)
  }

  public removeEventListener(type: string, handler: EventListenerOrEventListenerObject): void {
    if (type !== 'message' || typeof handler !== 'function') {
      return
    }
    this.handlers.delete(handler as WorkerMessageHandler)
  }

  public postMessage(_message: unknown): void {}

  public terminate(): void {}
}

let getDefaultNodeParams!: typeof import('../registry/nodeRegistry').getDefaultNodeParams
let useSpaghettiStore!: typeof import('../store/useSpaghettiStore').useSpaghettiStore
let NodeView!: typeof import('./NodeView').NodeView
let buildSectionCollapseKey!: typeof import('./state/spaghettiUiStore').buildSectionCollapseKey
let useSpaghettiUiStore!: typeof import('./state/spaghettiUiStore').useSpaghettiUiStore
let OUTPUT_PREVIEW_NODE_TYPE!: typeof import('../system/outputPreviewNode').OUTPUT_PREVIEW_NODE_TYPE
const originalWorker = globalThis.Worker

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
  label: 'SolidBodies',
  type: { kind: 'solidBodies' },
  optional: true,
  maxConnectionsIn: Number.MAX_SAFE_INTEGER,
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

const renderLegacyPortNode = (options: {
  node: SpaghettiNode
  title: string
  allInputs: PortSpec[]
  allOutputs: PortSpec[]
  nodeMode?: ViewMode
}): string => {
  seedGraphForRender(options.node, options.nodeMode)
  return renderToStaticMarkup(
    <NodeView
      node={options.node}
      x={0}
      y={0}
      title={options.title}
      nodeMode={options.nodeMode ?? 'expanded'}
      allInputs={options.allInputs}
      allOutputs={options.allOutputs}
      inputCompositeState={emptyCompositeState}
      compositeExpansionRevision={0}
      getCompositeExpanded={() => true}
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
  nodeMode?: ViewMode
}): string => {
  seedGraphForRender(options.node, options.nodeMode)
  return renderToStaticMarkup(
    <NodeView
      node={options.node}
      x={0}
      y={0}
      title="Sketch"
      nodeMode={options.nodeMode ?? 'essentials'}
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
  nodeMode?: 'collapsed' | 'essentials' | 'expanded'
}): string => {
  seedGraphForRender(options.node, options.nodeMode)
  return renderToStaticMarkup(
    <NodeView
      node={options.node}
      x={0}
      y={0}
      title="Extrude"
      nodeMode={options.nodeMode ?? 'essentials'}
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
  beforeEach(async () => {
    vi.resetModules()
    globalThis.Worker = MockWorker as unknown as typeof Worker
    ;({ getDefaultNodeParams } = await import('../registry/nodeRegistry'))
    ;({ useSpaghettiStore } = await import('../store/useSpaghettiStore'))
    ;({ NodeView } = await import('./NodeView'))
    ;({ buildSectionCollapseKey, useSpaghettiUiStore } = await import('./state/spaghettiUiStore'))
    ;({ OUTPUT_PREVIEW_NODE_TYPE } = await import('../system/outputPreviewNode'))
  })

  afterEach(() => {
    globalThis.Worker = originalWorker
    useSpaghettiUiStore?.setState({ collapsed: {} })
    useSpaghettiStore?.getState().setGraph({
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

  it('collapsed mode keeps input and output section bodies visible while hiding non-pin sections', () => {
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

    expect(html.includes('data-sp-section-id="inputs" data-sp-section-body-visible="1"')).toBe(true)
    expect(html.includes('data-sp-section-id="outputs" data-sp-section-body-visible="1"')).toBe(true)
    expect(html.includes('Width Driver')).toBe(false)
    expect(html.includes('Depth Input')).toBe(true)
    expect(html.includes('Sketch: 0 profiles')).toBe(false)
    expect(html.includes('Body Output')).toBe(true)
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

    expect(html.includes('Profile Target: -, Depth: 10')).toBe(true)
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

  it('renders OutputPreview managed slot rows in order with filled and empty states', () => {
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
        statusSecondary: 'Drop bodies here',
        isTrailingEmpty: true,
      },
    ])

    const s001Index = html.indexOf('data-sp-output-preview-slot-id="s001"')
    const s002Index = html.indexOf('data-sp-output-preview-slot-id="s002"')
    const filledLabelIndex = html.indexOf('Toe Hook')
    const emptyLabelIndex = html.indexOf('(empty)')

    expect(s001Index).toBeGreaterThan(-1)
    expect(s002Index).toBeGreaterThan(-1)
    expect(s001Index).toBeLessThan(s002Index)
    expect(filledLabelIndex).toBeGreaterThan(-1)
    expect(emptyLabelIndex).toBeGreaterThan(-1)
    expect(html.includes('Parts List')).toBe(false)
    expect(html.includes('Drop bodies here')).toBe(true)
    expect((html.match(/data-sp-port-attached-body="input"/g) ?? []).length).toBe(2)
    expect((html.match(/data-sp-output-preview-attached-body="essentials"/g) ?? []).length).toBe(2)
  })

  it('renders split OutputPreview collection publication as child published objects under one slot', () => {
    const html = renderOutputPreviewNode([
      {
        rowId: 'op-slot:s001',
        nodeId: 'node-output-preview-1',
        slotId: 's001',
        objectId: 'output-object:s001',
        objectLabel: 'Pedal Body',
        inputLabel: 'SolidBodies',
        port: outputPreviewPort('s001'),
        slotStatus: 'ok',
        statusPrimary: 'Geometry/Extrude',
        statusSecondary: '1 collection contributor · split to 2 objects',
        publishedObjectRows: [
          {
            rowId: 'op-slot:s001:published:1',
            label: 'Pedal Body 1',
            status: 'Split published object 1 from this row-owned collection.',
          },
          {
            rowId: 'op-slot:s001:published:2',
            label: 'Pedal Body 2',
            status: 'Split published object 2 from this row-owned collection.',
          },
        ],
        isTrailingEmpty: false,
      },
    ])

    expect(html.includes('Published Prefix')).toBe(false)
    expect(html.includes('Parts List')).toBe(false)
    expect(html.includes('SolidBodies')).toBe(true)
    expect(html.includes('SpaghettiPortShell--managedCollectionIn')).toBe(true)
    expect(html.includes('SpaghettiOutputPreviewSolidBodiesPortRow')).toBe(false)
    expect(html.includes('--sp-port-color:#9c88f4')).toBe(true)
    expect(html.includes('Subcomponent')).toBe(false)
    expect(html.includes('Prefix')).toBe(true)
    expect(html.includes('2 published child objects')).toBe(true)
    expect(html.includes('Pedal Body 1')).toBe(true)
    expect(html.includes('Pedal Body 2')).toBe(true)
    expect(html.includes('Split published object 1 from this row-owned collection.')).toBe(true)
    expect((html.match(/data-sp-port-attached-body="input"/g) ?? []).length).toBe(1)
    expect(html.includes('data-sp-output-preview-attached-body="essentials"')).toBe(true)
  })

  it('renders grouped OutputPreview publication as one child published object under one source row', () => {
    const html = renderOutputPreviewNode([
      {
        rowId: 'op-slot:s001',
        nodeId: 'node-output-preview-1',
        slotId: 's001',
        objectId: 'output-object:s001',
        objectLabel: 'Pedal Body',
        inputLabel: 'SolidBodies',
        port: outputPreviewPort('s001'),
        slotStatus: 'ok',
        statusPrimary: 'Geometry/Extrude',
        statusSecondary: '1 collection contributor · grouped publication',
        publishedObjectRows: [
          {
            rowId: 'op-slot:s001:published:1',
            label: 'Pedal Body',
            status: 'Grouped published object from this collection source.',
          },
        ],
        isTrailingEmpty: false,
      },
    ])

    expect(html.includes('Published Object')).toBe(false)
    expect(html.includes('Parts List')).toBe(false)
    expect(html.includes('Name')).toBe(true)
    expect(html.includes('1 published child object')).toBe(true)
    expect(html.includes('Pedal Body')).toBe(true)
    expect(html.includes('Grouped published object from this collection source.')).toBe(true)
    expect(html.includes('data-sp-output-preview-attached-body="essentials"')).toBe(true)
  })

  it('keeps one SolidBodies row flat while publishing four child objects inside one component', () => {
    const html = renderOutputPreviewNode([
      {
        rowId: 'op-slot:s001',
        nodeId: 'node-output-preview-1',
        slotId: 's001',
        objectId: 'output-object:s001',
        objectLabel: 'Pedal Body',
        inputLabel: 'SolidBodies',
        port: outputPreviewPort('s001'),
        slotStatus: 'ok',
        statusPrimary: 'Extrude',
        statusSecondary: '1 collection contributor · split to 4 objects',
        publishedObjectRows: [
          {
            rowId: 'op-slot:s001:published:1',
            label: 'Pedal Body 1',
            status: 'Split published object 1 from this row-owned collection.',
          },
          {
            rowId: 'op-slot:s001:published:2',
            label: 'Pedal Body 2',
            status: 'Split published object 2 from this row-owned collection.',
          },
          {
            rowId: 'op-slot:s001:published:3',
            label: 'Pedal Body 3',
            status: 'Split published object 3 from this row-owned collection.',
          },
          {
            rowId: 'op-slot:s001:published:4',
            label: 'Pedal Body 4',
            status: 'Split published object 4 from this row-owned collection.',
          },
        ],
        isTrailingEmpty: false,
      },
    ])

    expect(html.includes('Subcomponent')).toBe(false)
    expect(html.includes('4 published child objects')).toBe(true)
    expect(html.includes('Pedal Body 4')).toBe(true)
    expect(html.includes('data-sp-output-preview-attached-body="essentials"')).toBe(true)
  })

  it('renders multiple active OutputPreview collection rows as subcomponent-style groups under one component', () => {
    const html = renderOutputPreviewNode([
      {
        rowId: 'op-slot:s001',
        nodeId: 'node-output-preview-1',
        slotId: 's001',
        objectId: 'output-object:s001',
        objectLabel: 'Pedal Body',
        inputLabel: 'SolidBodies',
        port: outputPreviewPort('s001'),
        slotStatus: 'ok',
        statusPrimary: 'Geometry/Extrude',
        statusSecondary: '1 collection contributor · grouped publication',
        publishedObjectRows: [
          {
            rowId: 'op-slot:s001:published:1',
            label: 'Pedal Body',
            status: 'Grouped published object from this collection source.',
          },
        ],
        isTrailingEmpty: false,
      },
      {
        rowId: 'op-slot:s002',
        nodeId: 'node-output-preview-1',
        slotId: 's002',
        objectId: 'output-object:s002',
        objectLabel: 'Pedal Hook',
        inputLabel: 'SolidBodies',
        port: outputPreviewPort('s002'),
        slotStatus: 'ok',
        statusPrimary: 'Geometry/Extrude',
        statusSecondary: '1 collection contributor · grouped publication',
        publishedObjectRows: [
          {
            rowId: 'op-slot:s002:published:1',
            label: 'Pedal Hook',
            status: 'Grouped published object from this collection source.',
          },
        ],
        isTrailingEmpty: false,
      },
    ])

    expect(html.includes('Parts List')).toBe(false)
    expect((html.match(/Subcomponent/g) ?? []).length).toBe(2)
    expect((html.match(/>Name</g) ?? []).length).toBe(2)
    expect(html.includes('Pedal Body')).toBe(true)
    expect(html.includes('Pedal Hook')).toBe(true)
    expect((html.match(/data-sp-port-attached-body="input"/g) ?? []).length).toBe(2)
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

  it('renders composite parent rows as structured owners instead of decorative wrappers', () => {
    const html = renderLegacyPortNode({
      node: {
        nodeId: 'node-composite-1',
        type: 'Part/Baseplate',
        params: {},
      },
      title: 'Composite Demo',
      allInputs: [
        {
          portId: 'Center',
          label: 'Center',
          type: { kind: 'vec2', unit: 'mm' },
          optional: true,
          maxConnectionsIn: 1,
        },
      ],
      allOutputs: [
        {
          portId: 'Offset',
          label: 'Offset',
          type: { kind: 'vec3', unit: 'mm' },
        },
      ],
    })

    expect(html.includes('Center')).toBe(true)
    expect(html.includes('2 children')).toBe(true)
    expect(html.includes('Structured parent')).toBe(true)
    expect(
      html.includes(
        'This Center row owns 2 children as typed channels. Expand one child row at a time instead of using decorative nesting.',
      ),
    ).toBe(true)
    expect(html.includes('data-sp-composite-parent-summary="input"')).toBe(true)
    expect(html.includes('Typed children')).toBe(true)
    expect(html.includes('X | Y')).toBe(true)
    expect(html.includes('Offset')).toBe(true)
    expect(html.includes('3 children')).toBe(true)
    expect(
      html.includes(
        'This Offset output publishes one structured value. The child rows expose real typed channels from the same parent value.',
      ),
    ).toBe(true)
    expect(html.includes('data-sp-composite-parent-summary="output"')).toBe(true)
    expect(html.includes('X | Y | Z')).toBe(true)
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
    expect(html.includes('data-sp-geometry-block="content"')).toBe(false)
    expect(html.includes('SpaghettiGeometryNodeRailLabel">Sketch<')).toBe(false)
    expect(html.includes('SpaghettiGeometryNodeRailLabel">Outputs<')).toBe(true)
    expect(html.includes('Geometry')).toBe(true)
    expect(html.includes('Draw')).toBe(true)
    expect(html.includes('Expand SketchDraw input row')).toBe(true)
    expect(html.includes('Open the viewer-side sketch toolbar')).toBe(true)
    expect(html.includes('No sketch entities yet')).toBe(true)
    expect(html.includes('Review')).toBe(false)
    expect(html.includes('Draw/Edit Curves Inside')).toBe(false)
    expect(html.includes('Close/Select Profile')).toBe(false)
  })

  it('renders sketch collection parent and singular member outputs with explicit collection meaning', () => {
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
              profiles: [
                { profileId: 'profile-1', area: 10 },
                { profileId: 'profile-2', area: 15 },
              ],
              diagnostics: [],
            },
            uiState: {
              collapsed: false,
              selectedProfileId: 'profile-2',
            },
          },
        },
      },
      sketchVm: {
        localPlane: 'XY',
        effectivePlane: 'XY',
        planeDriven: false,
        profileCount: 2,
        hasSelectedProfile: true,
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
      nodeMode: 'expanded',
    })

    expect(html.includes('SketchProfiles')).toBe(true)
    expect(html.includes('SpaghettiPortShell--managedCollectionOut')).toBe(true)
    expect(html.includes('2 profiles')).toBe(true)
    expect(html.includes('Parent collection')).toBe(true)
    expect(
      html.includes(
        'Wire this parent row to consume all closed profiles from this sketch in source order.',
      ),
    ).toBe(true)
    expect(html.includes('all resolved closed profiles in source order')).toBe(true)
    expect(html.includes('data-sp-sketch-profiles-summary="1"')).toBe(true)
    expect(html.includes('Singular member')).toBe(false)
    expect(html.includes('data-sp-sketch-profile-summary="1"')).toBe(false)
    expect((html.match(/data-sp-sketch-profile-child-row=/g) ?? []).length).toBe(2)
    expect(html.includes('data-sp-sketch-profile-child-row="profile-1"')).toBe(true)
    expect(html.includes('data-sp-sketch-profile-child-row="profile-2"')).toBe(true)
    expect(
      html.includes(
        `data-sp-sketch-profile-child-port-id="${buildSketchProfileMemberPortId('profile-1')}"`,
      ),
    ).toBe(true)
    expect(
      html.includes(
        `data-sp-endpoint-port-id="${buildSketchProfileMemberPortId('profile-1')}"`,
      ),
    ).toBe(true)
    expect(
      html.includes(
        `data-sp-endpoint-port-id="${buildSketchProfileMemberPortId('profile-2')}"`,
      ),
    ).toBe(true)
    expect((html.match(/data-sp-endpoint-port-id="SketchProfile:profile-/g) ?? []).length).toBe(2)
    expect(html.includes('profile-1')).toBe(true)
    expect(html.includes('profile-2')).toBe(true)
    expect((html.match(/one resolved profile member target/g) ?? []).length).toBe(2)
    expect(html.includes('selected member')).toBe(true)
    expect(html.includes('selected')).toBe(true)
  })

  it('renders the dedicated extrude template with profile summary, depth control, and body output summary', () => {
    const html = renderExtrudeNode({
      node: {
        nodeId: 'node-extrude-1',
        type: 'Geometry/Extrude',
        params: {
          extrudeType: 'Body',
          extrudeDirection: 'OneSide',
          depthMm: 30,
        },
      },
      extrudeVm: {
        extrudeType: 'Body',
        extrudeDirection: 'OneSide',
        localDepthMm: 30,
        effectiveDepthMm: 30,
        depthVisible: true,
        depthDriven: false,
        localStartDepthMm: 30,
        effectiveStartDepthMm: 30,
        startDepthVisible: false,
        startDepthDriven: false,
        localEndDepthMm: 30,
        effectiveEndDepthMm: 30,
        endDepthVisible: false,
        endDepthDriven: false,
        localTaperAngleDeg: 3,
        effectiveTaperAngleDeg: 3,
        taperVisible: true,
        taperDriven: false,
        hasProfile: true,
        profileTargetMode: 'single',
        profileInputEntries: [
          {
            endpointPortId: buildExtrudeProfileEntryPortId('edge-sketch-profile'),
            entryId: 'edge-sketch-profile',
            kind: 'single',
            label: 'SketchProfile',
            sourceNodeId: 'node-sketch-1',
            sourceNodeLabel: 'Sketch',
            profileId: 'profile-1',
          },
        ],
        profileId: 'profile-1',
        profileArea: 5000,
        bodyId: 'node-extrude-1:body',
      },
      allInputs: [
        {
          portId: 'ExtrusionProfile',
          label: 'SketchProfiles',
          type: { kind: 'sketchProfiles' },
          optional: true,
          maxConnectionsIn: 1,
        },
        {
          portId: 'Type',
          label: 'Type',
          type: { kind: 'number', unit: 'unitless' },
          optional: true,
          maxConnectionsIn: 1,
        },
        {
          portId: 'Direction',
          label: 'Direction',
          type: { kind: 'number', unit: 'unitless' },
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
        {
          portId: 'TaperAngle',
          label: 'Taper Angle',
          type: { kind: 'number', unit: 'deg' },
          optional: true,
          maxConnectionsIn: 1,
        },
      ],
      allOutputs: [
        {
          portId: 'SolidBody',
          label: 'SolidBody',
          type: { kind: 'solidBodies' },
        },
      ],
      nodeMode: 'expanded',
    })

    expect(html.includes('SpaghettiExtrudeNodeTemplate')).toBe(true)
    expect(html.includes('SpaghettiGeometryNodeShell')).toBe(true)
    expect(html.includes('data-sp-geometry-block="inputs"')).toBe(true)
    expect(html.includes('data-sp-geometry-block="content"')).toBe(false)
    expect(html.includes('data-sp-geometry-block="outputs"')).toBe(true)
    expect(html.includes('SpaghettiExtrudeInputStack')).toBe(true)
    expect(html.includes('data-sp-enum-row="1"')).toBe(true)
    expect(html.includes('SpaghettiPortShell--managedCollectionIn')).toBe(true)
    expect(html.includes('SpaghettiPortShell--managedCollectionOut')).toBe(true)
    expect(html.includes('SpaghettiExtrudeProfilePortRow')).toBe(false)
    expect(html.includes('SketchProfiles')).toBe(true)
    expect(html.includes('Type')).toBe(true)
    expect(html.includes('ParaSelect')).toBe(true)
    expect(html.includes('ParaSelectNative')).toBe(true)
    expect(html.includes('SpaghettiPortEnumValueRow')).toBe(true)
    expect(html.includes('ParaSelectTrackButton')).toBe(true)
    expect(html.includes('ParaSelectMenu')).toBe(false)
    expect(html.includes('aria-label="Previous Type"')).toBe(true)
    expect(html.includes('aria-label="Next Type"')).toBe(true)
    expect(html.includes('aria-label="Previous Direction"')).toBe(true)
    expect(html.includes('aria-label="Next Direction"')).toBe(true)
    expect(html.includes('data-sp-port-row-open="1"')).toBe(true)
    expect(html.includes('Profile Target')).toBe(false)
    expect(html.includes('Depth')).toBe(true)
    expect(html.includes('Taper Angle')).toBe(true)
    expect(html.includes('ParaSlider')).toBe(false)
    expect(html.includes('SpaghettiPortPrimitiveValueRow')).toBe(true)
    expect(html.includes('SpaghettiPortPrimitiveLane')).toBe(true)
    expect(html.includes('SpaghettiPortPrimitiveValueWrap')).toBe(true)
    expect(html.includes('SpaghettiPortPrimitiveDivider')).toBe(true)
    expect(html.includes('SpaghettiPortPrimitiveEndcap--left')).toBe(true)
    expect(html.includes('SpaghettiPortPrimitiveEndcap--right')).toBe(true)
    expect(html.includes('aria-label="Decrease Depth"')).toBe(true)
    expect(html.includes('aria-label="Increase Depth"')).toBe(true)
    expect(html.includes('aria-label="Decrease Taper Angle"')).toBe(true)
    expect(html.includes('aria-label="Increase Taper Angle"')).toBe(true)
    expect(html.includes('Depth Value')).toBe(false)
    expect(html.includes('local fallback depth in millimeters')).toBe(false)
    expect(html.includes('SpaghettiGeometryNodeRailLabel">Inputs<')).toBe(true)
    expect(html.includes('SpaghettiGeometryNodeRailLabel">Details<')).toBe(false)
    expect(html.includes('SpaghettiGeometryNodeRailLabel">Outputs<')).toBe(true)
    expect(html.includes('Body')).toBe(true)
    expect(html.includes('Walls')).toBe(true)
    expect(html.includes('One Side')).toBe(true)
    expect(html.includes('Two Sides')).toBe(true)
    expect(html.includes('Symmetric')).toBe(true)
    expect(html.includes('SpaghettiPortMain--enumValue')).toBe(true)
    expect(html.includes('SpaghettiPortAnchor--in')).toBe(true)
    expect(html.includes('SpaghettiPortAnchor--out')).toBe(true)
    expect(html.includes('SpaghettiPortChevron--leading')).toBe(true)
    expect(html.includes('data-sp-extrude-body-summary="1"')).toBe(true)
    const sketchProfileRowIndex = html.indexOf('SpaghettiPortShell--managedCollectionIn')
    const typeRowIndex = html.indexOf('aria-label="Type"')
    const directionRowIndex = html.indexOf('aria-label="Direction"')
    const depthRowIndex = html.indexOf('SpaghettiPortPrimitiveValueRow')
    const taperRowIndex = html.lastIndexOf('Taper Angle')
    expect(sketchProfileRowIndex).toBeGreaterThan(-1)
    expect(typeRowIndex).toBeGreaterThan(sketchProfileRowIndex)
    expect(directionRowIndex).toBeGreaterThan(typeRowIndex)
    expect(depthRowIndex).toBeGreaterThan(directionRowIndex)
    expect(taperRowIndex).toBeGreaterThan(depthRowIndex)
    expect(html.includes('Ready')).toBe(true)
    expect(html.includes('Body Collection Output')).toBe(false)
  })

  it('renders the dedicated extrude template empty state as a managed SketchProfile input row', () => {
    const html = renderExtrudeNode({
      node: {
        nodeId: 'node-extrude-1',
        type: 'Geometry/Extrude',
        params: {
          extrudeType: 'Body',
          extrudeDirection: 'OneSide',
          depthMm: 30,
        },
      },
      extrudeVm: {
        extrudeType: 'Body',
        extrudeDirection: 'OneSide',
        localDepthMm: 30,
        effectiveDepthMm: 30,
        depthVisible: true,
        depthDriven: false,
        localStartDepthMm: 30,
        effectiveStartDepthMm: 30,
        startDepthVisible: false,
        startDepthDriven: false,
        localEndDepthMm: 30,
        effectiveEndDepthMm: 30,
        endDepthVisible: false,
        endDepthDriven: false,
        taperVisible: true,
        hasProfile: false,
      },
      allInputs: [
        {
          portId: 'ExtrusionProfile',
          label: 'SketchProfiles',
          type: { kind: 'sketchProfiles' },
          optional: true,
          maxConnectionsIn: 1,
        },
        {
          portId: 'Type',
          label: 'Type',
          type: { kind: 'number', unit: 'unitless' },
          optional: true,
          maxConnectionsIn: 1,
        },
        {
          portId: 'Direction',
          label: 'Direction',
          type: { kind: 'number', unit: 'unitless' },
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
          type: { kind: 'solidBodies' },
        },
      ],
    })

    expect(html.includes('SketchProfile')).toBe(true)
    expect(html.includes('SpaghettiPortShell--managedCollectionIn')).toBe(true)
    expect(html.includes('SpaghettiExtrudeProfilePortRow')).toBe(false)
    expect(html.includes('No SketchProfiles contributors yet')).toBe(true)
    expect(html.includes('Profile Target')).toBe(false)
    expect(html.includes('Depth Value')).toBe(false)
  })

  it('keeps the extrude header status out of the empty-state branch when a SketchProfiles wire is connected', () => {
    const html = renderExtrudeNode({
      node: {
        nodeId: 'node-extrude-1',
        type: 'Geometry/Extrude',
        params: {
          extrudeType: 'Body',
          extrudeDirection: 'OneSide',
          depthMm: 30,
        },
      },
      extrudeVm: {
        extrudeType: 'Body',
        extrudeDirection: 'OneSide',
        localDepthMm: 30,
        effectiveDepthMm: 30,
        depthVisible: true,
        depthDriven: false,
        localStartDepthMm: 30,
        effectiveStartDepthMm: 30,
        startDepthVisible: false,
        startDepthDriven: false,
        localEndDepthMm: 30,
        effectiveEndDepthMm: 30,
        endDepthVisible: false,
        endDepthDriven: false,
        taperVisible: true,
        hasProfile: false,
        profileWireCount: 1,
      },
      allInputs: [
        {
          portId: 'ExtrusionProfile',
          label: 'SketchProfiles',
          type: { kind: 'sketchProfiles' },
          optional: true,
          maxConnectionsIn: 1,
        },
      ],
      allOutputs: [
        {
          portId: 'SolidBody',
          label: 'SolidBody',
          type: { kind: 'solidBodies' },
        },
      ],
      nodeMode: 'expanded',
    })

    expect(html.includes('SketchProfiles connected | awaiting profile state')).toBe(true)
    expect(html.includes('No SketchProfiles contributors yet')).toBe(false)
    expect(html.includes('Profile Target')).toBe(false)
    expect(html.includes('Waiting')).toBe(true)
  })

  it('renders aggregate SketchProfiles copy honestly in the dedicated extrude template', () => {
    const html = renderExtrudeNode({
      node: {
        nodeId: 'node-extrude-1',
        type: 'Geometry/Extrude',
        params: {
          extrudeType: 'Body',
          extrudeDirection: 'OneSide',
          depthMm: 30,
        },
      },
      extrudeVm: {
        extrudeType: 'Body',
        extrudeDirection: 'OneSide',
        localDepthMm: 30,
        effectiveDepthMm: 30,
        depthVisible: true,
        depthDriven: false,
        localStartDepthMm: 30,
        effectiveStartDepthMm: 30,
        startDepthVisible: false,
        startDepthDriven: false,
        localEndDepthMm: 30,
        effectiveEndDepthMm: 30,
        endDepthVisible: false,
        endDepthDriven: false,
        taperVisible: true,
        hasProfile: true,
        profileTargetMode: 'allFromSketch',
        profileCount: 2,
        profileInputEntries: [
          {
            endpointPortId: buildExtrudeProfileEntryPortId('edge-sketch-profiles'),
            entryId: 'edge-sketch-profiles',
            kind: 'aggregate',
            label: 'SketchProfiles',
            sourceNodeId: 'node-sketch-1',
            sourceNodeLabel: 'Sketch',
          },
        ],
        bodyId: 'node-extrude-1:body',
      },
      allInputs: [
        {
          portId: 'ExtrusionProfile',
          label: 'SketchProfiles',
          type: { kind: 'sketchProfiles' },
          optional: true,
          maxConnectionsIn: 1,
        },
        {
          portId: 'Type',
          label: 'Type',
          type: { kind: 'number', unit: 'unitless' },
          optional: true,
          maxConnectionsIn: 1,
        },
        {
          portId: 'Direction',
          label: 'Direction',
          type: { kind: 'number', unit: 'unitless' },
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
          type: { kind: 'solidBodies' },
        },
      ],
      nodeMode: 'expanded',
    })

    expect(html.includes('SketchProfiles')).toBe(true)
    expect(html.includes('data-sp-extrude-profile-entry-row="edge-sketch-profiles"')).toBe(true)
    expect(
      html.includes(
        `data-sp-extrude-profile-entry-port-id="${buildExtrudeProfileEntryPortId('edge-sketch-profiles')}"`,
      ),
    ).toBe(true)
    expect(html.includes('aggregate SketchProfiles contributor')).toBe(true)
    expect(html.includes('Parent collection | 2 closed profiles')).toBe(true)
    expect(html.includes('data-sp-port-header-lane="status"')).toBe(true)
    expect(html.includes('data-sp-port-header-status="1"')).toBe(true)
    expect(html.includes('data-sp-port-attached-body="output"')).toBe(true)
    expect(html.includes('Profile Target')).toBe(false)
    expect(html.includes('Ready')).toBe(true)
  })

  it('distinguishes a wired aggregate SketchProfiles parent from an empty extrude collection input', () => {
    const html = renderExtrudeNode({
      node: {
        nodeId: 'node-extrude-1',
        type: 'Geometry/Extrude',
        params: {
          extrudeType: 'Body',
          extrudeDirection: 'OneSide',
          depthMm: 30,
        },
      },
      extrudeVm: {
        extrudeType: 'Body',
        extrudeDirection: 'OneSide',
        localDepthMm: 30,
        effectiveDepthMm: 30,
        depthVisible: true,
        depthDriven: false,
        localStartDepthMm: 30,
        effectiveStartDepthMm: 30,
        startDepthVisible: false,
        startDepthDriven: false,
        localEndDepthMm: 30,
        effectiveEndDepthMm: 30,
        endDepthVisible: false,
        endDepthDriven: false,
        taperVisible: true,
        hasProfile: false,
        profileTargetMode: 'allFromSketch',
        profileCount: 0,
        profileInputEntries: [
          {
            endpointPortId: buildExtrudeProfileEntryPortId('edge-sketch-profiles'),
            entryId: 'edge-sketch-profiles',
            kind: 'aggregate',
            label: 'SketchProfiles',
            sourceNodeId: 'node-sketch-1',
            sourceNodeLabel: 'Sketch',
          },
        ],
      },
      allInputs: [
        {
          portId: 'ExtrusionProfile',
          label: 'SketchProfiles',
          type: { kind: 'sketchProfiles' },
          optional: true,
          maxConnectionsIn: 1,
        },
      ],
      allOutputs: [
        {
          portId: 'SolidBody',
          label: 'SolidBody',
          type: { kind: 'solidBodies' },
        },
      ],
      nodeMode: 'expanded',
    })

    expect(html.includes('Parent collection wired | awaiting closed profiles')).toBe(true)
    expect(html.includes('aggregate SketchProfiles contributor')).toBe(true)
    expect(html.includes('Profile Target')).toBe(false)
    expect(html.includes('No SketchProfiles contributors yet')).toBe(false)
  })

  it('keeps Combine mode singular with no child SolidBody rows', () => {
    const html = renderExtrudeNode({
      node: {
        nodeId: 'node-extrude-1',
        type: 'Geometry/Extrude',
        params: {
          bodyGenerationMode: 'Combine',
          extrudeType: 'Body',
          extrudeDirection: 'OneSide',
          depthMm: 30,
        },
      },
      extrudeVm: {
        extrudeType: 'Body',
        bodyGenerationMode: 'Combine',
        extrudeDirection: 'OneSide',
        localDepthMm: 30,
        effectiveDepthMm: 30,
        depthVisible: true,
        depthDriven: false,
        localStartDepthMm: 30,
        effectiveStartDepthMm: 30,
        startDepthVisible: false,
        startDepthDriven: false,
        localEndDepthMm: 30,
        effectiveEndDepthMm: 30,
        endDepthVisible: false,
        endDepthDriven: false,
        taperVisible: true,
        hasProfile: true,
        bodyId: 'node-extrude-1:body',
        bodyCount: 1,
      },
      allInputs: [
        {
          portId: 'ExtrusionProfile',
          label: 'SketchProfiles',
          type: { kind: 'sketchProfiles' },
          optional: true,
          maxConnectionsIn: 1,
        },
        {
          portId: 'Type',
          label: 'Type',
          type: { kind: 'number', unit: 'unitless' },
          optional: true,
          maxConnectionsIn: 1,
        },
        {
          portId: 'Direction',
          label: 'Direction',
          type: { kind: 'number', unit: 'unitless' },
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
      nodeMode: 'expanded',
    })

    expect(html.includes('data-sp-extrude-body-child-row=')).toBe(false)
  })

  it('renders singular SketchProfile copy honestly in the dedicated extrude template', () => {
    const html = renderExtrudeNode({
      node: {
        nodeId: 'node-extrude-1',
        type: 'Geometry/Extrude',
        params: {
          extrudeType: 'Body',
          extrudeDirection: 'OneSide',
          depthMm: 30,
        },
      },
      extrudeVm: {
        extrudeType: 'Body',
        extrudeDirection: 'OneSide',
        localDepthMm: 30,
        effectiveDepthMm: 30,
        depthVisible: true,
        depthDriven: false,
        localStartDepthMm: 30,
        effectiveStartDepthMm: 30,
        startDepthVisible: false,
        startDepthDriven: false,
        localEndDepthMm: 30,
        effectiveEndDepthMm: 30,
        endDepthVisible: false,
        endDepthDriven: false,
        taperVisible: true,
        hasProfile: true,
        profileTargetMode: 'single',
        profileId: 'prof-12345678',
        profileArea: 12.5,
        profileInputEntries: [
          {
            endpointPortId: buildExtrudeProfileEntryPortId('edge-sketch-profile'),
            entryId: 'edge-sketch-profile',
            kind: 'single',
            label: 'SketchProfile',
            sourceNodeId: 'node-sketch-1',
            sourceNodeLabel: 'Sketch',
            profileId: 'prof-12345678',
          },
        ],
      },
      allInputs: [
        {
          portId: 'ExtrusionProfile',
          label: 'SketchProfiles',
          type: { kind: 'sketchProfiles' },
          optional: true,
          maxConnectionsIn: 1,
        },
        {
          portId: 'Type',
          label: 'Type',
          type: { kind: 'number', unit: 'unitless' },
          optional: true,
          maxConnectionsIn: 1,
        },
        {
          portId: 'Direction',
          label: 'Direction',
          type: { kind: 'number', unit: 'unitless' },
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
          type: { kind: 'solidBodies' },
        },
      ],
      nodeMode: 'expanded',
    })

    expect(html.includes('data-sp-extrude-profile-entry-row="edge-sketch-profile"')).toBe(true)
    expect(
      html.includes(
        `data-sp-extrude-profile-entry-port-id="${buildExtrudeProfileEntryPortId('edge-sketch-profile')}"`,
      ),
    ).toBe(true)
    expect(html.includes('singular SketchProfile contributor')).toBe(true)
    expect(html.includes('1 contributor | prof-123 | area 12.5')).toBe(true)
    expect(html.includes('Profile Target')).toBe(false)
    expect(html.includes('Waiting')).toBe(true)
  })

  it('keeps multiple singular SketchProfile contributors collection-shaped in the dedicated extrude template', () => {
    const html = renderExtrudeNode({
      node: {
        nodeId: 'node-extrude-1',
        type: 'Geometry/Extrude',
        params: {
          extrudeType: 'Body',
          extrudeDirection: 'OneSide',
          depthMm: 30,
        },
      },
      extrudeVm: {
        extrudeType: 'Body',
        extrudeDirection: 'OneSide',
        localDepthMm: 30,
        effectiveDepthMm: 30,
        depthVisible: true,
        depthDriven: false,
        localStartDepthMm: 30,
        effectiveStartDepthMm: 30,
        startDepthVisible: false,
        startDepthDriven: false,
        localEndDepthMm: 30,
        effectiveEndDepthMm: 30,
        endDepthVisible: false,
        endDepthDriven: false,
        taperVisible: true,
        hasProfile: true,
        profileTargetMode: 'single',
        profileCount: 2,
        profileInputEntries: [
          {
            endpointPortId: buildExtrudeProfileEntryPortId('edge-sketch-profile-a'),
            entryId: 'edge-sketch-profile-a',
            kind: 'single',
            label: 'SketchProfile',
            sourceNodeId: 'node-sketch-1',
            sourceNodeLabel: 'Sketch',
            profileId: 'prof-aaaa1111',
          },
          {
            endpointPortId: buildExtrudeProfileEntryPortId('edge-sketch-profile-b'),
            entryId: 'edge-sketch-profile-b',
            kind: 'single',
            label: 'SketchProfile',
            sourceNodeId: 'node-sketch-2',
            sourceNodeLabel: 'Sketch',
            profileId: 'prof-bbbb2222',
          },
        ],
      },
      allInputs: [
        {
          portId: 'ExtrusionProfile',
          label: 'SketchProfiles',
          type: { kind: 'sketchProfiles' },
          optional: true,
          maxConnectionsIn: 1,
        },
      ],
      allOutputs: [
        {
          portId: 'SolidBody',
          label: 'SolidBody',
          type: { kind: 'solidBodies' },
        },
      ],
      nodeMode: 'expanded',
    })

    expect(html.includes('2 contributors | 2 closed profiles')).toBe(true)
    expect(html.includes('singular SketchProfile contributor')).toBe(true)
    expect(html.includes('Profile Target')).toBe(false)
    expect(html.includes('1 contributor | profile | area 0')).toBe(false)
  })

  it('renders one child row per mixed aggregate and singular extrude profile contributor', () => {
    const html = renderExtrudeNode({
      node: {
        nodeId: 'node-extrude-1',
        type: 'Geometry/Extrude',
        params: {
          extrudeType: 'Body',
          extrudeDirection: 'OneSide',
          depthMm: 30,
        },
      },
      extrudeVm: {
        extrudeType: 'Body',
        extrudeDirection: 'OneSide',
        localDepthMm: 30,
        effectiveDepthMm: 30,
        depthVisible: true,
        depthDriven: false,
        localStartDepthMm: 30,
        effectiveStartDepthMm: 30,
        startDepthVisible: false,
        startDepthDriven: false,
        localEndDepthMm: 30,
        effectiveEndDepthMm: 30,
        endDepthVisible: false,
        endDepthDriven: false,
        taperVisible: true,
        hasProfile: true,
        profileTargetMode: 'allFromSketch',
        profileCount: 2,
        profileInputEntries: [
          {
            endpointPortId: buildExtrudeProfileEntryPortId('edge-sketch-profile-member'),
            entryId: 'edge-sketch-profile-member',
            kind: 'single',
            label: 'SketchProfile',
            sourceNodeId: 'node-sketch-1',
            sourceNodeLabel: 'Sketch',
            profileId: 'profile-1',
          },
          {
            endpointPortId: buildExtrudeProfileEntryPortId('edge-sketch-profiles'),
            entryId: 'edge-sketch-profiles',
            kind: 'aggregate',
            label: 'SketchProfiles',
            sourceNodeId: 'node-sketch-1',
            sourceNodeLabel: 'Sketch',
          },
        ],
      },
      allInputs: [
        {
          portId: 'ExtrusionProfile',
          label: 'SketchProfiles',
          type: { kind: 'sketchProfiles' },
          optional: true,
          maxConnectionsIn: 1,
        },
        {
          portId: 'Type',
          label: 'Type',
          type: { kind: 'number', unit: 'unitless' },
          optional: true,
          maxConnectionsIn: 1,
        },
        {
          portId: 'Direction',
          label: 'Direction',
          type: { kind: 'number', unit: 'unitless' },
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
          type: { kind: 'solidBodies' },
        },
      ],
      nodeMode: 'expanded',
    })

    expect(html.includes('data-sp-extrude-profile-entry-row="edge-sketch-profile-member"')).toBe(true)
    expect(html.includes('data-sp-extrude-profile-entry-row="edge-sketch-profiles"')).toBe(true)
    expect(
      html.includes(
        `data-sp-extrude-profile-entry-port-id="${buildExtrudeProfileEntryPortId('edge-sketch-profile-member')}"`,
      ),
    ).toBe(true)
    expect(
      html.includes(
        `data-sp-extrude-profile-entry-port-id="${buildExtrudeProfileEntryPortId('edge-sketch-profiles')}"`,
      ),
    ).toBe(true)
    expect(html.includes('data-sp-extrude-profile-entry-kind="single"')).toBe(true)
    expect(html.includes('data-sp-extrude-profile-entry-kind="aggregate"')).toBe(true)
    expect(html.includes('singular SketchProfile contributor')).toBe(true)
    expect(html.includes('aggregate SketchProfiles contributor')).toBe(true)
  })

  it('renders walls copy as uncapped side-wall output in the dedicated extrude template', () => {
    const html = renderExtrudeNode({
      node: {
        nodeId: 'node-extrude-1',
        type: 'Geometry/Extrude',
        params: {
          extrudeType: 'Walls',
          extrudeDirection: 'OneSide',
          depthMm: 30,
        },
      },
      extrudeVm: {
        extrudeType: 'Walls',
        extrudeDirection: 'OneSide',
        localDepthMm: 30,
        effectiveDepthMm: 30,
        depthVisible: true,
        depthDriven: false,
        localStartDepthMm: 30,
        effectiveStartDepthMm: 30,
        startDepthVisible: false,
        startDepthDriven: false,
        localEndDepthMm: 30,
        effectiveEndDepthMm: 30,
        endDepthVisible: false,
        endDepthDriven: false,
        taperVisible: false,
        hasProfile: false,
      },
      allInputs: [
        {
          portId: 'ExtrusionProfile',
          label: 'SketchProfiles',
          type: { kind: 'sketchProfiles' },
          optional: true,
          maxConnectionsIn: 1,
        },
        {
          portId: 'Type',
          label: 'Type',
          type: { kind: 'number', unit: 'unitless' },
          optional: true,
          maxConnectionsIn: 1,
        },
        {
          portId: 'Direction',
          label: 'Direction',
          type: { kind: 'number', unit: 'unitless' },
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
          type: { kind: 'solidBodies' },
        },
      ],
      nodeMode: 'expanded',
    })

    expect(html.includes('Waiting')).toBe(true)
    expect(html.includes('data-sp-port-header-lane="status"')).toBe(true)
    expect(html.includes('data-sp-port-header-status="1"')).toBe(true)
    expect(html.includes('data-sp-port-attached-body="output"')).toBe(true)
    expect(html.includes('Taper Angle')).toBe(false)
  })

  it('renders direction-aware waiting copy for TwoSides in the dedicated extrude template', () => {
    const html = renderExtrudeNode({
      node: {
        nodeId: 'node-extrude-1',
        type: 'Geometry/Extrude',
        params: {
          extrudeType: 'Body',
          extrudeDirection: 'TwoSides',
          depthMm: 20,
          startDepthMm: 5,
          endDepthMm: 7,
        },
      },
      extrudeVm: {
        extrudeType: 'Body',
        extrudeDirection: 'TwoSides',
        localExtrudeDirection: 'TwoSides',
        directionDriven: false,
        localDepthMm: 20,
        effectiveDepthMm: 20,
        depthVisible: false,
        depthDriven: false,
        localStartDepthMm: 5,
        effectiveStartDepthMm: 5,
        startDepthVisible: true,
        startDepthDriven: false,
        localEndDepthMm: 7,
        effectiveEndDepthMm: 7,
        endDepthVisible: true,
        endDepthDriven: false,
        taperVisible: false,
        hasProfile: false,
      },
      allInputs: [
        {
          portId: 'ExtrusionProfile',
          label: 'SketchProfiles',
          type: { kind: 'sketchProfiles' },
          optional: true,
          maxConnectionsIn: 1,
        },
        {
          portId: 'Type',
          label: 'Type',
          type: { kind: 'number', unit: 'unitless' },
          optional: true,
          maxConnectionsIn: 1,
        },
        {
          portId: 'Direction',
          label: 'Direction',
          type: { kind: 'number', unit: 'unitless' },
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
        {
          portId: 'StartDepth',
          label: 'Start Depth',
          type: { kind: 'number', unit: 'mm' },
          optional: true,
          maxConnectionsIn: 1,
        },
        {
          portId: 'EndDepth',
          label: 'End Depth',
          type: { kind: 'number', unit: 'mm' },
          optional: true,
          maxConnectionsIn: 1,
        },
      ],
      allOutputs: [
        {
          portId: 'SolidBody',
          label: 'SolidBody',
          type: { kind: 'solidBodies' },
        },
      ],
      nodeMode: 'expanded',
    })

    expect(html.includes('Start Depth')).toBe(true)
    expect(html.includes('End Depth')).toBe(true)
    expect(html.includes('Waiting')).toBe(true)
    expect(html.includes('Taper Angle')).toBe(false)
  })

  it('renders direction-aware waiting copy for Symmetric in the dedicated extrude template', () => {
    const html = renderExtrudeNode({
      node: {
        nodeId: 'node-extrude-1',
        type: 'Geometry/Extrude',
        params: {
          extrudeType: 'Body',
          extrudeDirection: 'Symmetric',
          depthMm: 20,
        },
      },
      extrudeVm: {
        extrudeType: 'Body',
        extrudeDirection: 'Symmetric',
        localExtrudeDirection: 'Symmetric',
        directionDriven: false,
        localDepthMm: 20,
        effectiveDepthMm: 20,
        depthVisible: true,
        depthDriven: false,
        localStartDepthMm: 20,
        effectiveStartDepthMm: 20,
        startDepthVisible: false,
        startDepthDriven: false,
        localEndDepthMm: 20,
        effectiveEndDepthMm: 20,
        endDepthVisible: false,
        endDepthDriven: false,
        taperVisible: false,
        hasProfile: false,
      },
      allInputs: [
        {
          portId: 'ExtrusionProfile',
          label: 'SketchProfiles',
          type: { kind: 'sketchProfiles' },
          optional: true,
          maxConnectionsIn: 1,
        },
        {
          portId: 'Type',
          label: 'Type',
          type: { kind: 'number', unit: 'unitless' },
          optional: true,
          maxConnectionsIn: 1,
        },
        {
          portId: 'Direction',
          label: 'Direction',
          type: { kind: 'number', unit: 'unitless' },
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
          type: { kind: 'solidBodies' },
        },
      ],
      nodeMode: 'expanded',
    })

    expect(html.includes('Depth')).toBe(true)
    expect(html.includes('Waiting')).toBe(true)
    expect(html.includes('Taper Angle')).toBe(false)
  })

  it('renders the dedicated extrude type row as driven while showing the effective enum slot', () => {
    const html = renderExtrudeNode({
      node: {
        nodeId: 'node-extrude-1',
        type: 'Geometry/Extrude',
        params: {
          extrudeType: 'Body',
          extrudeDirection: 'OneSide',
          depthMm: 30,
        },
      },
      extrudeVm: {
        extrudeType: 'Walls',
        localExtrudeType: 'Body',
        typeDriven: true,
        extrudeDirection: 'OneSide',
        localExtrudeDirection: 'OneSide',
        directionDriven: false,
        localDepthMm: 30,
        effectiveDepthMm: 30,
        depthVisible: true,
        depthDriven: false,
        localStartDepthMm: 30,
        effectiveStartDepthMm: 30,
        startDepthVisible: false,
        startDepthDriven: false,
        localEndDepthMm: 30,
        effectiveEndDepthMm: 30,
        endDepthVisible: false,
        endDepthDriven: false,
        taperVisible: false,
        hasProfile: false,
      },
      allInputs: [
        {
          portId: 'ExtrusionProfile',
          label: 'SketchProfiles',
          type: { kind: 'sketchProfiles' },
          optional: true,
          maxConnectionsIn: 1,
        },
        {
          portId: 'Type',
          label: 'Type',
          type: { kind: 'number', unit: 'unitless' },
          optional: true,
          maxConnectionsIn: 1,
        },
        {
          portId: 'Direction',
          label: 'Direction',
          type: { kind: 'number', unit: 'unitless' },
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
          type: { kind: 'solidBodies' },
        },
      ],
    })

    expect(html.includes('data-sp-enum-selected-index="0"')).toBe(true)
    expect(html.includes('data-sp-enum-displayed-index="1"')).toBe(true)
    expect(html.includes('data-sp-enum-option-count="2"')).toBe(true)
    expect(html.includes('Wire drives the effective value. Local fallback stays at Body.')).toBe(
      true,
    )
    expect(html.includes('Walls')).toBe(true)
    expect(html.includes('disabled=""')).toBe(true)
  })

  it('renders the dedicated extrude depth row with driven fallback messaging when wired', () => {
    const html = renderExtrudeNode({
      node: {
        nodeId: 'node-extrude-1',
        type: 'Geometry/Extrude',
        params: {
          extrudeType: 'Body',
          extrudeDirection: 'OneSide',
          depthMm: 20,
        },
      },
      extrudeVm: {
        extrudeType: 'Body',
        extrudeDirection: 'OneSide',
        localDepthMm: 20,
        effectiveDepthMm: 42,
        depthVisible: true,
        depthDriven: true,
        localStartDepthMm: 20,
        effectiveStartDepthMm: 20,
        startDepthVisible: false,
        startDepthDriven: false,
        localEndDepthMm: 20,
        effectiveEndDepthMm: 20,
        endDepthVisible: false,
        endDepthDriven: false,
        taperVisible: true,
        hasProfile: false,
      },
      allInputs: [
        {
          portId: 'ExtrusionProfile',
          label: 'SketchProfiles',
          type: { kind: 'sketchProfiles' },
          optional: true,
          maxConnectionsIn: 1,
        },
        {
          portId: 'Type',
          label: 'Type',
          type: { kind: 'number', unit: 'unitless' },
          optional: true,
          maxConnectionsIn: 1,
        },
        {
          portId: 'Direction',
          label: 'Direction',
          type: { kind: 'number', unit: 'unitless' },
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
          type: { kind: 'solidBodies' },
        },
      ],
    })

    expect(html.includes('ParaSlider')).toBe(false)
    expect(html.includes('SpaghettiPortPrimitiveValueRow')).toBe(true)
    expect(html.includes('disabled=""')).toBe(true)
  })

  it('renders the dedicated extrude taper row with driven fallback messaging when wired', () => {
    const html = renderExtrudeNode({
      node: {
        nodeId: 'node-extrude-1',
        type: 'Geometry/Extrude',
        params: {
          extrudeType: 'Body',
          extrudeDirection: 'OneSide',
          depthMm: 20,
          taperAngleDeg: 3,
        },
      },
      extrudeVm: {
        extrudeType: 'Body',
        extrudeDirection: 'OneSide',
        localDepthMm: 20,
        effectiveDepthMm: 20,
        depthVisible: true,
        depthDriven: false,
        localStartDepthMm: 20,
        effectiveStartDepthMm: 20,
        startDepthVisible: false,
        startDepthDriven: false,
        localEndDepthMm: 20,
        effectiveEndDepthMm: 20,
        endDepthVisible: false,
        endDepthDriven: false,
        localTaperAngleDeg: 3,
        effectiveTaperAngleDeg: 8.5,
        taperVisible: true,
        taperDriven: true,
        hasProfile: false,
      },
      allInputs: [
        {
          portId: 'ExtrusionProfile',
          label: 'SketchProfiles',
          type: { kind: 'sketchProfiles' },
          optional: true,
          maxConnectionsIn: 1,
        },
        {
          portId: 'Type',
          label: 'Type',
          type: { kind: 'number', unit: 'unitless' },
          optional: true,
          maxConnectionsIn: 1,
        },
        {
          portId: 'Direction',
          label: 'Direction',
          type: { kind: 'number', unit: 'unitless' },
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
        {
          portId: 'TaperAngle',
          label: 'Taper Angle',
          type: { kind: 'number', unit: 'deg' },
          optional: true,
          maxConnectionsIn: 1,
        },
      ],
      allOutputs: [
        {
          portId: 'SolidBody',
          label: 'SolidBody',
          type: { kind: 'solidBodies' },
        },
      ],
      nodeMode: 'expanded',
    })

    expect(html.includes('Taper Angle')).toBe(true)
    expect(
      html.includes('Wire drives the effective value. Local fallback stays at 3 deg.'),
    ).toBe(true)
    expect(html.includes('disabled=""')).toBe(true)
    expect(html.includes('deg')).toBe(true)
  })

  it('hides the taper row from the current authored direction even if selector taper visibility is stale', () => {
    const html = renderExtrudeNode({
      node: {
        nodeId: 'node-extrude-1',
        type: 'Geometry/Extrude',
        params: {
          extrudeType: 'Body',
          extrudeDirection: 'Symmetric',
          depthMm: 20,
          taperAngleDeg: 3,
        },
      },
      extrudeVm: {
        extrudeType: 'Body',
        extrudeDirection: 'OneSide',
        localExtrudeDirection: 'OneSide',
        directionDriven: false,
        localDepthMm: 20,
        effectiveDepthMm: 20,
        depthVisible: true,
        depthDriven: false,
        localStartDepthMm: 20,
        effectiveStartDepthMm: 20,
        startDepthVisible: false,
        startDepthDriven: false,
        localEndDepthMm: 20,
        effectiveEndDepthMm: 20,
        endDepthVisible: false,
        endDepthDriven: false,
        localTaperAngleDeg: 3,
        effectiveTaperAngleDeg: 3,
        taperVisible: true,
        taperDriven: false,
        hasProfile: false,
      },
      allInputs: [
        {
          portId: 'ExtrusionProfile',
          label: 'SketchProfiles',
          type: { kind: 'sketchProfiles' },
          optional: true,
          maxConnectionsIn: 1,
        },
        {
          portId: 'Type',
          label: 'Type',
          type: { kind: 'number', unit: 'unitless' },
          optional: true,
          maxConnectionsIn: 1,
        },
        {
          portId: 'Direction',
          label: 'Direction',
          type: { kind: 'number', unit: 'unitless' },
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
        {
          portId: 'TaperAngle',
          label: 'Taper Angle',
          type: { kind: 'number', unit: 'deg' },
          optional: true,
          maxConnectionsIn: 1,
        },
      ],
      allOutputs: [
        {
          portId: 'SolidBody',
          label: 'SolidBody',
          type: { kind: 'solidBodies' },
        },
      ],
      nodeMode: 'expanded',
    })

    expect(html.includes('Taper Angle')).toBe(false)
    expect(html.includes('Depth')).toBe(true)
  })

  it('keeps the dedicated extrude depth row primitive in expanded mode', () => {
    const html = renderExtrudeNode({
      node: {
        nodeId: 'node-extrude-1',
        type: 'Geometry/Extrude',
        params: {
          extrudeType: 'Body',
          extrudeDirection: 'OneSide',
          depthMm: 30,
        },
      },
      nodeMode: 'expanded',
      extrudeVm: {
        extrudeType: 'Body',
        extrudeDirection: 'OneSide',
        localDepthMm: 30,
        effectiveDepthMm: 30,
        depthVisible: true,
        depthDriven: false,
        localStartDepthMm: 30,
        effectiveStartDepthMm: 30,
        startDepthVisible: false,
        startDepthDriven: false,
        localEndDepthMm: 30,
        effectiveEndDepthMm: 30,
        endDepthVisible: false,
        endDepthDriven: false,
        taperVisible: true,
        hasProfile: false,
      },
      allInputs: [
        {
          portId: 'ExtrusionProfile',
          label: 'SketchProfiles',
          type: { kind: 'sketchProfiles' },
          optional: true,
          maxConnectionsIn: 1,
        },
        {
          portId: 'Type',
          label: 'Type',
          type: { kind: 'number', unit: 'unitless' },
          optional: true,
          maxConnectionsIn: 1,
        },
        {
          portId: 'Direction',
          label: 'Direction',
          type: { kind: 'number', unit: 'unitless' },
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
          type: { kind: 'solidBodies' },
        },
      ],
    })

    expect(html.includes('Depth Value')).toBe(false)
    expect(html.includes('SpaghettiPortPrimitiveValueRow')).toBe(true)
    expect(html.includes('data-sp-port-row-open="1"')).toBe(true)
  })

  it('switches to Start Depth and End Depth from the current authored direction even if selector depth visibility is stale', () => {
    const html = renderExtrudeNode({
      node: {
        nodeId: 'node-extrude-1',
        type: 'Geometry/Extrude',
        params: {
          extrudeType: 'Body',
          extrudeDirection: 'TwoSides',
          depthMm: 20,
        },
      },
      extrudeVm: {
        extrudeType: 'Body',
        extrudeDirection: 'OneSide',
        localExtrudeDirection: 'OneSide',
        directionDriven: false,
        localDepthMm: 20,
        effectiveDepthMm: 20,
        depthVisible: true,
        depthDriven: false,
        localStartDepthMm: 20,
        effectiveStartDepthMm: 20,
        startDepthVisible: false,
        startDepthDriven: false,
        localEndDepthMm: 20,
        effectiveEndDepthMm: 20,
        endDepthVisible: false,
        endDepthDriven: false,
        taperVisible: true,
        hasProfile: false,
      },
      allInputs: [
        {
          portId: 'ExtrusionProfile',
          label: 'SketchProfiles',
          type: { kind: 'sketchProfiles' },
          optional: true,
          maxConnectionsIn: 1,
        },
        {
          portId: 'Type',
          label: 'Type',
          type: { kind: 'number', unit: 'unitless' },
          optional: true,
          maxConnectionsIn: 1,
        },
        {
          portId: 'Direction',
          label: 'Direction',
          type: { kind: 'number', unit: 'unitless' },
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
        {
          portId: 'StartDepth',
          label: 'Start Depth',
          type: { kind: 'number', unit: 'mm' },
          optional: true,
          maxConnectionsIn: 1,
        },
        {
          portId: 'EndDepth',
          label: 'End Depth',
          type: { kind: 'number', unit: 'mm' },
          optional: true,
          maxConnectionsIn: 1,
        },
      ],
      allOutputs: [
        {
          portId: 'SolidBody',
          label: 'SolidBody',
          type: { kind: 'solidBodies' },
        },
      ],
    })

    expect(html.includes('>Depth<')).toBe(false)
    expect(html.includes('Start Depth')).toBe(true)
    expect(html.includes('End Depth')).toBe(true)
    expect(html.includes('aria-label="Decrease Start Depth"')).toBe(true)
    expect(html.includes('aria-label="Increase End Depth"')).toBe(true)
  })
})

