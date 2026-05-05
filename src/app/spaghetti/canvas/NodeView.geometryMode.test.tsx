// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { evaluateSpaghettiGraph } from '../compiler/evaluateGraph'
import { buildExtrudeBodyMemberPortId } from '../features/extrudeBodyVirtualPorts'
import { buildExtrudeProfileEntryPortId } from '../features/extrudeProfileEntryPorts'
import type { SketchFeature } from '../features/featureTypes'
import type { PortSpec, SpaghettiGraph, SpaghettiNode } from '../schema/spaghettiTypes'
import type { ExtrudeNodeVm, SketchNodeVm } from '../selectors'
import { selectDiagnosticsVm } from '../selectors/selectDiagnosticsVm'
import { selectNodeVm } from '../selectors/selectNodeVm'
import { buildSketchProfileMemberPortId } from '../features/sketchProfileVirtualPorts'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

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

let NodeView!: typeof import('./NodeView').NodeView
let useSpaghettiUiStore!: typeof import('./state/spaghettiUiStore').useSpaghettiUiStore
let selectNodeMode!: typeof import('../store/useSpaghettiStore').selectNodeMode
let useSpaghettiStore!: typeof import('../store/useSpaghettiStore').useSpaghettiStore
let useAppStore!: typeof import('../../store/useAppStore').useAppStore
let editHistoryStore!: typeof import('../../store/editHistoryStore').editHistoryStore
const originalWorker = globalThis.Worker

const emptyCompositeState = {
  wholeDrivenByPortId: new Set<string>(),
  leafDrivenByPortIdPathKey: new Set<string>(),
  legacyLeafOverrideOnWhole: new Set<string>(),
  vec2DisplayByPortId: new Map<string, { x: number; y: number }>(),
}

const sketchNode: SpaghettiNode = {
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
}

const sketchVm: SketchNodeVm = {
  localPlane: 'XY',
  effectivePlane: 'XY',
  planeDriven: false,
  profileCount: 0,
  hasSelectedProfile: false,
}

const extrudeNode: SpaghettiNode = {
  nodeId: 'node-extrude-1',
  type: 'Geometry/Extrude',
  params: {
    bodyGenerationMode: 'Combine',
    extrudeType: 'Body',
    extrudeDirection: 'OneSide',
    depthMm: 30,
  },
}

const extrudeVm: ExtrudeNodeVm = {
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
  hasProfile: false,
}

const createSketchFeature = (
  components: SketchFeature['components'] = [],
): SketchFeature => ({
  type: 'sketch',
  featureId: 'sketch-geometry-mode',
  plane: 'XY',
  components,
  outputs: {
    profiles: [],
    diagnostics: [],
  },
  uiState: {
    collapsed: false,
  },
})

const rectangleComponent = (
  rowId: string,
  componentId: string,
  a: { x: number; y: number },
  b: { x: number; y: number },
): SketchFeature['components'][number] => ({
  rowId,
  componentId,
  type: 'rectangle',
  a: { kind: 'lit', x: a.x, y: a.y },
  b: { kind: 'lit', x: b.x, y: b.y },
})

const sketchInputPortDetails = {
  SketchPlane: [
    { text: 'type: plane' },
    { text: 'connections in: 0/1' },
  ],
  SketchEntities: [
    { text: 'type: sketchEntities' },
    { text: 'connections in: 0/1' },
  ],
}

const allInputs: PortSpec[] = [
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
]

const allOutputs: PortSpec[] = [
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
]

const extrudeInputs: PortSpec[] = [
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
]

const fullExtrudeInputs: PortSpec[] = [
  ...extrudeInputs,
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
  {
    portId: 'TaperAngle',
    label: 'Taper Angle',
    type: { kind: 'number', unit: 'deg' },
    optional: true,
    maxConnectionsIn: 1,
  },
]

const extrudeOutputs: PortSpec[] = [
  {
    portId: 'SolidBody',
    label: 'SolidBody',
    type: { kind: 'solidBody' },
  },
]

const compositeNode: SpaghettiNode = {
  nodeId: 'node-composite-1',
  type: 'Part/Baseplate',
  params: {},
}

const compositeInputs: PortSpec[] = [
  {
    portId: 'Center',
    label: 'Center',
    type: { kind: 'vec2', unit: 'mm' },
    optional: true,
    maxConnectionsIn: 1,
  },
]

const compositeOutputs: PortSpec[] = [
  {
    portId: 'Offset',
    label: 'Offset',
    type: { kind: 'vec3', unit: 'mm' },
  },
]

function SketchNodeHarness() {
  const graphNode = useSpaghettiStore((state) => state.graph.nodes[0] ?? null)
  const nodeMode = useSpaghettiStore((state) =>
    graphNode === null ? 'essentials' : selectNodeMode(state, graphNode.nodeId),
  )
  if (graphNode === null) {
    return null
  }
  return (
    <NodeView
      node={graphNode}
      x={0}
      y={0}
      title="Sketch"
      nodeMode={nodeMode}
      template="sketch"
      sketchVm={sketchVm}
      inputPortDetails={sketchInputPortDetails}
      allInputs={allInputs}
      allOutputs={allOutputs}
      inputCompositeState={emptyCompositeState}
      compositeExpansionRevision={0}
      getCompositeExpanded={() => false}
      setCompositeExpanded={() => {
        // no-op for test
      }}
      selected={false}
      getInputDropState={() => null}
      getOutputDropState={() => null}
      onPresetChange={() => {
        // no-op for test
      }}
      onDriverNumberChange={() => {
        // no-op for test
      }}
      onUtilityNumberValueChange={() => {
        // no-op for test
      }}
      onUtilityBooleanValueChange={() => {
        // no-op for test
      }}
      onUtilityVec2AxisChange={() => {
        // no-op for test
      }}
      outputRowMinHeight={40}
      onOutputRowMinHeightChange={() => {
        // no-op for test
      }}
      pinDotSize={8}
      onPinDotSizeChange={() => {
        // no-op for test
      }}
      onNodeHeaderPointerDown={() => {
        // no-op for test
      }}
      onNodeBodyPointerDown={() => {
        // no-op for test
      }}
      onNodeResizeHandlePointerDown={() => {
        // no-op for test
      }}
      onNodeTitleClick={() => {
        // no-op for test
      }}
      onRegisterPortElement={() => {
        // no-op for test
      }}
      onOutputPointerDown={() => {
        // no-op for test
      }}
      onOutputPointerEnter={() => {
        // no-op for test
      }}
      onOutputPointerLeave={() => {
        // no-op for test
      }}
      onInputPointerDown={() => {
        // no-op for test
      }}
      onInputPointerEnter={() => {
        // no-op for test
      }}
      onInputPointerLeave={() => {
        // no-op for test
      }}
    />
  )
}

function ExtrudeNodeHarness(props?: {
  graphNode?: SpaghettiNode
  extrudeVm?: ExtrudeNodeVm
  allInputs?: PortSpec[]
  allOutputs?: PortSpec[]
}) {
  const graphNode = useSpaghettiStore((state) => state.graph.nodes[0] ?? null)
  const renderedNode = props?.graphNode ?? graphNode
  const nodeMode = useSpaghettiStore((state) =>
    renderedNode === null ? 'essentials' : selectNodeMode(state, renderedNode.nodeId),
  )
  if (renderedNode === null) {
    return null
  }
  const effectiveExtrudeType =
    renderedNode.params.extrudeType === 'Walls' ? 'Walls' : 'Body'
  const effectiveBodyGenerationMode =
    renderedNode.params.bodyGenerationMode === 'NewObjects' ? 'NewObjects' : 'Combine'
  const effectiveExtrudeDirection =
    renderedNode.params.extrudeDirection === 'TwoSides'
      ? 'TwoSides'
      : renderedNode.params.extrudeDirection === 'Symmetric'
        ? 'Symmetric'
        : 'OneSide'
  const depthMm =
    typeof renderedNode.params.depthMm === 'number'
      ? renderedNode.params.depthMm
      : (props?.extrudeVm ?? extrudeVm).localDepthMm
  const startDepthMm =
    typeof renderedNode.params.startDepthMm === 'number' ? renderedNode.params.startDepthMm : depthMm
  const endDepthMm =
    typeof renderedNode.params.endDepthMm === 'number' ? renderedNode.params.endDepthMm : depthMm
  const liveExtrudeVm: ExtrudeNodeVm = {
    ...(props?.extrudeVm ?? extrudeVm),
    extrudeType: effectiveExtrudeType,
    bodyGenerationMode: effectiveBodyGenerationMode,
    extrudeDirection: effectiveExtrudeDirection,
    localDepthMm: depthMm,
    effectiveDepthMm: depthMm,
    depthVisible: effectiveExtrudeDirection !== 'TwoSides',
    localStartDepthMm: startDepthMm,
    effectiveStartDepthMm: startDepthMm,
    startDepthVisible: effectiveExtrudeDirection === 'TwoSides',
    localEndDepthMm: endDepthMm,
    effectiveEndDepthMm: endDepthMm,
    endDepthVisible: effectiveExtrudeDirection === 'TwoSides',
    taperVisible: effectiveExtrudeType === 'Body' && effectiveExtrudeDirection === 'OneSide',
  }
  return (
    <NodeView
      node={renderedNode}
      x={0}
      y={0}
      title="Extrude"
      nodeMode={nodeMode}
      template="extrude"
      extrudeVm={liveExtrudeVm}
      allInputs={props?.allInputs ?? extrudeInputs}
      allOutputs={
        props?.allOutputs ?? [
          {
            portId: 'SolidBody',
            label: effectiveBodyGenerationMode === 'NewObjects' ? 'SolidBodies' : 'SolidBody',
            type:
              effectiveBodyGenerationMode === 'NewObjects'
                ? { kind: 'solidBodies' }
                : { kind: 'solidBody' },
          },
        ]
      }
      inputCompositeState={emptyCompositeState}
      compositeExpansionRevision={0}
      getCompositeExpanded={() => false}
      setCompositeExpanded={() => {
        // no-op for test
      }}
      selected={false}
      getInputDropState={() => null}
      getOutputDropState={() => null}
      onPresetChange={() => {
        // no-op for test
      }}
      onDriverNumberChange={() => {
        // no-op for test
      }}
      onUtilityNumberValueChange={() => {
        // no-op for test
      }}
      onUtilityBooleanValueChange={() => {
        // no-op for test
      }}
      onUtilityVec2AxisChange={() => {
        // no-op for test
      }}
      outputRowMinHeight={40}
      onOutputRowMinHeightChange={() => {
        // no-op for test
      }}
      pinDotSize={8}
      onPinDotSizeChange={() => {
        // no-op for test
      }}
      onNodeHeaderPointerDown={() => {
        // no-op for test
      }}
      onNodeBodyPointerDown={() => {
        // no-op for test
      }}
      onNodeResizeHandlePointerDown={() => {
        // no-op for test
      }}
      onNodeTitleClick={() => {
        // no-op for test
      }}
      onRegisterPortElement={() => {
        // no-op for test
      }}
      onOutputPointerDown={() => {
        // no-op for test
      }}
      onOutputPointerEnter={() => {
        // no-op for test
      }}
      onOutputPointerLeave={() => {
        // no-op for test
      }}
      onInputPointerDown={() => {
        // no-op for test
      }}
      onInputPointerEnter={() => {
        // no-op for test
      }}
      onInputPointerLeave={() => {
        // no-op for test
      }}
    />
  )
}

