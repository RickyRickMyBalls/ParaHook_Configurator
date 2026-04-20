// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  clearRecentItemsSnapshot,
  normalizeRecentItemsSnapshot,
  readRecentItemsPolicy,
  readRecentItemsSnapshot,
  recentItemsStoragePolicyChangedEvent,
  recentItemsStoragePolicyKey,
  recentItemsStorageBucketDescriptor,
  recentItemsStorageSnapshotKey,
  serializeRecentItemsSnapshot,
  setRecentItemsRememberEnabled,
  upsertRecentItem,
  writeRecentItemsSnapshot,
  type RecentItem,
} from './recentItemsPersistence'

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

const createRecentItem = (
  itemId: string,
  owner: RecentItem['target']['owner'],
  targetId: string,
  label = itemId,
): RecentItem => ({
  itemId,
  label,
  target: {
    owner,
    targetId,
  },
  updatedAt: '2026-04-19T18:30:00.000Z',
})

describe('recentItemsPersistence', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('serializes a bounded recent working-set snapshot with reference-only targets', () => {
    const graphItem = createRecentItem(
      'recent-graph-1',
      'graph',
      'graph-document-1',
      'Draft graph',
    )
    const browserItem = createRecentItem(
      'recent-browser-1',
      'browser',
      'browser-content-1',
      'Browser content',
    )
    const snapshot = serializeRecentItemsSnapshot(
      {
        itemsById: {
          [graphItem.itemId]: graphItem,
          [browserItem.itemId]: browserItem,
        },
        itemOrder: [browserItem.itemId, graphItem.itemId],
        activeItemId: graphItem.itemId,
      },
      1,
    )

    expect(snapshot).toEqual({
      version: 1,
      itemsById: {
        [browserItem.itemId]: browserItem,
      },
      itemOrder: [browserItem.itemId],
      activeItemId: browserItem.itemId,
    })
    expect(recentItemsStorageBucketDescriptor).toEqual({
      id: 'recent-items',
      label: 'Recent items',
      storageKey: recentItemsStorageSnapshotKey,
      ownerSeam: 'src/app/recentItems/recentItemsPersistence.ts',
    })
  })

  it('normalizes corrupt entries without inventing content ownership', () => {
    const snapshot = normalizeRecentItemsSnapshot({
      version: 1,
      itemsById: {
        'recent-graph-1': {
          itemId: 'recent-graph-1',
          label: 'Graph',
          target: {
            owner: 'graph',
            targetId: 'graph-document-1',
          },
          updatedAt: '2026-04-19T18:30:00.000Z',
        },
        'bad-owner': {
          itemId: 'bad-owner',
          label: 'Bad',
          target: {
            owner: 'catalog',
            targetId: 'catalog-item-1',
          },
          updatedAt: '2026-04-19T18:30:00.000Z',
        },
      },
      itemOrder: ['missing', 'recent-graph-1', 'recent-graph-1'],
      activeItemId: 'missing',
    })

    expect(snapshot).toEqual({
      version: 1,
      itemsById: {
        'recent-graph-1': {
          itemId: 'recent-graph-1',
          label: 'Graph',
          target: {
            owner: 'graph',
            targetId: 'graph-document-1',
          },
          updatedAt: '2026-04-19T18:30:00.000Z',
        },
      },
      itemOrder: ['recent-graph-1'],
      activeItemId: 'recent-graph-1',
    })
  })

  it('persists, reads, and clears the recent-items bucket through its owner key', () => {
    const storage = createStorage()
    const recentItem = createRecentItem('recent-workspace-1', 'workspace', 'last-workspace-layout')
    const snapshot = serializeRecentItemsSnapshot({
      itemsById: {
        [recentItem.itemId]: recentItem,
      },
      itemOrder: [recentItem.itemId],
      activeItemId: recentItem.itemId,
    })

    writeRecentItemsSnapshot(snapshot, storage)

    expect(storage.values[recentItemsStorageSnapshotKey]).toBe(JSON.stringify(snapshot))
    expect(readRecentItemsSnapshot(storage)).toEqual(snapshot)

    clearRecentItemsSnapshot(storage)

    expect(readRecentItemsSnapshot(storage)).toBeNull()
  })

  it('upserts a recent item as the active newest item and keeps the working set bounded', () => {
    const oldItem = createRecentItem('old-item', 'browser', 'browser-content-1', 'Old')
    const middleItem = createRecentItem('middle-item', 'graph', 'graph-document-1', 'Middle')
    const nextItem = createRecentItem('next-item', 'workspace', 'last-workspace-layout', 'Next')
    const snapshot = serializeRecentItemsSnapshot({
      itemsById: {
        [oldItem.itemId]: oldItem,
        [middleItem.itemId]: middleItem,
      },
      itemOrder: [oldItem.itemId, middleItem.itemId],
      activeItemId: oldItem.itemId,
    })

    const nextSnapshot = upsertRecentItem(snapshot, nextItem, 2)

    expect(nextSnapshot).toEqual({
      version: 1,
      itemsById: {
        [nextItem.itemId]: nextItem,
        [oldItem.itemId]: oldItem,
      },
      itemOrder: [nextItem.itemId, oldItem.itemId],
      activeItemId: nextItem.itemId,
    })
  })

  it('stores remember/forget policy separately and forget clears the recent-items bucket', () => {
    const storage = createStorage()
    const dispatchEvent = vi.spyOn(window, 'dispatchEvent')
    const recentItem = createRecentItem('recent-workspace-1', 'workspace', 'last-workspace-layout')
    const snapshot = serializeRecentItemsSnapshot({
      itemsById: {
        [recentItem.itemId]: recentItem,
      },
      itemOrder: [recentItem.itemId],
      activeItemId: recentItem.itemId,
    })
    writeRecentItemsSnapshot(snapshot, storage)

    const policy = setRecentItemsRememberEnabled(false, storage)

    expect(policy).toEqual({
      version: 1,
      rememberRecentItems: false,
    })
    expect(storage.values[recentItemsStoragePolicyKey]).toBe(JSON.stringify(policy))
    expect(storage.values[recentItemsStorageSnapshotKey]).toBeUndefined()
    expect(readRecentItemsPolicy(storage)).toEqual(policy)
    expect(dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: recentItemsStoragePolicyChangedEvent,
      }),
    )
  })
})
