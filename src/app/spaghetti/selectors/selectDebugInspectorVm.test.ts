import { describe, expect, it } from 'vitest'
import type { PartArtifact } from '../../../shared/buildTypes'
import { buildGraphOutputSurface } from '../outputSurface'
import { prepareGraphPreviewPreparation } from '../previewPreparation'
import { getDefaultNodeParams } from '../registry/nodeRegistry'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import type { SketchFeature } from '../features/featureTypes'
import { OUTPUT_PREVIEW_NODE_TYPE } from '../system/outputPreviewNode'
import { selectDebugInspectorVm } from './selectDebugInspectorVm'

const outputPreviewNode = (slotIds: string[]) => ({
  nodeId: 'node-output-preview-1',
  type: OUTPUT_PREVIEW_NODE_TYPE,
  params: {
    slots: slotIds.map((slotId) => ({ slotId })),
    nextSlotIndex: slotIds.length + 1,
  },
})

const createSketchFeature = (
  components: SketchFeature['components'] = [],
): SketchFeature => ({
  type: 'sketch',
  featureId: 'sketch-1',
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

const lineComponent = (
  rowId: string,
  componentId: string,
  start: { x: number; y: number },
  end: { x: number; y: number },
): SketchFeature['components'][number] => ({
  rowId,
  componentId,
  type: 'line',
  a: { kind: 'lit', x: start.x, y: start.y },
  b: { kind: 'lit', x: end.x, y: end.y },
})

const cubeGraph: SpaghettiGraph = {
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

const extrudeGraph: SpaghettiGraph = {
  schemaVersion: 1,
  nodes: [
    outputPreviewNode(['s001']),
    {
      nodeId: 'node-sketch-1',
      type: 'Geometry/Sketch',
      params: {
        sketch: createSketchFeature([
          lineComponent('row-1', 'e1', { x: 0, y: 0 }, { x: 100, y: 0 }),
          lineComponent('row-2', 'e2', { x: 100, y: 0 }, { x: 100, y: 50 }),
          lineComponent('row-3', 'e3', { x: 100, y: 50 }, { x: 0, y: 50 }),
          lineComponent('row-4', 'e4', { x: 0, y: 50 }, { x: 0, y: 0 }),
        ]),
      },
    },
    {
      nodeId: 'node-extrude-1',
      type: 'Geometry/Extrude',
      params: {
        extrudeType: 'Basic',
        depthMm: 25,
      },
    },
  ],
  edges: [
    {
      edgeId: 'edge-sketch-to-extrude',
      from: { nodeId: 'node-sketch-1', portId: 'SketchProfile' },
      to: { nodeId: 'node-extrude-1', portId: 'ExtrusionProfile' },
    },
    {
      edgeId: 'edge-extrude-to-output-preview',
      from: { nodeId: 'node-extrude-1', portId: 'SolidBody' },
      to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s001' },
    },
  ],
}

const extrudeArtifact: PartArtifact = {
  id: 'extrude',
  label: 'Extrude',
  kind: 'box',
  params: { width: 100, length: 50, height: 25 },
  partKeyStr: 'extrude',
  partKey: { id: 'extrude', instance: null },
}

describe('selectDebugInspectorVm', () => {
  it('builds deterministic compile, OutputPreview, preview VM, and viewer sections', () => {
    const outputSurface = buildGraphOutputSurface({
      graphDocumentId: 'graph-document-test',
      previewPreparation: prepareGraphPreviewPreparation(cubeGraph),
      acceptedBuildOutputs: [cubeArtifact2, cubeArtifact1],
      publishedAtBuildSeq: 9,
    })
    const vm = selectDebugInspectorVm({
      graph: cubeGraph,
      outputSurface,
      buildOutputs: [cubeArtifact2, cubeArtifact1],
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        evaluation: { topoOrder: ['node-cube-1', 'node-cube-2', 'node-output-preview-1'] },
        buildInputs: {
          orderedPartKeys: ['cube#1', 'cube#2'],
          resolvedParts: {},
        },
      },
    })

    expect(vm.compile.compiledArtifactsCount).toBe(2)
    expect(vm.compile.orderedPartKeys).toEqual(['cube#1', 'cube#2'])
    expect(vm.compile.artifacts.map((artifact) => artifact.partKeyStr)).toEqual(['cube#2', 'cube#1'])

    expect(vm.outputPreview.slots).toEqual([
      {
        slotId: 's010',
        state: 'resolved',
        sourceNodeId: 'node-cube-2',
        sourcePartKeyStr: 'cube#2',
        artifactPartKeyStr: 'cube#2',
      },
      {
        slotId: 's020',
        state: 'resolved',
        sourceNodeId: 'node-cube-1',
        sourcePartKeyStr: 'cube#1',
        artifactPartKeyStr: 'cube#1',
      },
      {
        slotId: 's030',
        state: 'empty',
        sourceNodeId: null,
        sourcePartKeyStr: null,
        artifactPartKeyStr: null,
      },
    ])

    expect(vm.previewVm.entries).toEqual([
      {
        viewerKey: 's010',
        slotId: 's010',
        sourceNodeId: 'node-cube-2',
        sourcePartKeyStr: 'cube#2',
        sourceArtifactId: 'cube',
        sourceArtifactPartKeyStr: 'cube#2',
      },
      {
        viewerKey: 's020',
        slotId: 's020',
        sourceNodeId: 'node-cube-1',
        sourcePartKeyStr: 'cube#1',
        sourceArtifactId: 'cube',
        sourceArtifactPartKeyStr: 'cube#1',
      },
    ])

    expect(vm.viewer.receivesPreviewInput).toBe(true)
    expect(vm.viewer.entries).toEqual([
      {
        viewerKey: 's010',
        artifactId: 'cube',
        artifactLabel: 'Cube #2',
        artifactPartKey: 'cube#2',
        artifactPartKeyStr: 'cube#2',
      },
      {
        viewerKey: 's020',
        artifactId: 'cube',
        artifactLabel: 'Cube #1',
        artifactPartKey: 'cube#1',
        artifactPartKeyStr: 'cube#1',
      },
    ])
  })

  it('always reports the viewer as receiving preview input', () => {
    const vm = selectDebugInspectorVm({
      graph: cubeGraph,
      outputSurface: buildGraphOutputSurface({
        graphDocumentId: 'graph-document-test',
        previewPreparation: prepareGraphPreviewPreparation(cubeGraph),
        acceptedBuildOutputs: [cubeArtifact2, cubeArtifact1],
        publishedAtBuildSeq: 9,
      }),
      buildOutputs: [cubeArtifact2, cubeArtifact1],
      compileResult: null,
    })

    expect(vm.viewer.receivesPreviewInput).toBe(true)
    expect(vm.viewer.renderableEntryCount).toBe(2)
    expect(vm.viewer.reason).toBe('ViewerHost is receiving spaghetti preview input.')
  })

  it('is deterministic across repeated calls with identical inputs', () => {
    const outputSurface = buildGraphOutputSurface({
      graphDocumentId: 'graph-document-test',
      previewPreparation: prepareGraphPreviewPreparation(cubeGraph),
      acceptedBuildOutputs: [cubeArtifact2, cubeArtifact1],
      publishedAtBuildSeq: 9,
    })
    const first = selectDebugInspectorVm({
      graph: cubeGraph,
      outputSurface,
      buildOutputs: [cubeArtifact2, cubeArtifact1],
      compileResult: null,
    })
    const second = selectDebugInspectorVm({
      graph: cubeGraph,
      outputSurface,
      buildOutputs: [cubeArtifact2, cubeArtifact1],
      compileResult: null,
    })

    expect(second).toEqual(first)
  })

  it('keeps OutputPreview slot normalization stable when a slot is fed by solidBodies from Geometry/Extrude', () => {
    const previewPreparation = prepareGraphPreviewPreparation(extrudeGraph)
    const outputSurface = buildGraphOutputSurface({
      graphDocumentId: 'graph-document-extrude',
      previewPreparation,
      acceptedBuildOutputs: [extrudeArtifact],
      publishedAtBuildSeq: 3,
    })
    const vm = selectDebugInspectorVm({
      graph: extrudeGraph,
      outputSurface,
      buildOutputs: [extrudeArtifact],
      compileResult: null,
    })

    expect(vm.outputPreview.slots).toEqual([
      {
        slotId: 's001',
        state: 'resolved',
        sourceNodeId: 'node-extrude-1',
        sourcePartKeyStr: 'extrude',
        artifactPartKeyStr: 'extrude',
      },
    ])
    expect(vm.previewVm.entries).toEqual([
      {
        viewerKey: 's001',
        slotId: 's001',
        sourceNodeId: 'node-extrude-1',
        sourcePartKeyStr: 'extrude',
        sourceArtifactId: 'extrude',
        sourceArtifactPartKeyStr: 'extrude',
      },
    ])
    expect(vm.viewer.entries).toEqual([
      {
        viewerKey: 's001',
        artifactId: 'extrude',
        artifactLabel: 'Extrude',
        artifactPartKey: 'extrude',
        artifactPartKeyStr: 'extrude',
      },
    ])
  })
})

