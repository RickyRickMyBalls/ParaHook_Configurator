import { parseGraphDocument } from '../schema/spaghettiSchema'
import type { GraphDocument } from '../schema/spaghettiTypes'

export const graphBrowserStorageSnapshotKey = 'parahook.graphBrowserStorage.workingSet.v1'
export const graphBrowserStoragePolicyKey = 'parahook.graphBrowserStorage.policy.v1'
export const graphBrowserStoragePolicyChangedEvent = 'parahook:graph-browser-storage-policy-changed'

type StorageLike = {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

export type GraphBrowserStorageWorkingSetSnapshot = {
  version: 1
  graphDocumentsById: Record<string, GraphDocument>
  graphDocumentOrder: string[]
  activeGraphDocumentId: string
}

export type GraphBrowserStoragePolicy = {
  version: 1
  rememberGraphWorkingSet: boolean
}

export const defaultGraphBrowserStoragePolicy: GraphBrowserStoragePolicy = {
  version: 1,
  rememberGraphWorkingSet: true,
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const getBrowserStorage = (): StorageLike | null => {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return null
  }
  return window.localStorage
}

const cloneGraphDocument = (document: GraphDocument): GraphDocument => ({
  graphDocumentId: document.graphDocumentId,
  name: document.name,
  version: document.version,
  graph: structuredClone(document.graph),
})

export const serializeGraphBrowserStorageSnapshot = (
  source: Pick<
    GraphBrowserStorageWorkingSetSnapshot,
    'graphDocumentsById' | 'graphDocumentOrder' | 'activeGraphDocumentId'
  >,
): GraphBrowserStorageWorkingSetSnapshot => {
  const graphDocumentsById: Record<string, GraphDocument> = {}
  const graphDocumentOrder = source.graphDocumentOrder.filter(
    (graphDocumentId) => source.graphDocumentsById[graphDocumentId] !== undefined,
  )
  for (const graphDocumentId of graphDocumentOrder) {
    graphDocumentsById[graphDocumentId] = cloneGraphDocument(
      source.graphDocumentsById[graphDocumentId],
    )
  }
  const activeGraphDocumentId =
    graphDocumentsById[source.activeGraphDocumentId] !== undefined
      ? source.activeGraphDocumentId
      : graphDocumentOrder[0] ?? ''

  return {
    version: 1,
    graphDocumentsById,
    graphDocumentOrder,
    activeGraphDocumentId,
  }
}

export const normalizeGraphBrowserStorageSnapshot = (
  value: unknown,
): GraphBrowserStorageWorkingSetSnapshot | null => {
  if (!isRecord(value) || value.version !== 1 || !isRecord(value.graphDocumentsById)) {
    return null
  }
  if (!Array.isArray(value.graphDocumentOrder)) {
    return null
  }

  const graphDocumentsById: Record<string, GraphDocument> = {}
  for (const [graphDocumentId, rawDocument] of Object.entries(value.graphDocumentsById)) {
    try {
      const document = parseGraphDocument(rawDocument)
      if (document.graphDocumentId === graphDocumentId) {
        graphDocumentsById[graphDocumentId] = document
      }
    } catch {
      // Invalid documents are ignored so one bad entry does not poison the whole bucket.
    }
  }

  const graphDocumentOrder = value.graphDocumentOrder.filter(
    (graphDocumentId): graphDocumentId is string =>
      typeof graphDocumentId === 'string' &&
      graphDocumentsById[graphDocumentId] !== undefined,
  )
  if (graphDocumentOrder.length === 0) {
    return null
  }

  const activeGraphDocumentId =
    typeof value.activeGraphDocumentId === 'string' &&
    graphDocumentsById[value.activeGraphDocumentId] !== undefined
      ? value.activeGraphDocumentId
      : graphDocumentOrder[0]

  return {
    version: 1,
    graphDocumentsById,
    graphDocumentOrder,
    activeGraphDocumentId,
  }
}

export const readGraphBrowserStorageSnapshot = (
  storage: StorageLike | null = getBrowserStorage(),
): GraphBrowserStorageWorkingSetSnapshot | null => {
  if (storage === null) {
    return null
  }
  try {
    const rawValue = storage.getItem(graphBrowserStorageSnapshotKey)
    if (rawValue === null || rawValue.length === 0) {
      return null
    }
    return normalizeGraphBrowserStorageSnapshot(JSON.parse(rawValue))
  } catch {
    return null
  }
}

export const writeGraphBrowserStorageSnapshot = (
  snapshot: GraphBrowserStorageWorkingSetSnapshot,
  storage: StorageLike | null = getBrowserStorage(),
): void => {
  if (storage === null) {
    return
  }
  try {
    storage.setItem(graphBrowserStorageSnapshotKey, JSON.stringify(snapshot))
  } catch {
    // Ignore quota/write failures so graph editing remains usable without browser persistence.
  }
}

export const clearGraphBrowserStorageSnapshot = (
  storage: StorageLike | null = getBrowserStorage(),
): void => {
  if (storage === null) {
    return
  }
  try {
    storage.removeItem(graphBrowserStorageSnapshotKey)
  } catch {
    // Ignore storage failures so forget remains non-blocking.
  }
}

export const normalizeGraphBrowserStoragePolicy = (
  value: unknown,
): GraphBrowserStoragePolicy => ({
  version: 1,
  rememberGraphWorkingSet:
    isRecord(value) && typeof value.rememberGraphWorkingSet === 'boolean'
      ? value.rememberGraphWorkingSet
      : defaultGraphBrowserStoragePolicy.rememberGraphWorkingSet,
})

export const readGraphBrowserStoragePolicy = (
  storage: StorageLike | null = getBrowserStorage(),
): GraphBrowserStoragePolicy => {
  if (storage === null) {
    return defaultGraphBrowserStoragePolicy
  }
  try {
    const rawValue = storage.getItem(graphBrowserStoragePolicyKey)
    if (rawValue === null || rawValue.length === 0) {
      return defaultGraphBrowserStoragePolicy
    }
    return normalizeGraphBrowserStoragePolicy(JSON.parse(rawValue))
  } catch {
    return defaultGraphBrowserStoragePolicy
  }
}

export const writeGraphBrowserStoragePolicy = (
  policy: GraphBrowserStoragePolicy,
  storage: StorageLike | null = getBrowserStorage(),
): void => {
  if (storage === null) {
    return
  }
  try {
    storage.setItem(graphBrowserStoragePolicyKey, JSON.stringify(policy))
  } catch {
    // Ignore policy write failures; the in-memory UI can still toggle locally.
  }
}

const dispatchGraphBrowserStoragePolicyChanged = (policy: GraphBrowserStoragePolicy): void => {
  if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') {
    return
  }
  window.dispatchEvent(
    new CustomEvent(graphBrowserStoragePolicyChangedEvent, {
      detail: policy,
    }),
  )
}

export const setGraphBrowserStorageRememberEnabled = (
  rememberGraphWorkingSet: boolean,
  storage: StorageLike | null = getBrowserStorage(),
): GraphBrowserStoragePolicy => {
  const policy: GraphBrowserStoragePolicy = {
    version: 1,
    rememberGraphWorkingSet,
  }
  writeGraphBrowserStoragePolicy(policy, storage)
  if (!rememberGraphWorkingSet) {
    clearGraphBrowserStorageSnapshot(storage)
  }
  dispatchGraphBrowserStoragePolicyChanged(policy)
  return policy
}
