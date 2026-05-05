import { afterEach, describe, expect, it } from 'vitest'
import { editHistoryStore } from '../../store/editHistoryStore'
import type {
  BuildResultBundle,
  PartArtifact,
} from '../../../shared/buildTypes'
import { DEFAULT_BUILD_EXECUTION_INTENT } from '../../../shared/buildTypes'
import type { GeometryResultBundle } from '../../../shared/geometryResult'
import type { FeatureStack, SketchComponent, SketchFeature } from '../features/featureTypes'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import { useSpaghettiStore } from './useSpaghettiStore'

const point = (x: number, y: number) => ({ kind: 'lit' as const, x, y })

const line = (
  rowId: string,
  a = point(0, 0),
  b = point(100, 0),
): Extract<SketchComponent, { type: 'line' }> => ({
  rowId,
  componentId: `component-${rowId}`,
  type: 'line',
  a,
  b,
})

const sketchFeature = (
  featureId = 'feature-sketch-1',
  components: SketchComponent[] = [],
): Extract<FeatureStack[number], { type: 'sketch' }> => ({
  type: 'sketch',
  featureId,
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

const defaultGeometrySketchComponents = (): SketchComponent[] => [
  line('row-line-1'),
  {
    rowId: 'row-circle-1',
    componentId: 'component-row-circle-1',
    type: 'circle',
    center: point(10, 10),
    edge: point(20, 10),
  },
]

const graphWithPartAndGeometrySketch = (
  geometrySketchComponents = defaultGeometrySketchComponents(),
): SpaghettiGraph => ({
  schemaVersion: 1,
  nodes: [
    {
      nodeId: 'part-1',
      type: 'Part/Baseplate',
      params: {
        featureStack: [sketchFeature()],
      },
    },
    {
      nodeId: 'node-sketch-1',
      type: 'Geometry/Sketch',
      params: {
        sketch: sketchFeature('geometry-sketch-1', geometrySketchComponents),
      },
    },
  ],
  edges: [],
})

const baseplateArtifact: PartArtifact = {
  id: 'baseplate',
  label: 'Baseplate',
  kind: 'box',
  params: { width: 1, length: 2, height: 3 },
  partKeyStr: 'baseplate',
  partKey: { id: 'baseplate', instance: null },
}

const createAcceptedBundle = (options: {
  seq: number
  graphDocumentId: string
  buildRequestId: string
}): BuildResultBundle => ({
  buildRequestId: options.buildRequestId,
  graphDocumentId: options.graphDocumentId,
  seq: options.seq,
  resultClass: 'final',
  executionIntent: DEFAULT_BUILD_EXECUTION_INTENT,
  summary: {
    rebuiltCount: 1,
    retainedCount: 0,
    evictedCount: 0,
  },
  entries: [
    {
      buildUnitId: 'output-entry:s001:baseplate',
      outputEntryId: 'output-entry:s001:baseplate',
      sourceNodeId: 'part-1',
      status: 'rebuilt',
      resultClass: 'final',
      artifacts: [baseplateArtifact],
    },
  ],
})

const createAcceptedGeometryResult = (options: {
  graphDocumentId: string
  buildRequestId: string
  resultClass?: GeometryResultBundle['resultClass']
}): GeometryResultBundle => ({
  schemaVersion: 1,
  request: {
    graphDocumentId: options.graphDocumentId,
    buildRequestId: options.buildRequestId,
    partKeys: ['baseplate'],
  },
  resultClass: options.resultClass ?? 'draft',
  status: 'ok',
  bodies: {},
  meshPreview: null,
  diagnostics: [],
  trace: [],
  authoritativeHandle:
    options.resultClass === 'authoritative'
      ? {
          resourceType: 'shape_set',
          handleId: `shape-set:${options.graphDocumentId}:${options.buildRequestId}`,
        }
      : null,
})

const resetStores = (): void => {
  editHistoryStore.clear()
  useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
}

const geometrySketch = (): SketchFeature =>
  useSpaghettiStore.getState().graph.nodes.find((node) => node.nodeId === 'node-sketch-1')
    ?.params.sketch as SketchFeature

const geometrySketchTypes = (): SketchComponent['type'][] =>
  geometrySketch().components.map((component) => component.type)

const geometrySketchRowIds = (): string[] =>
  geometrySketch().components.map((component) => component.rowId)

const stagedUndoLabels = (): string[] =>
  useSpaghettiStore.getState().geometrySketchSession?.stagedUndoCommands.map(
    (command) => command.label,
  ) ?? []

const stagedRedoLabels = (): string[] =>
  useSpaghettiStore.getState().geometrySketchSession?.stagedRedoCommands.map(
    (command) => command.label,
  ) ?? []

const sessionUndoLabels = (): string[] =>
  useSpaghettiStore.getState().geometrySketchSession?.sessionUndoCommands.map(
    (command) => command.label,
  ) ?? []

const sessionRedoLabels = (): string[] =>
  useSpaghettiStore.getState().geometrySketchSession?.sessionRedoCommands.map(
    (command) => command.label,
  ) ?? []

const partSketchComponents = (): SketchComponent[] => {
  const stack = useSpaghettiStore.getState().graph.nodes.find((node) => node.nodeId === 'part-1')
    ?.params.featureStack as FeatureStack
  return (stack.find((feature) => feature.featureId === 'feature-sketch-1') as SketchFeature)
    .components
}

const stageRuntimeBuild = (buildSeq: number, buildRequestId: string): void => {
  useSpaghettiStore.getState().stageGraphBuildRequest('graph-document-1', {
    compileResult: {
      ok: true,
      diagnostics: { errors: [], warnings: [] },
      buildInputs: {
        orderedPartKeys: ['baseplate'],
        resolvedParts: {},
      },
    },
    previousBuildInputs: null,
    pendingChangedParamIds: ['sp_runtime_probe'],
    pendingStatsPartKeys: ['baseplate'],
    pendingTargetBuildUnitIds: ['output-entry:s001:baseplate'],
    pendingAffectedBuildUnitIds: ['output-entry:s001:baseplate'],
    buildRequestId,
    buildSeq,
  })
}

const startDrawSession = (): void => {
  useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
}

const drawLineByPoint = (): void => {
  useSpaghettiStore.getState().setGeometrySketchSessionTool('line')
  useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 0, y: 0 }, null)
  useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 10, y: 0 }, null)
}

