import { afterEach, describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import type { PortSpec, SpaghettiNode } from '../schema/spaghettiTypes'
import { getDefaultNodeParams } from '../registry/nodeRegistry'
import type { DriverControlRowVm } from './driverVm'
import { NodeView } from './NodeView'
import type {
  DriverRowWarningVm,
  FeatureDependencyEdge,
  FeatureDependencyRow,
  NodeInputCompositeState,
  OutputPreviewSlotRowVm,
} from '../selectors'
import { useSpaghettiUiStore } from './state/spaghettiUiStore'
import type { RowViewMode } from './rowViewMode'
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

const renderPartNode = (
  node: SpaghettiNode,
  options?: {
    rowViewMode?: RowViewMode
    drivers?: DriverControlRowVm[]
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
  },
): string =>
  renderToStaticMarkup(
    <NodeView
      node={node}
      rowViewMode={options?.rowViewMode ?? 'essentials'}
      x={0}
      y={0}
      title="Baseplate"
      template="part"
      allInputs={[]}
      allOutputs={[]}
      drivers={options?.drivers ?? []}
      inputs={[]}
      outputs={[]}
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
      onMoveSectionRow={() => {
        // no-op in static render test
      }}
      onPrimitiveNumberValueChange={() => {
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
      onNodePointerDown={() => {
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

const outputPreviewPort = (slotId: string): PortSpec => ({
  portId: `in:solid:${slotId}`,
  label: slotId,
  type: { kind: 'toeLoft' },
  optional: true,
  maxConnectionsIn: 1,
})

const renderOutputPreviewNode = (
  outputPreviewRows: OutputPreviewSlotRowVm[],
): string =>
  renderToStaticMarkup(
    <NodeView
      node={{
        nodeId: 'node-output-preview-1',
        type: OUTPUT_PREVIEW_NODE_TYPE,
        params: {
          slots: outputPreviewRows.map((row) => ({ slotId: row.slotId })),
          nextSlotIndex: outputPreviewRows.length + 1,
        },
      }}
      rowViewMode="essentials"
      x={0}
      y={0}
      title="Output Preview"
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
      onPrimitiveNumberValueChange={() => {
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
      onNodePointerDown={() => {
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

describe('NodeView part section order', () => {
  afterEach(() => {
    useSpaghettiUiStore.setState({ collapsed: {} })
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

  it('renders extrude depth virtual input endpoint in full mode', () => {
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
        rowViewMode: 'everything',
      },
    )

    expect(html.includes('data-sp-feature-depth-port-id="fs:in:feature-depth-1:extrude:depth"')).toBe(
      true,
    )
    expect(html.includes('data-sp-feature-taper-port-id="fs:in:feature-depth-1:extrude:taper"')).toBe(
      true,
    )
    expect(html.includes('data-sp-feature-offset-port-id="fs:in:feature-depth-1:extrude:offset"')).toBe(
      true,
    )
  })

  it('renders cube sketch width/length virtual input endpoints in full mode', () => {
    const html = renderPartNode(
      {
        nodeId: 'node-cube-1',
        type: 'Part/Cube',
        params: getDefaultNodeParams('Part/Cube'),
      },
      {
        rowViewMode: 'everything',
      },
    )

    expect(
      html.includes('data-sp-feature-width-port-id="fs:in:cube-sketch-1:sketchRect:width"'),
    ).toBe(true)
    expect(
      html.includes('data-sp-feature-length-port-id="fs:in:cube-sketch-1:sketchRect:length"'),
    ).toBe(true)
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
        rowViewMode: 'everything',
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

    expect(html.includes('Driven by external wire')).toBe(true)
    expect(html.includes('SpaghettiValueBar--disabled')).toBe(true)
    expect(html.includes('value="42"')).toBe(true)
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
        rowViewMode: 'everything',
      },
    )

    expect(html.includes('Disabled · Profile: -, Depth: 10')).toBe(true)
    expect(html.includes('Enable')).toBe(true)
    expect(html.includes('Up')).toBe(true)
    expect(html.includes('Down')).toBe(true)
  })

  it('renders the internal dependency overlay only in everything mode', () => {
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

    const htmlEverything = renderPartNode(
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
        rowViewMode: 'everything',
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
        rowViewMode: 'essentials',
        featureRows,
        featureRowIndexById: {
          'feature:sketch-1': 0,
          'feature:extrude-1': 1,
        },
        internalDependencyEdges,
      },
    )

    expect(htmlEverything.includes('data-sp-internal-dependency-overlay="1"')).toBe(true)
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
        rowViewMode: 'everything',
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
})

