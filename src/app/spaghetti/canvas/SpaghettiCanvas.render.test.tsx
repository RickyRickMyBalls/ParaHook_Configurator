// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { SketchFeature } from '../features/featureTypes'
import { profileIdFromSignature } from '../features/profileDerivation'
import { buildSketchProfileMemberPortId } from '../features/sketchProfileVirtualPorts'
import {
  MIN_SPAGHETTI_NODE_WIDTH,
  type SpaghettiGraph,
} from '../schema/spaghettiTypes'
import { OUTPUT_PREVIEW_NODE_TYPE } from '../system/outputPreviewNode'

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
let editHistoryStore!: typeof import('../../store/editHistoryStore').editHistoryStore
let useWorkspaceStore!: typeof import('../../workspace/useWorkspaceStore').useWorkspaceStore
const originalWorker = globalThis.Worker
const PointerEventCtor = globalThis.PointerEvent ?? MouseEvent

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

const findPortAnchor = (
  row: HTMLElement | null | undefined,
): HTMLElement | null => {
  const anchor = row?.querySelector('.SpaghettiPortAnchor')
  return anchor instanceof HTMLElement ? anchor : null
}

const stubElementRect = (
  element: HTMLElement,
  rect: { left: number; top: number; width: number; height: number },
) => {
  element.getBoundingClientRect = () => ({
    x: rect.left,
    y: rect.top,
    left: rect.left,
    top: rect.top,
    right: rect.left + rect.width,
    bottom: rect.top + rect.height,
    width: rect.width,
    height: rect.height,
    toJSON: () => ({}),
  } as DOMRect)
}

