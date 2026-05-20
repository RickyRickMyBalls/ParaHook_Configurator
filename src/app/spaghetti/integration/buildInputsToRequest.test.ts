import { describe, expect, it } from 'vitest'
import { compileSpaghettiGraph } from '../compiler/compileGraph'
import { buildExtrudeBodyMemberPortId } from '../features/extrudeBodyVirtualPorts'
import {
  buildRequestFromBuildInputs,
  type SpaghettiBuildInputs,
} from './buildInputsToRequest'
import { prepareGraphPreviewPreparation } from '../previewPreparation'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import { OUTPUT_PREVIEW_NODE_TYPE } from '../system/outputPreviewNode'
import type { GraphPreviewPreparation } from '../previewPreparation'

const cubeBuildInputs = (): SpaghettiBuildInputs => ({
  orderedPartKeys: ['cube'],
  resolvedParts: {},
  resolvedShared: {
    sp_featureStackIR: {
      schemaVersion: 1,
      parts: {
        cube: [],
      },
    },
  },
})

const previewPreparation = (): GraphPreviewPreparation => ({
  outputPreviewNodeId: 'node-output-preview',
  outputSlotIds: ['s001', 's002'],
  previewCandidateSlotIds: ['s001'],
  previewCandidatePartKeys: ['cube'],
  sourceNodeIdBySlotId: {
    s001: 'node-cube',
  },
  sourcePartKeyBySlotId: {
    s001: 'cube',
  },
  sourcePortIdBySlotId: {
    s001: 'SolidBody',
  },
  sourcePartKeyByNodeId: {
    'node-cube': 'cube',
  },
  slotStatusBySlotId: {
    s001: 'ok',
    s002: 'empty',
  },
  buildStatsReadyPartKeys: [],
  previewIntent: 'outputPreview',
})

const extrudeBuildInputs = (): SpaghettiBuildInputs => ({
  orderedPartKeys: ['extrude#1', 'extrude#2'],
  resolvedParts: {},
  resolvedShared: {
    sp_featureStackIR: {
      schemaVersion: 1,
      parts: {
        'extrude#1': [{ op: 'extrude', featureId: 'node-extrude-1' }],
        'extrude#2': [{ op: 'extrude', featureId: 'node-extrude-2' }],
      },
    },
  },
})