function CompositeNodeHarness(props?: {
  inputCompositeState?: typeof emptyCompositeState
}) {
  const graphNode = useSpaghettiStore((state) => state.graph.nodes[0] ?? null)
  const nodeMode = useSpaghettiStore((state) =>
    graphNode === null ? 'expanded' : selectNodeMode(state, graphNode.nodeId),
  )
  if (graphNode === null) {
    return null
  }

  return (
    <NodeView
      node={graphNode}
      x={0}
      y={0}
      title="Composite Demo"
      nodeMode={nodeMode}
      allInputs={compositeInputs}
      allOutputs={compositeOutputs}
      inputCompositeState={props?.inputCompositeState ?? emptyCompositeState}
      compositeExpansionRevision={0}
      getCompositeExpanded={() => false}
      setCompositeExpanded={() => {
        // no-op for test
      }}
      selected={false}
      getInputDropState={() => null}
      getOutputDropState={() => null}
      onPresetChange={() => {
        // no-op for test
      }}
      onDriverNumberChange={() => {
        // no-op for test
      }}
      onUtilityNumberValueChange={() => {
        // no-op for test
      }}
      onUtilityBooleanValueChange={() => {
        // no-op for test
      }}
      onUtilityVec2AxisChange={() => {
        // no-op for test
      }}
      outputRowMinHeight={40}
      onOutputRowMinHeightChange={() => {
        // no-op for test
      }}
      pinDotSize={8}
      onPinDotSizeChange={() => {
        // no-op for test
      }}
      onNodeHeaderPointerDown={() => {
        // no-op for test
      }}
      onNodeBodyPointerDown={() => {
        // no-op for test
      }}
      onNodeResizeHandlePointerDown={() => {
        // no-op for test
      }}
      onNodeTitleClick={() => {
        // no-op for test
      }}
      onRegisterPortElement={() => {
        // no-op for test
      }}
      onOutputPointerDown={() => {
        // no-op for test
      }}
      onOutputPointerEnter={() => {
        // no-op for test
      }}
      onOutputPointerLeave={() => {
        // no-op for test
      }}
      onInputPointerDown={() => {
        // no-op for test
      }}
      onInputPointerEnter={() => {
        // no-op for test
      }}
      onInputPointerLeave={() => {
        // no-op for test
      }}
    />
  )
}

const findSketchOutputRow = (root: HTMLElement | null | undefined, label: string): HTMLElement | null => {
  const rows = Array.from(root?.querySelectorAll('.SpaghettiPort--out') ?? [])
  const match = rows.find(
    (row) =>
      row
        .querySelector('.SpaghettiPortName, .SpaghettiPortPrimitiveLabel')
        ?.textContent?.trim() === label,
  )
  return match instanceof HTMLElement ? match : null
}

const findSketchInputRow = (
  root: HTMLElement | null | undefined,
  label: string,
): HTMLElement | null => {
  const rows = Array.from(root?.querySelectorAll('.SpaghettiPort--in') ?? [])
  const match = rows.find(
    (row) =>
      row
        .querySelector('.SpaghettiPortName, .SpaghettiPortPrimitiveLabel')
        ?.textContent?.trim() === label,
  )
  return match instanceof HTMLElement ? match : null
}

const findExtrudeInputRow = (
  root: HTMLElement | null | undefined,
  label: string,
): HTMLElement | null => {
  const rows = Array.from(root?.querySelectorAll('.SpaghettiPort--in') ?? [])
  const match = rows.find(
    (row) =>
      row
        .querySelector('.SpaghettiPortName, .SpaghettiPortPrimitiveLabel')
        ?.textContent?.trim() === label,
  )
  return match instanceof HTMLElement ? match : null
}

const findExtrudeOutputRow = (
  root: HTMLElement | null | undefined,
  label: string,
): HTMLElement | null => {
  const rows = Array.from(root?.querySelectorAll('.SpaghettiPort--out') ?? [])
  const match = rows.find(
    (row) =>
      row
        .querySelector('.SpaghettiPortName, .SpaghettiPortPrimitiveLabel')
        ?.textContent?.trim() === label,
  )
  return match instanceof HTMLElement ? match : null
}

const findPortRow = (
  root: HTMLElement | null | undefined,
  direction: 'in' | 'out',
  label: string,
): HTMLElement | null => {
  const rows = Array.from(root?.querySelectorAll(`.SpaghettiPort--${direction}`) ?? [])
  const match = rows.find(
    (row) =>
      row
        .querySelector('.SpaghettiPortName, .SpaghettiPortPrimitiveLabel')
        ?.textContent?.trim() === label,
  )
  return match instanceof HTMLElement ? match : null
}

const findExtrudeTypeRow = (
  root: HTMLElement | null | undefined,
): HTMLElement | null => {
  const row = root
    ?.querySelector('button.ParaSelectTrackButton[aria-label="Type"]')
    ?.closest('[data-sp-enum-row="1"]')
  return row instanceof HTMLElement ? row : null
}

const findExtrudeDirectionRow = (
  root: HTMLElement | null | undefined,
): HTMLElement | null => {
  const row = root
    ?.querySelector('button.ParaSelectTrackButton[aria-label="Direction"]')
    ?.closest('[data-sp-enum-row="1"]')
  return row instanceof HTMLElement ? row : null
}

const findExtrudeBodyModeRow = (
  root: HTMLElement | null | undefined,
): HTMLElement | null => {
  const row = root
    ?.querySelector('button.ParaSelectTrackButton[aria-label="Output"]')
    ?.closest('[data-sp-extrude-body-mode-row="1"]')
  return row instanceof HTMLElement ? row : null
}

const graphNodeParam = (paramName: string): unknown =>
  useSpaghettiStore.getState().graph.nodes[0]?.params[paramName]

const clickButton = async (button: HTMLButtonElement | null | undefined): Promise<void> => {
  await act(async () => {
    button?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }))
    button?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
  })
}