describe('SpaghettiCanvas live extrude row rendering', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null

  beforeEach(async () => {
    vi.resetModules()
    globalThis.Worker = MockWorker as unknown as typeof Worker
    ;({ SpaghettiCanvas } = await import('./SpaghettiCanvas'))
    ;({ useSpaghettiStore } = await import('../store/useSpaghettiStore'))
    ;({ editHistoryStore } = await import('../../store/editHistoryStore'))
    ;({ useWorkspaceStore } = await import('../../workspace/useWorkspaceStore'))
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
    editHistoryStore.clear()
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

  it('selects graph nodes with a canvas Window drag from empty space', async () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature(),
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
      edges: [],
      ui: {
        viewport: {
          x: 0,
          y: 0,
          zoom: 1,
        },
      },
    })
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

    const scroller = container?.querySelector('.SpaghettiCanvasScroller') as HTMLElement | null
    const stage = container?.querySelector('.SpaghettiCanvasStage') as HTMLElement | null
    const sketchNode = findNodeRoot(container, 'node-sketch-1')
    const extrudeNode = findNodeRoot(container, 'node-extrude-1')
    expect(scroller).not.toBeNull()
    expect(stage).not.toBeNull()
    expect(sketchNode).not.toBeNull()
    expect(extrudeNode).not.toBeNull()
    if (scroller === null || stage === null || sketchNode === null || extrudeNode === null) {
      return
    }

    stubElementRect(scroller, { left: 0, top: 0, width: 800, height: 600 })
    stubElementRect(stage, { left: 0, top: 0, width: 1200, height: 800 })
    stubElementRect(sketchNode, { left: 100, top: 100, width: 200, height: 100 })
    stubElementRect(extrudeNode, { left: 500, top: 250, width: 200, height: 100 })

    await act(async () => {
      stage.dispatchEvent(
        new PointerEventCtor('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          buttons: 1,
          clientX: 80,
          clientY: 80,
        }),
      )
      window.dispatchEvent(
        new PointerEventCtor('pointermove', {
          bubbles: true,
          cancelable: true,
          button: 0,
          buttons: 1,
          clientX: 350,
          clientY: 240,
        }),
      )
    })

    expect(container?.querySelector('.SpaghettiCanvasSelectionWindow--window')).not.toBeNull()

    await act(async () => {
      window.dispatchEvent(
        new PointerEventCtor('pointerup', {
          bubbles: true,
          cancelable: true,
          button: 0,
          buttons: 0,
          clientX: 350,
          clientY: 240,
        }),
      )
    })

    expect(sketchNode.classList.contains('SpaghettiNode--selected')).toBe(true)
    expect(extrudeNode.classList.contains('SpaghettiNode--selected')).toBe(false)
    expect(useSpaghettiStore.getState().selectedNodeId).toBe('node-sketch-1')
  })

  it('selects overlapped graph nodes with a canvas Crossing drag from empty space', async () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature(),
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
      edges: [],
      ui: {
        viewport: {
          x: 0,
          y: 0,
          zoom: 1,
        },
      },
    })
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

    const scroller = container?.querySelector('.SpaghettiCanvasScroller') as HTMLElement | null
    const stage = container?.querySelector('.SpaghettiCanvasStage') as HTMLElement | null
    const sketchNode = findNodeRoot(container, 'node-sketch-1')
    const extrudeNode = findNodeRoot(container, 'node-extrude-1')
    expect(scroller).not.toBeNull()
    expect(stage).not.toBeNull()
    expect(sketchNode).not.toBeNull()
    expect(extrudeNode).not.toBeNull()
    if (scroller === null || stage === null || sketchNode === null || extrudeNode === null) {
      return
    }

    stubElementRect(scroller, { left: 0, top: 0, width: 800, height: 600 })
    stubElementRect(stage, { left: 0, top: 0, width: 1200, height: 800 })
    stubElementRect(sketchNode, { left: 100, top: 100, width: 200, height: 100 })
    stubElementRect(extrudeNode, { left: 500, top: 250, width: 200, height: 100 })

    await act(async () => {
      stage.dispatchEvent(
        new PointerEventCtor('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          buttons: 1,
          clientX: 650,
          clientY: 320,
        }),
      )
      window.dispatchEvent(
        new PointerEventCtor('pointermove', {
          bubbles: true,
          cancelable: true,
          button: 0,
          buttons: 1,
          clientX: 250,
          clientY: 150,
        }),
      )
    })

    expect(container?.querySelector('.SpaghettiCanvasSelectionWindow--crossing')).not.toBeNull()

    await act(async () => {
      window.dispatchEvent(
        new PointerEventCtor('pointerup', {
          bubbles: true,
          cancelable: true,
          button: 0,
          buttons: 0,
          clientX: 250,
          clientY: 150,
        }),
      )
    })

    expect(sketchNode.classList.contains('SpaghettiNode--selected')).toBe(true)
    expect(extrudeNode.classList.contains('SpaghettiNode--selected')).toBe(true)
    expect(useSpaghettiStore.getState().selectedNodeId).toBe('node-sketch-1')
  })

  it('starts canvas Crossing selection from visible scroller background outside the stage', async () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature(),
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
      edges: [],
      ui: {
        viewport: {
          x: 0,
          y: 0,
          zoom: 1,
        },
      },
    })
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

    const scroller = container?.querySelector('.SpaghettiCanvasScroller') as HTMLElement | null
    const stage = container?.querySelector('.SpaghettiCanvasStage') as HTMLElement | null
    const sketchNode = findNodeRoot(container, 'node-sketch-1')
    const extrudeNode = findNodeRoot(container, 'node-extrude-1')
    expect(scroller).not.toBeNull()
    expect(stage).not.toBeNull()
    expect(sketchNode).not.toBeNull()
    expect(extrudeNode).not.toBeNull()
    if (scroller === null || stage === null || sketchNode === null || extrudeNode === null) {
      return
    }

    stubElementRect(scroller, { left: 0, top: 0, width: 800, height: 600 })
    stubElementRect(stage, { left: 900, top: 0, width: 1200, height: 800 })
    stubElementRect(sketchNode, { left: 100, top: 100, width: 200, height: 100 })
    stubElementRect(extrudeNode, { left: 500, top: 250, width: 200, height: 100 })

    await act(async () => {
      scroller.dispatchEvent(
        new PointerEventCtor('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          buttons: 1,
          clientX: 650,
          clientY: 320,
        }),
      )
      window.dispatchEvent(
        new PointerEventCtor('pointermove', {
          bubbles: true,
          cancelable: true,
          button: 0,
          buttons: 1,
          clientX: 250,
          clientY: 150,
        }),
      )
    })

    expect(container?.querySelector('.SpaghettiCanvasSelectionWindow--crossing')).not.toBeNull()

    await act(async () => {
      window.dispatchEvent(
        new PointerEventCtor('pointerup', {
          bubbles: true,
          cancelable: true,
          button: 0,
          buttons: 0,
          clientX: 250,
          clientY: 150,
        }),
      )
    })

    expect(sketchNode.classList.contains('SpaghettiNode--selected')).toBe(true)
    expect(extrudeNode.classList.contains('SpaghettiNode--selected')).toBe(true)
    expect(useSpaghettiStore.getState().selectedNodeId).toBe('node-sketch-1')
  })

  it('commits menu-created Sketch and Extrude nodes through graph edit history', async () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [],
      edges: [],
    })
    editHistoryStore.clear()
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

    const openNodeMenu = async () => {
      const scroller = container?.querySelector('.SpaghettiCanvasScroller') as HTMLElement | null
      const canvasRoot = container?.querySelector('.SpaghettiCanvasRoot') as HTMLElement | null
      expect(scroller).not.toBeNull()
      expect(canvasRoot).not.toBeNull()
      if (scroller === null || canvasRoot === null) {
        return
      }
      scroller.getBoundingClientRect = () => ({
          x: 0,
          y: 0,
          left: 0,
          top: 0,
          right: 800,
          bottom: 600,
          width: 800,
          height: 600,
          toJSON: () => ({}),
        } as DOMRect)

      await act(async () => {
        scroller.dispatchEvent(
          new PointerEventCtor('pointermove', {
            bubbles: true,
            cancelable: true,
            clientX: 100,
            clientY: 80,
          }),
        )
        canvasRoot.dispatchEvent(
          new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: 'S',
            shiftKey: true,
          }),
        )
      })
    }

    const clickMenuItem = async (label: string) => {
      const button = Array.from(
        container?.querySelectorAll('.SpaghettiNodeAddMenuItem') ?? [],
      ).find((candidate) => candidate.textContent?.includes(label)) as HTMLButtonElement | undefined
      expect(button).toBeDefined()
      await act(async () => {
        button?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
      })
    }

    await openNodeMenu()
    await clickMenuItem('Sketch')

    expect(
      useSpaghettiStore.getState().graph.nodes.some((node) => node.type === 'Geometry/Sketch'),
    ).toBe(true)
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Add graph node',
      targetLabel: 'Geometry/Sketch',
    })

    await act(async () => {
      editHistoryStore.undo()
    })
    expect(
      useSpaghettiStore.getState().graph.nodes.some((node) => node.type === 'Geometry/Sketch'),
    ).toBe(false)

    await act(async () => {
      editHistoryStore.redo()
    })
    expect(
      useSpaghettiStore.getState().graph.nodes.some((node) => node.type === 'Geometry/Sketch'),
    ).toBe(true)

    await openNodeMenu()
    await clickMenuItem('Extrude')

    expect(
      useSpaghettiStore.getState().graph.nodes.some((node) => node.type === 'Geometry/Extrude'),
    ).toBe(true)
    expect(editHistoryStore.getUndoEntries()).toHaveLength(2)
    expect(editHistoryStore.getUndoEntries()[1]).toMatchObject({
      label: 'Add graph node',
      targetLabel: 'Geometry/Extrude',
    })
  })

  it('opens canvas organization actions from empty-space right-click instead of node search', async () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature(),
          },
        },
      ],
      edges: [],
    })
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

    const scroller = container?.querySelector('.SpaghettiCanvasScroller') as HTMLElement | null
    expect(scroller).not.toBeNull()
    if (scroller === null) {
      return
    }
    stubElementRect(scroller, { left: 0, top: 0, width: 800, height: 600 })

    await act(async () => {
      scroller.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 120,
          clientY: 90,
        }),
      )
    })

    expect(container?.querySelector('.SpaghettiNodeAddMenu')).toBeNull()
    const menu = container?.querySelector('.SpaghettiContextMenu')
    expect(menu?.textContent).toContain('Parallel')
    expect(menu?.textContent).toContain('Linear')
  })

  it('organizes graph nodes in parallel from the canvas context menu with one history entry', async () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature(),
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
        {
          nodeId: 'node-output-preview-1',
          type: OUTPUT_PREVIEW_NODE_TYPE,
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'edge-sketch-extrude',
          from: { nodeId: 'node-sketch-1', portId: 'SketchProfiles' },
          to: { nodeId: 'node-extrude-1', portId: 'ExtrusionProfile' },
        },
        {
          edgeId: 'edge-extrude-output',
          from: { nodeId: 'node-extrude-1', portId: 'SolidBody' },
          to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s001' },
        },
      ],
      ui: {
        nodes: {
          'node-sketch-1': { x: 900, y: 900 },
          'node-extrude-1': { x: 100, y: 900 },
          'node-output-preview-1': { x: 100, y: 100 },
        },
      },
    })
    editHistoryStore.clear()
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

    const scroller = container?.querySelector('.SpaghettiCanvasScroller') as HTMLElement | null
    expect(scroller).not.toBeNull()
    if (scroller === null) {
      return
    }
    stubElementRect(scroller, { left: 0, top: 0, width: 800, height: 600 })

    await act(async () => {
      scroller.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 120,
          clientY: 90,
        }),
      )
    })

    const organizationButton = Array.from(
      container?.querySelectorAll('.SpaghettiContextMenuItem') ?? [],
    ).find((button) => button.textContent === 'Parallel') as HTMLButtonElement | undefined
    expect(organizationButton).toBeDefined()

    await act(async () => {
      organizationButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().graph.ui?.nodes).toMatchObject({
      'node-sketch-1': { x: 80, y: 80 },
      'node-extrude-1': { x: 440, y: 80 },
      'node-output-preview-1': { x: 800, y: 80 },
    })
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Organize graph nodes',
    })

    await act(async () => {
      editHistoryStore.undo()
    })
    expect(useSpaghettiStore.getState().graph.ui?.nodes?.['node-sketch-1']).toMatchObject({
      x: 900,
      y: 900,
    })
  })

  it('organizes graph nodes in linear order from the canvas context menu', async () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature(),
          },
        },
        {
          nodeId: 'node-extrude-2',
          type: 'Geometry/Extrude',
          params: {
            bodyGenerationMode: 'NewObjects',
            extrudeType: 'Body',
            extrudeDirection: 'OneSide',
            depthMm: 20,
          },
        },
        {
          nodeId: 'node-extrude-1',
          type: 'Geometry/Extrude',
          params: {
            bodyGenerationMode: 'NewObjects',
            extrudeType: 'Body',
            extrudeDirection: 'OneSide',
            depthMm: 12,
          },
        },
        {
          nodeId: 'node-output-preview-1',
          type: OUTPUT_PREVIEW_NODE_TYPE,
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'edge-sketch-extrude-1',
          from: { nodeId: 'node-sketch-1', portId: 'SketchProfiles' },
          to: { nodeId: 'node-extrude-1', portId: 'ExtrusionProfile' },
        },
        {
          edgeId: 'edge-sketch-extrude-2',
          from: { nodeId: 'node-sketch-1', portId: 'SketchProfiles' },
          to: { nodeId: 'node-extrude-2', portId: 'ExtrusionProfile' },
        },
        {
          edgeId: 'edge-extrude-1-output',
          from: { nodeId: 'node-extrude-1', portId: 'SolidBody' },
          to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s001' },
        },
        {
          edgeId: 'edge-extrude-2-output',
          from: { nodeId: 'node-extrude-2', portId: 'SolidBody' },
          to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s002' },
        },
      ],
      ui: {
        nodes: {
          'node-sketch-1': { x: 900, y: 900 },
          'node-extrude-1': { x: 100, y: 900 },
          'node-extrude-2': { x: 100, y: 500 },
          'node-output-preview-1': { x: 100, y: 100 },
        },
      },
    })
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

    const scroller = container?.querySelector('.SpaghettiCanvasScroller') as HTMLElement | null
    expect(scroller).not.toBeNull()
    if (scroller === null) {
      return
    }
    stubElementRect(scroller, { left: 0, top: 0, width: 800, height: 600 })

    await act(async () => {
      scroller.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 120,
          clientY: 90,
        }),
      )
    })

    const linearButton = Array.from(
      container?.querySelectorAll('.SpaghettiContextMenuItem') ?? [],
    ).find((button) => button.textContent === 'Linear') as HTMLButtonElement | undefined
    expect(linearButton).toBeDefined()

    await act(async () => {
      linearButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().graph.ui?.nodes).toMatchObject({
      'node-sketch-1': { x: 80, y: 80 },
      'node-extrude-1': { x: 440, y: 80 },
      'node-extrude-2': { x: 800, y: 80 },
      'node-output-preview-1': { x: 1160, y: 80 },
    })
  })

  it('keeps compact canvas toolbar actions accessible in narrow split panes', async () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [],
      edges: [],
    })
    const editorViewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    expect(editorViewportId).not.toBeNull()

    await act(async () => {
      root?.render(
        <div className="WorkspaceViewportSlotSurface--spaghetti">
          <SpaghettiCanvas
            editorViewportId={editorViewportId ?? ''}
            graphDocumentId="graph-document-1"
            viewMode="expanded"
            onSetViewMode={() => {
              // no-op for test
            }}
          />
        </div>,
      )
    })

    const toolbar = container?.querySelector('.SpaghettiCanvasToolbar') as HTMLElement | null
    const deleteEdgeButton = toolbar?.querySelector(
      'button[aria-label="Delete selected edge"]',
    ) as HTMLButtonElement | null
    const flipSide1Button = toolbar?.querySelector(
      'button[aria-label="Flip tangent side 1"]',
    ) as HTMLButtonElement | null
    const flipSide2Button = toolbar?.querySelector(
      'button[aria-label="Flip tangent side 2"]',
    ) as HTMLButtonElement | null
    const wireCurveSlider = toolbar?.querySelector(
      'input[aria-label="Wire Curve"]',
    ) as HTMLInputElement | null

    expect(toolbar).not.toBeNull()
    expect(deleteEdgeButton?.textContent).toBe('Delete Edge')
    expect(deleteEdgeButton?.disabled).toBe(true)
    expect(flipSide1Button?.textContent).toBe('Flip S1')
    expect(flipSide1Button?.disabled).toBe(true)
    expect(flipSide2Button?.textContent).toBe('Flip S2')
    expect(flipSide2Button?.disabled).toBe(true)
    expect(wireCurveSlider).not.toBeNull()
  })

  it('restores a remembered graph viewport instead of overwriting it with an open-time fit request', async () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature(),
          },
        },
      ],
      edges: [],
      ui: {
        viewport: {
          x: 120,
          y: 80,
          zoom: 1.5,
        },
      },
    })
    const editorViewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    expect(editorViewportId).not.toBeNull()

    await act(async () => {
      root?.render(
        <SpaghettiCanvas
          editorViewportId={editorViewportId ?? ''}
          graphDocumentId="graph-document-1"
          fitCanvasRequestKey={1}
          fitNodeId="node-sketch-1"
          fitNodeRequestKey={1}
          viewMode="expanded"
          onSetViewMode={() => {
            // no-op for test
          }}
        />,
      )
    })

    const stage = container?.querySelector('.SpaghettiCanvasStage') as HTMLElement | null
    expect(stage).not.toBeNull()
    expect(stage?.style.transform).toContain('translate(120px, 80px)')
    expect(stage?.style.transform).toContain('scale(1.5)')
  })

  it('allows wheel zooming out to 1 percent in the graph canvas', async () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature(),
          },
        },
      ],
      edges: [],
      ui: {
        viewport: {
          x: 16,
          y: 16,
          zoom: 0.0105,
        },
      },
    })
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

    const scroller = container?.querySelector('.SpaghettiCanvasScroller') as HTMLElement | null
    expect(scroller).not.toBeNull()
    if (scroller === null) {
      return
    }
    scroller.getBoundingClientRect = () => ({
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      right: 800,
      bottom: 600,
      width: 800,
      height: 600,
      toJSON: () => ({}),
    } as DOMRect)

    await act(async () => {
      scroller.dispatchEvent(
        new WheelEvent('wheel', {
          bubbles: true,
          cancelable: true,
          clientX: 400,
          clientY: 300,
          deltaY: 100,
        }),
      )
    })

    const stage = container?.querySelector('.SpaghettiCanvasStage') as HTMLElement | null
    expect(stage?.style.transform).toContain('scale(0.01)')
  })

  it('fits all rendered nodes on middle mouse double-click in the graph canvas', async () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature(),
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
        {
          nodeId: 'node-output-preview-1',
          type: OUTPUT_PREVIEW_NODE_TYPE,
          params: {},
        },
      ],
      edges: [],
      ui: {
        viewport: {
          x: 0,
          y: 0,
          zoom: 1,
        },
      },
    })
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

    const scroller = container?.querySelector('.SpaghettiCanvasScroller') as HTMLElement | null
    const stage = container?.querySelector('.SpaghettiCanvasStage') as HTMLElement | null
    const sketchNode = findNodeRoot(container, 'node-sketch-1')
    const extrudeNode = findNodeRoot(container, 'node-extrude-1')
    const outputNode = findNodeRoot(container, 'node-output-preview-1')
    expect(scroller).not.toBeNull()
    expect(stage).not.toBeNull()
    expect(sketchNode).not.toBeNull()
    expect(extrudeNode).not.toBeNull()
    expect(outputNode).not.toBeNull()
    if (
      scroller === null ||
      stage === null ||
      sketchNode === null ||
      extrudeNode === null ||
      outputNode === null
    ) {
      return
    }

    stubElementRect(scroller, { left: 0, top: 0, width: 800, height: 600 })
    stubElementRect(stage, { left: 0, top: 0, width: 1200, height: 800 })
    stubElementRect(sketchNode, { left: 100, top: 100, width: 200, height: 100 })
    stubElementRect(extrudeNode, { left: 500, top: 400, width: 200, height: 100 })
    stubElementRect(outputNode, { left: 900, top: 450, width: 200, height: 100 })

    await act(async () => {
      scroller.dispatchEvent(
        new PointerEventCtor('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 1,
          buttons: 4,
          clientX: 400,
          clientY: 300,
          detail: 0,
        }),
      )
      scroller.dispatchEvent(
        new PointerEventCtor('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 1,
          buttons: 4,
          clientX: 402,
          clientY: 301,
          detail: 0,
        }),
      )
    })

    expect(stage.style.transform).toContain('translate(-20px, -48px)')
    expect(stage.style.transform).toContain('scale(0.69936')
  })

  it('fits the selected node on middle mouse double-click when a graph node is selected', async () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature(),
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
        {
          nodeId: 'node-output-preview-1',
          type: OUTPUT_PREVIEW_NODE_TYPE,
          params: {},
        },
      ],
      edges: [],
      ui: {
        viewport: {
          x: 0,
          y: 0,
          zoom: 1,
        },
      },
    })
    const editorViewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    expect(editorViewportId).not.toBeNull()
    if (editorViewportId !== null) {
      useSpaghettiStore.getState().setEditorViewportSelectedNodeId(editorViewportId, 'node-extrude-1')
    }

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

    const scroller = container?.querySelector('.SpaghettiCanvasScroller') as HTMLElement | null
    const stage = container?.querySelector('.SpaghettiCanvasStage') as HTMLElement | null
    const sketchNode = findNodeRoot(container, 'node-sketch-1')
    const extrudeNode = findNodeRoot(container, 'node-extrude-1')
    const outputNode = findNodeRoot(container, 'node-output-preview-1')
    expect(scroller).not.toBeNull()
    expect(stage).not.toBeNull()
    expect(sketchNode).not.toBeNull()
    expect(extrudeNode).not.toBeNull()
    expect(outputNode).not.toBeNull()
    if (
      scroller === null ||
      stage === null ||
      sketchNode === null ||
      extrudeNode === null ||
      outputNode === null
    ) {
      return
    }

    stubElementRect(scroller, { left: 0, top: 0, width: 800, height: 600 })
    stubElementRect(stage, { left: 0, top: 0, width: 1200, height: 800 })
    stubElementRect(sketchNode, { left: 100, top: 100, width: 200, height: 100 })
    stubElementRect(extrudeNode, { left: 500, top: 400, width: 200, height: 100 })
    stubElementRect(outputNode, { left: 900, top: 450, width: 200, height: 100 })

    await act(async () => {
      scroller.dispatchEvent(
        new PointerEventCtor('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 1,
          buttons: 4,
          clientX: 400,
          clientY: 300,
          detail: 0,
        }),
      )
      scroller.dispatchEvent(
        new PointerEventCtor('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 1,
          buttons: 4,
          clientX: 402,
          clientY: 301,
          detail: 0,
        }),
      )
    })

    expect(stage.style.transform).toContain('translate(-1160px, -1018px)')
    expect(stage.style.transform).toContain('scale(2.6)')
  })

  it('fits the canvas-selected node set on middle mouse double-click after window selection', async () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature(),
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
        {
          nodeId: 'node-output-preview-1',
          type: OUTPUT_PREVIEW_NODE_TYPE,
          params: {},
        },
      ],
      edges: [],
      ui: {
        viewport: {
          x: 0,
          y: 0,
          zoom: 1,
        },
      },
    })
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

    const scroller = container?.querySelector('.SpaghettiCanvasScroller') as HTMLElement | null
    const stage = container?.querySelector('.SpaghettiCanvasStage') as HTMLElement | null
    const sketchNode = findNodeRoot(container, 'node-sketch-1')
    const extrudeNode = findNodeRoot(container, 'node-extrude-1')
    const outputNode = findNodeRoot(container, 'node-output-preview-1')
    expect(scroller).not.toBeNull()
    expect(stage).not.toBeNull()
    expect(sketchNode).not.toBeNull()
    expect(extrudeNode).not.toBeNull()
    expect(outputNode).not.toBeNull()
    if (
      scroller === null ||
      stage === null ||
      sketchNode === null ||
      extrudeNode === null ||
      outputNode === null
    ) {
      return
    }

    stubElementRect(scroller, { left: 0, top: 0, width: 800, height: 600 })
    stubElementRect(stage, { left: 0, top: 0, width: 1200, height: 800 })
    stubElementRect(sketchNode, { left: 100, top: 100, width: 200, height: 100 })
    stubElementRect(extrudeNode, { left: 500, top: 250, width: 200, height: 100 })
    stubElementRect(outputNode, { left: 900, top: 450, width: 200, height: 100 })

    await act(async () => {
      stage.dispatchEvent(
        new PointerEventCtor('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          buttons: 1,
          clientX: 650,
          clientY: 320,
        }),
      )
      window.dispatchEvent(
        new PointerEventCtor('pointermove', {
          bubbles: true,
          cancelable: true,
          button: 0,
          buttons: 1,
          clientX: 250,
          clientY: 150,
        }),
      )
      window.dispatchEvent(
        new PointerEventCtor('pointerup', {
          bubbles: true,
          cancelable: true,
          button: 0,
          buttons: 0,
          clientX: 250,
          clientY: 150,
        }),
      )
    })

    expect(sketchNode.classList.contains('SpaghettiNode--selected')).toBe(true)
    expect(extrudeNode.classList.contains('SpaghettiNode--selected')).toBe(true)
    expect(outputNode.classList.contains('SpaghettiNode--selected')).toBe(false)

    await act(async () => {
      scroller.dispatchEvent(
        new PointerEventCtor('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 1,
          buttons: 4,
          clientX: 400,
          clientY: 300,
          detail: 0,
        }),
      )
      scroller.dispatchEvent(
        new PointerEventCtor('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 1,
          buttons: 4,
          clientX: 402,
          clientY: 301,
          detail: 0,
        }),
      )
    })

    expect(stage.style.transform).toContain('translate(-66px, -95px)')
    expect(stage.style.transform).toContain('scale(1.1656')
  })

  it('commits selected Sketch and Extrude node deletion through graph edit history', async () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature(),
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
          edgeId: 'edge-sketch-extrude',
          from: {
            nodeId: 'node-sketch-1',
            portId: 'profiles',
          },
          to: {
            nodeId: 'node-extrude-1',
            portId: 'profile',
          },
        },
      ],
    }
    useSpaghettiStore.getState().setGraph(graph)
    editHistoryStore.clear()
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

    const dispatchCanvasKey = async (key: 'Backspace' | 'Delete') => {
      const canvasRoot = container?.querySelector('.SpaghettiCanvasRoot') as HTMLElement | null
      expect(canvasRoot).not.toBeNull()
      await act(async () => {
        canvasRoot?.dispatchEvent(
          new KeyboardEvent('keydown', {
            key,
            bubbles: true,
            cancelable: true,
          }),
        )
      })
    }

    await act(async () => {
      useSpaghettiStore
        .getState()
        .setEditorViewportSelectedNodeId(editorViewportId ?? '', 'node-sketch-1')
    })
    await dispatchCanvasKey('Delete')

    expect(
      useSpaghettiStore.getState().graph.nodes.some((node) => node.nodeId === 'node-sketch-1'),
    ).toBe(false)
    expect(useSpaghettiStore.getState().graph.edges).toHaveLength(0)
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Remove graph node',
      targetId: 'node-sketch-1',
      targetLabel: 'node-sketch-1',
    })

    await act(async () => {
      editHistoryStore.undo()
    })
    expect(
      useSpaghettiStore.getState().graph.nodes.some((node) => node.nodeId === 'node-sketch-1'),
    ).toBe(true)
    expect(useSpaghettiStore.getState().graph.edges).toHaveLength(1)

    await act(async () => {
      editHistoryStore.redo()
    })
    expect(
      useSpaghettiStore.getState().graph.nodes.some((node) => node.nodeId === 'node-sketch-1'),
    ).toBe(false)

    await act(async () => {
      useSpaghettiStore.getState().setGraph(graph)
      useSpaghettiStore
        .getState()
        .setEditorViewportSelectedNodeId(editorViewportId ?? '', 'node-extrude-1')
    })
    editHistoryStore.clear()
    await dispatchCanvasKey('Backspace')

    expect(
      useSpaghettiStore.getState().graph.nodes.some((node) => node.nodeId === 'node-extrude-1'),
    ).toBe(false)
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Remove graph node',
      targetId: 'node-extrude-1',
      targetLabel: 'node-extrude-1',
    })

    await act(async () => {
      editHistoryStore.undo()
    })
    expect(
      useSpaghettiStore.getState().graph.nodes.some((node) => node.nodeId === 'node-extrude-1'),
    ).toBe(true)

    await act(async () => {
      useSpaghettiStore.getState().setGraph(graph)
      useSpaghettiStore
        .getState()
        .setEditorViewportSelectedNodeId(editorViewportId ?? '', 'node-sketch-1')
      useSpaghettiStore
        .getState()
        .setEditorViewportSelectedEdgeId(editorViewportId ?? '', 'edge-sketch-extrude')
    })
    editHistoryStore.clear()
    await dispatchCanvasKey('Delete')

    expect(
      useSpaghettiStore.getState().graph.nodes.some((node) => node.nodeId === 'node-sketch-1'),
    ).toBe(true)
    expect(useSpaghettiStore.getState().graph.edges).toHaveLength(0)
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Remove graph wire',
      targetId: 'edge-sketch-extrude',
      targetLabel: 'edge-sketch-extrude',
    })

    await act(async () => {
      editHistoryStore.undo()
    })
    expect(useSpaghettiStore.getState().graph.edges).toHaveLength(1)

    await act(async () => {
      editHistoryStore.redo()
    })
    expect(useSpaghettiStore.getState().graph.edges).toHaveLength(0)

    await act(async () => {
      useSpaghettiStore.getState().setGraph(graph)
      useSpaghettiStore.getState().setEditorViewportSelectedNodeId(editorViewportId ?? '', null)
      useSpaghettiStore.getState().setEditorViewportSelectedEdgeId(editorViewportId ?? '', null)
    })
    editHistoryStore.clear()
    await dispatchCanvasKey('Delete')

    expect(
      useSpaghettiStore.getState().graph.nodes.some((node) => node.nodeId === 'node-sketch-1'),
    ).toBe(true)
    expect(
      useSpaghettiStore.getState().graph.nodes.some((node) => node.nodeId === 'node-extrude-1'),
    ).toBe(true)
    expect(useSpaghettiStore.getState().graph.edges).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()).toHaveLength(0)
  })

  it('commits canvas-created wires through graph edit history', async () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature(),
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
      edges: [],
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
    editHistoryStore.clear()
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

    const sketchNode = findNodeRoot(container, 'node-sketch-1')
    const extrudeNode = findNodeRoot(container, 'node-extrude-1')
    const outputRow = findPortRow(sketchNode, 'out', 'SketchProfiles')
    const inputRow = findPortRow(extrudeNode, 'in', 'SketchProfiles')
    const outputAnchor = findPortAnchor(outputRow)
    const inputAnchor = findPortAnchor(inputRow)
    expect(outputAnchor).not.toBeNull()
    expect(inputRow).not.toBeNull()
    expect(inputAnchor).not.toBeNull()

    await act(async () => {
      outputAnchor?.dispatchEvent(
        new PointerEventCtor('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 180,
          clientY: 140,
        }),
      )
      window.dispatchEvent(
        new PointerEventCtor('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 460,
          clientY: 140,
        }),
      )
      inputRow?.dispatchEvent(
        new PointerEventCtor('pointerover', {
          bubbles: true,
          cancelable: true,
          clientX: 460,
          clientY: 140,
        }),
      )
      inputAnchor?.dispatchEvent(
        new PointerEventCtor('pointerover', {
          bubbles: true,
          cancelable: true,
          clientX: 460,
          clientY: 140,
        }),
      )
      window.dispatchEvent(
        new PointerEventCtor('pointerup', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 460,
          clientY: 140,
        }),
      )
    })

    expect(useSpaghettiStore.getState().graph.edges).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Connect graph wire',
    })

    await act(async () => {
      editHistoryStore.undo()
    })
    expect(useSpaghettiStore.getState().graph.edges).toHaveLength(0)

    await act(async () => {
      editHistoryStore.redo()
    })
    expect(useSpaghettiStore.getState().graph.edges).toHaveLength(1)
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

  it('draws singular SketchProfile wires when managed profile rows are collapsed', async () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature([
              rectangleComponent('row-1', 'rect-a', { x: 0, y: 0 }, { x: 40, y: 20 }),
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
          edgeId: 'edge-sketch-profile-to-extrude',
          from: {
            nodeId: 'node-sketch-1',
            portId: buildSketchProfileMemberPortId(profileIdFromSignature('rect-a')),
          },
          to: { nodeId: 'node-extrude-1', portId: 'ExtrusionProfile' },
        },
      ],
      ui: {
        nodes: {
          'node-sketch-1': { x: 40, y: 40 },
          'node-extrude-1': { x: 360, y: 40 },
        },
        nodeModesByNodeId: {
          'node-sketch-1': 'collapsed',
          'node-extrude-1': 'collapsed',
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
          viewMode="collapsed"
          onSetViewMode={() => {
            // no-op for test
          }}
        />,
      )
    })

    const sketchNode = findNodeRoot(container, 'node-sketch-1')
    const extrudeNode = findNodeRoot(container, 'node-extrude-1')
    expect(findPortRow(sketchNode, 'out', 'SketchProfiles')).not.toBeNull()
    expect(findPortRow(sketchNode, 'out', 'SketchProfile')).toBeNull()
    expect(findPortRow(extrudeNode, 'in', 'SketchProfiles')).not.toBeNull()
    expect(container?.querySelectorAll('.SpaghettiWire:not(.SpaghettiWire--preview)')).toHaveLength(1)
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

  it('commits one width-aware history entry when a selected node resize completes', async () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature(),
          },
        },
      ],
      edges: [],
      ui: {
        nodes: {
          'node-sketch-1': { x: 120, y: 80, width: 260 },
        },
      },
    })
    editHistoryStore.clear()
    const editorViewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    expect(editorViewportId).not.toBeNull()
    useSpaghettiStore
      .getState()
      .setEditorViewportSelectedNodeId(editorViewportId ?? '', 'node-sketch-1')

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

    const eastHandle = container?.querySelector(
      '[data-sp-node-id="node-sketch-1"] [data-sp-node-resize-handle="e"]',
    ) as HTMLElement | null
    expect(eastHandle).not.toBeNull()

    await act(async () => {
      eastHandle?.dispatchEvent(
        new PointerEventCtor('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 380,
          clientY: 120,
        }),
      )
      window.dispatchEvent(
        new PointerEventCtor('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 440,
          clientY: 120,
        }),
      )
      window.dispatchEvent(
        new PointerEventCtor('pointerup', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 440,
          clientY: 120,
        }),
      )
    })

    const resizedPos = useSpaghettiStore.getState().graph.ui?.nodes?.['node-sketch-1']
    expect(resizedPos).toMatchObject({
      x: 120,
      y: 80,
      width: 320,
    })
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Resize graph node',
      targetId: 'node-sketch-1',
      targetLabel: 'node-sketch-1',
    })

    await act(async () => {
      editHistoryStore.undo()
    })

    expect(useSpaghettiStore.getState().graph.ui?.nodes?.['node-sketch-1']).toMatchObject({
      x: 120,
      y: 80,
      width: 260,
    })

    await act(async () => {
      editHistoryStore.redo()
    })

    expect(useSpaghettiStore.getState().graph.ui?.nodes?.['node-sketch-1']).toMatchObject({
      x: 120,
      y: 80,
      width: 320,
    })
  })

  it('keeps a plain node drag on the move-history label when the node already has a stored width', async () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature(),
          },
        },
      ],
      edges: [],
      ui: {
        nodes: {
          'node-sketch-1': { x: 120, y: 80, width: 260 },
        },
      },
    })
    editHistoryStore.clear()
    const editorViewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    expect(editorViewportId).not.toBeNull()
    useSpaghettiStore
      .getState()
      .setEditorViewportSelectedNodeId(editorViewportId ?? '', 'node-sketch-1')

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

    const nodeHeader = container?.querySelector(
      '[data-sp-node-id="node-sketch-1"] [data-sp-node-header-zone="1"]',
    ) as HTMLElement | null
    expect(nodeHeader).not.toBeNull()

    await act(async () => {
      nodeHeader?.dispatchEvent(
        new PointerEventCtor('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 160,
          clientY: 120,
        }),
      )
      window.dispatchEvent(
        new PointerEventCtor('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 220,
          clientY: 170,
        }),
      )
      window.dispatchEvent(
        new PointerEventCtor('pointerup', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 220,
          clientY: 170,
        }),
      )
    })

    expect(useSpaghettiStore.getState().graph.ui?.nodes?.['node-sketch-1']).toMatchObject({
      x: 180,
      y: 130,
      width: 260,
    })
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Move graph node',
      targetId: 'node-sketch-1',
      targetLabel: 'node-sketch-1',
    })
  })

  it('clamps selected node resize to the shared minimum width floor', async () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature(),
          },
        },
      ],
      edges: [],
      ui: {
        nodes: {
          'node-sketch-1': { x: 120, y: 80, width: 260 },
        },
      },
    })
    editHistoryStore.clear()
    const editorViewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    expect(editorViewportId).not.toBeNull()
    useSpaghettiStore
      .getState()
      .setEditorViewportSelectedNodeId(editorViewportId ?? '', 'node-sketch-1')

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

    const eastHandle = container?.querySelector(
      '[data-sp-node-id="node-sketch-1"] [data-sp-node-resize-handle="e"]',
    ) as HTMLElement | null
    expect(eastHandle).not.toBeNull()

    await act(async () => {
      eastHandle?.dispatchEvent(
        new PointerEventCtor('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 380,
          clientY: 120,
        }),
      )
      window.dispatchEvent(
        new PointerEventCtor('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 80,
          clientY: 120,
        }),
      )
      window.dispatchEvent(
        new PointerEventCtor('pointerup', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 80,
          clientY: 120,
        }),
      )
    })

    expect(useSpaghettiStore.getState().graph.ui?.nodes?.['node-sketch-1']).toMatchObject({
      x: 120,
      y: 80,
      width: MIN_SPAGHETTI_NODE_WIDTH,
    })
  })

  it('shifts x when a west-handle resize clamps to the shared minimum width floor', async () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: createSketchFeature(),
          },
        },
      ],
      edges: [],
      ui: {
        nodes: {
          'node-sketch-1': { x: 120, y: 80, width: 260 },
        },
      },
    })
    editHistoryStore.clear()
    const editorViewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    expect(editorViewportId).not.toBeNull()
    useSpaghettiStore
      .getState()
      .setEditorViewportSelectedNodeId(editorViewportId ?? '', 'node-sketch-1')

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

    const westHandle = container?.querySelector(
      '[data-sp-node-id="node-sketch-1"] [data-sp-node-resize-handle="w"]',
    ) as HTMLElement | null
    expect(westHandle).not.toBeNull()

    await act(async () => {
      westHandle?.dispatchEvent(
        new PointerEventCtor('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 120,
          clientY: 120,
        }),
      )
      window.dispatchEvent(
        new PointerEventCtor('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 220,
          clientY: 120,
        }),
      )
      window.dispatchEvent(
        new PointerEventCtor('pointerup', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 220,
          clientY: 120,
        }),
      )
    })

    expect(useSpaghettiStore.getState().graph.ui?.nodes?.['node-sketch-1']).toMatchObject({
      x: 160,
      y: 80,
      width: MIN_SPAGHETTI_NODE_WIDTH,
    })
  })
})