const createSketchFeature = (
  components: Array<Record<string, unknown>>,
): Record<string, unknown> => ({
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

const rectangleComponent = (
  rowId: string,
  componentId: string,
  a: { x: number; y: number },
  b: { x: number; y: number },
): Record<string, unknown> => ({
  rowId,
  componentId,
  type: 'rectangle',
  a: { kind: 'lit', x: a.x, y: a.y },
  b: { kind: 'lit', x: b.x, y: b.y },
})

const createSingularOnlySameRowOutputPreviewGraph = (): SpaghettiGraph => ({
  schemaVersion: 1,
  nodes: [
    {
      nodeId: 'node-sketch-1',
      type: 'Geometry/Sketch',
      params: {
        sketch: createSketchFeature([
          rectangleComponent('row-1', 'rect-a', { x: 0, y: 0 }, { x: 40, y: 20 }),
          rectangleComponent('row-2', 'rect-b', { x: 60, y: 0 }, { x: 100, y: 20 }),
        ]),
      },
    },
    {
      nodeId: 'node-extrude-1',
      type: 'Geometry/Extrude',
      params: {
        bodyGenerationMode: 'NewObjects',
        depthMm: 25,
      },
    },
    {
      nodeId: 'node-output-preview-1',
      type: OUTPUT_PREVIEW_NODE_TYPE,
      params: {
        slots: [{ slotId: 's001', publicationMode: 'grouped' }],
        objects: [
          {
            objectId: 'output-object:s001',
            slotId: 's001',
            label: 'Pedal Body',
            orderIndex: 0,
          },
        ],
        nextSlotIndex: 2,
      },
    },
  ],
  edges: [
    {
      edgeId: 'edge-sketch-to-extrude',
      from: {
        nodeId: 'node-sketch-1',
        portId: 'SketchProfiles',
      },
      to: {
        nodeId: 'node-extrude-1',
        portId: 'ExtrusionProfile',
      },
    },
    {
      edgeId: 'edge-extrude-member-1-to-output-preview',
      from: { nodeId: 'node-extrude-1', portId: buildExtrudeBodyMemberPortId(0) },
      to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s001' },
    },
    {
      edgeId: 'edge-extrude-member-2-to-output-preview',
      from: { nodeId: 'node-extrude-1', portId: buildExtrudeBodyMemberPortId(1) },
      to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s001' },
    },
  ],
})

const createMixedSameRowOutputPreviewGraph = (): SpaghettiGraph => ({
  schemaVersion: 1,
  nodes: [
    {
      nodeId: 'node-sketch-1',
      type: 'Geometry/Sketch',
      params: {
        sketch: createSketchFeature([
          rectangleComponent('row-1', 'rect-a', { x: 0, y: 0 }, { x: 40, y: 20 }),
          rectangleComponent('row-2', 'rect-b', { x: 60, y: 0 }, { x: 100, y: 20 }),
        ]),
      },
    },
    {
      nodeId: 'node-extrude-1',
      type: 'Geometry/Extrude',
      params: {
        bodyGenerationMode: 'NewObjects',
        depthMm: 25,
      },
    },
    {
      nodeId: 'node-output-preview-1',
      type: OUTPUT_PREVIEW_NODE_TYPE,
      params: {
        slots: [{ slotId: 's001', publicationMode: 'grouped' }],
        objects: [
          {
            objectId: 'output-object:s001',
            slotId: 's001',
            label: 'Pedal Body',
            orderIndex: 0,
          },
        ],
        nextSlotIndex: 2,
      },
    },
  ],
  edges: [
    {
      edgeId: 'edge-sketch-to-extrude',
      from: {
        nodeId: 'node-sketch-1',
        portId: 'SketchProfiles',
      },
      to: {
        nodeId: 'node-extrude-1',
        portId: 'ExtrusionProfile',
      },
    },
    {
      edgeId: 'edge-extrude-whole-to-output-preview',
      from: { nodeId: 'node-extrude-1', portId: 'SolidBody' },
      to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s001' },
    },
    {
      edgeId: 'edge-extrude-member-1-to-output-preview',
      from: { nodeId: 'node-extrude-1', portId: buildExtrudeBodyMemberPortId(0) },
      to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s001' },
    },
  ],
})

const createParallelExtrudeOutputPreviewGraph = (options?: {
  extrudeOneDepthMm?: number
  extrudeTwoDepthMm?: number
  sketchWidth?: number
}): SpaghettiGraph => ({
  schemaVersion: 1,
  nodes: [
    {
      nodeId: 'node-sketch-1',
      type: 'Geometry/Sketch',
      params: {
        sketch: createSketchFeature([
          rectangleComponent(
            'row-1',
            'rect-a',
            { x: 0, y: 0 },
            { x: options?.sketchWidth ?? 40, y: 20 },
          ),
        ]),
      },
    },
    {
      nodeId: 'node-extrude-1',
      type: 'Geometry/Extrude',
      params: {
        depthMm: options?.extrudeOneDepthMm ?? 20,
      },
    },
    {
      nodeId: 'node-extrude-2',
      type: 'Geometry/Extrude',
      params: {
        depthMm: options?.extrudeTwoDepthMm ?? 30,
      },
    },
    {
      nodeId: 'node-output-preview-1',
      type: OUTPUT_PREVIEW_NODE_TYPE,
      params: {
        slots: [
          { slotId: 's001', publicationMode: 'grouped' },
          { slotId: 's002', publicationMode: 'grouped' },
        ],
        objects: [
          {
            objectId: 'output-object:s001',
            slotId: 's001',
            label: 'Object 1',
            orderIndex: 0,
          },
          {
            objectId: 'output-object:s002',
            slotId: 's002',
            label: 'Object 2',
            orderIndex: 1,
          },
        ],
        nextSlotIndex: 3,
      },
    },
  ],
  edges: [
    {
      edgeId: 'edge-sketch-to-extrude-1',
      from: {
        nodeId: 'node-sketch-1',
        portId: 'SketchProfiles',
      },
      to: {
        nodeId: 'node-extrude-1',
        portId: 'ExtrusionProfile',
      },
    },
    {
      edgeId: 'edge-sketch-to-extrude-2',
      from: {
        nodeId: 'node-sketch-1',
        portId: 'SketchProfiles',
      },
      to: {
        nodeId: 'node-extrude-2',
        portId: 'ExtrusionProfile',
      },
    },
    {
      edgeId: 'edge-extrude-1-to-output-preview',
      from: { nodeId: 'node-extrude-1', portId: 'SolidBody' },
      to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s001' },
    },
    {
      edgeId: 'edge-extrude-2-to-output-preview',
      from: { nodeId: 'node-extrude-2', portId: 'SolidBody' },
      to: { nodeId: 'node-output-preview-1', portId: 'in:solid:s002' },
    },
  ],
})

describe('buildRequestFromBuildInputs', () => {
  it('builds graph-native compiled build data plus output-entry build units', () => {
    expect(buildRequestFromBuildInputs(cubeBuildInputs(), previewPreparation())).toEqual({
      compiledBuildData: {
        orderedPartKeys: ['cube'],
        resolvedParts: {},
        resolvedShared: {
          sp_featureStackIR: {
            schemaVersion: 1,
            parts: {
              cube: [],
            },
          },
        },
        outputEntries: [
          {
            buildUnitId: 'output-entry:s001:node-cube',
            outputEntryId: 'output-entry:s001:node-cube',
            sourceNodeId: 'node-cube',
            partKey: 'cube',
            bodyId: null,
          },
        ],
      },
      targetBuildUnitIds: ['output-entry:s001:node-cube'],
      affectedBuildUnitIds: ['output-entry:s001:node-cube'],
      changedParamIds: ['sp_full'],
      buildStatsPartKeys: ['cube'],
    })
  })

  it('excludes empty output-preview slots from build-unit targeting', () => {
    const translated = buildRequestFromBuildInputs(cubeBuildInputs(), previewPreparation())

    expect(translated.targetBuildUnitIds).toEqual(['output-entry:s001:node-cube'])
    expect(translated.affectedBuildUnitIds).toEqual(['output-entry:s001:node-cube'])
    expect(translated.targetBuildUnitIds).not.toContain('output-entry:s002:unbound')
  })

  it('keeps repeated spaghetti build translation deterministic', () => {
    const current = cubeBuildInputs()
    const first = buildRequestFromBuildInputs(current, previewPreparation())
    const second = buildRequestFromBuildInputs(current, previewPreparation(), current)

    expect(first.buildStatsPartKeys).toEqual(['cube'])
    expect(second.buildStatsPartKeys).toEqual(['cube'])
    expect(second.changedParamIds).toEqual([])
    expect(second.targetBuildUnitIds).toEqual(['output-entry:s001:node-cube'])
  })

  it('uses compile-owned ordered part keys for deterministic multi-part stats rows', () => {
    const buildInputs: SpaghettiBuildInputs = {
      orderedPartKeys: ['cube#2', 'cube#1'],
      resolvedParts: {},
      resolvedShared: {
        sp_featureStackIR: {
          schemaVersion: 1,
          parts: {
            'cube#2': [],
            'cube#1': [],
          },
        },
      },
    }

    expect(
      buildRequestFromBuildInputs(buildInputs, previewPreparation()).buildStatsPartKeys,
    ).toEqual([
      'cube#1',
      'cube#2',
    ])
  })

  it('drops authored extrudes that are not wired into output preview from worker-facing build data', () => {
    const translated = buildRequestFromBuildInputs(extrudeBuildInputs(), {
      ...previewPreparation(),
      outputSlotIds: [],
      previewCandidateSlotIds: [],
      previewCandidatePartKeys: [],
      sourceNodeIdBySlotId: {},
      sourcePartKeyBySlotId: {},
      sourcePortIdBySlotId: {},
      sourcePartKeyByNodeId: {},
      slotStatusBySlotId: {},
    })

    expect(translated.compiledBuildData.orderedPartKeys).toEqual([])
    expect(translated.buildStatsPartKeys).toEqual([])
    expect(translated.compiledBuildData.resolvedShared?.sp_featureStackIR).toEqual({
      schemaVersion: 1,
      parts: {},
    })
  })

  it('keeps unresolved output-preview extrudes out of the required worker part list', () => {
    const translated = buildRequestFromBuildInputs(extrudeBuildInputs(), {
      ...previewPreparation(),
      outputSlotIds: ['s001'],
      previewCandidateSlotIds: ['s001'],
      previewCandidatePartKeys: ['extrude#2'],
      sourceNodeIdBySlotId: {
        s001: 'node-extrude-2',
      },
      sourcePartKeyBySlotId: {
        s001: 'extrude#2',
      },
      sourcePortIdBySlotId: {
        s001: 'SolidBody',
      },
      sourcePartKeyByNodeId: {
        'node-extrude-2': 'extrude#2',
      },
      slotStatusBySlotId: {
        s001: 'unresolved',
      },
    })

    expect(translated.compiledBuildData.orderedPartKeys).toEqual([])
    expect(translated.buildStatsPartKeys).toEqual([])
    expect(translated.targetBuildUnitIds).toEqual(['output-entry:s001:node-extrude-2'])
    expect(translated.compiledBuildData.resolvedShared?.sp_featureStackIR).toEqual({
      schemaVersion: 1,
      parts: {},
    })
  })

  it('keeps output-preview-ready extrudes in the worker-facing required part list', () => {
    const translated = buildRequestFromBuildInputs(extrudeBuildInputs(), {
      ...previewPreparation(),
      outputSlotIds: ['s001'],
      previewCandidateSlotIds: ['s001'],
      previewCandidatePartKeys: ['extrude#2'],
      sourceNodeIdBySlotId: {
        s001: 'node-extrude-2',
      },
      sourcePartKeyBySlotId: {
        s001: 'extrude#2',
      },
      sourcePortIdBySlotId: {
        s001: 'SolidBody',
      },
      sourcePartKeyByNodeId: {
        'node-extrude-2': 'extrude#2',
      },
      slotStatusBySlotId: {
        s001: 'ok',
      },
    })

    expect(translated.compiledBuildData.orderedPartKeys).toEqual(['extrude#2'])
    expect(translated.buildStatsPartKeys).toEqual(['extrude#2'])
    expect(translated.compiledBuildData.resolvedShared?.sp_featureStackIR).toEqual({
      schemaVersion: 1,
      parts: {
        'extrude#2': [{ op: 'extrude', featureId: 'node-extrude-2' }],
      },
    })
  })

  it('fans split publication into multiple deterministic output-entry build units', () => {
    const translated = buildRequestFromBuildInputs(extrudeBuildInputs(), {
      ...previewPreparation(),
      outputSlotIds: ['s001'],
      previewCandidateSlotIds: ['s001'],
      previewCandidatePartKeys: ['extrude#2'],
      sourceNodeIdBySlotId: {
        s001: 'node-extrude-2',
      },
      sourcePartKeyBySlotId: {
        s001: 'extrude#2',
      },
      sourcePortIdBySlotId: {
        s001: 'SolidBody',
      },
      sourcePartKeyByNodeId: {
        'node-extrude-2': 'extrude#2',
      },
      publicationModeBySlotId: {
        s001: 'split',
      },
      splitMemberCountBySlotId: {
        s001: 2,
      },
      slotStatusBySlotId: {
        s001: 'ok',
      },
    })

    expect(translated.compiledBuildData.outputEntries).toEqual([
      {
        buildUnitId: 'output-entry:s001:node-extrude-2:member-001',
        outputEntryId: 'output-entry:s001:node-extrude-2:member-001',
        sourceNodeId: 'node-extrude-2',
        partKey: 'extrude#2',
        bodyId: 'node-extrude-2:body:001',
      },
      {
        buildUnitId: 'output-entry:s001:node-extrude-2:member-002',
        outputEntryId: 'output-entry:s001:node-extrude-2:member-002',
        sourceNodeId: 'node-extrude-2',
        partKey: 'extrude#2',
        bodyId: 'node-extrude-2:body:002',
      },
    ])
    expect(translated.targetBuildUnitIds).toEqual([
      'output-entry:s001:node-extrude-2:member-001',
      'output-entry:s001:node-extrude-2:member-002',
    ])
  })

  it('builds unique output-entry ids when one slot flattens multiple contributors from the same node', () => {
    const translated = buildRequestFromBuildInputs(extrudeBuildInputs(), {
      ...previewPreparation(),
      outputSlotIds: ['s001'],
      previewCandidateSlotIds: ['s001'],
      previewCandidatePartKeys: ['extrude#2'],
      sourceNodeIdBySlotId: {
        s001: 'node-extrude-2',
      },
      sourcePartKeyBySlotId: {
        s001: 'extrude#2',
      },
      sourcePortIdBySlotId: {
        s001: 'SolidBody:001',
      },
      sourcePartKeyByNodeId: {
        'node-extrude-2': 'extrude#2',
      },
      sourceEntriesBySlotId: {
        s001: [
          {
            slotId: 's001',
            sourceNodeId: 'node-extrude-2',
            sourcePartKeyStr: 'extrude#2',
            sourcePortId: 'SolidBody:001',
          },
          {
            slotId: 's001',
            sourceNodeId: 'node-extrude-2',
            sourcePartKeyStr: 'extrude#2',
            sourcePortId: 'SolidBody:002',
          },
        ],
      },
      slotStatusBySlotId: {
        s001: 'ok',
      },
    })

    expect(translated.compiledBuildData.outputEntries).toEqual([
      {
        buildUnitId: 'output-entry:s001:node-extrude-2:port-SolidBody%3A001',
        outputEntryId: 'output-entry:s001:node-extrude-2:port-SolidBody%3A001',
        sourceNodeId: 'node-extrude-2',
        partKey: 'extrude#2',
        bodyId: 'node-extrude-2:body:001',
      },
      {
        buildUnitId: 'output-entry:s001:node-extrude-2:port-SolidBody%3A002',
        outputEntryId: 'output-entry:s001:node-extrude-2:port-SolidBody%3A002',
        sourceNodeId: 'node-extrude-2',
        partKey: 'extrude#2',
        bodyId: 'node-extrude-2:body:002',
      },
    ])
    expect(translated.targetBuildUnitIds).toEqual([
      'output-entry:s001:node-extrude-2:port-SolidBody%3A001',
      'output-entry:s001:node-extrude-2:port-SolidBody%3A002',
    ])
  })

  it('keeps the singular-only same-row OutputPreview repro buildable when preview preparation is derived from the actual graph', () => {
    const graph = createSingularOnlySameRowOutputPreviewGraph()
    const compileResult = compileSpaghettiGraph(graph)

    expect(compileResult.ok).toBe(true)
    expect(compileResult.buildInputs).toBeDefined()

    const previewPreparation = prepareGraphPreviewPreparation(graph)
    expect(previewPreparation.slotStatusBySlotId).toEqual({ s001: 'ok' })
    expect(previewPreparation.sourceEntriesBySlotId).toEqual({
      s001: [
        {
          slotId: 's001',
          sourceNodeId: 'node-extrude-1',
          sourcePartKeyStr: 'extrude#1',
          sourcePortId: 'SolidBody:001',
        },
        {
          slotId: 's001',
          sourceNodeId: 'node-extrude-1',
          sourcePartKeyStr: 'extrude#1',
          sourcePortId: 'SolidBody:002',
        },
      ],
    })

    const translated = buildRequestFromBuildInputs(compileResult.buildInputs!, previewPreparation)

    expect(translated.compiledBuildData.orderedPartKeys).toEqual(['extrude#1'])
    expect(translated.compiledBuildData.outputEntries).toEqual([
      {
        buildUnitId: 'output-entry:s001:node-extrude-1:port-SolidBody%3A001',
        outputEntryId: 'output-entry:s001:node-extrude-1:port-SolidBody%3A001',
        sourceNodeId: 'node-extrude-1',
        partKey: 'extrude#1',
        bodyId: 'node-extrude-1:body:001',
      },
      {
        buildUnitId: 'output-entry:s001:node-extrude-1:port-SolidBody%3A002',
        outputEntryId: 'output-entry:s001:node-extrude-1:port-SolidBody%3A002',
        sourceNodeId: 'node-extrude-1',
        partKey: 'extrude#1',
        bodyId: 'node-extrude-1:body:002',
      },
    ])
    expect(translated.targetBuildUnitIds).toEqual([
      'output-entry:s001:node-extrude-1:port-SolidBody%3A001',
      'output-entry:s001:node-extrude-1:port-SolidBody%3A002',
    ])
  })

  it('keeps the mixed same-row OutputPreview control buildable when preview preparation is derived from the actual graph', () => {
    const graph = createMixedSameRowOutputPreviewGraph()
    const compileResult = compileSpaghettiGraph(graph)

    expect(compileResult.ok).toBe(true)
    expect(compileResult.buildInputs).toBeDefined()

    const previewPreparation = prepareGraphPreviewPreparation(graph)
    expect(previewPreparation.slotStatusBySlotId).toEqual({ s001: 'ok' })
    expect(previewPreparation.sourceEntriesBySlotId).toEqual({
      s001: [
        {
          slotId: 's001',
          sourceNodeId: 'node-extrude-1',
          sourcePartKeyStr: 'extrude#1',
          sourcePortId: 'SolidBody:001',
        },
        {
          slotId: 's001',
          sourceNodeId: 'node-extrude-1',
          sourcePartKeyStr: 'extrude#1',
          sourcePortId: 'SolidBody',
        },
      ],
    })

    const translated = buildRequestFromBuildInputs(compileResult.buildInputs!, previewPreparation)

    expect(translated.compiledBuildData.orderedPartKeys).toEqual(['extrude#1'])
    expect(translated.compiledBuildData.outputEntries).toEqual([
      {
        buildUnitId: 'output-entry:s001:node-extrude-1:port-SolidBody%3A001',
        outputEntryId: 'output-entry:s001:node-extrude-1:port-SolidBody%3A001',
        sourceNodeId: 'node-extrude-1',
        partKey: 'extrude#1',
        bodyId: 'node-extrude-1:body:001',
      },
      {
        buildUnitId: 'output-entry:s001:node-extrude-1',
        outputEntryId: 'output-entry:s001:node-extrude-1',
        sourceNodeId: 'node-extrude-1',
        partKey: 'extrude#1',
        bodyId: null,
      },
    ])
    expect(translated.targetBuildUnitIds).toEqual([
      'output-entry:s001:node-extrude-1:port-SolidBody%3A001',
      'output-entry:s001:node-extrude-1',
    ])
  })

  it('classifies branch-local extrude depth edits with a Worker 9 Phase 1 local extrude hint', () => {
    const previousGraph = createParallelExtrudeOutputPreviewGraph()
    const currentGraph = createParallelExtrudeOutputPreviewGraph({
      extrudeTwoDepthMm: 45,
    })
    const previousCompileResult = compileSpaghettiGraph(previousGraph)
    const currentCompileResult = compileSpaghettiGraph(currentGraph)

    expect(previousCompileResult.ok).toBe(true)
    expect(currentCompileResult.ok).toBe(true)

    const currentPreviewPreparation = prepareGraphPreviewPreparation(currentGraph)
    const translated = buildRequestFromBuildInputs(
      currentCompileResult.buildInputs!,
      currentPreviewPreparation,
      previousCompileResult.buildInputs!,
    )

    expect(translated.changedParamIds).toEqual(['sp_featureStackIR'])
    expect(translated.changedInputHint).toEqual({
      kind: 'graph_local_extrude_params',
      changedNodeId: 'node-extrude-2',
      changedPartKey: 'extrude#2',
      changedFields: ['depthResolved'],
    })
    expect(translated.targetBuildUnitIds).toEqual([
      'output-entry:s002:node-extrude-2',
    ])
    expect(translated.affectedBuildUnitIds).toEqual([
      'output-entry:s002:node-extrude-2',
    ])
  })

  it('classifies shared sketch edits as widening-allowed upstream hints for Worker 9 Phase 1', () => {
    const previousGraph = createParallelExtrudeOutputPreviewGraph()
    const currentGraph = createParallelExtrudeOutputPreviewGraph({
      sketchWidth: 55,
    })
    const previousCompileResult = compileSpaghettiGraph(previousGraph)
    const currentCompileResult = compileSpaghettiGraph(currentGraph)

    expect(previousCompileResult.ok).toBe(true)
    expect(currentCompileResult.ok).toBe(true)

    const currentPreviewPreparation = prepareGraphPreviewPreparation(currentGraph)
    const translated = buildRequestFromBuildInputs(
      currentCompileResult.buildInputs!,
      currentPreviewPreparation,
      previousCompileResult.buildInputs!,
    )

    expect(translated.changedParamIds).toEqual(['sp_featureStackIR'])
    expect(translated.changedInputHint).toEqual({
      kind: 'graph_shared_upstream',
      changedPartKeys: ['extrude#1', 'extrude#2'],
      upstreamNodeIds: ['node-sketch-1'],
      reason: 'sketch_change',
    })
    expect(translated.targetBuildUnitIds).toEqual([
      'output-entry:s001:node-extrude-1',
      'output-entry:s002:node-extrude-2',
    ])
  })
})
