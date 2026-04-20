// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { GraphDocument } from '../schema/spaghettiTypes'
import {
  graphBrowserStorageSnapshotKey,
  serializeGraphBrowserStorageSnapshot,
  setGraphBrowserStorageRememberEnabled,
} from './graphBrowserStoragePersistence'
import { useGraphBrowserStoragePersistenceBridge } from './useGraphBrowserStoragePersistenceBridge'
import { selectOrderedGraphDocuments, useSpaghettiStore } from './useSpaghettiStore'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

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

function GraphBrowserStoragePersistenceBridgeHarness() {
  useGraphBrowserStoragePersistenceBridge()
  return null
}

describe('useGraphBrowserStoragePersistenceBridge', () => {
  let container: HTMLDivElement | null = null
  let root: Root | null = null

  beforeEach(() => {
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
    window.localStorage.clear()
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
  })

  it('hydrates graph documents from the remembered browser working-set snapshot', async () => {
    const graphDocumentOne = createGraphDocument('graph-document-alpha', 'Alpha')
    const graphDocumentTwo = createGraphDocument('graph-document-beta', 'Beta')
    const snapshot = serializeGraphBrowserStorageSnapshot({
      graphDocumentsById: {
        [graphDocumentOne.graphDocumentId]: graphDocumentOne,
        [graphDocumentTwo.graphDocumentId]: graphDocumentTwo,
      },
      graphDocumentOrder: [graphDocumentOne.graphDocumentId, graphDocumentTwo.graphDocumentId],
      activeGraphDocumentId: graphDocumentTwo.graphDocumentId,
    })
    window.localStorage.setItem(graphBrowserStorageSnapshotKey, JSON.stringify(snapshot))

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<GraphBrowserStoragePersistenceBridgeHarness />)
    })

    const state = useSpaghettiStore.getState()
    expect(state.activeGraphDocumentId).toBe(graphDocumentTwo.graphDocumentId)
    expect(selectOrderedGraphDocuments(state).map((document) => document.name)).toEqual([
      'Alpha',
      'Beta',
    ])
    expect(JSON.parse(window.localStorage.getItem(graphBrowserStorageSnapshotKey) ?? 'null')).toEqual(
      expect.objectContaining({
        graphDocumentOrder: [graphDocumentOne.graphDocumentId, graphDocumentTwo.graphDocumentId],
        activeGraphDocumentId: graphDocumentTwo.graphDocumentId,
      }),
    )
  })

  it('persists store edits while remembered and clears the snapshot when forgotten', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<GraphBrowserStoragePersistenceBridgeHarness />)
    })

    await act(async () => {
      useSpaghettiStore.getState().createGraphDocument(undefined, 'Browser Saved Graph')
    })

    expect(window.localStorage.getItem(graphBrowserStorageSnapshotKey)).toContain(
      'Browser Saved Graph',
    )

    await act(async () => {
      setGraphBrowserStorageRememberEnabled(false)
    })

    expect(window.localStorage.getItem(graphBrowserStorageSnapshotKey)).toBeNull()
  })
})
