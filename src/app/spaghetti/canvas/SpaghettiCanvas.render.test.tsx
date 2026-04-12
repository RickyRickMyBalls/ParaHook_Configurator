// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { SketchFeature } from '../features/featureTypes'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'

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

let SpaghettiCanvas!: typeof import('./SpaghettiCanvas').SpaghettiCanvas
let useSpaghettiStore!: typeof import('../store/useSpaghettiStore').useSpaghettiStore
let useWorkspaceStore!: typeof import('../../workspace/useWorkspaceStore').useWorkspaceStore
const originalWorker = globalThis.Worker

const createSketchFeature = (
  components: SketchFeature['components'] = [],
): SketchFeature => ({
  type: 'sketch',
  featureId: 'sketch-canvas-render-test',
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

const findNodeRoot = (
  root: HTMLElement | null | undefined,
  nodeId: string,
): HTMLElement | null => {
  const match = root?.querySelector(`[data-sp-node-id="${nodeId}"]`)
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

const findPrimitiveInputValue = (
  row: HTMLElement | null | undefined,
): string | null => {
  const input = row?.querySelector('.SpaghettiPortPrimitiveValueInput')
  return input instanceof HTMLInputElement ? input.value : null
}

describe('SpaghettiCanvas live extrude row rendering', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null

  beforeEach(async () => {
    vi.resetModules()
    globalThis.Worker = MockWorker as unknown as typeof Worker
    ;({ SpaghettiCanvas } = await import('./SpaghettiCanvas'))
    ;({ useSpaghettiStore } = await import('../store/useSpaghettiStore'))
    ;({ useWorkspaceStore } = await import('../../workspace/useWorkspaceStore'))
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
    useWorkspaceStore.setState(useWorkspaceStore.getInitialState(), true)
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

  it('renders resolved aggregate SketchProfiles and Ready SolidBodies through the real canvas path', async () => {
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
            depthMm: 20,
          },
        },
      ],
      edges: [
        {
          edgeId: 'edge-sketch-profiles-to-extrude',
          from: { nodeId: 'node-sketch-1', portId: 'SketchProfiles' },
          to: { nodeId: 'node-extrude-1', portId: 'ExtrusionProfile' },
        },
      ],
      ui: {
        nodes: {
          'node-sketch-1': { x: 40, y: 40 },
          'node-extrude-1': { x: 360, y: 40 },
        },
        nodeModesByNodeId: {
          'node-sketch-1': 'expanded',
          'node-extrude-1': 'expanded',
        },
      },
    }

    useSpaghettiStore.getState().setGraph(graph)
    const editorViewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    expect(editorViewportId).not.toBeNull()

    await act(async () => {
      root?.render(
        <SpaghettiCanvas
          editorViewportId={editorViewportId ?? ''}
          graphDocumentId="graph-document-1"
          viewMode="expanded"
          onSetViewMode={() => {
            // no-op for test
          }}
        />,
      )
    })

    const extrudeNode = findNodeRoot(container, 'node-extrude-1')
    const inputRow = findPortRow(extrudeNode, 'in', 'SketchProfiles')
    const outputRow = findPortRow(extrudeNode, 'out', 'SolidBodies')

    expect(extrudeNode).not.toBeNull()
    expect(inputRow).not.toBeNull()
    expect(outputRow).not.toBeNull()
    expect(inputRow?.classList.contains('SpaghettiPortShell--managedCollectionIn')).toBe(true)
    expect(outputRow?.classList.contains('SpaghettiPortShell--managedCollectionOut')).toBe(true)
    expect(inputRow?.textContent).toContain('Parent collection')
    expect(inputRow?.textContent).toContain('3')
    expect(inputRow?.textContent).not.toContain('No SketchProfiles contributors yet')
    expect(outputRow?.textContent).toContain('Ready')
    expect(outputRow?.textContent).not.toContain('Waiting')
  })

  it('keeps the live extrude node mounted across graph-document revisions while its depth display updates', async () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-extrude-1',
          type: 'Geometry/Extrude',
          params: {
            bodyGenerationMode: 'Combine',
            extrudeType: 'Body',
            extrudeDirection: 'OneSide',
            depthMm: 20,
          },
        },
      ],
      edges: [],
      ui: {
        nodes: {
          'node-extrude-1': { x: 120, y: 40 },
        },
        nodeModesByNodeId: {
          'node-extrude-1': 'expanded',
        },
      },
    }

    useSpaghettiStore.getState().setGraph(graph)
    const editorViewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    expect(editorViewportId).not.toBeNull()

    await act(async () => {
      root?.render(
        <SpaghettiCanvas
          editorViewportId={editorViewportId ?? ''}
          graphDocumentId="graph-document-1"
          viewMode="expanded"
          onSetViewMode={() => {
            // no-op for test
          }}
        />,
      )
    })

    const beforeNode = findNodeRoot(container, 'node-extrude-1')
    const beforeDepthRow = findPortRow(beforeNode, 'in', 'Depth')
    expect(beforeNode).not.toBeNull()
    expect(findPrimitiveInputValue(beforeDepthRow)).toBe('20.0')

    await act(async () => {
      useSpaghettiStore.getState().setGraph({
        ...graph,
        nodes: [
          {
            ...graph.nodes[0]!,
            params: {
              ...graph.nodes[0]!.params,
              depthMm: 30,
            },
          },
        ],
      })
    })

    const afterNode = findNodeRoot(container, 'node-extrude-1')
    const afterDepthRow = findPortRow(afterNode, 'in', 'Depth')

    expect(afterNode).toBe(beforeNode)
    expect(findPrimitiveInputValue(afterDepthRow)).toBe('30.0')
  })
})
