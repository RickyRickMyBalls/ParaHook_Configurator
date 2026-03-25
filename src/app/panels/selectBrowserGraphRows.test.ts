import { describe, expect, it } from 'vitest'
import type { GraphOutputSurface } from '../spaghetti/outputSurface'
import type { GraphDocument } from '../spaghetti/schema/spaghettiTypes'
import type {
  CachedGraphEntry,
  GraphRuntimeState,
} from '../spaghetti/store/useSpaghettiStore'
import { selectBrowserGraphRows } from './selectBrowserGraphRows'

const graphDocument = (graphDocumentId: string, name: string): GraphDocument => ({
  graphDocumentId,
  name,
  version: 1,
  graph: {
    schemaVersion: 1,
    nodes: [],
    edges: [],
  },
})

const cachedGraphEntry = (
  cachedGraphId: string,
  graphDocumentId: string,
  isDirty: boolean,
): CachedGraphEntry => ({
  cachedGraphId,
  graphDocumentId,
  source: 'in-memory',
  isDirty,
})

const outputSurface = (
  graphDocumentId: string,
  entries: GraphOutputSurface['entries'],
  publishedAtBuildSeq: number | null = 7,
): GraphOutputSurface => ({
  graphDocumentId,
  publishedAtBuildSeq,
  surfaceVersion: 1,
  entries,
})

const graphRuntime = (options?: {
  outputSurface?: GraphOutputSurface | null
  currentGraphRevision?: number
  latestAcceptedGraphRevision?: number | null
  inFlightBuildSeq?: number | null
}): GraphRuntimeState =>
  ({
    compileBuild: {
      lastCompileResult: null,
      previousBuildInputs: null,
      pendingChangedParamIds: [],
      pendingStatsPartKeys: [],
      pendingInstances: null,
      currentGraphRevision: options?.currentGraphRevision ?? 0,
      lastBuildSeq: null,
      latestIssuedGraphRevision: null,
      latestIssuedBuildSeq: 0,
      latestAcceptedGraphRevision: options?.latestAcceptedGraphRevision ?? null,
      latestAcceptedBuildSeq: null,
      inFlightGraphRevision: null,
      inFlightBuildRequestId: null,
      inFlightBuildSeq: options?.inFlightBuildSeq ?? null,
    },
    previewPreparation: {
      previewIntent: 'outputPreview',
      buildStatsReadyPartKeys: [],
      outputPreviewSlots: [],
      nextOutputPreviewSlotIndex: 1,
    },
    acceptedBuildOutputs: [],
    acceptedPreviewBuildOutputs: [],
    outputSurface:
      options?.outputSurface ??
      outputSurface('graph-document-1', [], options?.latestAcceptedGraphRevision ?? null),
  }) as unknown as GraphRuntimeState

