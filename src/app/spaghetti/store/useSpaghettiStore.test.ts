import { afterEach, describe, expect, it } from 'vitest'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import { OUTPUT_PREVIEW_NODE_TYPE } from '../system/outputPreviewNode'
import {
  selectActiveEditorViewport,
  selectActiveGraphDocument,
  selectActiveGraphRuntime,
  selectGraphDocumentById,
  selectGraphByDocumentId,
  selectNodeMode,
  selectOrderedEditorViewports,
  selectOrderedGraphDocuments,
  useSpaghettiStore,
} from './useSpaghettiStore'

const emptyGraph: SpaghettiGraph = {
  schemaVersion: 1,
  nodes: [],
  edges: [],
}

describe('useSpaghettiStore graph normalization', () => {
  afterEach(() => {
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
  })

  it('setGraph auto-creates OutputPreview singleton when missing', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {},
        },
      ],
      edges: [],
    }

    useSpaghettiStore.getState().setGraph(graph)
    const normalized = useSpaghettiStore.getState().graph
    const outputPreviewNodes = normalized.nodes.filter(
      (node) => node.type === OUTPUT_PREVIEW_NODE_TYPE,
    )

    expect(outputPreviewNodes).toHaveLength(1)
    expect(outputPreviewNodes[0].params).toEqual({
      slots: [{ slotId: 's001' }],
      nextSlotIndex: 2,
    })
  })

  it('keeps the active GraphDocument in sync with the canonical graph bridge', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {},
        },
      ],
      edges: [],
    }

    useSpaghettiStore.getState().setGraph(graph)

    const state = useSpaghettiStore.getState()
    const activeDocument = selectActiveGraphDocument(state)

    expect(state.activeGraphDocumentId).toBe(activeDocument.graphDocumentId)
    expect(state.graphDocumentOrder).toEqual([activeDocument.graphDocumentId])
    expect(state.graphDocumentsById[activeDocument.graphDocumentId]).toEqual(activeDocument)
    expect(activeDocument.graph).toEqual(state.graph)
  })

  it('boots with no open editor viewport until Browser opens one', () => {
    const state = useSpaghettiStore.getState()
    const activeDocument = selectActiveGraphDocument(state)
    const activeViewport = selectActiveEditorViewport(state)

    expect(activeViewport).toBeNull()
    expect(state.editorViewportOrder).toEqual([])
    expect(state.activeGraphDocumentId).toBe(activeDocument.graphDocumentId)
  })

  it('selectGraphByDocumentId resolves the document graph before any viewport is opened', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {},
        },
      ],
      edges: [],
    }

    useSpaghettiStore.getState().setGraph(graph)
    const state = useSpaghettiStore.getState()
    const activeDocument = selectActiveGraphDocument(state)

    expect(selectGraphByDocumentId(state, activeDocument.graphDocumentId)).toEqual(state.graph)
  })

  it('createGraphDocument adds a second graph document without replacing the active bridge', () => {
    const secondGraphId = useSpaghettiStore.getState().createGraphDocument(
      {
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-second-1',
            type: 'Part/Baseplate',
            params: {},
          },
        ],
        edges: [],
      },
      'Graph 2',
    )

    const state = useSpaghettiStore.getState()
    expect(selectOrderedGraphDocuments(state).map((document) => document.graphDocumentId)).toEqual([
      'graph-document-1',
      secondGraphId,
    ])
    expect(selectGraphDocumentById(state, secondGraphId)?.name).toBe('Graph 2')
    expect(state.activeGraphDocumentId).toBe('graph-document-1')
  })

  it('openGraphDocumentInViewport creates and focuses a new viewport while syncing the active graph bridge', () => {
    const secondGraphId = useSpaghettiStore.getState().createGraphDocument(
      {
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-second-1',
            type: 'Part/Baseplate',
            params: {},
          },
        ],
        edges: [],
      },
      'Graph 2',
    )

    const nextViewportId = useSpaghettiStore.getState().openGraphDocumentInViewport(secondGraphId)
    const state = useSpaghettiStore.getState()
    const orderedViewports = selectOrderedEditorViewports(state)
    const activeViewport = selectActiveEditorViewport(state)

    expect(nextViewportId).not.toBeNull()
    expect(orderedViewports).toHaveLength(1)
    expect(activeViewport?.editorViewportId).toBe(nextViewportId)
    expect(activeViewport?.graphDocumentId).toBe(secondGraphId)
    expect(state.activeGraphDocumentId).toBe(secondGraphId)
    expect(state.graph).toEqual(selectGraphByDocumentId(state, secondGraphId))
  })

  it('bindEditorViewportToGraphDocument rebinds the viewport and refreshes the active graph bridge', () => {
    const secondGraphId = useSpaghettiStore.getState().createGraphDocument(
      {
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-second-1',
            type: 'Part/Baseplate',
            params: {},
          },
        ],
        edges: [],
      },
      'Graph 2',
    )
    const activeViewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    const activeViewport = selectActiveEditorViewport(useSpaghettiStore.getState())
    expect(activeViewportId).not.toBeNull()
    expect(activeViewport).not.toBeNull()

    useSpaghettiStore
      .getState()
      .bindEditorViewportToGraphDocument(activeViewport?.editorViewportId ?? '', secondGraphId)

    const state = useSpaghettiStore.getState()
    expect(selectActiveEditorViewport(state)?.graphDocumentId).toBe(secondGraphId)
    expect(state.activeGraphDocumentId).toBe(secondGraphId)
    expect(state.graph).toEqual(selectGraphByDocumentId(state, secondGraphId))
  })

  it('stores compile/build runtime per graph document and keeps preview-prep graph-local', () => {
    const secondGraphId = useSpaghettiStore.getState().createGraphDocument(
      {
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-cube-1',
            type: 'Part/Cube',
            params: {},
          },
        ],
        edges: [],
      },
      'Graph 2',
    )

    useSpaghettiStore.getState().setGraphCompileResult('graph-document-1', {
      ok: true,
      diagnostics: { errors: [], warnings: [] },
      buildInputs: {
        instances: { heelKickInstances: [1], toeHookInstances: [1] },
        orderedPartKeys: ['baseplate'],
        resolvedParts: {},
      },
    })
    useSpaghettiStore.getState().stageGraphBuildRequest('graph-document-1', {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
          instances: { heelKickInstances: [1], toeHookInstances: [1] },
          orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_full'],
      pendingStatsPartKeys: ['baseplate', 'assembled'],
      pendingInstances: { heelKickInstances: [1], toeHookInstances: [1] },
      buildSeq: 42,
    })

    const state = useSpaghettiStore.getState()
    const firstRuntime = state.graphRuntimeByDocumentId['graph-document-1']
    const secondRuntime = state.graphRuntimeByDocumentId[secondGraphId]

    expect(firstRuntime.compileBuild.lastCompileResult?.ok).toBe(true)
    expect(firstRuntime.compileBuild.pendingStatsPartKeys).toEqual(['baseplate', 'assembled'])
    expect(firstRuntime.previewPreparation.buildStatsReadyPartKeys).toEqual(['baseplate', 'assembled'])
    expect(secondRuntime.compileBuild.lastCompileResult).toBeNull()
    expect(secondRuntime.previewPreparation.previewIntent).toBe('outputPreview')
  })

  it('acceptGraphBuildResult resolves the tracked graph document by build seq', () => {
    useSpaghettiStore.getState().stageGraphBuildRequest('graph-document-1', {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
          instances: { heelKickInstances: [1], toeHookInstances: [1] },
          orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_full'],
      pendingStatsPartKeys: ['baseplate', 'assembled'],
      pendingInstances: { heelKickInstances: [1], toeHookInstances: [1] },
      buildSeq: 99,
    })

    useSpaghettiStore.getState().acceptGraphBuildResult(99)

    const state = useSpaghettiStore.getState()
    expect(selectActiveGraphRuntime(state)?.compileBuild.lastBuildSeq).toBe(99)
    expect(state.graphDocumentIdByBuildSeq[99]).toBeUndefined()
  })

  it('closeEditorViewport falls back to the highest z-order remaining viewport', () => {
    const secondGraphId = useSpaghettiStore.getState().createGraphDocument(
      {
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-second-1',
            type: 'Part/Baseplate',
            params: {},
          },
        ],
        edges: [],
      },
      'Graph 2',
    )
    const firstViewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    const secondViewportId = useSpaghettiStore.getState().openGraphDocumentInViewport(secondGraphId)
    expect(secondViewportId).not.toBeNull()
    expect(firstViewportId).not.toBeNull()

    useSpaghettiStore.getState().setActiveEditorViewportId(firstViewportId ?? '')
    useSpaghettiStore.getState().closeEditorViewport(firstViewportId ?? '')

    const state = useSpaghettiStore.getState()
    expect(selectActiveEditorViewport(state)?.editorViewportId).toBe(secondViewportId)
    expect(state.activeGraphDocumentId).toBe(secondGraphId)
  })

  it('setNodeMode updates active graph document state', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {},
        },
      ],
      edges: [],
    }

    useSpaghettiStore.getState().setGraph(graph)
    useSpaghettiStore.getState().setNodeMode('node-baseplate-1', 'expanded')

    const state = useSpaghettiStore.getState()
    expect(selectNodeMode(state, 'node-baseplate-1')).toBe('expanded')
    expect(selectActiveGraphDocument(state).graph.ui?.nodeModesByNodeId).toEqual({
      'node-baseplate-1': 'expanded',
    })
  })

  it('setNodeMode omits default essentials entries from stored graph state', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {},
        },
      ],
      edges: [],
      ui: {
        nodeModesByNodeId: {
          'node-baseplate-1': 'expanded',
        },
      },
    }

    useSpaghettiStore.getState().setGraph(graph)
    useSpaghettiStore.getState().setNodeMode('node-baseplate-1', 'essentials')

    const state = useSpaghettiStore.getState()
    expect(selectNodeMode(state, 'node-baseplate-1')).toBe('essentials')
    expect(state.graph.ui?.nodeModesByNodeId).toBeUndefined()
  })

  it('setGraph dedupes OutputPreview nodes and removes edges referencing removed duplicates', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-output-200',
          type: OUTPUT_PREVIEW_NODE_TYPE,
          params: { slots: [{ slotId: 's001' }], nextSlotIndex: 2 },
        },
        {
          nodeId: 'node-output-010',
          type: OUTPUT_PREVIEW_NODE_TYPE,
          params: { slots: [{ slotId: 's001' }], nextSlotIndex: 2 },
        },
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'edge-remove-a',
          from: { nodeId: 'node-output-200', portId: 'out' },
          to: { nodeId: 'node-baseplate-1', portId: 'in' },
        },
        {
          edgeId: 'edge-keep',
          from: { nodeId: 'node-output-010', portId: 'out' },
          to: { nodeId: 'node-baseplate-1', portId: 'in' },
        },
      ],
    }

    useSpaghettiStore.getState().setGraph(graph)
    const normalized = useSpaghettiStore.getState().graph

    const outputPreviewNodes = normalized.nodes.filter(
      (node) => node.type === OUTPUT_PREVIEW_NODE_TYPE,
    )
    expect(outputPreviewNodes).toHaveLength(1)
    expect(outputPreviewNodes[0].nodeId).toBe('node-output-010')
    expect(normalized.edges.map((edge) => edge.edgeId)).toEqual(['edge-keep'])
  })

  it('applyGraphPatch functional delete attempt cannot remove OutputPreview singleton', () => {
    useSpaghettiStore.getState().setGraph(emptyGraph)
    const beforeDelete = useSpaghettiStore.getState().graph
    const outputPreviewNode = beforeDelete.nodes.find(
      (node) => node.type === OUTPUT_PREVIEW_NODE_TYPE,
    )
    expect(outputPreviewNode).toBeDefined()

    useSpaghettiStore.getState().applyGraphPatch((prev) => ({
      ...prev,
      nodes: prev.nodes.filter((node) => node.type !== OUTPUT_PREVIEW_NODE_TYPE),
    }))

    const afterDelete = useSpaghettiStore.getState().graph
    const outputPreviewNodes = afterDelete.nodes.filter(
      (node) => node.type === OUTPUT_PREVIEW_NODE_TYPE,
    )
    expect(outputPreviewNodes).toHaveLength(1)
  })

  it('setGraph applies OutputPreview slot normalization and auto-appends trailing empty slot', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-output-001',
          type: OUTPUT_PREVIEW_NODE_TYPE,
          params: {
            slots: [{ slotId: 's001' }],
            nextSlotIndex: 2,
          },
        },
        {
          nodeId: 'node-toehook-1',
          type: 'Part/ToeHook',
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'edge-fill-output-slot-s001',
          from: { nodeId: 'node-toehook-1', portId: 'toeLoft' },
          to: { nodeId: 'node-output-001', portId: 'in:solid:s001' },
        },
      ],
    }

    useSpaghettiStore.getState().setGraph(graph)
    const normalized = useSpaghettiStore.getState().graph
    const outputPreviewNode = normalized.nodes.find(
      (node) => node.nodeId === 'node-output-001',
    )

    expect(outputPreviewNode?.params).toEqual({
      slots: [{ slotId: 's001' }, { slotId: 's002' }],
      nextSlotIndex: 3,
    })
  })

  it('canonicalizes legacy ToeHook anchorSpline2 input port ids to anchorSpline', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {},
        },
        {
          nodeId: 'node-toehook-1',
          type: 'Part/ToeHook',
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'edge-baseplate-toehook-anchor',
          from: {
            nodeId: 'node-baseplate-1',
            portId: 'anchorSpline2',
          },
          to: {
            nodeId: 'node-toehook-1',
            portId: 'anchorSpline2',
          },
        },
      ],
    }

    useSpaghettiStore.getState().setGraph(graph)
    const normalized = useSpaghettiStore.getState().graph
    expect(normalized.edges[0]?.to.portId).toBe('anchorSpline')
    expect(normalized.edges[0]?.from.portId).toBe('anchorSpline2')
  })

  it('canonicalizes legacy HeelKick anchorSpline2 input port ids to anchorSpline', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {},
        },
        {
          nodeId: 'node-heelkick-1',
          type: 'Part/HeelKick',
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'edge-baseplate-heelkick-anchor',
          from: {
            nodeId: 'node-baseplate-1',
            portId: 'anchorSpline2',
          },
          to: {
            nodeId: 'node-heelkick-1',
            portId: 'anchorSpline2',
          },
        },
      ],
    }

    useSpaghettiStore.getState().setGraph(graph)
    const normalized = useSpaghettiStore.getState().graph
    expect(normalized.edges[0]?.to.portId).toBe('anchorSpline')
    expect(normalized.edges[0]?.from.portId).toBe('anchorSpline2')
  })

  it('normalizes missing partSlots for part nodes to the default container contract', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {},
        },
      ],
      edges: [],
    }

    useSpaghettiStore.getState().setGraph(graph)
    const normalized = useSpaghettiStore.getState().graph
    const baseplate = normalized.nodes.find((node) => node.nodeId === 'node-baseplate-1')
    expect(baseplate?.partSlots).toEqual({
      drivers: true,
      inputs: true,
      featureStack: true,
      outputs: true,
    })
  })

  it('repairs invalid partSlots shape deterministically to the default container contract', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {},
          partSlots: {
            drivers: true,
            inputs: true,
            outputs: true,
          } as unknown as SpaghettiGraph['nodes'][number]['partSlots'],
        },
      ],
      edges: [],
    }

    useSpaghettiStore.getState().setGraph(graph)
    const normalized = useSpaghettiStore.getState().graph
    const baseplate = normalized.nodes.find((node) => node.nodeId === 'node-baseplate-1')
    expect(baseplate?.partSlots).toEqual({
      drivers: true,
      inputs: true,
      featureStack: true,
      outputs: true,
    })
  })

  it('does not normalize partSlots for non-part nodes', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-primitive-number-1',
          type: 'Primitive/Number',
          params: {
            value: 1,
          },
          partSlots: {
            invalid: true,
          } as unknown as SpaghettiGraph['nodes'][number]['partSlots'],
        },
      ],
      edges: [],
    }

    useSpaghettiStore.getState().setGraph(graph)
    const normalized = useSpaghettiStore.getState().graph
    const primitive = normalized.nodes.find((node) => node.nodeId === 'node-primitive-number-1')
    expect(primitive?.partSlots).toEqual({
      invalid: true,
    })
  })

  it('silently repairs invalid partRowOrder shape for part nodes during canonicalization', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {
            partRowOrder: {
              drivers: [1, 2, 3],
            },
          } as unknown as Record<string, unknown>,
        },
      ],
      edges: [],
    }

    useSpaghettiStore.getState().setGraph(graph)
    const normalized = useSpaghettiStore.getState().graph
    const baseplate = normalized.nodes.find((node) => node.nodeId === 'node-baseplate-1')
    expect(baseplate?.params.partRowOrder).toBeUndefined()
  })

  it('does not normalize partRowOrder for non-part nodes', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-primitive-number-2',
          type: 'Primitive/Number',
          params: {
            value: 1,
            partRowOrder: {
              drivers: [1, 2, 3],
            },
          } as unknown as Record<string, unknown>,
        },
      ],
      edges: [],
    }

    useSpaghettiStore.getState().setGraph(graph)
    const normalized = useSpaghettiStore.getState().graph
    const primitive = normalized.nodes.find((node) => node.nodeId === 'node-primitive-number-2')
    expect(primitive?.params.partRowOrder).toEqual({
      drivers: [1, 2, 3],
    })
  })

  it('initializes offset metadata for numeric drivers when first driven', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-source-mm',
          type: 'Utility/IdentityNumberMm',
          params: {},
        },
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {
            widthMm: 30,
            lengthMm: 200,
          },
        },
      ],
      edges: [
        {
          edgeId: 'edge-drive-width',
          from: { nodeId: 'node-source-mm', portId: 'out' },
          to: { nodeId: 'node-baseplate-1', portId: 'in:drv:widthMm' },
        },
      ],
    }

    useSpaghettiStore.getState().setGraph(graph)
    const normalized = useSpaghettiStore.getState().graph
    const baseplate = normalized.nodes.find((node) => node.nodeId === 'node-baseplate-1')
    expect(baseplate?.params.driverOffsetByParamId).toEqual({
      widthMm: 0,
    })
    expect(baseplate?.params.driverDrivenByParamId).toEqual({
      widthMm: true,
    })
  })

  it('preserves existing numeric driver offsets while normalizing driven metadata', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-source-mm',
          type: 'Utility/IdentityNumberMm',
          params: {},
        },
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {
            widthMm: 30,
            lengthMm: 200,
            driverOffsetByParamId: {
              widthMm: 2.5,
            },
          },
        },
      ],
      edges: [
        {
          edgeId: 'edge-drive-width',
          from: { nodeId: 'node-source-mm', portId: 'out' },
          to: { nodeId: 'node-baseplate-1', portId: 'in:drv:widthMm' },
        },
      ],
    }

    useSpaghettiStore.getState().setGraph(graph)
    const normalized = useSpaghettiStore.getState().graph
    const baseplate = normalized.nodes.find((node) => node.nodeId === 'node-baseplate-1')
    expect(baseplate?.params.driverOffsetByParamId).toEqual({
      widthMm: 2.5,
    })
    expect(baseplate?.params.driverDrivenByParamId).toEqual({
      widthMm: true,
    })
  })

  it('keeps stored offset but clears driven marker when numeric driver disconnects', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {
            widthMm: 30,
            lengthMm: 200,
            driverOffsetByParamId: {
              widthMm: 4,
            },
            driverDrivenByParamId: {
              widthMm: true,
            },
          },
        },
      ],
      edges: [],
    }

    useSpaghettiStore.getState().setGraph(graph)
    const normalized = useSpaghettiStore.getState().graph
    const baseplate = normalized.nodes.find((node) => node.nodeId === 'node-baseplate-1')
    expect(baseplate?.params.driverOffsetByParamId).toEqual({
      widthMm: 4,
    })
    expect(baseplate?.params.driverDrivenByParamId).toBeUndefined()
  })

  it('does not create offset metadata for non-numeric driven drivers', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-source-vec2',
          type: 'Primitive/Vec2',
          params: {
            x: 1,
            y: 2,
            unit: 'unitless',
          },
        },
        {
          nodeId: 'node-toehook-1',
          type: 'Part/ToeHook',
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'edge-drive-vec2',
          from: { nodeId: 'node-source-vec2', portId: 'value' },
          to: { nodeId: 'node-toehook-1', portId: 'in:drv:profileA_end' },
        },
      ],
    }

    useSpaghettiStore.getState().setGraph(graph)
    const normalized = useSpaghettiStore.getState().graph
    const toeHook = normalized.nodes.find((node) => node.nodeId === 'node-toehook-1')
    expect(toeHook?.params.driverOffsetByParamId).toBeUndefined()
    expect(toeHook?.params.driverDrivenByParamId).toBeUndefined()
  })
})

