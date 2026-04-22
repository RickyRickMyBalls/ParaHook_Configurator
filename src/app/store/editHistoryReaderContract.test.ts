import { afterEach, describe, expect, it } from 'vitest'
import { useConsoleStore } from '../console/useConsoleStore'
import { defaultDashboardLaneId } from '../dashboard/dashboardTypes'
import { useDashboardStore } from '../dashboard/useDashboardStore'
import { useNotepadStore } from '../notepad/useNotepadStore'
import type { FeatureStack, SketchComponent } from '../spaghetti/features/featureTypes'
import type { GraphNodePos, SpaghettiGraph } from '../spaghetti/schema/spaghettiTypes'
import { useSpaghettiStore } from '../spaghetti/store/useSpaghettiStore'
import { useWorkspaceStore } from '../workspace/useWorkspaceStore'
import type { ReferenceTransformOverride } from '../references/referenceManifest'
import {
  createDashboardLaneAfterWithHistory,
} from './dashboardBoardEditHistory'
import type { EditHistoryEntry } from './editHistoryStore'
import { editHistoryStore } from './editHistoryStore'
import {
  runEnvironmentLookHistoryAction,
} from './environmentLookEditHistory'
import { setGroundEnabledWithHistory } from './groundEditHistory'
import { selectMaterialPresetWithHistory } from './materialEditHistory'
import { createNoteWithHistory } from './notepadEditHistory'
import { setWorkspaceStartupSurfaceWithHistory } from './uiPreferenceEditHistory'
import { useAppStore, type ProjectContentState } from './useAppStore'
import { useUiPrefsStore } from './uiPrefsStore'
import { setBrowserPresentationModeWithHistory } from './workspaceLayoutEditHistory'

const point = (x: number, y: number) => ({ kind: 'lit' as const, x, y })