describe('selectBrowserGraphRows', () => {
  it('builds graph rows with focus/open status and published graph output rows', () => {
    const rows = selectBrowserGraphRows({
      cachedGraphEntryOrder: ['graph-document-1'],
      cachedGraphEntriesById: {
        'graph-document-1': cachedGraphEntry('graph-document-1', 'graph-document-1', true),
      },
      graphDocumentsById: {
        'graph-document-1': graphDocument('graph-document-1', 'Graph 1'),
      },
      graphRuntimeByDocumentId: {
        'graph-document-1': graphRuntime({
          currentGraphRevision: 3,
          latestAcceptedGraphRevision: 1,
          outputSurface: outputSurface('graph-document-1', [
            {
              outputEntryId: 'output-entry:s001:node-a',
              slotId: 's001',
              sourceNodeId: 'node-a',
              label: 's001',
              state: 'resolved',
              acceptedArtifactKey: 'baseplate',
            },
            {
              outputEntryId: 'output-entry:s002:node-b',
              slotId: 's002',
              sourceNodeId: 'node-b',
              label: 's002',
              state: 'unresolved',
              acceptedArtifactKey: null,
            },
          ]),
        }),
      },
      activeGraphDocumentId: 'graph-document-1',
      openViewportCountByGraphDocumentId: new Map([['graph-document-1', 2]]),
      hasFocusedViewportByGraphDocumentId: new Map([['graph-document-1', true]]),
    })

    expect(rows).toEqual([
      {
        cachedGraphId: 'graph-document-1',
        graphDocumentId: 'graph-document-1',
        label: 'Graph 1',
        meta: 'Dirty | Active editor | 2 editors',
        saveState: 'unsaved',
        isFocused: true,
        openViewportCount: 2,
        hasFocusedViewport: true,
        buildState: 'rebuild',
        buildStateLabel: 'Rebuild',
        authoredBrowserBuildPolicy: null,
        effectiveBrowserBuildPolicy: 'live',
        effectiveBrowserBuildPolicySource: 'default',
        effectiveBrowserBuildPolicySourceLabel: null,
        publishedOutputRows: [
          {
            rowId: 'published-output-row:graph-document-1:output-entry:s001:node-a',
            outputEntryId: 'output-entry:s001:node-a',
            slotId: 's001',
            sourceNodeId: 'node-a',
            label: 's001',
            meta: 'Resolved | baseplate | Build 7',
            state: 'resolved',
            highlightViewerKey: 's001',
            authoringGraphDocumentId: 'graph-document-1',
            authoringNodeId: 'node-a',
          },
          {
            rowId: 'published-output-row:graph-document-1:output-entry:s002:node-b',
            outputEntryId: 'output-entry:s002:node-b',
            slotId: 's002',
            sourceNodeId: 'node-b',
            label: 's002',
            meta: 'Unresolved | Build 7',
            state: 'unresolved',
            highlightViewerKey: 's002',
            authoringGraphDocumentId: 'graph-document-1',
            authoringNodeId: 'node-b',
          },
        ],
      },
    ])
  })

  it('keeps graphs without published outputs but returns no child rows', () => {
    const rows = selectBrowserGraphRows({
      cachedGraphEntryOrder: ['graph-document-1'],
      cachedGraphEntriesById: {
        'graph-document-1': cachedGraphEntry('graph-document-1', 'graph-document-1', false),
      },
      graphDocumentsById: {
        'graph-document-1': graphDocument('graph-document-1', 'Graph 1'),
      },
      graphRuntimeByDocumentId: {
        'graph-document-1': graphRuntime({
          currentGraphRevision: 5,
          latestAcceptedGraphRevision: 5,
          inFlightBuildSeq: 9,
          outputSurface: outputSurface('graph-document-1', [], null),
        }),
      },
      activeGraphDocumentId: 'graph-document-2',
      openViewportCountByGraphDocumentId: new Map(),
      hasFocusedViewportByGraphDocumentId: new Map(),
    })

    expect(rows[0]).toMatchObject({
      label: 'Graph 1',
      meta: 'Saved | Closed',
      saveState: 'saved',
      isFocused: false,
      buildState: 'building',
      buildStateLabel: 'Building',
      publishedOutputRows: [],
    })
  })

  it('marks a graph done when the latest accepted build matches the current graph revision', () => {
    const rows = selectBrowserGraphRows({
      cachedGraphEntryOrder: ['graph-document-1'],
      cachedGraphEntriesById: {
        'graph-document-1': cachedGraphEntry('graph-document-1', 'graph-document-1', true),
      },
      graphDocumentsById: {
        'graph-document-1': graphDocument('graph-document-1', 'Graph 1'),
      },
      graphRuntimeByDocumentId: {
        'graph-document-1': graphRuntime({
          currentGraphRevision: 4,
          latestAcceptedGraphRevision: 4,
          outputSurface: outputSurface('graph-document-1', [], 22),
        }),
      },
      activeGraphDocumentId: 'graph-document-1',
      openViewportCountByGraphDocumentId: new Map(),
      hasFocusedViewportByGraphDocumentId: new Map(),
    })

    expect(rows[0]).toMatchObject({
      saveState: 'unsaved',
      buildState: 'done',
      buildStateLabel: 'Done',
    })
  })

  it('exposes authored and effective browser build policy for graph rows', () => {
    const rows = selectBrowserGraphRows({
      cachedGraphEntryOrder: ['graph-document-1'],
      cachedGraphEntriesById: {
        'graph-document-1': cachedGraphEntry('graph-document-1', 'graph-document-1', true),
      },
      graphDocumentsById: {
        'graph-document-1': graphDocument('graph-document-1', 'Graph 1'),
      },
      graphRuntimeByDocumentId: {
        'graph-document-1': graphRuntime(),
      },
      browserGraphBuildPolicyByGraphDocumentId: {
        'graph-document-1': 'manual',
      },
      activeGraphDocumentId: 'graph-document-1',
      openViewportCountByGraphDocumentId: new Map(),
      hasFocusedViewportByGraphDocumentId: new Map(),
    })

    expect(rows[0]).toMatchObject({
      authoredBrowserBuildPolicy: 'manual',
      effectiveBrowserBuildPolicy: 'manual',
      effectiveBrowserBuildPolicySource: 'self',
      effectiveBrowserBuildPolicySourceLabel: 'Graph 1',
    })
  })
})
