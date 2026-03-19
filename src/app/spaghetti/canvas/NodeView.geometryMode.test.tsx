// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { PortSpec, SpaghettiNode } from '../schema/spaghettiTypes'
import type { SketchNodeVm } from '../selectors'
import { NodeView } from './NodeView'
import { useSpaghettiUiStore } from './state/spaghettiUiStore'
import { selectNodeMode, useSpaghettiStore } from '../store/useSpaghettiStore'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

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

const findSketchOutputRow = (root: HTMLElement | null | undefined, label: string): HTMLElement | null => {
  const rows = Array.from(root?.querySelectorAll('.SpaghettiPort--out') ?? [])
  const match = rows.find(
    (row) => row.querySelector('.SpaghettiPortName')?.textContent?.trim() === label,
  )
  return match instanceof HTMLElement ? match : null
}

describe('NodeView geometry mode behavior', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null

  beforeEach(() => {
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
  })

  it('keeps collapsed geometry nodes collapsed and opens only the clicked section', async () => {
    await act(async () => {
      root?.render(<SketchNodeHarness />)
    })

    const planeSection = container?.querySelector('[data-sp-section-id="sketch-plane"]')
    const drawSection = container?.querySelector('[data-sp-section-id="sketch-draw"]')
    const entitiesSection = container?.querySelector('[data-sp-section-id="sketch-entities"]')
    const reviewSection = container?.querySelector('[data-sp-section-id="sketch-review"]')
    expect(planeSection?.getAttribute('data-sp-section-body-visible')).toBe('0')
    expect(drawSection?.getAttribute('data-sp-section-body-visible')).toBe('0')
    expect(entitiesSection?.getAttribute('data-sp-section-body-visible')).toBe('0')
    expect(reviewSection?.getAttribute('data-sp-section-body-visible')).toBe('0')
    expect(selectNodeMode(useSpaghettiStore.getState(), 'node-sketch-1')).toBe('collapsed')

    const sectionHeader = planeSection?.querySelector('.SpaghettiNodeSectionHeaderHitArea')
    expect(sectionHeader).not.toBeNull()

    await act(async () => {
      sectionHeader?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(selectNodeMode(useSpaghettiStore.getState(), 'node-sketch-1')).toBe('collapsed')
    expect(planeSection?.getAttribute('data-sp-section-body-visible')).toBe('1')
    expect(drawSection?.getAttribute('data-sp-section-body-visible')).toBe('0')
    expect(entitiesSection?.getAttribute('data-sp-section-body-visible')).toBe('0')
    expect(reviewSection?.getAttribute('data-sp-section-body-visible')).toBe('0')
    expect(container?.textContent).toContain('Current plane: XY.')
  })

  it('keeps collapsed geometry nodes collapsed and opens only the clicked inputs block', async () => {
    await act(async () => {
      root?.render(<SketchNodeHarness />)
    })

    const inputsBlock = container?.querySelector('[data-sp-geometry-block="inputs"]')
    const sketchBlock = container?.querySelector('[data-sp-geometry-block="content"]')
    const outputsBlock = container?.querySelector('[data-sp-geometry-block="outputs"]')
    expect(inputsBlock?.getAttribute('data-sp-geometry-block-open')).toBe('0')
    expect(sketchBlock?.getAttribute('data-sp-geometry-block-open')).toBe('1')
    expect(outputsBlock?.getAttribute('data-sp-geometry-block-open')).toBe('0')

    const inputsToggle = inputsBlock?.querySelector('.SpaghettiGeometryNodeRailToggle')
    expect(inputsToggle).not.toBeNull()

    await act(async () => {
      inputsToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(selectNodeMode(useSpaghettiStore.getState(), 'node-sketch-1')).toBe('collapsed')
    expect(inputsBlock?.getAttribute('data-sp-geometry-block-open')).toBe('1')
    expect(sketchBlock?.getAttribute('data-sp-geometry-block-open')).toBe('1')
    expect(outputsBlock?.getAttribute('data-sp-geometry-block-open')).toBe('0')
    expect(container?.querySelector('.SpaghettiPort--in')).not.toBeNull()
    expect(container?.querySelector('.SpaghettiPort--in')?.getAttribute('data-sp-port-row-open')).toBe(
      '0',
    )
    expect(container?.querySelector('.SpaghettiPortChevron--leading')).not.toBeNull()
    expect(container?.querySelector('.SpaghettiPortType')?.textContent).toBe('XY')
    expect(container?.querySelector('[data-sp-geometry-port-row="in:SketchPlane"]')).toBeNull()
  })

  it('uses essentials defaults for sketch sections', async () => {
    await act(async () => {
      useSpaghettiStore.getState().setNodeMode('node-sketch-1', 'essentials')
      root?.render(<SketchNodeHarness />)
    })

    expect(
      container
        ?.querySelector('[data-sp-section-id="sketch-plane"]')
        ?.getAttribute('data-sp-section-body-visible'),
    ).toBe('1')
    expect(
      container
        ?.querySelector('[data-sp-section-id="sketch-draw"]')
        ?.getAttribute('data-sp-section-body-visible'),
    ).toBe('1')
    expect(
      container
        ?.querySelector('[data-sp-section-id="sketch-entities"]')
        ?.getAttribute('data-sp-section-body-visible'),
    ).toBe('0')
    expect(
      container
        ?.querySelector('[data-sp-section-id="sketch-review"]')
        ?.getAttribute('data-sp-section-body-visible'),
    ).toBe('0')
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
    expect(
      container
        ?.querySelector('[data-sp-geometry-block="content"]')
        ?.getAttribute('data-sp-geometry-block-open'),
    ).toBe('1')
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

  it('lets the sketch block collapse without changing node mode', async () => {
    await act(async () => {
      useSpaghettiStore.getState().setNodeMode('node-sketch-1', 'essentials')
      root?.render(<SketchNodeHarness />)
    })

    const contentBlock = container?.querySelector('[data-sp-geometry-block="content"]')
    const contentToggle = contentBlock?.querySelector('.SpaghettiGeometryNodeRailToggle')
    expect(contentBlock?.getAttribute('data-sp-geometry-block-open')).toBe('1')
    expect(container?.querySelector('[data-sp-section-id="sketch-plane"]')).not.toBeNull()

    await act(async () => {
      contentToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(selectNodeMode(useSpaghettiStore.getState(), 'node-sketch-1')).toBe('essentials')
    expect(contentBlock?.getAttribute('data-sp-geometry-block-open')).toBe('0')
    expect(container?.querySelector('[data-sp-section-id="sketch-plane"]')).toBeNull()
  })

  it('preserves a manual close from expanded when switching to essentials', async () => {
    await act(async () => {
      useSpaghettiStore.getState().setNodeMode('node-sketch-1', 'expanded')
      root?.render(<SketchNodeHarness />)
    })

    const entitiesSection = container?.querySelector('[data-sp-section-id="sketch-entities"]')
    const entitiesHeader = entitiesSection?.querySelector('.SpaghettiNodeSectionHeaderHitArea')
    expect(entitiesSection?.getAttribute('data-sp-section-body-visible')).toBe('1')

    await act(async () => {
      entitiesHeader?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(entitiesSection?.getAttribute('data-sp-section-body-visible')).toBe('0')

    await act(async () => {
      useSpaghettiStore.getState().setNodeMode('node-sketch-1', 'essentials')
    })

    expect(
      container
        ?.querySelector('[data-sp-section-id="sketch-entities"]')
        ?.getAttribute('data-sp-section-body-visible'),
    ).toBe('0')
    expect(selectNodeMode(useSpaghettiStore.getState(), 'node-sketch-1')).toBe('essentials')
  })

  it('keeps collapsed sketch output rows closed by default and opens only the clicked row', async () => {
    await act(async () => {
      root?.render(<SketchNodeHarness />)
    })

    const outputsBlock = container?.querySelector('[data-sp-geometry-block="outputs"]')
    const outputsToggle = outputsBlock?.querySelector('.SpaghettiGeometryNodeRailToggle')

    await act(async () => {
      outputsToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
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

    const inputsBlock = container?.querySelector('[data-sp-geometry-block="inputs"]')
    const inputsToggle = inputsBlock?.querySelector('.SpaghettiGeometryNodeRailToggle')

    await act(async () => {
      inputsToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
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

    const inputsBlock = container?.querySelector('[data-sp-geometry-block="inputs"]')
    const inputsToggle = inputsBlock?.querySelector('.SpaghettiGeometryNodeRailToggle')

    await act(async () => {
      inputsToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
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

    const outputsBlock = container?.querySelector('[data-sp-geometry-block="outputs"]')
    const outputsToggle = outputsBlock?.querySelector('.SpaghettiGeometryNodeRailToggle')

    await act(async () => {
      outputsToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
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

    const outputsBlock = container?.querySelector('[data-sp-geometry-block="outputs"]')
    const outputsToggle = outputsBlock?.querySelector('.SpaghettiGeometryNodeRailToggle')

    await act(async () => {
      outputsToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
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

    const inputsBlock = container?.querySelector('[data-sp-geometry-block="inputs"]')
    const inputsToggle = inputsBlock?.querySelector('.SpaghettiGeometryNodeRailToggle')

    await act(async () => {
      inputsToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
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
