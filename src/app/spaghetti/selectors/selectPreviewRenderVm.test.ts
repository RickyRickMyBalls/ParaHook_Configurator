import { describe, expect, it } from 'vitest'
import type { PartArtifact } from '../../../shared/buildTypes'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import { getDefaultNodeParams } from '../registry/nodeRegistry'
import { OUTPUT_PREVIEW_NODE_TYPE } from '../system/outputPreviewNode'
import { selectPreviewRenderVm } from './selectPreviewRenderVm'

const outputPreviewNode = (slotIds: string[]) => ({
  nodeId: 'node-output-preview-1',
  type: OUTPUT_PREVIEW_NODE_TYPE,
  params: {
    slots: slotIds.map((slotId) => ({ slotId })),
    nextSlotIndex: slotIds.length + 1,
  },
})

const graph: SpaghettiGraph = {
  schemaVersion: 1,
  nodes: [
    outputPreviewNode(['s001', 's002']),
    { nodeId: 'node-toe', type: 'Part/ToeHook', params: {} },
  ],
  edges: [
    {
      edgeId: 'edge-1',
      from: { nodeId: 'node-toe', portId: 'toeLoft' },
      to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s001' },
    },
  ],
}

const outputs: PartArtifact[] = [
  {
    id: 'toeHook',
    label: 'Toe Hook',
    kind: 'box',
    params: { width: 10, length: 20, height: 5 },
    partKeyStr: 'toeHook#1',
    partKey: { id: 'toeHook', instance: 1 },
  },
]

const cubeGraph: SpaghettiGraph = {
  schemaVersion: 1,
  nodes: [
    outputPreviewNode(['s001']),
    {
      nodeId: 'node-cube',
      type: 'Part/Cube',
      params: getDefaultNodeParams('Part/Cube'),
    },
  ],
  edges: [
    {
      edgeId: 'edge-cube',
      from: { nodeId: 'node-cube', portId: 'solid' },
      to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s001' },
    },
  ],
}

const multiCubeGraph: SpaghettiGraph = {
  schemaVersion: 1,
  nodes: [
    outputPreviewNode(['s010', 's020', 's030']),
    {
      nodeId: 'node-cube-2',
      type: 'Part/Cube',
      params: getDefaultNodeParams('Part/Cube'),
    },
    {
      nodeId: 'node-cube-1',
      type: 'Part/Cube',
      params: getDefaultNodeParams('Part/Cube'),
    },
  ],
  edges: [
    {
      edgeId: 'edge-cube-2',
      from: { nodeId: 'node-cube-2', portId: 'solid' },
      to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s010' },
    },
    {
      edgeId: 'edge-cube-1',
      from: { nodeId: 'node-cube-1', portId: 'solid' },
      to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s020' },
    },
  ],
}

const cubeArtifact: PartArtifact = {
  id: 'cube',
  label: 'Cube',
  kind: 'box',
  params: { width: 20, length: 20, height: 20 },
  partKeyStr: 'cube',
  partKey: { id: 'cube', instance: null },
}

const cubeArtifact1: PartArtifact = {
  id: 'cube',
  label: 'Cube #1',
  kind: 'box',
  params: { width: 20, length: 20, height: 20 },
  partKeyStr: 'cube#1',
  partKey: { id: 'cube', instance: 1 },
}

const cubeArtifact2: PartArtifact = {
  id: 'cube',
  label: 'Cube #2',
  kind: 'box',
  params: { width: 20, length: 20, height: 20 },
  partKeyStr: 'cube#2',
  partKey: { id: 'cube', instance: 2 },
}

