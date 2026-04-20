// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest'
import type { GraphDocument } from '../schema/spaghettiTypes'
import {
  clearGraphBrowserStorageSnapshot,
  graphBrowserStoragePolicyChangedEvent,
  graphBrowserStoragePolicyKey,
  graphBrowserStorageSnapshotKey,
  normalizeGraphBrowserStorageSnapshot,
  readGraphBrowserStoragePolicy,
  readGraphBrowserStorageSnapshot,
  serializeGraphBrowserStorageSnapshot,
  setGraphBrowserStorageRememberEnabled,
  writeGraphBrowserStorageSnapshot,
} from './graphBrowserStoragePersistence'

const createGraphDocument = (graphDocumentId: string, name: string): GraphDocument => ({
  graphDocumentId,
  name,
  version: 1,
  graph: {
    schemaVersion: 1,
    nodes: [
      {
        nodeId: `${graphDocumentId}:node-baseplate-1`,
        type: 'Part/Baseplate',
        params: {},
      },
    ],
    edges: [],
  },
})

const createStorage = () => {
  const values: Record<string, string> = {}
  return {
    getItem: (key: string) => values[key] ?? null,
    setItem: (key: string, value: string) => {
      values[key] = value
    },
    removeItem: (key: string) => {
      delete values[key]
    },
    values,
  }
}

describe('graphBrowserStoragePersistence', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('serializes a recent graph working-set snapshot without taking file IO ownership', () => {
    const graphDocumentOne = createGraphDocument('graph-document-1', 'Graph 1')
    const graphDocumentTwo = createGraphDocument('graph-document-2', 'Graph 2')

    const snapshot = serializeGraphBrowserStorageSnapshot({
      graphDocumentsById: {
        [graphDocumentOne.graphDocumentId]: graphDocumentOne,
        [graphDocumentTwo.graphDocumentId]: graphDocumentTwo,
      },
      graphDocumentOrder: [graphDocumentOne.graphDocumentId, graphDocumentTwo.graphDocumentId],
      activeGraphDocumentId: graphDocumentTwo.graphDocumentId,
    })

    expect(snapshot).toEqual({
      version: 1,
      graphDocumentsById: {
        [graphDocumentOne.graphDocumentId]: graphDocumentOne,
        [graphDocumentTwo.graphDocumentId]: graphDocumentTwo,
      },
      graphDocumentOrder: [graphDocumentOne.graphDocumentId, graphDocumentTwo.graphDocumentId],
      activeGraphDocumentId: graphDocumentTwo.graphDocumentId,
    })
    expect(normalizeGraphBrowserStorageSnapshot(snapshot)).toEqual(snapshot)
  })

  it('persists, reads, and clears the graph working-set bucket through its own storage key', () => {
    const storage = createStorage()
    const snapshot = serializeGraphBrowserStorageSnapshot({
      graphDocumentsById: {
        'graph-document-1': createGraphDocument('graph-document-1', 'Graph 1'),
      },
      graphDocumentOrder: ['graph-document-1'],
      activeGraphDocumentId: 'graph-document-1',
    })

    writeGraphBrowserStorageSnapshot(snapshot, storage)

    expect(storage.values[graphBrowserStorageSnapshotKey]).toBe(JSON.stringify(snapshot))
    expect(readGraphBrowserStorageSnapshot(storage)).toEqual(snapshot)

    clearGraphBrowserStorageSnapshot(storage)

    expect(readGraphBrowserStorageSnapshot(storage)).toBeNull()
  })

  it('stores remember/forget policy separately and forget clears the snapshot bucket', () => {
    const storage = createStorage()
    const dispatchEvent = vi.spyOn(window, 'dispatchEvent')
    const snapshot = serializeGraphBrowserStorageSnapshot({
      graphDocumentsById: {
        'graph-document-1': createGraphDocument('graph-document-1', 'Graph 1'),
      },
      graphDocumentOrder: ['graph-document-1'],
      activeGraphDocumentId: 'graph-document-1',
    })
    writeGraphBrowserStorageSnapshot(snapshot, storage)

    const policy = setGraphBrowserStorageRememberEnabled(false, storage)

    expect(policy).toEqual({
      version: 1,
      rememberGraphWorkingSet: false,
    })
    expect(storage.values[graphBrowserStoragePolicyKey]).toBe(JSON.stringify(policy))
    expect(storage.values[graphBrowserStorageSnapshotKey]).toBeUndefined()
    expect(readGraphBrowserStoragePolicy(storage)).toEqual(policy)
    expect(dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: graphBrowserStoragePolicyChangedEvent,
      }),
    )
  })
})