describe('useSpaghettiStore feature stack editing semantics', () => {
  afterEach(() => {
    useSpaghettiStore.getState().setGraph(emptyGraph)
  })

  it('reorders independent features deterministically', () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {
            featureStack: [
              {
                type: 'sketch',
                featureId: 'feature-sketch-1',
                plane: 'XY',
                components: [],
                outputs: { profiles: [] },
                uiState: { collapsed: false },
              },
              {
                type: 'sketch',
                featureId: 'feature-sketch-2',
                plane: 'XY',
                components: [],
                outputs: { profiles: [] },
                uiState: { collapsed: false },
              },
            ],
          },
        },
      ],
      edges: [],
    })

    useSpaghettiStore.getState().moveFeatureUp('node-baseplate-1', 'feature-sketch-2')
    const baseplate = useSpaghettiStore.getState().graph.nodes.find((node) => node.nodeId === 'node-baseplate-1')
    expect((baseplate?.params.featureStack as Array<{ featureId: string }>).map((feature) => feature.featureId)).toEqual([
      'feature-sketch-2',
      'feature-sketch-1',
    ])
  })

  it('prevents dependency-breaking feature reorders at the store boundary', () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {
            featureStack: [
              {
                type: 'sketch',
                featureId: 'feature-sketch-1',
                plane: 'XY',
                components: [],
                outputs: {
                  profiles: [
                    {
                      profileId: 'profile-1',
                      profileIndex: 0,
                      area: 1,
                      loop: { segments: [], winding: 'CCW' },
                      verticesProxy: [],
                    },
                  ],
                },
                uiState: { collapsed: false },
              },
              {
                type: 'extrude',
                featureId: 'feature-extrude-1',
                inputs: {
                  profileRef: {
                    sourceFeatureId: 'feature-sketch-1',
                    profileId: 'profile-1',
                    profileIndex: 0,
                  },
                },
                params: {
                  depth: { kind: 'lit', value: 10 },
                },
                outputs: { bodyId: 'body-1' },
                uiState: { collapsed: false },
              },
            ],
          },
        },
      ],
      edges: [],
    })

    useSpaghettiStore.getState().moveFeatureUp('node-baseplate-1', 'feature-extrude-1')
    const baseplate = useSpaghettiStore.getState().graph.nodes.find((node) => node.nodeId === 'node-baseplate-1')
    expect((baseplate?.params.featureStack as Array<{ featureId: string }>).map((feature) => feature.featureId)).toEqual([
      'feature-sketch-1',
      'feature-extrude-1',
    ])
  })

  it('toggles feature enabled state deterministically', () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {
            featureStack: [
              {
                type: 'extrude',
                featureId: 'feature-extrude-1',
                inputs: { profileRef: null },
                params: {
                  depth: { kind: 'lit', value: 10 },
                },
                outputs: { bodyId: 'body-1' },
                uiState: { collapsed: false },
              },
            ],
          },
        },
      ],
      edges: [],
    })

    useSpaghettiStore.getState().setFeatureEnabled('node-baseplate-1', 'feature-extrude-1', false)
    useSpaghettiStore.getState().setFeatureEnabled('node-baseplate-1', 'feature-extrude-1', false)
    let baseplate = useSpaghettiStore.getState().graph.nodes.find((node) => node.nodeId === 'node-baseplate-1')
    expect((baseplate?.params.featureStack as Array<{ enabled?: boolean }>)[0]?.enabled).toBe(false)

    useSpaghettiStore.getState().setFeatureEnabled('node-baseplate-1', 'feature-extrude-1', true)
    baseplate = useSpaghettiStore.getState().graph.nodes.find((node) => node.nodeId === 'node-baseplate-1')
    expect((baseplate?.params.featureStack as Array<{ enabled?: boolean }>)[0]?.enabled).toBe(true)
  })
})
