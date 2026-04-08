// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { PortSpec, SpaghettiNode } from '../schema/spaghettiTypes'
import type { ExtrudeNodeVm, SketchNodeVm } from '../selectors'

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
    extrudeType: 'Body',
    extrudeDirection: 'OneSide',
    depthMm: 30,
  },
}

const extrudeVm: ExtrudeNodeVm = {
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
}

const sketchInputPortDetails = {
  SketchPlane: [
    { text: 'type: plane' },
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
    label: 'ExtrusionProfile',
    type: { kind: 'sketchProfile' },
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

const extrudeOutputs: PortSpec[] = [
  {
    portId: 'SolidBody',
    label: 'SolidBody',
    type: { kind: 'solidBody' },
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

function ExtrudeNodeHarness() {
  const graphNode = useSpaghettiStore((state) => state.graph.nodes[0] ?? null)
  const nodeMode = useSpaghettiStore((state) =>
    graphNode === null ? 'essentials' : selectNodeMode(state, graphNode.nodeId),
  )
  if (graphNode === null) {
    return null
  }
  const effectiveExtrudeType =
    graphNode.params.extrudeType === 'Walls' ? 'Walls' : 'Body'
  const effectiveExtrudeDirection =
    graphNode.params.extrudeDirection === 'TwoSides'
      ? 'TwoSides'
      : graphNode.params.extrudeDirection === 'Symmetric'
        ? 'Symmetric'
        : 'OneSide'
  const depthMm =
    typeof graphNode.params.depthMm === 'number' ? graphNode.params.depthMm : extrudeVm.localDepthMm
  const startDepthMm =
    typeof graphNode.params.startDepthMm === 'number' ? graphNode.params.startDepthMm : depthMm
  const endDepthMm =
    typeof graphNode.params.endDepthMm === 'number' ? graphNode.params.endDepthMm : depthMm
  const liveExtrudeVm: ExtrudeNodeVm = {
    ...extrudeVm,
    extrudeType: effectiveExtrudeType,
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
      node={graphNode}
      x={0}
      y={0}
      title="Extrude"
      nodeMode={nodeMode}
      template="extrude"
      extrudeVm={liveExtrudeVm}
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

describe('NodeView geometry mode behavior', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null

  beforeEach(async () => {
    vi.resetModules()
    globalThis.Worker = MockWorker as unknown as typeof Worker
    ;({ NodeView } = await import('./NodeView'))
    ;({ useSpaghettiUiStore } = await import('./state/spaghettiUiStore'))
    ;({ selectNodeMode, useSpaghettiStore } = await import('../store/useSpaghettiStore'))
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
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

  it('cycles the extrude SketchProfile row through collapsed, essentials, and expanded without widening into toolbar work', async () => {
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
    expect(inputRow?.classList.contains('SpaghettiExtrudeProfilePortRow')).toBe(true)
    expect(inputRow?.textContent).toContain('SketchProfile')
    expect(inputRow?.textContent).toContain('Awaiting SketchProfile or SketchProfiles target')

    await act(async () => {
      inputLabel?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(inputRow?.getAttribute('data-sp-port-row-open')).toBe('1')
    expect(inputRow?.textContent).toContain('Profile Target')
    expect(inputRow?.textContent).toContain(
      'Wire one SketchProfile or the parent SketchProfiles output from Geometry/Sketch into this extrude.',
    )
    expect(inputRow?.textContent).not.toContain('No profile target wired yet')

    await act(async () => {
      inputLabel?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(inputRow?.getAttribute('data-sp-port-row-open')).toBe('1')
    expect(inputRow?.textContent).toContain('No profile target wired yet')

    await act(async () => {
      inputLabel?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(inputRow?.getAttribute('data-sp-port-row-open')).toBe('0')
    expect(inputRow?.textContent).toContain('Awaiting SketchProfile or SketchProfiles target')
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
    expect(initialFill?.style.width).toBe('1.495%')
    expect(initialMarker?.style.left).toBe('1.495%')

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
    expect(updatedDepthInput?.value).toBe('1500.0')
    expect(updatedFill?.style.width).toBe('74.999%')
    expect(updatedMarker?.style.left).toBe('74.999%')
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
    const outputProfileRow = findSketchOutputRow(container, 'SketchProfile')

    expect(outputProfilesRow?.getAttribute('data-sp-port-row-open')).toBe('0')
    expect(outputProfileRow?.getAttribute('data-sp-port-row-open')).toBe('0')

    const outputProfilesChevron = outputProfilesRow?.querySelector('.SpaghettiPortChevron--leading')
    expect(outputProfilesChevron).not.toBeNull()

    await act(async () => {
      outputProfilesChevron?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
    })

    expect(selectNodeMode(useSpaghettiStore.getState(), 'node-sketch-1')).toBe('collapsed')
    expect(outputProfilesRow?.getAttribute('data-sp-port-row-open')).toBe('1')
    expect(outputProfileRow?.getAttribute('data-sp-port-row-open')).toBe('0')
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
    expect(findSketchOutputRow(container, 'SketchProfile')?.getAttribute('data-sp-port-row-open')).toBe(
      '0',
    )
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
    expect(outputProfilesRow?.querySelector('.SpaghettiPortDetailsBox')).toBeNull()

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
    expect(outputProfilesRow?.querySelector('.SpaghettiPortDetailsBox')).toBeNull()

    await act(async () => {
      outputLabel?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(outputProfilesRow?.querySelector('.SpaghettiPortDetailsBox')).not.toBeNull()

    await act(async () => {
      outputLabel?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(outputProfilesRow?.getAttribute('data-sp-port-row-open')).toBe('0')
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
})
