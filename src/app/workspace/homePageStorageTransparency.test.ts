import { describe, expect, it } from 'vitest'
import {
  formatHomePageStorageBytes,
  homePageGraphDocumentPersistenceNote,
  homePageRecentItemsPersistenceNote,
  readHomePageOriginStorageEstimate,
  readHomePageStorageBuckets,
} from './homePageStorageTransparency'
import { dashboardStorageKey } from '../dashboard/dashboardPersistence'
import { notepadStorageKey } from '../notepad/notepadPersistence'
import { recentItemsStorageSnapshotKey } from '../recentItems/recentItemsPersistence'
import { graphBrowserStorageSnapshotKey } from '../spaghetti/store/graphBrowserStoragePersistence'
import { uiPrefsStorageKey } from '../store/uiPrefsPersistence'
import { workspaceLayoutStorageKey } from './workspacePersistence'

const utf8Bytes = (value: string): number => new TextEncoder().encode(value).length

describe('homePageStorageTransparency', () => {
  it('lists the live browser persistence buckets and measures their approximate localStorage size', () => {
    const storageValues: Record<string, string> = {
      [workspaceLayoutStorageKey]: '{"layout":"alpha"}',
      [uiPrefsStorageKey]: '{"view":"beta"}',
      [dashboardStorageKey]: '{"widgets":"gamma"}',
      [notepadStorageKey]: '{"notes":"delta"}',
      [graphBrowserStorageSnapshotKey]: '{"graphs":"epsilon"}',
      [recentItemsStorageSnapshotKey]: '{"recent":"zeta"}',
    }
    const storage = {
      getItem: (key: string) => storageValues[key] ?? null,
    }

    const buckets = readHomePageStorageBuckets(storage)

    expect(buckets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: 'Workspace layout',
          storageKey: workspaceLayoutStorageKey,
          ownerSeam: 'workspacePersistence.ts',
          present: true,
          approximateBytes:
            utf8Bytes(workspaceLayoutStorageKey) + utf8Bytes(storageValues[workspaceLayoutStorageKey]),
        }),
        expect.objectContaining({
          label: 'UI preferences',
          storageKey: uiPrefsStorageKey,
          ownerSeam: 'uiPrefsPersistence.ts',
          present: true,
          approximateBytes:
            utf8Bytes(uiPrefsStorageKey) + utf8Bytes(storageValues[uiPrefsStorageKey]),
        }),
        expect.objectContaining({
          label: 'Dashboard widgets',
          storageKey: dashboardStorageKey,
          ownerSeam: 'dashboardPersistence.ts',
          present: true,
          approximateBytes:
            utf8Bytes(dashboardStorageKey) + utf8Bytes(storageValues[dashboardStorageKey]),
        }),
        expect.objectContaining({
          label: 'Notepad notes',
          storageKey: notepadStorageKey,
          ownerSeam: 'notepadPersistence.ts',
          present: true,
          approximateBytes:
            utf8Bytes(notepadStorageKey) + utf8Bytes(storageValues[notepadStorageKey]),
        }),
        expect.objectContaining({
          label: 'Graph working set',
          storageKey: graphBrowserStorageSnapshotKey,
          ownerSeam: 'graphBrowserStoragePersistence.ts',
          present: true,
          approximateBytes:
            utf8Bytes(graphBrowserStorageSnapshotKey) +
            utf8Bytes(storageValues[graphBrowserStorageSnapshotKey]),
        }),
        expect.objectContaining({
          label: 'Recent items',
          storageKey: recentItemsStorageSnapshotKey,
          ownerSeam: 'recentItemsPersistence.ts',
          present: true,
          approximateBytes:
            utf8Bytes(recentItemsStorageSnapshotKey) +
            utf8Bytes(storageValues[recentItemsStorageSnapshotKey]),
        }),
      ]),
    )
    expect(formatHomePageStorageBytes(0)).toBe('0 B')
    expect(formatHomePageStorageBytes(1536)).toBe('1.5 KiB')
    expect(homePageGraphDocumentPersistenceNote).toContain('graphBrowserStoragePersistence.ts')
    expect(homePageGraphDocumentPersistenceNote).toContain('graphDocumentPersistence.ts')
    expect(homePageRecentItemsPersistenceNote).toContain('recentItemsPersistence.ts')
  })

  it('reports browser origin storage support as unavailable when the browser estimate seam does not exist', async () => {
    await expect(readHomePageOriginStorageEstimate(undefined)).resolves.toEqual({
      state: 'unsupported',
      message: 'Unavailable in this browser.',
      usageBytes: null,
      quotaBytes: null,
    })

    await expect(
      readHomePageOriginStorageEstimate({
        estimate: async () => ({
          usage: 4096,
          quota: 16384,
        }),
      }),
    ).resolves.toEqual({
      state: 'available',
      message: '4.0 KiB used of 16.0 KiB',
      usageBytes: 4096,
      quotaBytes: 16384,
    })
  })
})