describe('selectPreviewRenderVm', () => {
  it('keeps valid connected slots and adds isReady metadata', () => {
    const vm = selectPreviewRenderVm(graph, outputs)
    expect(vm.items).toHaveLength(1)
    expect(vm.items[0]?.slotId).toBe('s001')
    expect(vm.items[0]?.nodeId).toBe('node-toe')
    expect(vm.items[0]?.isReady).toBe(true)
    expect(vm.items[0]?.sourcePartKeyStr).toBe('toeHook#1')
    expect(vm.items[0]?.viewerKey).toBe('s001')
    expect(vm.viewerParts[0]?.viewerKey).toBe('s001')
    expect(vm.viewerParts[0]?.artifact.partKeyStr).toBe('toeHook#1')
  })

  it('skips unresolved slots during preview rendering', () => {
    const unresolvedGraph: SpaghettiGraph = {
      ...graph,
      edges: [
        {
          edgeId: 'edge-unresolved',
          from: { nodeId: 'node-toe', portId: 'missingPort' },
          to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s001' },
        },
      ],
    }

    const vm = selectPreviewRenderVm(unresolvedGraph, outputs)
    expect(vm.items).toEqual([])
    expect(vm.viewerParts).toEqual([])
  })

  it('includes one cube render item when the cube part is connected', () => {
    const vm = selectPreviewRenderVm(cubeGraph, [cubeArtifact])
    expect(vm.items).toHaveLength(1)
    expect(vm.items[0]?.nodeId).toBe('node-cube')
    expect(vm.items[0]?.sourcePortId).toBe('solid')
    expect(vm.items[0]?.sourcePartKeyStr).toBe('cube')
    expect(vm.items[0]?.viewerPart?.viewerKey).toBe('s001')
    expect(vm.items[0]?.viewerPart?.artifact.partKeyStr).toBe('cube')
    expect(vm.viewerParts).toHaveLength(1)
  })

  it('keeps the cube slot out of viewerParts when the artifact is missing', () => {
    const vm = selectPreviewRenderVm(cubeGraph, [])
    expect(vm.items).toHaveLength(1)
    expect(vm.items[0]?.isReady).toBe(false)
    expect(vm.items[0]?.viewerPart).toBeNull()
    expect(vm.viewerParts).toEqual([])
  })

  it('skips cube preview rendering when a connected cube dimension wire is invalid', () => {
    const unresolvedCubeGraph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        outputPreviewNode(['s001']),
        {
          nodeId: 'node-cube',
          type: 'Part/Cube',
          params: getDefaultNodeParams('Part/Cube'),
        },
        {
          nodeId: 'node-number',
          type: 'Utility/IdentityNumberMm',
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'edge-cube-preview',
          from: { nodeId: 'node-cube', portId: 'solid' },
          to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s001' },
        },
        {
          edgeId: 'edge-cube-width-invalid',
          from: { nodeId: 'node-number', portId: 'out' },
          to: { nodeId: 'node-cube', portId: 'fs:in:cube-sketch-1:sketchRect:width' },
        },
      ],
    }

    const vm = selectPreviewRenderVm(unresolvedCubeGraph, [cubeArtifact])
    expect(vm.items).toEqual([])
    expect(vm.viewerParts).toEqual([])
  })

  it('keeps multi-slot preview identity slot-scoped while resolving distinct multi-part artifacts', () => {
    const vm = selectPreviewRenderVm(multiCubeGraph, [cubeArtifact2, cubeArtifact1])

    expect(vm.items.map((item) => item.slotId)).toEqual(['s010', 's020'])
    expect(vm.items.map((item) => item.sourcePartKeyStr)).toEqual(['cube#2', 'cube#1'])
    expect(vm.items.map((item) => item.viewerKey)).toEqual(['s010', 's020'])
    expect(vm.viewerParts.map((item) => item.viewerKey)).toEqual(['s010', 's020'])
    expect(vm.viewerParts.map((item) => item.artifact.partKeyStr)).toEqual(['cube#2', 'cube#1'])
  })

  it('is deterministic for the same inputs', () => {
    const first = selectPreviewRenderVm(graph, outputs)
    const second = selectPreviewRenderVm(graph, outputs)
    expect(first).toEqual(second)
    expect(second).toBe(first)
  })

  it('matches stable PreviewRenderVm contract snapshot', () => {
    expect(selectPreviewRenderVm(graph, outputs)).toMatchSnapshot()
  })
})
