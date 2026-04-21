import { dashboardStorageKey } from '../dashboard/dashboardPersistence'
import { notepadStorageKey } from '../notepad/notepadPersistence'
import { recentItemsStorageBucketDescriptor } from '../recentItems/recentItemsPersistence'
import { pubPartsDownloadsStorageBucketDescriptor } from '../catalog/pubPartsDownloadsStorage'
import { graphBrowserStorageSnapshotKey } from '../spaghetti/store/graphBrowserStoragePersistence'
import { uiPrefsStorageKey } from '../store/uiPrefsPersistence'
import { workspaceLayoutStorageKey } from './workspacePersistence'

type StorageLike = {
  getItem: (key: string) => string | null
}

type StorageManagerLike = {
  estimate: () => Promise<{ usage?: number; quota?: number }>
}

export type HomePageStorageBucketDefinition = {
  id: string
  label: string
  storageKey: string
  ownerSeam: string
  folderPath?: string
  localLibraryFolderPath?: string
}

export type HomePageStorageBucketSnapshot = HomePageStorageBucketDefinition & {
  present: boolean
  approximateBytes: number
  approximateSizeLabel: string
}

export type HomePageOriginStorageEstimate = {
  state: 'available' | 'unsupported' | 'unavailable'
  message: string
  usageBytes: number | null
  quotaBytes: number | null
}

export const homePageGraphDocumentPersistenceNote =
  'Graph browser-storage is owned by graphBrowserStoragePersistence.ts; graphDocumentPersistence.ts remains file IO only.'

export const homePageRecentItemsPersistenceNote =
  'Recent items browser-storage is owned by recentItemsPersistence.ts; Home Page only exposes the policy.'

export const homePageStorageBucketDefinitions: HomePageStorageBucketDefinition[] = [
  {
    id: 'workspace-layout',
    label: 'Workspace layout',
    storageKey: workspaceLayoutStorageKey,
    ownerSeam: 'workspacePersistence.ts',
  },
  {
    id: 'ui-prefs',
    label: 'UI preferences',
    storageKey: uiPrefsStorageKey,
    ownerSeam: 'uiPrefsPersistence.ts',
  },
  {
    id: 'dashboard',
    label: 'Dashboard widgets',
    storageKey: dashboardStorageKey,
    ownerSeam: 'dashboardPersistence.ts',
  },
  {
    id: 'notepad',
    label: 'Notepad notes',
    storageKey: notepadStorageKey,
    ownerSeam: 'notepadPersistence.ts',
  },
  {
    id: 'graph-working-set',
    label: 'Graph working set',
    storageKey: graphBrowserStorageSnapshotKey,
    ownerSeam: 'graphBrowserStoragePersistence.ts',
  },
  {
    id: recentItemsStorageBucketDescriptor.id,
    label: recentItemsStorageBucketDescriptor.label,
    storageKey: recentItemsStorageBucketDescriptor.storageKey,
    ownerSeam: 'recentItemsPersistence.ts',
  },
  {
    id: pubPartsDownloadsStorageBucketDescriptor.id,
    label: pubPartsDownloadsStorageBucketDescriptor.label,
    storageKey: pubPartsDownloadsStorageBucketDescriptor.storageKey,
    ownerSeam: pubPartsDownloadsStorageBucketDescriptor.ownerSeam,
    folderPath: pubPartsDownloadsStorageBucketDescriptor.folderPath,
    localLibraryFolderPath: pubPartsDownloadsStorageBucketDescriptor.localLibraryFolderPath,
  },
]

const byteCount = (value: string): number => {
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(value).length
  }
  return value.length
}

const measureLocalStorageEntryBytes = (storageKey: string, rawValue: string): number =>
  byteCount(storageKey) + byteCount(rawValue)

export const formatHomePageStorageBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B'
  }

  if (bytes < 1024) {
    return `${Math.round(bytes)} B`
  }

  const units = ['KiB', 'MiB', 'GiB', 'TiB']
  let size = bytes / 1024
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex += 1
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`
}

export const readHomePageStorageBuckets = (
  storage: StorageLike | null | undefined,
  _refreshToken = 0,
): HomePageStorageBucketSnapshot[] =>
  homePageStorageBucketDefinitions.map((definition) => {
    const rawValue = storage?.getItem(definition.storageKey) ?? null
    const approximateBytes = rawValue === null ? 0 : measureLocalStorageEntryBytes(definition.storageKey, rawValue)
    return {
      ...definition,
      present: rawValue !== null,
      approximateBytes,
      approximateSizeLabel: formatHomePageStorageBytes(approximateBytes),
    }
  })

export const readHomePageOriginStorageEstimate = async (
  storageManager: StorageManagerLike | null | undefined,
): Promise<HomePageOriginStorageEstimate> => {
  if (storageManager === undefined || storageManager === null) {
    return {
      state: 'unsupported',
      message: 'Unavailable in this browser.',
      usageBytes: null,
      quotaBytes: null,
    }
  }

  try {
    const estimate = await storageManager.estimate()
    const usageBytes =
      typeof estimate.usage === 'number' && Number.isFinite(estimate.usage)
        ? estimate.usage
        : null
    const quotaBytes =
      typeof estimate.quota === 'number' && Number.isFinite(estimate.quota)
        ? estimate.quota
        : null

    if (usageBytes !== null && quotaBytes !== null) {
      return {
        state: 'available',
        message: `${formatHomePageStorageBytes(usageBytes)} used of ${formatHomePageStorageBytes(quotaBytes)}`,
        usageBytes,
        quotaBytes,
      }
    }

    return {
      state: 'unavailable',
      message: 'Unavailable right now.',
      usageBytes,
      quotaBytes,
    }
  } catch {
    return {
      state: 'unavailable',
      message: 'Unavailable right now.',
      usageBytes: null,
      quotaBytes: null,
    }
  }
}