const line = (rowId: string): Extract<SketchComponent, { type: 'line' }> => ({
  rowId,
  componentId: `component-${rowId}`,
  type: 'line',
  a: point(0, 0),
  b: point(100, 0),
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

const closeProfileFeature = (
  featureId = 'feature-close-1',
): Extract<FeatureStack[number], { type: 'closeProfile' }> => ({
  type: 'closeProfile',
  featureId,
  inputs: {
    sourceSketchFeatureId: null,
  },
  outputs: {
    profileRef: null,
  },
  uiState: {
    collapsed: false,
  },
})

const graphWithFeatureStack = (stack: FeatureStack): SpaghettiGraph => ({
  schemaVersion: 1,
  nodes: [
    {
      nodeId: 'part-1',
      type: 'Part/Baseplate',
      params: {
        featureStack: stack,
      },
    },
    {
      nodeId: 'utility-1',
      type: 'Utility/Output',
      params: {},
    },
  ],
  edges: [],
})

const graphWithParams = (): SpaghettiGraph => ({
  schemaVersion: 1,
  nodes: [
    {
      nodeId: 'node-a',
      type: 'Part/Baseplate',
      params: {
        widthMm: 10,
      },
    },
  ],
  edges: [],
  ui: {
    nodes: {
      'node-a': { x: 0, y: 0 },
    },
  },
})

const baseGraph = (): SpaghettiGraph => ({
  schemaVersion: 1,
  nodes: [
    { nodeId: 'node-a', type: 'Part/Baseplate', params: {} },
    { nodeId: 'node-b', type: 'Part/ToeHook', params: {} },
  ],
  edges: [],
})

const createProjectContent = (): ProjectContentState => ({
  assembliesById: {
    'assembly-a': {
      assemblyId: 'assembly-a',
      label: 'Assembly A',
      assemblySourceKind: 'authored',
      childRowIds: ['component-a'],
    },
  },
  componentsById: {
    'component-a': {
      componentId: 'component-a',
      parentAssemblyId: 'assembly-a',
      parentComponentId: null,
      ownerGraphDocumentId: null,
      sourceGraphDocumentId: null,
      sourceOutputEntryId: null,
      sourceNodeId: null,
      label: 'Component A',
      componentSourceKind: 'authored',
      resolutionState: 'resolved',
      receiveId: null,
      childObjectIds: [],
    },
  },
  objectsById: {},
})

const defaultTransform = (): ReferenceTransformOverride => ({
  position: { x: 0, y: 0, z: 0 },
  rotationDeg: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
})

const movedTransform = (x: number): ReferenceTransformOverride => ({
  ...defaultTransform(),
  position: { x, y: 0, z: 0 },
})

const resetStores = (): void => {
  editHistoryStore.clear()
  useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
  useAppStore.setState(useAppStore.getInitialState(), true)
  useConsoleStore.setState(useConsoleStore.getInitialState(), true)
  useUiPrefsStore.setState(useUiPrefsStore.getInitialState(), true)
  useNotepadStore.setState(useNotepadStore.getInitialState(), true)
  useDashboardStore.setState(useDashboardStore.getInitialState(), true)
  useWorkspaceStore.setState(useWorkspaceStore.getInitialState(), true)
}

const expectReaderEntry = (
  entry: EditHistoryEntry | undefined,
  expected: {
    label: string
    surface: string
    sourceId: string
    sourceLabel: string
    targetId?: string
    targetLabel?: string
  },
): EditHistoryEntry => {
  expect(entry).toMatchObject({
    label: expected.label,
    source: {
      surface: expected.surface,
      sourceId: expected.sourceId,
      sourceLabel: expected.sourceLabel,
    },
    ...(expected.targetId === undefined ? {} : { targetId: expected.targetId }),
    ...(expected.targetLabel === undefined ? {} : { targetLabel: expected.targetLabel }),
  })
  expect(entry?.entryId).toEqual(expect.any(String))
  expect(entry?.timestamp).toEqual(expect.any(String))
  expect(Number.isNaN(Date.parse(entry?.timestamp ?? ''))).toBe(false)
  expect(entry?.undo).toEqual(expect.any(Function))
  expect(entry?.redo).toEqual(expect.any(Function))
  return entry!
}

const appendStagedImportFile = (options: {
  fileName: string
  fileType: 'glb' | 'obj' | 'step'
  objectUrl: string
}): string => {
  useAppStore.getState().appendStagedImportDraftFiles([options])
  const stagedFileId =
    useAppStore.getState().referenceWorkspace.stagedImportDraft?.stagedFiles.at(-1)
      ?.stagedFileId ?? null
  expect(stagedFileId).toBeTruthy()
  return stagedFileId!
}

const markStagedFileReady = (stagedFileId: string): void => {
  useAppStore.getState().resolveStagedImportFileStructureInspection(stagedFileId, {
    hasMultipleObjects: false,
    hasHierarchy: false,
    hasParts: false,
    labels: [],
    partRows: [],
  })
}

const addReference = (fileName: string): string =>
  useAppStore.getState().addImportedReference({
    fileName,
    fileType: 'glb',
    objectUrl: `blob:${fileName}`,
  })

const toReaderInspectionModel = (entry: EditHistoryEntry) => ({
  entryId: entry.entryId,
  label: entry.label,
  source: entry.source,
  targetId: entry.targetId,
  targetLabel: entry.targetLabel,
  timestamp: entry.timestamp,
  transactionId: entry.transactionId,
  coalesceKey: entry.coalesceKey,
})

const groupEntryLabelsBySurface = (entries: EditHistoryEntry[]): Record<string, string[]> =>
  entries.reduce<Record<string, string[]>>((groups, entry) => {
    const current = groups[entry.source.surface] ?? []
    return {
      ...groups,
      [entry.source.surface]: [...current, entry.label],
    }
  }, {})

afterEach(() => {
  resetStores()
})

describe('edit history reader contract', () => {
  it('exposes reader-facing metadata through shallow undo and redo entries', () => {
    const store = useSpaghettiStore.getState()
    store.setGraph(baseGraph())
    editHistoryStore.clear()

    expect(
      useSpaghettiStore.getState().addGraphNodeWithHistory({
        node: {
          nodeId: 'node-reader',
          type: 'Part/HeelKick',
          params: {},
        },
        position: { x: 12, y: 24 },
      }),
    ).toBe(true)

    const undoEntry = expectReaderEntry(editHistoryStore.getUndoEntries()[0], {
      label: 'Add graph node',
      surface: 'spaghetti-graph',
      sourceId: 'graph-structure',
      sourceLabel: 'Graph Structure',
      targetId: 'node-reader',
      targetLabel: 'Part/HeelKick',
    })

    const undoSnapshot = editHistoryStore.getUndoEntries()
    undoSnapshot.pop()
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)

    expect(editHistoryStore.undo()).toBe(undoEntry)
    expectReaderEntry(editHistoryStore.getRedoEntries()[0], {
      label: 'Add graph node',
      surface: 'spaghetti-graph',
      sourceId: 'graph-structure',
      sourceLabel: 'Graph Structure',
      targetId: 'node-reader',
      targetLabel: 'Part/HeelKick',
    })
  })

  it('exposes graph movement, parameter, feature, and sketch adapter labels and targets', () => {
    useSpaghettiStore.getState().setGraph(graphWithParams())
    editHistoryStore.clear()
    expect(
      useSpaghettiStore.getState().commitGraphNodeMoveWithHistory({
        nodeId: 'node-a',
        from: { x: 0, y: 0 } satisfies GraphNodePos,
        to: { x: 22, y: 33 } satisfies GraphNodePos,
      }),
    ).toBe(true)
    expectReaderEntry(editHistoryStore.getUndoEntries()[0], {
      label: 'Move graph node',
      surface: 'spaghetti-graph',
      sourceId: 'graph-node-position',
      sourceLabel: 'Graph Node Position',
      targetId: 'node-a',
      targetLabel: 'node-a',
    })

    editHistoryStore.clear()
    const beforeParamGraph = useSpaghettiStore.getState().graph
    useSpaghettiStore.getState().applyGraphPatch((graph) => ({
      ...graph,
      nodes: graph.nodes.map((node) =>
        node.nodeId === 'node-a'
          ? {
              ...node,
              params: {
                ...node.params,
                widthMm: 25,
              },
            }
          : node,
      ),
    }))
    expect(
      useSpaghettiStore.getState().commitGraphNodeParameterWithHistory({
        nodeId: 'node-a',
        beforeGraph: beforeParamGraph,
        targetId: 'node-a:widthMm',
        targetLabel: 'Width',
      }),
    ).toBe(true)
    expectReaderEntry(editHistoryStore.getUndoEntries()[0], {
      label: 'Change graph parameter',
      surface: 'spaghetti-graph',
      sourceId: 'graph-node-parameter',
      sourceLabel: 'Graph Node Parameter',
      targetId: 'node-a:widthMm',
      targetLabel: 'Width',
    })

    useSpaghettiStore.getState().setGraph(graphWithFeatureStack([]))
    editHistoryStore.clear()
    useSpaghettiStore.getState().addSketchFeature('part-1')
    expectReaderEntry(editHistoryStore.getUndoEntries()[0], {
      label: 'Add feature',
      surface: 'spaghetti-graph',
      sourceId: 'graph-feature-stack',
      sourceLabel: 'Graph Feature Stack',
      targetId: 'part-1',
      targetLabel: 'Sketch feature',
    })

    useSpaghettiStore
      .getState()
      .setGraph(graphWithFeatureStack([sketchFeature(), closeProfileFeature()]))
    editHistoryStore.clear()
    useSpaghettiStore
      .getState()
      .setCloseProfileSource('part-1', 'feature-close-1', 'feature-sketch-1')
    expectReaderEntry(editHistoryStore.getUndoEntries()[0], {
      label: 'Change feature parameter',
      surface: 'spaghetti-graph',
      sourceId: 'graph-feature-parameter',
      sourceLabel: 'Graph Feature Parameter',
      targetId: 'part-1:feature-close-1:source',
      targetLabel: 'Close profile source',
    })

    useSpaghettiStore.getState().setGraph(graphWithFeatureStack([sketchFeature()]))
    editHistoryStore.clear()
    useSpaghettiStore.getState().addSketchComponent('part-1', 'feature-sketch-1', 'line')
    expectReaderEntry(editHistoryStore.getUndoEntries()[0], {
      label: 'Add sketch component',
      surface: 'spaghetti-graph',
      sourceId: 'graph-sketch-feature',
      sourceLabel: 'Graph Sketch Feature',
      targetId: 'part-1:feature-sketch-1:components',
      targetLabel: 'Sketch component',
    })

    useSpaghettiStore
      .getState()
      .setGraph(graphWithFeatureStack([sketchFeature('feature-sketch-1', [line('line-1')])]))
    editHistoryStore.clear()
    const beforeSketchGraph = useSpaghettiStore.getState().graph
    useSpaghettiStore
      .getState()
      .updateSketchComponentPoint('part-1', 'feature-sketch-1', 'line-1', 'b', point(150, 0))
    expect(
      useSpaghettiStore.getState().commitPartSketchFeatureWithHistory({
        nodeId: 'part-1',
        featureId: 'feature-sketch-1',
        beforeGraph: beforeSketchGraph,
        label: 'Change sketch component',
        targetId: 'part-1:feature-sketch-1:line-1:b',
        targetLabel: 'Sketch point',
      }),
    ).toBe(true)
    expectReaderEntry(editHistoryStore.getUndoEntries()[0], {
      label: 'Change sketch component',
      surface: 'spaghetti-graph',
      sourceId: 'graph-sketch-feature',
      sourceLabel: 'Graph Sketch Feature',
      targetId: 'part-1:feature-sketch-1:line-1:b',
      targetLabel: 'Sketch point',
    })
  })

  it('reads console and UI graph mutations as the same canonical graph change type', () => {
    useSpaghettiStore.getState().setGraph(baseGraph())
    editHistoryStore.clear()

    expect(
      useSpaghettiStore.getState().addGraphNodeWithHistory({
        node: {
          nodeId: 'node-ui',
          type: 'Part/HeelKick',
          params: {},
        },
        position: { x: 10, y: 20 },
      }),
    ).toBe(true)
    const uiEntry = editHistoryStore.getUndoEntries()[0]

    expect(
      useSpaghettiStore.getState().addGraphNodeWithHistory({
        node: {
          nodeId: 'node-console',
          type: 'Part/HeelKick',
          params: {},
        },
        position: { x: 30, y: 40 },
      }),
    ).toBe(true)
    const consoleEntry = editHistoryStore.getUndoEntries()[1]

    expect(uiEntry).toMatchObject({
      label: 'Add graph node',
      source: {
        surface: 'spaghetti-graph',
        sourceId: 'graph-structure',
        sourceLabel: 'Graph Structure',
      },
    })
    expect(consoleEntry).toMatchObject({
      label: 'Add graph node',
      source: uiEntry?.source,
    })
  })

  it('exposes timestamp and transaction metadata for reader inspection without payload access', () => {
    const valueRef = { value: 0 }
    expect(editHistoryStore.beginTransaction({
      transactionId: 'reader-transaction-1',
      entryId: 'reader-transaction-entry-1',
      label: 'Move reader target',
      source: {
        surface: 'reader-proof',
        sourceId: 'reader-transaction-source',
        sourceLabel: 'Reader Transaction Source',
      },
      targetId: 'reader-target-1',
      targetLabel: 'Reader target',
      coalesceKey: 'reader-target-1:position',
      initialValue: valueRef.value,
      currentValue: valueRef.value,
      buildEntry: ({
        transactionId,
        entryId,
        label,
        source,
        targetId,
        targetLabel,
        coalesceKey,
        initialValue,
        currentValue,
      }) => ({
        transactionId,
        entryId,
        label,
        source,
        targetId,
        targetLabel,
        coalesceKey,
        undo: () => {
          valueRef.value = initialValue
        },
        redo: () => {
          valueRef.value = currentValue
        },
      }),
    })).toBe(true)
    expect(editHistoryStore.updateTransaction('reader-transaction-1', 42)).toBe(true)
    expect(editHistoryStore.commitTransaction('reader-transaction-1').status).toBe('committed')

    const entry = expectReaderEntry(editHistoryStore.getUndoEntries()[0], {
      label: 'Move reader target',
      surface: 'reader-proof',
      sourceId: 'reader-transaction-source',
      sourceLabel: 'Reader Transaction Source',
      targetId: 'reader-target-1',
      targetLabel: 'Reader target',
    })
    const inspection = toReaderInspectionModel(entry)

    expect(inspection).toMatchObject({
      entryId: 'reader-transaction-entry-1',
      label: 'Move reader target',
      source: {
        surface: 'reader-proof',
        sourceId: 'reader-transaction-source',
        sourceLabel: 'Reader Transaction Source',
      },
      targetId: 'reader-target-1',
      targetLabel: 'Reader target',
      transactionId: 'reader-transaction-1',
      coalesceKey: 'reader-target-1:position',
      timestamp: expect.any(String),
    })
    expect(inspection).not.toHaveProperty('undo')
    expect(inspection).not.toHaveProperty('redo')
    expect(inspection).not.toHaveProperty('initialValue')
    expect(inspection).not.toHaveProperty('currentValue')
  })

  it('exposes browser, import, catalog, and viewer transform adapter metadata', () => {
    useAppStore.setState({
      projectContent: createProjectContent(),
    })
    editHistoryStore.clear()
    expect(
      useAppStore.getState().renameProjectContentOwnerWithHistory(
        { kind: 'assembly', assemblyId: 'assembly-a' },
        'Reader Assembly',
      ),
    ).toBe(true)
    expectReaderEntry(editHistoryStore.getUndoEntries()[0], {
      label: 'Rename Browser item',
      surface: 'browser',
      sourceId: 'browser-project-organization',
      sourceLabel: 'Browser Project Organization',
      targetId: 'assembly-a',
      targetLabel: 'Reader Assembly',
    })

    editHistoryStore.clear()
    useAppStore.getState().openStagedImportDraft({
      parentAssemblyId: null,
      parentComponentId: null,
    })
    markStagedFileReady(
      appendStagedImportFile({
        fileName: 'reader-import.step',
        fileType: 'step',
        objectUrl: 'blob:reader-import',
      }),
    )
    expect(useAppStore.getState().commitStagedImportDraftWithHistory()).toMatchObject({
      status: 'success',
      committedReferenceCount: 1,
    })
    expectReaderEntry(editHistoryStore.getUndoEntries()[0], {
      label: 'Accept Import',
      surface: 'browser',
      sourceId: 'browser-accepted-import',
      sourceLabel: 'Browser Accepted Import',
      targetLabel: '1 staged import',
    })

    editHistoryStore.clear()
    const catalogReferenceId = useAppStore.getState().addImportedReferenceWithHistory({
      catalogItemId: 'reference:reader-catalog',
      catalogFamilyKey: 'reader',
      fileName: 'Reader Catalog',
      fileType: 'glb',
      objectUrl: '/Catalog/reader.glb',
    })
    expect(catalogReferenceId).toBeTruthy()
    expectReaderEntry(editHistoryStore.getUndoEntries()[0], {
      label: 'Add Catalog item to project',
      surface: 'catalog',
      sourceId: 'catalog-add-to-project',
      sourceLabel: 'Catalog Add To Project',
      targetId: catalogReferenceId,
      targetLabel: 'Reader Catalog',
    })

    editHistoryStore.clear()
    const viewerReferenceId = addReference('reader-transform.glb')
    useAppStore.getState().beginViewerTransformShell({
      kind: 'reference',
      referenceId: viewerReferenceId,
    })
    useAppStore.getState().beginActiveViewerTransformEntry('translate')
    useAppStore.getState().setActiveViewerTransformDraft(movedTransform(7))
    useAppStore.getState().commitActiveViewerTransformEntry()
    expectReaderEntry(editHistoryStore.getUndoEntries()[0], {
      label: 'Change Viewer transform',
      surface: 'viewer-transform',
      sourceId: 'viewer-transform',
      sourceLabel: 'Viewer Transform',
      targetId: viewerReferenceId,
      targetLabel: 'reader-transform.glb',
    })
  })

  it('groups and filters representative Gen 2 reader metadata by public source surface', () => {
    editHistoryStore.clear()

    expect(
      runEnvironmentLookHistoryAction(
        () => useUiPrefsStore.getState().setEnvironmentGrade({ exposure: 1.35 }),
        {
          entryId: 'reader-environment-entry',
          targetId: 'environment-grade:exposure',
          targetLabel: 'Exposure',
        },
      ),
    ).toBe(true)
    expect(selectMaterialPresetWithHistory('brushed_metal', {
      entryId: 'reader-material-entry',
    })).toBe(true)
    expect(setGroundEnabledWithHistory(true, {
      entryId: 'reader-ground-entry',
    })).toBe(true)
    const noteId = createNoteWithHistory({
      title: 'Reader Note',
      body: 'Reader body',
    }, {
      entryId: 'reader-note-entry',
    })
    const laneId = createDashboardLaneAfterWithHistory(
      defaultDashboardLaneId,
      'Reader lane',
      {
        entryId: 'reader-dashboard-entry',
      },
    )
    expect(setWorkspaceStartupSurfaceWithHistory('modelViewer', {
      entryId: 'reader-ui-pref-entry',
    })).toBe(true)
    expect(setBrowserPresentationModeWithHistory('essentials', {
      entryId: 'reader-workspace-layout-entry',
    })).toBe(true)

    const undoEntries = editHistoryStore.getUndoEntries()
    const inspectionEntries = undoEntries.map(toReaderInspectionModel)

    expect(groupEntryLabelsBySurface(undoEntries)).toEqual({
      'viewer-environment': ['Change environment look'],
      'viewer-material': ['Change material'],
      'viewer-ground': ['Change ground setting'],
      notepad: ['Create note'],
      dashboard: ['Create Dashboard lane'],
      'home-page': ['Change startup preference'],
      'workspace-layout': ['Change Browser presentation'],
    })
    expect(
      inspectionEntries
        .filter((entry) => entry.source.surface.startsWith('viewer-'))
        .map((entry) => entry.source.surface),
    ).toEqual(['viewer-environment', 'viewer-material', 'viewer-ground'])
    expect(
      inspectionEntries.map((entry) => ({
        label: entry.label,
        source: entry.source,
        targetId: entry.targetId,
        targetLabel: entry.targetLabel,
        timestamp: entry.timestamp,
      })),
    ).toEqual([
      {
        label: 'Change environment look',
        source: {
          surface: 'viewer-environment',
          sourceId: 'environment-look',
          sourceLabel: 'Environment Look',
        },
        targetId: 'environment-grade:exposure',
        targetLabel: 'Exposure',
        timestamp: expect.any(String),
      },
      {
        label: 'Change material',
        source: {
          surface: 'viewer-material',
          sourceId: 'materials',
          sourceLabel: 'Materials',
        },
        targetId: 'material-preset:brushed_metal:select',
        targetLabel: 'Material preset selection',
        timestamp: expect.any(String),
      },
      {
        label: 'Change ground setting',
        source: {
          surface: 'viewer-ground',
          sourceId: 'ground',
          sourceLabel: 'Ground',
        },
        targetId: 'ground:enabled',
        targetLabel: 'Ground visibility',
        timestamp: expect.any(String),
      },
      {
        label: 'Create note',
        source: {
          surface: 'notepad',
          sourceId: 'notes',
          sourceLabel: 'Notes',
        },
        targetId: `note:${noteId}`,
        targetLabel: 'Reader Note',
        timestamp: expect.any(String),
      },
      {
        label: 'Create Dashboard lane',
        source: {
          surface: 'dashboard',
          sourceId: 'board',
          sourceLabel: 'Dashboard board',
        },
        targetId: `dashboard-lane:${laneId}`,
        targetLabel: 'Reader lane',
        timestamp: expect.any(String),
      },
      {
        label: 'Change startup preference',
        source: {
          surface: 'home-page',
          sourceId: 'startup-preferences',
          sourceLabel: 'Startup preferences',
        },
        targetId: 'ui-pref:workspaceStartupSurface',
        targetLabel: 'Startup surface',
        timestamp: expect.any(String),
      },
      {
        label: 'Change Browser presentation',
        source: {
          surface: 'workspace-layout',
          sourceId: 'browser-shell',
          sourceLabel: 'Browser shell',
        },
        targetId: 'workspace:browser-shell:presentation',
        targetLabel: 'Browser presentation',
        timestamp: expect.any(String),
      },
    ])
    inspectionEntries.forEach((entry) => {
      expect(Number.isNaN(Date.parse(entry.timestamp ?? ''))).toBe(false)
      expect(entry).not.toHaveProperty('undo')
      expect(entry).not.toHaveProperty('redo')
    })
  })

  it('preserves exclusion and invalidation boundaries while exposing reader metadata', () => {
    useSpaghettiStore.getState().setGraph(baseGraph())
    editHistoryStore.clear()
    expect(
      useSpaghettiStore.getState().addGraphNodeWithHistory({
        node: {
          nodeId: 'node-redo',
          type: 'Part/HeelKick',
          params: {},
        },
        position: { x: 10, y: 20 },
      }),
    ).toBe(true)
    expect(editHistoryStore.undo()).not.toBeNull()
    expect(editHistoryStore.canRedo()).toBe(true)

    useSpaghettiStore.getState().setNodePos('node-a', 40, 50)
    useAppStore.getState().setWorkspaceSelectedTarget({
      kind: 'object',
      objectId: 'runtime-selection',
    })

    expect(editHistoryStore.getUndoEntries()).toHaveLength(0)
    expect(editHistoryStore.canRedo()).toBe(true)

    expect(
      useSpaghettiStore.getState().removeGraphNodeWithHistory('missing-node'),
    ).toBe(false)
    expect(editHistoryStore.getUndoEntries()).toHaveLength(0)
    expect(editHistoryStore.canRedo()).toBe(true)
  })
})