describe('NodeView geometry mode behavior', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null

  beforeEach(async () => {
    vi.resetModules()
    globalThis.Worker = MockWorker as unknown as typeof Worker
    ;({ NodeView } = await import('./NodeView'))
    ;({ useSpaghettiUiStore } = await import('./state/spaghettiUiStore'))
    ;({ selectNodeMode, useSpaghettiStore } = await import('../store/useSpaghettiStore'))
    ;({ useAppStore } = await import('../../store/useAppStore'))
    ;({ editHistoryStore } = await import('../../store/editHistoryStore'))
    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
    editHistoryStore.clear()
    useSpaghettiUiStore.setState({
      collapsed: {},
      isCollapsed: useSpaghettiUiStore.getState().isCollapsed,
      toggleCollapsed: useSpaghettiUiStore.getState().toggleCollapsed,
      setCollapsed: useSpaghettiUiStore.getState().setCollapsed,
      clearCollapsedForNode: useSpaghettiUiStore.getState().clearCollapsedForNode,
    })
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [sketchNode],
      edges: [],
      ui: {
        nodeModesByNodeId: {
          'node-sketch-1': 'collapsed',
        },
      },
    })
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(async () => {
    if (root !== null) {
      await act(async () => {
        root?.unmount()
      })
    }
    container?.remove()
    root = null
    container = null
    document.body.innerHTML = ''
    globalThis.Worker = originalWorker
  })

  it('keeps collapsed sketch nodes compact and opens only the clicked input row', async () => {
    await act(async () => {
      root?.render(<SketchNodeHarness />)
    })

    const planeRow = findSketchInputRow(container, 'SketchPlane')
    expect(planeRow?.getAttribute('data-sp-port-row-open')).toBe('0')
    expect(container?.querySelector('[data-sp-geometry-block="content"]')).toBeNull()
    expect(selectNodeMode(useSpaghettiStore.getState(), 'node-sketch-1')).toBe('collapsed')

    const planeLabel = planeRow?.querySelector('.SpaghettiPortName')
    expect(planeLabel).not.toBeNull()

    await act(async () => {
      planeLabel?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(selectNodeMode(useSpaghettiStore.getState(), 'node-sketch-1')).toBe('collapsed')
    expect(planeRow?.getAttribute('data-sp-port-row-open')).toBe('1')
    expect(container?.textContent).toContain('Origin Plane')
  })

  it('cycles the extrude SketchProfiles row through collapsed, essentials, and expanded without widening into toolbar work', async () => {
    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [extrudeNode],
        edges: [],
        ui: {
          nodeModesByNodeId: {
            'node-extrude-1': 'collapsed',
          },
        },
      })
      root?.render(<ExtrudeNodeHarness />)
    })

    const inputRow = container?.querySelector('.SpaghettiPort--in')
    const inputLabel = inputRow?.querySelector('.SpaghettiPortName')
    const inputsBlock = container?.querySelector('[data-sp-geometry-block="inputs"]')
    const contentBlock = container?.querySelector('[data-sp-geometry-block="content"]')
    const outputsBlock = container?.querySelector('[data-sp-geometry-block="outputs"]')

    expect(container?.querySelector('.SpaghettiGeometryNodeShell')).not.toBeNull()
    expect(inputsBlock?.getAttribute('data-sp-geometry-block-open')).toBe('1')
    expect(contentBlock).toBeNull()
    expect(outputsBlock?.getAttribute('data-sp-geometry-block-open')).toBe('1')
    expect(inputRow?.getAttribute('data-sp-port-row-open')).toBe('0')
    expect(inputRow?.classList.contains('SpaghettiPortShell--managedCollectionIn')).toBe(true)
    expect(inputRow?.classList.contains('SpaghettiExtrudeProfilePortRow')).toBe(false)
    expect(inputRow?.textContent).toContain('SketchProfiles')
    expect(inputRow?.textContent).toContain('No SketchProfiles contributors yet')

    await act(async () => {
      inputLabel?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(inputRow?.getAttribute('data-sp-port-row-open')).toBe('1')
    expect(inputRow?.textContent).not.toContain('Profile Target')
    expect(inputRow?.textContent).toContain('No SketchProfiles contributors yet')

    await act(async () => {
      inputLabel?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(inputRow?.getAttribute('data-sp-port-row-open')).toBe('1')
    expect(inputRow?.textContent).toContain('No SketchProfiles contributors yet')

    await act(async () => {
      inputLabel?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(inputRow?.getAttribute('data-sp-port-row-open')).toBe('0')
    expect(inputRow?.textContent).toContain('No SketchProfiles contributors yet')
  })

  it('reveals one child row per actual extrude profile connection entry in essentials and expanded modes', async () => {
    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [extrudeNode],
        edges: [],
        ui: {
          nodeModesByNodeId: {
            'node-extrude-1': 'collapsed',
          },
        },
      })
      root?.render(
        <NodeView
          node={extrudeNode}
          x={0}
          y={0}
          title="Extrude"
          nodeMode="collapsed"
          template="extrude"
          extrudeVm={{
            ...extrudeVm,
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
          }}
          allInputs={extrudeInputs}
          allOutputs={extrudeOutputs}
          inputCompositeState={emptyCompositeState}
          compositeExpansionRevision={0}
          getCompositeExpanded={() => false}
          setCompositeExpanded={() => {
            // no-op for test
          }}
          selected={false}
          getInputDropState={() => null}
          getOutputDropState={() => null}
          onPresetChange={() => {
            // no-op for test
          }}
          onDriverNumberChange={() => {
            // no-op for test
          }}
          onUtilityNumberValueChange={() => {
            // no-op for test
          }}
          onUtilityBooleanValueChange={() => {
            // no-op for test
          }}
          onUtilityVec2AxisChange={() => {
            // no-op for test
          }}
          outputRowMinHeight={40}
          onOutputRowMinHeightChange={() => {
            // no-op for test
          }}
          pinDotSize={8}
          onPinDotSizeChange={() => {
            // no-op for test
          }}
          onNodeHeaderPointerDown={() => {
            // no-op for test
          }}
          onNodeBodyPointerDown={() => {
            // no-op for test
          }}
          onNodeResizeHandlePointerDown={() => {
            // no-op for test
          }}
          onNodeTitleClick={() => {
            // no-op for test
          }}
          onRegisterPortElement={() => {
            // no-op for test
          }}
          onOutputPointerDown={() => {
            // no-op for test
          }}
          onOutputPointerEnter={() => {
            // no-op for test
          }}
          onOutputPointerLeave={() => {
            // no-op for test
          }}
          onInputPointerDown={() => {
            // no-op for test
          }}
          onInputPointerEnter={() => {
            // no-op for test
          }}
          onInputPointerLeave={() => {
            // no-op for test
          }}
        />,
      )
    })

    const inputRow = container?.querySelector('.SpaghettiPort--in')
    const inputLabel = inputRow?.querySelector('.SpaghettiPortName')

    expect(container?.querySelectorAll('[data-sp-extrude-profile-entry-row]').length).toBe(0)

    await act(async () => {
      inputLabel?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(inputRow?.getAttribute('data-sp-port-row-open')).toBe('1')
    expect(container?.querySelectorAll('[data-sp-extrude-profile-entry-row]').length).toBe(2)
    expect(container?.textContent).toContain('aggregate SketchProfiles contributor')
    expect(container?.textContent).toContain('singular SketchProfile contributor')

    await act(async () => {
      inputLabel?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(inputRow?.getAttribute('data-sp-port-row-open')).toBe('1')
    expect(container?.querySelectorAll('[data-sp-extrude-profile-entry-row]').length).toBe(2)
    expect(container?.textContent).toContain('Resolved collection state')
  })

  it('keeps the extrude Depth row as a one-line primitive slider across node modes', async () => {
    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [extrudeNode],
        edges: [],
        ui: {
          nodeModesByNodeId: {
            'node-extrude-1': 'collapsed',
          },
        },
      })
      root?.render(<ExtrudeNodeHarness />)
    })

    const depthRow = findExtrudeInputRow(container, 'Depth')
    const increaseButton = depthRow?.querySelector(
      '[aria-label="Increase Depth"]',
    ) as HTMLButtonElement | null
    const depthInput = depthRow?.querySelector(
      '.SpaghettiPortPrimitiveValueInput',
    ) as HTMLInputElement | null

    expect(depthRow?.getAttribute('data-sp-port-row-open')).toBe('1')
    expect(depthRow?.querySelector('.SpaghettiPortPrimitiveLabel')?.textContent).toBe('Depth')
    expect(depthInput?.value).toBe('30.0')
    expect(depthRow?.querySelector('.SpaghettiPortPrimitiveValueRow')).not.toBeNull()
    expect(depthRow?.querySelector('.SpaghettiPortPrimitiveLane')).not.toBeNull()
    expect(depthRow?.querySelector('.SpaghettiPortPrimitiveValueWrap')).not.toBeNull()
    expect(depthRow?.querySelectorAll('.SpaghettiPortPrimitiveDivider').length).toBe(2)
    expect(depthRow?.querySelector('.SpaghettiPortChevron--leading')).toBeNull()
    expect(depthRow?.textContent).not.toContain('Depth Value')

    await act(async () => {
      increaseButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const updatedDepthRow = findExtrudeInputRow(container, 'Depth')
    const updatedDepthInput = updatedDepthRow?.querySelector(
      '.SpaghettiPortPrimitiveValueInput',
    ) as HTMLInputElement | null
    expect(updatedDepthInput?.value).toBe('30.1')
  })

  it('drives both UI interaction and browser build interaction during canvas extrude numeric edits', async () => {
    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [extrudeNode],
        edges: [],
        ui: {
          nodeModesByNodeId: {
            'node-extrude-1': 'collapsed',
          },
        },
      })
      root?.render(<ExtrudeNodeHarness />)
    })

    const graphDocumentId = useSpaghettiStore.getState().activeGraphDocumentId
    const depthRow = findExtrudeInputRow(container, 'Depth')
    const depthInput = depthRow?.querySelector(
      '.SpaghettiPortPrimitiveValueInput',
    ) as HTMLInputElement | null

    expect(depthInput).not.toBeNull()
    expect(graphDocumentId.length).toBeGreaterThan(0)
    expect(useAppStore.getState().isInteracting).toBe(false)
    expect(useAppStore.getState().browserInteractionGraphDocumentIds[graphDocumentId]).toBeUndefined()

    await act(async () => {
      depthInput?.focus()
    })

    expect(useAppStore.getState().isInteracting).toBe(true)
    expect(useAppStore.getState().browserInteractionGraphDocumentIds[graphDocumentId]).toBe(true)

    await act(async () => {
      depthInput?.blur()
    })

    expect(useAppStore.getState().isInteracting).toBe(false)
    expect(useAppStore.getState().browserInteractionGraphDocumentIds[graphDocumentId]).toBeUndefined()
  })

  it('clears both canvas interaction channels when a primitive drag releases', async () => {
    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [extrudeNode],
        edges: [],
        ui: {
          nodeModesByNodeId: {
            'node-extrude-1': 'collapsed',
          },
        },
      })
      root?.render(<ExtrudeNodeHarness />)
    })

    const graphDocumentId = useSpaghettiStore.getState().activeGraphDocumentId
    const depthRow = findExtrudeInputRow(container, 'Depth')
    const dragLane = depthRow?.querySelector('.SpaghettiPortPrimitiveLane') as HTMLDivElement | null

    expect(dragLane).not.toBeNull()
    expect(graphDocumentId.length).toBeGreaterThan(0)
    expect(useAppStore.getState().isInteracting).toBe(false)
    expect(useAppStore.getState().browserInteractionGraphDocumentIds[graphDocumentId]).toBeUndefined()

    if (dragLane !== null) {
      dragLane.getBoundingClientRect = () =>
        ({
          left: 0,
          right: 100,
          top: 0,
          bottom: 18,
          width: 100,
          height: 18,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        }) as DOMRect
    }

    await act(async () => {
      dragLane?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 25,
        }),
      )
    })

    expect(useAppStore.getState().isInteracting).toBe(true)
    expect(useAppStore.getState().browserInteractionGraphDocumentIds[graphDocumentId]).toBe(true)

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 75,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 75,
        }),
      )
    })

    expect(useAppStore.getState().isInteracting).toBe(false)
    expect(useAppStore.getState().browserInteractionGraphDocumentIds[graphDocumentId]).toBeUndefined()
  })

  it('updates the extrude Depth row from the center primitive drag lane', async () => {
    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [extrudeNode],
        edges: [],
        ui: {
          nodeModesByNodeId: {
            'node-extrude-1': 'collapsed',
          },
        },
      })
      root?.render(<ExtrudeNodeHarness />)
    })

    const depthRow = findExtrudeInputRow(container, 'Depth')
    const dragLane = depthRow?.querySelector('.SpaghettiPortPrimitiveLane') as HTMLDivElement | null
    const initialFill = depthRow?.querySelector('.SpaghettiPortPrimitiveFill') as HTMLDivElement | null
    const initialMarker = depthRow?.querySelector(
      '.SpaghettiPortPrimitiveValueMarker',
    ) as HTMLDivElement | null
    expect(dragLane).not.toBeNull()
    expect(initialFill?.style.width).toBe('29.93%')
    expect(initialMarker?.style.left).toBe('29.93%')

    if (dragLane !== null) {
      dragLane.getBoundingClientRect = () =>
        ({
          left: 0,
          right: 100,
          top: 0,
          bottom: 18,
          width: 100,
          height: 18,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        }) as DOMRect
    }

    await act(async () => {
      dragLane?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 75,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 75,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 75,
        }),
      )
    })

    const updatedDepthRow = findExtrudeInputRow(container, 'Depth')
    const updatedFill = updatedDepthRow?.querySelector(
      '.SpaghettiPortPrimitiveFill',
    ) as HTMLDivElement | null
    const updatedMarker = updatedDepthRow?.querySelector(
      '.SpaghettiPortPrimitiveValueMarker',
    ) as HTMLDivElement | null
    const updatedDepthInput = updatedDepthRow?.querySelector(
      '.SpaghettiPortPrimitiveValueInput',
    ) as HTMLInputElement | null
    expect(updatedDepthInput?.value).toBe('75.0')
    expect(updatedFill?.style.width).toBe('74.975%')
    expect(updatedMarker?.style.left).toBe('74.975%')
  })

  it('updates the shared extrude Type enum row from the visible ParaSelect controls', async () => {
    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [extrudeNode],
        edges: [],
        ui: {
          nodeModesByNodeId: {
            'node-extrude-1': 'collapsed',
          },
        },
      })
      root?.render(<ExtrudeNodeHarness />)
    })

    expect(container?.querySelector('[data-sp-geometry-block="content"]')).toBeNull()

    const typeRow = findExtrudeTypeRow(container)
    const nextButton = typeRow?.querySelector(
      '[aria-label="Next Type"]',
    ) as HTMLButtonElement | null
    const initialFill = typeRow?.querySelector('.ParaSelectFill') as HTMLDivElement | null
    const initialMarker = typeRow?.querySelector(
      '.ParaSelectValueHandle',
    ) as HTMLButtonElement | null
    const initialValue = typeRow?.querySelector('.ParaSelectValue') as HTMLSpanElement | null
    const trackButton = typeRow?.querySelector(
      'button.ParaSelectTrackButton[aria-label="Type"]',
    ) as HTMLButtonElement | null

    expect(typeRow).not.toBeNull()
    expect(typeRow?.querySelector('.ParaSelectNative')).not.toBeNull()
    expect(trackButton).not.toBeNull()
    expect(initialValue?.textContent).toContain('Body')
    expect(initialFill?.style.width).toBe('0%')
    expect(initialMarker?.style.left).toBe('0%')

    await act(async () => {
      nextButton?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }))
      nextButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    let updatedNode = useSpaghettiStore.getState().graph.nodes[0]
    let updatedTypeRow = findExtrudeTypeRow(container)
    let updatedFill = updatedTypeRow?.querySelector(
      '.ParaSelectFill',
    ) as HTMLDivElement | null
    let updatedMarker = updatedTypeRow?.querySelector(
      '.ParaSelectValueHandle',
    ) as HTMLButtonElement | null
    let updatedValue = updatedTypeRow?.querySelector('.ParaSelectValue') as HTMLSpanElement | null

    expect(updatedNode?.params.extrudeType).toBe('Walls')
    expect(updatedValue?.textContent).toContain('Walls')
    expect(updatedFill?.style.width).toBe('100%')
    expect(updatedMarker?.style.left).toBe('100%')

    const previousButtonAfterNext = updatedTypeRow?.querySelector(
      '[aria-label="Previous Type"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      previousButtonAfterNext?.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, cancelable: true }),
      )
      previousButtonAfterNext?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
    })

    updatedNode = useSpaghettiStore.getState().graph.nodes[0]
    updatedTypeRow = findExtrudeTypeRow(container)
    updatedFill = updatedTypeRow?.querySelector('.ParaSelectFill') as HTMLDivElement | null
    updatedMarker = updatedTypeRow?.querySelector(
      '.ParaSelectValueHandle',
    ) as HTMLButtonElement | null
    updatedValue = updatedTypeRow?.querySelector('.ParaSelectValue') as HTMLSpanElement | null

    expect(updatedNode?.params.extrudeType).toBe('Body')
    expect(updatedValue?.textContent).toContain('Body')
    expect(updatedFill?.style.width).toBe('0%')
    expect(updatedMarker?.style.left).toBe('0%')
  })

  it('updates the shared extrude Direction enum row from the visible ParaSelect controls', async () => {
    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [extrudeNode],
        edges: [],
        ui: {
          nodeModesByNodeId: {
            'node-extrude-1': 'collapsed',
          },
        },
      })
      root?.render(<ExtrudeNodeHarness />)
    })

    const directionRow = findExtrudeDirectionRow(container)
    const nextButton = directionRow?.querySelector(
      '[aria-label="Next Direction"]',
    ) as HTMLButtonElement | null
    const initialFill = directionRow?.querySelector('.ParaSelectFill') as HTMLDivElement | null
    const initialMarker = directionRow?.querySelector(
      '.ParaSelectValueHandle',
    ) as HTMLButtonElement | null
    const initialValue = directionRow?.querySelector('.ParaSelectValue') as HTMLSpanElement | null

    expect(directionRow).not.toBeNull()
    expect(initialValue?.textContent).toContain('One Side')
    expect(initialFill?.style.width).toBe('0%')
    expect(initialMarker?.style.left).toBe('0%')

    await act(async () => {
      nextButton?.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, cancelable: true }),
      )
      nextButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    let updatedNode = useSpaghettiStore.getState().graph.nodes[0]
    let updatedDirectionRow = findExtrudeDirectionRow(container)
    let updatedFill = updatedDirectionRow?.querySelector(
      '.ParaSelectFill',
    ) as HTMLDivElement | null
    let updatedMarker = updatedDirectionRow?.querySelector(
      '.ParaSelectValueHandle',
    ) as HTMLButtonElement | null
    let updatedValue = updatedDirectionRow?.querySelector(
      '.ParaSelectValue',
    ) as HTMLSpanElement | null

    expect(updatedNode?.params.extrudeDirection).toBe('TwoSides')
    expect(updatedValue?.textContent).toContain('Two Sides')
    expect(updatedFill?.style.width).toBe('50%')
    expect(updatedMarker?.style.left).toBe('50%')

    const nextButtonAfterTwoSides = updatedDirectionRow?.querySelector(
      '[aria-label="Next Direction"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      nextButtonAfterTwoSides?.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, cancelable: true }),
      )
      nextButtonAfterTwoSides?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
    })

    updatedNode = useSpaghettiStore.getState().graph.nodes[0]
    updatedDirectionRow = findExtrudeDirectionRow(container)
    updatedFill = updatedDirectionRow?.querySelector('.ParaSelectFill') as HTMLDivElement | null
    updatedMarker = updatedDirectionRow?.querySelector(
      '.ParaSelectValueHandle',
    ) as HTMLButtonElement | null
    updatedValue = updatedDirectionRow?.querySelector('.ParaSelectValue') as HTMLSpanElement | null

    expect(updatedNode?.params.extrudeDirection).toBe('Symmetric')
    expect(updatedValue?.textContent).toContain('Symmetric')
    expect(updatedFill?.style.width).toBe('100%')
    expect(updatedMarker?.style.left).toBe('100%')
  })

  it('updates the extrude Output para-select and switches the parent output row label', async () => {
    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [extrudeNode],
        edges: [],
        ui: {
          nodeModesByNodeId: {
            'node-extrude-1': 'collapsed',
          },
        },
      })
      root?.render(<ExtrudeNodeHarness />)
    })

    const bodyModeRow = findExtrudeBodyModeRow(container)
    const nextButton = bodyModeRow?.querySelector(
      '[aria-label="Next Output"]',
    ) as HTMLButtonElement | null

    expect(bodyModeRow).not.toBeNull()
    expect(bodyModeRow?.textContent).toContain('Combine')
    expect(findExtrudeOutputRow(container, 'SolidBody')).not.toBeNull()
    expect(findExtrudeOutputRow(container, 'SolidBodies')).toBeNull()

    await act(async () => {
      nextButton?.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, cancelable: true }),
      )
      nextButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().graph.nodes[0]?.params.bodyGenerationMode).toBe(
      'NewObjects',
    )
    expect(findExtrudeBodyModeRow(container)?.textContent).toContain('New Objects')
    expect(findExtrudeOutputRow(container, 'SolidBody')).toBeNull()
    expect(findExtrudeOutputRow(container, 'SolidBodies')).not.toBeNull()
  })

  it('commits extrude Type, Direction, and Output row changes through graph edit history', async () => {
    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [extrudeNode],
        edges: [],
        ui: {
          nodeModesByNodeId: {
            'node-extrude-1': 'collapsed',
          },
        },
      })
      editHistoryStore.clear()
      root?.render(<ExtrudeNodeHarness allInputs={fullExtrudeInputs} />)
    })

    await clickButton(
      findExtrudeTypeRow(container)?.querySelector(
        '[aria-label="Next Type"]',
      ) as HTMLButtonElement | null,
    )

    expect(graphNodeParam('extrudeType')).toBe('Walls')
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Change graph parameter',
      targetId: 'node-extrude-1:extrude:extrudeType',
      targetLabel: 'Extrude type',
    })

    await act(async () => {
      editHistoryStore.undo()
    })
    expect(graphNodeParam('extrudeType')).toBe('Body')

    await act(async () => {
      editHistoryStore.redo()
    })
    expect(graphNodeParam('extrudeType')).toBe('Walls')

    await clickButton(
      findExtrudeDirectionRow(container)?.querySelector(
        '[aria-label="Next Direction"]',
      ) as HTMLButtonElement | null,
    )

    expect(graphNodeParam('extrudeDirection')).toBe('TwoSides')
    expect(editHistoryStore.getUndoEntries()).toHaveLength(2)
    expect(editHistoryStore.getUndoEntries()[1]).toMatchObject({
      label: 'Change graph parameter',
      targetId: 'node-extrude-1:extrude:extrudeDirection',
      targetLabel: 'Extrude direction',
    })

    await act(async () => {
      editHistoryStore.undo()
    })
    expect(graphNodeParam('extrudeDirection')).toBe('OneSide')

    await act(async () => {
      editHistoryStore.redo()
    })
    expect(graphNodeParam('extrudeDirection')).toBe('TwoSides')

    await clickButton(
      findExtrudeBodyModeRow(container)?.querySelector(
        '[aria-label="Next Output"]',
      ) as HTMLButtonElement | null,
    )

    expect(graphNodeParam('bodyGenerationMode')).toBe('NewObjects')
    expect(editHistoryStore.getUndoEntries()).toHaveLength(3)
    expect(editHistoryStore.getUndoEntries()[2]).toMatchObject({
      label: 'Change graph parameter',
      targetId: 'node-extrude-1:extrude:bodyGenerationMode',
      targetLabel: 'Extrude output',
    })

    await act(async () => {
      editHistoryStore.undo()
    })
    expect(graphNodeParam('bodyGenerationMode')).toBe('Combine')

    await act(async () => {
      editHistoryStore.redo()
    })
    expect(graphNodeParam('bodyGenerationMode')).toBe('NewObjects')
  })

  it('commits extrude Depth and Taper Angle numeric rows once per semantic edit', async () => {
    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [extrudeNode],
        edges: [],
        ui: {
          nodeModesByNodeId: {
            'node-extrude-1': 'collapsed',
          },
        },
      })
      editHistoryStore.clear()
      root?.render(<ExtrudeNodeHarness allInputs={fullExtrudeInputs} />)
    })

    const depthRow = findExtrudeInputRow(container, 'Depth')
    const dragLane = depthRow?.querySelector('.SpaghettiPortPrimitiveLane') as HTMLDivElement | null
    expect(dragLane).not.toBeNull()

    if (dragLane !== null) {
      dragLane.getBoundingClientRect = () =>
        ({
          left: 0,
          right: 100,
          top: 0,
          bottom: 18,
          width: 100,
          height: 18,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        }) as DOMRect
    }

    await act(async () => {
      dragLane?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 25,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 75,
        }),
      )
    })

    expect(graphNodeParam('depthMm')).toBe(75)
    expect(editHistoryStore.getUndoEntries()).toEqual([])

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 75,
        }),
      )
    })

    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Change graph parameter',
      targetId: 'node-extrude-1:extrude:depthMm',
      targetLabel: 'Extrude depth',
    })

    await act(async () => {
      editHistoryStore.undo()
    })
    expect(graphNodeParam('depthMm')).toBe(30)

    await act(async () => {
      editHistoryStore.redo()
    })
    expect(graphNodeParam('depthMm')).toBe(75)

    await clickButton(
      findExtrudeInputRow(container, 'Taper Angle')?.querySelector(
        '[aria-label="Increase Taper Angle"]',
      ) as HTMLButtonElement | null,
    )

    expect(graphNodeParam('taperAngleDeg')).toBe(0.1)
    expect(editHistoryStore.getUndoEntries()).toHaveLength(2)
    expect(editHistoryStore.getUndoEntries()[1]).toMatchObject({
      label: 'Change graph parameter',
      targetId: 'node-extrude-1:extrude:taperAngleDeg',
      targetLabel: 'Extrude taper angle',
    })

    await act(async () => {
      editHistoryStore.undo()
    })
    expect(graphNodeParam('taperAngleDeg')).toBeUndefined()

    await act(async () => {
      editHistoryStore.redo()
    })
    expect(graphNodeParam('taperAngleDeg')).toBe(0.1)
  })

  it('commits extrude two-sided Start Depth and End Depth rows through graph edit history', async () => {
    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            ...extrudeNode,
            params: {
              ...extrudeNode.params,
              extrudeDirection: 'TwoSides',
              startDepthMm: 20,
              endDepthMm: 40,
            },
          },
        ],
        edges: [],
        ui: {
          nodeModesByNodeId: {
            'node-extrude-1': 'collapsed',
          },
        },
      })
      editHistoryStore.clear()
      root?.render(<ExtrudeNodeHarness allInputs={fullExtrudeInputs} />)
    })

    expect(findExtrudeInputRow(container, 'Depth')).toBeNull()
    expect(findExtrudeInputRow(container, 'Start Depth')).not.toBeNull()
    expect(findExtrudeInputRow(container, 'End Depth')).not.toBeNull()

    await clickButton(
      findExtrudeInputRow(container, 'Start Depth')?.querySelector(
        '[aria-label="Increase Start Depth"]',
      ) as HTMLButtonElement | null,
    )

    expect(graphNodeParam('startDepthMm')).toBe(20.1)
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Change graph parameter',
      targetId: 'node-extrude-1:extrude:startDepthMm',
      targetLabel: 'Extrude start depth',
    })

    await clickButton(
      findExtrudeInputRow(container, 'End Depth')?.querySelector(
        '[aria-label="Increase End Depth"]',
      ) as HTMLButtonElement | null,
    )

    expect(graphNodeParam('endDepthMm')).toBe(40.1)
    expect(editHistoryStore.getUndoEntries()).toHaveLength(2)
    expect(editHistoryStore.getUndoEntries()[1]).toMatchObject({
      label: 'Change graph parameter',
      targetId: 'node-extrude-1:extrude:endDepthMm',
      targetLabel: 'Extrude end depth',
    })

    await act(async () => {
      editHistoryStore.undo()
    })
    expect(graphNodeParam('endDepthMm')).toBe(40)

    await act(async () => {
      editHistoryStore.undo()
    })
    expect(graphNodeParam('startDepthMm')).toBe(20)

    await act(async () => {
      editHistoryStore.redo()
      editHistoryStore.redo()
    })
    expect(graphNodeParam('startDepthMm')).toBe(20.1)
    expect(graphNodeParam('endDepthMm')).toBe(40.1)
  })

  it('does not commit local Extrude row history for driven Type or Depth controls', async () => {
    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [extrudeNode],
        edges: [],
        ui: {
          nodeModesByNodeId: {
            'node-extrude-1': 'collapsed',
          },
        },
      })
      editHistoryStore.clear()
      root?.render(
        <ExtrudeNodeHarness
          allInputs={fullExtrudeInputs}
          extrudeVm={{
            ...extrudeVm,
            typeDriven: true,
            depthDriven: true,
          }}
        />,
      )
    })

    const nextTypeButton = findExtrudeTypeRow(container)?.querySelector(
      '[aria-label="Next Type"]',
    ) as HTMLButtonElement | null
    const depthLane = findExtrudeInputRow(container, 'Depth')?.querySelector(
      '.SpaghettiPortPrimitiveLane',
    ) as HTMLDivElement | null

    expect(nextTypeButton?.disabled).toBe(true)
    expect(findExtrudeInputRow(container, 'Depth')?.textContent).toContain(
      'Wire drives the effective value',
    )

    await clickButton(nextTypeButton)

    if (depthLane !== null) {
      depthLane.getBoundingClientRect = () =>
        ({
          left: 0,
          right: 100,
          top: 0,
          bottom: 18,
          width: 100,
          height: 18,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        }) as DOMRect
    }

    await act(async () => {
      depthLane?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 75,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 75,
        }),
      )
    })

    expect(graphNodeParam('extrudeType')).toBe('Body')
    expect(graphNodeParam('depthMm')).toBe(30)
    expect(editHistoryStore.getUndoEntries()).toEqual([])
  })

  it('reveals child SolidBody output rows in New Objects mode when member outputs exist', async () => {
    const memberA = buildExtrudeBodyMemberPortId(0)
    const memberB = buildExtrudeBodyMemberPortId(1)

    await act(async () => {
      root?.render(
        <ExtrudeNodeHarness
          graphNode={{
            ...extrudeNode,
            params: {
              ...extrudeNode.params,
              bodyGenerationMode: 'NewObjects',
            },
          }}
          extrudeVm={{
            ...extrudeVm,
            bodyGenerationMode: 'NewObjects',
            hasProfile: true,
            bodyId: 'node-extrude-1:body:001',
            bodyCount: 2,
            bodyMemberPortIds: [memberA, memberB],
          }}
          allOutputs={[
            {
              portId: 'SolidBody',
              label: 'SolidBodies',
              type: { kind: 'solidBodies' },
            },
            {
              portId: memberA,
              label: 'SolidBody',
              type: { kind: 'solidBody' },
            },
            {
              portId: memberB,
              label: 'SolidBody',
              type: { kind: 'solidBody' },
            },
          ]}
        />,
      )
    })

    const bodyRow = findExtrudeOutputRow(container, 'SolidBodies')
    const chevron = bodyRow?.querySelector('.SpaghettiPortChevron--leading')

    await act(async () => {
      chevron?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      chevron?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container?.querySelectorAll('[data-sp-extrude-body-child-row]').length).toBe(2)
  })

  it('renders resolved aggregate SketchProfiles copy and four SolidBody child rows for a four-profile extrude', async () => {
    const members = [
      buildExtrudeBodyMemberPortId(0),
      buildExtrudeBodyMemberPortId(1),
      buildExtrudeBodyMemberPortId(2),
      buildExtrudeBodyMemberPortId(3),
    ]

    await act(async () => {
      root?.render(
        <ExtrudeNodeHarness
          graphNode={{
            ...extrudeNode,
            params: {
              ...extrudeNode.params,
              bodyGenerationMode: 'NewObjects',
              depthMm: 25,
            },
          }}
          extrudeVm={{
            ...extrudeVm,
            bodyGenerationMode: 'NewObjects',
            hasProfile: true,
            profileTargetMode: 'allFromSketch',
            profileCount: 4,
            bodyCount: 4,
            bodyMemberPortIds: members,
            profileInputEntries: [
              {
                entryId: 'edge-sketch-profiles',
                endpointPortId: buildExtrudeProfileEntryPortId('edge-sketch-profiles'),
                kind: 'aggregate',
                label: 'SketchProfiles',
                sourceNodeId: 'node-sketch-1',
                sourceNodeLabel: 'Sketch',
              },
            ],
            resolvedProfileMembers: [
              { profileId: 'prof_16dpmc3', area: 100 },
              { profileId: 'prof_ai8hai', area: 100 },
              { profileId: 'prof_1eap4xv', area: 100 },
              { profileId: 'prof_1o1ryio', area: 100 },
            ],
          }}
          allOutputs={[
            {
              portId: 'SolidBody',
              label: 'SolidBodies',
              type: { kind: 'solidBodies' },
            },
            ...members.map((portId) => ({
              portId,
              label: 'SolidBody',
              type: { kind: 'solidBody' as const },
            })),
          ]}
        />,
      )
    })

    const inputRow = findExtrudeInputRow(container, 'SketchProfiles')
    const inputChevron = inputRow?.querySelector('.SpaghettiPortChevron--leading')
    const bodyRow = findExtrudeOutputRow(container, 'SolidBodies')
    const bodyChevron = bodyRow?.querySelector('.SpaghettiPortChevron--leading')

    expect(inputRow?.textContent).toContain('Parent collection')
    expect(inputRow?.textContent).toContain('4 closed profiles')
    expect(inputRow?.textContent).not.toContain('Awaiting SketchProfiles contributors')

    await act(async () => {
      inputChevron?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      inputChevron?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(inputRow?.textContent).toContain('Resolved collection state')
    expect(inputRow?.textContent).toContain('aggregate SketchProfiles contributor')
    expect(container?.querySelectorAll('[data-sp-extrude-profile-member-row]').length).toBe(4)
    expect(inputRow?.textContent).toContain('resolved closed profile member')

    await act(async () => {
      bodyChevron?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      bodyChevron?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(bodyRow?.textContent).toContain('Ready')
    expect(container?.querySelectorAll('[data-sp-extrude-body-child-row]').length).toBe(4)
  })

  it('reveals placeholder child SolidBody rows in New Objects mode before body resolution', async () => {
    const memberA = buildExtrudeBodyMemberPortId(0)
    const memberB = buildExtrudeBodyMemberPortId(1)

    await act(async () => {
      root?.render(
        <ExtrudeNodeHarness
          graphNode={{
            ...extrudeNode,
            params: {
              ...extrudeNode.params,
              bodyGenerationMode: 'NewObjects',
            },
          }}
          extrudeVm={{
            ...extrudeVm,
            bodyGenerationMode: 'NewObjects',
            hasProfile: true,
            profileCount: 2,
            bodyMemberPortIds: [memberA, memberB],
          }}
        />,
      )
    })

    const bodyRow = findExtrudeOutputRow(container, 'SolidBodies')
    const chevron = bodyRow?.querySelector('.SpaghettiPortChevron--leading')

    await act(async () => {
      chevron?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      chevron?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container?.querySelectorAll('[data-sp-extrude-body-child-row]').length).toBe(2)
    expect(container?.textContent).toContain('expected body member target')
    expect(container?.textContent).toContain('waiting for body resolution')
  })

  it('renders the parent SketchProfiles row as resolved for legacy aggregate extrude target ids', async () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature([
              rectangleComponent('row-1', 'rect-a', { x: 0, y: 0 }, { x: 40, y: 20 }),
              rectangleComponent('row-2', 'rect-b', { x: 60, y: 0 }, { x: 100, y: 20 }),
              rectangleComponent('row-3', 'rect-c', { x: 120, y: 0 }, { x: 160, y: 20 }),
              rectangleComponent('row-4', 'rect-d', { x: 180, y: 0 }, { x: 220, y: 20 }),
            ]),
          },
        },
        {
          nodeId: 'node-extrude-1',
          type: 'Geometry/Extrude',
          params: {
            bodyGenerationMode: 'NewObjects',
            extrudeType: 'Body',
            extrudeDirection: 'OneSide',
            depthMm: 25,
          },
        },
      ],
      edges: [
        {
          edgeId: 'edge-sketch-profiles-legacy-target',
          from: { nodeId: 'node-sketch-1', portId: 'SketchProfiles', path: ['member', '0'] },
          to: { nodeId: 'node-extrude-1', portId: 'SketchProfiles', path: ['staleTarget'] },
        },
      ],
      ui: {
        nodeModesByNodeId: {
          'node-extrude-1': 'collapsed',
        },
      },
    }
    const evaluation = evaluateSpaghettiGraph(graph)
    const diagnosticsVm = selectDiagnosticsVm({ graph, evaluation })
    const vm = selectNodeVm(graph, evaluation, diagnosticsVm)
    const resolvedExtrudeVm = vm.byNodeId.get('node-extrude-1')?.extrudeVm

    expect(resolvedExtrudeVm?.profileTargetMode).toBe('allFromSketch')
    expect(resolvedExtrudeVm?.hasProfile).toBe(true)

    await act(async () => {
      useSpaghettiStore.getState().setGraph(graph)
      root?.render(
        <ExtrudeNodeHarness
          graphNode={graph.nodes[1]}
          extrudeVm={resolvedExtrudeVm}
          allOutputs={[
            {
              portId: 'SolidBody',
              label: 'SolidBodies',
              type: { kind: 'solidBodies' },
            },
          ]}
        />,
      )
    })

    const inputRow = findExtrudeInputRow(container, 'SketchProfiles')

    expect(inputRow?.textContent).toContain('Parent collection')
    expect(inputRow?.textContent).toContain('4 closed profiles')
    expect(inputRow?.textContent).not.toContain('Awaiting SketchProfiles contributors')
  })

  it('keeps collapsed geometry node input and output blocks open while rows stay compact', async () => {
    await act(async () => {
      root?.render(<SketchNodeHarness />)
    })

    const inputsBlock = container?.querySelector('[data-sp-geometry-block="inputs"]')
    const sketchBlock = container?.querySelector('[data-sp-geometry-block="content"]')
    const outputsBlock = container?.querySelector('[data-sp-geometry-block="outputs"]')
    expect(inputsBlock?.getAttribute('data-sp-geometry-block-open')).toBe('1')
    expect(sketchBlock).toBeNull()
    expect(outputsBlock?.getAttribute('data-sp-geometry-block-open')).toBe('1')

    const inputsToggle = inputsBlock?.querySelector('.SpaghettiGeometryNodeRailToggle')
    expect(inputsToggle).not.toBeNull()

    await act(async () => {
      inputsToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(selectNodeMode(useSpaghettiStore.getState(), 'node-sketch-1')).toBe('collapsed')
    expect(inputsBlock?.getAttribute('data-sp-geometry-block-open')).toBe('0')
    expect(sketchBlock).toBeNull()
    expect(outputsBlock?.getAttribute('data-sp-geometry-block-open')).toBe('1')
    expect(findSketchInputRow(container, 'SketchPlane')).toBeNull()
    expect(container?.querySelector('[data-sp-geometry-port-row="in:SketchPlane"]')).toBeNull()
  })

  it('uses essentials defaults for sketch managed rows', async () => {
    await act(async () => {
      useSpaghettiStore.getState().setNodeMode('node-sketch-1', 'essentials')
      root?.render(<SketchNodeHarness />)
    })

    expect(findSketchInputRow(container, 'SketchPlane')?.getAttribute('data-sp-port-row-open')).toBe(
      '1',
    )
    expect(findSketchOutputRow(container, 'SketchProfiles')).toBeNull()
    expect(findSketchOutputRow(container, 'SketchProfile')).toBeNull()
  })

  it('uses row-mode defaults for sketch shell blocks', async () => {
    await act(async () => {
      useSpaghettiStore.getState().setNodeMode('node-sketch-1', 'essentials')
      root?.render(<SketchNodeHarness />)
    })

    expect(
      container
        ?.querySelector('[data-sp-geometry-block="inputs"]')
        ?.getAttribute('data-sp-geometry-block-open'),
    ).toBe('1')
    expect(container?.querySelector('[data-sp-geometry-block="content"]')).toBeNull()
    expect(
      container
        ?.querySelector('[data-sp-geometry-block="outputs"]')
        ?.getAttribute('data-sp-geometry-block-open'),
    ).toBe('0')
  })

  it('preserves a manual block close from expanded when switching to essentials', async () => {
    await act(async () => {
      useSpaghettiStore.getState().setNodeMode('node-sketch-1', 'expanded')
      root?.render(<SketchNodeHarness />)
    })

    const outputsBlock = container?.querySelector('[data-sp-geometry-block="outputs"]')
    const outputsToggle = outputsBlock?.querySelector('.SpaghettiGeometryNodeRailToggle')
    expect(outputsBlock?.getAttribute('data-sp-geometry-block-open')).toBe('1')

    await act(async () => {
      outputsToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(outputsBlock?.getAttribute('data-sp-geometry-block-open')).toBe('0')

    await act(async () => {
      useSpaghettiStore.getState().setNodeMode('node-sketch-1', 'essentials')
    })

    expect(
      container
        ?.querySelector('[data-sp-geometry-block="outputs"]')
        ?.getAttribute('data-sp-geometry-block-open'),
    ).toBe('0')
  })

  it('omits the sketch middle block while keeping node mode behavior intact', async () => {
    await act(async () => {
      useSpaghettiStore.getState().setNodeMode('node-sketch-1', 'essentials')
      root?.render(<SketchNodeHarness />)
    })

    expect(container?.querySelector('[data-sp-geometry-block="content"]')).toBeNull()
    expect(selectNodeMode(useSpaghettiStore.getState(), 'node-sketch-1')).toBe('essentials')
  })

  it('preserves a manual sketch input-row close from expanded when switching to essentials', async () => {
    await act(async () => {
      useSpaghettiStore.getState().setNodeMode('node-sketch-1', 'expanded')
      root?.render(<SketchNodeHarness />)
    })

    const planeRow = findSketchInputRow(container, 'SketchPlane')
    const planeChevron = planeRow?.querySelector('.SpaghettiPortChevron--leading')
    expect(planeRow?.getAttribute('data-sp-port-row-open')).toBe('1')

    await act(async () => {
      planeChevron?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(planeRow?.getAttribute('data-sp-port-row-open')).toBe('1')
    expect(planeRow?.querySelector('.SpaghettiPortDetailsBox')).not.toBeNull()

    await act(async () => {
      planeChevron?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(planeRow?.getAttribute('data-sp-port-row-open')).toBe('0')

    await act(async () => {
      useSpaghettiStore.getState().setNodeMode('node-sketch-1', 'essentials')
    })

    expect(findSketchInputRow(container, 'SketchPlane')?.getAttribute('data-sp-port-row-open')).toBe(
      '0',
    )
    expect(selectNodeMode(useSpaghettiStore.getState(), 'node-sketch-1')).toBe('essentials')
  })

  it('keeps collapsed sketch output rows closed by default and opens only the clicked row', async () => {
    await act(async () => {
      root?.render(<SketchNodeHarness />)
    })

    const outputProfilesRow = findSketchOutputRow(container, 'SketchProfiles')

    expect(outputProfilesRow?.getAttribute('data-sp-port-row-open')).toBe('0')
    expect(findSketchOutputRow(container, 'SketchProfile')).toBeNull()

    const outputProfilesChevron = outputProfilesRow?.querySelector('.SpaghettiPortChevron--leading')
    expect(outputProfilesChevron).not.toBeNull()

    await act(async () => {
      outputProfilesChevron?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
    })

    expect(selectNodeMode(useSpaghettiStore.getState(), 'node-sketch-1')).toBe('collapsed')
    expect(outputProfilesRow?.getAttribute('data-sp-port-row-open')).toBe('1')
    expect(findSketchOutputRow(container, 'SketchProfile')).toBeNull()
  })

  it('uses essentials defaults for sketch port rows', async () => {
    await act(async () => {
      useSpaghettiStore.getState().setNodeMode('node-sketch-1', 'essentials')
      root?.render(<SketchNodeHarness />)
    })

    expect(
      container?.querySelector('.SpaghettiPort--in .SpaghettiPortName')?.textContent,
    ).toBe('SketchPlane')
    expect(container?.querySelector('.SpaghettiPort--in')?.getAttribute('data-sp-port-row-open')).toBe(
      '1',
    )
    expect(container?.querySelector('.SpaghettiPortType')?.textContent).toBe('XY')
    expect(container?.querySelector('[data-sp-geometry-port-row="in:SketchPlane"]')).toBeNull()
    expect(findSketchOutputRow(container, 'SketchProfiles')).toBeNull()
    expect(findSketchOutputRow(container, 'SketchProfile')).toBeNull()
  })

  it('applies row defaults when the outputs block is opened in essentials', async () => {
    await act(async () => {
      useSpaghettiStore.getState().setNodeMode('node-sketch-1', 'essentials')
      root?.render(<SketchNodeHarness />)
    })

    const outputsBlock = container?.querySelector('[data-sp-geometry-block="outputs"]')
    const outputsToggle = outputsBlock?.querySelector('.SpaghettiGeometryNodeRailToggle')

    await act(async () => {
      outputsToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(findSketchOutputRow(container, 'SketchProfiles')?.getAttribute('data-sp-port-row-open')).toBe(
      '0',
    )
    expect(findSketchOutputRow(container, 'SketchProfile')).toBeNull()
  })

  it('cycles the sketch input row through collapsed, essentials, and expanded without changing node mode', async () => {
    await act(async () => {
      root?.render(<SketchNodeHarness />)
    })

    const inputRow = container?.querySelector('.SpaghettiPort--in')
    const inputChevron = inputRow?.querySelector('.SpaghettiPortChevron--leading')
    expect(inputRow?.getAttribute('data-sp-port-row-open')).toBe('0')
    expect(inputRow?.textContent).toContain('XY')

    await act(async () => {
      inputChevron?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(selectNodeMode(useSpaghettiStore.getState(), 'node-sketch-1')).toBe('collapsed')
    expect(inputRow?.getAttribute('data-sp-port-row-open')).toBe('1')
    expect(inputRow?.textContent).toContain('XY')
    expect(inputRow?.textContent).toContain('Source')
    expect(inputRow?.textContent).toContain('Transform')
    expect(inputRow?.textContent).toContain('Origin Plane')
    expect(inputRow?.textContent).toContain('Offset')
    expect(inputRow?.textContent).toContain('Rotation')
    expect(inputRow?.querySelector('.SpaghettiPortDetailsBox')).not.toBeNull()

    await act(async () => {
      inputChevron?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(selectNodeMode(useSpaghettiStore.getState(), 'node-sketch-1')).toBe('collapsed')
    expect(inputRow?.getAttribute('data-sp-port-row-open')).toBe('1')
    expect(inputRow?.textContent).toContain('Translate X')
    expect(inputRow?.textContent).toContain('Rotate Z')
    expect(inputRow?.textContent).toContain('In-Plane Rotation')

    await act(async () => {
      inputChevron?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(selectNodeMode(useSpaghettiStore.getState(), 'node-sketch-1')).toBe('collapsed')
    expect(inputRow?.getAttribute('data-sp-port-row-open')).toBe('0')
    expect(inputRow?.textContent).toContain('XY')
    expect(inputRow?.textContent).not.toContain('connections in: 0/1')
  })

  it('lets clicking the sketch input label cycle the same row modes as the chevron', async () => {
    await act(async () => {
      root?.render(<SketchNodeHarness />)
    })

    const inputRow = container?.querySelector('.SpaghettiPort--in')
    const inputLabel = inputRow?.querySelector('.SpaghettiPortName')
    expect(inputRow?.getAttribute('data-sp-port-row-open')).toBe('0')

    await act(async () => {
      inputLabel?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(inputRow?.getAttribute('data-sp-port-row-open')).toBe('1')
    expect(inputRow?.querySelector('.SpaghettiPortDetailsBox')).not.toBeNull()
    expect(inputRow?.textContent).toContain('Source')

    await act(async () => {
      inputLabel?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(inputRow?.querySelector('.SpaghettiPortDetailsBox')).not.toBeNull()
    expect(inputRow?.textContent).toContain('Translate X')

    await act(async () => {
      inputLabel?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(inputRow?.getAttribute('data-sp-port-row-open')).toBe('0')
  })

  it('uses the same shared output-row header and attached-body contract for sketch and extrude', async () => {
    await act(async () => {
      root?.render(<SketchNodeHarness />)
    })

    const sketchOutputRow = findSketchOutputRow(container, 'SketchProfiles')
    const sketchChevron = sketchOutputRow?.querySelector('.SpaghettiPortChevron--leading')

    await act(async () => {
      sketchChevron?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      sketchChevron?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(sketchOutputRow?.querySelector('[data-sp-port-header-lane="status"]')).not.toBeNull()
    expect(sketchOutputRow?.querySelector('[data-sp-port-header-status="1"]')).not.toBeNull()
    expect(sketchOutputRow?.querySelector('[data-sp-port-attached-body="output"]')).not.toBeNull()
    expect(sketchOutputRow?.classList.contains('SpaghettiPortShell--managedCollectionOut')).toBe(
      true,
    )

    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [extrudeNode],
        edges: [],
        ui: {
          nodeModesByNodeId: {
            [extrudeNode.nodeId]: 'expanded',
          },
        },
      })
      root?.render(<ExtrudeNodeHarness />)
    })

    const extrudeOutputRow = findExtrudeOutputRow(container, 'SolidBody')
    expect(extrudeOutputRow).not.toBeNull()
    expect(extrudeOutputRow?.querySelector('[data-sp-port-header-lane="status"]')).not.toBeNull()
    expect(extrudeOutputRow?.querySelector('[data-sp-port-header-status="1"]')).not.toBeNull()
    expect(extrudeOutputRow?.querySelector('[data-sp-port-attached-body="output"]')).not.toBeNull()
    expect(extrudeOutputRow?.classList.contains('SpaghettiPortShell--managedCollectionOut')).toBe(
      true,
    )
  })

  it('keeps composite parent rows tied to real typed ownership and whole-wire drive state', async () => {
    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [compositeNode],
        edges: [],
        ui: {},
      })
      root?.render(<CompositeNodeHarness />)
    })

    const centerRow = findPortRow(container, 'in', 'Center')
    const offsetRow = findPortRow(container, 'out', 'Offset')
    expect(centerRow).not.toBeNull()
    expect(centerRow?.textContent).toContain('2 children')
    expect(offsetRow).not.toBeNull()
    expect(offsetRow?.textContent).toContain('3 children')

    await act(async () => {
      root?.render(
        <CompositeNodeHarness
          inputCompositeState={{
            ...emptyCompositeState,
            wholeDrivenByPortId: new Set<string>(['Center']),
          }}
        />,
      )
    })

    const drivenCenterRow = findPortRow(container, 'in', 'Center')
    expect(drivenCenterRow).not.toBeNull()
    expect(drivenCenterRow?.textContent).toContain('Driven by parent wire')
  })

  it('preserves a manual output-row close from expanded when switching to essentials', async () => {
    await act(async () => {
      useSpaghettiStore.getState().setNodeMode('node-sketch-1', 'expanded')
      root?.render(<SketchNodeHarness />)
    })

    const outputProfilesRow = findSketchOutputRow(container, 'SketchProfiles')
    const outputProfilesChevron = outputProfilesRow?.querySelector('.SpaghettiPortChevron--leading')
    expect(outputProfilesRow?.getAttribute('data-sp-port-row-open')).toBe('1')

    await act(async () => {
      outputProfilesChevron?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
    })

    expect(outputProfilesRow?.querySelector('.SpaghettiPortDetailsBox')).not.toBeNull()

    await act(async () => {
      outputProfilesChevron?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
    })

    expect(outputProfilesRow?.getAttribute('data-sp-port-row-open')).toBe('0')

    await act(async () => {
      useSpaghettiStore.getState().setNodeMode('node-sketch-1', 'essentials')
    })

    const outputsBlock = container?.querySelector('[data-sp-geometry-block="outputs"]')
    const outputsToggle = outputsBlock?.querySelector('.SpaghettiGeometryNodeRailToggle')

    await act(async () => {
      outputsToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(findSketchOutputRow(container, 'SketchProfiles')?.getAttribute('data-sp-port-row-open')).toBe(
      '0',
    )
  })

  it('cycles a sketch output row through collapsed, essentials, and expanded without changing node mode', async () => {
    await act(async () => {
      root?.render(<SketchNodeHarness />)
    })

    const outputProfilesRow = findSketchOutputRow(container, 'SketchProfiles')
    const outputProfilesChevron = outputProfilesRow?.querySelector('.SpaghettiPortChevron--leading')
    expect(outputProfilesRow?.getAttribute('data-sp-port-row-open')).toBe('0')

    await act(async () => {
      outputProfilesChevron?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
    })

    expect(selectNodeMode(useSpaghettiStore.getState(), 'node-sketch-1')).toBe('collapsed')
    expect(outputProfilesRow?.getAttribute('data-sp-port-row-open')).toBe('1')
    expect(outputProfilesRow?.querySelector('.SpaghettiPortDetailsBox')).not.toBeNull()

    await act(async () => {
      outputProfilesChevron?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
    })

    expect(selectNodeMode(useSpaghettiStore.getState(), 'node-sketch-1')).toBe('collapsed')
    expect(outputProfilesRow?.getAttribute('data-sp-port-row-open')).toBe('1')
    expect(outputProfilesRow?.querySelector('.SpaghettiPortDetailsBox')).not.toBeNull()

    await act(async () => {
      outputProfilesChevron?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
    })

    expect(selectNodeMode(useSpaghettiStore.getState(), 'node-sketch-1')).toBe('collapsed')
    expect(outputProfilesRow?.getAttribute('data-sp-port-row-open')).toBe('0')
    expect(outputProfilesRow?.querySelector('.SpaghettiPortDetailsBox')).toBeNull()
  })

  it('lets clicking a sketch output label cycle the same row modes as the chevron', async () => {
    await act(async () => {
      root?.render(<SketchNodeHarness />)
    })

    const outputProfilesRow = findSketchOutputRow(container, 'SketchProfiles')
    const outputLabel = outputProfilesRow?.querySelector('.SpaghettiPortName')
    expect(outputProfilesRow?.getAttribute('data-sp-port-row-open')).toBe('0')

    await act(async () => {
      outputLabel?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(outputProfilesRow?.getAttribute('data-sp-port-row-open')).toBe('1')
    expect(outputProfilesRow?.querySelector('.SpaghettiPortDetailsBox')).not.toBeNull()

    await act(async () => {
      outputLabel?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(outputProfilesRow?.querySelector('.SpaghettiPortDetailsBox')).not.toBeNull()

    await act(async () => {
      outputLabel?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(outputProfilesRow?.getAttribute('data-sp-port-row-open')).toBe('0')
  })

  it('keeps sketch profile members owned by the parent collection row when outputs expand', async () => {
    await act(async () => {
      root?.render(<SketchNodeHarness />)
    })

    const outputProfilesRow = findSketchOutputRow(container, 'SketchProfiles')
    const outputProfilesChevron = outputProfilesRow?.querySelector('.SpaghettiPortChevron--leading')

    await act(async () => {
      outputProfilesChevron?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
    })

    await act(async () => {
      outputProfilesChevron?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
    })

    expect(outputProfilesRow?.textContent).toContain('Parent collection')
    expect(outputProfilesRow?.textContent).toContain(
      'Closed profiles publish here as one ordered parent collection once the sketch resolves closed loops.',
    )
    expect(outputProfilesRow?.textContent).toContain('No closed profiles yet')
    expect(findSketchOutputRow(container, 'SketchProfile')).toBeNull()
    expect(
      container?.querySelectorAll('[data-sp-sketch-profile-child-row]').length,
    ).toBe(0)
  })

  it('gives revealed sketch profile children distinct output endpoint ids when profiles exist', async () => {
    const prof1 = buildSketchProfileMemberPortId('profile-1')
    const prof2 = buildSketchProfileMemberPortId('profile-2')

    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            ...sketchNode,
            params: {
              sketch: {
                ...((sketchNode.params as { sketch: Record<string, unknown> }).sketch),
                outputs: {
                  profiles: [
                    { profileId: 'profile-1', profileIndex: 0, area: 10, loop: { segments: [], winding: 'CCW' }, verticesProxy: [] },
                    { profileId: 'profile-2', profileIndex: 1, area: 15, loop: { segments: [], winding: 'CCW' }, verticesProxy: [] },
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
        ],
        edges: [],
        ui: {
          nodeModesByNodeId: {
            'node-sketch-1': 'expanded',
          },
        },
      })
      root?.render(
        <NodeView
          node={{
            ...sketchNode,
            params: {
              sketch: {
                ...((sketchNode.params as { sketch: Record<string, unknown> }).sketch),
                outputs: {
                  profiles: [
                    { profileId: 'profile-1', profileIndex: 0, area: 10, loop: { segments: [], winding: 'CCW' }, verticesProxy: [] },
                    { profileId: 'profile-2', profileIndex: 1, area: 15, loop: { segments: [], winding: 'CCW' }, verticesProxy: [] },
                  ],
                  diagnostics: [],
                },
                uiState: {
                  collapsed: false,
                  selectedProfileId: 'profile-2',
                },
              },
            },
          }}
          x={0}
          y={0}
          title="Sketch"
          nodeMode="expanded"
          template="sketch"
          sketchVm={{
            ...sketchVm,
            profileCount: 2,
            hasSelectedProfile: true,
          }}
          inputPortDetails={sketchInputPortDetails}
          allInputs={allInputs}
          allOutputs={allOutputs}
          inputCompositeState={emptyCompositeState}
          compositeExpansionRevision={0}
          getCompositeExpanded={() => false}
          setCompositeExpanded={() => {
            // no-op for test
          }}
          selected={false}
          getInputDropState={() => null}
          getOutputDropState={() => null}
          onPresetChange={() => {
            // no-op for test
          }}
          onDriverNumberChange={() => {
            // no-op for test
          }}
          onUtilityNumberValueChange={() => {
            // no-op for test
          }}
          onUtilityBooleanValueChange={() => {
            // no-op for test
          }}
          onUtilityVec2AxisChange={() => {
            // no-op for test
          }}
          outputRowMinHeight={40}
          onOutputRowMinHeightChange={() => {
            // no-op for test
          }}
          pinDotSize={8}
          onPinDotSizeChange={() => {
            // no-op for test
          }}
          onNodeHeaderPointerDown={() => {
            // no-op for test
          }}
          onNodeBodyPointerDown={() => {
            // no-op for test
          }}
          onNodeResizeHandlePointerDown={() => {
            // no-op for test
          }}
          onNodeTitleClick={() => {
            // no-op for test
          }}
          onRegisterPortElement={() => {
            // no-op for test
          }}
          onOutputPointerDown={() => {
            // no-op for test
          }}
          onOutputPointerEnter={() => {
            // no-op for test
          }}
          onOutputPointerLeave={() => {
            // no-op for test
          }}
          onInputPointerDown={() => {
            // no-op for test
          }}
          onInputPointerEnter={() => {
            // no-op for test
          }}
          onInputPointerLeave={() => {
            // no-op for test
          }}
        />,
      )
    })

    expect(
      container?.querySelector(`[data-sp-sketch-profile-child-port-id="${prof1}"]`),
    ).not.toBeNull()
    expect(container?.querySelector(`[data-sp-endpoint-port-id="${prof1}"]`)).not.toBeNull()
    expect(container?.querySelector(`[data-sp-endpoint-port-id="${prof2}"]`)).not.toBeNull()
  })

  it('updates the local sketch plane from the Source ParaSelect and writes transform slider values into the sketch params', async () => {
    await act(async () => {
      root?.render(<SketchNodeHarness />)
    })

    const inputRow = container?.querySelector('.SpaghettiPort--in')
    const inputChevron = inputRow?.querySelector('.SpaghettiPortChevron--leading')

    await act(async () => {
      inputChevron?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const planeSelect = inputRow?.querySelector('.ParaSelectNative') as HTMLSelectElement | null
    expect(planeSelect).not.toBeNull()

    await act(async () => {
      if (planeSelect !== null) {
        planeSelect.value = 'XZ'
        planeSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    let sketch =
      (useSpaghettiStore.getState().graph.nodes[0]?.params.sketch as {
        plane?: string
        planeTransform?: { offsetMm?: number }
      }) ?? null
    expect(sketch?.plane).toBe('XZ')

    const increaseOffsetButton = Array.from(
      inputRow?.querySelectorAll('button') ?? [],
    ).find((button) => button.getAttribute('aria-label') === 'Increase Offset') as
      | HTMLButtonElement
      | undefined
    expect(increaseOffsetButton).not.toBeUndefined()

    await act(async () => {
      increaseOffsetButton?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
    })

    sketch =
      (useSpaghettiStore.getState().graph.nodes[0]?.params.sketch as {
        planeTransform?: { offsetMm?: number }
      }) ?? null
    expect(sketch?.planeTransform?.offsetMm).toBe(0.1)
  })

  it('routes Draw through the shared sketch entry intent band', async () => {
    await act(async () => {
      root?.render(<SketchNodeHarness />)
    })

    const entitiesRow = findSketchInputRow(container, 'SketchDraw')
    const entitiesLabel = entitiesRow?.querySelector('.SpaghettiPortName')
    expect(entitiesLabel).not.toBeNull()

    await act(async () => {
      entitiesLabel?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const drawButton = Array.from(entitiesRow?.querySelectorAll('button') ?? []).find(
      (button) => button.textContent?.trim() === 'Draw',
    ) as HTMLButtonElement | undefined
    expect(drawButton).toBeDefined()

    await act(async () => {
      drawButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().selectedNodeId).toBe('node-sketch-1')
    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      nodeId: 'node-sketch-1',
      mode: 'draw',
    })
    expect(useAppStore.getState().workspaceSelection.selectedTarget).toMatchObject({
      kind: 'graph-node',
      graphDocumentId: 'graph-document-1',
      nodeId: 'node-sketch-1',
    })
    expect(useAppStore.getState().workspaceSelection.activeSurface).toBe('spaghetti')
  })

  it('rehydrates Resume Draw from the canonical geometry sketch session', async () => {
    await act(async () => {
      useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
      root?.render(<SketchNodeHarness />)
    })

    const entitiesRow = findSketchInputRow(container, 'SketchDraw')
    const entitiesLabel = entitiesRow?.querySelector('.SpaghettiPortName')
    expect(entitiesLabel).not.toBeNull()

    await act(async () => {
      entitiesLabel?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(
      Array.from(entitiesRow?.querySelectorAll('button') ?? []).some(
        (button) => button.textContent?.trim() === 'Resume Draw',
      ),
    ).toBe(true)
  })
})