const drawRectangleByFinish = (offset = 0): void => {
  useSpaghettiStore.getState().setGeometrySketchSessionTool('rectangle')
  useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 1 + offset, y: 1 }, null)
  useSpaghettiStore.getState().setGeometrySketchDrawHoverPoint({ x: 8 + offset, y: 5 }, null)
  useSpaghettiStore.getState().finishGeometrySketchDrawDraft()
}

const drawCircleByPoint = (): void => {
  useSpaghettiStore.getState().setGeometrySketchSessionTool('circle')
  useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 4, y: 4 }, null)
  useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 7, y: 4 }, null)
}

const drawCircleByRadius = (): void => {
  useSpaghettiStore.getState().setGeometrySketchSessionTool('circle')
  useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 12, y: 4 }, null)
  useSpaghettiStore.getState().confirmGeometrySketchDrawRadius(3)
}

const drawPolyline = (): void => {
  useSpaghettiStore.getState().setGeometrySketchSessionTool('pline')
  useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 0, y: 8 }, null)
  useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 4, y: 8 }, null)
  useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 4, y: 12 }, null)
  useSpaghettiStore.getState().finishGeometrySketchDrawDraft()
}

describe('sketch draft and runtime edit-history exclusions', () => {
  afterEach(() => {
    resetStores()
  })

  it('keeps local geometry sketch draft and selection operations out of canonical history', () => {
    useSpaghettiStore.getState().setGraph(graphWithPartAndGeometrySketch())
    editHistoryStore.clear()

    useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
    useSpaghettiStore.getState().setGeometrySketchSessionTool('line')
    useSpaghettiStore.getState().setGeometrySketchDrawHoverPoint({ x: 12, y: 0 }, 'endpoint')
    useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 12, y: 0 }, 'endpoint')
    useSpaghettiStore.getState().undoGeometrySketchDrawDraftPoint()
    useSpaghettiStore.getState().cancelGeometrySketchDrawDraft()
    useSpaghettiStore.getState().setGeometrySketchHoveredComponent('row-line-1')
    useSpaghettiStore.getState().setGeometrySketchSelectedComponents(['row-line-1'])
    useSpaghettiStore.getState().setGeometrySketchSelectionWindowDraft({
      anchor: { x: -1, y: -1 },
      current: { x: 25, y: 25 },
      mode: 'window',
    })
    useSpaghettiStore.getState().closeGeometrySketchSession()

    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(editHistoryStore.getRedoEntries()).toEqual([])
  })

  it('stages completed Sketch Draw commands before one final canonical commit', () => {
    useSpaghettiStore.getState().setGraph(graphWithPartAndGeometrySketch([]))
    editHistoryStore.clear()

    startDrawSession()

    useSpaghettiStore.getState().setGeometrySketchSessionTool('line')
    useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 0, y: 0 }, null)
    expect(editHistoryStore.getUndoEntries()).toEqual([])
    useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 10, y: 0 }, null)

    drawRectangleByFinish()
    drawCircleByPoint()
    drawCircleByRadius()
    drawPolyline()

    expect(geometrySketchTypes()).toEqual([
      'line',
      'rectangle',
      'circle',
      'circle',
      'line',
      'line',
    ])
    expect(stagedUndoLabels()).toEqual([
      'Draw sketch line',
      'Draw sketch rectangle',
      'Draw sketch circle',
      'Draw sketch circle',
      'Draw sketch polyline',
    ])
    expect(editHistoryStore.getUndoEntries()).toEqual([])

    useSpaghettiStore.getState().closeGeometrySketchSession()

    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Commit sketch draw changes',
      source: {
        surface: 'spaghetti-graph',
        sourceId: 'geometry-sketch-draw',
        sourceLabel: 'Sketch Draw',
      },
      targetId: 'node-sketch-1:sketch:components',
      targetLabel: 'Sketch Draw changes',
    })
    expect(editHistoryStore.getUndoEntries()[0]?.childSummaries?.map((summary) => summary.label)).toEqual([
      'Select sketch line tool',
      'Draw sketch line',
      'Select sketch rectangle tool',
      'Draw sketch rectangle',
      'Select sketch circle tool',
      'Draw sketch circle',
      'Select sketch circle tool',
      'Draw sketch circle',
      'Select sketch pline tool',
      'Draw sketch polyline',
    ])

    editHistoryStore.undo()
    expect(geometrySketchTypes()).toEqual([])
    expect(editHistoryStore.getRedoEntries()).toHaveLength(1)

    editHistoryStore.redo()
    expect(geometrySketchTypes()).toEqual([
      'line',
      'rectangle',
      'circle',
      'circle',
      'line',
      'line',
    ])
  })

  it('restores committed Sketch Draw child boundaries from the parent history entry', () => {
    useSpaghettiStore.getState().setGraph(graphWithPartAndGeometrySketch([]))
    editHistoryStore.clear()

    startDrawSession()

    useSpaghettiStore.getState().setGeometrySketchSessionTool('line')
    useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 0, y: 0 }, null)
    useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 10, y: 0 }, null)
    drawRectangleByFinish()
    drawCircleByPoint()
    drawCircleByRadius()
    drawPolyline()
    useSpaghettiStore.getState().closeGeometrySketchSession()

    const parentEntry = editHistoryStore.getUndoEntries()[0]
    expect(parentEntry).toBeDefined()
    if (parentEntry === undefined) {
      throw new Error('Expected a committed Sketch Draw parent entry')
    }
    const childSummaries = parentEntry?.childSummaries ?? []
    const selectRectangleTool = childSummaries.find(
      (summary) => summary.label === 'Select sketch rectangle tool',
    )
    const drawRectangle = childSummaries.find(
      (summary) => summary.label === 'Draw sketch rectangle',
    )
    const drawPolylineSummary = childSummaries.find(
      (summary) => summary.label === 'Draw sketch polyline',
    )

    expect(parentEntry?.childRestorePoints?.map((point) => point.childId)).toEqual(
      childSummaries.map((summary) => summary.childId),
    )
    expect(selectRectangleTool).toBeDefined()
    expect(drawRectangle).toBeDefined()
    expect(drawPolylineSummary).toBeDefined()

    expect(
      editHistoryStore.restoreChild(parentEntry.entryId, selectRectangleTool?.childId ?? ''),
    ).toBe(parentEntry)
    expect(geometrySketchTypes()).toEqual(['line'])

    expect(
      editHistoryStore.restoreChild(parentEntry.entryId, drawRectangle?.childId ?? ''),
    ).toBe(parentEntry)
    expect(geometrySketchTypes()).toEqual(['line', 'rectangle'])

    expect(
      editHistoryStore.restoreChild(parentEntry.entryId, drawPolylineSummary?.childId ?? ''),
    ).toBe(parentEntry)
    expect(geometrySketchTypes()).toEqual([
      'line',
      'rectangle',
      'circle',
      'circle',
      'line',
      'line',
    ])
    expect(editHistoryStore.getUndoEntries().map((entry) => entry.entryId)).toEqual([
      parentEntry.entryId,
    ])
    expect(editHistoryStore.getRedoEntries()).toEqual([])
  })

  it('opens and clears read-only Sketch Draw history scrub without creating local authoring history', () => {
    useSpaghettiStore.getState().setGraph(graphWithPartAndGeometrySketch([]))
    editHistoryStore.clear()

    const opened = useSpaghettiStore.getState().openGeometrySketchHistoryScrub({
      parentEntryId: 'history-entry-1',
      childId: 'draw-command-1',
      graphDocumentId: useSpaghettiStore.getState().activeGraphDocumentId,
      nodeId: 'node-sketch-1',
      childLabel: 'Draw sketch line',
      childSequence: 1,
    })

    expect(opened).toBe(true)
    expect(useSpaghettiStore.getState().geometrySketchHistoryScrub).toMatchObject({
      parentEntryId: 'history-entry-1',
      childId: 'draw-command-1',
      nodeId: 'node-sketch-1',
      childLabel: 'Draw sketch line',
      childSequence: 1,
    })
    expect(useSpaghettiStore.getState().geometrySketchSession).toBeNull()
    expect(stagedUndoLabels()).toEqual([])
    expect(stagedRedoLabels()).toEqual([])

    useSpaghettiStore.getState().clearGeometrySketchHistoryScrub()
    expect(useSpaghettiStore.getState().geometrySketchHistoryScrub).toBeNull()
  })

  it('rejects Sketch Draw history scrub targets that are not active geometry sketch nodes', () => {
    useSpaghettiStore.getState().setGraph(graphWithPartAndGeometrySketch([]))

    expect(useSpaghettiStore.getState().openGeometrySketchHistoryScrub({
      parentEntryId: 'history-entry-1',
      childId: 'draw-command-1',
      graphDocumentId: 'other-graph-document',
      nodeId: 'node-sketch-1',
      childLabel: 'Draw sketch line',
      childSequence: 1,
    })).toBe(false)

    expect(useSpaghettiStore.getState().openGeometrySketchHistoryScrub({
      parentEntryId: 'history-entry-1',
      childId: 'draw-command-1',
      graphDocumentId: useSpaghettiStore.getState().activeGraphDocumentId,
      nodeId: 'missing-sketch-node',
      childLabel: 'Draw sketch line',
      childSequence: 1,
    })).toBe(false)
    expect(useSpaghettiStore.getState().geometrySketchHistoryScrub).toBeNull()
  })

  it('stages Sketch Draw delete-selected as one undoable in-session command', () => {
    useSpaghettiStore.getState().setGraph(graphWithPartAndGeometrySketch([
      line('row-line-1'),
      line('row-line-2', point(0, 5), point(10, 5)),
      {
        rowId: 'row-circle-1',
        componentId: 'component-row-circle-1',
        type: 'circle',
        center: point(4, 4),
        edge: point(7, 4),
      },
    ]))
    editHistoryStore.clear()

    startDrawSession()

    useSpaghettiStore.getState().setGeometrySketchSelectedComponents([
      'row-line-1',
      'row-circle-1',
    ])
    useSpaghettiStore.getState().deleteGeometrySketchSelectedComponents()

    expect(geometrySketchRowIds()).toEqual(['row-line-2'])
    expect(stagedUndoLabels()).toEqual(['Delete sketch components'])
    expect(editHistoryStore.getUndoEntries()).toEqual([])

    useSpaghettiStore.getState().undoGeometrySketchStagedCommand()
    expect(geometrySketchRowIds()).toEqual(['row-line-1', 'row-line-2', 'row-circle-1'])

    useSpaghettiStore.getState().redoGeometrySketchStagedCommand()
    expect(geometrySketchRowIds()).toEqual(['row-line-2'])
  })

  it('undoes and redoes submitted rectangle tool selections locally without canonical history', () => {
    useSpaghettiStore.getState().setGraph(graphWithPartAndGeometrySketch([]))
    editHistoryStore.clear()

    startDrawSession()
    useSpaghettiStore.getState().runGeometrySketchDrawCommand('rectangle')

    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      activeTool: 'rectangle',
      drawStage: 'toolSelected',
    })
    expect(sessionUndoLabels()).toEqual(['Select sketch rectangle tool'])
    expect(sessionRedoLabels()).toEqual([])
    expect(editHistoryStore.getUndoEntries()).toEqual([])

    useSpaghettiStore.getState().undoGeometrySketchStagedCommand()

    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      activeTool: null,
      drawStage: 'sessionIdle',
    })
    expect(sessionUndoLabels()).toEqual([])
    expect(sessionRedoLabels()).toEqual(['Select sketch rectangle tool'])
    expect(editHistoryStore.getUndoEntries()).toEqual([])

    useSpaghettiStore.getState().redoGeometrySketchStagedCommand()

    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      activeTool: 'rectangle',
      drawStage: 'toolSelected',
    })
    expect(sessionUndoLabels()).toEqual(['Select sketch rectangle tool'])
    expect(sessionRedoLabels()).toEqual([])
    expect(editHistoryStore.getUndoEntries()).toEqual([])
  })

  it('undoes completed rectangle geometry before the earlier tool selection command', () => {
    useSpaghettiStore.getState().setGraph(graphWithPartAndGeometrySketch([]))
    editHistoryStore.clear()

    startDrawSession()
    useSpaghettiStore.getState().runGeometrySketchDrawCommand('rectangle')
    useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 1, y: 1 }, null)
    useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 8, y: 5 }, null)

    expect(geometrySketchTypes()).toEqual(['rectangle'])
    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      activeTool: null,
      drawStage: 'sessionIdle',
    })
    expect(sessionUndoLabels()).toEqual([
      'Select sketch rectangle tool',
      'Draw sketch rectangle',
    ])
    expect(editHistoryStore.getUndoEntries()).toEqual([])

    useSpaghettiStore.getState().undoGeometrySketchStagedCommand()

    expect(geometrySketchTypes()).toEqual([])
    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      activeTool: 'rectangle',
      drawStage: 'draftActive',
      drawDraft: {
        points: [{ x: 1, y: 1 }],
      },
    })
    expect(sessionUndoLabels()).toEqual(['Select sketch rectangle tool'])
    expect(sessionRedoLabels()).toEqual(['Draw sketch rectangle'])
    expect(editHistoryStore.getUndoEntries()).toEqual([])

    useSpaghettiStore.getState().undoGeometrySketchStagedCommand()

    expect(geometrySketchTypes()).toEqual([])
    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      activeTool: null,
      drawStage: 'sessionIdle',
    })
    expect(sessionUndoLabels()).toEqual([])
    expect(sessionRedoLabels()).toEqual([
      'Draw sketch rectangle',
      'Select sketch rectangle tool',
    ])
    expect(editHistoryStore.getUndoEntries()).toEqual([])
  })

  it('stores accepted Sketch Draw tool-selection commands as committed child summaries', () => {
    useSpaghettiStore.getState().setGraph(graphWithPartAndGeometrySketch([]))
    editHistoryStore.clear()

    startDrawSession()
    useSpaghettiStore.getState().runGeometrySketchDrawCommand('rectangle')
    useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 1, y: 1 }, null)
    useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 8, y: 5 }, null)
    useSpaghettiStore.getState().closeGeometrySketchSession()

    expect(editHistoryStore.getUndoEntries()[0]?.childSummaries).toMatchObject([
      {
        label: 'Select sketch rectangle tool',
        kind: 'tool-selection',
        sequence: 1,
      },
      {
        label: 'Draw sketch rectangle',
        kind: 'geometry',
        sequence: 2,
      },
    ])
  })

  it('keeps Sketch Draw no-op delete attempts out of canonical history', () => {
    useSpaghettiStore.getState().setGraph(graphWithPartAndGeometrySketch([
      line('row-line-1'),
    ]))
    editHistoryStore.clear()

    startDrawSession()

    useSpaghettiStore.getState().deleteGeometrySketchSelectedComponents()
    useSpaghettiStore.getState().setGeometrySketchSelectedComponents(['missing-row'])
    useSpaghettiStore.getState().deleteGeometrySketchSelectedComponents()

    expect(geometrySketchRowIds()).toEqual(['row-line-1'])
    expect(stagedUndoLabels()).toEqual([])
    expect(editHistoryStore.getUndoEntries()).toEqual([])
  })

  it('walks staged completed Sketch Draw commands individually before final commit', () => {
    useSpaghettiStore.getState().setGraph(graphWithPartAndGeometrySketch([]))
    editHistoryStore.clear()

    startDrawSession()
    drawLineByPoint()
    drawRectangleByFinish()
    drawCircleByPoint()

    expect(geometrySketchTypes()).toEqual(['line', 'rectangle', 'circle'])

    useSpaghettiStore.getState().undoGeometrySketchStagedCommand()
    expect(geometrySketchTypes()).toEqual(['line', 'rectangle'])
    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      activeTool: 'circle',
      drawStage: 'draftActive',
    })

    useSpaghettiStore.getState().undoGeometrySketchStagedCommand()
    expect(geometrySketchTypes()).toEqual(['line'])
    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      activeTool: 'rectangle',
      drawStage: 'draftActive',
    })

    useSpaghettiStore.getState().undoGeometrySketchStagedCommand()
    expect(geometrySketchTypes()).toEqual(['line'])
    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      activeTool: null,
      drawStage: 'sessionIdle',
    })

    useSpaghettiStore.getState().undoGeometrySketchStagedCommand()
    expect(geometrySketchTypes()).toEqual([])
    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      activeTool: 'line',
      drawStage: 'draftActive',
    })
  })

  it('invalidates staged redo after a new completed Sketch Draw command', () => {
    useSpaghettiStore.getState().setGraph(graphWithPartAndGeometrySketch([]))
    editHistoryStore.clear()

    startDrawSession()
    drawLineByPoint()
    drawRectangleByFinish()

    useSpaghettiStore.getState().undoGeometrySketchStagedCommand()
    expect(geometrySketchTypes()).toEqual(['line'])
    expect(stagedRedoLabels()).toEqual(['Draw sketch rectangle'])

    drawCircleByPoint()

    expect(geometrySketchTypes()).toEqual(['line', 'circle'])
    expect(stagedUndoLabels()).toEqual([
      'Draw sketch line',
      'Draw sketch circle',
    ])
    expect(stagedRedoLabels()).toEqual([])
    expect(editHistoryStore.getUndoEntries()).toEqual([])
  })

  it('commits only accepted staged Sketch Draw commands after undoing two of five rectangles', () => {
    useSpaghettiStore.getState().setGraph(graphWithPartAndGeometrySketch([]))
    editHistoryStore.clear()

    startDrawSession()
    for (let index = 0; index < 5; index += 1) {
      drawRectangleByFinish(index * 10)
    }

    expect(geometrySketchTypes()).toEqual([
      'rectangle',
      'rectangle',
      'rectangle',
      'rectangle',
      'rectangle',
    ])
    expect(stagedUndoLabels()).toEqual([
      'Draw sketch rectangle',
      'Draw sketch rectangle',
      'Draw sketch rectangle',
      'Draw sketch rectangle',
      'Draw sketch rectangle',
    ])
    expect(editHistoryStore.getUndoEntries()).toEqual([])

    useSpaghettiStore.getState().undoGeometrySketchStagedCommand()
    useSpaghettiStore.getState().undoGeometrySketchStagedCommand()

    expect(geometrySketchTypes()).toEqual(['rectangle', 'rectangle', 'rectangle'])
    expect(stagedRedoLabels()).toEqual([
      'Draw sketch rectangle',
      'Draw sketch rectangle',
    ])

    useSpaghettiStore.getState().closeGeometrySketchSession()

    expect(useSpaghettiStore.getState().geometrySketchSession).toBeNull()
    expect(geometrySketchTypes()).toEqual(['rectangle', 'rectangle', 'rectangle'])
    expect(editHistoryStore.getUndoEntries().map((entry) => entry.label)).toEqual([
      'Commit sketch draw changes',
    ])
    expect(
      editHistoryStore.getUndoEntries()[0]?.childSummaries
        ?.filter((summary) => summary.kind === 'geometry')
        .map((summary) => summary.label),
    ).toEqual([
      'Draw sketch rectangle',
      'Draw sketch rectangle',
      'Draw sketch rectangle',
    ])

    editHistoryStore.undo()
    expect(geometrySketchTypes()).toEqual([])

    editHistoryStore.redo()
    expect(geometrySketchTypes()).toEqual(['rectangle', 'rectangle', 'rectangle'])

    startDrawSession()
    expect(stagedUndoLabels()).toEqual([
      'Draw sketch rectangle',
      'Draw sketch rectangle',
      'Draw sketch rectangle',
    ])
    expect(stagedRedoLabels()).toEqual([])
  })

  it('hydrates committed Sketch Draw batches on reopen for local undo and redo', () => {
    useSpaghettiStore.getState().setGraph(graphWithPartAndGeometrySketch([]))
    editHistoryStore.clear()

    startDrawSession()
    for (let index = 0; index < 5; index += 1) {
      drawRectangleByFinish(index * 10)
    }
    useSpaghettiStore.getState().closeGeometrySketchSession()

    expect(useSpaghettiStore.getState().geometrySketchSession).toBeNull()
    expect(geometrySketchTypes()).toEqual([
      'rectangle',
      'rectangle',
      'rectangle',
      'rectangle',
      'rectangle',
    ])

    startDrawSession()
    expect(stagedUndoLabels()).toEqual([
      'Draw sketch rectangle',
      'Draw sketch rectangle',
      'Draw sketch rectangle',
      'Draw sketch rectangle',
      'Draw sketch rectangle',
    ])
    expect(stagedRedoLabels()).toEqual([])

    for (let index = 0; index < 5; index += 1) {
      useSpaghettiStore.getState().undoGeometrySketchStagedCommand()
    }

    expect(geometrySketchTypes()).toEqual([])
    expect(stagedUndoLabels()).toEqual([])
    expect(stagedRedoLabels()).toEqual([
      'Draw sketch rectangle',
      'Draw sketch rectangle',
      'Draw sketch rectangle',
      'Draw sketch rectangle',
      'Draw sketch rectangle',
    ])

    for (let index = 0; index < 5; index += 1) {
      useSpaghettiStore.getState().redoGeometrySketchStagedCommand()
    }

    expect(geometrySketchTypes()).toEqual([
      'rectangle',
      'rectangle',
      'rectangle',
      'rectangle',
      'rectangle',
    ])
    expect(stagedUndoLabels()).toEqual([
      'Draw sketch rectangle',
      'Draw sketch rectangle',
      'Draw sketch rectangle',
      'Draw sketch rectangle',
      'Draw sketch rectangle',
    ])
    expect(editHistoryStore.getUndoEntries().map((entry) => entry.label)).toEqual([
      'Commit sketch draw changes',
    ])
  })

  it('restores committed Sketch Draw local batches with canonical undo and redo', () => {
    useSpaghettiStore.getState().setGraph(graphWithPartAndGeometrySketch([]))
    editHistoryStore.clear()

    startDrawSession()
    for (let index = 0; index < 5; index += 1) {
      drawRectangleByFinish(index * 10)
    }
    useSpaghettiStore.getState().closeGeometrySketchSession()

    editHistoryStore.undo()
    expect(geometrySketchTypes()).toEqual([])

    startDrawSession()
    expect(stagedUndoLabels()).toEqual([])
    useSpaghettiStore.getState().closeGeometrySketchSession()

    editHistoryStore.redo()
    expect(geometrySketchTypes()).toEqual([
      'rectangle',
      'rectangle',
      'rectangle',
      'rectangle',
      'rectangle',
    ])

    startDrawSession()
    expect(stagedUndoLabels()).toEqual([
      'Draw sketch rectangle',
      'Draw sketch rectangle',
      'Draw sketch rectangle',
      'Draw sketch rectangle',
      'Draw sketch rectangle',
    ])
    expect(stagedRedoLabels()).toEqual([])
  })

  it('cancels staged Sketch Draw commands by restoring the pre-session sketch without canonical history', () => {
    useSpaghettiStore.getState().setGraph(graphWithPartAndGeometrySketch([
      line('row-line-1'),
    ]))
    editHistoryStore.clear()

    startDrawSession()
    drawRectangleByFinish()

    expect(geometrySketchTypes()).toEqual(['line', 'rectangle'])
    expect(stagedUndoLabels()).toEqual(['Draw sketch rectangle'])

    useSpaghettiStore.getState().cancelGeometrySketchDrawDraft()

    expect(useSpaghettiStore.getState().geometrySketchSession).toBeNull()
    expect(geometrySketchTypes()).toEqual(['line'])
    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(editHistoryStore.getRedoEntries()).toEqual([])
  })

  it('creates no canonical commit when the accepted staged result equals the pre-session sketch', () => {
    useSpaghettiStore.getState().setGraph(graphWithPartAndGeometrySketch([]))
    editHistoryStore.clear()

    startDrawSession()
    drawRectangleByFinish()
    useSpaghettiStore.getState().undoGeometrySketchStagedCommand()
    useSpaghettiStore.getState().closeGeometrySketchSession()

    expect(geometrySketchTypes()).toEqual([])
    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(editHistoryStore.getRedoEntries()).toEqual([])
  })

  it('keeps Sketch Draw textual undo local to draft points', () => {
    useSpaghettiStore.getState().setGraph(graphWithPartAndGeometrySketch([]))
    editHistoryStore.clear()

    startDrawSession()
    drawLineByPoint()
    useSpaghettiStore.getState().setGeometrySketchSessionTool('pline')
    useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 0, y: 10 }, null)
    useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 10, y: 10 }, null)

    useSpaghettiStore.getState().runGeometrySketchDrawCommand('undo')

    expect(geometrySketchTypes()).toEqual(['line'])
    expect(stagedUndoLabels()).toEqual([
      'Draw sketch line',
    ])
    expect(editHistoryStore.getRedoEntries()).toEqual([])
    expect(useSpaghettiStore.getState().geometrySketchSession?.drawDraft?.points).toEqual([
      { x: 0, y: 10 },
    ])

    useSpaghettiStore.getState().undoGeometrySketchStagedCommand()
    expect(geometrySketchTypes()).toEqual(['line'])
    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      activeTool: null,
      drawStage: 'sessionIdle',
    })
    expect(useSpaghettiStore.getState().geometrySketchSession?.drawDraft).toBeNull()
  })

  it('keeps representative runtime build, preview, result, and cache operations out of canonical history', async () => {
    useSpaghettiStore.getState().setGraph(graphWithPartAndGeometrySketch())
    editHistoryStore.clear()

    stageRuntimeBuild(41, 'build-request-authoritative')
    expect(useSpaghettiStore.getState().acceptGraphBuildResult({
      projectFileId: 'runtime-project',
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-authoritative',
      buildSeq: 41,
      bundle: createAcceptedBundle({
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-authoritative',
        seq: 41,
      }),
      draftGeometryResult: createAcceptedGeometryResult({
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-authoritative',
      }),
    })).toBe(true)

    stageRuntimeBuild(42, 'build-request-preview')
    expect(useSpaghettiStore.getState().stageAuthoritativePreviewGraphBuildResult({
      projectFileId: 'runtime-project',
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-preview',
      buildSeq: 42,
      bundle: createAcceptedBundle({
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-preview',
        seq: 42,
      }),
      authoritativeGeometryResult: createAcceptedGeometryResult({
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-preview',
        resultClass: 'authoritative',
      }),
    })).toBe(true)
    expect(useSpaghettiStore.getState().promoteStagedAuthoritativePreviewResult('graph-document-1'))
      .toBe(true)

    stageRuntimeBuild(43, 'build-request-clear')
    expect(useSpaghettiStore.getState().clearGraphBuildRequest({
      projectFileId: 'runtime-project',
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-clear',
      buildSeq: 43,
    })).toBe(true)

    await useSpaghettiStore.getState().saveCachedGraphEntryToFile('graph-document-1', {
      savedAt: '2026-04-22T02:20:00.000Z',
      env: {
        BlobCtor: Blob,
        documentRef: {
          createElement: () => ({
            href: '',
            download: '',
            click: () => undefined,
            remove: () => undefined,
          }),
          body: {
            appendChild: () => undefined,
          },
        },
        urlRef: {
          createObjectURL: () => 'blob:graph-document',
          revokeObjectURL: () => undefined,
        },
      },
    })

    const runtime = useSpaghettiStore.getState().graphRuntimeByDocumentId['graph-document-1']
    expect(runtime.acceptedBuildOutputs).toHaveLength(1)
    expect(runtime.acceptedAuthoritativeGeometryResult?.resultClass).toBe('authoritative')
    expect(
      useSpaghettiStore.getState().cachedGraphEntriesById['graph-document-1']?.isDirty,
    ).toBe(false)
    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(editHistoryStore.getRedoEntries()).toEqual([])
  })

  it('does not capture or restore local sketch draft or runtime state during authored sketch undo/redo', () => {
    useSpaghettiStore.getState().setGraph(graphWithPartAndGeometrySketch())
    editHistoryStore.clear()
    useSpaghettiStore.getState().addSketchComponent('part-1', 'feature-sketch-1', 'line')

    expect(partSketchComponents()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)

    useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
    useSpaghettiStore.getState().setGeometrySketchSessionTool('line')
    useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 1, y: 2 }, null)
    useSpaghettiStore.getState().setGeometrySketchDrawHoverPoint({ x: 8, y: 2 }, null)
    stageRuntimeBuild(51, 'build-request-preserve')

    editHistoryStore.undo()

    expect(partSketchComponents()).toEqual([])
    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      nodeId: 'node-sketch-1',
      activeTool: 'line',
      drawDraft: {
        points: [{ x: 1, y: 2 }],
        hoverPoint: { x: 8, y: 2 },
      },
    })
    expect(
      useSpaghettiStore.getState().graphRuntimeByDocumentId['graph-document-1']?.compileBuild
        .inFlightBuildRequestId,
    ).toBe('build-request-preserve')

    editHistoryStore.redo()

    expect(partSketchComponents()).toHaveLength(1)
    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      nodeId: 'node-sketch-1',
      activeTool: 'line',
      drawDraft: {
        points: [{ x: 1, y: 2 }],
        hoverPoint: { x: 8, y: 2 },
      },
    })
    expect(
      useSpaghettiStore.getState().graphRuntimeByDocumentId['graph-document-1']?.compileBuild
        .inFlightBuildRequestId,
    ).toBe('build-request-preserve')
  })
})
